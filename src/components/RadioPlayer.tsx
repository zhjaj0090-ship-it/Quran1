import React from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  Signal, 
  Volume2, 
  Globe, 
  Sparkles,
  Headphones
} from 'lucide-react';
import { RadioStation } from '../types';
import { RADIO_STATIONS } from '../data/radios';

interface RadioPlayerProps {
  currentRadio: RadioStation | null;
  isPlayingAudio: boolean;
  onPlayRadio: (station: RadioStation) => void;
  onTogglePlayPause: () => void;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = ({
  currentRadio,
  isPlayingAudio,
  onPlayRadio,
  onTogglePlayPause,
}) => {
  return (
    <section id="radio-section" className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <Signal className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>بث إذاعي مباشر متواصل 24 ساعة</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
            إذاعات القرآن الكريم المباشرة
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            استمع مباشرة إلى أعرق إذاعات القرآن الكريم في العالم الإسلامي، تلاوات خاشعة، رقية شرعية، وأذكار اليوم والليلة بجودة صوتية عالية.
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute left-[-20px] bottom-[-40px] w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Stations List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RADIO_STATIONS.map((station) => {
          const isSelected = currentRadio?.id === station.id;
          const isPlayingThis = isSelected && isPlayingAudio;

          return (
            <div
              key={station.id}
              id={`radio-station-${station.id}`}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between bg-white dark:bg-stone-900 ${
                isPlayingThis
                  ? 'border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600/20 shadow-lg'
                  : 'border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/50'
              }`}
            >
              <div>
                {/* Station Top Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Radio className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>مباشر</span>
                  </div>
                </div>

                {/* Station Name & City */}
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">
                  {station.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mb-3">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{station.cityOrCountry}</span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {station.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                {isPlayingThis ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="w-1 h-3 bg-emerald-600 rounded-full animate-wave-1"></span>
                    <span className="w-1 h-4 bg-emerald-600 rounded-full animate-wave-2"></span>
                    <span className="w-1 h-2 bg-emerald-600 rounded-full animate-wave-3"></span>
                    <span className="mr-1">جاري الاستماع الآن</span>
                  </div>
                ) : (
                  <span className="text-xs text-stone-400 font-medium">بث صوتي حي</span>
                )}

                <button
                  onClick={() => {
                    if (isSelected) {
                      onTogglePlayPause();
                    } else {
                      onPlayRadio(station);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs ${
                    isPlayingThis
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isPlayingThis ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>استمع الآن</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
