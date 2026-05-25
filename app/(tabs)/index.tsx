import React, { useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '@/stores/useUserStore';
import { useScanStore, daysSinceLastScan, scansInLastNDays, scoreHistoryLastN } from '@/stores/useScanStore';
import { useRoutineStore, todayProgress, weeklyConsistency } from '@/stores/useRoutineStore';

import { getGreeting } from '@/lib/home/getGreeting';
import { selectHeroState } from '@/lib/home/selectHeroState';
import { selectDailyTip } from '@/lib/home/selectDailyTip';
import { getRoutine } from '@/lib/routineEngine';

import tips from '@/data/tips.json';
import { MicroTip, SkinConcern } from '@/lib/home/types';

import AmbientBlobs from '@/components/AmbientBlobs';
import HomeHeader from '@/components/home/HomeHeader';
import ScoreTrendCard from '@/components/home/ScoreTrendCard';
import StreakStrip from '@/components/home/StreakStrip';
import DynamicActionCard from '@/components/home/DynamicActionCard';
import QuickActionTile from '@/components/home/QuickActionTile';
import ContextualTipCard from '@/components/home/ContextualTipCard';

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function localDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const CONCERN_MAP: Record<string, SkinConcern> = {
  'acne': 'acne', 'breakout': 'acne', 'blemish': 'acne',
  'dark spot': 'darkSpots', 'dark spots': 'darkSpots', 'hyperpigmentation': 'darkSpots',
  'dryness': 'dryness', 'dry': 'dryness',
  'aging': 'aging', 'anti-aging': 'aging', 'wrinkle': 'aging', 'firmness': 'aging',
  'dullness': 'dullness', 'dull': 'dullness', 'radiance': 'dullness',
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const user = useUserStore((s) => s.user);
  const streak = useUserStore((s) => s.streak);
  const tickStreak = useUserStore((s) => s.tickStreak);

  const scanHistory = useScanStore((s) => s.scanHistory);
  const completions = useRoutineStore((s) => s.completions);
  const markTipDone = useRoutineStore((s) => s.markTipDone);

  useEffect(() => { tickStreak(); }, []);

  const now = new Date();
  const nowHour = now.getHours();
  const todayKey = localDateKey();

  const greetingPeriod = getGreeting(nowHour);
  const greetingText = t(`home_greeting_${greetingPeriod}`);

  const scanCount = scanHistory.length;
  const daysSince = useMemo(() => daysSinceLastScan(scanHistory), [scanHistory]);
  const scansThisWeek = useMemo(() => scansInLastNDays(scanHistory, 7), [scanHistory]);
  const scoreHistory = useMemo(() => scoreHistoryLastN(scanHistory, 7), [scanHistory]);
  const currentScore = scanHistory[0]?.overall_score ?? null;
  const previousScore = scanHistory[1]?.overall_score ?? null;
  const lastConcern = scanHistory[0]?.top_concern ?? null;

  const userRoutine = useMemo(
    () => getRoutine(user?.skinType ?? 'all', user?.mainConcern ?? 'all'),
    [user?.skinType, user?.mainConcern]
  );
  const amStepIds = useMemo(() => userRoutine.morning.map((s) => s.id), [userRoutine]);
  const pmStepIds = useMemo(() => userRoutine.night.map((s) => s.id), [userRoutine]);

  const routineToday = useMemo(
    () => todayProgress(completions, todayKey, amStepIds, pmStepIds),
    [completions, todayKey, amStepIds, pmStepIds]
  );

  const consistencyPct = useMemo(
    () => weeklyConsistency(completions, amStepIds, pmStepIds),
    [completions, amStepIds, pmStepIds]
  );

  const hasAnyCompletions = Object.keys(completions).length > 0;

  const heroState = selectHeroState({
    scanCount,
    daysSinceLastScan: daysSince,
    lastScanTopConcern: lastConcern,
    nowHour,
    routineToday,
  });

  const userConcern: SkinConcern | null = lastConcern
    ? (CONCERN_MAP[lastConcern.toLowerCase()] ?? null)
    : null;

  const dailyTip = selectDailyTip({
    tips: tips as MicroTip[],
    userConcern,
    dayOfYear: getDayOfYear(),
  });

  const isTipDone = completions[todayKey]?.tips?.includes(dailyTip.id) ?? false;

  function onHeroPress() {
    if (heroState.kind === 'routine-in-progress' || heroState.kind === 'fresh-scan') {
      router.push('/routine');
    } else {
      router.push('/scan');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />
      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          name={user?.name || 'Friend'}
          greeting={greetingText}
          onAvatarPress={() => router.push('/(tabs)/profile')}
        />

        {currentScore !== null && (
          <ScoreTrendCard
            currentScore={currentScore}
            previousScore={previousScore}
            history={scoreHistory}
            onPress={() => router.push('/(tabs)/progress')}
          />
        )}

        <StreakStrip
          streakDays={streak.current}
          scansThisWeek={scansThisWeek}
          routineConsistencyPct={consistencyPct}
          hasAnyCompletions={hasAnyCompletions}
        />

        <DynamicActionCard state={heroState} onPrimaryPress={onHeroPress} />

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <QuickActionTile
            icon="🧴"
            label={t('check_product')}
            bg="#FFEFE3"
            borderColor="rgba(224,120,86,0.1)"
            onPress={() => router.push('/product-check')}
          />
          <QuickActionTile
            icon="🌿"
            label={t('my_routine')}
            bg="#FBF2E0"
            borderColor="rgba(212,165,116,0.2)"
            onPress={() => router.push('/routine')}
          />
        </View>

        <ContextualTipCard
          tip={dailyTip}
          concernLabel={userConcern ? lastConcern?.toLowerCase() ?? null : null}
          isDone={isTipDone}
          onMarkDone={() => markTipDone(todayKey, dailyTip.id)}
          enterDelay={160}
        />
      </ScrollView>
    </View>
  );
}
