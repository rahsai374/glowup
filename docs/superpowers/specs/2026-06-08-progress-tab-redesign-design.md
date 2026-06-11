# Progress Tab Redesign — Before/After Journey

**Date:** 2026-06-08
**Status:** Approved
**Design Reference:** `design_handoff_progress_tab/`

---

## Problem

The current Progress tab duplicates data across three layers:
1. Score chips in a "Score History" card (top half)
2. Full scan cards with score + concern + win (bottom half)
3. `ScanDetailSheet` bottom sheet that shows the same data again before linking to Results

This creates a redundant, flat experience with no narrative or emotional arc.

## Solution

Replace the entire Progress tab with a **Before/After Journey** design — a single, state-driven page that adapts its layout, copy, and tone based on the user's scan history. Remove `ScanDetailSheet` entirely.

## Architecture

### 7 States (mutually exclusive)

| State | Trigger | Hero | Tone |
|---|---|---|---|
| 0 — FTUE | `scans.length === 0` | Dashed placeholder circles | Inviting |
| 1 — First scan | `scans.length === 1` | Single 130px photo, baseline pill | Encouraging |
| R — Returning | `daysSinceLastScan > 56` | Golden "It's been a while" banner | Warm welcome-back |
| 2 — No change | `latest === comparison` | Before/after, gray "No change" pill | Steady |
| 3 — Minor change | `diff > 0 && diff <= 5` | Before/after, small green pill | Encouraging |
| 4 — Happy path | `diff > 5` | Before/after, bold green pill | Celebratory |
| 5 — Decreased | `diff < 0` | Before/after, amber pill | Supportive (never alarming) |

State selection priority: 0 > 1 > R > then compute diff for 2/3/4/5.

### Component Breakdown

| Component | Purpose |
|---|---|
| `ProgressShell` | Screen wrapper with 3 ambient blobs (required on all states) |
| `ProgressHeader` | "Your Progress" serif title + dynamic italic subtitle per state |
| `HeroCard` | Before/after photo comparison with time-window toggle (states 2-5), single photo (state 1), dashed placeholders (state 0), golden banner (state R) |
| `TimeWindowToggle` | "1 week" / "4 weeks" / "All time" pill toggle (top-right of hero card) |
| `DeltaPill` | Score change badge — auto-picks neutral (gray) / positive (green) / negative (amber) |
| `TrendTimeline` | Sparkline SVG chart + tappable scan nodes below |
| `InsightStrip` | Editorial callout strip with highlighted metric word |
| `ScanBottomSheet` | Lightweight metric breakdown (Hydration, Radiance, Texture, Dark spots) on scan node tap |
| `ProgressCTA` | Primary action button — filled or outlined depending on state |

### Removed Components

- `ScanDetailSheet` — deleted entirely. Replaced by lightweight `ScanBottomSheet` (shows 4 key metrics + "View Full Results" button, not the full concern/win/advice duplication).

### Navigation Changes

- Tapping a scan node in timeline -> opens `ScanBottomSheet` with metric breakdown
- "View Full Results" in bottom sheet -> navigates to Results page with `scanId` (existing `isHistorical` flag)
- CTA "Take a new scan" -> navigates to scan flow
- State 5 CTA "Review your routine" -> navigates to routine tab (outlined style)

## Key Interactions

### Time-Window Toggle
- 3 options: 1 week / 4 weeks / All time
- Default: **4 weeks**
- Changing updates: comparison baseline scan, score numbers, delta pill, comparison photo label, date range text, insight strip

### Tappable Scan Nodes
- Each node in timeline scales to 0.96 + cream background on press
- On tap: opens bottom sheet (28px top radius, drag handle) with 4 metric rows (Hydration, Radiance, Texture, Dark spots) + score + date + "View Full Results" CTA
- Bottom sheet drag > 80px -> dismiss

### Insight Strip (Dynamic)
- Calculates biggest-improver metric for selected time window
- Highlighted word is italic serif (Fraunces)
- For decrease state: highlights "sleep, stress, and weather" instead of a metric
- Uses supportive tone with cream bg and heart emoji instead of sparkle

## Design Tokens

All from `design_handoff_progress_tab/DESIGN.md`:

```
bg:               #FFF5EE
primary:          #E07856
text:             #2D1810
accent:           #D4A574
surface:          #FFFFFF
insight bg:       #FBF2E0
decrease bg:      #FFF5EE

delta-positive:   bg #DCFCE7, text #16A34A, dot #4ADE80
delta-neutral:    bg #F3F4F6, text #6B7280, dot #9CA3AF
delta-negative:   bg #FEF3C7, text #D97706, dot #FACC15

card radius:      28px (hero), 24px (timeline), 20px (insight)
CTA radius:       20px
card shadow:      0 4px 20px rgba(45,24,16,0.05)
card border:      1px solid rgba(224,120,86,0.08)
```

Typography: Fraunces (serif headings), Plus Jakarta Sans (body/UI).

## Data Model

Uses existing `ScanRecord` from `stores/useScanStore.ts` — no schema changes needed.

```ts
// New derived state needed in progress.tsx:
const [comparisonMode, setComparisonMode] = useState<'week' | '4weeks' | 'all'>('4weeks');
const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);

// Helper: find comparison scan for time window
function findComparisonScan(history: ScanRecord[], mode: string): ScanRecord | null
// Helper: compute biggest-improver metric between two scans
function biggestImprover(baseline: ScanRecord, latest: ScanRecord): string
// Helper: days since last scan
// Already exists: daysSinceLastScan() in useScanStore.ts
```

## Out of Scope

- Scan capture flow (separate screen)
- Bottom tab bar (already exists)
- Results page changes (already supports `isHistorical`)
- Metric scoring logic / AI analysis

## Files Changed

| File | Action |
|---|---|
| `app/(tabs)/progress.tsx` | **Rewrite** — new state-driven layout |
| `components/ScanDetailSheet.tsx` | **Delete** — replaced by inline `ScanBottomSheet` |
| `components/progress/HeroCard.tsx` | **New** — before/after comparison card |
| `components/progress/TrendTimeline.tsx` | **New** — sparkline + tappable nodes |
| `components/progress/DeltaPill.tsx` | **New** — score change badge |
| `components/progress/InsightStrip.tsx` | **New** — editorial callout |
| `components/progress/ScanBottomSheet.tsx` | **New** — lightweight metric breakdown sheet |
| `components/progress/TimeWindowToggle.tsx` | **New** — 1w/4w/all toggle |
| `components/progress/ProgressCTA.tsx` | **New** — styled CTA button |
