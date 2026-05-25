import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Modal, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { ApplicationVerifier } from 'firebase/auth';

const RECAPTCHA_HTML = (apiKey: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://www.google.com/recaptcha/api.js?render=explicit"></script>
</head>
<body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:transparent;">
  <div id="recaptcha-container"></div>
  <script>
    function onLoad() {
      grecaptcha.render('recaptcha-container', {
        sitekey: '${apiKey}',
        size: 'invisible',
        callback: function(token) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'resolve', token: token }));
        },
        'error-callback': function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'reCAPTCHA error' }));
        },
        'expired-callback': function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'reCAPTCHA expired' }));
        }
      });
      grecaptcha.execute();
    }
    onLoad();
  </script>
</body>
</html>
`;

export interface RecaptchaRef {
  verify: () => Promise<string>;
  getVerifier: () => ApplicationVerifier;
}

interface Props {
  firebaseApiKey: string;
}

export const FirebaseRecaptcha = forwardRef<RecaptchaRef, Props>(({ firebaseApiKey }, ref) => {
  const [visible, setVisible] = useState(false);
  const resolveRef = useRef<((token: string) => void) | null>(null);
  const rejectRef = useRef<((err: Error) => void) | null>(null);

  useImperativeHandle(ref, () => ({
    verify: () => {
      return new Promise<string>((resolve, reject) => {
        resolveRef.current = resolve;
        rejectRef.current = reject;
        setVisible(true);
      });
    },
    getVerifier: () => ({
      type: 'recaptcha' as const,
      verify: () => {
        return new Promise<string>((resolve, reject) => {
          resolveRef.current = resolve;
          rejectRef.current = reject;
          setVisible(true);
        });
      },
    }),
  }));

  function onMessage(event: { nativeEvent: { data: string } }) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setVisible(false);
      if (data.type === 'resolve' && resolveRef.current) {
        resolveRef.current(data.token);
      } else if (data.type === 'error' && rejectRef.current) {
        rejectRef.current(new Error(data.message));
      }
    } catch {
      setVisible(false);
      rejectRef.current?.(new Error('reCAPTCHA failed'));
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E07856" />
        <WebView
          source={{ html: RECAPTCHA_HTML(firebaseApiKey) }}
          onMessage={onMessage}
          style={{ width: 0, height: 0, opacity: 0 }}
          javaScriptEnabled
        />
      </View>
    </Modal>
  );
});
