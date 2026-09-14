import React, { useState } from 'react';
import { Download, Smartphone, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 px-3.5 py-1.5 text-xs sm:text-sm font-semibold shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer"
        title="تثبيت التطبيق على جهازك"
      >
        <Download className="w-4 h-4" />
        <span>تثبيت التطبيق (PWA)</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-3 py-1.5 text-xs sm:text-sm font-medium transition active:scale-95 cursor-pointer"
          title="تثبيت التطبيق على آيفون وآيباد"
        >
          <Smartphone className="w-4 h-4" />
          <span>تثبيت على آيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-right animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    تثبيت على iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    1
                  </span>
                  <p>
                    اضغط على زر المشاركة <Share2 className="w-4 h-4 inline-block text-emerald-600 mx-1 align-sub" /> في شريط متصفح Safari بالأسفل.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    2
                  </span>
                  <p>
                    انزل للأسفل واضغط على <span className="font-semibold text-stone-900 dark:text-white">إضافة إلى الشاشة الرئيسية</span> <PlusSquare className="w-4 h-4 inline-block text-emerald-600 mx-1 align-sub" />.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    3
                  </span>
                  <p>
                    اضغط على <span className="font-semibold text-stone-900 dark:text-white">إضافة (Add)</span> في الزاوية العلوية للاستمتاع بالتطبيق في وضع الشاشة الكاملة وبدون إنترنت.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition"
              >
                فهمت، حسناً
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
