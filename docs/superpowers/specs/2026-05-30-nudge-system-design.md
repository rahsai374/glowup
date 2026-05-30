# Nudge System Design — GlowUp Retention Notifications

## 1. Overview

A push notification system that sends three types of nudges to drive user retention:

1. **Routine reminders** — morning/night skincare routine nudges at user-chosen times
2. **Re-engagement nudges** — bring back users who haven't opened the app recently
3. **Personalized tips** — skincare tips based on the user's skin profile and concerns

**Architecture split:** Routine reminders run as **local notifications** (scheduled on-device via `expo-notifications`). Re-engagement and personalized tips run as **Firebase Cloud Functions** that send via FCM.

**Why the split:** Routine reminders need precise user-set times (e.g. 7:15am), work offline, and don't need server logic. Cloud Functions can only fire at cron boundaries and would require querying every user every hour. Re-engagement and tips genuinely need a server — the server must detect lapsed users and select contextual content.

## 2. Prerequisites

These must be in place before any implementation:

| Item | Status | Notes |
|------|--------|-------|
| Firebase Blaze (pay-as-you-go) plan | Needed | Cloud Functions require Blaze |
| `google-services.json` (Android) | Done | Already in project root |
| `GoogleService-Info.plist` (iOS) | Needed | Download from Firebase console, add to `ios/` |
| APNs auth key uploaded to Firebase | Needed | Firebase Console > Project Settings > Cloud Messaging > iOS |
| EAS rebuild | Needed | `expo-notifications` is a native module |

## 3. Firestore Schema Changes

### Modified: `users/{uid}` document

New fields added to the existing user profile document:

```
fcmTokens: [                    // array — user may have multiple devices
  {
    token: "abc123...",
    platform: "android",         // "android" | "ios"
    updatedAt: Timestamp
  }
]

notificationPrefs: {
  enabled: true,                 // master toggle
  routineReminders: true,        // morning/night routine nudges (local)
  reEngagement: true,            // "come back" nudges (cloud)
  tips: true,                    // skincare tips (cloud)
  morningTime: "07:00",          // user-preferred morning reminder (HH:mm)
  nightTime: "21:00",            // user-preferred night reminder (HH:mm)
}

lastNudgedAt: Timestamp          // last cloud nudge sent (for throttling)
```

**No `lastActiveAt` field needed** — `streak.lastOpenedAt` (already exists, format `YYYY-MM-DD`) serves the same purpose for detecting lapsed users.

**No `timezone` field needed** — India-only launch means `Asia/Kolkata` is hardcoded in Cloud Functions. Add per-user timezone later if GlowUp expands internationally.

**No routine storage needed** — routines are deterministic from `skinType` + `topConcern` in scan data. Cloud Functions recompute them at send time using the same `STEP_POOL` logic.

## 4. Client-Side: Notification Setup

### 4.1 Dependencies

```
expo-notifications          — local scheduling + FCM token registration
@react-native-firebase/messaging  — already partially available via @react-native-firebase/app
```

### 4.2 Permission Request Timing

**Request notification permission after the user's first completed scan** — not on app open. At this point the user has invested in the app and understands the value of reminders. Android 13+ requires runtime `POST_NOTIFICATIONS` permission.

Flow:
1. User completes first scan → results screen
2. After viewing results, show a soft-ask modal: "Want daily reminders for your skincare routine?"
3. If yes → trigger OS permission prompt
4. If granted → register FCM token, save to Firestore, schedule local reminders

### 4.3 FCM Token Registration

On permission grant and on every app launch (tokens can rotate):

```
1. Get push token via expo-notifications
2. Get FCM token via @react-native-firebase/messaging
3. Upsert into users/{uid}.fcmTokens[] (add if new, update timestamp if existing)
4. Remove stale tokens: any token not updated in 60 days gets pruned
```

### 4.4 Local Routine Reminders

Scheduled entirely on-device using `expo-notifications`:

- **Morning reminder** — fires daily at `notificationPrefs.morningTime`
- **Night reminder** — fires daily at `notificationPrefs.nightTime`

Content is generated from the latest scan's routine:

| Time | Example notification |
|------|---------------------|
| Morning | "Good morning! Your routine: Cleanse → Tone → Moisturize → SPF" |
| Night | "Wind-down time. Tonight: Oil cleanse → Serum → Night cream" |

**Reschedule when:**
- User changes preferred time in settings
- User completes a new scan (routine steps may change)
- App returns to foreground (refresh in case schedule was lost)

**Skip logic:** If the user already opened the app today before the reminder time, cancel that day's reminder (check `streak.lastOpenedAt === today`).

### 4.5 Deep Linking

Tapping a notification opens the relevant screen:

| Nudge type | Opens | Data payload |
|------------|-------|--------------|
| Routine reminder | `/routine` | `{ tab: "morning" }` or `{ tab: "night" }` |
| Re-engagement | `/scan` | — |
| Tip | `/(tabs)` (home) | `{ tipId: "..." }` for optional highlight |

## 5. Cloud Functions

### 5.1 Function: `sendReEngagementNudges`

**Trigger:** Scheduled cron — runs daily at 12:00 IST (`0 6 * * *` UTC, since IST = UTC+5:30 round to 06:30 UTC → use `30 6 * * *`)

**Logic:**
1. Query `users` where `notificationPrefs.enabled == true` AND `notificationPrefs.reEngagement == true`
2. For each user, compute days since last active: `today - streak.lastOpenedAt`
3. Select message tier:

| Days inactive | Message template |
|---------------|-----------------|
| 3 | "Your skin misses you! Quick scan to check your progress?" |
| 5 | "It's been {n} days — your {skinType} skin routine is waiting for you" |
| 7 | "Your score was {lastScore} last week. Curious what it is now?" |
| 14 | "We've updated tips for {mainConcern}. Come see what's new!" |
| >30 | Don't send (user has churned) |

4. Check throttle: skip if `lastNudgedAt` was within the last 48 hours
5. Send via FCM to all tokens in `fcmTokens[]`
6. Update `lastNudgedAt`
7. Handle `messaging/registration-token-not-registered` errors by removing the stale token

### 5.2 Function: `sendPersonalizedTips`

**Trigger:** Scheduled cron — runs daily at 15:00 IST (`30 9 * * *` UTC)

**Logic:**
1. Query `users` where `notificationPrefs.enabled == true` AND `notificationPrefs.tips == true`
2. For each user, look up their `mainConcern` and `skinType` from profile
3. Select a tip from a curated tip pool (static array, similar to `STEP_POOL`), rotating so the same user doesn't get the same tip twice in a row. Track `lastTipId` on the user doc.
4. Check throttle: skip if `lastNudgedAt` was today (don't stack with re-engagement)
5. Send via FCM
6. Update `lastNudgedAt` and `lastTipId`

**Tip pool structure:**
```typescript
interface Tip {
  id: string;
  skinTypes: SkinType[];      // which skin types this applies to
  concerns: Concern[];         // which concerns this applies to
  title_en: string;            // "Apply moisturizer on damp skin"
  title_hi: string;            // Hindi translation
}
```

### 5.3 Function: `cleanupStaleTokens`

**Trigger:** Scheduled cron — runs weekly

**Logic:** Remove any `fcmTokens[]` entry where `updatedAt` is older than 60 days.

## 6. Notification Preferences Screen

A new screen/section accessible from the Profile tab. Required by Play Store policy — users must be able to opt out from within the app.

**Controls:**
- Master toggle: Enable/disable all notifications
- Routine reminders toggle + time pickers (morning, night)
- Re-engagement nudges toggle
- Skincare tips toggle

**Defaults (on first permission grant):**
- All toggles ON
- Morning: 07:00, Night: 21:00

**Persistence:** Changes are saved to Firestore `notificationPrefs` and (for routine reminders) local notification schedules are immediately rescheduled.

## 7. Throttling & Frequency Rules

| Rule | Details |
|------|---------|
| Max cloud nudges per day | 1 (re-engagement OR tip, not both) |
| Re-engagement cooldown | 48 hours between re-engagement nudges |
| Skip routine reminder | If user already opened app that day before reminder time |
| Churn cutoff | No nudges after 30 days inactive |
| Tip rotation | Don't repeat same tip within 7 days (`lastTipId` tracking) |

## 8. New Analytics Events

| Event | Params | When |
|-------|--------|------|
| `notification_permission_requested` | `{ source: "post_scan" }` | Soft-ask modal shown |
| `notification_permission_granted` | `{ platform }` | OS permission granted |
| `notification_permission_denied` | `{ platform }` | OS permission denied |
| `notification_received` | `{ type, nudge_id }` | Notification delivered |
| `notification_tapped` | `{ type, nudge_id }` | User tapped notification |
| `notification_prefs_changed` | `{ field, value }` | Toggle or time changed |

## 9. Infrastructure & Deployment

### Cloud Functions project structure:
```
functions/
  src/
    index.ts                 — exports all functions
    reEngagement.ts          — sendReEngagementNudges
    personalizedTips.ts      — sendPersonalizedTips
    cleanupTokens.ts         — cleanupStaleTokens
    tipPool.ts               — curated tips data
    routineLogic.ts          — STEP_POOL + getRoutine (ported from client)
  package.json
  tsconfig.json
```

### Deployment:
- `firebase deploy --only functions` from the `functions/` directory
- Environment: Node.js 18 runtime
- Region: `asia-south1` (Mumbai — closest to India users)

### Cost estimate (India-only, early stage):
- Cloud Functions: ~free tier covers up to 2M invocations/month
- FCM: free (no per-message cost)
- Firestore reads: each daily run reads all active users once. At 10K users = 10K reads/day = 300K/month (well within free tier of 50K/day)

## 10. Rollout Plan

**Phase 1 — Local routine reminders (no backend needed)**
- Add `expo-notifications` to the project
- Build permission request flow (post-first-scan)
- Build notification preferences screen
- Schedule morning/night local notifications
- Deep linking on notification tap
- EAS rebuild

**Phase 2 — Cloud Functions for re-engagement**
- Set up Firebase Cloud Functions project
- Implement `sendReEngagementNudges`
- FCM token registration on client
- Token cleanup function
- Upgrade to Blaze plan

**Phase 3 — Personalized tips**
- Build curated tip pool (50+ tips across skin types/concerns)
- Implement `sendPersonalizedTips` function
- Tip rotation tracking

**Future: Gemini-crafted nudges (Approach C layer)**
- Replace static tip pool with Gemini-generated content
- Use scan history for progress-aware messages
- A/B test static vs AI-generated nudge copy
