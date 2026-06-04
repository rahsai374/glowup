# GlowUp — Design System

This document is the single source of truth for GlowUp's visual identity.
Reference it when prompting the `frontend-design` skill for any screen.

---

## 1. Design Identity

GlowUp is a warm, organic, and premium AI skin scanner for Indian women.
The aesthetic is confident and feminine — not clinical, not purple-gradient generic.
Think of a high-end Indian beauty brand: earthy terracotta tones, soft cream backgrounds,
rich serif headings, and gentle depth through layered blur effects.

**In one line:** warm terracotta on cream, Fraunces serif headings, ambient blob depth, spring motion.

---

## 2. Color Tokens

All values are direct lifts from the Magic Patterns mockup.

| Token | Hex | NativeWind / inline usage |
|---|---|---|
| `bg` | `#FFF5EE` | `bg-[#FFF5EE]` — main screen background |
| `body-bg` | `#F0E6DF` | `bg-[#F0E6DF]` — body/shell background |
| `primary` | `#E07856` | `bg-[#E07856]` — CTAs, active states, highlights |
| `primary-light` | `#F2A68D` | `bg-[#F2A68D]` — tinted blobs, subtle accents |
| `text` | `#2D1810` | `text-[#2D1810]` — all body text |
| `accent` | `#D4A574` | `bg-[#D4A574]` — secondary accents, golden details |
| `surface` | `#FFFFFF` | `bg-white` — cards, inputs |

### Severity scale (skin metric scores)
| Level | Hex | When to use |
|---|---|---|
| Mild / Good | `#4ADE80` | Score > 75 |
| Moderate | `#FACC15` | Score 50–75 |
| Attention | `#FB923C` | Score 25–50 |
| Severe | `#F87171` | Score < 25 |

### Gradient recipes
```
Card warm:        from-[#FFEFE3] to-[#FFE2D1]    (product / action cards)
Card golden:      from-[#FBF2E0] to-[#F5E6C8]    (routine / tip cards)
Tip panel:        from-[#FFF9F5] to-[#FBEFE0]    (daily tip, advice blocks)
Results hero bg:  from-white to-[#FFF1E6]         (results screen top panel)
Dark CTA banner:  bg-[#2D1810] text-white          (customized regimen, share card bg)
```

---

## 3. Typography

| Role | Font | NativeWind class |
|---|---|---|
| Display / Headings | Fraunces (serif, variable) | `font-serif` |
| Body / UI labels | Plus Jakarta Sans | `font-sans` |
| Hindi text | Hind | `font-hindi` |

### Rules
- All `h1`–`h6` use `font-serif font-bold` by default.
- Screen titles (h1): `text-3xl font-serif font-bold text-[#2D1810]`
- Section headings (h2): `text-lg font-serif font-bold text-[#2D1810]`
- UI labels / tags: `text-[10px] font-bold uppercase tracking-[0.18em]`
- Body text: `text-sm text-[#2D1810]/70 leading-relaxed`
- Italic subheadings (en only): `font-serif italic text-[#2D1810]/60`
- Hindi equivalent of italic: `font-hindi` (no italic — Hind renders poorly italic)

---

## 4. Spacing & Shape

| Element | Value |
|---|---|
| Screen padding | `px-6` horizontal, `pt-12` top |
| Card border-radius | `rounded-3xl` (large cards), `rounded-2xl` (medium), `rounded-xl` (small) |
| Primary CTA button | `rounded-2xl py-4 px-8` |
| Large hero CTA | `rounded-[32px] p-8` |
| Input fields | `rounded-2xl py-4 px-4` |
| Tab pills | `rounded-xl py-3` inside `rounded-2xl` container |
| Shadow — cards | `shadow-[0_4px_20px_-2px_rgba(45,24,16,0.05)]` |
| Shadow — elevated | `shadow-[0_10px_40px_-10px_rgba(45,24,16,0.08)]` |
| Card border | `border border-[#E07856]/10` |

---

## 5. Atmosphere — The Blob Pattern

Every main screen uses large, blurred radial gradient blobs for depth.
This is a signature GlowUp pattern — never skip it on content screens.

```
Top-right blob:   w-72 h-72, bg-[#E07856]/12–15, blur-3xl, top-[-60px] right-[-60px]
Mid-left blob:    w-64 h-64, bg-[#D4A574]/15–20, blur-3xl, top-[300–400px] left-[-80px]
Optional 3rd:     w-56 h-56, bg-[#E07856]/10, blur-3xl, lower-right
```

In React Native (NativeWind), approximate with `react-native-svg` radial gradients
or `@shopify/react-native-skia` for blur. Position blobs as absolute, `pointerEvents="none"`, `zIndex={0}`.
All content sits at `zIndex={10}` above.

---

## 6. Motion

All motion uses `react-native-reanimated` (Expo SDK 52 compatible).
The mockup uses Framer Motion — translate patterns as follows:

| Mockup pattern | React Native equivalent |
|---|---|
| `initial opacity:0 y:20 → animate opacity:1 y:0` | `FadeInDown` entering animation |
| `initial opacity:0 x:50 → animate opacity:1 x:0` | `FadeInRight` (slide transitions) |
| `whileTap scale:0.98` | `useAnimatedStyle` with `withSpring(0.98)` on press |
| `transition type:spring` | `withSpring()` with `{ damping: 15, stiffness: 100 }` |
| `stagger delay: idx * 0.08` | `entering={FadeInDown.delay(idx * 80)}` |
| Animated score counter | `useSharedValue` + `withTiming(finalScore, { duration: 1500 })` |
| Scanning line sweep | `useSharedValue` + `withRepeat(withTiming(...), -1)` |

### Key motion moments (high-impact, use on every screen)
1. **Page enter**: `FadeInDown` on main content container
2. **List stagger**: `delay(idx * 80)` on each list item
3. **Primary CTA press**: spring scale 0.98 on tap
4. **Score meter**: animated stroke-dashoffset over 1500ms ease-out

---

## 7. Bottom Navigation

4 tabs: **Home**, **Progress**, **Product**, **Profile**.

### Layout
- Flat white bar anchored to screen bottom (no floating pill)
- Height: `60 + safeAreaInsets.bottom`
- `paddingTop: 8`, `paddingBottom: insets.bottom`
- `borderTopWidth: 0` — elevation via shadow only
- Shadow: `shadowColor: #2D1810`, `shadowOffset: { width: 0, height: -4 }`, `shadowOpacity: 0.06`, `shadowRadius: 12`, `elevation: 10`

### Icons
Custom SVG icons, 22×22 viewBox 24. Each is a stroke-only outline (`strokeWidth: 2`, `strokeLinecap: round`):
- **Home** — house with peaked roof and door cutout
- **Progress** — trending-up arrow (line chart going up-right)
- **Product** — bottle with neck + two label lines
- **Profile** — head-and-shoulders person silhouette

### Active / Inactive States
- **Active:** icon stroke `#E07856`, label `#E07856` (`PlusJakartaSans_600SemiBold`, 11px), small dot indicator (`w-4 h-4 rounded-full bg-[#E07856]`, `marginTop: 1`) below icon
- **Inactive:** icon stroke `rgba(45,24,16,0.5)`, label same color, no dot

### Hidden Tabs (no nav entry)
Results, Routine, Share, and Notifications are nested under `(tabs)` for navigation but excluded from the bar via `href: null`.

---

## 8. Screen Briefs

Each brief is ready to paste into a frontend-design skill prompt.
Prefix every prompt with:
> "Stack: Expo SDK 52 + React Native + NativeWind v4 + react-native-reanimated.
> Design system: see DESIGN.md — warm terracotta (#E07856) on cream (#FFF5EE),
> Fraunces serif headings, ambient blur blobs, spring motion."

---

### Screen 1 — Splash
**Intent:** Brand-first. Full-screen terracotta. Radiant, confident entrance.
**Key elements:** Sparkles icon in white/20 frosted circle (w-24 h-24), "GlowUp" in Fraunces bold text-5xl, tagline "AI Skin Routine" in 11px uppercase tracking-[0.25em], "Glowing skin for everyone" body copy.
**Motion:** Staggered fade-up: icon at 0.2s (spring scale), title at 0.4s, tagline at 0.5s, body at 0.6s. Auto-advance after 2.5s.
**NW hint:** `bg-[#E07856] text-white flex-1 items-center justify-center`

---

### Screen 2 — Language Picker
**Intent:** Intentionally bilingual before language is chosen. Clean, minimal.
**Key elements:** "Choose Language" (Fraunces) + "भाषा चुनें" (Hind) stacked as dual-language header. Two large white cards (`rounded-2xl shadow-card border-2`), one per language. On hover/press: `border-[#E07856]`.
**Motion:** Slide-in from right (`FadeInRight`). Cards enter with stagger.
**NW hint:** `bg-[#FFF5EE] pt-24 px-8`. Both language labels centered, large font.

---

### Screen 3 — Onboarding Slides (3 slides)
**Intent:** Feature preview. Warm, optimistic. Communicates analysis depth on slide 1.
**Key elements:** Large icon in white circle with `border-4 border-[#E07856]/20 animate-pulse` ring. Fraunces h2 title + body text. Slide 1: floating metric chips (Hydration 71, Wrinkles 90, Radiance 78) with spring entrance. Progress dots: active = `w-8 bg-[#E07856]`, inactive = `w-2 bg-[#E07856]/20`.
**Motion:** AnimatePresence slide-in/out (x: ±50, opacity). Metric chips spring in at delay 0.3 + i*0.15s.
**NW hint:** `bg-[#FFF5EE]` with top-right and bottom-left blobs. Skip + Next buttons bottom-fixed.

---

### Screen 4 — Auth (Phone OTP)
**Intent:** Trustworthy, focused. One task at a time.
**Key elements:** Step 1 — Fraunces h1 "Login to continue", `+91` prefix box + phone input (`rounded-2xl`), ShieldCheck "No spam" trust badge, primary CTA. Step 2 — 4 large OTP digit boxes (`w-16 h-16 rounded-2xl text-2xl text-center`), focus ring `border-[#E07856]`, "Change phone" text link, verify CTA.
**Motion:** Page fade-up on mount. Step transition: new step fades in.
**NW hint:** `bg-[#FFF5EE] px-8 pt-24`. Disabled CTA at `opacity-50`.

---

### Screen 5 — Onboarding Questions (Q1–Q5)
**Intent:** Conversational, not clinical. Single question per step with progress indicator.
**Key elements:** Progress bar (step X of 5). Fraunces question text. Large tappable option cards (`bg-white rounded-2xl border-2`, selected = `border-[#E07856] bg-[#FFF5EE]`). Q3–Q5 have a "Skip" text link. "Next" CTA bottom-fixed.
**Motion:** Each question screen slides in from right. Option selection: spring scale 0.98 + border color transition.
**NW hint:** Options in a `space-y-3` list. Core questions (Q1–Q2) have no skip option.

---

### Screen 6 — Home
**Intent:** Dashboard. Warm, alive. The scan CTA dominates.
**Key elements:**
- Greeting header (`text-[#E07856] text-[11px] uppercase`) + name in Fraunces h1 + italic serif subline
- Profile avatar button (top-right, `w-12 h-12 bg-white rounded-full`)
- Hero Scan CTA: full-width `rounded-[32px] bg-[#E07856] p-8` with inner blobs, ScanFace icon (44px), "Scan Your Skin" Fraunces title, "Takes seconds" pill badge
- 2-col quick actions grid: "Check Product" (warm gradient card) + "My Routine" (golden gradient card)
- Last scan card: circular score meter (SVG), top concern badge (red), top win badge (green), "Routine" button
- 2×2 insights grid: staggered color-tinted cards
- Daily tip: golden gradient panel with emoji + serif title
**Motion:** Blobs as atmosphere. CTA hover scale 1.02. Insights stagger FadeInDown delay idx*80ms.
**NW hint:** `pb-24` (bottom nav clearance). Three ambient blobs.

---

### Screen 7 — Scan
**Intent:** 3 sub-states. (1) Choice: warm/clean. (2) Capture: full dark camera. (3) Analyzing: dramatic scanning FX.
**Key elements:**
- Choice: two large cards — primary (Camera, `bg-[#E07856]`) + secondary (Gallery, `bg-white border`)
- Capture: full-screen camera, dashed oval face guide (`w-[280px] h-[380px] rounded-[140px] border-dashed border-white/50`), "Position your face" label above oval, large round shutter button bottom-center
- Analyzing: photo at 50% opacity, scanning line sweeping top→bottom (repeating), `bg-[linear-gradient(...)]` grid mesh overlay, frosted card with spinner + rotating fact text (AnimatePresence crossfade every 3s)
**Motion:** AnimatePresence mode="wait" between states. Scanning line: `withRepeat(withTiming(screenHeight, 3000), -1, true)`.
**NW hint:** Analyzing: `bg-black`. Fact card: `backdrop-blur-md bg-black/60 rounded-3xl border border-white/10`.

---

### Screen 8 — Results
**Intent:** Reveal moment. Feels earned and celebratory.
**Key elements:**
- White hero panel (`rounded-b-[40px] shadow-soft`) with blobs, "Skin Analysis Result" label, animated circular score meter (SVG, 192px), Skin Age + Skin Type stat boxes below meter
- Radar chart card (`bg-white rounded-3xl`) with "Analysis Overview" heading
- "Skin Scores" section: SkinMetricsList — each metric with label, severity-colored progress bar, score number
- Dark CTA banner (`bg-[#2D1810] rounded-3xl`): "Your Customized Regimen" copy + Sparkles accent
- Two CTAs: "See My Routine" (primary) + "Share Score Card" (outlined)
**Motion:** Score meter animates from 0 to final over 1500ms ease-out. Page enters FadeInUp.
**NW hint:** Use `react-native-svg` for radar. Victory Native for the radar chart. Scroll content below the hero.

---

### Screen 9 — Routine
**Intent:** Practical and warm. Expandable steps feel like a personal coach.
**Key elements:**
- 3-tab pill bar (Morning ☀️ / Night 🌙 / Weekly 📅) in white `rounded-2xl p-1` container
- Expandable step cards: step number in circle (`bg-[#E07856] text-white` when expanded, `bg-[#FFF5EE]` when collapsed), ChevronDown/Up, animated height expand
- Expanded content: description text + product recommendation card (`bg-[#FFF9F5] rounded-xl border border-[#D4A574]/20`) with emoji product image, name, "Available at local store" tag, ₹ price
**Motion:** Tab switch: AnimatePresence slide x:±20. Step expand: animated height 0→auto + opacity.
**NW hint:** Two blobs. `pb-24` scroll area. Active tab: `bg-[#E07856] text-white shadow-soft`.

---

### Screen 10 — Progress
**Intent:** Motivational trend view. Shows the journey.
**Key elements:**
- Fraunces h1 "Your Progress" + italic serif subline "Skin score trend"
- Line chart card (`bg-white rounded-3xl p-6`): Victory Native LineChart, `#E07856` stroke w:4, dots with white stroke, no Y-axis labels
- Past scans list: each item = scan thumbnail (`w-16 h-16 rounded-xl`), date, score/100, concern badge (red) + win badge (green), score circle (`bg-[#FFF5EE] text-[#E07856]`)
**Motion:** List items stagger FadeInDown delay idx*100ms. Chart line draws on mount.
**NW hint:** Two blobs. `pb-24`. Chart height 192px.

---

### Screen 11 — Tips
**Intent:** Knowledge library. Editorial grid layout with photography.
**Key elements:**
- Fraunces h1 + italic serif personalized subline ("Personalized for {name}")
- 2×N latest insights grid: same color-tinted cards as Home
- "Browse by Concern" grid: 2-col, aspect-[3/4], photo with `mix-blend-luminosity opacity-90` + color tint overlay, bold title, dark arrow circle bottom-right
- "Browse by Type" grid: 2-col, aspect-square, photo with `mix-blend-multiply` overlay. User's type gets `bg-[#E07856] text-white` "Your Type" badge
- Daily tips feed: card per tip, `bg-[#E07856]/10` category header strip, emoji + serif title + body text
**Motion:** Grid items stagger FadeInDown. Photo cards active-scale 0.98.
**NW hint:** Photos from Firebase Storage or static assets. Two blobs.

---

### Screen 12 — Profile
**Intent:** Personal and editable. Clean form feel, warm surface.
**Key elements:**
- Back button (white circle, top-left) + Fraunces h1 + italic serif subline
- Identity card: avatar circle (👩🏽 emoji, `bg-[#E07856]/10`), name + age in serif bold
- Editable name input + age input (`rounded-2xl bg-white border focus:border-[#E07856] focus:ring`), animated "✓ Saved" flash on commit
- Language toggle: 2-pill row, active = `bg-[#E07856] text-white shadow-soft`
**Motion:** "Saved" indicator FadeIn/FadeOut (1.5s). Input focus ring transition.
**NW hint:** Two blobs. No bottom nav (accessed from Home header). `pb-24`.

---

### Screen 13 — Product Check
**Intent:** Coming soon placeholder. Consistent with brand, not jarring.
**Key elements:** Full-screen centered layout. FlaskConical icon in brand-primary circle. "Coming Soon" in Fraunces h1. Short explanation copy. Optional email/notify CTA in outlined style.
**Motion:** Fade-up entrance.
**NW hint:** `bg-[#FFF5EE]` with one or two blobs. Same blob pattern as other screens.

---

### Screen 14 — Share Card
**Intent:** Dark, high-contrast, gallery-worthy. The card itself is a warme cream square.
**Key elements:**
- Dark shell: `bg-[#1A1A1A] text-white`. Back button (white/10 frosted circle), centered title.
- Card preview: `aspect-square bg-[#FFF5EE] rounded-[32px] p-6` with inner blobs, name + "GlowUp" badge, animated score circle (SVG), skin type box, tagline + QR code block
- WhatsApp share CTA: `bg-[#25D366] text-white rounded-2xl`
- Save to gallery: `bg-white/10 text-white rounded-2xl`
**Motion:** Card scales in (0.9 → 1.0) on mount with spring. Export: use `react-native-view-shot`.
**NW hint:** The card is the product — give it plenty of padding and shadow-2xl.

---

## 9. NativeWind Translation Notes

| Web Tailwind | NativeWind v4 equivalent |
|---|---|
| `blur-3xl` on div | Use `@shopify/react-native-skia` `<BlurMask>` or `react-native-svg` radial gradient |
| `backdrop-blur-md` | `react-native-blur` `BlurView` |
| `mix-blend-*` | Not supported natively — use opacity overlays or Skia |
| `aspect-square` / `aspect-[3/4]` | Supported in NativeWind v4 |
| `animate-spin` | `useAnimatedStyle` + `withRepeat(withTiming(360, {duration:1000}), -1)` |
| `animate-pulse` | `useAnimatedStyle` + `withRepeat(withSequence(withTiming(0.5), withTiming(1)), -1)` |
| Framer Motion `AnimatePresence` | `react-native-reanimated` `Layout` + `Exiting`/`Entering` animations |
| `object-cover` on `<img>` | `<Image resizeMode="cover">` |
| `font-serif` (Fraunces) | Load via `expo-font` + `useFonts` |
| `font-hindi` (Hind) | Load via `expo-font` + `useFonts` |
