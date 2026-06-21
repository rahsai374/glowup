import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import AmbientBlobs from '@/components/AmbientBlobs';
import BackButton from '@/components/BackButton';
import { useNotificationStore, NotificationItem } from '@/stores/useNotificationStore';

function timeAgo(isoDate: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  if (Number.isNaN(diff)) return t('time_just_now');
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('time_just_now');
  if (mins < 60) return t('time_mins_ago', { count: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('time_hours_ago', { count: hrs });
  const days = Math.floor(hrs / 24);
  return t('time_days_ago', { count: days });
}

function NotificationCard({ item, index }: { item: NotificationItem; index: number }) {
  const { t } = useTranslation();
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: item.read ? 0 : 3,
          borderLeftColor: '#E07856',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'PlusJakartaSans_600SemiBold',
            color: '#2D1810',
            marginBottom: 4,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'PlusJakartaSans_400Regular',
            color: 'rgba(45,24,16,0.6)',
            lineHeight: 18,
            marginBottom: 6,
          }}
        >
          {item.body}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: 'PlusJakartaSans_400Regular',
            color: 'rgba(45,24,16,0.35)',
          }}
        >
          {timeAgo(item.receivedAt, t)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    markAllRead();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />
      <View style={{ flex: 1, zIndex: 10, paddingTop: insets.top + 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 24,
            marginBottom: 24,
            gap: 12,
          }}
        >
          <BackButton />
          <Text style={{ fontSize: 24, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>
            {t('notifications_title')}
          </Text>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <NotificationCard item={item} index={index} />}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔔</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Fraunces_700Bold',
                  color: '#2D1810',
                  marginBottom: 8,
                }}
              >
                {t('notifications_empty')}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans_400Regular',
                  color: 'rgba(45,24,16,0.55)',
                  textAlign: 'center',
                  lineHeight: 20,
                  paddingHorizontal: 32,
                }}
              >
                {t('notifications_empty_body')}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
