# GlowUp — Solo Founder Playbook to 10,000 Customers on Play Store

**Prepared for:** Rahul (founder, GlowUp)
**Date:** 28 May 2026
**Scope:** Solo (or 2-person) founder runs GlowUp with Claude-orchestrated AI agents and gets to the first 10,000 paying-or-engaged customers on the Google Play Store.
**Sibling docs assumed:** `docs/payments-and-paywall-report.md`, `docs/audience-fit-tier2-tier3.md` (Path B Bharat-native is the chosen direction), `docs/analytics-tracking-plan.md`.

---

## Assumptions you can override at any point

Everything below is conditional on these. If any one of them is wrong, half the plan changes — call it out before reading further.

1. **Team:** 1 founder full-time, optional 0.5 co-founder / contractor for design + content QA. No engineers other than the founder.
2. **Platform:** Google Play Store, India region only. iOS is deferred to month 9+. Path B requires this — Play has 8 Indic-language listings and a 80%+ smartphone share in Tier 2/3; the iOS Indian woman in Tier 2/3 is a rounding error and not worth the dual-stack cost ([Apptweak — How to Localise Your App for India](https://www.apptweak.com/en/aso-blog/how-to-localize-your-app-in-india)).
3. **Direction:** Path B (Bharat-native) from `docs/audience-fit-tier2-tier3.md`. Hindi-first launch with Tamil/Telugu/Marathi/Bengali expansion in S2. ₹19 one-time scan + ₹99 quarterly "Glow Pack" + affiliate commerce primary; no UPI Autopay until month 6+.
4. **Monetisation mix at "10K customer" milestone:** ~70% one-time ₹19 unlocks, ~20% quarterly ₹99 packs, ~10% affiliate commission via Flipkart/Amazon/Meesho links. "Customer" = anyone who has paid at least ₹19 OR generated ≥₹15 in affiliate commission.
5. **Three timelines, three budgets — pick one row from each:**

    | Timeline | What it implies | Budget options | What you get for the money |
    |---|---|---|---|
    | **3-month sprint** | Soft-launch Hindi-only, single-language, no OEM BD, blitz Meta in two states (UP + MP) | ₹2L lean / ₹10L moderate / ₹25L well-funded | 10K is a stretch goal in 3 months; realistically you'll hit S2 (1-5K). Use this if you have a hard deadline (demo day, market reservation, etc.) |
    | **6-month steady** | Hindi + 2 regional, layered influencer + Meta + WhatsApp community, light OEM BD | ₹2L / ₹10L / ₹25L | 10K is achievable in the moderate / well-funded case. The "default" plan in this doc unless overridden. |
    | **12-month bootstrap** | All 5 languages, full OEM BD, content moat, referral loop matured | ₹2L spread over 12mo / ₹10L / ₹25L | 10K is comfortable in all budgets. Best capital efficiency. |

6. **Customer service is in Hindi (and later Tamil/Telugu/Marathi/Bengali) on WhatsApp, not English email.** This is non-negotiable for Bharat trust; the agents handle 80% of volume, founder reviews escalations.
7. **AI agents handle:** support (WhatsApp triage + reply drafts), content (Hindi/regional captions, blog posts, YouTube Shorts scripts), creative (ad copy + image variants), analytics (daily funnel digest), intel (competitor/policy watch), CRM (segmented WhatsApp campaigns + reactivation), ops (changelogs, OKR review, weekly digests). Founder owns product, payments/legal/refund calls, partnerships, anything customer-trust-shaped.
8. **Stack:** Expo SDK 54 + Firebase + Gemini 2.5 Flash + Razorpay (one-time orders + Subscriptions module in S3) + AiSensy WhatsApp Business API + Claude (via Anthropic API + agents) + GA4/Firebase Analytics + Meta App Events + Sheet-based intermediate storage where Firestore is overkill. All choices motivated below.

---

# Section 1 — Operating Model: Org-Chart-of-One

A standard Series-A consumer app team has ~25 people across product, design, growth, content, support, ops, finance, legal. Below is the same chart, collapsed to a solo founder + Claude agents + named freelancers. Every role is marked **AGENT** (run by a Claude agent), **FOUNDER** (Rahul owns it personally), or **FREELANCER** (contracted, hourly or per-piece).

The principle: **anything that touches a payment decision, a partner, or a public statement is founder. Anything that's a repeatable transformation of inputs to outputs is agent. Anything that needs a human-in-flesh — voiceover, photoshoot, legal sign-off — is freelancer.**

## 1.1 Role-by-role table

| # | Function | Owner | What they do | Trigger / cadence | Prompt scaffold (if agent) or notes |
|---|---|---|---|---|---|
| 1 | **CEO / Strategy** | FOUNDER | Vision, monthly OKRs, hire/fire, partnership calls, board updates if applicable | Daily | Not delegable. Don't try. |
| 2 | **CTO / Engineering** | FOUNDER | Architecture decisions, prod incidents, security, all code merged to `main` | Daily | Claude Code is a tool *in service of* the founder-engineer, not a replacement. |
| 3 | **Product Manager** | FOUNDER + agent for analytics digest | Roadmap, prioritisation, feature specs, success metrics | Weekly | Agent runs the "what's slipping in the funnel" digest; founder decides what to fix. See Analytics Agent §5. |
| 4 | **Designer (product)** | FREELANCER (₹40-80K/mo retainer) + FOUNDER for taste calls | Screens, Figma flows, illustrations of South Asian women, Devanagari/regional script kerning | 10-15 hrs/week from freelancer; founder reviews | Hire one freelance designer with Hindi + Devanagari typography experience. Mukta / Hind type families on Behance is the filter. |
| 5 | **Designer (brand / creative)** | FREELANCER + Creative Agent | Logo refresh, app icon variants for Play A/B testing, WhatsApp creative templates | One sprint at S0 (₹50K), then on-demand | Brand work is freelancer; iterative creative variants are agent (see §5 Creative Agent). |
| 6 | **Growth lead** | FOUNDER + Analytics Agent | Channel-level CAC/LTV decisions, where to push budget, kill experiments | Weekly review | Founder calls; agent dumps the numbers. |
| 7 | **Performance marketer (Meta + Google UAC)** | FREELANCER (₹30-60K/mo) + Creative Agent | Ad set structure, campaign builds, daily budget reallocation, creative testing | Daily ops by freelancer, weekly review with founder | This is the single freelancer with the highest leverage. Hire someone who has run Meta on a Hindi-belt D2C beauty brand. Filter: ask them "what was your best Hindi creative angle in Mar 2026" — they should have a story. |
| 8 | **Content (long-form blog, YouTube Shorts script, scan-result-share text)** | AGENT (Content Agent — §5.2) | Weekly content calendar: 3 Hindi blog posts, 5 YouTube Shorts scripts, 4 ShareChat/Moj captions, 2 long-form WhatsApp newsletter blasts | Weekly Monday batch | See §5.2 |
| 9 | **Video producer / editor** | FREELANCER (₹2-4K per Reel/Short) | Shoots the founder talking-head, edits creator UGC into 9:16 format, adds Hindi/regional captions | Project-based, 8-15 deliverables/week at scale | Hire on Topmate / Vibers / a Tier 2/3 Insta beauty creator who edits her own content. ₹2-4K per finished Reel including captioning is the going Tier 2/3 rate (cheaper than Mumbai/Bangalore). |
| 10 | **Community / WhatsApp groups** | AGENT (CRM Agent — §5.6) + FOUNDER for tone gates | Sends weekly "Glow Tips" broadcast, segments users by skin concern, replies to broadcast replies | Daily check-ins by agent; founder gates outbound campaigns weekly | AiSensy + Claude. See §5.6. |
| 11 | **Customer support** | AGENT (Support Agent — §5.1) + FOUNDER for refunds | Reads incoming WhatsApp + Play Console reviews, drafts replies, escalates anything that mentions "refund / not working / fake / cancel" to founder | Real-time during business hrs, batch overnight | See §5.1 |
| 12 | **Data analyst** | AGENT (Analytics Agent — §5.4) | Daily funnel digest, weekly cohort retention, monthly LTV update | Daily 9am IST | See §5.4 |
| 13 | **Competitor / market intel** | AGENT (Intel Agent — §5.5) | Weekly scan of Nykaa, Clinikally, Mamaearth, Kindlife, regional D2C, Play Store ASO movers, RBI/DPDP/Play policy changes | Weekly Sunday | See §5.5 |
| 14 | **Finance / accounting** | FREELANCER (CA on retainer — ₹5-8K/mo) + FOUNDER | GST filings (monthly), TDS, advance tax, P&L compilation, Razorpay reconciliation | Monthly | Find a CA who has filed for a SaaS/app sole prop. ClearTax, Vakilsearch, or a referred local CA. |
| 15 | **Legal / compliance** | FREELANCER (sporadic) + FOUNDER for DPDP, ToS, privacy | DPDP consent layer review, Play Store policy compliance, refund T&Cs, IT Act / IT Rules 2021 (intermediary guidelines if community grows) | One-off at incorporation, then quarterly | Use Vakilsearch or a Bangalore tech lawyer. Budget ₹15-30K for initial pack, ₹5-10K/quarter for retainer. |
| 16 | **BD / partnerships** | FOUNDER | OEM pre-load deals (Xiaomi GetApps, Realme Store, Samsung Galaxy Store), Flipkart / Amazon / Meesho affiliate programs, brand co-marketing (Mamaearth / Plum samples?) | Project-based | Don't delegate. OEM/affiliate BD is a founder-credibility game; an agent can't carry it. |
| 17 | **HR / people** | FOUNDER | Hiring freelancers, paying them, terminating, contracts | As needed | Trivial at this scale. Just be on time with payments — Tier 2/3 freelancers churn fast if you're late. |
| 18 | **Ops / admin** | AGENT (Ops Agent — §5.7) + FOUNDER for sign-offs | Weekly OKR digest, changelog generation, Notion/Sheet maintenance, vendor reminders, contract renewals | Weekly Friday | See §5.7 |

## 1.2 Founder weekly rhythm

The founder's calendar should be **predictable and shaped around the agent outputs.** Agents publish on a cadence; founder consumes and decides.

| Time | Block | What happens |
|---|---|---|
| **Mon 9-10am** | Strategy block | Read Sun Intel Agent report + Mon Analytics Agent digest. Decide one experiment to start, one to kill. |
| **Mon 10am-1pm** | Product / engineering | Write code, ship one feature or fix. |
| **Mon 2-4pm** | Performance marketing review | Sit with freelance performance marketer (call/Slack), review last week's spend + creative winners, set this week's budget. |
| **Mon 4-6pm** | Creative brief block | Brief Creative Agent on 5-10 ad variants for the week (script idea + visual direction); brief video editor on shoot-list. |
| **Tue–Thu 9am-12pm** | Engineering / product | Deep work. Phone off, WhatsApp off. |
| **Tue–Thu 12-1pm** | Support escalation review | Read overnight Support Agent batch; reply to anything escalated (refunds, complaints, partnership inbound). |
| **Tue–Thu 2-5pm** | Mixed — partnerships, hiring, content review | OEM BD calls, freelancer 1:1s, content review/sign-off. |
| **Tue–Thu 5-6pm** | Content sign-off block | Approve the day's WhatsApp broadcast + Reels captions before they ship. |
| **Fri 9am-12pm** | Engineering | Ship the second feature of the week. |
| **Fri 12-2pm** | Finance + ops | Check Razorpay receipts, refund queue, freelancer payments. Sign off on Ops Agent's weekly digest. |
| **Fri 2-5pm** | Reading + thinking | One report, one competitor app teardown, one user-call recording. Walk while listening. |
| **Sat** | Off (or one focused 2-hr block on the part of the week you most enjoyed) | The 6-day founder is a worse founder by month 4. Take Saturday. |
| **Sun 10-11am** | Sunday review | Read Intel Agent's Sun report and write one paragraph of "what shifted this week" for your future self. |

The pattern: agents publish Sun night → Mon morning is read-and-decide → Tue-Fri is build-and-ship. Don't take meetings before 12pm — that block is irreplaceable.

## 1.3 Tools stack & monthly cost (S2 scale, ~3-5K MAU)

| Tool | What it does | Monthly cost (₹) | Why this not the alternative |
|---|---|---|---|
| **Firebase (Spark plan)** | Auth, Firestore, Storage, Crashlytics, Analytics | ₹0 → ~₹4K at S2 | Free until you cross 50K reads/day. At 10K MAU expect ₹3-5K/mo for Firestore + Storage. |
| **Cloud Functions / Cloudflare Workers** | Gemini key proxy + Razorpay webhook → Meta CAPI relay | ₹0 (Workers free tier covers 100K req/day) | Workers > Functions for the latency + zero cold-start; both are cheap. |
| **Gemini 2.5 Flash API** | Scan analysis (~₹0.16/scan per `payments-and-paywall-report.md`) | At 10K scans/mo: ~₹1,600 | The MVP cheat code. Don't over-optimise. |
| **EAS (Expo) Starter plan** | Build, OTA updates, hosting | ₹1,600 ($19/mo) | $19/mo Starter is the right tier through 10K MAU. Free plan covers 15 builds; you'll exceed that during ASO iteration. ([Expo Pricing](https://expo.dev/pricing)) |
| **Google Play Developer fee** | One-time | ₹2,100 ($25 one-time) | Mandatory. |
| **Razorpay** | Payment gateway + Subscriptions module | 2% per UPI txn + 18% GST | At ₹5L GMV/mo expect ~₹12K in fees. Cards are 2% + 0.99% subscription fee + GST ≈ 3.5% all-in. ([Razorpay Pricing Breakdown](https://www.softwaresuggest.com/blog/razorpay-payment-gateway-charges/)) |
| **AiSensy (WhatsApp Business API)** | Outbound broadcasts + inbound automation | ₹2,399/mo Pro plan + per-message fees | Marketing template messages: ₹0.86 each (Meta India rate as of Jan 2026); utility messages: ₹0.115. ([AiSensy Pricing](https://aisensy.com/pricing)) |
| **Anthropic API (Claude)** | All agent runs | ₹4-10K/mo at moderate volume | Sonnet for the higher-quality jobs (support, content); Haiku for high-volume routing. Budget ~₹0.30/agent run including caching. |
| **GA4 + Firebase Analytics** | Funnel / cohort analytics | ₹0 | Free tier is fine until 10M events/mo. |
| **Meta Ads Manager** | Paid campaigns | ₹0 platform fee, you pay only ad spend | Plus 18% GST on ad spend. |
| **Google Ads (UAC)** | Paid acquisition | ₹0 platform fee | Used selectively in S2/S3, not S0/S1. |
| **Mixpanel / Amplitude — DON'T** | Product analytics | — | GA4 + Firebase covers everything you need at this scale. Adding Mixpanel is ₹15K+/mo wasted. |
| **Notion (Plus)** | Internal docs, OKRs, runbooks | ₹720/mo ($8.50) | Or use a Google Doc folder. Notion is nice-to-have. |
| **Linear / Jira / Asana** | Issue tracking | ₹0 (Linear free tier) or ₹0 (GitHub Issues) | Don't pay for project mgmt at this scale. |
| **Figma Pro** | Design files | ₹1,400/mo ($15) for designer seat | Founder uses Figma free; designer needs Pro. |
| **Topmate / Internshala / Apna** | Freelancer hiring | ₹0 | Tier 2/3 video editors and Hindi writers are cheapest on Apna and Internshala. |
| **Sentry (free tier)** | Crash reporting on top of Crashlytics | ₹0 | Free covers up to 5K errors/mo. |
| **CA retainer** | GST/TDS filings | ₹5-8K/mo | ClearTax / Vakilsearch / local CA. |
| **Legal retainer** | DPDP/ToS reviews | ₹15-30K one-time + ₹5-10K/quarter | Vakilsearch or a Bangalore tech lawyer. |
| **Total fixed monthly (S2)** | | **₹35-55K** | Excluding ad spend, freelancer fees, and one-time legal. |

The fixed monthly base is **₹35-55K** at S2. Anything above that is variable — ad spend, influencer fees, freelancer hourly. This number matters because it sets the runway floor: ₹2L gives you ~4 months of fixed base before any growth spend. **₹10L gives you 12-15 months of base + room for growth.**

---

# Section 2 — Stage Gates to 10,000

The path to 10K is **not linear**, and modelling it as "₹X CAC × 10,000 = total spend" is the single most common founder mistake. Each stage has a different unit economics, a different channel mix, and a different exit criterion. Don't skip stages — and don't budget the next stage's spend until the current stage's exit criteria are met.

## 2.0 The four stages at a glance

| Stage | Users (cumulative) | Calendar weeks (6mo plan, ₹10L) | Primary motion | Cost band | Exit criteria |
|---|---|---|---|---|---|
| **S0 — Closed Beta** | 0 → 100 | Weeks 1-3 | Founder-led recruiting; WhatsApp groups + IRL | ₹0 paid, ~₹15K incidentals | NPS ≥ 50 from ≥30 paid beta users; ≤1 critical crash per 100 sessions; scan accuracy "feels right" rate ≥ 75% in survey |
| **S1 — Organic + Seeded** | 100 → 1,000 | Weeks 4-9 | ASO + nano influencers + WhatsApp referral | ₹50K-1L | Paid conversion ≥ 6% on `score_reveal → ₹19_unlock`; D7 retention ≥ 25%; ≥ 20 organic 4★+ Play reviews in Hindi |
| **S2 — Paid Unlock** | 1,000 → 5,000 | Weeks 10-18 | Meta UAC + Hindi micro influencers + WhatsApp drip | ₹3-7L | CAC ≤ ₹120/paid customer (blended including organic); cohort LTV/CAC ≥ 1.4 by month 2; refund rate < 8% |
| **S3 — Scale** | 5,000 → 10,000 | Weeks 19-26 | Meta scale + Google UAC + ShareChat/Moj + mid-tier influencers + OEM pre-load (if landed) | ₹4-10L | 10K paid customers reached; monthly burn ≤ ₹3L; Tamil + Telugu launches live with ≥ 500 users each |

## 2.1 S0 — Closed Beta (0 → 100)

**Goal:** Validate the scan-and-product-recommendation experience with real Tier 2/3 women, in Hindi, before spending a rupee on ads. Build the founder's instinct for the user.

**Channels:**
- Founder's own network — sisters, cousins, college friends in Hindi-belt cities. 30 people, 100% conversion.
- **WhatsApp groups** seeded by founder: 3-5 Hindi-medium college/professional WhatsApp groups (parents groups, RWA groups in Tier 2 cities, beauty groups on Telegram). Recruit 50 more.
- **One Reels collab** — a single nano Hindi-belt beauty creator (5-10K followers) doing a 60-second testimonial-style Reel with the founder's promo code. Cost ₹3-5K. Yields ~20 additional installs from her followers.

**Creative angles:**
- "मैंने एक selfie से अपनी skin score check की" — straightforward demo, in Hindi
- "मेरी दादी की haldi वाली नुस्खा app में मिला" — connects to the ubtan/multani-mitti routine layer

**Influencer tier:** Nano (₹2-8K). One creator only — this is a feedback loop, not a campaign.

**KPIs:**
- 100 installs
- 30+ completed scans
- 30+ NPS responses, NPS ≥ 50
- 5+ "would you pay ₹19 for this?" yes responses

**Risks:**
- **Scan quality is off in Hindi context.** Gemini's vision model is trained mostly on lighter Western skin; Tier 2/3 Indian women have a wide range of skin tones. Manually QA 30+ scans for "does this match what the user would say about her own skin?" If <70% match rate, **stop and tune the Gemini prompt** before any paid spend. This is the single most important check in S0.
- **Hindi UX bugs.** Devanagari rendering edge cases. Catch in beta.

**Budget band:** ₹0 paid + ₹15-25K incidentals (one Reel collab + nominal video editor + WhatsApp Business API setup deposit at AiSensy).

## 2.2 S1 — Organic + Seeded (100 → 1,000)

**Goal:** Prove the product-market loop without paid acquisition crutches. If you can't get from 100 → 1,000 mostly organically + with ~₹50K of nano-influencer seeding, **the product has a fit problem, not a marketing problem**, and ₹10L of Meta spend in S2 will not save you.

**Channels:**
- **Play Store ASO in Hindi + English** — re-list with Hindi metadata (title, short description, long description, screenshots). Apps with regional keywords see **35-55% lift in downloads** from those language regions ([NgenDevTech ASO India](https://ngendevtech.com/blog/app-store-optimization-strategies-that-actually-work-in-india/)). Most of S1's organic volume comes from this if you do it right.
- **Nano Hindi influencers** — 8-12 nano beauty creators (5-30K followers) at ₹2-8K each. **Single ad spend = ₹25-80K total.** Mix Instagram Reels (75%) with ShareChat/Moj (25%) to learn which platform converts.
- **WhatsApp referral loop** — every paid user gets a one-tap WhatsApp share button on their result card with a referral code worth ₹5 off their next scan + ₹5 off the friend's first scan. Target K-factor 0.4-0.6 in S1 (realistic for India consumer apps without heavy cashback; [ProductGrowth on India referrals](https://productgrowth.in/insights/consumer/referral-programs/)).
- **Reddit + Quora** in Hindi — answer 10 high-traffic questions per week on r/IndianSkincareAddicts, r/Indian_Skincare, r/Indian_Bollywood (skincare threads) and Hindi Quora boards. Founder writes, agent helps with Hindi copy review. Cost: time only.
- **One Tier 2 college visit** if founder lives near one — 90-min session, 50-100 students, ~30 installs. The personal touch is disproportionately useful here for early word-of-mouth.

**Creative angles (tested in S0):**
- Pick the 2-3 angles that converted best in S0 testimonials. Don't introduce new angles in S1.

**Influencer tier:** Nano (₹2-8K), 8-12 creators.

**KPIs:**
- 1,000 cumulative installs
- Paid conversion (`score_reveal → ₹19_unlock`) ≥ 6%
- D7 retention ≥ 25%
- ≥ 20 organic 4★+ Play reviews in Hindi
- WhatsApp opt-in rate ≥ 60% (proxy for trust)

**Risks:**
- **No-spend channels stall around 600-800.** Common pattern. The diagnosis is to look at ASO impressions: if impressions are growing but install rate is flat, the listing creative is the bottleneck; if impressions are flat, you need more keywords / language listings.
- **Refund requests spike when paid users start coming from Reels.** Reels users are lower-intent than your own network. Watch refund rate; if it crosses 8% in S1, slow down before S2.

**Budget band:** ₹50K - ₹1L (₹40-80K nano influencer + ₹10K ASO localisation freelancer + ₹10-20K WhatsApp template fees / AiSensy onboarding).

## 2.3 S2 — Paid Unlock (1,000 → 5,000)

**Goal:** Find a repeatable paid-acquisition channel. By the end of S2, you should know exactly which Meta creative + audience + landing-page combination converts at <₹120 blended CAC, and be willing to pour ₹3-5L into it in S3.

**Channels:**
- **Meta UAC / Advantage+ App Ads (AAA)** — the workhorse. India lifestyle CPI is in a wide band ₹14-100 ([Meta Ads Cost India 2026 — MyProHub](https://myprohub.in/meta-ads-cost-in-india-2026-complete-pricing-breakdown/)); for a Hindi-belt women's wellness app with strong creative, target ₹15-30 CPI. With 8% install→paid, CAC = ₹190-380; with 12% (good creative), CAC = ₹125-250. AAA reduces CPI 20-35% vs manually structured campaigns when fed 50+ installs/day ([Vmobify Meta App Install 2026](https://vmobify.com/blog/meta-app-install-campaigns/)).
- **Hindi micro influencers** — 6-10 micro creators (50-200K followers) at ₹15-50K each. Drive ASO + Reels engagement together — micro creators give credibility at scale; nano gave you authenticity at low cost.
- **ShareChat / Moj** — paid creator-driven content. Cheaper per impression than Meta but with more skew to Tier 2/3 women aged 25+. 65-70% of SFV users are Tier 2+ ([RedSeer/Afaqs SFV](https://www.afaqs.com/news/digital/around-70-of-250-million-users-of-indian-short-form-video-platforms-come-from-tier-2-cities-redseer)).
- **WhatsApp drip campaign** — Day 0 welcome, Day 1 "did you do your routine?", Day 3 "your scan vs friends' scans" (with social proof), Day 7 rescan reminder. Drives both engagement and re-scan rate.

**Creative angles to test in S2:**
1. **"Your dadi's recipe meets AI"** — multani mitti + AI scan
2. **"3-second skin score in your language"** — speed + Hindi/regional
3. **"Free scan, ₹19 to unlock"** — value-anchored
4. **"What's wrong with your skin? Skin AI told me"** — curiosity gap, creator testimonial
5. **"My ₹150 skincare routine that actually works"** — affordability + practical
6. **"₹19 vs ₹2000 derm consult"** — direct competitor frame against teledermatology (Clinikally)

Test 3-4 of these in parallel. Kill the bottom 2 by week 3 of S2. Double the budget on the top 1-2.

**Influencer tier mix:** Nano (continue 4-6/mo at ₹2-8K) + Micro (6-10/mo at ₹15-50K). **Micro influencer total: ₹1.5-3L/mo at peak S2.**

**KPIs:**
- 5,000 cumulative paid customers
- Blended CAC ≤ ₹120 (across organic + paid)
- Cohort month-2 LTV/CAC ≥ 1.4
- Refund rate < 8%
- Affiliate commission ≥ 15% of revenue (validates Hypothesis B from §3.6 of payments report)
- App rating ≥ 4.1★ with ≥ 200 reviews

**Risks:**
- **Meta CPI inflates** — happens in Q4 Diwali / wedding season as D2C beauty brands pour in. Plan for 30-50% CPI inflation Oct-Dec. Pre-buy or pre-test campaigns in Sept.
- **Razorpay subscription enrollment fails** at higher rates than your ₹19 one-time. The S2 mix should still skew 70-80% one-time, 20-30% quarterly. Don't push subscription until S3.
- **Refund rate creeps up** above 8% — usually means your ad creative is over-promising. Tighten the creative; tweak the Gemini prompt so the scan output matches what the creative promised.

**Budget band:** ₹3-7L (₹2-4L Meta + ₹1-3L influencer + ₹30-50K WhatsApp + ₹20-40K creative/video).

## 2.4 S3 — Scale (5,000 → 10,000)

**Goal:** Scale the winning S2 motion while opening one new channel (Google UAC OR ShareChat at scale OR OEM pre-load) and one new language (Tamil or Telugu).

**Channels:**
- **Meta UAC at scale** — push the S2 winning creative to 4-6× the budget. CPI typically inflates 30-50% when you 4× a campaign; the question is whether your LTV supports the new CAC. Run the math weekly.
- **Google UAC** — launch parallel to Meta. UAC's machine learning needs ~3-4 weeks to find your audience; start in S3 even if you're not planning to scale until late S3. Initial budget ₹50K-1L/mo, expanding to ₹2-3L/mo if CPI stays under ₹35.
- **ShareChat / Moj paid campaigns** — by S3 you have enough creator testimonials to repurpose into native-format ads. Budget ₹50K-1.5L/mo.
- **Mid-tier influencers** — 2-3 mid creators (200K-1M followers) at ₹1-3L each. Use them for big "launch moments" — e.g., Tamil-launch announcement, Hindi Mother's Day promo. Don't run mid-tier always-on; they're event-driven.
- **OEM pre-load (if landed)** — typical Xiaomi/Realme pre-load deal is ₹15-40 per active install, billed monthly. Volume potential: 50K-200K installs/mo. ROI depends entirely on whether pre-loaded users convert at >2% to ₹19_unlock; in KuKu FM's case, OEM-acquired users converted at 8-11% to paid which is why it works ([GrowthX KuKu FM](https://growthx.club/blog/kukufm-business-model)). For GlowUp, model 3-5% pre-load conversion conservatively.
- **Tamil + Telugu language launch** — launch with the Hindi creative localised. Hire two Tamil + Telugu nano-influencer creators (₹3-6K each) for opening-week content. Localise 20 highest-traffic Play Store keywords per language.

**Creative angles for S3:**
- Build on S2 winners, but add **social-proof creatives** ("10,000 women have already done it" / "Trending in UP, Tamil Nadu") — only credible once you have the numbers.
- **Regional creative** for Tamil/Telugu — must be shot natively, not subtitled. Hire one Tamil video editor + one Telugu video editor on Apna / Topmate.

**Influencer tier mix:** Nano + Micro + 2-3 Mid (₹1-3L) per quarter.

**KPIs:**
- 10,000 cumulative paid customers
- Blended CAC ≤ ₹150 (paid expansion inflates from S2's ₹120)
- 70%+ retention M1 → M2 for quarterly subscribers
- Tamil + Telugu ≥ 500 paid users each
- Monthly burn ≤ ₹3L
- Affiliate revenue ≥ 25% of total

**Risks:**
- **Meta CPI doubles at scale** — common. Trial the alt channels (Google UAC, ShareChat) early.
- **Tamil/Telugu launch flops** — the test of whether the Hindi playbook generalises. If conversion in Tamil/Telugu is <50% of Hindi within 4 weeks, the brand assets need real Tamil/Telugu rework, not just translation.
- **OEM partner backs out** — common. Don't bet S3 on a single OEM closing. Treat it as upside, not plan.
- **Refund rate spikes due to creative inflation** — at S3 scale, Meta will push lower-intent users to you. Watch refund rate weekly.

**Budget band:** ₹4-10L (₹3-6L Meta + ₹1-2L Google UAC + ₹1-2L influencers + ₹50K-1L ShareChat/Moj + ₹50K-1L language localisation + ₹0-2L OEM if landed).

## 2.5 The 10,000-customer milestone — what it means

At 10,000 paying customers:
- Monthly revenue ~₹3-5L (mix of ₹19 one-time, ₹99 quarterly, ~25% affiliate commission)
- Monthly cost ~₹50-80K fixed + ₹2-3L variable acquisition = ₹2.5-4L
- **Break-even at the margin** if you stop acquisition; otherwise you're net-burning ₹50K-1L/mo
- **The right next move is fundraising** (₹5-15 Cr seed) or **doubling down on affiliate / quarterly conversion** to push monthly revenue past ₹6L and become genuinely profitable

This is the inflection point. Either you raise capital and push to 100K, or you accept the lifestyle business at 10K and run it as a 1-2 person profitable shop.

---

# Section 3 — GTM Channel Deep-Dive for Bharat Tier 2/3

## 3.1 Play Store ASO + regional listings

Google Play has supported localised listings in **Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam, Gujarati, Punjabi** for years ([iBabbleOn — Play Store Language Codes](https://www.ibabbleon.com/Google-Play-Store-Language-Codes.html)). Apple App Store only added 10 Indian languages in March 2026 ([BW Businessworld — Apple App Store Indian Languages](https://www.businessworld.in/article/apple-app-store-adds-10-indian-languages-in-massive-update-600616)) which means **Play has a multi-year head start in regional ASO discoverability.** This is the single biggest reason Path B is Play-first.

**Tactical ASO checklist for S1:**

| Asset | Spec | Effort |
|---|---|---|
| **App title (Hindi)** | "GlowUp - स्किन स्कैन और दादी के नुस्खे" (45 char) | 1 day |
| **Short description (Hindi)** | "Selfie से free skin score • दादी के नुस्खे + product recs ₹150 तक" (80 char) | 1 day |
| **Long description (Hindi)** | 4000 char with keywords: skin scan, स्किन स्कैन, चेहरा analysis, oily skin, dry skin, acne, dark spots, kasturi haldi, multani mitti, ubtan, glow up | 2 days |
| **8 screenshots (Hindi)** | All in Hindi: scan flow → score reveal → routine → product recs → success story | 3 days w/ designer |
| **30-sec promo video (Hindi)** | Talking-head founder + scan demo + result reveal | 1 day shoot, 2 days edit |
| **Feature graphic** | 1024x500 with Hindi headline | 0.5 day |
| **High-res icon** | 512x512 (test 3 variants in Play Console A/B) | 0.5 day per variant |

Keywords to target (Hindi/Hinglish, validated against Play Console search auto-complete):

`स्किन स्कैन, skin analysis, चेहरे की समस्या, ubtan, multani mitti, oily skin, dry skin, acne treatment, dark spots, skin glow, skincare routine, skin age calculator, AI skin doctor, घरेलू नुस्खे, ब्यूटी app, फेस स्कैन`

**Re-localise for S3** — add Tamil + Telugu screenshots, short/long descriptions, promo video. Expect another 35-55% lift in those regions ([NgenDevTech](https://ngendevtech.com/blog/app-store-optimization-strategies-that-actually-work-in-india/)). Don't auto-translate; hire native-language ASO writers (₹15-25K per language for full listing).

**Play Store A/B testing** — use Play Console's experiments to A/B test icon, screenshots, short description. Run 2-3 experiments at a time, 14-21 day windows, ≥10K visitors per variant.

## 3.2 Meta Ads creative for Hindi/Hinglish (expected ₹8-25 CPI India)

The Meta motion has to be **creative-led, not audience-led.** Meta's algorithm in 2026 picks audiences from creative signals; targeting "women 18-34 Tier 2/3" is essentially a starter prompt. **Spend 80% of your weekly marketing time on creative and 20% on campaign structure.**

**Recommended Meta campaign structure (S2):**

| Campaign | Objective | Audience | Creative count | Budget/day |
|---|---|---|---|---|
| **AAA - Hindi - Broad** | App Installs, optimised on `subscription_purchase` (₹19 unlock) | Advantage+ Audience, India, Female 18-40 | 6-8 active creatives, refreshed weekly | ₹2-3K |
| **AAA - Hindi - Tier 2 cities** | App Installs, optimised on `score_reveal` (proxy until volume hits) | Custom location list: 25 Tier 2 Hindi-belt cities | 4-6 creatives | ₹1-2K |
| **AAA - Lookalike-Purchasers** | App Installs, optimised on `subscription_purchase` | LAL 1-3% of paid users (≥500 seed) | 4 creatives | ₹1-1.5K |
| **Retargeting - Paywall View, No Purchase** | App Events - Purchase | Custom audience: `paywall_view` no `subscription_purchase` (last 30d) | 2 creatives, ₹19-anchor message | ₹500 |

Total Meta daily budget at S2: ₹4-7K/day = ₹1.2-2.1L/mo.

**Creative format playbook:**

1. **9:16 vertical, 15-30 sec, captioned in Hindi (Devanagari, not Roman script).** Tier 2/3 users watch with sound off in public; captions are non-negotiable.
2. **First 3 seconds:** the result reveal moment, not the brand. "मेरी skin score 67 है" with the animated radar.
3. **Native UGC > polished studio.** Per [Distk's CAC 2026 survival guide](https://distk.in/blog/reduce-cac-meta-cpm-rising-survival-guide-2026.html), UGC reduces CPM 20-40%.
4. **One CTA only** — "Free scan, ₹19 unlock" — repeat 2x in the video.
5. **Localise faces.** Don't use Mumbai/Bangalore models in UP/Bihar campaigns. Hire Tier 2 nano-creators as your "ad models" by repurposing their organic content with permission + ₹3-5K bonus.

**Expected India CPI for Hindi-belt women's wellness app:**
- **Bad creative:** ₹40-100 CPI (don't ship these)
- **Average creative:** ₹20-35 CPI (most weeks)
- **Top creative:** ₹8-15 CPI (1-2 winning creatives per quarter, milk them until they fatigue)

Blended target: **₹15-25 CPI**. At 8% install→paid conversion: CAC ₹190-310. Push paid conversion to 12% via better paywall + post-install onboarding → CAC ₹125-200.

The D2C beauty benchmark in India is **₹400-900 CAC blended for first-order** ([D2C CAC 2026 Benchmarks — Tenten](https://tenten.co/shopify/d2c-cac-benchmarks-2026/)) — but that's for physical product brands selling ₹600-1,400 AOV. GlowUp's lower ₹19-99 ticket means CAC has to be 3-5× lower. The way you get there is **lower CPI (better creative)** and **higher install→paid conversion** (better paywall), not by paying less per click.

## 3.3 Google UAC timing

Google Universal App Campaigns (UAC) need **~14-21 days of learning** before they hit their stride. Launch in S3 (week 19+), not S2.

**Why later, not earlier:**
- UAC requires ~50 conversions/week to optimise (Google's stated minimum). At ₹19 unlock you'll only hit that volume in S3.
- UAC's auctions are won by signal richness. The richer your downstream `subscription_purchase` event log, the better UAC can find lookalikes — that signal builds in S2.
- Google Ads + GA4 + Firebase integration auto-conversions only really start firing reliably after 3-4 weeks of consistent paid event volume.

**UAC structure for S3:**
- 1 campaign per language (Hindi, Tamil, Telugu at S3 end)
- Asset groups: 5-10 images, 3-5 videos, 5 text headlines, 5 descriptions
- Optimise on `Subscribe` (₹99 quarterly) primarily, `Purchase` (₹19) secondarily
- Daily budget: ₹3-5K/campaign at launch, ₹8-15K/campaign at scale

**Expected CPI:** ₹18-40 (typically 30-50% higher than Meta in India). Don't expect UAC to beat Meta on CPI; expect it to add scale at acceptable cost when Meta starts saturating.

## 3.4 Influencer / UGC

The influencer strategy has three tiers, each with a different role:

**Nano (₹2-8K, 5-30K followers)** — your bread and butter. Run 4-8/mo continuously from S1 through S3. Cheap, authentic, locality-specific (a creator from Lucknow lands better in UP than a Bangalore creator). Track by promo code (each creator gets unique code → install attribution + redemption tracking).

**Micro (₹15-50K, 50-200K followers)** — your credibility builder. Run 6-10/mo in S2. They give you the "I saw it on Insta yesterday" word-of-mouth in college dorms. Each one is a 2-4 day shoot turnaround.

**Mid (₹1-3L, 200K-1M followers)** — your event drivers. Run 2-3/quarter in S3 for launches (Tamil/Telugu opening, festival promos). Each one should be tied to a specific KPI ("drive 1,000 installs in 72 hrs" or "300 quarterly subs in 2 weeks"). Don't run mid-tier always-on.

**Roposo / Moj / ShareChat specifics:**

- **ShareChat** has 180M+ MAU across 15+ Indian languages, 65-70% Tier 2+ ([Truefan ShareChat Moj](https://www.truefan.ai/blogs/ai-video-sharechat-moj-india-2026)). Best for Hindi-belt and Marathi/Gujarati reach. Creator rates ~30-50% lower than Instagram equivalents.
- **Moj** has 160M MAU, skews younger (Gen Z 18-28) and slightly more urban Tier 2. Rates similar to Insta nano.
- **Roposo** is currently the smallest of the three with 50M+ MAU but pivoted to live shopping in 2024-25; it's becoming a creator + commerce hybrid. Test with 2-3 creators in S2, not a primary channel.
- **Meesho Creator Marketplace** — opened to influencers Feb 2025, 21,000 creators onboarded, T3/T4 focus ([Business Standard — Meesho Creator Marketplace](https://www.business-standard.com/companies/start-ups/meesho-launches-creator-marketplace-to-ramp-up-influencer-driven-traffic-125021900823_1.html)). Worth a test in S3 for affiliate-driven beauty collabs — Meesho creators are already trained on selling skincare to Tier 3 women.

**Standard contract terms (founder uses this for every creator):**
- Deliverables: 1 Reel + 2 Stories OR 1 ShareChat post + 1 Moj video
- Promo code valid 7 days
- 1 round of revisions
- 7-day exclusivity window from rival skincare apps
- Payment: 50% upfront, 50% on post-publication + 48-hour usage data shared
- Founder retains right to repurpose creative in paid ads with +₹2-5K bonus

**UGC harvest** — every Reel a creator makes for you, you get the raw clip (negotiate this upfront). Paste it into your Meta AAA creative pool. **Creator-as-talent + brand-controlled-distribution** is the single highest-ROI creative motion in 2026.

## 3.5 WhatsApp community

WhatsApp is the single most important retention and re-purchase channel in Bharat. 45-60% open rates, 5-12% conversion on segmented win-back flows ([Gallabox D2C WhatsApp](https://gallabox.com/blog/whatsapp-for-d2c)).

**Architecture:**
1. **AiSensy** as the BSP (₹2,399/mo Pro plan + per-message fees). [AiSensy Pricing](https://aisensy.com/pricing).
2. WhatsApp Business API (WABA) on a verified business number (not the founder's personal number — a separate ₹500/mo BSNL/Airtel landing).
3. WhatsApp template messages for outbound (must be pre-approved by Meta).
4. Inbound handled by Support Agent (§5.1) with founder escalation.

**Template messages to pre-approve (do all 8 in S0 — Meta approval takes 24-48 hrs):**
- Welcome message (Day 0, post-OTP)
- "Did you complete your routine today?" (Day 1, evening)
- "Your scan vs friends" social proof (Day 3)
- Rescan reminder (Day 14)
- Quarterly Glow Pack offer (Day 21 trigger if no purchase)
- Referral invite ("Share with 3 friends, get free scan")
- Refund initiated confirmation
- Subscription expiry warning (Day -3)

**Cost math:** at 1,000 paid users, expect ~8,000 outbound template messages/mo (8 templates × ~1,000 users with 70% delivery + opens). At ₹0.86 marketing message × 8,000 = **₹6,880/mo in template fees.** Service (inbound reply) messages are free ([AiSensy Pricing](https://aisensy.com/pricing)).

**Community group strategy:**
- WhatsApp Community of "GlowUp Friends" — capped at 5,000 members per Community (WhatsApp's limit). 
- 1 broadcast-only "Tips" sub-group (founder + agent post, no replies allowed) — weekly Hindi tip
- 1 "Q&A" sub-group (members can post questions) — agent triages, founder + agent answer

WhatsApp Communities don't yet support paid features but their reach + the "feels like a private group" trust factor is unmatched for Tier 2/3 women.

## 3.6 Hindi/Hinglish SEO + YouTube Shorts

**Hindi SEO:**
- Create a Hindi-language blog at `glowup.in/hi/blog` — 3 posts/week.
- Topics: "dry skin के लिए सबसे अच्छे ₹100 के products", "monsoon में acne से कैसे बचें", "10 दादी के skincare नुस्खे जो काम करते हैं", "Hindi skin scan AI: यह कैसे काम करता है".
- Hindi search volume in beauty has grown materially since 2024 ([LS Digital — Vernacular SEO Tier 2/3](https://www.lsdigital.com/blog/vernacular-seo-the-key-to-tapping-into-indias-tier-2-and-tier-3-markets/)).
- Tools: free-tier Ahrefs for keyword research (₹0 — use the limited free Webmaster Tools), Google Search Console for performance.

**YouTube Shorts:**
- 5 Shorts/week, Hindi, 30-60 sec
- Format mix: 1 talking-head demo, 2 user-testimonial reposts (from creators), 1 "myth-busting" desi remedy, 1 "behind the AI"
- Target: 3 months to 10K subscribers if posting consistently. YouTube Shorts is cheaper than Instagram Reels because YT promotes shorts native to gain mindshare against TikTok.

Content Agent (§5.2) drafts all of this; founder + freelance video editor execute.

## 3.7 PR — realistic

**Don't pay PR retainers in S0-S2.** Tier 2/3 Indian women do not read TechCrunch India. The reach is wasted.

**Realistic PR moves at S3:**
1. **YourStory / Inc42 founder profile** — pitch yourself once you have 5,000+ users. Inc42's "30 Under 30" cycle or YourStory's "Tech30" if you fit. Cost: free if you have a good story; ₹50K-2L if you go through a PR agency. Most founder profiles are pitched free.
2. **The Established / Vogue India / Femina digital** — for the post-10K milestone, pitch a "rise of Bharat beauty tech" angle. Free if angled right.
3. **Vernacular tech press** — Dainik Bhaskar Digital, Amar Ujala Lifestyle, Lokmat Online for Marathi. These outlets are hungry for "India is rising" stories. Free + a good Hindi pitch.
4. **Skip:** TechCrunch, ETtech (until you raise), Reuters (will never cover). LinkedIn announcements + founder Twitter (X) carry your story until then.

## 3.8 Referral loop math

Referral is the lowest-CAC channel if it works. Build it in S1, optimise it in S2, scale it in S3.

**The loop:**
1. Every paid user gets a referral code (`PRIYA10` style) on their result card.
2. WhatsApp share button: "मैंने अपनी skin score 67 निकाली, तुम भी free try करो — code PRIYA10"
3. Referee gets ₹5 off her first scan (₹14 instead of ₹19)
4. Referrer gets ₹5 credit toward her next scan/quarterly upgrade
5. Track redemption via promo-code attribution

**Expected K-factor:**
- Without cashback: K = 0.2-0.4 (typical India consumer app)
- With double-sided ₹5/₹5: K = 0.4-0.6 (per [ProductGrowth's referral design data](https://productgrowth.in/insights/consumer/referral-programs/))
- With double-sided ₹10/₹10 + WhatsApp pre-filled message: K = 0.6-0.9
- With double-sided ₹15/₹20 + creator co-branded code: K = 0.9-1.1 (rare; only at S3 scale)

**Math at S2 scale:**
- Acquire 1,000 paid users via Meta at CAC ₹150 = ₹1.5L
- Of these, 25% (250) refer at least 1 friend
- At K=0.5, 250 referrers bring 250 referees → first-degree referral installs
- Of 250 referees, 60% (150) convert to paid (referees convert higher than cold)
- Cost of referral = 250 × ₹10 (referrer reward) + 150 × ₹5 discount = ₹2,500 + ₹750 = ₹3,250
- Effective CAC for those 150 referees = ₹22/customer

**At ₹22 CAC, referral is 7× cheaper than Meta.** Build it. Push it. But monitor for fraud — Tier 2/3 promo-code stuffing is a thing (multiple Razorpay accounts on same SIM, dummy installs). Build basic fraud detection in S2: same-device + same-IP + first-7-day pattern = flag.

---

# Section 4 — Three P&L Scenarios (₹2L / ₹10L / ₹25L over 6 months)

The 6-month plan is the default. Same scenarios scaled for the 3mo sprint and 12mo bootstrap follow at the end of this section.

**Common assumptions across all scenarios:**
- Play Store fee: ₹2,100 ($25) one-time
- EAS Starter: ₹1,600/mo × 6 = ₹9,600
- Gemini API: ~₹0.16/scan; ramps with scale
- Razorpay: 2% UPI + 18% GST = 2.36% effective on transactions
- Hindi launch S0-S2; Tamil + Telugu adds in S3
- Avg per-customer revenue at 10K = ₹65 (60% one-time ₹19 + 25% quarterly ₹99 prorated + 15% affiliate ~₹40 average commission per converted affiliate-tap user)
- Avg per-customer cost to deliver (Gemini + Firebase + WhatsApp template) = ₹8

## 4.1 Lean — ₹2L over 6 months

**Realistic outcome:** 3,000-5,000 paid customers (hits S2, doesn't reach S3's 10K).

| Category | 6-month total (₹) | Notes |
|---|---|---|
| **Fixed monthly (tools)** | 60,000 | ₹10K/mo: EAS + Notion + Figma + free tiers everywhere else; no AiSensy until S2; no CA retainer (file GST yourself via Cleartax free tier) |
| **One-time (Play, design, vernacular content)** | 30,000 | Play $25 + ₹15K Hindi ASO writer + ₹10K minimal design pack |
| **Variable marketing — S0** | 5,000 | 1 Reel collab + WhatsApp Business API deposit at AiSensy |
| **Variable marketing — S1** | 30,000 | 4 nano influencers × ₹4K each + ₹10K ASO localisation freelancer + ₹4K WhatsApp templates |
| **Variable marketing — S2** | 65,000 | ₹40K Meta ads (~₹1.3K/day for ~30 days) + ₹20K nano/micro influencer + ₹5K WhatsApp |
| **Salaries / freelancers** | 10,000 | One freelance Hindi blog writer at ₹2.5K/post × 4 posts |
| **TOTAL spend** | **2,00,000** | |
| **Revenue (5,000 customers)** | 3,25,000 | 5,000 × ₹65 avg revenue |
| **Cost to deliver** | 40,000 | 5,000 × ₹8 |
| **Net (P&L)** | **+₹85,000** | Break-even-plus, but the founder hasn't paid themselves |
| **Customers** | **5,000** | Hits S2 cleanly; doesn't make 10K |

**CAC math:**
- Total acquisition spend: ₹1,00,000 (S0+S1+S2 marketing)
- Customers acquired: 5,000
- Blended CAC: **₹20** (because heavy reliance on organic + WhatsApp + nano influencer)
- At this CAC, you can scale Meta — but you don't have the runway. ₹2L gets you proven model, not the 10K customer line.

**Best/base/bad revenue scenarios:**

| Scenario | Customers | Revenue | Net |
|---|---|---|---|
| **Best** | 5,500 | ₹3.6L | +₹1.15L |
| **Base** | 4,000 | ₹2.6L | +₹35K |
| **Bad** | 2,000 | ₹1.3L | -₹40K |

**Runway:** at ₹2L total, the founder lasts 4-5 months at zero personal salary. Plan a fundraising conversation in month 4.

## 4.2 Moderate — ₹10L over 6 months

**Realistic outcome:** 8,000-12,000 paid customers (reaches 10K at the upper end).

| Category | 6-month total (₹) | Notes |
|---|---|---|
| **Fixed monthly (tools)** | 1,80,000 | ₹30K/mo: EAS + AiSensy Pro + Notion + Figma + GA4 + CA retainer ₹8K + Firebase scale ₹4K + Cloudflare/Gemini ₹3K |
| **One-time (Play, design, vernacular content)** | 80,000 | Play $25 + ₹30K full Hindi ASO + ₹20K design pack + ₹20K Tamil + Telugu basic localisation (S3 only) + ₹8K legal review |
| **Variable marketing — S0** | 15,000 | 2 Reel collabs + AiSensy + 1 paid user-research recruit batch |
| **Variable marketing — S1** | 70,000 | 8 nano influencers × ₹5K + ₹10K ASO localisation + ₹15K WhatsApp + ₹5K Reddit/Quora |
| **Variable marketing — S2** | 3,50,000 | ₹2L Meta ads + ₹1L micro influencer (5-6 creators × ₹15-30K) + ₹30K WhatsApp + ₹20K creative production |
| **Variable marketing — S3** | 2,30,000 | ₹1.2L Meta scale + ₹50K Google UAC start + ₹40K ShareChat/Moj + ₹20K Tamil/Telugu launch creator + ₹20K mid influencer |
| **Salaries / freelancers** | 75,000 | Freelance designer ₹50K (6 mo × ₹8K avg ad hoc) + content/video editor ₹25K |
| **TOTAL spend** | **10,00,000** | |
| **Revenue (10,000 customers)** | 6,50,000 | 10,000 × ₹65 avg |
| **Cost to deliver** | 80,000 | 10,000 × ₹8 |
| **Net (P&L)** | **-₹4,30,000** | Negative; investment phase |
| **Customers** | **10,000** | The 10K plan |

**CAC math:**
- Total acquisition spend: ₹6,65,000 (S0-S3 marketing)
- Customers acquired: 10,000
- Blended CAC: **₹66**

**Best/base/bad revenue scenarios:**

| Scenario | Customers | Revenue | Net |
|---|---|---|---|
| **Best** | 12,000 | ₹7.8L | -₹2.8L |
| **Base** | 10,000 | ₹6.5L | -₹4.3L |
| **Bad** | 7,000 | ₹4.6L | -₹6.2L |

**Runway:** at ₹10L total, the founder operates 6 months at zero salary. End of month 6 you should be either fundraising or breakeven.

This is **the recommended plan.**

## 4.3 Well-funded — ₹25L over 6 months

**Realistic outcome:** 15,000-30,000 paid customers — comfortably past 10K, in a position to fundraise or expand to 4 regional languages.

| Category | 6-month total (₹) | Notes |
|---|---|---|
| **Fixed monthly (tools)** | 3,30,000 | ₹55K/mo (S2 scale costs): EAS Production tier + AiSensy at scale + Mixpanel optional + Figma team + analytics ₹0 + dedicated WhatsApp number on Twilio fallback |
| **One-time** | 1,50,000 | Play + full multi-language ASO (Hindi + Tamil + Telugu + Marathi + Bengali) + designer brand sprint + legal pack + DPDP audit + dev build cost buffer |
| **Variable marketing — S0** | 30,000 | Same as moderate + 5-10 paid user-research sessions |
| **Variable marketing — S1** | 1,50,000 | 15 nano influencers + ₹40K full ASO across 3 languages + ₹50K WhatsApp templates + ₹20K micro test |
| **Variable marketing — S2** | 7,00,000 | ₹4L Meta + ₹1.5L micro influencer + ₹50K ShareChat test + ₹50K WhatsApp + ₹50K creative + ₹50K Tamil/Telugu prep |
| **Variable marketing — S3** | 7,40,000 | ₹3.5L Meta + ₹1.5L Google UAC + ₹1L ShareChat/Moj + ₹50K Tamil/Telugu launch + ₹40K mid influencer × 3 |
| **OEM BD (try to land)** | 1,00,000 | Travel + intro fees + initial month of pre-load ad spend |
| **Salaries / freelancers** | 4,00,000 | 1 freelance designer + 1 freelance content editor + 1 part-time community manager (Hindi-speaker, ₹15K/mo × 6) + bonus pool |
| **TOTAL spend** | **25,00,000** | |
| **Revenue (20,000 customers)** | 13,00,000 | 20,000 × ₹65 avg |
| **Cost to deliver** | 1,60,000 | 20,000 × ₹8 |
| **Net (P&L)** | **-₹10,60,000** | Negative; growth phase |
| **Customers** | **20,000** | |

**CAC math:**
- Total acquisition spend: ₹16,20,000 (S0-S3 marketing + OEM)
- Customers acquired: 20,000
- Blended CAC: **₹81** (CAC inflates with scale)

**Best/base/bad revenue scenarios:**

| Scenario | Customers | Revenue | Net |
|---|---|---|---|
| **Best** | 30,000 | ₹19.5L | -₹5.5L |
| **Base** | 20,000 | ₹13L | -₹10.6L |
| **Bad** | 12,000 | ₹7.8L | -₹15.8L |

**Runway:** at ₹25L total over 6 months, you're burning ~₹4L/mo at peak. Plan to raise pre-Series-A in month 5 — by that point you should have 12K+ customers, validated CAC, and a real story for a ₹10-30 Cr round.

## 4.4 Other timelines

### 3-month sprint (Hindi-only, no Tamil/Telugu)

Same budget bands, compressed:
- **₹2L lean:** 1,500-2,500 customers, hits S1 ceiling
- **₹10L moderate:** 4,000-6,000 customers, S2 only
- **₹25L well-funded:** 7,000-12,000 customers, peak S2 / cusp of S3

The 3mo sprint cannot reach 10K reliably even at ₹25L because **S1 organic + ASO maturation alone takes 4-6 weeks** and you can't compress it. Use the sprint only if you have a hard external deadline (demo day, market reservation).

### 12-month bootstrap

Same budget bands, stretched:
- **₹2L lean (₹17K/mo):** 8,000-15,000 customers — actually hits 10K because the slower burn aligns with organic compounding. The lean+12mo combo is the **highest capital efficiency** option.
- **₹10L (₹83K/mo):** 25,000-40,000 customers; expand to 5 languages
- **₹25L (₹2L/mo):** 50,000-80,000 customers; pre-Series-A profile

**The 12mo + lean ₹2L plan is the smart bootstrap path.** You'll get to 10K and learn the unit economics deeply, before raising or scaling.

---

# Section 5 — Claude-Agents Playbook (copy-pasteable)

Each agent below has: trigger, inputs, prompt scaffold (3-10 lines you can paste verbatim into Claude), output, review cadence, failure mode + circuit breaker, and one worked example. All agents run on **Claude Sonnet** by default; switch to Haiku for high-volume routing (Support triage) and Opus for high-judgment one-offs (refund disputes, PR drafting).

The agents are designed to be **orchestrated by Claude Code or the Claude Agent SDK** — the founder pushes a single command (`make digest` / `make weekly-content` / `make intel`) and the agent runs end-to-end including data fetching, drafting, and posting to Notion / Sheet / Slack.

## 5.1 Support Agent (WhatsApp + Play Console reviews)

**Trigger:** Every 5 minutes during 9am-9pm IST; batch overnight 11pm-6am.

**Inputs:**
- New AiSensy inbound messages (last 5 min)
- New Play Console reviews (poll every hour)
- User profile: language, last scan date, payment history, refund eligibility
- Existing FAQ knowledge base (Notion page)
- This week's known issues (Notion page maintained by founder)

**Prompt scaffold (paste into Claude):**

```
You are GlowUp's WhatsApp + Play support agent. Reply in the user's language (Hindi/Hinglish/regional — match the inbound message language exactly).

Inbound message: <MESSAGE>
User context: <USER_JSON> (language, last_scan_date, has_paid, has_refunded_before)
Known issues this week: <KNOWN_ISSUES>
FAQ snippets: <RELEVANT_FAQ>

Reply with EXACTLY this JSON structure:
{
  "draft_reply": "<3-5 sentence reply in user's language>",
  "intent_category": "scan_issue|payment_issue|refund_request|how_to|cancel_request|product_question|other",
  "sentiment": "positive|neutral|negative|angry",
  "escalate_to_founder": <true if refund_request OR negative+payment OR mentions "fake" OR mentions "DPDP" OR mentions media/RTI/legal>,
  "confidence": 0.0-1.0
}

Rules:
- Never promise a refund. Say "मैं team को बता रही हूं, 24 hr में reply आएगी" and escalate.
- Never reveal API/internal details.
- If confidence < 0.6, escalate.
- For Play reviews, draft a developer-reply (max 350 char, Hindi if review is Hindi).
- For non-Hindi/English regional messages you can't read, escalate.
```

**Output:**
- WhatsApp: draft reply queued for founder approval if `escalate=true`, else auto-send via AiSensy
- Play Console: draft developer-reply queued in Notion for founder one-click approval
- Daily 9pm digest: top 5 user pain points by frequency

**Review cadence:**
- 100% review of escalated messages (real-time)
- 10% spot-check of auto-sent replies (daily, 5-min batch via Sheets log)
- Weekly review of intent_category mix and sentiment trend

**Failure mode + circuit breaker:**
- **Failure mode 1:** Agent auto-sends a reply that promises a refund or makes a factual error. → **Circuit breaker:** Never auto-send if intent is `refund_request`, `cancel_request`, or sentiment is `angry`. Force-escalate.
- **Failure mode 2:** Agent replies to a fake support number / scam attempt. → **Circuit breaker:** Don't auto-send if message includes URLs, "send your OTP", "verify your bank", or external links. Escalate.
- **Failure mode 3:** Hindi tone is too formal / corporate. → **Circuit breaker:** Maintain a "tone examples" file with 20 founder-approved Hindi replies; agent few-shots from those.

**Worked example:**
- **Inbound (WhatsApp, Hindi):** "मैंने scan किया but score show नहीं हो रहा है, please help"
- **Agent draft:** "हाय Priya! क्या आप app को बंद करके फिर से open कर सकती हैं? अगर फिर भी score नहीं आ रहा है, तो screen का photo भेज दें — हम तुरंत solve कर देंगे। 🌸"
- **Category:** scan_issue, **Sentiment:** neutral, **Escalate:** false, **Confidence:** 0.85
- → Auto-sent.

## 5.2 Content Agent (blog, Shorts script, captions, broadcasts)

**Trigger:** Every Monday 8am IST (weekly batch). On-demand: any time founder asks "draft me 5 ad copy variants for X."

**Inputs:**
- Last week's top-performing scan results (anonymised user concerns, top top_concern_keys, top product recs)
- Last week's WhatsApp open + click rates by template
- Competitor content scan (Intel Agent output)
- Festival/seasonal calendar (Holi, Karva Chauth, Diwali, monsoon, winter dry skin, summer tan)
- Founder's editorial guardrails (Notion page: "what we never write about, what brand voice is")

**Prompt scaffold:**

```
You are GlowUp's content lead, writing for Tier 2/3 Indian women aged 18-40 in Hindi-belt + (later) South India. Voice: warm, practical, recipe-grandmother-meets-skincare-friend. Never preachy, never English-corporate.

This week's context:
- Top 3 user concerns (anonymised, from Analytics Agent): <CONCERNS>
- This week's seasonal angle: <SEASON_NOTE> (e.g., "monsoon humidity acne")
- Festival calendar: <UPCOMING_FESTIVAL>
- Last week's top WhatsApp template (CTR): <TEMPLATE_WINNER>

Produce a complete weekly content batch as JSON:
{
  "blog_posts": [3 Hindi blog posts — title (Hindi), 800-1200 words, H2-structured, with internal links to app pages],
  "youtube_shorts": [5 scripts — 30-60 sec, scene-by-scene with on-screen-text + voiceover Hindi],
  "instagram_reels_captions": [5 captions, Hindi/Hinglish, with 8-12 hashtags including 4 Devanagari ones],
  "sharechat_moj_captions": [5 captions, pure Hindi/Devanagari, no English],
  "whatsapp_broadcast": {
    "template_name": "...",
    "body": "<≤160 chars, Hindi, with 1 emoji>",
    "cta_url": "..."
  },
  "newsletter_long_form": "<800-word WhatsApp newsletter in Hindi>"
}

Rules:
- Never make medical claims. "AI estimate only" or "एक tip — डॉक्टर की सलाह नहीं" disclaimers.
- Always cite a desi ingredient or remedy in each blog (besan, multani mitti, kasturi haldi, ubtan, neem, etc).
- Product recs always include price ≤ ₹250.
- No English words longer than 3 chars unless they're loan words (app, scan, AI, ok).
```

**Output:**
- 3 blog drafts in Notion
- 5 YouTube Shorts scripts in Notion (with shot-list for the video editor)
- 5 Reels captions + 5 ShareChat/Moj captions
- 1 WhatsApp broadcast queued for founder approval
- 1 long-form newsletter

**Review cadence:**
- Founder approves all content Monday 5-6pm before scheduled posts.
- Reject + regenerate is cheaper than full rewrite — push back with one-line feedback.

**Failure mode + circuit breaker:**
- **Failure mode 1:** Medical claims sneak in ("yeh acne cure karega"). → **Circuit breaker:** Post-generation lint pass — regex for trigger words ("cure", "इलाज", "guarantee") forces founder review.
- **Failure mode 2:** Tone drifts into Tier 1 / English-Insta-marketing register. → **Circuit breaker:** Maintain a "Tier 2/3 voice" doc with 20 founder-approved samples; agent few-shots; tone score 0-10 by another Claude pass; reject if <7.
- **Failure mode 3:** Same topic repeated weekly. → **Circuit breaker:** Track topic taxonomy (Notion); agent reads last 4 weeks' topics and excludes.

**Worked example:**
- Input: top concern = "dark spots", seasonal = "monsoon humidity"
- Output blog title: "Monsoon में dark spots से कैसे बचें — 5 कम कीमत में मिलने वाले products और एक दादी का नुस्खा"
- Body: 1000 Hindi words, 5 products (Himalaya, Biotique, Vicco, Dabur, Khadi — all ≤₹240), one besan + dahi + haldi mask recipe, disclaimer at bottom.

## 5.3 Creative Agent (ad copy + image variants)

**Trigger:** Mondays 4pm IST batch; on-demand when performance marketer flags creative fatigue.

**Inputs:**
- Last 2 weeks' Meta creative performance (CPI, CTR, install→paid conversion, refund-by-creative)
- Top-performing organic creator content (Intel Agent + manual)
- This week's campaign brief from founder (audience, KPI, hook)
- Brand kit (colors, fonts, do-not-use phrases)

**Prompt scaffold:**

```
You are GlowUp's creative director, designing 9:16 Hindi/Hinglish video ads for Meta + ShareChat + Moj.

Last 14 days creative performance (top 5):
<CREATIVE_PERFORMANCE_CSV>

This week's brief:
- Audience: <e.g., women 22-34, Tier 2 Hindi-belt>
- KPI: <e.g., reduce CPI to ₹18>
- Hook angle: <e.g., "₹19 vs ₹2000 derm consult">
- Avoid: <e.g., no English-only, no Bollywood references, no light-skinned models>

Produce 6 ad concepts as JSON:
{
  "concepts": [
    {
      "concept_id": "c01",
      "angle": "...",
      "first_3_sec_hook": "<voice-over text in Hindi, on-screen text in Devanagari>",
      "middle_8_sec_payoff": "<what user sees>",
      "final_3_sec_cta": "<Hindi text + button>",
      "expected_cpi_range": "₹X-Y",
      "creator_type": "nano|micro|founder-talking-head|stock-footage",
      "production_brief": "<1 paragraph for video editor>"
    }
  ]
}

Rules:
- Never recycle a hook that hit <0.5% CTR.
- Always test 1 desi-ingredient angle (multani mitti, ubtan, haldi).
- Always test 1 price-anchor angle (₹19, ₹99 quarterly).
- Always test 1 social-proof angle ("10,000+ Indian women have…").
- 3 of 6 must be UGC-creator-friendly (low production).
```

**Output:**
- 6 concept briefs in Notion, ranked by predicted CPI
- Production briefs sent to freelance video editor on Topmate/WhatsApp
- A/B test plan: which 4 of 6 to ship this week

**Review cadence:**
- Founder + performance marketer review Monday 5pm. Kill 2 concepts, refine 4, ship by Wednesday.

**Failure mode + circuit breaker:**
- **Failure mode 1:** All 6 concepts look the same. → **Circuit breaker:** Require concept diversity scoring (5+ distinct angles); regenerate if score <3.
- **Failure mode 2:** Concept includes culturally off-key elements (e.g., a Punjabi wedding scene aimed at a Tamil campaign). → **Circuit breaker:** Maintain a "cultural calibration" check; agent does self-review.
- **Failure mode 3:** Concept implies medical guarantee. → **Circuit breaker:** Same lint as Content Agent.

**Worked example:**
- Brief: audience = Tier 2 Tamil women 25-35, KPI = launch CPI ₹25, angle = "your dadi's recipe meets AI"
- Concept: 30-sec Reel. Open: Tamil grandmother in saree mixing kasturi haldi paste, voiceover (Tamil): "என் பாட்டியின் ரகசியம், இப்போது AI மூலம்" ("My grandmother's secret, now via AI"). Middle: cut to young woman taking selfie, score reveal, animated radar. End: "₹19-ல் உங்கள் முகச்சாயலை அறியுங்கள்" (Know your skin for ₹19) + Play Store button. Production brief sent to Tamil video editor.

## 5.4 Analytics Agent (daily digest, weekly cohort)

**Trigger:** Daily 9am IST. Weekly cohort summary every Monday 8am.

**Inputs:**
- Firebase Analytics export (BigQuery — 24 hours)
- Razorpay transactions API (24 hours)
- Meta Ads Manager export (24 hours)
- AiSensy WhatsApp engagement stats
- Prior 7 days for comparison

**Prompt scaffold:**

```
You are GlowUp's data analyst. Produce a 10-line founder digest from the data below.

Today: <DATE>
Yesterday's events: <EVENTS_JSON>
Last 7 day comparison: <PRIOR_WEEK_JSON>
Ad spend yesterday: <META_SPEND, GOOGLE_SPEND>
Razorpay yesterday: <ORDERS_TABLE>
WhatsApp yesterday: <SENT, OPEN, CLICK, REPLY>

Produce a digest as plain text with the following sections:
1. Headline (1 line — biggest news)
2. Funnel (5 lines — installs / scans / score_reveal / paywall_view / ₹19_unlock / ₹99_purchase — with W/W % change)
3. CAC + LTV (1 line — blended CAC yesterday vs last 7d avg; current cohort M1 LTV)
4. WhatsApp (1 line — open % / CTR / unsubs)
5. Refunds + churn (1 line — count yesterday, % of prior cohort)
6. One anomaly worth investigating (1 line — e.g., "iOS install rate dropped 30%")
7. One recommended action (1 line — e.g., "shift ₹500/day from creative-c03 to c07")

Be terse. No fluff. No emojis. Number-first. Use ₹.
```

**Output:**
- Plain text digest, ≤300 words, posted to Notion + sent to founder WhatsApp 9am
- Anomaly alerts as separate WhatsApp ping if any metric drops >30% W/W

**Review cadence:**
- Founder reads daily over morning coffee. Acts on the "recommended action" line if it's defensible.

**Failure mode + circuit breaker:**
- **Failure mode 1:** Agent inflates anomalies (says "30% drop" when it's noise). → **Circuit breaker:** Require statistical-significance check on anomaly call-outs (≥30 events/day baseline, ≥2σ deviation).
- **Failure mode 2:** Recommended action is wrong because it ignores upstream context. → **Circuit breaker:** Founder owns the action call; agent's recommendation is a suggestion, not an order.
- **Failure mode 3:** Razorpay transactions don't match what users see (e.g., webhook delay). → **Circuit breaker:** Reconcile daily; if mismatch > 5%, agent flags as "data quality issue, do not act."

**Worked example:**
```
GlowUp daily — 28 May 2026 Tue
1. ₹19 unlocks +42% W/W on Hindi UP campaign — creative c07 winning
2. Installs 814 (+22% W/W); scans 612 (+18%); score_reveal 540; paywall_view 510; ₹19 unlocks 51 (10% conv); ₹99 purchases 6
3. Blended CAC ₹78 (7d avg ₹91); cohort M1 LTV ₹52
4. WA: 5,200 sent, 64% open, 12% CTR, 0.4% unsub
5. Refunds 2 (3.9% of prior-day unlocks)
6. ANOMALY: ShareChat installs dropped 38% W/W — investigate creator post-pause
7. ACTION: pause Meta creative c03 (CPI ₹52, no conv); push ₹500/day to c07
```

## 5.5 Intel Agent (competitor + market + policy)

**Trigger:** Weekly, Sunday 7pm IST.

**Inputs:**
- Curated source list (in Notion, founder-maintained):
  - Sensor Tower's India app rankings (top 50 Beauty + Health & Fitness, weekly)
  - data.ai (App Annie) similar
  - RBI press releases + Pine Labs / Razorpay blogs (last 7 days)
  - Google Play Console policy email + Android dev blog
  - DPDP / MeitY notifications
  - Inc42, ETtech, YourStory beauty/wellness/D2C coverage
  - Nykaa, Mamaearth, Pilgrim, Plum, Clinikally press + LinkedIn
  - Top 5 competitor apps' Play Store listings (any changes to title, description, screenshots, version)
- 7-day window

**Prompt scaffold:**

```
You are GlowUp's market intel analyst. Scan the last 7 days of inputs and produce a Sunday report.

Sources to check:
- Competitor apps: <LIST_OF_APP_IDS> — note any title/description/version changes
- News domains: inc42.com, yourstory.com, economictimes.com, business-standard.com, beautymatter.com, cosmeticsdesign-asia.com, techcrunch.com (India tag)
- Policy: rbi.org.in, meity.gov.in, play.google.com policy
- Influencer chatter: top 30 Hindi beauty creators (provided list) — any mention of competitor or our app

Last week's report: <LAST_WEEK_HIGHLIGHTS> (for delta context)

Produce a JSON report:
{
  "headline": "<1-sentence biggest event of the week>",
  "competitor_moves": [{"name":"...","what":"...","impact_on_us":"...","action":"..."}],
  "policy_shifts": [{"source":"...","what":"...","impact":"...","action":"..."}],
  "creator_intel": [{"creator":"...","platform":"...","mentioned_us_or_competitor":"...","sentiment":"+|-|n"}],
  "asomovers": "<Top 3 Beauty apps that moved up/down in Play India rankings>",
  "macro_trend": "<1 paragraph — what direction is the market moving>",
  "recommendation": "<1 action for the founder this week>"
}

Be specific. Cite URLs. Don't hallucinate movers — if you can't verify, say "unknown."
```

**Output:**
- Sunday report in Notion, ~500-800 words
- Sent to founder WhatsApp Sunday 8pm
- Filed in `intel-reports/2026-W22.md` style for quarterly trend analysis

**Review cadence:**
- Founder reads Sunday evening; one action item by Monday morning.

**Failure mode + circuit breaker:**
- **Failure mode 1:** Agent hallucinates competitor moves. → **Circuit breaker:** Every claim cites a URL; if no URL, mark "unverified" and skip.
- **Failure mode 2:** Misses critical policy shift. → **Circuit breaker:** Maintain a "policy watch list" of MeitY/RBI/Play/Meta URLs; agent must visit each weekly even if no news.
- **Failure mode 3:** Reports get repetitive ("Nykaa added a new product, Mamaearth raised"). → **Circuit breaker:** Filter for impact_on_us ≥ "medium" before including.

**Worked example:**
- Headline: "Clinikally Clara now offers free derm consult with first scan — direct trial competitor"
- Competitor moves: {name: "Clinikally", what: "added free derm consult", impact: "puts pressure on our ₹99 quarterly value perception", action: "tighten quarterly value prop messaging — emphasise routine + product recs over consult"}
- Policy: {source: "RBI", what: "raised UPI Autopay limit to ₹20K", impact: "irrelevant — we're at ₹99", action: "none"}
- ASO movers: "TroveSkin moved from #18 to #11 in Play India Beauty — investigate keywords"
- Recommendation: "Watch Clinikally for a Hindi push — they don't have Hindi UX yet"

## 5.6 CRM Agent (WhatsApp segmented broadcasts + reactivation)

**Trigger:** Wednesdays 11am IST (weekly broadcast). Real-time triggers for reactivation (Day-7 silent, Day-21 silent, post-refund follow-up).

**Inputs:**
- User cohorts (from Firestore):
  - C1: paid, last scan ≤ 7 days
  - C2: paid, last scan 8-30 days (warm)
  - C3: paid, last scan >30 days (cold)
  - C4: scanned but not paid (warm prospect)
  - C5: refunded (sensitive)
- Top 5 product recs this week (Affiliate Agent / Sheet)
- Festival/seasonal calendar
- Compliance: opt-in status, last-touched within 24h (WhatsApp 24-hr rule)

**Prompt scaffold:**

```
You are GlowUp's CRM lead. Plan this week's WhatsApp campaigns across cohorts.

Cohorts:
- C1 (active warm): <count>
- C2 (8-30d): <count>
- C3 (>30d cold): <count>
- C4 (free-only): <count>
- C5 (refunded): <count>

This week's hook angle: <CONTENT_AGENT_OUTPUT>
Seasonal: <SEASON_NOTE>

Plan 4 WhatsApp template campaigns:
{
  "C1_campaign": {"template_name":"...", "body":"<≤160 char Hindi>", "cta":"...", "send_window":"Wed 7pm"},
  "C2_campaign": {"template_name":"...", "body":"...", "cta":"...", "send_window":"..."},
  "C3_campaign": {"template_name":"...", "body":"...", "cta":"...", "send_window":"..."},
  "C4_campaign": {"template_name":"...", "body":"...", "cta":"...", "send_window":"..."}
}

Rules:
- C5 (refunded) gets NO broadcasts. They opted out by refunding. Only respond to inbound.
- All templates pre-approved by Meta. If a new template is needed, flag for founder.
- Never send a marketing template to someone who has been inactive >60 days without re-opt-in.
- Compliance: include unsubscribe text only if template requires; AiSensy handles by default.
```

**Output:**
- 4 weekly campaign briefs queued in AiSensy + Notion
- Expected reach: ~70% of opted-in cohort
- Expected reply rate: 3-8% (drives Support Agent volume)

**Review cadence:**
- Founder approves Wednesday 10am before noon send-out.

**Failure mode + circuit breaker:**
- **Failure mode 1:** Agent sends to refunded cohort by mistake. → **Circuit breaker:** Hard exclusion at AiSensy segment level; agent cannot select C5.
- **Failure mode 2:** Template not pre-approved → fails to send. → **Circuit breaker:** Validate template name against AiSensy approved list before queueing.
- **Failure mode 3:** Tone too pushy → unsubs spike. → **Circuit breaker:** Weekly unsub rate target <0.5%; if >1%, pause and rewrite.

**Worked example:**
- C2 campaign body: "Priya! आपने 15 दिन पहले scan किया था — क्या आपकी skin बेहतर हुई? आज free rescan करके progress देखें ✨ → [link]"

## 5.7 Ops Agent (changelog, OKR digest, vendor reminders)

**Trigger:** Fridays 4pm IST.

**Inputs:**
- Git commits last 7 days
- Linear/GitHub issues closed
- This month's OKRs (Notion)
- Vendor renewal calendar (Firebase, EAS, AiSensy, CA, etc.)
- Freelancer invoice pipeline
- Razorpay reconciliation status

**Prompt scaffold:**

```
You are GlowUp's ops manager. Produce a weekly ops digest.

This week's commits: <GIT_LOG>
Issues closed: <ISSUES>
OKR progress: <OKR_SHEET>
Upcoming vendor events (next 14 days): <CALENDAR>
Freelancer payments due: <PAYMENTS_QUEUE>

Produce a Friday digest:
{
  "shipped_this_week": ["<commit-summary 1>", "<commit-summary 2>"],
  "okr_progress": [{"okr":"...","progress":"X/Y","at_risk":bool}],
  "upcoming_due": [{"item":"...","date":"...","amount":"..."}],
  "founder_to_do_monday": ["<item 1>", "<item 2>"],
  "auto_drafted_emails": [{"to":"<freelancer>","subject":"...","body":"..."}]
}

Be precise. No filler.
```

**Output:**
- Friday digest in Notion
- Auto-drafted freelancer payment emails (founder one-click sends)
- OKR red-flag alerts for items at risk

**Review cadence:**
- Founder reviews Friday 5pm.

**Failure mode + circuit breaker:**
- **Failure mode 1:** Misses a vendor renewal → service goes down. → **Circuit breaker:** Vendor calendar is source-of-truth; agent reads, doesn't write. Founder sets renewals manually.
- **Failure mode 2:** Mis-attributes OKR progress. → **Circuit breaker:** Each OKR has a metric source (GA4 query, Razorpay query, Firestore count); agent must cite the source.

**Worked example:**
- Shipped: ["Razorpay one-time order module for ₹19", "Tamil ASO listing v1"]
- OKR progress: [{okr: "1,000 paid users by Jul 1", progress: "780/1000", at_risk: false}, {okr: "Tamil launch ready by Jun 15", progress: "60%", at_risk: true}]
- Founder Monday: ["Call Tamil video editor — shoot delay 5 days", "Approve C2 WhatsApp template — pending in AiSensy"]

---

# Section 6 — Risks + Circuit Breakers

The way to think about risks: **monitor a leading indicator, define a trigger threshold, predefine the action.** Below are the seven highest-impact risks for GlowUp + Path B + this 6-month plan.

## 6.1 Ad-tracking shifts (iOS ATT, Android Privacy Sandbox, Meta CAPI changes)

**Risk:** Meta's signal quality degrades further (ATT below 20% effective on iOS, Privacy Sandbox restrictions on Android limit GAID). Result: CPI inflates 30-100% and lookalikes degrade.

**Monitoring:**
- Daily ATT opt-in rate on iOS (post-prompt) — `att_prompt_response` event from `analytics-tracking-plan.md`
- Weekly Android GAID availability rate
- Meta Events Manager: % events with full advanced matching

**Trigger thresholds:**
- ATT opt-in <15% sustained 2 weeks
- Android GAID availability <80%
- Meta advanced matching <60%

**Actions:**
1. Accelerate **server-side CAPI** rollout (per `analytics-tracking-plan.md` v2) — push to month 2 instead of month 3.
2. Shift 30% of Meta budget to **Google UAC** earlier (S2 start instead of S3).
3. Lean into **WhatsApp + influencer** (deterministic attribution via promo codes) as a partial replacement for Meta optimisation.

## 6.2 Razorpay autopay collapse (UPI Autopay success rate below 25%)

**Risk:** UPI Autopay success was already 30% in Nov 2025 (`payments-and-paywall-report.md`). If it drops further, the ₹99 quarterly model becomes structurally unviable.

**Monitoring:**
- Weekly `subscription_renewal` success rate vs. attempted renewals
- 24-hr pre-debit cancel rate (Razorpay webhooks: `subscription.charged` vs `subscription.cancelled` in 24-hr pre-debit window)

**Trigger thresholds:**
- Renewal success rate <25% in any month
- Pre-debit cancel rate >35%

**Actions:**
1. Pause new ₹99 quarterly sign-ups; push ₹19 one-time exclusively for 4 weeks while diagnosing.
2. Switch primary recurring rail to **card eMandate fallback** (70%+ success, but lower reach in Tier 2/3 — model with reduced TAM).
3. Test a **₹99 quarterly via UPI Intent one-time-payment** (no Autopay; manual renewal with WhatsApp reminder). Per `audience-fit-tier2-tier3.md` §1.6 this is the Bharat-native rail.

## 6.3 Play Policy on AI face apps tightens

**Risk:** Google Play warned in 2026 that AI-generated apps not meeting quality/safety/UX standards face removal ([App Design Glory — Google Warns AI Apps](https://www.appdesignglory.com/blogs/google-warns-ai-generated-apps-may-be-removed-from-play-store-in-2026/)). AI face/skin apps could be flagged for: biometric data handling, AI hallucinations, lack of moderation systems, misleading marketing.

**Monitoring:**
- Weekly Play Console policy email (Intel Agent §5.5)
- Monthly check of Android Developer blog
- Watch competitor app removals (FaceApp / Umax / etc. for India removal)

**Trigger thresholds:**
- Any policy email from Google Play mentioning AI/biometrics/health claims
- Removal of any AI-skin competitor from Play India

**Actions:**
1. **DPDP compliance posture stays tight** — explicit consent layer (per `analytics-tracking-plan.md` §5.1) is non-negotiable.
2. **Don't make medical claims, ever.** Strict lint on all content; "AI estimate" disclaimers on every result.
3. **Add an in-app reporting / moderation flow** in S2 — users can flag scan output as incorrect; founder reviews weekly. This is exactly the "user reporting and moderation systems" Google now expects.
4. **Selfie storage:** delete user-uploaded selfies from Firebase Storage within 7 days unless user explicitly opts to keep for progress tracking. Document this in privacy policy.
5. **Pre-emptive consult with a Bangalore tech lawyer** at S2 start (₹15-25K one-off) on Play Store + DPDP + IT Rules 2021 (intermediary guidelines if community/UGC grows).

## 6.4 Nykaa Skin Scan + Clinikally Clara competitive pressure

**Risk:** Nykaa (40M beauty consumers, Skin Scan launched Nov 2025) or Clinikally (YC S22, Clara launched May 2025) launches a **free Hindi-native scan + free derm consult bundle** that undermines GlowUp's ₹19 pitch.

**Monitoring:**
- Weekly Intel Agent watch of Nykaa app (Hindi locale availability, scan feature changes)
- Clinikally Clara press/LinkedIn — derm consult pricing, language expansion
- Mamaearth's Hindi-first AI initiatives

**Trigger thresholds:**
- Nykaa Skin Scan launches in Hindi (currently English-only as of May 2026)
- Clinikally Clara launches a free-trial promo for >30 days
- Mamaearth ships an AI scan inside their app

**Actions:**
1. **Lean into Path B differentiators they can't replicate:** ubtan/multani-mitti remedies (FMCG-incumbent brand voice), regional language (Tamil/Telugu), WhatsApp-first commerce. Nykaa is structurally premium; Clinikally is structurally consult-driven.
2. **Open OEM BD harder.** OEM pre-loads are Nykaa-proof (Nykaa won't bid for OEM slots).
3. **Watch — don't react.** Nykaa launching Hindi Skin Scan doesn't kill you if your funnel still converts; it just compresses CAC headroom. Re-baseline CAC vs CLV monthly.
4. **The strategic outcome:** if Nykaa goes Hindi + free + product-funnel, GlowUp's exit is **acqui-hire by Nykaa or Tira at ₹20-50 Cr in year 2.** This is not failure; this is a fine outcome. Plan for it as an option, not as a default.

## 6.5 Moderation incidents (user complaints, viral negative review, biometric data scare)

**Risk:** A scan returns an offensive or wildly wrong result; a user posts a viral negative Reel; a journalist runs a "Indian women uploading selfies to AI" privacy piece.

**Monitoring:**
- Daily Play Store review sentiment (Support Agent flags <3★ reviews to founder real-time)
- Twitter/X mentions (Intel Agent weekly scan)
- WhatsApp inbound: any message mentioning "fake / wrong / scam / report" auto-escalates

**Trigger thresholds:**
- Any Play review <3★ that mentions "wrong / fake / scary / offensive"
- Any media inbound (journalist / blogger) request
- 3+ similar complaints in 24 hours

**Actions:**
1. **Founder takes the call within 4 hours.** No agents.
2. Pre-drafted statement templates in Notion (data handling, AI disclaimer, refund policy) — agent never auto-uses these; founder edits + sends.
3. **Issue refunds liberally** for any user with a complaint. Cost is trivial relative to PR damage.
4. **Pause ad spend** for 48 hrs if a public complaint goes viral (>10K likes on a critical Reel/Tweet). Re-emerge with a response only after the conversation cools.
5. **Document everything** — every refund, every escalation, every founder-touched message. The DPDP Board takes documentation seriously if it ever comes to that.

## 6.6 Refund rate spike (>10% sustained)

**Risk:** Ad creative over-promises; scan output disappoints; users feel cheated. Refund rate climbs to 10-15%.

**Monitoring:**
- Daily `refund_issued` count vs prior 7-day `subscription_purchase` cohort

**Trigger thresholds:**
- Daily refund rate >8% for any 7-day window
- Cohort-level refund rate >12% for any weekly cohort

**Actions:**
1. **Audit ad creative** — pull top 5 creatives by install volume in last 14 days; compare what they promise vs what the scan delivers. Kill mismatched creatives within 24 hrs.
2. **Tighten Gemini prompt** — if scan is genuinely returning poor output, adjust prompt or add quality-check layer.
3. **In-app exit survey** — ask refunded users why (3 multi-choice + 1 free-text) at refund time. Read every response for 2 weeks.
4. **Consider ₹49 → ₹19 price drop** if value perception is the issue.

## 6.7 Founder burnout

**Risk:** Solo founders + agentic AI is more sustainable than pure solo, but the failure mode is "founder works 12 hrs/day for 6 months and quits in month 7." This kills more solo startups than competition does.

**Monitoring:**
- Founder personally tracks hours worked, sleep hours, mood (3-question weekly self-check)
- Anyone reading this doc 6 weeks in should add a calendar event "Burnout check + walk" every Saturday

**Trigger thresholds:**
- ≥10 hrs/day worked for 3 consecutive weeks
- Sleep <6 hrs for any 5 consecutive nights
- Mood self-rating <5/10 for 2 consecutive weeks

**Actions:**
1. **Take a full week off.** The agents keep running; ads pause; support gets a "we'll reply Monday" auto-reply.
2. **Hire one more freelancer** in the area causing most stress (usually support or content).
3. **Cut S3 timeline** — if 10K by month 6 is going to break the founder, 10K by month 9 is fine. Move to 12-month bootstrap.
4. **Talk to another solo founder** — Indian founders' communities (Founders Network India, IIM-Bangalore startup network). The peer benchmark resets a lot of pressure.

---

# Section 7 — Day 1 to Day 30 Checklist (Week-by-Week)

This is the **moderate 6-month plan starting Day 1** (Monday June 1, 2026 for a clean week-1 start). Adjust dates if your timeline shifts.

**Owner key:** **F** = Founder, **A** = Agent, **FL** = Freelancer. Costs in ₹.

## Week 1 (Jun 1-7) — Foundation

| # | Task | Owner | Est. cost | Done when |
|---|---|---|---|---|
| 1 | Decide budget tier (₹2L / ₹10L / ₹25L) + timeline (3 / 6 / 12 mo). Document in Notion. | F | ₹0 | Written down |
| 2 | Open Play Console developer account ($25 one-time) | F | ₹2,100 | Account verified |
| 3 | KYC sole prop with Udyam + GST + Razorpay current account (parallel) | F | ₹0 | Bank account active |
| 4 | Razorpay account live (UPI Intent one-time + Subscriptions module standby) | F | ₹0 | Test ₹1 transaction succeeds |
| 5 | Anthropic API key (for agents) + Claude Code setup | F | ₹0 (pay-as-go) | Hello-world agent runs |
| 6 | Notion workspace + folder structure (intel-reports, content, ops-digests, runbook) | F | ₹720/mo | Folders exist |
| 7 | Hire freelance designer (10-15 hrs/week retainer) via Topmate / Behance Hindi-typography filter | F | ₹40K/mo from W2 | One person identified, contract sent |
| 8 | Brand rename decision: "GlowUp" English wordmark + Hindi co-brand ("Nikhar" / "Roop" / "Glow") | F + designer | ₹0 | Decision written, designer briefed |
| 9 | DPDP-compliant consent layer scope locked (per `analytics-tracking-plan.md` §5.1) | F | ₹0 | Ticket created |
| 10 | Recruit 10 beta users from personal Hindi-belt network for S0 | F | ₹0 | 10 WhatsApp confirmations |

**Week 1 spend:** ~₹3K. **Output:** all accounts live, brand decision made, S0 beta lined up.

## Week 2 (Jun 8-14) — Build foundation + S0 start

| # | Task | Owner | Est. cost | Done when |
|---|---|---|---|---|
| 11 | Implement DPDP consent screen (after language pick) | F | ₹0 (dev time) | Screen ships in dev build |
| 12 | Implement ₹19 one-time unlock + Razorpay UPI Intent | F | ₹0 (dev time) | Test purchase succeeds |
| 13 | Implement WhatsApp share button on result card | F | ₹0 (dev time) | Share opens WhatsApp with pre-filled text |
| 14 | Hindi ASO listing v1 (title, short, long, screenshots) | F + designer + FL Hindi writer | ₹15K | Listing live in Play internal track |
| 15 | Set up AiSensy account (Pro plan ₹2,399/mo) + verify WhatsApp Business number | F | ₹2,399/mo + ₹500 number deposit | Number verified by Meta |
| 16 | Pre-submit 8 WhatsApp templates to Meta (24-48 hr approval) | F + Content Agent | ₹0 | All 8 approved |
| 17 | Launch S0 closed beta — 30 users from network + 20 from WhatsApp groups | F | ₹0 | 50 invites sent |
| 18 | Recruit 1 nano Hindi creator for first Reel collab | F | ₹4-6K | Contract signed |
| 19 | Set up Firebase Analytics + Meta App Events (per `analytics-tracking-plan.md` v1) | F | ₹0 | Test event fires in DebugView |
| 20 | Set up Intel Agent (§5.5) + Analytics Agent (§5.4) | F | ₹0 (Claude API) | First daily digest runs |

**Week 2 spend:** ~₹22K. **Output:** product is in 50 beta hands, analytics + WhatsApp + Reel-collab pipeline live.

## Week 3 (Jun 15-21) — S0 close + S1 prep

| # | Task | Owner | Est. cost | Done when |
|---|---|---|---|---|
| 21 | Daily Support Agent + Founder review of beta WhatsApp inbound | F + Support Agent | ₹0 | All 50 users have ≥1 scan |
| 22 | Manually QA 30 scans for accuracy vs user-described skin | F | ₹0 | Match rate calculated |
| 23 | Tune Gemini prompt if match rate <70% | F | ₹0 | Prompt v2 deployed |
| 24 | Collect NPS from 30 beta users (one-question Hindi WhatsApp survey) | F + CRM Agent | ₹0 | 25+ responses |
| 25 | Decision gate: NPS ≥ 50 → proceed to S1; NPS < 50 → pause, fix product | F | ₹0 | Decision recorded |
| 26 | Open Beta → Production transition: Play Store listing live | F | ₹0 | App live in Play India |
| 27 | First Reel collab live | FL + nano creator | ₹4-6K (paid W2) | Reel published |
| 28 | Hire freelance Hindi blog writer (₹2,500/post) | F | ₹2,500/post going forward | Test post commissioned |
| 29 | Set up Content Agent (§5.2) + Creative Agent (§5.3) | F | ₹0 | First weekly content batch runs |
| 30 | Set up CRM Agent (§5.6) — Wed broadcast schedule | F | ₹0 | First broadcast queued |

**Week 3 spend:** ~₹10K. **Output:** S0 done, product validated, S1 motion ready. Cumulative spend ~₹35K.

## Week 4 (Jun 22-28) — S1 launch

| # | Task | Owner | Est. cost | Done when |
|---|---|---|---|---|
| 31 | First Hindi blog post live | FL Hindi writer + F | ₹2,500 | Post indexed by Google |
| 32 | First WhatsApp Wednesday broadcast (template: Welcome + first scan) | CRM Agent + F | ₹600 in messages | Broadcast sent to 50 users |
| 33 | Identify + contract 3 nano Hindi creators for the next 2-week window | F | ₹15K | Contracts signed |
| 34 | Launch ₹50/day Meta test budget (single AAA campaign, single creative, Hindi-belt audience) | FL performance marketer + F | ₹1,400/W (S1 toe-dip) | Campaign live |
| 35 | First user-facing referral code live (₹5/₹5 incentive) | F | ₹0 | Code-generation tested |
| 36 | Hire freelance video editor for 2 Reels/week starting W5 | F | ₹4-8K/Reel | Person hired, brief sent |
| 37 | First Intel Agent Sunday report read + first action item taken | F | ₹0 | Action item logged |
| 38 | Apply for Flipkart, Amazon Associates India, Meesho Affiliate programs | F | ₹0 | Applications submitted |
| 39 | First Reels creative goes from creator-organic → repurposed Meta ad | F + Creative Agent | ₹0 (creator already paid) | Ad in Meta library |
| 40 | Weekly KPI review (Friday) — installs, paid conv, refund rate, WA open rate | F + Analytics Agent | ₹0 | Decisions logged |

**Week 4 spend:** ~₹25K. **Output:** S1 motion live, all weekly agents running, first Meta toe in water. Cumulative spend ~₹60K.

## Day 30 milestone check

By the end of Day 30 (~Jun 30) you should have:

| Metric | Target | Stretch |
|---|---|---|
| Cumulative installs | 200 | 400 |
| Paid users (₹19 unlocks) | 30 | 80 |
| ₹99 quarterly subs | 0 | 5 |
| Play Store rating | 4.0+ with ≥10 reviews | 4.3+ with 20+ reviews |
| WhatsApp opt-in | 60%+ | 75%+ |
| Daily analytics digest reliability | 100% delivered | Same |
| Founder weekly OKRs hit | ≥ 70% | ≥ 90% |
| Critical bugs in prod | 0 | 0 |
| NPS (sample of 30+) | 50+ | 65+ |
| Cumulative spend | ₹60-80K | Same |

If the targets miss by >30%, **pause S1 and diagnose for one week before S2.** Don't escalate spend into a leaky funnel.

---

# Appendix — Cited Sources

**India market sizing + Bharat consumer behaviour:**
- [RedSeer — The $3.2Bn Bharat Opportunity](https://redseer.com/articles/the-3-2bn-bharat-opportunity-how-tier-2-cities-are-driving-indias-interactive-media-boom/)
- [RedSeer — Evolving Playbook of India Internet](https://redseer.com/articles/redseers-big-insights-evolving-playbook-of-india-internet/)
- [RedSeer × Peak XV — India's $40Bn BPC Market via IBEF](https://www.ibef.org/news/according-to-a-joint-report-by-redseer-strategy-consultants-and-peak-xv-pure-play-brands-to-drive-india-s-us-30-billion-beauty-and-personal-care-market-opportunity)
- [Storyboard18 / RedSeer — Tier 2+ drives 500M social audience](https://www.storyboard18.com/digital/tier-2-drives-majority-of-indias-500m-social-media-audience-redseer-85627.htm)
- [Afaqs / RedSeer — 70% of 250M SFV users from Tier 2+](https://www.afaqs.com/news/digital/around-70-of-250-million-users-of-indian-short-form-video-platforms-come-from-tier-2-cities-redseer)
- [Truefan — AI video for ShareChat & Moj India 2026](https://www.truefan.ai/blogs/ai-video-sharechat-moj-india-2026)
- [Bain India — How India Shops Online 2026](https://www.bain.com/insights/how-india-shops-online-2026/)
- [Entrepreneur India / Bain — India's Fastest Consumer Growth from Tier 2/3](https://www.entrepreneurindia.com/blog/en/report/indias-fastest-consumer-growth-is-coming-from-tier-2-and-3-cities.57951)
- [TechCrunch — India's app downloads rebounded to 25.5B in 2025](https://techcrunch.com/2026/01/21/indias-app-downloads-rebounded-to-25-5-billion-in-2025-fueled-by-ai-assistants-and-microdrama-boom/)
- [Inc42 — D2C in India's Hinterlands](https://inc42.com/features/d2c-in-indias-hinterlands-how-insurgent-brands-are-fighting-challenges-building-more-opportunities/)
- [Inc42 — Honasa's 2025: More Than Mamaearth](https://inc42.com/features/honasas-2025-becoming-more-than-mamaearth/)

**Sensor Tower + AppsFlyer benchmarks:**
- [Sensor Tower — State of Mobile India 2026](https://sensortower.com/report/state-of-mobile-india-2026)
- [Sensor Tower — Health & Fitness Apps See Surging Revenue Fueled by AI](https://sensortower.com/blog/health-and-fitness-apps-ai)
- [Sensor Tower — 2026 State of Mobile](https://sensortower.com/blog/state-of-mobile-2026)
- [Business Standard / Sensor Tower — India app downloads, spending gap](https://www.business-standard.com/technology/tech-news/india-app-downloads-revenue-gap-sensor-tower-report-126042400618_1.html)
- [AppsFlyer Performance Index](https://www.appsflyer.com/resources/reports/performance-index/)
- [AppsFlyer — Top data trends 2025 → 2026](https://www.appsflyer.com/resources/reports/top-5-data-trends-report/)
- [Business of Apps — Health & Fitness App Benchmarks 2026](https://www.businessofapps.com/data/health-fitness-app-benchmarks/)

**Meta Ads / CAC / D2C beauty:**
- [Meta Ads Cost India 2026 — MyProHub](https://myprohub.in/meta-ads-cost-in-india-2026-complete-pricing-breakdown/)
- [GUROB — App Install Cost India by Vertical 2026](https://gurob.in/blog-app-install-cost-india-vertical)
- [Business of Apps — CPI Rates 2025](https://www.businessofapps.com/ads/cpi/research/cost-per-install/)
- [Vmobify — Meta App Install Campaigns 2026 Guide](https://vmobify.com/blog/meta-app-install-campaigns/)
- [Distk — Reduce CAC Meta CPM Rising Survival Guide 2026](https://distk.in/blog/reduce-cac-meta-cpm-rising-survival-guide-2026.html)
- [Tenten — D2C CAC Benchmarks 2026](https://tenten.co/shopify/d2c-cac-benchmarks-2026/)
- [Razorpay — D2C CAC Guide](https://razorpay.com/learn/customer-acquisition-cost/)
- [AIMN Launch — D2C 2026 Playbook](https://aimnlaunch.com/how-to-launch-a-d2c-brand-in-india-in-2026-the-complete-playbook-from-zero-to-rs-10l-month/)
- [Growww Tech — State of Indian D2C 2026](https://cms.growwwtech.com/state-of-indian-d2c-2026-industry-report/)

**Influencer rates:**
- [CreatorIQ — Instagram Influencer Rates India 2026](https://creatoriq.in/rates/india-guide)
- [Jigsaw Kraft — Influencer Marketing Cost India 2026](https://www.jigsawkraft.com/post/influencer-marketing-cost-in-india-complete-2026-pricing-guide)
- [upGrowth — Influencer Marketing Pricing India 2026](https://upgrowth.in/influencer-marketing-pricing-india-2026/)
- [Influencer Marketing Hub — Nano Influencer Rates 2026](https://influencermarketinghub.com/nano-influencer-rates/)
- [Business Standard — Meesho Creator Marketplace 2025](https://www.business-standard.com/companies/start-ups/meesho-launches-creator-marketplace-to-ramp-up-influencer-driven-traffic-125021900823_1.html)
- [BuzzInContent — Meesho 21,000 influencers](https://www.buzzincontent.com/news/meesho-collaborates-with-21000-influencers-through-its-creator-marketplace-8736125)

**Play Store ASO + regional language:**
- [Apptweak — How to Localise Your App for India](https://www.apptweak.com/en/aso-blog/how-to-localize-your-app-in-india)
- [NgenDevTech — ASO Strategies That Work in India](https://ngendevtech.com/blog/app-store-optimization-strategies-that-actually-work-in-india/)
- [iBabbleOn — Play Store Language Codes](https://www.ibabbleon.com/Google-Play-Store-Language-Codes.html)
- [BW Businessworld — Apple App Store Adds 10 Indian Languages March 2026](https://www.businessworld.in/article/apple-app-store-adds-10-indian-languages-in-massive-update-600616)
- [LS Digital — Vernacular SEO Tier 2/3](https://www.lsdigital.com/blog/vernacular-seo-the-key-to-tapping-into-indias-tier-2-and-tier-3-markets/)
- [upGrowth — Regional Language AI Search India 2026](https://upgrowth.in/regional-language-ai-search-india-2026/)

**Play Store policy (AI apps):**
- [App Design Glory — Google Warns AI Apps May Be Removed Play Store 2026](https://www.appdesignglory.com/blogs/google-warns-ai-generated-apps-may-be-removed-from-play-store-in-2026/)
- [Google Play Console Help — AI-Generated Content Policy](https://support.google.com/googleplay/android-developer/answer/14094294)
- [Biometric Update — Google Age Assurance Play Store Oct 2025](https://www.biometricupdate.com/202510/google-begins-rolling-out-age-assurance-in-app-store-in-response-to-us-laws)

**WhatsApp Business API:**
- [AiSensy Pricing](https://aisensy.com/pricing)
- [AiSensy — Best WhatsApp API Providers India 2026](https://m.aisensy.com/blog/whatsapp-api-providers/)
- [Codingclave — WhatsApp API Pricing India 2026 Comparison](https://codingclave.com/guides/whatsapp-api-pricing-india-2026-comparison)
- [Whautomate — WhatsApp Business API Pricing India 2026](https://whautomate.com/whatsapp-business-api-pricing-india)
- [Gallabox — WhatsApp for D2C](https://gallabox.com/blog/whatsapp-for-d2c)
- [Wapikit — Conversational Commerce India 2025](https://www.wapikit.com/blog/conversational-commerce-2025-whatsapp-india-brazil-d2c)

**Payment rails + Razorpay:**
- [Razorpay Payment Gateway Charges 2026 — SoftwareSuggest](https://www.softwaresuggest.com/blog/razorpay-payment-gateway-charges/)
- [Razorpay UPI Autopay vs eNACH](https://razorpay.com/blog/upi-autopay-vs-enach-comparison/)
- [Razorpay & Meesho — Cracking the COD Code for Bharat](https://razorpay.com/blog/cracking-the-cod-code-how-meesho-razorpay-are-solving-payments-for-the-next-billion-bharat-users/)
- [Razorpay Pricing — Aidukan](https://aidukan.in/razorpay-price-india/)
- [Coinlaw — UPI Statistics 2026](https://coinlaw.io/upi-statistics/)
- [Coinlaw — PhonePe Statistics 2025](https://coinlaw.io/phonepe-statistics/)

**Expo / EAS:**
- [Expo Application Services Pricing](https://expo.dev/pricing)
- [Expo Documentation — Subscriptions & Plans](https://docs.expo.dev/billing/plans/)
- [Stallion Tech — Expo EAS Update Pricing](https://www.stalliontech.io/expo-eas-update-pricing)
- [Applighter — Expo EAS Build Cost Calculator 2026](https://www.applighter.com/blog/expo-eas-build-cost-calculator)

**Competitor intel:**
- [Mediainfoline — Nykaa Skin Scan](https://www.mediainfoline.com/advertising/nykaa-launches-skin-scan-an-ai-led-skin-diagnostic-experience)
- [Newsbytes — Nykaa Skin Scan Selfie Skincare](https://www.newsbytesapp.com/news/science/nykaas-new-skin-scan-lets-you-selfie-your-way-to-better-skincare/tldr)
- [eHealth Magazine — Clinikally Clara](https://ehealth.eletsonline.com/2025/05/clinikally-unveils-clara-ai-powered-skin-analysis-tool-set-to-redefine-personalised-skincare-in-india/)
- [Clinikally Clara — Product Page](https://clara.clinikally.com/)
- [Y Combinator — Clara by Clinikally Launch](https://www.ycombinator.com/launches/Ndm-clara-by-clinikally-clinical-grade-skin-analysis-with-ai)

**Referral / viral loops:**
- [ProductGrowth — Referral Program Design for Indian Markets](https://productgrowth.in/insights/consumer/referral-programs/)
- [Adapty — Mobile App Referral Program Launch](https://adapty.io/blog/mobile-app-referral-program/)
- [Tapp — Engineer's Guide to Viral Loops for Mobile Apps](https://www.tapp.so/guide-viral-loops-mobile-apps/)

**KuKu FM + Meesho (Tier 2/3 case studies):**
- [GrowthX — KuKu FM Business Model Deep Dive](https://growthx.club/blog/kukufm-business-model)
- [The Hard Copy — How KuKu FM Got Non-English-Speaking India to Pay](https://thehardcopy.co/how-kuku-fm-got-non-english-speaking-india-to-pay-for-subscription/)
- [Inc42 — KuKu FM 2.5M Paid Subs, $25M Raise](https://inc42.com/buzz/after-2-5-mn-paid-subscribers-kuku-fm-25-mn-fuel-expansion/)
- [The Hot Startups — Meesho's Tier 2/3 Strategy](https://www.thehotstartups.com/p/meesho-s-business-strategy-building-india-s-e-commerce-giant-for-tier-2-3-cities)
- [Arthnova — How Meesho Built a ₹9,390 Cr Empire](https://arthnova.com/meesho-social-commerce-tier-2-3-cities-9390-crore-empire/)

**Sibling docs:**
- `docs/payments-and-paywall-report.md`
- `docs/audience-fit-tier2-tier3.md`
- `docs/analytics-tracking-plan.md`
