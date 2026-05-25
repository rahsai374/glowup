# GlowUp — Payments & Paywall Strategy

**Prepared for:** Rahul (founder, GlowUp)
**Date:** 25 May 2026
**Scope:** India billing rails + paywall placement for MVP

---

## 0. Context (what's actually being sold)

GlowUp is a Hindi/English skin-scan app for Indian women. The scan produces a meaningful reveal — an overall score, "skin age", a 10-metric radar (hydration, oiliness, dark spots, wrinkles, dark circles, etc.), a top concern, a top win, two-sentence advice, plus a morning / night / weekly routine with specific product recommendations at ₹199–₹2,499 price points. That's a real "wow" moment to gate, and it's the right thing to be thinking about. The MVP is pre-launch, solo-built on Expo + Firebase + Gemini, target cost <$20/mo at 1K users. ARPU expectations should be set accordingly.

Two things from the codebase shape everything below:

1. **The "value moment" is the report reveal, not the routine.** The routine is a nicely-formatted derivative of the scan + Q1+Q2; users will recognise it as advice. The 10-metric radar is the perceptual peak — it's the screen that *feels* personal and intelligent. Whatever paywall strategy you pick, the report screen is the wedge.
2. **Retention is structurally hard.** A skin scan isn't a daily-use product. Users will scan, get a verdict, maybe try one product, and forget. Anything you charge for has to either (a) be a one-shot value capture or (b) create a reason to re-scan and re-engage. The current PLAN.md has Progress (scan history + trends) and Routine reminders queued for Phase 3 — those are the only re-engagement hooks in the design. Pricing has to assume them, or build replacements.

---

## Part 1 — India payments & autopay landscape (2026)

### TL;DR

For a ₹99–₹299/month consumer wellness app at MVP scale, the realistic stack is:

- **Razorpay Subscriptions on UPI Autopay**, with **card eMandate as fallback**.
- Don't bother with Juspay (overkill / enterprise), Stripe India (invite-only, no advantage), or netbanking eNACH (terrible UX for ₹199 tickets).
- Build for **failure tolerance**, not for the happy path — UPI Autopay success rates have collapsed and are the single biggest threat to your topline.

### 1.1 What the RBI rules actually allow right now

The e-mandate framework as it stands in 2026 (re-confirmed by RBI in the latest Digital Payments Framework update) [[RBI E-Mandate Framework]](https://www.outlookbusiness.com/ampstories/news/rbi-e-mandate-framework-2026-new-rules-for-auto-pay-upi-cards-wallets) [[RBI auto-debit rules May 2026]](https://www.ibtimes.co.in/rbi-auto-debit-rules-explained-what-new-changes-mean-your-upi-card-payments-may-2026-901696):

- **AFA exemption up to ₹15,000** per recurring transaction across UPI, cards and wallets — the user authenticates once when setting up the mandate; subsequent debits up to ₹15K happen with no OTP. [[Paytm UPI Autopay guide]](https://paytm.com/blog/bill-payments/upi-autopay/upi-autopay-maximum-limit-complete-guide-2025/)
- **₹1,00,000 AFA-free limit** is reserved for mutual fund SIPs, insurance premiums, and credit card bills. Wellness subscriptions don't qualify. Don't plan around it.
- **24-hour pre-debit notification is mandatory.** Every renewal generates a notification 24 hrs before the debit, with amount + merchant + date. Users can cancel or pause inside that window. This is the silent revenue-killer — you'll lose a chunk of users at every renewal who see the notification, realise they forgot, and tap cancel.
- **UPI Autopay processes ~1 billion recurring txns/month** and ~35M new mandates were created in Jan 2025 alone (~2× YoY) — so consumer comprehension is there. [[Razorpay UPI Autopay vs eNACH]](https://razorpay.com/blog/upi-autopay-vs-enach-comparison/)

For a ₹99–₹299/month ticket you are comfortably inside the AFA-free band on all rails.

### 1.2 Success rate is the headline problem

This is the single most important fact in this whole report:

> **UPI Autopay debit success rates dropped from ~50% (Jan 2024) to ~30% (Nov 2025).** Card eMandate sits around 70%+. [[Razorpay UPI Autopay vs eNACH]](https://razorpay.com/blog/upi-autopay-vs-enach-comparison/) [[Cashfree UPI Autopay vs Cards]](https://www.cashfree.com/blog/upi-autopay-vs-cards-india-subscriptions/) [[Whalesbook]](https://www.whalesbook.com/news/English/economy/Merchants-Favor-UPI-Autopay-Over-Cards-Despite-Lower-Success-Rate/695f4705ef4ed95f98060af9)

Why it dropped: tighter bank-side fraud controls, weak balance management on UPI, broken SMS pre-debit delivery, and the 24-hr cancel window. The fact that merchants still favour UPI Autopay despite this is because reach is overwhelmingly larger than cards — most of your target users (Tier 2/3 Indian women, mobile-first) don't have a credit card with sufficient limit, and even debit-card eMandate adoption is far lower than UPI.

**Practical implication:** if you model 30% renewal success, a ₹199/month plan with no retry/recovery logic yields **₹60 effective MRR per active subscriber** before churn. Your dunning and retry stack matters as much as your pricing. This is where Razorpay's edge over Cashfree starts to matter (more below).

### 1.3 The provider comparison

| Provider | Setup time | Subscription pricing (domestic UPI/card) | Recurring support | Notable for GlowUp |
|---|---|---|---|---|
| **Razorpay Subscriptions** | KYC 1–3 days digital [[Razorpay KYC guide]](https://razorpay.com/blog/payment-gateway-kyc-onboarding-india/) | UPI: ~2% + GST. Cards: 2% gateway + **0.99% subscription fee** + GST (~3.5% all-in) [[Razorpay pricing breakdown]](https://www.softwaresuggest.com/blog/razorpay-payment-gateway-charges/) | UPI Autopay, card eMandate, eNACH, intelligent retries, dunning, webhook-driven | **Best subscription tooling.** Retries on failed debits, dunning, expired-card handling — exactly what you need given a 30% baseline UPI success rate. |
| **Cashfree Subscriptions** | KYC 24–48 hrs [[Cashfree onboarding FAQs]](https://www.cashfree.com/docs/help/onboarding-related/general-faqs) | 1.75% domestic headline (lowest among major Indian PGs) [[Cashfree vs Razorpay vs PayU]](https://shop2host.com/best-payment-gateway-india) | UPI Autopay, eMandate, eNACH | Cheaper base rate, faster onboarding, weaker subscription orchestration. Fine if you want headline cost down and will build retries yourself — you won't. |
| **Juspay** | Enterprise sales, no self-serve | Custom; meaningful for >₹1cr/mo GMV | UPI Autopay, eNACH, batch mandates, SI on cards, claims 99% success via intelligent routing [[Juspay subscriptions]](https://juspay.io/subscription) | Overkill until you're at 5-figure paid users. Skip for MVP. |
| **Stripe India** | **Invite-only**; foreign-incorporated entities easier [[Stripe India docs]](https://docs.stripe.com/india-recurring-payments) | ~2% domestic, higher than Razorpay/Cashfree all-in | UPI recurring (≤₹15K), card eMandate | Gives you nothing Razorpay doesn't and you have to wait for an invite. Useful only if you later sell to NRIs / foreign users in INR-equivalent. |
| **PayU India** | KYC 2–4 days | ~2% domestic, subscription module priced separately | UPI Autopay, eMandate | Mature but UX/dev experience trails Razorpay. No reason to pick over Razorpay unless rates are negotiated. |

**Refund / dispute handling.** Cards have proper chargeback frameworks via Visa/Mastercard/RuPay [[Credit card chargeback guide]](https://righttoinformation.wiki/credit-card-chargeback-guide-india). UPI does **not** have chargebacks in the card sense — disputes go through NPCI's redressal mechanism (TAT ~3 days), and unresolved cases escalate to the RBI Integrated Ombudsman [[UPI Chargeback Rules 2026]](https://www.herofincorp.com/blog/upi-transaction-chargeback-rules-npci-norms) [[NPCI dispute redressal]](https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism). For a low-ticket wellness sub this is mostly fine — your real exposure is *refund requests*, not *chargebacks*. Build a one-tap "cancel + refund last debit" in-app; it's cheaper than fighting an ombudsman complaint and is genuinely good policy at ₹199.

### 1.4 Recommendation for the MVP payments stack

1. **Razorpay Subscriptions, UPI Autopay primary, card eMandate fallback offered on the same paywall.** Pay the 0.99% subscription premium — the retry/dunning machinery is the single biggest lever against the 30% baseline failure rate. Don't pinch the 25 bps when 70% of your renewals will fail.
2. **Skip eNACH entirely for MVP.** Netbenking auth flows are painful on mobile and your target user doesn't have the patience.
3. **KYC the entity now, in parallel with build.** Bank-name / PAN mismatch causes ~40% of onboarding delays [[Razorpay KYC guide]](https://razorpay.com/blog/payment-gateway-kyc-onboarding-india/) — get the current-account name to match PAN exactly *before* you submit. If you're operating as a sole proprietor pre-Pvt-Ltd, you can KYC with a Udyam registration + GST + current account; expect 2–3 business days.
4. **One-time ₹X purchase as a third option** for users who refuse autopay. UPI standing-instruction adoption is improving but is not universal; offering a one-shot "unlock this scan's full report — ₹49" via standard UPI Intent flow has near-100% success and converts the "I just want to see *this* one" segment that would otherwise bounce.
5. **Instrument every step.** Mandate-creation success, first-debit success, renewal success at month 1/2/3, cancel rate during the 24-hr pre-debit window. You won't know which failure mode is killing you without it.

---

## Part 2 — Paywall placement & MVP validation

### 2.1 The journey map and where a paywall could sit

GlowUp's full user flow is: **Splash → Language → Onboarding slides → Phone OTP → Q1–Q5 → Home → Scan → Analyzing → Results → Routine → Progress / Tips / Profile**. There are eight defensible paywall positions. Here's what each actually does to the funnel.

| # | Paywall position | What it gates | Conversion | Activation | Retention | MVP-learning value |
|---|---|---|---|---|---|---|
| A | At install / app open | The whole app | Catastrophic — ~95% of users bounce | Zero | N/A | Zero. You'll learn nothing except your ad creative. |
| B | After language pick, before onboarding slides | Onboarding | Catastrophic | Zero | N/A | Zero. |
| C | Before selfie capture ("unlock scan") | The scan itself | Low — users haven't experienced anything yet | Low | Mid | Low. You're charging for a promise. |
| D | **After selfie, before scan processing / report reveal** | The processing + reveal | **Medium-high** — sunk cost from taking the photo + answering 2–5 questions | Mid | Mid | **High** — clean willingness-to-pay signal |
| E | After report reveal, before "deeper" sections (radar detail, advice, skin age) | Partial report | Lower than D | Higher than D | Mid | Medium |
| F | After report, before personalized routine | The routine | Low — users got the "answer" already and feel done | High activation but low monetisation | Mid | Low |
| G | After scan #1 free, before scan #2 | Re-scan | Soft, very low immediate conversion | High | **Highest** — only mechanism that ties revenue to engagement | Medium — slow signal |
| H | Before progress tracking / scan history | The longitudinal value | Tiny — depends on users coming back | High first session | Low (only converts returners) | Low |

The two real candidates are **D** (founder's instinct) and **G** (re-scan / "cadence" model). E is a watered-down D and not worth running as a wedge — once you've shown a partial report, the user has the dopamine hit and will leave. F is the worst of all worlds: high activation, near-zero revenue, no MVP learning.

### 2.2 The founder's idea — paywall right before the report reveal — is correct, and here's why

**This is the same wedge that Glow AI, Umax, Cal AI, OnSkin, and FaceApp all converged on.** It's not a coincidence; it's the most efficient way to monetise a "scan → reveal" loop.

Concrete benchmarks:

- **Glow AI** (US skincare scan, almost a direct comparable): hard paywall with **blurred preview** of the result behind the paywall. Hit **$17K MRR in 6 days** of launch. [[Glow AI $0 to $10k MRR]](https://startupspells.com/p/glow-ai-viral-skincare-app-10k-mrr-3-days)
- **Umax** (looksmaxxing/face-rating, scan → score): hard paywall, $3.99/week, **$6M ARR in 3.5 months**, solo founder, no VC. [[Looksmaxxing apps overview]](https://onpointfresh.com/looksmaxxing-apps/)
- **Cal AI** (food/photo scan): hard paywall after quiz-style onboarding, 3-day trial → recurring. **$40M ARR**; acquired by MyFitnessPal in 3/2026. 31% lift in trial→paid from paywall experimentation. [[Superwall Cal AI case study]](https://superwall.com/case-studies/cal-ai)
- **FaceApp** (photo transformation reveal): soft paywall ~14 seconds into onboarding, 7-day trial, single annual plan. **$10M/month** from iOS alone. [[FaceApp paywall analysis]](https://www.paywallscreens.com/apps/faceapp-perfect-face-editor-mobile-paywall-f664) [[FaceApp revenue stats]](https://www.businessofapps.com/data/faceapp-statistics/)
- **OnSkin** (skincare scanner): paywall in onboarding with toggle to "Enable Free Trial" — 3-day → weekly. [[Subscription pricing in photo apps]](https://dev.to/paywallpro/subscription-pricing-in-photo-video-apps-what-1200-paywalls-reveal-3ok9)
- **Headspace**: paywall *upfront* (before content) reaches 1.78% install→paid — the top performing config across subscription categories. [[App onboarding before paywall]](https://www.airbridge.io/en/blog/5-steps-app-onboarding-before-the-paywall)
- **Noom**: 113-screen onboarding before paywall, very high commitment-build. [[RevenueCat Noom teardown]](https://www.revenuecat.com/blog/growth/web-to-app-onboarding-funnel/)

There's a structural reason all of these landed on roughly the same position: **the scan/photo is the user's investment**, the **reveal is the variable reward**, and the **paywall sits exactly at the moment between investment and reward**. That's the highest-tension, highest-conversion point in the entire funnel. The psychology is identical to a slot machine pull — the user has already committed (taken the photo, sat through the analyzing animation), and the marginal cost of paying feels small relative to the marginal regret of walking away with nothing.

**The counter-argument (and why I don't buy it for GlowUp).** The case against pre-reveal paywalling is that you never get to wow the user, so you don't get word-of-mouth, ratings, or shareable moments — and you can't test whether your scan output is actually any good, because nobody sees it. That's a real concern for a low-quality product, but the standard "scan → wow" pattern (Cal AI, Glow AI, Umax) has shown that *the act of taking the selfie and watching the analysing animation is itself the wow.* The reveal is the carrot; the carrot can be paywalled. And you can mitigate the discovery problem with a teaser — show the overall score (just the number) and the radar shape but blur the labels and the metrics. Glow AI's "blurred preview" pattern is exactly this.

### 2.3 Where the founder's idea is *wrong* and what to change

Two corrections to "paywall right before report reveal":

1. **Don't paywall *processing*, paywall *full disclosure*.** Let the scan complete (it costs you ~₹0.16 in Gemini API per scan — irrelevant). Show the user the overall score number, the radar chart shape, and the top concern *headline only* ("Hydration is your top concern"). Then paywall the 10-metric breakdown, skin age, advice, and routine behind the subscription. This is the Glow AI / OnSkin pattern. It gives you (a) a free "wow" hook for organic / ratings, (b) the dopamine reveal that drives conversion, and (c) a real teaser for word-of-mouth ("my skin score is 67, I need to find out why"). Pure-hard-paywall-before-processing loses you all of this.
2. **Bundle it with the onboarding investment, not just the selfie.** Cal AI and Noom both stretched onboarding *intentionally* — 100+ screens of quiz — because every answered question increases the felt cost of bouncing. You currently have Q1–Q5; that's right-sized for the MVP. But pace it as "we're building your personal skin profile" rather than "here are some questions" — sunk cost is a feature, not a bug.

### 2.4 What likely *won't* solve retention

Two retention myths to kill upfront before they eat the roadmap:

- **"Daily reminders / push notifications will hold them."** No. The user does not want a daily skincare ritual nag for a routine they bought online. Reminders work for habit apps (meditation, language learning) where the user *wants* the streak. For a verdict-product like a skin scan, push only works to drive re-scans, and re-scans only feel meaningful at monthly+ cadence (skin doesn't change in a week).
- **"Add more content — tips, articles, more routines."** Content adds Day-1 perceived value but doesn't fix the structural retention problem. The Indian skincare content market is saturated (Nykaa, Vogue India, Cure.fit content, hundreds of Instagram dermatologists). You will not out-content them. Don't price the app as if you can.

What *will* drive retention is making re-scan feel meaningful: monthly scan + visible delta on the radar chart ("hydration ↑ 12 since last scan"). The Progress screen in PLAN.md is exactly this. **The whole subscription pitch rests on this screen working well.** If you're going to cut anything from Phase 3 to ship faster, don't cut Progress.

### 2.5 Pricing model trade-offs

| Model | Fits GlowUp? | Notes |
|---|---|---|
| **Hard paywall, no free trial** | Maybe, but aggressive | Glow AI / Umax pattern. Highest immediate cash, lowest organic / ratings, brutal refund rate (~4% for AI apps, ~20% higher than non-AI [[TechCrunch AI app retention]](https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows/)). |
| **Hard paywall with 3-day free trial → weekly/monthly** | **Yes** | Cal AI / OnSkin pattern. Top-performers hit 1.78% install→paid and 20%+ trial→paid. [[App onboarding before paywall]](https://www.airbridge.io/en/blog/5-steps-app-onboarding-before-the-paywall) |
| **Freemium — 1 free scan, then locked** | Yes (variant) | Higher organic, lower immediate revenue, much better MVP signal on whether the scan is *actually* loved. |
| **One-time scan purchase (₹49 unlock this report)** | **Yes, as a secondary option** | Captures users who refuse autopay (a meaningful fraction in India). Pure profit; no recurring billing risk. |
| **Monthly subscription with rescan cadence locked** | Yes (as the main plan) | Aligns price to value; encourages re-engagement. ₹199/month for unlimited scans + routine + progress is the natural fit. |
| **Annual only / lifetime** | No | Too much commitment for ₹199 ARPU; conversion will collapse. |

On price point: Indian consumer subs in this category cluster at ₹119–₹399/month (Spotify ₹119, Netflix Mobile ₹199, Google AI Plus ₹399 promo) [[TechCrunch Netflix India]](https://techcrunch.com/2019/07/24/netflix-launches-rs-199-2-8-mobile-only-monthly-plan-in-india/) [[Google AI Plus India]](https://news.aibase.com/news/23562). Skincare-adjacent willingness-to-pay is high in absolute terms (84% of Indian consumers say they'll pay a premium for quality skincare [[The Established — Indian beauty trends]](https://www.theestablished.com/self/beauty/the-trends-that-will-shape-indias-beauty-and-wellness-landscape)), but that translates to product purchases, not app subscriptions, in the current market. **₹199/month is the upper bound for a single-feature scan app; ₹99/month is the safer MVP anchor.** A monthly plan + a one-time per-scan unlock at ₹49 gives you a price ladder.

---

## Part 3 — India Market Demand

This section asks the harder question: **is there actually a market for a paid, standalone AI-skin-scan subscription in India, or are we taking a US/Western consumer pattern and assuming it translates?** The data says the answer is nuanced — the *adjacent* markets are large and growing fast, but the *exact wedge* (Indian women paying ₹99–₹199/month for a standalone AI scan + report app) has no proven case study. Every funded Indian comparable is monetising products, not the scan. That is the central insight, and it shapes everything downstream.

### 3.1 Market size: the adjacent waters are deep

The Indian beauty & personal care category is large and accelerating, but most of the dollars sit in products, not in apps that talk about products.

| Segment | Size (2024-25) | Trajectory | Source |
|---|---|---|---|
| India Beauty & Personal Care (BPC) | **~$26–31B (2025)** | $40B by 2030 → world's 4th largest BPC market | [RedSeer $40Bn report](https://redseer.com/reports/indias-40bn-beauty-personal-care-market-growth-shifts-and-opportunities-for-2030/) [[IBEF on RedSeer × Peak XV]](https://www.ibef.org/news/according-to-a-joint-report-by-redseer-strategy-consultants-and-peak-xv-pure-play-brands-to-drive-india-s-us-30-billion-beauty-and-personal-care-market-opportunity) |
| India online BPC | **~$6B (2025)** | 30% share of BPC; +39% YoY in beauty e-commerce (Jun–Nov 2024) | [Statista online BPC](https://www.statista.com/statistics/1309281/india-online-beauty-and-personal-care-industry-market-size/) [[Indian Retailer]](https://www.indianretailer.com/article/technology-e-commerce/digital-trends/india-leads-global-beauty-e-commerce-boom-39-pc-growth) |
| India skincare specifically | **~$8.65–8.78B (2024)** | $11.3B by 2029 (Statista) / $17.3B by 2034 (CAGR 7.2%) | [Statista Skin Care India](https://www.statista.com/outlook/cmo/beauty-personal-care/skin-care/india) [[Astute Analytica]](https://www.globenewswire.com/news-release/2025/03/17/3043804/0/en/India-Skincare-Market-Valuation-is-Poised-to-Reach-US-17-69-Billion-by-2033-Astute-Analytica.html) |
| India online skincare share | **42%** of total skincare sales | Up from 25% pre-pandemic; +68% online growth since 2023 | [Astute Analytica](https://finance.yahoo.com/news/india-skin-care-market-outlook-135800248.html) |
| Global AI-in-skincare | **$1.37B (2025)** | $4.28B by 2035 (CAGR 12.1%) | [Roots Analysis](https://www.rootsanalysis.com/reports/ai-in-skincare-market.html) [[Coherent Market Insights]](https://www.coherentmarketinsights.com/industry-reports/ai-skin-analysis-market) |
| Global AI-in-beauty-and-cosmetics | **~$9.2B by 2029** | 20.4% CAGR | [Business Research Company](https://www.thebusinessresearchcompany.com/report/ai-in-beauty-and-cosmetics-global-market-report) [[OMR Global]](https://www.omrglobal.com/industry-reports/ai-in-beauty-and-cosmetics-market) |

Two things to call out. First, the AI-in-skincare market sizing reports are mostly counting **B2B revenue** — Revieve, Haut.ai, Perfect Corp, ModiFace licensing to brands and retailers — *not* consumer-app subscriptions. Revieve quotes "60M+ users" but those sit inside Sephora, Shiseido, Estée Lauder digital experiences, not paying Revieve directly. Treat the AI-skincare TAM figures as **demand for the technology** and not as a paid-app TAM.

Second, the macro tailwinds are real and largely settled science: Gen Z + Tier-2/3 + e-commerce + smartphone penetration are all moving in the right direction simultaneously. India already does **25.5B app downloads/year** (back to growth in 2025 after dipping in 2024) and GenAI app downloads in Asia grew 80% from H2 2024 → H1 2025 [[TechCrunch India app downloads]](https://techcrunch.com/2026/01/21/indias-app-downloads-rebounded-to-25-5-billion-in-2025-fueled-by-ai-assistants-and-microdrama-boom/). The headwind — and it's a big one — is that India "tops global app downloads but doesn't feature in the top 20 markets in terms of consumer spending" [[TechCrunch India app downloads]](https://techcrunch.com/2026/01/21/indias-app-downloads-rebounded-to-25-5-billion-in-2025-fueled-by-ai-assistants-and-microdrama-boom/). This is the single most important data point in this whole section: **India is a downloads market, not a paid-subscription market.** Plan accordingly.

### 3.2 Demand signals for this specific product

| Signal | Reading |
|---|---|
| **Nykaa Skin Scan** launched on the Nykaa app — selfie → 15 skin parameters (tone, texture, hydration, dark spots, firmness, radiance, pores, oiliness, acne, redness, under-eye) → personalised product recs. Nykaa has 40M beauty consumers on platform. [[Mediainfoline — Nykaa Skin Scan]](https://www.mediainfoline.com/advertising/nykaa-launches-skin-scan-an-ai-led-skin-diagnostic-experience) | **Strongest demand validation.** The biggest beauty retailer in India built a near-identical feature. They wouldn't have if engagement weren't there. But notice the monetisation: it's free, and it converts to *product purchase*. |
| **Clinikally "Clara"** (YC S22 alum, teledermatology + pharmacy) launched May 2025 — facial scan, hydration/texture/tone, periodic re-analyses, personalised routine. [[eHealth Magazine on Clara]](https://ehealth.eletsonline.com/2025/05/clinikally-unveils-clara-ai-powered-skin-analysis-tool-set-to-redefine-personalised-skincare-in-india/) [[YC launch page]](https://www.ycombinator.com/launches/Ndm-clara-by-clinikally-clinical-grade-skin-analysis-with-ai) | **Direct competitor with a year head start.** This is the closest analogue to GlowUp. But again: monetisation is downstream — Clinikally sells dermatology consults and a prescription pharmacy. Clara is the funnel, not the SKU. |
| **AI-scan apps in glamar.io / Perfect Corp "best of" listings** for India: TroveSkin, Skinive, OnSkin, YouCam (300M users globally, [no India-specific MAU disclosed](https://apkpure.com/youcam-makeup-selfie-editor/com.cyberlink.youcammakeup)). | Western-built apps with India downloads but no India-specific paid traction data published. No India-built standalone paid scan app appears in any "best of" list, including ScanSkinAI's own roundup [[Best AI Skin Checker]](https://www.scanskinai.com/blog/best-skin-checker-app). |
| **Google search interest** for "skin scanner" rose steadily Dec 2024 → Nov 2025 with peaks in Aug/Oct 2025 (per Spate / Accio data) [[Accio Skin Scanner trends]](https://www.accio.com/business/trending-skin-scanner-2025) [[Spate skincare trends]](https://www.spate.nyc/reports/skincare-trends-decoded-2025) | Search demand is real but global. Spate doesn't break out India specifically; for India, the signal is mostly product-name searches (Cetaphil, La Roche-Posay, etc.) rather than tool searches. |
| **GenAI app downloads in Asia +80% H2 2024 → H1 2025** [[TechCrunch GenAI apps]](https://techcrunch.com/2025/07/30/gen-ai-apps-doubled-their-revenue-grew-to-1-7b-downloads-in-first-half-of-2025/) | Macro AI-app curiosity is at a peak. This is the wind at your back; it won't last forever. |
| **Indian skincare-content market is saturated.** Nykaa-owned beauty editorial, Vogue India, hundreds of dermatologist-creators on Instagram & YouTube (Dr. Aanchal Panth, Dr. Geetika Mittal, etc.). | Content is not the moat. The personalised diagnosis + the cadence of re-scan is. |

The signals say: **demand for the experience exists; demand for paying a standalone app for it is unproven.**

### 3.3 Indian consumer behaviour — who actually pays

The data here is mixed and needs to be read carefully because most of the "Indian women love premium skincare" data points refer to **physical product purchase**, which is a fundamentally different willingness-to-pay than a recurring app fee.

- **Smartphone reach is solved.** ~700–850M smartphone users; ~70% of India's 500M social media consumers are in Tier 2+ cities [[RedSeer — Bharat opportunity]](https://redseer.com/articles/the-3-2bn-bharat-opportunity-how-tier-2-cities-are-driving-indias-interactive-media-boom/) [[Storyboard18]](https://www.storyboard18.com/digital/tier-2-drives-majority-of-indias-500m-social-media-audience-redseer-85627.htm). Your addressable distribution exists.
- **Tier-2 pays much less than Tier-1.** Only **25% of Tier-2 users pay for a media service** vs **40% of Tier-1** [[RedSeer]](https://redseer.com/articles/the-3-2bn-bharat-opportunity-how-tier-2-cities-are-driving-indias-interactive-media-boom/). The "Bharat" user is reachable but is a substantially harder paid conversion. Don't model uniform conversion across tiers.
- **Gen Z is the right cohort but their spend is still ramping.** India has 377M Gen Z; they're expected to drive $1.8T in direct spend by 2035 [[Snap × BCG India Gen Z]](https://newsroom.snap.com/how-gen-z-is-shaping-the-new-india). Translation: today's Gen Z has higher willingness to pay than older Indian cohorts but much lower disposable income than Western Gen Z — ₹99/mo is meaningful, ₹399/mo is luxury.
- **Beauty premium WTP is high — for products.** 84% of Indian consumers say they'll pay a premium for quality skincare; 65% will pay more for eco-friendly packaging [[The Established — Indian beauty trends]](https://www.theestablished.com/self/beauty/the-trends-that-will-shape-indias-beauty-and-wellness-landscape). Online beauty buyer penetration rose from 13% → 17% in one year [[Indian Retailer — beauty ecom +39%]](https://www.indianretailer.com/article/technology-e-commerce/digital-trends/india-leads-global-beauty-e-commerce-boom-39-pc-growth). All of this is about *products*, not apps. The skincare-spending Indian woman is currently routing her ₹500/month skincare budget to Nykaa for serum and SPF, not to a subscription app.
- **Subscription category benchmarks where Indians do pay.** Spotify ₹119, Netflix Mobile ₹199, JioHotstar bundles, Cult.fit Live ₹999 (gym product, not pure app), Google AI Plus ₹399 promo. The category that has unambiguously cracked Indian app subscriptions is **entertainment** and **fitness/coaching**. Beauty/wellness diagnostic apps are not yet on this list.
- **Engagement → product purchase already works as a model** for Indian women. Nykaa's 35% lift in customer engagement after launching AI-driven skin tooling [[LinkedIn — Nykaa AI UX]](https://www.linkedin.com/pulse/how-nykaa-using-ai-upscale-user-experience-store) and Kindlife's pitch ("proprietary AI for Gen Z personalised skincare discovery" — $8M Series A, Kalaari Capital) [[Entrepreneur on Kindlife]](https://www.entrepreneur.com/en-in/news-and-trends/beauty-platform-kindlife-raises-usd-8-mn-funding-to-fuel/478139) both validate that AI personalisation drives commerce. They don't validate that it drives standalone subscription revenue.

### 3.4 The funded comparables — and the elephant in the room

Every meaningful Indian beauty-tech raise of the last 3 years monetises **products**, not the AI experience. This is the single most important pattern in the market.

| Company | Stage / raised | Business model | What it implies for GlowUp |
|---|---|---|---|
| **Nykaa** (FSN E-Commerce) | Listed, ~$7.4B at IPO | Beauty marketplace + private label. Skin Scan is a free funnel feature. | The 800-lb gorilla owns the "scan → product purchase" loop. Competing head-on is hard; partnering is plausible. |
| **Good Glamm Group** (MyGlamm, St. Botanica, Sirona, ScoopWhoop) | $342M raised, $1.25B last valuation (Apr 2024). [Inc42 reports unraveling](https://inc42.com/features/good-glamm-groups-bad-formula/) post-2024. | Roll-up of D2C brands + content + creator platforms. | Content + product + creator → scale roll-up is the funded thesis. None of it is paid AI scan. The Inc42 piece is a cautionary tale about content-led roll-ups. |
| **Clinikally** | YC S22; raised seed; "millions of users" claimed | Teledermatology + Rx pharmacy. Clara (AI scan) launched May 2025. | **Closest direct competitor.** A year ahead, YC-backed, and already operating the "scan → consult → script → product" stack. They monetise the consult + the pharmacy, not the scan. |
| **Pilgrim** | ₹417 Cr revenue FY25; ~$23M raised Mar 2025 at ~₹3,000 Cr (~$360M) valuation [[Startuppedia]](https://startuppedia.in/trending/startup-news/iitiim-alumni-founded-d2c-brand-pilgrim-hits-rs-417-crore-revenue-in-fy25-loss-widens-to-rs-69-crore-amid-rising-marketing-spend-11133038) | D2C skincare/haircare brand. | Pure-play product D2C with marketing-led growth. Not an app play. |
| **Sugar Cosmetics** | ₹415 Cr revenue FY25 (-17.8% YoY); ~$96M raised; ~$350M valuation [[Storyboard18]](https://www.storyboard18.com/brand-marketing/sugar-cosmetics-profitability-slips-as-fy25-revenue-declines-to-rs-415-crore-82535.htm) | Colour cosmetics D2C + offline retail. | Declining revenue is a warning that even funded beauty D2C is brutal in India. |
| **Mamaearth / Honasa** | Listed (BSE/NSE) | Mass-market natural personal care. | Same story — products. |
| **Kindlife** | $8M Series A (Kalaari, MIXI) [[Entrepreneur on Kindlife]](https://www.entrepreneur.com/en-in/news-and-trends/beauty-platform-kindlife-raises-usd-8-mn-funding-to-fuel/478139) | K-beauty / J-beauty marketplace; positions itself as "AI-led personalisation for Gen Z". | The closest "AI-led" pitch raised by an Indian beauty play. Still, AI is the UX wrapper; revenue is product GMV + take rate. |
| **Tira (Reliance Retail)** | Founded 2023; Reliance-backed (effectively unlimited capital) [[BeautyMatter on Tira]](https://beautymatter.com/articles/how-tira-is-shaping-the-next-chapter-of-beauty-in-india) | Omnichannel beauty retailer. | Distribution incumbent with deep pockets. If AI-scan-as-funnel-tool becomes table stakes, Tira will build it for free. |
| **Bombay Shaving Co / Bombae** | ₹136 Cr raised; IPO-bound. Women's (Bombae) is ~25% of biz [[Inc42 BSC]](https://inc42.com/buzz/bombay-shaving-company-bags-inr-136-cr-to-expand-retail-footprint/) | D2C grooming + women's hair removal & skincare. | Product, not app. |
| **Be Bodywise** (Mosaic Wellness) | Seed-stage / Soonicorn Capital | Women's telehealth + D2C (hair, skin, nutrition, PCOS). | "Diagnose → consult → ship product" stack for women — almost identical funnel architecture, but monetised via consult + pharmacy, not subscription. |

The pattern is unmistakable. **Zero Indian-funded beauty-tech plays monetise via a standalone consumer subscription to an AI tool.** They all converge on one of three models: (a) product D2C (Pilgrim, Sugar, Mamaearth), (b) marketplace / aggregator (Nykaa, Tira, Kindlife), or (c) telehealth + Rx pharmacy (Clinikally, Be Bodywise).

This isn't conclusive — sometimes the right business model is the one nobody is funding yet — but it's a strong negative signal. If a paid AI-scan subscription were obviously a unicorn-grade business in India, at least one of Clinikally, Nykaa, Kindlife, or Be Bodywise would have tried it and disclosed metrics. They haven't.

### 3.5 Honest read: where is the demand, really?

To compress: **the demand is for the experience, not for the subscription.** Three layered claims, in descending order of certainty:

1. **High certainty:** Indian women are willing to engage with AI-driven personalised skincare experiences. Nykaa Skin Scan's existence + Clinikally Clara's YC backing + Kindlife's "AI-led" pitch + 84% premium WTP for skincare products + 17% online beauty buyer penetration all point the same direction. The top-of-funnel works.
2. **Medium certainty:** Indian women will pay for *something* downstream of the scan. The unanswered question is *what* — product purchase (high willingness, ₹500–₹2,000+ per order), teledermatology consult (proven by Clinikally at ₹300–₹800), or recurring subscription (no proven India case). Cure.fit cracked subscriptions in fitness, but only as part of a physical-product-bundled offer. Headspace, Calm, Noom — none of them have meaningful India revenue.
3. **Low certainty / speculative:** Indian women will pay ₹99–₹199/month for a standalone scan + report subscription. This is the founder's bet. There's no Indian case study proving it works at scale. The Western analogues (Glow AI, Umax, Cal AI) are real and growing fast, but they target a Western Gen Z with ~10× the disposable income and a credit-card-based payments rail. Translating their unit economics 1:1 to India is dangerous.

### 3.6 Implication for the MVP test

This changes the MVP from a single-hypothesis test ("does the paywall convert?") into a **two-hypothesis test**. Both can be run with roughly the same product surface in the first 4–8 weeks:

- **Hypothesis A — Subscription works:** the founder's current bet. Already specified in §2.6: ₹99/mo trial or ₹49 one-time. Five success metrics, week-1-to-4 read.
- **Hypothesis B — Scan-as-funnel works:** at the report screen, in parallel to the subscription paywall, show the routine's product recommendations with affiliate / commerce links (Amazon, Nykaa, Purplle affiliate programs all available, ~3–10% commission on beauty). Measure **% of paywall-skippers who tap a product link** and **commission earned per scan**. If commission-per-scan beats subscription-ARPU-per-scan, the business model is actually affiliate-commerce, not subscription. The current Routine screen in the codebase already lists specific products at specific prices — instrumenting affiliate clicks is a 1-day build.

Running both in parallel costs you almost nothing extra and gives you the answer to the question that actually matters: **what is the highest-revenue thing an Indian woman will do at the moment she sees her skin score?** The answer might be "subscribe to your app" (proves the founder's thesis), or "tap to buy the recommended sunscreen on Nykaa" (which is what every funded comparable has converged on), or "do both at different ratios in different tiers". You don't know without running it. The single biggest miss the founder could make right now is to bet only on subscription and find out at week 8 that nobody pays but 22% of users tap product links — and you didn't instrument for it.

---

## Part 4 — The MVP Recommendation

**Ship this specific paywall.** Three weeks of build, two weeks of measurement.

**Funnel (changes from current PLAN.md in bold):**

```
Splash → Language → 3 onboarding slides → Phone OTP →
Q1 → Q2 → Q3 → Q4 → Q5  (sequenced as "building your skin profile") →
Home → Tap Scan → Selfie / Gallery → Analyzing (15s, animated, talk up the AI) →
Reveal screen: overall score (number, animated) + radar chart SHAPE
   + top concern HEADLINE only ("Hydration is your top concern")
   + everything else BLURRED with a "Glow Up" CTA →
**PAYWALL**: ₹49 one-time for this report  OR  ₹99/mo (3-day free trial)
   for unlimited scans + routine + progress →
Post-purchase: full Results → Routine → Progress
```

**Pricing:** ₹99/month, 3-day free trial, weekly billing optional later. ₹49 one-time per scan as the lower-friction alternative.

**Payment rails:** Razorpay Subscriptions, UPI Autopay primary, card eMandate fallback, UPI Intent for one-time. KYC the entity in parallel.

**What stays free:** Q1–Q5 onboarding, the selfie capture, the analyzing animation, overall score number, radar chart silhouette, one-sentence top concern. This is enough for App Store screenshots, referral screenshots, and Instagram word-of-mouth. It is *not* enough for the user to feel they've gotten the answer.

**Hypotheses to test in weeks 1–4 post-launch.** These are the only metrics that matter for the founder decision-point at week 4:

1. **Selfie-to-paywall conversion ≥ 60%.** If users are taking the selfie but bouncing before the reveal screen, the reveal isn't compelling enough.
2. **Paywall view → ₹49 one-time ≥ 8%, OR paywall view → trial-start ≥ 4%.** Cal AI / FaceApp benchmarks suggest 4–8% is achievable for a hot category; below 4% means the scan output isn't perceived as valuable.
3. **Trial → paid conversion ≥ 30%.** Below this, the trial isn't getting them attached and the report isn't worth ₹99 to them.
4. **Day-30 retention of paid users ≥ 20%.** Below this, the recurring model is broken regardless of conversion and you should pivot to a per-scan pricing model exclusively.
5. **Refund-request rate < 6% in first 30 days.** Above this, the report is overpromising relative to delivery. Tighten the Gemini prompt and the marketing copy before scaling spend.

If 4 of 5 hit, scale. If 2 or fewer hit, the issue is not the paywall — it's the scan quality or the perceived value of the report itself, and no paywall placement will save you. That's the correct learning the wedge gives you.

**Run Hypothesis B in parallel (per §3.6).** Given that no funded Indian beauty-tech play monetises a standalone scan subscription, instrument affiliate links on the routine's product recommendations from day one. Track *commission-per-scan* alongside *subscription-ARPU-per-scan*. The MVP isn't really testing whether the paywall converts — it's testing **which monetisation model an Indian woman will choose at the moment she sees her skin score.** If commission-per-scan outperforms subscription-ARPU at week 4, the business is affiliate-commerce-with-scan-as-funnel, not subscription, and the entire strategy pivots — which is fine, because that pivot is exactly what every Indian funded comparable would tell you to do.

---

## Appendix — Sources

**India payments:**
- [UPI AutoPay Limits & Rules 2026 — Paytm](https://paytm.com/blog/bill-payments/upi-autopay/upi-autopay-maximum-limit-complete-guide-2025/)
- [RBI E-Mandate Framework 2026 — Outlook Business](https://www.outlookbusiness.com/ampstories/news/rbi-e-mandate-framework-2026-new-rules-for-auto-pay-upi-cards-wallets)
- [RBI auto-debit rules explained May 2026 — IBTimes](https://www.ibtimes.co.in/rbi-auto-debit-rules-explained-what-new-changes-mean-your-upi-card-payments-may-2026-901696)
- [RBI New UPI Rules 2026 — Pine Labs](https://www.pinelabs.com/blog/what-are-rbis-new-upi-rules-in-2026-latest-updates-impacts-benefits)
- [Razorpay UPI Autopay vs eNACH](https://razorpay.com/blog/upi-autopay-vs-enach-comparison/)
- [Cashfree UPI Autopay vs Cards](https://www.cashfree.com/blog/upi-autopay-vs-cards-india-subscriptions/)
- [Merchants Favor UPI Autopay Over Cards Despite Lower Success Rate — Whalesbook](https://www.whalesbook.com/news/English/economy/Merchants-Favor-UPI-Autopay-Over-Cards-Despite-Lower-Success-Rate/695f4705ef4ed95f98060af9)
- [Razorpay Payment Gateway Charges 2026 — SoftwareSuggest](https://www.softwaresuggest.com/blog/razorpay-payment-gateway-charges/)
- [Cashfree vs Razorpay vs PayU India 2026 — Shop2Host](https://shop2host.com/best-payment-gateway-india)
- [Juspay Subscriptions](https://juspay.io/subscription)
- [Stripe India Recurring Payments — Stripe Docs](https://docs.stripe.com/india-recurring-payments)
- [Razorpay KYC Onboarding Guide India 2026](https://razorpay.com/blog/payment-gateway-kyc-onboarding-india/)
- [Cashfree Onboarding FAQs](https://www.cashfree.com/docs/help/onboarding-related/general-faqs)
- [UPI Chargeback Rules 2026 — HeroFincorp](https://www.herofincorp.com/blog/upi-transaction-chargeback-rules-npci-norms)
- [NPCI UPI Dispute Redressal Mechanism](https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism)
- [Credit Card Chargeback Guide India 2026](https://righttoinformation.wiki/credit-card-chargeback-guide-india)

**Paywalls & benchmarks:**
- [Glow AI: $0 to $10k MRR in 3 days — StartupSpells](https://startupspells.com/p/glow-ai-viral-skincare-app-10k-mrr-3-days)
- [Best Looksmaxxing Apps 2026 — OnPointFresh](https://onpointfresh.com/looksmaxxing-apps/)
- [Cal AI case study — Superwall](https://superwall.com/case-studies/cal-ai)
- [Cal AI: How Two Teenagers Built a $2M/Month AI App — Medium](https://medium.com/@sarah_70608/how-two-teenagers-built-a-2-million-month-ai-app-8e48de43583f)
- [FaceApp paywall screenshot — Paywallscreens](https://www.paywallscreens.com/apps/faceapp-perfect-face-editor-mobile-paywall-f664)
- [FaceApp Revenue and Usage Statistics — Business of Apps](https://www.businessofapps.com/data/faceapp-statistics/)
- [Noom web-to-app onboarding teardown — RevenueCat](https://www.revenuecat.com/blog/growth/web-to-app-onboarding-funnel/)
- [Headspace gating content podcast — RevenueCat](https://www.revenuecat.com/blog/growth/podcast-shreya-oswal-keya-patel-headspace/)
- [App Onboarding Before Paywall: 5 Steps — Airbridge](https://www.airbridge.io/en/blog/5-steps-app-onboarding-before-the-paywall)
- [Subscription Pricing in Photo & Video Apps: 1,200 Paywalls — DEV](https://dev.to/paywallpro/subscription-pricing-in-photo-video-apps-what-1200-paywalls-reveal-3ok9)
- [Paywall placement — RevenueCat](https://www.revenuecat.com/blog/growth/paywall-placement/)
- [Hard paywall vs soft paywall — RevenueCat](https://www.revenuecat.com/blog/growth/hard-paywall-vs-soft-paywall/)
- [AI-powered apps struggle with long-term retention — TechCrunch](https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows/)
- [State of Subscription Apps 2025 — RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/)
- [App Subscription Trial Benchmarks 2026 — Business of Apps](https://www.businessofapps.com/data/app-subscription-trial-benchmarks/)
- [Mobile App Retention Benchmarks by Industry 2026 — UXCam](https://uxcam.com/blog/mobile-app-retention-benchmarks/)

**India consumer / pricing context:**
- [Netflix India Rs 199 mobile-only plan — TechCrunch](https://techcrunch.com/2019/07/24/netflix-launches-rs-199-2-8-mobile-only-monthly-plan-in-india/)
- [Google AI Plus India launch — AIBase](https://news.aibase.com/news/23562)
- [Indian beauty trends 2025 — The Established](https://www.theestablished.com/self/beauty/the-trends-that-will-shape-indias-beauty-and-wellness-landscape)
- [Cult.fit pricing — Cure.fit India support](https://support.cure.fit/support/solutions/articles/25000006138-what-are-the-various-membership-packs-available-for-cult-fit-)

**India market sizing & demand:**
- [India's $40Bn Beauty & Personal Care Market — RedSeer](https://redseer.com/reports/indias-40bn-beauty-personal-care-market-growth-shifts-and-opportunities-for-2030/)
- [RedSeer × Peak XV joint report on $30B BPC opportunity — IBEF](https://www.ibef.org/news/according-to-a-joint-report-by-redseer-strategy-consultants-and-peak-xv-pure-play-brands-to-drive-india-s-us-30-billion-beauty-and-personal-care-market-opportunity)
- [Online BPC market size India 2025 — Statista](https://www.statista.com/statistics/1309281/india-online-beauty-and-personal-care-industry-market-size/)
- [India leads global beauty e-commerce +39% — Indian Retailer](https://www.indianretailer.com/article/technology-e-commerce/digital-trends/india-leads-global-beauty-e-commerce-boom-39-pc-growth)
- [Skin Care market India — Statista forecast](https://www.statista.com/outlook/cmo/beauty-personal-care/skin-care/india)
- [India Skincare Market $17.69B by 2033 — Astute Analytica / GlobeNewswire](https://www.globenewswire.com/news-release/2025/03/17/3043804/0/en/India-Skincare-Market-Valuation-is-Poised-to-Reach-US-17-69-Billion-by-2033-Astute-Analytica.html)
- [India Skin Care Market Outlook 2025-2033 — Astute Analytica via Yahoo Finance](https://finance.yahoo.com/news/india-skin-care-market-outlook-135800248.html)
- [AI in Skincare Market — Roots Analysis](https://www.rootsanalysis.com/reports/ai-in-skincare-market.html)
- [AI Skin Analysis Market — Coherent Market Insights](https://www.coherentmarketinsights.com/industry-reports/ai-skin-analysis-market)
- [AI in Beauty and Cosmetics Global Market Report 2025 — Business Research Company](https://www.thebusinessresearchcompany.com/report/ai-in-beauty-and-cosmetics-global-market-report)
- [AI in Beauty and Cosmetics Market — OMR Global](https://www.omrglobal.com/industry-reports/ai-in-beauty-and-cosmetics-market)
- [Mintel 2025 Global Beauty Trends](https://www.mintel.com/press-centre/mintel-announces-global-beauty-and-personal-care-trends-for-2025/)
- [Euromonitor's 2026 Global Beauty Outlook — BeautyMatter](https://beautymatter.com/articles/euromonitors-2026-global-beauty-outlook)
- [Skincare trends decoded 2025 (Google + TikTok) — Spate](https://www.spate.nyc/reports/skincare-trends-decoded-2025)
- [Trending Skin Scanner 2025 — Accio](https://www.accio.com/business/trending-skin-scanner-2025)
- [India's app downloads rebounded to 25.5B in 2025 — TechCrunch](https://techcrunch.com/2026/01/21/indias-app-downloads-rebounded-to-25-5-billion-in-2025-fueled-by-ai-assistants-and-microdrama-boom/)
- [GenAI apps doubled revenue H1 2025 — TechCrunch](https://techcrunch.com/2025/07/30/gen-ai-apps-doubled-their-revenue-grew-to-1-7b-downloads-in-first-half-of-2025/)
- [Tier 2+ drives India's 500M social media audience — Storyboard18 / RedSeer](https://www.storyboard18.com/digital/tier-2-drives-majority-of-indias-500m-social-media-audience-redseer-85627.htm)
- [The $3.2Bn Bharat Opportunity — RedSeer](https://redseer.com/articles/the-3-2bn-bharat-opportunity-how-tier-2-cities-are-driving-indias-interactive-media-boom/)
- [How Gen Z is shaping the new India — Snap × BCG](https://newsroom.snap.com/how-gen-z-is-shaping-the-new-india)
- [Digital 2025: India — DataReportal](https://datareportal.com/reports/digital-2025-india)

**Indian comparable companies:**
- [Nykaa launches Skin Scan — Mediainfoline](https://www.mediainfoline.com/advertising/nykaa-launches-skin-scan-an-ai-led-skin-diagnostic-experience)
- [How Nykaa is using AI — LinkedIn](https://www.linkedin.com/pulse/how-nykaa-using-ai-upscale-user-experience-store)
- [Nykaa launches ModiFace virtual try-on — Business Today](https://www.businesstoday.in/latest/story/nykaa-launches-al-backed-virtual-try-on-tech-modiface-details-here-315591-2021-12-14)
- [Clinikally unveils Clara — eHealth Magazine](https://ehealth.eletsonline.com/2025/05/clinikally-unveils-clara-ai-powered-skin-analysis-tool-set-to-redefine-personalised-skincare-in-india/)
- [Clara by Clinikally — YC Launch page](https://www.ycombinator.com/launches/Ndm-clara-by-clinikally-clinical-grade-skin-analysis-with-ai)
- [Clinikally — Y Combinator company page](https://www.ycombinator.com/companies/clinikally)
- [Good Glamm Group's Bad Formula — Inc42](https://inc42.com/features/good-glamm-groups-bad-formula/)
- [Good Glamm $150M at $1.2B valuation — BeautyMatter](https://beautymatter.com/articles/good-glamm-group-lands-150-million-funding-at-1-2-billion-valuation)
- [Pilgrim raises ₹200Cr — YourStory](https://yourstory.com/2025/03/d2c-beauty-brand-pilgrim-raises-rs-200-crore-funding)
- [Pilgrim hits ₹417Cr revenue FY25 — Startuppedia](https://startuppedia.in/trending/startup-news/iitiim-alumni-founded-d2c-brand-pilgrim-hits-rs-417-crore-revenue-in-fy25-loss-widens-to-rs-69-crore-amid-rising-marketing-spend-11133038)
- [Sugar Cosmetics FY25 revenue ₹415Cr — Storyboard18](https://www.storyboard18.com/brand-marketing/sugar-cosmetics-profitability-slips-as-fy25-revenue-declines-to-rs-415-crore-82535.htm)
- [Sugar Cosmetics financials — Affluense](https://www.affluense.ai/company/sugar-cosmetics-financials-a53bed)
- [Kindlife $8M Series A — Entrepreneur India](https://www.entrepreneur.com/en-in/news-and-trends/beauty-platform-kindlife-raises-usd-8-mn-funding-to-fuel/478139)
- [Tira: how Reliance Retail is redefining India's omnichannel beauty — BeautyMatter](https://beautymatter.com/articles/how-tira-is-shaping-the-next-chapter-of-beauty-in-india)
- [Bombay Shaving Company raises ₹136Cr — Inc42](https://inc42.com/buzz/bombay-shaving-company-bags-inr-136-cr-to-expand-retail-footprint/)
- [Be Bodywise on YourStory](https://yourstory.com/companies/be-bodywise)
- [Best AI Skin Checker App — ScanSkinAI](https://www.scanskinai.com/blog/best-skin-checker-app)
