import React from 'react';
import { 
  BookOpen, 
  Radio, 
  Clock, 
  Sparkles, 
  CircleDot, 
  FileText, 
  Share2, 
  Heart,
  ShieldCheck,
  Download
} from 'lucide-react';
import { TabType, Surah } from '../types';

interface SEOFooterProps {
  setActiveTab: (tab: TabType) => void;
  onSelectSurahForReading: (surahNumber: number) => void;
}

export const SEOFooter: React.FC<SEOFooterProps> = ({
  setActiveTab,
  onSelectSurahForReading,
}) => {
  const popularSurahs = [
    { number: 1, name: "الفاتحة" },
    { number: 2, name: "البقرة" },
    { number: 18, name: "الكهف" },
    { number: 36, name: "يس" },
    { number: 55, name: "الرحمن" },
    { number: 56, name: "الواقعة" },
    { number: 67, name: "الملك" },
    { number: 112, name: "الإخلاص" },
  ];

  return (
    <footer className="mt-20 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Quran Quote Card */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-center max-w-2xl mx-auto">
          <p className="font-quran text-xl sm:text-2xl text-emerald-900 dark:text-emerald-300 leading-loose">
            ﴿إِنَّ هَٰذَا ٱلْقُرْءَانَ يَهْدِى لِلَّتِى هِىَ أَقْوَمُ وَيُبَشِّرُ ٱلْمُؤْمِنِينَ ٱلَّذِينَ يَعْمَلُونَ ٱلصَّٰلِحَٰتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا﴾
          </p>
          <span className="text-xs text-stone-500 dark:text-stone-400 mt-2 block">
            [سورة الإسراء: الآية 9]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About App */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-stone-900 dark:text-white">
                موقع القرآن الكريم
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              تطبيق إسلامي ويب تقدمي (PWA) يتيح قراءة القرآن الكريم بالرسم العثماني، الاستماع لكبار القراء، متابعة الإذاعات المباشرة، الأذكار اليومية ومواقيت الصلاة دون الحاجة إلى إنترنت بعد التحميل الأول.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>تطبيق آمن، مجاني، وبدون إعلانات مزعجة</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-900 dark:text-white">
              أقسام التطبيق
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <button onClick={() => setActiveTab('quran')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer">
                  فهرس المصحف الشريف (114 سورة)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('radio')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer">
                  إذاعات القرآن الكريم والبث المباشر
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('prayer')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer">
                  مواقيت الصلاة واتجاه القبلة
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('azkar')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer">
                  أذكار الصباح والمساء واليوم والليلة
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tasbeeh')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer">
                  المسبحة الإلكترونية الذكية
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('nawawi')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer">
                  الأربعون النووية مع الشرح
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Surahs for SEO */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-900 dark:text-white">
              سور مباركة شائعة
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
              {popularSurahs.map(s => (
                <button
                  key={s.number}
                  onClick={() => {
                    setActiveTab('quran');
                    onSelectSurahForReading(s.number);
                  }}
                  className="text-right hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  سورة {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: PWA Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-900 dark:text-white">
              تطبيق الويب التقدمي (PWA)
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              يدعم هذا الموقع ميزات PWA المتقدمة؛ يمكنك تثبيته كأي تطبيق أصلي على أندرويد وiOS وحاسوبك لتشغيله بنقرة واحدة والتصفح في وضع عدم الاتصال.
            </p>
            <div className="pt-2 text-xs text-stone-500">
              <a href="/sitemap.xml" className="hover:underline text-emerald-700 dark:text-emerald-400 font-semibold" target="_blank" rel="noopener noreferrer">
                خريطة الموقع (Sitemap XML)
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-200/80 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} موقع وتطبيق القرآن الكريم. صدقة جارية لكل من ساهم ونشر.
          </p>
          <div className="flex items-center gap-1">
            <span>نسألكم الدعاء بظهر الغيب</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current ml-1" />
          </div>
        </div>

      </div>
    </footer>
  );
};
