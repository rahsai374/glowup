import React from 'react';
import { View, Text } from 'react-native';

interface StreakStripProps {
  streakDays: number;
  scansThisWeek: number;
  routineConsistencyPct: number;
  hasAnyCompletions: boolean; // hide routine pill if user has never marked a step
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(224,120,86,0.08)',
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 10,
      alignItems: 'center',
    }}>
      {children}
    </View>
  );
}

export default function StreakStrip({ streakDays, scansThisWeek, routineConsistencyPct, hasAnyCompletions }: StreakStripProps) {
  const scanLabel = scansThisWeek === 1 ? '📸 1 scan this week' : `📸 ${scansThisWeek} scans this week`;

  return (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
      {streakDays > 0 && (
        <Pill>
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
            🔥 Day {streakDays}
          </Text>
        </Pill>
      )}
      <Pill>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
          {scanLabel}
        </Text>
      </Pill>
      {hasAnyCompletions && (
        <Pill>
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
            ✅ {routineConsistencyPct}% routine
          </Text>
        </Pill>
      )}
    </View>
  );
}
