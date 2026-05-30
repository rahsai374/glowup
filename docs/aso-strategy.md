# GlowUp — ASO Strategy (Google Play + Apple App Store)

**Prepared for:** Rahul (founder, GlowUp)
**Date:** 29 May 2026
**Scope:** Full ASO play for an Android-first, Hindi-first, Tier 2/3 India launch — modelled on the PulseCheck doc's two-layer ranking spine but rebuilt for skincare, the Indian Play Store, and the Bharat-native (Path B) direction set in `docs/audience-fit-tier2-tier3.md`.
**Sibling docs:** `docs/audience-fit-tier2-tier3.md` (Path B context), `docs/payments-and-paywall-report.md` (pricing rails), `docs/analytics-tracking-plan.md` (conversion events), `docs/play-store-release-checklist.md` (submission gates), `docs/solo-founder-playbook.md` (stage-gate cadence).
**Reference:** `01_ASO_Strategy.pdf` (PulseCheck). Structure borrowed; every example rewritten for skincare.

---

## Part 0 — Executive summary

Five moves this week, in order:

1. **Rebrand the Play listing title from "GlowUp" to "GlowUp: AI Skin Care Routine".** Today the app ships as bare `"name": "GlowUp"` in `app.json` line 3 — that surrenders 24 of the 30 highest-weight ranking characters Google gives you. Adding the category descriptor is a single-line code change and a single Play Console field edit; it is the largest single ASO uplift available before any keyword research.
2. **Write a 4,000-character `hi-IN` Play long description in Devanagari-first Hindi (with Hinglish loan-words where Bobble AI data says natural users actually type them).** The Play long description is the only field on either store that gets full keyword-density indexing, and `hi-IN` is the field with by far the weakest competition because Nykaa, Mamaearth, Plum, Foxtale, and Clinikally all ship English-only listings. This is the single biggest unfair-advantage slot in the entire ASO stack.
3. **Stop using "GlowUp" as the in-listing brand promise in Hindi.** Add a Devanagari secondary brand line ("निखार" or "रूप") inside the short description, feature graphic, and screenshot captions. The wordmark stays "GlowUp" for legal/install-funnel continuity, but a Tier 2/3 woman scrolling Play search needs a Hindi cue inside the first 80 characters to read this as "for me." Current `hi.json` line 2 still ships `"app_name": "GlowUp"` — fix at the listing layer first; in-app rename is downstream.
4. **Ship Play first; defer App Store Connect submission to month 4+.** The audience-fit doc and solo-founder-playbook §2 already commit to Android-first because the Tier 2/3 Indian woman is on Play, not iOS. The Apple side of this document still matters — it's the playbook for the eventual iOS launch and the document the founder uses to brief a future contractor — but no calendar time should be spent on Apple metadata in the first 90 days. The single exception: secure the `glowup` slug on App Store Connect now (free, 10 minutes) so a squatter can't grab it.
5. **Defensive bid `glowup` on Apple Search Ads day one of iOS launch, and on Google UAC the day the Play listing goes live.** Brand defence is the only ASA/UAC line item that pays for itself from day one — it stops Mamaearth, Plum, Clinikally, Foxtale, and the dozen Glow AI/Umax clones already on Indian Play from buying your brand term out from under you. ₹200–500/day cap is enough.

The rest of this document is the operating manual for what comes after those five moves.

---

## Part 1 — How the two stores rank apps (with explicit differences)

### 1.1 Apple App Store — the two-layer model (recap from PulseCheck, skincare-flavoured)

**Layer 1 — Keyword eligibility (binary).** Apple will only show GlowUp for a search if the keyword exists in indexed metadata. The indexed surfaces are: **App Title (30), App Subtitle (30), Keyword Field (100, hidden), Primary + Secondary Category names, Screenshot caption text (indexed since WWDC 2025, [Apple Developer — App Store search optimization](https://developer.apple.com/app-store/search/)), In-App Events metadata, and the iOS 26+ AI-generated tags.** Description, promo text, in-app strings, and review text are **not** indexed for Apple search.

For GlowUp specifically: if the word "ubtan" is nowhere in Title/Subtitle/Keyword field/Screenshot captions, the app cannot rank for "ubtan" no matter how many ubtan recipes are in `lib/routineData.ts`. Apple does not crawl the binary.

**Layer 2 — Ranking strength (continuous, position 1–200+).** Among eligible apps, position is set by download velocity (very high), conversion rate (very high), ratings + reviews volume/recency/score (high), keyword placement weight (Title > Subtitle > Keyword field) (high), retention + engagement (medium-high), update frequency (medium), uninstall rate (medium), crash rate (medium), and ASA activity (indirect — paid downloads boost organic velocity).

**Apple-specific skincare nuances:**
- Apple's keyword field is hidden, so a Tier 2/3 user never sees "ubtan,niacinamide,muhasa" in the listing. This means Apple gives GlowUp a clean separation between **what we rank for** and **what we say** — useful for stuffing concern keywords without polluting brand voice.
- Apple auto-handles English plurals (`pimple` ⇒ matches `pimples`) but **does NOT auto-handle Hindi plurals or Devanagari/Roman script mixing**. "muhase" and "muhase ka ilaj" need to be indexed explicitly. Same for Roman vs Devanagari ("pimple" ≠ "पिम्पल"; both are searched).
- Apple lets `hi-IN`, `en-IN`, `en-US` each have their own Title + Subtitle + Keyword field. That's effectively 3× the keyword surface. Most skincare competitors ship only `en-US`.

### 1.2 Google Play — the model that's genuinely different

Play's algorithm has the same two-layer structure conceptually, but the indexed surfaces and the ranking signals differ in ways that change the strategy. From Google's own docs ([Play Console Help — Store listing best practices](https://support.google.com/googleplay/android-developer/answer/9866151), [Increase visibility through Play search](https://support.google.com/googleplay/android-developer/answer/4448378)):

**Layer 1 — Indexed surfaces on Play:**
- **App title (30 chars)** — highest weight. Same constraint as Apple.
- **Short description (80 chars)** — second-highest weight, and it appears above-the-fold on the listing so it doubles as conversion copy.
- **Long description (up to 4,000 chars)** — **this is the one that's totally different from Apple. The long description IS indexed for search ranking.** Keyword density (without spam) genuinely moves rankings on Play. Use this. Quote your concern keywords in natural sentences 2–4 times each.
- **Developer name** — indexed. Rename from `rahsai374` to something Hindi-relevant ("GlowUp Beauty" or "GlowUp Skin Care") before launch — Play Console docs explicitly call this out as a ranking signal.
- **Category + tags** — Play has up to 5 tags per app from a fixed taxonomy; pick `Beauty` (category) + tags like "skin care", "self care", "wellness routine".
- Country-level listings: similar to Apple's locales, you get a fresh `hi-IN`, `en-IN`, `ta-IN`, `te-IN`, `bn-IN`, `mr-IN`, `pa-IN`, `gu-IN`, `kn-IN`, `ml-IN`, `or-IN` listing — each with its own title + short + long description.
- **NOT a separate keyword field.** This is the biggest UX difference: on Play, you don't get the hidden 100-char buffer Apple gives you. Every keyword has to live in title, short, or long description — i.e. user-visible copy. Stuffing reads obviously on Play in a way it doesn't on Apple.

**Layer 2 — Ranking signals on Play:**

| Signal | Weight | Notes |
|---|---|---|
| **Install velocity** (last 7–30 days) | Very high | Same as Apple. Play's freshness window is shorter — a one-week dip drops you fast. |
| **Install conversion rate** (store-listing visitors → installs) | Very high | Play target: >25% for India. Apple is ~30%. Play is lower because of richer browse traffic. |
| **Retention** (D1 / D7 / D30) | High | Play actively decays low-retention apps. Critical for a Gemini-API-wrapper to defend against. |
| **Uninstall rate** | High — **noticeably heavier than on Apple** | Play tracks uninstalls per-install-cohort. Tier 2/3 cheap devices uninstall on storage pressure, which can punish you unfairly. Minimise APK size; current build is ~28 MB before native modules — keep under 40 MB. |
| **Ratings (avg score + volume + recency)** | High | Below 3.5★ kills you. 4.0+ is the survival floor; 4.3+ is the comfortable zone. |
| **Review text** | High — **this is the second big behavioural difference from Apple** | Google has confirmed in Play Console help docs that review text contributes to listing relevance ([Play Console — How user feedback affects your visibility](https://support.google.com/googleplay/android-developer/answer/138230)). If 100 users write "best for kil-muhase" in their reviews, you genuinely do gain visibility for "kil muhase ka ilaj". Apple = no, Play = yes. |
| **Crash rate / ANR rate** (via Android Vitals) | High | Play has the bad-behaviour thresholds at "Core Vital" — if you cross them, Play actively suppresses your listing. |
| **Update frequency** | Medium | Same as Apple. |
| **Google Ads UAC velocity** | Indirect | Paid installs boost organic velocity. Same mechanism as ASA. |

**Listing experiments instead of CPPs.** Play does not have Apple-style Custom Product Pages. The equivalent surface is **Store Listing Experiments** ([Play Console — Run store listing experiments](https://support.google.com/googleplay/android-developer/answer/9844921)) — server-side A/B tests on icon, feature graphic, short description, screenshots, and video. You get up to **5 concurrent experiments**, **50/50 or 33/33/33 traffic splits**, and Google picks a winner once you hit statistical significance (typically 7–28 days at ≥1,000 visitors/day).

**Country-level listings.** Play lets each country/language combo have its own complete listing — a Hindi-language listing seen only by users with system locale `hi-IN`. This is identical in principle to Apple's locale-specific metadata but Play makes it the operational unit (rather than the language unit), so a Hindi listing shown only to Indian devices is one config away.

### 1.3 The two stores side by side

| Surface | Apple | Play | Indexed for keyword search? |
|---|---|---|---|
| App title | 30 chars | 30 chars | Both — highest weight on both |
| Subtitle / Short description | 30 chars (Apple "Subtitle") | 80 chars (Play "Short description") | Both — second-highest weight |
| Keyword field | 100 chars, hidden | Does not exist | Apple only |
| Description | Up to 4,000 chars | Up to 4,000 chars | **Play yes, Apple no** |
| Promo text | 170 chars, visible above description, no app update needed | Does not exist (Play uses "What's new" for the 500-char release notes) | Neither |
| Screenshot captions | Indexed since WWDC 2025 | Treated as part of the creative; not separately indexed | Apple yes, Play no |
| Developer name | Not indexed | **Indexed** | Play only |
| Category + tags | 1 primary, 1 secondary; subcategory keywords auto-index | 1 category + up to 5 tags from fixed taxonomy | Both |
| Review text | Quality signal only, NOT indexed for keyword | **Quality signal AND keyword signal** | Play only — coach review prompts accordingly |
| Custom product pages / per-keyword landing | Up to 70 CPPs since iOS 17, indexed in organic search since July 2025 | Not supported — use Store Listing Experiments instead | Apple only |
| In-app events / LiveOps content | In-App Events indexed in search | LiveOps tiles in Play store (limited indexing) | Both, asymmetric |
| Per-locale fresh metadata | hi-IN, en-IN, en-US each get full title/subtitle/keywords | Each country-locale gets full title/short/long | Both |

**The ONE behavioural difference a solo founder must internalise:** on Play, every public-facing word the user reads is **also a ranking signal** — the long description, the review text users write, the developer name, the short description on the listing. On Apple, the secret keyword field lets you separate "what we say to the user" from "what we rank for." This means **the GlowUp Play long description has to be both readable AND keyword-dense, while the Apple description can be purely persuasive prose**. They are different artefacts and should be written separately, not translated from one to the other.

The second-order consequence: **Play review prompts on GlowUp need to nudge users to mention skincare concern keywords in their review text** (in Hindi or Hinglish), because that text moves rankings. Apple review prompts only need to nudge stars. Same SKStoreReviewController / `expo-store-review` API, different in-app copy.

---

## Part 2 — Current GlowUp ASO audit (brutal)

Every quote below is pulled from the repo as it stands on 29 May 2026.

### 2.1 App name / Title

**Current:** `app.json` line 3: `"name": "GlowUp"` (6 chars). This is what gets used by Expo to populate both the Play Console default title and the App Store Connect "Name" field unless overridden.

**Score: 2/10.** The hardest fail in the audit. Title is the single highest-weight indexed field on both stores. GlowUp is using 6 of 30 chars and surrendering the other 24. The keyword "skin" — the single most important word in this category — is nowhere in the title. So is "AI", "routine", "scanner", "face", "care", "Hindi", "ubtan", "glow tips" — everything.

**Cross-check the listing-feel reality:** a Tier 2/3 woman in Lucknow Plays-Stores "skin care app". She sees a list of results. Every competitor has a category descriptor next to their name — "Nykaa - Beauty Shopping App", "Mamaearth: Skin Care, Hair Care", "Foxtale Skincare Shop", "Plum: Beauty Shop", "Clinikally: Skin & Hair Care". GlowUp shows up as just "GlowUp" with a sparkle icon. Even if the keyword match got her there, "GlowUp" alone reads as a fitness/wellness app to a non-English-fluent eye. Conversion suffers before the user even reads the screenshot.

**Fixed (English):** `GlowUp: AI Skin Care Routine` (28 chars, verified). Adds "AI", "skin care", "routine" — the three highest-value English keywords in the category. Stays under 30. Keeps brand position first.

**Alternative English options:**
- `GlowUp - AI Skin Care & Routine` (31 — too long, cut)
- `GlowUp: Skin AI Scanner & Care` (30 chars) — leads with "skin AI scanner" (matches "ai skincare" search), tradeoff = drops "routine"
- `GlowUp: AI Face Scan + Routine` (30 chars) — leads with "face scan" (matches Cal-AI-style queries), tradeoff = drops generic "skin care"

**Fixed (Hindi, hi-IN locale):** `GlowUp: AI स्किन केयर ऐप` — counting graphemes conservatively at ~26 chars (Play tolerates this; Apple gives 30 graphemes for Hindi). Combines the English wordmark (kept for install-funnel continuity since paid ads will use it) with Devanagari category descriptor. Adds Devanagari surface for `hi-IN` search queries which English-only listings cannot rank for.

**Recommendation:** ship `GlowUp: AI Skin Care Routine` to `en-IN` and `en-US`, `GlowUp: AI स्किन केयर ऐप` to `hi-IN`. Edit `app.json` line 3 to the English version and set the Hindi one in Play Console > Store Presence > Main store listing > Hindi (India). This week.

### 2.2 Subtitle (Apple) / Short description (Play)

**Apple subtitle current:** does not exist yet (no App Store Connect listing).
**Play short description current:** does not exist yet (Play Console line in `play-store-release-checklist.md` says "Write short description (max 80 chars)" still unchecked).

**Score: 0/10 (because nothing exists yet).** But the cost of writing it wrong on day 1 is huge — it's the second-highest weighted indexed field on both stores and (on Play) the line the user sees above-the-fold on the listing.

**Fixed Apple subtitle (30 chars):**
- A (recommended): `AI Selfie Scan: Acne to Glow` (28 chars) — keyword payload: AI, selfie, scan, acne, glow
- B: `Skin Test: Acne, Tan, Routine` (29 chars) — keyword payload: skin, test, acne, tan, routine
- C: `Free AI Skin Scan & Glow Tips` (29 chars) — keyword payload: free, AI, skin scan, glow tips

**Fixed Play short description (80 chars):**
- A (recommended, en-IN): `AI selfie skin scan for acne, dark spots, tan. Free desi routine tips.` (70 chars, verified) — payload: AI, selfie, skin, scan, acne, dark spots, tan, desi, routine, free.
- B (en-IN): `Free AI skin care app: acne, pimples, tan, dark spots, glow tips & routine.` (76 chars) — heavier keyword density, slightly less natural.
- C (hi-IN, Devanagari + Hinglish): `AI से skin scan करो — acne, pimple, dark spots, tan के लिए ubtan routine.` (~75 chars depending on grapheme counting) — payload: AI, skin scan, acne, pimple, dark spots, tan, ubtan, routine.

Pick A for en-IN/en-US, C for hi-IN. Run a Play Store Listing Experiment between A and B in week 4.

### 2.3 Play long description

**Current:** does not exist.

**Score: 0/10.** Single biggest unfair-advantage slot in the entire stack — covered in detail in Part 5 below. Will need to be ~800–1200 words, keyword-density tuned, and shipped in both `en-IN` and `hi-IN` (Devanagari + Hinglish mix). Mamaearth, Plum, and Foxtale all ship English-only Play long descriptions in India today — a Devanagari-first long description with concern keywords in both scripts is a moat.

### 2.4 Apple keyword field

**Current:** does not exist.

**Score: 0/10 by absence.** Will need a 100-char Phase-1 stuffer covering Hindi concern terms and ingredient terms that don't belong in the user-visible title/subtitle. Full draft in Part 5.

### 2.5 Apple promo text / Play "What's new"

**Apple promo current:** does not exist.
**Play What's new current:** does not exist.

**Score: 0/10 by absence.** Promo text is the only Apple field that updates without an app review, so it's the right surface for time-sensitive hooks ("Diwali glow challenge starts Monday", "Shaadi season prep" etc.). Play's "What's new" is per-release notes — drop concern keywords here ("Acne से लड़ने वाला नया routine added") to keep the long description's keyword density refreshed in the eyes of the Play algorithm.

### 2.6 Categories + tags

**Current:** not configured. `play-store-release-checklist.md` line 121 says "Select app category (likely 'Beauty')" still unchecked.

**Score: 0/10 by absence. Fixed:**
- Play category: **Beauty** (primary). Tags: `Skin care`, `Self care`, `AI tools`, `Wellness routine`, `Beauty routine`.
- Apple primary category: **Health & Fitness**. Secondary: **Lifestyle**. (Beauty is not an Apple category; Health & Fitness > Skincare is the closest match, and gives access to "fitness", "health", "wellness" auto-indexed words.)

A small subtlety: Apple's "Lifestyle" secondary category surfaces in the Browse tab during the App Store's editorial picks, which matter more for a new skincare app than the Health & Fitness Browse tab (dominated by Strava/MyFitnessPal). The pairing — Health & Fitness primary + Lifestyle secondary — gives ASO weight in the discoverable health bucket while keeping a foot in the Browse-curation lane.

### 2.7 Screenshots

**Current:** none uploaded. The repo `assets/` directory has only icon variants — `android-icon-*.png`, `splash-icon.png`, `favicon.png`, `golden-sparkle-preview.png` — nothing in `assets/variants/sparkle-mark` reads as a store screenshot. The Play release checklist line 119 has "Upload phone screenshots (minimum 2, recommended 4-8)" unchecked.

**Score: 0/10 by absence.** What's worse than "absent" is that the design system in `DESIGN.md` is currently set up to produce screenshots that will *fail* the Tier 2/3-Lucknow check. Three problems baked in:

1. **The Fraunces serif headings render thin on cheap LCDs.** A Redmi A2 in 7am sunlight, brightness at 60%, on a 4G connection scrolling Play Store search results — Fraunces' high-contrast strokes will pop visually fine, but the body weight (`text-sm text-[#2D1810]/70`) is unreadable from arms-length at typical thumbnail size. Captions need a heavier sans for store thumbnails, regardless of in-app typography.
2. **Terracotta-on-cream is a low-contrast palette by Play thumbnail standards.** Meesho's thumbnails are red on white, near-WCAG-AAA contrast. GlowUp's `#E07856` on `#FFF5EE` is ~3.1:1 — passes for body text but reads as "soft" in a search results page next to ShareChat (saturated reds/yellows) and Nykaa (black on white).
3. **The current in-app illustrations are emoji-only** (per audience-fit doc §1.9). Screenshots therefore have no human face to anchor "for me" — the first slot has to show a real woman's selfie scan demo, with a model representation rule covering dusky/wheatish/fair (see Part 6).

Full screenshot storyboard in Part 6.

### 2.8 Icon

**Current:** `assets/icon.png`, `assets/android-icon-foreground.png` (over `android-icon-background.png` solid `#E07856` per app.json line 23), monochrome variant present. Splash uses the same sparkle motif.

**Score: 4/10.** The icon as a brand mark is fine — clean, distinctive at desktop sizes. But:

- **At 48dp (Play list view) on a 4G-Lucknow render, the sparkle reads as "wellness/meditation".** It does not register as skincare. Test it: take any of the icon variants, scale to 48px, look at it next to Mamaearth, Plum, Foxtale icons in a stack. GlowUp reads as Headspace/Calm-adjacent, not skincare-adjacent.
- **At 60pt iOS (App Store search), same problem.** iOS is more lenient because the visual register includes lots of abstract icons in Health & Fitness, but it's still a missed opportunity.
- **The cream-on-terracotta-on-cream isn't legible at watch-complication sizes** (you don't ship a watch app today, but Play's small icon tiers go to 18dp on adaptive-icon previews).

Fix: a Play Store Listing Experiment between (a) the current sparkle icon, (b) a face-silhouette icon (woman's profile in cream on terracotta), (c) a glow-droplet icon (a single golden droplet on terracotta evoking ubtan/serum). Hypothesis: (b) wins on the "for me" signal in India because face = skincare semiotically. Sample size and methodology in Part 9.

### 2.9 Feature graphic (Play)

**Current:** does not exist (checklist line 117 unchecked).

**Score: 0/10.** This is the single most important creative on Play — it appears at the top of the listing, in carousel ads, in editorial collections. Full design brief in Part 5 (en-IN and hi-IN versions).

### 2.10 Preview video / Promo video

**Current:** none.

**Score: 0/10.** Not blocking for launch — Play conversion data ([AppTweak — How to Localise Your App for India](https://www.apptweak.com/en/aso-blog/how-to-localize-your-app-in-india)) suggests video is a +5–15% conversion lift on Play in India but doesn't move the keyword needle. Defer to Phase 2 / month 3+.

### 2.11 Developer name

**Current:** `app.json` line 77: `"owner": "rahsai374"`. This is what Play Console will surface as developer name unless overridden in the Play Console "Developer name" field.

**Score: 1/10.** `rahsai374` reads as a personal Expo handle — fine for dev but it's an active conversion deterrent on Play (and an active ranking deterrent, because Play indexes developer name). A Tier 2/3 user sees an alphanumeric handle and reads it as "random Chinese app" / "single dev hobby project" / "scammy."

**Fix:** Register a Play Developer Account under a proper trading name — `GlowUp Beauty` or `GlowUp Skin Care` or, if pursuing the Path-B dual-brand suggestion in the audience-fit doc, `Nikhar Beauty` (Devanagari-friendly). Cost: $25 one-time, ~3-day verification. Done before first Play upload — re-registering after the fact is painful (you'd need a new Play account and a new app slug).

### 2.12 Ratings / reviews state

**Current:** zero ratings, zero reviews. Pre-launch.

**Score: 0/10 by absence.** Phased plan in Part 7. Critical: implement the review prompt **before** the first Meta ad rupee is spent — every paid install that hits a zero-rating listing converts ~30–40% worse than one that hits a 4.3+ listing, per [Apptweak — Ratings & Reviews Impact](https://www.apptweak.com/aso-blog/why-app-ratings-and-reviews-matter-for-aso).

### 2.13 "What does the listing feel like to a Tier 2/3 woman in Lucknow on 4G?" reality check

Imagine 27-year-old Priya in Hazratganj, Lucknow. Vivo Y21, 64 GB, Jio 4G with 2 of 5 bars indoors. Mother-in-law's home, monsoon humidity. She's just seen a Mamaearth Ubtan Face Wash WhatsApp forward and types "skin care app" into Play Store in Hindi keyboard.

Today she sees: **"GlowUp" by rahsai374**, sparkle icon, no screenshots loaded yet (cellular slow), no rating, no Hindi anywhere.

She scrolls past. Net Play search → install rate: roughly zero.

After the Part 5 + Part 6 fixes she sees: **"GlowUp: AI स्किन केयर ऐप" by GlowUp Beauty**, the icon (face-silhouette variant from the listing experiment), 4.5★ from 47 reviews, "AI से skin scan करो — acne, pimple, dark spots, tan के लिए ubtan routine" short description, and the first screenshot loads a dusky South Indian model's face mid-scan with "60 seconds में पूरी skin report" overlay. The "Why GlowUp" Hindi long description is keyword-loaded with "kil-muhase", "ubtan", "haldi", "kasturi haldi", "Lucknow shaadi season glow."

She taps. Convert rate from this listing to install: realistic baseline **25–35%** based on Bharat skincare comparables ([RedSeer × Peak XV BPC report](https://redseer.com/reports/indias-40bn-beauty-personal-care-market-growth-shifts-and-opportunities-for-2030/) and AppTweak India benchmark data).

That difference — zero installs vs ~30% conversion — is the entire ASO project compressed into one comparison.

---

## Part 3 — Skincare keyword research for India

All volume bands below are **directional / indicative**, calibrated against publicly available data from [AppTweak's India Beauty category research](https://www.apptweak.com/aso-blog), [data.ai's India Beauty top-apps lists](https://www.data.ai/), Sensor Tower's India Beauty download index, and Google Keyword Planner organic search volumes (which approximate Play Store search demand because both are Google-owned and share substantial intent). Verify exact numbers in AppTweak / AppFollow before locking metadata; the rankings below should be directionally right but not character-perfect.

**Volume bands used:**
- **High:** >40 (Apple ASA proxy) / >10K monthly Google searches
- **Medium:** 15–40 / 1K–10K monthly
- **Low:** 5–15 / 100–1K monthly
- **Long-tail:** <5 / <100 monthly — winnable for a new app

### 3.1 Generic high-volume

| Keyword | Vol band | Competition | Can GlowUp rank? |
|---|---|---|---|
| skin care app | High (Play) | Brutal — Nykaa, Mamaearth, Plum, Foxtale, Pilgrim, Clinikally all own this in India | Phase 4 |
| skincare | High | Same | Phase 4 |
| skin care | High | Same | Phase 4 |
| beauty app | High | Nykaa, Myntra Beauty, Tira, Purplle dominate | Phase 4, defensive only |
| ghar par skincare | Medium | Weak — mostly YouTube/blog SERPs, few apps target this | **Phase 1 winnable** |
| skincare routine | Medium-High | Mamaearth, Plum, generic content apps | Phase 3 |
| स्किन केयर | Medium | Almost no English-skincare apps localised to Devanagari | **Phase 1 winnable** |
| चेहरे की देखभाल | Low-Medium | Essentially uncontested in app stores | **Phase 1 winnable** |
| skin care hindi | Low-Medium | Almost no competition | **Phase 1 winnable** |

### 3.2 Concern-based

| Keyword | Vol band | Competition | Can GlowUp rank? |
|---|---|---|---|
| acne | High | Acne treatment apps (mostly Western), Mamaearth, Plum | Phase 3 |
| pimple | High | Same | Phase 3 |
| pimple treatment | Medium | Mamaearth, Plum content apps | Phase 2 |
| kil mukason ka ilaaj / kil muhase | Medium | **Essentially uncontested** | **Phase 1 winnable** |
| muhase ka ilaj | Medium | Same | **Phase 1 winnable** |
| pimple ka ilaj hindi | Low-Medium | Same | **Phase 1 winnable** |
| dark spots | High | Skin-lightening apps (some questionable), Plum, Foxtale | Phase 3 |
| kale daag | Medium | Almost no app competition | **Phase 1 winnable** |
| kale daag hatane ka tarika | Medium | YouTube/blog SERPs only | **Phase 1 winnable** |
| dark circles | High | Sleep apps, beauty apps | Phase 3 |
| tanning | Medium-High | Sunscreen brand apps, Lakmé | Phase 2 |
| tan removal | Medium-High | Same | Phase 2 |
| ubtan | Medium | Mamaearth has it in their app name in some markets but not the search head | **Phase 2 winnable** |
| open pores | Medium | Plum content apps | Phase 2 |
| pigmentation | Medium | Foxtale, Clinikally, Plum | Phase 2 |
| pigmentation ka ilaj | Low-Medium | Almost no competition | **Phase 1 winnable** |
| wrinkles | Medium | Anti-aging Western apps | Phase 3 |
| jhuriyan | Low | Uncontested | **Phase 1 winnable** |
| dryness | Medium | Skincare brand apps | Phase 2 |
| oily skin | Medium-High | Brand apps | Phase 2-3 |
| oily skin remedy | Low-Medium | Mostly content SERPs | **Phase 1 winnable** |
| tej dhup se bachao / tan se bachao | Low | Uncontested | **Phase 1 winnable** |

### 3.3 Tool-based

| Keyword | Vol band | Competition | Can GlowUp rank? |
|---|---|---|---|
| skin scan | Medium-High | Nykaa Skin Scan, Skin Story, ALG-AI, Glow AI clones | Phase 2-3 |
| skin scanner | Medium | Same | Phase 2 |
| skin analyzer | Medium | Glow AI, TroveSkin | Phase 2 |
| face analysis app | Medium | Cal AI clones, looksmaxxing apps | Phase 2-3 |
| ai skincare | Medium | Growing — Clinikally Clara, Glow AI | **Phase 2 winnable while window is open** |
| ai skin care | Medium | Same | **Phase 2** |
| selfie skin test | Low-Medium | Almost uncontested | **Phase 1 winnable** |
| selfie skin scan | Low | Same | **Phase 1 winnable** |
| ai face scan | Medium | Cal AI Face, Umax, Glow AI | Phase 2-3 |
| skin checker | Low | Uncontested | **Phase 1 winnable** |
| skin grade | Low | Uncontested | **Phase 1 winnable** |
| skin score app | Low | Glow AI | **Phase 1-2 winnable** |
| skin analysis app | Medium | Some competition | Phase 2 |
| AI से skin check | Low | Uncontested | **Phase 1 winnable (hi-IN)** |

### 3.4 Routine-based

| Keyword | Vol band | Competition | Can GlowUp rank? |
|---|---|---|---|
| skincare routine for oily skin | Medium | Mamaearth, Plum content | Phase 2 |
| morning skincare | Medium | Same | Phase 2 |
| night routine | Medium-High | Habit Tracker, evening routine apps | Phase 3 |
| daily skin routine | Medium | Brand apps | Phase 2 |
| skincare routine hindi | Low-Medium | Almost uncontested | **Phase 1 winnable** |
| ghar pe skincare routine | Low-Medium | Uncontested | **Phase 1 winnable** |
| desi skincare routine | Low | Uncontested | **Phase 1 winnable** |
| weekly face mask routine | Low | Uncontested | **Phase 1 winnable** |
| morning routine hindi | Low | Uncontested | **Phase 1 winnable** |
| oily skin routine | Medium | Mamaearth, Plum | Phase 2 |

### 3.5 Ingredient-based

These map to actual products in `lib/routineData.ts`, so we have genuine "I rank because I do this" credibility.

| Keyword | Vol band | Competition | Can GlowUp rank? |
|---|---|---|---|
| niacinamide | High | The Ordinary, Minimalist, Foxtale | Phase 3 |
| vitamin c serum | High | Same | Phase 3 |
| salicylic acid | High | Same | Phase 3 |
| retinol | High | Same | Phase 3 |
| hyaluronic acid | High | Same | Phase 3 |
| neem face wash | Medium | Himalaya, Khadi | Phase 2 |
| multani mitti | Medium-High | Lakmé, brand apps | Phase 2-3 |
| haldi skin care | Medium | Vicco brand app (yes, it exists) | Phase 2 |
| kasturi haldi | Low | Almost uncontested | **Phase 1 winnable** |
| besan face pack | Low-Medium | Uncontested in apps | **Phase 1 winnable** |
| rose water | Medium | Brand apps | Phase 2 |
| aloe vera gel | Medium | Brand apps | Phase 2 |
| ubtan recipe | Low-Medium | YouTube/blog only | **Phase 1 winnable** |
| ayurvedic skin care | Medium | Patanjali, Kama Ayurveda, Forest Essentials | Phase 2-3 |

### 3.6 Brand-conquest (delicate, optional)

Apple is restrictive about brand bidding ([App Store Review Guidelines § 4.5.3](https://developer.apple.com/app-store/review/guidelines/) — apps can use competitor brand names only "if relevant"). Play is similar. So this is **descriptive comparison usage**, not bidding. Use these in long description ("an alternative to Minimalist"), not in title or subtitle.

| Keyword | Vol band | Competition | Tactic |
|---|---|---|---|
| minimalist alternative | Low | Low | Long description only — "free alternative to Minimalist for Indian skin" |
| nykaa skin advisor | Low | Nykaa owns this | Long description only |
| mamaearth ubtan | Medium | Mamaearth | Skip — too direct |
| plum alternative | Low | Low | Long description only |
| clinikally alternative | Low | Low | Long description only |
| free skincare app | Medium | Mamaearth (when running freemium ads) | Subtitle / short description — clean play |

### 3.7 Cultural / festival / seasonal

These are massive in India and almost entirely uncontested in app stores. The lever: **Apple In-App Events + Play LiveOps + promo text refreshes** timed to the calendar. See Part 10.

| Keyword | Vol band | Window | Can GlowUp rank? |
|---|---|---|---|
| diwali glow up | Medium (Oct–Nov spike) | Oct–Nov | **Phase 1, seasonal — winnable** |
| shaadi skin prep | Medium (Oct–Mar, peak Nov–Feb wedding season) | Wedding season | **Phase 1, seasonal — winnable** |
| karwa chauth glow | Medium (Oct–Nov spike) | Oct–Nov | **Phase 1, seasonal — winnable** |
| honeymoon skin | Low | Year-round | **Phase 1 winnable** |
| holi skin protection | Medium (Mar spike) | Feb–Mar | **Phase 1, seasonal — winnable** |
| monsoon skin care | Medium (Jun–Sep) | Monsoon | **Phase 1, seasonal — winnable** |
| summer tan removal | High (Mar–Jun) | Summer | **Phase 2 seasonal** |
| winter skin care hindi | Medium (Nov–Feb) | Winter | **Phase 1 seasonal** |
| navratri glow | Low (Oct, Mar–Apr) | Festival windows | **Phase 1 seasonal** |
| raksha bandhan skin | Low (Aug) | Festival window | **Phase 1 seasonal** |

### 3.8 Audience-specific / representation

| Keyword | Vol band | Competition | Can GlowUp rank? |
|---|---|---|---|
| indian skin care | Medium | Mamaearth, Forest Essentials | Phase 2 |
| dusky skin care | Low-Medium | Almost uncontested | **Phase 1 winnable** |
| wheatish skin glow | Low | Uncontested | **Phase 1 winnable** |
| desi skin care | Medium | Few apps target this | **Phase 1-2 winnable** |
| indian skin care routine | Medium | Same | **Phase 1-2 winnable** |
| skin care for indian women | Low-Medium | Same | **Phase 1 winnable** |
| skin care hindi app | Low | Almost no Hindi-localised competition | **Phase 1 winnable** |

---

## Part 4 — Phased keyword strategy (4 phases) — for both stores

Goal: start where GlowUp can rank, build install velocity, graduate. Mirror PulseCheck's structure, recalibrated for the Indian Beauty category install dynamics (volume ratios from [data.ai India Beauty top-charts data](https://www.data.ai/)).

### Phase 1 — Long-tail (Month 1–2)

**Goal:** rank top-10 on Play (top-30 on Apple if iOS launches at all) for 20–30 long-tail keywords. Drive 50–100 organic installs/day by week 6.

**Requires:** Metadata fixes from Part 5 deployed. Review prompt live. Phase-1 hi-IN listing shipped on Play.

**Play (en-IN + hi-IN priority):**
- en-IN: `selfie skin test`, `selfie skin scan`, `skin checker`, `skin grade`, `skin score app`, `ghar par skincare`, `desi skincare routine`, `oily skin remedy`, `kasturi haldi`, `besan face pack`, `ubtan recipe`, `dusky skin care`, `wheatish skin glow`, `skin care for indian women`, `skincare routine hindi`, `weekly face mask routine`
- hi-IN: `स्किन केयर`, `चेहरे की देखभाल`, `kil muhase`, `muhase ka ilaj`, `kale daag hatane ka tarika`, `pigmentation ka ilaj`, `tan se bachao`, `jhuriyan`, `ghar pe skincare routine`, `AI से skin check`, `skin care hindi app`, `winter skin care hindi`, `karwa chauth glow`
- Seasonal layer (rotate via "What's new" + LiveOps): `diwali glow up`, `shaadi skin prep`, `holi skin protection`, `monsoon skin care`

**Apple (en-US + en-IN + hi-IN):**
- en-US/en-IN keyword field stuffer: `selfie,scan,test,checker,grade,desi,ubtan,kasturi,haldi,besan,daag,muhase,dusky,wheatish,glow,tan,acne,pimple,dryness,score` (plurals auto-handled in English)
- hi-IN keyword field stuffer: `मुहासे,कील,दाग,निखार,चेहरा,त्वचा,उबटन,हल्दी,बेसन,रोज़,तेल,मुलतानी,मिट्टी`
- Screenshot captions: load Phase 1 winnable terms per Part 6

**Why GlowUp can rank in Phase 1:** Hindi-language skincare keywords have no app-side competition. The PulseCheck doc identified ~15–20 volume-5 long-tail keywords for heart rate; skincare's Hindi long-tail is materially larger because Mamaearth, Plum, Foxtale, Clinikally all ship English-only listings on Play and Apple. Even "kil muhase ka ilaj" — a search term Bobble AI keyboard data suggests gets 5–20K Hindi searches/month — has effectively zero app SERP today. Every install is a free organic.

**Actions for Phase 1:**
- Deploy en-IN + hi-IN Play listings (Part 5)
- Ship review prompt with concern-keyword nudge copy (Part 7)
- Update app every 2 weeks (Apple/Play both reward recency)
- Track Phase 1 keyword rankings weekly in AppTweak free tier or AppFollow ([AppTweak free pricing](https://www.apptweak.com/pricing), [AppFollow free tier](https://appfollow.io/pricing))
- Start ASA / Play Search Ads only on **brand defence** (`glowup`)

### Phase 2 — Medium-tail (Month 2–4)

**Goal:** rank top-20 on Play for 15–20 medium keywords. 150–300 organic installs/day.

**Requires:** ~100 installs/day sustained, 50+ reviews at 4.3+ stars, retention D7 > 20%.

**Play (en-IN + hi-IN):**
- en-IN: `skin scan`, `skin scanner`, `skin analyzer`, `ai skincare`, `ai skin care`, `face analysis app`, `ai face scan`, `pimple treatment`, `tan removal`, `tanning`, `open pores`, `pigmentation`, `ubtan`, `morning skincare`, `daily skin routine`, `skincare routine for oily skin`, `indian skin care`, `desi skin care`, `haldi skin care`, `neem face wash`, `multani mitti`, `aloe vera gel`, `rose water`, `oily skin`, `oily skin routine`
- hi-IN: `स्किन स्कैन`, `AI से चेहरा`, `pimple ka ilaj hindi`, `tan removal hindi`, `morning routine hindi`, `daag dhabbe`, `oily skin ka ilaj`, `ubtan kaise banaye`, `multani mitti face pack`, `रूखी त्वचा का इलाज`

**Apple:**
- Subtitle rotation candidate: trade `Glow Tips` for `Pimple, Tan` to elevate Phase-2 concern terms
- Keyword field gradual rotation: drop `selfie,test,checker,grade` (now self-indexed via title/subtitle/category) → add `analyzer,scanner,tanning,pores,pigmentation,morning,night,routine,oily,dry`
- Hindi keyword field: keep most Phase 1; add `स्कैन,विश्लेषण,इलाज,दिनचर्या`

**Why GlowUp can rank in Phase 2:** Phase 1 velocity (50–100/day) becomes the qualification fuel for Phase 2 medium-tail. The "ai skincare" / "ai skin care" / "ai face scan" window is open right now — Clinikally Clara, Glow AI, and a handful of looksmaxxing apps occupy top-3, but none of them have the Hindi-locale listing GlowUp will, and none have the Hindi review-text moat from Phase 1.

**Actions for Phase 2:**
- Start ASA ₹500–1,000/day on Phase 2 keywords + Play UAC at ~₹500–1,000/day on category themes
- Start Apple Custom Product Pages (one per concern cluster — Part 9)
- Run 4–6 Play Store Listing Experiments (Part 9)
- Add Tamil + Marathi listings on Play (low effort; massive low-competition surface)
- Maintain 4.3+ star rating; reply to every Hindi review in Hindi

### Phase 3 — High-value (Month 4–8)

**Goal:** crack top-30 on Play for 5–10 high-volume head-adjacent keywords. 500–800 organic installs/day. Sustained.

**Requires:** ~300+ installs/day, 250+ reviews, D30 retention >10%.

**Play (en-IN + hi-IN):**
- en-IN: `skin care app`, `skincare`, `acne`, `pimple`, `dark spots`, `dark circles`, `wrinkles`, `skincare routine`, `night routine`, `niacinamide`, `vitamin c serum`, `ayurvedic skin care`, `indian skin care routine`
- hi-IN: `स्किन केयर ऐप`, `मुहासे का इलाज`, `काले धब्बे हटाने का तरीका`, `रात की दिनचर्या`, `बेस्ट स्किन केयर ऐप`

**Apple:**
- Title swap candidate (if `Routine` underperforms): consider `GlowUp: AI Skin Care Scanner` (matches `skin scanner` head term) — verify with App Store Connect Product Page Optimization A/B test before committing
- Subtitle rotation: move toward exact-match head term — `Skincare AI: Acne, Tan, Glow` (29 chars)
- Keyword field: rotate toward `acne,dark,wrinkle,routine,night,morning,clinikally,minimalist,foxtale,niacinamide,salicylic,retinol` (brand conquesting allowed only if you genuinely position as alternative; tread carefully)

**Why GlowUp can rank in Phase 3:** Phase 2 velocity (~300/day) + 250 reviews + 4.3+ stars is the floor that lets you challenge for "skin care app" head term. Real-world precedent: KuKu FM cracked top-3 for "audiobook hindi" in ~6 months at this velocity-and-review profile per [GrowthX KuKu FM deep dive](https://growthx.club/blog/kukufm-business-model). Same dynamic in beauty.

### Phase 4 — Head terms (Month 8+)

**Goal:** top-20 for category-defining English terms. Sustained 1,000+ installs/day. Authority phase.

**Play (en-IN):**
- `skin care`, `skincare`, `beauty app`, `routine`, `skin scanner`, `glow up`
- hi-IN: `स्किन केयर`, `सौंदर्य`

**Apple:** same head-term graduation. Real defensibility now sits in Hindi listings (where Phase-4 head terms are still uncontested) more than English (where Mamaearth / Nykaa / Tira have a permanent moat).

**Actions for Phase 4:** scale ASA + UAC to ₹5,000–10,000/day on head terms with proven CAC, scale Tamil + Telugu + Bengali listings to mature, integrate Apple In-App Events / Play LiveOps as a permanent calendar feature (festival + wedding cycles).

---

## Part 5 — Metadata recommendations (concrete, copy-paste-ready)

### 5.1 Apple App Store

**Locales to maintain:** `en-US` (default), `en-IN` (the most important Apple locale because Indian users have iPhones set to English with India region), `hi-IN` (Devanagari-first).

#### Title (30 chars max)

| Option | Title | Chars | Tradeoffs |
|---|---|---|---|
| A (recommended, en-US + en-IN) | `GlowUp: AI Skin Care Routine` | 28 | Highest-value English keywords. Loses "scanner" / "face". |
| B | `GlowUp: Skin AI Scanner & Care` | 30 | Leads with "Skin AI Scanner" (matches tool-based searches). Loses "routine". |
| C | `GlowUp: AI Face Scan + Routine` | 30 | Leads with "face scan" (matches Cal-AI-style searches). Slightly less category-broad. |
| D (recommended, hi-IN) | `GlowUp: AI स्किन केयर ऐप` | ~24 graphemes (under Apple's 30 limit) | Devanagari surface for Hindi search; keeps "GlowUp" wordmark for install funnel continuity. |

#### Subtitle (30 chars max)

| Option | Subtitle | Chars | Indexed combinations unlocked |
|---|---|---|---|
| A (recommended, en) | `AI Selfie Scan: Acne to Glow` | 28 | "ai selfie", "selfie scan", "ai scan acne", "scan acne glow", "ai skin care selfie" (combining with Title) |
| B | `Skin Test: Acne, Tan, Routine` | 29 | "skin test", "acne tan", "tan routine", "skincare test acne" |
| C | `Free AI Skin Scan & Glow Tips` | 29 | "free AI", "free skin scan", "glow tips", "free skincare ai" — "Free" is a known conversion trigger but slightly weaker keyword payload than A |
| D (recommended, hi-IN) | `Selfie से Skin Check, Acne, Tan` | ~28 graphemes | "selfie skin check", "skin check acne", "skin check tan" — Hinglish that natural users actually search |

#### Keyword Field (100 chars max, comma-separated, no spaces after commas, singular preferred)

**en-US + en-IN (recommended):**
```
pimple,dark,spot,tan,face,scanner,analyzer,ubtan,niacinamide,salicylic,vitamin,glow,desi,test,pore
```
98 chars verified. Note: `routine` is deliberately NOT in the keyword field — it's already in the Title (`GlowUp: AI Skin Care Routine`) and Apple gives zero weight to cross-field repetition. The freed character budget goes to `pore` (Phase 2 concern term — "open pores" is a medium-tail keyword GlowUp will graduate to). Combinations this unlocks with Title + Subtitle (`AI Selfie Scan: Acne to Glow`):

| Keyword Field word | Combines with | Search phrases unlocked | Indicative vol |
|---|---|---|---|
| pimple | care, routine (title) | "pimple skin care", "pimple routine", "skin pimple", "ai pimple scan" | Med-High |
| dark | spot (kw), care (title) | "dark spot", "dark skin care", "dark spot routine" | High |
| spot | dark (kw) | "dark spot" exact | High |
| tan | (already in subtitle? no — only in keyword) | "tan routine", "tan skin care", "ai tan scan" | Med-High |
| face | scanner (kw), care (title) | "face scanner", "face skin care", "ai face scan", "face routine" | High |
| scanner | face (kw), skin (title) | "skin scanner", "face scanner", "ai skin scanner" | Med-High |
| analyzer | skin (title) | "skin analyzer", "ai skin analyzer", "face analyzer" | Medium |
| ubtan | skin, care (title) | "ubtan skin care", "ubtan routine" | Med |
| niacinamide | skin (title) | "niacinamide skin", "niacinamide routine" | High |
| salicylic | (alone) | "salicylic acid" (with auto-plural) | High |
| vitamin | (alone) | "vitamin c", "vitamin c serum" | High |
| glow | up (title), tips, routine | "glow up", "glow routine", "glow tips" | High |
| desi | skin (title) | "desi skin care", "desi routine" | Med |
| test | skin (title), selfie (subtitle) | "skin test", "selfie skin test" | Med |
| pore | (alone) | "pore" (auto-pluralises to "pores", "open pores") | Med |

Phase 2 rotation candidates (swap in when Phase 1 winners promote to Subtitle): drop `test` and `desi` (likely already top-3 by then) → add `wrinkle`, `pigmentation` (note: "pigmentation" is 12 chars, will need to drop two short words to fit).

**hi-IN keyword field (recommended):**
```
मुहासे,कील,दाग,चेहरा,त्वचा,निखार,उबटन,हल्दी,बेसन,रोज़,तेल,मुलतानी,मिट्टी,दिनचर्या
```
~99 graphemes — verify in App Store Connect before submission (Devanagari grapheme counting is occasionally off in Apple's tooling).

**Words deliberately excluded and why:**
- `skin`, `care`, `ai`, `glow`, `selfie`, `acne` — already in Title or Subtitle. Apple gives zero weight to repetition.
- `free` — high-volume conversion word, but consider it for the **subtitle Phase 3 rotation** rather than the keyword field (subtitle gets higher weight). Also Apple auto-indexes "free" as a price descriptor for free apps.
- `app`, `best`, `new`, `top` — Apple auto-indexes these category words.
- `health`, `fitness` — auto-indexed via primary category (Health & Fitness).
- `lifestyle`, `beauty` — auto-indexed via secondary category and category name.
- `pimples`, `spots`, `scars`, `routines` — Apple auto-handles English plurals.

#### Promo text (170 chars, updates without app review)

| Option | Copy | Use case |
|---|---|---|
| A (default, en) | `Get your free AI skin analysis in 60 seconds. Personalised routine with Indian ingredients & products from ₹75. Hindi support. No subscription needed.` (147 chars) | Always-on |
| B (Diwali) | `Diwali glow goal? Free AI skin scan + 21-day glow plan with ubtan, kasturi haldi, multani mitti. New for festival season. Hindi + English.` (140 chars) | Oct–Nov rotation |
| C (Shaadi) | `Shaadi season prep? Free AI skin scan + bride-glow plan with desi remedies. Personalised in Hindi or English. No subscription.` (127 chars) | Oct–Mar rotation |

#### Screenshot captions (5 + 5)

Captions are now indexed since WWDC 2025 — treat as a fourth metadata field. Full storyboard in Part 6.

#### Description first 3 lines + structure (NOT indexed on Apple but critical above-the-fold conversion copy)

```
60 सेकंड में skin scan करो — AI से।
Free skin analysis. Acne, pimples, dark spots, tan, dryness.
Personalised routine in Hindi & English. No subscription. Ever.

Why GlowUp?
• AI Skin Analysis — point your camera, get a 10-metric report (hydration, acne-prone, dark spots, radiance, more)
• Personalised Routine — morning, night, weekly steps using Himalaya, Biotique, Vicco, Dabur (₹75–₹240, available at any chemist)
• Desi Remedies, Built In — ubtan, multani mitti, kasturi haldi, besan, neem-haldi recipes from your dadi's notebook, prescribed by AI
• Bilingual — full Hindi (Devanagari + Hinglish) + English. No subscription. No locked features. Tracking your glow is free.
• Privacy-First — your selfie stays on your device. We don't sell your face.

— Skin concerns we help with —
Acne & pimples (kil-muhase), dark spots (kale daag), pigmentation, tanning, dryness, oily skin, open pores, dull skin, dark circles, fine lines.

— Indian skin, Indian ingredients —
Built for dusky, wheatish, fair, and every skin tone in between. Routine uses kasturi haldi, ubtan, multani mitti, rose water, aloe vera, neem, besan, raw milk, honey — and modern products from Himalaya, Biotique, Dabur, Khadi, Vicco at chemist-friendly prices.

— Made in India, for Bharat —
Hindi support. Tamil, Telugu, Marathi, Bengali coming soon. WhatsApp helpline. No medical advice — AI estimate only.
```

Strategic note: Apple description is NOT indexed for keyword search, but it IS the conversion copy. Lead with the Hindi line because an `en-IN` iPhone user who reads Devanagari sees "this is for me" immediately.

### 5.2 Google Play

**Locales to maintain:** `en-IN` (default for India), `en-US` (for diaspora), `hi-IN` (the most important locale). Phase 2 adds `ta-IN`, `mr-IN`, `bn-IN`. Phase 3 adds `te-IN`, `gu-IN`, `pa-IN`, `kn-IN`, `ml-IN`, `or-IN`.

#### App title (30 chars)

Same three options as Apple, same recommendation:
- A (recommended, en-IN + en-US): `GlowUp: AI Skin Care Routine` (28 chars)
- B: `GlowUp: Skin AI Scanner & Care` (30)
- C: `GlowUp: AI Face Scan + Routine` (30)
- D (recommended, hi-IN): `GlowUp: AI स्किन केयर ऐप`

Edit `app.json` line 3 to ship the en-IN/en-US version as the default app `name`. Set the hi-IN override in Play Console > Main store listing > Hindi (India). Apple is independent — set in App Store Connect after Play ships.

#### Short description (80 chars max)

| Option | Copy | Chars | Tradeoffs |
|---|---|---|---|
| A (recommended, en-IN) | `AI selfie skin scan for acne, dark spots, tan. Free desi routine tips.` | 70 | High concern-keyword density. Natural to read. |
| B | `Free AI skin care app: acne, pimples, tan, dark spots, glow tips & routine.` | 76 | Heavier keyword density, "free" as conversion trigger, slightly less natural. |
| C | `Selfie skin test in 60 seconds. Personalised acne & glow routine. Free.` | 71 | Speed callout, "free" at end. |
| D (recommended, hi-IN) | `AI से skin scan करो — acne, pimple, dark spots, tan के लिए ubtan routine.` | ~75 graphemes | Hinglish that natural users type. Keyword payload: AI, skin scan, acne, pimple, dark spots, tan, ubtan, routine |
| E (recommended, en-US) | `AI skin care app for Indian skin: acne, dark spots, tan. Free desi routine.` | 75 | Same as A but explicitly "Indian skin" — for diaspora |

Run a Play Store Listing Experiment between A and B in week 4. Keep D as the hi-IN champion until further data.

#### Long description (4,000 char max — IS indexed on Play)

Below is the full en-IN draft (~1,050 words, well under 4,000 chars). Structure: Hook (above-fold) → Problem → Features → Social proof → Audience → CTA → Keyword tail.

```
60 seconds. One selfie. Your full AI skin report.

GlowUp is a free AI skin care app built for Indian skin — acne, pimples, dark spots, tanning, pigmentation, dryness, open pores, dark circles, dullness, fine lines. Point your phone camera at your face. In 60 seconds, GlowUp's AI analyses your skin across 10 metrics — hydration, blemish-prone areas, redness, oiliness, dark spots, radiance, texture, firmness, wrinkles, dark circles — and gives you a personalised morning, night, and weekly skin care routine.

—

The problem
Most Indian women juggle real skin concerns — acne flare-ups before periods, tanning after summer, kale daag from old breakouts, oily T-zone in the afternoon, dryness in winter — but the skincare advice on Instagram and YouTube is generic, English-only, and built around expensive serums you've never heard of. GlowUp fixes that.

—

What GlowUp does for you

✨ AI Skin Analysis in 60 seconds
Just take a selfie. Our AI (powered by Google Gemini) reads your skin like a dermatology textbook — hydration, oiliness, blemish-prone zones, dark spots, redness, texture, radiance, firmness, wrinkles, dark circles. You get an overall skin score, your skin age, and your top concern. All free, no subscription, no signup wall beyond a quick phone OTP.

✨ Personalised Routine — Morning, Night, Weekly
Based on your scan + a quick 5-question quiz (skin type, main concern, water intake, sunscreen, age), GlowUp builds a routine specifically for you. Morning: cleanse, tone, moisturise, sunscreen. Night: cleanse, nourish. Weekly: exfoliate, treatment masks. Each step has a product recommendation and a desi remedy alternative.

✨ Desi Remedies, AI-Prescribed
Your dadi was right. Ubtan, multani mitti, kasturi haldi, besan, neem-haldi paste, rose water, raw milk, honey, aloe vera — the GlowUp routine includes traditional Indian remedies at every step, customised to your skin type and concern. No marketing fluff — real recipes with quantities and timings.

✨ Real Products at Chemist Prices
Every routine step also includes an affordable product recommendation: Himalaya Purifying Neem Face Wash (₹75), Dabur Gulabari Rose Water (₹90), Vicco Turmeric Skin Cream (₹95), Khadi Neem & Tulsi Face Wash (₹180), Biotique Bio Honey Cream (₹150). No ₹1,500 imported serums. Real products you can pick up at any chemist or order on Flipkart, Amazon, Meesho.

✨ Track Your Glow
Scan once a week. Watch your skin score improve. The Progress screen shows your trend over time so you can see what's actually working — better than guessing in the mirror.

✨ Daily Tips, Bilingual
Hindi (Devanagari + Hinglish) + English support across the app. Skin tips, weekly routines, concern-based knowledge cards — all readable in your language.

—

What makes GlowUp different from other skin care apps?

Unlike generic skincare apps built for Western skin and Western products, GlowUp is built for Indian skin tones — dusky, wheatish, fair, brown — and Indian conditions: monsoon humidity, summer tanning, festival skin prep (Diwali, Karwa Chauth, Shaadi), pollution exposure. Our routines use products available in any Indian chemist shop, not expensive imported brands.

Free, forever for core features. No locked paywalls on your skin scan, your basic routine, or your progress chart. (Premium add-ons like ingredient scanner are coming later — your core skin care is and will stay free.)

Built in India. By a small team. For 1.4 billion of us.

—

Concerns we help with
Acne & pimples (kil-muhase, kil-mukason ka ilaj), dark spots (kale daag hatane ka tarika), pigmentation (pigmentation ka ilaj), tanning (tan removal, tan se bachao), dryness (rookhi twacha ka ilaj), oily skin (oily skin ka ilaj), open pores, dull skin (nikhar), dark circles, fine lines & wrinkles (jhuriyan), uneven skin tone, post-inflammatory marks.

Desi ingredients in your routine
Ubtan, multani mitti, kasturi haldi, besan, neem, haldi (turmeric), rose water (gulab jal), aloe vera gel, coconut oil (nariyal tel), almond oil (badam tel), castor oil, honey (shahad), raw milk (kaccha doodh), curd (dahi), saffron (kesar), papaya, potato juice, glycerin.

Brands we recommend (all chemist-affordable)
Himalaya, Biotique, Dabur, Khadi Natural, Vicco, Patanjali — plus desi recipes that cost ₹20 at your local store.

—

For brides, festivals, and everyday glow
Shaadi skin prep, Karwa Chauth glow, Diwali skin care, Holi skin protection, monsoon skin care, summer tanning recovery — GlowUp's routines update with the calendar so your skin care fits your real Indian life.

—

Privacy first
Your selfie stays on your device. We never sell your face. Phone OTP login (we send the OTP, that's it). Account deletion anytime from your profile. We're DPDP-compliant.

Important: GlowUp gives AI skin estimates — not medical advice. For severe acne, persistent rashes, or any condition that worries you, please see a dermatologist. GlowUp is a self-care companion, not a doctor.

—

Built for Bharat. Hindi support today. Tamil, Telugu, Marathi, Bengali coming soon. WhatsApp helpline because trust is built through humans.

Download free. Take your first scan. See your glow.

#skincare #skincareapp #aiskincare #skinscan #acne #pimple #darkspots #tan #ubtan #indianskin #hindi #skincarehindi #glowup #routine #beauty #selfcare
```

The hashtag tail at the end is intentional Play SEO — Play does index hashtag strings in long description. Keep it under 15 hashtags so the listing doesn't look spammy to users who scroll to the bottom.

**hi-IN long description draft (full Devanagari-first version):** would be similar structure, ~3,500 chars, leading with `60 सेकंड में अपनी skin का AI report पाओ।` and using `kil-muhase`, `kale daag`, `pigmentation ka ilaj`, `ubtan recipe` as the primary keyword surface. Should be commissioned from a native Hindi copywriter (₹5–10K), not LLM-translated — Bharat readers detect machine-translated Hindi instantly per `docs/audience-fit-tier2-tier3.md` §1.2.

#### Feature graphic (1024×500, Play)

**en-IN brief:** Left two-thirds: dusky-skinned woman (~24–28) holding phone for skin scan, soft warm light, monsoon-Lucknow morning vibe. Right one-third: phone mockup showing the score reveal screen with circular meter at "78". Overlay text bottom-left in heavy sans-serif: `Free AI Skin Scan — Acne, Tan, Dark Spots`. Bottom-right small badge: `Made in India 🇮🇳`. Background gradient `#FFEFE3 → #FFE2D1` (Card warm gradient from DESIGN.md). Use a heavier sans (Inter, Plus Jakarta Sans Bold, or DM Sans Bold) for the overlay rather than Fraunces — Fraunces serif disappears at Play thumbnail scaling.

**hi-IN brief:** Same composition. Overlay text in Devanagari: `60 सेकंड में AI Skin Scan — Free`. Use Hind or Mukta Bold for Devanagari rather than Fraunces (Fraunces has no Devanagari glyphs and would fall back to system font with terrible kerning).

Both versions enter into a Play Store Listing Experiment (variant A: composition + en text, variant B: composition + hi text, variant C: composition + bilingual overlay).

#### Screenshot captions (8 screenshots, Play)

Full storyboard in Part 6. Caption keyword payload for each slot:
1. Hook + selfie scan demo — `Free AI Skin Scan in 60 Seconds`
2. Quiz / personalisation — `5 questions. Your routine — built for your skin.`
3. Score reveal — `Acne, Tan, Dark Spots — see your skin score`
4. 10-metric radar — `10 metrics: hydration, oiliness, dark spots, more`
5. Routine — morning — `Morning routine: cleanse, tone, moisturise, sunscreen`
6. Routine — desi remedy — `Ubtan, multani mitti, kasturi haldi — built in`
7. Progress chart — `Track your glow weekly. See real progress.`
8. Hindi support cue — `Full Hindi support. Built for Indian skin.`

---

## Part 6 — Screenshot + creative spec

### 6.1 Play storyboard (8 screenshots — phone, 1080×1920, portrait)

Play allows up to 8 phone screenshots; ship all 8 because Play's algorithm gives carousel-scroll-depth a tiny conversion signal and because each slot is an indexed surface for caption keywords.

| # | Screen shown | Caption text | Background | Model rep rule | Overlay font / size |
|---|---|---|---|---|---|
| 1 | Selfie-scan demo (analyzing state) — face in oval guide, scanning sweep | `Free AI Skin Scan in 60 Seconds` | Cream `#FFF5EE` with terracotta blob top-right | Dusky-skinned woman, ~24–28, no makeup, natural light. **First impression = "this is for me."** | Plus Jakarta Sans Black 56pt — heavy enough for sunlight LCD |
| 2 | Onboarding question Q1 — "What's your main skin concern?" + options | `5 questions. Your routine — built for your skin.` | Cream | Same model arm holding phone, blurred background | Plus Jakarta Sans Black 56pt |
| 3 | Results hero — circular score meter at "78", "Skin Age 26" | `Acne, Tan, Dark Spots — see your skin score` | White-to-cream gradient (Results hero bg per DESIGN.md) | Smaller inset photo of wheatish model | Plus Jakarta Sans Black 52pt |
| 4 | Radar chart card — 10-metric panel | `10 metrics. Hydration, oiliness, dark spots, more.` | Cream + blob | No model — chart focus | Plus Jakarta Sans Black 50pt + radar focus |
| 5 | Routine screen — morning tab expanded, steps visible | `Morning routine: cleanse, tone, moisturise, sunscreen` | Cream + golden gradient card | Inset hand applying cream | Plus Jakarta Sans Bold 48pt |
| 6 | Routine — remedy card expanded with `ubtan` / `kasturi haldi` step | `Ubtan, multani mitti, kasturi haldi — built in` | Golden gradient | Inset bowl of besan + rose water | Plus Jakarta Sans Bold 48pt |
| 7 | Progress chart — line graph of score over time | `Track your glow weekly. See real progress.` | Cream + blob | Fair-skinned model smiling at phone | Plus Jakarta Sans Bold 48pt |
| 8 | Language picker showing Hindi + English | `Full Hindi support. Built for Indian skin.` | Cream | No model — Devanagari "हिन्दी" big | Hind Bold 60pt (because Devanagari) |

**Model representation rule (must follow):** screenshots 1–7 must collectively show **at least one dusky, one wheatish, one fair model** (Fitzpatrick types IV, III, II respectively). Tone diversity is the single biggest "for me" signal for Tier 2/3 users and is the way GlowUp signals it's not another Western-skin app. The audience-fit doc explicitly flags the missed opportunity in §1.9 — fix it at the listing layer first, then in-app.

**Hindi vs English per slot:**
- en-IN listing: captions in English (slots 1–7), Hindi-cue on slot 8.
- hi-IN listing: **captions in Devanagari for slots 1, 2, 3, 8**; Hinglish for slots 4, 5, 6, 7 (because radar metric names, product names, "morning routine" are natural Hinglish per i18n/hi.json).

**Sunlight-readability constraint:** every overlay must be tested at 60% brightness on a Redmi A2 / Vivo Y21 class display in outdoor light. Plus Jakarta Sans Black at 48pt minimum survives this; Fraunces serif does not. Test before shipping.

### 6.2 Apple storyboard (5 screenshots — iPhone 6.7" + 6.1" required)

Apple captions are now indexed (WWDC 2025) so they double as ranking surface.

| # | Screen | Caption (keyword payload) | Notes |
|---|---|---|---|
| 1 | Results hero — score meter + Skin Age + Skin Type | `Free AI Skin Analysis — Acne, Tan, Dark Spots` (keyword: free, AI, skin analysis, acne, tan, dark spots) | Lead screenshot. First view in search results. |
| 2 | Scan flow — face guide oval mid-scan | `Selfie Skin Scan in 60 Seconds` (keyword: selfie, skin scan) | Speed + tool callout |
| 3 | Routine — morning tab expanded with `ubtan` step visible | `Personalised Routine: Ubtan, Multani Mitti, Niacinamide` (keyword: routine, ubtan, multani mitti, niacinamide) | Mixes desi + clinical ingredient keywords |
| 4 | Radar + 10-metric panel | `Track 10 Skin Metrics — Hydration, Glow, Wrinkles` (keyword: track, skin metrics, hydration, glow, wrinkles) | Analytical screenshot |
| 5 | Progress + Hindi language toggle | `Hindi + English. Built for Indian Skin.` (keyword: hindi, english, indian skin) | Locale + representation signal |

Apple iOS rendering is more lenient with serif fonts at Apple screenshot size than Play is — Fraunces overlays are acceptable here. Use Plus Jakarta Sans for captions in Hindi (Apple doesn't render Hind well at small sizes).

---

## Part 7 — Reviews + ratings strategy

### 7.1 Current state
Pre-launch. Zero ratings, zero reviews. Per `play-store-release-checklist.md`, the in-app review prompt is not yet wired (P2 / not-blocking but should be Phase-1-blocker for ASO purposes).

### 7.2 Phased targets

| Phase | Target | Why |
|---|---|---|
| Phase 1 (Month 1–2) | 30 reviews, 4.5+ avg | Minimum credibility floor. Below ~20 reviews, Play install conversion drops by ~30% per AppTweak India benchmarks. |
| Phase 2 (Month 2–4) | 100–150 reviews, 3–6 new/week, 4.4+ avg | Sustained velocity is what separates ranked from unranked apps. |
| Phase 3 (Month 4–8) | 300–500 reviews, 8–15 new/week, 4.3+ avg | Competitors Mamaearth and Plum apps have 50K+ reviews — you can't out-volume them; you can out-rate them in the Indian skin care niche. |
| Phase 4 (Month 8+) | 1,000+ reviews, self-sustaining velocity | Authority phase. Organic install flow generates reviews without prompting. |

### 7.3 Play vs Apple difference (operationally)

Apple review text is NOT a keyword signal — coach users to leave stars + sentiment.

**Play review text IS a keyword signal.** Coach users to mention concern keywords. In-app review prompt copy on Play should explicitly invite Hindi reviews and concern-mentions:

> **Good prompt copy (en-IN):** "Loved GlowUp? Tell us — what skin concern did we help with? (acne, dark spots, tan, dryness…). Your review helps other Indian women find us. Thank you 🙏"
>
> **Good prompt copy (hi-IN):** "GlowUp pasand aaya? बताइए — किस skin concern में help मिली? (kil-muhase, kale daag, tan, dryness…). आपकी review से और Indian women हमें ढूँढ पाएँगी। Thank you 🙏"

This is the explicit instruction-to-mention-keyword tactic. It is **allowed by both Play and Apple policy** as long as you don't condition the review on incentive — see [Apple App Store Review Guidelines § 5.6.1](https://developer.apple.com/app-store/review/guidelines/#5.6.1) and [Play Developer Program Policy — Ratings and Reviews](https://support.google.com/googleplay/android-developer/answer/9899234). You are coaching what to write, not gating on whether they review.

### 7.4 In-app prompt timing

**Trigger:** AFTER the user has seen at least one of the following positive moments:
1. First Score Reveal that shows an improvement vs. baseline (D7+ scan), OR
2. Third routine step marked complete (per `analytics-tracking-plan.md` events), OR
3. Day 5 of an active streak (per `useUserStore.ts` streak logic), OR
4. After successfully sharing a Share Card on WhatsApp (positive social moment)

**Never trigger:**
- On first launch
- After any error or scan failure (`scan_processing_failed` event from analytics plan)
- After a paywall (no paywall yet, but when one ships)
- Mid-scan
- Immediately after sign-up

**Implementation:** use `expo-store-review` (wraps SKStoreReviewController on iOS and Play In-App Review API on Android). Throttle to once per major version per Apple/Play limits. Add a "Rate us" deep link in Profile screen for users who weren't prompted or dismissed.

### 7.5 Reply templates

Every review gets a reply within 24 hours. Replies are public — they are marketing material.

**5-star (en, Play + Apple):**
> Thank you so much! So glad GlowUp helped with your [concern mentioned]. We're working on [feature] next — stay tuned! Tell a friend with a similar concern? 🙏

**5-star (hi):**
> Bahut bahut shukriya! 🙏 So happy ki GlowUp aapke [concern mentioned] mein help kar paya. Aage [feature] aa raha hai — keep glowing! Apni friend ko bhi try karne ke liye kaho? ✨

**4-star:**
> Thank you for the review! Curious — what would have made it 5 stars? Tell us at hello@glowup.app (or reply here). We read every reply. 🙏

**1–3 star (legit complaint, en):**
> So sorry for [specific issue]. We've [fixed it in v1.2 / are working on it for next release]. Please write to hello@glowup.app with your phone number — we'd love to make it right. 🙏

**1–3 star (hi):**
> [Issue] ke liye bahut sorry! 🙏 Hum [fixed/working on it] kar rahe hain. Please hello@glowup.app par WhatsApp number bhejiye — personally help karenge.

**Feature request:**
> Great suggestion 🌿 — [feature] is on our roadmap. We prioritise based on reviews like yours, so this helps a lot. Thank you for using GlowUp!

**Refund complaint** (when payments ship):
> So sorry — refund process: send your phone number + order ID to hello@glowup.app. Refunds go back to UPI within 5–7 working days as per Razorpay. We respond same day. 🙏

**Refund complaint (hi):**
> Refund ke liye sorry 🙏 — apna phone number + order ID hello@glowup.app par bhejo. Razorpay 5–7 din mein UPI par refund kar dega. Hum same-day reply karte hain.

### 7.6 Tier 2/3 reality

Many Tier 2/3 women will not write English reviews even if they leave 5 stars. Ask in Hindi explicitly and reply in Hindi. Treat one 4-line Hindi review as worth more than three 1-line English ones — both for keyword density (review text is a Play ranking signal) and for the conversion-uplift effect on the next user who reads the listing and sees a Hindi review.

A practical rule the founder should follow personally: read 5 reviews/day from the Play Console, reply within 2 hours during business hours, route emotional / complex ones through the WhatsApp helpline (per solo-founder-playbook §1.1 Support Agent + Founder escalation pattern).

---

## Part 8 — Localisation strategy

Apple lets each locale have its own 30+30+100 metadata block. Play lets each country-locale have title + short + long. **Both are massively under-used by Indian skincare competitors.** This is the single highest-leverage ASO move after Title + Long Description.

| Locale | TAM (smartphone users 18–35F, est.) | ASO competition in skincare | Effort to ship | Recommended phase |
|---|---|---|---|---|
| **en-IN** | ~60M (English-fluent India) | High — Mamaearth, Plum, Foxtale all present | Already done if you ship en-IN as default | Phase 1 |
| **hi-IN** | ~110M (Hindi-belt smartphone-using women 18–35) | **Almost zero — biggest ASO unfair advantage in the category** | 1 week (Devanagari long description + translator) | **Phase 1 — non-negotiable** |
| **ta-IN (Tamil)** | ~25M | Almost zero — Tamil skincare app SERPs are empty | 1 week + native translator (₹3–5K) | **Phase 1 — high priority** |
| **mr-IN (Marathi)** | ~22M (Maharashtra is the third-largest smartphone state) | Almost zero | 1 week + translator (₹3–5K) | **Phase 1 — high priority** |
| **te-IN (Telugu)** | ~28M (Andhra + Telangana) | Almost zero | 1 week + translator | Phase 2 |
| **bn-IN (Bengali)** | ~24M (West Bengal + Tripura) | Almost zero | 1 week + translator | Phase 2 |
| **gu-IN (Gujarati)** | ~12M | Almost zero | 1 week + translator | Phase 3 |
| **kn-IN (Kannada)** | ~18M | Almost zero | 1 week + translator | Phase 3 |
| **pa-IN (Punjabi)** | ~10M | Almost zero | 1 week + translator | Phase 3 |
| **ml-IN (Malayalam)** | ~15M (Kerala) | Almost zero | 1 week + translator | Phase 3 |
| **or-IN (Odia)** | ~7M | Almost zero | 1 week + translator | Phase 4 |
| **en-US** | Indian diaspora ~3M users | High but irrelevant to GlowUp positioning | Trivial — copy en-IN | Phase 1 |

**Critical rule (from audience-fit doc §1.2):** use **native human translators**, not LLM auto-translation. Tier 2/3 users detect machine-translated Hindi within seconds. Budget ₹3–8K per locale per long-form translation; ~₹500–1,000 per locale for title/short-description-only rewrites. Total Phase 1 + 2 translation budget: **₹40–80K across 6 locales**.

**Recommendation:** Phase 1 ships en-IN + hi-IN + ta-IN + mr-IN simultaneously. Tamil and Marathi together cover ~47M women and are the two Indian languages with the strongest D2C beauty native search behaviour ([CosmeticsDesign Asia](https://www.cosmeticsdesign-asia.com/Article/2024/08/28/India-beauty-market-analysis-How-to-win-over-beauty-consumers-in-tier-two-and-three-cities/)). Phase 2 adds Telugu + Bengali. Phase 3 fills the rest.

The metric to watch per locale: install conversion rate. If hi-IN converts at 28% vs en-IN at 21% (likely), that's the proof the localisation strategy is right and accelerates the rollout schedule.

---

## Part 9 — Listing experiments (Play) + Custom Product Pages (Apple)

### 9.1 Play Store Listing Experiments

Play allows up to **5 concurrent listing experiments** per app — see [Play Console — Run store listing experiments](https://support.google.com/googleplay/android-developer/answer/9844921). Each experiment is a server-side A/B test on a single creative or text element.

Statistical minimums Play recommends: **at least 1,000 store listing visitors per variant**, **at least 1% lift to call a winner**. At 100 installs/day in Phase 1 → ~500 visitors/day → 2–4 weeks per test. Plan accordingly.

| # | Experiment | Hypothesis | Variants | Traffic split | Sample size | Success metric |
|---|---|---|---|---|---|---|
| 1 | **Icon (Phase 1 priority)** | Face-silhouette icon converts better than sparkle icon for skincare semiotics in India | A: current sparkle, B: face-silhouette, C: glow-droplet | 33/33/33 | 1,000 visitors/variant | Install conversion rate (15-day window) |
| 2 | **Feature graphic** | Hindi-overlay graphic outperforms English-overlay for hi-IN traffic | A: English overlay, B: Hindi overlay, C: bilingual overlay | 33/33/33 (hi-IN listing only) | 1,000 visitors/variant | Conversion rate |
| 3 | **Short description** | Option A ("AI selfie skin scan...") vs Option B ("Free AI skin care app...") | A vs B | 50/50 | 1,000 visitors/variant | Conversion rate |
| 4 | **Screenshot order** | Lead screenshot = score reveal (current) vs lead = selfie-scan demo (proposed) | A: results-first, B: scan-first | 50/50 | 1,000 visitors/variant | Conversion rate |
| 5 | **Short description CTA placement** | "Free" at start vs end of short description | A: "Free AI selfie skin scan..." (front), B: "...routine tips. Free." (back) | 50/50 | 1,000 visitors/variant | Conversion rate |
| 6 | **Hindi-script vs Hinglish in short description (hi-IN)** | Pure Devanagari vs Devanagari + Roman mix | A: Devanagari heavy, B: Hinglish mix | 50/50 (hi-IN only) | 1,000 visitors/variant | Conversion rate |

Queue 1, 2, 3 for week 4. Hold 4, 5, 6 for week 8–12 after Phase-1 winners ship.

### 9.2 Apple Custom Product Pages

Apple allows up to **70 CPPs per app** and CPPs appear in organic search results as of July 2025. Build 4–6 CPPs aligned to keyword clusters from Part 3:

| CPP | Assigned keywords (in keyword field) | Screenshot focus | Headline / promo text |
|---|---|---|---|
| Default | All unassigned keywords | General — selfie scan + score + routine | `Free AI Skin Analysis — Acne, Tan, Dark Spots` |
| CPP-Acne | `pimple`, `acne` (auto), `kil`, `muhase` (hi-IN) | Lead screenshot = acne-zone close-up + spot-treatment routine card | `Acne & Pimple Routine — Built for Indian Skin` |
| CPP-Tan | `tan`, `tanning`, `summer` (custom) | Lead screenshot = tan-removal routine with multani mitti card | `Tan Removal Routine — Multani Mitti + Modern Skincare` |
| CPP-DarkSpots | `dark`, `spot`, `daag` (hi-IN) | Lead screenshot = dark spot tracking + kasturi haldi step | `Dark Spots & Pigmentation — AI-Built Routine` |
| CPP-Dryness | `dry`, `hydration`, `niacinamide` | Lead screenshot = dry skin remedy + hydration metric chart | `Dry Skin Glow-Up Routine — Hindi + English` |
| CPP-Festival | `diwali`, `shaadi`, `karwa chauth` (custom, In-App Event linked) | Lead screenshot = festival-themed glow plan | `Diwali / Shaadi Glow Routine — 21-Day Plan` |

Each CPP costs ~₹0 extra to ship but ~2–3 hours of design effort per page (because the lead screenshot is the only thing that changes). All 6 should ship before Phase 2 ASA spend goes live, because CPPs feed paid traffic from concern-keyword ASA into matched landing pages → higher conversion → higher ranking feedback.

---

## Part 10 — ASA + Play Search Ads + Apple In-App Events / Play LiveOps

### 10.1 Apple Search Ads (post-iOS-launch)

**Budget bands:**
- **Brand defence (day one of iOS launch):** ₹200–500/day on `glowup` only. Stops competitors from buying your brand term. Defensive spend — pays for itself instantly.
- **Phase 1 seeding (month 1–2 iOS):** ₹500–1,000/day on Phase 1 long-tail keywords. Goal: prove organic velocity uplift signal to the Apple algorithm.
- **Phase 2 ramp (month 2–4 iOS):** ₹1,000–3,000/day on Phase 2 medium-tail keywords. CPI target ₹40–60 (Indian skincare CPI band).
- **Phase 3 scaling (month 4–8 iOS):** ₹3,000–10,000/day if CAC payback is < 60 days on subscription revenue from `payments-and-paywall-report.md`.

**ASA keyword bid logic:**
- Apple's exact-match recommended bid in India for skincare keywords runs ₹30–₹80 CPT (cost per tap) based on AppTweak India ASA benchmarks. Set initial max bid at 1.5× recommended on Phase 1 keywords (you want top-1 placement on low-volume terms).
- Use **Discovery campaigns** to find broad-match converters, then graduate winners to exact-match Brand and Competitor campaigns.
- Defensive bids on competitor brands (`mamaearth`, `plum`, `foxtale`, `clinikally`, `nykaa`) require the competitor's name in your relevant metadata or you'll be rejected for relevance. Skip until Phase 3.

### 10.2 Play Search Ads via Google Ads UAC

- Google UAC for Apps is auto-bidding only — set target CPI (~₹35–₹50 for Indian skincare) and target install volume; let Google's ML pick keywords from your store listing.
- **Don't start UAC in Phase 1.** Wait until you have ≥30 reviews and a non-zero conversion rate on the listing — UAC ML is brutal to listings with no install history. Start in Phase 2.
- Keyword themes for UAC creative (Google uses these to match queries to your video/image ads):
  - "AI skin care routine"
  - "Acne treatment app"
  - "Tan removal app Hindi"
  - "Skin care Hindi"
  - "Free skin scan"
  - "Skin care for Indian women"
- Defensive UAC bid on `glowup` from day-one Play launch — even ₹200/day is enough to outbid any competitor's brand-conquest attempt.

### 10.3 Apple In-App Events (post-iOS launch)

In-App Events appear in App Store search and Today tab. Each event has a banner, image, description, time window. Treat as seasonal ASO surface.

5 event ideas for GlowUp:

1. **"21-Day Diwali Glow Challenge"** — runs Oct 1–22. Description: "Daily ubtan + routine. Track your glow before Diwali." Drives `diwali glow` and `21 day routine` keyword searches.
2. **"Shaadi Season Skin Prep"** — runs Oct–Mar. Description: "Bride skin routine — 8 weeks to shaadi glow." Drives `shaadi skin`, `bride skin prep`, `dulhan skin` searches.
3. **"Holi Skin Protection Week"** — runs the week before Holi. Description: "Pre-Holi prep + post-Holi recovery routine." Drives `holi skin care`.
4. **"Monsoon Skin Care Series"** — runs Jun–Sep. "Acne in humidity — your monsoon routine."
5. **"Summer Tan Removal Sprint"** — runs Apr–Jun. "Multani mitti + modern actives for tan."

### 10.4 Play LiveOps

Play's equivalent surface is **Promotional Content** (live events that appear as inline cards in the Play Store under your listing and in editorial collections). Mirror the In-App Events list above. Submit each one ~2 weeks before its window for editorial review.

Additionally use Play's **What's new** field on each release to drop the active seasonal keyword block — e.g. October's release notes lead with "New: 21-Day Diwali Glow Challenge — track your skin score daily, share your glow up." This refreshes keyword density in the long description's eyes and Google rewards active-update signal.

---

## Part 11 — Measurement + iteration

### 11.1 Weekly tracking table

| Metric | Tool | Phase 1 target | Phase 2 target | Phase 3 target |
|---|---|---|---|---|
| Keyword rankings (top-10 on Play for Phase 1 KWs) | AppTweak free tier OR AppFollow free tier OR ASODesk | 10 keywords in top 10 by week 6 | 20 in top 10 | 5 head terms in top 20 |
| Listing impressions (Play Console > Acquisition) | Play Console / App Store Connect Analytics | 1,000/day | 5,000/day | 15,000/day |
| Listing visitors | Play Console / App Store Connect | 500/day | 2,500/day | 7,500/day |
| Install conversion rate (visitors → installs) | Play Console — store listing acquisition / App Store Connect — Product Page CR | Play: >20% / Apple: >25% | Play: >25% / Apple: >30% | Play: >28% / Apple: >32% |
| Installs/day | Play Console / App Store Connect | 50–100 | 150–300 | 500–800 |
| D1 retention | Firebase Analytics / Play Console — Retention | >50% | >55% | >60% |
| D7 retention | Firebase Analytics | >20% | >25% | >30% |
| D30 retention | Firebase Analytics | >8% | >12% | >18% |
| Rating + review count | Play Console / App Store Connect | 30 reviews, 4.5+ | 100 reviews, 4.4+ | 300 reviews, 4.3+ |
| Review velocity (new/week) | Play Console | 3–5/week | 8–12/week | 20+/week |
| Crash-free user rate (Play Vitals / Crashlytics) | Crashlytics | >99.5% | >99.7% | >99.8% |

### 11.2 Rotation rules

- **Check rankings every 2 weeks** after a metadata update. Both stores re-index within 24–72 hours of an app version bump.
- **If a Phase 1 keyword hasn't moved into top 100 after 2 update cycles (4 weeks)** → drop from keyword field (Apple) or de-emphasise in long description (Play); replace with a fresh long-tail candidate from Part 3.7's seasonal pool.
- **If a Phase 1 keyword ranks 10–30** → promote it to higher-weight field on next update (keyword field → subtitle on Apple; long description body → short description on Play).
- **If a keyword ranks top 5** → freeze that metadata; focus on conversion rate for that listing (CPP or Listing Experiment).
- **Phase graduation rule:** when ≥70% of Phase N keywords are top-10 (Play) or top-20 (Apple), and install velocity is at the next phase's target, start seeding Phase N+1 words on the next release. Don't yank Phase N words — let them age out gracefully.

### 11.3 Release cadence

- Ship a Play update every 2 weeks in Phase 1 and Phase 2 (every 14 days). This refreshes Play's freshness signal, lets you rotate keywords in long description, and lets you A/B-test screenshot changes.
- Apple: every 2 weeks during the active Phase 1–2 push, slowing to every 4 weeks in Phase 3+ to stay under TestFlight reviewer fatigue.

---

## Part 12 — 30-day execution checklist

Tied to the solo-founder-playbook stage gates (S0 = pre-launch prep, S1 = Phase 1 launch).

### Week 1 — Foundation (S0 wrap)
| Task | Owner | Est time | Est cost |
|---|---|---|---|
| Edit `app.json` line 3 to `"name": "GlowUp: AI Skin Care Routine"` | FOUNDER | 5 min | ₹0 |
| Register Play Developer Account under `GlowUp Beauty` | FOUNDER | 30 min + 3 day verification | ₹2,100 |
| Register Apple Developer Program (just to claim slug, even if iOS launch is deferred) | FOUNDER | 30 min + 24-48h verification | ₹8,000 |
| Brief Hindi copywriter on long description (target 3,500 chars Devanagari + Hinglish) | FOUNDER → freelancer | 1 hour brief + 3 days writer | ₹5,000–10,000 |
| Brief designer on icon variants A/B/C + feature graphic en-IN + hi-IN | FOUNDER → freelance designer | 2 hours brief | ₹15,000–30,000 (3 icon variants + 2 feature graphics) |
| Implement `expo-store-review` review prompt with concern-keyword nudge copy | FOUNDER (eng) | 4 hours | ₹0 |
| Wire Hindi review prompt copy (i18n) | FOUNDER (eng) | 2 hours | ₹0 |
| Draft Apple title + subtitle + keyword field + description (en-US + en-IN + hi-IN) | FOUNDER | 4 hours | ₹0 |
| Draft Play long description en-IN (Part 5 above is the draft) | FOUNDER (review only) | 1 hour | ₹0 (already drafted) |

### Week 2 — Translation + screenshots (S0 wrap)
| Task | Owner | Est time | Cost |
|---|---|---|---|
| Receive Hindi long description from translator; review | FOUNDER | 2 hours | (paid in W1) |
| Commission Tamil + Marathi short + long description translations | FOUNDER → freelance translators | 5 days | ₹6,000–10,000 (3K each) |
| Shoot / commission 8 Play screenshots + 5 Apple screenshots — dusky + wheatish + fair models | FOUNDER → freelance designer + photographer | 3–5 days | ₹15,000–35,000 (model fees + design) |
| Run a Lucknow-friend remote check on the listing draft — show screenshots + short description to 3 Tier 2/3 women, get "would you install" gut check | FOUNDER (informal qualitative) | 1 hour | ₹0 (chai) |
| Production AAB build + device end-to-end test (per release checklist P0 line 49) | FOUNDER (eng) | 4 hours | ₹0 |
| Verify Gemini API key has been moved to Cloud Functions (release checklist P0 line 27) | FOUNDER (eng) | 4 hours | ₹0 |

### Week 3 — Submit + experiments queue
| Task | Owner | Est time | Cost |
|---|---|---|---|
| Submit Play en-IN + hi-IN + ta-IN + mr-IN listings | FOUNDER | 2 hours | ₹0 |
| Queue Listing Experiments 1 (icon), 2 (feature graphic), 3 (short description) | FOUNDER | 1 hour | ₹0 |
| Submit Apple en-US + en-IN + hi-IN listings (if iOS launch in scope; else just hold the slug) | FOUNDER | 2 hours | ₹0 |
| Configure ASA brand defence on `glowup` at ₹200/day | FOUNDER (if iOS) | 30 min | ₹6,000/mo cap |
| Configure UAC brand defence on `glowup` at ₹200/day | FOUNDER | 30 min | ₹6,000/mo cap |
| Set up AppTweak free tier or AppFollow free tier tracking for Phase 1 keywords | FOUNDER | 1 hour | ₹0 (free tier) |

### Week 4 — Live + iterate
| Task | Owner | Est time | Cost |
|---|---|---|---|
| Go live on Play (Production track) | FOUNDER | (auto after review) | ₹0 |
| Reply to every review within 24h, mark concern-keyword reviews for promotion to social proof in long description on next release | FOUNDER + Support Agent (per playbook §5.1) | 30 min/day | ₹0 (agent runtime) |
| Daily keyword rank check (5 min via AppTweak/AppFollow) | Analytics Agent + FOUNDER review | 5 min/day | ₹0 |
| Review Listing Experiment results at day 14 (if 1,000 visitors/variant reached); declare winners; ship the winning variants | FOUNDER | 2 hours | ₹0 |
| Submit a Week-4 release with What's-new line referencing a Phase-1 seasonal keyword ("Monsoon skin care routine added") | FOUNDER | 1 hour | ₹0 |
| Brief content team / agents on first 5 Instagram + ShareChat creatives that reuse the listing copy (consistency across acquisition surfaces) | FOUNDER → Content Agent | 1 hour | ₹0 |

**Total W1–W4 spend:** ~₹50,000–110,000 (range driven mostly by photography + design quality choices). Aligns with solo-founder-playbook moderate-budget S0/S1 envelope.

---

## Part 13 — Decisions needed from founder

Open questions, mirroring the PulseCheck "Decisions Needed" section.

1. **Bharat-native rename — hi-IN listing only, or app-wide?** Recommendation: hi-IN listing only ("GlowUp: AI स्किन केयर ऐप"). In-app brand stays "GlowUp" until you decide on Path B's full rename (Nikhar / Roop / Glow in Devanagari) per audience-fit doc §Part 4. Doing it in-app first risks breaking the cross-store search funnel.

2. **Which 4 secondary Indian languages for Phase 1?** Recommendation: Hindi + Tamil + Marathi + Bengali. Telugu deferred to Phase 2 only because Andhra/Telangana market entry needs its own influencer playbook and that takes a month to spin up. Override if you have a Telugu personal network advantage.

3. **ASO tracking tool — AppTweak ($58/mo) vs AppFollow free?** Recommendation: AppFollow free tier through Phase 1 (it covers 1 app, ~50 keywords, weekly rank updates). Graduate to AppTweak Pro ($58/mo, [AppTweak Pricing](https://www.apptweak.com/pricing)) at Phase 2 when you're running 80+ keywords across 4 locales and you need the competitor-tracking + keyword-suggestion AI. Don't pay for ASODesk or Sensor Tower — both are overkill for solo-founder scale.

4. **iOS launch timing — month 4 or month 9?** Recommendation: month 9 (per solo-founder-playbook §2). Tier 2/3 Hindi-belt iPhone-using women are a rounding error; iOS is for the diaspora and Tier 1 metro share later. Apple slug should still be reserved in Week 1 of W1–W4 above.

5. **When to start ASA / UAC?** Recommendation: brand defence on Play UAC at launch (W4) at ₹200/day cap. Phase 2 broad UAC at month 3 once review count > 30 and listing CR > 22%. ASA only after iOS launch.

6. **Path B Bharat-native rename of the app itself (Nikhar / Roop / etc.) — when?** Recommendation: month 6+, after first 1,000 active Hindi users have given feedback on the brand-fit. Until then, "GlowUp" is the wordmark; vernacular brand cues live in feature graphic + screenshot overlays + long description, not in the app icon or wordmark.

7. **Custom Product Pages (Apple) — build pre-launch or post-Phase-1 metadata stability?** Recommendation: build post-Phase-1, around month 3–4. CPPs are most valuable when paired with ASA campaigns funnelling traffic into them; before ASA is live, the default product page is sufficient.

8. **Listing Experiments — start at launch or after 4 weeks of stable baseline?** Recommendation: start at launch (Listing Experiments need traffic to converge; starting early just means longer time-to-significance, which is fine). Don't wait.

9. **Feature graphic — single bilingual version, or A/B test en vs hi?** Recommendation: A/B test (Experiment 2 above). The hypothesis is hi-IN variant wins by 15–25 percentage points on hi-IN traffic. If it does, it validates the broader hi-IN-first investment.

10. **Brand-conquest of competitors in long description (Mamaearth, Plum, Foxtale, Clinikally) — yes or no?** Recommendation: NO in Phase 1–2. Even though Play indexes long description text, leading with "alternative to Mamaearth" reads cheap and risks Play policy review under "misleading claims". Add the competitor-named comparison only once you have ≥1,000 paying users and a real "we are different because…" story.

---

## Sources

**App / repo:**
- `app.json` (lines 3, 17, 21, 77 — current metadata state)
- `i18n/en.json` + `i18n/hi.json` (current bilingual UI copy)
- `lib/routineData.ts` (product database, ingredient list — Himalaya, Biotique, Vicco, Dabur, Khadi; ubtan, multani mitti, kasturi haldi recipes)
- `DESIGN.md` §1–§7 (color tokens, typography — terracotta `#E07856`, cream `#FFF5EE`, Fraunces serif, Hind for Devanagari)
- `docs/audience-fit-tier2-tier3.md` (Path B rationale, Tier 2/3 reality)
- `docs/payments-and-paywall-report.md` (pricing rails — ₹19 / ₹49 / ₹99 anchors)
- `docs/analytics-tracking-plan.md` (conversion event names mapped to Meta + GA4)
- `docs/play-store-release-checklist.md` (P0/P1/P2 submission gates)
- `docs/solo-founder-playbook.md` §1, §2 (stage gates, weekly rhythm)

**Apple ASO references:**
- [Apple Developer — App Store search optimization](https://developer.apple.com/app-store/search/)
- [App Store Connect Help — Add Keywords](https://developer.apple.com/help/app-store-connect/manage-app-information/add-app-keywords)
- [Apple — App Store Review Guidelines § 4.5.3 (brand bidding), § 5.6.1 (ratings & reviews)](https://developer.apple.com/app-store/review/guidelines/)
- [Apple — Custom Product Pages](https://developer.apple.com/app-store/custom-product-pages/)
- [Apple — In-App Events](https://developer.apple.com/app-store/in-app-events/)

**Google Play ASO references:**
- [Play Console Help — Store listing best practices](https://support.google.com/googleplay/android-developer/answer/9866151)
- [Play Console Help — Increase visibility through Play search](https://support.google.com/googleplay/android-developer/answer/4448378)
- [Play Console — How user feedback affects your visibility](https://support.google.com/googleplay/android-developer/answer/138230)
- [Play Console — Run store listing experiments](https://support.google.com/googleplay/android-developer/answer/9844921)
- [Play Console — Promotional content / LiveOps](https://support.google.com/googleplay/android-developer/answer/9899684)
- [Play — Developer Program Policy — Ratings and reviews](https://support.google.com/googleplay/android-developer/answer/9899234)

**India market / Tier 2/3 + skincare data:**
- [RedSeer — The $3.2Bn Bharat Opportunity](https://redseer.com/articles/the-3-2bn-bharat-opportunity-how-tier-2-cities-are-driving-indias-interactive-media-boom/)
- [RedSeer × Peak XV — India's $40Bn Beauty & Personal Care Market](https://redseer.com/reports/indias-40bn-beauty-personal-care-market-growth-shifts-and-opportunities-for-2030/) (and [IBEF summary](https://www.ibef.org/news/according-to-a-joint-report-by-redseer-strategy-consultants-and-peak-xv-pure-play-brands-to-drive-india-s-us-30-billion-beauty-and-personal-care-market-opportunity))
- [Indian Retailer — India leads global beauty e-commerce +39%](https://www.indianretailer.com/article/technology-e-commerce/digital-trends/india-leads-global-beauty-e-commerce-boom-39-pc-growth)
- [CosmeticsDesign Asia — How to win Tier 2/3 beauty consumers](https://www.cosmeticsdesign-asia.com/Article/2024/08/28/India-beauty-market-analysis-How-to-win-over-beauty-consumers-in-tier-two-and-three-cities/)
- [India Skincare Market Intelligence Report 2026 — Imapro](https://gaurav.imapro.in/research/india-skincare-market-report)
- [Storyboard18 — 660M smartphone users power Digital Bharat](https://www.storyboard18.com/digital/660-million-smartphone-users-16-17-billion-monthly-upi-transactions-power-digital-bharat-report-89731.htm)
- [TechCrunch — India's app downloads hit 25.5B in 2025](https://techcrunch.com/2026/01/21/indias-app-downloads-rebounded-to-25-5-billion-in-2025-fueled-by-ai-assistants-and-microdrama-boom/)
- [LS Digital — Vernacular SEO for Tier 2/3](https://www.lsdigital.com/blog/vernacular-seo-the-key-to-tapping-into-indias-tier-2-and-tier-3-markets/)
- [CleverType — Bobble AI Hinglish data](https://www.clevertype.co/post/from-english-to-hinglish-ai-keyboards-embrace-local-languages-in-india)

**ASO tooling:**
- [AppTweak Pricing](https://www.apptweak.com/pricing) + [AppTweak — How to Localise Your App for India](https://www.apptweak.com/en/aso-blog/how-to-localize-your-app-in-india) + [AppTweak — Ratings & Reviews Impact](https://www.apptweak.com/aso-blog/why-app-ratings-and-reviews-matter-for-aso)
- [AppFollow Pricing](https://appfollow.io/pricing)
- [data.ai (formerly App Annie)](https://www.data.ai/) — India Beauty category top-charts
- [Sensor Tower](https://sensortower.com/) — India app intelligence
- Reference doc: `uploads/a3d213e7-01_ASO_Strategy.pdf` (PulseCheck ASO Strategy, March 2026) — structural template, not content
