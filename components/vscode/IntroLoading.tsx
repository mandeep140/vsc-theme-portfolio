'use client';

import { useState, useEffect, useCallback } from 'react';

const BOOT_STEPS = [
  'INITIALIZING MANDEEP_OS KERNEL v1.0.0...',
  'MOUNTING VIRTUAL FILE SYSTEM & MODULES... [OK]',
  'CONNECTING GEMINI AI COPILOT & REDIS... [OK]',
  'STARTING VISUAL STUDIO CODE WORKSPACE... [READY]',
];

export default function IntroLoading({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const dismiss = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 350);
  }, [onComplete]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < BOOT_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 280);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 6;
      });
    }, 45);

    const finishTimeout = setTimeout(() => {
      dismiss();
    }, 1300);

    const handleKeyDown = () => dismiss();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(finishTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss]);

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0e0e10] text-[#cccccc] font-mono cursor-pointer transition-opacity duration-350 select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-[90%] max-w-[460px] p-6 rounded-lg border border-[#2d2d30] bg-[#141416]/90 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 mb-5 pb-3 border-b border-[#252528]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[11px] text-[#6e7781] font-mono">mandeep@portfolio-boot ~</span>
        </div>

        <div className="space-y-1.5 min-h-[96px] text-[12px] leading-relaxed">
          {BOOT_STEPS.slice(0, currentStep + 1).map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 ${
                idx === currentStep ? 'text-white' : 'text-[#858585]'
              }`}
            >
              <span className="text-[#007acc] font-bold">&gt;</span>
              <span className="truncate">{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-[#252528]">
          <div className="flex items-center justify-between text-[11px] text-[#858585] mb-2 font-mono">
            <span>COMPILING ASSETS</span>
            <span className="text-[#007acc] font-bold tabular-nums">{progress}%</span>
          </div>
          <div className="h-1 w-full bg-[#202024] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#007acc] rounded-full transition-all duration-75 shadow-[0_0_8px_#007acc]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-[#555555] font-mono animate-pulse">
        Click or press any key to skip
      </div>
    </div>
  );
}