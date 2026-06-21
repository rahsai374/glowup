import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useScanStore } from '@/stores/useScanStore';
import { useUserStore } from '@/stores/useUserStore';
import { useProductStore } from '@/stores/useProductStore';
import { useRoutineStore, todayProgress, weeklyConsistency, computeRoutineStreak } from '@/stores/useRoutineStore';
import { getPersonalizedScore, MAX_SCORE } from '@/lib/scoringEngine';
import type { PersonalizedScore } from '@/lib/scoringEngine';
import { SUITABILITY_CONFIG, CATEGORY_EMOJI } from '@/lib/productTypes';
import type { Product } from '@/lib/productTypes';
import type { ScanResult } from '@/lib/gemini';
import AmbientBlobs from '@/components/AmbientBlobs';
import BackButton from '@/components/BackButton';
import ProgressHeader from '@/components/routine/ProgressHeader';
import { getRoutine } from '@/lib/routineEngine';
import { RoutineStep } from '@/lib/routineData';
import { getTodaysFocus } from '@/lib/dailyFocusEngine';
import { requestNotificationPermissionForRoutine, scheduleRoutineReminders } from '@/lib/notifications';
import { logEvent, EVENTS } from '@/lib/analytics';

const TABS = ['morning', 'night', 'weekly'] as const;
type Tab = typeof TABS[number];
const TAB_ICONS: Record<Tab, string> = { morning: '☀️', night: '🌙', weekly: '📅' };

// ─── Empty state ──────────────────────────────────────────────────────────────

function NoScanEmptyState() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      <Animated.Text entering={FadeInDown.delay(0).springify()} style={{ fontSize: 56, marginBottom: 24 }}>
        ✨
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(80).springify()}
        style={{
          fontSize: 24,
          fontFamily: 'Fraunces_700Bold',
          color: '#2D1810',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        {t('routine_empty_title')}
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(160).springify()}
        style={{
          fontSize: 15,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: 'rgba(45,24,16,0.6)',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 40,
        }}
      >
        {t('routine_empty_body')}
      </Animated.Text>
      <Animated.View entering={FadeInDown.delay(240).springify()}>
        <TouchableOpacity
          onPress={() => router.push('/scan?from=routine')}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#E07856',
            borderRadius: 20,
            paddingVertical: 16,
            paddingHorizontal: 32,
            shadowColor: '#E07856',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
            {t('routine_empty_cta')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Score bar ───────────────────────────────────────────────────────────────

function ScoreBar({ score, hindi }: { score: PersonalizedScore; hindi?: boolean }) {
  const cfg = SUITABILITY_CONFIG[score.suitability];
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: cfg.text }}>
          {hindi ? cfg.labelHi : cfg.labelEn}
        </Text>
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#2D1810' }}>
          {score.matchScore}/{MAX_SCORE}
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: '#FFF5EE', borderRadius: 3, overflow: 'hidden' }}>
        <View
          style={{
            height: 6,
            backgroundColor: cfg.bg,
            borderRadius: 3,
            width: `${(score.matchScore / MAX_SCORE) * 100}%`,
          }}
        />
      </View>
    </View>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────

interface StepCardProps {
  step: RoutineStep;
  index: number;
  expanded: boolean;
  onPress: () => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
  isFocusStep: boolean;
  todayRemedyLabel?: string;
  catalogProduct?: Product | null;
  scanResult?: ScanResult | null;
  hindi?: boolean;
  onSeeMore?: (category: string) => void;
  onProductTap?: (productId: string) => void;
}

function StepCard({ step, index, expanded, onPress, isCompleted, onToggleComplete, isFocusStep, todayRemedyLabel, catalogProduct, scanResult, hindi, onSeeMore, onProductTap }: StepCardProps) {
  const { t } = useTranslation();
  const [remedyIndex, setRemedyIndex] = useState(() => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return (dayOfYear + index) % step.remedies.length;
  });
  const currentRemedy = step.remedies[remedyIndex];
  const hasMultipleRemedies = step.remedies.length > 1;

  const handleSwapRemedy = useCallback(() => {
    setRemedyIndex((prev) => (prev + 1) % step.remedies.length);
  }, [step.remedies.length]);

  const personalizedScore = useMemo(
    () => catalogProduct && scanResult ? getPersonalizedScore(catalogProduct, scanResult) : null,
    [catalogProduct, scanResult],
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1.5,
          borderColor: expanded ? '#E07856' : 'rgba(224,120,86,0.1)',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          elevation: 2,
        }}
      >
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Checkbox — separate Pressable, independent from expand/collapse */}
          <Pressable
            onPress={onToggleComplete}
            hitSlop={8}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: isCompleted ? '#16a34a' : expanded ? '#E07856' : '#FFF5EE',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isCompleted ? (
              <Text style={{ fontSize: 15, color: 'white' }}>✓</Text>
            ) : (
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans_700Bold',
                  color: expanded ? 'white' : '#E07856',
                }}
              >
                {index + 1}
              </Text>
            )}
          </Pressable>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'PlusJakartaSans_600SemiBold',
                  color: isCompleted ? 'rgba(45,24,16,0.4)' : '#2D1810',
                  textDecorationLine: isCompleted ? 'line-through' : 'none',
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {step.title}
              </Text>
              {isFocusStep && (
                <Text style={{ fontSize: 14 }}>🎯</Text>
              )}
            </View>
            {/* Surfaced remedy subtitle — collapsed only */}
            {!expanded && todayRemedyLabel && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'PlusJakartaSans_400Regular',
                  color: isCompleted ? 'rgba(45,24,16,0.3)' : 'rgba(45,24,16,0.45)',
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {t('routine_remedy_today', { remedy: todayRemedyLabel })}
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 16, color: 'rgba(45,24,16,0.4)' }}>
            {expanded ? '↑' : '↓'}
          </Text>
        </View>

        {/* Expanded content */}
        {expanded && (
          <Animated.View
            entering={FadeInDown.springify()}
            style={{ marginTop: 12, gap: 10 }}
          >
            {/* Home remedy block */}
            <View
              style={{
                backgroundColor: '#F4FBF4',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: 'rgba(80,160,80,0.15)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'PlusJakartaSans_700Bold',
                    color: '#2D6A2D',
                    flex: 1,
                  }}
                >
                  🏠 {currentRemedy.label}
                </Text>
                {hasMultipleRemedies && (
                  <Pressable
                    onPress={handleSwapRemedy}
                    hitSlop={8}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor: 'rgba(80,160,80,0.1)',
                      borderRadius: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: '#2D6A2D', fontFamily: 'PlusJakartaSans_500Medium' }}>
                      Try another
                    </Text>
                    <Text style={{ fontSize: 12 }}>🔄</Text>
                  </Pressable>
                )}
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans_400Regular',
                  color: 'rgba(45,24,16,0.7)',
                  lineHeight: 20,
                }}
              >
                {currentRemedy.how}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'PlusJakartaSans_400Regular',
                  fontStyle: 'italic',
                  color: 'rgba(45,106,45,0.7)',
                  lineHeight: 18,
                  marginTop: 6,
                }}
              >
                💡 {currentRemedy.why}
              </Text>
            </View>

            {/* Product block */}
            {catalogProduct ? (
              <View
                style={{
                  backgroundColor: '#FFF9F5',
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(212,165,116,0.2)',
                }}
              >
                <TouchableOpacity
                  onPress={() => step.productId && onProductTap?.(step.productId)}
                  activeOpacity={0.85}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Text style={{ fontSize: 20 }}>
                      {CATEGORY_EMOJI[catalogProduct.category] || '🛍️'}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: 'PlusJakartaSans_600SemiBold',
                          color: '#2D1810',
                        }}
                        numberOfLines={1}
                      >
                        {catalogProduct.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'PlusJakartaSans_400Regular',
                          color: 'rgba(45,24,16,0.5)',
                        }}
                      >
                        {catalogProduct.brand} • {catalogProduct.priceDisplay}
                      </Text>
                    </View>
                  </View>

                  {/* Personalized score bar */}
                  {personalizedScore && (
                    <ScoreBar score={personalizedScore} hindi={hindi} />
                  )}
                </TouchableOpacity>

                {/* See more options link */}
                <TouchableOpacity
                  onPress={() => onSeeMore?.(catalogProduct.category)}
                  activeOpacity={0.7}
                  style={{ paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(212,165,116,0.15)' }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'PlusJakartaSans_600SemiBold',
                      color: '#E07856',
                      textAlign: 'center',
                    }}
                  >
                    {hindi ? 'और विकल्प देखें →' : 'See more options →'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Fallback: existing inline product data */
              <View
                style={{
                  backgroundColor: '#FFF9F5',
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(212,165,116,0.2)',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSans_600SemiBold',
                    color: '#2D1810',
                    marginBottom: 8,
                  }}
                >
                  🛍️ {step.product.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'rgba(45,24,16,0.5)',
                      fontFamily: 'PlusJakartaSans_400Regular',
                      flex: 1,
                      marginRight: 8,
                    }}
                  >
                    {step.product.tag}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'PlusJakartaSans_700Bold',
                      color: '#E07856',
                    }}
                  >
                    {step.product.price}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    logEvent(EVENTS.PRODUCT_LINK_TAPPED, { product_name: step.product.name });
                  }}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: '#FF9900',
                    borderRadius: 12,
                    paddingVertical: 10,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'PlusJakartaSans_700Bold',
                      color: 'white',
                    }}
                  >
                    Buy on Amazon →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

// ─── Date helper ──────────────────────────────────────────────────────────────

function localDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Celebration overlay ─────────────────────────────────────────────────────

function CelebrationOverlay({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,245,238,0.92)',
      }}
    >
      <Animated.Text entering={ZoomIn.delay(100).springify()} style={{ fontSize: 64, marginBottom: 16 }}>
        🎉
      </Animated.Text>
      <Animated.Text
        entering={FadeIn.delay(300).duration(400)}
        style={{
          fontSize: 22,
          fontFamily: 'Fraunces_700Bold',
          color: '#16a34a',
          textAlign: 'center',
          paddingHorizontal: 32,
        }}
      >
        {message}
      </Animated.Text>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function RoutineScreen() {
  const [tab, setTab] = useState<Tab>('morning');
  const [expanded, setExpanded] = useState<number | null>(0);
  const [celebration, setCelebration] = useState<string | null>(null);
  const notificationScheduled = useRef(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const hindi = i18n.language === 'hi';
  const currentScan = useScanStore(s => s.currentScan);
  const gender = useUserStore((s) => s.user?.gender);
  const products = useProductStore((s) => s.products);
  const completions = useRoutineStore((s) => s.completions);
  const toggleStep = useRoutineStore((s) => s.toggleStep);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      map.set(p.id, p);
    }
    return map;
  }, [products]);

  const handleSeeMore = useCallback((category: string) => {
    logEvent(EVENTS.PRODUCT_CHECK_OPENED, { source: 'routine_see_more', category });
    router.push({
      pathname: '/(tabs)/product-check',
      params: { category, concern: currentScan?.top_concern },
    });
  }, [router, currentScan]);

  const handleProductTap = useCallback((productId: string) => {
    logEvent(EVENTS.PRODUCT_SELECTED, { product_id: productId, source: 'routine' });
    router.push({
      pathname: '/(tabs)/product-check',
      params: { productId },
    });
  }, [router]);

  const routine = useMemo(() => {
    if (!currentScan) return null;
    return getRoutine(currentScan.skin_type, currentScan.top_concern, gender);
  }, [currentScan, gender]);

  const tabSteps = routine ? routine[tab] : [];

  // ── Today's completions + progress ──
  const todayStr = useMemo(() => localDateString(), []);
  const amStepIds = useMemo(() => (routine ? routine.morning.map((s) => s.id) : []), [routine]);
  const pmStepIds = useMemo(() => (routine ? routine.night.map((s) => s.id) : []), [routine]);
  const progress = useMemo(
    () => todayProgress(completions, todayStr, amStepIds, pmStepIds),
    [completions, todayStr, amStepIds, pmStepIds],
  );
  const consistency = useMemo(
    () => weeklyConsistency(completions, amStepIds, pmStepIds),
    [completions, amStepIds, pmStepIds],
  );
  const streak = useMemo(
    () => computeRoutineStreak(completions, todayStr),
    [completions, todayStr],
  );

  // ── Today's focus ──
  const allDailySteps = useMemo(
    () => (routine ? [...routine.morning, ...routine.night] : []),
    [routine],
  );
  const dailyFocus = useMemo(
    () => (allDailySteps.length > 0 ? getTodaysFocus(allDailySteps) : null),
    [allDailySteps],
  );
  const focusStep = useMemo(
    () => (dailyFocus ? allDailySteps.find((s) => s.id === dailyFocus.focusStepId) : null),
    [dailyFocus, allDailySteps],
  );

  // ── Completed set for current tab ──
  const todayDay = completions[todayStr];
  const completedIdsForTab = useMemo(() => {
    if (!todayDay) return new Set<string>();
    if (tab === 'morning') return new Set(todayDay.am);
    if (tab === 'night') return new Set(todayDay.pm);
    return new Set<string>(); // weekly — no completion tracking yet
  }, [todayDay, tab]);

  // ── Checkbox handler ──
  const handleToggle = useCallback(
    (stepId: string, stepTitle: string) => {
      const period: 'am' | 'pm' = tab === 'night' ? 'pm' : 'am';
      if (tab === 'weekly') return; // weekly steps don't have completion

      const wasCompleted = completedIdsForTab.has(stepId);
      toggleStep(todayStr, period, stepId);

      Haptics.impactAsync(
        wasCompleted
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium,
      );

      // Log event
      logEvent(wasCompleted ? EVENTS.ROUTINE_STEP_UNCOMPLETED : EVENTS.ROUTINE_STEP_COMPLETED, {
        step_id: stepId,
        step_title: stepTitle,
        period,
        is_focus_step: dailyFocus?.focusStepId === stepId,
      });

      // Check for completion celebration (after toggle)
      if (!wasCompleted) {
        // Use fresh progress after this toggle
        const nextAm = period === 'am' ? progress.am.done + 1 : progress.am.done;
        const nextPm = period === 'pm' ? progress.pm.done + 1 : progress.pm.done;

        if (period === 'am' && nextAm === progress.am.total && progress.am.total > 0) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setCelebration(t('routine_completed_am'));
          logEvent(EVENTS.ROUTINE_ALL_COMPLETED, { period: 'am' });
        } else if (period === 'pm' && nextPm === progress.pm.total && progress.pm.total > 0) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setCelebration(t('routine_completed_pm'));
          logEvent(EVENTS.ROUTINE_ALL_COMPLETED, { period: 'pm' });
        }

        // Request notification permission after first-ever completion
        if (progress.am.done + progress.pm.done === 0) {
          requestNotificationPermissionForRoutine().then((granted) => {
            if (granted && focusStep && dailyFocus) {
              scheduleRoutineReminders(
                focusStep.title,
                dailyFocus.tip.text,
                hindi ? 'hi' : 'en',
              );
            }
          });
        }
      }
    },
    [tab, todayStr, completedIdsForTab, toggleStep, progress, dailyFocus, focusStep, hindi, t],
  );

  // ── Schedule notifications on mount (once per session) ──
  useEffect(() => {
    if (notificationScheduled.current || !focusStep || !dailyFocus) return;
    notificationScheduled.current = true;
    scheduleRoutineReminders(focusStep.title, dailyFocus.tip.text, hindi ? 'hi' : 'en').catch(() => {});
  }, [focusStep, dailyFocus, hindi]);

  // ── Log daily focus view ──
  useEffect(() => {
    if (dailyFocus) {
      logEvent(EVENTS.DAILY_FOCUS_VIEWED, {
        focus_step_id: dailyFocus.focusStepId,
        tip_id: dailyFocus.tip.id,
      });
    }
  }, [dailyFocus]);

  useEffect(() => {
    logEvent(EVENTS.ROUTINE_VIEWED, { has_scan: !!currentScan });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />

      {/* Back button — always visible */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 16,
          left: 24,
          zIndex: 20,
        }}
      >
        <BackButton />
      </View>

      {!routine ? (
        // ── No scan yet: full empty state ──
        <NoScanEmptyState />
      ) : (
        // ── Personalized routine ──
        <ScrollView
          style={{ flex: 1, zIndex: 10 }}
          contentContainerStyle={{
            paddingTop: insets.top + 72,
            paddingBottom: 60,
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Fraunces_700Bold',
              color: '#2D1810',
              marginBottom: 6,
            }}
          >
            {t('routine_title')}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans_400Regular',
              color: 'rgba(45,24,16,0.5)',
              marginBottom: 16,
            }}
          >
            {t('regimen_body')}
          </Text>

          {/* Progress header */}
          <ProgressHeader
            amDone={progress.am.done}
            amTotal={progress.am.total}
            pmDone={progress.pm.done}
            pmTotal={progress.pm.total}
            streakDays={streak}
            consistencyPct={consistency}
          />

          {/* Today's Focus card */}
          {dailyFocus && focusStep && (
            <Animated.View entering={FadeInDown.delay(50).springify()}>
              <View
                style={{
                  backgroundColor: '#FFFAF5',
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1.5,
                  borderColor: 'rgba(224,120,86,0.25)',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Text style={{ fontSize: 16 }}>🎯</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'PlusJakartaSans_700Bold',
                      color: '#E07856',
                    }}
                  >
                    {t('routine_today_focus')}
                  </Text>
                  {completedIdsForTab.has(dailyFocus.focusStepId) && (
                    <View
                      style={{
                        backgroundColor: '#dcfce7',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: 'PlusJakartaSans_700Bold',
                          color: '#16a34a',
                        }}
                      >
                        {t('routine_today_focus_done')}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'PlusJakartaSans_600SemiBold',
                    color: '#2D1810',
                    marginBottom: 4,
                  }}
                >
                  {focusStep.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'PlusJakartaSans_400Regular',
                    color: 'rgba(45,24,16,0.6)',
                    lineHeight: 20,
                  }}
                >
                  💡 {hindi ? dailyFocus.tip.text.hi : dailyFocus.tip.text.en}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Tab bar */}
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 4,
              flexDirection: 'row',
              marginBottom: 28,
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {TABS.map(t_ => (
              <TouchableOpacity
                key={t_}
                onPress={() => {
                  setTab(t_);
                  setExpanded(0);
                  logEvent(EVENTS.ROUTINE_TAB_SWITCHED, {
                    tab: t_,
                    step_count: routine ? routine[t_].length : 0,
                  });
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  paddingVertical: 10,
                  borderRadius: 16,
                  backgroundColor: tab === t_ ? '#E07856' : 'transparent',
                }}
              >
                <Text style={{ fontSize: 14 }}>{TAB_ICONS[t_]}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans_600SemiBold',
                    color: tab === t_ ? 'white' : 'rgba(45,24,16,0.6)',
                    textTransform: 'capitalize',
                  }}
                >
                  {t(t_)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Steps */}
          {tabSteps.map((step, i) => {
            // Today's remedy label for collapsed subtitle
            const dayOfYear = Math.floor(
              (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
            );
            const remedyIdx = (dayOfYear + i) % step.remedies.length;
            const remedyLabel = step.remedies[remedyIdx]?.label;

            return (
              <StepCard
                key={step.id}
                step={step}
                index={i}
                expanded={expanded === i}
                onPress={() => {
                  const opening = expanded !== i;
                  setExpanded(opening ? i : null);
                  if (opening) {
                    logEvent(EVENTS.ROUTINE_STEP_EXPANDED, {
                      step_id: step.id,
                      step_title: step.title,
                      tab,
                      position: i + 1,
                    });
                  }
                }}
                isCompleted={completedIdsForTab.has(step.id)}
                onToggleComplete={() => handleToggle(step.id, step.title)}
                isFocusStep={dailyFocus?.focusStepId === step.id}
                todayRemedyLabel={remedyLabel}
                catalogProduct={step.productId ? productMap.get(step.productId) ?? null : null}
                scanResult={currentScan}
                hindi={hindi}
                onSeeMore={handleSeeMore}
                onProductTap={handleProductTap}
              />
            );
          })}
        </ScrollView>
      )}

      {/* Celebration overlay */}
      {celebration && (
        <CelebrationOverlay
          message={celebration}
          onDone={() => setCelebration(null)}
        />
      )}
    </View>
  );
}
