'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';

interface TourStep {
  targetKey: string;
  title: string;
  description: string;
}

export default function FeatureHighlighter() {
  const { theme, isMobile, tourOpen, startTour, closeTour } = usePortfolioStore();
  const isLight = theme === 'light';

  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: TourStep[] = useMemo(
    () => [
      {
        targetKey: 'welcome-stats',
        title: 'Total Views & Interactive Likes',
        description:
          'Live visitor analytics backed by Upstash Redis. View real-time visits and click the heart button to leave a like.',
      },
      {
        targetKey: 'assistant-btn',
        title: 'Gemini AI Copilot',
        description:
          'Ask Mandeep\'s AI assistant anything about his technical stack, SaaS applications, CTO experience, or availability.',
      },
      {
        targetKey: 'explorer-btn',
        title: 'File Explorer & Projects',
        description:
          'Browse full-stack SaaS projects, experience, and education as source files.',
      },
      {
        targetKey: 'contact-btn',
        title: 'Contact Me',
        description:
          'Get in touch with Mandeep for collaboration opportunities, freelance work, or to discuss potential projects.',
      },
      {
        targetKey: 'profile-btn',
        title: 'Developer Profile',
        description:
          'Mandeep Nagar is a full-stack developer with 5+ years of experience in building web applications.',
      },
      {
        targetKey: 'terminal-btn',
        title: 'Interactive Terminal',
        description:
          'Built-in command shell. Try running help, projects, stats, or ai <question> directly in the terminal.',
      },
      {
        targetKey: 'settings-btn',
        title: 'Themes & Settings',
        description:
          'Customize your workspace by toggling Dark+ and Light+ themes, adjusting font size, or toggling line numbers.',
      },
    ],
    []
  );

  const finishTour = useCallback(() => {
    closeTour();
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_tour_seen', 'true');
    }
  }, [closeTour]);

  const updateTargetRect = useCallback(() => {
    if (!tourOpen) return;
    const step = steps[currentStep];
    if (!step) return;

    const el = document.querySelector(`[data-tour="${step.targetKey}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [tourOpen, currentStep, steps]);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('portfolio_tour_seen')) {
      return;
    }

    const timer = setTimeout(() => {
      startTour();
    }, 1500);

    return () => clearTimeout(timer);
  }, [startTour]);

  useEffect(() => {
    if (!tourOpen) return;

    updateTargetRect();
    const handleReposition = () => updateTargetRect();

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [tourOpen, currentStep, updateTargetRect]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!tourOpen) return null;

  const current = steps[currentStep];

  let cardStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10001,
    width: 'calc(100vw - 24px)',
    maxWidth: '360px',
  };

  if (isMobile) {
    if (targetRect) {
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const isTargetInBottomHalf = targetCenterY > (typeof window !== 'undefined' ? window.innerHeight * 0.55 : 350);

      if (isTargetInBottomHalf) {
        cardStyle = {
          position: 'fixed',
          top: 'max(16px, env(safe-area-inset-top, 16px))',
          left: '12px',
          right: '12px',
          margin: '0 auto',
          zIndex: 10001,
          maxWidth: '360px',
          width: 'calc(100vw - 24px)',
        };
      } else {
        cardStyle = {
          position: 'fixed',
          bottom: 'max(62px, env(safe-area-inset-bottom, 62px))',
          left: '12px',
          right: '12px',
          margin: '0 auto',
          zIndex: 10001,
          maxWidth: '360px',
          width: 'calc(100vw - 24px)',
        };
      }
    } else {
      cardStyle = {
        position: 'fixed',
        bottom: 'max(62px, env(safe-area-inset-bottom, 62px))',
        left: '12px',
        right: '12px',
        margin: '0 auto',
        zIndex: 10001,
        maxWidth: '360px',
        width: 'calc(100vw - 24px)',
      };
    }
  } else if (targetRect) {
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceRight = window.innerWidth - targetRect.right;

    let top = targetRect.bottom + 12;
    let left = targetRect.left;

    if (spaceBelow < 200) {
      top = Math.max(16, targetRect.top - 180);
    }

    if (spaceRight < 340) {
      left = Math.max(16, window.innerWidth - 350);
    }

    cardStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 10001,
      width: '340px',
    };
  }

  return (
    <>
      <div
        onClick={finishTour}
        className="fixed inset-0 z-[9999] pointer-events-auto"
      />

      {targetRect && (
        <div
          className="fixed z-[10000] pointer-events-none rounded-md transition-all duration-250 ring-2 ring-[#007acc] ring-offset-2 ring-offset-black/20"
          style={{
            top: `${Math.max(0, targetRect.top - 4)}px`,
            left: `${Math.max(0, targetRect.left - 4)}px`,
            width: `${targetRect.width + 5}px`,
            height: `${targetRect.height + 5}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
          }}
        />
      )}

      <div
        style={cardStyle}
        className={`p-4 rounded-lg border shadow-2xl animate-fadeIn select-none font-sans ${isLight
          ? 'bg-white border-[#d0d0d0] text-[#24292f]'
          : 'bg-[#1f1f22] border-[#3c3c3c] text-[#cccccc]'
          }`}
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-inherit">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Feature Tour</span>
          </div>
          <button
            type="button"
            onClick={finishTour}
            className={`p-1 rounded transition-colors cursor-pointer ${isLight ? 'hover:bg-[#e0e0e0] text-[#666666]' : 'hover:bg-[#3c3c3c] text-[#858585]'
              }`}
            aria-label="Skip tour"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[13px] font-semibold mb-1 text-inherit">{current.title}</div>
        <p
          className={`text-[12px] leading-relaxed mb-4 ${isLight ? 'text-[#555555]' : 'text-[#999999]'
            }`}
        >
          {current.description}
        </p>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span
            className={`font-mono text-[11px] ${isLight ? 'text-[#888888]' : 'text-[#666666]'
              }`}
          >
            {currentStep + 1} / {steps.length}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={finishTour}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${isLight
                ? 'hover:bg-[#e8e8e8] text-[#666666]'
                : 'hover:bg-[#2d2d2d] text-[#858585]'
                }`}
            >
              Skip
            </button>

            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className={`p-1 rounded border transition-colors cursor-pointer ${isLight
                  ? 'bg-white border-[#d0d0d0] text-[#444444] hover:bg-[#f0f0f0]'
                  : 'bg-[#2d2d2d] border-[#404040] text-[#cccccc] hover:bg-[#3c3c3c]'
                  }`}
                aria-label="Previous step"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-1 bg-[#007acc] text-white rounded text-[11px] font-medium hover:bg-[#0060c0] transition-colors cursor-pointer shadow-xs"
            >
              <span>{currentStep === steps.length - 1 ? 'Done' : 'Next'}</span>
              {currentStep < steps.length - 1 && <ChevronRight className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
