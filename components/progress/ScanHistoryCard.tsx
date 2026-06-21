import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import { ScanRecord } from '@/stores/useScanStore';
import { formatDateShort } from '@/lib/formatDate';
import { concernLabel } from '@/lib/scoringLabels';

const PRIMARY = '#E07856';

interface ScanHistoryCardProps {
  scan: ScanRecord;
  previousScan?: ScanRecord;
  onPress?: (scan: ScanRecord) => void;
}

export default function ScanHistoryCard({
  scan,
  previousScan,
  onPress,
}: ScanHistoryCardProps) {
  const { t } = useTranslation();
  const delta = previousScan
    ? Math.round(scan.overall_score - previousScan.overall_score)
    : null;
  const concern = concernLabel(t, scan.top_concern);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Score ${scan.overall_score} on ${formatDateShort(scan.createdAt)}${scan.top_concern ? `, ${scan.top_concern}` : ''}`}
      onPress={onPress ? () => onPress(scan) : undefined}
      disabled={!onPress}
      style={{ opacity: 1 }}
    >
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(224,120,86,0.12)',
          elevation: 4,
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 14,
        }}
      >
        {scan.imageUrl ? (
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              overflow: 'hidden',
              marginRight: 12,
            }}
          >
            <Image
              source={{ uri: scan.imageUrl }}
              style={{ width: 52, height: 52 }}
            />
          </View>
        ) : (
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#FFEEDC',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Svg
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              opacity={0.5}
            >
              <SvgCircle
                cx={12}
                cy={9}
                r={4}
                stroke={PRIMARY}
                strokeWidth={1.5}
              />
              <Path
                d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6"
                stroke={PRIMARY}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </Svg>
          </View>
        )}

        <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, gap: 2, marginRight: 8 }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'PlusJakartaSans_600SemiBold',
                color: 'rgba(45,24,16,0.70)',
              }}
            >
              {formatDateShort(scan.createdAt)}
            </Text>
            {concern ? (
              <Text
                style={{
                  fontFamily: 'PlusJakartaSans_500Medium',
                  fontSize: 11,
                  color: 'rgba(45,24,16,0.45)',
                }}
                numberOfLines={1}
              >
                {concern}
              </Text>
            ) : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={{
                fontFamily: 'Fraunces_700Bold',
                fontSize: 22,
                color: PRIMARY,
                lineHeight: 26,
              }}
            >
              {scan.overall_score}
            </Text>
            {delta !== null && delta !== 0 && (
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'PlusJakartaSans_700Bold',
                  color: delta > 0 ? '#15803D' : '#B45309',
                }}
              >
                {delta > 0 ? `+${delta}` : `${delta}`}
              </Text>
            )}
          </View>
        </View>

        {onPress && (
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: 'rgba(224,120,86,0.10)',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 6,
            }}
          >
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18l6-6-6-6"
                stroke={PRIMARY}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        )}
      </View>
    </Pressable>
  );
}
