import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  BookOpen, 
  Bookmark, 
  Filter, 
  Sparkles, 
  Volume2, 
  ArrowRight,
  Mic,
  Palette,
  Check,
  Compass,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Surah, Reciter } from '../types';
import { SURAHS } from '../data/surahs';
import { RECITERS } from '../data/reciters';
import { ReciterSelectorModal } from './ReciterSelectorModal';

export type HomeBackgroundTheme = 'islamic' | 'mihrab' | 'stars' | 'classic';

interface SurahListProps {
  onSelectSurahForReading: (surah: Surah) => void;
  onPlaySurahAudio: (surah: Surah, reciter?: Reciter) => void;
  currentPlayingSurah: Surah | null;
  isPlayingAudio: boolean;
  selectedReciter: Reciter;
  onChangeReciter: (reciter: Reciter) => void;
  onThemeChange?: (theme: HomeBackgroundTheme) => void;
}

export const SurahList: React.FC<SurahListProps> = ({
  onSelectSurahForReading,
  onPlaySurahAudio,
  currentPlayingSurah,
  isPlayingAudio,
  selectedReciter,
  onChangeReciter,
  onThemeChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan' | 'bookmarked'>('all');
  const [isReciterModalOpen, setIsReciterModalOpen] = useState(false);
  
  // Background Theme State
  const [bgTheme, setBgTheme] = useState<HomeBackgroundTheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('quran_home_bg_theme') as HomeBackgroundTheme) || 'islamic';
    }
    return 'islamic';
  });

  const handleSelectBgTheme = (theme: HomeBackgroundTheme) => {
    setBgTheme(theme);
    localStorage.setItem('quran_home_bg_theme', theme);
    if (onThemeChange) onThemeChange(theme);
  };

  useEffect(() => {
    if (onThemeChange) onThemeChange(bgTheme);
  }, [bgTheme, onThemeChange]);

  // Featured reciters for quick access bar
  const featuredReciters = useMemo(() => {
    const featuredIds = [
      'mishary_alafasy',
      'abdul_baset_murattal',
      'maher_muaiqly',
      'minshawi_murattal',
      'abdul_rahman_sudais',
      'saud_shuraim',
      'mahmoud_hussary',
      'yasser_dossari',
      'ahmed_ajmi',
      'nasser_qatami',
      'fares_abbad',
      'idrees_abkar',
    ];
    return RECITERS.filter(r => featuredIds.includes(r.id));
  }, []);

  // Check saved bookmark from localStorage
  const lastBookmark = useMemo(() => {
    try {
      const raw = localStorage.getItem('quran_last_bookmark');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      return null;
    }
    return null;
  }, []);

  // Filtered Surahs
  const filteredSurahs = useMemo(() => {
    return SURAHS.filter(surah => {
      // Type filter
      if (filterType === 'Meccan' && surah.revelationType !== 'Meccan') return false;
      if (filterType === 'Medinan' && surah.revelationType !== 'Medinan') return false;
      if (filterType === 'bookmarked') {
        if (!lastBookmark || lastBookmark.surahNumber !== surah.number) return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      const normalizedSurahName = surah.name.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه');
      const normalizedQuery = q.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه');

      return (
        surah.number.toString() === q ||
        normalizedSurahName.includes(normalizedQuery) ||
        surah.name.toLowerCase().includes(q) ||
        surah.englishName.toLowerCase().includes(q) ||
        surah.englishNameTranslation.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, filterType, lastBookmark]);

  return (
    <section id="surah-section" className="space-y-6">
      
      {/* Spiritual Hero Banner with Customizable Islamic Background */}
      <div 
        className={`relative overflow-hidden rounded-3xl border transition-all duration-300 shadow-xl ${
          bgTheme === 'mihrab'
            ? 'bg-gradient-to-br from-emerald-900 via-teal-950 to-stone-950 text-white border-emerald-600/40'
            : bgTheme === 'stars'
            ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-stone-950 text-white border-indigo-500/30'
            : bgTheme === 'classic'
            ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-800'
            : 'bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 text-white border-emerald-700/50'
        }`}
      >
        {/* Background Islamic Pattern Overlay */}
        <div className="absolute inset-0 bg-islamic-stars opacity-15 pointer-events-none" />
        
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
          
          {/* Top Bar inside Banner: Quranic Basmalah & Theme Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/10 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مصحف التلاوة والتدبر الشامل</span>
            </div>

            {/* Background Theme Selector */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto bg-black/30 dark:bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/10 text-xs">
              <span className="text-[11px] text-stone-300 px-2 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-300" />
                الخلفية:
              </span>
              {[
                { id: 'islamic', label: 'نقوش إسلامية' },
                { id: 'mihrab', label: 'محراب الروضة' },
                { id: 'stars', label: 'ليلة القرآن' },
                { id: 'classic', label: 'هادئ' },
              ].map((themeItem) => (
                <button
                  key={themeItem.id}
                  onClick={() => handleSelectBgTheme(themeItem.id as HomeBackgroundTheme)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                    bgTheme === themeItem.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {themeItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* Central Quranic Calligraphy & Verse */}
          <div className="text-center max-w-3xl mx-auto space-y-3 my-2">
            <div className="text-sm sm:text-base font-quran text-amber-300 tracking-wider">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-quran font-bold leading-relaxed sm:leading-loose text-white drop-shadow-xs">
              « إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا »
            </h1>
            <p className="text-xs text-stone-300">
              سورة الإسراء - الآية 9
            </p>
          </div>

          {/* Banner Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center pt-2">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
              <div className="text-base sm:text-lg font-bold text-amber-300">114</div>
              <div className="text-[11px] text-stone-300">سورة كاملة</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
              <div className="text-base sm:text-lg font-bold text-amber-300">6,236</div>
              <div className="text-[11px] text-stone-300">آية كريمة</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
              <div className="text-base sm:text-lg font-bold text-amber-300">{RECITERS.length} قارئاً</div>
              <div className="text-[11px] text-stone-300">من كبار القراء</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
              <div className="text-base sm:text-lg font-bold text-amber-300">PWA</div>
              <div className="text-[11px] text-stone-300">تطبيق سريع وبدون نت</div>
            </div>
          </div>

        </div>
      </div>

      {/* Last Read Bookmark Banner (If saved) */}
      {lastBookmark && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-700/50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs text-amber-200 font-medium">موضع القراءة الأخير المحفوظ</div>
              <div className="text-base sm:text-lg font-bold">
                سورة {lastBookmark.surahName} - الآية {lastBookmark.ayahNumber}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const target = SURAHS.find(s => s.number === lastBookmark.surahNumber);
              if (target) onSelectSurahForReading(target);
            }}
            className="flex items-center justify-center gap-2 bg-white text-emerald-900 hover:bg-amber-100 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition active:scale-95 shadow-xs cursor-pointer"
          >
            <span>متابعة القراءة</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}

      {/* Search, Filter & Reciters Showcase Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        
        {/* Search Input & Reciter Selector Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="search-surah-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم السورة (مثلاً: الكهف، البقرة، يس) أو رقمها..."
              className="w-full pl-4 pr-10 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-800 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                مسح
              </button>
            )}
          </div>

          {/* Reciter Selector Button */}
          <button
            onClick={() => setIsReciterModalOpen(true)}
            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 text-emerald-900 dark:text-emerald-200 transition active:scale-98 cursor-pointer shrink-0"
          >
            <div className="flex items-center gap-2 text-right">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  القارئ المعتمد ({RECITERS.length} قارئ)
                </div>
                <div className="text-xs font-bold truncate max-w-[140px] sm:max-w-[180px]">
                  {selectedReciter.name}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

        {/* Quick Reciters Strip (Top Famous Reciters) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              أبرز القراء المتاحين (اختر بنقرة واحدة):
            </span>
            <button
              onClick={() => setIsReciterModalOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>جميع القراء ({RECITERS.length})</span>
              <ArrowRight className="w-3 h-3 rotate-180" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {featuredReciters.map((reciter) => {
              const isSelected = selectedReciter.id === reciter.id;
              return (
                <button
                  key={reciter.id}
                  onClick={() => onChangeReciter(reciter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{reciter.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="text-xs text-stone-400 dark:text-stone-500 ml-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            تصفية السور:
          </span>
          {[
            { id: 'all', label: `جميع السور (${SURAHS.length})` },
            { id: 'Meccan', label: 'مكية (86)' },
            { id: 'Medinan', label: 'مدنية (28)' },
            { id: 'bookmarked', label: 'علامتي المحفوظة' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                filterType === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Surahs Grid */}
      {filteredSurahs.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
          <Sparkles className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
            لم يتم العثور على سور مطابقة لبحثك.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setFilterType('all'); }}
            className="mt-3 text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
          >
            إعادة تعيين البحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSurahs.map((surah) => {
            const isPlayingThis = currentPlayingSurah?.number === surah.number && isPlayingAudio;
            const isThisBookmarked = lastBookmark?.surahNumber === surah.number;

            return (
              <div
                key={surah.number}
                id={`surah-card-${surah.number}`}
                className={`group relative bg-white dark:bg-stone-900 rounded-2xl p-4 border transition-all duration-150 flex flex-col justify-between hover:shadow-md ${
                  isPlayingThis
                    ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-700 ring-1 ring-emerald-600'
                    : isThisBookmarked
                    ? 'border-amber-400/80 dark:border-amber-700/60'
                    : 'border-stone-200/80 dark:border-stone-800 hover:border-emerald-500/60'
                }`}
              >
                {/* Card Top: Number, Names, Type */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    
                    {/* Number Badge */}
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700 group-hover:border-emerald-500/50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                      {surah.number}
                    </div>

                    {/* Surah Titles */}
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition flex items-center gap-1.5">
                        <span>سورة {surah.name}</span>
                        {isThisBookmarked && (
                          <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        )}
                      </h3>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {surah.englishName} • {surah.englishNameTranslation}
                      </p>
                    </div>
                  </div>

                  {/* Revelation Badge */}
                  <div className="text-left shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {surah.revelationTypeArabic}
                    </span>
                  </div>
                </div>

                {/* Card Middle: Ayah & Page Info */}
                <div className="my-3 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 border-y border-stone-100 dark:border-stone-800/80 py-2">
                  <span>{surah.numberOfAyahs} آيات</span>
                  <span>الجزء {surah.juz}</span>
                  <span>ص {surah.page}</span>
                </div>

                {/* Card Bottom: Listen and Read Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  
                  {/* Read Button */}
                  <button
                    onClick={() => onSelectSurahForReading(surah)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-emerald-700 hover:text-white dark:hover:bg-emerald-700 text-xs font-semibold transition active:scale-98 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>قراءة السورة</span>
                  </button>

                  {/* Play Audio Button */}
                  <button
                    onClick={() => onPlaySurahAudio(surah)}
                    className={`p-2 rounded-xl transition active:scale-95 cursor-pointer ${
                      isPlayingThis
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-700 hover:text-white'
                    }`}
                    title={`استمع لسورة ${surah.name} بصوت ${selectedReciter.name}`}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current translate-x-[-0.5px]" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Reciter Selection Modal */}
      <ReciterSelectorModal
        isOpen={isReciterModalOpen}
        onClose={() => setIsReciterModalOpen(false)}
        selectedReciter={selectedReciter}
        onSelectReciter={onChangeReciter}
      />

    </section>
  );
};

