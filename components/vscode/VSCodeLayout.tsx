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
import IntroLoading from './IntroLoading';
import FeatureHighlighter from './FeatureHighlighter';
import DevToolsWarning from './DevToolsWarning';
import ContextMenu from './ContextMenu';
import { playClickSound } from '@/lib/sound';
import {
  Files,
  Search,
  GitBranch,
  Mail,
  UserCircle,
  Settings,
  Sparkles,
  Terminal as TerminalIcon,
} from 'lucide-react';

function MobileBottomBar() {
  const {
    activeSidebarPanel,
    setActiveSidebarPanel,
    sidebarVisible,
    toggleSidebar,
    terminalVisible,
    toggleTerminal,
    theme,
  } = usePortfolioStore();

  const isLight = theme === 'light';

  const items = [
    { id: 'explorer' as const, Icon: Files, label: 'Files' },
    { id: 'search' as const, Icon: Search, label: 'Search' },
    { id: 'assistant' as const, Icon: Sparkles, label: 'AI' },
    { id: 'git' as const, Icon: GitBranch, label: 'Git' },
    { id: 'profile' as const, Icon: UserCircle, label: 'Profile' },
    { id: 'contact' as const, Icon: Mail, label: 'Contact' },
    { id: 'settings' as const, Icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      className={`flex items-center justify-around border-t flex-shrink-0 z-30 relative select-none transition-colors duration-150 ${isLight
          ? 'bg-[#f0f0f0] border-[#d8d8d8] text-[#333333]'
          : 'bg-[#252526] border-[#1e1e1e] text-[#858585]'
        }`}
    >
      {items.map(({ id, Icon, label }) => {
        const isActive = activeSidebarPanel === id && sidebarVisible;
        return (
          <button
            key={id}
            type="button"
            data-tour={id === 'explorer' ? 'explorer-btn' : id === 'assistant' ? 'assistant-btn' : id === 'settings' ? 'settings-btn' : id === 'contact' ? 'contact-btn' : id === 'profile' ? 'profile-btn' : undefined}
            onClick={() => {
              playClickSound();
              if (isActive) {
                toggleSidebar();
              } else {
                setActiveSidebarPanel(id);
              }
            }}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-0 transition-all duration-150 cursor-pointer active:scale-90 ${isActive
                ? isLight
                  ? 'text-[#0060c0] font-semibold'
                  : 'text-white font-semibold'
                : isLight
                  ? 'text-[#666666] hover:text-black'
                  : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            aria-label={label}
          >
            <Icon className={`w-4.5 h-4.5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} strokeWidth={isActive ? 2.2 : 1.5} />
            <span className="text-[9.5px] tracking-tight">{label}</span>
          </button>
        );
      })}
      <button
        type="button"
        data-tour="terminal-btn"
        onClick={() => {
          playClickSound();
          toggleTerminal();
        }}
        className={`flex flex-col items-center gap-0.5 py-1.5 px-2 transition-all duration-150 cursor-pointer active:scale-90 ${terminalVisible
            ? isLight
              ? 'text-[#0060c0] font-semibold'
              : 'text-white font-semibold'
            : isLight
              ? 'text-[#666666] hover:text-black'
              : 'text-[#858585] hover:text-[#cccccc]'
          }`}
        aria-label="Terminal"
      >
        <TerminalIcon className={`w-4.5 h-4.5 transition-transform duration-150 ${terminalVisible ? 'scale-110' : ''}`} strokeWidth={terminalVisible ? 2.2 : 1.5} />
        <span className="text-[9.5px] tracking-tight">Term</span>
      </button>
    </div>
  );
}

export default function VSCodeLayout() {
  const {
    toggleSidebar,
    toggleTerminal,
    setIsMobile,
    isMobile,
    toggleMdPreview,
    commandPaletteOpen,
    toggleCommandPalette,
    theme,
    editorFontSize,
    setEditorFontSize,
  } = usePortfolioStore();

  const isLight = theme === 'light';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme') as 'dark' | 'light' | null;
      if (saved && (saved === 'dark' || saved === 'light') && saved !== theme) {
        usePortfolioStore.getState().setTheme(saved);
        return;
      }
    } catch { }

    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P') && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          toggleCommandPalette();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        if (!isInput) {
          e.preventDefault();
          setEditorFontSize(editorFontSize + 1);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        if (!isInput) {
          e.preventDefault();
          setEditorFontSize(editorFontSize - 1);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        if (!isInput) {
          e.preventDefault();
          setEditorFontSize(13);
        }
      }
      if (e.key === 'Escape') {
        if (commandPaletteOpen) {
          e.preventDefault();
          toggleCommandPalette();
        }
      }
    },
    [
      toggleSidebar,
      toggleTerminal,
      toggleMdPreview,
      commandPaletteOpen,
      toggleCommandPalette,
      editorFontSize,
      setEditorFontSize,
    ]
  );

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
    <div
      id="vscode-root"
      className={`h-[100dvh] w-screen flex flex-col overflow-hidden transition-colors duration-150 ${isLight ? 'bg-white text-[#24292f]' : 'bg-[#1e1e1e] text-[#cccccc]'
        }`}
    >
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
      <IntroLoading />
      <FeatureHighlighter />
      <DevToolsWarning />
      <ContextMenu />
    </div>
  );
}
