# Google Play Store Release Checklist

**App:** GlowUp v1.0.0 (`com.glowup.app`)
**Audit date:** 2026-05-28 · **Last updated:** 2026-05-28
**Sources:** Automated security review, code quality review, Play Store config audit

### Progress: 22 / 52 done

| Priority | Total | Done | Remaining |
|----------|-------|------|-----------|
| **P0** | 15 | 10 | 5 |
| **P1** | 11 | 9 | 2 |
| **P2** | 7 | 0 | 7 |
| **P3** | 5 | 3 | 2 |
| **Console** | 9 | 0 | 9 |
| **Config** | 5 | 0 | 5 |
| **Total** | **52** | **22** | **30** |

---

## P0 — Submission Blockers

These MUST be resolved before uploading to Play Store. The app will be rejected or cause critical failures without them.

### Security & Privacy

- [ ] **Move Gemini API key to server-side proxy** — `EXPO_PUBLIC_GEMINI_API_KEY` is bundled in the APK and extractable. Anyone can make unlimited API calls on your billing account. Move to Cloud Functions or Cloudflare Workers. (`lib/gemini.ts:3`)
- [x] **Verify and lock down Firestore security rules** — Rules confirmed in Firebase Console: per-user access only (`request.auth.uid == userId`). Managed in console.
- [x] **Create and host a privacy policy** — Hosted at https://rahsai374.github.io/glowup-legal/ — paste this URL into Play Console > Store Listing > Privacy Policy.
- [ ] **Complete the Data Safety form** — Declare in Play Console: phone number collection, photo collection, Firestore data storage, Gemini API data transmission.

### Crash-Prevention

- [x] **Fix empty `catch {}` in auth flow** — Added error alert and early return so returning users don't get silently routed to `/questions` on network failure. (`app/auth.tsx`)
- [x] **Add ErrorBoundary to root layout** — Exported `ErrorBoundary` with retry button from `app/_layout.tsx`. Uses app design system colors.
- [x] **Break circular import: useUserStore <-> firestore** — Replaced top-level import with lazy `require()` inside `tickStreak()`. (`stores/useUserStore.ts`)
- [x] **Handle font-load failure** — Now checks `fontsError` and hides splash screen on either success or failure, falling back to system fonts. (`app/_layout.tsx`)

### Play Store Policy & Config

- [x] **Verify `targetSdkVersion` >= 35** — Set `targetSdkVersion: 36` and `compileSdkVersion: 36` in `app.json` android config.
- [ ] **Configure Play Integrity API for Firebase Auth** — Phone OTP via `@react-native-firebase/auth` requires Play Integrity attestation in production (SafetyNet is deprecated). Steps: (1) Firebase Console → App Check → Register Android app with Play Integrity provider, (2) Authentication → Settings → App Check → Enforce ON, (3) Play Console → App signing → copy SHA-256 fingerprint, (4) Firebase Console → Project Settings → Add SHA-256 fingerprint + debug keystore SHA-256, (5) `npx expo install @react-native-firebase/app-check` + initialize in `app/_layout.tsx` before auth calls, (6) Add plugin to `app.json`, (7) Deploy app update BEFORE enforcing App Check (or auth breaks). Requires EAS rebuild (native module).
- [ ] **Enable AI content disclosure** — Play policy (effective 2024) requires apps using generative AI to disclose this in the store listing. Toggle "AI-generated content" in Play Console. GlowUp uses Gemini for skin analysis.
- [x] **Add "not medical advice" disclaimer** — Disclaimer exists in `app/results.tsx` line 175-180 with `not_medical` i18n key in both en and hi: "AI estimate only — not medical advice."
- [x] **Remove `RECORD_AUDIO` permission** — Removed from `app.json`. (`app.json`)
- [x] **Add account deletion flow** — Delete account button in `app/(tabs)/profile.tsx` with `rnAuth().signOut()` and deletion policy URL.

### Final Gate

- [ ] **Production build end-to-end test** — Build a production AAB via `eas build --profile production`, install on a physical Android device, and exercise the full flow: onboard -> scan -> results -> share. Most P0 issues (font-load failure, circular import crash, error boundary) only manifest in release-mode bundles, not Metro dev.

---

## P1 — High Priority (Fix before public release)

Won't block submission but will cause bad user experience, crashes, or security issues in production.

### Code Quality

- [x] **Fix `router.back()` called during render** — Moved navigation to `useEffect` so it runs after render, not during it. (`app/share.tsx`)
- [x] **Fix memory leak: interval not cleaned on unmount** — Moved `factIntervalRef` to top of component, added `useEffect` cleanup. (`app/scan.tsx`)
- [x] **Fix logout to clear Firebase Auth session** — `logout()` now calls `rnAuth().signOut()` before clearing Zustand state. (`stores/useUserStore.ts`)
- [x] **Fix `saveProfile` using `setDoc` (full overwrite)** — Changed to `setDoc` with `{ merge: true }` so existing fields (streak, etc.) are preserved. (`lib/firestore.ts`)

### UX Gaps

- [x] **Add StatusBar configuration** — `expo-status-bar` imported and `<StatusBar style="dark" />` rendered in `app/_layout.tsx`.
- [x] **Handle camera permission denial with UI feedback** — Shows "Open Settings" alert when `canAskAgain === false`. (`app/scan.tsx`)
- [x] **Country code now editable** — Defaults to `+91`, user can edit inline. India-only launch documented in CLAUDE.md. (`app/auth.tsx`)
- [x] **Add client-side rate limiting on scan requests** — 30-second cooldown implemented via `SCAN_COOLDOWN_MS` in `app/scan.tsx`.

### Security Hardening

- [ ] **Validate Gemini response with runtime schema** — Response is parsed with `JSON.parse` and cast via `as ScanResult` with zero runtime validation. Malformed responses crash the app. Add Zod or similar validation. (`lib/gemini.ts:122-124`)
- [x] **Add `maxLength` to name input** — Added `maxLength={50}` and strips control characters on change. (`app/questions.tsx`)

### Observability

- [ ] **Add crash reporting (Sentry or Crashlytics)** — No crash reporting is configured. Play Console crash aggregation is too coarse to debug real issues. Without this, the ErrorBoundary gives graceful degradation but no signal about what crashed.

---

## P2 — Medium Priority (Fix before wide release)

### Data Integrity

- [ ] **Add scan history deduplication and size cap** — `addToHistory` unconditionally prepends with no dedup or limit. AsyncStorage has ~6MB limit on Android; unbounded history will eventually fail silently. (`stores/useScanStore.ts:27-28`)
- [ ] **Handle stale `file://` URIs in persisted scans** — Scan records include temp file paths that don't survive app updates or cache clears. Store images in a persistent app directory or use Firestore URLs.
- [ ] **Fix store over-subscription in scan.tsx** — Destructuring from root store without a selector causes re-renders on any store change, causing frame drops during camera preview. Use individual selectors. (`app/scan.tsx:56`)
- [ ] **Fix `ImageBackground` with empty URI** — `uri: capturedUri ?? ''` passes empty string when null. Use conditional rendering instead. (`app/scan.tsx:286`)

### Privacy & Storage

- [ ] **Migrate sensitive data from AsyncStorage to SecureStore** — Phone numbers and names stored in cleartext in AsyncStorage (`glowup-user`). Readable on rooted devices. Use `expo-secure-store` for PII. (`stores/useUserStore.ts:79-80`)
- [ ] **Mask phone number in OTP screen** — Full number displayed as `Sent to +91 {phone}`. Mask middle digits: `+91 ****1234`. (`app/auth.tsx:162`)

### i18n

- [ ] **Complete Hindi translations** — Dozens of hardcoded English strings throughout: scan facts, metric labels, share card labels, question counter, progress screen, tips content. Hindi users get a confusing bilingual experience. (Multiple files)

---

## P3 — Low Priority (Post-launch improvements)

- [ ] **Fix DST edge case in streak calculation** — Date math using milliseconds-per-day can be off by fractions during DST transitions in half-hour offset timezones. (`stores/useUserStore.ts:38-48`)
- [x] **Add focused state to tab bar icons** — Active tab icon scales up + terracotta dot indicator below. (`app/(tabs)/_layout.tsx`)
- [x] **Add `react-native-vision-camera` config plugin** — Added to `app.json` plugins with camera permission string. (`app.json`)
- [ ] **Add certificate pinning** — No cert pinning on API calls. Low priority for MVP but consider before handling payments.
- [x] **Update CLAUDE.md auth documentation** — Now correctly documents native SDK, Play Integrity, and India-only launch. (`CLAUDE.md`)

---

## Play Store Console Setup

Items entered directly in Play Console, not in the codebase:

- [ ] **Upload feature graphic** (1024x500 PNG/JPG)
- [ ] **Upload phone screenshots** (minimum 2, recommended 4-8)
- [ ] **Write short description** (max 80 chars)
- [ ] **Write full description** (max 4000 chars)
- [ ] **Select app category** (likely "Beauty")
- [ ] **Complete content rating questionnaire**
- [ ] **Declare target audience and content**
- [ ] **Enter privacy policy URL**
- [ ] **Complete data safety form**

---

## Build & Submission Config

- [ ] **Configure expo-updates for OTA** — Add `runtimeVersion` and `updates.url` to `app.json` for EAS Update support.
- [ ] **Upscale splash icon** — `splash-icon.png` is 200x200; should be at least 512x512 for crisp rendering.
- [ ] **Add `android/` and `ios/` to `.gitignore`** — Prebuild artifacts are untracked but not ignored. Prevents accidental commits.
- [ ] **Configure EAS submit** — `eas.json` submit profile is empty. Add Google service account key path and track. Not a blocker — first upload can be done manually via Play Console drag-and-drop.
- [ ] **Move `google-services.json` management to EAS Secrets** — Currently committed to git. Acceptable for private repos, but use EAS Secrets if repo goes public.

---

## What's left to ship

**Must fix before submission (P0 remaining):**
- Gemini API key → Cloud Functions proxy
- Data Safety form in Play Console
- Configure Play Integrity API for Firebase Auth
- Enable AI content disclosure in Play Console
- Production AAB build + device end-to-end test

**Recommended before public launch (P1 remaining):**
- Gemini response runtime validation (Zod)
- Crash reporting (Sentry or Crashlytics)
