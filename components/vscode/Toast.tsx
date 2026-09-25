'use client';

import { useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, dismissToast } = usePortfolioStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-12 md:bottom-8 right-4 z-[300] flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: { id: number; message: string; timestamp: number }; onDismiss: (id: number) => void }) {
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 rounded shadow-2xl px-4 py-2.5 min-w-[280px] max-w-[400px] animate-toastIn border backdrop-blur-sm ${
        isLight
          ? 'bg-white/95 text-[#24292f] border-[#d0d0d0] shadow-black/15'
          : 'bg-[#252526]/95 text-[#e0e0e0] border-[#454545] shadow-black/50'
      }`}
      style={{ borderLeft: '3.5px solid var(--accent-color, #007acc)' }}
    >
      <Info className={`w-4 h-4 flex-shrink-0 ${isLight ? 'text-[#007acc]' : 'text-[#3794ff]'}`} />
      <span className="text-[12.5px] font-medium flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className={`p-1 rounded transition-colors flex-shrink-0 cursor-pointer ${
          isLight
            ? 'text-[#777777] hover:text-black hover:bg-[#e8e8e8]'
            : 'text-[#969696] hover:text-white hover:bg-[#3c3c3c]'
        }`}
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
