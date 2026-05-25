# Home Screen: Dynamic Hero + Progress-First — Design

**Date:** 2026-05-25
**Status:** Approved for planning
**Owner:** GlowUp app
**Touches:** `app/(tabs)/index.tsx`, `stores/`, new components under `components/home/`

## Goal

Rework the home screen so it answers two questions on every open:

1. **Am I making progress?** (progress-first: score trend is the visual hero)
2. **What should I do right now?** (dynamic hero: a context-aware action card whose content changes based on scan recency, time of day, and routine state)

Replace the current static layout (big scan CTA → quick actions → small last-scan card → decorative insights grid) with a layout that rewards repeat opens.

## Non-goals

- No redesign of the scan flow, results screen, or routine screen.
- No new AI calls or Firestore schema changes beyond the additive fields below.
- No paywall / monetisation surface changes.
- No new chart library — sparkline is hand-rolled SVG.

## Final layout (top to bottom)

```
┌─────────────────────────────────────┐
│ Header (time-aware greeting + avatar)│
├─────────────────────────────────────┤
│ Score Trend Card  (hero, if scans≥1)│
├─────────────────────────────────────┤
│ Streak Strip                        │
├─────────────────────────────────────┤
│ Dynamic Action Card  (state-aware)  │
├─────────────────────────────────────┤
│ Quick Actions  (product · routine)  │
├─────────────────────────────────────┤
│ Contextual Micro-Tip (concern-aware)│
└─────────────────────────────────────┘
```

The decorative "Daily Insights" 2×2 grid in the current file is **removed**.
The static "Daily Tip" card (hardcoded "Hydrate from within") is **replaced** by a contextual micro-tip that rotates daily and filters by the user's top skin concern.

## Components

All new components live in `components/home/`. Each is a pure presentational component receiving props — no direct store access — so they're trivially testable with mock data.

### 1. `HomeHeader`

**Props:** `{ name: string; greeting: string; onAvatarPress: () => void }`

Renders the existing header layout but accepts `greeting` as a prop instead of pulling from i18n directly. Parent computes the time-aware greeting.

**Greeting rule (in parent, see `getGreeting()`):**

| Local hour | Greeting key |
|---|---|
| 5–11 | `home_greeting_morning` ("Good morning") |
| 12–16 | `home_greeting_afternoon` ("Good afternoon") |
| 17–21 | `home_greeting_evening` ("Good evening") |
| 22–4 | `home_greeting_night` ("Glowing up tonight") |

Add four i18n keys to `en` and `hi` namespaces.

### 2. `ScoreTrendCard`

**Props:** `{ currentScore: number; previousScore: number | null; history: number[]; onPress: () => void }`

- Renders only when at least one scan exists (parent guards).
- Big numeric current score (Fraunces 700, 48px), terracotta `#E07856`.
- Delta badge to the right of the score:
  - `previousScore === null` → hide badge, show subtitle "Your baseline · scan again to see your trend".
  - `delta > 0` → green pill `▲ +N` on `#DCFCE7` / `#4ADE80` text.
  - `delta < 0` → amber pill `▼ N` on `#FEF3C7` / `#D97706` text. (Not red — we're not punishing.)
  - `delta === 0` → neutral pill `— same` on `#F5F5F4` / `#78716C`.
- Sparkline: inline `react-native-svg` `<Polyline>`, 80×28, terracotta stroke 2px, no fill, no axes. Last 7 points max. Hidden when `history.length < 2`.
- Subtitle text:
  - delta > 0 → "Glow up since last scan"
  - delta < 0 → "Small dip — let's bounce back"
  - delta === 0 → "Holding steady"
  - no previous → baseline copy above
- Tap → `/(tabs)/progress`.
- Visual: white card, 24px radius, soft shadow matching the current "Last Scan" card.
- Enter animation: `FadeInDown.springify()` no delay.

### 3. `StreakStrip`

**Props:** `{ streakDays: number; scansThisWeek: number; routineConsistencyPct: number }`

Three pills in a horizontal row, equal flex, on `#FFF5EE` background or transparent:

- 🔥 `Day {streakDays}` — hidden if `streakDays === 0`.
- 📸 `{scansThisWeek} scan{s} this week` — always shown ("0 scans this week" is fine, nudges action).
- ✅ `{routineConsistencyPct}% routine` — hidden if user has never marked a routine step (i.e., `useRoutineStore.completions` is empty).

Pills: 12px radius, `rgba(224,120,86,0.08)` bg, 13px PlusJakartaSans 600, deep-brown text.

### 4. `DynamicActionCard`

**Props:** `{ state: HeroState; onPrimaryPress: () => void }`

Where `HeroState` is a discriminated union (see Data section). Renders one of five variants. The card is always the same outer shell — 32px radius, 24–32px padding, full-width — but background, copy, icon, and CTA change per state.

**State → rendering:**

| State | Bg | Icon | Title | Subtitle | CTA route |
|---|---|---|---|---|---|
| `first-scan` | `#E07856` (terracotta) | 🔍 | "Scan your skin" (Fraunces 26px white) | "Takes 30 seconds" | `/scan` |
| `routine-in-progress` | `#FBF2E0` (warm sand) | 🌿 | "Morning routine" / "Evening routine" | "{done} of {total} done" + progress bar | `/routine` |
| `stale-scan` | `#FFEFE3` (soft cream) | ✨ | "Time to re-scan" | "It's been {N} days. See how you're doing." | `/scan` |
| `fresh-scan` | `#FFEFE3` | 🎯 | "Today's focus" | `{top_concern}` from last scan | `/routine` |
| `default-rescan` | white, terracotta border | 🔍 | "Scan again" | "Track your progress" | `/scan` |

Animation: spring scale on press (existing pattern, value `0.97` damping `15`).

### 5. `ContextualTipCard`

**Props:** `{ tip: MicroTip; onMarkDone: () => void; isDone: boolean }`

Where `MicroTip` is:

```ts
interface MicroTip {
  id: string;
  emoji: string;
  category: string;         // "Sun Protection", "Hydration", etc.
  title: string;
  body: string;
  concerns: SkinConcern[];  // which concerns this tip is relevant to
}

type SkinConcern = 'acne' | 'darkSpots' | 'dryness' | 'aging' | 'dullness' | 'general';
```

**Behavior:**

- Shows one tip per day, selected by the user's `top_concern` from their last scan.
- Selection logic (pure function in `lib/home/selectDailyTip.ts`):
  1. Filter tip pool by user's concern. If no scan exists or concern doesn't match any tags, use `general` tips.
  2. Deterministic daily pick: `filteredTips[dayOfYear % filteredTips.length]`. No randomness — same tip all day, different tip tomorrow.
- Card header shows the concern context: e.g., "🟤 For your dark spots" or "✨ Daily glow tip" (for `general`).
- "Mark as done ✓" button:
  - Tapping toggles a checkmark and saves the tip ID + date to `useRoutineStore.completions[today].tips`.
  - Visual: when done, the card fades to 60% opacity with a ✓ overlay. Still readable but clearly completed.
  - Counts toward streak and `weeklyConsistency` calculation.
- Card visual: same warm sand bg `#FBF2E0`, 20px radius, 20px padding. Matches the existing Daily Tip card aesthetic. Concern header in 11px uppercase (like other section headers).
- Enter animation: `FadeInDown.delay(stagger).springify()` matching other cards.

**Tip pool:** stored in `data/tips.json` — a flat JSON array of ~30 `MicroTip` objects. Authored in English, i18n keys for `hi` namespace added to `i18n/hi.json`. Each tip tagged with 1–3 concerns.

Sample entries:

```json
[
  {
    "id": "spf-morning",
    "emoji": "☀️",
    "category": "Sun Protection",
    "title": "Apply SPF 30+ every morning",
    "body": "Even on cloudy days, UV rays penetrate and cause premature aging and dark spots.",
    "concerns": ["darkSpots", "aging", "general"]
  },
  {
    "id": "vitc-serum",
    "emoji": "🍊",
    "category": "Brightening",
    "title": "Vitamin C before sunscreen",
    "body": "Applying vitamin C serum under SPF doubles UV protection and fades spots over 4-6 weeks.",
    "concerns": ["darkSpots", "dullness"]
  },
  {
    "id": "niacinamide-acne",
    "emoji": "🧪",
    "category": "Acne Care",
    "title": "Niacinamide controls oil",
    "body": "5% niacinamide serum reduces sebum production and minimizes pores without irritation.",
    "concerns": ["acne"]
  }
]
```

Full pool of ~30 tips authored during implementation, covering all 6 concern tags with at least 4 tips each. `general` tips have broad advice (hydration, sleep, diet) relevant to everyone.

### 6. Existing components reused

- `ScoreCircle` — not used on home anymore (its job is taken by `ScoreTrendCard`'s big numeral). Still used on progress/results screens.
- `AmbientBlobs` — keep.
- Quick action tiles (Product · Routine) — extract into `components/home/QuickActionTile.tsx` since the same pattern recurs, but visual is unchanged.

### 7. Home screen orchestrator

`app/(tabs)/index.tsx` becomes thin. Its job:

1. Read stores: `useUserStore`, `useScanStore`, `useRoutineStore` (new).
2. Call `getGreeting()` and `selectHeroState()` helpers.
3. Compose components with derived data.
4. Trigger `useUserStore.tickStreak()` once on mount.

No layout logic, no state computation in JSX — both helpers are pure functions in `lib/home/`.

## Data dependencies

### `lib/home/selectHeroState.ts` (new)

```ts
type HeroState =
  | { kind: 'first-scan' }
  | { kind: 'routine-in-progress'; period: 'am' | 'pm'; done: number; total: number }
  | { kind: 'stale-scan'; daysSince: number }
  | { kind: 'fresh-scan'; topConcern: string }
  | { kind: 'default-rescan' };

function selectHeroState(args: {
  scanCount: number;
  daysSinceLastScan: number | null;
  lastScanTopConcern: string | null;
  nowHour: number;
  routineToday: { am: { done: number; total: number }; pm: { done: number; total: number } };
}): HeroState
```

**Precedence (first match wins):**

1. `scanCount === 0` → `first-scan`
2. `nowHour ∈ [5,11]` AND `routineToday.am.done < routineToday.am.total` → `routine-in-progress` (am)
3. `nowHour ∈ [18,23]` AND `routineToday.pm.done < routineToday.pm.total` → `routine-in-progress` (pm)
4. `daysSinceLastScan !== null && daysSinceLastScan > 7` → `stale-scan`
5. `daysSinceLastScan !== null && daysSinceLastScan < 1 && lastScanTopConcern !== null` → `fresh-scan`
6. else → `default-rescan`

If a fresh scan exists but `top_concern` is missing/empty (older results, parse failure), we fall through to `default-rescan` rather than rendering a card with an empty subtitle.

This is a pure function, fully unit-testable. All branches covered by tests.

### `stores/useScanStore.ts` — additive selectors

Add (do not change existing shape):

```ts
daysSinceLastScan(): number | null
scansInLastNDays(n: number): number
scoreHistoryLastN(n: number): number[]  // most recent N scores, oldest first
```

Confirm `scanHistory` is sorted desc by `createdAt`. If not, sort on insert.

### `stores/useUserStore.ts` — additive fields

Extend the persisted user profile:

```ts
streak: {
  current: number;          // consecutive day count
  lastOpenedAt: string;     // ISO date YYYY-MM-DD (local)
}
```

Action `tickStreak()`:

- Compute today's local `YYYY-MM-DD`.
- If `lastOpenedAt === today` → no-op.
- Else if `lastOpenedAt === yesterday` → `current += 1`, `lastOpenedAt = today`.
- Else → `current = 1`, `lastOpenedAt = today` (strict reset — one miss resets).

Persist to Firestore `users/{uid}.streak` via the existing user-sync path.

### `stores/useRoutineStore.ts` — NEW

```ts
type DateKey = string; // YYYY-MM-DD local

interface RoutineStore {
  completions: Record<DateKey, { am: string[]; pm: string[]; tips: string[] }>;
  toggleStep(date: DateKey, period: 'am' | 'pm', stepId: string): void;
  markTipDone(date: DateKey, tipId: string): void;
  todayProgress(amStepIds: string[], pmStepIds: string[]): {
    am: { done: number; total: number };
    pm: { done: number; total: number };
  };
  weeklyConsistency(amStepIds: string[], pmStepIds: string[]): number; // 0..100
}
```

- Persisted to `AsyncStorage` via Zustand `persist` middleware (already used by other stores — confirm pattern).
- `weeklyConsistency`: over the last 7 local dates, `(stepsDone / stepsExpected) * 100`, rounded. Tip completions count as one bonus step per day (1 if done, 0 if not).
- The step IDs for AM/PM come from the routine screen — pass them in rather than coupling the store to routine content.
- `markTipDone`: appends `tipId` to `completions[date].tips` (idempotent — no-op if already present).
- Firestore sync is out of scope for this spec (local-only first). Schema field reserved at `users/{uid}/routineCompletions/{YYYY-MM-DD}` for a future sync task.

### `lib/home/selectDailyTip.ts` (new)

```ts
function selectDailyTip(args: {
  tips: MicroTip[];
  userConcern: SkinConcern | null;  // from last scan's top_concern, null if no scan
  dayOfYear: number;                // 1–366
}): MicroTip
```

1. Filter `tips` where `concerns` includes `userConcern`. If `userConcern` is null or yields 0 results, filter by `'general'` instead.
2. Pick: `filtered[dayOfYear % filtered.length]`.
3. Deterministic — same tip all day, rotates tomorrow.

Pure function, unit-testable. No date logic inside — caller passes `dayOfYear`.

### `lib/home/getGreeting.ts` (new)

Pure function: `(hour: number) => 'morning' | 'afternoon' | 'evening' | 'night'`. Caller resolves the i18n key.

## File map

**New:**

- `components/home/HomeHeader.tsx`
- `components/home/ScoreTrendCard.tsx`
- `components/home/Sparkline.tsx`
- `components/home/StreakStrip.tsx`
- `components/home/DynamicActionCard.tsx`
- `components/home/QuickActionTile.tsx`
- `components/home/ContextualTipCard.tsx`
- `lib/home/selectHeroState.ts`
- `lib/home/selectDailyTip.ts`
- `lib/home/getGreeting.ts`
- `data/tips.json` (~30 tips tagged by concern)
- `stores/useRoutineStore.ts`
- `__tests__/selectHeroState.test.ts`
- `__tests__/selectDailyTip.test.ts`
- `__tests__/useUserStore.streak.test.ts`
- `__tests__/useRoutineStore.test.ts`

**Modified:**

- `app/(tabs)/index.tsx` — rewritten as a thin orchestrator (~80 lines, down from 237).
- `stores/useScanStore.ts` — add three selectors.
- `stores/useUserStore.ts` — add `streak` field + `tickStreak()`.
- `i18n/en.json`, `i18n/hi.json` — add greeting keys + new copy keys.

## Test plan

Unit tests (Jest, no RN runtime needed for pure functions):

- `selectHeroState`: one test per precedence branch, plus a "morning with completed routine falls through" case, plus "evening with no scans stays first-scan".
- `getGreeting`: boundary tests at hour 4/5, 11/12, 16/17, 21/22.
- `useUserStore.tickStreak`: same day (no-op), consecutive day (increment), gap day (reset), first-ever tick.
- `useRoutineStore`: toggle round-trips, `markTipDone` idempotency, `todayProgress` math, `weeklyConsistency` over a partial week (including tip bonus step).
- `selectDailyTip`: filters by concern, falls back to `general`, deterministic pick via dayOfYear modulo, handles empty pool edge case.

Component-level snapshot tests are not required; the value is in the helpers.

Manual QA checklist:

- Fresh install → first-scan state shown, general tip displayed.
- Complete a scan → fresh-scan state for ~24h, then default-rescan. Tip switches to concern-specific.
- Set device clock forward 9 days → stale-scan state.
- Set device clock to 8am with one incomplete AM step → routine-in-progress (am).
- Open app two days in a row → streak shows "Day 2"; skip a day → resets to "Day 1".
- Tap "Mark as done ✓" on tip → card fades, checkmark shown. Reopening app same day → still shows done.
- Open app on two consecutive days → different tip shown each day.

## Open questions deferred (not blockers)

- Firestore sync for `useRoutineStore` completions — local-only for v1, sync in a follow-up.
- Forgiving streak rule (one miss/week allowed) — punted in favor of strict per user decision.
- Localised sparkline / number formatting for Hindi — current scope uses Western digits everywhere, matching existing screens.

## Visual constraints (from DESIGN.md)

- Terracotta primary `#E07856`, cream bg `#FFF5EE`, deep-brown text `#2D1810` — unchanged.
- Fraunces for headings, Plus Jakarta Sans for body, Hind for Hindi — unchanged.
- Ambient blur blobs remain (`AmbientBlobs` component, `pointerEvents="none"`).
- Page enter: `FadeInDown` on the hero card, stagger `idx * 80ms` on subsequent sections.
- Spring scale `0.97` damping `15` on every tappable card press.
