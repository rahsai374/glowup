import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import { useScanStore, ScanRecord, daysSinceLastScan } from '@/stores/useScanStore';
import HeroCard from '@/components/progress/HeroCard';
import TrendTimeline from '@/components/progress/TrendTimeline';
import ScanHistoryCard from '@/components/progress/ScanHistoryCard';
import ProgressCTA from '@/components/progress/ProgressCTA';
import ScanBottomSheet from '@/components/progress/ScanBottomSheet';
import { TimeWindow } from '@/components/progress/TimeWindowToggle';
import { logEvent, EVENTS } from '@/lib/analytics';
import { formatDateShort } from '@/lib/formatDate';

const PRIMARY = '#E07856';
const ACCENT = '#D4A574';

type ProgressState = 0 | 1 | 'R' | 2 | 3 | 4 | 5;

const SUBTITLE_KEYS: Record<string, string> = {
  '0': 'progress_sub_ftue',
  '1': 'progress_sub_first',
  R: 'progress_sub_returning',
  '2': 'progress_sub_no_change',
  '3': 'progress_sub_minor',
  '4': 'progress_sub_happy',
  '5': 'progress_sub_decreased',
};

function determineProgressState(history: ScanRecord[], timeWindow: TimeWindow): ProgressState {
  if (history.length === 0) return 0;
  if (history.length === 1) return 1;
  const daysSince = daysSinceLastScan(history);
  if (daysSince !== null && daysSince > 56) return 'R';
  const latest = history[0];
  const comparison = findComparisonScan(history, timeWindow);
  if (!comparison) return 1;
  const diff = latest.overall_score - comparison.overall_score;
  if (diff < 0) return 5;
  if (diff > 5) return 4;
  if (diff > 0) return 3;
  return 2;
}

function findComparisonScan(
  history: ScanRecord[],
  mode: TimeWindow
): ScanRecord | null {
  if (history.length < 2) return null;
  const latest = history[0];
  const latestTime = new Date(latest.createdAt).getTime();

  let targetMs: number;
  if (mode === 'week') {
    targetMs = latestTime - 7 * 24 * 60 * 60 * 1000;
  } else if (mode === '4weeks') {
    targetMs = latestTime - 28 * 24 * 60 * 60 * 1000;
  } else {
    return history[history.length - 1];
  }

  let best: ScanRecord | null = null;
  let bestDist = Infinity;
  for (let i = 1; i < history.length; i++) {
    const scanTime = new Date(history[i].createdAt).getTime();
    const dist = Math.abs(scanTime - targetMs);
    if (dist < bestDist) {
      bestDist = dist;
      best = history[i];
    }
  }
  return best;
}

function scansForWindow(history: ScanRecord[], mode: TimeWindow, comparison: ScanRecord | null): ScanRecord[] {
  if (mode === 'all' || !comparison) return history;
  const compTime = new Date(comparison.createdAt).getTime();
  return history.filter((s) => new Date(s.createdAt).getTime() >= compTime);
}

function weeksSince(dateStr: string): number {
  return Math.round((Date.now() - new Date(dateStr).getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function comparisonAgeLabel(comparison: ScanRecord, mode: TimeWindow): string {
  if (mode === 'all') return 'First scan';
  const weeks = weeksSince(comparison.createdAt);
  if (weeks < 1) return 'Days ago';
  if (weeks === 1) return '1 week ago';
  return `${weeks} weeks ago`;
}

function dateRangeText(
  comparison: ScanRecord | null,
  latest: ScanRecord,
  mode: TimeWindow,
  scanCount: number
): string {
  if (!comparison) return 'Scan again next week to track changes';
  const modeLabel = mode === 'week' ? 'Last week' : mode === '4weeks' ? 'Last 4 weeks' : 'All time';
  return `${modeLabel} · ${formatDateShort(comparison.createdAt)} — ${formatDateShort(latest.createdAt)} · ${scanCount} scans`;
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const history = useScanStore((s) => s.scanHistory);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('4weeks');
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);

  useFocusEffect(
    useCallback(() => {
      logEvent(EVENTS.TAB_VIEWED, { tab_name: 'progress' });
    }, [])
  );

  const state = useMemo(() => determineProgressState(history, timeWindow), [history, timeWindow]);
  const latest = history[0] ?? null;
  const comparison = useMemo(
    () => (history.length >= 2 ? findComparisonScan(history, timeWindow) : null),
    [history, timeWindow]
  );
  const diff = latest && comparison ? latest.overall_score - comparison.overall_score : 0;
  const windowScans = useMemo(() => scansForWindow(history, timeWindow, comparison), [history, timeWindow, comparison]);

  const handleScanTap = (scan: ScanRecord) => {
    logEvent(EVENTS.SCAN_HISTORY_CARD_TAPPED, {
      overall_score: scan.overall_score,
      scan_index: history.findIndex((s) => s.id === scan.id),
    });
    setSelectedScan(scan);
  };

  const { t } = useTranslation();
  const navigateToScan = () => router.push('/scan');
  const navigateToRoutine = () => router.push('/(tabs)/routine');

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
          top: 340,
          left: -80,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: ACCENT,
          opacity: 0.15,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 640,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: PRIMARY,
          opacity: 0.08,
        }}
      />

      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 40,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text
          style={{
            fontSize: 30,
            fontFamily: 'Fraunces_700Bold',
            color: '#2D1810',
            marginBottom: 4,
          }}
        >
          {t('progress_title')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Fraunces_700Bold_Italic',
            color: 'rgba(45,24,16,0.5)',
            marginBottom: 28,
          }}
        >
          {t(SUBTITLE_KEYS[String(state)])}
        </Text>

        {state === 0 && <StateZero onScan={navigateToScan} />}
        {state === 1 && latest && (
          <StateFirstScan latest={latest} onScan={navigateToScan} onSelectScan={handleScanTap} />
        )}
        {state === 'R' && latest && (
          <StateReturning history={history} latest={latest} onScan={navigateToScan} onSelectScan={handleScanTap} />
        )}
        {(state === 2 || state === 3 || state === 4 || state === 5) && latest && comparison && (
          <StateComparison
            state={state}
            latest={latest}
            comparison={comparison}
            diff={diff}
            timeWindow={timeWindow}
            onTimeWindowChange={setTimeWindow}
            windowScans={windowScans}
            onScan={navigateToScan}
            onRoutine={navigateToRoutine}
            onSelectScan={handleScanTap}
          />
        )}
      </ScrollView>

      {selectedScan && (
        <ScanBottomSheet scan={selectedScan} onClose={() => setSelectedScan(null)} />
      )}
    </View>
  );
}

/* ────────────────────────────────────────────────── */
/* State 0 — FTUE                                     */
/* ────────────────────────────────────────────────── */

function StateZero({ onScan }: { onScan: () => void }) {
  const FEATURES = [
    { emoji: '✨', title: 'Weekly insights', desc: "See what's improving and what needs care" },
    { emoji: '📈', title: 'Trend tracking', desc: 'Watch your glow score evolve over time' },
    { emoji: '🌿', title: 'Personalized tips', desc: "Suggestions tailored to your skin's journey" },
  ];

  return (
    <>
      {/* Empty hero card with dashed placeholders */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 28,
          paddingTop: 32,
          paddingHorizontal: 24,
          paddingBottom: 28,
          borderWidth: 1,
          borderColor: 'rgba(224,120,86,0.08)',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 3,
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          {/* Before placeholder */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: 'rgba(224,120,86,0.3)',
              backgroundColor: 'rgba(224,120,86,0.05)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: -8,
              zIndex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontFamily: 'PlusJakartaSans_700Bold',
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: 'rgba(45,24,16,0.35)',
              }}
            >
              Before
            </Text>
          </View>
          <Text style={{ marginHorizontal: 4, fontSize: 14, color: PRIMARY, opacity: 0.3 }}>→</Text>
          {/* After placeholder */}
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: `${PRIMARY}80`,
              backgroundColor: 'rgba(224,120,86,0.08)',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -8,
              zIndex: 2,
            }}
          >
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" opacity={0.6}>
              <SvgCircle cx={12} cy={12} r={9} stroke={PRIMARY} strokeWidth={1.5} />
              <Path d="M9 12l2 2 4-4" stroke={PRIMARY} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </View>

        <Text
          style={{
            fontFamily: 'Fraunces_700Bold',
            fontSize: 22,
            color: '#2D1810',
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          Your first scan awaits
        </Text>
        <Text
          style={{
            fontSize: 13,
            lineHeight: 20,
            color: 'rgba(45,24,16,0.6)',
            fontFamily: 'PlusJakartaSans_400Regular',
            textAlign: 'center',
            maxWidth: 280,
          }}
        >
          Take a quick selfie to set your baseline. We'll track your skin's glow over time.
        </Text>
      </View>

      {/* What you'll get */}
      <Text
        style={{
          fontFamily: 'Fraunces_700Bold',
          fontSize: 15,
          color: '#2D1810',
          marginBottom: 12,
          paddingLeft: 2,
        }}
      >
        What you'll get
      </Text>
      <View style={{ gap: 8, marginBottom: 20 }}>
        {FEATURES.map((item) => (
          <View
            key={item.title}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: 'white',
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(224,120,86,0.08)',
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: '#FFF5EE',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13.5,
                  fontFamily: 'PlusJakartaSans_600SemiBold',
                  color: '#2D1810',
                  marginBottom: 2,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 11.5,
                  fontFamily: 'PlusJakartaSans_500Medium',
                  color: 'rgba(45,24,16,0.55)',
                }}
              >
                {item.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <ProgressCTA label="Take my first scan" onPress={onScan} />
    </>
  );
}

/* ────────────────────────────────────────────────── */
/* State 1 — First Scan                               */
/* ────────────────────────────────────────────────── */

function StateFirstScan({
  latest,
  onScan,
  onSelectScan,
}: {
  latest: ScanRecord;
  onScan: () => void;
  onSelectScan: (scan: ScanRecord) => void;
}) {
  return (
    <>
      <View style={{ marginBottom: 16 }}>
        <HeroCard
          comparison={null}
          latest={{
            score: latest.overall_score,
            date: formatDateShort(latest.createdAt),
            imageUrl: latest.imageUrl,
          }}
          dateRangeText="Scan again next week to track changes"
          showToggle={false}
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <ScanHistoryCard scan={latest} isBaseline onPress={onSelectScan} />
      </View>
      <ProgressCTA label="Take a new scan" onPress={onScan} />
    </>
  );
}

/* ────────────────────────────────────────────────── */
/* State R — Returning after gap                      */
/* ────────────────────────────────────────────────── */

function StateReturning({
  history,
  latest,
  onScan,
  onSelectScan,
}: {
  history: ScanRecord[];
  latest: ScanRecord;
  onScan: () => void;
  onSelectScan: (scan: ScanRecord) => void;
}) {
  const weeks = weeksSince(latest.createdAt);

  return (
    <>
      {/* Welcome-back banner */}
      <View
        style={{
          borderRadius: 24,
          paddingVertical: 20,
          paddingHorizontal: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: 'rgba(212,165,116,0.25)',
          backgroundColor: '#FBF2E0',
          overflow: 'hidden',
        }}
      >
        {/* Blob accent */}
        <View
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: `${PRIMARY}15`,
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Text style={{ fontSize: 16 }}>👋</Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'PlusJakartaSans_700Bold',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              color: PRIMARY,
            }}
          >
            It's been a while
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Fraunces_700Bold',
            fontSize: 20,
            color: '#2D1810',
            marginBottom: 6,
            lineHeight: 25,
          }}
        >
          Your last scan was {weeks} weeks ago
        </Text>
        <Text
          style={{
            fontSize: 12.5,
            lineHeight: 19,
            color: 'rgba(45,24,16,0.65)',
            fontFamily: 'PlusJakartaSans_400Regular',
          }}
        >
          Skin changes a lot in {weeks} weeks. Take a fresh scan to see where you are now.
        </Text>
      </View>

      {/* Last known scan card */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: 'rgba(224,120,86,0.08)',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          elevation: 2,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {latest.imageUrl ? (
          <View style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(224,120,86,0.18)' }}>
            <Image source={{ uri: latest.imageUrl }} style={{ width: '100%', height: '100%' }} />
          </View>
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: 'rgba(224,120,86,0.18)',
              backgroundColor: '#FFEEDC',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" opacity={0.45}>
              <SvgCircle cx={12} cy={9} r={4} stroke={PRIMARY} strokeWidth={1.2} />
              <Path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" stroke={PRIMARY} strokeWidth={1.2} strokeLinecap="round" />
            </Svg>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'PlusJakartaSans_700Bold',
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'rgba(45,24,16,0.5)',
              marginBottom: 2,
            }}
          >
            Your last scan
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans_500Medium',
              color: '#2D1810',
            }}
          >
            {formatDateShort(latest.createdAt)} · Score {latest.overall_score}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Fraunces_700Bold',
            fontSize: 26,
            color: PRIMARY,
            opacity: 0.5,
          }}
        >
          {latest.overall_score}
        </Text>
      </View>

      {/* Previous journey (faded) */}
      <View style={{ marginBottom: 20, opacity: 0.75 }}>
        <TrendTimeline scans={history} onSelectScan={onSelectScan} />
      </View>

      <ProgressCTA label="Resume tracking — take a scan" onPress={onScan} />
    </>
  );
}

/* ────────────────────────────────────────────────── */
/* States 2-5 — Comparison states                     */
/* ────────────────────────────────────────────────── */

function StateComparison({
  state,
  latest,
  comparison,
  diff,
  timeWindow,
  onTimeWindowChange,
  windowScans,
  onScan,
  onRoutine,
  onSelectScan,
}: {
  state: 2 | 3 | 4 | 5;
  latest: ScanRecord;
  comparison: ScanRecord;
  diff: number;
  timeWindow: TimeWindow;
  onTimeWindowChange: (tw: TimeWindow) => void;
  windowScans: ScanRecord[];
  onScan: () => void;
  onRoutine: () => void;
  onSelectScan: (scan: ScanRecord) => void;
}) {
  const { t } = useTranslation();
  const isDecreased = state === 5;

  return (
    <>
      <View style={{ marginBottom: 16 }}>
        <HeroCard
          comparison={{
            score: comparison.overall_score,
            date: formatDateShort(comparison.createdAt),
            imageUrl: comparison.imageUrl,
          }}
          latest={{
            score: latest.overall_score,
            date: formatDateShort(latest.createdAt),
            imageUrl: latest.imageUrl,
          }}
          comparisonLabel={comparisonAgeLabel(comparison, timeWindow)}
          dateRangeText={dateRangeText(comparison, latest, timeWindow, windowScans.length)}
          showToggle
          activeToggle={timeWindow}
          onToggleChange={onTimeWindowChange}
          scans={windowScans}
        />
      </View>

      <Text
        style={{
          fontFamily: 'Fraunces_700Bold',
          fontSize: 17,
          color: '#2D1810',
          marginBottom: 10,
          paddingLeft: 4,
        }}
      >
        {t('past_scans')}
      </Text>

      <View style={{ marginBottom: isDecreased ? 16 : 20 }}>
        {(() => {
          const now = Date.now();
          const DAY = 24 * 60 * 60 * 1000;
          const groups: { key: string; label: string; items: { scan: ScanRecord; index: number }[] }[] = [
            { key: 'this_week', label: t('scan_group_this_week'), items: [] },
            { key: 'last_week', label: t('scan_group_last_week'), items: [] },
            { key: 'earlier', label: t('scan_group_earlier'), items: [] },
          ];
          windowScans.forEach((scan, index) => {
            const ageDays = (now - new Date(scan.createdAt).getTime()) / DAY;
            const bucket = ageDays < 7 ? 0 : ageDays < 14 ? 1 : 2;
            groups[bucket].items.push({ scan, index });
          });
          const useGrouping = windowScans.length > 3 && groups.filter((g) => g.items.length).length > 1;
          if (!useGrouping) {
            return windowScans.map((scan, i) => (
              <ScanHistoryCard
                key={scan.id}
                scan={scan}
                previousScan={windowScans[i + 1]}
                isBaseline={i === windowScans.length - 1}
                isLatest={i === 0}
                onPress={onSelectScan}
              />
            ));
          }
          return groups
            .filter((g) => g.items.length > 0)
            .map((g) => (
              <View key={g.key} style={{ marginBottom: 6 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: 'PlusJakartaSans_700Bold',
                    color: 'rgba(45,24,16,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginTop: 6,
                    marginBottom: 8,
                    paddingLeft: 4,
                  }}
                >
                  {g.label}
                </Text>
                {g.items.map(({ scan, index }) => (
                  <ScanHistoryCard
                    key={scan.id}
                    scan={scan}
                    previousScan={windowScans[index + 1]}
                    isBaseline={index === windowScans.length - 1}
                    isLatest={index === 0}
                    onPress={onSelectScan}
                  />
                ))}
              </View>
            ));
        })()}
      </View>

      {isDecreased ? (
        <ProgressCTA label="Review your routine" outlined onPress={onRoutine} />
      ) : (
        <ProgressCTA label="Take a new scan" onPress={onScan} />
      )}
    </>
  );
}
