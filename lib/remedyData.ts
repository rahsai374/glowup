import type { Remedy } from './routineData';

export const REMEDY_MAP: Record<string, Remedy[]> = {
  'morning-cleanse-oily': [
      {
        label: 'Besan + rose water',
        how: 'Mix 1 tsp besan with enough rose water to form a paste. Massage gently in circles for 60s, rinse with cold water.',
        why: 'Besan soaks up excess oil like a sponge — nani used it daily because soap strips too much.',
      },
      {
        label: 'Multani mitti quick wash',
        how: 'Mix 1 tsp multani mitti with cold water into a thin paste. Apply, wait 2 mins, splash off. No rubbing needed.',
        why: 'Multani mitti (Fuller\'s earth) pulls oil from pores without drying — used in Indian beauty for centuries.',
      },
      {
        label: 'Rice water rinse',
        how: 'Soak 2 tbsp rice in water for 30 mins. Strain. Splash the milky water on face, massage 30s, rinse.',
        why: 'Rice water has starch that tightens pores and absorbs oil — Korean and Indian grandmothers both swear by it.',
      },
      {
        label: 'Nimbu + honey gentle wash',
        how: 'Mix 4-5 drops nimbu juice with 1 tsp honey. Massage on damp face for 30s, rinse with cold water.',
        why: 'Nimbu cuts through oil while honey keeps skin from getting tight — a perfect balance cleanser.',
      },
    ],

  'morning-cleanse-dry': [
      {
        label: 'Raw milk + honey wash',
        how: 'Mix 1 tbsp raw milk with 4–5 drops of honey. Apply gently, rinse with lukewarm water.',
        why: 'Milk has lactic acid that cleans without stripping — the original gentle cleanser from nani\'s time.',
      },
      {
        label: 'Malai (cream) cleanser',
        how: 'Take fresh malai from boiled milk. Massage on face for 60s, wipe with damp cotton, rinse lightly.',
        why: 'Malai is pure milk fat — it dissolves dirt while leaving skin soft. Every Indian household has it.',
      },
      {
        label: 'Honey + warm water wash',
        how: 'Wet face with warm water. Apply ½ tsp raw honey, massage 30s in circles, rinse with lukewarm water.',
        why: 'Honey is a natural humectant — it cleans while pulling moisture INTO your skin, not out of it.',
      },
      {
        label: 'Curd wash',
        how: 'Apply 1 tbsp fresh curd directly on damp face. Massage gently for 30s, rinse with cool water.',
        why: 'Curd has natural lactic acid that gently exfoliates dead skin while keeping moisture locked in.',
      },
    ],

  'morning-tone-all': [
      {
        label: 'Rose water spritz',
        how: 'Pour chilled rose water into a small spray bottle. Spritz on face or apply with cotton pad after cleansing.',
        why: 'Rose water balances skin pH instantly — it\'s been India\'s #1 toner for generations because it just works.',
      },
      {
        label: 'Green tea toner',
        how: 'Brew 1 green tea bag in ½ cup water, cool completely. Apply with cotton pad or spray bottle. Store in fridge 2–3 days.',
        why: 'Green tea is packed with antioxidants that calm redness and shrink pores — better than most store toners.',
      },
      {
        label: 'Cucumber water toner',
        how: 'Grate ½ cucumber, squeeze juice through cloth. Mix with equal rose water. Apply with cotton pad.',
        why: 'Cucumber juice cools and hydrates on contact — it\'s why nani put cucumber slices on her eyes.',
      },
    ],

  'morning-moisturise-oily': [
      {
        label: 'Fresh aloe vera gel',
        how: 'Scoop fresh gel from an aloe leaf or use store aloe. Apply a thin layer on face, let absorb for 2 mins.',
        why: 'Aloe hydrates without adding oil — it\'s water-based moisture that oily skin actually needs.',
      },
      {
        label: 'Cucumber pulp moisturiser',
        how: 'Blend ¼ cucumber into smooth pulp. Apply thin layer on face, let sit 5 mins, pat dry. No rinse needed.',
        why: 'Cucumber is 95% water — it gives oily skin the hydration it needs without any greasiness.',
      },
      {
        label: 'Rose water + glycerin mist',
        how: 'Mix 1 tsp glycerin with 4 tsp rose water in a spray bottle. Spritz on face after cleansing.',
        why: 'Glycerin draws moisture from the air into your skin — lightweight hydration that won\'t clog pores.',
      },
    ],

  'morning-moisturise-combination': [
      {
        label: 'Aloe vera gel (T-zone focus)',
        how: 'Apply aloe vera gel only on the T-zone (forehead, nose, chin). Use a light touch on cheeks.',
        why: 'Combination skin needs zone treatment — aloe controls oil on the T-zone without drying dry areas.',
      },
      {
        label: 'Cucumber on T-zone, malai on cheeks',
        how: 'Apply cucumber juice on forehead/nose/chin. Dab a tiny bit of malai on cheeks only. Let absorb.',
        why: 'Your T-zone and cheeks have different needs — treating them separately is the smartest approach.',
      },
      {
        label: 'Aloe + honey blend',
        how: 'Mix 1 tsp aloe gel with 2-3 drops honey. Apply all over. Aloe controls oil, honey hydrates dry patches.',
        why: 'Honey adjusts to your skin — it hydrates dry spots without making oily spots worse. Nature\'s balancer.',
      },
    ],

  'morning-moisturise-dry': [
      {
        label: 'Coconut oil + rose water blend',
        how: 'Mix 4–5 drops of coconut oil with 1 tsp rose water in palm. Pat gently onto damp skin.',
        why: 'Coconut oil seals in moisture that rose water delivers — a two-step lock that lasts hours.',
      },
      {
        label: 'Malai moisturiser',
        how: 'Apply thin layer of fresh malai on face. Massage gently upward. Let absorb 5 mins before going out.',
        why: 'Malai is rich in natural fats that repair dry skin\'s moisture barrier — the original Indian moisturiser.',
      },
      {
        label: 'Honey + milk moisturiser',
        how: 'Mix 1 tsp honey with 1 tsp raw milk. Apply on face, massage 30s, let absorb. No rinse needed.',
        why: 'Honey locks moisture in while milk nourishes — Cleopatra bathed in this combo for a reason.',
      },
      {
        label: 'Ghee micro-layer',
        how: 'Warm a tiny drop of desi ghee between fingertips. Pat very lightly onto driest patches (cheeks, under-eyes).',
        why: 'A micro amount of ghee creates a moisture seal that lasts all day — nani\'s winter skin secret.',
      },
    ],

  'morning-moisturise-normal': [
      {
        label: 'Aloe vera + 2 drops coconut oil',
        how: 'Mix aloe vera gel with a tiny amount of coconut oil. Apply evenly and let absorb.',
        why: 'Normal skin just needs light maintenance — aloe hydrates, coconut oil locks it in. Simple and enough.',
      },
      {
        label: 'Rose water + glycerin dab',
        how: 'Mix 2-3 drops glycerin into 1 tsp rose water. Pat onto face with fingertips.',
        why: 'Glycerin is a humectant — it pulls moisture from the air and keeps your skin hydrated for hours.',
      },
      {
        label: 'Honey glow layer',
        how: 'Apply a very thin layer of raw honey on damp face. Let absorb 2 mins. No rinse — it sinks right in.',
        why: 'Honey is antibacterial AND moisturising — it\'s one of the few ingredients that does both at once.',
      },
    ],

  'morning-sunscreen-all': [
      {
        label: 'No homemade substitute',
        how: 'Sunscreen has no reliable gharelu option. Use the ₹180 sunscreen below — it lasts 2–3 months and protects from dark spots & tanning.',
        why: 'UV protection needs specific chemicals or minerals — no kitchen ingredient can block UV rays. This is the one step where store-bought is essential.',
      },
    ],

  'night-cleanse-oily': [
      {
        label: 'Multani mitti wash',
        how: 'Mix 1 tsp multani mitti with rose water. Apply, leave 2 mins, rinse. Removes excess oil without stripping.',
        why: 'After a full day, pores are loaded with oil and dirt — multani mitti pulls it all out like a magnet.',
      },
      {
        label: 'Besan + haldi + curd wash',
        how: 'Mix 1 tsp besan, pinch haldi, 1 tsp curd. Massage on face 60s, rinse with cool water.',
        why: 'This triple combo cleanses, brightens, and softens in one wash — the original 3-in-1 face wash.',
      },
      {
        label: 'Tomato pulp cleanser',
        how: 'Cut a tomato slice, rub directly on oily areas. Leave 2 mins, rinse. Use ripe ones for best effect.',
        why: 'Tomato is naturally acidic — it dissolves the day\'s oil buildup and mildly tightens pores.',
      },
      {
        label: 'Neem water splash',
        how: 'Boil 8-10 neem leaves in 1 cup water for 5 mins. Cool, strain. Splash on face as final rinse after washing.',
        why: 'Neem is antibacterial — this kills the bacteria that cause overnight breakouts on oily skin.',
      },
    ],

  'night-cleanse-dry': [
      {
        label: 'Curd + honey cleanser',
        how: 'Mix 1 tsp fresh curd with 4 drops honey. Massage in, rinse with cool water. Keeps skin soft.',
        why: 'Curd gently dissolves dirt while honey seals moisture — you wake up with softer skin, not tight skin.',
      },
      {
        label: 'Malai + besan gentle wash',
        how: 'Mix ½ tsp malai with 1 tsp besan. Apply, massage 30s, rinse with lukewarm water.',
        why: 'Malai protects while besan cleans — dry skin needs a cleanser that doesn\'t rob its natural oils.',
      },
      {
        label: 'Coconut oil cleanse',
        how: 'Massage 4-5 drops warm coconut oil on face for 60s. Wipe off gently with warm damp cloth.',
        why: 'Oil dissolves oil — coconut oil pulls out dirt and makeup while leaving a thin moisture layer behind.',
      },
    ],

  'night-nourish-oily': [
      {
        label: 'Aloe vera gel overnight',
        how: 'Apply fresh aloe vera gel as a thin layer before sleep. Wipe off excess in morning if needed.',
        why: 'Aloe repairs skin overnight without adding oil — oily skin heals faster when it\'s hydrated, not greasy.',
      },
      {
        label: 'Cucumber juice overnight',
        how: 'Apply fresh cucumber juice with cotton pad before bed. Let it dry naturally — no rinse.',
        why: 'Cucumber cools inflammation and hydrates while you sleep — great for oily skin that gets red or irritated.',
      },
      {
        label: 'Tomato juice thin layer',
        how: 'Apply thin layer of fresh tomato juice on face before bed. Let dry, sleep. Wash off in morning.',
        why: 'Tomato has lycopene that repairs sun damage overnight and controls next-day oil production.',
      },
    ],

  'night-nourish-dry': [
      {
        label: 'Warm coconut oil massage',
        how: 'Warm a few drops of coconut oil between palms. Massage upward on face for 2–3 mins before sleep.',
        why: 'Coconut oil penetrates skin better than most oils — it repairs the moisture barrier overnight while you sleep.',
      },
      {
        label: 'Ghee face massage',
        how: 'Warm 2-3 drops of desi ghee between fingers. Massage onto face in upward strokes. Sleep with it.',
        why: 'Ghee has been used for dry skin since Ayurvedic times — its fatty acids are almost identical to skin\'s natural oils.',
      },
      {
        label: 'Honey overnight mask',
        how: 'Apply a thin layer of raw honey on face before bed. Sleep with it on, wash off in morning.',
        why: 'Honey pulls moisture from the air into your skin all night — you wake up plump, not flaky.',
      },
      {
        label: 'Malai + honey night pack',
        how: 'Mix 1 tsp malai with ½ tsp honey. Apply before bed. Wash off in morning with lukewarm water.',
        why: 'Malai\'s fats + honey\'s moisture-locking = the richest overnight treatment from any Indian kitchen.',
      },
    ],

  'night-nourish-normal': [
      {
        label: 'Aloe vera + coconut oil blend',
        how: 'Mix 1 tsp aloe gel with 2 drops coconut oil. Apply evenly and sleep.',
        why: 'Aloe hydrates the surface while coconut oil works deeper — a light combo that\'s enough for normal skin.',
      },
      {
        label: 'Honey thin layer',
        how: 'Apply a very thin layer of raw honey on face. Let absorb 2 mins, then sleep. Wash off in morning.',
        why: 'Honey is antibacterial and moisturising — it maintains normal skin\'s balance without making it oily or dry.',
      },
      {
        label: 'Milk + rose water night mist',
        how: 'Mix 1 tsp raw milk with 1 tsp rose water. Pat on face with cotton pad before bed.',
        why: 'Milk nourishes and rose water tones — a gentle overnight treatment that keeps normal skin glowing.',
      },
    ],

  'weekly-exfoliate-oily': [
      {
        label: 'Multani mitti + neem mask',
        how: 'Mix 2 tsp multani mitti, 1 tsp neem powder, rose water. Apply, leave 10 mins, rinse. Do once a week max.',
        why: 'Weekly deep clean pulls out embedded oil and dead skin that daily washing misses — like a reset button for pores.',
      },
      {
        label: 'Rice flour + curd scrub',
        how: 'Mix 1 tsp rice flour (chawal ka aata) with 1 tbsp curd. Scrub in circles for 30s. Rinse with cool water.',
        why: 'Rice flour is a gentle physical exfoliant — it removes dead skin without scratching like harsh scrubs do.',
      },
      {
        label: 'Besan + nimbu + haldi scrub',
        how: 'Mix 2 tsp besan, pinch haldi, 4 drops nimbu juice, enough water. Scrub gently, leave 5 mins, rinse.',
        why: 'Besan exfoliates, nimbu dissolves dead cells, haldi brightens — the classic Indian weekly facial scrub.',
      },
      {
        label: 'Sugar + honey polish',
        how: 'Mix 1 tsp fine sugar with 1 tsp honey. Scrub very gently on damp face for 20s only. Rinse immediately.',
        why: 'Sugar dissolves as you scrub so it gets gentler over time — impossible to over-scrub with this one.',
      },
    ],

  'weekly-exfoliate-dry': [
      {
        label: 'Curd + sugar scrub',
        how: 'Mix 1 tsp sugar with 1 tbsp curd. Gently scrub in circles for 30–45s. Rinse. Do once a week only.',
        why: 'Sugar\'s round crystals exfoliate gently while curd\'s lactic acid dissolves dead skin — double action, no damage.',
      },
      {
        label: 'Malai + besan gentle scrub',
        how: 'Mix 1 tsp besan with 1 tsp malai. Massage in circular motions for 30s. Rinse with lukewarm water.',
        why: 'Besan lifts dead skin while malai cushions and nourishes — exfoliation without the dryness that follows.',
      },
      {
        label: 'Oat flour + honey mask',
        how: 'Grind 1 tbsp oats into powder. Mix with 1 tsp honey and splash of milk. Apply, leave 10 mins, scrub off gently.',
        why: 'Oats soothe while gently buffing — they\'re used in eczema creams for a reason. Safest exfoliant for dry skin.',
      },
    ],

  'morning-acne-spot-oily': [
      {
        label: 'Neem + haldi paste on spots',
        how: 'Mix a pinch of haldi with neem powder and water. Apply only on pimples, leave 10 mins, rinse before moisturizer.',
        why: 'Neem kills acne bacteria, haldi reduces the redness — this combo attacks pimples from two sides at once.',
      },
      {
        label: 'Haldi + honey spot dab',
        how: 'Mix pinch of haldi with 2-3 drops raw honey. Dab on each pimple with clean finger. Leave 15 mins, rinse.',
        why: 'Haldi is antiseptic and honey is antibacterial — together they fight the infection without drying surrounding skin.',
      },
      {
        label: 'Garlic spot touch',
        how: 'Cut garlic clove in half. Touch the cut side on each pimple for 5 seconds only. Rinse after 5 mins.',
        why: 'Garlic has allicin — a powerful natural antibiotic. Just a touch kills bacteria. Don\'t leave it on long.',
      },
      {
        label: 'Neem leaf paste',
        how: 'Crush 5-6 fresh neem leaves with few drops water. Apply only on active pimples. Leave 10 mins, rinse.',
        why: 'Fresh neem leaves are stronger than powder — they\'ve been the village acne treatment for centuries.',
      },
    ],

  'morning-acne-spot-dry': [
      {
        label: 'Honey + neem paste spot dot',
        how: 'Crush 4–5 fresh neem leaves into a paste (or use neem powder). Mix with 1 tsp honey. Dab on spots, leave 15 mins, rinse.',
        why: 'Honey keeps dry skin moisturised while neem fights the pimple — you treat acne without making dryness worse.',
      },
      {
        label: 'Honey + haldi healing dot',
        how: 'Mix 1 tsp honey with a tiny pinch of haldi. Dab on spots only. Leave 20 mins, rinse gently.',
        why: 'Honey heals and haldi reduces swelling — this gentle combo won\'t dry out already-dry skin.',
      },
      {
        label: 'Aloe vera spot gel',
        how: 'Apply fresh aloe vera gel directly on pimples. Let it absorb — no rinse needed. Reapply if needed.',
        why: 'Aloe has salicylic acid naturally — it fights acne while soothing and hydrating dry skin patches.',
      },
    ],

  'night-acne-mask': [
      {
        label: 'Vicco turmeric overnight spot',
        how: 'Apply a thin layer of Vicco turmeric cream on problem areas. Its natural antiseptic formula works overnight.',
        why: 'Vicco has been India\'s trusted turmeric cream for decades — it fights bacteria while you sleep.',
      },
    ],

  'weekly-acne-mask': [
      {
        label: 'Multani mitti + neem + haldi',
        how: 'Mix 2 tsp multani mitti, 1 tsp neem powder, pinch of haldi, rose water. Apply 10–12 mins. Rinse with cold water.',
        why: 'This trinity — clay to absorb, neem to kill bacteria, haldi to heal — is the gold standard acne mask.',
      },
      {
        label: 'Besan + neem + curd mask',
        how: 'Mix 2 tsp besan, ½ tsp neem powder, 1 tbsp curd. Apply evenly. Leave 12 mins, rinse with cool water.',
        why: 'Curd\'s lactic acid unclogs pores while neem disinfects and besan absorbs — a full purifying treatment.',
      },
      {
        label: 'Haldi + honey + nimbu mask',
        how: 'Mix 1 tsp haldi, 1 tsp honey, 3 drops nimbu juice. Apply on acne areas. Leave 10 mins, rinse.',
        why: 'Nimbu\'s acid dissolves the gunk, haldi fights infection, honey heals — all from your kitchen shelf.',
      },
      {
        label: 'Tomato + multani mitti mask',
        how: 'Mix 1 tbsp tomato pulp with 1 tsp multani mitti. Apply, leave 10 mins, rinse with cold water.',
        why: 'Tomato\'s natural acids shrink active pimples while multani mitti dries out excess oil in one session.',
      },
    ],

  'morning-dark-spots-treatment': [
      {
        label: 'Potato juice + rose water',
        how: 'Grate 1 potato, squeeze juice. Mix with equal rose water. Apply with cotton on dark spots, leave 15 mins, rinse.',
        why: 'Potato has catecholase enzyme that naturally lightens dark patches — grandmothers used this long before serums existed.',
      },
      {
        label: 'Nimbu + honey brightener',
        how: 'Mix 3-4 drops nimbu juice with 1 tsp honey. Apply only on dark spots. Leave 10 mins, rinse. Always use sunscreen after.',
        why: 'Nimbu\'s vitamin C fades melanin deposits while honey prevents the irritation that pure lemon would cause.',
      },
      {
        label: 'Tomato slice rub',
        how: 'Cut a ripe tomato slice. Rub directly on dark spots for 30s. Leave juice on for 10 mins, rinse.',
        why: 'Tomato has lycopene + mild acids that lighten spots gradually — one of the easiest remedies to do daily.',
      },
      {
        label: 'Curd + haldi spot paste',
        how: 'Mix 1 tsp curd with pinch haldi. Apply on spots only. Leave 15 mins, rinse with cool water.',
        why: 'Curd\'s lactic acid exfoliates the dark layer while haldi inhibits melanin production — double fade action.',
      },
    ],

  'night-dark-spots-treatment': [
      {
        label: 'Haldi + honey paste on spots',
        how: 'Mix a pinch of haldi with raw honey. Dab only on dark spots. Leave overnight or 30 mins, rinse.',
        why: 'Haldi blocks the enzyme that makes dark spots darker — overnight application gives it hours to work.',
      },
      {
        label: 'Potato juice overnight',
        how: 'Apply fresh potato juice on dark spots with cotton. Let dry, sleep with it on. Wash off in morning.',
        why: 'Potato\'s bleaching enzymes work best with extended contact — overnight is when they fade spots most.',
      },
      {
        label: 'Aloe vera + nimbu night spot',
        how: 'Mix 1 tsp aloe gel with 2 drops nimbu juice. Apply on spots before bed. Wash off in morning.',
        why: 'Aloe heals while nimbu lightens — the aloe buffer makes nimbu safe enough for overnight use.',
      },
    ],

  'weekly-dark-spots-mask': [
      {
        label: 'Papaya pulp mask',
        how: 'Mash ripe papaya and apply as a face mask. Leave 15 mins. Papaya enzymes gently brighten skin.',
        why: 'Papaya has papain enzyme that dissolves dead, darkened skin cells — a natural chemical peel from fruit.',
      },
      {
        label: 'Besan + nimbu + curd brightening ubtan',
        how: 'Mix 2 tsp besan, 1 tsp curd, 3 drops nimbu. Apply, leave 15 mins, scrub off with wet fingers.',
        why: 'Ubtan has been the Indian bride\'s secret for centuries — the combo exfoliates, lightens, and softens in one step.',
      },
      {
        label: 'Potato + besan mask',
        how: 'Mix 1 tbsp potato juice with 1 tsp besan. Apply, leave 15 mins. Rinse when dry.',
        why: 'Potato lightens while besan scrubs away the dark layer — a deeper treatment than either one alone.',
      },
      {
        label: 'Tomato + honey glow mask',
        how: 'Blend ½ tomato into pulp, mix with 1 tsp honey. Apply, leave 15 mins, rinse with cool water.',
        why: 'Tomato\'s acids brighten dark spots while honey soothes — your face looks visibly lighter after just one use.',
      },
    ],

  'morning-pigmentation-treatment': [
      {
        label: 'Haldi + nimbu spot treatment',
        how: 'Mix ½ tsp haldi with 4–5 drops nimbu juice. Apply on pigmented patches only, leave 10 mins, rinse. Do before sunscreen.',
        why: 'Haldi blocks tyrosinase (the enzyme that makes pigment) while nimbu\'s vitamin C fades existing colour.',
      },
      {
        label: 'Potato juice on patches',
        how: 'Apply fresh potato juice directly on pigmented areas with cotton. Leave 15 mins, rinse.',
        why: 'Potato\'s catecholase enzyme is a natural skin lightener — consistent daily use shows results in 2-3 weeks.',
      },
      {
        label: 'Curd + besan morning ubtan',
        how: 'Mix 1 tsp besan with 1 tsp curd. Apply on uneven patches for 10 mins. Rinse before moisturiser.',
        why: 'Curd dissolves the pigmented dead layer while besan gently buffs it away — mild enough for daily use.',
      },
    ],

  'night-pigmentation-treatment': [
      {
        label: 'Besan + haldi + curd ubtan',
        how: 'Mix 1 tsp besan, pinch haldi, 1 tsp curd. Apply to face, leave 20 mins, rinse with gentle circular scrubbing. Classic Indian ubtan.',
        why: 'The classic ubtan recipe works because each ingredient targets pigment differently — exfoliate, inhibit, nourish.',
      },
      {
        label: 'Haldi + honey overnight',
        how: 'Mix ½ tsp haldi with 1 tsp honey. Apply on pigmented areas. Leave overnight, wash off in morning.',
        why: 'Extended haldi contact gives curcumin hours to suppress melanin production — night is when this works hardest.',
      },
      {
        label: 'Tomato + curd even-tone pack',
        how: 'Mix 1 tbsp tomato pulp with 1 tbsp curd. Apply on face, focus on dark patches. Leave 15 mins, rinse.',
        why: 'Tomato has natural acids + antioxidants that fade uneven tone while curd softens and preps skin for absorption.',
      },
    ],

  'weekly-pigmentation-mask': [
      {
        label: 'Besan + haldi + honey ubtan',
        how: 'Mix 2 tsp besan, pinch haldi, 1 tsp honey, splash of raw milk. Apply thickly, dry 15 mins, scrub off gently with wet fingers.',
        why: 'This is the Haldi ceremony ubtan — brides have used it for centuries to get even, glowing skin before the wedding.',
      },
      {
        label: 'Rice flour + curd + nimbu brightener',
        how: 'Mix 1 tsp rice flour, 1 tbsp curd, 3 drops nimbu. Apply, leave 12 mins. Scrub off in circular motions.',
        why: 'Rice flour has kojic acid — a natural pigment inhibitor. With curd and nimbu, it\'s a proper brightening treatment.',
      },
      {
        label: 'Potato + multani mitti deep mask',
        how: 'Mix 2 tbsp potato juice with 1 tsp multani mitti. Apply thickly on pigmented areas. Leave 15 mins, rinse.',
        why: 'This draws out embedded pigment from deeper skin layers — what weekly treatments are meant to do.',
      },
      {
        label: 'Chandan + haldi + milk paste',
        how: 'Mix 1 tsp chandan powder, pinch haldi, enough raw milk to make paste. Apply, leave 15 mins, rinse.',
        why: 'Chandan (sandalwood) has been the queen of Indian brightening since ancient times — it cools and evens out patches.',
      },
    ],

  'morning-dryness-treatment': [
      {
        label: 'Glycerin + rose water',
        how: 'Mix 3 drops of glycerin (₹30 at any chemist) with rose water. Pat on damp skin before moisturizer.',
        why: 'Glycerin is a humectant — it pulls moisture from the air into your skin. Best applied on damp skin to seal water in.',
      },
      {
        label: 'Honey hydration layer',
        how: 'Apply thin layer of raw honey on damp face. Wait 2 mins for it to absorb. Apply moisturiser on top.',
        why: 'Honey attracts and holds water molecules — it\'s a natural humectant that hydrates better than most serums.',
      },
      {
        label: 'Malai morning boost',
        how: 'Dab a tiny amount of fresh malai on driest areas (cheeks, under-eyes). Pat gently, let absorb before moisturiser.',
        why: 'Malai creates a fat barrier that prevents the moisture underneath from evaporating — nature\'s occlusive.',
      },
    ],

  'night-dryness-treatment': [
      {
        label: 'Warm coconut + almond oil blend',
        how: 'Mix equal parts coconut oil and almond oil. Warm slightly. Massage onto face in upward strokes. Sleep with it on.',
        why: 'Two oils together are better than one — coconut penetrates deep while almond nourishes the surface.',
      },
      {
        label: 'Ghee + honey night mask',
        how: 'Mix 2-3 drops warm ghee with ½ tsp honey. Apply on face before bed. Wash off in morning.',
        why: 'Ghee restores fat that dry skin is missing while honey locks in water — the two things dry skin needs most.',
      },
      {
        label: 'Coconut oil + rose water massage',
        how: 'Mix 4-5 drops coconut oil with 1 tsp rose water. Massage into face for 2 mins before bed. Sleep with it.',
        why: 'Night is when skin repairs itself — giving it oil + hydration before bed supercharges that natural repair process.',
      },
    ],

  'weekly-dryness-mask': [
      {
        label: 'Curd + honey + aloe mask',
        how: 'Mix 1 tbsp curd, 1 tsp honey, 1 tsp aloe vera gel. Apply thickly. Leave 20 mins, rinse with cool water.',
        why: 'Three hydrators working together — curd feeds, honey locks, aloe soothes. One weekly session replaces expensive facials.',
      },
      {
        label: 'Banana + honey + malai mask',
        how: 'Mash ½ ripe banana with 1 tsp honey and 1 tsp malai. Apply thick layer, leave 15 mins, rinse with lukewarm water.',
        why: 'Banana is loaded with potassium that heals cracked, dry skin — mixed with fats it\'s the richest home mask possible.',
      },
      {
        label: 'Avocado + honey mask',
        how: 'Mash ¼ ripe avocado with 1 tsp honey. Apply thickly, leave 15 mins, rinse. Use only when avocado is available.',
        why: 'Avocado has healthy fats nearly identical to skin\'s own oils — it repairs the moisture barrier in one sitting.',
      },
      {
        label: 'Coconut oil + besan nourishing pack',
        how: 'Mix 1 tsp besan with 1 tsp coconut oil and splash of milk. Apply, leave 15 mins. Rinse with lukewarm water.',
        why: 'Besan gently removes flaky dead skin while coconut oil deeply nourishes what\'s underneath — exfoliate + feed.',
      },
    ],

  'morning-anti-aging-treatment': [
      {
        label: 'Upward facial massage with almond oil',
        how: 'Warm 3–4 drops almond oil between palms. Using fingertips, massage in upward circular motions for 3 mins. Improves circulation.',
        why: 'Upward massage fights gravity\'s pull on skin — almond oil\'s vitamin E repairs while the motion firms.',
      },
      {
        label: 'Coconut oil + upward massage',
        how: 'Warm 3-4 drops coconut oil. Massage face in upward strokes from chin to forehead for 3 mins.',
        why: 'Daily upward massage boosts blood flow — it\'s the cheapest anti-aging tool and coconut oil feeds skin while you do it.',
      },
      {
        label: 'Honey firming layer',
        how: 'Apply thin layer of raw honey on face. Leave 10 mins, then rinse. Do before moisturiser.',
        why: 'Honey has antioxidants that fight the free radicals causing wrinkles — plus it plumps skin with moisture.',
      },
    ],

  'night-anti-aging-treatment': [
      {
        label: 'Coconut oil night massage',
        how: 'Warm 4-5 drops coconut oil. Massage face in upward strokes for 3 mins before bed. Sleep with it on.',
        why: 'Coconut oil penetrates deep and its lauric acid stimulates collagen — the protein that keeps skin firm.',
      },
      {
        label: 'Ghee + haldi night repair',
        how: 'Mix 2 drops warm ghee with a tiny pinch of haldi. Apply on face, massage upward. Sleep with it.',
        why: 'Ghee repairs skin\'s fat layer while haldi\'s curcumin is anti-inflammatory — Ayurveda\'s anti-aging duo.',
      },
      {
        label: 'Almond oil overnight',
        how: 'Apply 3-4 drops almond oil (badam tel) on face before bed. Massage gently in upward strokes.',
        why: 'Almond oil has vitamin E — the most proven nutrient for skin repair. Overnight use gives it time to work deep.',
      },
    ],

  'weekly-anti-aging-mask': [
      {
        label: 'Egg white + honey mask',
        how: 'Beat 1 egg white with 1 tsp honey. Apply in upward strokes. Leave until dry (10–12 mins). Rinse with cool water.',
        why: 'Egg white tightens instantly as it dries — it\'s the original face-lift mask. Honey adds nourishment so it\'s not just tightening.',
      },
      {
        label: 'Banana + honey + curd mask',
        how: 'Mash ½ ripe banana with 1 tsp honey and 1 tsp curd. Apply thickly. Leave 15 mins, rinse.',
        why: 'Banana has silica that firms skin + potassium that hydrates — mixed with honey and curd it\'s a full anti-aging facial.',
      },
      {
        label: 'Besan + malai + haldi firming pack',
        how: 'Mix 2 tsp besan, 1 tsp malai, pinch haldi. Apply, leave until half dry (8 mins), rinse with lukewarm water.',
        why: 'This ubtan variation tightens as it dries while malai nourishes — your skin feels firmer and softer at the same time.',
      },
    ],

};
