# Validation Report — Military Gentleman Trainer (visual training dashboard)

_Generated: 2026-07-06_

## Verdict
**Strong — proceed to build.**

The problem is real (Ivan is blocked from using content he already owns because he doesn't recognize exercises by name), the user is himself (named, reachable, committed), and the founder fit is ideal (he authored the content and works in HTML). The one risk that can still sink it is narrow and cheap: whether auto-generated line diagrams are actually recognizable. Test that in isolation before the full build.

## Scorecard
_(Personal-tool axes — the commercial "will strangers pay" test does not apply to a tool built for the founder's own use.)_

| Area | Score | Read |
|---|---:|---|
| Pain intensity | 5/5 | Blocked from using content he already owns; every session, 3–5×/week. |
| Buyer clarity | 5/5 | The user is Ivan — named, reachable, committed. |
| Urgency | 4/5 | Mid-return-to-training now; the tool unblocks this week. |
| Differentiation | 4/5 | Not better diagrams than MuscleWiki — but his own, offline, routine-aware, printable. |
| Speed to validate | 4/5 | The make-or-break risk (diagrams) is testable in an hour, before building. |
| Founder advantage | 5/5 | Authored the content, lives in self-contained HTML. Perfect fit. |

## Core Assumption
A generated line diagram + QR is enough for Ivan to correctly recognize and perform each exercise from a printed sheet — without a coach and without needing the exercise name he doesn't know.

## Fatal Flaws
| Risk | Severity | Why It Matters | Fast Test |
|---|---|---|---|
| Auto-generated SVG line diagrams may be unrecognizable | High | This is the entire reason the tool exists; a diagram he can't decode returns him to square one, and good exercise diagrams are hard to auto-generate. | Generate diagrams for the 3 hardest exercises (Face Pull, RDL, Dead Bug); he names the movement without the label. |
| `localStorage` "evidence" can vanish silently | Medium | He explicitly wants accumulating proof; cache-clear / private mode / device switch wipes it unnoticed. | Build download-your-log export in v1; log 2 sessions, export, clear browser, re-import. |
| Print-to-PDF layout breaks (page splits, unscannable QR) | Medium | If the printout is ugly or splits an exercise across pages, the paper-first requirement dies. | Print one session to PDF day one; check page breaks and scan a QR off the paper. |

## Problem Reality
- **Pain:** Real, specific, recurring — a knowledge base he cannot use because names are opaque, and no growing record. Every session, 3–5×/week.
- **Early adopter:** Ivan himself — named, reachable, motivated, 6+ months into the habit change.
- **Vitamin or painkiller:** Painkiller for the recognition problem (he's blocked without it); vitamin for the evidence/motivation problem. The painkiller half justifies the build.

## Competition
- **Current behavior:** Squint at the raw HTML, fail to recognize names, look each up on MuscleWiki/YouTube mid-session or skip it; track nothing or scribble in a notebook.
- **Real enemy:** Friction and forgetting — not a rival app. The tool wins only if opening it beats a Google image search and logging is one tap.
- **Differentiation needed:** Everything in one offline file that knows *his* routine, prints *his* session, logs *his* history — works with no signal in a hotel room. MuscleWiki has better diagrams but none of that.

## First 10 Customers
_(Adapted — personal tool. "Customers" = getting it into his real training week to prove it works.)_
1. **Diagram gut-check** — generate the 3 hardest exercise diagrams; success = he names the movement without the label.
2. **One printed session** — print Strength A to PDF, train from paper only; success = completes it without reaching for the phone.
3. **Three-session log test** — log 3 sessions over the week, then export; success = the record feels like real evidence and the export opens.

## MVP
- **Build:** Diagram test first (3 exercises). Then one HTML file: visual cards (SVG diagram + QR) for the warm-up, mobility, and Strength A/B sessions already defined in the knowledge base; tap-to-log with `localStorage` history; download-your-log export; print-to-PDF sheet.
- **Cut:** 12-month roadmap, monthly assessment charts/graphs, all 11 library exercises at once (start with the two Strength sessions + warm-up), fancy analytics. Add after the core loop is proven.
- **2-week test:** Use it for a full week of real sessions (paper + logging), export the log, confirm diagrams were recognizable and history survived. If diagrams fail → pivot visuals to curated MuscleWiki/Darebee video-via-QR + text cues, not the whole idea.

## Edits Applied to product-idea.md
- **Proposed solution** — added a validated "build order": diagram gut-check (3 hardest exercises) before the full build, with a named fallback if diagrams fail.
- **Risky assumptions** — replaced with the three severity-ranked assumptions from this report and a validation-date note.
- `Candidates considered` section preserved unchanged.

## Next Step
Run the diagram gut-check, then build v1 — or run the **Product Planner** skill to turn this into a full build plan first. The idea doc is sharpened and ready either way.
