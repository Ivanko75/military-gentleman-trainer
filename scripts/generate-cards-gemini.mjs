#!/usr/bin/env node
/*
  Card generation via Gemini "Nano Banana Pro" (gemini-3-pro-image), 2026-07-09.

  Sibling of generate-cards-v2.mjs, same contract (LEARNINGS.txt § A):
  - Ivan's prompts sent VERBATIM from scripts/prompts-ivan.mjs.
  - band-chest-press.png + band-row.png passed as reference images.
  - Existing PNGs archived to images/_attempts/<id>.<n>.png before overwrite.
  - Outputs: PNG master (2K) + 640px WebP. Runtime never calls the network.

  Why Gemini: gpt-image-1 garbled text on ~90% of cards (LEARNINGS.txt § B1);
  Nano Banana Pro is Google's model specifically strong at in-image text.

  Usage:
    node scripts/generate-cards-gemini.mjs --id dead-bug --force
    node scripts/generate-cards-gemini.mjs            # all missing PNGs
    node scripts/generate-cards-gemini.mjs --dry-run

  Needs GEMINI_API_KEY in .env.
*/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IVAN_PROMPTS } from "./prompts-ivan.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = path.join(ROOT, "images");
const ATTEMPTS_DIR = path.join(IMAGES_DIR, "_attempts");
const MODEL = "gemini-3-pro-image";
const IMAGE_SIZE = "2K";
const ASPECT = "1:1";
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
const KEY = process.env.GEMINI_API_KEY;
if (!KEY && !DRY) {
  console.error("GEMINI_API_KEY missing — put it in .env");
  process.exit(1);
}

// Ivan's approved cards — the character/style anchor for every generation.
const CHARACTER_REFS = [
  path.join(IMAGES_DIR, "band-chest-press.png"),
  path.join(IMAGES_DIR, "band-row.png"),
];

async function callGemini(prompt, imagePaths) {
  const parts = imagePaths.map((p) => ({
    inline_data: { mime_type: "image/png", data: fs.readFileSync(p).toString("base64") },
  }));
  parts.push({ text: prompt });
  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: ASPECT, imageSize: IMAGE_SIZE },
    },
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 600)}`);
  const json = await res.json();
  const outParts = json.candidates?.[0]?.content?.parts ?? [];
  const img = outParts.find((p) => p.inlineData?.data || p.inline_data?.data);
  if (!img) throw new Error(`No image in response: ${JSON.stringify(json).slice(0, 600)}`);
  return img.inlineData?.data ?? img.inline_data.data;
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
  const raw = Buffer.from(b64, "base64");
  const pngPath = path.join(IMAGES_DIR, `${id}.png`);
  const webpPath = path.join(IMAGES_DIR, `${id}.webp`);
  const { default: sharp } = await import("sharp");
  // Palette-compress the master like the existing library (LEARNINGS.txt § B5).
  await sharp(raw).png({ quality: 90, palette: true, compressionLevel: 9 }).toFile(pngPath);
  await sharp(raw).resize(WEBP_WIDTH).webp({ quality: 82 }).toFile(webpPath);
  console.log(`  wrote ${path.relative(ROOT, pngPath)} + webp`);
}

const ids = ONLY_ID ? [ONLY_ID] : Object.keys(IVAN_PROMPTS);
for (const id of ids) {
  const prompt = IVAN_PROMPTS[id];
  if (!prompt) { console.error(`No prompt for id "${id}"`); process.exit(1); }
  const pngPath = path.join(IMAGES_DIR, `${id}.png`);
  if (!FORCE && fs.existsSync(pngPath)) { console.log(`skip ${id} (png exists — use --force)`); continue; }
  if (DRY) { console.log(`--- ${id} ---\n${prompt.slice(0, 200)}…\n`); continue; }
  console.log(`generate ${id} …`);
  let b64;
  try {
    b64 = await callGemini(prompt, CHARACTER_REFS);
  } catch (e) {
    console.error(`  retry after error: ${e.message}`);
    b64 = await callGemini(prompt, CHARACTER_REFS);
  }
  await writeOutputs(id, b64);
}
console.log("done");
