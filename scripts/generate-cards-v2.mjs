#!/usr/bin/env node
/*
  Card generation v2 — Ivan's verbatim prompts (2026-07-07).

  Ivan rendered band-chest-press and band-row himself from his own prompts
  and set them as the quality AND character reference. This runner sends his
  prompts UNCHANGED (scripts/prompts-ivan.mjs) to the images/edits endpoint,
  passing his two cards as reference inputs so every card shows the same guy
  in the same style. No prompt assembly, no checklist appendix.

  Usage:
    node scripts/generate-cards-v2.mjs                 # all exercises missing a PNG
    node scripts/generate-cards-v2.mjs --id cat-cow    # one exercise
    node scripts/generate-cards-v2.mjs --id cat-cow --force
    node scripts/generate-cards-v2.mjs --dry-run

  Existing PNGs are archived to images/_attempts/<id>.<n>.png before being
  overwritten (same rule as v1). Runtime never calls the network.
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IVAN_PROMPTS } from "./prompts-ivan.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = path.join(ROOT, "images");
const ATTEMPTS_DIR = path.join(IMAGES_DIR, "_attempts");
const MODEL = "gpt-image-1";
const SIZE = "1024x1024";
const QUALITY = "high";
const WEBP_WIDTH = 640;

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const DRY = flag("--dry-run");
const FORCE = flag("--force");
const ONLY_ID = opt("--id");

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();
const KEY = process.env.OPENAI_API_KEY;
if (!KEY && !DRY) {
  console.error("OPENAI_API_KEY missing — put it in .env");
  process.exit(1);
}

// Ivan's approved cards — the character/style anchor for every generation.
const CHARACTER_REFS = [
  path.join(IMAGES_DIR, "band-chest-press.png"),
  path.join(IMAGES_DIR, "band-row.png"),
];

async function callEdits(prompt, imagePaths) {
  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", prompt);
  form.append("size", SIZE);
  form.append("quality", QUALITY);
  form.append("n", "1");
  for (const p of imagePaths) {
    form.append("image[]", new Blob([fs.readFileSync(p)], { type: "image/png" }), path.basename(p));
  }
  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 400)}`);
  return res.json();
}

function archiveExisting(id) {
  const pngPath = path.join(IMAGES_DIR, `${id}.png`);
  if (!fs.existsSync(pngPath)) return;
  fs.mkdirSync(ATTEMPTS_DIR, { recursive: true });
  let n = 1;
  while (fs.existsSync(path.join(ATTEMPTS_DIR, `${id}.${n}.png`))) n++;
  fs.copyFileSync(pngPath, path.join(ATTEMPTS_DIR, `${id}.${n}.png`));
}

async function writeOutputs(id, b64) {
  archiveExisting(id);
  const png = Buffer.from(b64, "base64");
  const pngPath = path.join(IMAGES_DIR, `${id}.png`);
  const webpPath = path.join(IMAGES_DIR, `${id}.webp`);
  fs.writeFileSync(pngPath, png);
  const { default: sharp } = await import("sharp");
  await sharp(png).resize(WEBP_WIDTH).webp({ quality: 82 }).toFile(webpPath);
  console.log(`  wrote ${path.relative(ROOT, pngPath)} + webp`);
}

const ids = ONLY_ID ? [ONLY_ID] : Object.keys(IVAN_PROMPTS);
for (const id of ids) {
  const prompt = IVAN_PROMPTS[id];
  if (!prompt) { console.error(`No prompt for id "${id}"`); process.exit(1); }
  const pngPath = path.join(IMAGES_DIR, `${id}.png`);
  if (!FORCE && !ONLY_ID && fs.existsSync(pngPath)) { console.log(`skip ${id} (png exists)`); continue; }
  if (ONLY_ID && !FORCE && fs.existsSync(pngPath)) { console.log(`skip ${id} (png exists — use --force)`); continue; }
  if (DRY) { console.log(`--- ${id} ---\n${prompt.slice(0, 200)}…\n`); continue; }
  console.log(`generate ${id} …`);
  let json;
  try {
    json = await callEdits(prompt, CHARACTER_REFS);
  } catch (e) {
    console.error(`  retry after error: ${e.message}`);
    json = await callEdits(prompt, CHARACTER_REFS);
  }
  await writeOutputs(id, json.data[0].b64_json);
  if (json.usage) console.log(`  usage: ${JSON.stringify(json.usage)}`);
}
console.log("done");
