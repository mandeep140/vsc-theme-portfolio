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
  const { commandPaletteOpen, setCommandPaletteOpen, openFile, toggleSidebar, toggleTerminal, toggleMdPreview, setActiveTabId, clearTerminal } = usePortfolioStore();
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

  const commands: CommandItem[] = useMemo(() => [
    { label: 'Toggle Sidebar', description: 'Ctrl+B', action: toggleSidebar, category: 'command' },
    { label: 'Ask AI Copilot (Gemini)', description: 'Chat with Mandeep\'s AI assistant', action: () => usePortfolioStore.getState().setActiveSidebarPanel('assistant'), category: 'command' },
    { label: 'Toggle Terminal', description: 'Ctrl+`', action: toggleTerminal, category: 'command' },
    { label: 'Toggle Markdown Preview', description: 'Ctrl+Shift+V', action: toggleMdPreview, category: 'command' },
    { label: 'Clear Terminal', description: '', action: clearTerminal, category: 'command' },
    { label: 'Welcome Screen', description: '', action: () => setActiveTabId(null), category: 'view' },
    ...allFiles.map(f => ({
      label: f.name,
      description: f.path.join(' / '),
      action: () => {
        const fileNode = findNodeById(fileTree, f.id);
        if (fileNode) openFile(fileNode);
      },
      category: 'file' as const,
    })),
  ], [allFiles, toggleSidebar, toggleTerminal, toggleMdPreview, clearTerminal, setActiveTabId, openFile]);

  const filteredItems = query
    ? commands.filter(c =>
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
      setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
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
    <div className="fixed inset-0 z-[200] flex justify-center pt-[15%]">
      <div
        className="absolute inset-0"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div className="relative w-[90vw] max-w-[600px] bg-[#252526] border border-[#454545] rounded-lg shadow-2xl overflow-hidden animate-paletteIn">
        <div className="flex items-center px-3 py-2 border-b border-[#3c3c3c]">
          <span className="text-[#858585] mr-2 text-sm">
            {query.startsWith('>') ? '' : query ? '' : '>'}
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or file name..."
            className="flex-1 bg-transparent border-none outline-none text-[#cccccc] text-[14px] placeholder:text-[#858585]"
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <div
          ref={listRef}
          className="max-h-[300px] overflow-y-auto py-1"
        >
          {filteredItems.length === 0 && (
            <div className="px-3 py-2 text-[#858585] text-sm">No results found</div>
          )}
          {filteredItems.map((item, i) => (
            <button
              key={`${item.category}-${item.label}-${i}`}
              onClick={() => { item.action(); setCommandPaletteOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors ${
                i === selectedIndex
                  ? 'bg-[#094771] text-white'
                  : 'text-[#cccccc] hover:bg-[#2a2d2e]'
              }`}
            >
              {item.category === 'file' && (
                <span className="text-[#519aba] text-[10px] font-bold w-4 text-center flex-shrink-0">
                  {item.label.endsWith('.tsx') ? 'TSX' : item.label.endsWith('.ts') ? 'TS' : item.label.endsWith('.md') ? 'MD' : 'F'}
                </span>
              )}
              {item.category === 'command' && (
                <span className="text-[#dcdcaa] text-[10px] w-4 text-center flex-shrink-0">{'>'}</span>
              )}
              {item.category === 'view' && (
                <span className="text-[#4ec9b0] text-[10px] w-4 text-center flex-shrink-0">~</span>
              )}
              <span className="truncate flex-1">{item.label}</span>
              {item.description && (
                <span className={`text-[11px] flex-shrink-0 ${
                  i === selectedIndex ? 'text-[#858585]' : 'text-[#666]'
                }`}>{item.description}</span>
              )}
            </button>
          ))}
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