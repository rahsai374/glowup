# GlowUp — Project Plan

## App Overview
AI-based skin scanner mobile app targeting Indian women. Bilingual (Hindi + English).
Analyzes face photos using Gemini AI, returns skin health metrics, and recommends a personalized skincare routine.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Expo SDK 52 + TypeScript | Solo dev, no native config needed |
| Styling | NativeWind v4 | Matches existing Tailwind design mockup |
| Navigation | Expo Router v3 | File-based, simple |
| Auth | Firebase Phone OTP | Standard for Indian users |
| Database | Firestore | Free tier, real-time sync |
| Storage | Firebase Storage | Scan photos |
| AI | Gemini 2.0 Flash (client-side for MVP) | Cheapest multimodal, ~$0.002/scan |
| State | Zustand | Lightweight, no boilerplate |
| i18n | i18next | Hindi + English |
| Charts | Victory Native | Progress screen score trends |
| Build | EAS Build + EAS Submit | One-command store deploy |

---

## App Identity

| Field | Value |
|---|---|
| App name | GlowUp |
| Bundle ID | com.glowup.app |
| Platforms | iOS + Android |
| Languages | English, Hindi |
| Design system | See [DESIGN.md](DESIGN.md) — tokens, typography, motion, per-screen briefs |

---

## User Flow

### Onboarding
```
Splash → Language picker (Hi/En) → 3 onboarding slides
  → Phone OTP auth
  → Core Q1: Main concern (Acne / Dark spots / Pigmentation / Dryness / Anti-aging)
  → Core Q2: Midday skin feel (Oily / Dry / Combination / Normal)
  → Optional Q3: Daily water intake (< 4 glasses / 4–8 / 8+)
  → Optional Q4: Sunscreen habit (Daily / Sometimes / Never)
  → Optional Q5: Age range (Under 20 / 20–30 / 30–40 / 40+)
  → Home
```
> Q1 + Q2 are fed into the Gemini prompt as context to improve accuracy.
> Q3–Q5 are saved to Firestore and used only for routine personalization.

### Scan Flow
```
Camera selfie or Gallery pick
  → Compress to < 300KB
  → Base64 encode
  → Call Gemini 2.0 Flash with Q1 + Q2 as context
  → Parse structured JSON response
  → Save result to Firestore
  → Show Results screen
```

---

## Screens (MVP)

| # | Screen | Description |
|---|---|---|
| 1 | Splash | Logo animation |
| 2 | Language | Hindi / English picker |
| 3 | Onboarding | 3-slide intro |
| 4 | Auth | Phone number + OTP verify |
| 5 | Onboarding Questions | Core + optional skin questions |
| 6 | Home | Scan CTA, last score card, insights grid, daily tip |
| 7 | Scan | Camera capture + analyzing animation |
| 8 | Results | Score meter, radar chart, 10 skin metrics, routine CTA |
| 9 | Routine | Morning / night / weekly steps derived from scan |
| 10 | Progress | Scan history list + score trend chart |
| 11 | Tips | Static skincare knowledge library |
| 12 | Profile | Name, skin type badge, scan count |
| 13 | Product Check | "Coming Soon" placeholder |
| 14 | Share Card | Shareable score card image |

---

## AI Integration

### Gemini Prompt Structure
```
System: You are a skin analysis AI. Analyze this face photo.

User context:
- Main concern: {Q1 answer}
- Self-reported skin type: {Q2 answer}

Return ONLY valid JSON:
{
  "overall_score": 0-100,
  "skin_type": "oily|dry|combination|normal",
  "skin_age": number,
  "metrics": {
    "hydration": 0-100,
    "blemish_prone": 0-100,
    "redness": 0-100,
    "oiliness": 0-100,
    "dark_spots": 0-100,
    "radiance": 0-100,
    "texture": 0-100,
    "firmness": 0-100,
    "wrinkles": 0-100,
    "dark_circles": 0-100
  },
  "top_concern": "string",
  "top_win": "string",
  "advice": "string (2 sentences max)"
}
```

### API Key Security Plan

| Phase | Approach |
|---|---|
| Development | Gemini key in `.env`, never committed to git |
| Pre-production | Migrate call to Cloud Functions or Cloudflare Workers |
| Production | No API keys in app binary — server-side only |

> ⚠️ Do NOT submit to App Store or Play Store with client-side Gemini key. Migration required before prod build.

---

## Firestore Data Model

```
users/
  {uid}/
    name            string
    phone           string
    language        "en" | "hi"
    skinType        string
    mainConcern     string
    waterIntake     string
    sunscreenHabit  string
    ageRange        string
    createdAt       timestamp

    scans/
      {scanId}/
        createdAt     timestamp
        overallScore  number
        skinType      string
        skinAge       number
        metrics/
          hydration     number
          blemish_prone number
          redness       number
          oiliness      number
          dark_spots    number
          radiance      number
          texture       number
          firmness      number
          wrinkles      number
          dark_circles  number
        topConcern    string
        topWin        string
        advice        string
        imageUrl      string  (Firebase Storage path)
```

---

## Build Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Expo project init (Expo Router, TypeScript, NativeWind)
- [ ] Firebase project setup (Auth, Firestore, Storage)
- [ ] `.env` setup with Gemini key + Firebase config
- [ ] Design tokens (colors, fonts from mockup)
- [ ] Splash screen
- [ ] Language picker
- [ ] Onboarding slides
- [ ] Phone OTP auth flow
- [ ] Onboarding questions flow (Q1–Q5)
- [ ] Bottom tab navigation (Home, Progress, Tips, Profile)

### Phase 2 — AI Core (Week 3–4)
- [ ] Camera selfie capture (expo-camera)
- [ ] Gallery picker (expo-image-picker)
- [ ] Image compression (< 300KB)
- [ ] Gemini 2.0 Flash integration
- [ ] Structured JSON parsing + error handling
- [ ] Analyzing animation screen
- [ ] Results screen (score meter, radar chart, 10 metrics)
- [ ] Save scan to Firestore

### Phase 3 — Retention (Week 5–6)
- [ ] Routine screen (morning/night/weekly, derived from skin type)
- [ ] Progress screen (scan history, score trend chart)
- [ ] Tips screen (static content, port from mockup)
- [ ] Share card (expo-view-shot + expo-sharing)
- [ ] Profile screen
- [ ] Product Check placeholder ("Coming Soon")

### Phase 4 — Launch Prep (Week 7–8)
- [ ] Push notifications — daily routine reminder (expo-notifications)
- [ ] Error states + loading skeletons
- [ ] Offline handling
- [ ] "Not medical advice" disclaimers (App Store requirement)
- [ ] App icon + splash screen assets
- [ ] **Migrate Gemini call to Cloud Functions / Cloudflare Workers**
- [ ] EAS Build — iOS + Android production builds
- [ ] TestFlight beta (iOS) + Internal testing (Android)
- [ ] App Store Connect + Play Console submission

---

## Cost Estimate at Launch (~1K users, 1 scan/week)

| Service | Monthly Cost |
|---|---|
| Gemini 2.0 Flash (~4K scans) | ~$8–15 |
| Firebase Spark (free tier) | $0 |
| EAS Build (free tier) | $0 |
| **Total** | **< $20/month** |

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Gemini accuracy (not dermatology-trained) | Add "AI estimate, not medical advice" copy throughout |
| Firebase SMS cost after 10K OTPs/month | Monitor in Firebase console, add rate limiting |
| App Store rejection (health app) | Clear disclaimers, no diagnostic language |
| API key exposed before migration | Restrict key by bundle ID + daily quota cap in Google AI Studio |

---

## Deferred (Post-launch)
- Product Check with real barcode scanning
- Push notification personalization
- Premium / subscription model
- Android-first launch, iOS to follow if no Apple Developer account yet

---

## Environment Setup (Required Before Scaffolding)

```bash
# .env (gitignored — fill in locally)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get these from:
- Gemini key → [aistudio.google.com](https://aistudio.google.com)
- Firebase config → [console.firebase.google.com](https://console.firebase.google.com)
