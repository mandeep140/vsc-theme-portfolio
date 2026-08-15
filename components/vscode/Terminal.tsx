'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { X, Plus, Minus, Maximize2, Trash2 } from 'lucide-react';

const BASE_COMMANDS = [
  'help',
  'npm run dev',
  'git log',
  'git status',
  'sudo hire me',
  'clear',
  'whoami',
  'skills',
  'projects',
  'contact',
  'experience',
  'neofetch',
  'date',
  'pwd',
  'tree',
  'history',
  'uname -a',
  'rm -rf /',
  'cat',
  'open',
  'ls',
  'cd',
  'echo',
];

const FOLDER_NAMES = ['projects', 'experience', 'education', 'images', 'src', '~', '..'];

const FILE_NAMES = [
  'index.ts',
  'skills.ts',
  'contact.ts',
  'README.md',
  'adjmd.tsx',
  'showa-track.ts',
  'showa-store-management.ts',
  'vscode-portfolio.tsx',
  'cto-showa.ts',
  'freelance-quick-venu.ts',
  'stc-member.ts',
  'iit-patna-bs.ts',
  'senior-secondary.ts',
  'white_logo.png',
];

function getContextualSuggestions(input: string): string[] {
  const lower = input.toLowerCase();
  if (!lower) return [];

  // "cd <dir>"
  if (lower === 'cd' || lower.startsWith('cd ')) {
    const after = lower.startsWith('cd ') ? lower.slice(3).trim() : '';
    const matches = FOLDER_NAMES.filter((d) => d.toLowerCase().startsWith(after));
    if (matches.length > 0) {
      return matches.map((d) => `cd ${d}`);
    }
  }

  // "cat <file>" or "open <file>"
  if (lower.startsWith('cat ') || lower.startsWith('open ')) {
    const prefix = lower.startsWith('open ') ? 'open' : 'cat';
    const after = lower.slice(prefix.length + 1).trim();
    const matches = FILE_NAMES.filter((f) => f.toLowerCase().startsWith(after));
    if (matches.length > 0) {
      return matches.map((f) => `${prefix} ${f}`);
    }
  }

  // "ls <dir>"
  if (lower.startsWith('ls ')) {
    const after = lower.slice(3).trim();
    const matches = FOLDER_NAMES.filter(
      (d) => d.toLowerCase().startsWith(after) && !['~', '..'].includes(d)
    );
    if (matches.length > 0) {
      return matches.map((d) => `ls ${d}`);
    }
  }

  // Multi-word and base command matching
  return BASE_COMMANDS.filter(
    (cmd) => cmd.toLowerCase().startsWith(lower) && cmd.toLowerCase() !== lower
  );
}

export default function Terminal() {
  const {
    terminalHistory,
    terminalInput,
    setTerminalInput,
    executeCommand,
    terminalVisible,
    toggleTerminal,
    terminalHeight,
    setTerminalHeight,
    isMobile,
    currentDir,
    showToast,
    theme,
  } = usePortfolioStore();

  const isLight = theme === 'light';
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

  const isResizing = useRef(false);
  const resizeStartY = useRef(0);
  const resizeStartH = useRef(0);

  // Compute ghost suggestion
  const suggestions = dismissedSuggestion ? [] : getContextualSuggestions(terminalInput);
  const topSuggestion = suggestions[0] ?? '';

  // Ghost suffix calculation using exact character position
  const ghostSuffix =
    topSuggestion && terminalInput.length > 0 && topSuggestion.toLowerCase().startsWith(terminalInput.toLowerCase())
      ? topSuggestion.slice(terminalInput.length)
      : '';

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [terminalHistory]);

  // Focus on visible
  useEffect(() => {
    if (terminalVisible && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [terminalVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = terminalInput.trim();
    if (!val) return;

    // If user presses enter on partial input with top suggestion active, complete it
    const finalCmd =
      topSuggestion && val.toLowerCase() === topSuggestion.slice(0, val.length).toLowerCase() && ghostSuffix
        ? topSuggestion
        : val;

    setCommandHistory((prev) => [finalCmd, ...prev]);
    setHistoryIndex(-1);
    setDismissedSuggestion(false);
    executeCommand(finalCmd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab: accept full suggestion
    if (e.key === 'Tab') {
      e.preventDefault();
      if (topSuggestion) {
        setTerminalInput(topSuggestion);
        setDismissedSuggestion(false);
      }
      return;
    }

    // ArrowRight at end of input: accept ghost text
    if (e.key === 'ArrowRight') {
      const inp = inputRef.current;
      if (inp && ghostSuffix && inp.selectionStart === terminalInput.length) {
        e.preventDefault();
        setTerminalInput(topSuggestion);
        setDismissedSuggestion(false);
        return;
      }
    }

    // Escape: dismiss suggestion ONLY (do NOT erase typed text)
    if (e.key === 'Escape') {
      e.stopPropagation();
      setDismissedSuggestion(true);
      return;
    }

    // History navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(next);
      if (commandHistory[next]) {
        setTerminalInput(commandHistory[next]);
        setDismissedSuggestion(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setTerminalInput(next === -1 ? '' : commandHistory[next] ?? '');
      setDismissedSuggestion(false);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      usePortfolioStore.getState().clearTerminal();
    }
  };

  // Resize handler with mouse & touch support
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      isResizing.current = true;

      const getY = (ev: MouseEvent | TouchEvent) =>
        'touches' in ev ? ev.touches[0].clientY : (ev as MouseEvent).clientY;

      const startY =
        'touches' in e.nativeEvent
          ? (e.nativeEvent as TouchEvent).touches[0].clientY
          : (e.nativeEvent as MouseEvent).clientY;

      resizeStartY.current = startY;
      resizeStartH.current = terminalHeight;

      const handleMove = (ev: MouseEvent | TouchEvent) => {
        if (!isResizing.current) return;
        const diff = resizeStartY.current - getY(ev);
        setTerminalHeight(resizeStartH.current + diff);
      };

      const handleUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleUp);
    },
    [terminalHeight, setTerminalHeight]
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col flex-shrink-0 overflow-hidden transition-colors duration-150 ${
        isLight ? 'bg-white' : 'bg-[#1e1e1e]'
      }`}
      style={{
        height: terminalVisible ? (isMobile ? '210px' : `${terminalHeight}px`) : 0,
        borderTop: terminalVisible
          ? isLight
            ? '1px solid #e4e4e4'
            : '1px solid #252526'
          : 'none',
        transition: 'height 200ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease',
        willChange: 'height',
        opacity: terminalVisible ? 1 : 0,
      }}
    >
      {/* Top resize handle */}
      {!isMobile && terminalVisible && (
        <div
          onMouseDown={handleResizeMouseDown}
          onTouchStart={handleResizeMouseDown}
          className="h-[4px] flex-shrink-0 cursor-ns-resize hover:bg-[#007fd4] active:bg-[#007fd4] transition-colors"
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Terminal Tab Bar */}
      <div
        className={`flex items-center h-[35px] border-b flex-shrink-0 min-w-0 transition-colors duration-150 ${
          isLight ? 'bg-[#f3f3f3] border-[#e4e4e4]' : 'bg-[#252526] border-[#1e1e1e]'
        }`}
      >
        <div className="flex items-center px-1 md:px-2 overflow-x-auto scrollbar-hide">
          {(['PROBLEMS', 'OUTPUT', 'DEBUG CONSOLE'] as const).map((tab) => (
            <span
              key={tab}
              onClick={() => showToast(`${tab} panel is under construction`)}
              className={`flex items-center px-2 py-0.5 text-[11px] md:text-[12px] cursor-pointer whitespace-nowrap h-[35px] transition-colors ${
                isLight ? 'text-[#6e7781] hover:text-[#111111]' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
            >
              {tab}
            </span>
          ))}
          <span
            className={`flex items-center px-2.5 py-0.5 text-[11px] md:text-[12px] whitespace-nowrap h-[35px] font-medium border-t-[2px] ${
              isLight
                ? 'bg-white border-t-[#007acc] text-[#111111]'
                : 'bg-[#1e1e1e] border-t-[#007fd4] text-[#cccccc]'
            }`}
          >
            TERMINAL
          </span>
        </div>

        {/* Terminal Header Action Buttons */}
        <div className="ml-auto flex items-center gap-0.5 px-1 md:px-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => showToast('Single terminal instance is active.')}
            className={`p-1 rounded transition-colors hidden md:block ${
              isLight ? 'text-[#6e7781] hover:bg-[#e0e0e0] hover:text-black' : 'text-[#858585] hover:bg-[#505050] hover:text-white'
            }`}
            title="New Terminal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => showToast('Split terminal is not available in viewer mode.')}
            className={`p-1 rounded transition-colors hidden md:block ${
              isLight ? 'text-[#6e7781] hover:bg-[#e0e0e0] hover:text-black' : 'text-[#858585] hover:bg-[#505050] hover:text-white'
            }`}
            title="Split Terminal"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => showToast('Terminal viewport maximized to full width.')}
            className={`p-1 rounded transition-colors hidden md:block ${
              isLight ? 'text-[#6e7781] hover:bg-[#e0e0e0] hover:text-black' : 'text-[#858585] hover:bg-[#505050] hover:text-white'
            }`}
            title="Maximize Terminal"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => usePortfolioStore.getState().clearTerminal()}
            className={`p-1 rounded transition-colors hidden md:block ${
              isLight ? 'text-[#6e7781] hover:bg-[#e0e0e0] hover:text-black' : 'text-[#858585] hover:bg-[#505050] hover:text-white'
            }`}
            title="Clear Terminal (Ctrl+L)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleTerminal}
            className={`p-1 rounded transition-colors ${
              isLight ? 'text-[#6e7781] hover:bg-[#e0e0e0] hover:text-black' : 'text-[#858585] hover:bg-[#505050] hover:text-white'
            }`}
            title="Close Terminal (Ctrl+`)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Screen Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 md:px-4 py-2 font-mono text-[12px] md:text-[13px] leading-[20px] min-h-0"
        style={{ scrollbarWidth: 'thin' }}
        onClick={() => inputRef.current?.focus()}
      >
        {terminalHistory.map((line, i) => (
          <div key={i} className="min-h-[20px]">
            {line.type === 'input' ? (
              <span>
                <span className={isLight ? 'text-[#008000] font-semibold' : 'text-[#6a9955]'}>
                  {line.content.split(' $ ')[0]} $
                </span>{' '}
                <span className={isLight ? 'text-[#24292f] font-medium' : 'text-[#cccccc]'}>
                  {line.content.split(' $ ').slice(1).join(' $ ')}
                </span>
              </span>
            ) : line.type === 'error' ? (
              <span className="text-[#e51400] font-medium">{line.content}</span>
            ) : line.type === 'command' ? (
              <span className={isLight ? 'text-[#795e26]' : 'text-[#dcdcaa]'}>{line.content}</span>
            ) : line.type === 'success' ? (
              <span className={isLight ? 'text-[#098658] font-medium' : 'text-[#4ec9b0]'}>
                {line.content}
              </span>
            ) : line.type === 'info' ? (
              <span className={isLight ? 'text-[#005fb8]' : 'text-[#3794ff]'}>{line.content}</span>
            ) : line.type === 'warning' ? (
              <span className={isLight ? 'text-[#b07d00]' : 'text-[#cca700]'}>{line.content}</span>
            ) : line.type === 'dim' ? (
              <span className={isLight ? 'text-[#888888]' : 'text-[#6a6a6a]'}>{line.content}</span>
            ) : line.type === 'highlight' ? (
              <span className={isLight ? 'text-[#005fb8] font-bold' : 'text-[#dcdcaa] font-semibold'}>
                {line.content}
              </span>
            ) : (
              <span className={isLight ? 'text-[#24292f] whitespace-pre' : 'text-[#cccccc] whitespace-pre'}>
                {line.content}
              </span>
            )}
          </div>
        ))}

        {/* Input line with inline Ghost text */}
        <div className="flex items-center min-h-[20px]">
          <span
            className={`whitespace-pre flex-shrink-0 select-none ${
              isLight ? 'text-[#008000] font-semibold' : 'text-[#6a9955]'
            }`}
          >
            {currentDir} $
          </span>{' '}
          <div className="relative flex-1 min-w-0 ml-1.5 flex items-center">
            {/* Inline Ghost overlay */}
            {ghostSuffix && (
              <div
                className="absolute inset-0 pointer-events-none font-mono text-[12px] md:text-[13px] leading-[20px] flex items-center overflow-hidden"
                aria-hidden="true"
              >
                <span style={{ color: 'transparent', whiteSpace: 'pre' }}>{terminalInput}</span>
                <span className={isLight ? 'text-[#9e9e9e]' : 'text-[#555555]'}>{ghostSuffix}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-full">
              <input
                ref={inputRef}
                value={terminalInput}
                onChange={(e) => {
                  setTerminalInput(e.target.value);
                  setHistoryIndex(-1);
                  setDismissedSuggestion(false);
                }}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent border-none outline-none font-mono text-[12px] md:text-[13px] leading-[20px] ${
                  isLight ? 'text-[#24292f] caret-[#24292f]' : 'text-[#cccccc] caret-white'
                }`}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}