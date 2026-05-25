# Expo Push Notifications — Design Spec

**Date:** 2026-05-25
**Status:** Draft — awaiting review before implementation
**Approach:** Hybrid (local scheduling + Firebase Cloud Functions)

---

## 1. Overview

Add push notifications to GlowUp to drive re-engagement and routine adherence. Three notification types:

| Type | Delivery | Personalization Source | Cadence |
|---|---|---|---|
| **Routine reminders** | Local (expo-notifications) | User's routine from `useRoutineStore` | Daily AM/PM at default times |
| **Re-scan nudges** | Server (Cloud Functions → FCM) | Last scan date from Firestore | Every 30 days after last scan |
| **Skin type tips** | Server (Cloud Functions → FCM) | `skinType` + `mainConcern` from Firestore | 2-3x per week |

## 2. Architecture

```
┌─────────────────────────────────────────────────────┐
│  Client (Expo App)                                  │
│                                                     │
│  ┌──────────────────┐   ┌────────────────────────┐  │
│  │ NotificationSvc  │   │ useNotificationStore   │  │
│  │ (lib/notifs.ts)  │   │ (Zustand)              │  │
│  │                  │   │                        │  │
│  │ • registerToken  │   │ • permissionStatus     │  │
│  │ • scheduleLocal  │   │ • routineReminders: on │  │
│  │ • handleTap      │   │ • tipsEnabled: on      │  │
│  │ • cancelAll      │   │ • reminderTimes        │  │
│  └────────┬─────────┘   └────────────────────────┘  │
│           │                                         │
│           │ Expo Push Token                         │
└───────────┼─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  Firestore                                          │
│                                                     │
│  users/{uid}/                                       │
│    pushToken: string                                │
│    pushTokenUpdatedAt: timestamp                    │
│    notificationPrefs: {                             │
│      routineReminders: bool                         │
│      tipsEnabled: bool                              │
│      rescanNudges: bool                             │
│      reminderTimeAM: "08:00"                        │
│      reminderTimePM: "20:00"                        │
│      timezone: "Asia/Kolkata"                       │
│      language: "en" | "hi"                          │
│    }                                                │
│    lastScanAt: timestamp                            │
│    skinType: string                                 │
│    mainConcern: string                              │
│                                                     │
│  users/{uid}/notificationLog/{logId}                │
│    type: "routine" | "tip" | "rescan"               │
│    sentAt: timestamp                                │
│    tapped: bool                                     │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  Firebase Cloud Functions (Node.js)                 │
│                                                     │
│  functions/                                         │
│    src/                                             │
│      index.ts                                       │
│      sendRescanNudge.ts    (scheduled: daily)       │
│      sendSkinTip.ts        (scheduled: MWF)         │
│      onTokenWrite.ts       (Firestore trigger)      │
│    tips/                                            │
│      en.json               (tip content by type)    │
│      hi.json                                        │
│    package.json                                     │
│    tsconfig.json                                    │
└─────────────────────────────────────────────────────┘
```

## 3. Prerequisites

| Requirement | Detail |
|---|---|
| **Firebase Blaze plan** | Cloud Functions require pay-as-you-go billing. Free tier covers ~2M invocations/month — sufficient for MVP. |
| **EAS Dev Build** | `expo-notifications` does not work in Expo Go (since SDK 53). All testing requires `eas build --profile development`. |
| **APNs key (iOS)** | Upload a `.p8` key from Apple Developer to Firebase Console → Project Settings → Cloud Messaging. |
| **google-services.json (Android)** | Download from Firebase Console with FCM enabled, place in project root. |
| **app.json / app.config.js** | Add `expo-notifications` plugin config and Android notification icon. |

## 4. Client-Side Implementation

### 4.1 Package Installation

```bash
npx expo install expo-notifications expo-device expo-constants
```

### 4.2 Notification Service — `lib/notifications.ts`

Single module that owns all notification logic:

- **`registerForPushNotifications()`** — check permissions, request if needed, get Expo push token, save to Firestore `users/{uid}/pushToken`. Fire analytics events `push_optin_prompt` (#35) and `push_optin_response` (#36) per existing analytics plan.
- **`scheduleRoutineReminders(timeAM, timePM)`** — cancel existing local schedules, create two daily repeating local notifications using `Notifications.scheduleNotificationAsync` with `trigger: { hour, minute, repeats: true }`.
- **`cancelRoutineReminders()`** — cancel all locally scheduled notifications.
- **`handleNotificationTap(response)`** — extract `data.type` and `data.route` from notification payload, call `router.push(route)`.
- **`refreshToken()`** — on app foreground, check if token changed, update Firestore if so.

### 4.3 Android Notification Channels

Register at app start in `app/_layout.tsx`:

| Channel ID | Name | Description |
|---|---|---|
| `routine-reminders` | Routine Reminders | Daily skincare routine alerts |
| `skin-tips` | Skin Tips | Personalized skincare advice |
| `rescan-nudges` | Re-scan Reminders | Monthly skin scan follow-ups |

```ts
Notifications.setNotificationChannelAsync('routine-reminders', {
  name: 'Routine Reminders',
  importance: Notifications.AndroidImportance.HIGH,
  sound: 'default',
});
```

### 4.4 Zustand Store — `stores/notificationStore.ts`

New dedicated store (not extending `useUserStore` — separation of concerns):

```ts
interface NotificationState {
  permissionStatus: 'undetermined' | 'granted' | 'denied';
  routineRemindersEnabled: boolean;
  tipsEnabled: boolean;
  rescanNudgesEnabled: boolean;
  reminderTimeAM: string; // "08:00"
  reminderTimePM: string; // "20:00"

  setPermissionStatus: (s: PermissionStatus) => void;
  toggleRoutineReminders: () => void;
  toggleTips: () => void;
  toggleRescanNudges: () => void;
  setReminderTime: (period: 'AM' | 'PM', time: string) => void;
}
```

Persisted via `zustand/middleware` persist to AsyncStorage. Synced to Firestore `notificationPrefs` on change.

### 4.5 Permission Request Flow

Do **not** prompt during onboarding. Request permission **after the first scan result** when the user has context for why notifications matter.

Flow:
1. User completes first scan → results screen
2. After viewing results, show a soft-ask bottom sheet: "Get tips for your [skin type] skin and reminders to track your glow-up?"
3. If user taps "Enable" → trigger OS permission prompt → fire analytics #35/#36
4. If user taps "Maybe later" → dismiss, offer again from Profile settings

### 4.6 Deep Linking on Tap

Each notification carries a `data` payload with a target route:

| Notification Type | Tap Route | Screen |
|---|---|---|
| Routine reminder | `/(tabs)` | Home (routine section) |
| Skin tip | `/(tabs)/tips` | Tips screen |
| Re-scan nudge | `/scan` | Scan screen |

Handled in `app/_layout.tsx` via `Notifications.addNotificationResponseReceivedListener`.

### 4.7 Notification Settings UI

Add a "Notifications" section to the Profile screen (`app/(tabs)/profile.tsx`):

- Toggle: Routine Reminders (on/off)
- Toggle: Skin Tips (on/off)
- Toggle: Re-scan Nudges (on/off)
- Time pickers: AM reminder time, PM reminder time
- All toggles sync to both Zustand and Firestore

Minimal UI for v1 — just toggles and time inputs. No complex scheduling.

## 5. Server-Side Implementation

### 5.1 Cloud Functions Directory

```
functions/
  src/
    index.ts              — exports all functions
    sendRescanNudge.ts    — scheduled daily at 10:00 UTC
    sendSkinTip.ts        — scheduled MWF at 09:00 UTC
    onTokenWrite.ts       — Firestore trigger on pushToken write
    utils/
      sendNotification.ts — wrapper around Expo Push API
      tipContent.ts       — loads tip by skinType + language
  tips/
    en.json               — { "oily": ["tip1", ...], "dry": [...] }
    hi.json               — Hindi translations
  package.json
  tsconfig.json
```

### 5.2 Re-scan Nudge Function

Runs daily. Queries users where:
- `lastScanAt` is > 30 days ago
- `notificationPrefs.rescanNudges` is true
- `pushToken` exists

Sends via Expo Push API:
```json
{
  "to": "<ExpoPushToken>",
  "title": "Time for a skin check-in",
  "body": "It's been a month — scan again to see your progress!",
  "data": { "type": "rescan", "route": "/scan" },
  "channelId": "rescan-nudges"
}
```

Writes to `notificationLog` subcollection for analytics.

### 5.3 Skin Tip Function

Runs Mon/Wed/Fri. For each user with `tipsEnabled: true`:
- Read `skinType` and `mainConcern` from profile
- Read `language` from `notificationPrefs`
- Pick a tip from `tips/{language}.json` keyed by skin type
- Track which tips have been sent (avoid repeats) via `notificationLog`
- Send via Expo Push API

### 5.4 Expo Push API (not FCM directly)

Since the app uses Expo, use the [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/) which handles both APNs and FCM routing. This avoids needing separate FCM/APNs server logic.

```ts
// functions/src/utils/sendNotification.ts
import fetch from 'node-fetch';

export async function sendExpoPush(token: string, message: ExpoPushMessage) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: token, ...message }),
  });
}
```

## 6. i18n

- **Local notifications:** read language from `useUserStore.language`, construct title/body in code using i18next translations.
- **Server notifications:** read `notificationPrefs.language` from Firestore, load corresponding tip JSON.
- **System notification tray:** uses system font (not Hind/Fraunces). This is expected — native OS limitation.

## 7. Timezone Handling

- **Local routine reminders:** `expo-notifications` local triggers use device timezone automatically. No server involvement needed.
- **Server-sent notifications:** store `timezone` in `notificationPrefs` (set on token registration, updated on app foreground). Cloud Functions use it to avoid sending at inappropriate hours.
- **Edge case:** if user changes timezone, update on next app open via `Intl.DateTimeFormat().resolvedOptions().timeZone`.

## 8. Analytics

Wire existing planned events (from `docs/analytics-tracking-plan.md`):

| Event | When | Properties |
|---|---|---|
| `push_optin_prompt` (#35) | OS permission dialog shown | `prompt_context`: `post_scan` / `profile` |
| `push_optin_response` (#36) | User grants or denies | `granted`: boolean |

New events to add:

| Event | When | Properties |
|---|---|---|
| `notification_received` | Notification delivered (client) | `type`, `notificationId` |
| `notification_tapped` | User taps notification | `type`, `route`, `notificationId` |
| `notification_setting_changed` | User toggles a preference | `setting`, `enabled` |

## 9. Firestore Schema Delta

Add to `users/{uid}`:

```
pushToken: string                    // Expo push token
pushTokenUpdatedAt: Timestamp        // Last token refresh
notificationPrefs: {
  routineReminders: boolean          // default: true
  tipsEnabled: boolean               // default: true
  rescanNudges: boolean              // default: true
  reminderTimeAM: string             // default: "08:00"
  reminderTimePM: string             // default: "20:00"
  timezone: string                   // e.g., "Asia/Kolkata"
  language: string                   // "en" | "hi"
}
```

Add subcollection `users/{uid}/notificationLog/{logId}`:

```
type: string                         // "routine" | "tip" | "rescan"
title: string
body: string
sentAt: Timestamp
tapped: boolean                      // updated on tap
tappedAt: Timestamp | null
```

## 10. Open Questions / Risks

### Routine Reminders May Cause Churn

The existing [payments-and-paywall-report.md](../../payments-and-paywall-report.md) and [analytics-tracking-plan.md](../../analytics-tracking-plan.md) explicitly warn that daily routine reminders cause churn for verdict/scan-based apps. The user chose to include them despite this caution.

**Recommendation:** Ship with routine reminders defaulting to ON, but monitor the notification opt-out rate post-launch. If >20% of users disable routine reminders within 14 days, consider switching the default to OFF or reducing frequency to every-other-day.

### Token Expiry / Revocation

Expo push tokens can expire when a user uninstalls and reinstalls, or when the OS revokes them. The `refreshToken()` call on app foreground handles this. Server-side, if Expo Push API returns a `DeviceNotRegistered` error, remove the token from Firestore to avoid wasting sends.

### Rate Limiting

For MVP, the send volume is low (tips 3x/week, re-scan 1x/month). No rate limiting needed. Revisit if user base exceeds 10K.

## 11. Testing Strategy

- **Dev build required** — `expo-notifications` does not work in Expo Go. Use `eas build --profile development` for testing.
- **Local notifications:** testable on simulator/emulator with dev build.
- **Server notifications:** use Firebase emulator suite (`firebase emulators:start`) to test Cloud Functions locally. Use Expo's push notification tool (https://expo.dev/notifications) to send test pushes.
- **E2E:** test permission flow, notification tap deep linking, preference toggle sync.

## 12. Implementation Order

1. Install `expo-notifications` + configure `app.json`
2. Create `lib/notifications.ts` service
3. Create `stores/notificationStore.ts`
4. Register Android channels in `app/_layout.tsx`
5. Add permission request flow (post-first-scan soft-ask)
6. Add notification tap handler + deep linking
7. Schedule local routine reminders
8. Add notification settings to Profile screen
9. Set up `functions/` directory with Cloud Functions
10. Implement re-scan nudge function
11. Implement skin tip function with i18n content
12. Wire analytics events
13. Test on dev builds (iOS + Android)
