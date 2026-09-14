import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Copy, 
  Check, 
  BookOpen, 
  User, 
  Info 
} from 'lucide-react';
import { NAWAWI_HADITHS } from '../data/hadiths';

export const NawawiSection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return NAWAWI_HADITHS;
    const q = search.trim().toLowerCase();
    return NAWAWI_HADITHS.filter(h => 
      h.title.toLowerCase().includes(q) ||
      h.text.toLowerCase().includes(q) ||
      h.narrator.toLowerCase().includes(q) ||
      h.explanation.toLowerCase().includes(q)
    );
  }, [search]);

  const copyHadith = (id: number, text: string, title: string) => {
    const fullText = `«${text}»\n[${title}]`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="nawawi-section" className="space-y-6">
      
      {/* Header & Search */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>الأربعون النووية للإمام النووي</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              مجموعة من الأحاديث النبوية الجامعة التي يدور عليها مدار الدين الإسلامي وقواعده
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الأحاديث أو الرواة..."
              className="w-full pl-4 pr-10 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Hadiths Cards */}
      <div className="space-y-4">
        {filtered.map((hadith) => (
          <div
            key={hadith.id}
            id={`hadith-card-${hadith.id}`}
            className="p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-4"
          >
            {/* Title & Narrator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 dark:text-emerald-300">
                {hadith.title}
              </h3>
              <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <User className="w-3.5 h-3.5" />
                <span>الراوي: {hadith.narrator}</span>
              </div>
            </div>

            {/* Hadith Text */}
            <div className="font-amiri text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-loose text-right">
              {hadith.text}
            </div>

            {/* Explanation / Benefit */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200">الشرح والفوائد المستفادة: </span>
                <span>{hadith.explanation}</span>
              </div>
            </div>

            {/* Footer Copy Action */}
            <div className="pt-1 flex items-center justify-end">
              <button
                onClick={() => copyHadith(hadith.id, hadith.text, hadith.title)}
                className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer p-1.5"
                title="نسخ نص الحديث الشريف"
              >
                {copiedId === hadith.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">تم نسخ الحديث</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ الحديث</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
