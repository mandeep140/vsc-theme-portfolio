'use client';

import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { GitBranch, CheckCircle2, AlertCircle, TriangleAlert, Bell, Volume2, VolumeX } from 'lucide-react';

function useClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const format = () => {
      const now = new Date();
      return now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    };
    setTime(format());
    const interval = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

export default function StatusBar() {
  const {
    activeTabId, openTabs, terminalVisible, toggleTerminal,
    setActiveSidebarPanel, showToast,
  } = usePortfolioStore();

  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const clock = useClock();

  const langLabel = activeTab?.language === 'typescript'
    ? 'TypeScript'
    : activeTab?.language === 'tsx'
      ? 'TypeScript React'
      : activeTab?.language === 'markdown'
        ? 'Markdown'
        : activeTab
          ? 'Plain Text'
          : null;

  return (
    <div className="flex items-center h-[22px] bg-[#007acc] text-white text-[12px] px-2 select-none flex-shrink-0">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveSidebarPanel('git')}
          className="flex items-center gap-1 hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded-sm transition-colors"
          title="Source Control (click to open)"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </button>
        <div className="flex items-center gap-0.5 px-1">
          <button
            className="flex items-center gap-0.5 hover:bg-[#1f8ad2] px-1 py-0.5 rounded-sm transition-colors"
            onClick={() => showToast('No errors in this portfolio')}
            title="Problems"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0</span>
          </button>
          <button
            className="flex items-center gap-0.5 hover:bg-[#1f8ad2] px-1 py-0.5 rounded-sm transition-colors"
            onClick={() => showToast('No warnings found')}
            title="Warnings"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>0</span>
          </button>
          <button
            className="flex items-center gap-0.5 hover:bg-[#1f8ad2] px-1 py-0.5 rounded-sm transition-colors"
            onClick={() => showToast('No information diagnostics')}
            title="Information"
          >
            <TriangleAlert className="w-3.5 h-3.5" />
            <span>0</span>
          </button>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-0.5">
        <button
          onClick={toggleTerminal}
          className="hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded-sm transition-colors"
          title="Toggle Terminal"
        >
          Terminal
        </button>
        {langLabel && (
          <button
            onClick={() => showToast(`Language Mode: ${langLabel}`)}
            className="hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded-sm transition-colors"
            title="Language Mode"
          >
            {langLabel}
          </button>
        )}
        <button
          onClick={() => showToast('Encoding: UTF-8')}
          className="hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded-sm transition-colors"
          title="File Encoding"
        >
          UTF-8
        </button>
        <button
          onClick={() => showToast('End of line: LF (Unix)')}
          className="hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded-sm transition-colors"
          title="End of Line"
        >
          LF
        </button>
        <button
          onClick={() => setActiveSidebarPanel('contact')}
          className="flex items-center gap-1 hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded-sm transition-colors"
          title="Open Contact (click to open)"
        >
          <Bell className="w-3 h-3" />
          <span>Portfolio</span>
        </button>
        <button
          onClick={() => showToast('Prettier is active — code is formatted on save')}
          className="hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded-sm transition-colors"
          title="Formatter: Prettier"
        >
          Prettier
        </button>
        <button
          onClick={() => {
            const current = usePortfolioStore.getState().soundEnabled;
            usePortfolioStore.getState().toggleSound();
            showToast(current ? 'Sound effects disabled' : 'Sound effects enabled');
          }}
          className="flex items-center gap-1 hover:bg-[#1f8ad2] px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer"
          title={usePortfolioStore.getState().soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        >
          {usePortfolioStore.getState().soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 opacity-70" />
          )}
        </button>
        {clock && (
          <span
            className="px-1.5 py-0.5 tabular-nums font-mono"
            title="Current time"
          >
            {clock}
          </span>
        )}
      </div>
    </div>
  );
}
