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
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className="flex items-center gap-3 bg-[#252526] border border-[#3c3c3c] rounded shadow-xl px-4 py-2.5 min-w-[280px] max-w-[400px] animate-toastIn"
      style={{ borderLeft: '3px solid #007acc' }}
    >
      <Info className="w-4 h-4 text-[#3794ff] flex-shrink-0" />
      <span className="text-[13px] text-[#cccccc] flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 text-[#858585] hover:text-[#cccccc] rounded hover:bg-[#505050] flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
