'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Copy, CheckSquare, WrapText, Hash, Eye, Sparkles,
  Terminal, Sidebar as SidebarIcon, Download, Sun, Moon,
  X, Layers, FolderOpen, Code
} from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { findFileById, fileTree } from '@/data/portfolio-data';
import { playClickSound, playToastSound, playToggleSound } from '@/lib/sound';

type ContextType = 'tab' | 'file' | 'folder' | 'editor' | 'terminal' | 'workspace';

interface MenuState {
  isOpen: boolean;
  x: number;
  y: number;
  type: ContextType;
  targetId: string | null;
}

export default function ContextMenu() {
  const [menu, setMenu] = useState<MenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    type: 'workspace',
    targetId: null,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    activeTabId,
    openTabs,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    openFile,
    toggleFolder,
    theme,
    setTheme,
    wordWrap,
    toggleWordWrap,
    showLineNumbers,
    toggleLineNumbers,
    mdPreviewMode,
    toggleMdPreview,
    terminalVisible,
    toggleTerminal,
    clearTerminal,
    sidebarVisible,
    toggleSidebar,
    setActiveSidebarPanel,
    showToast,
  } = usePortfolioStore();

  const isLight = theme === 'light';

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input') || target.closest('textarea')) {
        return;
      }

      e.preventDefault();

      let type: ContextType = 'workspace';
      let targetId: string | null = null;

      const tabElem = target.closest('[data-tab-id]');
      const fileElem = target.closest('[data-file-id]');
      const folderElem = target.closest('[data-folder-id]');
      const terminalElem = target.closest('[data-terminal]');
      const editorElem = target.closest('.code-editor, pre, code, .syntax-highlighter') || target.closest('#vscode-root .overflow-auto');

      if (tabElem) {
        type = 'tab';
        targetId = tabElem.getAttribute('data-tab-id');
      } else if (fileElem) {
        type = 'file';
        targetId = fileElem.getAttribute('data-file-id');
      } else if (folderElem) {
        type = 'folder';
        targetId = folderElem.getAttribute('data-folder-id');
      } else if (terminalElem) {
        type = 'terminal';
      } else if (editorElem) {
        type = 'editor';
      }

      const menuWidth = 220;
      const menuHeight = 280;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 12);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 12);

      setMenu({
        isOpen: true,
        x: Math.max(12, x),
        y: Math.max(12, y),
        type,
        targetId,
      });
      playClickSound();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu((s) => ({ ...s, isOpen: false }));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu((s) => ({ ...s, isOpen: false }));
    };

    const handleScroll = () => {
      setMenu((s) => ({ ...s, isOpen: false }));
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  if (!menu.isOpen) return null;

  const currentFileId = menu.targetId || activeTabId;
  const targetFile = currentFileId ? findFileById(fileTree, currentFileId) : null;
  const isMarkdown = targetFile?.language === 'markdown';

  const handleCopyCode = () => {
    const selection = window.getSelection()?.toString();
    const textToCopy = selection || targetFile?.content || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      playToastSound();
      showToast(selection ? 'Selected text copied' : 'File content copied');
    }
    setMenu((s) => ({ ...s, isOpen: false }));
  };

  const handleSelectAll = () => {
    const codeContainer = document.querySelector('pre code') || document.querySelector('#vscode-root');
    if (codeContainer) {
      const range = document.createRange();
      range.selectNodeContents(codeContainer);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    setMenu((s) => ({ ...s, isOpen: false }));
  };

  const handleAskAI = () => {
    setActiveSidebarPanel('assistant');
    if (!sidebarVisible) toggleSidebar();
    playClickSound();
    setMenu((s) => ({ ...s, isOpen: false }));
  };

  const handleDownloadFile = () => {
    if (targetFile && targetFile.content) {
      const blob = new Blob([targetFile.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = targetFile.name;
      a.click();
      URL.revokeObjectURL(url);
      playToastSound();
      showToast(`Downloaded ${targetFile.name}`);
    }
    setMenu((s) => ({ ...s, isOpen: false }));
  };

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 min-w-[210px] rounded-lg shadow-2xl py-1 text-[12px] font-sans border backdrop-blur-md animate-scaleIn select-none ${
        isLight
          ? 'bg-white/95 border-[#d0d0d0] text-[#24292f] shadow-black/15'
          : 'bg-[#252526]/95 border-[#454545] text-[#cccccc] shadow-black/60'
      }`}
      style={{ left: `${menu.x}px`, top: `${menu.y}px` }}
    >
      {menu.type === 'tab' && menu.targetId && (
        <>
          <button
            type="button"
            onClick={() => {
              closeTab(menu.targetId!);
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <X className="w-3.5 h-3.5 opacity-80" /> Close
            </span>
            <span className="text-[10px] opacity-60 font-mono">⌘W</span>
          </button>

          {openTabs.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => {
                  closeOtherTabs(menu.targetId!);
                  setMenu((s) => ({ ...s, isOpen: false }));
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 opacity-80" /> Close Others
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeAllTabs();
                  setMenu((s) => ({ ...s, isOpen: false }));
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                  isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <X className="w-3.5 h-3.5 opacity-80" /> Close All
                </span>
              </button>
            </>
          )}

          <div className={`my-1 border-t ${isLight ? 'border-[#e8e8e8]' : 'border-[#3c3c3c]'}`} />

          {targetFile && (
            <button
              type="button"
              onClick={handleDownloadFile}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 opacity-80" /> Download File
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAskAI}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ask AI About File
            </span>
          </button>
        </>
      )}

      {menu.type === 'file' && menu.targetId && (
        <>
          <button
            type="button"
            onClick={() => {
              if (targetFile) openFile(targetFile);
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Code className="w-3.5 h-3.5 opacity-80" /> Open in Editor
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFile}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 opacity-80" /> Download File
            </span>
          </button>

          <div className={`my-1 border-t ${isLight ? 'border-[#e8e8e8]' : 'border-[#3c3c3c]'}`} />

          <button
            type="button"
            onClick={handleAskAI}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ask AI About File
            </span>
          </button>
        </>
      )}

      {menu.type === 'folder' && menu.targetId && (
        <>
          <button
            type="button"
            onClick={() => {
              toggleFolder(menu.targetId!);
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5 opacity-80" /> Toggle Folder
            </span>
          </button>

          <button
            type="button"
            onClick={handleAskAI}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Explain Architecture
            </span>
          </button>
        </>
      )}

      {menu.type === 'editor' && (
        <>
          <button
            type="button"
            onClick={handleCopyCode}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Copy className="w-3.5 h-3.5 opacity-80" /> Copy
            </span>
            <span className="text-[10px] opacity-60 font-mono">⌘C</span>
          </button>

          <button
            type="button"
            onClick={handleSelectAll}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5 opacity-80" /> Select All
            </span>
            <span className="text-[10px] opacity-60 font-mono">⌘A</span>
          </button>

          <div className={`my-1 border-t ${isLight ? 'border-[#e8e8e8]' : 'border-[#3c3c3c]'}`} />

          <button
            type="button"
            onClick={() => {
              toggleWordWrap();
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <WrapText className="w-3.5 h-3.5 opacity-80" /> Word Wrap: {wordWrap ? 'On' : 'Off'}
            </span>
            <span className="text-[10px] opacity-60 font-mono">⌥Z</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleLineNumbers();
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 opacity-80" /> Line Numbers: {showLineNumbers ? 'On' : 'Off'}
            </span>
          </button>

          {isMarkdown && (
            <button
              type="button"
              onClick={() => {
                toggleMdPreview();
                setMenu((s) => ({ ...s, isOpen: false }));
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 opacity-80" /> {mdPreviewMode ? 'Show Source' : 'Open Preview'}
              </span>
              <span className="text-[10px] opacity-60 font-mono">⌘⇧V</span>
            </button>
          )}

          <div className={`my-1 border-t ${isLight ? 'border-[#e8e8e8]' : 'border-[#3c3c3c]'}`} />

          <button
            type="button"
            onClick={handleAskAI}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ask AI About Code
            </span>
            <span className="text-[10px] opacity-60 font-mono">⌘I</span>
          </button>

          {targetFile && (
            <button
              type="button"
              onClick={handleDownloadFile}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
                isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 opacity-80" /> Download File
              </span>
            </button>
          )}
        </>
      )}

      {menu.type === 'terminal' && (
        <>
          <button
            type="button"
            onClick={() => {
              clearTerminal();
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 opacity-80" /> Clear Terminal
            </span>
            <span className="text-[10px] opacity-60 font-mono">Ctrl+L</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleTerminal();
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <X className="w-3.5 h-3.5 opacity-80" /> Hide Terminal
            </span>
            <span className="text-[10px] opacity-60 font-mono">Ctrl+`</span>
          </button>
        </>
      )}

      {menu.type === 'workspace' && (
        <>
          <button
            type="button"
            onClick={() => {
              toggleTerminal();
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 opacity-80" /> Toggle Terminal
            </span>
            <span className="text-[10px] opacity-60 font-mono">Ctrl+`</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleSidebar();
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <SidebarIcon className="w-3.5 h-3.5 opacity-80" /> Toggle Primary Bar
            </span>
            <span className="text-[10px] opacity-60 font-mono">⌘B</span>
          </button>

          <div className={`my-1 border-t ${isLight ? 'border-[#e8e8e8]' : 'border-[#3c3c3c]'}`} />

          <button
            type="button"
            onClick={() => {
              playToggleSound();
              setTheme(theme === 'dark' ? 'light' : 'dark');
              setMenu((s) => ({ ...s, isOpen: false }));
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleAskAI}
            className={`w-full flex items-center justify-between px-3 py-1.5 transition-colors cursor-pointer ${
              isLight ? 'hover:bg-[#007acc] hover:text-white' : 'hover:bg-[#094771] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ask AI Assistant
            </span>
          </button>
        </>
      )}
    </div>
  );
}
