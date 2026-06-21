/**
 * Curated micro-tips for the "Today's Focus" feature.
 * Each tip has inline i18n (not i18next keys) because tips are data, not UI chrome.
 * Hindi uses Devanagari script + English terms per project convention.
 */

export interface FocusTip {
  id: string;
  text: { en: string; hi: string };
  category: 'ingredient' | 'technique' | 'myth-bust' | 'seasonal' | 'habit';
  /** Step title keywords this tip relates to (matched case-insensitively against step.title) */
  relatedTitles: string[];
}

export const FOCUS_TIPS: FocusTip[] = [
  // ─── CLEANSE ────────────────────────────────────────────────────────────────
  {
    id: 'tip-cleanse-01',
    text: {
      en: 'Use lukewarm water — hot water strips natural oils',
      hi: 'Lukewarm water use करो — hot water natural oils निकाल देता है',
    },
    category: 'technique',
    relatedTitles: ['cleanse'],
  },
  {
    id: 'tip-cleanse-02',
    text: {
      en: 'Massage face wash for 60 seconds to really clean pores',
      hi: 'Face wash 60 seconds massage करो — pores अच्छे से clean होते हैं',
    },
    category: 'technique',
    relatedTitles: ['cleanse'],
  },
  {
    id: 'tip-cleanse-03',
    text: {
      en: 'Besan absorbs excess oil without stripping moisture',
      hi: 'Besan extra oil absorb करता है बिना moisture छीने',
    },
    category: 'ingredient',
    relatedTitles: ['cleanse'],
  },
  {
    id: 'tip-cleanse-04',
    text: {
      en: 'Pat dry with a clean towel — rubbing causes irritation',
      hi: 'Clean towel से pat dry करो — rubbing से irritation होती है',
    },
    category: 'technique',
    relatedTitles: ['cleanse'],
  },

  // ─── TONE ───────────────────────────────────────────────────────────────────
  {
    id: 'tip-tone-01',
    text: {
      en: 'Rose water tightens pores and balances pH naturally',
      hi: 'Rose water pores tighten करता है और pH naturally balance करता है',
    },
    category: 'ingredient',
    relatedTitles: ['tone'],
  },
  {
    id: 'tip-tone-02',
    text: {
      en: 'Apply toner on damp skin — it absorbs 2x better',
      hi: 'Toner damp skin पर लगाओ — 2x better absorb होता है',
    },
    category: 'technique',
    relatedTitles: ['tone'],
  },
  {
    id: 'tip-tone-03',
    text: {
      en: 'Spray rose water on face between screen breaks for a quick refresh',
      hi: 'Screen breaks में rose water spray करो — instant fresh feel',
    },
    category: 'habit',
    relatedTitles: ['tone'],
  },

  // ─── MOISTURISE ─────────────────────────────────────────────────────────────
  {
    id: 'tip-moist-01',
    text: {
      en: 'Apply moisturizer within 60 seconds of washing — locks in hydration',
      hi: 'Wash करने के 60 seconds में moisturizer लगाओ — hydration lock हो जाती है',
    },
    category: 'technique',
    relatedTitles: ['moisturise'],
  },
  {
    id: 'tip-moist-02',
    text: {
      en: 'Aloe vera gel is a natural moisturizer that won\'t clog pores',
      hi: 'Aloe vera gel natural moisturizer है जो pores clog नहीं करता',
    },
    category: 'ingredient',
    relatedTitles: ['moisturise'],
  },
  {
    id: 'tip-moist-03',
    text: {
      en: 'Oily skin needs moisturizer too — skip it and skin overproduces oil',
      hi: 'Oily skin को भी moisturizer चाहिए — skip करोगे तो skin और oil बनाएगी',
    },
    category: 'myth-bust',
    relatedTitles: ['moisturise'],
  },
  {
    id: 'tip-moist-04',
    text: {
      en: 'Use upward strokes when applying — helps with firmness over time',
      hi: 'Upward strokes में लगाओ — time के साथ firmness में help करता है',
    },
    category: 'technique',
    relatedTitles: ['moisturise'],
  },

  // ─── SUNSCREEN ──────────────────────────────────────────────────────────────
  {
    id: 'tip-sun-01',
    text: {
      en: 'Sunscreen is the #1 anti-aging product — even on cloudy days',
      hi: 'Sunscreen #1 anti-aging product है — cloudy days पर भी लगाओ',
    },
    category: 'myth-bust',
    relatedTitles: ['sunscreen'],
  },
  {
    id: 'tip-sun-02',
    text: {
      en: 'Use two finger-lengths of sunscreen for full face coverage',
      hi: 'Full face coverage के लिए दो finger-lengths sunscreen लगाओ',
    },
    category: 'technique',
    relatedTitles: ['sunscreen'],
  },
  {
    id: 'tip-sun-03',
    text: {
      en: 'Reapply sunscreen every 2-3 hours if you\'re outdoors',
      hi: 'Outdoor हो तो हर 2-3 hours में sunscreen reapply करो',
    },
    category: 'habit',
    relatedTitles: ['sunscreen'],
  },
  {
    id: 'tip-sun-04',
    text: {
      en: 'Indian sun is strong even in winter — SPF 30+ year-round',
      hi: 'India में winter में भी धूप strong होती है — साल भर SPF 30+ लगाओ',
    },
    category: 'seasonal',
    relatedTitles: ['sunscreen'],
  },

  // ─── NIGHT NOURISH ──────────────────────────────────────────────────────────
  {
    id: 'tip-night-01',
    text: {
      en: 'Skin repairs itself at night — night cream makes the most of this',
      hi: 'Skin रात को repair होती है — night cream इसका best use करती है',
    },
    category: 'technique',
    relatedTitles: ['night gel', 'night oil', 'night cream'],
  },
  {
    id: 'tip-night-02',
    text: {
      en: 'Almond oil at night reduces dark circles in 2-3 weeks',
      hi: 'Raat को almond oil लगाओ — 2-3 weeks में dark circles कम होंगे',
    },
    category: 'ingredient',
    relatedTitles: ['night oil', 'night cream', 'deep nourish'],
  },
  {
    id: 'tip-night-03',
    text: {
      en: 'Sleep on a silk or satin pillowcase — reduces skin creasing',
      hi: 'Silk या satin pillowcase पर सोओ — skin creasing कम होती है',
    },
    category: 'habit',
    relatedTitles: ['night gel', 'night oil', 'night cream'],
  },

  // ─── SPOT TREATMENT ─────────────────────────────────────────────────────────
  {
    id: 'tip-spot-01',
    text: {
      en: 'Never pop pimples — it spreads bacteria and causes scars',
      hi: 'Pimples कभी मत फोड़ो — bacteria फैलता है और scars बनते हैं',
    },
    category: 'myth-bust',
    relatedTitles: ['spot treatment'],
  },
  {
    id: 'tip-spot-02',
    text: {
      en: 'Turmeric + neem paste is a natural antiseptic for breakouts',
      hi: 'Haldi + neem paste natural antiseptic है breakouts के लिए',
    },
    category: 'ingredient',
    relatedTitles: ['spot treatment', 'anti-acne night treatment'],
  },
  {
    id: 'tip-spot-03',
    text: {
      en: 'Ice a pimple for 2 minutes to reduce redness and swelling',
      hi: 'Pimple पर 2 minutes ice लगाओ — redness और swelling कम होती है',
    },
    category: 'technique',
    relatedTitles: ['spot treatment'],
  },

  // ─── EXFOLIATE ──────────────────────────────────────────────────────────────
  {
    id: 'tip-exfo-01',
    text: {
      en: 'Exfoliate only 1-2x per week — overdoing it damages skin barrier',
      hi: 'Week में 1-2 बार ही exfoliate करो — ज़्यादा करने से skin barrier damage होती है',
    },
    category: 'technique',
    relatedTitles: ['exfoliate'],
  },
  {
    id: 'tip-exfo-02',
    text: {
      en: 'Papaya contains papain enzyme — a gentle natural exfoliant',
      hi: 'Papaya में papain enzyme है — gentle natural exfoliant',
    },
    category: 'ingredient',
    relatedTitles: ['exfoliate'],
  },
  {
    id: 'tip-exfo-03',
    text: {
      en: 'Never exfoliate on sunburned or irritated skin',
      hi: 'Sunburned या irritated skin पर कभी exfoliate मत करो',
    },
    category: 'technique',
    relatedTitles: ['exfoliate'],
  },

  // ─── MASKS ──────────────────────────────────────────────────────────────────
  {
    id: 'tip-mask-01',
    text: {
      en: 'Multani mitti + rose water = classic oil-control mask',
      hi: 'Multani mitti + rose water = classic oil-control mask',
    },
    category: 'ingredient',
    relatedTitles: ['purifying mask', 'brightening mask', 'hydrating mask', 'firming mask', 'ubtan brightening mask'],
  },
  {
    id: 'tip-mask-02',
    text: {
      en: 'Apply masks on clean, slightly damp skin for better absorption',
      hi: 'Mask clean, slightly damp skin पर लगाओ — better absorption होती है',
    },
    category: 'technique',
    relatedTitles: ['purifying mask', 'brightening mask', 'hydrating mask', 'firming mask', 'ubtan brightening mask'],
  },
  {
    id: 'tip-mask-03',
    text: {
      en: 'Honey + curd face pack brightens skin and adds moisture',
      hi: 'Honey + curd face pack skin brighten करता है और moisture देता है',
    },
    category: 'ingredient',
    relatedTitles: ['brightening mask', 'hydrating mask', 'ubtan brightening mask'],
  },

  // ─── BRIGHTENING / DARK SPOTS ───────────────────────────────────────────────
  {
    id: 'tip-bright-01',
    text: {
      en: 'Vitamin C in the morning + sunscreen = dark spot prevention power duo',
      hi: 'Morning में Vitamin C + sunscreen = dark spots prevention की power duo',
    },
    category: 'ingredient',
    relatedTitles: ['brightening treatment', 'spot fading night treatment', 'even tone treatment'],
  },
  {
    id: 'tip-bright-02',
    text: {
      en: 'Lemon juice on skin is too harsh — use formulated vitamin C instead',
      hi: 'Lemon juice skin पर बहुत harsh है — formulated vitamin C use करो',
    },
    category: 'myth-bust',
    relatedTitles: ['brightening treatment', 'even tone treatment'],
  },

  // ─── HYDRATION / DRYNESS ────────────────────────────────────────────────────
  {
    id: 'tip-hydra-01',
    text: {
      en: 'Drink 8 glasses of water — no cream can replace internal hydration',
      hi: '8 glass paani piyo — कोई cream internal hydration replace नहीं कर सकती',
    },
    category: 'habit',
    relatedTitles: ['hydration boost', 'deep nourish', 'moisturise'],
  },
  {
    id: 'tip-hydra-02',
    text: {
      en: 'Coconut oil works as overnight lip balm for dry, cracked lips',
      hi: 'Coconut oil overnight lip balm की तरह काम करता है dry lips के लिए',
    },
    category: 'ingredient',
    relatedTitles: ['deep nourish', 'hydration boost'],
  },

  // ─── ANTI-AGING ─────────────────────────────────────────────────────────────
  {
    id: 'tip-age-01',
    text: {
      en: 'Facial massage for 5 min improves blood flow and skin elasticity',
      hi: '5 min facial massage blood flow बढ़ाता है और skin elasticity improve करता है',
    },
    category: 'technique',
    relatedTitles: ['firming treatment', 'nourishing night treatment', 'firming mask'],
  },
  {
    id: 'tip-age-02',
    text: {
      en: 'Sleep 7-8 hours — it\'s called beauty sleep for a reason',
      hi: '7-8 hours सोओ — इसे beauty sleep कहते हैं एक reason से',
    },
    category: 'habit',
    relatedTitles: ['firming treatment', 'nourishing night treatment'],
  },

  // ─── GENERAL / SEASONAL ─────────────────────────────────────────────────────
  {
    id: 'tip-gen-01',
    text: {
      en: 'Change your pillowcase every 2-3 days to prevent breakouts',
      hi: 'Pillowcase हर 2-3 दिन बदलो — breakouts prevent होंगे',
    },
    category: 'habit',
    relatedTitles: [],
  },
  {
    id: 'tip-gen-02',
    text: {
      en: 'Don\'t touch your face during the day — hands carry bacteria',
      hi: 'दिन में face मत छुओ — हाथों पर bacteria होते हैं',
    },
    category: 'habit',
    relatedTitles: [],
  },
  {
    id: 'tip-gen-03',
    text: {
      en: 'Monsoon humidity? Use a lighter moisturizer to avoid breakouts',
      hi: 'Monsoon humidity? Lighter moisturizer use करो — breakouts से बचोगे',
    },
    category: 'seasonal',
    relatedTitles: ['moisturise'],
  },
  {
    id: 'tip-gen-04',
    text: {
      en: 'Winter dryness? Layer a hydrating serum under your moisturizer',
      hi: 'Winter dryness? Moisturizer के नीचे hydrating serum layer करो',
    },
    category: 'seasonal',
    relatedTitles: ['moisturise', 'hydration boost'],
  },
  {
    id: 'tip-gen-05',
    text: {
      en: 'Your skin renews every 28 days — consistency beats intensity',
      hi: 'Skin हर 28 दिन renew होती है — consistency > intensity',
    },
    category: 'habit',
    relatedTitles: [],
  },
];
