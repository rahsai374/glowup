import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SKIN_METRICS, type SkinMetric } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
/**
 * Detailed Cetaphil-style breakdown: each metric on its own row with
 * label in metric color, 5 stars (filled by score/20), score number, and a
 * filled progress bar tinted to the metric's identity color.
 */
export function SkinMetricsList() {
  const { language } = useLanguage();
  const hindi = language === 'hi';
  return (
    <div className="space-y-5">
      {SKIN_METRICS.map((metric, idx) =>
      <SkinMetricRow
        key={metric.id}
        metric={metric}
        hindi={hindi}
        index={idx} />

      )}
    </div>);

}
function SkinMetricRow({
  metric,
  hindi,
  index




}: {metric: SkinMetric;hindi: boolean;index: number;}) {
  const stars = Math.max(1, Math.min(5, Math.round(metric.score / 20)));
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        delay: index * 0.05
      }}>
      
      <div className="flex items-baseline justify-between mb-1.5">
        <h4
          className={`font-bold text-base ${hindi ? 'font-hindi' : ''}`}
          style={{
            color: metric.color
          }}>
          
          {hindi ? metric.labelHi : metric.labelEn}
        </h4>
        <span className="text-sm font-bold text-brand-text/70 tabular-nums">
          {metric.score}
          <span className="text-brand-text/40">/100</span>
        </span>
      </div>

      {/* Stars + bar combined row, Cetaphil-style */}
      <div
        className="relative rounded-lg overflow-hidden border-2 h-9 flex items-center"
        style={{
          borderColor: metric.color
        }}>
        
        {/* Filled bar */}
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            backgroundColor: metric.color
          }}
          initial={{
            width: 0
          }}
          animate={{
            width: `${metric.score}%`
          }}
          transition={{
            duration: 0.9,
            ease: 'easeOut',
            delay: index * 0.05
          }} />
        

        {/* Stars overlay */}
        <div className="relative flex items-center gap-1 pl-3 z-10">
          {Array.from({
            length: 5
          }).map((_, i) =>
          <Star
            key={i}
            size={14}
            strokeWidth={2}
            className={i < stars ? 'text-white' : 'text-white/40'}
            fill={i < stars ? 'currentColor' : 'transparent'} />

          )}
        </div>
      </div>

      {/* Detail line */}
      <p
        className={`text-xs text-brand-text/60 mt-1.5 leading-snug ${hindi ? 'font-hindi' : ''}`}>
        
        {hindi ? metric.detailHi : metric.detailEn}
      </p>
    </motion.div>);

}