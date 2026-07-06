# Military Gentleman Trainer

A personal, offline home-training app for Ivan (51, 198 cm) — returning to resistance-band + bodyweight training after a break. It turns his training knowledge base into premium, AI-generated instructional exercise cards, prints A4 session sheets, and logs workouts as accumulating evidence.

> Status: **planning complete, build not started.** This repo currently holds the plan (`docs/`) and the source knowledge base. The app (`trainer.html` + `images/`) is built in phases per the roadmap.

## What it will be
- **`trainer.html` + `images/`** — a fully **offline**, server-free app (copy the folder to any device). No account, no network at training time.
- **Exercise cards** — AI-generated (OpenAI Images API, author-time only) from the master prompt; each card shows start→movement→end, muscle highlight, common-mistake/correct, and safety cues. Cards cover **only** knowledge-base exercises.
- **Plans** — data-driven and swappable. Ships the KB **Foundation Plan v1** (Warm-up, Mobility, Strength A, Strength B) with the 8-week build-up ramp (shows "this week's target"). More plans can be added later without a rebuild.
- **Logging** — tap-to-log to `localStorage`, history, JSON export/import.

## Two-phase model (important)
- **Author-time (occasional, online):** `scripts/generate-cards.mjs` calls the OpenAI Images API to generate cards. Needs `OPENAI_API_KEY` (platform API — **not** covered by ChatGPT Plus).
- **Runtime (every workout, offline):** `trainer.html` just displays the pre-generated images. Zero network calls.

## Security
- **Never commit secrets.** `OPENAI_API_KEY` lives only in `.env` (git-ignored). `.env.example` shows the shape.
- The runtime makes no external requests and stores only self-entered workout logs, on-device.

## Docs (the plan)
| File | What |
|---|---|
| `docs/product-idea.md` | The idea |
| `docs/validation-report.md` | Validation (verdict: Strong) |
| `docs/VISION.md` | Vision intake |
| `docs/product-vision.md` | Strategy, audience, brand |
| `docs/prd.md` | Technical spec |
| `docs/product-roadmap.md` | Phased build plan (checkboxes) |
| `docs/design.md` | Design system (Field Manual style) |
| `docs/exercise-card-prompt.md` | Master image-generation prompt + samples |

## Source
`military_gentleman_knowledge_base.html` — the original training knowledge base everything is built from.
