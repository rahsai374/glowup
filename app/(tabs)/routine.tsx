import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useScanStore } from '@/stores/useScanStore';
import { useUserStore } from '@/stores/useUserStore';
import { useProductStore } from '@/stores/useProductStore';
import { getPersonalizedScore, MAX_SCORE } from '@/lib/scoringEngine';
import type { PersonalizedScore } from '@/lib/scoringEngine';
import { SUITABILITY_CONFIG, CATEGORY_EMOJI } from '@/lib/productTypes';
import type { Product } from '@/lib/productTypes';
import type { ScanResult } from '@/lib/gemini';
import AmbientBlobs from '@/components/AmbientBlobs';
import BackButton from '@/components/BackButton';
import { getRoutine } from '@/lib/routineEngine';
import { RoutineStep } from '@/lib/routineData';
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
  catalogProduct?: Product | null;
  scanResult?: ScanResult | null;
  hindi?: boolean;
  onSeeMore?: (category: string) => void;
  onProductTap?: (productId: string) => void;
}

function StepCard({ step, index, expanded, onPress, catalogProduct, scanResult, hindi, onSeeMore, onProductTap }: StepCardProps) {
  const [remedyIndex, setRemedyIndex] = useState(() => {
    if (step.remedies.length === 0) return 0;
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return (dayOfYear + index) % step.remedies.length;
  });
  const currentRemedy = step.remedies[remedyIndex];
  if (!currentRemedy) return null;
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
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: expanded ? '#E07856' : '#FFF5EE',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'PlusJakartaSans_700Bold',
                color: expanded ? 'white' : '#E07856',
              }}
            >
              {index + 1}
            </Text>
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              fontFamily: 'PlusJakartaSans_600SemiBold',
              color: '#2D1810',
            }}
          >
            {step.title}
          </Text>
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

export default function RoutineScreen() {
  const [tab, setTab] = useState<Tab>('morning');
  const [expanded, setExpanded] = useState<number | null>(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const hindi = i18n.language === 'hi';
  const currentScan = useScanStore(s => s.currentScan);
  const gender = useUserStore((s) => s.user?.gender);
  const products = useProductStore((s) => s.products);

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
              marginBottom: 24,
            }}
          >
            {t('regimen_body')}
          </Text>

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
          {tabSteps.map((step, i) => (
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
              catalogProduct={step.productId ? productMap.get(step.productId) ?? null : null}
              scanResult={currentScan}
              hindi={hindi}
              onSeeMore={handleSeeMore}
              onProductTap={handleProductTap}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
