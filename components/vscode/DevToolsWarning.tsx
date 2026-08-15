'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { playToastSound } from '@/lib/sound';
import { addListener, removeListener, launch, stop } from 'devtools-detector';

export default function DevToolsWarning() {
  const [isOpen, setIsOpen] = useState(false);
  const userDismissed = useRef(false);

  const triggerWarning = useCallback(() => {
    setIsOpen(true);
    userDismissed.current = false;
    playToastSound();
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    userDismissed.current = true;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleDevToolsStatus = (status: boolean) => {
      if (status) {
        if (!userDismissed.current) {
          setIsOpen(true);
        }
      } else {
        setIsOpen(false);
        userDismissed.current = false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U'))
      ) {
        triggerWarning();
      }
    };

    addListener(handleDevToolsStatus);
    launch();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      removeListener(handleDevToolsStatus);
      stop();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerWarning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/10 backdrop-blur-xl transition-all duration-300 select-none font-sans p-4">
      <div className="w-full max-w-[420px] rounded-xl border border-[#ff4444]/40 bg-[#161618] text-white p-6 shadow-2xl animate-fadeIn text-center relative">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-md text-[#888888] hover:text-white hover:bg-[#28282b] transition-colors cursor-pointer"
          aria-label="Dismiss warning"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#ff4444]/15 border border-[#ff4444]/30 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6 text-[#ff5555]" />
        </div>

        <h2 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight">
          Kya chhed raha hai bhai??
        </h2>

        <p className="text-xs md:text-sm text-[#aaaaaa] leading-relaxed mb-6">
          Codebase is completely open source and safe, no need to inspect directly.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 py-2 px-4 rounded-lg bg-[#007acc] hover:bg-[#0060c0] text-white text-xs font-semibold transition-colors cursor-pointer shadow-md"
          >
            I am sorry, take me back
          </button>
        </div>
      </div>
    </div>
  );
}
