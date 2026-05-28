import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/stores/useUserStore';
import { saveProfile } from '@/lib/firestore';
import AmbientBlobs from '@/components/AmbientBlobs';
import { logEvent, setUserProperties, EVENTS } from '@/lib/analytics';

const QUESTIONS = [
  {
    key: 'q1',
    titleKey: 'q1_title',
    required: true,
    options: [
      { key: 'acne', labelKey: 'q1_acne' },
      { key: 'dark_spots', labelKey: 'q1_dark_spots' },
      { key: 'pigmentation', labelKey: 'q1_pigmentation' },
      { key: 'dryness', labelKey: 'q1_dryness' },
      { key: 'aging', labelKey: 'q1_aging' },
    ],
  },
  {
    key: 'q2',
    titleKey: 'q2_title',
    required: true,
    options: [
      { key: 'oily', labelKey: 'q2_oily' },
      { key: 'dry', labelKey: 'q2_dry' },
      { key: 'combination', labelKey: 'q2_combination' },
      { key: 'normal', labelKey: 'q2_normal' },
    ],
  },
  {
    key: 'q3',
    titleKey: 'q3_title',
    required: false,
    options: [
      { key: 'low', labelKey: 'q3_low' },
      { key: 'medium', labelKey: 'q3_medium' },
      { key: 'high', labelKey: 'q3_high' },
    ],
  },
  {
    key: 'q4',
    titleKey: 'q4_title',
    required: false,
    options: [
      { key: 'daily', labelKey: 'q4_daily' },
      { key: 'sometimes', labelKey: 'q4_sometimes' },
      { key: 'never', labelKey: 'q4_never' },
    ],
  },
  {
    key: 'q5',
    titleKey: 'q5_title',
    required: false,
    options: [
      { key: 'under20', labelKey: 'q5_under20' },
      { key: '20_30', labelKey: 'q5_20_30' },
      { key: '30_40', labelKey: 'q5_30_40' },
      { key: '40plus', labelKey: 'q5_40plus' },
    ],
  },
];

const TOTAL_STEPS = QUESTIONS.length + 1; // Q1–Q5 + name

export default function QuestionsScreen() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [nameInput, setNameInput] = useState('');
  const router = useRouter();
  const { t } = useTranslation();
  const updateUser = useUserStore((s) => s.updateUser);
  const user = useUserStore((s) => s.user);

  const isNameStep = step === QUESTIONS.length;
  const q = !isNameStep ? QUESTIONS[step] : null;

  function selectOption(val: string) {
    if (q) {
      setAnswers((prev) => ({ ...prev, [q.key]: val }));
      logEvent(EVENTS.ONBOARDING_Q_ANSWERED, { question: q.key, answer: val, step });
    }
  }

  async function finish() {
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    const profile = {
      name: trimmed,
      mainConcern: answers.q1 ?? '',
      skinType: answers.q2 ?? '',
      waterIntake: answers.q3 ?? '',
      sunscreenHabit: answers.q4 ?? '',
      ageRange: answers.q5 ?? '',
    };
    updateUser(profile);
    logEvent(EVENTS.ONBOARDING_Q_COMPLETED, {
      skin_type: profile.skinType,
      main_concern: profile.mainConcern,
      age_range: profile.ageRange,
    });
    setUserProperties({
      skin_type: profile.skinType || null,
      main_concern: profile.mainConcern || null,
      age_range: profile.ageRange || null,
    });

    if (user?.uid) {
      saveProfile(user.uid, {
        ...profile,
        phone: user.phone,
        language: user.language,
      }).catch(() => {});
    }

    router.replace('/(tabs)');
  }

  function next() {
    if (q && !answers[q.key] && q.required) return;
    if (step < QUESTIONS.length) {
      setStep(step + 1);
    }
  }

  const selected = q ? answers[q.key] : undefined;
  const canNext = q ? (selected || !q.required) : !!nameInput.trim();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />

      <View style={{ paddingHorizontal: 24, paddingTop: 56, zIndex: 10 }}>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 32 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: i <= step ? '#E07856' : 'rgba(224,120,86,0.2)',
              }}
            />
          ))}
        </View>

        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#E07856', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 }}>
          Question {step + 1} of {TOTAL_STEPS}
        </Text>

        <Animated.Text
          key={isNameStep ? 'q6' : q!.key}
          entering={FadeInRight.springify()}
          style={{ fontSize: 24, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 28, lineHeight: 32 }}
        >
          {isNameStep ? t('q6_title') : t(q!.titleKey)}
        </Animated.Text>
      </View>

      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {isNameStep ? (
          <Animated.View entering={FadeInRight.springify()}>
            <TextInput
              value={nameInput}
              onChangeText={(v) => setNameInput(v.replace(/[\x00-\x1F\x7F]/g, ''))}
              placeholder={t('q6_placeholder')}
              maxLength={50}
              autoFocus
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 18,
                fontSize: 16,
                color: '#2D1810',
                fontFamily: 'PlusJakartaSans_400Regular',
                borderWidth: 2,
                borderColor: nameInput.trim() ? '#E07856' : 'rgba(224,120,86,0.12)',
              }}
            />
          </Animated.View>
        ) : (
          q!.options.map((opt, i) => (
            <Animated.View key={opt.key} entering={FadeInRight.delay(i * 60).springify()}>
              <TouchableOpacity
                onPress={() => selectOption(opt.key)}
                style={{
                  backgroundColor: selected === opt.key ? '#FFF5EE' : 'white',
                  borderRadius: 16,
                  padding: 18,
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: selected === opt.key ? '#E07856' : 'rgba(224,120,86,0.12)',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'PlusJakartaSans_500Medium',
                    color: selected === opt.key ? '#E07856' : '#2D1810',
                  }}
                >
                  {t(opt.labelKey)}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: 40, zIndex: 10, gap: 12 }}>
        {q && !q.required && (
          <TouchableOpacity onPress={next}>
            <Text style={{ textAlign: 'center', fontSize: 14, color: '#2D1810', opacity: 0.5, fontFamily: 'PlusJakartaSans_400Regular' }}>
              {t('skip')}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={isNameStep ? finish : next}
          style={{
            backgroundColor: canNext ? '#E07856' : 'rgba(224,120,86,0.4)',
            borderRadius: 20,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' }}>
            {isNameStep ? t('done') : t('next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
