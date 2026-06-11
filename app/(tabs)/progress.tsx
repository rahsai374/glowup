import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import { useScanStore, ScanRecord, daysSinceLastScan } from '@/stores/useScanStore';
import { ScanResult } from '@/lib/gemini';
import HeroCard from '@/components/progress/HeroCard';
import TrendTimeline from '@/components/progress/TrendTimeline';
import InsightStrip from '@/components/progress/InsightStrip';
import ProgressCTA from '@/components/progress/ProgressCTA';
import { TimeWindow } from '@/components/progress/TimeWindowToggle';
import { logEvent, EVENTS } from '@/lib/analytics';
import { formatDateShort } from '@/lib/formatDate';

const PRIMARY = '#E07856';
const ACCENT = '#D4A574';

type ProgressState = 0 | 1 | 'R' | 2 | 3 | 4 | 5;

const METRIC_KEYS: (keyof ScanResult['metrics'])[] = [
  'hydration',
  'blemish_prone',
  'redness',
  'oiliness',
  'dark_spots',
  'radiance',
  'texture',
  'firmness',
  'wrinkles',
  'dark_circles',
];

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

function findComparisonScan(history: ScanRecord[], mode: TimeWindow): ScanRecord | null {
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

function scansForWindow(
  history: ScanRecord[],
  mode: TimeWindow,
  comparison: ScanRecord | null
): ScanRecord[] {
  if (mode === 'all' || !comparison) return history;
  const compTime = new Date(comparison.createdAt).getTime();
  return history.filter((s) => new Date(s.createdAt).getTime() >= compTime);
}

function biggestMetricChange(
  latest: ScanRecord,
  comparison: ScanRecord,
  direction: 'improve' | 'decline'
): keyof ScanResult['metrics'] {
  let bestKey: keyof ScanResult['metrics'] = 'hydration';
  let bestDelta = direction === 'improve' ? -Infinity : Infinity;
  for (const k of METRIC_KEYS) {
    const delta = latest.metrics[k] - comparison.metrics[k];
    if (direction === 'improve' && delta > bestDelta) {
      bestDelta = delta;
      bestKey = k;
    } else if (direction === 'decline' && delta < bestDelta) {
      bestDelta = delta;
      bestKey = k;
    }
  }
  return bestKey;
}

function stripTags(s: string): string {
  return s.replace(/<\/?0>/g, '');
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const history = useScanStore((s) => s.scanHistory);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('4weeks');

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
  const windowScans = useMemo(
    () => scansForWindow(history, timeWindow, comparison),
    [history, timeWindow, comparison]
  );

  const navigateToScan = () => router.push('/scan');
  const navigateToRoutine = () => router.push('/(tabs)/routine');
  const navigateToScansHistory = () => router.push('/scans-history');

  function comparisonAgeLabel(comp: ScanRecord, mode: TimeWindow): string {
    if (mode === 'all') return t('progress_first_scan_label');
    const weeks = Math.round(
      (Date.now() - new Date(comp.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    if (weeks < 1) return t('progress_age_days_ago');
    if (weeks === 1) return t('progress_age_week_ago');
    return t('progress_age_weeks_ago', { weeks });
  }

  function dateRangeText(
    comp: ScanRecord | null,
    last: ScanRecord,
    mode: TimeWindow,
    scanCount: number
  ): string {
    if (!comp) return t('progress_scan_again_to_fill');
    const modeLabel =
      mode === 'week'
        ? t('progress_range_last_week')
        : mode === '4weeks'
          ? t('progress_range_last_4weeks')
          : t('progress_range_all_time');
    return `${modeLabel} · ${formatDateShort(comp.createdAt)} — ${formatDateShort(last.createdAt)} · ${scanCount} ${t('progress_journey_total_short', { count: scanCount })}`;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
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
          <StateFirstScan
            latest={latest}
            history={history}
            onScan={navigateToScan}
            onSeeAll={navigateToScansHistory}
          />
        )}
        {state === 'R' && latest && (
          <StateReturning
            history={history}
            latest={latest}
            onScan={navigateToScan}
            onSeeAll={navigateToScansHistory}
          />
        )}
        {(state === 2 || state === 3 || state === 4 || state === 5) && latest && comparison && (
          <StateComparison
            state={state}
            latest={latest}
            comparison={comparison}
            timeWindow={timeWindow}
            onTimeWindowChange={setTimeWindow}
            windowScans={windowScans}
            historyCount={history.length}
            onScan={navigateToScan}
            onRoutine={navigateToRoutine}
            onSeeAll={navigateToScansHistory}
            comparisonAgeLabel={comparisonAgeLabel}
            dateRangeText={dateRangeText}
          />
        )}
      </ScrollView>
    </View>
  );
}

/* ────────────────────────────────────────────────── */
/* State 0 — FTUE                                     */
/* ────────────────────────────────────────────────── */

function StateZero({ onScan }: { onScan: () => void }) {
  const { t } = useTranslation();
  const FEATURES = [
    { emoji: '✨', titleKey: 'progress_feature_score', descKey: 'progress_feature_score_desc' },
    { emoji: '📈', titleKey: 'progress_feature_before_after', descKey: 'progress_feature_before_after_desc' },
    { emoji: '🌿', titleKey: 'progress_feature_insights', descKey: 'progress_feature_insights_desc' },
  ];

  return (
    <>
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
              {t('progress_before_placeholder')}
            </Text>
          </View>
          <Text style={{ marginHorizontal: 4, fontSize: 14, color: PRIMARY, opacity: 0.3 }}>→</Text>
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
              <Path
                d="M9 12l2 2 4-4"
                stroke={PRIMARY}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
          {t('progress_ftue_headline')}
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
          {t('progress_ftue_body')}
        </Text>
      </View>

      <Text
        style={{
          fontFamily: 'Fraunces_700Bold',
          fontSize: 15,
          color: '#2D1810',
          marginBottom: 12,
          paddingLeft: 2,
        }}
      >
        {t('progress_what_you_get')}
      </Text>
      <View style={{ gap: 8, marginBottom: 20 }}>
        {FEATURES.map((item) => (
          <View
            key={item.titleKey}
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
                {t(item.titleKey)}
              </Text>
              <Text
                style={{
                  fontSize: 11.5,
                  fontFamily: 'PlusJakartaSans_500Medium',
                  color: 'rgba(45,24,16,0.55)',
                }}
              >
                {t(item.descKey)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginBottom: 14 }}>
        <InsightStrip
          text={stripTags(t('progress_insight_first'))}
          highlightWord={t('progress_insight_highlight_step')}
          supportive
        />
      </View>

      <ProgressCTA label={t('progress_cta_first')} onPress={onScan} />
    </>
  );
}

/* ────────────────────────────────────────────────── */
/* State 1 — First Scan                               */
/* ────────────────────────────────────────────────── */

function StateFirstScan({
  latest,
  history,
  onScan,
  onSeeAll,
}: {
  latest: ScanRecord;
  history: ScanRecord[];
  onScan: () => void;
  onSeeAll: () => void;
}) {
  const { t } = useTranslation();
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
          dateRangeText={t('progress_scan_again_to_fill')}
          showToggle={false}
        />
      </View>
      <View style={{ marginBottom: 16 }}>
        <TrendTimeline scans={history} totalScans={history.length} onSeeAll={onSeeAll} />
      </View>
      <View style={{ marginBottom: 14 }}>
        <InsightStrip
          text={stripTags(t('progress_insight_first'))}
          highlightWord={t('progress_insight_highlight_step')}
          supportive
        />
      </View>
      <ProgressCTA label={t('progress_cta_new')} onPress={onScan} />
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
  onSeeAll,
}: {
  history: ScanRecord[];
  latest: ScanRecord;
  onScan: () => void;
  onSeeAll: () => void;
}) {
  const { t } = useTranslation();
  const days = Math.max(
    1,
    Math.round((Date.now() - new Date(latest.createdAt).getTime()) / (24 * 60 * 60 * 1000))
  );

  return (
    <>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16 }}>👋</Text>
          <Text
            style={{
              fontSize: 13,
              lineHeight: 19,
              color: '#2D1810',
              fontFamily: 'PlusJakartaSans_500Medium',
              flex: 1,
            }}
          >
            {t('progress_returning_banner', { days })}
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 16, opacity: 0.85 }}>
        <TrendTimeline scans={history} totalScans={history.length} onSeeAll={onSeeAll} />
      </View>

      <ProgressCTA label={t('progress_cta_resume')} onPress={onScan} />
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
  timeWindow,
  onTimeWindowChange,
  windowScans,
  historyCount,
  onScan,
  onRoutine,
  onSeeAll,
  comparisonAgeLabel,
  dateRangeText,
}: {
  state: 2 | 3 | 4 | 5;
  latest: ScanRecord;
  comparison: ScanRecord;
  timeWindow: TimeWindow;
  onTimeWindowChange: (tw: TimeWindow) => void;
  windowScans: ScanRecord[];
  historyCount: number;
  onScan: () => void;
  onRoutine: () => void;
  onSeeAll: () => void;
  comparisonAgeLabel: (comp: ScanRecord, mode: TimeWindow) => string;
  dateRangeText: (
    comp: ScanRecord | null,
    last: ScanRecord,
    mode: TimeWindow,
    scanCount: number
  ) => string;
}) {
  const { t } = useTranslation();
  const isDecreased = state === 5;

  const insightMetric = useMemo<keyof ScanResult['metrics'] | null>(() => {
    if (state === 3 || state === 4) return biggestMetricChange(latest, comparison, 'improve');
    if (state === 5) return biggestMetricChange(latest, comparison, 'decline');
    return null;
  }, [state, latest, comparison]);

  const insight = useMemo(() => {
    if (state === 2) {
      return {
        text: stripTags(t('progress_insight_no_change')),
        highlight: t('progress_insight_highlight_consistency'),
        supportive: true,
      };
    }
    if (insightMetric) {
      const metricLabel = t(insightMetric);
      const key =
        state === 5
          ? 'progress_insight_decreased'
          : state === 4
            ? 'progress_insight_happy'
            : 'progress_insight_minor';
      return {
        text: stripTags(t(key, { metric: metricLabel })),
        highlight: metricLabel,
        supportive: state !== 5,
      };
    }
    return null;
  }, [state, insightMetric, t]);

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
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <TrendTimeline scans={windowScans} totalScans={historyCount} onSeeAll={onSeeAll} />
      </View>

      {insight && (
        <View style={{ marginBottom: 14 }}>
          <InsightStrip
            text={insight.text}
            highlightWord={insight.highlight}
            supportive={insight.supportive}
          />
        </View>
      )}

      {isDecreased ? (
        <ProgressCTA label={t('progress_cta_review')} outlined onPress={onRoutine} />
      ) : (
        <ProgressCTA label={t('progress_cta_new')} onPress={onScan} />
      )}
    </>
  );
}
