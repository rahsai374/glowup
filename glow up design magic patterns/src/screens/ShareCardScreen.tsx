import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
export function ShareCardScreen({ onBack }: {onBack: () => void;}) {
  const { language, t } = useLanguage();
  const { name } = useUser();
  const hindi = language === 'hi';
  return (
    <div className="flex-1 flex flex-col bg-[#1A1A1A] text-white">
      {/* Header */}
      <div className="p-6 pt-12 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
          
          <ArrowLeft size={20} />
        </button>
        <span className={`font-medium ${hindi ? 'font-hindi' : ''}`}>
          {t('shareResult')}
        </span>
        <div className="w-10" />
      </div>

      {/* Card Preview Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          className="w-full aspect-square bg-[#FFF5EE] rounded-[32px] p-6 relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#E07856]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-[#D4A574]/20 rounded-full blur-3xl" />

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-auto">
              <div>
                <h3
                  className={`text-[#2D1810] font-serif font-bold text-xl ${hindi ? 'font-hindi' : ''}`}>
                  
                  {hindi ?
                  `${name}${t('possessiveSkinAnalysis')}` :
                  `${name}${t('possessiveSkinAnalysis')}`}
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white">
                <Sparkles size={14} className="text-[#E07856]" />
                <span className="text-[#2D1810] font-bold text-xs">
                  {t('appName')}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center my-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(224,120,86,0.1)"
                    strokeWidth="12"
                    fill="transparent" />
                  
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#E07856"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={56 * 2 * Math.PI}
                    strokeDashoffset={56 * 2 * Math.PI * (1 - 78 / 100)}
                    strokeLinecap="round" />
                  
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-serif font-bold text-[#2D1810]">
                    78
                  </span>
                </div>
              </div>
              <div className="mt-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-[#2D1810]/5 text-center">
                <div
                  className={`text-[#2D1810]/60 text-[10px] uppercase tracking-wider font-bold ${hindi ? 'font-hindi normal-case' : ''}`}>
                  
                  {t('skinType')}
                </div>
                <div
                  className={`text-[#2D1810] font-bold ${hindi ? 'font-hindi' : ''}`}>
                  
                  {t('combination')}
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-between items-end">
              <div className="text-[#2D1810]">
                <p
                  className={`font-bold text-lg leading-tight whitespace-pre-line ${hindi ? 'font-hindi' : ''}`}>
                  
                  {t('shareTagline')}
                </p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-sm">
                <div className="w-full h-full bg-[#2D1810] rounded-lg opacity-80 grid grid-cols-2 gap-0.5 p-1">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="p-6 pb-12 space-y-4">
        <button
          className={`w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold shadow-soft flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${hindi ? 'font-hindi' : ''}`}>
          
          <Share2 size={20} />
          {t('shareWhatsApp')}
        </button>
        <button
          className={`w-full bg-white/10 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${hindi ? 'font-hindi' : ''}`}>
          
          <Download size={20} />
          {t('saveGallery')}
        </button>
      </div>
    </div>);

}