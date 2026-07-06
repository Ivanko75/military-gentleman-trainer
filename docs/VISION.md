# Vision — Military Gentleman Trainer

> Captured by the Product Planner skill. This file is the source of truth for
> generating product-vision.md, prd.md, and product-roadmap.md. Edit it directly
> and re-run the Product Planner to regenerate downstream documents.

**Created:** 2026-07-06
**Updated:** 2026-07-06 (revised: exercise visuals switched from hand-authored SVG to AI-generated cards — see docs/exercise-card-prompt.md)

## Founder

- **Name:** Ivan
- **Expertise:** Returning home-trainee (51, 198 cm) with a strong walking baseline (~13,600 steps/day) and a self-authored training knowledge base. Not a coach — the domain content is already written; the gap is packaging and tracking.
- **Background:** Built `military_gentleman_knowledge_base.html` — a structured plan for home resistance-band + bodyweight training after a ~2-year break — but can't use it in practice because exercises are listed by name and he recognizes movements by sight, not label. Wants to train from paper and build a growing record of consistency.

## Purpose

- **Who you help:** Himself — and, by extension, any over-50 home trainee who owns a plan but is blocked by opaque exercise names and has no simple way to print a session or track consistency.
- **Problem you solve:** A knowledge base full of exercise *names* he can't recognize, no way to print a session to train from phone-free, and no accumulating proof he showed up.
- **Desired transformation:** Before → squints at an unusable HTML doc, looks exercises up mid-session or skips them, tracks nothing. After → opens one file, sees today's session as pictures he recognizes, prints it or logs it in one tap, and watches a record of workouts stack up.
- **Why you:** He authored all the content and works natively in self-contained HTML — this is a packaging + tracking problem, not a knowledge problem.

## Product

- **Name:** Military Gentleman Trainer
- **One-liner:** A single self-contained HTML file that turns Ivan's training knowledge base into a visual workout dashboard he can recognize by sight, print to A4, and log into a growing record of evidence.
- **How it works:** Open the app → pick today's session (Warm-up, Mobility, Strength A, or Strength B, already defined in the knowledge base) → each exercise shows as an AI-generated instructional card (soft-3D figure with start/movement/end, muscle highlight, mistake/correct, cues) → train from screen or print a clean A4 colour sheet with checkboxes → tap sets done to log the session → history saves to the device and can be exported as a backup file. The cards are generated occasionally at author-time (OpenAI Images API) and stored as PNGs; training itself is fully offline.
- **Key capabilities:**
  - AI-generated instructional exercise cards (soft-3D figure, start→movement→end, muscle highlight, common-mistake/correct inset, safety cues) — generated occasionally at author-time via the OpenAI Images API, displayed offline. Cards cover only the exercises in Ivan's knowledge base — nothing invented.
  - Data-driven, swappable training **plans**: MVP ships the KB "Foundation Plan v1" (Warm-up, Mobility, Strength A, Strength B); more plans can be added later (e.g. quarterly) without a rebuild.
  - **8-week build-up progression** from the KB — the tool shows this week's target sets/reps so it eases a returning trainee in safely.
  - Print-to-A4 colour session sheets with checkboxes for phone-free training.
  - Tap-to-log completed workouts to `localStorage` (accumulating evidence), with JSON export/import so history is never trapped or lost.
- **Platform:** web
- **Market differentiation:** Premium, beginner-safe instructional cards for *his own* routine — offline, routine-aware, printable, and history-keeping, running from a plain folder with no signal, account, or install required at training time.
- **Magic moment:** Open the app → see today's session as clear instructional cards he understands in ~3 seconds → tap sets done (or print the sheet) → next session, the history is still there and has grown.

## Audience

- **Primary user:** Ivan — 51, 198 cm, returning to training after ~2 years, home-only with NEOLYMP bands + bodyweight, over-50 joint-safety constraints, recognizes movements by picture not name, wants paper at the point of use but a durable digital record. Trains 3–5×/week.
- **Secondary users:**
  - Over-50 home trainees who own a plan but are blocked by unfamiliar exercise names
  - Travellers who need an offline, no-install session sheet they can print anywhere
- **Current alternatives:** Squint at the raw HTML knowledge base; look each exercise up on MuscleWiki/YouTube mid-session; track nothing or scribble in a notebook.
- **Frustrations:** MuscleWiki has good diagrams but doesn't know his routine, doesn't print his session, and doesn't log his history. Nothing ties recognition + printout + evidence together in one offline artifact.

## Business

- **Revenue model:** free
- **90-day goal:** Ivan trains from the KB Foundation Plan 3–5×/week through the full 8-week build-up ramp, guided by the this-week target, with a workout log he trusts and has exported at least once.
- **6-month vision:** Ready to swap in a second plan (e.g. a Q2 progression from an updated knowledge base) without a rebuild; a monthly progress/assessment view; optionally shared with a friend or two.
- **Constraints:** Training runtime must be offline and server-free — a plain `trainer.html` + `images/` folder, no account, no internet at the point of use. Exercise cards are generated occasionally at author-time via the OpenAI Images API (needs an API key + a few dollars), then stored as PNGs and displayed offline. Personal project, built in Claude Code.
- **Go-to-market:** None — personal use. Distribution is copying the HTML file to his devices (and optionally sending it to a friend).

## Brand Voice

- **Personality:** Calm field manual. Disciplined but not a drill sergeant — the "military gentleman": steady, plain-spoken, safety-first, respectful of an over-50 body.
- **Tone of voice:** Clear, brief, encouraging. Coaching cues in plain language ("sit back, knees follow toes"). Safety framed as a stop signal, never shame. Example done-state: "Session logged. That's 3 this week." Example empty-state: "No workouts yet — pick a session to begin."

> Visual identity (mood, anti-patterns, design tokens) is deliberately not
> captured here — it lives in docs/design.md, generated by the Design System
> skill from image references.

## Tech Stack

- **App type:** web
- **Frontend:** Vanilla HTML + CSS + JavaScript — `trainer.html` plus an `images/` folder of PNG cards. Offline, no build step, no framework at runtime.
- **Backend:** None at runtime. A small **author-time generation script** (Node) calls the OpenAI Images API to produce the exercise cards; it is not part of the running app.
- **Card generation:** OpenAI Images API — model `gpt-image-1`, square output — driven by the master prompt in `docs/exercise-card-prompt.md`. Author-time only; run occasionally; each card human-approved before use.
- **Database:** None — on-device `localStorage` only, with JSON export/import for backup and portability.
- **Auth:** None — single-user personal tool on his own device.
- **Payments:** None for the app. Generation incurs a small OpenAI API cost (a few dollars per full card set).
- **Analytics:** None — no tracking; the training runtime makes no external calls.
- **Email:** None — no accounts or notifications.
- **Error tracking:** None — offline app; runtime errors surface in the browser console, generation errors in the script log.

## Tooling

- **Coding agent:** Claude Code
