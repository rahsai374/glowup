import React, { useState } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { BottomNav, TabType } from './components/BottomNav';
import { SplashScreen } from './screens/SplashScreen';
import { LanguageScreen } from './screens/LanguageScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ScanScreen } from './screens/ScanScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { RoutineScreen } from './screens/RoutineScreen';
import { ShareCardScreen } from './screens/ShareCardScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { TipsScreen } from './screens/TipsScreen';
import { ProductCheckScreen } from './screens/ProductCheckScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
type Screen =
'splash' |
'language' |
'onboarding' |
'auth' |
'main' |
'scan' |
'results' |
'share' |
'product-check';
function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  // Render the main tab content
  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onScan={() => setCurrentScreen('scan')}
            onNavigate={setActiveTab}
            onCheckProduct={() => setCurrentScreen('product-check')} />);


      case 'scan':
        // If they tap scan in nav, we actually want to show the full screen scan flow
        // But for prototype simplicity, we'll just switch the screen state
        setTimeout(() => setCurrentScreen('scan'), 0);
        return (
          <HomeScreen
            onScan={() => setCurrentScreen('scan')}
            onNavigate={setActiveTab}
            onCheckProduct={() => setCurrentScreen('product-check')} />);


      case 'progress':
        return <ProgressScreen />;
      case 'tips':
        return <TipsScreen />;
      case 'profile':
        return <ProfileScreen onBack={() => setActiveTab('home')} />;
      default:
        return (
          <HomeScreen
            onScan={() => setCurrentScreen('scan')}
            onNavigate={setActiveTab}
            onCheckProduct={() => setCurrentScreen('product-check')} />);


    }
  };
  return (
    <PhoneFrame>
      {currentScreen === 'splash' &&
      <SplashScreen onNext={() => setCurrentScreen('language')} />
      }
      {currentScreen === 'language' &&
      <LanguageScreen onNext={() => setCurrentScreen('onboarding')} />
      }
      {currentScreen === 'onboarding' &&
      <OnboardingScreen onNext={() => setCurrentScreen('auth')} />
      }
      {currentScreen === 'auth' &&
      <AuthScreen onNext={() => setCurrentScreen('main')} />
      }

      {currentScreen === 'main' &&
      <>
          {activeTab === 'routine' ? <RoutineScreen /> : renderMainContent()}
          <BottomNav
          activeTab={activeTab === 'routine' ? 'home' : activeTab}
          onTabChange={(tab) => {
            if (tab === 'scan') {
              setCurrentScreen('scan');
            } else {
              setActiveTab(tab);
            }
          }} />
        
        </>
      }

      {currentScreen === 'scan' &&
      <ScanScreen
        onCancel={() => setCurrentScreen('main')}
        onComplete={() => setCurrentScreen('results')} />

      }

      {currentScreen === 'results' &&
      <ResultsScreen
        onSeeRoutine={() => {
          setActiveTab('routine' as any); // Hack for prototype to show routine tab
          setCurrentScreen('main');
        }}
        onShare={() => setCurrentScreen('share')} />

      }

      {currentScreen === 'share' &&
      <ShareCardScreen onBack={() => setCurrentScreen('results')} />
      }

      {currentScreen === 'product-check' &&
      <ProductCheckScreen onBack={() => setCurrentScreen('main')} />
      }
    </PhoneFrame>);

}
export function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </LanguageProvider>);

}