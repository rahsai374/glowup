import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer } from
'recharts';
import { SKIN_METRICS } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
/**
 * Radar overview of all 10 skin metrics, Cetaphil-style.
 * Each axis label is the metric name + score so the user gets the full picture at a glance.
 */
export function SkinMetricsRadar() {
  const { language } = useLanguage();
  const hindi = language === 'hi';
  const data = SKIN_METRICS.map((m) => ({
    metric: hindi ? m.labelHi : m.labelEn,
    score: m.score,
    fullMark: 100
  }));
  return (
    <div className="w-full h-72 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#E5D5C4" strokeOpacity={0.7} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fontSize: 10,
              fill: '#2D1810',
              fontWeight: 600
            }} />
          
          <Radar
            name="Skin"
            dataKey="score"
            stroke="#E07856"
            fill="#E07856"
            fillOpacity={0.28}
            strokeWidth={2}
            dot={{
              r: 3,
              fill: '#E07856',
              stroke: '#FFF',
              strokeWidth: 1.5
            }} />
          
        </RadarChart>
      </ResponsiveContainer>
    </div>);

}