import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { PROGRESS_HISTORY } from '../data/mockData';
export function ProgressScreen() {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const chartData = [...PROGRESS_HISTORY].reverse();
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
        <div className="px-6 mb-6">
          <h1
            className={`text-3xl text-brand-text mb-1 ${hindi ? 'font-hindi font-bold' : 'font-serif font-bold'}`}>
            
            {t('yourProgress')}
          </h1>
          <p
            className={`text-brand-text/60 text-sm ${hindi ? 'font-hindi' : 'font-serif italic'}`}>
            
            {t('skinScoreTrend')}
          </p>
        </div>

        {/* Chart Card */}
        <div className="px-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-primary/10">
            <h3
              className={`font-bold text-brand-text mb-6 ${hindi ? 'font-hindi' : ''}`}>
              
              {t('skinScoreTrend')}
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: '#2D1810',
                      opacity: 0.6
                    }}
                    dy={10} />
                  
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{
                      color: '#2D1810',
                      fontWeight: 'bold'
                    }} />
                  
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#E07856"
                    strokeWidth={4}
                    dot={{
                      r: 6,
                      fill: '#E07856',
                      stroke: '#FFF',
                      strokeWidth: 2
                    }}
                    activeDot={{
                      r: 8
                    }} />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="px-6">
          <h3
            className={`font-bold text-brand-text mb-4 ${hindi ? 'font-hindi' : ''}`}>
            
            {t('pastScans')}
          </h3>
          <div className="space-y-3">
            {PROGRESS_HISTORY.map((scan, idx) =>
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: idx * 0.1
              }}
              className="bg-white p-3 rounded-2xl shadow-sm border border-brand-primary/5 flex items-center gap-4">
              
                <img
                src={scan.image}
                alt="Scan"
                className="w-16 h-16 rounded-xl object-cover shrink-0" />
              
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-brand-text mb-0.5">
                    {scan.date}
                  </div>
                  <div
                  className={`text-xs text-brand-text/60 mb-1.5 ${hindi ? 'font-hindi' : ''}`}>
                  
                    {t('scoreLabel')}: {scan.score}/100
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div
                    className={`inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${hindi ? 'font-hindi normal-case' : ''}`}>
                    
                      <AlertCircle size={10} strokeWidth={2.5} />
                      <span className="truncate max-w-[120px]">
                        {hindi ? scan.topConcernHi : scan.topConcernEn}
                      </span>
                    </div>
                    <div
                    className={`inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${hindi ? 'font-hindi normal-case' : ''}`}>
                    
                      <TrendingUp size={10} strokeWidth={2.5} />
                      <span className="truncate max-w-[120px]">
                        {hindi ? scan.topWinHi : scan.topWinEn}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center font-bold text-brand-primary shrink-0">
                  {scan.score}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>);

}