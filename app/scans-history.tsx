import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Circle as SvgCircle, Path, Line } from 'react-native-svg';
import { useScanStore, ScanRecord } from '@/stores/useScanStore';
import ScanHistoryCard from '@/components/progress/ScanHistoryCard';
import { logEvent, EVENTS } from '@/lib/analytics';

const ESPRESSO = '#2D1810';
const PRIMARY = '#E07856';
const ACCENT = '#D4A574';
const LINE_COLOR = 'rgba(224,120,86,0.28)';
const DAY_MS = 24 * 60 * 60 * 1000;
const RAIL_W = 32;
const DOT_CX = 16;

interface ScanGroup {
  key: string;
  label: string;
  scans: ScanRecord[];
}

function groupScansByPeriod(
  history: ScanRecord[],
  t: (k: string) => string,
): ScanGroup[] {
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const thisWeekCutoff = startOfToday - 7 * DAY_MS;
  const lastWeekCutoff = startOfToday - 14 * DAY_MS;

  const groups: ScanGroup[] = [
    { key: 'this_week', label: t('scan_group_this_week'), scans: [] },
    { key: 'last_week', label: t('scan_group_last_week'), scans: [] },
    { key: 'earlier', label: t('scan_group_earlier'), scans: [] },
  ];

  for (const scan of history) {
    const ts = new Date(scan.createdAt).getTime();
    if (ts >= thisWeekCutoff) groups[0].scans.push(scan);
    else if (ts >= lastWeekCutoff) groups[1].scans.push(scan);
    else groups[2].scans.push(scan);
  }

  return groups.filter((g) => g.scans.length > 0);
}

function JourneySummaryCard({ history, t }: { history: ScanRecord[]; t: (k: string) => string }) {
  const latest = history[0];
  const oldest = history[history.length - 1];
  const daysTracked = Math.max(
    1,
    Math.round((Date.now() - new Date(oldest.createdAt).getTime()) / DAY_MS),
  );
  const scoreChange = latest.overall_score - oldest.overall_score;

  const scoreChangeDisplay =
    scoreChange === 0 ? '--' : scoreChange > 0 ? `+${scoreChange}` : `${scoreChange}`;
  const scoreChangeColor =
    scoreChange > 0
      ? '#22C55E'
      : scoreChange < 0
        ? '#D97706'
        : 'rgba(45,24,16,0.45)';

  const stats = [
    { value: `${history.length}`, label: t('scans_history_total_scans'), color: ESPRESSO },
    { value: `${daysTracked}`, label: t('scans_history_days_tracked'), color: ESPRESSO },
    { value: scoreChangeDisplay, label: t('scans_history_score_change'), color: scoreChangeColor },
  ];

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <View
        style={{
          backgroundColor: '#FFEFE3',
          borderRadius: 20,
          padding: 18,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: 'rgba(224,120,86,0.18)',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#FFE2D1',
            opacity: 0.7,
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {stats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && (
                <View
                  style={{
                    width: 1,
                    height: 36,
                    backgroundColor: 'rgba(45,24,16,0.12)',
                  }}
                />
              )}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text
                  style={{
                    fontFamily: 'Fraunces_700Bold',
                    fontSize: 24,
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    fontFamily: 'PlusJakartaSans_500Medium',
                    fontSize: 11,
                    color: 'rgba(45,24,16,0.55)',
                    textAlign: 'center',
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <Text
          style={{
            fontFamily: 'Fraunces_700Bold_Italic',
            fontSize: 11,
            color: 'rgba(45,24,16,0.45)',
            textAlign: 'center',
            marginTop: 12,
          }}
        >
          {t('scans_history_since_day_one')}
        </Text>
      </View>
    </Animated.View>
  );
}

function TimelineDot({ isLatest, isBaseline }: { isLatest: boolean; isBaseline: boolean }) {
  if (isLatest) {
    return (
      <View style={{ position: 'absolute', top: '50%', left: DOT_CX - 11, marginTop: -11 }}>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: 'rgba(224,120,86,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: PRIMARY,
            }}
          />
        </View>
      </View>
    );
  }

  if (isBaseline) {
    return (
      <View style={{ position: 'absolute', top: '50%', left: DOT_CX - 7, marginTop: -7 }}>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 1.5,
            borderColor: 'rgba(45,24,16,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(45,24,16,0.22)',
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: '50%',
        left: DOT_CX - 5,
        marginTop: -5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(224,120,86,0.50)',
      }}
    />
  );
}

function TimelineRow({
  scan,
  previousScan,
  isLatest,
  isBaseline,
  isFirst,
  isLast,
  onPress,
  animDelay,
}: {
  scan: ScanRecord;
  previousScan?: ScanRecord;
  isLatest: boolean;
  isBaseline: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPress: (s: ScanRecord) => void;
  animDelay: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(animDelay).springify()}
      style={{ flexDirection: 'row', marginBottom: 10 }}
    >
      <View style={{ width: RAIL_W, alignItems: 'center' }}>
        {!isFirst && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: '50%',
              left: DOT_CX - 1,
              width: 2,
              backgroundColor: LINE_COLOR,
            }}
          />
        )}
        {!isLast && (
          <View
            style={{
              position: 'absolute',
              top: '50%',
              bottom: 0,
              left: DOT_CX - 1,
              width: 2,
              backgroundColor: LINE_COLOR,
            }}
          />
        )}
        <TimelineDot isLatest={isLatest} isBaseline={isBaseline} />
      </View>

      <View style={{ flex: 1 }}>
        <ScanHistoryCard
          scan={scan}
          previousScan={previousScan}
          onPress={onPress}
        />
      </View>
    </Animated.View>
  );
}

function TimelineSectionHeader({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: 'row', paddingTop: 20, paddingBottom: 6 }}>
      <View style={{ width: RAIL_W, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={2} height={16} viewBox="0 0 2 16">
          <Line x1={1} y1={0} x2={1} y2={3} stroke={LINE_COLOR} strokeWidth={2} />
          <Line x1={1} y1={5} x2={1} y2={8} stroke={LINE_COLOR} strokeWidth={2} />
          <Line x1={1} y1={10} x2={1} y2={13} stroke={LINE_COLOR} strokeWidth={2} />
        </Svg>
      </View>
      <Text
        style={{
          fontFamily: 'PlusJakartaSans_700Bold',
          fontSize: 11,
          color: 'rgba(45,24,16,0.55)',
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          alignSelf: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function ScansHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const history = useScanStore((s) => s.scanHistory);

  const groups = groupScansByPeriod(history, t);
  const useGrouping = groups.length > 1;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      {/* Ambient blobs */}
      <View
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: PRIMARY,
          opacity: 0.12,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 440,
          left: -80,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: ACCENT,
          opacity: 0.15,
        }}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingTop: insets.top + 12,
          paddingBottom: 6,
          paddingHorizontal: 20,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={16}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 8 })}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18l-6-6 6-6"
              stroke={ESPRESSO}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
        <View>
          <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 26, color: ESPRESSO }}>
            {t('scans_history_title')}
          </Text>
          {history.length > 0 && (
            <Text
              style={{
                fontFamily: 'Fraunces_700Bold_Italic',
                fontSize: 13,
                color: 'rgba(45,24,16,0.45)',
                marginTop: 1,
              }}
            >
              {t('progress_journey_total', { count: history.length })}
            </Text>
          )}
        </View>
      </View>

      {history.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 }}>
          <Svg width={56} height={56} viewBox="0 0 24 24" fill="none">
            <Path
              d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
              stroke="rgba(45,24,16,0.2)"
              strokeWidth={1.5}
              fill="none"
            />
            <SvgCircle cx={12} cy={13} r={4} stroke="rgba(45,24,16,0.2)" strokeWidth={1.5} fill="none" />
          </Svg>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'PlusJakartaSans_700Bold',
              color: ESPRESSO,
              textAlign: 'center',
            }}
          >
            {t('scans_history_empty_title')}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans_500Medium',
              color: 'rgba(45,24,16,0.5)',
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            {t('scans_history_empty_body')}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          style={{ zIndex: 10 }}
        >
          {history.length > 1 && <JourneySummaryCard history={history} t={t} />}

          {useGrouping
            ? (() => {
                let globalIdx = 0;
                return groups.map((group) => (
                  <View key={group.key}>
                    <TimelineSectionHeader label={group.label} />
                    {group.scans.map((scan, scanIdx) => {
                      const idx = globalIdx++;
                      const historyIndex = history.indexOf(scan);
                      return (
                        <TimelineRow
                          key={scan.id}
                          scan={scan}
                          previousScan={history[historyIndex + 1]}
                          isLatest={historyIndex === 0}
                          isBaseline={historyIndex === history.length - 1}
                          isFirst={scanIdx === 0}
                          isLast={scanIdx === group.scans.length - 1}
                          animDelay={Math.min(idx, 8) * 80}
                          onPress={(s) => {
                            logEvent(EVENTS.SCAN_HISTORY_CARD_TAPPED, {
                              scan_id: s.id,
                              score: s.overall_score,
                            });
                            router.push(`/(tabs)/results?scanId=${s.id}`);
                          }}
                        />
                      );
                    })}
                  </View>
                ));
              })()
            : history.map((scan, i) => (
                <TimelineRow
                  key={scan.id}
                  scan={scan}
                  previousScan={history[i + 1]}
                  isLatest={i === 0}
                  isBaseline={i === history.length - 1}
                  isFirst={i === 0}
                  isLast={i === history.length - 1}
                  animDelay={Math.min(i, 8) * 80}
                  onPress={(s) => {
                    logEvent(EVENTS.SCAN_HISTORY_CARD_TAPPED, {
                      scan_id: s.id,
                      score: s.overall_score,
                    });
                    router.push(`/(tabs)/results?scanId=${s.id}`);
                  }}
                />
              ))}
        </ScrollView>
      )}
    </View>
  );
}
