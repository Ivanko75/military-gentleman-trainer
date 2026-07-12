/*
  Military Gentleman Trainer — plans (data-driven, FR-016).
  Source of truth: military_gentleman_knowledge_base.html §3 Initial Weekly Routine
  (session purposes, 8-week progression) and §6 Foundation Exercise Library.

  Plans are DATA: the runtime reads whichever plan id localStorage
  "mgt.activePlan" points to, so a future (e.g. quarterly) plan is a new
  object in MGT_PLANS — no code change. MVP ships exactly one plan.

  Strength A/B split derived from KB stated purposes (PRD § Resolved
  Decisions #6): A = push/pull/squat/core, B = shoulders/back/legs/core.
  Warm-up + Mobility sessions are added in TASK-019 (Phase 1).

  startDate: null until Ivan begins the plan; it drives the
  "this week's target" display (FR-015). Classic script for file:// use.
*/
var MGT_PLANS = [
  {
    id: "foundation-v1",
    name: "Foundation Plan v1",
    source: "military_gentleman_knowledge_base.html",
    startDate: null,
    // KB §3 weekly routine (FR-017). Data, not code: a future plan remaps
    // days here. null = recovery day. The runtime treats this as a
    // SUGGESTION with one-tap override — never enforcement.
    weeklySchedule: {
      mon: "strength-a",
      tue: "mobility",
      wed: "strength-b",
      thu: "mobility",
      fri: "strength-a",
      sat: "mobility",
      sun: null
    },
    // KB §4 warm-up completion checklist, shown at the end of the
    // warm-up-first flow (FR-019). A self-check ritual, never a gate.
    warmupChecklist: [
      "Neck feels loose",
      "Shoulders relaxed",
      "Hips moving freely",
      "Knees comfortable",
      "Slightly warmer",
      "Breathing controlled"
    ],
    sessions: [
      {
        id: "warmup",
        kind: "warmup",
        title: "Warm-up",
        purpose: "Prepare joints, muscles and nervous system — 5–7 min before every strength session",
        exerciseIds: [
          "neck-mobility",
          "shoulder-circles",
          "arm-swings",
          "thoracic-rotation",
          "hip-circles",
          "cat-cow",
          "bodyweight-squat",
          "march-in-place"
        ],
        // KB §4 gives the warm-up squat its own dose; the card is shared with Strength A.
        doseOverrides: { "bodyweight-squat": "10 slow reps" }
      },
      {
        id: "strength-a",
        kind: "strength",
        title: "Strength A",
        purpose: "Push, pull, squat, core — 30–40 min",
        exerciseIds: [
          "band-chest-press",
          "band-row",
          "bodyweight-squat",
          "dead-bug",
          "front-plank"
        ]
      },
      {
        id: "strength-b",
        kind: "strength",
        title: "Strength B",
        purpose: "Shoulders, back, legs, core — 30–40 min",
        exerciseIds: [
          "band-overhead-press",
          "band-face-pull",
          "band-lat-pulldown",
          "reverse-lunge",
          "band-romanian-deadlift",
          "side-plank"
        ]
      },
      {
        id: "mobility",
        kind: "mobility",
        title: "Mobility",
        purpose: "Recovery and joint quality — 12–18 min on non-strength days or after workouts",
        exerciseIds: [
          "doorway-chest-opener",
          "worlds-greatest-stretch",
          "hip-flexor-stretch",
          "hamstring-stretch",
          "calf-stretch",
          "shoulder-wall-slides",
          "childs-pose",
          "supported-deep-squat-hold"
        ]
      }
    ],
    // KB §3 — 8-week progression (the build-up ramp after two years off).
    progression: [
      { weekFrom: 1, weekTo: 2, sets: "2 sets per exercise", reps: "learn the movement", resistance: "light band", note: "Technique before resistance." },
      { weekFrom: 3, weekTo: 4, sets: "3 sets per exercise", reps: "same form standard", resistance: "light band", note: "Same form standard as weeks 1–2." },
      { weekFrom: 5, weekTo: 6, sets: "3 sets per exercise", reps: "same rep range", resistance: "increase only if technique is stable", note: "Stop each set with 2–3 reps in reserve." },
      { weekFrom: 7, weekTo: 8, sets: "3 sets per exercise", reps: "toward 12–15 with perfect control", resistance: "as weeks 5–6", note: "Perfect control decides the rep count." }
    ]
  }
];

// Bootstrap the active plan id (TASK-003). Safe under file:// / private mode.
(function () {
  try {
    if (typeof localStorage !== "undefined" && !localStorage.getItem("mgt.activePlan")) {
      localStorage.setItem("mgt.activePlan", "foundation-v1");
    }
  } catch (e) { /* private mode — runtime falls back to foundation-v1 */ }
})();
