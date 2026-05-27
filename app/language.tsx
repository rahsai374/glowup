import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useUserStore } from '@/stores/useUserStore';
import i18n from '@/i18n';
import AmbientBlobs from '@/components/AmbientBlobs';

export default function LanguageScreen() {
  const router = useRouter();
  const setLanguage = useUserStore((s) => s.setLanguage);

  function pick(lang: 'en' | 'hi') {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    router.push('/onboarding');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE', paddingHorizontal: 32, paddingTop: 96 }}>
      <AmbientBlobs />

      <Animated.View entering={FadeInRight.springify()} style={{ zIndex: 10 }}>
        <Text
          style={{
            fontSize: 28,
            fontFamily: 'Fraunces_700Bold',
            color: '#2D1810',
            marginBottom: 4,
          }}
        >
          Choose Language
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'Hind_500Medium',
            color: '#2D1810',
            marginBottom: 8,
            opacity: 0.7,
          }}
        >
          भाषा चुनें
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'PlusJakartaSans_400Regular',
            color: '#2D1810',
            opacity: 0.6,
            marginBottom: 48,
          }}
        >
          You can change this later in settings.
        </Text>

        <Animated.View entering={FadeInRight.delay(100).springify()}>
          <TouchableOpacity
            onPress={() => pick('en')}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 28,
              alignItems: 'center',
              marginBottom: 16,
              borderWidth: 2,
              borderColor: 'rgba(224,120,86,0.1)',
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 20,
              elevation: 3,
            }}
          >
            <Text
              style={{ fontSize: 28, fontFamily: 'PlusJakartaSans_700Bold', color: '#2D1810', marginBottom: 4 }}
            >
              English
            </Text>
            <Text
              style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#2D1810', opacity: 0.6 }}
            >
              English
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInRight.delay(180).springify()}>
          <TouchableOpacity
            onPress={() => pick('hi')}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 28,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(224,120,86,0.1)',
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 20,
              elevation: 3,
            }}
          >
            <Text
              style={{ fontSize: 28, fontFamily: 'Hind_600SemiBold', color: '#2D1810', marginBottom: 4 }}
            >
              हिन्दी
            </Text>
            <Text
              style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#2D1810', opacity: 0.6 }}
            >
              Hindi
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
