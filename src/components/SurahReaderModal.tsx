import React, { useState, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  BookOpen, 
  Info, 
  Share2, 
  Loader2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Surah, Reciter } from '../types';

interface SurahReaderModalProps {
  surah: Surah;
  onClose: () => void;
  onPlayAudio: (surah: Surah) => void;
  isPlayingAudio: boolean;
  onNextSurah?: () => void;
  onPrevSurah?: () => void;
  selectedReciter: Reciter;
}

interface AyahData {
  number: number;
  numberInSurah: number;
  text: string;
  tafsir?: string;
}

export const SurahReaderModal: React.FC<SurahReaderModalProps> = ({
  surah,
  onClose,
  onPlayAudio,
  isPlayingAudio,
  onNextSurah,
  onPrevSurah,
  selectedReciter,
}) => {
  const [fontSize, setFontSize] = useState<number>(24);
  const [ayahs, setAyahs] = useState<AyahData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTafsirAyah, setActiveTafsirAyah] = useState<number | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [savedBookmark, setSavedBookmark] = useState<number | null>(null);

  // Load saved bookmark
  useEffect(() => {
    const raw = localStorage.getItem('quran_last_bookmark');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.surahNumber === surah.number) {
          setSavedBookmark(parsed.ayahNumber);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [surah.number]);

  // Fetch Surah text and Tafsir
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Try fetching from public CDN or cache
    fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,ar.muyassar`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        if (data.code === 200 && data.data && data.data.length >= 1) {
          const uthmaniEdition = data.data[0];
          const tafsirEdition = data.data[1];

          const mapped: AyahData[] = uthmaniEdition.ayahs.map((ayah: any, index: number) => {
            let text = ayah.text;
            // Clean Bismillah from first verse if not Al-Fatihah
            if (surah.number !== 1 && ayah.numberInSurah === 1) {
              text = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '');
            }
            return {
              number: ayah.number,
              numberInSurah: ayah.numberInSurah,
              text: text,
              tafsir: tafsirEdition?.ayahs[index]?.text || ''
            };
          });

          setAyahs(mapped);
          setLoading(false);
        } else {
          throw new Error('Invalid format');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        console.warn('Could not fetch from API, using basic text fallback:', err);
        // Fallback placeholder message
        setError('تعذر تحميل الآيات من الشبكة حالياً. يرجى التحقق من اتصال الإنترنت.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [surah.number]);

  const toggleBookmark = (ayahNumber: number) => {
    if (savedBookmark === ayahNumber) {
      setSavedBookmark(null);
      localStorage.removeItem('quran_last_bookmark');
    } else {
      setSavedBookmark(ayahNumber);
      localStorage.setItem('quran_last_bookmark', JSON.stringify({
        surahNumber: surah.number,
        surahName: surah.name,
        ayahNumber: ayahNumber,
        date: new Date().toISOString()
      }));
    }
  };

  const copyAyahText = (ayah: AyahData) => {
    const textToCopy = `﴿${ayah.text}﴾ [سورة ${surah.name}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-0 sm:p-4 md:p-6 animate-in fade-in">
      <div className="bg-stone-50 dark:bg-stone-950 w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl flex flex-col border border-stone-200 dark:border-stone-800 my-auto">
        
        {/* Sticky Header with Title and Quick Controls */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between sm:rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-sm">
              {surah.number}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <span>سورة {surah.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-normal">
                  {surah.revelationTypeArabic} • {surah.numberOfAyahs} آية
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                الجزء {surah.juz} • الصفحة {surah.page}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Play Surah Audio */}
            <button
              onClick={() => onPlayAudio(surah)}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
              title={`استمع لسورة ${surah.name} بصوت ${selectedReciter.name}`}
            >
              {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span className="hidden md:inline">{isPlayingAudio ? 'إيقاف التلاوة' : 'استماع'}</span>
            </button>

            {/* Font Size Adjusters */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setFontSize(prev => Math.max(18, prev - 2))}
                className="p-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                title="تصغير الخط"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-stone-500 dark:text-stone-400">
                {fontSize}
              </span>
              <button
                onClick={() => setFontSize(prev => Math.min(42, prev + 2))}
                className="p-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                title="تكبير الخط"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="إغلاق القارئ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-stone-900">
          
          {/* Surah Decorative Frame Banner */}
          <div className="max-w-xl mx-auto mb-8 p-6 text-center border-2 border-amber-500/20 dark:border-amber-500/10 rounded-3xl bg-amber-50/40 dark:bg-amber-950/10 relative overflow-hidden">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-900 dark:text-emerald-300 mb-1">
              سورة {surah.name}
            </div>
            <div className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              {surah.englishName} ({surah.englishNameTranslation})
            </div>
          </div>

          {/* Basmalah (If not Surah At-Tawbah #9) */}
          {surah.number !== 9 && (
            <div className="text-center my-6">
              <span className="font-quran text-2xl sm:text-3xl text-emerald-800 dark:text-emerald-400 tracking-wide">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-stone-500 dark:text-stone-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-sm font-medium">جاري تحميل آيات السورة الكريمة والتفسير...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 text-center text-stone-600 dark:text-stone-400 max-w-md mx-auto my-12 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/30">
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => onPlayAudio(surah)}
                className="bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-emerald-800 transition"
              >
                الاستماع للتلاوة الصوتية
              </button>
            </div>
          )}

          {/* Ayahs Display */}
          {!loading && !error && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {ayahs.map((ayah) => {
                const isBookmarked = savedBookmark === ayah.numberInSurah;
                const isTafsirOpen = activeTafsirAyah === ayah.numberInSurah;

                return (
                  <div
                    key={ayah.numberInSurah}
                    id={`ayah-${ayah.numberInSurah}`}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-150 ${
                      isBookmarked
                        ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-700/60 shadow-xs'
                        : 'border-stone-100 dark:border-stone-800/80 bg-white dark:bg-stone-900/50 hover:border-emerald-200 dark:hover:border-emerald-800/50'
                    }`}
                  >
                    {/* Ayah Text */}
                    <div 
                      className="font-quran text-stone-900 dark:text-stone-100 text-right leading-loose selection:bg-amber-200 dark:selection:bg-emerald-900"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      <span>{ayah.text}</span>
                      <span className="inline-flex items-center justify-center mr-2 px-2 py-0.5 rounded-full text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 align-middle">
                        {ayah.numberInSurah}
                      </span>
                    </div>

                    {/* Actions: Copy, Bookmark, Tafsir */}
                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        
                        {/* Tafsir Toggle */}
                        {ayah.tafsir && (
                          <button
                            onClick={() => setActiveTafsirAyah(isTafsirOpen ? null : ayah.numberInSurah)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                              isTafsirOpen 
                                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' 
                                : 'hover:bg-stone-100 dark:hover:bg-stone-800'
                            }`}
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>{isTafsirOpen ? 'إخفاء التفسير' : 'التفسير الميسر'}</span>
                          </button>
                        )}

                        {/* Copy Verse */}
                        <button
                          onClick={() => copyAyahText(ayah)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition font-medium cursor-pointer"
                          title="نسخ الآية"
                        >
                          {copiedAyah === ayah.numberInSurah ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>نسخ</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Bookmark Marker */}
                      <button
                        onClick={() => toggleBookmark(ayah.numberInSurah)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                          isBookmarked 
                            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' 
                            : 'hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                        title="وضع علامة الحفظ هنا"
                      >
                        {isBookmarked ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>علامة القراءة</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>حفظ الموضع</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Tafsir Box (When Opened) */}
                    {isTafsirOpen && ayah.tafsir && (
                      <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed animate-in fade-in">
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>التفسير الميسر:</span>
                        </div>
                        <p>{ayah.tafsir}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation to Previous and Next Surahs */}
          <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between max-w-3xl mx-auto">
            {onPrevSurah && surah.number > 1 ? (
              <button
                onClick={onPrevSurah}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-semibold transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السورة السابقة</span>
              </button>
            ) : <div />}

            {onNextSurah && surah.number < 114 ? (
              <button
                onClick={onNextSurah}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-semibold transition"
              >
                <span>السورة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>

        </div>

      </div>
    </div>
  );
};
