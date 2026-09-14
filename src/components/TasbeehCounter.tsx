import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Award, 
  CircleDot,
  Check
} from 'lucide-react';

const DHIKR_PHRASES = [
  "سُبْحَانَ اللَّهِ",
  "الْحَمْدُ لِلَّهِ",
  "لَا إِلَهَ إِلَّا اللَّهُ",
  "اللَّهُ أَكْبَرُ",
  "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
  "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
  "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
  "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ"
];

export const TasbeehCounter: React.FC = () => {
  const [selectedPhrase, setSelectedPhrase] = useState(DHIKR_PHRASES[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<number>(33);
  const [cycles, setCycles] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Load lifetime total count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tasbeeh_lifetime_count');
    if (saved) {
      setTotalCount(parseInt(saved, 10) || 0);
    }
  }, []);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      // Gentle web audio click
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio context may not be allowed without user gesture
    }
  };

  const handleTap = () => {
    // Haptic vibration
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    playClickSound();

    const nextCount = count + 1;
    const nextTotal = totalCount + 1;

    setTotalCount(nextTotal);
    localStorage.setItem('tasbeeh_lifetime_count', nextTotal.toString());

    if (target > 0 && nextCount >= target) {
      setCount(0);
      setCycles(prev => prev + 1);
      // Double vibration on target milestone
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setCycles(0);
  };

  const progressPercentage = target > 0 ? (count / target) * 100 : 100;

  return (
    <section id="tasbeeh-section" className="max-w-2xl mx-auto space-y-6">
      
      {/* Header card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs text-center space-y-4">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <CircleDot className="w-4 h-4 text-emerald-600" />
          <span>المسبحة الإلكترونية المتطورة</span>
        </div>

        {/* Phrase Selector Dropdown */}
        <div>
          <label className="block text-xs text-stone-500 dark:text-stone-400 font-semibold mb-2">
            اختر الذكر للتسبيح:
          </label>
          <select
            value={selectedPhrase}
            onChange={(e) => {
              setSelectedPhrase(e.target.value);
              setCount(0);
            }}
            className="w-full max-w-md mx-auto bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-amiri text-lg font-bold rounded-2xl px-4 py-3 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer text-center"
          >
            {DHIKR_PHRASES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Target Milestone Selector */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-xs text-stone-400">الهدف:</span>
          {[33, 99, 100, 0].map(t => (
            <button
              key={t}
              onClick={() => { setTarget(t); setCount(0); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                target === t
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {t === 0 ? 'مفتوح' : t}
            </button>
          ))}
        </div>

        {/* Big Counter Button Circle */}
        <div className="py-6 flex flex-col items-center">
          <button
            id="tasbeeh-tap-btn"
            onClick={handleTap}
            className="group relative w-60 h-60 sm:w-68 sm:h-68 rounded-full bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white flex flex-col items-center justify-center shadow-2xl shadow-emerald-900/30 active:scale-95 transition-all duration-150 cursor-pointer border-8 border-emerald-600/30 select-none hover:border-emerald-500/50"
          >
            {/* Background Ripple on tap */}
            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            {/* Target Ring progress overlay */}
            <div className="text-xs text-emerald-200 font-semibold tracking-wider uppercase mb-1">
              {target > 0 ? `الهدف: ${target}` : 'تسبيح حر'}
            </div>

            {/* Current Number */}
            <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {count}
            </div>

            <div className="mt-3 text-xs sm:text-sm text-amber-300 font-medium px-4 text-center truncate max-w-[200px]">
              {selectedPhrase}
            </div>

            <div className="mt-2 text-[11px] text-emerald-200/80">
              اضغط للتسبيح
            </div>
          </button>
        </div>

        {/* Cycles and Lifetime Stats */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2 text-center">
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/50">
            <div className="text-[11px] text-stone-500 dark:text-stone-400">الدورات المكتملة</div>
            <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
              {cycles}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/50">
            <div className="text-[11px] text-stone-500 dark:text-stone-400">إجمالي التسبيحات</div>
            <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
              {totalCount.toLocaleString('ar-EG')}
            </div>
          </div>
        </div>

        {/* Reset and Sound Settings */}
        <div className="flex items-center justify-center gap-4 pt-3 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-semibold p-2 transition cursor-pointer"
            title="تصفير العداد الحالي"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تصفير العداد</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-semibold p-2 transition cursor-pointer"
            title="تشغيل أو كتم صوت النقر"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>صوت النقر: مفعل</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>صوت النقر: معطل</span>
              </>
            )}
          </button>
        </div>

      </div>

    </section>
  );
};
