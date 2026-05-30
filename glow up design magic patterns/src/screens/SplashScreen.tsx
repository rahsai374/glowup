import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
// Hero / splash is shown BEFORE the user picks a language, so it is always English.
export function SplashScreen({ onNext }: {onNext: () => void;}) {
  useEffect(() => {
    const timer = setTimeout(onNext, 2500);
    return () => clearTimeout(timer);
  }, [onNext]);
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center bg-brand-primary text-white p-8 cursor-pointer"
      onClick={onNext}
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}>
      
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        transition={{
          delay: 0.2,
          type: 'spring'
        }}
        className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
        
        <Sparkles size={48} className="text-white" />
      </motion.div>

      <motion.h1
        className="text-5xl font-serif font-bold mb-2 text-center"
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.4
        }}>
        
        GlowUp
      </motion.h1>

      <motion.p
        className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/80 mb-4"
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.5
        }}>
        
        AI Skin Routine
      </motion.p>

      <motion.p
        initial={{
          y: 20,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          delay: 0.6
        }}
        className="text-center mt-4 text-base text-white/90">
        
        Glowing skin for everyone
      </motion.p>
    </motion.div>);

}