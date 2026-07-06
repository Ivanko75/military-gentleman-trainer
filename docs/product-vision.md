# Product Vision — Military Gentleman Trainer

## 1. Vision & Mission

**Vision:** A returning trainee never skips a movement because he doesn't recognize its name, and never wonders whether he's been consistent — the proof is in front of him.

**Mission:** Turn Ivan's existing training knowledge base into one self-contained file that shows exercises as pictures, prints to paper, and quietly accumulates a record of every session.

**Founder's why:** Ivan authored a complete home-training plan but can't use it — the exercises are names, and he trains by sight. He works in HTML, so the fix is his to build: packaging, not knowledge.

**Core values:**
- **Recognition over vocabulary** — a picture he can act on beats a correct term he can't.
- **Paper is a first-class citizen** — the tool must work with the phone in another room.
- **Evidence he can trust** — a log that can vanish silently isn't evidence; it must be exportable.
- **Offline, always** — no signal, no account, no install; one file that just opens.
- **Respect the over-50 body** — safety cues and "reps in reserve" framing, never punishment.

## 2. User Research

**Primary persona — Ivan:** 51, 198 cm, ~13,600 steps/day. Returning to resistance training after ~2 years. Home-only with NEOLYMP bands + bodyweight. Recognizes movements by sight, not name. Wants to train from a printed sheet but keep a durable digital record. Trains 3–5×/week.

**Secondary personas:**
- Over-50 home trainees who own a plan but stall on unfamiliar exercise names.
- Travellers needing an offline, printable session sheet with no install.

**Jobs to be done:**
- When I open my plan, help me *understand* today's exercises so I can just do them.
- Because I've been off for 2 years, ease me in — show me *this week's* target so I don't overreach.
- When I train away from a screen, give me a clean sheet I can follow and tick.
- When I finish, let me record it in one tap so my consistency builds visible proof.
- In a few months, let me switch to a different plan without rebuilding the tool.
- When I switch devices or clear my browser, don't lose my history.

**Pain points:** Opaque names block use of owned content; no printout; no accumulating record; mid-session phone lookups break flow.

**Current alternatives:** Raw HTML knowledge base; MuscleWiki/YouTube lookups mid-session; notebook or nothing.

**Key assumptions to validate:**
1. **[HIGH]** AI-generated cards depict *anatomically correct, safe* form for each exercise. AI can render confidently-wrong movement — mitigated by a mandatory human **approval gate** before a card enters the library (validate against a known-good source).
2. **[MEDIUM]** The generation is consistent enough (same figure/style, honored blue/grey encoding) across ~24 cards to feel like one coherent set — may need a fixed reference image or style seed.
3. **[MEDIUM]** `localStorage` + export is durable enough to be trusted as evidence.
4. **[MEDIUM]** Colour cards print cleanly on A4 (no mid-exercise page splits) and the `images/` folder stays a manageable size while offline.

**User journey map:** Open file → land on "Today" → pick session → scan visual cards → (print sheet **or** train from screen) → tap sets done → see session logged and week count tick up → periodically export the log as backup.

## 3. Product Strategy

**Product principles:**
- Every exercise is a picture first, a name second.
- One tap to log; zero friction or it won't happen mid-workout.
- Nothing leaves the device; nothing requires a network.
- The printout must look like a field manual, not a web dump.

**Market differentiation:** Premium, beginner-safe instructional cards for his own routine — offline, printable, history-keeping — versus generic libraries that don't know his sessions.

**Magic moment design:** Achievable in MVP — open the app, understand today's exercises from the cards in ~3 seconds, tap done, and next session the history has grown.

**MVP definition — in scope:**
- Author-time **card generation pipeline**: a Node script that reads each exercise's parameters + the master prompt (`docs/exercise-card-prompt.md`), calls the OpenAI Images API (`gpt-image-1`), and saves approved cards to `images/`.
- **One data-driven plan** — the KB "Foundation Plan v1" with four sessions (Warm-up, Mobility, Strength A, Strength B) built strictly from KB exercises. The plan is a data object, so a second plan can be added later without a rebuild (multi-plan *authoring* is out of MVP; the *structure* is in).
- **Progression display** — from the KB 8-week ramp, the tool shows this week's target sets/reps (based on a plan start date) so it eases Ivan in.
- Trainer app (`trainer.html` + `images/`) that displays the AI cards; each card carries its own start/movement/end, muscle highlight, mistake/correct, and cues.
- Print-to-A4 colour session sheet with checkboxes.
- Tap-to-log to `localStorage`; a visible history list + "this week" count.
- Export/import the log as JSON.

**Explicitly out of scope (MVP):** AI plan generation (no auto-created plans); a UI to author/manage multiple plans (MVP ships one plan, structured so more can be added later); progress charts/graphs; monthly assessment view; multi-user; cloud sync; any runtime backend; on-demand/in-app card generation (author-time only); any exercise not in the knowledge base.

**Feature priority (MoSCoW):**
- **Must:** AI cards for the KB Foundation Plan, the four sessions, print sheet, tap-to-log, export/import, generation pipeline + approval gate.
- **Should:** 8-week progression "this week's target", "this week" count, per-exercise QR video links, session notes field.
- **Could:** A plan-swap UI (select among several saved plans), progress charts, monthly self-assessment.
- **Won't (now):** AI plan generation, cloud sync, accounts, reminders/notifications, native app, any non-KB exercise.

**Core user flows:** (1) Recognize & train from screen. (2) Print & train from paper. (3) Log a completed session. (4) Export/import the record.

**Success metrics:** Trains from the tool 3–5×/week across an 8-week block; log exported at least once; every exercise in the four sessions recognizable from its diagram without the label.

**Risks:** AI card correctness/safety (highest — mitigated by the approval gate + validating against a known-good source); cross-card consistency (mitigated by a reference image/seed); localStorage loss (mitigated by export); colour-print layout + `images/` folder size (mitigated by print stylesheet + image optimization).

## 4. Brand Strategy

**Positioning statement:** For a returning over-50 home trainee who can't use a plan written in exercise jargon, Military Gentleman Trainer is a single offline file that shows the movements, prints the session, and keeps the record — unlike exercise libraries that don't know your routine or track your consistency.

**Brand personality:** Calm field manual. The "military gentleman" — steady, plain-spoken, safety-first.

**Voice & tone guide:**
- **DO:** "Sit back, knees follow toes, stand tall." / "Session logged. That's 3 this week." / "Pain is a stop signal."
- **DON'T:** Drill-sergeant shame ("no excuses, push harder"), jargon without a picture, hype.

**Messaging framework:** Recognize it → do it → prove you did.

**Elevator pitches:**
- **5s:** "My training plan, as pictures I can print and tick off."
- **30s:** "One HTML file that turns my exercise plan into cards I recognize by sight, prints a clean session sheet, and logs every workout so my consistency builds up — all offline, no app."
- **2min:** *(expands on the recognition problem, the paper requirement, and the trustworthy-evidence need — see Purpose and User Research above.)*

**Competitive differentiation narrative:** Exercise libraries teach movements in the abstract. This tool is *his* plan — the four sessions he'll actually do — made recognizable, printable, and self-documenting, working with no signal in a hotel room.

> Visual design tokens (colors, typography, spacing, components) live in `docs/design.md` — style: **Field Manual (calm)**, light/print-first, system fonts (offline-safe), navy `#0f172a` + one blue accent `#2563eb`. The exercise-card visual language and its generation prompt live in `docs/exercise-card-prompt.md` (the cards reuse the same palette/encoding).
