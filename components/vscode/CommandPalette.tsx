'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { fileTree } from '@/data/portfolio-data';

interface CommandItem {
  label: string;
  description?: string;
  action: () => void;
  category: 'command' | 'file' | 'view';
}

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    openFile,
    toggleSidebar,
    toggleTerminal,
    toggleMdPreview,
    setActiveTabId,
    clearTerminal,
    theme,
  } = usePortfolioStore();
  const isLight = theme === 'light';

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allFiles = useMemo(() => {
    const files: { name: string; id: string; path: string[] }[] = [];
    const traverse = (nodes: typeof fileTree, path: string[] = []) => {
      for (const node of nodes) {
        const currentPath = [...path, node.name];
        if (node.type === 'file') {
          files.push({ name: node.name, id: node.id, path: currentPath });
        }
        if (node.children) traverse(node.children, currentPath);
      }
    };
    traverse(fileTree);
    return files;
  }, []);

  const commands: CommandItem[] = useMemo(
    () => [
      { label: 'Toggle Sidebar', description: 'Ctrl+B', action: toggleSidebar, category: 'command' },
      {
        label: 'Ask AI Copilot (Gemini)',
        description: "Chat with Mandeep's AI assistant",
        action: () => usePortfolioStore.getState().setActiveSidebarPanel('assistant'),
        category: 'command',
      },
      { label: 'Toggle Terminal', description: 'Ctrl+`', action: toggleTerminal, category: 'command' },
      { label: 'Toggle Markdown Preview', description: 'Ctrl+Shift+V', action: toggleMdPreview, category: 'command' },
      {
        label: 'Reviews & Feedback',
        description: 'Read and submit portfolio testimonials',
        action: () => usePortfolioStore.getState().setActiveSidebarPanel('feedback'),
        category: 'command',
      },
      { label: 'Welcome Screen', description: '', action: () => setActiveTabId(null), category: 'view' },
      ...allFiles.map((f) => ({
        label: f.name,
        description: f.path.join(' / '),
        action: () => {
          const fileNode = findNodeById(fileTree, f.id);
          if (fileNode) openFile(fileNode);
        },
        category: 'file' as const,
      })),
    ],
    [allFiles, toggleSidebar, toggleTerminal, toggleMdPreview, clearTerminal, setActiveTabId, openFile]
  );

  const filteredItems = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          (c.description && c.description.toLowerCase().includes(query.toLowerCase()))
      )
    : commands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.children[selectedIndex] as HTMLElement;
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setCommandPaletteOpen(false);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-center items-start pt-[10%] md:pt-[70px] px-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div
        className={`relative w-full max-w-[580px] rounded-lg shadow-2xl overflow-hidden border animate-paletteIn flex flex-col max-h-[420px] ${
          isLight
            ? 'bg-white border-[#d0d0d0] text-[#24292f] shadow-black/20'
            : 'bg-[#252526] border-[#454545] text-[#cccccc] shadow-black/60'
        }`}
      >
        <div
          className={`flex items-center px-3 py-2.5 border-b flex-shrink-0 ${
            isLight ? 'border-[#e4e4e4] bg-[#fafafa]' : 'border-[#3c3c3c] bg-[#1e1e1e]'
          }`}
        >
          <span className={`mr-2 text-sm font-mono ${isLight ? 'text-[#007acc]' : 'text-[#007fd4]'}`}>
            {query.startsWith('>') ? '' : query ? '' : '>'}
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search files..."
            className={`flex-1 bg-transparent border-none outline-none text-[13px] font-sans ${
              isLight
                ? 'text-[#24292f] placeholder:text-[#999999]'
                : 'text-[#cccccc] placeholder:text-[#858585]'
            }`}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <div
          ref={listRef}
          className="overflow-y-auto py-1 flex-1 min-h-0"
        >
          {filteredItems.length === 0 && (
            <div className={`px-4 py-3 text-sm text-center ${isLight ? 'text-[#888888]' : 'text-[#858585]'}`}>
              No matching commands or files
            </div>
          )}
          {filteredItems.map((item, i) => {
            const isSelected = i === selectedIndex;
            return (
              <button
                key={`${item.category}-${item.label}-${i}`}
                type="button"
                onClick={() => {
                  item.action();
                  setCommandPaletteOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-[12.5px] transition-colors cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-[#007acc] text-white'
                      : 'bg-[#094771] text-white'
                    : isLight
                      ? 'text-[#24292f] hover:bg-[#f2f2f2]'
                      : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                }`}
              >
                {item.category === 'file' && (
                  <span
                    className={`text-[10px] font-bold w-4 text-center flex-shrink-0 ${
                      isSelected
                        ? 'text-white'
                        : item.label.endsWith('.tsx') || item.label.endsWith('.ts')
                          ? 'text-[#519aba]'
                          : item.label.endsWith('.md')
                            ? 'text-[#4ec9b0]'
                            : 'text-[#a074c4]'
                    }`}
                  >
                    {item.label.endsWith('.tsx')
                      ? 'TSX'
                      : item.label.endsWith('.ts')
                        ? 'TS'
                        : item.label.endsWith('.md')
                          ? 'MD'
                          : 'F'}
                  </span>
                )}
                {item.category === 'command' && (
                  <span
                    className={`text-[11px] w-4 text-center font-mono flex-shrink-0 ${
                      isSelected ? 'text-white' : 'text-[#dcdcaa]'
                    }`}
                  >
                    {'>'}
                  </span>
                )}
                {item.category === 'view' && (
                  <span
                    className={`text-[11px] w-4 text-center font-mono flex-shrink-0 ${
                      isSelected ? 'text-white' : 'text-[#4ec9b0]'
                    }`}
                  >
                    ~
                  </span>
                )}
                <span className="truncate flex-1 font-medium">{item.label}</span>
                {item.description && (
                  <span
                    className={`text-[11px] flex-shrink-0 ${
                      isSelected
                        ? 'text-white/80'
                        : isLight
                          ? 'text-[#777777]'
                          : 'text-[#858585]'
                    }`}
                  >
                    {item.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function findNodeById(nodes: typeof fileTree, id: string): (typeof fileTree)[0] | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children as typeof fileTree, id);
      if (found) return found;
    }
  }
  return null;
}