import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, ConfirmationResult } from 'firebase/auth';
import AmbientBlobs from '@/components/AmbientBlobs';
import { FirebaseRecaptcha, RecaptchaRef } from '@/components/FirebaseRecaptcha';
import { useUserStore } from '@/stores/useUserStore';
import { auth, firebaseConfig } from '@/lib/firebase';

export default function AuthScreen() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const recaptchaRef = useRef<RecaptchaRef>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const setUser = useUserStore((s) => s.setUser);

  async function sendOtp() {
    if (phone.length < 10 || loading || !recaptchaRef.current) return;
    setLoading(true);
    try {
      const verifier = recaptchaRef.current.getVerifier();
      const result = await signInWithPhoneNumber(auth, '+91' + phone, verifier);
      setConfirmation(result);
      setStep('otp');
    } catch (e: any) {
      Alert.alert('Failed to send OTP', e?.message ?? 'Please check your number and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(val: string, i: number) {
    const next = [...otp];

    if (val.length > 1) {
      const digits = val.replace(/\D/g, '');
      if (digits.length === 0) return;

      if (digits.length === 1) {
        next[i] = digits;
        setOtp(next);
        if (i < 5) otpRefs.current[i + 1]?.focus();
        return;
      }

      const slice = digits.slice(0, 6 - i);
      slice.split('').forEach((d, offset) => { next[i + offset] = d; });
      setOtp(next);
      otpRefs.current[Math.min(i + slice.length - 1, 5)]?.focus();
      return;
    }

    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>, i: number) {
    if (e.nativeEvent.key === 'Backspace' && otp[i] === '' && i > 0) {
      const next = [...otp];
      next[i - 1] = '';
      setOtp(next);
      otpRefs.current[i - 1]?.focus();
    }
  }

  async function verifyOtp() {
    const code = otp.join('');
    if (code.length < 6 || !confirmation || loading) return;
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(confirmation.verificationId, code);
      const result = await signInWithCredential(auth, credential);
      setUser({
        uid: result.user.uid,
        name: '',
        phone,
        language: 'en',
        skinType: '',
        mainConcern: '',
        waterIntake: '',
        sunscreenHabit: '',
        ageRange: '',
      });
      router.replace('/questions');
    } catch (e: any) {
      Alert.alert('Invalid OTP', e?.message ?? 'Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#FFF5EE' }}
    >
      <AmbientBlobs />
      <FirebaseRecaptcha ref={recaptchaRef} firebaseApiKey={firebaseConfig.apiKey ?? ''} />
      <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 96, zIndex: 10 }}>

        {step === 'phone' && (
          <Animated.View entering={FadeInDown.springify()}>
            <Text style={{ fontSize: 30, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 8 }}>
              {t('login_title')}
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#2D1810', opacity: 0.55, marginBottom: 40 }}>
              {t('no_spam')}
            </Text>

            <View style={{ flexDirection: 'row', backgroundColor: 'white', borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(224,120,86,0.15)', overflow: 'hidden', marginBottom: 24 }}>
              <View style={{ backgroundColor: '#FFF5EE', paddingHorizontal: 16, justifyContent: 'center', borderRightWidth: 1, borderRightColor: 'rgba(224,120,86,0.15)' }}>
                <Text style={{ fontSize: 16, color: '#2D1810', fontFamily: 'PlusJakartaSans_500Medium' }}>+91</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder={t('phone_placeholder')}
                keyboardType="phone-pad"
                maxLength={10}
                style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: '#2D1810', fontFamily: 'PlusJakartaSans_400Regular' }}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 40 }}>
              <Text style={{ fontSize: 18 }}>🛡️</Text>
              <Text style={{ fontSize: 13, color: '#2D1810', opacity: 0.55, fontFamily: 'PlusJakartaSans_400Regular' }}>{t('no_spam')}</Text>
            </View>

            <TouchableOpacity
              onPress={sendOtp}
              disabled={phone.length < 10 || loading}
              style={{ backgroundColor: phone.length >= 10 ? '#E07856' : 'rgba(224,120,86,0.4)', borderRadius: 20, paddingVertical: 16, alignItems: 'center' }}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={{ color: 'white', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' }}>{t('send_otp')}</Text>}
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === 'otp' && (
          <Animated.View entering={FadeInDown.springify()}>
            <Text style={{ fontSize: 30, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 8 }}>
              {t('verify_otp')}
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#2D1810', opacity: 0.55, marginBottom: 40 }}>
              Sent to +91 {phone}
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 32 }}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { otpRefs.current[i] = r; }}
                  value={digit}
                  onChangeText={(v) => handleOtpChange(v, i)}
                  onKeyPress={(e) => handleOtpKeyPress(e, i)}
                  keyboardType="number-pad"
                  style={{ flex: 1, height: 60, borderRadius: 14, borderWidth: 2, borderColor: digit ? '#E07856' : 'rgba(224,120,86,0.2)', backgroundColor: 'white', textAlign: 'center', fontSize: 22, color: '#2D1810', fontFamily: 'PlusJakartaSans_700Bold' }}
                />
              ))}
            </View>

            <TouchableOpacity onPress={() => setStep('phone')} style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 14, color: '#E07856', fontFamily: 'PlusJakartaSans_500Medium', textAlign: 'center' }}>{t('change_phone')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={verifyOtp}
              disabled={otp.join('').length < 6 || loading}
              style={{ backgroundColor: '#E07856', borderRadius: 20, paddingVertical: 16, alignItems: 'center' }}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={{ color: 'white', fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold' }}>{t('verify_otp')}</Text>}
            </TouchableOpacity>
          </Animated.View>
        )}

      </View>
    </KeyboardAvoidingView>
  );
}
