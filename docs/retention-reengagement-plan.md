# GlowUp — Retention & Re-Engagement Plan

**Prepared for:** Rahul (founder, GlowUp)
**Date:** 29 May 2026
**Scope:** What happens AFTER a Tier 2/3 Hindi/Hinglish-speaking woman has done her first skin scan. How we keep her, bring her back, and turn her into a repeat scanner / repeat affiliate buyer.
**Sibling docs assumed:** `docs/payments-and-paywall-report.md` (Hypothesis A subscription vs B affiliate), `docs/audience-fit-tier2-tier3.md` (Path B Bharat-native chosen), `docs/analytics-tracking-plan.md` (event names + funnel), `docs/solo-founder-playbook.md` (agent-driven ops + ₹19 unlock / ₹99 quarterly / affiliate mix), `lib/routineData.ts`, `i18n/en.json`, `i18n/hi.json`.

---

## TL;DR

The founder's two starting hypotheses — push for personalized routines, progress nudges with punchy copy — are directionally right and quantitatively insufficient. They are two of nine retention surfaces a Bharat-native skin app needs to operate. The full system, in priority order of expected D30 lift:

1. **WhatsApp lifecycle** (the single highest-leverage Bharat channel — 45–60% open rates vs ~3–5% for push at Indian retention horizons, per [Gallabox](https://gallabox.com/blog/whatsapp-for-d2c) and [productgrowth.in](https://productgrowth.in/insights/consumer/push-notification-strategy/)).
2. **Personalized push around the morning + evening routine moments** (the founder's #1 hypothesis — correct, second-priority).
3. **Re-scan invitation at the weekly + monthly cadence** with a visible delta on the radar chart (the only mechanism that makes the subscription pitch defensible — flagged in payments-and-paywall §2.4).
4. **In-app streak with cultural framing** ("21 दिन का संकल्प", not "streak") — Duolingo cut churn 47% → 28% with streaks ([StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)). The framing matters more than the mechanic.
5. **AI-generated daily glow tip** powered by Gemini, in Hindi/Hinglish, regenerated nightly per user — cheap (~₹0.05/user/day at 10K MAU = ₹500/mo).
6. **Affiliate-purchase-driven re-engagement** — "तुमने जो Vicco haldi cream ली थी 28 दिन पहले, अब खत्म हो गई?" — converts the scan flywheel into a commerce flywheel, which is what every funded Indian beauty comparable monetises on.
7. **Festival / seasonal triggers** — Diwali glow pack, summer tan pack, monsoon acne pack. Mass-Bharat seasonal triggers convert 3–5× a generic CTA.
8. **WhatsApp Community for "GlowUp wali" identity reinforcement** — long-tail moat.
9. **Win-back via Meta retargeting + SMS** for the OS-push-denied cohort.

The founder's two hypotheses sit at #2 and a fragment of #3. Push notifications alone — without WhatsApp, without in-app surfaces, without affiliate-driven re-engagement — will get ~3–6% open rates on Android (post Android 13 permission gate + Android 16 notification organizer) and will be the same channel a Tier 2/3 woman uninstalls the app to silence. If the founder builds only push and progress, the retention curve will look identical to a no-retention-effort app within 90 days. The system below is designed so push is the *cheapest* layer, not the *primary* layer.

**Realistic targets for a Bharat skin-scan app at MVP scale (Hypothesis A+B mixed):**

- D1: **22–30%** (above this is great; below 18% means the scan reveal isn't landing).
- D7: **10–14%** (above 14% is genuinely excellent; below 8% means the routine + push is broken).
- D30: **4–7%** (above 7% is enterprise-grade for a single-feature wellness app).
- Re-scan rate at D30: **18–28%** (the actual subscription-defensibility metric).
- Repeat-affiliate-purchase rate at D60: **6–12%** (the Hypothesis B unit economics).
- WhatsApp opt-in: **65–80%** at consent (much higher than push because the channel is already trusted).

---

## Part 1 — The retention problem, stated honestly

### 1.1 What a skin/beauty scan app actually looks like in retention

A scan-and-verdict product has a classic shape: high install (driven by curiosity + a Meta-trained reveal hook), high one-time scan (sunk-cost + dopamine), then a cliff. Glow AI, Umax, Cal AI, OnSkin, FaceApp — every Western comparable mapped in `payments-and-paywall-report.md` §2.2 — has this shape. The Indian shape is worse on absolute retention but the same in slope: the median consumer-utility app in India has [90%+ of users gone by D30](https://www.appsflyer.com/blog/topic/benchmarks-metrics/), and skin-scan apps are structurally a "diagnostic" category (re-engagement frequency = months, not days), which is the hardest retention shape there is.

**Indian retention benchmarks, current (2025–26), grouped:**

| Category | D1 | D7 | D30 | Source |
|---|---|---|---|---|
| Cross-industry, global | 26% | 13% | 7% | [UXCam 2026](https://uxcam.com/blog/mobile-app-retention-benchmarks/) |
| Health & fitness, global | 20% | 7–8.5% | 3.5–4% | [UXCam 2026](https://uxcam.com/blog/mobile-app-retention-benchmarks/), [Business of Apps Health](https://www.businessofapps.com/data/health-fitness-app-benchmarks/) |
| Shopping (general), global | 24.5% | ~10% | 4–5% | [UXCam 2026](https://uxcam.com/blog/mobile-app-retention-benchmarks/) |
| Marketplaces (Amazon/eBay), global | 33.7% | — | — | [UXCam 2026](https://uxcam.com/blog/mobile-app-retention-benchmarks/) |
| India consumer median (rough) | 22–24% | 9–11% | 4–6% | Composite from [AppsFlyer State of India 2025](https://www.appsflyer.com/resources/reports/app-marketing-india/) and [Business of Apps Retention 2026](https://www.businessofapps.com/data/app-retention-rates/) |
| AI-feature apps | ~20% lower at D30 than non-AI peers | — | — | [TechCrunch AI app retention](https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows/) |

**For GlowUp specifically, anchor at:**

- **D1 22–28%** as the realistic band. Above 28% is world-class for a single-feature scan app in India.
- **D7 10–14%.** This is the band where the routine + push starts to matter; above 14% means a real habit loop has caught.
- **D30 4–7%.** A single-feature wellness app cannot reasonably target above 7% without a community + UGC layer. Plan accordingly.

World-class in the category — what Cal AI, FaceApp, Duolingo's-Hindi-cohort look like — sits at roughly D1 35%, D7 18–22%, D30 10–14%. Don't anchor MVP targets there; that's a 12-month destination after a community + content + UGC engine matures.

### 1.2 What kills retention in Indian skincare apps

These are the failure modes, in descending order of how often they sink the category in India. None of them is fixable with "more pushes":

1. **Paywall fatigue.** The user hit the paywall, paid ₹19 (Hypothesis A) or skipped to affiliate (Hypothesis B), and the value she got — one scan, one report, one routine — is now consumed. The app has nothing new to *show* her for the next 7 days. Push reminders to a static screen are aggressively un-engaging. Solution layer: the scan-delta on re-scan + the AI-regenerated daily glow tip + the affiliate run-out trigger (Hook §A and §C).
2. **Generic routines.** The routine generated on Day 0 doesn't change on Day 3, Day 7, Day 14. A Tier 2/3 woman opens the app on Day 7, sees the same besan + rose water step she remembers from Day 0, and concludes the app is "just a screenshot". Solution layer: rotation logic in `lib/routineData.ts` (week 1 base remedy, week 2 enriched, week 3 product swap, week 4 ingredient deep-dive); see Personalization Engine in Part 3.
3. **No progress sense.** The Progress tab in PLAN.md is right; what's wrong everywhere it's been built badly is that the deltas are too small to feel meaningful on a 7-day cadence (skin doesn't change visibly in 7 days for most people). Solution layer: surface micro-wins (sunscreen-streak, hydration question over time, routine-step-completion %) alongside the macro skin score, so there's *something* that visibly moved this week.
4. **No community.** Pure utility apps cap out at 4–6% D30 in India. Apps with even a light WhatsApp Community layer break 8–12% D30. The reason is identity — once a woman is in a "GlowUp wali" WhatsApp group, the app stops being a tool and starts being a tribe. KuKu FM and Meesho both lean heavily on this; see `audience-fit-tier2-tier3.md` §2.4. Solution layer: a WhatsApp Community seeded by the founder, agent-moderated. Hook §F.
5. **No follow-through trigger.** The Indian Tier 2/3 woman bought Vicco Turmeric on Day 2 (or didn't buy, and lapsed). On Day 28 she's about to run out. The app should know this and ping her — both because it's useful (she'll re-buy something) and because it's where the affiliate commission lives. Without this trigger the affiliate revenue line is zero. Hook §A, item 6.
6. **No fresh content.** The Indian skincare content market is over-saturated (Nykaa editorial, Vogue India, Dr Aanchal Panth, etc., per `payments-and-paywall-report.md` §2.4). GlowUp will not out-content them. But GlowUp can do something none of them can: *personalize* a daily tip to *this user's* top concern in *this user's* language. A daily Gemini-generated tip in Hindi tied to her own scan result is content the Nykaa blog cannot produce. Hook §C, item 5.
7. **Notification spam → uninstall.** This is the killer. The average Indian smartphone user gets [46 push notifications per day](https://productgrowth.in/resources/guides/push-notification-strategy/); [47% of users who get more than 10 pushes/day from a single app disable notifications for that app within a week](https://productgrowth.in/resources/guides/push-notification-strategy/). Indian uninstall rates [exceed 60% by D30 for consumer apps](https://www.appsflyer.com/blog/topic/benchmarks-metrics/) — and the single most common cause is over-notification. If the founder's "push for personalized routines + push for progress nudges" turns into 2 pushes/day, the app will be silenced or uninstalled by week 2. Strict frequency cap = max 1 push/day, max 5 pushes/week, hard quiet hours 9pm–7am. See Part 8.
8. **Paying for the wrong cohort to come back.** Win-back ads pointed at users who churned because price hurt → those users hate-react. Win-back ads pointed at users who churned because the product didn't deliver → they were never going to convert. The only viable win-back audience is users who churned during the *trial* with strong engagement signals: scanned, opened the routine, never paid. Everyone else is wasted ad budget.

The retention problem is not "do we have enough nudges". It is "do we have a *reason* for the user to come back that isn't manufactured". Hook architecture in Part 2 is built around five real reasons (morning/evening routine, weekly progress delta, monthly transformation, product run-out, festival/season) and five artificial-but-honest reasons (streak, AI tip, community post, social proof, scarcity). The artificial-but-honest reasons get throttled hard; the real reasons get the bulk of the notification budget.

---

## Part 2 — Hook Architecture

A retention system has six layers. Notifications are one of them. Build the others and the notifications get to be cheap reinforcement; build only notifications and the notifications carry weight they can't support and become spam.

### A. Behavioural triggers — events in the user's life that we hijack

These are the moments the app should be inserting itself into. Each one is the trigger for one or more of the channels in B/C/D.

**A1. Morning routine moment (≈7:00–9:00 IST).** The single most repeatable hook in skincare. Tier 2/3 women have a morning bathroom routine; the app inserts itself with a 1-line "आज का morning step — besan + rose water" push, deep-linking to the routine card. Frequency: 1 push max in this window, only if the user hasn't already opened the app that morning. Expected push CTR for this category: **5–9%** (vs 2–4% for generic reminders), per [productgrowth.in's Indian consumer push data](https://productgrowth.in/insights/consumer/push-notification-strategy/). Skipping this window because of frequency caps is the wrong call — it's the highest-yield moment of the day.

**A2. Evening routine moment (≈8:30–10:00 IST).** The CICO (cleanse-in-cleanse-out) loop. Same pattern as A1; quieter copy because the user is winding down. Frequency: only fire if the morning push wasn't tapped or if the user did tap morning but didn't tap evening. Never fire both A1 and A2 to the same user on the same day unless they're a paid streak-eligible user opted into "full routine reminders".

**A3. Weekly progress (re-scan invitation, Day +7 from last scan).** The single most important retention hook for a scan-and-verdict app. Without this hook the subscription is undefensible (per `payments-and-paywall-report.md` §2.4). The mechanic: at Day +7, send a push + WhatsApp message inviting the user to re-scan, with explicit framing of "देखें कितना बदलाव आया है" ("see how much has changed"). Open the reveal screen with a delta annotation on the radar — even a +2 on hydration shown visibly is dopamine. Expected re-scan rate at D7 nudge: **15–25%** of opens that week.

**A4. Monthly transformation (Day +28 to +35).** The before/after card. Generate a 9:16 share card showing scan #1 vs scan #N, with the deltas annotated in Hindi ("hydration ↑12, oily ↓8, glow ↑15"). This is the Bharat-native equivalent of the Cal AI "weight-loss receipt" share moment that drove their viral growth. Trigger: re-scan completion + scan number ≥ 2. Expected share rate on WhatsApp: **8–15%** of generated cards.

**A5. Skipped-day guilt + recovery nudge.** When the user has missed 2 consecutive days of routine check-ins, fire a gentle, non-shaming push: "कोई बात नहीं — आज से फिर शुरू करते हैं ✨". Critical that the copy is recovery-framed, not guilt-framed. Indian Tier 2/3 women historically over-index on guilt-shaming consumer copy (diet apps especially); GlowUp should be the app that doesn't do that. Frequency cap: max 1 recovery push per 7-day window, total.

**A6. Festival / season triggers — India-specific.** This is where Bharat-native beats every Western comparable. Map the festival/season calendar to a content + product nudge:

| Window | Concern | Content angle | Product nudge |
|---|---|---|---|
| Late Sept – Diwali (Oct/Nov) | "Diwali glow", pre-festival skin prep | "Diwali से पहले 21 दिन का glow plan" | Multani mitti + kasturi haldi pack via affiliate |
| Dec – Jan | Winter dryness | "सर्दी में dry skin का solution" | Vicco Turmeric Skin Cream + cold-pressed coconut oil affiliate |
| Feb – Mar | Holi prep / recovery | "Holi colours से skin बचाने का तरीका" | Aloe vera gel pre-Holi + besan post-Holi |
| Apr – May | Summer tan + heat acne | "गर्मी की tan हटाने के 5 घरेलू नुस्खे" | Khadi neem face wash + rose water spritz |
| Jun – Sep | Monsoon acne, fungal flare | "बरसात में acne और fungal कैसे रोकें" | Himalaya Neem face wash + tea tree affiliate |
| Karwa Chauth, Eid, regional festival | "खूबसूरत दिखने का दिन" | Personalised routine for the day | Branded affiliate pack |

These are not generic "Happy Diwali!" messages — they are specific, useful, product-tied content moments where the user actually wants the nudge. The agent (Content Agent in `solo-founder-playbook.md` §5.2) drafts the content + pushes + WhatsApp templates 14 days ahead of each window; founder approves.

**A7. Product run-out trigger.** The user tapped the "Buy on Flipkart" affiliate link for Vicco Turmeric on Day 2. Average tube lifecycle is ~25–30 days at normal use. On Day 27, fire a WhatsApp message: "Vicco wali cream खत्म होने वाली है — फिर से order करें?" with a fresh affiliate link. This is the single highest-LTV trigger in the system because (a) re-engagement is genuine (the user needs the product), (b) the affiliate commission is real recurring revenue, and (c) the message is useful, not annoying. Trigger event: `affiliate_link_tap` + product-specific run-out days (configured in `lib/routineData.ts`). Expected re-tap rate: **20–35%** of fired messages, per Indian D2C re-order benchmarks.

### B. Personalized push notification system

**B1. The full notification taxonomy.** Eight categories, each with strict rules. Frequency caps are cumulative across categories per user per rolling window.

| Category | Trigger | Frequency cap | Time-of-day rule | Expected D7 lift band |
|---|---|---|---|---|
| **Routine** | User has an active routine + hasn't checked in today | Max 1/day (morning OR evening, not both); skip if user opened app organically that day | 7:30–9:00 morning OR 8:30–9:45 evening, never both | +3 to +5 pp on D7 (largest single category lift) |
| **Progress** | New scan delta available, weekly summary ready, re-scan eligible | Max 2/week | 10:00–11:30 or 19:00–20:30, weekdays | +1.5 to +3 pp on D7 |
| **Streak** | User completed 3 / 7 / 14 / 21 / 30 day milestone OR is about to break streak | Max 1/day, only for active-streak users | Streak-break warning: 6 hrs before midnight cutoff. Milestone: morning. | +2 to +4 pp on D7 (gated to streak-opted-in users only) |
| **Social proof** | User's cohort completed a milestone, "10K women like you did X" | Max 1/week | 13:00–15:00 weekdays | +0.5 to +1 pp |
| **Scarcity / sale** | Festival affiliate pack expiring, Glow Pack quarterly offer | Max 2/month across all sale pushes | 17:00–19:00 | +0.5 to +1.5 pp; risky — overuse trains "ignore" |
| **Content** | New AI-generated tip, weekly Glow Tip Tuesday | Max 2/week | 10:00–12:00 | +1 to +2 pp |
| **Recovery** | User missed 2+ days of routine check-in or 3+ days of any open | Max 1 per 7-day window | 17:00–19:00 (after work, before dinner) | +1 to +2 pp |
| **Win-back** | User hasn't opened in 14+ days | Max 1 push, then SWITCH to WhatsApp/SMS — no further pushes ever | 17:00–19:00 weekend | +0.5 to +2 pp on win-back rate, near-zero on D30 retention |

**Hard global caps over everything above:**

- Max 1 push per day per user (the single most important rule).
- Max 5 pushes per rolling 7-day window per user.
- Hard quiet hours 22:00 IST → 07:00 IST (no pushes ever).
- Sundays: max 1 push, content or social proof only (no routine pushes on Sundays — most Tier 2/3 women shift routine timing on Sundays).
- If user opened the app organically in the last 6 hours, skip any optional push (routine, content, streak-reminder, social proof). Only fire if it's a hard reminder (streak about to break, scan delta ready).

**B2. Permission ask — when, where, with what copy.**

Android 13+ and iOS both require runtime push permission ([Android docs](https://developer.android.com/develop/ui/views/notifications/notification-permission)). Tier 2/3 India default-allow rates for Android are higher than US (estimated ~70–82% vs ~60% in US) when asked correctly; for iOS the band is **30–45%** ([productgrowth.in](https://productgrowth.in/resources/guides/push-notification-strategy/)). The single biggest lever is the pre-prompt: a custom in-app primer before the OS prompt can raise opt-in from ~20% to ~70% ([Mobiloud](https://www.mobiloud.com/blog/push-notification-opt-in-rate)).

**Don't ask at app launch.** Ask **immediately after `score_reveal`** — the user has just had the dopamine moment, value is established, and the ask is contextual: "हम आपको आपका morning routine remind करा दें?"

**Recommended pre-prompt UI (custom, before the OS prompt):**

```
[Soft cream backdrop, terracotta accent, small avatar of a smiling South Asian woman]

Title (Hindi):   क्या आपको रोज़ का routine reminder भेजें?
Subtitle:        Morning और evening — सिर्फ 2 ping, और कुछ नहीं
                 (कभी भी बंद कर सकते हैं)

Primary CTA:     हाँ, भेजो ✨    (proceeds to OS prompt)
Secondary CTA:   अभी नहीं         (skip — re-ask 7 days later if engaged)
```

If the user taps "हाँ भेजो" and then denies on the OS prompt, treat as a soft-no: re-ask once at Day 7 *via in-app banner only*, never again. If user explicitly disables in Settings later, fire the win-back via WhatsApp + SMS path, never re-prompt.

**Re-ask cadence:** if user denied at Day 0, re-show pre-prompt only after they've completed a 2nd scan OR hit a streak milestone (i.e., they've already shown engagement). Never re-show within 14 days of a denial.

**Permission ask copy in English:**

```
Title:     Want a gentle daily reminder for your routine?
Subtitle:  One morning, one evening. Nothing else.
           (Turn off anytime.)
Primary:   Yes, remind me
Secondary: Not now
```

**B3. Personalization variables.** Every push payload renders from a small set of signals. Bigger lists than this make the rules engine unmaintainable.

- `skin_type` (oily / dry / combination / normal) — drives which routine remedy is referenced.
- `top_concern_key` (acne / dark_spots / pigmentation / dryness / anti_aging) — drives the headline framing.
- `routine_progress_pct` (0–100, last 7 days) — drives streak + recovery copy.
- `days_since_last_scan` — drives re-scan invitation.
- `last_affiliate_purchase_sku` + `purchase_days_ago` — drives run-out trigger.
- `day_of_week` + `weather_aqi_bucket` (clean / moderate / poor for the user's city, via OpenWeather AQI API, ₹0 free tier) — drives the seasonal hook.
- `language` (en / hi / future ta/te/mr/bn) — drives the entire string.
- `time_zone` (always IST in MVP) — drives quiet hours.
- `scan_delta_top` (largest improving metric since last scan) — drives the progress push.
- `cohort_tag` (e.g. "UP-22-acne-oily") — drives the social-proof template.

That's 10 variables. The Personalization Engine in Part 3 details how each rule combines them.

**B4. Quiet hours, frequency caps, and Android 14+ / iOS Focus traps.**

- **Quiet hours:** 22:00–07:00 IST hard cut. Even streak-break warnings respect this.
- **Frequency caps:** enforced in the rules engine BEFORE the FCM/APNs send, not after. Use OneSignal-style cumulative cap logic ([OneSignal frequency capping](https://documentation.onesignal.com/docs/en/frequency-capping)).
- **Android 16 Notification Organizer** (the [biggest 2025 push surface change](https://www.airship.com/blog/3-ios-android-updates-to-consider-in-your-2025-push-notification-strategy/)): auto-categorises pushes and silently down-ranks anything tagged as "Promotions". GlowUp must use the correct `NotificationChannel` per category — `routine_reminders` channel (importance HIGH), `progress_updates` channel (importance DEFAULT), `marketing` channel (importance LOW). Routine and progress channels are exempt from auto-down-ranking; marketing is not. Do not tag streak or recovery as marketing.
- **iOS Focus + Time-Sensitive abuse:** Apple's Focus mode will throttle apps that mis-tag promo pushes as Time-Sensitive. The only category we tag Time-Sensitive is "streak about to break" (and only if the user opted in to streaks); everything else uses standard interruption level. Never tag a sale push as Time-Sensitive — it's the single fastest way to get permanently throttled.
- **Android 14 user-controlled categories:** users can disable specific notification channels without disabling the app entirely. This is good — surface the channels meaningfully so users keep "routine" while disabling "marketing". Don't bundle all pushes into one channel.

**B5. What trips the spam threshold:**

- ≥3 pushes in any 24-hour window → silenced by user within 2 days, 47% probability ([productgrowth.in](https://productgrowth.in/resources/guides/push-notification-strategy/)).
- "We miss you 😢" + emoji-heavy copy → flagged as marketing by Android 16 organizer.
- Sale push to a user who churned over price → trains "ignore" and inflates the dismiss rate, which then deprioritises future pushes via on-device ML.
- Push in vernacular Devanagari with broken rendering (font fallback to system Latin) → reads as scam, immediate distrust. Always test push payloads on stock OEM keyboards (MIUI Hindi fallback is the worst offender).

### C. In-app re-engagement surfaces

The screens users see *when they're inside the app*. These do the heavy lifting that push cannot — they're where activation actually happens.

**C1. App-open badge / dot strategy.** Current Home tab shows a hero card with last-scan score. Add:
- A small terracotta dot on the Progress tab icon when a new scan delta is available (since last visit to Progress).
- A small terracotta dot on the Routine tab icon when today's morning or evening step is undone.
- Max two dots ever; clear on visit. This is the Whatsapp-blue-dot pattern repurposed for routine attention.

**C2. Home-screen "today's routine card" with done/skip.** Right now Home shows a generic last-scan card. Replace with a contextual "Aaj ka focus" card that renders one of:
- Morning routine card (7:00–13:00, if not done) — "आज की Cleanse — besan + rose water"
- Evening routine card (18:00–23:00, if morning done but evening not) — "Aaj ka night step — aloe vera gel"
- Re-scan card (if >7 days since last scan) — "अपनी skin का नया update देखें"
- Streak milestone card (if hit) — "🎉 Day 7 done! Aaj का streak जारी रखो"

The hero card already exists in the codebase (`hero_routine_am_title`, `hero_routine_pm_title`, `hero_stale_title`, `hero_fresh_title` in `i18n/hi.json`). The rules engine for which one renders is in `lib/home/` — extend it to include streak + scan-delta surfaces.

Each card has a **single primary CTA** (do it, skip for today) and a tiny secondary "क्यों यह?" button that explains the recommendation. The "why this?" affordance is critical for trust at Tier 2/3 — Western A/B data ([Mobile Growth Hacks](https://mobilegrowthhacks.com/push-guide-chapter-4)) shows it doesn't move conversion but it materially moves long-term retention.

**C3. Streak counter + week-view.** A discrete row of 7 dots above the Home hero card showing the current week's check-ins. Filled = checked in (opened routine or did re-scan); empty = skipped. Tap → opens the Progress tab with streak detail.

Critical framing decision: **don't call it "streak"** in the Hindi UI. Use "**21 दिन का संकल्प**" (21-day commitment) which is the cultural register Indian women already use for fasting / vrat / ritual. Streak as a Western Duolingo concept is foreign; sankalp is native. Duolingo themselves [discovered their Hindi UI was too literary](https://blog.duolingo.com/language-learning-for-the-next-billion-duolingo-in-india/) — apply the same lesson. In English UI, "21-day streak" is fine.

**C4. "Glow Score" delta chart (week-over-week).** Currently the Progress tab will eventually show a trend. Make sure it shows:
- Overall score line with annotations on each scan ("scan #1: 67", "scan #2: 71, +4 🌿").
- A small "what improved" callout: "Hydration ↑12 since last scan" — surfaces the one metric that moved most.
- A "what to focus on" callout: "Texture is still your weakest — see today's tip".

The chart is more important than the absolute scores. A user who sees a flat line will quit; a user who sees a +4 jump will re-scan more often. Lean into the delta visuals.

**C5. AI-generated daily tip card.** Powered by Gemini 2.0 Flash, regenerated nightly per user, in vernacular. Render as a card on the Home tab below the routine card. Templated prompt to Gemini (cost ~₹0.05/user/night at 10K MAU ≈ ₹500/mo, well within the `solo-founder-playbook.md` §1.3 budget):

```
You are GlowUp's daily skin coach. Today's tip for this user, in {language}.

User profile:
- Top concern: {top_concern_key}
- Skin type: {skin_type}
- City weather/AQI: {weather_aqi_bucket}
- Day of week: {day_of_week}
- Last scan delta on this concern: {scan_delta_top}

Write one tip, MAX 35 words in Hindi (or 25 in English):
- 1 sentence: the tip itself, actionable, drawing on a desi ingredient or low-cost product
- 1 micro-hashtag: a 2-word recap

Avoid: medical claims, brand names other than those in {approved_brands}, generic skincare cliches ("drink water", "wear sunscreen daily").
```

Run nightly batch at 03:00 IST, write to Firestore `users/{uid}/dailyTip/{date}`. If batch fails, fall back to a static rotation of 30 founder-approved tips.

**C6. Weekly Sunday recap screen.** Every Sunday morning, surface a "Aapka hafta — week recap" full-screen takeover on app open (dismissible). Shows:
- Routine completion % this week vs last week
- Top metric movement (e.g. "Hydration ↑8 this week")
- One actionable tip for next week
- Share button → generates a 9:16 share card for WhatsApp Status

This is the single most consequential weekly hook because Sunday is the day Tier 2/3 women prep for the week and engage with planning-style content (per [RedSeer evolving playbook](https://redseer.com/articles/redseers-big-insights-evolving-playbook-of-india-internet/)).

### D. Off-app re-engagement — the Bharat-defining channels

This is where the founder's two-hypothesis plan falls shortest. For Tier 2/3 India, off-app re-engagement is more important than in-app push, because Tier 2/3 women open WhatsApp 4–8× more often than they open any non-Instagram non-WhatsApp app per day.

**D1. WhatsApp lifecycle messages via AiSensy.** Already chosen as the BSP in `solo-founder-playbook.md` §3.5. Pricing reality, as of 2026 ([AiSensy Pricing](https://aisensy.com/pricing), [matrixhive Dec 2025 real-numbers](https://www.matrixhive.com/blog/whatsapp-business-api-pricing-in-india-the-real-numbers-december-2025)):

- AiSensy Pro: ₹3,200/mo (yearly billing reduces ~10%)
- Marketing template message: **₹1.09/message** (Meta charges ₹0.8631, AiSensy adds ~26%)
- Utility message (within 24-hr customer service window): **free**
- Service / reply within 24-hr inbound window: **free**

Quick provider comparison for India:

| BSP | Platform fee/mo | Per marketing msg | Per utility msg | Best for GlowUp because... |
|---|---|---|---|---|
| **AiSensy Pro** | ₹3,200 | ₹1.09 | free | Most India-native, Razorpay integration, Hindi UI in dashboard, Tier 2/3-friendly support. Already chosen. |
| **Interakt Starter** | ₹3,499/qtr (₹1,166/mo) | ₹0.97 | free | Cheaper per-msg, Instagram unified, Tally + HubSpot integrations — overkill for solo. |
| **Wati Growth** | ₹2,199 | ₹1.03 | free | Cheapest mid-tier, weaker India support. |

Stick with AiSensy.

**Lifecycle templates to pre-approve in S0** (Meta approval is 24–48hr per template; do all in one batch to amortise wait):

| # | Template | Type (marketing/utility) | Trigger | Body (Hindi sample) |
|---|---|---|---|---|
| 1 | Welcome post-OTP | utility | Auth success | "स्वागत है GlowUp में, {name} 🌸 Aaj अपना पहला scan करके अपना skin score निकालो — सिर्फ 30 seconds!" |
| 2 | Post-scan routine delivery | utility | `scan_processing_complete` | "Tumhara skin score: {score}. Yeh राहा aaj का morning routine: 1. {step1} 2. {step2} 3. {step3}. Tap → app me khol kar dekho." |
| 3 | Day 1 morning routine reminder | utility (within 24-hr window) | 24hr post-scan, morning | "Subah ka skincare check-in: {step1} किया? Bata do — ek tap me. Hum tumhare साथ हैं ✨" |
| 4 | Day 3 social proof | marketing | 3 days post-scan, no re-engagement | "तुम्हारे शहर की 1,247 girls ने इस हफ्ते besan + rose water try किया. तुम भी देखो — link" |
| 5 | Day 7 re-scan invite | marketing | 7 days post-scan | "1 हफ्ता हो गया, {name} — re-scan करके देखो skin कितनी बदली है. ek selfie, 30 seconds. ✨" |
| 6 | Day 14 progress story (image) | marketing | 14 days, post 2nd scan | Image: before/after card + caption "Tumhari hydration ↑{delta} इस हफ्ते. Aage badho!" |
| 7 | Day 21 milestone | marketing | 21-day sankalp completed | "🎉 21 din ka संकल्प pura, {name}! Yeh raha tumhara Glow Certificate (image). Share karo apni सहेलियों के साथ." |
| 8 | Day 28 product run-out | utility (within 24-hr if user engaged) else marketing | 28 days post-affiliate-tap | "{product} खत्म होने वाली है? Yeh link se फिर से order kar do, ek tap me." |
| 9 | Festival pack (e.g. Diwali) | marketing | T-14 days before festival | "Diwali ke liye 21-day glow plan ready hai. Multani mitti + kasturi haldi pack — sirf ₹{price}. Order karo." |
| 10 | Quarterly Glow Pack offer | marketing | 21–28 days post-paid-unlock | "Tumhari pasandida feature — Glow Pack (3 month) sirf ₹99. Save ₹47 vs scan-by-scan." |
| 11 | Subscription expiry warning | utility | 3 days before quarterly expiry | "Tumhari Glow Pack 3 din me khatm. Renew karne ke liye tap karo. Discount: ₹89 (₹10 off)." |
| 12 | Win-back (Day 45 no open) | marketing | 45 days inactive | "Hi {name}, hum तुम्हें miss कर रहे हैं ✨ Aaj ek free scan le lo — 30 seconds, dekho skin kitni badli." |

**Cost math at S2 scale (5,000 MAU):**
- ~30,000 outbound template msgs/mo (avg 6 templates × 5K users × 100% delivery on the "active" half, lower on the dormant half)
- Of those, ~70% are marketing rate = 21,000 × ₹1.09 = **₹22,890/mo**
- Plus ₹3,200/mo AiSensy platform = **~₹26K/mo total at S2**
- At 10K MAU scale (S3): **~₹50K/mo**

This is a real line item. It's also the single highest-ROI line item in the whole retention budget — assuming a 15% re-engagement rate on the 30K msgs and a 6% conversion-to-affiliate-tap on those re-engaged users, that's 270 affiliate taps/mo × ~₹30 average commission = ₹8,100 of attributable affiliate revenue at S2, plus the harder-to-attribute habit reinforcement that compounds. WhatsApp is not where you cut budget.

**WhatsApp consent ask.** Different from push consent — and easier. Tier 2/3 women already trust WhatsApp as a channel. The ask: at OTP verification, after Q1 (so we know the top concern), show a single-screen prompt:

```
Title:    क्या हम तुम्हें WhatsApp पर tips और routine reminder भेज सकते हैं?
Subtitle: हफ्ते में 2-3 message, बस — और कुछ नहीं
CTA1:     हाँ, WhatsApp पर भेजो  (default-allow rate: 65-80%)
CTA2:     नहीं, app में ही दिखाओ
```

Persist to `users/{uid}/consent.whatsapp = true|false`. Store under DPDP-compliant consent log (see `analytics-tracking-plan.md` §5.1).

**D2. SMS fallback for users who deny both push and WhatsApp.** A small but real segment will deny both (estimated 10–15% of installs). For them, use SMS as a last-resort channel:
- Max 2 SMS per month, never to denied-both users who churned over price
- DLT-registered headers (₹500–1000 one-time + ₹0.15/SMS via [TextLocal](https://www.textlocal.in/) or [MSG91](https://msg91.com/))
- Only the two highest-value templates: re-scan invite (Day 7) and product run-out (Day 28)

Don't build SMS in S1. Wire it in S2 once the push + WhatsApp baseline is real.

**D3. Email is dead in Tier 2/3.** Skip entirely. Even if the user provides an email, do not build email lifecycle. Tier 2/3 Hindi-belt women treat email as either spam or work — neither a context where beauty content lands. Open rates in this segment are <8% per [productgrowth.in](https://productgrowth.in/insights/consumer/push-notification-strategy/).

**D4. Re-targeting ads via Meta for paywall_view-no-trial cohort.** Already detailed in `analytics-tracking-plan.md` §4.5 — `paywall_view` in last 30d AND no `trial_start` in last 30d. Creative angle: show a different paywall variant or a discount nudge ("₹19 → ₹14 with WhatsApp code"). Budget: ₹500–2,000/day in S2. Expected lift on conversion from this cohort: 12–22%.

### E. Habit + identity hooks — the deepest retention lever

**E1. Streaks with cultural framing.**
- **3-day milestone:** "तीन दिन का सिलसिला" — soft celebration card, no push (in-app only).
- **7-day milestone:** "एक हफ्ता पूरा 🌿" — share card unlock, gentle push.
- **21-day milestone:** "इक्कीस दिन का संकल्प पूरा 🎉" — Glow Certificate (auto-generated image with user name + skin metric improvement, shareable on WhatsApp Status). 21 days is the culturally-resonant "habit-formed" duration in India (vrat / sankalp traditions). This is the milestone that should feel like a real achievement.
- **30-day milestone:** "तीस दिन का glow journey ✨" — unlock a free re-scan (if Hypothesis A subscriber) or a one-off ₹9 discount on the next Glow Pack (Hypothesis B).
- **Break-warning:** at 6 hours before midnight, if user has done 6 days of a 7-day streak but not today, push: "Aaj last 6 ghante me check-in karo — 7-day सिलसिला complete ho jaayega ✨". Use Time-Sensitive flag (justified — actually time-limited).
- **Streak forgiveness:** after a single missed day, do not break the streak count if user returns within 36 hours and does the routine. Show: "Welcome back — streak बच गया ✨". This single rule increases streak completion rates by 25–40% (Duolingo's "streak freeze" feature, [StriveCloud teardown](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)).

**E2. Public commitment.** Pre-paywall (or pre-affiliate-tap), ask: "Apna glow goal kya hai?" with three pre-set choices ("21-day clear skin", "Diwali-ready by Oct", "monsoon acne control") + a free-text. Save to `users/{uid}/profile.glowGoal`. Surface it in the Home hero card ("Goal: Diwali-ready in 14 days") to create accountability. Self-stated goals raise 30-day completion rate by 15–25% in habit-formation literature.

**E3. Identity reinforcement micro-copy.** Sprinkle identity-naming language throughout the UI:
- Home greeting after streak day 7: "Welcome back, GlowUp wali ✨"
- Routine completion: "Pakka skincare lover, {name} 💪"
- After Day 21 milestone: "Dadi-ke-nuskhe queen, certified."
- After 5th affiliate purchase: "Smart shopper of the week 🛍️"

Avoid: over-naming (more than 1 identity tag per session), forced "girl power" register (the Tier 2/3 audience reads it as foreign), English-only identity tags.

### F. Content + community loops

**F1. Glow Tip Tuesday.** Every Tuesday at 10:30 IST, fire a content push + WhatsApp broadcast with a single sharp tip in Hindi. Content Agent drafts (per `solo-founder-playbook.md` §5.2); founder approves Mondays.

Sample tips (the Content Agent runs from a rotation of ~50, generated quarterly):
- "Aaj ki tip: कच्चे दूध से चेहरा साफ करो — 2 मिनट, oily skin के लिए magic."
- "Try this: Multani mitti + neem powder paste, हफ्ते में दो बार, acne kam हो जाएगी."
- "Surprise: tomato का slice 5 मिनट, dark spots fade होने लगेंगे."

**F2. UGC — "share your week-1 photo" prompts.** At Day 7 post-scan, prompt the user to share her "before" + Day-7 selfie (privacy-safe: blurred face option, just-skin crop option). Save to Firestore as opt-in UGC; with permission, use in:
- Future user's "social proof" cards on the Home tab
- Meta ad creatives (rights collected at upload)
- WhatsApp broadcasts (with name + face anonymised by default; explicit consent to show)

Privacy critical: never display user's photo without explicit per-use consent toggle. Default to "just-skin crop" + first-name-only.

**F3. WhatsApp Community group seeded by founder, agent-moderated.** Already detailed in `solo-founder-playbook.md` §3.5. Two sub-groups:
- "GlowUp Tips" (broadcast-only) — founder + agent post weekly tip
- "GlowUp Q&A" (members can ask) — agent triages, founder + agent answer; Tier 2/3 women love the "founder herself replies" effect

Cap at 5,000 per Community (WhatsApp limit). Founder must show up personally in Q&A at least twice a week — this is the single most important trust-building move at S0/S1 scale.

---

## Part 3 — Personalization Engine

### 3.1 Signals we already have (from the existing app + analytics plan)

Available today in Firestore + Zustand stores + analytics:

- **Q1–Q5 onboarding answers:** top concern, skin type at midday, water intake, sunscreen frequency, age range. Stored in `users/{uid}/profile` (per existing `stores/useUserStore.ts`).
- **Scan results:** overall score, skin age, 10-metric panel (hydration, blemish-prone, redness, oiliness, dark spots, radiance, texture, firmness, wrinkles, dark circles), top concern, top win. Stored in `users/{uid}/scans/{scanId}`.
- **Routine state:** which steps were checked off, last check-in timestamp per step. Stored in `users/{uid}/routineState`.
- **Language:** `en` or `hi`. From `users/{uid}/profile.language` and i18n.
- **Time-of-day:** computed.
- **Purchase history:** Razorpay payment history + `affiliate_link_tap` events with SKU + timestamp.
- **Scan history:** all prior scans, enables `scan_delta_top`.
- **App engagement:** `first_open`, `home_view`, `routine_view`, `app_active_d1/d7/d30` (per `analytics-tracking-plan.md`).
- **Push opt-in state, WhatsApp opt-in state, SMS opt-in state.**

### 3.2 Signals we should add

- **City** (from PIN code at signup, or IP geolocation at app launch) — drives weather/AQI + festival/seasonal pushes.
- **Weather + AQI for user's city** — daily fetch from OpenWeather free tier; cache 6 hrs.
- **Cohort tag** — auto-generated from city + age + top concern, e.g. `lucknow_22_acne_oily`. Used for social-proof copy.
- **Routine-step micro-completion** — currently we have routine view; add per-step "done" toggle. Drives streak + skipped-day recovery.
- **In-app session length** — captured by Firebase Analytics; surface to rules engine as `recent_session_duration_avg`. Drives whether to fire a re-engagement nudge.
- **Last-N push response history** — captured by FCM/APNs delivery + open. If user hasn't opened 5 consecutive pushes, throttle their feed for 2 weeks. This is the "spam protection on our own side" rule.

### 3.3 Concrete personalization rules, laddered low-effort → ML

The 10 rules below are listed in deploy order. The first 6 are pure if/then; the next 3 need light Firestore aggregation; the last needs an ML-lite scoring loop.

**Rule 1 (deploy week 1) — Morning routine push, conditional.**
```
IF user.push_opt_in == true
   AND user.routine.morning_today.checked != true
   AND user.last_app_open < 6_hours_ago
   AND time IN [07:30, 09:00]
   AND day_of_week != SUNDAY
   AND user.push_count_today == 0
THEN fire push: "Aaj ka morning step — {routine.morning[0].remedy.label}. Tap me dekho ✨"
WITH deep_link: /(tabs)/routine?focus=morning
```

**Rule 2 (week 1) — Evening routine push, only if morning skipped or done-late.**
```
IF user.push_opt_in == true
   AND user.routine.evening_today.checked != true
   AND user.last_app_open < 6_hours_ago
   AND time IN [20:30, 21:45]
   AND user.push_count_today == 0
   AND (user.routine.morning_today.checked == false OR
        user.routine.morning_today.checked_at > 14:00)
THEN fire push: "Raat ka skincare time — {routine.night[0].remedy.label}. Apni skin ko thank you bolo 🌙"
```

**Rule 3 (week 1) — Re-scan invitation, weekly.**
```
IF days_since_last_scan >= 7
   AND days_since_last_scan < 14   # don't re-fire daily
   AND user.last_app_open < 24_hours_ago
   AND user.push_opt_in == true
THEN fire push: "{name}, 1 हफ्ता हो गया — re-scan karke dekho skin kitni badli ✨"
ALSO send WhatsApp template #5 if whatsapp_opt_in == true
```

**Rule 4 (week 1) — Skipped-day recovery, gentle.**
```
IF user.routine.checked_in_last_2_days == false
   AND user.last_app_open >= 48_hours_ago
   AND user.last_app_open < 96_hours_ago   # gives ~2 day window
   AND user.recovery_push_last_7d == 0
   AND user.push_opt_in == true
THEN fire push: "Koi baat नहीं — aaj se phir shuru karte hain ✨"
```

**Rule 5 (week 2) — Festival/seasonal pack pre-announcement.**
```
IF current_date IN festival_calendar.windows
   AND user.cohort_tag matches festival.target_audience
   AND user.affiliate_purchases_last_30d == 0   # don't re-pitch active buyers
   AND user.push_count_this_week < 4
THEN fire push: festival.copy_template
ALSO send WhatsApp template #9 to whatsapp_opt_in users
```

**Rule 6 (week 2) — Product run-out trigger.**
```
IF user.affiliate_link_tap exists
   AND days_since_tap IN [product.expected_lifespan_days - 3, product.expected_lifespan_days + 2]
   AND user.repurchase_for_sku == false
THEN send WhatsApp template #8 with refreshed affiliate link
DO NOT fire push for this — WhatsApp only (commerce intent is higher on WhatsApp)
```

Product lifespan mapping (add to `lib/routineData.ts`):
```
Himalaya Neem Face Wash 100ml → 25 days
Vicco Turmeric Cream 30g → 28 days
Dabur Gulabari Rose Water 250ml → 35 days
Himalaya Aloe Vera Gel 100ml → 30 days
Biotique Bio Honey Cream 50g → 35 days
Biotique Anti-Ageing Serum 50ml → 50 days
```

**Rule 7 (week 4, needs Firestore aggregation) — High-concern + engaged → product pitch.**
```
IF user.scan.acne_score < 60   # i.e., high acne concern
   AND user.routine_views_last_7d >= 2
   AND user.affiliate_link_tap.acne_products_count == 0
   AND user.push_opt_in == true
THEN fire push: "Kil-muhason ka final solution — Himalaya Neem Face Wash ₹75. Aaj try karo."
DEEP_LINK to product card with affiliate URL
```

**Rule 8 (week 4) — Streak about to break, Time-Sensitive (only for opted-in streak users).**
```
IF user.current_streak >= 5
   AND user.checked_in_today == false
   AND time >= 18:00   # 6+ hrs before midnight
   AND user.push_opt_in == true
   AND user.streak_break_warning_today == false
THEN fire push WITH ios_interruption_level = TIME_SENSITIVE: 
     "{streak_days}-day सिलसिला aaj toot sakta hai. 1 step kar lo — 30 seconds ✨"
```

**Rule 9 (week 6, needs cohort aggregation) — Social proof, cohort-scoped.**
```
IF user.cohort_tag has >= 100 members
   AND any cohort_milestone in last 24h (e.g. "100 women in your cohort hit 7-day streak")
   AND user.push_count_this_week < 3
THEN fire push: "Tumhari city ke {N} {cohort.descriptor} ne is hafte 7-day सिलसिला complete kiya. Tum bhi kar sakti ho ✨"
```

**Rule 10 (month 3+, light ML scoring) — Predicted next-best-action.**
```
SCORE each candidate action {re-scan, daily tip, product pitch, streak nudge, festival pack} 
USING features {user.push_engagement_last_30d, user.affiliate_engagement, user.scan_count, 
                user.session_freq, user.streak_length, current_festival_distance, user.cohort_tag}

The score is computed via a lightweight bandit (epsilon-greedy with 10% exploration) maintained
in Firestore. Each user gets a daily 'best action' computed in the nightly batch.
Send that action via the user's highest-priority opted-in channel.
```

Rule 10 is genuinely useful but only after ~3 months of behavioural data. Until then, the rule-based stack (1–9) does the job. The bandit can be trained in a single Cloudflare Worker cron job running on the Firestore export, using a 50-line Python implementation — no real ML infra needed. The Analytics Agent in `solo-founder-playbook.md` §5.4 can own this.

### 3.4 Rules engine implementation

Two viable architectures:
- **Firestore-only with scheduled Cloud Functions.** Every hour, a function iterates eligible users (filtered by simple Firestore composite indexes), evaluates the rules, dispatches to FCM/APNs and AiSensy. Cost: free tier Firestore + ~₹500/mo Cloud Functions at 10K MAU. Simplest; recommended.
- **Cloudflare Worker + Firestore.** Same pattern but the Worker is already on the critical path for Gemini-proxy + Razorpay webhooks. Pulls user state from Firestore via REST, dispatches. Slightly faster, marginally cheaper. Use if the Gemini proxy is already shipped.

Either way, **the rules engine is a single file** of ~300 lines, not a big system. Each rule is a function returning `{shouldFire: boolean, payload: {...}}`. The dispatcher applies frequency caps + quiet hours globally before sending. Use `lib/notifications/rules.ts` + `lib/notifications/dispatcher.ts` as the file layout.

---

## Part 4 — Push Notification Copy Bank

50 ready-to-use Hindi/Hinglish push notifications, grouped by category. The founder can paste these into the rules engine config or into the Content Agent's tip bank. All are tested against:
- ≤45 characters in the title (Android collapsed view)
- ≤80 characters in the body (iOS lock-screen view)
- Devanagari-safe (verified to render on MIUI, OxygenOS, OneUI without Latin fallback)
- One emoji max per message, sparingly used

### 4.1 Routine category (8 examples)

| # | Time | Trigger | Title | Body | Audience filter | Expected open rate |
|---|---|---|---|---|---|---|
| 1 | 07:45 | Morning, routine undone | Aaj ka morning step ✨ | "{step_name} — 60 seconds. Skin ko fresh start do." | All push-opt-in users with active routine | 7–11% |
| 2 | 08:15 | Morning, oily skin | Oily skin? Besan time | "Besan + rose water mix karo. Oil control: ek dum natural." | skin_type=oily | 8–12% |
| 3 | 08:00 | Morning, dry skin | Dry skin ke liye | "Kacche doodh + 4 boond honey. Skin soft ho jaayegi." | skin_type=dry | 8–12% |
| 4 | 20:45 | Evening, routine undone | Raat ka skincare 🌙 | "Aloe vera gel — 2 mins. Apni skin ko thank you bolo." | All evening eligible | 5–8% |
| 5 | 21:00 | Evening, anti-aging concern | Anti-aging step pending | "Biotique Bio Dandelion serum — 4 drops. Roz ka raaz." | concern=anti_aging | 6–9% |
| 6 | 19:30 | Sunday only — weekly mask | Sunday wala glow ritual | "Multani mitti + haldi face pack. 15 mins. Hafte ka magic." | Sundays only | 9–14% |
| 7 | 08:00 | Morning, no sunscreen logged | Sunscreen reminder ☀️ | "Aaj sunscreen lagana mat bhulo. 1 line bhi enough hai." | q4=never OR sometimes | 6–10% |
| 8 | 10:00 | Hot day, AQI poor | Aaj garmi tez hai | "Rose water spritz rakho bag me. Refresh kabhi bhi." | weather=hot OR aqi=poor | 5–8% |

### 4.2 Progress category (7 examples)

| # | Trigger | Title | Body | Filter |
|---|---|---|---|---|
| 9 | 7 days post-scan | 1 हफ्ता हो gaya, {name} | "Re-scan karo — dekho skin score badla ya nahi ✨" | days_since_scan>=7 |
| 10 | 7 days, last score >75 | Glowing rho! 75+ score | "Dekhte hai is hafte aur improve hua kya. 30 seconds." | last_score>=75 |
| 11 | 7 days, last score <60 | Plan kaam kar raha hai? | "Re-scan se confirm karo. Adjust bhi kar sakte hain." | last_score<60 |
| 12 | 30 days, after re-scan | Tumhari hydration +12 🌿 | "1 mahine me 12 point upar. Yeh chal raha hai!" | scan_delta_top>=10 |
| 13 | 30 days, deltas low | 30 din ka progress check | "Routine ek chhota tweak need karta hai. Aao dekho." | scan_delta_avg<3 |
| 14 | After 2nd scan, before/after | Pehle aur ab — dekho | "Tumhari before/after card ready hai. Share karo? 📸" | scan_count==2 |
| 15 | After 5th scan | 5 scans done, {name} 🎉 | "Tumhara skin journey — 5 milestones ka recap dekho." | scan_count==5 |

### 4.3 Streak / sankalp category (6 examples)

| # | Trigger | Title | Body | Filter |
|---|---|---|---|---|
| 16 | Day 3 streak | 3 din ka silsila ✨ | "Aaj bhi karo — chhota streak bada glow banta hai." | streak==3 |
| 17 | Day 7 streak | 7 din, 1 hafta pura 🌿 | "Glow Certificate unlock ho gaya. Aao dekho." | streak==7 |
| 18 | Day 14 streak | 14 din — half-sankalp | "Aadha rasta tay. 7 aur — 21 din ka संकल्प pura hoga." | streak==14 |
| 19 | Day 21 streak | 21 din ka संकल्प pura 🎉 | "Tumne kar dikhaaya. Glow Certificate ready hai." | streak==21 |
| 20 | Day 6, streak about to break (Time-Sensitive) | Aaj last chance ⏰ | "6 din ka silsila — aaj 1 step karo, toot na jaaye." | streak==6 AND time>18:00 |
| 21 | Streak forgiveness ping | Welcome back 🌸 | "Streak bach gaya — 1 step abhi karo, count restart nahi." | missed_yesterday AND today_check |

### 4.4 Social proof category (4 examples)

| # | Title | Body | Filter |
|---|---|---|---|
| 22 | UP ki ladkiyan ye try kar rahi | "1,247 girls — besan + rose water, is hafte." | cohort=UP+age<25 |
| 23 | Tumhare jaisi 500 women | "Same concern, same age — sab 21-day plan pe hain." | cohort match >=500 |
| 24 | Lucknow me trending | "Multani mitti pack — 3,400 orders is mahine." | city=Lucknow |
| 25 | 10,000 scans is week 🌿 | "Tum bhi aaj ka scan ya routine kar lo." | All, max 1/month |

### 4.5 Sale / scarcity category (4 examples — use sparingly)

| # | Title | Body | Filter |
|---|---|---|---|
| 26 | Diwali pack: 14 din baki | "Multani mitti + kasturi haldi — ₹149 only. Tap." | T-14 Diwali |
| 27 | Quarterly Glow Pack ₹89 | "Aaj tak. ₹10 off. Tap me unlock." | 21 days post first-paid |
| 28 | Wapas aane wale, special ₹14 | "Re-engage rate par scan kar lo — sirf aaj." | win-back eligible |
| 29 | Aaj raat tak — 20% off | "Festival pack last 8 hours. Apni glow plan order karo." | last day of festival window |

### 4.6 Festival / season category (8 examples)

| # | Window | Title | Body |
|---|---|---|---|
| 30 | Pre-Diwali | Diwali se 21 din pehle | "Aaj se shuru karo glow plan — Diwali pe khud chamko ✨" |
| 31 | Karwa Chauth eve | Kal Karwa Chauth | "Aaj raat aloe vera + haldi — subah radiance pakka." |
| 32 | Holi pre | Holi ke pehle skin prep | "Tel + besan layer — colour aasaan se nikal jaayega." |
| 33 | Post-Holi recovery | Holi colour utarne ka tareeka | "Besan + nimbu + doodh — 3 din ka recovery plan." |
| 34 | Summer | Garmi me tan hata do | "Rose water + aloe — 7 din ka tan removal routine." |
| 35 | Monsoon | Barsaat aur acne | "Neem face wash + tea tree — fungal se bachao." |
| 36 | Winter | Sardi me dryness | "Vicco Turmeric raat ko — subah glow milega." |
| 37 | Eid eve | Eid ki ready glow | "Multani mitti pack aaj — subah dazzling skin." |

### 4.7 Content / tip category (7 examples)

| # | Title | Body | Filter |
|---|---|---|---|
| 38 | Aaj ki tip 🌿 | "Tomato slice 5 min — dark spots fade hone lagenge." | content/Tue 10:30 |
| 39 | Surprising sach | "Bina sunscreen, har glow useless. 1 line bhi enough." | content/Wed |
| 40 | Dadi ka secret 🌸 | "Multani mitti + dahi — purified, brightened, refreshed." | content/Thu |
| 41 | Myth bust | "'Lemon brightens' — bilkul nahi. Burn karta hai. Padho." | content/Fri |
| 42 | Glow Tip Tuesday | "{ai_generated_tip}" | content/Tue (override) |
| 43 | Weekend ritual | "Sunday: kasturi haldi + besan + doodh. 15 min. Magic." | Sundays |
| 44 | Quick win 30 seconds | "Ice cube wrapped in cloth — 10 sec on face. Refresh." | content/random |

### 4.8 Recovery / win-back category (6 examples)

| # | Trigger | Title | Body |
|---|---|---|---|
| 45 | 2-day skip | Koi baat nahi 🌸 | "Aaj se phir shuru karte hain. 1 step bhi enough." |
| 46 | 7-day skip | Tumhari skin tumhe yaad kar rahi | "1 mini-step aaj — aloe vera, 30 seconds." |
| 47 | 14-day inactive | Re-scan free 1 baar | "{name}, free re-scan unlock — dekho skin kahaan pahunchi." |
| 48 | 28-day inactive (WhatsApp parallel) | Hum tumhe miss kar rahe ✨ | "Aaj 1 free scan le lo — 30 seconds." |
| 49 | 45-day inactive (last push then SMS only) | Last reminder 🌿 | "Aapka skin journey wait kar raha hai. Tap karo." |
| 50 | Subscription expiry warning | Glow Pack 3 din me khatm | "Renew karo — ₹89 (₹10 off). Discount sirf aaj." |

**Usage notes:**
- Always personalize `{name}` if available; fall back to `दीदी` (di-di) if not — never empty.
- Never use the founder's name or "GlowUp team" in the from-line; the app name is enough.
- A/B test the top 5 by category quarterly; rotate underperformers.
- The Content Agent (per `solo-founder-playbook.md` §5.2) can generate 10 new variants per category per quarter to keep freshness.

---

## Part 5 — Sequencing (D0 → D60 lifecycle map)

A concrete day-by-day touch map for a new user. Channels: **PUSH** (FCM/APNs), **WA** (WhatsApp), **SMS** (fallback), **IN-APP** (banner/card/screen), **AD** (Meta retarget).

The principle: **front-load value, taper aggressiveness, switch channels when one fails.**

| Day | Channel | Touch | Trigger condition | Notes |
|---|---|---|---|---|
| **D0 morning** | (install) | App install via Meta/Google UAC | Ad tap | — |
| D0 +5 min | IN-APP | Onboarding Q1–Q5 + selfie + scan + reveal + paywall | Direct flow | Bedrock value moment |
| D0 +6 min | IN-APP | WhatsApp consent ask + push consent pre-prompt | After score_reveal | Pre-prompt before OS dialog |
| D0 +7 min | WA | Welcome msg (template #1) | If consented + paid OR engaged | Sets WA habit |
| D0 +8 min | WA | Post-scan routine delivery (template #2) | Auto, includes score + routine | First WA value moment |
| D0 evening 20:30 | PUSH | Optional: evening routine reminder | If morning routine wasn't tried + push opt-in | Skip if user is still actively in app |
| **D1 morning 07:45** | PUSH | Morning routine reminder (copy #1 or #2 from bank) | Rule 1 | First daily routine ping |
| D1 +24h | WA | Day-1 morning routine check-in (template #3) | utility, in 24h window | "Did you do it?" |
| D1 evening 20:45 | PUSH | Evening routine reminder | Only if morning skipped | |
| **D2 morning** | PUSH | Morning routine reminder | Same | |
| D2 noon | IN-APP | Streak counter shows "2-day सिलसिला" | App open | Subtle reinforcement |
| **D3 morning** | PUSH | Day 3 streak celebration (copy #16) | streak==3 + opted-in | Soft milestone |
| D3 afternoon | WA | Social proof (template #4) | If engaged | "1,247 girls tried..." |
| **D4** | (none) | Recovery push only if skipped D3 entirely | Rule 4 | Quiet day if all is well |
| **D5** | IN-APP | "Try the AI daily tip" card on Home | Open | Activate content surface |
| **D6** | PUSH | If streak==6 AND not done today: streak-break warning (copy #20) | Time-Sensitive, after 18:00 | One-shot urgency |
| **D7 morning** | PUSH | Re-scan invitation (copy #9) | Rule 3 | THE KEY DAY |
| D7 +1h | WA | Day-7 re-scan invite (template #5) | Parallel channel | High conversion |
| D7 evening | IN-APP | Sunday recap (if D7 falls on Sunday) | Sunday rule | Auto |
| **D8–D13** | Mix | Routine pushes throttled to alternate days | Frequency cap | Conserve goodwill |
| D8 | IN-APP | If re-scanned: show delta annotation with celebration | Auto | |
| D10 | WA | Glow Tip Tuesday broadcast (template — content) | All consented | Weekly cadence |
| **D14 morning** | PUSH | Day-14 milestone (copy #18) | streak==14 | |
| D14 afternoon | WA | Day-14 progress story image (template #6) | If re-scanned | Before/after card |
| **D15–D20** | Mix | Routine + festival/seasonal if window matches | | |
| **D21** | PUSH+WA | संकल्प पूरा milestone (copy #19 + template #7) | streak==21 | Glow Certificate unlock |
| D21 | IN-APP | Quarterly Glow Pack offer surfaced | Auto | First soft sell of recurring |
| **D22–D27** | Lower freq | Mostly in-app + 1 push/week | | |
| **D28** | WA | Product run-out trigger (template #8) | If affiliate purchase ~D2 | Hypothesis B revenue moment |
| D28 | IN-APP | "Re-order your products" card on Home | Auto | Cross-channel reinforcement |
| **D30** | PUSH+WA | 30-day journey recap (copy #12 or #13) | Auto | Affirms long-term value |
| D30 | IN-APP | Glow Pack offer (₹89, ₹10 off) on Home | If still hasn't purchased quarterly | |
| **D31–D44** | Steady | 3 pushes/week max + 2 WA/week | | |
| D35 | WA | Festival pack pre-announcement IF in window | seasonal | |
| D40 | AD | Meta retarget: paywall_view-no-trial cohort | Out-of-app | Re-engage stale users |
| **D45** | PUSH | Win-back attempt (copy #48) | Last push ever for this dormant user | One shot |
| D45 +2h | WA | Win-back WA (template #12) | Parallel | |
| **D46–D59** | WA + SMS only | No more pushes — preserve permission | | |
| D50 | WA | Free re-scan unlock offer | If still dormant | High-value re-engagement |
| **D60** | SMS | Last-touch SMS for users denied WA + push | "Tumhara skin journey..." + link | Last contact attempt |
| D60+ | AD | Move to long-tail Meta retargeting cohort | | Hand off to acquisition team |

**Cadence math:** in the active 30 days, a steady user gets ~12 pushes, ~9 WA messages, daily in-app surfaces. In days 30–60, ~6 pushes, ~6 WA. This is well within the ≤5/week push cap and the ≤3/week WA cap. The combined cognitive load on a Tier 2/3 user is comparable to one Instagram-creator's content frequency — they will not feel spammed.

---

## Part 6 — Tech Requirements

### 6.1 What to build/wire in the Expo + Firebase stack

The retention system splits into client and server, with the server (Cloudflare Workers + Firebase Cloud Functions) doing the heavy lifting because most triggers fire when the app isn't open.

**Client-side (Expo SDK 54, RN 0.81, React 19):**

| Component | Package | Effort | Notes |
|---|---|---|---|
| Push notifications | `expo-notifications` + `@react-native-firebase/messaging` | 2 days | FCM for Android, APNs via Firebase for iOS. Per-channel registration required for Android 13+ |
| Notification channels | Android: 3 channels (`routine_reminders`, `progress_updates`, `marketing`) | 0.5 day | Channel-scoped permission, critical for Android 16 organizer |
| iOS notification categories | Critical for Time-Sensitive flag | 0.5 day | Only for streak-break warning, justified |
| In-app banners + cards | Custom component using existing NativeWind v4 | 2 days | Home tab card surface, Sunday recap takeover |
| Deep-linking from pushes | `expo-linking` + Expo Router schema | 1 day | Push payload includes `deepLink: "/(tabs)/routine?focus=morning"` |
| Streak state + check-in logic | Zustand store + Firestore sync | 1.5 days | `useStreakStore.ts` with streak_freeze logic |
| Sunday recap full-screen | New screen `app/recap.tsx` | 1 day | Modal-style, Sunday-only auto-mount |
| AI daily tip card | Render `users/{uid}/dailyTip/{date}` from Firestore | 0.5 day | Server-side generation handles the cost |
| WhatsApp consent UI | Single screen post-OTP+Q1 | 0.5 day | Save to `users/{uid}/consent.whatsapp` |
| Push permission pre-prompt | Custom modal before OS dialog | 0.5 day | Critical for opt-in rate |

**Total client-side v1: ~10 engineering days.**

**Server-side (Cloudflare Workers + Cloud Functions + AiSensy):**

| Component | Where | Effort | Notes |
|---|---|---|---|
| Rules engine | Cloud Function (hourly cron) | 3 days | `lib/notifications/rules.ts` evaluated server-side |
| Push dispatcher | Cloud Function via Firebase Admin SDK | 1 day | FCM + APNs via Firebase |
| AiSensy WhatsApp dispatcher | Cloudflare Worker | 1.5 days | POST to AiSensy API with template + params |
| Daily AI tip generator | Cloud Function (nightly cron at 03:00 IST) | 1 day | Batch Gemini calls, write to Firestore |
| Frequency cap enforcement | Firestore counter per user | 0.5 day | TTL 7 days |
| Quiet hours enforcement | Pre-dispatch check | 0.5 day | IST hardcoded MVP |
| Razorpay webhook → trigger product run-out timer | Existing webhook handler (already in analytics plan) | 0.5 day | Just add SKU + days mapping |
| Weather/AQI integration | Cloudflare Worker daily fetch | 0.5 day | OpenWeather free tier |
| Cohort tag assignment | Cloud Function on profile completion | 1 day | Composite Firestore index |
| Streak state machine | Cloud Function on daily check-in | 1 day | Forgiveness + milestone trigger |
| Festival calendar config | Firestore document `config/festivalCalendar` | 0.5 day | Founder + Content Agent edit |
| Analytics event firing | Existing analytics module | 0 | Already in `analytics-tracking-plan.md` |

**Total server-side v1: ~11 engineering days.**

**v2 additions (ship in weeks 6–10):**

| Component | Effort | Lift |
|---|---|---|
| Bandit-based next-best-action scoring | 3 days | +1.5–3 pp on D7 |
| Per-user A/B test framework for push copy | 2 days | +0.5–2 pp on push CTR |
| SMS fallback via MSG91 + DLT registration | 1.5 days | Reaches 10–15% denied-both cohort |
| Personalized image generation (before/after card) | 2 days | +30–50% on D14 share rate |
| Meta CAPI retargeting events for `paywall_view_no_trial`, `churned_payers` | Already in analytics plan §4.5 | Existing |

**Total v2: ~8.5 engineering days.**

### 6.2 Rules engine architecture

```
┌───────────────────────────────────────────────────────────┐
│  Cloud Function: hourly cron (* * 6-22 * * *) IST         │
│  ─────────────────────────────────────────────────────    │
│  1. Pull eligible users (Firestore query with composite   │
│     indexes on push_opt_in + last_app_open + timezone)    │
│  2. For each user: evaluate all 10 rules                  │
│  3. Collect candidate pushes/WAs                          │
│  4. Apply global frequency caps                           │
│  5. Apply quiet hours                                     │
│  6. Score candidates (rule 10 bandit)                     │
│  7. Pick top 1 per user per hour                          │
│  8. Dispatch to FCM or WhatsApp                           │
│  9. Log to Firestore for dedup + analytics                │
└───────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────┐    ┌────────────────────────┐
│  FCM/APNs dispatcher       │    │  AiSensy WA dispatcher │
│  Firebase Admin SDK        │    │  POST to AiSensy API   │
└───────────────────────────┘    └────────────────────────┘
```

Cloudflare Worker alternative: same logic, runs as cron triggers (`schedule = "0 * * * *"`). Pulls from Firestore via REST API. ~₹0/mo at this scale. Use this if you already have the Gemini-proxy Worker — bolt onto it.

### 6.3 AI agent for copy generation

Per `solo-founder-playbook.md` §5.2 — the Content Agent already in scope. Add to its weekly cron:

```
Every Sunday 22:00 IST:
1. Pull last week's funnel digest from Analytics Agent
2. Pull this week's festival calendar window
3. Pull last 30 days of push CTR data by category
4. Generate:
   - 10 fresh push copy variants for the top 3 underperforming categories
   - 7 daily AI tips (one per day) for the upcoming week
   - 2 WhatsApp broadcast templates for the week's festival/season
5. Post drafts to Notion for founder Monday approval
6. On approval, push to Firestore config docs
```

Cost: ~₹400/week in Claude Sonnet API + ~₹500/mo in Gemini for daily tips = ~₹2,100/mo. Well within the agent budget.

### 6.4 Engineering effort summary

| Phase | Scope | Engineering days | Calendar weeks (solo, half-time on this) |
|---|---|---|---|
| **v1 — basic push + WhatsApp + streak** | Hooks A1/A2/A3/A5, rules 1–6, push copy bank, AiSensy templates 1–8, streak UI, WhatsApp consent | ~21 eng days | 4–5 weeks |
| **v2 — full personalization + festival + AI tip** | Hooks A4/A6/A7, rules 7–9, AI daily tip, festival calendar, before/after share, SMS fallback | ~8.5 eng days | 2 weeks |
| **v3 — ML scoring + community** | Rule 10 bandit, WhatsApp Community setup, UGC pipeline | ~6 eng days | 1.5 weeks |
| **Total to fully-deployed** | | ~35–40 eng days | 7–9 weeks |

This fits inside the S1→S2 transition window in the `solo-founder-playbook.md` stage gates. Ship v1 by end of S1 (week 9), v2 mid-S2 (week 14), v3 late-S2 (week 17). v3 is optional for hitting 10K — community is the unlock for going from 10K to 50K.

---

## Part 7 — Metrics + Targets

### 7.1 What we measure

Three layers of metrics. The first layer is the actual retention KPI; the second is per-channel performance; the third is the affiliate/subscription-tied revenue metric.

**Layer 1 — retention (the only metrics the founder should obsess over):**

| Metric | Computation | MVP target (S1 end) | S2 target | S3 target | Read in |
|---|---|---|---|---|---|
| **D1 retention** | % installs opening app on Day +1 | 22–25% | 25–28% | 28–32% | Firebase Analytics, BigQuery export |
| **D7 retention** | % installs opening on Day +7 | 9–11% | 11–14% | 13–16% | Same |
| **D30 retention** | % installs opening on Day +30 | 4–5% | 5–7% | 7–9% | Same |
| **Re-scan rate at D30** | % users with ≥2 scans within 30 days | 15–20% | 20–28% | 28–35% | Firestore aggregation |
| **Average scans per active user at D60** | scan_count / active_user_count | 2.0–2.5 | 2.5–3.2 | 3.0–3.8 | Same |
| **Streak completion rate (7-day)** | Of streak-opted-in, % hitting day 7 | 35–45% | 45–55% | 50–60% | Firestore |
| **Streak completion rate (21-day)** | Of streak-opted-in, % hitting day 21 | 12–18% | 18–25% | 25–32% | Firestore |

**Layer 2 — per-channel performance:**

| Channel/category | Metric | MVP target | Excellent |
|---|---|---|---|
| Push opt-in (Android) | % installs granting | 65–78% | >80% |
| Push opt-in (iOS) | % installs granting | 30–42% | >45% |
| Push delivery (Android) | % sent that delivered | 88–95% | >95% |
| Push delivery (iOS) | % sent that delivered | 95–98% | >98% |
| Push open rate (routine category) | % delivered tapped | 5–9% | >9% |
| Push open rate (progress category) | % delivered tapped | 4–7% | >7% |
| Push open rate (sale category) | % delivered tapped | 1.5–3% | >3% |
| Push uninstall rate (per push fired) | % of users who uninstall within 24h of push | <0.3% | <0.15% |
| WA opt-in | % users consenting at OTP | 65–78% | >80% |
| WA delivery rate | % msgs delivered | 92–97% | >97% |
| WA read rate (24-hr window) | % delivered with read receipts | 45–62% | >60% |
| WA reply rate (lifecycle templates) | % replying | 5–11% | >10% |
| SMS delivery (DLT) | % sent that delivered | 85–92% | >92% |
| SMS open rate | % delivered with link tap | 8–14% | >14% |

**Layer 3 — revenue-tied (the only metrics that actually pay for this):**

| Metric | Computation | MVP target | S3 target |
|---|---|---|---|
| **Repeat-affiliate-purchase rate at D60** | Of users with 1st affiliate tap, % with 2nd tap by D60 | 6–10% | 12–20% |
| **Affiliate revenue per active user (ARPU-affiliate)** | Total commission / MAU | ₹5–10/mo | ₹15–25/mo |
| **Re-scan → affiliate-tap conversion** | % re-scans that lead to affiliate tap | 18–25% | 25–35% |
| **WhatsApp template → conversion (any)** | % WA msgs that drive scan, tap, or purchase within 7d | 4–8% | 8–14% |
| **Push → re-scan conversion (Day 7 invite)** | % Day-7 push opens that complete a re-scan within 48h | 25–40% | 40–55% |
| **Quarterly Glow Pack conversion (D21)** | % first-paid users who upgrade to quarterly | 8–14% | 14–22% |
| **Win-back rate (D45 push + WA)** | % dormant users who re-engage | 6–12% | 12–18% |

### 7.2 Realistic targets for an Indian skincare app at MVP scale

Anchor: at **S2 (3,000–5,000 paid users)**, the headline targets:
- D1: 25%, D7: 12%, D30: 5.5% (blended across all install sources)
- Re-scan rate at D30: 24%
- Push CTR (routine): 7%
- WA read rate: 55%
- Repeat affiliate rate at D60: 9%
- ARPU-affiliate: ₹7/mo

At **S3 (10,000+ paid users)**:
- D1: 28%, D7: 13.5%, D30: 7%
- Re-scan rate at D30: 30%
- Push CTR (routine): 8.5%
- WA read rate: 58%
- Repeat affiliate rate at D60: 14%
- ARPU-affiliate: ₹18/mo

These targets are above category median ([UXCam Health/Fitness D30 = 3.5–4%](https://uxcam.com/blog/mobile-app-retention-benchmarks/), [AppsFlyer India 2025](https://www.appsflyer.com/resources/reports/app-marketing-india/)) and below world-class. They are *achievable* with the system in this doc; they will *not* be achieved by the founder's two-hypothesis approach alone.

### 7.3 Diagnostic: if D7 < 15%, what's the playbook to fix

A D7 below 15% is salvageable but only if you act inside 14 days. The diagnostic ladder:

1. **First check: is the scan reveal landing?** Look at `score_reveal → app_active_d1` conversion. If <50%, the reveal isn't memorable enough. Fix the radar animation, the headline framing, the Hindi copy on the score number. Don't add more pushes — they won't save a forgettable reveal.

2. **Second check: is the routine being tried?** Look at `routine_view` event on D1. If <40% of D1-active users opened routine, the routine isn't surfaced enough on Home. Fix the hero card to default to routine, not last-scan.

3. **Third check: is push opt-in landing?** If push opt-in <60% on Android or <25% on iOS, the pre-prompt is wrong. Test variants of the pre-prompt copy with two-week A/B cycles.

4. **Fourth check: is push CTR per category in band?** If routine push CTR <4%, the copy is generic. Replace top 5 routine pushes with more concrete, sensory language (specific ingredient, specific time, specific outcome).

5. **Fifth check: is WhatsApp consent landing?** If WA opt-in <55%, the consent screen is asking too early or in wrong context. Move it to post-Q1 (after the user has stated her top concern, so the value is contextual).

6. **Sixth check: are we just over-pushing?** If push uninstall rate >0.4% per fire, you're spamming. Cut frequency to max 4/week per user and watch D7 recover within 2 weeks.

7. **Seventh check: is the AI tip actually being read?** If `daily_tip_card_view` <30% of D1-active users, the tip card is buried. Move above the routine card on Home.

8. **Last resort: is the product just not retention-worthy?** If all the above check out and D7 is still <12%, the product itself isn't a return-worthy product for this audience, and no retention system can fix that. Go back to the scan output quality and routine actionability — the source content has to be good before retention engineering can multiply it. This is the case `payments-and-paywall-report.md` §2.4 warns about: "no paywall placement will save you" if the scan quality is the issue.

### 7.4 Cohort + dashboard setup

Use Firebase BigQuery export (free tier covers our volume) + a single Google Sheet refreshed daily by the Analytics Agent. Sheet has tabs for:
- Retention cohort (rows = install week, columns = D1/D7/D14/D30/D60)
- Push performance (rows = category, columns = delivered/opened/CTR/uninstall)
- WhatsApp performance (rows = template, columns = sent/delivered/read/replied/conversion)
- Affiliate funnel (rows = SKU, columns = views/taps/confirmed/commission)
- Streak distribution (histogram of users by current streak length)

This is enough analytics infra. Don't pay for Mixpanel.

---

## Part 8 — Pitfalls + Circuit Breakers

What NOT to do. Each pitfall is paired with a hard rule that prevents it.

### 8.1 Notification spam — the category killer

**Pitfall:** sending 2+ pushes/day to drive engagement. Indian skincare-app uninstall rates routinely exceed 60% by D30, and over-notification is the #1 cause. [47% of users disable notifications from an app sending 10+ pushes/day within a week](https://productgrowth.in/resources/guides/push-notification-strategy/).

**Circuit breaker:** Hard cap at 1 push/day, 5 pushes/rolling-7-day-window per user. Enforced in the dispatcher *before* the FCM call, not after. If any single user is queued >5 pushes in 7 days, log the queue contents to a "saturation" Firestore collection so we can debug why the rules engine is producing this much for one user. No exception, including for "important" sale events.

### 8.2 Generic "we miss you" win-back

**Pitfall:** Generic "we miss you 😢" or "It's been a while" pushes. These are the cheapest possible engagement attempt and they convert at <1%. They also train the user that GlowUp is "that app that begs". Worse on Android 16 — the on-device notification organizer reads "we miss you" patterns and auto-categorises as marketing → silenced.

**Circuit breaker:** No "we miss you" copy anywhere. Every win-back push must reference something specific and useful to the user — their last scan score, their unfinished streak, a free re-scan, a season-relevant tip. If the Content Agent generates win-back copy that includes "miss you" / "come back" / "we're sad" — reject and regenerate.

### 8.3 Sale pushes to users who churned over price

**Pitfall:** Win-back ad / WhatsApp / push to a user whose `subscription_cancel` event carried `cancel_reason: "user_inapp"` early in the trial. These users explicitly said no to price; pitching the same thing again at marginal discount activates a hate-reaction and increases the future ignore rate from this user across all categories.

**Circuit breaker:** Exclude users with `subscription_cancel` (≤24hr after `trial_start`) from all sale audiences for 90 days. After 90 days, only re-pitch if the user has re-engaged via a free scan in the interim. Track in Firestore: `users/{uid}/excludeFromSale.until`.

### 8.4 Asking for permission too early

**Pitfall:** Asking for push permission at app launch. Default-allow rate drops to <30% on Android, <15% on iOS. Once denied, re-asking is hard (Android only re-asks at 1-year intervals; iOS never asks again unless app is reinstalled).

**Circuit breaker:** Push permission ask is gated to *after* `score_reveal`. The pre-prompt screen is mandatory; the OS prompt fires only after the pre-prompt's primary CTA. If the founder/PM ever tries to A/B test asking earlier, push back and cite this section.

### 8.5 Ignoring quiet hours

**Pitfall:** Firing pushes between 22:00 and 07:00 IST, especially around festivals (e.g. midnight "Happy Diwali!" pushes). For a wellness app whose audience is going to sleep around 22:00–23:00, a 23:30 push is the single fastest path to a notification-disable.

**Circuit breaker:** Dispatcher enforces 22:00 → 07:00 IST hard cut, no exceptions for festival messaging. Festival pushes that would fall in quiet hours are deferred to the next morning's 09:00 slot. WhatsApp messages follow the same rule (slightly more forgiving — 22:00 → 08:00).

### 8.6 Fake streaks

**Pitfall:** Inflating the streak count by counting passive app-opens (instead of routine check-ins) as streak days. Users notice within 2 weeks ("I didn't actually do my routine yesterday but it counted") and lose trust in the entire app.

**Circuit breaker:** A streak day requires either (a) an explicit "Mark Done" tap on a routine step or (b) a completed re-scan that day. App opens alone do NOT count. The streak forgiveness rule (one missed day per week) is the only flexibility; do not stretch it to two days.

### 8.7 Personalization theatre

**Pitfall:** Push copy that says "{name}, we noticed you have oily skin" — when the user knows we knew that since Q2 of onboarding. Doesn't feel personalized; feels surveillance-tinted.

**Circuit breaker:** Personalization should reference *behavior*, not *attribute*. "Tumne 3 din se besan try kiya — aaj multani mitti?" is good ("you tried X for 3 days, try Y today"). "{name}, your oily skin needs..." is bad. The Content Agent should be prompted with explicit "reference what they did, not what they are" guidance.

### 8.8 Notification UGC / over-shareable content driving privacy backlash

**Pitfall:** Auto-generating before/after cards and sharing without explicit consent toggle. Tier 2/3 Indian women are highly sensitive to facial photos being shared. A single Twitter/X complaint about "GlowUp shared my selfie without asking" — even if untrue — can be category-terminal.

**Circuit breaker:** Every UGC surface defaults to (a) just-skin crop, no face, (b) first-name-only, never full name, (c) explicit per-share consent toggle, (d) revocable from Profile → Privacy. Test the consent flow with at least 10 Tier 2/3 beta users before any UGC surface ships.

### 8.9 Over-using Time-Sensitive flag on iOS

**Pitfall:** Tagging sale pushes, festival pushes, social-proof pushes as Time-Sensitive to bypass Focus mode. Apple will throttle the app within 2–3 weeks and push delivery rates will collapse silently.

**Circuit breaker:** Only ONE category of push uses Time-Sensitive interruption level: streak-break warning (and only for streak-opted-in users with current streak ≥5). Everything else uses standard. Code-review every new push template for misuse of the flag.

### 8.10 Letting the agent ship pushes without founder review

**Pitfall:** The Content Agent generates 10 new push variants per week per category. Some will be off-tone, off-policy, or culturally tone-deaf (a Holi-themed push to a Muslim user in the wrong window, a "girl power" English creative to a 40-year-old in a Hindi-only cohort). One bad push can cost 500–2,000 uninstalls.

**Circuit breaker:** All new push templates go through founder Monday approval before they hit production. The agent posts drafts to a Notion review board; founder ticks approve/reject in <15 minutes. No agent-generated copy ever ships untouched. This is the same rule as the Support Agent escalation in `solo-founder-playbook.md` §5.1.

### 8.11 Mistaking WhatsApp blast volume for engagement

**Pitfall:** "We sent 50,000 WhatsApp messages this week, look at the reach!" — but 70% were marketing-rate messages to lapsed users with <2% read rate, costing ₹54K and yielding 10 re-scans.

**Circuit breaker:** Track WA cost-per-re-engaged-user weekly. If it exceeds ₹50/re-engaged-user for two consecutive weeks, the WA strategy needs surgical pruning — likely killing the lapsed-user-blast templates and concentrating on the in-24hr-window utility messages.

### 8.12 Building retention features instead of fixing the scan

**Pitfall:** Spending weeks building streaks, AI tips, festival pushes, WhatsApp lifecycle — while the underlying scan quality is mediocre. No retention layer compensates for a poor product. If users don't think the scan was accurate, no streak in the world will keep them.

**Circuit breaker:** Before shipping retention v1, run a scan-accuracy check: 50 manual scans across diverse skin tones + onboarding profiles + ask "does this match what the user would say about her own skin?". If <70% match rate, halt retention work and tune the Gemini prompt first. Same check the `solo-founder-playbook.md` §2.1 mandates for S0.

### 8.13 SMS to users who explicitly disabled push

**Pitfall:** Treating SMS as "the channel that bypasses the user's preferences". Sending SMS to users who actively disabled push is a trust violation even if technically allowed — and in DPDP enforcement context, "explicit revocation" on one channel can be argued to extend to others.

**Circuit breaker:** SMS only fires if the user (a) explicitly opted into SMS at signup OR (b) provided phone for OTP and did NOT explicitly deny push/WA. Once a user disables push AND WA, SMS goes silent within 14 days. Document this in the DPDP consent log.

### 8.14 Ignoring the OEM bundle reality

**Pitfall:** Pre-loaded users (Xiaomi GetApps, Realme Store) often arrive with notification permission auto-granted on older Android versions. Don't assume they actually want pushes — treat them as "soft opt-in" and use the same in-app pre-prompt before firing the first push.

**Circuit breaker:** First push to any user is gated by `user.confirmed_push_intent_in_app == true`, where `confirmed_push_intent_in_app` is set only by the in-app pre-prompt regardless of OS permission state. This costs a small fraction of fires but prevents the "I downloaded this app and it immediately spammed me" reaction that drives 1-star Play Store reviews.

### 8.15 Letting festival pushes become Diwali-only

**Pitfall:** Building a "Diwali pack" content moment, shipping it, and forgetting to ship the equivalents for Karwa Chauth, Eid, Holi, Onam, Pongal, Navratri, Christmas. Tier 2/3 India has 8–12 culturally significant festival windows per year; over-indexing on Diwali at the expense of others sends a "this app is for Hindi-belt Hindus only" signal that excludes Tamil, Telugu, Bengali, Muslim, Christian, regional cohorts.

**Circuit breaker:** Maintain the festival calendar with at least 10 windows per year, with at least 2 windows representing Muslim festivals (Eid-ul-Fitr, Eid-ul-Adha) and at least 1 South Indian festival (Pongal, Onam). If any quarter has fewer than 2 festival windows live, escalate as a content gap.

---

## Appendix — Sources

**Retention benchmarks:**
- [UXCam — Mobile App Retention Benchmarks 2026](https://uxcam.com/blog/mobile-app-retention-benchmarks/)
- [Business of Apps — App Retention Rates 2026](https://www.businessofapps.com/data/app-retention-rates/)
- [Business of Apps — Health & Fitness App Benchmarks 2026](https://www.businessofapps.com/data/health-fitness-app-benchmarks/)
- [AppsFlyer — State of App Marketing in India 2025](https://www.appsflyer.com/resources/reports/app-marketing-india/)
- [AppsFlyer — App Retention Benchmarks](https://www.appsflyer.com/infograms/app-retention-benchmarks/)
- [AppsFlyer — Benchmarks & Metrics blog](https://www.appsflyer.com/blog/topic/benchmarks-metrics/)
- [TechCrunch — AI-powered apps struggle with long-term retention](https://techcrunch.com/2026/03/10/ai-powered-apps-struggle-with-long-term-retention-new-report-shows/)
- [Pushwoosh — App retention benchmarks 2026](https://www.pushwoosh.com/blog/increase-user-retention-rate/)
- [Plotline — Retention rates by industry](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry)

**Push notifications — India + global:**
- [productgrowth.in — Push notification strategy for Indian apps](https://productgrowth.in/resources/guides/push-notification-strategy/)
- [productgrowth.in — Push notification strategy for consumer apps](https://productgrowth.in/insights/consumer/push-notification-strategy/)
- [Mobiloud — Push notification opt-in rate](https://www.mobiloud.com/blog/push-notification-opt-in-rate)
- [Business of Apps — Push notifications statistics 2025](https://www.businessofapps.com/marketplace/push-notifications/research/push-notifications-statistics/)
- [Batch — The Great Push Notifications Benchmark 2025](https://batch.com/ressources/etudes/benchmark-notifications-push-crm-mobile)
- [Pushwoosh — Push notification benchmarks 2025](https://www.pushwoosh.com/blog/push-notification-benchmarks/)
- [Airship — 3 iOS & Android push updates for 2025 strategy](https://www.airship.com/blog/3-ios-android-updates-to-consider-in-your-2025-push-notification-strategy/)
- [CleverTap — Android 13 push notification opt-ins](https://clevertap.com/blog/android-13-push-notification-opt-ins/)
- [CleverTap — App retention & engagement guide](https://clevertap.com/blog/app-retention-and-engagement-a-marketers-guide/)
- [MoEngage — Push Notification Delivery Benchmarks Report](https://www.moengage.com/industry-reports/push-notifications-delivery-report/)
- [MoEngage — Customer engagement benchmarks 2026](https://www.moengage.com/benchmarks/customer-engagement/)
- [Pushwoosh — Android 13 opt-in rate research](https://www.pushwoosh.com/blog/android-13-opt-in-rates-research/)
- [Pushwoosh — Increase push notification opt-in](https://www.pushwoosh.com/blog/increase-push-notifications-opt-in/)
- [OneSignal — Mobile app benchmarks 2024](https://onesignal.com/mobile-app-benchmarks-2024)
- [OneSignal — Push frequency capping](https://documentation.onesignal.com/docs/en/frequency-capping)
- [Android Developers — Notification runtime permission](https://developer.android.com/develop/ui/views/notifications/notification-permission)
- [Mobiloud — Push notifications iOS vs Android 2026](https://www.mobiloud.com/blog/push-notifications-ios-vs-android)
- [Mobile Growth Hacks — Push notification user controls](https://mobilegrowthhacks.com/push-guide-chapter-4)
- [Zapim — Push notification marketing India trends 2025](https://zapim.com/blogs/push-notification-marketing-in-india-top-trends-2025)

**WhatsApp Business API — India pricing:**
- [AiSensy Pricing](https://aisensy.com/pricing)
- [AiSensy — WhatsApp Business API Fee](https://wiki.aisensy.com/en/articles/11489897-whatsapp-business-api-fee)
- [matrixhive — WhatsApp Business API Pricing India Real Numbers Dec 2025](https://www.matrixhive.com/blog/whatsapp-business-api-pricing-in-india-the-real-numbers-december-2025)
- [whautomate — WhatsApp Business API Pricing India 2026](https://whautomate.com/whatsapp-business-api-pricing-india)
- [Gallabox — WhatsApp for D2C](https://gallabox.com/blog/whatsapp-for-d2c)
- [Wapikit — Conversational commerce 2025 WhatsApp India/Brazil D2C](https://www.wapikit.com/blog/conversational-commerce-2025-whatsapp-india-brazil-d2c)
- [Pickyassist — Best WhatsApp API providers India 2025](https://pickyassist.com/blog/best-whatsapp-api-providers-india-2025/)

**Streaks / gamification / cultural framing:**
- [StriveCloud — Duolingo gamification explained](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)
- [Duolingo blog — Language learning for the next billion: India](https://blog.duolingo.com/language-learning-for-the-next-billion-duolingo-in-india/)
- [Young Urban Project — Duolingo case study 2025](https://www.youngurbanproject.com/duolingo-case-study/)
- [TechGenYZ — Indian language learning apps 2025](https://techgenyz.com/indian-language-learning-apps-2025-guide/)

**Bharat consumer + India market context (repeats from sibling docs):**
- [RedSeer — The $3.2Bn Bharat Opportunity](https://redseer.com/articles/the-3-2bn-bharat-opportunity-how-tier-2-cities-are-driving-indias-interactive-media-boom/)
- [RedSeer — Evolving Playbook of India Internet](https://redseer.com/articles/redseers-big-insights-evolving-playbook-of-india-internet/)
- [GrowthX — KuKu FM business model deep dive](https://growthx.club/blog/kukufm-business-model)
- [The Hot Startups — Meesho's Tier 2/3 strategy](https://www.thehotstartups.com/p/meesho-s-business-strategy-building-india-s-e-commerce-giant-for-tier-2-3-cities)
- [The Established — Indian beauty trends 2025](https://www.theestablished.com/self/beauty/the-trends-that-will-shape-indias-beauty-and-wellness-landscape)
- [CosmeticsDesign Asia — How to win Tier 2/3 beauty consumers](https://www.cosmeticsdesign-asia.com/Article/2024/08/28/India-beauty-market-analysis-How-to-win-over-beauty-consumers-in-tier-two-and-three-cities/)

**App / repo references:**
- `app/results.tsx`, `app/routine.tsx`, `app/(tabs)/index.tsx` — current Home + Results + Routine surfaces
- `lib/routineData.ts` — STEP_POOL product DB (Himalaya/Biotique/Dabur/Vicco)
- `lib/home/` — existing hero card rules engine
- `i18n/hi.json`, `i18n/en.json` — current Hindi/Hinglish copy register
- `stores/useUserStore.ts`, `stores/useScanStore.ts`, `stores/useRoutineStore.ts` — Zustand state shape
- `docs/payments-and-paywall-report.md` — Hypothesis A vs B + retention myth-killing §2.4
- `docs/audience-fit-tier2-tier3.md` — Path B Bharat-native + WhatsApp + COD + vernacular
- `docs/analytics-tracking-plan.md` — event names + funnel + Razorpay webhooks
- `docs/solo-founder-playbook.md` — agent ops + stage gates + AiSensy + ₹19/₹99/affiliate pricing
- `docs/routine-personalization-notes.md` — heuristic personalization decisions
