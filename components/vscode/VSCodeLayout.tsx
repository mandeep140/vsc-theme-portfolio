'use client';

import { useEffect, useCallback, useState } from 'react';
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
import { playClickSound, playToggleSound } from '@/lib/sound';
import {
  Files,
  Search,
  GitBranch,
  Mail,
  UserCircle,
  Settings,
  Sparkles,
  Terminal as TerminalIcon,
  MessageSquareQuote,
  MoreHorizontal,
  Sliders,
  X,
} from 'lucide-react';

function MobileBottomBar() {
  const {
    activeSidebarPanel,
    setActiveSidebarPanel,
    sidebarVisible,
    toggleSidebar,
    terminalVisible,
    toggleTerminal,
    toggleCommandPalette,
    mobileMoreOpen,
    setMobileMoreOpen,
    theme,
  } = usePortfolioStore();

  const isLight = theme === 'light';

  const isMorePanelActive =
    sidebarVisible &&
    ['feedback', 'profile', 'contact', 'git', 'settings'].includes(activeSidebarPanel);

  const handlePanelClick = (panelId: typeof activeSidebarPanel) => {
    playClickSound();
    setMobileMoreOpen(false);
    if (activeSidebarPanel === panelId && sidebarVisible) {
      toggleSidebar();
    } else {
      setActiveSidebarPanel(panelId);
    }
  };

  return (
    <>
      {mobileMoreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] animate-fadeIn"
          onClick={() => setMobileMoreOpen(false)}
        />
      )}

      {mobileMoreOpen && (
        <div
          className={`fixed bottom-[52px] right-2 z-50 min-w-[210px] rounded-xl p-1.5 shadow-2xl border backdrop-blur-md animate-scaleIn select-none font-sans ${
            isLight
              ? 'bg-white/95 border-[#d0d0d0] text-[#24292f] shadow-black/20'
              : 'bg-[#252526]/95 border-[#454545] text-[#cccccc] shadow-black/60'
          }`}
        >
          <div className="flex items-center justify-between px-2.5 py-1 mb-1 border-b border-inherit opacity-70">
            <span className="text-[10px] font-semibold uppercase tracking-wider">More Tools</span>
            <button
              type="button"
              onClick={() => setMobileMoreOpen(false)}
              className="p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => handlePanelClick('feedback')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12px] font-medium transition-colors cursor-pointer ${
                activeSidebarPanel === 'feedback' && sidebarVisible
                  ? isLight
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#094771] text-white'
                  : isLight
                    ? 'hover:bg-[#f0f0f0] text-[#24292f]'
                    : 'hover:bg-[#333333] text-[#cccccc]'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="flex-1">Reviews & Feedback</span>
            </button>

            <button
              type="button"
              data-tour="profile-btn"
              onClick={() => handlePanelClick('profile')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12px] font-medium transition-colors cursor-pointer ${
                activeSidebarPanel === 'profile' && sidebarVisible
                  ? isLight
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#094771] text-white'
                  : isLight
                    ? 'hover:bg-[#f0f0f0] text-[#24292f]'
                    : 'hover:bg-[#333333] text-[#cccccc]'
              }`}
            >
              <UserCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="flex-1">Developer Profile</span>
            </button>

            <button
              type="button"
              data-tour="contact-btn"
              onClick={() => handlePanelClick('contact')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12px] font-medium transition-colors cursor-pointer ${
                activeSidebarPanel === 'contact' && sidebarVisible
                  ? isLight
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#094771] text-white'
                  : isLight
                    ? 'hover:bg-[#f0f0f0] text-[#24292f]'
                    : 'hover:bg-[#333333] text-[#cccccc]'
              }`}
            >
              <Mail className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span className="flex-1">Contact Info</span>
            </button>

            <button
              type="button"
              onClick={() => handlePanelClick('git')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12px] font-medium transition-colors cursor-pointer ${
                activeSidebarPanel === 'git' && sidebarVisible
                  ? isLight
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#094771] text-white'
                  : isLight
                    ? 'hover:bg-[#f0f0f0] text-[#24292f]'
                    : 'hover:bg-[#333333] text-[#cccccc]'
              }`}
            >
              <GitBranch className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="flex-1">Source Control (Git)</span>
            </button>

            <button
              type="button"
              data-tour="settings-btn"
              onClick={() => handlePanelClick('settings')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12px] font-medium transition-colors cursor-pointer ${
                activeSidebarPanel === 'settings' && sidebarVisible
                  ? isLight
                    ? 'bg-[#007acc] text-white'
                    : 'bg-[#094771] text-white'
                  : isLight
                    ? 'hover:bg-[#f0f0f0] text-[#24292f]'
                    : 'hover:bg-[#333333] text-[#cccccc]'
              }`}
            >
              <Settings className="w-4 h-4 text-violet-500 flex-shrink-0" />
              <span className="flex-1">Settings & Themes</span>
            </button>

            <div className={`my-1 border-t ${isLight ? 'border-[#e8e8e8]' : 'border-[#3c3c3c]'}`} />

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setMobileMoreOpen(false);
                toggleCommandPalette();
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12px] font-medium transition-colors cursor-pointer ${
                isLight ? 'hover:bg-[#f0f0f0] text-[#24292f]' : 'hover:bg-[#333333] text-[#cccccc]'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#007acc] flex-shrink-0" />
              <span className="flex-1">Command Palette</span>
            </button>
          </div>
        </div>
      )}

      <div
        className={`flex items-center justify-around border-t flex-shrink-0 z-30 relative select-none transition-colors duration-150 h-[48px] ${
          isLight
            ? 'bg-[#f0f0f0] border-[#d8d8d8] text-[#333333]'
            : 'bg-[#252526] border-[#1e1e1e] text-[#858585]'
        }`}
      >
        <button
          type="button"
          data-tour="explorer-btn"
          onClick={() => handlePanelClick('explorer')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-0 transition-all duration-150 cursor-pointer active:scale-90 ${
            activeSidebarPanel === 'explorer' && sidebarVisible
              ? isLight
                ? 'text-[#0060c0] font-semibold'
                : 'text-white font-semibold'
              : isLight
                ? 'text-[#666666] hover:text-black'
                : 'text-[#858585] hover:text-[#cccccc]'
          }`}
          aria-label="Files"
        >
          <Files className="w-4.5 h-4.5" strokeWidth={activeSidebarPanel === 'explorer' && sidebarVisible ? 2.2 : 1.5} />
          <span className="text-[9.5px] tracking-tight">Files</span>
        </button>

        <button
          type="button"
          data-tour="assistant-btn"
          onClick={() => handlePanelClick('assistant')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-0 transition-all duration-150 cursor-pointer active:scale-90 ${
            activeSidebarPanel === 'assistant' && sidebarVisible
              ? isLight
                ? 'text-[#0060c0] font-semibold'
                : 'text-white font-semibold'
              : isLight
                ? 'text-[#666666] hover:text-black'
                : 'text-[#858585] hover:text-[#cccccc]'
          }`}
          aria-label="AI Copilot"
        >
          <Sparkles className="w-4.5 h-4.5 text-amber-500" strokeWidth={activeSidebarPanel === 'assistant' && sidebarVisible ? 2.2 : 1.5} />
          <span className="text-[9.5px] tracking-tight">AI</span>
        </button>

        <button
          type="button"
          onClick={() => handlePanelClick('search')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-0 transition-all duration-150 cursor-pointer active:scale-90 ${
            activeSidebarPanel === 'search' && sidebarVisible
              ? isLight
                ? 'text-[#0060c0] font-semibold'
                : 'text-white font-semibold'
              : isLight
                ? 'text-[#666666] hover:text-black'
                : 'text-[#858585] hover:text-[#cccccc]'
          }`}
          aria-label="Search"
        >
          <Search className="w-4.5 h-4.5" strokeWidth={activeSidebarPanel === 'search' && sidebarVisible ? 2.2 : 1.5} />
          <span className="text-[9.5px] tracking-tight">Search</span>
        </button>

        <button
          type="button"
          data-tour="terminal-btn"
          onClick={() => {
            playClickSound();
            toggleTerminal();
          }}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-all duration-150 cursor-pointer active:scale-90 ${
            terminalVisible
              ? isLight
                ? 'text-[#0060c0] font-semibold'
                : 'text-white font-semibold'
              : isLight
                ? 'text-[#666666] hover:text-black'
                : 'text-[#858585] hover:text-[#cccccc]'
          }`}
          aria-label="Terminal"
        >
          <TerminalIcon className="w-4.5 h-4.5" strokeWidth={terminalVisible ? 2.2 : 1.5} />
          <span className="text-[9.5px] tracking-tight">Term</span>
        </button>

        <button
          type="button"
          data-tour="more-btn"
          onClick={() => {
            playClickSound();
            setMobileMoreOpen(!mobileMoreOpen);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-all duration-150 cursor-pointer active:scale-90 relative ${
            mobileMoreOpen || isMorePanelActive
              ? isLight
                ? 'text-[#0060c0] font-semibold'
                : 'text-white font-semibold'
              : isLight
                ? 'text-[#666666] hover:text-black'
                : 'text-[#858585] hover:text-[#cccccc]'
          }`}
          aria-label="More options"
        >
          <MoreHorizontal className="w-4.5 h-4.5" strokeWidth={mobileMoreOpen || isMorePanelActive ? 2.2 : 1.5} />
          <span className="text-[9.5px] tracking-tight">More</span>
          {isMorePanelActive && !mobileMoreOpen && (
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#007acc]" />
          )}
        </button>
      </div>
    </>
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
