import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle as SvgCircle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import DeltaPill from './DeltaPill';
import TimeWindowToggle, { TimeWindow } from './TimeWindowToggle';
import { ScanRecord } from '@/stores/useScanStore';

const PRIMARY = '#E07856';
const SPARK_H = 32;
const SPARK_PAD_X = 12;
const SPARK_PAD_Y = 4;
const MIN_SCORE = 50;
const MAX_SCORE = 100;

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) return `M${points[0].x},${points[0].y}L${points[1].x},${points[1].y}`;
  const tension = 0.3;
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += `C${cp1x},${cp1y},${cp2x},${cp2y},${p2.x},${p2.y}`;
  }
  return d;
}

interface PhotoCircleProps {
  size: number;
  borderStrong?: boolean;
  subtle?: boolean;
  imageUrl?: string;
}

function PhotoCircle({ size, borderStrong, subtle, imageUrl }: PhotoCircleProps) {
  const iconSize = size * 0.32;

  if (imageUrl) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: borderStrong ? 3 : 2,
          borderColor: borderStrong ? PRIMARY : 'rgba(224,120,86,0.18)',
          overflow: 'hidden',
          shadowColor: borderStrong ? PRIMARY : 'transparent',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: borderStrong ? 0.15 : 0,
          shadowRadius: 24,
        }}
      >
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} />
      </View>
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: borderStrong ? 3 : 2,
        borderColor: borderStrong ? PRIMARY : 'rgba(224,120,86,0.18)',
        backgroundColor: subtle ? '#FFEEDC' : '#FFCDB2',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: borderStrong ? PRIMARY : 'transparent',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: borderStrong ? 0.15 : 0,
        shadowRadius: 24,
      }}
    >
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" opacity={0.45}>
        <SvgCircle cx={12} cy={9} r={4} stroke={PRIMARY} strokeWidth={1.2} />
        <Path
          d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6"
          stroke={PRIMARY}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

interface ScanInfo {
  score: number;
  date: string;
  imageUrl?: string;
}

interface HeroCardProps {
  comparison: ScanInfo | null;
  latest: ScanInfo;
  comparisonLabel?: string;
  dateRangeText: string;
  showToggle?: boolean;
  activeToggle?: TimeWindow;
  onToggleChange?: (mode: TimeWindow) => void;
  scans?: ScanRecord[];
}

export default function HeroCard({
  comparison,
  latest,
  comparisonLabel,
  dateRangeText,
  showToggle = true,
  activeToggle = '4weeks',
  onToggleChange,
  scans,
}: HeroCardProps) {
  const diff = latest.score - (comparison ? comparison.score : latest.score);
  const scoreColor = diff < 0 ? '#D97706' : PRIMARY;
  const { width: screenWidth } = useWindowDimensions();
  const sparkW = screenWidth - 48 - 40 - 2;

  const sparkPoints = useMemo(() => {
    if (!scans || scans.length < 2 || !comparison) return null;
    const sorted = [...scans].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const range = MAX_SCORE - MIN_SCORE || 1;
    return sorted.map((s, i) => ({
      x: SPARK_PAD_X + (i / (sorted.length - 1)) * (sparkW - SPARK_PAD_X * 2),
      y: SPARK_PAD_Y + (1 - (Math.min(Math.max(s.overall_score, MIN_SCORE), MAX_SCORE) - MIN_SCORE) / range) * (SPARK_H - SPARK_PAD_Y * 2),
    }));
  }, [scans, comparison, sparkW]);

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 28,
        paddingTop: 18,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(224,120,86,0.08)',
        shadowColor: '#2D1810',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 3,
      }}
    >
      {showToggle && onToggleChange && (
        <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
          <TimeWindowToggle active={activeToggle} onChange={onToggleChange} />
        </View>
      )}

      {comparison ? (
        <>
          {/* Before/After photos */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
            }}
          >
            <View style={{ alignItems: 'center', marginRight: -8, zIndex: 1 }}>
              <PhotoCircle size={104} subtle imageUrl={comparison.imageUrl} />
              <Text
                style={{
                  fontSize: 9.5,
                  fontFamily: 'PlusJakartaSans_700Bold',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  color: 'rgba(45,24,16,0.55)',
                  marginTop: 8,
                }}
              >
                {comparisonLabel}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'PlusJakartaSans_500Medium',
                  color: 'rgba(45,24,16,0.5)',
                  marginTop: 2,
                }}
              >
                {comparison.date}
              </Text>
            </View>

            <Text
              style={{
                marginHorizontal: 4,
                marginBottom: 30,
                fontSize: 16,
                color: PRIMARY,
                opacity: 0.5,
              }}
            >
              →
            </Text>

            <View style={{ alignItems: 'center', marginLeft: -8, zIndex: 3 }}>
              <PhotoCircle size={114} borderStrong imageUrl={latest.imageUrl} />
              <Text
                style={{
                  fontSize: 9.5,
                  fontFamily: 'PlusJakartaSans_700Bold',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  color: PRIMARY,
                  marginTop: 8,
                }}
              >
                Latest
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'PlusJakartaSans_500Medium',
                  color: 'rgba(45,24,16,0.5)',
                  marginTop: 2,
                }}
              >
                {latest.date}
              </Text>
            </View>
          </View>

          {/* Score comparison */}
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 28, color: '#2D1810' }}>
              <Text style={{ opacity: 0.6 }}>{comparison.score}</Text>
              <Text style={{ fontSize: 22, opacity: 0.4 }}>  →  </Text>
              <Text style={{ color: scoreColor }}>{latest.score}</Text>
            </Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <DeltaPill diff={diff} />
          </View>
        </>
      ) : (
        <>
          {/* Single photo (first scan) */}
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <PhotoCircle size={130} borderStrong imageUrl={latest.imageUrl} />
            <Text
              style={{
                fontSize: 9.5,
                fontFamily: 'PlusJakartaSans_700Bold',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                color: PRIMARY,
                marginTop: 10,
              }}
            >
              Your First Scan
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'PlusJakartaSans_500Medium',
                color: 'rgba(45,24,16,0.5)',
                marginTop: 2,
              }}
            >
              {latest.date}
            </Text>
          </View>

          {/* Big score */}
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 44, color: PRIMARY }}>
              {latest.score}
            </Text>
          </View>

          {/* Baseline pill */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
              gap: 6,
              backgroundColor: '#FFF5EE',
              paddingVertical: 7,
              paddingHorizontal: 14,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: 'rgba(224,120,86,0.12)',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 13 }}>🌱</Text>
            <Text style={{ fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
              Baseline established
            </Text>
          </View>
        </>
      )}

      <Text
        style={{
          textAlign: 'center',
          fontSize: 11.5,
          fontFamily: 'PlusJakartaSans_500Medium',
          color: 'rgba(45,24,16,0.5)',
        }}
      >
        {dateRangeText}
      </Text>

      {sparkPoints && (
        <View style={{ marginTop: 12 }}>
          <Svg width={sparkW} height={SPARK_H}>
            <Defs>
              <LinearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={PRIMARY} stopOpacity={0.15} />
                <Stop offset="100%" stopColor={PRIMARY} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>
            <Path
              d={`${smoothPath(sparkPoints)}L${sparkPoints[sparkPoints.length - 1].x},${SPARK_H}L${sparkPoints[0].x},${SPARK_H}Z`}
              fill="url(#sparkFill)"
            />
            <Path d={smoothPath(sparkPoints)} fill="none" stroke={PRIMARY} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
            {sparkPoints.map((p, i) => (
              <SvgCircle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === sparkPoints.length - 1 ? 3.5 : 2.5}
                fill={PRIMARY}
                stroke="white"
                strokeWidth={i === sparkPoints.length - 1 ? 2 : 1.5}
                opacity={i === sparkPoints.length - 1 ? 1 : 0.5}
              />
            ))}
          </Svg>
        </View>
      )}
    </View>
  );
}
