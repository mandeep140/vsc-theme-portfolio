'use client';

import { useState, useRef, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';

type MenuItemBase = {
  label: string;
  action?: () => void;
  shortcut?: string;
};

type DividerItem = {
  divider: true;
  label?: never;
  action?: never;
  shortcut?: never;
};

type MenuItem = MenuItemBase | DividerItem;

function MenuDropdown({ items, onClose }: { items: MenuItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const showToast = usePortfolioStore((s) => s.showToast);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="fixed bg-[#3c3c3c] border border-[#505050] rounded shadow-2xl py-1 min-w-[240px] z-[200]"
      style={{ top: 'inherit', left: 'inherit' }}
    >
      {items.map((item, i) =>
        'divider' in item && item.divider ? (
          <div key={i} className="h-px bg-[#505050] my-1" />
        ) : (
          <button
            key={i}
            onClick={() => {
              if ('action' in item && item.action) {
                item.action();
              } else {
                showToast(`${(item as MenuItemBase).label} is under construction`);
              }
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-[5px] text-[13px] text-[#cccccc] hover:bg-[#094771] hover:text-white text-left transition-colors"
          >
            <span>{'label' in item ? item.label : ''}</span>
            {'shortcut' in item && item.shortcut && (
              <span className="text-[#858585] text-[11px] ml-6">{item.shortcut}</span>
            )}
          </button>
        )
      )}
    </div>
  );
}

export default function TitleBar() {
  const {
    activeTabId, openTabs, toggleSidebar, toggleTerminal, toggleMdPreview,
    executeCommand, toggleCommandPalette, setActiveTabId, showToast,
    editorFontSize, setEditorFontSize, setActiveSidebarPanel,
  } = usePortfolioStore();
  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const displayName = activeTab ? `${activeTab.name} -- ` : '';
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleMenuOpen = (name: string) => {
    if (openMenu === name) {
      setOpenMenu(null);
      return;
    }
    const el = menuRefs.current[name];
    if (el) {
      const rect = el.getBoundingClientRect();
      setMenuPos({ top: rect.bottom, left: rect.left });
    }
    setOpenMenu(name);
  };

  const menus: Record<string, MenuItem[]> = {
    File: [
      { label: 'New File', shortcut: 'Ctrl+N' },
      { label: 'Open File...', shortcut: 'Ctrl+O' },
      { divider: true },
      { label: 'Save', shortcut: 'Ctrl+S', action: () => showToast('File is read-only in this portfolio') },
      { label: 'Save All', shortcut: 'Ctrl+Shift+S', action: () => showToast('Files are read-only in this portfolio') },
      { divider: true },
      {
        label: 'Close Editor', shortcut: 'Ctrl+W',
        action: () => { if (activeTabId) usePortfolioStore.getState().closeTab(activeTabId); }
      },
      {
        label: 'Close All',
        action: () => {
          const tabs = usePortfolioStore.getState().openTabs;
          tabs.forEach(t => usePortfolioStore.getState().closeTab(t.id));
        }
      },
    ],
    Edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Shift+Z' },
      { divider: true },
      { label: 'Cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', shortcut: 'Ctrl+V' },
      { divider: true },
      { label: 'Find', shortcut: 'Ctrl+F' },
      { label: 'Replace', shortcut: 'Ctrl+H' },
    ],
    Selection: [
      { label: 'Select All', shortcut: 'Ctrl+A' },
      { label: 'Expand Selection', shortcut: 'Shift+Alt+Right' },
      { label: 'Shrink Selection', shortcut: 'Shift+Alt+Left' },
      { divider: true },
      { label: 'Copy Line Up', shortcut: 'Shift+Alt+Up' },
      { label: 'Copy Line Down', shortcut: 'Shift+Alt+Down' },
      { label: 'Move Line Up', shortcut: 'Alt+Up' },
      { label: 'Move Line Down', shortcut: 'Alt+Down' },
    ],
    View: [
      { label: 'Command Palette...', action: toggleCommandPalette, shortcut: 'Ctrl+Shift+P' },
      { label: 'Go to File...', action: toggleCommandPalette, shortcut: 'Ctrl+P' },
      { divider: true },
      { label: 'Explorer', action: () => setActiveSidebarPanel('explorer'), shortcut: 'Ctrl+Shift+E' },
      { label: 'Search', action: () => setActiveSidebarPanel('search'), shortcut: 'Ctrl+Shift+F' },
      { label: 'Source Control', action: () => setActiveSidebarPanel('git'), shortcut: 'Ctrl+Shift+G' },
      { label: 'Extensions', action: () => setActiveSidebarPanel('extensions'), shortcut: 'Ctrl+Shift+X' },
      { divider: true },
      { label: 'Toggle Sidebar', action: toggleSidebar, shortcut: 'Ctrl+B' },
      { label: 'Toggle Terminal', action: toggleTerminal, shortcut: 'Ctrl+`' },
      { label: 'Toggle Markdown Preview', action: toggleMdPreview, shortcut: 'Ctrl+Shift+V' },
      { divider: true },
      { label: 'Increase Font Size', shortcut: 'Ctrl+=', action: () => setEditorFontSize(editorFontSize + 1) },
      { label: 'Decrease Font Size', shortcut: 'Ctrl+-', action: () => setEditorFontSize(editorFontSize - 1) },
      { label: 'Reset Font Size', shortcut: 'Ctrl+0', action: () => setEditorFontSize(13) },
    ],
    Go: [
      { label: 'Go to File...', action: toggleCommandPalette, shortcut: 'Ctrl+P' },
      { label: 'Go to Line...', shortcut: 'Ctrl+G' },
      { label: 'Go to Symbol...', shortcut: 'Ctrl+Shift+O' },
    ],
    Run: [
      { label: 'Start Debugging', shortcut: 'F5' },
      { label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
      { label: 'Stop Debugging', shortcut: 'Shift+F5' },
      { divider: true },
      { label: 'Toggle Breakpoint', shortcut: 'F9' },
    ],
    Terminal: [
      { label: 'New Terminal', shortcut: 'Ctrl+Shift+`' },
      { label: 'Toggle Terminal', action: toggleTerminal, shortcut: 'Ctrl+`' },
      { label: 'Clear Terminal', action: () => usePortfolioStore.getState().clearTerminal() },
      { divider: true },
      { label: 'Run "help"', action: () => { executeCommand('help'); if (!usePortfolioStore.getState().terminalVisible) toggleTerminal(); } },
      { label: 'Run "whoami"', action: () => { executeCommand('whoami'); if (!usePortfolioStore.getState().terminalVisible) toggleTerminal(); } },
    ],
    Help: [
      { label: 'Welcome', action: () => { setActiveTabId(null); } },
      { label: 'Show All Commands', action: toggleCommandPalette },
      { label: 'Run "help" in Terminal', action: () => { executeCommand('help'); if (!usePortfolioStore.getState().terminalVisible) toggleTerminal(); } },
      { divider: true },
      { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+K Ctrl+S' },
      { divider: true },
      { label: 'About', action: () => showToast('VS Code Portfolio v1.0.0 — Built by Mandeep Nagar') },
    ],
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!openMenu) return;
    const handleClick = () => setOpenMenu(null);
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenu]);

  return (
    <div className="flex items-center h-[30px] bg-[#323233] border-b border-[#252526] select-none flex-shrink-0 md:h-[35px] relative">
      <div className="flex items-center gap-0 px-1 text-[12px] md:text-[13px] flex-shrink-0">
        {Object.entries(menus).map(([name, items]) => (
          <div
            key={name}
            className="relative"
            ref={(el) => { menuRefs.current[name] = el; }}
          >
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMenuOpen(name);
              }}
              className={`px-2 py-1 rounded-sm whitespace-nowrap ${openMenu === name
                ? 'bg-[#505050] text-white'
                : 'text-[#cccccc] hover:bg-[#505050]'
                }`}
            >
              {name}
            </button>
          </div>
        ))}
      </div>

      <div className="flex-1 text-center text-[12px] md:text-[13px] text-[#cccccc] truncate px-2 min-w-0">
        {displayName}Mandeep Nagar — Portfolio — Visual Studio Code
      </div>

      <div className="w-4 flex-shrink-0" />

      {/* Render dropdown outside the scrollable container via portal-like fixed position */}
      {openMenu && (
        <div
          className="fixed z-[200]"
          style={{ top: menuPos.top, left: menuPos.left }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <MenuDropdown
            items={menus[openMenu]}
            onClose={() => setOpenMenu(null)}
          />
        </div>
      )}
    </div>
  );
}
