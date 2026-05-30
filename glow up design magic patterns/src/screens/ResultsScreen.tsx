import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SkinMetricsRadar } from '../components/SkinMetricsRadar';
import { SkinMetricsList } from '../components/SkinMetricsList';
export function ResultsScreen({
  onSeeRoutine,
  onShare



}: {onSeeRoutine: () => void;onShare: () => void;}) {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const [score, setScore] = useState(0);
  const finalScore = 78;
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setScore(Math.round(finalScore / steps * currentStep));
      if (currentStep >= steps) {
        setScore(finalScore);
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, []);
  return (
    <motion.div
      className="flex-1 flex flex-col bg-brand-bg overflow-y-auto pb-24"
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}>
      
      {/* Hero Section */}
      <div className="bg-white rounded-b-[40px] shadow-soft p-8 pt-12 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-brand-primary-light/10 rounded-full blur-3xl" />
        <div className="absolute top-[-20%] right-[-20%] w-56 h-56 bg-brand-accent/20 rounded-full blur-3xl" />

        <p
          className={`text-brand-primary text-[11px] font-bold uppercase tracking-[0.18em] mb-2 ${hindi ? 'font-hindi normal-case tracking-normal' : ''}`}>
          
          {t('skinAnalysisResult')}
        </p>

        {/* Animated Score Meter */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-brand-bg" />
            
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={80 * 2 * Math.PI}
              strokeDashoffset={80 * 2 * Math.PI * (1 - score / 100)}
              strokeLinecap="round"
              className="text-brand-primary"
              initial={{
                strokeDashoffset: 80 * 2 * Math.PI
              }}
              animate={{
                strokeDashoffset: 80 * 2 * Math.PI * (1 - score / 100)
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut'
              }} />
            
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-serif font-bold text-brand-text">
              {score}
            </span>
            <span className="text-sm text-brand-text/60 font-medium">
              / 100
            </span>
          </div>
        </div>

        <div className="flex gap-4 w-full relative z-10">
          <div className="flex-1 bg-brand-bg rounded-2xl p-4 text-center border border-brand-primary/5">
            <div
              className={`text-brand-text/60 text-xs uppercase tracking-wider mb-1 ${hindi ? 'font-hindi normal-case' : ''}`}>
              
              {t('skinAge')}
            </div>
            <div className="text-xl font-bold text-brand-text">
              24{' '}
              <span
                className={`text-sm font-normal ${hindi ? 'font-hindi' : ''}`}>
                
                {t('years')}
              </span>
            </div>
          </div>
          <div className="flex-1 bg-brand-bg rounded-2xl p-4 text-center border border-brand-primary/5">
            <div
              className={`text-brand-text/60 text-xs uppercase tracking-wider mb-1 ${hindi ? 'font-hindi normal-case' : ''}`}>
              
              {t('skinType')}
            </div>
            <div
              className={`text-xl font-bold text-brand-text ${hindi ? 'font-hindi' : ''}`}>
              
              {t('combination')}
            </div>
          </div>
        </div>
      </div>

      {/* Radar Overview */}
      <div className="p-6 pb-2">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-brand-primary/10">
          <h2
            className={`font-serif font-bold text-lg text-brand-text mb-1 ${hindi ? 'font-hindi' : ''}`}>
            
            {t('analysisOverview')}
          </h2>
          <p
            className={`text-xs text-brand-text/60 mb-3 ${hindi ? 'font-hindi' : ''}`}>
            
            {t('multiDimensionalDesc')}
          </p>
          <SkinMetricsRadar />
        </div>
      </div>

      {/* Detailed Score Breakdown */}
      <div className="p-6">
        <h2
          className={`font-serif font-bold text-xl text-brand-text mb-1 ${hindi ? 'font-hindi' : ''}`}>
          
          {t('skinScores')}
        </h2>
        <p
          className={`text-xs text-brand-text/60 mb-5 ${hindi ? 'font-hindi' : ''}`}>
          
          {t('detailedAnalysis')}
        </p>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-brand-primary/10 mb-8">
          <SkinMetricsList />
        </div>

        {/* Customized Regimen Banner */}
        <div className="bg-[#2D1810] text-white rounded-3xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-10%] w-48 h-48 bg-brand-primary/30 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-brand-accent" />
              <span
                className={`text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 ${hindi ? 'font-hindi normal-case' : ''}`}>
                
                {t('multiDimensional')}
              </span>
            </div>
            <h3
              className={`font-serif font-bold text-xl mb-2 leading-tight ${hindi ? 'font-hindi' : ''}`}>
              
              {t('customizedRegimen')}
            </h3>
            <p
              className={`text-sm text-white/70 leading-relaxed ${hindi ? 'font-hindi' : ''}`}>
              
              {t('customizedRegimenDesc')}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            onClick={onSeeRoutine}
            className={`w-full bg-brand-primary text-white py-4 rounded-2xl font-medium shadow-soft flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${hindi ? 'font-hindi' : ''}`}>
            
            {t('seeMyRoutine')}
            <ArrowRight size={20} />
          </button>

          <button
            onClick={onShare}
            className={`w-full bg-white text-brand-text py-4 rounded-2xl font-medium shadow-sm border border-brand-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${hindi ? 'font-hindi' : ''}`}>
            
            <Share2 size={20} className="text-brand-primary" />
            {t('shareScoreCard')}
          </button>
        </div>
      </div>
    </motion.div>);

}