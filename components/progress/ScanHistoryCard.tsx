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
  const delta = previousScan ? Math.round(scan.overall_score - previousScan.overall_score) : null;
  const concern = concernLabel(t, scan.top_concern);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Score ${scan.overall_score} on ${formatDateShort(scan.createdAt)}${scan.top_concern ? `, ${scan.top_concern}` : ''}`}
      onPress={onPress ? () => onPress(scan) : undefined}
      disabled={!onPress}
      style={({ pressed }) => ({
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        shadowColor: '#2D1810',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        transform: [{ scale: pressed && onPress ? 0.97 : 1 }],
      })}
    >
      {scan.imageUrl ? (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            overflow: 'hidden',
            marginRight: 14,
          }}
        >
          <Image source={{ uri: scan.imageUrl }} style={{ width: '100%', height: '100%' }} />
        </View>
      ) : (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: '#FFEEDC',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
          }}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" opacity={0.5}>
            <SvgCircle cx={12} cy={9} r={4} stroke={PRIMARY} strokeWidth={1.5} />
            <Path
              d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6"
              stroke={PRIMARY}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      )}

      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 24, color: PRIMARY }}>
            {scan.overall_score}
          </Text>
          {delta !== null && delta !== 0 && (
            <View
              style={{
                backgroundColor: delta > 0 ? '#DCFCE7' : '#FEF3C7',
                paddingVertical: 3,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'PlusJakartaSans_700Bold',
                  color: delta > 0 ? '#16A34A' : '#D97706',
                }}
              >
                {delta > 0 ? `+${delta}` : `${delta}`}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            fontFamily: 'PlusJakartaSans_500Medium',
            fontSize: 13,
            color: 'rgba(45,24,16,0.50)',
          }}
          numberOfLines={1}
        >
          {formatDateShort(scan.createdAt)}
          {concern ? `  ·  ${concern}` : ''}
        </Text>
      </View>

      {onPress && (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
          <Path
            d="M9 18l6-6-6-6"
            stroke="rgba(45,24,16,0.25)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </Pressable>
  );
}
