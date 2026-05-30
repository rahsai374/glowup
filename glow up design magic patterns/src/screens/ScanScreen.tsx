import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { useLanguage, type TranslationKey } from '../contexts/LanguageContext';
const ANALYZING_FACT_KEYS: TranslationKey[] = [
'analyzingSkin',
'didYouKnow',
'detectingIssues',
'preparingRoutine'];

export function ScanScreen({
  onCancel,
  onComplete



}: {onCancel: () => void;onComplete: () => void;}) {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const [step, setStep] = useState<'choice' | 'capture' | 'analyzing'>('choice');
  const [factIndex, setFactIndex] = useState(0);
  useEffect(() => {
    if (step === 'analyzing') {
      const factInterval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % ANALYZING_FACT_KEYS.length);
      }, 3000);
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 12000);
      return () => {
        clearInterval(factInterval);
        clearTimeout(completeTimer);
      };
    }
  }, [step, onComplete]);
  return (
    <div className="flex-1 flex flex-col bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 p-6 pt-12 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onCancel}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md text-white">
          
          <X size={20} />
        </button>
        {step === 'capture' &&
        <div
          className={`bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2 border border-white/10 ${hindi ? 'font-hindi' : ''}`}>
          
            <Sparkles size={16} className="text-brand-accent" />
            {t('goodLighting')}
          </div>
        }
      </div>

      <AnimatePresence mode="wait">
        {step === 'choice' &&
        <motion.div
          key="choice"
          className="flex-1 flex flex-col items-center justify-center p-8 bg-brand-bg"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            <h2
            className={`text-3xl font-serif font-bold text-brand-text mb-12 text-center ${hindi ? 'font-hindi' : ''}`}>
            
              {t('howAddPhoto')}
            </h2>

            <div className="w-full space-y-4">
              <button
              onClick={() => setStep('capture')}
              className="w-full bg-brand-primary text-white p-6 rounded-2xl shadow-soft flex items-center gap-4 hover:bg-brand-primary/90 transition-all">
              
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Camera size={24} />
                </div>
                <div className="text-left">
                  <div
                  className={`font-bold text-lg ${hindi ? 'font-hindi' : ''}`}>
                  
                    {t('takeSelfie')}
                  </div>
                  <div
                  className={`text-white/80 text-sm ${hindi ? 'font-hindi' : ''}`}>
                  
                    {t('takeSelfieDesc')}
                  </div>
                </div>
              </button>

              <button
              onClick={() => setStep('capture')}
              className="w-full bg-white border border-brand-primary/20 text-brand-text p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:bg-brand-bg transition-all">
              
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                  <ImageIcon size={24} />
                </div>
                <div className="text-left">
                  <div
                  className={`font-bold text-lg ${hindi ? 'font-hindi' : ''}`}>
                  
                    {t('chooseGallery')}
                  </div>
                  <div
                  className={`text-brand-text/60 text-sm ${hindi ? 'font-hindi' : ''}`}>
                  
                    {t('chooseGalleryDesc')}
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        }

        {step === 'capture' &&
        <motion.div
          key="capture"
          className="flex-1 relative flex flex-col"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}>
          
            <div className="absolute inset-0">
              <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800&h=1200"
              alt="Camera view"
              className="w-full h-full object-cover" />
            
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[280px] h-[380px] border-2 border-white/50 rounded-[140px] border-dashed relative">
                <div
                className={`absolute -top-12 inset-x-0 text-center text-white font-medium drop-shadow-md ${hindi ? 'font-hindi' : ''}`}>
                
                  {t('positionFace')}
                </div>
              </div>
            </div>

            <div className="mt-auto p-8 pb-12 flex justify-center items-center z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <button
              onClick={() => setStep('analyzing')}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-all">
              
                <div className="w-16 h-16 bg-white rounded-full" />
              </button>
            </div>
          </motion.div>
        }

        {step === 'analyzing' &&
        <motion.div
          key="analyzing"
          className="flex-1 relative flex flex-col items-center justify-center"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}>
          
            <div className="absolute inset-0">
              <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800&h=1200"
              alt="Captured"
              className="w-full h-full object-cover opacity-50" />
            
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
              className="w-full h-1 bg-brand-primary shadow-[0_0_20px_rgba(224,120,86,0.8)]"
              animate={{
                y: ['0vh', '100vh', '0vh']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }} />
            

              <div className="absolute inset-0 bg-[linear-gradient(rgba(224,120,86,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(224,120,86,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
            </div>

            <div className="relative z-20 bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center max-w-[80%]">
              <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />

              <AnimatePresence mode="wait">
                <motion.div
                key={factIndex}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -10
                }}
                className="text-white">
                
                  <p
                  className={`font-bold text-lg ${hindi ? 'font-hindi' : ''}`}>
                  
                    {t(ANALYZING_FACT_KEYS[factIndex])}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}