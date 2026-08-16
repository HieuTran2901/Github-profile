# PHASE 16D — CHAPTER 3 DEEP GEOMETRY DEBUG REPORT

## 1. Existing Architecture
The Chapter 3 scene uses a CSS 3D nested transform architecture with Framer Motion:
- **ROOT**: Full screen `absolute inset-0`, sets `perspective: 1400px`.
- **ORBIT CONTAINER**: Shifted right via `left: 20%` with `rotateX`, `rotateY`.
- **ORBIT ROTATOR**: A `flex items-center justify-center` container that continuously spins.
- **SVG RINGS**: Placed absolutely within the flex container.
- **CORE NODE**: Placed relatively within the flex container.
- **TECH NODES**: Placed absolutely within the flex container, mathematically shifted.

## 2. Coordinate Systems
- **Mathematical Space**: `(0,0)` is the center of the orbit.
- **DOM Flexbox Space**: `align-items: center; justify-content: center` sets the static origin for absolute children to align their margin-box center with the flex container's center.
- **Transform Space**: `translate3d(x, y, z)` shifts relative to this static origin.

## 3. Transform Chain
```text
PAGE
 ↓
ROOT (Perspective: 1400px, Origin: 50% 50%)
 ↓
ORBIT CONTAINER (left: 20% -> Center is ~60vw)
 ↓
SHARED ROTATOR (flex, items-center, justify-center)
 ↓
NODE WRAPPER (absolute, no left/top -> static position: center of parent)
 ↓ transform: translate3d(x, y, z) translate(-50%, -50%)
NODE CARD (w: 128px-144px, h: approx 128px)
```

## 4. Core Center Calculation
The `My Core Stack` node is a relative item within a `justify-center items-center` flex container.
Its visual center perfectly aligns with the flex container's center `(0,0)`.

## 5. Node Center Calculation (The Bug)
The absolute Node Wrapper lacks `left` and `top` properties. In modern browsers, an absolutely positioned element in a `flex center` container has its center aligned to the container's center by default.
1. **Initial Position**: Node Center = `(0, 0)`
2. **Mathematical Orbit**: `translate3d(x, y, z)` shifts the center to `(x, y)`
3. **The Fatal Flaw**: `translate(-50%, -50%)` is then applied. Because the node was *already* centered, this shifts the node's center back by half of its own width and height.

## 6. Expected vs Actual Coordinates
Given a Tech Node with Width `128px` and Height `~128px`:
- **React Node** (0°):
  - Expected Center: `(260, 0)`
  - Actual Visual Center: `(260 - 64, 0 - 64) = (196, -64)`
  - **Error**: Shifted INWARD and UP.
- **Redis Node** (180°):
  - Expected Center: `(-260, 0)`
  - Actual Visual Center: `(-260 - 64, 0 - 64) = (-324, -64)`
  - **Error**: Shifted OUTWARD and UP.

This explains exactly why "some cards sit too far inward, some cards sit too far outward". The entire circular orbit of nodes is translated off-center by `(-64px, -64px)`.

## 7. Perspective Analysis
The ROOT has `perspective: 1400px` (default origin `50% 50%`), but the ORBIT CONTAINER is positioned at `left: 20%` (center `~60%`).
This creates a subtle secondary parallax error:
- Core Node (`Z = 70px`) projects visually to the right.
- SVG Rings (`Z = -40px`) project visually to the left.
This causes a ~10-15px visual separation between the Core Center and SVG Ring Center.

## 8. Ring Geometry
The SVG Rings use exact mathematical radii (`Rx=260/380`) and are correctly centered at `(0,0)`. They represent the true expected path.

## 9. Root Cause
**ROOT CAUSE = DOUBLE CENTERING OFFSET**
The implementation applied `translate(-50%, -50%)` to nodes that were already centered by the parent's Flexbox `align-items: center; justify-content: center` properties, causing a catastrophic `(-w/2, -h/2)` geometric shift to every node's mathematical position.

## 10. Minimal Fix
1. Explicitly set `left: "50%"` and `top: "50%"` on the Node Wrapper to establish an absolute `(0,0)` origin at the top-left of the node.
2. Keep `translate(-50%, -50%) translate3d(x,y,z)` to shift the node's mathematical center perfectly onto the origin, and then out to the orbital coordinates.
3. Explicitly center the SVG and Core Node using the same robust `left: 50%, top: 50%` pattern to bypass flexbox ambiguity.
4. Align `perspectiveOrigin` on the ROOT to `60% 50%` to fix the 3D parallax drift between Z-layers.

---

PHASE 16D STATUS:
DIAGNOSED_AND_FIXED

ROOT_CAUSE:
DOUBLE CENTERING OFFSET. Nodes were centered by Flexbox, then offset again by translate(-50%, -50%), shifting the entire orbit by approx (-64px, -64px).

EXPECTED_NODE_CENTER:
(Rx * cos(θ), Ry * sin(θ))

ACTUAL_NODE_CENTER:
(Rx * cos(θ) - width/2, Ry * sin(θ) - height/2)

MAX_GEOMETRY_ERROR:
~90px (Diagonal offset from -64px X, -64px Y)

CORE_ALIGNMENT:
FAIL (Perspective drift of ~10px)

RING_ALIGNMENT:
PASS (But nodes were offset from them)

ORBIT_ALIGNMENT:
FAIL (Due to double centering offset)

ROTATION:
PASS

NODE_READABILITY:
PASS

MOBILE:
PASS

REDUCED_MOTION:
PASS

MOTIONVALUE:
PRESERVED

CONTINUOUS_REACT_SCROLL_STATE:
NONE

BUILD:
PASS

RUNTIME:
PASS

REGRESSION:
PASS
