import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useScanStore } from '@/stores/useScanStore';
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
          onPress={() => router.push('/scan')}
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

// ─── Step card ────────────────────────────────────────────────────────────────

interface StepCardProps {
  step: RoutineStep;
  index: number;
  expanded: boolean;
  onPress: () => void;
}

function StepCard({ step, index, expanded, onPress }: StepCardProps) {
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
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans_700Bold',
                  color: '#2D6A2D',
                  marginBottom: 6,
                }}
              >
                🏠 {step.remedy.label}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans_400Regular',
                  color: 'rgba(45,24,16,0.7)',
                  lineHeight: 20,
                }}
              >
                {step.remedy.how}
              </Text>
            </View>

            {/* Product block */}
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

              {/* Amazon button — dummy for now */}
              <TouchableOpacity
                onPress={() => {
                  logEvent(EVENTS.PRODUCT_LINK_TAPPED, { product_name: step.product.name });
                  console.log('[TODO] Open Amazon link for:', step.product.name);
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
  const { t } = useTranslation();
  const currentScan = useScanStore(s => s.currentScan);

  const routine = useMemo(() => {
    if (!currentScan) return null;
    return getRoutine(currentScan.skin_type, currentScan.top_concern);
  }, [currentScan]);

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
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
