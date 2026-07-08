# CLAUDE.md — Military Gentleman Trainer

Before any card generation, image work, or review round: **read `LEARNINGS.txt`** (repo root). It records the measured pipeline facts and the mistakes already made once — do not repeat them.

## Hard rules (details in LEARNINGS.txt § A)

- Prompts in `scripts/prompts-ivan.mjs` are verbatim Ivan's — never edit them.
- Every generation goes through `images/edits` with `band-chest-press.png` + `band-row.png` as reference inputs; confirm this before any paid batch.
- Archive existing PNGs to `images/_attempts/` before overwrite.
- `trainer.html` makes zero network calls; `OPENAI_API_KEY` only in `.env`.
- Max one API retry per garbled card; the fix path is Ivan re-rendering in ChatGPT (LEARNINGS.txt § B2).
- Pre-review generated artifacts first; bring Ivan one consolidated verdict.

## Pointers

- Backlog & open items: `docs/product-roadmap.md` § Backlog
- Card prompt history: `docs/exercise-card-prompt.md`

## Mistakes log

- **2026-07-07** — Ran the first paid generation batch on the plain generations endpoint without character references; every card showed a different figure and the whole batch was redone. **Do:** verify endpoint + reference inputs before starting any paid batch.
- **2026-07-08** — Re-rolled all garbled cards a second round; garbles moved instead of disappearing and 4 cards got worse. **Do:** stop after one retry; route text fixes through Ivan's ChatGPT re-render.
