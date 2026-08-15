'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { X, Plus, Minus, Maximize2, Trash2 } from 'lucide-react';

const AVAILABLE_COMMANDS = [
  'help', 'ls', 'cat', 'open', 'clear', 'whoami', 'skills',
  'projects', 'contact', 'experience', 'neofetch', 'date', 'echo',
  'pwd', 'cd', 'sudo', 'npm', 'git', 'uname', 'rm', 'tree', 'history',
];

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
  } = usePortfolioStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isResizing = useRef(false);
  const resizeStartY = useRef(0);
  const resizeStartH = useRef(0);

  // Compute inline ghost text: the suffix of the top matching command
  const currentInputTrimmed = terminalInput.trim().toLowerCase();
  const suggestions = currentInputTrimmed.length > 0
    ? AVAILABLE_COMMANDS.filter(c => c.startsWith(currentInputTrimmed))
    : [];
  const topSuggestion = suggestions[0] ?? '';
  // Ghost text is the remainder after what the user typed (case-sensitive match from lower)
  const ghostSuffix = topSuggestion && terminalInput.length > 0
    ? topSuggestion.slice(terminalInput.trim().length)
    : '';

  // Auto-scroll on new output
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [terminalHistory]);

  // Focus input when terminal becomes visible
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

    // If there's a ghost suggestion and the user hasn't fully typed it, accept top suggestion on Enter
    const cmdToRun = topSuggestion && val === topSuggestion.slice(0, val.length)
      ? (ghostSuffix ? topSuggestion : val)
      : val;

    setCommandHistory((prev) => [cmdToRun, ...prev]);
    setHistoryIndex(-1);
    executeCommand(cmdToRun);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab: accept ghost text completion
    if (e.key === 'Tab') {
      e.preventDefault();
      if (topSuggestion) {
        setTerminalInput(topSuggestion + ' ');
      }
      return;
    }

    // Right arrow at end of input: accept ghost text
    if (e.key === 'ArrowRight') {
      const input = inputRef.current;
      if (input && ghostSuffix && input.selectionStart === terminalInput.length) {
        e.preventDefault();
        setTerminalInput(topSuggestion + ' ');
        return;
      }
    }

    // Esc: clear input
    if (e.key === 'Escape') {
      e.preventDefault();
      setTerminalInput('');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIndex);
      if (commandHistory[nextIndex]) {
        setTerminalInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      if (nextIndex === -1) {
        setTerminalInput('');
      } else if (commandHistory[nextIndex]) {
        setTerminalInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      usePortfolioStore.getState().clearTerminal();
    }
  };

  // Resize handle (top of terminal)
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    resizeStartY.current = e.clientY;
    resizeStartH.current = terminalHeight;

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const diff = resizeStartY.current - ev.clientY;
      setTerminalHeight(resizeStartH.current + diff);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [terminalHeight, setTerminalHeight]);

  const handleTabClick = (tabName: string) => {
    showToast(`"${tabName}" panel is under construction`);
  };

  return (
    <div
      className={`flex flex-col bg-[#1e1e1e] flex-shrink-0 overflow-hidden ${terminalVisible
        ? 'border-t border-[#252526]'
        : ''
        }`}
      style={{
        height: terminalVisible ? (isMobile ? '200px' : terminalHeight) : 0,
        transition: 'height 180ms ease-in-out',
        willChange: 'height',
      }}
    >
      {!isMobile && terminalVisible && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="h-[4px] cursor-ns-resize hover:bg-[#007fd4] active:bg-[#007fd4] transition-colors flex-shrink-0"
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Terminal header with tabs */}
      <div className="flex items-center h-[35px] bg-[#252526] border-b border-[#1e1e1e] flex-shrink-0 min-w-0">
        <div className="flex items-center px-1 md:px-2 gap-0 md:gap-1 overflow-x-auto scrollbar-hide">
          <span
            onClick={() => handleTabClick('PROBLEMS')}
            className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 text-[11px] md:text-[12px] text-[#858585] hover:text-[#cccccc] cursor-pointer whitespace-nowrap"
          >
            PROBLEMS
          </span>
          <span
            onClick={() => handleTabClick('OUTPUT')}
            className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 text-[11px] md:text-[12px] text-[#858585] hover:text-[#cccccc] cursor-pointer whitespace-nowrap"
          >
            OUTPUT
          </span>
          <span
            onClick={() => handleTabClick('DEBUG CONSOLE')}
            className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 text-[11px] md:text-[12px] text-[#858585] hover:text-[#cccccc] cursor-pointer whitespace-nowrap"
          >
            DEBUG CONSOLE
          </span>
          <span className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 bg-[#1e1e1e] rounded-sm border-t border-[#007fd4] text-[11px] md:text-[12px] text-[#cccccc] whitespace-nowrap">
            TERMINAL
          </span>
        </div>
        <div className="ml-auto flex items-center gap-0.5 md:gap-1 px-1 md:px-2 flex-shrink-0">
          <button
            onClick={() => showToast('Multiple terminals are not available in this environment')}
            className="p-1 text-[#858585] hover:text-[#cccccc] rounded hover:bg-[#505050] hidden md:block"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => showToast('Split terminal is not available in this environment')}
            className="p-1 text-[#858585] hover:text-[#cccccc] rounded hover:bg-[#505050] hidden md:block"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => showToast('Maximize is not available in this environment')}
            className="p-1 text-[#858585] hover:text-[#cccccc] rounded hover:bg-[#505050] hidden md:block"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => usePortfolioStore.getState().clearTerminal()}
            className="p-1 text-[#858585] hover:text-[#cccccc] rounded hover:bg-[#505050] hidden md:block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleTerminal}
            className="p-1 text-[#858585] hover:text-[#cccccc] rounded hover:bg-[#505050]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 md:px-4 py-2 font-mono text-[12px] md:text-[13px] leading-[20px] min-h-0"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalHistory.map((line, i) => (
          <div key={i} className="min-h-[20px]">
            {line.type === 'input' ? (
              <span>
                <span className="text-[#6a9955]">{line.content.split(' $ ')[0]} $ </span>
                <span className="text-[#cccccc]">{line.content.split(' $ ')[1]}</span>
              </span>
            ) : line.type === 'error' ? (
              <span className="text-[#f44747]">{line.content}</span>
            ) : line.type === 'command' ? (
              <span className="text-[#dcdcaa]">{line.content}</span>
            ) : line.type === 'success' ? (
              <span className="text-[#4ec9b0]">{line.content}</span>
            ) : line.type === 'info' ? (
              <span className="text-[#3794ff]">{line.content}</span>
            ) : line.type === 'warning' ? (
              <span className="text-[#cca700]">{line.content}</span>
            ) : line.type === 'dim' ? (
              <span className="text-[#6a6a6a]">{line.content}</span>
            ) : line.type === 'highlight' ? (
              <span className="text-[#dcdcaa] font-semibold">{line.content}</span>
            ) : (
              <span className="text-[#cccccc] whitespace-pre">{line.content}</span>
            )}
          </div>
        ))}

        {/* Input line with inline ghost text */}
        <div className="flex items-center">
          <span className="text-[#6a9955] whitespace-pre flex-shrink-0">{currentDir} $ </span>
          <div className="relative flex-1 min-w-0 flex items-center">
            {/* Ghost text overlay - sits behind the input visually */}
            {ghostSuffix && (
              <div
                className="absolute inset-0 pointer-events-none font-mono text-[12px] md:text-[13px] flex items-center overflow-hidden"
                aria-hidden="true"
              >
                {/* Transparent spacer matching typed input so ghost text starts at cursor */}
                <span style={{ color: 'transparent', whiteSpace: 'pre' }}>{terminalInput}</span>
                <span className="text-[#555555]">{ghostSuffix}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex-1 min-w-0">
              <input
                ref={inputRef}
                value={terminalInput}
                onChange={(e) => {
                  setTerminalInput(e.target.value);
                  setHistoryIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-[#cccccc] font-mono text-[12px] md:text-[13px] caret-[#aeafad] min-w-0"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                style={{ caretColor: '#aeafad' }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}