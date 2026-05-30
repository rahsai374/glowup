import React from 'react';
import { Home, ScanFace, TrendingUp, Lightbulb, User } from 'lucide-react';
import { useLanguage, TranslationKey } from '../contexts/LanguageContext';
export type TabType = 'home' | 'scan' | 'progress' | 'tips' | 'profile';
interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}
export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { language, t } = useLanguage();
  const hindi = language === 'hi';
  const tabs: {
    id: TabType;
    icon: any;
    labelKey: TranslationKey;
  }[] = [
  {
    id: 'home',
    icon: Home,
    labelKey: 'home'
  },
  {
    id: 'scan',
    icon: ScanFace,
    labelKey: 'scan'
  },
  {
    id: 'progress',
    icon: TrendingUp,
    labelKey: 'progress'
  },
  {
    id: 'tips',
    icon: Lightbulb,
    labelKey: 'insights'
  }];

  return (
    <div className="bg-white border-t border-brand-primary/10 px-6 py-3 pb-6 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-text/40'}`}>
            
            <div
              className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-primary/10' : 'bg-transparent'}`}>
              
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span
              className={`text-[10px] font-medium ${hindi ? 'font-hindi' : ''}`}>
              
              {t(tab.labelKey)}
            </span>
          </button>);

      })}
    </div>);

}