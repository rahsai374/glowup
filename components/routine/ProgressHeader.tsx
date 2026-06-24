import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ProgressHeaderProps {
  amDone: number;
  amTotal: number;
  pmDone: number;
  pmTotal: number;
  streakDays: number;
  consistencyPct: number;
}

function SegmentedBar({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label: string;
}) {
  if (total === 0) return null;
  const pct = Math.round((done / total) * 100);
  const isComplete = done === total;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-SemiBold',
            fontSize: 12,
            color: '#2D1810',
            opacity: 0.7,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontFamily: 'PlusJakartaSans-SemiBold',
            fontSize: 12,
            color: isComplete ? '#16a34a' : '#2D1810',
            opacity: isComplete ? 1 : 0.5,
          }}
        >
          {done}/{total}
        </Text>
      </View>
      <View
        style={{
          height: 6,
          backgroundColor: '#F0E6DF',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: isComplete ? '#16a34a' : '#E07856',
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );
}

export default function ProgressHeader({
  amDone,
  amTotal,
  pmDone,
  pmTotal,
  streakDays,
  consistencyPct,
}: ProgressHeaderProps) {
  const { t } = useTranslation();

  const totalDone = amDone + pmDone;
  const totalAll = amTotal + pmTotal;
  const isAlmostThere = totalAll > 0 && totalDone / totalAll > 0.5 && totalDone < totalAll;
  const allAmDone = amTotal > 0 && amDone === amTotal;
  const allPmDone = pmTotal > 0 && pmDone === pmTotal;

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(212,165,116,0.2)',
      }}
    >
      {/* Progress bars */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
        <SegmentedBar
          done={amDone}
          total={amTotal}
          label={t('routine_progress_am')}
        />
        <SegmentedBar
          done={pmDone}
          total={pmTotal}
          label={t('routine_progress_pm')}
        />
      </View>

      {/* Streak + consistency row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {streakDays > 0 && (
            <Text
              style={{
                fontFamily: 'PlusJakartaSans-SemiBold',
                fontSize: 13,
                color: '#2D1810',
              }}
            >
              {t('routine_progress_streak', { count: streakDays })}
            </Text>
          )}
          {consistencyPct > 0 && (
            <Text
              style={{
                fontFamily: 'PlusJakartaSans-Regular',
                fontSize: 12,
                color: '#2D1810',
                opacity: 0.5,
              }}
            >
              {t('routine_progress_consistency', { pct: consistencyPct })}
            </Text>
          )}
        </View>

        {/* Goal-gradient nudge */}
        {isAlmostThere && (
          <Text
            style={{
              fontFamily: 'PlusJakartaSans-SemiBold',
              fontSize: 12,
              color: '#E07856',
            }}
          >
            {t('routine_almost_there')}
          </Text>
        )}
        {allAmDone && !allPmDone && (
          <Text
            style={{
              fontFamily: 'PlusJakartaSans-SemiBold',
              fontSize: 12,
              color: '#16a34a',
            }}
          >
            {t('routine_completed_am')}
          </Text>
        )}
        {allPmDone && (
          <Text
            style={{
              fontFamily: 'PlusJakartaSans-SemiBold',
              fontSize: 12,
              color: '#16a34a',
            }}
          >
            {t('routine_completed_pm')}
          </Text>
        )}
      </View>
    </View>
  );
}
