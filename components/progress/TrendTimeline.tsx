import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScanRecord } from '@/stores/useScanStore';
import { formatDateShort } from '@/lib/formatDate';

const PRIMARY = '#E07856';
const ESPRESSO = '#2D1810';

interface TrendTimelineProps {
  scans: ScanRecord[];
  totalScans: number;
  onSeeAll: () => void;
}

function ScoreChip({ score, date, latest }: { score: number; date: string; latest: boolean }) {
  return (
    <View
      style={{
        flex: 1,
        minHeight: 64,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 4,
        backgroundColor: latest ? PRIMARY : 'rgba(224,120,86,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: latest ? PRIMARY : 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: latest ? 0.19 : 0,
        shadowRadius: 14,
        elevation: latest ? 4 : 0,
      }}
    >
      <Text
        style={{
          fontFamily: 'Fraunces_700Bold',
          fontSize: latest ? 20 : 17,
          color: latest ? 'white' : ESPRESSO,
        }}
      >
        {score}
      </Text>
      <Text
        style={{
          fontSize: 9.5,
          fontFamily: 'PlusJakartaSans_600SemiBold',
          color: latest ? 'rgba(255,255,255,0.85)' : 'rgba(45,24,16,0.55)',
          marginTop: 2,
        }}
      >
        {date}
      </Text>
    </View>
  );
}

function DashedPlaceholder() {
  return (
    <View
      style={{
        flex: 1,
        minHeight: 64,
        borderRadius: 14,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: 'rgba(45,24,16,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 12, color: 'rgba(45,24,16,0.35)', fontFamily: 'PlusJakartaSans_600SemiBold' }}>
        ?
      </Text>
    </View>
  );
}

export default function TrendTimeline({ scans, totalScans, onSeeAll }: TrendTimelineProps) {
  const { t } = useTranslation();
  // scans arrive newest-first; chips render oldest→newest with newest on the right
  const lastFive = scans.slice(0, 5);
  const chips = [...lastFive].reverse();
  const hasMultiple = chips.length >= 2;

  const scanCount = scans.length;
  const meta = !hasMultiple
    ? t('progress_journey_total', { count: totalScans })
    : scanCount < totalScans
      ? t('progress_journey_count', { shown: chips.length, total: scanCount })
      : t('progress_journey_total', { count: scanCount });

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
          marginBottom: 12,
          paddingHorizontal: 4,
        }}
      >
        <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 17, color: ESPRESSO }}>
          {t('progress_journey')}
        </Text>
        <Text style={{ fontSize: 11.5, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(45,24,16,0.55)' }}>
          {meta}
        </Text>
      </View>

      {hasMultiple ? (
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 4 }}>
          {chips.map((s, i) => (
            <ScoreChip
              key={s.id}
              score={s.overall_score}
              date={formatDateShort(s.createdAt)}
              latest={i === chips.length - 1}
            />
          ))}
        </View>
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 4 }}>
            <DashedPlaceholder />
            <DashedPlaceholder />
            <DashedPlaceholder />
            <DashedPlaceholder />
            {chips[0] && (
              <ScoreChip
                score={chips[0].overall_score}
                date={formatDateShort(chips[0].createdAt)}
                latest
              />
            )}
          </View>
          <Text
            style={{
              textAlign: 'center',
              marginTop: 12,
              fontSize: 12,
              fontFamily: 'PlusJakartaSans_500Medium',
              color: 'rgba(45,24,16,0.55)',
            }}
          >
            {t('progress_scan_again_to_fill')}
          </Text>
        </>
      )}

      {hasMultiple && (
        <Pressable
          accessibilityRole="button"
          onPress={onSeeAll}
          style={({ pressed }) => ({
            marginTop: 12,
            paddingVertical: 8,
            alignItems: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: PRIMARY }}>
            {t('progress_see_all_scans')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
