# GlowUp

AI-powered skin analysis app for Indian women. Take a selfie, get a personalised skin health score and skincare routine. Bilingual — English and Hindi.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 52 + TypeScript |
| Navigation | Expo Router v3 (file-based) |
| Styling | NativeWind v4 (Tailwind for RN) |
| Auth | Firebase Phone OTP (REST API) |
| Database | Firestore |
| AI | Gemini 2.0 Flash (multimodal) |
| State | Zustand |
| i18n | i18next — `en` + `hi` |
| Build | EAS Build + EAS Update |

## Setup

```bash
# Install dependencies
npm install

# Copy and fill in env vars
cp .env.example .env

# Start dev server
npx expo start
```

### Required `.env` vars

```
EXPO_PUBLIC_GEMINI_API_KEY=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Get Gemini key from [aistudio.google.com](https://aistudio.google.com). Firebase config from [console.firebase.google.com](https://console.firebase.google.com).

## Commands

```bash
npx expo start --ios        # iOS simulator
npx expo start --android    # Android emulator
npx tsc --noEmit            # Type check
eas build --platform all    # Production build
eas update                  # OTA update (preview channel)
eas submit                  # Submit to stores
```

## App Structure

```
app/
  _layout.tsx               # Root layout — Firebase auth guard
  index.tsx                 # Entry redirect (auth → splash, authed → tabs)
  splash.tsx                # Logo animation
  language.tsx              # Hindi / English picker
  onboarding.tsx            # 3-slide intro
  auth.tsx                  # Phone OTP login
  questions.tsx             # Skin profile Q1–Q5
  scan.tsx                  # Camera / gallery capture + Gemini call
  results.tsx               # Score, radar chart, 10 metrics
  routine.tsx               # Personalised morning/night/weekly steps
  share.tsx                 # Shareable score card
  product-check.tsx         # Coming soon
  (tabs)/
    index.tsx               # Home — last scan card, daily tip
    progress.tsx            # Scan history + score trend
    tips.tsx                # Skincare knowledge library
    profile.tsx             # Name, skin type, scan count

lib/
  firebase.ts               # Firebase init + auth helpers
  gemini.ts                 # Gemini 2.0 Flash scan call
  routineEngine.ts          # Routine generation from scan result

stores/
  useUserStore.ts           # Auth state + skin profile
  useScanStore.ts           # Current scan result
  useRoutineStore.ts        # Generated routine steps
```

## AI Scan Flow

1. Capture selfie or pick from gallery
2. Compress image to < 300 KB
3. Base64 encode + send to Gemini 2.0 Flash with Q1 (concern) + Q2 (skin type) context
4. Parse structured JSON response — overall score, 10 skin metrics, advice
5. Save to Firestore `users/{uid}/scans/{scanId}`
6. Show Results screen

> **Security:** Gemini key is client-side for MVP only. Must migrate to Cloud Functions or Cloudflare Workers before store submission. See `PLAN.md §API Key Security Plan`.

## Design Reference

`glow up design magic patterns/` is a Vite + React + Tailwind prototype of all 14 screens. Read-only reference — do not modify.

```bash
cd "glow up design magic patterns"
bun install && bun dev
```

Full design tokens, typography, motion spec, and per-screen briefs: [`DESIGN.md`](DESIGN.md).
