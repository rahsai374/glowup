import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import { ScanRecord } from '@/stores/useScanStore';
import { formatDateShort } from '@/lib/formatDate';

const PRIMARY = '#E07856';

interface ScanHistoryCardProps {
  scan: ScanRecord;
  previousScan?: ScanRecord;
  isBaseline?: boolean;
  onPress: (scan: ScanRecord) => void;
}

export default function ScanHistoryCard({ scan, previousScan, isBaseline, onPress }: ScanHistoryCardProps) {
  const delta = previousScan ? Math.round(scan.overall_score - previousScan.overall_score) : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Score ${scan.overall_score} on ${formatDateShort(scan.createdAt)}${scan.top_concern ? `, ${scan.top_concern}` : ''}${scan.top_win ? `, ${scan.top_win}` : ''}`}
      onPress={() => onPress(scan)}
      style={({ pressed }) => ({
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(224,120,86,0.08)',
        shadowColor: '#2D1810',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
        marginBottom: 8,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Thumbnail */}
      {scan.imageUrl ? (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            overflow: 'hidden',
            flexShrink: 0,
            borderWidth: 1,
            borderColor: 'rgba(224,120,86,0.1)',
          }}
        >
          <Image source={{ uri: scan.imageUrl }} style={{ width: '100%', height: '100%' }} />
        </View>
      ) : (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: '#FFEEDC',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            borderWidth: 1,
            borderColor: 'rgba(224,120,86,0.1)',
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

      {/* Content */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 18, color: PRIMARY }}>
            {scan.overall_score}
          </Text>
          <Text
            style={{
              fontFamily: 'PlusJakartaSans_600SemiBold',
              fontSize: 13,
              color: '#2D1810',
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
              }}
            >
              {delta > 0 ? `+${delta} ↑` : `${delta} ↓`}
            </Text>
          )}
          {isBaseline && (
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
                }}
              >
                Baseline
              </Text>
            </View>
          )}
        </View>
        {(scan.top_concern || scan.top_win) && (
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
            {scan.top_concern && (
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
                  {scan.top_concern}
                </Text>
              </View>
            )}
            {scan.top_win && (
              <View
                style={{
                  backgroundColor: 'rgba(74,222,128,0.12)',
                  paddingVertical: 3,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: 'PlusJakartaSans_600SemiBold',
                    color: '#22C55E',
                  }}
                >
                  {scan.top_win} ↑
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Chevron */}
      <Text style={{ color: 'rgba(45,24,16,0.25)', fontSize: 20, flexShrink: 0 }}>›</Text>
    </Pressable>
  );
}
