# Validation Report — Habit Engine (Phase 3 of Military Gentleman Trainer)

_Generated: 2026-07-11. Supersedes the 2026-07-06 v1 report (preserved in git history — the v1 verdict was Strong and v1 shipped)._

## Verdict
**Strong — with one reshape.**

Ideas 1+2 (scheduling + warm-up-first) are the real Habit Engine: they test the core assumption and must land *before* the weeks 3–8 motivation dip, which is ~2 weeks away. Idea 4 survives only as a forgiveness-framed line inside the nudge (the KB's own "never skip twice" rule, not a streak counter), and idea 3 waits ~3 weeks until the first monthly self-assessment is naturally due. Risk to watch: any UI copy that reads as scolding.

## Scorecard
_(Personal-tool axes, as in the v1 report.)_

| Area | Score | Read |
|---|---:|---|
| Pain intensity | 3/5 | Mild today (weeks 1–2, enthusiasm high); real in weeks 3–8 — a painkiller-in-waiting. |
| Buyer clarity | 5/5 | Ivan — named, committed, mid-ramp. |
| Urgency | 4/5 | Must ship before the dip; that's ~2 weeks away. |
| Differentiation | 4/5 | Only the app holds the log, so only it can say "you're on track this week" — paper can't. |
| Speed to validate | 5/5 | Two normal training weeks; the existing log is the instrument. |
| Founder advantage | 5/5 | The KB literally specifies the weekly routine and the skip rule. |

## Core Assumption
When the app decides what today's session is — instead of offering a menu — Ivan executes the KB's weekly routine consistently enough to survive the weeks 3–8 motivation dip.

## Fatal Flaws
| Risk | Severity | Why It Matters | Fast Test |
|---|---|---|---|
| Streak mechanics backfire into a guilt UI | High | The KB rule is forgiving ("never skip **twice in a row**"); an unbroken-streak counter punishes one bad week and the evidence tool becomes a shame mirror. | Forgiveness framing ("2+ strength sessions this week", resets weekly); observe how the first missed week feels. |
| Rigid weekday mapping fights real life | Medium | Travel or a low-energy day breaks a fixed schedule; if "Today: Strength B" argues, Ivan reverts to the menu and the feature is dead code. | Suggestion + 1-tap override; count overrides across 2 weeks — constant overriding means the mapping is wrong. |
| Validating four features as one blob | Medium | Ideas 3+4 don't test the core assumption; shipping all four at once hides which feature earned its place. | Ship 1+2 now; add 3 when the first monthly assessment is naturally due (~week 4). |

## Problem Reality
- **Pain:** Mild right now, sharp in weeks 3–8 — decision friction at the point of use ("which session? did I warm up?") leaks willpower exactly when motivation dips. Discipline itself is proven (3× daily dog walks, 6 months of eating changes) and is not the gap.
- **Early adopter:** Ivan at the moment he opens `trainer.html` on a training day.
- **Vitamin or painkiller:** Vitamin today, painkiller in ~3 weeks — which is the argument for building it now; a habit scaffold installed after the habit collapses is worthless.

## Competition
- **Current behavior:** The v1 session-picker + memory of the KB schedule + printed sheets.
- **Real enemy:** Decision friction and the motivation dip — not a rival app.
- **Differentiation needed:** The feature must *use the log* ("it's Wednesday, Strength B, you're on track"). If it doesn't, printing the KB weekly table would achieve the same for free.

## First 10 Customers
_(Personal tool — "customers" = the next 10 training days.)_
1. This week: train from the "Today is..." view on 2 strength days; success = zero which-session decisions.
2. Next week: one warm-up-first chain end-to-end; success = warm-up done without deciding to do it.
3. First disruption (travel/busy day): success = the nudge reads as help, not scolding, and training resumes next day.

## MVP
- **Build:** (1) "Today is..." scheduling from the KB weekly routine — suggestion with 1-tap override + "never skip twice" forgiveness nudge ("2+ strength sessions this week"); (2) warm-up-first flow — strength sessions open with the 8 warm-up cards + completion checklist, skippable. All in `trainer.html`/`plan.js`, offline, data-driven.
- **Cut:** Idea 3 (monthly mobility self-assessment) until ~week 4 when the first check is naturally due; idea 4 as a standalone feature (folded into the nudge); notifications, walking/steps integration, any further gamification.
- **2-week test:** The next 2 real training weeks, measured by the existing log: sessions on scheduled days, warm-ups completed, override count. If the schedule is constantly overridden → the mapping is wrong, make the schedule editable data rather than abandoning the concept.

## Edits Applied to product-idea.md
- Added a **"Phase 3 — Habit Engine (validated 2026-07-11)"** section: core assumption, now/later scope split (1+2 now, 3 at ~week 4, 4 folded into the nudge as a forgiveness metric), and the three ranked Phase-3 risky assumptions.
- All v1 content, including `Candidates considered`, preserved unchanged.

## Next Step
Add Phase 3 to `docs/product-roadmap.md` (tasks for ideas 1+2 plus a deferred task for idea 3) and build — the scope is one focused session.
