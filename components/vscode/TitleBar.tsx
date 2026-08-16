'use client';

import { useState, useRef, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { findFileById, fileTree } from '@/data/portfolio-data';

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

function MenuDropdown({
  items,
  onClose,
  theme,
}: {
  items: MenuItem[];
  onClose: () => void;
  theme: 'dark' | 'light';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const showToast = usePortfolioStore((s) => s.showToast);
  const isLight = theme === 'light';

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
      className={`fixed border rounded shadow-2xl py-1 min-w-[240px] max-h-[85vh] overflow-y-auto z-[200] animate-fadeIn ${isLight
        ? 'bg-[#f8f8f8] border-[#cccccc] text-[#24292f]'
        : 'bg-[#2d2d30] border-[#454545] text-[#cccccc]'
        }`}
    >
      {items.map((item, i) =>
        'divider' in item && item.divider ? (
          <div
            key={i}
            className={`h-px my-1 ${isLight ? 'bg-[#e0e0e0]' : 'bg-[#454545]'}`}
          />
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => {
              if ('action' in item && item.action) {
                item.action();
              } else {
                showToast(`${(item as MenuItemBase).label} is taking a quick break. Ready soon!`);
              }
              onClose();
            }}
            className={`w-full flex items-center justify-between px-3 py-[6px] text-[13px] text-left transition-colors cursor-pointer ${isLight
              ? 'hover:bg-[#0060c0] hover:text-white'
              : 'hover:bg-[#094771] hover:text-white'
              }`}
          >
            <span className="truncate">{'label' in item ? item.label : ''}</span>
            {'shortcut' in item && item.shortcut && (
              <span className={`text-[11px] ml-4 flex-shrink-0 font-mono ${isLight ? 'text-[#777777] group-hover:text-white' : 'text-[#858585]'
                }`}>
                {item.shortcut}
              </span>
            )}
          </button>
        )
      )}
    </div>
  );
}

export default function TitleBar() {
  const {
    activeTabId,
    openTabs,
    toggleSidebar,
    toggleTerminal,
    toggleMdPreview,
    executeCommand,
    toggleCommandPalette,
    setActiveTabId,
    showToast,
    editorFontSize,
    setEditorFontSize,
    setActiveSidebarPanel,
    openFile,
    isMobile,
    theme,
  } = usePortfolioStore();

  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const displayName = activeTab ? `${activeTab.name} -- ` : '';
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isLight = theme === 'light';

  const handleMenuOpen = (name: string) => {
    if (openMenu === name) {
      setOpenMenu(null);
      return;
    }
    const el = menuRefs.current[name];
    if (el) {
      const rect = el.getBoundingClientRect();
      const left = Math.min(rect.left, window.innerWidth - 260);
      setMenuPos({ top: rect.bottom + 2, left: Math.max(8, left) });
    }
    setOpenMenu(name);
  };

  const copyActiveCode = () => {
    if (activeTab) {
      const file = findFileById(fileTree, activeTab.id);
      if (file?.content) {
        navigator.clipboard?.writeText(file.content);
        showToast(`Copied ${file.name} to clipboard.`);
        return;
      }
    }
    showToast('Nothing to copy. Select an open file first.');
  };

  const openReadme = () => {
    const readme = findFileById(fileTree, 'readme');
    if (readme) openFile(readme);
  };

  const openIndex = () => {
    const indexFile = findFileById(fileTree, 'about-me');
    if (indexFile) openFile(indexFile);
  };

  const menus: Record<string, MenuItem[]> = {
    File: [
      {
        label: 'New File',
        action: () => showToast('Portfolio workspace is in read-only mode.'),
      },
      {
        label: 'Open File...',
        action: toggleCommandPalette,
        shortcut: 'Ctrl+P',
      },
      { divider: true },
      {
        label: 'Save',
        action: () => showToast('Portfolio is read-only. Your curiosity is safely recorded.'),
      },
      {
        label: 'Save All',
        action: () => showToast('All workspace files are up to date.'),
      },
      { divider: true },
      {
        label: 'Close Editor',
        shortcut: 'Ctrl+W',
        action: () => {
          if (activeTabId) usePortfolioStore.getState().closeTab(activeTabId);
        },
      },
      {
        label: 'Close All Editors',
        action: () => {
          const tabs = [...usePortfolioStore.getState().openTabs];
          tabs.forEach((t) => usePortfolioStore.getState().closeTab(t.id));
        },
      },
    ],
    Edit: [
      {
        label: 'Undo',
        action: () => showToast('Nothing to undo. The code is already in its finest shape.'),
      },
      {
        label: 'Redo',
        action: () => showToast('Already running the latest revision.'),
      },
      { divider: true },
      {
        label: 'Cut',
        action: () => showToast('Code editing is restricted in visitor mode.'),
      },
      {
        label: 'Copy Active File Code',
        action: copyActiveCode,
        shortcut: 'Ctrl+C',
      },
      {
        label: 'Paste',
        action: () => showToast('Clipboard insertion is restricted in viewer mode.'),
      },
      { divider: true },
      {
        label: 'Find in Files',
        action: () => setActiveSidebarPanel('search'),
        shortcut: 'Ctrl+Shift+F',
      },
      {
        label: 'Replace',
        action: () => showToast('Global replace is disabled in published portfolios.'),
      },
    ],
    Selection: [
      {
        label: 'Select All',
        action: copyActiveCode,
        shortcut: 'Ctrl+A',
      },
      {
        label: 'Expand Selection',
        action: () => showToast('Full code scope selected.'),
      },
      {
        label: 'Shrink Selection',
        action: () => showToast('Current block focused.'),
      },
      { divider: true },
      {
        label: 'Copy Line Up',
        action: () => showToast('Line duplication is disabled in viewer mode.'),
      },
      {
        label: 'Copy Line Down',
        action: () => showToast('Line duplication is disabled in viewer mode.'),
      },
    ],
    View: [
      {
        label: 'Command Palette...',
        action: toggleCommandPalette,
        shortcut: 'Ctrl+Shift+P',
      },
      {
        label: 'Go to File...',
        action: toggleCommandPalette,
        shortcut: 'Ctrl+P',
      },
      { divider: true },
      {
        label: 'Explorer',
        action: () => setActiveSidebarPanel('explorer'),
        shortcut: 'Ctrl+Shift+E',
      },
      {
        label: 'Search',
        action: () => setActiveSidebarPanel('search'),
        shortcut: 'Ctrl+Shift+F',
      },
      {
        label: 'Source Control',
        action: () => setActiveSidebarPanel('git'),
        shortcut: 'Ctrl+Shift+G',
      },
      {
        label: 'Extensions',
        action: () => setActiveSidebarPanel('extensions'),
        shortcut: 'Ctrl+Shift+X',
      },
      {
        label: 'AI Copilot Chat',
        action: () => setActiveSidebarPanel('assistant'),
      },
      {
        label: 'Developer Profile',
        action: () => setActiveSidebarPanel('profile'),
      },
      {
        label: 'Settings',
        action: () => setActiveSidebarPanel('settings'),
      },
      { divider: true },
      {
        label: 'Toggle Sidebar',
        action: toggleSidebar,
        shortcut: 'Ctrl+B',
      },
      {
        label: 'Toggle Terminal',
        action: toggleTerminal,
        shortcut: 'Ctrl+`',
      },
      {
        label: 'Toggle Markdown Preview',
        action: toggleMdPreview,
        shortcut: 'Ctrl+Shift+V',
      },
      { divider: true },
      {
        label: 'Zoom In',
        shortcut: 'Ctrl+=',
        action: () => setEditorFontSize(editorFontSize + 1),
      },
      {
        label: 'Zoom Out',
        shortcut: 'Ctrl+-',
        action: () => setEditorFontSize(editorFontSize - 1),
      },
      {
        label: 'Reset Zoom',
        shortcut: 'Ctrl+0',
        action: () => setEditorFontSize(13),
      },
    ],
    Go: [
      {
        label: 'Go to File...',
        action: toggleCommandPalette,
        shortcut: 'Ctrl+P',
      },
      {
        label: 'Go to Line...',
        action: () => showToast('Navigating to start of file.'),
      },
      {
        label: 'Go to Definition',
        action: () => showToast('Definition is embedded directly in this file.'),
      },
      { divider: true },
      {
        label: 'Back',
        action: () => showToast('Reached the beginning of navigation stack.'),
      },
      {
        label: 'Forward',
        action: () => showToast('At the frontier of navigation stack.'),
      },
    ],
    Run: [
      {
        label: 'Start Debugging',
        shortcut: 'F5',
        action: () => showToast('Debugger initialized: Zero errors detected. All systems operational.'),
      },
      {
        label: 'Run Without Debugging',
        shortcut: 'Ctrl+F5',
        action: () => {
          if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
          executeCommand('npm run dev');
        },
      },
      {
        label: 'Stop Debugging',
        action: () => showToast('Debug session ended.'),
      },
      { divider: true },
      {
        label: 'Toggle Breakpoint',
        action: () => showToast('Breakpoints are inactive in production build.'),
      },
    ],
    Terminal: [
      {
        label: 'Toggle Terminal',
        action: toggleTerminal,
        shortcut: 'Ctrl+`',
      },
      {
        label: 'Clear Terminal',
        action: () => usePortfolioStore.getState().clearTerminal(),
      },
      { divider: true },
      {
        label: 'Run "help"',
        action: () => {
          if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
          executeCommand('help');
        },
      },
      {
        label: 'Run "whoami"',
        action: () => {
          if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
          executeCommand('whoami');
        },
      },
      {
        label: 'Run "projects"',
        action: () => {
          if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
          executeCommand('projects');
        },
      },
      {
        label: 'Run "skills"',
        action: () => {
          if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
          executeCommand('skills');
        },
      },
      {
        label: 'Run "neofetch"',
        action: () => {
          if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
          executeCommand('neofetch');
        },
      },
    ],
    Help: [
      {
        label: 'Welcome (index.ts)',
        action: openIndex,
      },
      {
        label: 'Documentation (README.md)',
        action: openReadme,
      },
      {
        label: 'Show All Commands',
        action: toggleCommandPalette,
        shortcut: 'Ctrl+Shift+P',
      },
      { divider: true },
      {
        label: 'About Mandeep Nagar',
        action: () => setActiveSidebarPanel('profile'),
      },
      {
        label: 'About VS Code Portfolio',
        action: () => showToast('VS Code Portfolio v1.1.0 — Built by Mandeep Nagar'),
      },
    ],
  };

  const mobileMoreItems: MenuItem[] = [
    {
      label: 'Command Palette...',
      action: toggleCommandPalette,
      shortcut: 'Ctrl+Shift+P',
    },
    {
      label: 'AI Copilot Chat (Gemini)',
      action: () => setActiveSidebarPanel('assistant'),
    },
    {
      label: 'Developer Profile',
      action: () => setActiveSidebarPanel('profile'),
    },
    {
      label: 'Settings (Theme & Font)',
      action: () => setActiveSidebarPanel('settings'),
    },
    { divider: true },
    {
      label: 'Source Control (Git)',
      action: () => setActiveSidebarPanel('git'),
    },
    {
      label: 'Extensions',
      action: () => setActiveSidebarPanel('extensions'),
    },
    {
      label: 'Reviews & Feedback',
      action: () => setActiveSidebarPanel('feedback'),
    },
    {
      label: 'Contact Info',
      action: () => setActiveSidebarPanel('contact'),
    },
    { divider: true },
    {
      label: 'Run "npm run dev"',
      action: () => {
        if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
        executeCommand('npm run dev');
      },
    },
    {
      label: 'Run "neofetch"',
      action: () => {
        if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
        executeCommand('neofetch');
      },
    },
    {
      label: 'Run "help"',
      action: () => {
        if (!usePortfolioStore.getState().terminalVisible) toggleTerminal();
        executeCommand('help');
      },
    },
    {
      label: 'Clear Terminal',
      action: () => usePortfolioStore.getState().clearTerminal(),
    },
    { divider: true },
    {
      label: 'Open README.md',
      action: openReadme,
    },
    {
      label: 'About Portfolio',
      action: () => showToast('VS Code Portfolio v1.1.0 — Built by Mandeep Nagar'),
    },
  ];

  const visibleMenuKeys = isMobile
    ? ['File', 'Edit', 'View']
    : Object.keys(menus);

  return (
    <div
      className={`flex items-center h-[30px] border-b select-none flex-shrink-0 md:h-[35px] relative transition-colors duration-150 ${isLight
        ? 'bg-[#dddddd] border-[#cccccc] text-[#24292f]'
        : 'bg-[#323233] border-[#252526] text-[#cccccc]'
        }`}
    >
      <div className="flex items-center gap-0.5 px-1 text-[12px] md:text-[13px] flex-shrink-0">
        {visibleMenuKeys.map((name) => (
          <div
            key={name}
            className="relative"
            ref={(el) => {
              menuRefs.current[name] = el;
            }}
          >
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMenuOpen(name);
              }}
              className={`px-2 py-0.5 md:py-1 rounded-sm whitespace-nowrap transition-colors cursor-pointer ${openMenu === name
                ? isLight
                  ? 'bg-[#c8c8c8] text-black font-medium'
                  : 'bg-[#505050] text-white font-medium'
                : isLight
                  ? 'text-[#24292f] hover:bg-[#cecece]'
                  : 'text-[#cccccc] hover:bg-[#505050]'
                }`}
            >
              {name}
            </button>
          </div>
        ))}

        {isMobile && (
          <div
            className="relative"
            ref={(el) => {
              menuRefs.current['More'] = el;
            }}
          >
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMenuOpen('More');
              }}
              className={`px-2 py-0.5 rounded-sm whitespace-nowrap transition-colors cursor-pointer font-medium ${openMenu === 'More'
                ? isLight
                  ? 'bg-[#c8c8c8] text-black'
                  : 'bg-[#505050] text-white'
                : isLight
                  ? 'text-[#0060c0] hover:bg-[#cecece]'
                  : 'text-[#3794ff] hover:bg-[#505050]'
                }`}
            >
              More
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 text-center text-[11px] md:text-[13px] truncate px-2 min-w-0 font-medium opacity-90">
        {displayName}Mandeep Nagar — Portfolio — Visual Studio Code
      </div>

      <div className="w-2 flex-shrink-0" />

      {openMenu && (
        <div
          className="fixed z-[200]"
          style={{ top: menuPos.top, left: menuPos.left }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <MenuDropdown
            items={openMenu === 'More' ? mobileMoreItems : menus[openMenu]}
            onClose={() => setOpenMenu(null)}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}
