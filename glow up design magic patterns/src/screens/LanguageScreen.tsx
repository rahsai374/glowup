import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
export function LanguageScreen({ onNext }: {onNext: () => void;}) {
  const { setLanguage } = useLanguage();
  const handleSelectLanguage = (lang: 'hi' | 'en') => {
    setLanguage(lang);
    onNext();
  };
  return (
    <motion.div
      className="flex-1 flex flex-col p-8 pt-24 bg-brand-bg"
      initial={{
        x: 300,
        opacity: 0
      }}
      animate={{
        x: 0,
        opacity: 1
      }}
      exit={{
        x: -300,
        opacity: 0
      }}>
      
      {/* Intentionally bilingual — user hasn't picked a language yet */}
      <h1 className="text-3xl font-serif font-bold text-brand-text mb-1">
        Choose Language
      </h1>
      <p className="font-hindi text-xl text-brand-text/70 mb-2">भाषा चुनें</p>
      <p className="text-brand-text/60 mb-12 text-sm">
        You can change this later in settings.
      </p>

      <div className="space-y-4">
        <button
          onClick={() => handleSelectLanguage('hi')}
          className="w-full bg-white p-6 rounded-2xl shadow-card border-2 border-transparent hover:border-brand-primary transition-all flex flex-col items-center gap-2">
          
          <span className="text-3xl font-hindi font-bold text-brand-text">
            हिन्दी
          </span>
          <span className="text-sm text-brand-text/60">Hindi</span>
        </button>

        <button
          onClick={() => handleSelectLanguage('en')}
          className="w-full bg-white p-6 rounded-2xl shadow-card border-2 border-transparent hover:border-brand-primary transition-all flex flex-col items-center gap-2">
          
          <span className="text-3xl font-sans font-bold text-brand-text">
            English
          </span>
          <span className="text-sm text-brand-text/60">English</span>
        </button>
      </div>
    </motion.div>);

}