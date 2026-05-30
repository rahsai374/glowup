import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2 } from
'lucide-react';
import { useLanguage, type TranslationKey } from '../contexts/LanguageContext';
import { ROUTINE_STEPS } from '../data/mockData';
type Tab = 'morning' | 'night' | 'weekly';
export function RoutineScreen() {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const [activeTab, setActiveTab] = useState<Tab>('morning');
  const [expandedStep, setExpandedStep] = useState<string | null>('m1');
  const tabs: {
    id: Tab;
    icon: any;
    labelKey: TranslationKey;
  }[] = [
  {
    id: 'morning',
    icon: Sun,
    labelKey: 'morning'
  },
  {
    id: 'night',
    icon: Moon,
    labelKey: 'night'
  },
  {
    id: 'weekly',
    icon: Calendar,
    labelKey: 'weekly'
  }];

  const currentRoutine = ROUTINE_STEPS[activeTab];
  // Map mock data tags to translation keys for storefront labels
  const getProductTagKey = (tag: string): TranslationKey | null => {
    if (tag === 'Available at local medical store') return 'availableLocal';
    if (tag === 'Available at kirana store') return 'availableKirana';
    return null;
  };
  return (
    <div className="flex-1 flex flex-col bg-brand-bg pt-12 relative">
      {/* Ambient warm background blobs */}
      <div
        aria-hidden
        className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-brand-primary/12 rounded-full blur-3xl pointer-events-none" />
      
      <div
        aria-hidden
        className="absolute top-[300px] left-[-80px] w-64 h-64 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
      

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="px-6 mb-6">
          <h1
            className={`text-3xl text-brand-text ${hindi ? 'font-hindi font-bold' : 'font-serif font-bold'}`}>
            
            {t('yourRoutine')}
          </h1>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-6">
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-brand-primary/10">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setExpandedStep(ROUTINE_STEPS[tab.id][0].id);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${isActive ? 'bg-brand-primary text-white shadow-soft' : 'text-brand-text/60 hover:bg-brand-bg'}`}>
                  
                  <Icon size={16} />
                  <span
                    className={`font-medium text-sm ${hindi ? 'font-hindi' : ''}`}>
                    
                    {t(tab.labelKey)}
                  </span>
                </button>);

            })}
          </div>
        </div>

        {/* Routine Steps */}
        <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              className="space-y-4">
              
              {currentRoutine.map((step) => {
                const isExpanded = expandedStep === step.id;
                const tagKey = getProductTagKey(step.product.tag);
                return (
                  <div
                    key={step.id}
                    className="bg-white rounded-2xl shadow-sm border border-brand-primary/10 overflow-hidden">
                    
                    <button
                      onClick={() =>
                      setExpandedStep(isExpanded ? null : step.id)
                      }
                      className="w-full p-4 flex items-center gap-4 text-left">
                      
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isExpanded ? 'bg-brand-primary text-white' : 'bg-brand-bg text-brand-text'}`}>
                        
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-bold text-brand-text ${hindi ? 'font-hindi' : ''}`}>
                          
                          {hindi ? step.titleHi : step.titleEn}
                        </div>
                      </div>
                      {isExpanded ?
                      <ChevronUp size={20} className="text-brand-text/40" /> :

                      <ChevronDown size={20} className="text-brand-text/40" />
                      }
                    </button>

                    <AnimatePresence>
                      {isExpanded &&
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0
                        }}
                        animate={{
                          height: 'auto',
                          opacity: 1
                        }}
                        exit={{
                          height: 0,
                          opacity: 0
                        }}
                        className="overflow-hidden">
                        
                          <div className="p-4 pt-0 pl-16 border-t border-brand-bg">
                            <p
                            className={`text-sm text-brand-text/80 mb-4 leading-relaxed ${hindi ? 'font-hindi' : ''}`}>
                            
                              {hindi ? step.descHi : step.descEn}
                            </p>

                            {/* Product Recommendation */}
                            <div className="bg-[#FFF9F5] rounded-xl p-3 border border-brand-accent/20 flex gap-3 items-center">
                              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                                {step.product.image}
                              </div>
                              <div className="flex-1">
                                <div
                                className={`text-xs text-brand-primary font-bold uppercase tracking-wider mb-0.5 ${hindi ? 'font-hindi normal-case' : ''}`}>
                                
                                  {t('useThis')}
                                </div>
                                <div className="font-bold text-brand-text text-sm leading-tight">
                                  {step.product.name}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span
                                  className={`text-brand-text/60 text-xs flex items-center gap-1 ${hindi ? 'font-hindi' : ''}`}>
                                  
                                    <CheckCircle2
                                    size={10}
                                    className="text-green-500" />
                                  
                                    {tagKey ? t(tagKey) : step.product.tag}
                                  </span>
                                  <span className="font-bold text-brand-primary">
                                    ₹{step.product.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      }
                    </AnimatePresence>
                  </div>);

              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>);

}