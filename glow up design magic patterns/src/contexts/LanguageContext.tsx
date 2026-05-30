import React, { useState, createContext, useContext } from 'react';
export type Language = 'hi' | 'en';
// Central translation dictionary — extend with more languages later (Tamil, Bengali, etc.)
const TRANSLATIONS = {
  // Splash
  appName: {
    en: 'GlowUp',
    hi: 'GlowUp'
  },
  appNameKicker: {
    en: 'AI Skin Routine',
    hi: 'AI स्किन रूटीन'
  },
  splashTagline: {
    en: 'Glowing skin for everyone',
    hi: 'चमकती त्वचा, हर किसी के लिए'
  },
  // Language picker
  chooseLanguage: {
    en: 'Choose Language',
    hi: 'भाषा चुनें'
  },
  changeLater: {
    en: 'You can change this later in settings.',
    hi: 'आप इसे बाद में सेटिंग्स में बदल सकते हैं।'
  },
  // Onboarding
  skip: {
    en: 'Skip',
    hi: 'छोड़ें'
  },
  next: {
    en: 'Next',
    hi: 'आगे'
  },
  getStarted: {
    en: 'Get Started',
    hi: 'शुरू करें'
  },
  onboard1Title: {
    en: 'AI Selfie Scan',
    hi: 'AI सेल्फी स्कैन'
  },
  onboard1Desc: {
    en: 'Take a selfie and let our AI analyze your skin needs.',
    hi: 'बस एक सेल्फी लें और हमारा AI आपकी त्वचा की ज़रूरतें बताएगा।'
  },
  onboard2Title: {
    en: 'Personal Routine',
    hi: 'आपका अपना रूटीन'
  },
  onboard2Desc: {
    en: 'Simple daily routine with affordable, local products.',
    hi: 'सस्ते और अच्छे प्रोडक्ट्स के साथ रोज़ का आसान रूटीन।'
  },
  onboard3Title: {
    en: 'Track Progress',
    hi: 'प्रोग्रेस ट्रैक करें'
  },
  onboard3Desc: {
    en: 'Watch your skin improve and share with friends.',
    hi: 'अपनी त्वचा में सुधार देखें और दोस्तों के साथ शेयर करें।'
  },
  // Auth
  loginToContinue: {
    en: 'Login to continue',
    hi: 'जारी रखने के लिए लॉगिन करें'
  },
  mobileNumber: {
    en: 'Mobile Number',
    hi: 'मोबाइल नंबर'
  },
  noSpam: {
    en: 'No spam. No email needed.',
    hi: 'कोई स्पैम नहीं। ईमेल की ज़रूरत नहीं।'
  },
  sendOtp: {
    en: 'Send OTP',
    hi: 'OTP भेजें'
  },
  enterOtp: {
    en: 'Enter OTP',
    hi: 'OTP दर्ज करें'
  },
  sentTo: {
    en: 'Sent to',
    hi: 'भेजा गया'
  },
  changePhone: {
    en: 'Change phone number',
    hi: 'मोबाइल नंबर बदलें'
  },
  verifyLogin: {
    en: 'Verify & Login',
    hi: 'पुष्टि करें और लॉगिन करें'
  },
  phonePlaceholder: {
    en: '98765 43210',
    hi: '98765 43210'
  },
  // Home
  greeting: {
    en: 'Hello',
    hi: 'नमस्ते'
  },
  homeQuestion: {
    en: 'Ready for glowing skin?',
    hi: 'चमकती त्वचा के लिए तैयार हैं?'
  },
  scanYourSkin: {
    en: 'Analyze Skin',
    hi: 'त्वचा का विश्लेषण करें'
  },
  takesSeconds: {
    en: 'Takes only 15 seconds',
    hi: 'सिर्फ़ 15 सेकंड लगते हैं'
  },
  checkProduct: {
    en: 'Check Product',
    hi: 'प्रोडक्ट चेक करें'
  },
  ingredientCheck: {
    en: 'Ingredient check',
    hi: 'सामग्री जांचें'
  },
  myRoutine: {
    en: 'My Routine',
    hi: 'मेरा रूटीन'
  },
  yourDailyPlan: {
    en: 'Your daily plan',
    hi: 'रोज़ का प्लान'
  },
  recentActivity: {
    en: 'Recent Activity',
    hi: 'हाल की गतिविधि'
  },
  viewAll: {
    en: 'View all',
    hi: 'सब देखें'
  },
  lastScanScore: {
    en: 'Last Scan Score',
    hi: 'पिछला स्कैन स्कोर'
  },
  today: {
    en: 'Today',
    hi: 'आज'
  },
  routine: {
    en: 'Routine',
    hi: 'रूटीन'
  },
  latestInsights: {
    en: 'Latest Skin Insights',
    hi: 'आपकी ताज़ा जानकारी'
  },
  seeAll: {
    en: 'See all',
    hi: 'सब देखें'
  },
  todaysTip: {
    en: "Today's Tip",
    hi: 'आज का सुझाव'
  },
  // Bottom Nav
  home: {
    en: 'Home',
    hi: 'होम'
  },
  scan: {
    en: 'Scan',
    hi: 'स्कैन'
  },
  progress: {
    en: 'Progress',
    hi: 'प्रोग्रेस'
  },
  insights: {
    en: 'Insights',
    hi: 'जानकारी'
  },
  // Scan
  goodLighting: {
    en: 'Good lighting',
    hi: 'अच्छी रोशनी'
  },
  howAddPhoto: {
    en: 'How would you like to add a photo?',
    hi: 'फोटो कैसे जोड़ें?'
  },
  takeSelfie: {
    en: 'Take Selfie',
    hi: 'सेल्फी लें'
  },
  takeSelfieDesc: {
    en: 'Use your camera',
    hi: 'कैमरा से फोटो लें'
  },
  chooseGallery: {
    en: 'Choose from Gallery',
    hi: 'गैलरी से चुनें'
  },
  chooseGalleryDesc: {
    en: 'Pick an existing photo',
    hi: 'पुरानी फोटो चुनें'
  },
  positionFace: {
    en: 'Position face in the oval',
    hi: 'चेहरे को गोले में रखें'
  },
  analyzingSkin: {
    en: 'AI is analyzing your skin...',
    hi: 'AI आपकी त्वचा की जांच कर रहा है...'
  },
  didYouKnow: {
    en: 'Did you know? Drinking water improves skin glow.',
    hi: 'क्या आप जानते हैं? पानी पीने से त्वचा में चमक आती है।'
  },
  detectingIssues: {
    en: 'Detecting acne and dark spots...',
    hi: 'मुंहासे और दाग-धब्बे ढूंढे जा रहे हैं...'
  },
  preparingRoutine: {
    en: 'Preparing your custom routine...',
    hi: 'आपका रूटीन तैयार किया जा रहा है...'
  },
  // Results
  skinAnalysisResult: {
    en: 'Skin Analysis Result',
    hi: 'त्वचा विश्लेषण परिणाम'
  },
  skinAge: {
    en: 'Skin Age',
    hi: 'त्वचा की उम्र'
  },
  years: {
    en: 'yrs',
    hi: 'साल'
  },
  skinType: {
    en: 'Skin Type',
    hi: 'त्वचा का प्रकार'
  },
  combination: {
    en: 'Combination',
    hi: 'मिश्रित'
  },
  oily: {
    en: 'Oily',
    hi: 'तैलीय'
  },
  dry: {
    en: 'Dry',
    hi: 'सूखी'
  },
  normal: {
    en: 'Normal',
    hi: 'सामान्य'
  },
  detailedAnalysis: {
    en: 'Detailed Analysis',
    hi: 'विस्तृत विश्लेषण'
  },
  skinScores: {
    en: 'Your Skin Scores',
    hi: 'आपके स्कोर'
  },
  analysisOverview: {
    en: 'Analysis Overview',
    hi: 'विश्लेषण ओवरव्यू'
  },
  customizedRegimen: {
    en: 'We have your customized skin regimen',
    hi: 'आपका कस्टम स्किन रूटीन तैयार है'
  },
  customizedRegimenDesc: {
    en: 'Our AI takes your scores and formulates a regimen just for you.',
    hi: 'AI आपके स्कोर के हिसाब से रोज़ का रूटीन बनाता है।'
  },
  multiDimensional: {
    en: 'Multi-Dimensional Analysis',
    hi: 'विस्तृत विश्लेषण'
  },
  multiDimensionalDesc: {
    en: 'We score 10 skin dimensions — from hydration to wrinkles — so your routine targets what actually matters for you.',
    hi: 'हम त्वचा के 10 पहलू मापते हैं — ताकि रूटीन वही ठीक करे जो ज़रूरी है।'
  },
  seeMyRoutine: {
    en: 'See My Glowing Routine',
    hi: 'मेरा रूटीन देखें'
  },
  shareScoreCard: {
    en: 'Share Score Card',
    hi: 'स्कोर कार्ड शेयर करें'
  },
  // Severity
  sevClear: {
    en: 'Clear',
    hi: 'साफ़'
  },
  sevMild: {
    en: 'Mild',
    hi: 'हल्का'
  },
  sevModerate: {
    en: 'Moderate',
    hi: 'मध्यम'
  },
  sevAttention: {
    en: 'Needs Attention',
    hi: 'ध्यान दें'
  },
  sevSevere: {
    en: 'Severe',
    hi: 'गंभीर'
  },
  // Routine
  yourRoutine: {
    en: 'Your Glowing Routine',
    hi: 'आपका स्किनकेयर रूटीन'
  },
  morning: {
    en: 'Morning',
    hi: 'सुबह'
  },
  night: {
    en: 'Night',
    hi: 'रात'
  },
  weekly: {
    en: 'Weekly',
    hi: 'साप्ताहिक'
  },
  useThis: {
    en: 'Use this',
    hi: 'यह इस्तेमाल करें'
  },
  availableLocal: {
    en: 'Available at local medical store',
    hi: 'स्थानीय मेडिकल स्टोर पर मिलेगा'
  },
  availableKirana: {
    en: 'Available at kirana store',
    hi: 'किराना स्टोर पर मिलेगा'
  },
  // Progress
  yourProgress: {
    en: 'Your Progress',
    hi: 'आपकी प्रोग्रेस'
  },
  skinScoreTrend: {
    en: 'Skin Score Trend',
    hi: 'त्वचा स्कोर का रुझान'
  },
  pastScans: {
    en: 'Past Scans',
    hi: 'पिछले स्कैन'
  },
  scoreLabel: {
    en: 'Score',
    hi: 'स्कोर'
  },
  // Tips / Insights
  skinInsights: {
    en: 'Skin Insights',
    hi: 'त्वचा की जानकारी'
  },
  personalizedFor: {
    en: 'Personalized for',
    hi: 'के लिए तैयार'
  },
  yourLatestInsights: {
    en: 'Your Latest Insights',
    hi: 'आपकी ताज़ा जानकारी'
  },
  browseByConcern: {
    en: 'Browse by Skin Concern',
    hi: 'त्वचा की समस्या के अनुसार'
  },
  browseByType: {
    en: 'Browse by Skin Type',
    hi: 'त्वचा के प्रकार के अनुसार'
  },
  yourType: {
    en: 'Your Type',
    hi: 'आपकी त्वचा'
  },
  dailyTips: {
    en: 'Daily Tips',
    hi: 'रोज़ाना के टिप्स'
  },
  // Product Check
  productCheck: {
    en: 'Check Product',
    hi: 'प्रोडक्ट चेक करें'
  },
  isRightForSkin: {
    en: 'Is this right for your skin?',
    hi: 'क्या यह आपकी त्वचा के लिए सही है?'
  },
  personalizedForSkin: {
    en: 'Personalized for your',
    hi: 'आपकी'
  },
  personalizedSkinSuffix: {
    en: 'skin',
    hi: 'त्वचा के अनुसार'
  },
  typeProduct: {
    en: 'Type product or brand...',
    hi: 'प्रोडक्ट या ब्रांड का नाम लिखें...'
  },
  scanBarcode: {
    en: 'Scan Barcode',
    hi: 'बारकोड स्कैन करें'
  },
  searchResults: {
    en: 'Search Results',
    hi: 'खोज के नतीजे'
  },
  popularProducts: {
    en: 'Popular Products',
    hi: 'लोकप्रिय प्रोडक्ट्स'
  },
  noProductsFound: {
    en: 'No products found',
    hi: 'कोई प्रोडक्ट नहीं मिला'
  },
  matchingSkin: {
    en: 'Matching with your skin profile...',
    hi: 'आपकी त्वचा से मिलान कर रहे हैं...'
  },
  analyzingIngredients: {
    en: 'Analyzing',
    hi: 'जांच रहे हैं'
  },
  ingredients: {
    en: 'ingredients',
    hi: 'सामग्री'
  },
  keyIngredients: {
    en: 'Key Ingredients',
    hi: 'मुख्य सामग्री'
  },
  expectedImprovements: {
    en: 'Expected Improvements',
    hi: 'आपको क्या फायदा होगा'
  },
  whenResults: {
    en: "When You'll See Results",
    hi: 'कब असर दिखेगा'
  },
  importantWarnings: {
    en: 'Important Warnings',
    hi: 'ध्यान दें'
  },
  checkAnother: {
    en: 'Check Another Product',
    hi: 'दूसरा प्रोडक्ट जांचें'
  },
  matchScore: {
    en: 'Match Score',
    hi: 'मैच स्कोर'
  },
  forYourSkin: {
    en: 'For your skin',
    hi: 'आपकी त्वचा के लिए'
  },
  sevExcellentMatch: {
    en: 'Excellent Match',
    hi: 'बढ़िया मेल'
  },
  sevGoodMatch: {
    en: 'Good Match',
    hi: 'अच्छा मेल'
  },
  sevCaution: {
    en: 'Use with Caution',
    hi: 'सावधानी से इस्तेमाल करें'
  },
  sevAvoid: {
    en: 'Avoid This Product',
    hi: 'यह उत्पाद न लें'
  },
  // Share
  shareResult: {
    en: 'Share Result',
    hi: 'नतीजा शेयर करें'
  },
  shareSubtitle: {
    en: 'Skin Analysis',
    hi: 'त्वचा विश्लेषण'
  },
  shareWhatsApp: {
    en: 'Share on WhatsApp',
    hi: 'WhatsApp पर शेयर करें'
  },
  saveGallery: {
    en: 'Save to Gallery',
    hi: 'गैलरी में सेव करें'
  },
  shareTagline: {
    en: 'Glowing skin,\nfor everyone',
    hi: 'चमकती त्वचा,\nहर किसी के लिए'
  },
  possessiveSkinAnalysis: {
    en: "'s Skin Analysis",
    hi: ' का त्वचा विश्लेषण'
  },
  // Profile / Settings
  yourProfile: {
    en: 'Your Profile',
    hi: 'आपकी प्रोफ़ाइल'
  },
  personalizeNote: {
    en: 'Help us personalize your skincare recommendations',
    hi: 'हम आपके लिए बेहतर सुझाव दे सकें, इसमें मदद करें'
  },
  yourName: {
    en: 'Your Name',
    hi: 'आपका नाम'
  },
  yourAge: {
    en: 'Your Age',
    hi: 'आपकी उम्र'
  },
  ageYears: {
    en: 'years',
    hi: 'साल'
  },
  namePlaceholder: {
    en: 'Enter your name',
    hi: 'अपना नाम लिखें'
  },
  agePlaceholder: {
    en: 'Enter your age',
    hi: 'अपनी उम्र लिखें'
  },
  saved: {
    en: 'Saved',
    hi: 'सेव हो गया'
  },
  settings: {
    en: 'Settings',
    hi: 'सेटिंग्स'
  }
} as const;
export type TranslationKey = keyof typeof TRANSLATIONS;
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
export function LanguageProvider({ children }: {children: ReactNode;}) {
  const [language, setLanguage] = useState<Language>('hi');
  const t = (key: TranslationKey): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] ?? entry.en;
  };
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t
      }}>
      
      {children}
    </LanguageContext.Provider>);

}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}