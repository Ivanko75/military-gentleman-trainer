# Military Gentleman Trainer

A personal, offline home-training app for Ivan (51, 198 cm) — returning to resistance-band + bodyweight training after a break. It turns his training knowledge base into instructional exercise cards, prints A4 session sheets, and logs workouts as accumulating evidence.

> Status: **Phase 3 Habit Engine core shipped 2026-07-12** — "Today is..." scheduling (suggestion + 1-tap override), warm-up-first flow with the KB checklist, and the forgiveness nudge ("2+ strength sessions this week", never a streak). Deferred: monthly mobility self-assessment (~week 4, TASK-033). Now running the **2-week test**: the log measures scheduled-day hits, warm-ups, and overrides. Card library: Nano Banana Pro 2026-07-11 (2048px, 20/24 clean — defects in § Backlog BL-001). Still open from v1: cross-device check and QR video links.

## Using it
Open `trainer.html` in any browser — no server, no account, no network. To train on another device, copy `trainer.html` + `exercises.js` + `plan.js` + `images/` as a unit.

- **Sessions** — Foundation Plan v1: Warm-up, Mobility, Strength A, Strength B, with the KB 8-week ramp shown as "this week's target".
- **Today is...** — the KB weekly routine (Mon A · Tue mobility · Wed B · Thu mobility · Fri A · Sat mobility · Sun recovery) leads the Today view as a *suggestion*; every session stays one tap away. Strength sessions open with the 8 warm-up cards + KB completion checklist first (skippable — the log records which).
- **Cards** — each shows numbered movement frames, muscle "Works" panel, common-mistake ✗ / correct ✓, and safety cues. Known typos on some cards were accepted as-is (cleanup path: `LEARNINGS.txt` § B2).
- **Print** — "Print sheet" on a session view → A4 colour sheet from the PNG masters, one exercise per page, with date line and per-exercise checkboxes.
- **Logging** — tap exercises done → "Log session" → `localStorage` history with JSON export/import for backup and device moves.
- Deep link to a session: `trainer.html#session/<id>`.

## Two-phase model (important)
- **Author-time (occasional, online):** `scripts/generate-cards-gemini.mjs` (current) sends Ivan's verbatim prompts (`scripts/prompts-ivan.mjs` — never edit them) to Gemini `gemini-3-pro-image` ("Nano Banana Pro"), with `images/band-chest-press.png` + `images/band-row.png` as character references; 2048px output. Needs `GEMINI_API_KEY` in `.env`. Superseded: `generate-cards-v2.mjs` (OpenAI `images/edits`, `OPENAI_API_KEY`) and `generate-cards.mjs` (v1).
- **Runtime (every workout, offline):** `trainer.html` just displays the pre-generated images. Zero network calls.

## Before touching card generation
Read **`LEARNINGS.txt`** first — measured pipeline facts (API text garbling, non-converging re-rolls, mandatory character references) and the mistakes already paid for once. `CLAUDE.md` enforces this for coding agents.

## Security
- **Never commit secrets.** `OPENAI_API_KEY` lives only in `.env` (git-ignored). `.env.example` shows the shape.
- The runtime makes no external requests and stores only self-entered workout logs, on-device.

## Docs
| File | What |
|---|---|
| `docs/product-idea.md` | The idea |
| `docs/validation-report.md` | Validation (verdict: Strong) |
| `docs/VISION.md` | Vision intake |
| `docs/product-vision.md` | Strategy, audience, brand |
| `docs/prd.md` | Technical spec |
| `docs/product-roadmap.md` | Build plan + § Backlog (open items) |
| `docs/design.md` | Design system (Field Manual style) |
| `docs/exercise-card-prompt.md` | Card-prompt history; current pipeline noted at top |
| `LEARNINGS.txt` | Hard rules + pipeline learnings — read before card work |

## Source
`military_gentleman_knowledge_base.html` — the original training knowledge base everything is built from.
