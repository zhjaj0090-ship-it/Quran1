import React from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  Radio, 
  BookOpen, 
  Users, 
  Gauge, 
  RotateCcw,
  Loader2
} from 'lucide-react';
import { Surah, Reciter, RadioStation } from '../types';
import { RECITERS } from '../data/reciters';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  isBuffering: boolean;
  currentType: 'surah' | 'radio' | null;
  currentSurah: Surah | null;
  currentRadio: RadioStation | null;
  selectedReciter: Reciter;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  errorMsg: string | null;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  changeReciter: (reciter: Reciter) => void;
  stop: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  isBuffering,
  currentType,
  currentSurah,
  currentRadio,
  selectedReciter,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  errorMsg,
  togglePlayPause,
  seek,
  setVolume,
  toggleMute,
  setPlaybackRate,
  changeReciter,
  stop,
}) => {
  if (!currentType) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const nextSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.75];
    const currentIndex = speeds.indexOf(playbackRate);
    const next = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(next);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-stone-900/98 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 shadow-2xl transition-all duration-200">
      
      {/* Progress Bar (Only for Surahs with valid duration) */}
      {currentType === 'surah' && duration > 0 && (
        <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 cursor-pointer relative group">
          <div 
            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-r-full relative transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber-400 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left/Start: Track Information */}
        <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial sm:w-72">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
            {currentType === 'surah' ? <BookOpen className="w-5 h-5" /> : <Radio className="w-5 h-5 animate-pulse text-rose-400" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white truncate">
                {currentType === 'surah' ? `سورة ${currentSurah?.name}` : currentRadio?.name}
              </h4>
              {currentType === 'radio' && (
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                  بث مباشر
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {currentType === 'surah' 
                ? `القارئ: ${selectedReciter.name}` 
                : currentRadio?.description || 'إذاعة إسلامية'}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Speed Toggle (For Surah) */}
            {currentType === 'surah' && (
              <button
                onClick={nextSpeed}
                className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                title="تغيير سرعة التلاوة"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>{playbackRate}x</span>
              </button>
            )}

            {/* Rewind 10s */}
            {currentType === 'surah' && (
              <button
                onClick={() => seek(Math.max(0, currentTime - 10))}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-1.5 transition"
                title="إرجاع 10 ثواني"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Play/Pause Button */}
            <button
              id="player-toggle-btn"
              onClick={togglePlayPause}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 active:scale-95 transition cursor-pointer"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isBuffering ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
              )}
            </button>

            {/* Close / Stop */}
            <button
              onClick={stop}
              className="text-stone-400 hover:text-rose-500 p-1.5 transition rounded-lg"
              title="إيقاف المشغل وإغلاقه"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Time Counter (For Surahs) */}
          {currentType === 'surah' && (
            <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Right: Reciter Dropdown & Volume Controls */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Reciter Selector */}
          {currentType === 'surah' && (
            <div className="relative">
              <select
                value={selectedReciter.id}
                onChange={(e) => {
                  const reciter = RECITERS.find(r => r.id === e.target.value);
                  if (reciter) changeReciter(reciter);
                }}
                className="appearance-none bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl px-3 py-1.5 pr-7 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {RECITERS.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.style})
                  </option>
                ))}
              </select>
              <Users className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-1"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

      </div>

      {/* Error alert if audio fails to load */}
      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/80 border-t border-rose-200 dark:border-rose-900/50 py-1.5 px-4 text-center text-xs text-rose-700 dark:text-rose-300">
          {errorMsg}
        </div>
      )}
    </div>
  );
};
