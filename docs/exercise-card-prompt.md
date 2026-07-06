# Exercise Card Generation — Master Prompt & Samples

> **Revision 2026-07-06 — text-free images.** The first Strength A batch showed the image model reliably draws the *movement* but reliably garbles the *text* ("Shourlgrss", "Sommon mistake", truncations). Decision (Ivan): the generated image now contains **no text at all** — only figures, motion arrows, the blue/grey/faded encoding, a soft muscle glow, and a red-X/green-check mistake inset. All wording (title, legend, Works, mistake/correct, safety cues) is rendered by `trainer.html` and the print sheet **as real HTML text from `exercises.js`**, where spelling is always perfect and typography follows `docs/design.md`. The master prompt below is kept for the visual standard it defines; `scripts/generate-cards.mjs` § `buildPrompt()` holds the executable text-free variant.

This is the **source of truth** for generating the printable exercise cards used by the Military Gentleman Trainer. Cards are generated **occasionally, at author-time** (when adding or refreshing an exercise) via the OpenAI Images API, then saved as PNGs into `images/` and displayed offline by the trainer.

## How to use
1. Fill the parameter field `[EXERCISE NAME]` in the master prompt for **one** exercise.
2. Send to the image model. **One exercise per request. Do not batch.**
3. The generation script does this for each exercise in the library (see `scripts/generate-cards`).
4. **Approval gate:** a human reviews each generated card against a known-good source before it enters the library (`approved: true`). AI can render confidently-wrong form — this step is mandatory for safety.

## Model & settings
- **Model:** OpenAI `gpt-image-1` (the current ChatGPT image model), square output.
- **Size:** generate hi-res (e.g. 1024×1024 or higher). Verify current `gpt-image-1` pricing before large batches.
- **Outputs per card:** a **PNG master** (`images/<id>.png`, for print) + a downscaled **WebP** (`images/<id>.webp`, for screen).
- **Consistency → fixed reference image (resolved).** Generate and approve one canonical figure first as `images/_reference-figure.png`, then pass it as a reference input to every card so the figure/style stays uniform.
- **Generation order → by session (resolved):** Strength A → Strength B → Warm-up → Mobility, each an approval batch, so a full trainable session is ready first.
- **Billing (resolved):** OpenAI **platform API**, pay-as-you-go (a few dollars total) — **not** covered by ChatGPT Plus. Key in `.env`, author-time only. Runtime is $0.

## The visual standard this prompt encodes
The master prompt is the executable form of our Exercise Illustration Standard: dual-channel encoding (blue = moving, grey = held; near = solid, far = faded), mandatory ground plane for floor work, motion arrows on active limbs only, dashed reference lines, legend once, muscle highlight, one common-mistake/correct inset, ≤3 safety cues. Palette: moving `#2563eb`, held `#94a3b8`, body/head `#0f172a`, reference/hatch `#94a3b8`/`#cbd5e1`, panel white `#ffffff` / border `#e5e7eb`, ground `#f1f5f9`.

---

## Master Prompt (reusable template)

> Replace the parameter fields (`[EXERCISE NAME]`) before sending.

Create a square printable exercise card for **[EXERCISE NAME]** designed for a personal home routine. The result should look like a clean, beginner-safe, easy-to-understand instructional exercise card that can be understood from the pictures in about 3 seconds.

**Main goal** — Show one exercise only per card. The image must make it easy to understand: the start position, the movement path, the end position, the main muscles involved, the most common mistake, the corrected version, basic safety cues.

**Figure** — Depict a soft 3D instructional male figure with: a generic but realistic face; normal body composition; tall male proportions, approximately 198 cm / 6'6"; long legs, long arms, broad shoulders, realistic torso proportions; adult male body, not overly muscular, not cartoonish, not bodybuilder-like; neutral, calm, beginner-friendly expression.

**Environment** — Pure white background; clean instructional design; made for colour printing; no clutter, no decorative scenery; minimal professional fitness/physiotherapy card style.

**Layout and instructional logic**

1. **Frame-count decision** — Choose the minimum number of frames needed to make the exercise clearly understandable: 2 frames for simple single-plane exercises with a clear start and end; 3 frames for contralateral or alternating exercises such as Dead Bug or Bird-Dog; if more than 3 frames would be required, do not overcrowd the card — simplify to the clearest essential sequence and rely on one common mistake / correction inset.
2. **Layout by movement type** — 2-frame exercises: side-by-side layout. 3-frame exercises: stacked or clearly sequenced layout from top to bottom. Show clear visual progression with movement arrows.
3. **View selection** — Standing exercises: usually side view. Supine floor exercises: side or slightly elevated side view with clear ground plane. Quadruped exercises: side view with clear floor reference. If a common fault is not visible in the main view, show it in the mistake/correction inset.

**Visual style** — Soft 3D instructional illustration style: clean, modern, readable; simple but anatomically believable; easy to print; no exaggerated realism; not comic style; slightly polished healthcare / premium fitness guide look.

**Visual system and colour standard** — Base palette: moving/active limb `#2563eb` blue accent; held/parked/supporting limb `#94a3b8` grey; body/torso/head `#0f172a` navy; reference line/hatch `#94a3b8` and `#cbd5e1`; panel fill/border white `#ffffff` with light border `#e5e7eb`; ground mat/floor plane `#f1f5f9`. Dual-channel encoding: colour = active vs held (blue = moving, grey = held); opacity/line strength = near vs far side (near = solid/stronger, far = faded/lighter). Motion arrows only on active limbs. Dashed reference lines for important alignment cues such as spine, hip line, knee line, or trunk stability. Ground plane is mandatory for all floor exercises so the body clearly reads as lying or kneeling on the floor.

**Required card elements**
- **A. Exercise title** at the top: clear title in simple English: `[EXERCISE NAME]`.
- **B. Small legend** once near the top: Blue = moving limb; Grey = support / held limb; Faded = far side.
- **C. Main sequence** using the automatically chosen frame count. Each frame: one clear position or movement phase; include arrows; remain visually uncluttered; use the chosen view that best teaches the movement.
- **D. Muscle highlight** — clearly highlight the main muscles worked with a subtle light overlay/glow; add a small simple label such as "Works: core, hip flexors". Use only the truly relevant muscles.
- **E. Common mistake + correction** — one small but clear section showing Common mistake and Correct, focused on the single most important beginner error (e.g. arching the low back, rotating the hips, shrugging shoulders, losing neutral spine, moving too high/too fast). Visually distinct but not too large.
- **F. Safety cues** — up to 3 short imperative safety notes in simple English (e.g. Keep spine neutral / Move slowly / Brace your core / Do not twist / Stop if painful). Short and easy to scan.

**Text style** — simple English labels; sentence case; clean sans-serif typography; highly readable; avoid paragraph text; concise and beginner-friendly.

**Design principles** — One position + one instruction per frame. Do not overcrowd. Clarity over decoration. If legibility and compactness conflict, choose legibility. The drawing is a printable reminder, not a complete anatomy lesson. The user should understand the exercise from the picture very quickly.

**Output quality** — professional, printable, instructional, beginner-safe, clean and visually balanced, premium but simple, suitable for a home exercise library.

**Exercise-specific interpretation** — Apply all of the above to `[EXERCISE NAME]`. If relevant, infer: the best view; whether it needs 2 or 3 frames; the most important common mistake; the main muscles worked; the safest beginner cues. Do not add unnecessary elements. The result must be a single square exercise card for `[EXERCISE NAME]`.

---

## Example 1 — Dead Bug

Create a square printable exercise card for Dead Bug designed for a personal home routine. The result should look like a clean, beginner-safe, easy-to-understand instructional exercise card that can be understood from the pictures in about 3 seconds.

Show one exercise only per card. The image must make it easy to understand: the start position, the movement path, the end position, the main muscles involved, the most common mistake, the corrected version, basic safety cues.

Depict a soft 3D instructional male figure with: a generic but realistic face; normal body composition; tall male proportions, approximately 198 cm / 6'6"; long legs, long arms, broad shoulders, realistic torso proportions; adult male body, not overly muscular; calm neutral expression. Use a pure white background and a clean printable colour design.

For Dead Bug, automatically choose the correct number of frames. Because this is a contralateral alternating floor exercise, use 3 frames. Use a clear floor-based view with a visible ground plane so the figure clearly reads as lying on the floor.

**Main sequence** — Start position: lying on the back, hips and knees bent at 90 degrees, arms extended upward, neutral spine. Movement: one arm moves overhead while the opposite leg extends forward and downward. Opposite side: repeat with the other arm and opposite leg.

Use these exact visual standards: moving/active limbs in blue `#2563eb`; held/support limbs in grey `#94a3b8`; torso/head in navy `#0f172a`; reference lines/hatch in `#94a3b8` and `#cbd5e1`; panel fill white, light border `#e5e7eb`; ground mat/floor plane `#f1f5f9`. Use: colour = active vs held; faded line treatment = far side; arrows only on active limbs; dashed reference line to show low back staying stable / neutral; ground plane mandatory.

Include at the top — title: Dead Bug; legend: Blue = moving limb, Grey = support / held limb, Faded = far side.

Muscle highlight: highlight core, deep abdominals, hip flexors; label simply: Works: core, hip flexors.

Common mistake / Correct: common mistake — arching the low back; correct — ribs down, low back stable, controlled reach.

Safety notes (up to 3): Keep low back gently pressed down; Move slowly; Brace your core.

The card must remain clean, uncluttered, beginner-safe, highly readable, and professionally printable.

---

## Example 2 — Bird-Dog

> **Note:** Bird-Dog is **not** in the Foundation Plan (it isn't in the knowledge base). This example is kept only as a style/logic reference for a contralateral quadruped move — do not generate it into the library unless a future plan adds it.

Create a square printable exercise card for Bird-Dog designed for a personal home routine. The result should look like a clean, beginner-safe, easy-to-understand instructional exercise card that can be understood from the pictures in about 3 seconds.

Show one exercise only per card. The image must make it easy to understand: the start position, the movement path, the end position, the main muscles involved, the most common mistake, the corrected version, basic safety cues.

Depict a soft 3D instructional male figure with: a generic but realistic face; normal body composition; tall male proportions, approximately 198 cm / 6'6"; long legs, long arms, broad shoulders, realistic torso proportions; adult male body, not overly muscular; calm neutral expression. Use a pure white background and a clean printable colour design.

For Bird-Dog, automatically choose the correct number of frames. Because this is a contralateral alternating quadruped exercise, use 3 frames. Use a side view on a visible ground plane so the body position is clearly readable.

**Main sequence** — Start position: hands under shoulders, knees under hips, neutral spine. Movement: extend one arm forward and the opposite leg backward. Opposite side: switch to the other arm and opposite leg.

Use these exact visual standards: moving/active limbs in blue `#2563eb`; held/support limbs in grey `#94a3b8`; torso/head in navy `#0f172a`; reference lines/hatch in `#94a3b8` and `#cbd5e1`; panel fill white, light border `#e5e7eb`; ground mat/floor plane `#f1f5f9`. Use: colour = active vs held; faded line treatment = far side; arrows only on active limbs; dashed reference line to show spine level; ground plane mandatory.

Include at the top — title: Bird-Dog; legend: Blue = moving limb, Grey = support / held limb, Faded = far side.

Muscle highlight: highlight core, glutes, shoulders, spinal stabilizers; label simply: Works: core, glutes, shoulders.

Common mistake / Correct: common mistake — rotating the hips or lifting the leg too high; correct — hips level, long spine, controlled reach.

Safety notes (up to 3): Keep hips level; Reach long, not high; Brace your core.

The card must remain clean, uncluttered, beginner-safe, highly readable, and professionally printable.
