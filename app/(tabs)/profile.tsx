import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/stores/useUserStore';
import { useScanStore } from '@/stores/useScanStore';
import AmbientBlobs from '@/components/AmbientBlobs';
import i18n from '@/i18n';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const history = useScanStore((s) => s.scanHistory);
  const [name, setName] = useState(user?.name ?? '');
  const [saved, setSaved] = useState(false);

  function save() {
    updateUser({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function toggleLang(lang: 'en' | 'hi') {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />
      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 30, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 4 }}>
          {t('profile_title')}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'Fraunces_700Bold_Italic', color: 'rgba(45,24,16,0.5)', marginBottom: 28 }}>
          {t('profile_subtitle')}
        </Text>

        {/* Avatar card */}
        <Animated.View entering={FadeInDown.springify()}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 24,
              marginBottom: 20,
              alignItems: 'center',
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
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'rgba(224,120,86,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 36 }}>👩🏽</Text>
            </View>
            <Text style={{ fontSize: 20, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>
              {user?.name || 'Your Name'}
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(45,24,16,0.5)', fontFamily: 'PlusJakartaSans_400Regular', marginTop: 4 }}>
              {history.length} scan{history.length !== 1 ? 's' : ''} completed
            </Text>
          </View>
        </Animated.View>

        {/* Name input */}
        <Animated.View entering={FadeInDown.delay(80).springify()}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810', marginBottom: 8 }}>
              {t('name')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: '#2D1810',
                  fontFamily: 'PlusJakartaSans_400Regular',
                  borderWidth: 1.5,
                  borderColor: 'rgba(224,120,86,0.15)',
                }}
              />
              <TouchableOpacity
                onPress={save}
                style={{
                  backgroundColor: '#E07856',
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: 'white', fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14 }}>
                  {t('save')}
                </Text>
              </TouchableOpacity>
            </View>
            {saved && (
              <Animated.Text
                entering={FadeIn}
                exiting={FadeOut}
                style={{ fontSize: 12, color: '#4ADE80', fontFamily: 'PlusJakartaSans_500Medium', marginTop: 6 }}
              >
                {t('saved')}
              </Animated.Text>
            )}
          </View>
        </Animated.View>

        {/* Language toggle */}
        <Animated.View entering={FadeInDown.delay(160).springify()}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810', marginBottom: 8 }}>
              {t('language')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 4,
                borderWidth: 1.5,
                borderColor: 'rgba(224,120,86,0.15)',
              }}
            >
              {(['en', 'hi'] as const).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => toggleLang(lang)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: user?.language === lang ? '#E07856' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: lang === 'hi' ? 'Hind_500Medium' : 'PlusJakartaSans_600SemiBold',
                      color: user?.language === lang ? 'white' : '#2D1810',
                    }}
                  >
                    {lang === 'en' ? 'English' : 'हिन्दी'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Skin details */}
        {user?.skinType && (
          <Animated.View entering={FadeInDown.delay(240).springify()}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: 'rgba(224,120,86,0.08)',
              }}
            >
              <Text style={{ fontSize: 14, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 12 }}>
                Skin Profile
              </Text>
              {[
                { label: 'Skin Type', value: user.skinType },
                { label: 'Main Concern', value: user.mainConcern },
                { label: 'Age Range', value: user.ageRange },
              ].filter((r) => r.value).map((row) => (
                <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(45,24,16,0.06)' }}>
                  <Text style={{ fontSize: 13, color: 'rgba(45,24,16,0.55)', fontFamily: 'PlusJakartaSans_400Regular' }}>{row.label}</Text>
                  <Text style={{ fontSize: 13, color: '#2D1810', fontFamily: 'PlusJakartaSans_600SemiBold', textTransform: 'capitalize' }}>{row.value}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
