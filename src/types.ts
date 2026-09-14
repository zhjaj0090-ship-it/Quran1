export type TabType = 'quran' | 'radio' | 'prayer' | 'azkar' | 'tasbeeh' | 'nawawi';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeArabic: 'مكية' | 'مدنية';
  page: number;
  juz: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  tafsir?: string;
  juz?: number;
  page?: number;
}

export interface Reciter {
  id: string;
  name: string;
  subfolder: string;
  serverUrl: string;
  style?: string;
}

export interface RadioStation {
  id: string;
  name: string;
  url: string;
  description: string;
  cityOrCountry: string;
}

export interface DhikrItem {
  id: string;
  text: string;
  fadl: string;
  count: number;
  currentCount: number;
}

export interface DhikrCategory {
  id: string;
  title: string;
  description: string;
  items: DhikrItem[];
}

export interface HadithItem {
  id: number;
  title: string;
  narrator: string;
  text: string;
  explanation: string;
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: string;
  timeRemaining: string;
  cityName: string;
}

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  date: string;
}
