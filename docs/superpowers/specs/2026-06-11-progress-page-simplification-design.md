# Progress Page Simplification

**Date:** 2026-06-11
**Status:** Approved
**Supersedes:** Portions of `2026-06-08-progress-tab-redesign-design.md` (layout only — state machine, data model, and navigation are unchanged)

---

## Problem

The current StateComparison layout (states 2-5) stacks four heavy components vertically:

1. **HeroCard** — before/after photos, scores, delta pill, time toggle
2. **TrendTimeline** — sparkline chart + tappable score pills below
3. **InsightStrip** — emoji + motivational one-liner
4. **ProgressCTA** — action button

This creates three issues:
- **Information density**: Score appears 4x (HeroCard before, HeroCard after, chart dots, score pills). Dates appear 3x.
- **Hidden interaction**: Score pills below the sparkline look like labels, not tappable elements. Users miss the tap-to-view-details interaction entirely.
- **Page height ~680px**: Requires scrolling on standard devices, pushing the CTA below the fold.

## Solution

Three changes to the StateComparison layout:

1. **Merge sparkline into HeroCard** — small decorative sparkline (32px) below the delta pill / date range, inside the existing HeroCard. Saves ~170px of vertical space by eliminating the standalone TrendTimeline card.
2. **Remove InsightStrip** — the motivational text adds little value relative to its space (~70px). State-specific encouragement is already conveyed by the subtitle.
3. **Replace score pills with ScanHistoryCard list** — full-width cards with thumbnail, score, date, delta, concern badge, and win badge. Obviously tappable (chevron affordance). Matches the original `DESIGN.md` brief (Screen 10).

### New layout order (states 2-5)

```
HeroCard (with merged sparkline)
  └─ Time toggle
  └─ Before/after photos + scores
  └─ Delta pill
  └─ Date range text
  └─ Sparkline (32px, decorative)

"Past Scans" section header (Fraunces 17px)

ScanHistoryCard (latest scan)
ScanHistoryCard (previous scan)
ScanHistoryCard (baseline) ← "Baseline" badge instead of delta
...

ProgressCTA
```

## Component Changes

### HeroCard — modified

Add an optional sparkline at the bottom of the card, rendered only when `scans` prop has 2+ entries.

**New props:**
```ts
interface HeroCardProps {
  // ... existing props unchanged ...
  scans?: ScanRecord[];  // all scans in current time window, for sparkline
}
```

**Sparkline rendering:**
- Height: 32px, full card width minus 16px horizontal padding
- Uses the same `smoothPath()` catmull-rom logic currently in TrendTimeline
- Gradient fill: `PRIMARY` at 15% opacity top → 2% bottom
- Stroke: `PRIMARY` at 50% opacity, 2px width
- Data point circles: 2.5px radius, latest point 3.5px with heavier white stroke
- No axis labels, no interactivity — purely decorative trend indicator
- Rendered below `dateRangeText`, with 12px top margin

**Not rendered when:**
- `comparison` is null (state 1 — single scan, no trend to show)
- `scans` prop is undefined or has fewer than 2 entries

### ScanHistoryCard — new component

`components/progress/ScanHistoryCard.tsx`

A full-width card representing one past scan. Tapping opens `ScanBottomSheet`.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ [48x48 thumbnail]  78  Jun 8  +3 ↑              │
│                    ┌──────────┐ ┌────────────┐   │
│                    │Dark Spots│ │Radiance ↑  │ › │
│                    └──────────┘ └────────────┘   │
└─────────────────────────────────────────────────┘
```

**Props:**
```ts
interface ScanHistoryCardProps {
  scan: ScanRecord;
  previousScan?: ScanRecord;  // for computing delta; undefined = baseline
  onPress: (scan: ScanRecord) => void;
}
```

**Visual spec:**
- Container: white, borderRadius 16, padding 14px 16px, 1px border `rgba(224,120,86,0.08)`, shadow `0 2px 12px rgba(45,24,16,0.04)`, marginBottom 8
- Thumbnail: 48x48, borderRadius 14, from `scan.imageUrl`. Fallback: warm gradient placeholder with person icon (same as HeroCard's PhotoCircle fallback)
- Score: Fraunces 700, 18px, terracotta `#E07856`
- Date: Plus Jakarta Sans 600, 13px, `#2D1810`. Format: `Mon DD` (e.g. "Jun 8")
- Delta: 11px, bold. Green `#22C55E` for positive (`+N ↑`), amber `#D97706` for negative (`-N ↓`). Hidden for baseline scan.
- Baseline badge: Instead of delta, show "Baseline" in `rgba(45,24,16,0.06)` bg, `rgba(45,24,16,0.45)` text, 10px, rounded-8
- Concern badge: `scan.top_concern`, 10px, `rgba(248,113,113,0.12)` bg, `#EF4444` text, rounded-8, padding 3px 8px
- Win badge: `scan.top_win` with ` ↑` suffix, 10px, `rgba(74,222,128,0.12)` bg, `#22C55E` text, rounded-8, padding 3px 8px
- Chevron: `›` character, `rgba(45,24,16,0.25)`, 20px, flex-shrink 0
- Press feedback: scale 0.98, subtle background tint

**Accessibility:**
- `accessibilityRole="button"`
- `accessibilityLabel="Score {score} on {date}, {top_concern}, {top_win}"`

### TrendTimeline — removed from layout

The `TrendTimeline` component file stays in the codebase (it's still used in StateReturning with opacity 0.75), but it is no longer rendered in StateComparison or StateFirstScan.

### InsightStrip — removed from layout

The `InsightStrip` component file stays in the codebase but is no longer rendered in any state. Can be cleaned up in a follow-up.

### ScanBottomSheet — unchanged

Same component, same content. The trigger changes from score pill tap (TrendTimeline) to card tap (ScanHistoryCard). The `onSelectScan` callback and `selectedScan` state in `progress.tsx` remain identical.

### ProgressCTA — unchanged

Same component, same behavior. It sits below the scan history card list instead of below InsightStrip.

## State-by-State Impact

| State | Current layout | New layout |
|---|---|---|
| 0 — FTUE | No change | No change |
| 1 — First scan | HeroCard → TrendTimeline (1-scan placeholder) → InsightStrip → CTA | HeroCard (no sparkline) → single ScanHistoryCard (baseline badge) → CTA |
| R — Returning | Welcome banner → last-scan card → TrendTimeline (faded) → CTA | No change (TrendTimeline with opacity is the right UX here — shows the old journey faded) |
| 2-5 — Comparison | HeroCard → TrendTimeline → InsightStrip → CTA | HeroCard (with sparkline) → "Past Scans" header → ScanHistoryCard list → CTA |

## Data Flow

No new data sources. Everything comes from existing `ScanRecord` fields:
- `imageUrl` → thumbnail
- `overall_score` → score display
- `createdAt` → date formatting
- `top_concern` → concern badge text
- `top_win` → win badge text
- Delta computed from adjacent scan's `overall_score`

The `scansForWindow()` helper already filters scans by time window. The ScanHistoryCard list iterates over `windowScans` (same data TrendTimeline currently receives).

## i18n

One new key in `en.json` and `hi.json`:
```json
"past_scans": "Past Scans"
```

## Dead Code Cleanup

Removing InsightStrip from the layout makes these items unused in `progress.tsx`:
- `getInsightConfig()` function
- `computeBiggestImprover()` function
- `improver` computed value in StateComparison
- `METRIC_LABELS` constant
- InsightStrip import

These should be removed as part of the layout change (they are our own mess from this change, not pre-existing dead code).

## Files Changed

| File | Action |
|---|---|
| `components/progress/ScanHistoryCard.tsx` | **New** — scan history card component |
| `components/progress/HeroCard.tsx` | **Modify** — add optional sparkline at bottom |
| `app/(tabs)/progress.tsx` | **Modify** — replace TrendTimeline + InsightStrip with ScanHistoryCard list in StateComparison and StateFirstScan; remove dead InsightStrip helpers |
| `i18n/en.json` | **Modify** — add `past_scans` key |
| `i18n/hi.json` | **Modify** — add `past_scans` key |

## Out of Scope

- TrendTimeline.tsx file deletion (still used in StateReturning)
- InsightStrip.tsx file deletion (can clean up later)
- ScanBottomSheet content changes
- State machine logic changes (all 7 states remain as-is)
- Any new data model or Firestore changes
