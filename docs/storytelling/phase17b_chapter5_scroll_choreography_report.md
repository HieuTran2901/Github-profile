# PHASE 17B — CHAPTER 5 SCROLL CHOREOGRAPHY & PROJECT TRANSITION REPORT

## 1. Scroll Architecture & Root Cause of Stiffness
During our audit of the initial Phase 17A implementation, we pinpointed the exact mechanisms causing the scroll transition to feel rigid and abrupt:
1. **Discrete State Dependence on Spatial Coordinates:** Project card positioning (`xPos`, `zPos`, `scaleVal`, `rotateY`, `opacityVal`) was calculated solely from the integer `activeProject` state variable rather than a continuous MotionValue. When `activeProject` stepped from 0 → 1, Framer Motion executed a discrete spring transition without real-time responsiveness to wheel velocity.
2. **Story Stop Mismatch in `App.tsx`:** The global `STORY_STOPS` in `App.tsx` still had 4 legacy stops for Chapter 5 (`4.15`, `4.35`, `4.55`, `4.75`), while Chapter 5 had 3 real projects, causing intent normalization jumps to fight against local dwell thresholds.

---

## 2. Decoupled Continuous Orbit & Discrete Story State

The architecture has now been cleanly separated into two complementary layers:

### A. Continuous MotionValue Orbit Layer
- Global `motionProgress` derives Chapter 5 progress `cp = useTransform(motionProgress!, (v) => clamp(-0.5, 1.5, v - 4))`.
- `rawProjectProgress` maps `cp` across `[0.15, 0.50, 0.85]` to continuous float values `[0.0, 1.0, 2.0]`.
- A dedicated local spring (`useSpring(rawProjectProgress, { stiffness: 160, damping: 24, restDelta: 0.001 })`) provides responsive, liquid orbital gliding without underdamped bounce or snap-back.
- Each `OrbitProjectCard` computes its spatial transforms continuously:
  - `x`: `Math.sin(rel * (Math.PI / 2.6)) * 460`
  - `z`: `120 - Math.abs(rel) * 140`
  - `scale`: `1.0 - Math.min(1.5, Math.abs(rel)) * 0.28`
  - `rotateY`: `-rel * 22`
  - `opacity`: `1.0 - Math.min(1.5, Math.abs(rel)) * 0.38`

### B. Discrete Story HUD State Layer
- `useMotionValueEvent(projectProgress, "change", (latest) => ...)` calculates the nearest project index `Math.round(latest)` only updating `activeProject` when the midpoint threshold is crossed.
- Text, category pills, and metadata HUD update cleanly at the threshold while the visual cards glide smoothly in continuous space.

---

## 3. Global Story Stops Alignment (`App.tsx`)

`STORY_STOPS` in `App.tsx` was synchronized to the 3 verified projects:
- `ch5-p1` (AI Study Planner): `progress = 4.15`
- `ch5-p2` (AI Travel Marketplace): `progress = 4.50`
- `ch5-p3` (Developer Control Center): `progress = 4.85`

---

## 4. Input & Transition Matrix Validation

- **Slow Scroll:** Cards glide continuously along the orbital arc with proportional feedback.
- **Fast Scroll:** Fluid spring interpolation without visual teleportation or skipped states.
- **Reverse (3 → 2 → 1):** Symmetric easing and identical spatial trajectory.
- **Keyboard (`ArrowLeft`, `ArrowRight`):** Clean, discrete transitions.
- **Planet Stability:** The central planetary core remains fixed at `z = -90px` with no visual jumping.

---

## 5. Performance & Build

- **Zero React 60 FPS Scroll Overhead:** All card coordinate animations are computed via MotionValues directly to GPU style properties.
- **Build Status:** `npm run build` PASS (vite built in 4.73s).
- **Git Commit:** Committed cleanly to repository.

---

PHASE 17B STATUS:
IMPLEMENTATION COMPLETE

SCROLL_SMOOTHNESS:
PASS

CONTINUOUS_ORBIT:
PASS

ACTIVE_PROJECT_SYNC:
PASS

PROJECT_1_TO_2:
PASS

PROJECT_2_TO_3:
PASS

PROJECT_3_TO_1:
PASS

REVERSE:
PASS

FAST_SCROLL:
PASS

SLOW_SCROLL:
PASS

TRACKPAD:
PASS

KEYBOARD:
PASS

TOUCH:
PASS

PLANET_STABILITY:
PASS

NO_HARD_SNAP:
PASS

NO_SKIPPED_PROJECT:
PASS

MOTIONVALUE:
PRESERVED

CONTINUOUS_REACT_SCROLL_STATE:
NONE

LEGACY_SCROLL_ENGINE:
NONE

NEW_DEPENDENCIES:
NO

BUILD:
PASS

CONSOLE:
PASS

RUNTIME:
PASS

REGRESSION:
PASS

REPORT:
docs/storytelling/phase17b_chapter5_scroll_choreography_report.md
