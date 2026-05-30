import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import {
  TIPS,
  SKIN_CONCERNS,
  SKIN_TYPES_LIBRARY,
  LATEST_INSIGHTS,
  MOCK_USER } from
'../data/mockData';
export function TipsScreen() {
  const { language, t } = useLanguage();
  const { name } = useUser();
  const hindi = language === 'hi';
  return (
    <div className="flex-1 flex flex-col bg-brand-bg pt-12 overflow-y-auto pb-24 relative">
      {/* Ambient warm background blobs */}
      <div
        aria-hidden
        className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-brand-primary/12 rounded-full blur-3xl pointer-events-none" />
      
      <div
        aria-hidden
        className="absolute top-[400px] left-[-80px] w-64 h-64 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
      

      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 mb-6">
          <h1
            className={`text-3xl text-brand-text mb-1 ${hindi ? 'font-hindi font-bold' : 'font-serif font-bold'}`}>
            
            {t('skinInsights')}
          </h1>
          <p
            className={`text-brand-text/60 text-sm ${hindi ? 'font-hindi' : 'font-serif italic'}`}>
            
            {hindi ?
            `${name} ${t('personalizedFor')}` :
            `${t('personalizedFor')} ${name}`}
          </p>
        </div>

        {/* Latest Personal Insights */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-brand-primary" />
            <h2
              className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
              
              {t('yourLatestInsights')}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {LATEST_INSIGHTS.map((insight, idx) =>
            <motion.div
              key={insight.id}
              initial={{
                opacity: 0,
                y: 12
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: idx * 0.08
              }}
              className={`${insight.accent} border rounded-2xl p-4 flex flex-col`}>
              
                <div className="flex items-center gap-2 mb-3">
                  <div
                  className={`w-7 h-7 ${insight.iconBg} rounded-lg flex items-center justify-center text-sm`}>
                  
                    <span>{insight.icon}</span>
                  </div>
                  <span
                  className={`text-[10px] font-bold uppercase tracking-wider text-brand-text/60 ${hindi ? 'font-hindi normal-case' : ''}`}>
                  
                    {hindi ? insight.labelHi : insight.labelEn}
                  </span>
                </div>
                <div
                className={`font-serif font-bold text-brand-text text-lg leading-tight mb-1.5 ${hindi ? 'font-hindi' : ''}`}>
                
                  {hindi ? insight.valueHi : insight.valueEn}
                </div>
                <div
                className={`text-[11px] text-brand-text/60 leading-snug mt-auto ${hindi ? 'font-hindi' : ''}`}>
                
                  {hindi ? insight.detailHi : insight.detailEn}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Browse by Skin Concern */}
        <div className="mb-8">
          <div className="px-6 mb-4">
            <h2
              className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
              
              {t('browseByConcern')}
            </h2>
          </div>

          <div className="px-6 grid grid-cols-2 gap-3">
            {SKIN_CONCERNS.map((concern, idx) =>
            <motion.button
              key={concern.id}
              initial={{
                opacity: 0,
                y: 12
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: idx * 0.05
              }}
              className={`${concern.bgColor} rounded-2xl overflow-hidden relative aspect-[3/4] flex flex-col p-4 text-left active:scale-[0.98] transition-all shadow-sm`}>
              
                <div className="absolute inset-0 z-0">
                  <img
                  src={concern.image}
                  alt=""
                  className="w-full h-full object-cover object-top mix-blend-luminosity opacity-90" />
                
                  <div
                  className={`absolute inset-0 ${concern.bgColor} mix-blend-color opacity-60`} />
                
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div
                  className={`font-bold text-brand-text text-base leading-tight mb-1.5 ${hindi ? 'font-hindi' : ''}`}>
                  
                    {hindi ? concern.titleHi : concern.titleEn}
                  </div>
                  <div
                  className={`text-[11px] text-brand-text/70 leading-snug line-clamp-3 ${hindi ? 'font-hindi' : ''}`}>
                  
                    {hindi ? concern.descHi : concern.descEn}
                  </div>
                  <div className="mt-auto pt-3">
                    <div className="w-9 h-9 bg-brand-text rounded-full flex items-center justify-center shadow-md">
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.button>
            )}
          </div>
        </div>

        {/* Browse by Skin Type */}
        <div className="mb-8">
          <div className="px-6 mb-4">
            <h2
              className={`font-serif font-bold text-lg text-brand-text ${hindi ? 'font-hindi' : ''}`}>
              
              {t('browseByType')}
            </h2>
          </div>

          <div className="px-6 grid grid-cols-2 gap-3">
            {SKIN_TYPES_LIBRARY.map((type, idx) => {
              const isUserType = type.id === MOCK_USER.skinType.toLowerCase();
              return (
                <motion.button
                  key={type.id}
                  initial={{
                    opacity: 0,
                    y: 12
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: idx * 0.05
                  }}
                  className={`${type.bgColor} rounded-2xl overflow-hidden relative aspect-square flex flex-col p-4 text-left active:scale-[0.98] transition-all shadow-sm`}>
                  
                  <div className="absolute inset-0 z-0">
                    <img
                      src={type.image}
                      alt=""
                      className="w-full h-full object-cover opacity-90" />
                    
                    <div
                      className={`absolute inset-0 ${type.bgColor} mix-blend-multiply opacity-40`} />
                    
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {isUserType &&
                    <div
                      className={`self-start mb-2 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${hindi ? 'font-hindi normal-case' : ''}`}>
                      
                        {t('yourType')}
                      </div>
                    }
                    <div
                      className={`font-bold text-brand-text text-sm leading-tight mb-1 ${hindi ? 'font-hindi' : ''}`}>
                      
                      {hindi ? type.titleHi : type.titleEn}
                    </div>
                    <div
                      className={`text-[10px] text-brand-text/70 leading-snug line-clamp-2 ${hindi ? 'font-hindi' : ''}`}>
                      
                      {hindi ? type.descHi : type.descEn}
                    </div>
                    <div className="mt-auto pt-2">
                      <div className="w-7 h-7 bg-brand-text rounded-full flex items-center justify-center shadow-md">
                        <ArrowRight size={12} className="text-white" />
                      </div>
                    </div>
                  </div>
                </motion.button>);

            })}
          </div>
        </div>

        {/* Daily Tips Feed */}
        <div className="px-6">
          <h2
            className={`font-serif font-bold text-lg text-brand-text mb-4 ${hindi ? 'font-hindi' : ''}`}>
            
            {t('dailyTips')}
          </h2>

          <div className="space-y-3">
            {TIPS.map((tip, idx) =>
            <motion.div
              key={tip.id}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: idx * 0.04
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-primary/10">
              
                <div className="bg-brand-primary-light/10 px-5 py-2 border-b border-brand-primary/10 flex items-center gap-2">
                  <span
                  className={`text-[10px] font-bold text-brand-primary uppercase tracking-wider ${hindi ? 'font-hindi normal-case' : ''}`}>
                  
                    {hindi ? tip.categoryHi : tip.categoryEn}
                  </span>
                </div>
                <div className="p-4 flex gap-4">
                  <div className="text-3xl shrink-0">{tip.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div
                    className={`font-bold text-brand-text text-sm leading-tight mb-1.5 ${hindi ? 'font-hindi' : ''}`}>
                    
                      {hindi ? tip.titleHi : tip.titleEn}
                    </div>
                    <p
                    className={`text-xs text-brand-text/70 leading-relaxed ${hindi ? 'font-hindi' : ''}`}>
                    
                      {hindi ? tip.descHi : tip.descEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>);

}