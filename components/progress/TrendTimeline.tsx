import React, { useMemo } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import Svg, {
  Path,
  Circle as SvgCircle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { ScanRecord } from '@/stores/useScanStore';

const PRIMARY = '#E07856';
const CHART_H = 64;
const PAD_X = 36;
const PAD_Y = 10;
const MIN_SCORE = 50;
const MAX_SCORE = 100;

function smoothPath(points: number[][]): string {
  if (points.length < 2) return '';
  const tension = 0.3;
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface TrendTimelineProps {
  scans: ScanRecord[];
  onSelectScan: (scan: ScanRecord) => void;
}

export default function TrendTimeline({ scans, onSelectScan }: TrendTimelineProps) {
  const { width: screenWidth } = useWindowDimensions();
  const chartW = screenWidth - 80;

  if (scans.length < 2) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          paddingVertical: 18,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: 'rgba(224,120,86,0.08)',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 3,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 17, color: '#2D1810', marginBottom: 8 }}>
          Your Journey
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginTop: 14,
            marginBottom: 6,
            width: '100%',
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: `${PRIMARY}15`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: PRIMARY }} />
          </View>
          <View
            style={{
              flex: 1,
              height: 1,
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: 'rgba(45,24,16,0.08)',
            }}
          />
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: 'rgba(45,24,16,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 10, color: 'rgba(45,24,16,0.4)', fontFamily: 'PlusJakartaSans_700Bold' }}>
              ?
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 12, color: 'rgba(45,24,16,0.55)', fontFamily: 'PlusJakartaSans_400Regular', marginTop: 8 }}>
          Scan again to see your trend
        </Text>
      </View>
    );
  }

  const plotW = chartW - PAD_X * 2;
  const plotH = CHART_H - PAD_Y * 2;

  const data = useMemo(() => [...scans].reverse(), [scans]);

  const points = data.map((scan, i) => {
    const x = PAD_X + (i / (data.length - 1)) * plotW;
    const score = Math.max(MIN_SCORE, Math.min(MAX_SCORE, scan.overall_score));
    const y = PAD_Y + plotH - ((score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * plotH;
    return [x, y];
  });

  const pathD = smoothPath(points);
  const fillD =
    pathD +
    ` L ${points[points.length - 1][0]} ${CHART_H - PAD_Y}` +
    ` L ${points[0][0]} ${CHART_H - PAD_Y} Z`;

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 24,
        paddingTop: 18,
        paddingHorizontal: 16,
        paddingBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(224,120,86,0.08)',
        shadowColor: '#2D1810',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 8,
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 17, color: '#2D1810' }}>
          Your Journey
        </Text>
        <Text style={{ fontSize: 11.5, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(45,24,16,0.55)' }}>
          {data.length} scans
        </Text>
      </View>

      <Svg width="100%" height={CHART_H} viewBox={`0 0 ${chartW} ${CHART_H}`}>
        <Defs>
          <LinearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={PRIMARY} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={PRIMARY} stopOpacity={0.01} />
          </LinearGradient>
        </Defs>
        <Path d={fillD} fill="url(#sparkFill)" />
        <Path
          d={pathD}
          fill="none"
          stroke={PRIMARY}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => {
          const isLast = i === data.length - 1;
          return (
            <SvgCircle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={isLast ? 4 : 2.5}
              fill={PRIMARY}
              stroke="white"
              strokeWidth={isLast ? 2 : 1.5}
            />
          );
        })}
      </Svg>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 4,
          marginTop: 6,
          gap: 4,
        }}
      >
        {data.map((scan, i) => {
          const isLatest = i === data.length - 1;
          return (
            <Pressable
              key={scan.id}
              onPress={() => onSelectScan(scan)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                gap: 2,
                paddingVertical: 8,
                paddingHorizontal: 4,
                borderRadius: 12,
                backgroundColor: pressed ? `${PRIMARY}10` : 'transparent',
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                <Text
                  style={{
                    fontFamily: 'Fraunces_700Bold',
                    fontSize: isLatest ? 16 : 14,
                    color: PRIMARY,
                  }}
                >
                  {scan.overall_score}
                </Text>
                {isLatest && (
                  <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: PRIMARY }} />
                )}
              </View>
              <Text
                style={{
                  fontSize: 9.5,
                  fontFamily: 'PlusJakartaSans_600SemiBold',
                  color: isLatest ? PRIMARY : 'rgba(45,24,16,0.55)',
                }}
              >
                {formatDateShort(scan.createdAt)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
