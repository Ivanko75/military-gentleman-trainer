---
# Design tokens — Military Gentleman Trainer
# Style: Field Manual (calm) — Minimalism + Swiss Typographic + Calm Clinical restraint.
# Constraints: print-first (light bg), fully offline (no CDN fonts), single-file HTML.
color:
  navy:    "#0f172a"   # primary — headers, print header bar, section rules
  slate:   "#64748b"   # secondary/muted — labels, cues, secondary text
  blue:    "#2563eb"   # CTA / accent — the ONE accent: buttons, active, links
  blue-2:  "#dbeafe"   # accent tint — active card fill, badges
  bg:      "#f6f8fb"   # app background
  card:    "#ffffff"   # card surface
  ink:     "#18212f"   # body text (near-black)
  line:    "#e5e7eb"   # hairline borders
  green:   "#16a34a"   # SEMANTIC ONLY — "session logged / done"
  amber:   "#d97706"   # SEMANTIC ONLY — safety notes ("pain is a stop signal")
  red:     "#dc2626"   # SEMANTIC ONLY — errors (import failed, quota)
typography:
  heading_stack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
  body_stack:    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
  google_fonts:  none   # intentional — a CDN font would break offline use
  scale: { h1: 32px, h2: 24px, h3: 18px, body: 16px, small: 13px }
  weight: { heading: 700, body: 400, label: 600 }
  line_height: 1.5
radius: { card: 14px, pill: 999px, control: 10px }
space:  { grid: 8px, card_pad: 16px, section_gap: 28px }
shadow: { card: "0 1px 2px rgba(15,23,42,.04)" }
motion: { transition: "120ms ease" }   # tap/hover only — no parallax, no kinetic text
tap_target_min: 44px
---

# Design System — Military Gentleman Trainer

**Style: Field Manual (calm).** Disciplined, gridded, high-contrast-on-white, one accent. It reads as "military gentleman" — steady and plain-spoken, not a drill sergeant — and it deliberately continues the look of `military_gentleman_knowledge_base.html` so the tool feels like the next chapter of Ivan's own document. Two non-negotiable constraints shape every choice: it must **print cleanly on A4** and it must **work fully offline at runtime** (no CDN, so no web fonts; exercise cards are pre-generated PNGs served from a local `images/` folder).

> **Two visual layers.** This file governs the **app chrome** (Field Manual — navy/blue/grey, system fonts, light/print-first). The **exercise cards themselves** are AI-generated instructional images whose visual language and generation prompt live in `docs/exercise-card-prompt.md`. The cards deliberately reuse this palette and the same encoding (blue = moving, grey = held, faded = far side) so chrome and cards read as one system.

## Colors

Use the token YAML above. Rules:
- **One accent.** `blue #2563eb` is the only accent — primary buttons, active states, links. Don't introduce a second decorative color.
- **Semantic colors are semantic only.** `green` = done/logged, `amber` = safety note, `red` = error. Never use them decoratively.
- **Backgrounds stay light.** App bg `#f6f8fb`, cards pure white. No dark surfaces — they waste ink and break print.
- Contrast: `ink #18212f` on white and `navy` on white both pass WCAG AA. `slate #64748b` is for secondary text only, never for essential small print.

## Typography

- **System stack only** (`-apple-system…`) for both headings and body — zero bytes, zero network, the clean Apple-like look for free.
- Scale: h1 32 / h2 24 / h3 18 / body 16 / small 13. Headings 700, body 400, labels 600.
- Coaching cues are body text — keep them 16px and readable; never shrink cue/safety text below 13px.
- **No Google Fonts, no `@font-face` from a CDN.** If a distinctive display font is ever wanted, it must be embedded as base64 — deferred for now.

## Layout

- **8px spacing grid.** Card padding 16px, section gaps 28px.
- Cards: white, `1px solid line`, radius 14px, shadow `0 1px 2px rgba(15,23,42,.04)`.
- Max content width ~1200px on desktop; single-column, comfortable on mobile.
- Section headings carry a left accent rule (`border-left:5px solid blue; padding-left:12px`) — the field-manual signature from the knowledge base.
- One clear **primary button per view**; CTA (`Log session` / `Print sheet`) sits at the bottom of the Session view, thumb-reachable.

## Components

- **Session picker card** (Today view): large tap target (≥44px), title + purpose, blue on hover/active (`blue-2` fill).
- **Exercise card**: an AI-generated instructional card image (`images/<id>.png`) + name (h3) + dose (small, slate) + optional QR (≥2.5cm). A done-toggle in the corner; done = calm `green` check fill, no celebratory animation. The card image is self-contained (start→movement→end, muscle highlight, mistake/correct, cues, legend) — see **`docs/exercise-card-prompt.md`**. Un-approved/missing image → a labelled placeholder, never a broken image.
- **Badge/pill**: radius 999px, used for status ("3 this week") — `blue-2`/blue text.
- **Buttons**: min-height 44px, padding 12/20; primary = blue fill white text; secondary = ghost (border only). Provide hover/focus-visible/active states; `120ms ease` transition.
- **Safety callout**: amber left-border box for "pain is a stop signal" style notes (from the knowledge base's `.warning`).
- **History row**: date · session title · N/total done; newest first.

## Motion

Restrained by design (these are the *anti*-effects for this product):
- Only `120ms ease` transitions on tap/hover/toggle.
- No parallax, no kinetic text, no video loops, no glow.
- "Done" and "logged" states are quietly satisfying, not loud.

## Do's and Don'ts

**Do**
- Keep it light, gridded, and legible — let whitespace and the single blue accent carry hierarchy.
- Design the screen and the printout together; test both.
- Use amber for safety, green for done — sparingly and only semantically.

**Don't**
- Don't use a dark background or red/yellow "gym" palette — HIGH severity: wastes ink, unreadable in print, wrong tone (contradicts the validated calm/over-50-safe framing).
- Don't use impact display fonts (Anton/Archivo Black) — they shout and hurt cue legibility.
- Don't load fonts (or anything) from a CDN — HIGH severity: breaks the offline requirement.
- Don't use urgent/"no excuses" CTA copy — wrong voice; this is a gentleman's field manual.
