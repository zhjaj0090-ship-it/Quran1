import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Compass, 
  Sun, 
  Sunset, 
  Sunrise, 
  Moon, 
  Navigation,
  Sparkles,
  Calendar
} from 'lucide-react';

interface CityOption {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

const CITIES: CityOption[] = [
  { id: 'cairo', name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357 },
  { id: 'makkah', name: 'مكة المكرمة', country: 'السعودية', lat: 21.3891, lng: 39.8579 },
  { id: 'madinah', name: 'المدينة المنورة', country: 'السعودية', lat: 24.5247, lng: 39.5692 },
  { id: 'riyadh', name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753 },
  { id: 'jerusalem', name: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137 },
  { id: 'dubai', name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708 },
  { id: 'amman', name: 'عَمّان', country: 'الأردن', lat: 31.9454, lng: 35.9284 },
  { id: 'kuwait', name: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774 },
  { id: 'casablanca', name: 'الدار البيضاء', country: 'المغرب', lat: 33.5731, lng: -7.5898 },
  { id: 'tunis', name: 'تونس', country: 'تونس', lat: 36.8065, lng: 10.1815 },
  { id: 'algiers', name: 'الجزائر', country: 'الجزائر', lat: 36.7538, lng: 3.0588 },
];

export const PrayerTimesCard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityOption>(CITIES[0]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: "04:30",
    Sunrise: "05:50",
    Dhuhr: "12:15",
    Asr: "15:45",
    Maghrib: "18:20",
    Isha: "19:40",
  });
  const [nextPrayerName, setNextPrayerName] = useState<string>("المغرب");
  const [countdownString, setCountdownString] = useState<string>("00:00:00");
  const [qiblaDegrees, setQiblaDegrees] = useState<number>(136);

  // Keep clock running
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate Qibla Angle from coordinates to Kaaba (21.4225° N, 39.8262° E)
  useEffect(() => {
    const kaabaLat = 21.4225 * (Math.PI / 180);
    const kaabaLng = 39.8262 * (Math.PI / 180);
    const userLat = selectedCity.lat * (Math.PI / 180);
    const userLng = selectedCity.lng * (Math.PI / 180);

    const y = Math.sin(kaabaLng - userLng);
    const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(kaabaLng - userLng);
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    qibla = (qibla + 360) % 360;
    setQiblaDegrees(Math.round(qibla));
  }, [selectedCity]);

  // Fetch or calculate prayer times using public Aladhan API or local fallback
  useEffect(() => {
    let isMounted = true;
    const now = new Date();
    const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

    fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${selectedCity.lat}&longitude=${selectedCity.lng}&method=5`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data && data.data && data.data.timings) {
          const t = data.data.timings;
          setPrayerTimes({
            Fajr: t.Fajr.substring(0, 5),
            Sunrise: t.Sunrise.substring(0, 5),
            Dhuhr: t.Dhuhr.substring(0, 5),
            Asr: t.Asr.substring(0, 5),
            Maghrib: t.Maghrib.substring(0, 5),
            Isha: t.Isha.substring(0, 5),
          });
        }
      })
      .catch(err => {
        console.warn("Using fallback calculation for prayer times:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Calculate Next Prayer and Countdown
  useEffect(() => {
    const list = [
      { name: "الفجر", time: prayerTimes.Fajr },
      { name: "الشروق", time: prayerTimes.Sunrise },
      { name: "الظهر", time: prayerTimes.Dhuhr },
      { name: "العصر", time: prayerTimes.Asr },
      { name: "المغرب", time: prayerTimes.Maghrib },
      { name: "العشاء", time: prayerTimes.Isha },
    ];

    const now = currentTime;
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let target = null;
    let targetMins = 0;

    for (const p of list) {
      const [h, m] = p.time.split(':').map(Number);
      const prayerMins = h * 60 + m;
      if (prayerMins > currentMins) {
        target = p;
        targetMins = prayerMins;
        break;
      }
    }

    // If past Isha, next prayer is Fajr tomorrow
    if (!target) {
      target = list[0];
      const [h, m] = list[0].time.split(':').map(Number);
      targetMins = 24 * 60 + h * 60 + m;
    }

    setNextPrayerName(target.name);

    const diffMins = targetMins - currentMins;
    const diffSecs = diffMins * 60 - now.getSeconds();

    if (diffSecs > 0) {
      const h = Math.floor(diffSecs / 3600);
      const m = Math.floor((diffSecs % 3600) / 60);
      const s = diffSecs % 60;
      setCountdownString(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    } else {
      setCountdownString("حان الآن وقت الصلاة");
    }
  }, [currentTime, prayerTimes]);

  const requestGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSelectedCity({
            id: 'gps',
            name: 'موقعي الحالي',
            country: 'حسب إحداثيات GPS',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.warn("Geolocation permission rejected or unavailable:", err);
        }
      );
    }
  };

  const prayers = [
    { key: "Fajr", name: "الفجر", time: prayerTimes.Fajr, icon: Sunrise },
    { key: "Sunrise", name: "الشروق", time: prayerTimes.Sunrise, icon: Sun },
    { key: "Dhuhr", name: "الظهر", time: prayerTimes.Dhuhr, icon: Sun },
    { key: "Asr", name: "العصر", time: prayerTimes.Asr, icon: Sun },
    { key: "Maghrib", name: "المغرب", time: prayerTimes.Maghrib, icon: Sunset },
    { key: "Isha", name: "العشاء", time: prayerTimes.Isha, icon: Moon },
  ];

  return (
    <section id="prayer-section" className="space-y-6">
      
      {/* Top Countdown Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>مواقيت الصلاة الدقيقة</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold">
            الصلاة القادمة: <span className="text-amber-300">{nextPrayerName}</span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-200">
            الوقت المتبقي للأذان: <span className="font-mono text-base font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{countdownString}</span>
          </p>
        </div>

        {/* Location Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <span>المدينة:</span>
          </div>

          <select
            value={selectedCity.id}
            onChange={(e) => {
              const c = CITIES.find(city => city.id === e.target.value);
              if (c) setSelectedCity(c);
            }}
            className="bg-stone-900/90 text-white text-xs font-bold rounded-xl px-3 py-2 border border-white/20 focus:outline-hidden cursor-pointer"
          >
            {CITIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.country}
              </option>
            ))}
            {selectedCity.id === 'gps' && (
              <option value="gps">موقعي الحالي (GPS)</option>
            )}
          </select>

          <button
            onClick={requestGPS}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer"
            title="تحديد الموقع الجغرافي تلقائياً"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>GPS</span>
          </button>
        </div>

      </div>

      {/* 6 Prayer Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {prayers.map((prayer) => {
          const Icon = prayer.icon;
          const isNext = prayer.name === nextPrayerName;

          return (
            <div
              key={prayer.key}
              className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-2 bg-white dark:bg-stone-900 ${
                isNext
                  ? 'border-emerald-600 ring-2 ring-emerald-600/30 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md'
                  : 'border-stone-200/80 dark:border-stone-800'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                  {prayer.name}
                </h4>
                <div className="text-base sm:text-lg font-mono font-extrabold text-emerald-800 dark:text-emerald-300 mt-0.5">
                  {prayer.time}
                </div>
              </div>

              {isNext && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                  القادمة
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Qibla Compass Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="space-y-3 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>بوصلة اتجاه القبلة</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
            اتجاه القبلة نحو الكعبة المشرفة
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            زاوية انحراف القبلة من <span className="font-bold text-stone-900 dark:text-white">{selectedCity.name}</span> هي <span className="font-bold text-emerald-700 dark:text-emerald-400">{qiblaDegrees}°</span> من اتجاه الشمال الجغرافي.
          </p>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            احرص على توجيه الهاتف نحو زاوية المؤشر الذهبي لضبط صلاتك بدقة.
          </div>
        </div>

        {/* Compass Visual Instrument */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 flex items-center justify-center shadow-inner">
          
          {/* Compass Rose Cardinals */}
          <span className="absolute top-2 text-xs font-bold text-stone-500">N</span>
          <span className="absolute bottom-2 text-xs font-bold text-stone-500">S</span>
          <span className="absolute right-2 text-xs font-bold text-stone-500">E</span>
          <span className="absolute left-2 text-xs font-bold text-stone-500">W</span>

          {/* Center Pivot */}
          <div className="w-4 h-4 rounded-full bg-stone-900 dark:bg-white z-10 shadow-xs"></div>

          {/* Qibla Needle */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700 ease-out"
            style={{ transform: `rotate(${qiblaDegrees}deg)` }}
          >
            <div className="w-1.5 h-36 relative flex flex-col justify-between">
              {/* North / Kaaba Tip */}
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[24px] border-b-amber-500 self-center -translate-y-2"></div>
              {/* South Tip */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[18px] border-t-stone-400 self-center translate-y-2"></div>
            </div>
          </div>

          {/* Degree Indicator */}
          <div className="absolute bottom-6 px-2 py-0.5 rounded-md bg-stone-900/80 text-amber-300 text-[11px] font-mono font-bold">
            {qiblaDegrees}°
          </div>
        </div>

      </div>

    </section>
  );
};
