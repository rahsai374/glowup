# GlowUp — Mobile Analytics Tracking Plan (Meta + Google)

**Prepared for:** Rahul (founder, GlowUp)
**Date:** 25 May 2026
**Scope:** Mobile only — iOS + Android (Expo SDK 54). Web/landing-page tracking is out of scope until a web funnel exists.
**Sibling doc:** `docs/payments-and-paywall-report.md` — the funnel below mirrors §2.6 / Part 4 of that report. Don't re-litigate paywall placement here; treat it as fixed.

---

## Part 1 — Objectives and what we're optimizing for

The primary objective is **running paid acquisition on Meta** (Reels + Stories + Feed, Indian women 18–34, English+Hindi creatives) and a smaller Google Ads spend, and being able to optimize those campaigns on **actual revenue events — trial_start, subscription_purchase, affiliate_link_tap — not vanity install counts.** Everything downstream of that goal (which SDKs, which events, which standard names, which server-side relays) is in service of one thing: making Meta's algorithm pick the right users for us at the lowest CAC.

The secondary objective is **product analytics for the founder's own funnel decisions** — every step in §2.6 of the payments report needs an event so we can answer "where are users falling out, and is the paywall converting at the ≥4–8% target?" GA4 + Firebase Analytics gives us this for free.

We are explicitly NOT optimizing for install volume, MAU vanity metrics, time-in-app, or anything that doesn't tie back to either revenue (subscription) or affiliate commission (Hypothesis B from the payments report). The market context — India is a downloads market, not a paid market — makes this even more important: if we optimize Meta on `install`, we will pile up cheap installs from users who will never pay. We have to optimize on the **trial_start** and **subscription_purchase** events from day one.

---

## Part 2 — Funnel events to track

The table below is the source of truth. Every event has one canonical name used identically across Meta App Events SDK and GA4 / Firebase Analytics unless Meta requires a specific standard event name (flagged). When the name must differ, we still send the GA4 version under our canonical name AND fire the Meta standard event as a second call from the same code path — the wrapper module in §3.5 handles this.

Conventions:
- `snake_case` event names, `snake_case` parameters.
- Currency is always ISO 4217 (`INR`).
- Every monetary parameter is a number in major units (rupees), not paise. `value: 99`, not `value: 9900`.
- Every event carries `language` (`en` | `hi`), `app_version`, `platform` (`ios` | `android`) as super-properties (set once via SDK user properties).
- Authenticated events carry `user_id` (Firebase UID), set via `setUserId` on both SDKs.
- Events that will later be sent server-side from Razorpay webhooks (Part 4) are flagged "DEDUP". Those events MUST carry a client-generated `event_id` (UUIDv4) so the server-side event can deduplicate via the same ID.

| # | Canonical event | When it fires | Key parameters | Meta event (standard?) | Key conversion? | Dedup client+server (v2)? |
|---|---|---|---|---|---|---|
| 1 | `first_open` | First app launch after install (Firebase auto-collects) | `source`, `medium`, `campaign` (from install referrer on Android, SKAdNetwork postback on iOS) | `fb_mobile_activate_app` (auto by FB SDK) | No (volume metric only) | No |
| 2 | `language_select` | User taps Hindi or English on Language screen | `language` | Custom (`Language_Select`) | No | No |
| 3 | `onboarding_start` | First onboarding slide rendered | — | Custom (`Onboarding_Start`) | No | No |
| 4 | `onboarding_slide_view` | Each of the 3 intro slides viewed | `slide_index` (0/1/2) | Custom | No | No |
| 5 | `auth_otp_request` | User taps "Send OTP" | `phone_country` (`IN`) | Custom | No | No |
| 6 | `auth_otp_verified` | OTP verified, Firebase user created | `is_new_user` (bool) | `CompleteRegistration` (standard) — fire only when `is_new_user=true` | **Yes (registration optimization)** | No |
| 7 | `onboarding_question_completed` | User taps Next on Q1–Q5 | `question_id` (`q1_concern` … `q5_age`), `answer_key`, `question_index` (1–5), `is_required` (bool) | Custom (`Onboarding_Q_Complete`) | No (but Q5 is a soft milestone) | No |
| 8 | `onboarding_complete` | Q5 (or last optional Q) finished, lands on Home | `questions_answered_count` (1–5), `time_in_onboarding_sec` | Custom | No | No |
| 9 | `home_view` | Home screen mounted | `last_scan_score` (nullable), `scan_count_to_date` | Custom | No | No |
| 10 | `scan_initiated` | User taps the Scan CTA on Home | `entry_point` (`home_cta` \| `empty_state` \| `rescan_prompt`) | Custom | No | No |
| 11 | `selfie_capture_start` | Camera or gallery surface opened | `source` (`camera` \| `gallery`) | Custom | No | No |
| 12 | `selfie_capture_complete` | Photo confirmed by user, compression starts | `source`, `file_size_kb` | `ViewContent` (standard) with `content_type=skin_scan_input` | No (mid-funnel signal) | No |
| 13 | `scan_processing_start` | Gemini API call begins | `scan_id` (UUID), `q1_concern`, `q2_skin_type` | Custom | No | No |
| 14 | `scan_processing_complete` | Gemini response parsed, Firestore write succeeded | `scan_id`, `duration_ms`, `overall_score`, `skin_age`, `top_concern_key` | Custom | No | No |
| 15 | `scan_processing_failed` | Gemini error, parsing error, or Firestore write failure | `scan_id`, `error_code`, `stage` | Custom | No | No |
| 16 | `score_reveal` | Free reveal screen shown — overall score + radar silhouette + headline | `scan_id`, `overall_score`, `top_concern_key` | `ViewContent` (standard) with `content_type=score_reveal` | **Yes** (this is the activation event — the proxy for "user got value") | No |
| 17 | `paywall_view` | Paywall sheet rendered | `scan_id`, `paywall_variant` (`v1_two_plan`), `hypothesis_variant` (`A_sub` \| `B_affiliate` \| `AB_both`), `price_monthly` (99), `price_oneshot` (49), `currency` (`INR`) | `InitiateCheckout` (standard) with `value=0` (intent only) | **Yes** (top-of-paywall-funnel optimization audience) | No |
| 18 | `paywall_cta_tap` | User taps a plan button on the paywall | `scan_id`, `plan_id` (`monthly_99_trial3` \| `oneshot_49`), `cta_position` (`primary` \| `secondary`) | `InitiateCheckout` (standard) with `value=price`, `currency=INR`, `content_ids=[plan_id]` | **Yes** | DEDUP (also fired server-side from Razorpay `payment.created`) |
| 19 | `paywall_dismiss` | User closes paywall without picking a plan | `scan_id`, `dismiss_reason` (`backdrop` \| `close_button` \| `system_back`) | Custom | No | No |
| 20 | `razorpay_checkout_open` | Razorpay sheet handed control | `plan_id`, `payment_method` (when known: `upi` \| `card` \| `netbanking`), `order_id` | Custom | No | No |
| 21 | `razorpay_checkout_dismissed` | User closed Razorpay sheet without paying | `plan_id`, `order_id` | Custom | No | No |
| 22 | `mandate_setup_complete` | UPI Autopay / card eMandate mandate created (Razorpay returns `subscription.activated`) | `plan_id`, `payment_method`, `subscription_id` | Custom | No (mandate ≠ first debit) | DEDUP (server-side is canonical) |
| 23 | `trial_start` | First charge succeeds AND it's a trial plan (free for 3 days) | `plan_id`, `subscription_id`, `predicted_ltv` (set to 299 — see §4.7), `currency` | `StartTrial` (standard) | **Yes (primary Meta optimization event)** | DEDUP (server-side is canonical — see Part 4) |
| 24 | `subscription_purchase` | Trial converts OR direct paid purchase | `plan_id`, `subscription_id`, `value` (99 / 49 / etc.), `currency`, `is_trial_conversion` (bool) | `Subscribe` (standard) + `Purchase` (standard) — fire **both**; Subscribe is canonical for subscription apps, Purchase is for ad sets optimized on the older standard | **Yes (primary revenue event)** | DEDUP (server-side is canonical) |
| 25 | `subscription_renewal` | Subsequent successful debit (month 2+) | `plan_id`, `subscription_id`, `value`, `currency`, `renewal_number` (2, 3, …) | `Purchase` (standard, custom event_name=`Subscription_Renewal`) | Yes (LTV signal) | DEDUP (server-side only — client may not be open) |
| 26 | `subscription_payment_failed` | Razorpay debit failed | `plan_id`, `subscription_id`, `failure_reason`, `attempt_number` | Custom | No | DEDUP (server-side only) |
| 27 | `subscription_cancel` | User cancels (in-app or 24-hr pre-debit window) | `plan_id`, `subscription_id`, `cancel_reason` (`user_inapp` \| `user_predebit` \| `nps_low` \| `bank_rejected`), `was_in_trial` (bool) | Custom | Yes (for churn audiences) | DEDUP (server-side only — Razorpay `subscription.cancelled` is canonical) |
| 28 | `refund_issued` | We push a refund or Razorpay processes a dispute | `subscription_id`, `value`, `currency`, `refund_reason` | Custom | No (but **must** be subtracted from Purchase value reporting) | DEDUP (server-side only) |
| 29 | `results_full_view` | Post-paywall, full Results screen with 10 metrics + skin age + advice shown | `scan_id`, `is_first_paid_view` (bool) | Custom | No (activation milestone) | No |
| 30 | `routine_view` | Routine screen shown | `scan_id`, `routine_section` (`morning` \| `night` \| `weekly` — fire once per section view) | Custom | No | No |
| 31 | `product_card_view` | A product recommendation card scrolls into view (≥50% visible for ≥1s) | `scan_id`, `product_sku`, `product_brand`, `product_price`, `position_index` | `ViewContent` (standard) with `content_type=product`, `content_ids=[sku]`, `value=price`, `currency=INR` | Yes (Hypothesis B optimization) | No |
| 32 | `affiliate_link_tap` | User taps the "Buy on Nykaa/Amazon" link on a product card | `scan_id`, `product_sku`, `product_brand`, `product_price`, `retailer` (`nykaa` \| `amazon` \| `purplle`), `affiliate_url_hash` | `AddToCart` (standard) with `value=price`, `currency=INR` — proxy for intent | **Yes (Hypothesis B revenue event)** | DEDUP if/when affiliate networks return server-side postbacks (v2+) |
| 33 | `affiliate_purchase_confirmed` | Affiliate network postback says the user bought | `scan_id`, `product_sku`, `commission_value`, `currency` | `Purchase` (standard, custom event_name=`Affiliate_Purchase`) with `value=commission_value` | Yes (true Hypothesis B revenue) | DEDUP (server-side only — affiliate postback is canonical) |
| 34 | `rescan_initiated` | User starts a 2nd+ scan | `previous_scan_id`, `days_since_last_scan`, `scan_number` (2, 3, …) | Custom | Yes (retention proxy — gates the subscription value prop) | No |
| 35 | `push_optin_prompt` | OS push permission prompt shown | `prompt_context` (`onboarding` \| `post_scan` \| `routine`) | Custom | No | No |
| 36 | `push_optin_response` | User responds to the OS prompt | `granted` (bool) | Custom | No | No |
| 37 | `att_prompt_shown` | iOS App Tracking Transparency prompt shown | `prompt_context`, `prompt_version` | Custom | No | No |
| 38 | `att_prompt_response` | User responds to ATT prompt | `granted` (bool), `status` (`authorized` \| `denied` \| `restricted` \| `not_determined`) | Custom (also set FB SDK `setAdvertiserTrackingEnabled`) | No | No |
| 39 | `consent_prompt_shown` | DPDP consent layer shown (see §5.1) | `consent_version` | Custom | No | No |
| 40 | `consent_choice` | User accepts / rejects analytics consent | `analytics_consent` (bool), `ads_consent` (bool), `consent_version` | Custom (also set Firebase consent mode + FB SDK setDataProcessingOptions) | No | No |
| 41 | `app_active_d1` | First app open 1 day after install (Firebase auto: `user_engagement` ≥ Day 1) | — | Custom (server-side, computed from `first_open`) | No | No (server-derived) |
| 42 | `app_active_d7` | Same, Day 7 | — | Custom | No | No |
| 43 | `app_active_d30` | Same, Day 30 | — | Custom | No | No |

A few callouts on the table that matter:

- **`score_reveal` is the activation event**, not `scan_processing_complete`. Processing complete fires when the API returns; reveal fires when the user actually sees the screen. We optimize Meta on the latter when we don't yet have enough paywall_view / trial_start volume to optimize on those directly (typical first 2–4 weeks of a new campaign).
- **`paywall_view` carries `hypothesis_variant`** so we can split the Meta audiences and the funnel reporting between Hypothesis A (subscription) and Hypothesis B (affiliate) without re-instrumenting. If we A/B-test paywall variants later, that's a separate `paywall_variant` param.
- **`subscription_purchase` fires BOTH `Subscribe` AND `Purchase`** in Meta. This is intentional: `Subscribe` is the right standard event for subscription apps and supports `predicted_ltv` for value optimization, but Meta's older ad sets and lookalike seed audiences are built on `Purchase`. Firing both gives the ad team flexibility without doubling reported revenue, because Meta's Events Manager deduplicates by `event_id` when configured.
- **Affiliate events (#31–#33) are Hypothesis B's instrumentation.** The payments report's Part 4 explicitly says ship Hypothesis A and B in parallel — these events are what makes that real. Without them we will end week 4 unable to answer "commission-per-scan vs subscription-ARPU-per-scan", which is the actual MVP question.
- **D1/D7/D30 retention (#41–43)** is best computed server-side from BigQuery exports of Firebase Analytics, not client-side. Firebase auto-collects `user_engagement` and `session_start`; a daily BigQuery query gives you the rolled-up cohort retention without instrumenting anything in the app.

---

## Part 3 — v1 plan (ship in week 1)

**Goal:** client-side-only instrumentation good enough to launch Meta and Google Ads campaigns and read the §2.6 hypotheses. No server-side relay, no Conversions API, no Measurement Protocol. Get data flowing first; v2 hardens it.

### 3.1 Accounts to create — Meta side (do in this order)

1. **Meta Business Manager** at [business.facebook.com](https://business.facebook.com) — create one Business account under the founder's primary Facebook account. Add a backup admin (a co-founder, a trusted advisor, or a second account of your own — losing access to a solo-admin Business Manager is a months-long recovery).
2. **Meta Ads Manager** is created automatically inside the Business when you add a payment method. Add an INR card; Meta will charge in INR with GST.
3. **Meta App** at [developers.facebook.com/apps](https://developers.facebook.com/apps) — create a new app, type "Consumer" or "Business". This produces an **`app_id`** and an **`app_secret`** (server-only — never embed). In Settings → Basic, set the iOS Bundle ID (`com.glowup.app`) and Android Package Name (`com.glowup.app`) and add the Android key hash.
4. **Client Token** at App → Settings → Advanced → Security → Client Token. **You need this for the FB SDK on mobile (SDK 13+ requires it).** Treat it as not-public-but-not-server-grade. [react-native-fbsdk-next docs](https://github.com/thebergamo/react-native-fbsdk-next).
5. **Connect the app to your Business** — App Dashboard → Settings → Basic → Business Manager → assign your Business.
6. **Events Manager → Data Sources → Connect App.** This creates a **`dataset_id`** for your app. The dataset is what receives App Events from the SDK and what Ads Manager points campaigns at for optimization.
7. **iOS-specific in Events Manager:** App → Settings → iOS → enable "Advertiser Tracking" and "Advertiser ID Collection". Then under **Aggregated Event Measurement**, add and rank up to 8 events. (Meta announced in June 2025 that AEM no longer requires manual prioritization for many ad accounts and processes all eligible events; however the priority list is still respected when present and is the safe default. [Conversios on AEM 2025](https://www.conversios.io/blog/meta-aggregated-event-measurement/), [Singular on AEM](https://www.singular.net/blog/meta-aggregated-event-measurement/).) Recommended priority order:
   1. `Subscribe` (highest — paid revenue)
   2. `StartTrial`
   3. `Purchase` (for affiliate purchases)
   4. `AddToCart` (affiliate_link_tap proxy)
   5. `InitiateCheckout` (paywall_cta_tap)
   6. `ViewContent` (score_reveal)
   7. `CompleteRegistration`
   8. `fb_mobile_activate_app` (install)
8. **Conversion API access token** at Events Manager → Settings → Conversions API → "Generate access token". Save it now even though it's for v2 — generating tokens has rate limits and is annoying to do under deadline pressure.

### 3.2 Accounts to create — Google side

1. **Firebase project** at [console.firebase.google.com](https://console.firebase.google.com). You already have one for Auth/Firestore — reuse it. Verify the Google Analytics property got auto-created when the Firebase project was created; if not, link a new GA4 property under Project Settings → Integrations → Google Analytics.
2. **Register both apps:** iOS app (bundle `com.glowup.app`) and Android app (package `com.glowup.app`). Download `GoogleService-Info.plist` and `google-services.json`. **Place them in the repo root** (gitignored — pull from a private secrets bucket on CI) and reference from `app.json` via the React Native Firebase config plugin (see §3.5).
3. **GA4 property** — should be linked. Under Admin → Data streams, confirm one iOS stream and one Android stream exist with the right App IDs. Note the **Measurement ID** (`G-XXXXXX`) for each — needed for v2 Measurement Protocol.
4. **Google Ads account** at [ads.google.com](https://ads.google.com). Even if we're not running Google Ads in week 1, create the account and link it to GA4 (GA4 → Admin → Product links → Google Ads). This makes GA4 conversions instantly available as Google Ads conversion actions when you do start.
5. **Mark conversions in GA4.** GA4 → Admin → Events → toggle "Mark as conversion" for: `auth_otp_verified` (CompleteRegistration), `score_reveal`, `paywall_view`, `paywall_cta_tap`, `trial_start`, `subscription_purchase`, `subscription_renewal`, `affiliate_link_tap`, `affiliate_purchase_confirmed`, `rescan_initiated`.

### 3.3 SDKs to install (Expo SDK 54, RN 0.81.5, React 19)

The stack uses the **Firebase JS SDK** (v12.13.0) for Auth/Firestore — this SDK **does not support Analytics on React Native**. We need to add `@react-native-firebase/analytics` for analytics specifically. We can keep using Firebase JS SDK for Auth/Firestore (the two coexist fine; some teams later migrate to RNFirebase for all modules, but that's not required to ship analytics).

```
# Meta SDK
react-native-fbsdk-next@^13.3.x        # Expo config plugin; FB SDK 17+ under the hood; supports Expo SDK 54

# React Native Firebase (for analytics only — keep JS SDK for the rest)
@react-native-firebase/app@^23.x       # required peer of any RNFirebase module
@react-native-firebase/analytics@^23.x

# Install referrer for Android (Play Install Referrer API — needed for Google Ads attribution)
expo-tracking-transparency@~6.0.x      # iOS ATT prompt + getTrackingPermissionsAsync (already Expo-maintained)

# Optional but recommended for typed event names + a single call site
zod@^3.x                               # already a strong fit for the event-schema module in §3.5
```

Versions chosen for compatibility with RN 0.81.5 + Expo 54 + React 19 as of May 2026. Pin via `expo install` so Expo's compatibility table resolves the right minors. **All three native modules require a development build (EAS Build with `expo-dev-client`) — none of this works in Expo Go.** The project will need its first `expo prebuild` + EAS dev build at this point; see [Expo SDK 54 changelog](https://expo.dev/changelog/sdk-54) and the [react-native-fbsdk-next Expo config docs](https://deepwiki.com/thebergamo/react-native-fbsdk-next/2.3-expo-configuration).

**`app.json` plugin block** (add to existing `plugins` array — don't replace it):

```jsonc
"plugins": [
  // ...existing...
  [
    "react-native-fbsdk-next",
    {
      "appID": "<META_APP_ID>",
      "clientToken": "<META_CLIENT_TOKEN>",
      "displayName": "GlowUp",
      "scheme": "fb<META_APP_ID>",
      "advertiserIDCollectionEnabled": true,
      "autoLogAppEventsEnabled": true,
      "isAutoInitEnabled": true,
      "iosUserTrackingPermission": "We use this to measure how well our ads find people like you, and to make GlowUp better. We never sell your data."
    }
  ],
  [
    "@react-native-firebase/app",
    {
      "ios_googleServicesFile": "./GoogleService-Info.plist",
      "android_googleServicesFile": "./google-services.json"
    }
  ],
  "@react-native-firebase/analytics",
  [
    "expo-build-properties",
    {
      "ios": { "useFrameworks": "static" }
    }
  ]
]
```

The `useFrameworks: static` line is required for RNFirebase on iOS with RN 0.81+ / Expo 54+ — without it, the build fails with linker errors. See [Sakib-3883's Expo 54 RNFirebase guide](https://medium.com/@sakibul15.3883/native-firebase-sdk-integration-for-expo-react-native-app-ios-android-in-2026-using-expo-0d08f230fff1).

### 3.4 iOS specifics

**ATT prompt (NSUserTrackingUsageDescription).** Add to `app.json` under `ios.infoPlist`:

```jsonc
"ios": {
  "bundleIdentifier": "com.glowup.app",
  "infoPlist": {
    "NSUserTrackingUsageDescription": "We use this to measure how well our ads find people like you, and to make GlowUp better. We never sell your data.",
    "SKAdNetworkItems": [
      { "SKAdNetworkIdentifier": "v9wttpbfk9.skadnetwork" },   // Meta
      { "SKAdNetworkIdentifier": "n38lu8286q.skadnetwork" },   // Meta (alt)
      { "SKAdNetworkIdentifier": "cstr6suwn9.skadnetwork" },   // Google
      { "SKAdNetworkIdentifier": "4fzdc2evr5.skadnetwork" }    // Google (alt)
      // Add more from https://developer.apple.com/app-store/skadnetwork/ as needed
    ]
  }
}
```

The full SKAdNetwork ID list for major networks lives in each network's documentation; copying the 30+ commonly-cited IDs is overkill for week 1 but doesn't hurt — Apple ignores unrecognized IDs.

**ATT timing.** Do **not** show the ATT prompt on app launch. Show it **right before the first `scan_processing_start`**, framed as "to personalize your scan and make recommendations better". This more than doubles opt-in vs cold prompts on first open. Fire `att_prompt_shown` before the iOS sheet, then `att_prompt_response` after, and call `Settings.setAdvertiserTrackingEnabled(true)` on the FB SDK only if the user authorized — otherwise the SDK will only send AEM-eligible events with no IDFA.

**SKAdNetwork conversion value setup.** Use a simple SKAN 4 schema given the trial-driven funnel ([RevenueCat SKAN guide](https://www.revenuecat.com/blog/growth/skadnetwork-guide-subscription-apps/), [Apphud on SKAN 4](https://apphud.com/blog/skadnetwork-4-for-subscription-apps)). Recommended fine-grained values for the **first postback (0–2 days)**:

- 0 — install only (no scan)
- 5 — `score_reveal` (free activation)
- 15 — `paywall_view`
- 25 — `paywall_cta_tap`
- 40 — `trial_start`
- 50 — `subscription_purchase` (one-shot ₹49 purchase or instant paid sub)

For the **second postback (3–7 days)** use coarse value bucketing on `trial_start → subscription_purchase` conversion (low / medium / high based on whether trial converted). The **third postback (8–35 days)** picks up `subscription_renewal`. The FB SDK manages SKAN conversion values automatically if `autoLogAppEventsEnabled=true` and the standard events are firing correctly — you don't have to hand-roll `SKAdNetwork.updatePostbackConversionValue` calls unless you want finer control.

**AEM event prioritization** — already listed in §3.1. Re-confirm the priority order in Events Manager after the SDK starts sending events; Meta won't show the priority editor until it sees events come in.

### 3.5 Android specifics

**Google Advertising ID post Android 13.** Add the `com.google.android.gms.permission.AD_ID` permission via the FB SDK config plugin (it does this automatically as of `react-native-fbsdk-next` 13+). Apps targeting Android 13+ that read GAID without declaring this permission silently get zeros, killing attribution. Verify in the merged AndroidManifest after `expo prebuild`.

**Install Referrer.** Required for Google Ads (and helpful for Meta cross-device attribution). RNFirebase Analytics integrates the Play Install Referrer API automatically. Confirm by running a Play Store internal-test install via a UTM-tagged Play link and checking `first_open` in DebugView includes `source`/`medium`/`campaign`.

**Google Play Billing is NOT in scope.** We're using Razorpay, not in-app subscriptions, so Google Play Billing rules don't apply. There's an open Play Policy question for digital subscriptions in India — Razorpay's stance is that scan/report content sold via the app falls under "ancillary digital services" and is exempt from the Play 30% cut, but **the founder should re-verify before launch** with Razorpay's compliance team. This is out of scope for analytics but worth flagging here.

### 3.6 Event module — file layout (don't write code, just lay out where it goes)

```
lib/
  analytics/
    index.ts              # public surface: track(), identify(), setConsent(), reset()
    events.ts             # typed event union (zod schemas) — one schema per row of §2 table
    providers/
      meta.ts             # FB SDK wrapper — handles standard-event mapping + dedupe IDs
      firebase.ts         # RNFirebase Analytics wrapper
    consent.ts            # consent state + DPDP layer wiring; gates providers
    superProps.ts         # language, app_version, platform, user_id — set on identify()
    ids.ts                # event_id generator (UUIDv4) + scan_id passthrough
  // ...existing lib/...
```

**The typed-event pattern.** Every event in §2 is a zod schema. The public `track()` function accepts only a discriminated union of those schemas — no string event names, no untyped params dictionary. This means:

- adding an event is one PR that adds one schema entry and the call site;
- removing or renaming a parameter is a TypeScript build error everywhere it's used;
- the param dictionary that goes to Meta vs Firebase is computed from the schema, so the standard-event-name mapping in `providers/meta.ts` is the only place where Meta vs GA4 naming differs.

Don't put `analytics.track('paywall_view', {...})` everywhere — that's how naming drifts. Put `track(events.paywallView({ scanId, hypothesisVariant, priceMonthly: 99, priceOneshot: 49 }))` and let the schema enforce the rest.

### 3.7 QA — validate before going live

**Meta Events Manager → Test Events** (top-right of Events Manager). Install your dev build on a device that has the Facebook app installed and logged in. In the SDK init, set:

```ts
Settings.setAppID('<META_APP_ID>');
Settings.setClientToken('<META_CLIENT_TOKEN>');
Settings.initializeSDK();
// Test events tab will show a "Test event code" — pass it via:
AppEventsLogger.logEvent('ScoreReveal', { fb_test_event_code: '<CODE>' });
```

Walk the full funnel (onboarding → scan → paywall → trial) and confirm every event lands in Test Events with correct params and the right standard-event mapping.

**Firebase DebugView.** Enable on a device:

```bash
adb shell setprop debug.firebase.analytics.app com.glowup.app
# iOS: pass -FIRDebugEnabled argument scheme in Xcode dev build
```

Walk the funnel again and confirm every event lands in DebugView (real-time, ~10s lag).

**Validation checklist before flipping live ads:**

1. Every event in §2 fires exactly once per intended trigger (no double-fires, no silent skips).
2. `scan_id` carries through from `scan_processing_start` to `affiliate_link_tap` — same UUID across all per-scan events. This is the single most important attribute for funnel debugging.
3. `event_id` is set on every DEDUP-flagged event and is a UUIDv4 (not the `scan_id`).
4. `setUserId` is called immediately after `auth_otp_verified` on both Meta and Firebase. Before that point, all events are anonymous (Meta App-Set ID, Firebase install ID).
5. On iOS, with ATT denied, Meta events still send but without IDFA — confirm in Events Manager that events show "Limited Data Use" / AEM tagging.
6. Consent flow (§5.1) gates both SDKs — declining analytics consent stops events from being sent (not just dropped at the server).

### 3.8 Engineering estimate for v1

| Workstream | Days |
|---|---|
| Meta + Firebase account setup, Events Manager config, AEM priority, SKAdNetwork IDs | 0.5 |
| Add SDKs, config plugins, first successful EAS dev build on iOS and Android | 1 |
| `lib/analytics/` module + zod schemas for all 40+ events | 1.5 |
| Wire all 40+ events into existing screens (most are 1-line `track()` calls) | 2 |
| ATT prompt UX + timing + handling | 0.5 |
| Consent layer (DPDP — see §5.1) — minimal v1 acceptance screen | 0.5 |
| QA pass — Meta Test Events + Firebase DebugView walkthrough | 1 |
| Buffer for native build issues (FB SDK + RNFirebase on Expo 54 has known sharp edges) | 1 |
| **Total** | **8 engineering days** |

8 days is realistic for a single competent React Native developer who has shipped Expo + FB SDK + RNFirebase before. Add 50% if this is their first Expo dev-build setup.

---

## Part 4 — v2 plan (ship in weeks 3–4 after v1 data is flowing)

**Goal:** stop letting iOS ATT and missed-when-app-closed events undercount us. Move every revenue event server-side and dedupe with client. The single biggest win in this entire plan is wiring **Razorpay webhooks → server → Meta Conversions API + GA4 Measurement Protocol** for `trial_start`, `subscription_purchase`, `subscription_renewal`, `subscription_cancel`, `refund_issued`. Client-side purchase events on iOS undercount by 30–60% post-ATT; the server-side path doesn't.

### 4.1 Pick the server-side path

Two options for Meta CAPI on App Events:

- **Conversions API Gateway (CAPI Gateway).** Meta-managed AWS deployment; effectively a no-code relay. $10–$400/mo hosting. Best for v1.5 / non-technical teams. Limited to documented event mappings; harder to attach `predicted_ltv` and custom params reliably. [Meta CAPI Gateway setup docs](https://developers.facebook.com/documentation/ads-commerce/gateway-products/conversions-api-gateway/setup).
- **Custom server endpoint.** A Cloudflare Worker or Firebase Cloud Function (we're already going to need one for the Gemini key migration per `PLAN.md` Phase 4) that receives Razorpay webhooks, looks up the user, and POSTs to both Meta CAPI (`graph.facebook.com/<API_VERSION>/<DATASET_ID>/events`) and GA4 MP (`google-analytics.com/mp/collect`). Total control over `event_id`, advanced matching, and value attribution.

**Recommendation: custom server (Cloudflare Workers).** Justification:
1. We're building the Razorpay webhook handler anyway — it has to verify signatures, update Firestore subscription state, and trigger our own backend logic (refund flows, user state, etc.). Bolting two more HTTPS POSTs onto that handler is ~2 hours of work.
2. CAPI Gateway is built for e-commerce websites, not subscription mobile apps. Documentation for App Events via CAPI Gateway is thin; community reports of `predicted_ltv` not surfacing correctly are common.
3. Cloudflare Workers gives us hashed advanced matching (§4.4) trivially via Web Crypto API. Same Worker can host the Gemini proxy.
4. CAPI Gateway billing ($10–$400/mo) isn't huge but it's a recurring cost with no upside vs Workers' free tier at our volume.

If the founder absolutely doesn't want to operate any server infrastructure for v2, CAPI Gateway is the fallback. It's worse but it ships.

### 4.2 Razorpay webhooks → server → Meta CAPI + GA4 MP

Subscribe to the following Razorpay webhook events ([Razorpay Subscriptions Webhooks](https://razorpay.com/docs/webhooks/subscriptions/), [Razorpay All Webhooks](https://razorpay.com/docs/webhooks/all/)):

| Razorpay webhook | Triggers canonical event | Notes |
|---|---|---|
| `subscription.activated` | `mandate_setup_complete` | Mandate exists; not yet a paid signal |
| `subscription.charged` | First time: `trial_start` (if trial plan) OR `subscription_purchase` (if direct paid). Subsequent: `subscription_renewal` | The handler differentiates by checking `subscription.charge_count` |
| `subscription.completed` | informational | End-of-life of a fixed-count plan; ignore for tracking |
| `subscription.cancelled` | `subscription_cancel` | Carry `cancel_reason` from API response or our DB |
| `subscription.paused` / `subscription.resumed` | Custom (`Subscription_Paused` / `Subscription_Resumed`) | Not key conversions |
| `subscription.halted` | `subscription_payment_failed` (after final retry) | Important churn signal |
| `payment.captured` (filtered to `notes.purpose=oneshot_unlock`) | `subscription_purchase` (one-shot ₹49 SKU) | One-shot purchases don't come through subscription webhooks |
| `refund.processed` | `refund_issued` | Subtract value from prior Purchase reporting |

For each handler invocation:
1. Verify webhook signature (`X-Razorpay-Signature` HMAC-SHA256 with webhook secret).
2. Look up the `user_id` and the **client-generated `event_id`** that we stored in Firestore when the user tapped the paywall CTA (the client passes its `event_id` to Razorpay as a note on the order; we read it back from the webhook payload). If absent (e.g. server-only renewal), generate a fresh server-side `event_id` for the row.
3. POST to **Meta CAPI**: `POST https://graph.facebook.com/v21.0/{DATASET_ID}/events?access_token={CAPI_TOKEN}` with `event_name`, `event_time`, `event_id`, `action_source: "app"`, `app_data` block (FB anonymous ID + advertiser tracking enabled flag if we stored it), `user_data` block (hashed email/phone — see §4.4), `custom_data` block (value, currency, content_ids, predicted_ltv).
4. POST to **GA4 Measurement Protocol**: `POST https://www.google-analytics.com/mp/collect?firebase_app_id={APP_ID}&api_secret={MP_SECRET}` with `app_instance_id` (from the original client install — stored in Firestore on first login), event name, and params. Must arrive within 48 hours of the original client-side timestamp to be joinable with client-side events. ([GA4 MP for app streams](https://firebase.google.com/codelabs/firebase_mp), [GA4 MP docs](https://developers.google.com/analytics/devguides/collection/protocol/ga4).)
5. Update Firestore with the postback receipts (`meta_capi_received_at`, `ga4_mp_received_at`) for debugging undercounts.

### 4.3 Event deduplication

Meta dedupes by `(event_name, event_id)` within 48 hours. GA4 doesn't have explicit dedup but is timestamp-aware. The rule:

- Client-side fires `paywall_cta_tap` and `subscription_purchase` events with a UUIDv4 `event_id` that the client also writes to the Razorpay order metadata (as `notes.event_id`).
- Server-side (from the webhook) fires the same events with the **same `event_id`** pulled from the order notes.
- Meta sees both, dedupes, keeps the one with richer user_data (almost always the server one because it carries hashed PII).

For events that fire only server-side (`subscription_renewal`, `subscription_cancel`, `refund_issued`), the server generates the `event_id` and no client counterpart exists. No dedup needed; Meta accepts.

### 4.4 Advanced Matching

In every CAPI POST, send hashed identifiers in the `user_data` block:

- `em` — SHA-256 of lowercased trimmed email (if we ever collect it — currently we only have phone)
- `ph` — SHA-256 of E.164 phone number (we have this from Firebase Phone Auth — strip `+` per Meta spec, then SHA-256)
- `external_id` — SHA-256 of Firebase UID
- `client_ip_address` — from request headers
- `client_user_agent` — from request headers

This pushes match rate from ~50% to ~85%+ and directly improves Meta optimization signal — particularly important because Indian users have very low IDFA opt-in. Compute hashes inside the Cloudflare Worker using Web Crypto (don't send plaintext PII to Meta even once). Use the same hashed `external_id` on GA4 MP as the `user_id` parameter for cross-tool joinability.

### 4.5 Audiences to build

Build these in Meta Ads Manager → Audiences → Create → Custom Audience → App Activity (and the GA4 equivalent in Admin → Audiences for Google Ads):

| Audience | Definition | Used for |
|---|---|---|
| **Paywall-view, no-trial** | `paywall_view` in last 30d AND no `trial_start` in last 30d | Retargeting ads showing a different paywall variant or a discount |
| **Trial-no-paid** | `trial_start` in last 30d AND no `subscription_purchase` in last 30d | Last-3-day-of-trial retargeting ads |
| **Churned payers** | `subscription_cancel` in last 90d, was previously `subscription_purchase` in last 180d | Win-back ads with a re-offer |
| **Scan-completers, no paywall-view** | `score_reveal` in last 14d AND no `paywall_view` in last 14d | Diagnose: are these users hitting a paywall bug or bouncing pre-paywall? Probably exclude as ad audience until investigated |
| **Affiliate clickers, no purchase** | `affiliate_link_tap` in last 30d AND no `affiliate_purchase_confirmed` in last 30d | Hypothesis B nurture — likely a no-op until commission data flows reliably |

### 4.6 Lookalike seed audiences

Lookalikes are only as good as the seed. For India, with low data volume in early weeks, Meta recommends seed audiences of 1,000+ to build a 1% lookalike. Build these once you have the volume:

- **Purchasers (any)** — anyone with `subscription_purchase` in last 180 days. Primary seed once you cross ~500 paid users (Meta lets you build below 1000 but quality degrades).
- **High-LTV users** — define as users who paid `subscription_renewal` ≥ 2 (i.e., made it past the first auto-renew). Given the 30% UPI Autopay success rate documented in the payments report, these users are the most valuable in the funnel. Wait until you have 200+ before seeding.
- **Affiliate purchasers** — anyone with `affiliate_purchase_confirmed`. Only seed if Hypothesis B is the winning model.

Don't bother seeding on `trial_start` alone — it pulls in tire-kickers who started a trial and immediately cancelled in the 24-hour pre-debit window.

### 4.7 `predicted_ltv` for Subscribe events

Meta's `Subscribe` event supports a `predicted_ltv` parameter for value optimization. Set it to a conservative number based on payments-report assumptions:

- ₹99/month × 30% UPI renewal success × an assumed 6-month-mean tenure for users who survive month 1 = **~₹180 expected LTV per `Subscribe` event**.
- Until we have actual cohort retention, hardcode `predicted_ltv: 180` in the Subscribe payload. Update the constant once month-3 retention data exists (week 12+).

### 4.8 Engineering estimate for v2

| Workstream | Days |
|---|---|
| Cloudflare Worker scaffold (or extend existing Gemini-proxy Worker) | 0.5 |
| Razorpay webhook handler — signature verification, Firestore subscription state machine | 2 |
| Meta CAPI POST module — event_id passthrough, hashed user_data, payload validation | 1.5 |
| GA4 MP POST module — same | 1 |
| Dedup verification (Events Manager → Diagnostics shows dedup stats per event_id) | 0.5 |
| ATT-denied flow QA — confirm CAPI events still report value correctly without IDFA | 0.5 |
| Audiences built in Meta + GA4 | 0.5 |
| Buffer | 1.5 |
| **Total** | **8 engineering days** |

Cumulative v1 + v2: **~16 engineering days** (~3 weeks calendar time for a part-time dev or 2 weeks full-time).

---

## Part 5 — Open questions / risks

### 5.1 DPDP Act consent — **ship a layer in v1, not v2**

India's Digital Personal Data Protection Rules were notified on **November 13, 2025**. The 12-month grace period for Consent Manager registration ends **November 13, 2026** and substantive compliance becomes mandatory **May 13, 2027** ([EY DPDP guide](https://www.ey.com/en_in/insights/cybersecurity/decoding-the-digital-personal-data-protection-act-2023), [Respectlytics DPDP for mobile apps](https://respectlytics.com/blog/india-dpdp-act-mobile-app-compliance/)). Penalties are **up to ₹250 crore per violation category** — non-trivial even for an MVP.

The DPDP Act has no "legitimate interest" basis for analytics processing. **You cannot send analytics events about an Indian user without explicit, granular, revocable consent.** This is stricter than GDPR.

**Recommendation: ship a minimal consent layer in v1**, not v2. Concretely:

- After language pick, before onboarding slides, show a one-screen consent prompt: two toggles — "Analytics to improve the app" (default off), "Personalized ads via Meta/Google" (default off) — and an "Accept all" / "Continue" pair.
- Default-off is the safer DPDP posture; expect 50–70% acceptance with good copy.
- Persist consent state to Firestore (`users/{uid}/consent`) + AsyncStorage (for pre-auth).
- Gate both SDKs: if `analyticsConsent=false`, do not initialize FB SDK / RNFirebase Analytics at all (don't just drop events client-side — the SDKs do background telemetry on init).
- Use Firebase Analytics consent mode (`setConsent({analyticsStorage: 'granted' | 'denied', adStorage: ...})`) and FB SDK `setDataProcessingOptions([])` vs `setDataProcessingOptions(['LDU'], 1, 1000)` for the denied case.
- Make consent revocable in Profile → Privacy. The DPDP Act explicitly requires this.

The engineering cost of doing this in v1 is small (0.5 day). The cost of bolting it on in v2 after we've trained Meta on uncontested data is much higher — every reconfiguration loses learning. Ship it once, ship it correctly.

**The legal risk if we ship without:** the DPDP Act is enforced by the Data Protection Board of India. Enforcement on Indian-incorporated SMBs has been slow but is escalating. A consumer complaint about a wellness app collecting facial images plus skin-condition data without consent is exactly the kind of high-publicity test case the Board will prioritize. The reputational risk to a beauty/wellness app from a DPDP enforcement action would be terminal at our scale.

### 5.2 iOS ATT opt-in rate assumption

Industry average ATT opt-in sits at **35%** in Q2 2025 (Adjust), with significant category variation — gaming peaks at 50%, education at 14%, and lifestyle/health apps typically land 20–30% ([Business of Apps ATT data](https://www.businessofapps.com/data/att-opt-in-rates/), [Adjust ATT 2025 benchmarks](https://www.adjust.com/blog/att-opt-in-rates-2025/)). For an Indian-women-facing wellness app, **plan for 20–25% opt-in.**

**What happens if it's <25%:**
- Meta App Events with no IDFA still get processed via AEM (privacy-preserving aggregate measurement) so they don't disappear — they just lose per-user attribution.
- SKAdNetwork covers install attribution regardless of ATT.
- Per-user lookalikes built off iOS users degrade because of the smaller seed.
- **The v2 server-side CAPI path is the mitigation.** With hashed phone + UID matching, Meta can probabilistically attribute installs and conversions even without IDFA, recovering 30–50% of the attribution lost to ATT denial. This is why v2 is non-negotiable, not optional, for a campaign-driven launch.
- Pre-prompt design matters. The current ATT copy in §3.4 ("personalize your scan and make recommendations better") frames as scan improvement, not ad targeting — should bias us toward the higher end of the 20–25% band.

If real opt-in lands below 15% in the first 4 weeks, **stop running campaigns optimized on `trial_start` on iOS specifically and switch iOS ad sets to AEM-only optimization on `Subscribe`.** Don't try to fix opt-in with a more aggressive prompt; the marginal users you'd convert with hard-sell copy are the ones who'll Bad-Review-Bomb the app over it.

### 5.3 Other risks / things that could derail this plan

- **Firebase JS SDK vs RNFirebase coexistence.** We're keeping Firebase JS SDK for Auth/Firestore and adding RNFirebase for Analytics. This works but is unusual — two Firebase initializations, two `firebase.app()` instances. Watch for double-init warnings in the iOS build logs and for `setUserId` divergence (Firestore writes attribute to the JS SDK user; Analytics events attribute to the RNFirebase user). The fix is either (a) use `signInWithCustomToken` to bridge auth state, or (b) bite the bullet and migrate Firestore/Auth/Storage to RNFirebase too. Budget 1–2 extra engineering days if you hit this.
- **Razorpay `event_id` passthrough.** Razorpay's `notes` field on orders / subscriptions accepts arbitrary key-value pairs, but their reliability of returning notes verbatim in webhook payloads has shifted in the past (community reports of truncation on long values). Keep `event_id` under 36 chars (a UUIDv4 is 36); don't stuff extra metadata in there.
- **Bundle size on Android.** FB SDK + RNFirebase Analytics together add ~6–8 MB to the APK. For an Indian audience on cheap Android with 2–4 GB RAM, this matters. Confirm post-prebuild APK size is still under 50 MB; if it creeps above, App Bundle splitting handles it but verify.
- **Affiliate purchase postbacks may not exist for our retailers.** Nykaa Affiliate, Amazon Associates India, and Purplle's affiliate program have varying postback reliability. `affiliate_purchase_confirmed` is the cleanest Hypothesis B signal but may take 2–4 weeks for confirmation to come back from the network. Plan to optimize on `affiliate_link_tap` (the click) for the first month and switch to `affiliate_purchase_confirmed` once confirmation data is flowing.
- **Meta App Review for advanced permissions.** Standard App Events SDK does not require App Review; CAPI does not require App Review. Advanced Matching does not require App Review for App Events (it does for Pixel — this commonly confuses devs). We should not hit any App Review walls. But verify before deadline pressure.
- **Hindi-language event values.** Don't pass Hindi text into Meta or GA4 param values — Meta's event params are best as enum strings (`top_concern_key: "hydration"`, not `top_concern_key: "हाइड्रेशन"`). The `language` super-property is the only place to surface Hindi at all.
- **Tracking removal at user request (DPDP §13 right to erasure).** When a user requests deletion, we must call Firebase Analytics `resetAnalyticsData()`, Meta `Settings.setLimitEventAndDataUsage(true)` + `clearTrackingPreferences()`, and delete the user's row from any custom server logs. Build this into the Profile → Delete Account flow in v1; retrofitting it is painful.

---

## Appendix — Reference URLs

**Meta:**
- [Meta App Events docs](https://developers.facebook.com/docs/app-events/)
- [Meta Conversions API Gateway setup](https://developers.facebook.com/documentation/ads-commerce/gateway-products/conversions-api-gateway/setup)
- [Meta CAPI 2026 guide — DataAlly](https://www.dataally.ai/blog/how-to-set-up-meta-conversions-api)
- [Meta CAPI for app campaigns — RocketShip HQ](https://www.rocketshiphq.com/meta-conversions-api-app-campaign-signal/)
- [RevenueCat × Meta Ads integration](https://www.revenuecat.com/docs/integrations/attribution/meta-ads)
- [AEM 2025 update — Conversios](https://www.conversios.io/blog/meta-aggregated-event-measurement/)
- [AEM coverage — Singular](https://www.singular.net/blog/meta-aggregated-event-measurement/)

**Apple / iOS:**
- [SKAdNetwork ID list — Apple](https://developer.apple.com/app-store/skadnetwork/)
- [SKAdNetwork 4 for subscription apps — Apphud](https://apphud.com/blog/skadnetwork-4-for-subscription-apps)
- [SKAdNetwork 4 for subs — RevenueCat](https://www.revenuecat.com/blog/growth/skadnetwork-guide-subscription-apps/)
- [ATT opt-in rate benchmarks — Business of Apps](https://www.businessofapps.com/data/att-opt-in-rates/)
- [ATT 2025 data — Adjust](https://www.adjust.com/blog/att-opt-in-rates-2025/)

**Google / Firebase:**
- [GA4 Measurement Protocol — Google developers](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GA4 MP for app streams — Firebase Codelab](https://firebase.google.com/codelabs/firebase_mp)
- [GA4 MP sending events](https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events)
- [React Native Firebase Analytics docs](https://rnfirebase.io/analytics/usage)
- [Expo + Firebase guide](https://docs.expo.dev/guides/using-firebase/)
- [Expo + analytics SDK guide](https://docs.expo.dev/guides/using-analytics/)
- [Expo SDK 54 changelog](https://expo.dev/changelog/sdk-54)

**Razorpay webhooks:**
- [Razorpay Subscriptions webhook events](https://razorpay.com/docs/webhooks/subscriptions/)
- [Razorpay all webhook events](https://razorpay.com/docs/webhooks/all/)
- [Subscribe to Razorpay webhooks](https://razorpay.com/docs/payments/subscriptions/subscribe-to-webhooks/)

**SDK packages:**
- [react-native-fbsdk-next GitHub](https://github.com/thebergamo/react-native-fbsdk-next)
- [react-native-fbsdk-next Expo config — DeepWiki](https://deepwiki.com/thebergamo/react-native-fbsdk-next/2.3-expo-configuration)
- [@react-native-firebase/analytics on npm](https://www.npmjs.com/package/@react-native-firebase/analytics)
- [Expo 54 + RNFirebase integration guide](https://medium.com/@sakibul15.3883/native-firebase-sdk-integration-for-expo-react-native-app-ios-android-in-2026-using-expo-0d08f230fff1)

**India DPDP Act:**
- [DPDP Act + Rules guide — EY](https://www.ey.com/en_in/insights/cybersecurity/decoding-the-digital-personal-data-protection-act-2023)
- [DPDP for mobile apps — Respectlytics](https://respectlytics.com/blog/india-dpdp-act-mobile-app-compliance/)
- [DPDP Phase 1 compliance — SecurePrivacy](https://secureprivacy.ai/blog/india-dpdp-act-phase-1)
- [DPDP Consent Management — Hogan Lovells](https://www.hoganlovells.com/en/publications/india-publishes-consent-management-rules-under-digital-personal-data-protection-act)
