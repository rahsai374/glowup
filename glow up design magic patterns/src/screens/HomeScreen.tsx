import React from 'react';
import { motion } from 'framer-motion';
import {
  ScanFace,
  Sparkles,
  ArrowRight,
  Clock,
  FlaskConical,
  AlertCircle,
  TrendingUp } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import {
  MOCK_USER,
  TIPS,
  LATEST_INSIGHTS,
  PROGRESS_HISTORY } from
'../data/mockData';
export function HomeScreen({
  onScan,
  onNavigate,
  onCheckProduct




}: {onScan: () => void;onNavigate: (tab: any) => void;onCheckProduct: () => void;}) {
  const { language, t } = useLanguage();
  const { name } = useUser();
  const hindi = language === 'hi';
  const dailyTip = TIPS[0];
  return (
    <motion.div
      className="flex-1 flex flex-col bg-brand-bg overflow-y-auto pb-24 relative"
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}>
      
      {/* Ambient warm background blobs */}
      <div
        aria-hidden
        className="absolute top-[-80px] right-[-60px] w-72 h-72 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />
      
      <div
        aria-hidden
        className="absolute top-[280px] left-[-80px] w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />
      
      <div
        aria-hidden
        className="absolute top-[640px] right-[-40px] w-56 h-56 bg-[#E07856]/10 rounded-full blur-3xl pointer-events-none" />
      

      <div className="relative z-10 p-6 pt-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1 min-w-0">
            <p
              className={`text-brand-primary text-[11px] font-bold uppercase tracking-[0.18em] mb-2 ${hindi ? 'font-hindi normal-case tracking-normal' : ''}`}>
              
              {t('greeting')} ✨
            </p>
            <h1
              className={`text-3xl text-brand-text leading-tight ${hindi ? 'font-hindi font-bold' : 'font-serif'}`}>
              
              {hindi ? `${name},` : `Hi ${name},`}
            </h1>
            <p
              className={`text-base text-brand-text/70 mt-1 ${hindi ? 'font-hindi' : 'font-serif italic'}`}>
              
              {t('homeQuestion')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            aria-label={t('yourProfile')}
            className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-brand-primary/15 hover:border-brand-primary/40 hover:shadow-md active:scale-95 transition-all shrink-0 ml-3">
            
            <span className="text-xl">👩🏽</span>
          </button>
        </div>

        {/* Primary CTA */}
        <motion.button
          whileHover={{
            scale: 1.02
          }}
          whileTap={{
            scale: 0.98
          }}
          onClick={onScan}
          className="w-full bg-brand-primary text-white rounded-[32px] p-8 shadow-soft relative overflow-hidden mb-8 text-left group">
          
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
          <div className="absolute bottom-[-30%] left-[-10%] w-40 h-40 bg-[#D4A574]/30 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/20 ring-1 ring-white/30 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <ScanFace
                size={44}
                strokeWidth={2}
                className="text-white shrink-0" />
              
            </div>

            <h2
              className={`text-2xl font-serif font-bold ${hindi ? 'font-hindi' : ''}`}>
              
              {t('scanYourSkin')}
            </h2>

            <div
              className={`mt-6 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm ${hindi ? 'font-hindi' : ''}`}>
              
              <Sparkles size={16} />
              <span>{t('takesSeconds')}</span>
            </div>
          </div>
        </motion.button>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={onCheckProduct}
            className="bg-gradient-to-br from-[#FFEFE3] to-[#FFE2D1] rounded-2xl p-4 shadow-sm border border-brand-primary/15 text-left hover:shadow-md hover:border-brand-primary/30 active:scale-[0.98] transition-all flex flex-col gap-3">
            
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <FlaskConical size={20} className="text-brand-primary" />
            </div>
            <div>
              <div
                className={`font-bold text-brand-text text-sm leading-tight ${hindi ? 'font-hindi' : ''}`}>
                
                {t('checkProduct')}
              </div>
              <div
                className={`text-[11px] text-brand-text/60 mt-0.5 ${hindi ? 'font-hindi' : ''}`}>
                
                {t('ingredientCheck')}
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('routine')}
            className="bg-gradient-to-br from-[#FBF2E0] to-[#F5E6C8] rounded-2xl p-4 shadow-sm border border-brand-accent/30 text-left hover:shadow-md hover:border-brand-accent/50 active:scale-[0.98] transition-all flex flex-col gap-3">
            
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles size={20} className="text-brand-accent" />
            </div>
            <div>
              <div
                className={`font-bold text-brand-text text-sm leading-tight ${hindi ? 'font-hindi' : ''}`}>
                
                {t('myRoutine')}
              </div>
              <div
                className={`text-[11px] text-brand-text/60 mt-0.5 ${hindi ? 'font-hindi' : ''}`}>
                
                {t('yourDailyPlan')}
              </div>
            </div>
          </button>
        </div>

        {/* Last Scan Card */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2
              className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
              
              {t('recentActivity')}
            </h2>
            <button
              onClick={() => onNavigate('progress')}
              className={`text-brand-primary text-sm font-medium flex items-center gap-1 ${hindi ? 'font-hindi' : ''}`}>
              
              {t('viewAll')} <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-gradient-to-br from-white to-[#FFF1E6] rounded-3xl p-4 shadow-card flex items-center gap-4 border border-brand-primary/10 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-brand-accent/15 rounded-full blur-2xl pointer-events-none" />
            

            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm border border-brand-primary/5">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-brand-primary/10" />
                
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={24 * 2 * Math.PI}
                  strokeDashoffset={
                  24 * 2 * Math.PI * (1 - MOCK_USER.lastScanScore / 100)
                  }
                  className="text-brand-primary"
                  strokeLinecap="round" />
                
              </svg>
              <span className="absolute font-serif font-bold text-brand-text text-base">
                {MOCK_USER.lastScanScore}
              </span>
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <h3
                className={`font-bold text-brand-text mb-1.5 ${hindi ? 'font-hindi' : ''}`}>
                
                {t('lastScanScore')}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <div
                  className={`inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${hindi ? 'font-hindi normal-case' : ''}`}>
                  
                  <AlertCircle size={10} strokeWidth={2.5} />
                  <span className="truncate max-w-[110px]">
                    {hindi ?
                    PROGRESS_HISTORY[0].topConcernHi :
                    PROGRESS_HISTORY[0].topConcernEn}
                  </span>
                </div>
                <div
                  className={`inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${hindi ? 'font-hindi normal-case' : ''}`}>
                  
                  <TrendingUp size={10} strokeWidth={2.5} />
                  <span className="truncate max-w-[110px]">
                    {hindi ?
                    PROGRESS_HISTORY[0].topWinHi :
                    PROGRESS_HISTORY[0].topWinEn}
                  </span>
                </div>
              </div>
              <p
                className={`text-xs text-brand-text/60 flex items-center gap-1 ${hindi ? 'font-hindi' : ''}`}>
                
                <Clock size={11} /> {t('today')}
              </p>
            </div>
            <button
              onClick={() => onNavigate('routine')}
              className={`bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-bold shrink-0 shadow-sm hover:bg-brand-primary/90 active:scale-95 transition-all relative z-10 ${hindi ? 'font-hindi' : ''}`}>
              
              {t('routine')}
            </button>
          </div>
        </div>

        {/* Latest Skin Insights */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2
              className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
              
              {t('latestInsights')}
            </h2>
            <button
              onClick={() => onNavigate('tips')}
              className={`text-brand-primary text-sm font-medium flex items-center gap-1 ${hindi ? 'font-hindi' : ''}`}>
              
              {t('seeAll')} <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {LATEST_INSIGHTS.slice(0, 4).map((insight, idx) =>
            <motion.button
              key={insight.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: idx * 0.08
              }}
              onClick={() => onNavigate('tips')}
              className={`${insight.accent} border rounded-2xl p-3.5 text-left active:scale-[0.98] hover:shadow-sm transition-all`}>
              
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                  className={`w-7 h-7 ${insight.iconBg} rounded-lg flex items-center justify-center text-sm shadow-sm`}>
                  
                    <span>{insight.icon}</span>
                  </div>
                  <span
                  className={`text-[9px] font-bold uppercase tracking-wider text-brand-text/70 leading-tight ${hindi ? 'font-hindi normal-case' : ''}`}>
                  
                    {hindi ? insight.labelHi : insight.labelEn}
                  </span>
                </div>
                <div
                className={`font-serif font-bold text-brand-text text-base leading-tight mb-1 ${hindi ? 'font-hindi' : ''}`}>
                
                  {hindi ? insight.valueHi : insight.valueEn}
                </div>
                <div
                className={`text-[10px] text-brand-text/70 leading-snug ${hindi ? 'font-hindi' : ''}`}>
                
                  {hindi ? insight.detailHi : insight.detailEn}
                </div>
              </motion.button>
            )}
          </div>
        </div>

        {/* Daily Tip */}
        <div>
          <h2
            className={`font-serif font-bold text-lg text-brand-text mb-4 ${hindi ? 'font-hindi' : ''}`}>
            
            {t('todaysTip')}
          </h2>
          <div className="bg-gradient-to-br from-[#FFF9F5] to-[#FBEFE0] border border-brand-accent/30 rounded-3xl p-5 shadow-sm flex gap-4 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute bottom-[-20px] right-[-10px] w-24 h-24 bg-brand-accent/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="text-3xl shrink-0 relative z-10">
              {dailyTip.icon}
            </div>
            <div className="relative z-10">
              <h3
                className={`font-serif font-bold text-brand-text mb-1 ${hindi ? 'font-hindi' : ''}`}>
                
                {hindi ? dailyTip.titleHi : dailyTip.titleEn}
              </h3>
              <p
                className={`text-sm text-brand-text/70 leading-relaxed ${hindi ? 'font-hindi' : ''}`}>
                
                {hindi ? dailyTip.descHi : dailyTip.descEn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}