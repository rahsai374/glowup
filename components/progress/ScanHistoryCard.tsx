import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import { ScanRecord } from '@/stores/useScanStore';
import { formatDateShort } from '@/lib/formatDate';
import { concernLabel, truncateWin } from '@/lib/scoringLabels';

const PRIMARY = '#E07856';

interface ScanHistoryCardProps {
  scan: ScanRecord;
  previousScan?: ScanRecord;
  isBaseline?: boolean;
  isLatest?: boolean;
  onPress?: (scan: ScanRecord) => void;
}

export default function ScanHistoryCard({
  scan,
  previousScan,
  isBaseline,
  isLatest,
  onPress,
}: ScanHistoryCardProps) {
  const { t } = useTranslation();
  const delta = previousScan ? Math.round(scan.overall_score - previousScan.overall_score) : null;
  const concern = concernLabel(t, scan.top_concern);
  const win = truncateWin(scan.top_win, 36);
  const thumbSize = isLatest ? 56 : 48;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Score ${scan.overall_score} on ${formatDateShort(scan.createdAt)}${scan.top_concern ? `, ${scan.top_concern}` : ''}${scan.top_win ? `, ${scan.top_win}` : ''}`}
      onPress={onPress ? () => onPress(scan) : undefined}
      disabled={!onPress}
      style={({ pressed }) => ({
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isLatest ? 'rgba(224,120,86,0.25)' : 'rgba(224,120,86,0.08)',
        shadowColor: '#2D1810',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isLatest ? 0.06 : 0.04,
        shadowRadius: 12,
        elevation: 2,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        transform: [{ scale: pressed && onPress ? 0.98 : 1 }],
      })}
    >
      {scan.imageUrl ? (
        <View
          style={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: 14,
            overflow: 'hidden',
            borderWidth: isLatest ? 2 : 1,
            borderColor: isLatest ? PRIMARY : 'rgba(224,120,86,0.1)',
            marginRight: 12,
          }}
        >
          <Image source={{ uri: scan.imageUrl }} style={{ width: '100%', height: '100%' }} />
        </View>
      ) : (
        <View
          style={{
            width: thumbSize,
            height: thumbSize,
            borderRadius: 14,
            backgroundColor: '#FFEEDC',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: isLatest ? 2 : 1,
            borderColor: isLatest ? PRIMARY : 'rgba(224,120,86,0.1)',
            marginRight: 12,
          }}
        >
          <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" opacity={0.45}>
            <SvgCircle cx={12} cy={9} r={4} stroke={PRIMARY} strokeWidth={1.2} />
            <Path
              d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6"
              stroke={PRIMARY}
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      )}

      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 18, color: PRIMARY, marginRight: 8 }}>
            {scan.overall_score}
          </Text>
          <Text
            style={{
              fontFamily: 'PlusJakartaSans_600SemiBold',
              fontSize: 13,
              color: '#2D1810',
              marginRight: 8,
            }}
          >
            {formatDateShort(scan.createdAt)}
          </Text>
          {delta !== null && delta !== 0 && (
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'PlusJakartaSans_700Bold',
                color: delta > 0 ? '#22C55E' : '#D97706',
                marginRight: 8,
              }}
            >
              {delta > 0 ? `+${delta} ↑` : `${delta} ↓`}
            </Text>
          )}
          {isLatest && (
            <View
              style={{
                backgroundColor: 'rgba(224,120,86,0.12)',
                paddingVertical: 3,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'PlusJakartaSans_700Bold',
                  color: PRIMARY,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}
              >
                {t('scan_latest_badge')}
              </Text>
            </View>
          )}
          {isBaseline && !isLatest && (
            <View
              style={{
                backgroundColor: 'rgba(45,24,16,0.06)',
                paddingVertical: 3,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'PlusJakartaSans_600SemiBold',
                  color: 'rgba(45,24,16,0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}
              >
                {t('scan_baseline_badge')}
              </Text>
            </View>
          )}
        </View>

        {(concern || win) && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 6, flexWrap: 'wrap' }}>
            {concern && (
              <View
                style={{
                  backgroundColor: 'rgba(248,113,113,0.12)',
                  paddingVertical: 3,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'PlusJakartaSans_600SemiBold',
                    color: '#EF4444',
                  }}
                >
                  {concern}
                </Text>
              </View>
            )}
            {win && (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  flex: 1,
                  fontSize: 11,
                  fontFamily: 'PlusJakartaSans_500Medium',
                  color: 'rgba(45,24,16,0.6)',
                }}
              >
                {win}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Chevron — only show when tappable */}
      {onPress && (
        <Text style={{ color: 'rgba(45,24,16,0.25)', fontSize: 20, flexShrink: 0 }}>›</Text>
      )}
    </Pressable>
  );
}
