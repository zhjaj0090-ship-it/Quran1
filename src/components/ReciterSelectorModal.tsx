import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Check, 
  Volume2, 
  Sparkles,
  Mic
} from 'lucide-react';
import { Reciter } from '../types';
import { RECITERS } from '../data/reciters';

interface ReciterSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
}

type ReciterCategory = 'all' | 'haramain' | 'pioneers' | 'mujawwad' | 'khushu' | 'warsh';

export const ReciterSelectorModal: React.FC<ReciterSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedReciter,
  onSelectReciter,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ReciterCategory>('all');

  // Categorization helper
  const getCategoryForReciter = (r: Reciter): ReciterCategory[] => {
    const cats: ReciterCategory[] = ['all'];
    const text = (r.name + ' ' + (r.style || '')).toLowerCase();

    if (text.includes('حرم') || ['saud_shuraim', 'abdul_rahman_sudais', 'maher_muaiqly', 'yasser_dossari', 'abdullah_juhany', 'bandar_balila', 'ali_jaber'].includes(r.id)) {
      cats.push('haramain');
    }
    if (['minshawi_murattal', 'minshawi_mujawwad', 'mahmoud_hussary', 'hussary_mujawwad', 'abdul_baset_murattal', 'abdul_baset_mujawwad', 'mahmoud_banna', 'muhammad_ayyub'].includes(r.id)) {
      cats.push('pioneers');
    }
    if (text.includes('مجود') || r.id.includes('mujawwad')) {
      cats.push('mujawwad');
    }
    if (text.includes('ورش') || r.id.includes('warsh')) {
      cats.push('warsh');
    }
    if (['mishary_alafasy', 'ahmed_ajmi', 'nasser_qatami', 'fares_abbad', 'idrees_abkar', 'khaled_jalil', 'hazza_albalushi', 'wadih_yamani', 'salah_bukhatir', 'saad_ghamdi', 'abu_bakr_shatri'].includes(r.id)) {
      cats.push('khushu');
    }
    return cats;
  };

  const filteredReciters = useMemo(() => {
    return RECITERS.filter(reciter => {
      // Category filter
      if (category !== 'all') {
        const cats = getCategoryForReciter(reciter);
        if (!cats.includes(category)) return false;
      }

      // Search query
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      const nameNorm = reciter.name.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').toLowerCase();
      const qNorm = q.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه');
      const styleNorm = (reciter.style || '').toLowerCase();

      return nameNorm.includes(qNorm) || styleNorm.includes(qNorm) || reciter.id.includes(q);
    });
  }, [search, category]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">اختيار القارئ المفضل</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  {RECITERS.length} قارئ
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                استمع إلى تلاوات القرآن الكريم بأعذب وأشهر الأصوات المعتمدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 sm:px-6 bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم القارئ (مثل: السديس، المعيقلي، العفاسي، المنشاوي) أو الرواية..."
              className="w-full pl-4 pr-10 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-800 transition"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                مسح
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'جميع القراء (27)' },
              { id: 'haramain', label: 'أئمة الحرمين الشريفين' },
              { id: 'pioneers', label: 'كبار القراء الرواد' },
              { id: 'mujawwad', label: 'المصحف المجود' },
              { id: 'khushu', label: 'تلاوات خاشعة وشجية' },
              { id: 'warsh', label: 'رواية ورش عن نافع' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id as ReciterCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  category === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reciters List Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredReciters.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                لم نجد قارئاً يطابق بحثك.
              </p>
              <button
                onClick={() => { setSearch(''); setCategory('all'); }}
                className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                إظهار جميع القراء
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredReciters.map(reciter => {
                const isSelected = selectedReciter.id === reciter.id;
                
                return (
                  <div
                    key={reciter.id}
                    onClick={() => {
                      onSelectReciter(reciter);
                      onClose();
                    }}
                    className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-right ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600 ring-2 ring-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-stone-800/70 border-stone-200 dark:border-stone-700/80 hover:border-emerald-500 hover:bg-stone-50/70 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar letter badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition ${
                        isSelected 
                          ? 'bg-emerald-700 text-white' 
                          : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
                      }`}>
                        {reciter.name.slice(0, 2)}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white truncate">
                          {reciter.name}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {reciter.style || 'تلاوة مباركة'}
                        </div>
                      </div>
                    </div>

                    {/* Check or Select icon */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 flex items-center justify-center transition">
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <div>
            القارئ الحالي: <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedReciter.name}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition cursor-pointer"
          >
            تأكيد
          </button>
        </div>

      </div>
    </div>
  );
};
