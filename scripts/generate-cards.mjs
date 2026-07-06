#!/usr/bin/env node
/*
  Military Gentleman Trainer — author-time card generation (FR-011/012/013).
  Fills the master prompt (docs/exercise-card-prompt.md) per exercise, calls
  the OpenAI Images API (gpt-image-1, square), and writes two files per card:
    images/<id>.png   — hi-res master, used for A4 print
    images/<id>.webp  — downscaled screen version, used by trainer.html

  This script is the ONLY place the OpenAI API is called. The runtime
  (trainer.html) never touches the network.

  Usage:
    node scripts/generate-cards.mjs --reference      # generate the canonical figure (TASK-005)
    node scripts/generate-cards.mjs                  # all exercises missing a PNG
    node scripts/generate-cards.mjs --id band-row    # one exercise (FR-013)
    node scripts/generate-cards.mjs --id band-row --force   # regenerate even if files exist
    node scripts/generate-cards.mjs --dry-run        # print prompts, no API calls, no cost

  Rules encoded here (docs/exercise-card-prompt.md):
  - One exercise per request. Never batched.
  - Every card request passes images/_reference-figure.png as a reference
    input so figure/style stay uniform. The reference must be approved first.
  - Retry once on failure; log usage; leave existing approved files untouched
    on failure.
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = path.join(ROOT, "images");
const REFERENCE = path.join(IMAGES_DIR, "_reference-figure.png");
const MODEL = "gpt-image-1";
const SIZE = "1024x1024";
const QUALITY = "high";
const WEBP_WIDTH = 640;

// ── args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const DRY = flag("--dry-run");
const FORCE = flag("--force");
const ONLY_ID = opt("--id");
const REF_MODE = flag("--reference");
// --no-ref: skip the reference-image anchor (plain generation). Useful for
// floor exercises where the standing reference fights the composition.
const NO_REF = flag("--no-ref");

// ── .env (no dependency needed) ─────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();
const KEY = process.env.OPENAI_API_KEY;
if (!KEY && !DRY) {
  console.error("Missing OPENAI_API_KEY. Copy .env.example to .env and add your platform API key.");
  process.exit(1);
}

// ── exercise library (same file the runtime uses; classic script → eval scope) ──
function loadExercises() {
  const src = fs.readFileSync(path.join(ROOT, "exercises.js"), "utf8");
  return new Function(`${src}; return MGT_EXERCISES;`)();
}

// ── prompts ─────────────────────────────────────────────────────────────
const FIGURE = `Depict a soft 3D instructional male figure with: a generic but realistic face; normal body composition; tall male proportions, approximately 198 cm / 6'6"; long legs, long arms, broad shoulders, realistic torso proportions; adult male body, not overly muscular, not cartoonish, not bodybuilder-like; neutral, calm, beginner-friendly expression.`;

const PALETTE = `Use these exact visual standards: moving/active limbs in blue #2563eb; held/support limbs in grey #94a3b8; torso/head in navy #0f172a; reference lines/hatch in #94a3b8 and #cbd5e1; panel fill white #ffffff, light border #e5e7eb; ground mat/floor plane #f1f5f9. Dual-channel encoding: colour = active vs held (blue = moving, grey = held); faded line treatment = far side. Motion arrows only on active limbs. Dashed reference lines for the most important alignment cue. Ground plane is mandatory for all floor exercises so the body clearly reads as on the floor.`;

const REFERENCE_PROMPT = `Create a square reference illustration of a single standing male figure for a home-exercise instruction card library. ${FIGURE} Soft 3D instructional illustration style: clean, modern, readable; simple but anatomically believable; easy to print; no exaggerated realism; not comic style; slightly polished healthcare / premium fitness guide look. Pure white background, no props, no text, no logos. Neutral relaxed standing pose, arms at the sides, facing slightly to the side. Torso and head in navy #0f172a with subtle soft shading. This figure is the canonical character reference for a whole card series — neutral, calm, beginner-friendly.`;

function viewText(ex) {
  if (ex.view === "side-ground-plane") return "a side or slightly elevated side view with a clear, visible ground plane so the figure clearly reads as on the floor";
  if (ex.view === "front") return "a front view; this is a floor exercise, so include a clear, visible ground plane";
  return "a side view";
}

function buildPrompt(ex) {
  // TEXT-FREE strategy (decision 2026-07-06): the image carries ONLY the
  // drawings; every word (title, cues, mistake, muscles) is rendered by the
  // app/print sheet from exercises.js, where spelling is always perfect.
  const frameReason = ex.frames === 1
    ? "Show ONE single large figure only — no sequence panels, no repeated figures, no strips"
    : ex.frames === 3
      ? "Because this is a contralateral alternating exercise, show 3 sequence panels in a clearly ordered layout"
      : "Show 2 sequence panels side by side (start position, then end position)";
  return [
    `Create a square instructional exercise illustration for the exercise "${ex.name}" for a personal home routine. It must teach the movement purely through pictures, understandable in about 3 seconds. Match the character and illustration style of the attached reference figure exactly.`,
    `ABSOLUTELY NO TEXT: no words, letters, numbers, labels, captions, titles or typography anywhere in the image. Communication is 100% visual — figures, arrows and colour only.`,
    `${FIGURE} Use a pure white background and a clean printable colour design; minimal professional fitness/physiotherapy illustration style; no clutter, no decorative scenery.`,
    `${frameReason}, separated by thin light panel borders, with clear visual progression and motion arrows between/inside panels. Use ${viewText(ex)}.`,
    `Main sequence — ${ex.sequence}`,
    PALETTE,
    `Muscle highlight: mark the working muscles (${ex.muscles}) with a soft, subtle warm glow on the body — gentle and translucent, never solid red patches.`,
    `Common-mistake inset: one small panel in a corner showing the typical error (${ex.commonMistake}) marked with a red X, next to the corrected posture (${ex.correct}) marked with a green check mark. The X and check are the ONLY symbols allowed — no letters.`,
    ex.promptNotes ? `Additional instructions for this illustration: ${ex.promptNotes}` : null,
    `One position per panel. Clarity over decoration. The illustration must remain clean, uncluttered, beginner-safe and professionally printable.`
  ].filter(Boolean).join("\n\n");
}

// ── OpenAI calls ────────────────────────────────────────────────────────
async function callGenerations(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, size: SIZE, quality: QUALITY, n: 1 })
  });
  if (!res.ok) throw new Error(`generations ${res.status}: ${await res.text()}`);
  return res.json();
}

async function callEditsWithReference(prompt) {
  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", prompt);
  form.append("size", SIZE);
  form.append("quality", QUALITY);
  form.append("image[]", new Blob([fs.readFileSync(REFERENCE)], { type: "image/png" }), "_reference-figure.png");
  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form
  });
  if (!res.ok) throw new Error(`edits ${res.status}: ${await res.text()}`);
  return res.json();
}

function logUsage(id, json) {
  const u = json.usage;
  if (u) console.log(`  usage[${id}]: input ${u.input_tokens ?? "?"} tokens, output ${u.output_tokens ?? "?"} tokens (check current gpt-image-1 pricing)`);
}

async function withRetry(label, fn) {
  try { return await fn(); }
  catch (e) {
    console.warn(`  ${label} failed (${e.message.slice(0, 200)}); retrying once…`);
    return fn();
  }
}

// ── outputs ─────────────────────────────────────────────────────────────
async function writeOutputs(id, b64) {
  const png = Buffer.from(b64, "base64");
  const pngPath = path.join(IMAGES_DIR, `${id}.png`);
  fs.writeFileSync(pngPath, png);
  const { default: sharp } = await import("sharp");
  const webpPath = path.join(IMAGES_DIR, `${id}.webp`);
  await sharp(png).resize(WEBP_WIDTH).webp({ quality: 82 }).toFile(webpPath);
  const kb = (p) => Math.round(fs.statSync(p).size / 1024);
  console.log(`  wrote ${path.relative(ROOT, pngPath)} (${kb(pngPath)} KB) + ${path.relative(ROOT, webpPath)} (${kb(webpPath)} KB)`);
}

// ── main ────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  if (REF_MODE) {
    console.log("Generating the canonical reference figure (TASK-005)…");
    if (DRY) { console.log(`\n${REFERENCE_PROMPT}\n`); return; }
    const json = await withRetry("reference", () => callGenerations(REFERENCE_PROMPT));
    fs.writeFileSync(REFERENCE, Buffer.from(json.data[0].b64_json, "base64"));
    logUsage("_reference-figure", json);
    console.log(`  wrote ${path.relative(ROOT, REFERENCE)} — review it; regenerate until approved. All cards inherit this figure.`);
    return;
  }

  const all = loadExercises();
  let targets = ONLY_ID ? all.filter((e) => e.id === ONLY_ID) : all;
  if (ONLY_ID && targets.length === 0) {
    console.error(`No exercise with id "${ONLY_ID}". Known ids:\n  ${all.map((e) => e.id).join("\n  ")}`);
    process.exit(1);
  }
  if (!FORCE) {
    const skipped = targets.filter((e) => fs.existsSync(path.join(IMAGES_DIR, `${e.id}.png`)));
    if (skipped.length) console.log(`Skipping ${skipped.length} existing card(s) (use --force to regenerate): ${skipped.map((e) => e.id).join(", ")}`);
    targets = targets.filter((e) => !fs.existsSync(path.join(IMAGES_DIR, `${e.id}.png`)));
  }
  if (targets.length === 0) { console.log("Nothing to generate."); return; }

  if (!DRY && !NO_REF && !fs.existsSync(REFERENCE)) {
    console.error("images/_reference-figure.png not found. Generate + approve it first:\n  node scripts/generate-cards.mjs --reference");
    process.exit(1);
  }

  console.log(`${DRY ? "[dry-run] " : ""}Generating ${targets.length} card(s), one request per exercise…`);
  let failures = 0;
  for (const ex of targets) {
    console.log(`\n■ ${ex.name} (${ex.id}) — ${ex.frames} frames, ${ex.view}`);
    const prompt = buildPrompt(ex);
    if (DRY) { console.log(`\n${prompt}\n`); continue; }
    try {
      const json = await withRetry(ex.id, () => NO_REF ? callGenerations(prompt) : callEditsWithReference(prompt));
      await writeOutputs(ex.id, json.data[0].b64_json);
      logUsage(ex.id, json);
      console.log(`  NOTE: card stays approved:false in exercises.js until reviewed against a known-good source.`);
    } catch (e) {
      failures++;
      console.error(`  FAILED ${ex.id}: ${e.message.slice(0, 300)}\n  Existing files for this exercise were left untouched.`);
    }
  }
  if (failures) { console.error(`\n${failures} card(s) failed.`); process.exit(1); }
  console.log(`\nDone. Next: human approval gate — review each card, then set approved:true in exercises.js.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
