import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
export function ProfileScreen({ onBack }: {onBack: () => void;}) {
  const { language, setLanguage, t } = useLanguage();
  const { name, age, setName, setAge } = useUser();
  const hindi = language === 'hi';
  // Local draft state so typing feels snappy, then commit on blur
  const [nameDraft, setNameDraft] = useState(name);
  const [ageDraft, setAgeDraft] = useState<string>(
    age != null ? String(age) : ''
  );
  const [showSaved, setShowSaved] = useState<'name' | 'age' | null>(null);
  // Keep drafts in sync if context changes externally
  useEffect(() => setNameDraft(name), [name]);
  useEffect(() => setAgeDraft(age != null ? String(age) : ''), [age]);
  const flashSaved = (field: 'name' | 'age') => {
    setShowSaved(field);
    setTimeout(
      () => setShowSaved((curr) => curr === field ? null : curr),
      1500
    );
  };
  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== name) {
      setName(trimmed);
      flashSaved('name');
    } else if (!trimmed) {
      // Revert if cleared
      setNameDraft(name);
    }
  };
  const commitAge = () => {
    const parsed = ageDraft.trim() === '' ? null : Number(ageDraft);
    if (parsed === null) {
      if (age !== null) {
        setAge(null);
        flashSaved('age');
      }
      return;
    }
    if (!Number.isNaN(parsed) && parsed > 0 && parsed < 120 && parsed !== age) {
      setAge(parsed);
      flashSaved('age');
    } else if (Number.isNaN(parsed) || parsed <= 0 || parsed >= 120) {
      setAgeDraft(age != null ? String(age) : '');
    }
  };
  return (
    <div className="flex-1 flex flex-col bg-brand-bg pt-12 pb-24 overflow-y-auto relative">
      {/* Ambient warm background blobs */}
      <div
        aria-hidden
        className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-brand-primary/12 rounded-full blur-3xl pointer-events-none" />
      
      <div
        aria-hidden
        className="absolute top-[400px] left-[-80px] w-64 h-64 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
      

      <div className="relative z-10">
        <div className="px-6 mb-6 flex items-start gap-3">
          <button
            onClick={onBack}
            aria-label="Back"
            className="w-10 h-10 bg-white rounded-full shadow-sm border border-brand-primary/10 flex items-center justify-center shrink-0 active:scale-95 transition-all">
            
            <ArrowLeft size={18} className="text-brand-text" />
          </button>
          <div className="flex-1">
            <h1
              className={`text-3xl text-brand-text mb-1 ${hindi ? 'font-hindi font-bold' : 'font-serif font-bold'}`}>
              
              {t('yourProfile')}
            </h1>
            <p
              className={`text-brand-text/60 text-sm ${hindi ? 'font-hindi' : 'font-serif italic'}`}>
              
              {t('personalizeNote')}
            </p>
          </div>
        </div>

        {/* Avatar + identity card */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-primary/10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-2xl shrink-0">
              👩🏽
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`font-serif font-bold text-brand-text text-xl truncate ${hindi ? 'font-hindi' : ''}`}>
                
                {name || '—'}
              </div>
              <div
                className={`text-sm text-brand-text/60 ${hindi ? 'font-hindi' : ''}`}>
                
                {age != null ? `${age} ${t('ageYears')}` : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Name + Age form */}
        <div className="px-6 mb-6 space-y-4">
          {/* Name */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`text-sm font-medium text-brand-text/80 ${hindi ? 'font-hindi' : ''}`}>
                
                {t('yourName')}
              </label>
              <AnimatePresence>
                {showSaved === 'name' &&
                <motion.span
                  initial={{
                    opacity: 0,
                    x: 6
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0
                  }}
                  className={`text-xs text-green-600 font-medium flex items-center gap-1 ${hindi ? 'font-hindi' : ''}`}>
                  
                    <Check size={12} strokeWidth={3} />
                    {t('saved')}
                  </motion.span>
                }
              </AnimatePresence>
            </div>
            <div className="flex items-center bg-white rounded-2xl shadow-sm border border-brand-primary/10 overflow-hidden focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
              <div className="pl-4 text-brand-text/40">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
                placeholder={t('namePlaceholder')}
                className={`flex-1 px-3 py-4 outline-none bg-transparent text-brand-text ${hindi ? 'font-hindi' : ''}`} />
              
            </div>
          </div>

          {/* Age */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`text-sm font-medium text-brand-text/80 ${hindi ? 'font-hindi' : ''}`}>
                
                {t('yourAge')}
              </label>
              <AnimatePresence>
                {showSaved === 'age' &&
                <motion.span
                  initial={{
                    opacity: 0,
                    x: 6
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0
                  }}
                  className={`text-xs text-green-600 font-medium flex items-center gap-1 ${hindi ? 'font-hindi' : ''}`}>
                  
                    <Check size={12} strokeWidth={3} />
                    {t('saved')}
                  </motion.span>
                }
              </AnimatePresence>
            </div>
            <div className="flex items-center bg-white rounded-2xl shadow-sm border border-brand-primary/10 overflow-hidden focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={119}
                value={ageDraft}
                onChange={(e) =>
                setAgeDraft(e.target.value.replace(/\D/g, '').slice(0, 3))
                }
                onBlur={commitAge}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
                placeholder={t('agePlaceholder')}
                className={`flex-1 px-4 py-4 outline-none bg-transparent text-brand-text text-lg tracking-wide ${hindi ? 'font-hindi' : ''}`} />
              
              <div
                className={`pr-4 text-brand-text/40 text-sm ${hindi ? 'font-hindi' : ''}`}>
                
                {t('ageYears')}
              </div>
            </div>
          </div>
        </div>

        {/* Language preference */}
        <div className="px-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-primary/10">
            <h3
              className={`font-bold text-brand-text mb-4 ${hindi ? 'font-hindi' : ''}`}>
              
              {t('languagePreference')}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage('hi')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all font-hindi ${language === 'hi' ? 'bg-brand-primary text-white shadow-soft' : 'bg-brand-bg text-brand-text/60'}`}>
                
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${language === 'en' ? 'bg-brand-primary text-white shadow-soft' : 'bg-brand-bg text-brand-text/60'}`}>
                
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}