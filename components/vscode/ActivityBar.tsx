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
  } = usePortfolioStore();

  if (isMobile) return null;

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
    <div className="flex flex-col items-center w-12 bg-[#333333] border-r border-[#252526] flex-shrink-0 py-1 justify-between">
      <div className="flex flex-col items-center gap-0.5">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarPanel === item.id && sidebarVisible;
          return (
            <button
              key={item.id}
              onClick={() => handlePanelClick(item.id)}
              className="relative w-12 h-12 flex items-center justify-center transition-colors duration-100 group"
              title={item.label}
            >
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 transition-opacity duration-100 ${isActive ? 'opacity-100 bg-white' : 'opacity-0'
                  }`}
              />
              <Icon
                className={`w-6 h-6 transition-colors ${isActive ? 'text-white' : 'text-[#858585] hover:text-white'
                  }`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#252526] text-[#cccccc] text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-[#454545]">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-0.5 pb-1">
        <button
          onClick={toggleTerminal}
          className={`relative w-12 h-12 flex items-center justify-center transition-colors group ${terminalVisible ? 'text-white' : 'text-[#858585] hover:text-white'
            }`}
          title="Toggle Terminal"
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 transition-opacity ${terminalVisible ? 'opacity-100 bg-white' : 'opacity-0'
              }`}
          />
          <TerminalIcon className="w-6 h-6" strokeWidth={terminalVisible ? 2 : 1.5} />
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252526] text-[#cccccc] text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-[#454545]">
            Terminal
          </div>
        </button>

        <button
          onClick={() => handlePanelClick('profile')}
          className={`relative w-12 h-12 flex items-center justify-center transition-colors group ${activeSidebarPanel === 'profile' && sidebarVisible ? 'text-white' : 'text-[#858585] hover:text-white'
            }`}
          title="Profile"
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 transition-opacity ${activeSidebarPanel === 'profile' && sidebarVisible ? 'opacity-100 bg-white' : 'opacity-0'
              }`}
          />
          <UserCircle className="w-6 h-6" strokeWidth={activeSidebarPanel === 'profile' && sidebarVisible ? 2 : 1.5} />
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252526] text-[#cccccc] text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-[#454545]">
            Mandeep Nagar
          </div>
        </button>

        <button
          onClick={() => handlePanelClick('settings')}
          className={`relative w-12 h-12 flex items-center justify-center transition-colors group ${activeSidebarPanel === 'settings' && sidebarVisible ? 'text-white' : 'text-[#858585] hover:text-white'
            }`}
          title="Settings"
        >
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 transition-opacity ${activeSidebarPanel === 'settings' && sidebarVisible ? 'opacity-100 bg-white' : 'opacity-0'
              }`}
          />
          <Settings
            className={`w-6 h-6 transition-transform duration-300 ${activeSidebarPanel === 'settings' && sidebarVisible ? 'rotate-45' : ''}`}
            strokeWidth={activeSidebarPanel === 'settings' && sidebarVisible ? 2 : 1.5}
          />
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#252526] text-[#cccccc] text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-[#454545]">
            Settings
          </div>
        </button>
      </div>
    </div>
  );
}
