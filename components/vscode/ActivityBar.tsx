'use client';

import {
  Files,
  Search,
  GitBranch,
  Blocks,
  Mail,
  Settings,
  UserCircle,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolio-store';

export default function ActivityBar() {
  const {
    activeSidebarPanel,
    setActiveSidebarPanel,
    sidebarVisible,
    toggleSidebar,
    terminalVisible,
    toggleTerminal,
    isMobile,
    theme,
  } = usePortfolioStore();

  if (isMobile) return null;
  const isLight = theme === 'light';

  const topItems = [
    { id: 'explorer' as const, icon: Files, label: 'Explorer' },
    { id: 'search' as const, icon: Search, label: 'Search' },
    { id: 'git' as const, icon: GitBranch, label: 'Source Control' },
    { id: 'extensions' as const, icon: Blocks, label: 'Extensions' },
    { id: 'contact' as const, icon: Mail, label: 'Contact' },
  ];

  const handlePanelClick = (id: typeof activeSidebarPanel) => {
    if (activeSidebarPanel === id && sidebarVisible) {
      toggleSidebar();
    } else {
      setActiveSidebarPanel(id);
    }
  };

  return (
    <div
      className={`flex flex-col items-center w-12 border-r flex-shrink-0 py-1 justify-between select-none transition-colors duration-150 ${
        isLight
          ? 'bg-[#f8f8f8] border-[#e4e4e4] text-[#616161]'
          : 'bg-[#333333] border-[#252526] text-[#858585]'
      }`}
    >
      {/* Top Icons */}
      <div className="flex flex-col items-center gap-0.5">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarPanel === item.id && sidebarVisible;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePanelClick(item.id)}
              className="relative w-12 h-12 flex items-center justify-center transition-colors duration-100 group cursor-pointer"
              title={item.label}
              aria-label={item.label}
            >
              {/* Active left indicator bar */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 transition-opacity duration-100 ${
                  isActive
                    ? isLight
                      ? 'opacity-100 bg-[#005fb8]'
                      : 'opacity-100 bg-white'
                    : 'opacity-0'
                }`}
              />
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive
                    ? isLight
                      ? 'text-[#005fb8]'
                      : 'text-white'
                    : isLight
                      ? 'text-[#616161] group-hover:text-[#000000]'
                      : 'text-[#969696] group-hover:text-white'
                }`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <div
                className={`absolute left-full ml-2 px-2 py-1 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border shadow-md ${
                  isLight
                    ? 'bg-white text-[#24292f] border-[#cecece]'
                    : 'bg-[#252526] text-[#cccccc] border-[#454545]'
                }`}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-0.5 pb-1">
        {/* Terminal Toggle Button */}
        <button
          type="button"
          onClick={toggleTerminal}
          className="relative w-12 h-12 flex items-center justify-center transition-colors group cursor-pointer"
          title="Toggle Terminal (Ctrl+`)"
          aria-label="Terminal"
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 transition-opacity ${
              terminalVisible
                ? isLight
                  ? 'opacity-100 bg-[#005fb8]'
                  : 'opacity-100 bg-white'
                : 'opacity-0'
            }`}
          />
          <TerminalIcon
            className={`w-6 h-6 transition-colors ${
              terminalVisible
                ? isLight
                  ? 'text-[#005fb8]'
                  : 'text-white'
                : isLight
                  ? 'text-[#616161] group-hover:text-[#000000]'
                  : 'text-[#969696] group-hover:text-white'
            }`}
            strokeWidth={terminalVisible ? 2 : 1.5}
          />
          <div
            className={`absolute left-full ml-2 px-2 py-1 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border shadow-md ${
              isLight
                ? 'bg-white text-[#24292f] border-[#cecece]'
                : 'bg-[#252526] text-[#cccccc] border-[#454545]'
            }`}
          >
            Terminal
          </div>
        </button>

        {/* Profile Button */}
        <button
          type="button"
          onClick={() => handlePanelClick('profile')}
          className="relative w-12 h-12 flex items-center justify-center transition-colors group cursor-pointer"
          title="Developer Profile"
          aria-label="Profile"
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 transition-opacity ${
              activeSidebarPanel === 'profile' && sidebarVisible
                ? isLight
                  ? 'opacity-100 bg-[#005fb8]'
                  : 'opacity-100 bg-white'
                : 'opacity-0'
            }`}
          />
          <UserCircle
            className={`w-6 h-6 transition-colors ${
              activeSidebarPanel === 'profile' && sidebarVisible
                ? isLight
                  ? 'text-[#005fb8]'
                  : 'text-white'
                : isLight
                  ? 'text-[#616161] group-hover:text-[#000000]'
                  : 'text-[#969696] group-hover:text-white'
            }`}
            strokeWidth={activeSidebarPanel === 'profile' && sidebarVisible ? 2 : 1.5}
          />
          <div
            className={`absolute left-full ml-2 px-2 py-1 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border shadow-md ${
              isLight
                ? 'bg-white text-[#24292f] border-[#cecece]'
                : 'bg-[#252526] text-[#cccccc] border-[#454545]'
            }`}
          >
            Mandeep Nagar
          </div>
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={() => handlePanelClick('settings')}
          className="relative w-12 h-12 flex items-center justify-center transition-colors group cursor-pointer"
          title="Settings"
          aria-label="Settings"
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 transition-opacity ${
              activeSidebarPanel === 'settings' && sidebarVisible
                ? isLight
                  ? 'opacity-100 bg-[#005fb8]'
                  : 'opacity-100 bg-white'
                : 'opacity-0'
            }`}
          />
          <Settings
            className={`w-6 h-6 transition-transform duration-300 ${
              activeSidebarPanel === 'settings' && sidebarVisible
                ? isLight
                  ? 'text-[#005fb8] rotate-45'
                  : 'text-white rotate-45'
                : isLight
                  ? 'text-[#616161] group-hover:text-[#000000]'
                  : 'text-[#969696] group-hover:text-white'
            }`}
            strokeWidth={activeSidebarPanel === 'settings' && sidebarVisible ? 2 : 1.5}
          />
          <div
            className={`absolute left-full ml-2 px-2 py-1 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border shadow-md ${
              isLight
                ? 'bg-white text-[#24292f] border-[#cecece]'
                : 'bg-[#252526] text-[#cccccc] border-[#454545]'
            }`}
          >
            Settings
          </div>
        </button>
      </div>
    </div>
  );
}
