export const MOCK_USER = {
  name: 'Naina',
  phone: '+91 98765 43210',
  lastScanScore: 78,
  lastScanDate: 'Today',
  skinType: 'Combination',
  skinTypeHi: 'मिश्रित',
  concerns: ['pigmentation', 'dark_spots', 'acne']
};

export const SKIN_ISSUES = [
{
  id: 'acne',
  labelEn: 'Acne',
  labelHi: 'मुंहासे',
  severity: 'mild',
  score: 85
},
{
  id: 'dark_spots',
  labelEn: 'Dark Spots',
  labelHi: 'काले धब्बे',
  severity: 'moderate',
  score: 65
},
{
  id: 'pores',
  labelEn: 'Pores',
  labelHi: 'रोमछिद्र',
  severity: 'mild',
  score: 80
},
{
  id: 'pigmentation',
  labelEn: 'Pigmentation',
  labelHi: 'झाइयां',
  severity: 'attention',
  score: 45
},
{
  id: 'under_eye',
  labelEn: 'Under-eye',
  labelHi: 'डार्क सर्कल',
  severity: 'mild',
  score: 75
},
{
  id: 'wrinkles',
  labelEn: 'Wrinkles',
  labelHi: 'झुर्रियां',
  severity: 'none',
  score: 95
}];


// Latest personalized insights for the user (computed from their last scan)
export const LATEST_INSIGHTS = [
{
  id: 'top-concern',
  labelEn: 'Top Concern',
  labelHi: 'मुख्य समस्या',
  valueEn: 'Pigmentation',
  valueHi: 'झाइयां',
  detailEn: 'Needs attention on cheeks and forehead',
  detailHi: 'गाल और माथे पर ध्यान देना है',
  icon: '⚠️',
  accent: 'bg-[#FFE8DC] border-[#F5C8AC]',
  iconBg: 'bg-[#E07856]'
},
{
  id: 'biggest-win',
  labelEn: 'Biggest Win',
  labelHi: 'सबसे बड़ी जीत',
  valueEn: 'Wrinkles Clear',
  valueHi: 'झुर्रियां साफ़',
  detailEn: 'Your skin shows no aging signs yet',
  detailHi: 'आपकी त्वचा में अभी उम्र के निशान नहीं हैं',
  icon: '🎉',
  accent: 'bg-[#F2E6CC] border-[#DCC9A0]',
  iconBg: 'bg-[#B89968]'
},
{
  id: 'hydration',
  labelEn: 'Hydration',
  labelHi: 'नमी',
  valueEn: '72%',
  valueHi: '72%',
  detailEn: 'Slightly below ideal — drink more water',
  detailHi: 'थोड़ी कम — ज़्यादा पानी पिएं',
  icon: '💧',
  accent: 'bg-[#E5EBE3] border-[#C2D0BC]',
  iconBg: 'bg-[#7A9075]'
},
{
  id: 'improvement',
  labelEn: 'Weekly Change',
  labelHi: 'इस हफ़्ते का बदलाव',
  valueEn: '+4 points',
  valueHi: '+4 अंक',
  detailEn: 'Score went from 74 → 78 this week',
  detailHi: 'इस हफ़्ते स्कोर 74 से 78 हो गया',
  icon: '📈',
  accent: 'bg-[#F5DDD2] border-[#E5BFAE]',
  iconBg: 'bg-[#C77968]'
}];


// Skin concerns library — matches the reference card grid
export const SKIN_CONCERNS = [
{
  id: 'sun_damage',
  titleEn: 'Sun Damage',
  titleHi: 'धूप से नुकसान',
  descEn:
  'Sunburn, ageing, pigmentation, and dryness due to long sun exposure.',
  descHi: 'लंबे समय धूप में रहने से जलन, झाइयां और रूखी त्वचा।',
  bgColor: 'bg-[#E8E6E1]',
  image:
  'https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=400&h=500'
},
{
  id: 'acne',
  titleEn: 'Acne',
  titleHi: 'मुंहासे',
  descEn:
  'Inflammation and breakouts due to pores getting clogged with oil and dead skin.',
  descHi: 'रोमछिद्रों में तेल और मृत त्वचा जमने से सूजन और मुंहासे।',
  bgColor: 'bg-[#F5E6D3]',
  image:
  'https://images.unsplash.com/photo-1581824283135-0666cf353f35?auto=format&fit=crop&q=80&w=400&h=500'
},
{
  id: 'pigmentation',
  titleEn: 'Pigmentation & Dark Spots',
  titleHi: 'झाइयां और काले धब्बे',
  descEn:
  'Pigmentation disorders cause changes to the color and tone of the skin.',
  descHi: 'झाइयों की वजह से त्वचा का रंग और बनावट बदलने लगती है।',
  bgColor: 'bg-[#D6E4DE]',
  image:
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400&h=500'
},
{
  id: 'sensitivity',
  titleEn: 'Sensitivity',
  titleHi: 'संवेदनशीलता',
  descEn:
  'Redness, irritation and itching caused by a weakened skin barrier.',
  descHi: 'त्वचा की कमज़ोर परत से लालिमा, जलन और खुजली होती है।',
  bgColor: 'bg-[#F5D9D5]',
  image:
  'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&q=80&w=400&h=500'
},
{
  id: 'ageing',
  titleEn: 'Skin Ageing',
  titleHi: 'उम्र के निशान',
  descEn: 'Fine lines, wrinkles and loss of elasticity.',
  descHi: 'महीन रेखाएं, झुर्रियां और त्वचा का ढीलापन।',
  bgColor: 'bg-[#DCDCDC]',
  image:
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400&h=500'
},
{
  id: 'dryness',
  titleEn: 'Dryness',
  titleHi: 'रूखापन',
  descEn: 'Loss of moisture and naturally occurring oils.',
  descHi: 'त्वचा से नमी और प्राकृतिक तेल कम होना।',
  bgColor: 'bg-[#E5E5E5]',
  image:
  'https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa?auto=format&fit=crop&q=80&w=400&h=500'
},
{
  id: 'dullness',
  titleEn: 'Dullness',
  titleHi: 'बेजान त्वचा',
  descEn: 'Dry and patchy skin with reduced radiance and glow.',
  descHi: 'सूखी और बेरंग त्वचा जिसमें चमक कम हो जाती है।',
  bgColor: 'bg-[#F5E6D3]',
  image:
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=500'
}];


// Skin types library — matches the reference second row
export const SKIN_TYPES_LIBRARY = [
{
  id: 'oily',
  titleEn: 'Oily Skin',
  titleHi: 'तैलीय त्वचा',
  descEn: 'Greasy with enlarged pores, blackheads and blemishes.',
  descHi: 'चिकनी, बड़े रोमछिद्र, ब्लैकहेड्स और दाग।',
  bgColor: 'bg-[#F5D5DC]',
  image:
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400&h=400'
},
{
  id: 'combination',
  titleEn: 'Combination Skin',
  titleHi: 'मिश्रित त्वचा',
  descEn: 'Oily forehead, nose and chin but drier around the cheeks.',
  descHi: 'माथा, नाक और ठोड़ी पर तेल लेकिन गालों पर सूखापन।',
  bgColor: 'bg-[#D4C4B0]',
  image:
  'https://images.unsplash.com/photo-1614859275352-b1380a5bd9e1?auto=format&fit=crop&q=80&w=400&h=400'
},
{
  id: 'normal',
  titleEn: 'Normal Skin',
  titleHi: 'सामान्य त्वचा',
  descEn: 'Neither too dry, nor too oily, with even tone and smooth texture.',
  descHi: 'न ज़्यादा सूखी, न ज़्यादा तैलीय, समान रंगत और मुलायम बनावट।',
  bgColor: 'bg-[#F5C9A0]',
  image:
  'https://images.unsplash.com/photo-1567604130959-7ea7ab2a7e7c?auto=format&fit=crop&q=80&w=400&h=400'
},
{
  id: 'dry',
  titleEn: 'Dry Skin',
  titleHi: 'सूखी त्वचा',
  descEn:
  'Dull, dehydrated, almost invisible pores and unable to retain moisture.',
  descHi: 'बेजान, सूखी त्वचा जो नमी नहीं रोक पाती।',
  bgColor: 'bg-[#E8C8A5]',
  image:
  'https://images.unsplash.com/photo-1559535332-db9b89a8e0a4?auto=format&fit=crop&q=80&w=400&h=400'
}];


export const ROUTINE_STEPS = {
  morning: [
  {
    id: 'm1',
    step: 1,
    titleEn: 'Gentle Cleansing',
    titleHi: 'चेहरा साफ़ करें',
    descEn: 'Removes overnight oil and dirt without drying your skin.',
    descHi: 'रात भर का तेल और गंदगी हटाता है, त्वचा को रूखा किए बिना।',
    product: {
      name: 'Himalaya Purifying Neem Face Wash',
      price: 95,
      image: '🌿',
      tag: 'Available at local medical store'
    }
  },
  {
    id: 'm2',
    step: 2,
    titleEn: 'Moisturize',
    titleHi: 'नमी दें',
    descEn: 'Keeps skin hydrated and protects the skin barrier.',
    descHi: 'त्वचा को हाइड्रेटेड रखता है और सुरक्षित रखता है।',
    product: {
      name: 'Nivea Soft Light Moisturizer',
      price: 75,
      image: '💧',
      tag: 'Available at kirana store'
    }
  },
  {
    id: 'm3',
    step: 3,
    titleEn: 'Sun Protection',
    titleHi: 'धूप से बचाव',
    descEn: 'Crucial for preventing dark spots and pigmentation.',
    descHi: 'काले धब्बे और झाइयों को रोकने के लिए बहुत ज़रूरी है।',
    product: {
      name: 'Lakmé Sun Expert SPF 50',
      price: 275,
      image: '☀️',
      tag: 'Available at local medical store'
    }
  }],

  night: [
  {
    id: 'n1',
    step: 1,
    titleEn: 'Deep Cleanse',
    titleHi: 'गहरी सफाई',
    descEn: 'Wash away daily pollution and sunscreen.',
    descHi: 'दिन भर का प्रदूषण और सनस्क्रीन धो लें।',
    product: {
      name: 'Himalaya Purifying Neem Face Wash',
      price: 95,
      image: '🌿',
      tag: 'Available at local medical store'
    }
  },
  {
    id: 'n2',
    step: 2,
    titleEn: 'Repair & Nourish',
    titleHi: 'मरम्मत और पोषण',
    descEn: 'Helps skin heal and reduces pigmentation overnight.',
    descHi: 'रात भर में त्वचा को ठीक करने और झाइयां कम करने में मदद करता है।',
    product: {
      name: "Pond's Super Light Gel",
      price: 100,
      image: '🌙',
      tag: 'Available at kirana store'
    }
  }],

  weekly: [
  {
    id: 'w1',
    step: 1,
    titleEn: 'Face Pack',
    titleHi: 'फेस पैक',
    descEn: 'Use once a week for glowing skin and tightening pores.',
    descHi:
    'चमकदार त्वचा और रोमछिद्रों को कसने के लिए हफ्ते में एक बार इस्तेमाल करें।',
    product: {
      name: "Banjara's Multani Mitti",
      price: 50,
      image: '✨',
      tag: 'Available at local medical store'
    }
  }]

};

export const TIPS = [
{
  id: 1,
  categoryEn: 'Daily Tip',
  categoryHi: 'आज का सुझाव',
  titleEn: 'Drink 8 glasses of water',
  titleHi: '8 गिलास पानी पिएं',
  descEn:
  'Hydration starts from within. Drinking enough water gives your skin a natural glow.',
  descHi:
  'हाइड्रेशन अंदर से शुरू होता है। पर्याप्त पानी पीने से आपकी त्वचा में प्राकृतिक चमक आती है।',
  icon: '💧'
},
{
  id: 2,
  categoryEn: 'Seasonal Tip',
  categoryHi: 'मौसम के अनुसार',
  titleEn: 'Prevent Monsoon Acne',
  titleHi: 'मानसून में मुंहासे कैसे रोकें',
  descEn:
  'Humidity increases oil production. Wash your face twice a day with a neem-based cleanser.',
  descHi:
  'नमी से तेल बढ़ता है। दिन में दो बार नीम वाले क्लींजर से अपना चेहरा धोएं।',
  icon: '🌧️'
},
{
  id: 3,
  categoryEn: 'Ingredient Focus',
  categoryHi: 'सामग्री की जानकारी',
  titleEn: 'What is Multani Mitti?',
  titleHi: 'मुल्तानी मिट्टी क्या है?',
  descEn:
  'A natural clay that absorbs excess oil and cleanses pores deeply. Great for oily skin.',
  descHi:
  'एक प्राकृतिक मिट्टी जो अतिरिक्त तेल को सोखती है और रोमछिद्रों को गहराई से साफ करती है। तैलीय त्वचा के लिए बेहतरीन।',
  icon: '🏺'
},
{
  id: 4,
  categoryEn: 'Myth Buster',
  categoryHi: 'गलतफहमी दूर करें',
  titleEn: 'Toothpaste does NOT cure pimples',
  titleHi: 'टूथपेस्ट से पिंपल नहीं जाते',
  descEn:
  'Toothpaste irritates skin and can cause burns. Use salicylic acid spot treatments instead.',
  descHi:
  'टूथपेस्ट त्वचा में जलन पैदा करता है। इसके बजाय सैलिसिलिक एसिड वाला स्पॉट ट्रीटमेंट लगाएं।',
  icon: '🚫'
},
{
  id: 5,
  categoryEn: 'Daily Tip',
  categoryHi: 'आज का सुझाव',
  titleEn: 'Never skip sunscreen indoors',
  titleHi: 'घर के अंदर भी सनस्क्रीन लगाएं',
  descEn:
  'UV rays come through windows. Apply SPF 30+ every morning, even when staying inside.',
  descHi:
  'UV किरणें खिड़कियों से भी आती हैं। हर सुबह SPF 30+ लगाएं, चाहे घर पर ही क्यों न हों।',
  icon: '☀️'
},
{
  id: 6,
  categoryEn: 'Ingredient Focus',
  categoryHi: 'सामग्री की जानकारी',
  titleEn: 'Niacinamide kya hai?',
  titleHi: 'नियासिनामाइड क्या है?',
  descEn:
  'Vitamin B3 that reduces dark spots, controls oil, and shrinks pores. Safe for all skin types.',
  descHi:
  'विटामिन B3 जो काले धब्बे कम करता है, तेल नियंत्रित करता है और रोमछिद्र छोटे करता है।',
  icon: '🧪'
},
{
  id: 7,
  categoryEn: 'Diet Tip',
  categoryHi: 'खानपान की सलाह',
  titleEn: 'Eat amla for glowing skin',
  titleHi: 'चमकती त्वचा के लिए आंवला खाएं',
  descEn:
  'Amla is packed with Vitamin C — boosts collagen and fights dark spots from within.',
  descHi:
  'आंवले में विटामिन C भरपूर होता है — कोलेजन बढ़ाता है और अंदर से दाग-धब्बे मिटाता है।',
  icon: '🍃'
},
{
  id: 8,
  categoryEn: 'Seasonal Tip',
  categoryHi: 'मौसम के अनुसार',
  titleEn: 'Winter dryness fix',
  titleHi: 'सर्दियों की रूखी त्वचा का इलाज',
  descEn:
  'Switch to a thicker cream like Nivea Creme or Vaseline at night. Avoid hot showers.',
  descHi:
  'रात को निविया क्रीम या वैसलीन जैसी गाढ़ी क्रीम लगाएं। गरम पानी से न नहाएं।',
  icon: '❄️'
},
{
  id: 9,
  categoryEn: 'Habit Tip',
  categoryHi: 'आदत बदलें',
  titleEn: 'Change pillowcase every 3 days',
  titleHi: 'हर 3 दिन में तकिया का कवर बदलें',
  descEn:
  'Dirty pillowcases collect oil and bacteria that cause acne. Wash regularly.',
  descHi:
  'गंदे तकिया कवर में तेल और बैक्टीरिया जमा होते हैं जो मुंहासे बढ़ाते हैं।',
  icon: '🛏️'
},
{
  id: 10,
  categoryEn: 'Ingredient Focus',
  categoryHi: 'सामग्री की जानकारी',
  titleEn: 'Why Hyaluronic Acid?',
  titleHi: 'हायलूरोनिक एसिड क्यों?',
  descEn:
  'Holds 1000x its weight in water. Plumps skin and reduces fine lines instantly.',
  descHi:
  'अपने वज़न से 1000 गुना पानी सोख सकता है। त्वचा को तुरंत भर देता है।',
  icon: '💎'
},
{
  id: 11,
  categoryEn: 'Daily Tip',
  categoryHi: 'आज का सुझाव',
  titleEn: 'Sleep 7-8 hours nightly',
  titleHi: 'रोज़ 7-8 घंटे की नींद लें',
  descEn:
  'Skin repairs itself during sleep. Less than 6 hours = more dark circles and dullness.',
  descHi:
  'नींद में त्वचा खुद को ठीक करती है। 6 घंटे से कम सोएं तो डार्क सर्कल बढ़ते हैं।',
  icon: '🌙'
},
{
  id: 12,
  categoryEn: 'Myth Buster',
  categoryHi: 'गलतफहमी दूर करें',
  titleEn: 'Oily skin still needs moisturizer',
  titleHi: 'तैलीय त्वचा को भी मॉइस्चराइज़र चाहिए',
  descEn:
  'Skipping moisturizer makes skin produce MORE oil. Use a lightweight gel formula.',
  descHi:
  'मॉइस्चराइज़र छोड़ने से त्वचा और तेल बनाती है। हल्की जेल वाली क्रीम लगाएं।',
  icon: '💡'
}];


export const PROGRESS_HISTORY = [
{
  date: 'May 23',
  score: 78,
  image:
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150',
  topConcernEn: 'Pigmentation',
  topConcernHi: 'झाइयां',
  topWinEn: 'Hydration +5%',
  topWinHi: 'नमी +5%'
},
{
  date: 'May 16',
  score: 74,
  image:
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150',
  topConcernEn: 'Pigmentation',
  topConcernHi: 'झाइयां',
  topWinEn: 'Acne improving',
  topWinHi: 'मुंहासे कम हुए'
},
{
  date: 'May 9',
  score: 70,
  image:
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150',
  topConcernEn: 'Acne',
  topConcernHi: 'मुंहासे',
  topWinEn: 'Pores smaller',
  topWinHi: 'रोमछिद्र छोटे'
},
{
  date: 'May 2',
  score: 65,
  image:
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150',
  topConcernEn: 'Dark Spots',
  topConcernHi: 'काले धब्बे',
  topWinEn: 'Wrinkles clear',
  topWinHi: 'झुर्रियां साफ़'
}];


// Multi-dimensional skin analysis metrics (Cetaphil-style depth).
// Each metric has its own color identity, 0-100 score, and star rating (computed from score / 20).
// Order matches the order shown in the detailed analysis on ResultsScreen.
export interface SkinMetric {
  id: string;
  labelEn: string;
  labelHi: string;
  score: number;
  /** Hex color used for the score bar, star fill, and label */
  color: string;
  /** Optional short qualitative summary */
  detailEn: string;
  detailHi: string;
}

export const SKIN_METRICS: SkinMetric[] = [
{
  id: 'hydration',
  labelEn: 'Hydration',
  labelHi: 'नमी',
  score: 71,
  color: '#5BA8B0',
  detailEn: 'Slightly below ideal — drink more water',
  detailHi: 'थोड़ी कम — ज़्यादा पानी पिएं'
},
{
  id: 'blemish_prone',
  labelEn: 'Blemish Prone',
  labelHi: 'दाग वाली',
  score: 79,
  color: '#6A8AAB',
  detailEn: 'Low blemish activity detected',
  detailHi: 'दाग कम मिले'
},
{
  id: 'redness_prone',
  labelEn: 'Redness Prone',
  labelHi: 'लालिमा',
  score: 99,
  color: '#D9624C',
  detailEn: 'No signs of redness — well balanced',
  detailHi: 'लालिमा नहीं — संतुलित'
},
{
  id: 'oiliness',
  labelEn: 'Oiliness / Shine',
  labelHi: 'तैलीयपन',
  score: 77,
  color: '#E89B3F',
  detailEn: 'Moderate shine on T-zone',
  detailHi: 'T-ज़ोन पर हल्की चमक'
},
{
  id: 'dark_spots',
  labelEn: 'Dark Spots',
  labelHi: 'काले धब्बे',
  score: 85,
  color: '#4FB3D9',
  detailEn: 'A few mild spots — easy to fade',
  detailHi: 'कुछ हल्के धब्बे'
},
{
  id: 'radiance',
  labelEn: 'Radiance',
  labelHi: 'चमक',
  score: 78,
  color: '#9AA29E',
  detailEn: 'Good natural glow',
  detailHi: 'अच्छी प्राकृतिक चमक'
},
{
  id: 'texture',
  labelEn: 'Texture',
  labelHi: 'बनावट',
  score: 76,
  color: '#B387B8',
  detailEn: 'Smooth in most areas',
  detailHi: 'ज़्यादातर हिस्सा चिकना'
},
{
  id: 'firmness',
  labelEn: 'Firmness',
  labelHi: 'कसाव',
  score: 75,
  color: '#D88BAE',
  detailEn: 'Good elasticity for your age',
  detailHi: 'उम्र के हिसाब से अच्छा कसाव'
},
{
  id: 'wrinkles',
  labelEn: 'Wrinkles',
  labelHi: 'झुर्रियां',
  score: 90,
  color: '#84B074',
  detailEn: 'No visible aging signs',
  detailHi: 'अभी झुर्रियां नहीं'
},
{
  id: 'dark_circles',
  labelEn: 'Dark Circles',
  labelHi: 'काले घेरे',
  score: 77,
  color: '#E59D86',
  detailEn: 'Mild under-eye shadow',
  detailHi: 'आँखों के नीचे हल्के घेरे'
}];


// Product database for the Ingredient Scanner
export type ProductSuitability = 'excellent' | 'good' | 'caution' | 'avoid';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  categoryHi: string;
  emoji: string;
  suitability: ProductSuitability;
  matchScore: number;
  keyIngredients: {
    name: string;
    nameHi: string;
    benefitEn: string;
    benefitHi: string;
    rating: 'good' | 'neutral' | 'bad';
  }[];
  improvementsEn: string[];
  improvementsHi: string[];
  warningsEn: string[];
  warningsHi: string[];
  expectedTimeline: {
    weeksEn: string;
    weeksHi: string;
    resultEn: string;
    resultHi: string;
  }[];
}

export const PRODUCT_DATABASE: Product[] = [
{
  id: 'p1',
  name: 'Plum 10% Niacinamide Face Serum',
  brand: 'Plum',
  price: 385,
  category: 'Serum',
  categoryHi: 'सीरम',
  emoji: '🧪',
  suitability: 'excellent',
  matchScore: 92,
  keyIngredients: [
  {
    name: 'Niacinamide 10%',
    nameHi: 'नियासिनामाइड 10%',
    benefitEn: 'Reduces dark spots, controls oil',
    benefitHi: 'काले धब्बे कम करता है, तेल नियंत्रित करता है',
    rating: 'good'
  },
  {
    name: 'Rice Water',
    nameHi: 'चावल का पानी',
    benefitEn: 'Brightens skin tone',
    benefitHi: 'रंगत निखारता है',
    rating: 'good'
  },
  {
    name: 'Zinc PCA',
    nameHi: 'ज़िंक PCA',
    benefitEn: 'Calms acne and inflammation',
    benefitHi: 'मुंहासे और सूजन शांत करता है',
    rating: 'good'
  }],

  improvementsEn: [
  'Visible reduction in dark spots and pigmentation',
  'Smaller, less visible pores',
  'Balanced oil production on T-zone',
  'Brighter, more even skin tone'],

  improvementsHi: [
  'काले धब्बे और झाइयों में साफ़ कमी',
  'छोटे, कम दिखने वाले रोमछिद्र',
  'T-zone पर तेल का संतुलन',
  'चमकदार, समान रंगत'],

  warningsEn: [],
  warningsHi: [],
  expectedTimeline: [
  {
    weeksEn: '2 weeks',
    weeksHi: '2 हफ़्ते',
    resultEn: 'Skin feels smoother and more hydrated',
    resultHi: 'त्वचा मुलायम और हाइड्रेटेड महसूस होती है'
  },
  {
    weeksEn: '4 weeks',
    weeksHi: '4 हफ़्ते',
    resultEn: 'Dark spots start fading visibly',
    resultHi: 'काले धब्बे दिखाई से कम होने लगते हैं'
  },
  {
    weeksEn: '8 weeks',
    weeksHi: '8 हफ़्ते',
    resultEn: 'Even tone, controlled oil, fewer breakouts',
    resultHi: 'समान रंगत, तेल नियंत्रण, कम मुंहासे'
  }]

},
{
  id: 'p2',
  name: 'Mamaearth Vitamin C Face Wash',
  brand: 'Mamaearth',
  price: 249,
  category: 'Face Wash',
  categoryHi: 'फेसवॉश',
  emoji: '🍊',
  suitability: 'good',
  matchScore: 78,
  keyIngredients: [
  {
    name: 'Vitamin C',
    nameHi: 'विटामिन C',
    benefitEn: 'Brightens and fights pigmentation',
    benefitHi: 'चमक बढ़ाता है और झाइयां मिटाता है',
    rating: 'good'
  },
  {
    name: 'Turmeric',
    nameHi: 'हल्दी',
    benefitEn: 'Anti-inflammatory, evens tone',
    benefitHi: 'सूजन कम करता है',
    rating: 'good'
  },
  {
    name: 'SLS',
    nameHi: 'SLS',
    benefitEn: 'Can dry out skin if overused',
    benefitHi: 'ज़्यादा इस्तेमाल से त्वचा सूख सकती है',
    rating: 'neutral'
  }],

  improvementsEn: [
  'Brighter skin in 3-4 weeks',
  'Reduced dullness',
  'Fewer dark spots over time'],

  improvementsHi: [
  '3-4 हफ़्तों में चमकदार त्वचा',
  'सुस्ती कम होगी',
  'धीरे-धीरे दाग-धब्बे कम होंगे'],

  warningsEn: ['Use only once daily; SLS may dry combination skin'],
  warningsHi: ['दिन में एक बार ही इस्तेमाल करें; SLS से त्वचा सूख सकती है'],
  expectedTimeline: [
  {
    weeksEn: '2 weeks',
    weeksHi: '2 हफ़्ते',
    resultEn: 'Skin feels fresher post-wash',
    resultHi: 'धोने के बाद त्वचा तरोताज़ा लगेगी'
  },
  {
    weeksEn: '4-6 weeks',
    weeksHi: '4-6 हफ़्ते',
    resultEn: 'Brighter complexion visible',
    resultHi: 'रंगत में निखार दिखेगा'
  }]

},
{
  id: 'p3',
  name: "Pond's White Beauty Cream",
  brand: "Pond's",
  price: 199,
  category: 'Face Cream',
  categoryHi: 'फेस क्रीम',
  emoji: '🤍',
  suitability: 'caution',
  matchScore: 52,
  keyIngredients: [
  {
    name: 'Niacinamide',
    nameHi: 'नियासिनामाइड',
    benefitEn: 'Good for pigmentation',
    benefitHi: 'झाइयों के लिए अच्छा',
    rating: 'good'
  },
  {
    name: 'Fragrance',
    nameHi: 'खुशबू',
    benefitEn: 'May irritate sensitive skin',
    benefitHi: 'संवेदनशील त्वचा में जलन हो सकती है',
    rating: 'bad'
  },
  {
    name: 'Mineral Oil',
    nameHi: 'मिनरल ऑयल',
    benefitEn: 'Can clog pores in oily skin',
    benefitHi: 'तैलीय त्वचा में रोमछिद्र बंद कर सकता है',
    rating: 'bad'
  }],

  improvementsEn: [
  'Some brightening from niacinamide',
  'Hydration on dry areas'],

  improvementsHi: ['नियासिनामाइड से थोड़ी चमक', 'रूखे हिस्सों पर नमी'],
  warningsEn: [
  'Contains fragrance — may cause irritation',
  'Mineral oil can clog pores on your T-zone',
  'Not recommended for combination skin daily use'],

  warningsHi: [
  'खुशबू वाला है — जलन हो सकती है',
  'मिनरल ऑयल T-zone के रोमछिद्र बंद कर सकता है',
  'मिश्रित त्वचा के लिए रोज़ इस्तेमाल की सलाह नहीं'],

  expectedTimeline: [
  {
    weeksEn: '2 weeks',
    weeksHi: '2 हफ़्ते',
    resultEn: 'Mild brightening, possible breakouts',
    resultHi: 'हल्की चमक, मुंहासे हो सकते हैं'
  }]

},
{
  id: 'p4',
  name: 'Himalaya Purifying Neem Face Wash',
  brand: 'Himalaya',
  price: 95,
  category: 'Face Wash',
  categoryHi: 'फेसवॉश',
  emoji: '🌿',
  suitability: 'excellent',
  matchScore: 88,
  keyIngredients: [
  {
    name: 'Neem',
    nameHi: 'नीम',
    benefitEn: 'Natural antibacterial, fights acne',
    benefitHi: 'प्राकृतिक एंटीबैक्टीरियल, मुंहासे रोकता है',
    rating: 'good'
  },
  {
    name: 'Turmeric',
    nameHi: 'हल्दी',
    benefitEn: 'Reduces redness and inflammation',
    benefitHi: 'लालिमा और सूजन कम करता है',
    rating: 'good'
  }],

  improvementsEn: [
  'Fewer acne breakouts',
  'Cleaner, less oily T-zone',
  'Affordable daily use'],

  improvementsHi: [
  'मुंहासे कम होंगे',
  'साफ़, कम तैलीय T-zone',
  'सस्ता रोज़ का इस्तेमाल'],

  warningsEn: [],
  warningsHi: [],
  expectedTimeline: [
  {
    weeksEn: '1 week',
    weeksHi: '1 हफ्ता',
    resultEn: 'Cleaner pores, less oil',
    resultHi: 'साफ़ रोमछिद्र, कम तेल'
  },
  {
    weeksEn: '3 weeks',
    weeksHi: '3 हफ़्ते',
    resultEn: 'Visible reduction in acne',
    resultHi: 'मुंहासों में साफ़ कमी'
  }]

},
{
  id: 'p5',
  name: 'Nivea Soft Light Moisturizer',
  brand: 'Nivea',
  price: 75,
  category: 'Moisturizer',
  categoryHi: 'मॉइस्चराइज़र',
  emoji: '💧',
  suitability: 'good',
  matchScore: 75,
  keyIngredients: [
  {
    name: 'Glycerin',
    nameHi: 'ग्लिसरीन',
    benefitEn: 'Hydrates and softens skin',
    benefitHi: 'त्वचा को नमी और मुलायमी देता है',
    rating: 'good'
  },
  {
    name: 'Vitamin E',
    nameHi: 'विटामिन E',
    benefitEn: 'Antioxidant protection',
    benefitHi: 'एंटीऑक्सीडेंट सुरक्षा',
    rating: 'good'
  },
  {
    name: 'Jojoba Oil',
    nameHi: 'जोजोबा ऑयल',
    benefitEn: 'Light, non-greasy moisture',
    benefitHi: 'हल्की, गैर-चिकनी नमी',
    rating: 'good'
  }],

  improvementsEn: [
  'Soft, hydrated cheeks',
  'No oily feel on T-zone',
  'Budget-friendly daily use'],

  improvementsHi: [
  'मुलायम, हाइड्रेटेड गाल',
  'T-zone पर तेल नहीं',
  'सस्ता रोज़ का इस्तेमाल'],

  warningsEn: [],
  warningsHi: [],
  expectedTimeline: [
  {
    weeksEn: '1 week',
    weeksHi: '1 हफ्ता',
    resultEn: 'Skin feels softer and balanced',
    resultHi: 'त्वचा मुलायम और संतुलित लगती है'
  }]

},
{
  id: 'p6',
  name: 'Fair & Lovely Advanced Multi-Vitamin',
  brand: 'Glow & Lovely',
  price: 110,
  category: 'Face Cream',
  categoryHi: 'फेस क्रीम',
  emoji: '⚠️',
  suitability: 'avoid',
  matchScore: 28,
  keyIngredients: [
  {
    name: 'Niacinamide',
    nameHi: 'नियासिनामाइड',
    benefitEn: 'Reduces pigmentation',
    benefitHi: 'झाइयां कम करता है',
    rating: 'good'
  },
  {
    name: 'Heavy Fragrance',
    nameHi: 'तेज़ खुशबू',
    benefitEn: 'High irritation risk',
    benefitHi: 'जलन का बड़ा खतरा',
    rating: 'bad'
  },
  {
    name: 'Bleaching Agents',
    nameHi: 'ब्लीचिंग एजेंट',
    benefitEn: 'Can damage skin barrier',
    benefitHi: 'त्वचा की सुरक्षा परत को नुकसान पहुंचा सकते हैं',
    rating: 'bad'
  }],

  improvementsEn: [],
  improvementsHi: [],
  warningsEn: [
  'Marketed as "fairness" cream — focus on healthy skin, not lightening',
  'Heavy fragrance can trigger acne and irritation',
  'Better affordable alternatives exist (Plum, Minimalist)'],

  warningsHi: [
  '"गोरापन" का दावा करता है — स्वस्थ त्वचा पर ध्यान दें, गोरेपन पर नहीं',
  'तेज़ खुशबू से मुंहासे और जलन हो सकती है',
  'बेहतर सस्ते विकल्प हैं (Plum, Minimalist)'],

  expectedTimeline: []
}];