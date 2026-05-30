import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  ScanLine,
  Check,
  AlertTriangle,
  XCircle,
  Sparkles,
  Clock,
  ShieldCheck } from
'lucide-react';
import { useLanguage, TranslationKey } from '../contexts/LanguageContext';
import { PRODUCT_DATABASE, Product, MOCK_USER } from '../data/mockData';
type Step = 'search' | 'analyzing' | 'results';
const SUITABILITY_CONFIG: Record<
  Product['suitability'],
  {
    labelKey: TranslationKey;
    bg: string;
    light: string;
    text: string;
    border: string;
    icon: any;
  }> =
{
  excellent: {
    labelKey: 'sevExcellentMatch',
    bg: 'bg-green-500',
    light: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: ShieldCheck
  },
  good: {
    labelKey: 'sevGoodMatch',
    bg: 'bg-emerald-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: Check
  },
  caution: {
    labelKey: 'sevCaution',
    bg: 'bg-orange-500',
    light: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: AlertTriangle
  },
  avoid: {
    labelKey: 'sevAvoid',
    bg: 'bg-red-500',
    light: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle
  }
};
export function ProductCheckScreen({ onBack }: {onBack: () => void;}) {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const filteredProducts = query ?
  PRODUCT_DATABASE.filter(
    (p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase())
  ) :
  PRODUCT_DATABASE.slice(0, 4);
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setStep('analyzing');
    setTimeout(() => setStep('results'), 2200);
  };
  const handleReset = () => {
    setStep('search');
    setSelectedProduct(null);
    setQuery('');
  };
  const skinTypeLabel = hindi ? MOCK_USER.skinTypeHi : MOCK_USER.skinType;
  return (
    <div className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-3 bg-white/50 backdrop-blur-sm border-b border-brand-primary/5 z-10">
        <button
          onClick={step === 'results' ? handleReset : onBack}
          className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
          
          <ArrowLeft size={20} className="text-brand-text" />
        </button>
        <div className="flex-1">
          <h1
            className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
            
            {t('productCheck')}
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'search' &&
        <motion.div
          key="search"
          className="flex-1 flex flex-col overflow-y-auto pb-8"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            {/* Hero */}
            <div className="px-6 pt-6 pb-4">
              <h2
              className={`text-2xl font-serif font-bold text-brand-text mb-2 leading-tight ${hindi ? 'font-hindi' : ''}`}>
              
                {t('isRightForSkin')}
              </h2>
              <p
              className={`text-brand-text/60 text-sm ${hindi ? 'font-hindi' : ''}`}>
              
                {hindi ?
              `आपकी ${skinTypeLabel} त्वचा के अनुसार जांच करेंगे` :
              `Personalized for your ${skinTypeLabel} skin`}
              </p>
            </div>

            {/* Search Box */}
            <div className="px-6 mb-4">
              <div className="bg-white rounded-2xl shadow-sm border border-brand-primary/10 flex items-center overflow-hidden focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all">
                <div className="pl-4 text-brand-text/40">
                  <Search size={20} />
                </div>
                <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('typeProduct')}
                className={`flex-1 px-3 py-4 outline-none bg-transparent text-brand-text ${hindi ? 'font-hindi' : ''}`} />
              
              </div>
            </div>

            {/* Scan Barcode CTA */}
            <div className="px-6 mb-6">
              <button
              className={`w-full bg-brand-primary/5 border-2 border-dashed border-brand-primary/30 rounded-2xl py-4 flex items-center justify-center gap-3 text-brand-primary hover:bg-brand-primary/10 transition-all font-bold ${hindi ? 'font-hindi' : ''}`}>
              
                <ScanLine size={22} />
                {t('scanBarcode')}
              </button>
            </div>

            {/* Product List */}
            <div className="px-6">
              <div
              className={`text-xs font-bold uppercase tracking-wider text-brand-text/60 mb-3 ${hindi ? 'font-hindi normal-case' : ''}`}>
              
                {query ? t('searchResults') : t('popularProducts')}
              </div>

              {filteredProducts.length === 0 ?
            <div
              className={`bg-white rounded-2xl p-8 text-center border border-brand-primary/10 text-brand-text/60 ${hindi ? 'font-hindi' : ''}`}>
              
                  {t('noProductsFound')}
                </div> :

            <div className="space-y-3">
                  {filteredProducts.map((product, idx) =>
              <motion.button
                key={product.id}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: idx * 0.05
                }}
                onClick={() => handleSelectProduct(product)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-brand-primary/10 flex items-center gap-4 hover:border-brand-primary/40 active:scale-[0.98] transition-all text-left">
                
                      <div className="w-14 h-14 bg-brand-bg rounded-xl flex items-center justify-center text-3xl shrink-0">
                        {product.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-brand-text text-sm leading-tight mb-1 truncate">
                          {product.name}
                        </div>
                        <div
                    className={`text-xs text-brand-text/60 ${hindi ? 'font-hindi' : ''}`}>
                    
                          {hindi ? product.categoryHi : product.category} • ₹
                          {product.price}
                        </div>
                      </div>
                      <ArrowLeft
                  size={16}
                  className="text-brand-text/40 rotate-180 shrink-0" />
                
                    </motion.button>
              )}
                </div>
            }
            </div>
          </motion.div>
        }

        {step === 'analyzing' && selectedProduct &&
        <motion.div
          key="analyzing"
          className="flex-1 flex flex-col items-center justify-center p-8"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            <div className="relative w-32 h-32 mb-8">
              <motion.div
              className="absolute inset-0 rounded-full border-4 border-brand-primary/20"
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }} />
            
              <motion.div
              className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }} />
            
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                {selectedProduct.emoji}
              </div>
            </div>

            <p
            className={`text-lg font-bold text-brand-text mb-2 text-center ${hindi ? 'font-hindi' : ''}`}>
            
              {t('matchingSkin')}
            </p>
            <p
            className={`text-sm text-brand-text/60 ${hindi ? 'font-hindi' : ''}`}>
            
              {hindi ?
            `${selectedProduct.keyIngredients.length} ${t('ingredients')}` :
            `${t('analyzingIngredients')} ${selectedProduct.keyIngredients.length} ${t('ingredients')}`}
            </p>
          </motion.div>
        }

        {step === 'results' && selectedProduct &&
        <motion.div
          key="results"
          className="flex-1 flex flex-col overflow-y-auto pb-8"
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0
          }}>
          
            {/* Verdict Hero */}
            <div className="px-6 pt-6 pb-6">
              <ProductVerdict product={selectedProduct} />
            </div>

            {/* Key Ingredients */}
            <div className="px-6 mb-6">
              <h3
              className={`font-serif font-bold text-lg text-brand-text mb-3 ${hindi ? 'font-hindi' : ''}`}>
              
                {t('keyIngredients')}
              </h3>
              <div className="space-y-2">
                {selectedProduct.keyIngredients.map((ing, idx) =>
              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  x: -10
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: idx * 0.1
                }}
                className="bg-white rounded-2xl p-4 border border-brand-primary/10 flex gap-3 items-start">
                
                    <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ing.rating === 'good' ? 'bg-green-100 text-green-600' : ing.rating === 'bad' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                  
                      {ing.rating === 'good' ?
                  <Check size={16} strokeWidth={3} /> :
                  ing.rating === 'bad' ?
                  <XCircle size={16} /> :

                  <AlertTriangle size={14} />
                  }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                    className={`font-bold text-brand-text text-sm mb-0.5 ${hindi ? 'font-hindi' : ''}`}>
                    
                        {hindi ? ing.nameHi : ing.name}
                      </div>
                      <div
                    className={`text-xs text-brand-text/60 leading-snug ${hindi ? 'font-hindi' : ''}`}>
                    
                        {hindi ? ing.benefitHi : ing.benefitEn}
                      </div>
                    </div>
                  </motion.div>
              )}
              </div>
            </div>

            {/* Expected Improvements */}
            {selectedProduct.improvementsEn.length > 0 &&
          <div className="px-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-brand-primary" />
                  <h3
                className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
                
                    {t('expectedImprovements')}
                  </h3>
                </div>
                <div className="bg-[#FFF9F5] border border-brand-accent/30 rounded-2xl p-4 space-y-3">
                  {(hindi ?
              selectedProduct.improvementsHi :
              selectedProduct.improvementsEn).
              map((improvement, idx) =>
              <div key={idx} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p
                  className={`text-sm text-brand-text leading-relaxed flex-1 ${hindi ? 'font-hindi' : ''}`}>
                  
                        {improvement}
                      </p>
                    </div>
              )}
                </div>
              </div>
          }

            {/* Timeline */}
            {selectedProduct.expectedTimeline.length > 0 &&
          <div className="px-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-brand-primary" />
                  <h3
                className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
                
                    {t('whenResults')}
                  </h3>
                </div>
                <div className="space-y-3">
                  {selectedProduct.expectedTimeline.map((tl, idx) =>
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-brand-primary/10 flex gap-3">
                
                      <div className="w-16 shrink-0">
                        <div
                    className={`text-brand-primary font-bold text-sm ${hindi ? 'font-hindi' : ''}`}>
                    
                          {hindi ? tl.weeksHi : tl.weeksEn}
                        </div>
                      </div>
                      <div
                  className={`flex-1 text-sm text-brand-text/80 leading-snug border-l-2 border-brand-primary/20 pl-3 ${hindi ? 'font-hindi' : ''}`}>
                  
                        {hindi ? tl.resultHi : tl.resultEn}
                      </div>
                    </div>
              )}
                </div>
              </div>
          }

            {/* Warnings */}
            {selectedProduct.warningsEn.length > 0 &&
          <div className="px-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={18} className="text-orange-500" />
                  <h3
                className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
                
                    {t('importantWarnings')}
                  </h3>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-2">
                  {(hindi ?
              selectedProduct.warningsHi :
              selectedProduct.warningsEn).
              map((w, idx) =>
              <div key={idx} className="flex gap-2 items-start">
                      <AlertTriangle
                  size={14}
                  className="text-orange-500 shrink-0 mt-0.5" />
                
                      <p
                  className={`text-sm text-orange-900 leading-relaxed ${hindi ? 'font-hindi' : ''}`}>
                  
                        {w}
                      </p>
                    </div>
              )}
                </div>
              </div>
          }

            {/* CTA */}
            <div className="px-6 mt-2">
              <button
              onClick={handleReset}
              className={`w-full bg-white text-brand-text py-4 rounded-2xl font-bold border border-brand-primary/20 shadow-sm hover:bg-brand-bg transition-all ${hindi ? 'font-hindi' : ''}`}>
              
                {t('checkAnother')}
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
function ProductVerdict({ product }: {product: Product;}) {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const config = SUITABILITY_CONFIG[product.suitability];
  const Icon = config.icon;
  return (
    <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-brand-primary/10">
      <div className="p-5 flex gap-4 items-center border-b border-brand-bg">
        <div className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center text-4xl shrink-0">
          {product.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-brand-text leading-tight mb-1">
            {product.name}
          </div>
          <div className="text-xs text-brand-text/60">
            {product.brand} • ₹{product.price}
          </div>
        </div>
      </div>

      {/* Verdict band */}
      <div
        className={`${config.light} ${config.border} border-y px-5 py-4 flex items-center gap-3`}>
        
        <div
          className={`w-10 h-10 ${config.bg} rounded-full flex items-center justify-center shrink-0 text-white`}>
          
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div
            className={`font-bold text-sm ${config.text} ${hindi ? 'font-hindi' : ''}`}>
            
            {t(config.labelKey)}
          </div>
          <div
            className={`text-xs text-brand-text/60 ${hindi ? 'font-hindi' : ''}`}>
            
            {t('forYourSkin')}
          </div>
        </div>
      </div>

      {/* Match score */}
      <div className="p-5">
        <div className="flex justify-between items-end mb-2">
          <div
            className={`text-xs font-bold uppercase tracking-wider text-brand-text/60 ${hindi ? 'font-hindi normal-case' : ''}`}>
            
            {t('matchScore')}
          </div>
          <div className="font-serif font-bold text-2xl text-brand-text">
            {product.matchScore}
            <span className="text-sm text-brand-text/40">/100</span>
          </div>
        </div>
        <div className="h-2.5 bg-brand-bg rounded-full overflow-hidden">
          <motion.div
            initial={{
              width: 0
            }}
            animate={{
              width: `${product.matchScore}%`
            }}
            transition={{
              duration: 1,
              ease: 'easeOut'
            }}
            className={`h-full ${config.bg} rounded-full`} />
          
        </div>
      </div>
    </div>);

}