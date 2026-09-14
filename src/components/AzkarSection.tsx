import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Check, 
  Info, 
  Copy, 
  Sun, 
  Moon, 
  Heart,
  CheckCircle2
} from 'lucide-react';
import { AZKAR_CATEGORIES } from '../data/azkar';

export const AzkarSection: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState<string>('sabah');
  
  // Track counts per dhikr in state: { [dhikrId]: number }
  const [counts, setCounts] = useState<{ [id: string]: number }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCategory = AZKAR_CATEGORIES.find(c => c.id === selectedCatId) || AZKAR_CATEGORIES[0];

  const handleIncrement = (id: string, targetCount: number) => {
    // Haptic feedback if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }

    setCounts(prev => {
      const current = prev[id] || 0;
      if (current < targetCount) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const resetCategory = () => {
    setCounts(prev => {
      const next = { ...prev };
      activeCategory.items.forEach(item => {
        delete next[item.id];
      });
      return next;
    });
  };

  const copyDhikr = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate completed items in current category
  const completedCount = activeCategory.items.filter(item => (counts[item.id] || 0) >= item.count).length;
  const progressPercent = Math.round((completedCount / activeCategory.items.length) * 100);

  return (
    <section id="azkar-section" className="space-y-6">
      
      {/* Category Tabs & Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>أذكار المسلم اليومية</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              حصن نفسك بيقين مع عداد التكرار الذكي وفضائل الأذكار الصحيحة
            </p>
          </div>

          <button
            onClick={resetCategory}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold transition cursor-pointer"
            title="تصفير عدادات القسم الحالي"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة تعيين العدادات</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {AZKAR_CATEGORIES.map(cat => {
            const isSelected = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Progress Bar for Active Category */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
            <span>نسبة إنجاز الأذكار:</span>
            <span>{completedCount} من {activeCategory.items.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Adhkar Cards List */}
      <div className="space-y-4">
        {activeCategory.items.map((item, index) => {
          const currentCount = counts[item.id] || 0;
          const isCompleted = currentCount >= item.count;

          return (
            <div
              key={item.id}
              id={`dhikr-card-${item.id}`}
              className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-stone-900 ${
                isCompleted
                  ? 'border-emerald-500/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {/* Dhikr Arabic Text */}
              <div className="font-amiri text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-loose text-right">
                {item.text}
              </div>

              {/* Virtue / Fadl */}
              {item.fadl && (
                <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 text-xs text-stone-500 dark:text-stone-400 leading-relaxed flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item.fadl}</span>
                </div>
              )}

              {/* Bottom Actions: Counter Button and Copy */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                
                {/* Copy Button */}
                <button
                  onClick={() => copyDhikr(item.id, item.text)}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-medium cursor-pointer p-1.5"
                  title="نسخ الذكر"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الذكر</span>
                    </>
                  )}
                </button>

                {/* Counter Tap Button */}
                <button
                  onClick={() => handleIncrement(item.id, item.count)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                      <span>تمت القراءة ({currentCount}/{item.count})</span>
                    </>
                  ) : (
                    <>
                      <span>اضغط للتسبيح</span>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-700 text-white font-mono text-xs">
                        {currentCount} / {item.count}
                      </span>
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
