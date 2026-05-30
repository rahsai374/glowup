import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
export function AuthScreen({ onNext }: {onNext: () => void;}) {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setStep('otp');
  };
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 4) onNext();
  };
  return (
    <motion.div
      className="flex-1 flex flex-col bg-brand-bg p-8 pt-24"
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}>
      
      {step === 'phone' ?
      <div className="flex-1 flex flex-col">
          <h1
          className={`text-3xl font-serif font-bold text-brand-text mb-8 ${hindi ? 'font-hindi' : ''}`}>
          
            {t('loginToContinue')}
          </h1>

          <form onSubmit={handlePhoneSubmit} className="flex-1 flex flex-col">
            <div className="mb-8">
              <label
              className={`block text-sm font-medium text-brand-text/80 mb-2 ${hindi ? 'font-hindi' : ''}`}>
              
                {t('mobileNumber')}
              </label>
              <div className="flex bg-white rounded-2xl shadow-sm border border-brand-primary/10 overflow-hidden focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                <div className="px-4 py-4 bg-brand-bg/50 border-r border-brand-primary/10 text-brand-text font-medium flex items-center">
                  +91
                </div>
                <input
                type="tel"
                value={phone}
                onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                }
                placeholder="98765 43210"
                className="flex-1 px-4 py-4 outline-none text-lg tracking-wider"
                autoFocus />
              
              </div>
            </div>

            <div
            className={`mt-auto mb-8 flex items-center gap-2 text-brand-text/60 text-sm justify-center bg-white/50 py-3 rounded-xl ${hindi ? 'font-hindi' : ''}`}>
            
              <ShieldCheck size={16} className="text-green-500" />
              <span>{t('noSpam')}</span>
            </div>

            <button
            type="submit"
            disabled={phone.length < 10}
            className={`w-full bg-brand-primary text-white py-4 rounded-2xl font-medium shadow-soft flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all ${hindi ? 'font-hindi' : ''}`}>
            
              {t('sendOtp')}
              <ArrowRight size={20} />
            </button>
          </form>
        </div> :

      <div className="flex-1 flex flex-col">
          <h1
          className={`text-3xl font-serif font-bold text-brand-text mb-2 ${hindi ? 'font-hindi' : ''}`}>
          
            {t('enterOtp')}
          </h1>
          <p className={`text-brand-text/60 mb-8 ${hindi ? 'font-hindi' : ''}`}>
            {t('sentTo')} +91 {phone}
          </p>

          <form onSubmit={handleOtpSubmit} className="flex-1 flex flex-col">
            <div className="flex justify-between gap-4 mb-8">
              {otp.map((digit, idx) =>
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const newOtp = [...otp];
                newOtp[idx] = e.target.value.replace(/\D/g, '');
                setOtp(newOtp);
                if (e.target.value && idx < 3) {
                  document.getElementById(`otp-${idx + 1}`)?.focus();
                }
              }}
              className="w-16 h-16 bg-white border border-brand-primary/10 rounded-2xl text-center text-2xl font-bold text-brand-text shadow-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />

            )}
            </div>

            <button
            type="button"
            onClick={() => setStep('phone')}
            className={`text-brand-primary font-medium text-sm self-center mb-auto ${hindi ? 'font-hindi' : ''}`}>
            
              {t('changePhone')}
            </button>

            <button
            type="submit"
            disabled={otp.join('').length < 4}
            className={`w-full bg-brand-primary text-white py-4 rounded-2xl font-medium shadow-soft flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all mb-8 ${hindi ? 'font-hindi' : ''}`}>
            
              {t('verifyLogin')}
            </button>
          </form>
        </div>
      }
    </motion.div>);

}