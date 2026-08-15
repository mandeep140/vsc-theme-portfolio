'use client';

import { useEffect, useCallback } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';
import TitleBar from './TitleBar';
import ActivityBar from './ActivityBar';
import Sidebar from './Sidebar';
import EditorPanel from './EditorPanel';
import Terminal from './Terminal';
import StatusBar from './StatusBar';
import CommandPalette from './CommandPalette';
import Toast from './Toast';
import {
  Files,
  Search,
  GitBranch,
  Mail,
  Terminal as TerminalIcon,
} from 'lucide-react';

function MobileBottomBar() {
  const { activeSidebarPanel, setActiveSidebarPanel, sidebarVisible, toggleSidebar, terminalVisible, toggleTerminal } = usePortfolioStore();

  const items = [
    { id: 'explorer' as const, Icon: Files, label: 'Files' },
    { id: 'search' as const, Icon: Search, label: 'Search' },
    { id: 'git' as const, Icon: GitBranch, label: 'Git' },
    { id: 'contact' as const, Icon: Mail, label: 'Contact' },
  ];

  return (
    <div className="flex items-center justify-around bg-[#252526] border-t border-[#1e1e1e] flex-shrink-0 z-30 relative">
      {items.map(({ id, Icon, label }) => {
        const isActive = activeSidebarPanel === id && sidebarVisible;
        return (
          <button
            key={id}
            onClick={() => {
              if (isActive) {
                toggleSidebar();
              } else {
                setActiveSidebarPanel(id);
              }
            }}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 transition-colors duration-150 ${isActive ? 'text-white' : 'text-[#858585]'
              }`}
          >
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
            <span className="text-[10px]">{label}</span>
          </button>
        );
      })}
      <button
        onClick={toggleTerminal}
        className={`flex flex-col items-center gap-0.5 py-2 px-3 transition-colors duration-150 ${terminalVisible ? 'text-white' : 'text-[#858585]'
          }`}
      >
        <TerminalIcon className="w-5 h-5" strokeWidth={terminalVisible ? 2 : 1.5} />
        <span className="text-[10px]">Term</span>
      </button>
    </div>
  );
}

export default function VSCodeLayout() {
  const {
    toggleSidebar, toggleTerminal, setIsMobile, isMobile,
    toggleMdPreview, commandPaletteOpen, toggleCommandPalette,
    theme, editorFontSize, setEditorFontSize,
  } = usePortfolioStore();

  // Apply theme class to root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
    }
  }, [theme]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      toggleSidebar();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '`') {
      e.preventDefault();
      toggleTerminal();
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      toggleMdPreview();
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      toggleCommandPalette();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '=') {
      if (!isInput) { e.preventDefault(); setEditorFontSize(editorFontSize + 1); }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '-') {
      if (!isInput) { e.preventDefault(); setEditorFontSize(editorFontSize - 1); }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      if (!isInput) { e.preventDefault(); setEditorFontSize(13); }
    }
    if (e.key === 'Escape') {
      if (commandPaletteOpen) {
        e.preventDefault();
        toggleCommandPalette();
      }
    }
  }, [
    toggleSidebar, toggleTerminal, toggleMdPreview,
    commandPaletteOpen, toggleCommandPalette, editorFontSize, setEditorFontSize,
  ]);

  // Detect mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [setIsMobile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div id="vscode-root" className="h-[100dvh] w-screen bg-[#1e1e1e] flex flex-col overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {!isMobile && <ActivityBar />}
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
          <EditorPanel />
          <Terminal />
        </div>
      </div>
      {isMobile && <MobileBottomBar />}
      {!isMobile && <StatusBar />}
      <CommandPalette />
      <Toast />
    </div>
  );
}
