# Product Idea — Military Gentleman Trainer (visual training dashboard)

## One-liner
A single self-contained HTML file that turns Ivan's training knowledge base into a *visual* workout dashboard he can recognize by sight, print to an A4 PDF to train from phone-free, and log each session into a growing record of evidence.

## Background
Ivan (51, 198 cm) is returning to structured resistance-band and bodyweight training at home after a ~2-year break, guided by a knowledge base he already authored (`military_gentleman_knowledge_base.html`). The content — warm-up, mobility, and an 11-exercise library — already exists. The gap is packaging and tracking: he doesn't recognize exercises by name, can't print a session to train from, and has no accumulating proof he showed up.

## The problem
Ivan opens a knowledge base full of exercise *names* ("Band Face Pull", "Band Romanian Deadlift") that mean nothing until he sees the movement. He wants to train from a printed sheet, away from the phone, at home or travelling. And he wants a record that builds up over weeks — evidence of consistency — added in small increments, not a one-time document.

## Target user
Ivan himself: 51, 198 cm, ~13,600 steps/day, home-only training with NEOLYMP bands + bodyweight, over-50 joint-safety constraints, recognizes movements by picture not name, wants paper at the point of use but a durable digital history.

## Proposed solution
One self-contained HTML file (matching his existing knowledge-base format — no server, no app store, no account, travels anywhere) that:
- Shows each exercise as a **visual card**: a generated SVG line diagram for at-a-glance recognition **plus** a QR code linking to one demo video from his Free Resource Map.
- Lets him assemble/see **today's session** (Strength A, Strength B, Warm-up, Mobility) from the routine already defined in the knowledge base.
- **Prints to a clean A4 PDF** via the browser (Print → Save as PDF) with pictures + checkboxes so he can tick on paper.
- **Logs completed sessions to `localStorage`** so evidence accumulates every time he taps "done" — with an export/backup so the record is trustworthy.

**Magic moment:** open the file → see today's session as visual cards → tap sets done (or print the sheet) → next session, the history is still there and has grown.

**Build order (validated):** Step 0 is a diagram gut-check — generate the 3 hardest-to-picture exercises (Face Pull, RDL, Dead Bug) and confirm Ivan can recognize the movement without the label *before* building the full tool. If the diagrams don't land, switch the visual approach (curated MuscleWiki/Darebee video via QR + text cue) rather than the whole idea.

## Why you
Ivan already authored all the content and works natively in self-contained HTML — this is a packaging + tracking problem, not a knowledge problem, so he's uniquely positioned to get a useful v1 in days.

## Candidates considered

| # | Direction | Unfair advantage | Solves "don't know names" | Print-to-PDF | Builds evidence | v1 feasible |
|---|---|---|---|---|---|---|
| 1 ⭐ | Visual Trainer + Log (one self-contained HTML file) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 |
| 2 | Printable Field Manual + Tick-Sheets | 🟢 | 🟢 | 🟢 | 🟡 (paper only) | 🟢 |
| 3 | Visual Exercise Deck (one exercise per page + QR) | 🟢 | 🟢 | 🟢 | 🔴 | 🟡 |
| 4 | Progress Evidence Journal (logging/charts only) | 🟡 | 🔴 | 🟢 | 🟢 | 🟢 |

**Chosen:** Candidate 1 — the only option that satisfies all three needs (visual recognition, printable PDF, accumulating evidence) in a single artifact that fits his existing HTML world.

**Decisions locked:** Logging = digital + printable (tap to save history, also print blank sheets). Visuals = both (SVG line diagram for recognition + QR code for video demo).

## Risky assumptions
_(Validated 2026-07-06 — see `docs/validation-report.md`. Verdict: Strong, proceed to build. Ranked by severity.)_
1. **[HIGH — the make-or-break]** Auto-generated SVG line diagrams are recognizable enough that Ivan can name and perform each movement from paper without the label. Mitigation: test 3 hardest diagrams *before* full build.
2. **[MEDIUM]** `localStorage` is durable enough to be trusted as "evidence" — requires an export/backup (download-your-log) built into v1, not deferred.
3. **[MEDIUM]** Browser Print-to-PDF reliably produces a clean A4 sheet (no mid-exercise page splits, scannable QR) without manual fiddling.

## Next step
Pressure-test this idea with the **Idea Validator** skill before planning, or run the **Product Planner** skill to turn it straight into a product vision, PRD, and roadmap. This document will pre-fill much of that work.
