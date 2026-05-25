import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AmbientBlobs from '@/components/AmbientBlobs';

export default function ProductCheckScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE', alignItems: 'center', justifyContent: 'center' }}>
      <AmbientBlobs />

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: 'absolute', top: insets.top + 16, left: 24, backgroundColor: 'white', borderRadius: 16, padding: 10, shadowColor: '#2D1810', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, zIndex: 20 }}
      >
        <Text style={{ fontSize: 16 }}>←</Text>
      </TouchableOpacity>

      <Animated.View entering={FadeInDown.springify()} style={{ alignItems: 'center', paddingHorizontal: 40, zIndex: 10 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(224,120,86,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 40 }}>🧪</Text>
        </View>
        <Text style={{ fontSize: 30, fontFamily: 'Fraunces_700Bold', color: '#2D1810', textAlign: 'center', marginBottom: 8 }}>
          {t('coming_soon')}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'Fraunces_700Bold_Italic', color: '#E07856', textAlign: 'center', marginBottom: 16 }}>
          {t('product_check_title')}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.6)', textAlign: 'center', lineHeight: 22 }}>
          {t('coming_soon_body')}
        </Text>
      </Animated.View>
    </View>
  );
}
