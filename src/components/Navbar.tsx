import React from 'react';
import { 
  BookOpen, 
  Radio, 
  Clock, 
  Sparkles, 
  CircleDot, 
  FileText, 
  Sun, 
  Moon, 
  Volume2,
  MessageCircle
} from 'lucide-react';
import { TabType } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  isPlayingAudio: boolean;
  openAudioBar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleDarkMode,
  isPlayingAudio,
  openAudioBar,
}) => {
  const tabs = [
    { id: 'quran' as TabType, label: 'المصحف الشريف', icon: BookOpen },
    { id: 'radio' as TabType, label: 'إذاعات القرآن', icon: Radio },
    { id: 'prayer' as TabType, label: 'المواقيت والقبلة', icon: Clock },
    { id: 'azkar' as TabType, label: 'أذكار المسلم', icon: Sparkles },
    { id: 'tasbeeh' as TabType, label: 'المسبحة الذكية', icon: CircleDot },
    { id: 'nawawi' as TabType, label: 'الأربعون النووية', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand / Logo */}
          <div 
            onClick={() => setActiveTab('quran')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-amber-300 shadow-md shadow-emerald-800/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
                موقع للقرآن الكريم
              </h1>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:block">
                تلاوات خاشعة • قراءة • إذاعات • أذكار
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-stone-100/80 dark:bg-stone-800/60 p-1.5 rounded-2xl border border-stone-200/50 dark:border-stone-700/50">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-800/30'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: Audio Wave, Install PWA, Dark Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Audio Indicator */}
            {isPlayingAudio && (
              <div 
                onClick={openAudioBar}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold cursor-pointer"
                title="الصوت يعمل الآن"
              >
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-emerald-600 rounded-full animate-wave-1"></span>
                  <span className="w-0.5 bg-emerald-600 rounded-full animate-wave-2"></span>
                  <span className="w-0.5 bg-emerald-600 rounded-full animate-wave-3"></span>
                  <span className="w-0.5 bg-emerald-600 rounded-full animate-wave-4"></span>
                </div>
                <Volume2 className="w-3.5 h-3.5 ml-0.5" />
                <span className="hidden sm:inline">جاري الاستماع</span>
              </div>
            )}

            {/* In-App PWA Install Button */}
            <PWAInstallButton />

            {/* WhatsApp Link */}
            <a
              href="https://wa.me/201080969038"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-green-500 hover:bg-green-500/10 transition-colors"
              title="واتساب"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">واتساب</span>
            </a>

            {/* Dark/Light Mode Dual Toggle Switch */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-100/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all cursor-pointer shadow-xs active:scale-95 select-none"
              title={isDark ? 'التبديل إلى الوضع الفاتح (النهاري)' : 'التبديل إلى الوضع الغامق (الليلي)'}
              aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الغامق'}
            >
              {/* Sun Option */}
              <span 
                className={`flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-200 ${
                  !isDark 
                    ? 'bg-white text-amber-500 shadow-sm ring-1 ring-stone-200/80 font-bold' 
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-300'
                }`}
                title="الوضع الفاتح"
              >
                <Sun className="w-4 h-4" />
              </span>

              {/* Moon Option */}
              <span 
                className={`flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-200 ${
                  isDark 
                    ? 'bg-emerald-700 text-amber-300 shadow-sm ring-1 ring-emerald-600 font-bold' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
                title="الوضع الغامق"
              >
                <Moon className="w-4 h-4" />
              </span>

              {/* Text Label */}
              <span className="text-xs font-bold px-1 text-stone-700 dark:text-stone-200 hidden sm:inline-block">
                {isDark ? 'غامق' : 'فاتح'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Scrolling Horizontal Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 no-scrollbar -mx-4 px-4 border-t border-stone-100 dark:border-stone-800/60">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
