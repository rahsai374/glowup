# Guided Camera for Scan Consistency

**Date:** 2026-05-26
**Status:** Draft
**Scope:** Section 1 of scan consistency fix — guided camera with soft nudges

## Problem

Repeat skin scans produce 15-25 point score variance. Two root causes:
1. **Input inconsistency** — different distance, angle, framing each scan means the AI analyzes different image data
2. **Prompt calibration** — no scoring rubric or temperature control (addressed in a separate Section 2 spec)

This spec addresses cause #1: normalizing selfie input via guided camera.

## Solution

Add real-time face detection to the scan camera screen. Soft nudge messages coach the user toward consistent framing. The shutter is never blocked — nudges are advisory only.

## Dependency Decision

`expo-face-detector` — status unclear on SDK 54 (removed from monorepo, docs 404 for latest, not in bundledNativeModules). The npm package still exists with `expo: '*'` peer dep. **Step 1 of implementation is a build test** — install and prebuild to verify it compiles. If it fails, fall back to `react-native-vision-camera` + `react-native-vision-camera-face-detector`.

## Components

### 1. `useFaceGuide` hook — `hooks/useFaceGuide.ts`

**Input:** Face detection data (bounding box from face detector), oval target dimensions.

**Output:** `{ nudge: string | null, isReady: boolean }`

**Three conditions checked:**

| Condition | Check | Pass threshold |
|-----------|-------|----------------|
| Distance | Face bbox width as % of oval width | 55-75% |
| Centering | Face center offset from oval center | < 15% of oval width |
| Stability | Centroid delta across last 5 frames | < 8 DP |

**Priority when multiple fail:** distance > centering > stability

**Throttle:** Process at most every 100ms. Use refs for frame buffer, not React state, to avoid render thrash.

**Front-camera mirroring:** Face bounds arrive in unmirrored image coordinates. The camera preview is mirrored. Centering math must flip the X axis: `mirroredX = imageWidth - faceCenter.x`.

**Coordinate conversion:** Face bounds are in image pixels. Oval is in DP. Convert using `imageWidth / viewWidth` ratio.

### 2. Camera overlay updates — `app/scan.tsx`

Wire face detector onto existing CameraView via `onFacesDetected` callback.

**Oval behavior:**
- Default: white dashed border (current look)
- All conditions met: solid green border + subtle scale pulse animation
- Transition: animated border color + width change

**Nudge label:**
- Single animated text label centered below the oval
- FadeInDown/FadeOutUp transitions (no flickering on rapid changes)
- Only the highest-priority failing condition shows

**Quality indicator:**
- Small dot near shutter button: green when `isReady`, amber otherwise
- No red state — avoid making users feel they're doing something wrong

**Haptic feedback:**
- When `isReady` sustained for 1+ second: single light haptic tick via `expo-haptics`
- One-shot — don't repeat while isReady stays true

### 3. Nudge copy — i18n keys (en + hi)

Tone: AI speaking as helpful partner. Every nudge ties back to scan accuracy.

| Key | English | Purpose |
|-----|---------|---------|
| `nudge_closer` | "Come closer — I can see your skin better up close" | Face too small |
| `nudge_back` | "A little back — I need to see your full face" | Face too large |
| `nudge_center` | "Center your face so I don't miss anything" | Off-center |
| `nudge_steady` | "Hold still — analyzing works best with a clear shot" | Moving |
| `nudge_ready` | "Looking good — I can see everything clearly" | All conditions pass |
| `nudge_no_face` | "I can't find your face — make sure it's in the oval" | No face detected |

Hindi translations to be added for all keys.

### 4. Scan record enhancement

Add `wasReady: boolean` field to `ScanRecord` interface. Persisted with each scan to enable future variance analysis: "do scans tagged as ready have more consistent scores?"

## Data Flow

```
CameraView onFacesDetected (throttled 100ms)
  → face bounding box (image pixels)
  → useFaceGuide(faceBounds, ovalBounds, imageSize, viewSize)
    → flip X for front camera mirroring
    → convert image pixels → DP
    → check distance ratio, center offset, frame delta
    → return { nudge, isReady }
      → UI: oval color, nudge label, quality dot, haptic
  → on shutter press: capture + set wasReady on scan record
```

## Edge Cases

- **0 faces detected:** Show `nudge_no_face` message
- **2+ faces detected:** Use the largest bounding box (closest face = user)
- **Face detector fails to initialize:** Fall back to current behavior (static oval, no nudges, no crash)
- **Gallery path:** No guidance — only applies to live camera

## Dependencies

- `expo-face-detector` (primary, needs build verification) OR `react-native-vision-camera` + plugin (fallback)
- `expo-haptics` — check if already installed, add if not

## Out of Scope

- Lighting detection
- Head angle/tilt tracking
- Auto-capture
- Blocking the shutter button
- Gallery image guidance
- Section 2 (scoring rubric + temperature) — separate spec
