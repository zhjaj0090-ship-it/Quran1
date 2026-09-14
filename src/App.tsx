/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, Surah } from './types';
import { SURAHS } from './data/surahs';
import { useAudioPlayer } from './hooks/useAudioPlayer';

import { Navbar } from './components/Navbar';
import { SurahList, HomeBackgroundTheme } from './components/SurahList';
import { RadioPlayer } from './components/RadioPlayer';
import { PrayerTimesCard } from './components/PrayerTimesCard';
import { AzkarSection } from './components/AzkarSection';
import { TasbeehCounter } from './components/TasbeehCounter';
import { NawawiSection } from './components/NawawiSection';
import { SurahReaderModal } from './components/SurahReaderModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SEOFooter } from './components/SEOFooter';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('quran');
  const [readingSurah, setReadingSurah] = useState<Surah | null>(null);

  // Home Background Theme
  const [bgTheme, setBgTheme] = useState<HomeBackgroundTheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('quran_home_bg_theme') as HomeBackgroundTheme) || 'islamic';
    }
    return 'islamic';
  });

  // Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme_preference');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

  // Audio Player Engine
  const audio = useAudioPlayer();

  // Surah reader next/prev handlers
  const handleNextSurah = () => {
    if (!readingSurah || readingSurah.number >= 114) return;
    const next = SURAHS.find(s => s.number === readingSurah.number + 1);
    if (next) setReadingSurah(next);
  };

  const handlePrevSurah = () => {
    if (!readingSurah || readingSurah.number <= 1) return;
    const prev = SURAHS.find(s => s.number === readingSurah.number - 1);
    if (prev) setReadingSurah(prev);
  };

  return (
    <div className={`min-h-screen relative text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200 flex flex-col selection:bg-emerald-200 dark:selection:bg-emerald-900 ${
      bgTheme === 'mihrab'
        ? 'bg-stone-50 dark:bg-[#07130f]'
        : bgTheme === 'stars'
        ? 'bg-stone-50 dark:bg-[#070b16]'
        : 'bg-stone-50 dark:bg-stone-950'
    }`}>
      
      {/* Fixed Ambient Islamic Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-islamic-stars opacity-45 dark:opacity-35" />
        <div className="absolute inset-0 bg-islamic-mesh" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Top Navbar with Tabs, PWA Install, and Dark Mode */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          isPlayingAudio={audio.isPlaying}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32">
          {activeTab === 'quran' && (
            <SurahList
              onSelectSurahForReading={(surah) => setReadingSurah(surah)}
              onPlaySurahAudio={(surah, reciter) => audio.playSurah(surah, reciter)}
              currentPlayingSurah={audio.currentSurah}
              isPlayingAudio={audio.isPlaying}
              selectedReciter={audio.selectedReciter}
              onChangeReciter={audio.changeReciter}
              onThemeChange={(th) => setBgTheme(th)}
            />
          )}

          {activeTab === 'radio' && (
            <RadioPlayer
              currentRadio={audio.currentRadio}
              isPlayingAudio={audio.isPlaying}
              onPlayRadio={audio.playRadio}
              onTogglePlayPause={audio.togglePlayPause}
            />
          )}

          {activeTab === 'prayer' && <PrayerTimesCard />}

          {activeTab === 'azkar' && <AzkarSection />}

          {activeTab === 'tasbeeh' && <TasbeehCounter />}

          {activeTab === 'nawawi' && <NawawiSection />}
        </main>

        {/* Surah Reader Fullscreen / Modal */}
        {readingSurah && (
          <SurahReaderModal
            surah={readingSurah}
            onClose={() => setReadingSurah(null)}
            onPlayAudio={(s) => audio.playSurah(s)}
            isPlayingAudio={audio.currentSurah?.number === readingSurah.number && audio.isPlaying}
            onNextSurah={readingSurah.number < 114 ? handleNextSurah : undefined}
            onPrevSurah={readingSurah.number > 1 ? handlePrevSurah : undefined}
            selectedReciter={audio.selectedReciter}
          />
        )}

        {/* Persistent Audio Player Bar */}
        <AudioPlayerBar
          isPlaying={audio.isPlaying}
          isBuffering={audio.isBuffering}
          currentType={audio.currentType}
          currentSurah={audio.currentSurah}
          currentRadio={audio.currentRadio}
          selectedReciter={audio.selectedReciter}
          currentTime={audio.currentTime}
          duration={audio.duration}
          volume={audio.volume}
          isMuted={audio.isMuted}
          playbackRate={audio.playbackRate}
          errorMsg={audio.errorMsg}
          togglePlayPause={audio.togglePlayPause}
          seek={audio.seek}
          setVolume={audio.setVolume}
          toggleMute={audio.toggleMute}
          setPlaybackRate={audio.setPlaybackRate}
          changeReciter={audio.changeReciter}
          stop={audio.stop}
        />

        {/* Offline Status Toast */}
        <OfflineIndicator />

        {/* SEO & Structured Navigation Footer */}
        <SEOFooter
          setActiveTab={setActiveTab}
          onSelectSurahForReading={(num) => {
            const s = SURAHS.find(item => item.number === num);
            if (s) setReadingSurah(s);
          }}
        />

      </div>
    </div>
  );
}
