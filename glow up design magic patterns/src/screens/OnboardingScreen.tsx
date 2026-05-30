import React, { useState, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, Sparkles, Share2, ChevronRight } from 'lucide-react';
import { useLanguage, type TranslationKey } from '../contexts/LanguageContext';
const SLIDES: {
  icon: any;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  /** Sample metrics overlaid on slide 1 to preview the depth of analysis */
  metricPreview?: {
    label: string;
    labelHi: string;
    score: number;
    color: string;
  }[];
}[] = [
{
  icon: ScanFace,
  titleKey: 'onboard1Title',
  descKey: 'onboard1Desc',
  metricPreview: [
  {
    label: 'Hydration',
    labelHi: 'नमी',
    score: 71,
    color: '#5BA8B0'
  },
  {
    label: 'Wrinkles',
    labelHi: 'झुर्रियां',
    score: 90,
    color: '#84B074'
  },
  {
    label: 'Radiance',
    labelHi: 'चमक',
    score: 78,
    color: '#E89B3F'
  }]

},
{
  icon: Sparkles,
  titleKey: 'onboard2Title',
  descKey: 'onboard2Desc'
},
{
  icon: Share2,
  titleKey: 'onboard3Title',
  descKey: 'onboard3Desc'
}];

export function OnboardingScreen({ onNext }: {onNext: () => void;}) {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleNext = () => {
    if (currentSlide === SLIDES.length - 1) {
      onNext();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };
  const current = SLIDES[currentSlide];
  return (
    <div className="flex-1 flex flex-col bg-brand-bg relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-20%] w-96 h-96 bg-brand-primary-light/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] left-[-20%] w-72 h-72 bg-brand-accent/15 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{
              opacity: 0,
              x: 50
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: -50
            }}
            className="flex flex-col items-center w-full">
            
            {/* Illustration */}
            <div className="relative w-56 h-56 mb-12">
              <div className="absolute inset-4 bg-white rounded-full shadow-soft flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full animate-pulse" />
                {createElement(current.icon, {
                  size: 80,
                  className: 'text-brand-primary',
                  strokeWidth: 1.5
                })}
              </div>

              {/* Slide 1 only: floating metric preview chips to communicate analysis depth */}
              {current.metricPreview &&
              <>
                  {current.metricPreview.map((m, i) => {
                  const positions = [
                  'top-0 -left-4',
                  'top-1/3 -right-6',
                  'bottom-2 -left-2'];

                  return (
                    <motion.div
                      key={m.label}
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                        y: 8
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0
                      }}
                      transition={{
                        delay: 0.3 + i * 0.15,
                        type: 'spring'
                      }}
                      className={`absolute ${positions[i]} bg-white rounded-full pl-1.5 pr-3 py-1 shadow-md border border-brand-primary/10 flex items-center gap-2`}>
                      
                        <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{
                          backgroundColor: m.color
                        }}>
                        
                          {m.score}
                        </span>
                        <span
                        className={`text-[11px] font-bold text-brand-text ${hindi ? 'font-hindi' : ''}`}>
                        
                          {hindi ? m.labelHi : m.label}
                        </span>
                      </motion.div>);

                })}
                </>
              }
            </div>

            <h2
              className={`text-3xl font-serif font-bold text-brand-text mb-3 ${hindi ? 'font-hindi' : ''}`}>
              
              {t(current.titleKey)}
            </h2>

            <p
              className={`text-brand-text/70 text-base leading-relaxed max-w-xs ${hindi ? 'font-hindi' : ''}`}>
              
              {t(current.descKey)}
            </p>

            {/* Slide 1 only: explicit "10 dimensions" badge */}
            {current.metricPreview &&
            <motion.div
              initial={{
                opacity: 0,
                y: 6
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.8
              }}
              className={`mt-5 inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full text-xs font-bold ${hindi ? 'font-hindi' : ''}`}>
              
                <Sparkles size={12} />
                {t('multiDimensional')} · 10 {hindi ? 'पहलू' : 'metrics'}
              </motion.div>
            }
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-12 z-10 flex flex-col gap-8">
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, idx) =>
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-brand-primary' : 'w-2 bg-brand-primary/20'}`} />

          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onNext}
            className={`text-brand-text/60 font-medium px-4 py-2 ${hindi ? 'font-hindi' : ''}`}>
            
            {t('skip')}
          </button>

          <button
            onClick={handleNext}
            className={`bg-brand-primary text-white px-8 py-4 rounded-2xl font-medium shadow-soft flex items-center gap-2 hover:bg-brand-primary/90 active:scale-95 transition-all ${hindi ? 'font-hindi' : ''}`}>
            
            {currentSlide === SLIDES.length - 1 ? t('getStarted') : t('next')}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>);

}