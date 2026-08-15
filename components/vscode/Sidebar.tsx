'use client';

import { useRef, useCallback } from 'react';
import {
  ChevronRight, ChevronDown, FileText, Folder, FolderOpen,
  Search, GitBranch, GitCommit, ExternalLink, File, Sun, Moon,
  Mail, Globe, Phone, Minus, Plus, AlignJustify
} from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { FileNode } from '@/data/portfolio-data';
import { Input } from '@/components/ui/input';

function getFileIconComponent(name: string) {
  if (name.endsWith('.tsx')) return { icon: <span className="text-[#519aba] text-[11px] font-bold w-4 text-center flex-shrink-0">TSX</span> };
  if (name.endsWith('.ts')) return { icon: <span className="text-[#519aba] text-[11px] font-bold w-4 text-center flex-shrink-0">TS</span> };
  if (name.endsWith('.md')) return { icon: <span className="text-[#519aba] text-[11px] font-bold w-4 text-center flex-shrink-0">MD</span> };
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.webp') || name.endsWith('.ico') || name.endsWith('.svg')) {
    return { icon: <span className="text-[#a074c4] text-[11px] font-bold w-4 text-center flex-shrink-0">IMG</span> };
  }
  return { icon: <File className="w-4 h-4 text-[#858585] flex-shrink-0" /> };
}

function FileTreeItem({ node, depth }: { node: FileNode; depth: number }) {
  const { expandedFolders, toggleFolder, openFile, activeTabId } = usePortfolioStore();
  const isExpanded = expandedFolders.has(node.id);
  const isActive = activeTabId === node.id;

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => toggleFolder(node.id)}
          className={`w-full flex items-center gap-1 py-[3px] px-2 text-[13px] hover:bg-[#2a2d2e] transition-colors text-left text-[#cccccc]`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#cccccc] flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#cccccc] flex-shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-[#dcb67a] flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-[#dcb67a] flex-shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <FileTreeItem key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const { icon } = getFileIconComponent(node.name);
  return (
    <button
      onClick={() => openFile(node)}
      className={`w-full flex items-center gap-1.5 py-[3px] px-2 text-[13px] transition-colors text-left ${isActive
        ? 'bg-[#37373d] text-white'
        : 'text-[#cccccc] hover:bg-[#2a2d2e]'
        }`}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
      title={node.name}
    >
      {icon}
      <span className="truncate">{node.name}</span>
    </button>
  );
}

function ExplorerPanel() {
  const { fileTree } = usePortfolioStore();
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-4 py-1.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase flex-shrink-0">
        <span>Explorer</span>
      </div>
      <div className="flex items-center px-4 py-1 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase flex-shrink-0">
        <span>Portfolio Files</span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 min-h-0">
        {fileTree.map((node) => (
          <FileTreeItem key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}

function SearchPanel() {
  const { searchQuery, setSearchQuery, searchResults, openFile } = usePortfolioStore();
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase flex-shrink-0">
        Search
      </div>
      <div className="px-2 pb-2 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#858585] pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="h-7 bg-[#3c3c3c] border-[#3c3c3c] text-[#cccccc] text-[13px] pl-7 focus-visible:ring-0 focus-visible:border-[#007fd4] placeholder:text-[#858585]"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 text-[13px] min-h-0">
        {searchQuery && searchResults.length === 0 && (
          <p className="text-[#858585] px-2 py-1">No results found</p>
        )}
        {searchResults.map((file) => (
          <button
            key={file.id}
            onClick={() => openFile(file)}
            className="w-full text-left px-2 py-1 hover:bg-[#2a2d2e] rounded flex items-center gap-2 text-[#cccccc]"
          >
            <FileText className="w-3.5 h-3.5 text-[#519aba] flex-shrink-0" />
            <span className="truncate">{file.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GitPanel() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className="flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase flex-shrink-0">
        Source Control
      </div>
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 text-[13px] text-[#cccccc] mb-3">
          <GitBranch className="w-4 h-4" />
          <span>main</span>
        </div>
        <div className="text-[11px] font-semibold text-[#bbbbbb] uppercase mb-2 tracking-wider">Changes</div>
        <div className="text-[13px] text-[#858585] italic">Working tree clean</div>
        <div className="mt-4 text-[11px] font-semibold text-[#bbbbbb] uppercase mb-2 tracking-wider">Recent Commits</div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-[13px]">
            <GitCommit className="w-3.5 h-3.5 text-[#858585] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#cccccc]">feat: add VS Code themed portfolio</p>
              <p className="text-[#858585] text-[11px]">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-[13px]">
            <GitCommit className="w-3.5 h-3.5 text-[#858585] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#cccccc]">feat: add terminal with commands</p>
              <p className="text-[#858585] text-[11px]">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-[13px]">
            <GitCommit className="w-3.5 h-3.5 text-[#858585] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[#cccccc]">initial commit: project setup</p>
              <p className="text-[#858585] text-[11px]">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtensionsPanel() {
  const extensions = [
    { name: 'TypeScript', publisher: 'Microsoft', color: '#519aba' },
    { name: 'Tailwind CSS', publisher: 'Tailwind Labs', color: '#38bdf8' },
    { name: 'ESLint', publisher: 'Microsoft', color: '#4b32c3' },
    { name: 'Prettier', publisher: 'Prettier', color: '#c596c7' },
    { name: 'GitLens', publisher: 'GitKraken', color: '#178ef0' },
    { name: 'Thunder Client', publisher: 'Thunder Client', color: '#7952b3' },
  ];
  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className="flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase flex-shrink-0">
        Extensions
      </div>
      <div className="px-2 py-1 flex-shrink-0">
        <Input
          placeholder="Search extensions..."
          className="h-7 bg-[#3c3c3c] border-[#3c3c3c] text-[#cccccc] text-[13px] focus-visible:ring-0 focus-visible:border-[#007fd4] placeholder:text-[#858585]"
        />
      </div>
      <div className="px-2 text-[11px] font-semibold text-[#bbbbbb] uppercase mt-2 mb-1 tracking-wider">
        Installed
      </div>
      <div className="space-y-0.5">
        {extensions.map((ext) => (
          <div
            key={ext.name}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#2a2d2e] cursor-pointer"
          >
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: ext.color + '40', color: ext.color }}
            >
              {ext.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] text-[#cccccc] truncate">{ext.name}</p>
              <p className="text-[11px] text-[#858585] truncate">{ext.publisher}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPanel() {
  const contactItems = [
    { label: 'Email', value: 'mandeep.pc2006@gmail.com', link: 'mailto:mandeep.pc2006@gmail.com', Icon: Mail },
    { label: 'LinkedIn', value: 'linkedin.com/in/mandeepnagar', link: 'https://linkedin.com/in/mandeepnagar', Icon: ExternalLink },
    { label: 'Portfolio', value: 'mandeepiitp.tech', link: 'https://mandeepiitp.tech', Icon: Globe },
    { label: 'Phone', value: '+91 99204 80615', link: 'tel:+919920480615', Icon: Phone },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className="flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase flex-shrink-0">
        Contact
      </div>
      <div className="px-4 py-2 space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#007fd4] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            MN
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-[#cccccc] font-medium">Mandeep Nagar</p>
            <p className="text-[11px] text-[#858585]">Full Stack Developer</p>
          </div>
        </div>
        {contactItems.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-0.5">{item.label}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[#3794ff] hover:underline flex items-center gap-1 group"
            >
              {item.value}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          </div>
        ))}
        <div className="pt-2 border-t border-[#3c3c3c]">
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-1">Location</p>
          <p className="text-[13px] text-[#cccccc]">Patna, Bihar, India</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] inline-block animate-pulse" />
            <p className="text-[13px] text-[#28c840]">Open to opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className="flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase flex-shrink-0">
        Profile
      </div>
      <div className="px-4 py-4">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#007fd4] flex items-center justify-center text-white font-bold text-xl mb-3 ring-2 ring-[#007fd4] ring-offset-2 ring-offset-[#252526]">
            MN
          </div>
          <p className="text-[14px] text-white font-semibold">Mandeep Nagar</p>
          <p className="text-[12px] text-[#858585] mt-0.5">Full Stack Developer</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] inline-block" />
            <span className="text-[11px] text-[#28c840]">Open to work</span>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-1.5">About</p>
          <p className="text-[12px] text-[#cccccc] leading-relaxed">
            Full Stack Developer building production-ready SaaS applications with Next.js, Express.js, MongoDB, and modern web technologies.
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2.5 mb-4">
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-1.5">Details</p>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#858585] w-16 flex-shrink-0">Location</span>
            <span className="text-[#cccccc]">Patna, Bihar, India</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#858585] w-16 flex-shrink-0">Email</span>
            <a href="mailto:mandeep.pc2006@gmail.com" className="text-[#3794ff] hover:underline truncate">
              mandeep.pc2006@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-[#858585] w-16 flex-shrink-0">Website</span>
            <a href="https://mandeepiitp.tech" target="_blank" rel="noopener noreferrer" className="text-[#3794ff] hover:underline">
              mandeepiitp.tech
            </a>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-4">
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-1.5">Primary Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {['Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS', 'Zustand', 'Docker'].map(tech => (
              <span key={tech} className="px-2 py-0.5 bg-[#2d2d2d] text-[#cccccc] text-[11px] rounded border border-[#3c3c3c]">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="pt-3 border-t border-[#3c3c3c]">
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-2">Links</p>
          <div className="space-y-1.5">
            <a
              href="https://linkedin.com/in/mandeepnagar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-[#3794ff] hover:text-white hover:bg-[#2a2d2e] px-2 py-1 rounded transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              LinkedIn
            </a>
            <a
              href="https://mandeepiitp.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-[#3794ff] hover:text-white hover:bg-[#2a2d2e] px-2 py-1 rounded transition-colors"
            >
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              Portfolio Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const { theme, setTheme, editorFontSize, setEditorFontSize, showLineNumbers, toggleLineNumbers, showToast } = usePortfolioStore();

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className="flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase flex-shrink-0">
        Settings
      </div>

      <div className="px-4 py-2 space-y-6">
        {/* Appearance */}
        <div>
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-3">Appearance</p>
          <div className="space-y-3">
            {/* Color Theme */}
            <div>
              <p className="text-[12px] text-[#cccccc] mb-2">Color Theme</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-[12px] border transition-colors ${theme === 'dark'
                    ? 'bg-[#094771] border-[#007fd4] text-white'
                    : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#858585] hover:border-[#007fd4] hover:text-[#cccccc]'
                    }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Dark+
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-[12px] border transition-colors ${theme === 'light'
                    ? 'bg-[#094771] border-[#007fd4] text-white'
                    : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#858585] hover:border-[#007fd4] hover:text-[#cccccc]'
                    }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  Light+
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div>
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-3">Editor</p>
          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] text-[#cccccc]">Font Size</p>
                <span className="text-[12px] text-[#858585]">{editorFontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditorFontSize(editorFontSize - 1)}
                  className="w-6 h-6 flex items-center justify-center bg-[#2d2d2d] rounded hover:bg-[#3c3c3c] text-[#cccccc] transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="flex-1 h-1 bg-[#3c3c3c] rounded-full relative">
                  <div
                    className="h-full bg-[#007fd4] rounded-full transition-all"
                    style={{ width: `${((editorFontSize - 10) / 14) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => setEditorFontSize(editorFontSize + 1)}
                  className="w-6 h-6 flex items-center justify-center bg-[#2d2d2d] rounded hover:bg-[#3c3c3c] text-[#cccccc] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Line Numbers */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#cccccc]">Line Numbers</p>
                <p className="text-[11px] text-[#858585]">Show line numbers in editor</p>
              </div>
              <button
                onClick={toggleLineNumbers}
                className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${showLineNumbers ? 'bg-[#007fd4]' : 'bg-[#3c3c3c]'}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showLineNumbers ? 'translate-x-4' : 'translate-x-0.5'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Terminal */}
        <div>
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-3">Terminal</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[#cccccc]">Shell</p>
                <p className="text-[11px] text-[#858585]">Portfolio Terminal v1.0.0</p>
              </div>
              <AlignJustify className="w-4 h-4 text-[#858585]" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="pt-3 border-t border-[#3c3c3c]">
          <p className="text-[11px] text-[#858585] uppercase tracking-wider mb-2">About</p>
          <p className="text-[12px] text-[#cccccc]">VS Code Portfolio</p>
          <p className="text-[11px] text-[#858585]">Version 1.0.0</p>
          <p className="text-[11px] text-[#858585]">Next.js 16 / React 19</p>
          <button
            onClick={() => showToast('Built by Mandeep Nagar with Next.js, TypeScript, and Tailwind CSS')}
            className="mt-2 text-[11px] text-[#3794ff] hover:underline"
          >
            View source
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { activeSidebarPanel, sidebarVisible, sidebarWidth, setSidebarWidth, isMobile } = usePortfolioStore();
  const isResizing = useRef(false);

  const ACTIVITY_BAR_WIDTH = 48;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      // Subtract ActivityBar width so width tracks the mouse correctly
      setSidebarWidth(ev.clientX - ACTIVITY_BAR_WIDTH);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [setSidebarWidth]);

  const sidebarContent = (
    <div
      className="bg-[#252526] border-r border-[#1e1e1e] flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{ width: isMobile ? '100%' : sidebarWidth }}
    >
      {activeSidebarPanel === 'explorer' && <ExplorerPanel />}
      {activeSidebarPanel === 'search' && <SearchPanel />}
      {activeSidebarPanel === 'git' && <GitPanel />}
      {activeSidebarPanel === 'extensions' && <ExtensionsPanel />}
      {activeSidebarPanel === 'contact' && <ContactPanel />}
      {activeSidebarPanel === 'profile' && <ProfilePanel />}
      {activeSidebarPanel === 'settings' && <SettingsPanel />}
    </div>
  );

  // Mobile: overlay with backdrop
  if (isMobile) {
    if (!sidebarVisible) return null;
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => usePortfolioStore.getState().toggleSidebar()}
        />
        <div className="fixed left-0 top-[30px] bottom-0 z-50 animate-slideInLeft">
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden flex-shrink-0 ${sidebarVisible ? 'opacity-100' : 'max-w-0 opacity-0'
          }`}
        style={{ width: sidebarVisible ? sidebarWidth : 0 }}
      >
        {sidebarContent}
      </div>
      {/* Resize handle */}
      {sidebarVisible && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 cursor-col-resize hover:bg-[#007fd4] active:bg-[#007fd4] transition-colors flex-shrink-0 relative z-10"
        />
      )}
    </>
  );
}