import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed bottom-20 sm:bottom-24 left-4 z-40 flex items-center gap-2.5 rounded-xl bg-amber-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-amber-900/20 border border-amber-500 animate-in slide-in-from-bottom-4"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>وضع عدم الاتصال: يمكنك تصفح المصحف، الأذكار، والمسبحة المحفوظة محلياً.</span>
    </div>
  );
};
