'use client';

import { useRef, useCallback, useState } from 'react';
import {
  ChevronRight, ChevronDown, FileText, Folder, FolderOpen,
  Search, GitBranch, GitCommit, ExternalLink, File, Sun, Moon,
  Mail, Globe, Phone, Minus, Plus, AlignJustify, X,
  RotateCcw, Sparkles, Trash2, WrapText, Sliders
} from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { FileNode } from '@/data/portfolio-data';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import AssistantPanel from './AssistantPanel';
import FeedbackPanel from './FeedbackPanel';
import { playClickSound, playToggleSound, playToastSound } from '@/lib/sound';

function getFileIconComponent(name: string) {
  if (name.endsWith('.tsx')) return { icon: <span className="text-[#519aba] text-[11px] font-bold w-4 mr-1 text-center flex-shrink-0">TSX</span> };
  if (name.endsWith('.ts')) return { icon: <span className="text-[#519aba] text-[11px] font-bold w-4 text-center flex-shrink-0">TS</span> };
  if (name.endsWith('.md')) return { icon: <span className="text-[#519aba] text-[11px] font-bold w-4 text-center flex-shrink-0">MD</span> };
  if (name.endsWith('.pdf')) return { icon: <span className="text-[#e05555] text-[11px] font-bold w-4 mr-1 text-center flex-shrink-0">PDF</span> };
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.webp') || name.endsWith('.ico') || name.endsWith('.svg')) {
    return { icon: <span className="text-[#a074c4] text-[11px] font-bold w-4 mr-1 text-center flex-shrink-0">IMG</span> };
  }
  return { icon: <File className="w-4 h-4 text-[#858585] flex-shrink-0" /> };
}

function FileTreeItem({
  node,
  depth,
  shakingIds,
  dragOverId,
  setDragOverId,
  draggedNodeId,
  setDraggedNodeId,
  onRejectDrop,
}: {
  node: FileNode;
  depth: number;
  shakingIds: Set<string>;
  dragOverId: string | null;
  setDragOverId: (id: string | null) => void;
  draggedNodeId: string | null;
  setDraggedNodeId: (id: string | null) => void;
  onRejectDrop: (targetId: string, e?: React.DragEvent) => void;
}) {
  const { expandedFolders, toggleFolder, openFile, activeTabId, theme } = usePortfolioStore();
  const isExpanded = expandedFolders.has(node.id);
  const isActive = activeTabId === node.id;
  const isLight = theme === 'light';
  const isShaking = shakingIds.has(node.id);
  const isDragOver = dragOverId === node.id;

  if (node.type === 'folder') {
    return (
      <div
        data-folder-id={node.id}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'move';
          if (dragOverId !== node.id) setDragOverId(node.id);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOverId(node.id);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (dragOverId === node.id) setDragOverId(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOverId(null);
          onRejectDrop(node.id, e);
        }}
        className="transition-colors"
      >
        <button
          onClick={() => {
            playToggleSound();
            toggleFolder(node.id);
          }}
          className={`w-full flex items-center gap-1 py-[3px] px-2 text-[13px] transition-all text-left cursor-pointer ${isShaking
            ? 'animate-shake-red border border-red-500/80 rounded bg-red-500/20'
            : isDragOver
              ? 'bg-red-500/15 border border-dashed border-red-500/60 rounded text-red-400'
              : isLight
                ? 'text-[#333333] hover:bg-[#e8e8e8]'
                : 'text-[#cccccc] hover:bg-[#2a2d2e]'
            }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {isExpanded ? (
            <ChevronDown className={`w-4 h-4 flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#cccccc]'}`} />
          ) : (
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#cccccc]'}`} />
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
              <FileTreeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                shakingIds={shakingIds}
                dragOverId={dragOverId}
                setDragOverId={setDragOverId}
                draggedNodeId={draggedNodeId}
                setDraggedNodeId={setDraggedNodeId}
                onRejectDrop={onRejectDrop}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const { icon } = getFileIconComponent(node.name);
  return (
    <button
      data-file-id={node.id}
      draggable={true}
      onDragStart={(e) => {
        setDraggedNodeId(node.id);
        e.dataTransfer.setData('text/plain', node.id);
        e.dataTransfer.setData('application/portfolio-file-id', node.id);
        e.dataTransfer.effectAllowed = 'copyMove';
      }}
      onDragEnd={() => {
        setDraggedNodeId(null);
        setDragOverId(null);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverId !== node.id) setDragOverId(node.id);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverId(node.id);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragOverId === node.id) setDragOverId(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverId(null);
        onRejectDrop(node.id, e);
      }}
      onClick={() => {
        playClickSound();
        openFile(node);
      }}
      className={`w-full flex items-center gap-1.5 py-[3px] px-2 text-[13px] transition-all text-left cursor-pointer ${isShaking
        ? 'animate-shake-red border border-red-500/80 rounded bg-red-500/20'
        : isDragOver
          ? 'bg-red-500/15 border border-dashed border-red-500/60 rounded'
          : isActive
            ? isLight
              ? 'bg-[#d6ebff] text-[#004f9e] font-medium'
              : 'bg-[#37373d] text-white font-medium'
            : isLight
              ? 'text-[#333333] hover:bg-[#e8e8e8]'
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
  const { fileTree, theme, showToast } = usePortfolioStore();
  const [shakingIds, setShakingIds] = useState<Set<string>>(new Set());
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const isLight = theme === 'light';

  const handleRejectDrop = (targetId: string, e?: React.DragEvent) => {
    const sourceId = (e && (e.dataTransfer.getData('application/portfolio-file-id') || e.dataTransfer.getData('text/plain'))) || draggedNodeId;
    const newShaking = new Set<string>();
    if (targetId) newShaking.add(targetId);
    if (sourceId) newShaking.add(sourceId);

    setShakingIds(newShaking);
    playToastSound();
    showToast("you can't change file places in read only mode, don't try or i need to build that also :')");
    setTimeout(() => {
      setShakingIds(new Set());
    }, 480);
  };

  return (
    <div
      className="flex flex-col h-full min-h-0"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(e) => {
        e.preventDefault();
        handleRejectDrop('root-explorer', e);
      }}
    >
      <div className={`flex items-center justify-between px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'
        }`}>
        <span>Explorer</span>
      </div>
      <div className={`flex items-center px-4 py-1 text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'text-[#666666]' : 'text-[#bbbbbb]'
        }`}>
        <span>Portfolio Files</span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 min-h-0">
        {fileTree.map((node) => (
          <FileTreeItem
            key={node.id}
            node={node}
            depth={0}
            shakingIds={shakingIds}
            dragOverId={dragOverId}
            setDragOverId={setDragOverId}
            draggedNodeId={draggedNodeId}
            setDraggedNodeId={setDraggedNodeId}
            onRejectDrop={handleRejectDrop}
          />
        ))}
      </div>
    </div>
  );
}

function SearchPanel() {
  const { searchQuery, setSearchQuery, searchResults, openFile, theme } = usePortfolioStore();
  const isLight = theme === 'light';
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className={`flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'
        }`}>
        Search
      </div>
      <div className="px-2 pb-2 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#858585] pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className={`h-7 text-[13px] pl-7 focus-visible:ring-0 focus-visible:border-[#007fd4] ${isLight
              ? 'bg-white border-[#cecece] text-[#24292f] placeholder:text-[#999999]'
              : 'bg-[#3c3c3c] border-[#3c3c3c] text-[#cccccc] placeholder:text-[#858585]'
              }`}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 text-[13px] min-h-0">
        {searchQuery && searchResults.length === 0 && (
          <p className={`px-2 py-1 ${isLight ? 'text-[#888888]' : 'text-[#858585]'}`}>No results found</p>
        )}
        {searchResults.map((file) => (
          <button
            key={file.id}
            onClick={() => openFile(file)}
            className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-colors ${isLight
              ? 'hover:bg-[#e8e8e8] text-[#24292f]'
              : 'hover:bg-[#2a2d2e] text-[#cccccc]'
              }`}
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
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';
  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className={`flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'
        }`}>
        Source Control
      </div>
      <div className="px-4 py-2">
        <div className={`flex items-center gap-2 text-[13px] mb-3 ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>
          <GitBranch className="w-4 h-4" />
          <span className="font-medium">main</span>
        </div>
        <div className={`text-[11px] font-semibold uppercase mb-2 tracking-wider ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'}`}>
          Changes
        </div>
        <div className={`text-[13px] italic ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>
          Working tree clean
        </div>
        <div className={`mt-4 text-[11px] font-semibold uppercase mb-2 tracking-wider ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'}`}>
          Recent Commits
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-[13px]">
            <GitCommit className="w-3.5 h-3.5 text-[#858585] mt-0.5 flex-shrink-0" />
            <div>
              <p className={isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}>feat: add VS Code themed portfolio</p>
              <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-[13px]">
            <GitCommit className="w-3.5 h-3.5 text-[#858585] mt-0.5 flex-shrink-0" />
            <div>
              <p className={isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}>feat: add terminal with commands</p>
              <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-[13px]">
            <GitCommit className="w-3.5 h-3.5 text-[#858585] mt-0.5 flex-shrink-0" />
            <div>
              <p className={isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}>initial commit: project setup</p>
              <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtensionsPanel() {
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';
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
      <div className={`flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'
        }`}>
        Extensions
      </div>
      <div className="px-2 py-1 flex-shrink-0">
        <Input
          placeholder="Search extensions..."
          className={`h-7 text-[13px] focus-visible:ring-0 focus-visible:border-[#007fd4] ${isLight
            ? 'bg-white border-[#cecece] text-[#24292f] placeholder:text-[#999999]'
            : 'bg-[#3c3c3c] border-[#3c3c3c] text-[#cccccc] placeholder:text-[#858585]'
            }`}
        />
      </div>
      <div className={`px-2 text-[11px] font-semibold uppercase mt-2 mb-1 tracking-wider ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'
        }`}>
        Installed
      </div>
      <div className="space-y-0.5">
        {extensions.map((ext) => (
          <div
            key={ext.name}
            className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded transition-colors ${isLight ? 'hover:bg-[#e8e8e8]' : 'hover:bg-[#2a2d2e]'
              }`}
          >
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: ext.color + '40', color: ext.color }}
            >
              {ext.name[0]}
            </div>
            <div className="min-w-0">
              <p className={`text-[13px] truncate ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>{ext.name}</p>
              <p className={`text-[11px] truncate ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>{ext.publisher}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPanel() {
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';
  const contactItems = [
    { label: 'Email', value: 'mandeep.pc2006@gmail.com', link: 'mailto:mandeep.pc2006@gmail.com', Icon: Mail },
    { label: 'LinkedIn', value: 'linkedin.com/in/mandeepnagar', link: 'https://linkedin.com/in/mandeepnagar', Icon: ExternalLink },
    { label: 'Portfolio', value: 'mandeepiitp.tech', link: 'https://mandeepiitp.tech', Icon: Globe },
    { label: 'Phone', value: '+91 99204 80615', link: 'tel:+919920480615', Icon: Phone },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className={`flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'
        }`}>
        Contact
      </div>
      <div className="px-4 py-2 space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#007fd4] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
            MN
          </div>
          <div className="min-w-0">
            <p className={`text-[13px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Mandeep Nagar</p>
            <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Full Stack Developer</p>
          </div>
        </div>
        {contactItems.map((item) => (
          <div key={item.label}>
            <p className={`text-[11px] uppercase tracking-wider mb-0.5 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>{item.label}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[13px] hover:underline flex items-center gap-1 group font-medium ${isLight ? 'text-[#0060c0]' : 'text-[#3794ff]'
                }`}
            >
              {item.value}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          </div>
        ))}
        <div className={`pt-2 border-t ${isLight ? 'border-[#e0e0e0]' : 'border-[#3c3c3c]'}`}>
          <p className={`text-[11px] uppercase tracking-wider mb-1 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Location</p>
          <p className={`text-[13px] ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Patna, Bihar, India</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] inline-block animate-pulse" />
            <p className="text-[13px] text-[#28c840] font-medium">Open to opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel() {
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className={`flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'
        }`}>
        Profile
      </div>
      <div className="px-4 py-4">
        <div className="flex flex-col items-center mb-5">
          <div className={`w-16 h-16 rounded-full overflow-hidden bg-[#007fd4] flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md ring-2 ring-[#007fd4] ring-offset-2 ${isLight ? 'ring-offset-[#f3f3f3]' : 'ring-offset-[#252526]'
            }`}>
            <Image src="/images/my.png" alt="Profile Picture" height={64} width={64} className="h-full w-full object-cover rounded-full" />
          </div>
          <p className={`text-[15px] font-semibold ${isLight ? 'text-[#111111]' : 'text-white'}`}>Mandeep Nagar</p>
          <p className={`text-[12px] mt-0.5 ${isLight ? 'text-[#666666]' : 'text-[#858585]'}`}>Full Stack Developer</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28c840] inline-block" />
            <span className="text-[11px] text-[#28c840] font-medium">Open to work</span>
          </div>
        </div>

        <div className="mb-4">
          <p className={`text-[11px] uppercase tracking-wider mb-1.5 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>About</p>
          <p className={`text-[12px] leading-relaxed ${isLight ? 'text-[#333333]' : 'text-[#cccccc]'}`}>
            Full Stack Developer building production-ready SaaS applications with Next.js, Express.js, MongoDB, and modern web technologies.
          </p>
        </div>

        <div className="space-y-2.5 mb-4">
          <p className={`text-[11px] uppercase tracking-wider mb-1.5 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Details</p>
          <div className="flex items-center gap-2 text-[12px]">
            <span className={`w-16 flex-shrink-0 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Location</span>
            <span className={isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}>Patna, Bihar, India</span>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className={`w-16 flex-shrink-0 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Email</span>
            <a href="mailto:mandeep.pc2006@gmail.com" className={`hover:underline truncate ${isLight ? 'text-[#0060c0]' : 'text-[#3794ff]'}`}>
              mandeep.pc2006@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className={`w-16 flex-shrink-0 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Website</span>
            <a href="https://mandeepiitp.tech" target="_blank" rel="noopener noreferrer" className={`hover:underline ${isLight ? 'text-[#0060c0]' : 'text-[#3794ff]'}`}>
              mandeepiitp.tech
            </a>
          </div>
        </div>

        <div className="mb-4">
          <p className={`text-[11px] uppercase tracking-wider mb-1.5 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Primary Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {['Next.js', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS', 'Zustand', 'Docker'].map(tech => (
              <span
                key={tech}
                className={`px-2 py-0.5 text-[11px] rounded border ${isLight
                  ? 'bg-white text-[#333333] border-[#d0d0d0]'
                  : 'bg-[#2d2d2d] text-[#cccccc] border-[#3c3c3c]'
                  }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className={`pt-3 border-t ${isLight ? 'border-[#e0e0e0]' : 'border-[#3c3c3c]'}`}>
          <p className={`text-[11px] uppercase tracking-wider mb-2 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Links</p>
          <div className="space-y-1.5">
            <a
              href="https://linkedin.com/in/mandeepnagar"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-[13px] px-2 py-1 rounded transition-colors ${isLight
                ? 'text-[#0060c0] hover:bg-[#e8e8e8]'
                : 'text-[#3794ff] hover:text-white hover:bg-[#2a2d2e]'
                }`}
            >
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              LinkedIn Profile
            </a>
            <a
              href="https://mandeepiitp.tech"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-[13px] px-2 py-1 rounded transition-colors ${isLight
                ? 'text-[#0060c0] hover:bg-[#e8e8e8]'
                : 'text-[#3794ff] hover:text-white hover:bg-[#2a2d2e]'
                }`}
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
  const {
    theme, setTheme,
    editorFontSize, setEditorFontSize,
    showLineNumbers, toggleLineNumbers,
    wordWrap, toggleWordWrap,
    tabSize, setTabSize,
    cursorStyle, setCursorStyle,
    breadcrumbsVisible, toggleBreadcrumbs,
    soundEnabled, toggleSound,
    soundVolume, setSoundVolume,
    startTour, resetSettings, showToast
  } = usePortfolioStore();
  const isLight = theme === 'light';

  const handleClearChat = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('portfolio_chat_history');
      } catch { }
    }
    playToastSound();
    showToast('AI Chat history cleared');
  };

  const handleResetAll = () => {
    resetSettings();
    showToast('Settings reset to defaults');
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      <div className={`flex items-center px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'text-[#555555]' : 'text-[#bbbbbb]'
        }`}>
        Settings
      </div>

      <div className="px-4 py-2 space-y-6">
        <div>
          <p className={`text-[11px] uppercase tracking-wider mb-3 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Appearance</p>
          <div className="space-y-3">
            <div>
              <p className={`text-[12px] mb-2 font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Color Theme</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-[12px] border transition-all cursor-pointer ${theme === 'dark'
                    ? 'bg-[#094771] border-[#007fd4] text-white shadow-sm font-semibold'
                    : isLight
                      ? 'bg-white border-[#d0d0d0] text-[#555555] hover:border-[#007acc] hover:text-[#24292f]'
                      : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#858585] hover:border-[#007fd4] hover:text-[#cccccc]'
                    }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Dark+
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-[12px] border transition-all cursor-pointer ${theme === 'light'
                    ? 'bg-[#007acc] border-[#007acc] text-white shadow-sm font-semibold'
                    : isLight
                      ? 'bg-white border-[#d0d0d0] text-[#555555] hover:border-[#007acc] hover:text-[#24292f]'
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

        <div>
          <p className={`text-[11px] uppercase tracking-wider mb-3 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Editor & Typography</p>
          <div className="space-y-4">
            <div className={`p-2.5 rounded border ${isLight ? 'bg-white border-[#e0e0e0]' : 'bg-[#2d2d2d]/60 border-[#3c3c3c]'}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Editor Font Size</p>
                  <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Scales code, syntax & lines</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[12px] font-mono font-semibold px-2 py-0.5 rounded ${isLight ? 'bg-[#f0f0f0] text-[#0060c0]' : 'bg-[#1e1e1e] text-[#007fd4]'}`}>
                    {editorFontSize}px
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setEditorFontSize(editorFontSize - 1)}
                  disabled={editorFontSize <= 10}
                  className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isLight
                    ? 'bg-[#f4f4f4] border border-[#cecece] text-[#333333] hover:bg-[#e8e8e8]'
                    : 'bg-[#1e1e1e] border border-[#3c3c3c] text-[#cccccc] hover:bg-[#333333]'
                    }`}
                  aria-label="Decrease font size"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  type="range"
                  min="10"
                  max="24"
                  step="1"
                  value={editorFontSize}
                  onChange={(e) => setEditorFontSize(parseInt(e.target.value, 10))}
                  className="flex-1 h-1.5 bg-[#4a4a4a] rounded-lg appearance-none cursor-pointer accent-[#007acc]"
                  aria-label="Font size slider"
                />
                <button
                  type="button"
                  onClick={() => setEditorFontSize(editorFontSize + 1)}
                  disabled={editorFontSize >= 24}
                  className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isLight
                    ? 'bg-[#f4f4f4] border border-[#cecece] text-[#333333] hover:bg-[#e8e8e8]'
                    : 'bg-[#1e1e1e] border border-[#3c3c3c] text-[#cccccc] hover:bg-[#333333]'
                    }`}
                  aria-label="Increase font size"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="flex justify-between items-center text-[10px] opacity-60 font-mono">
                <span>10px (Compact)</span>
                <button
                  type="button"
                  onClick={() => setEditorFontSize(13)}
                  className="hover:underline cursor-pointer opacity-90 text-[#007acc]"
                >
                  Reset (13px)
                </button>
                <span>24px (Large)</span>
              </div>
            </div>

            <div className={`p-2.5 rounded border flex items-center justify-between ${isLight ? 'bg-white border-[#e0e0e0]' : 'bg-[#2d2d2d]/60 border-[#3c3c3c]'
              }`}>
              <div>
                <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Line Numbers</p>
                <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>
                  {showLineNumbers ? 'Numbers visible in editor' : 'Numbers hidden in editor'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleLineNumbers}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex items-center px-0.5 cursor-pointer flex-shrink-0 ${showLineNumbers ? 'bg-[#007acc]' : isLight ? 'bg-[#cccccc]' : 'bg-[#4a4a4a]'
                  }`}
                aria-label="Toggle line numbers"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${showLineNumbers ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            <div className={`p-2.5 rounded border flex items-center justify-between ${isLight ? 'bg-white border-[#e0e0e0]' : 'bg-[#2d2d2d]/60 border-[#3c3c3c]'
              }`}>
              <div>
                <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Word Wrap</p>
                <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>
                  {wordWrap ? 'Wrap long lines to viewport' : 'Horizontal code scrolling'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleWordWrap}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex items-center px-0.5 cursor-pointer flex-shrink-0 ${wordWrap ? 'bg-[#007acc]' : isLight ? 'bg-[#cccccc]' : 'bg-[#4a4a4a]'
                  }`}
                aria-label="Toggle word wrap"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${wordWrap ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            <div className={`p-2.5 rounded border flex items-center justify-between ${isLight ? 'bg-white border-[#e0e0e0]' : 'bg-[#2d2d2d]/60 border-[#3c3c3c]'
              }`}>
              <div>
                <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Breadcrumbs</p>
                <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>
                  {breadcrumbsVisible ? 'File path bar visible' : 'File path bar hidden'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleBreadcrumbs}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex items-center px-0.5 cursor-pointer flex-shrink-0 ${breadcrumbsVisible ? 'bg-[#007acc]' : isLight ? 'bg-[#cccccc]' : 'bg-[#4a4a4a]'
                  }`}
                aria-label="Toggle breadcrumbs"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${breadcrumbsVisible ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>



            <div className={`p-2.5 rounded border ${isLight ? 'bg-white border-[#e0e0e0]' : 'bg-[#2d2d2d]/60 border-[#3c3c3c]'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Cursor Style</p>
                <span className={`text-[11px] font-mono capitalize ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>{cursorStyle === 'none' ? 'Off' : cursorStyle}</span>
              </div>
              <div className="flex gap-1.5">
                {(['line', 'block', 'underline', 'none'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCursorStyle(style)}
                    className={`flex-1 py-1.5 text-xs rounded border capitalize transition-all cursor-pointer ${cursorStyle === style
                      ? 'bg-[#007acc] text-white border-[#007acc] font-semibold shadow-xs'
                      : isLight
                        ? 'bg-[#f4f4f4] text-[#444444] border-[#d0d0d0] hover:bg-[#eaeaea]'
                        : 'bg-[#1e1e1e] text-[#aaaaaa] border-[#3c3c3c] hover:bg-[#333333]'
                      }`}
                  >
                    {style === 'none' ? 'None' : style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className={`text-[11px] uppercase tracking-wider mb-3 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Audio & Effects</p>
          <div className="space-y-4">
            <div className={`p-2.5 rounded border flex items-center justify-between ${isLight ? 'bg-white border-[#e0e0e0]' : 'bg-[#2d2d2d]/60 border-[#3c3c3c]'
              }`}>
              <div>
                <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Sound Effects</p>
                <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>
                  {soundEnabled ? 'UI and typing audio enabled' : 'UI audio muted'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleSound}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex items-center px-0.5 cursor-pointer flex-shrink-0 ${soundEnabled ? 'bg-[#007acc]' : isLight ? 'bg-[#cccccc]' : 'bg-[#4a4a4a]'
                  }`}
                aria-label="Toggle sound effects"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {soundEnabled && (
              <div className={`p-2.5 rounded border ${isLight ? 'bg-white border-[#e0e0e0]' : 'bg-[#2d2d2d]/60 border-[#3c3c3c]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Audio Volume</p>
                  <span className={`text-[12px] font-mono font-medium ${isLight ? 'text-[#0060c0]' : 'text-[#007fd4]'}`}>{soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={soundVolume}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setSoundVolume(val);
                    playClickSound();
                  }}
                  className="w-full h-1.5 bg-[#4a4a4a] rounded-lg appearance-none cursor-pointer accent-[#007acc]"
                  aria-label="Adjust sound volume"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <p className={`text-[11px] uppercase tracking-wider mb-3 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Actions & Diagnostics</p>
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={startTour}
              className={`w-full py-2 px-3 rounded border text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${isLight
                ? 'bg-white border-[#d0d0d0] text-[#333333] hover:bg-[#f0f0f0]'
                : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#cccccc] hover:bg-[#37373d]'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#007acc]" />
              Replay Feature Tour
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              className={`w-full py-2 px-3 rounded border text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${isLight
                ? 'bg-white border-[#d0d0d0] text-[#333333] hover:bg-[#f0f0f0]'
                : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#cccccc] hover:bg-[#37373d]'
                }`}
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-500" />
              Clear AI Chat History
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              className={`w-full py-2 px-3 rounded border text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${isLight
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-rose-950/30 border-rose-800/40 text-rose-400 hover:bg-rose-950/60'
                }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Settings to Defaults
            </button>
          </div>
        </div>

        <div>
          <p className={`text-[11px] uppercase tracking-wider mb-3 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Terminal</p>
          <div className="space-y-3">
            <div className={`p-2.5 rounded border flex items-center justify-between ${isLight ? 'bg-white border-[#e0e0e0]' : 'bg-[#2d2d2d]/60 border-[#3c3c3c]'
              }`}>
              <div>
                <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>Shell</p>
                <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Portfolio Terminal v1.1.0</p>
              </div>
              <AlignJustify className="w-4 h-4 text-[#858585]" />
            </div>
          </div>
        </div>

        <div className={`pt-3 border-t ${isLight ? 'border-[#e0e0e0]' : 'border-[#3c3c3c]'}`}>
          <p className={`text-[11px] uppercase tracking-wider mb-2 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>About</p>
          <p className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>VS Code Portfolio</p>
          <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Version 1.1.0</p>
          <p className={`text-[11px] ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Next.js 16 / React 19 / Turbopack</p>
          <button
            type="button"
            onClick={() => showToast('Built by Mandeep Nagar with Next.js, TypeScript, and Tailwind CSS')}
            className={`mt-2 text-[11px] hover:underline cursor-pointer block ${isLight ? 'text-[#0060c0]' : 'text-[#3794ff]'
              }`}
          >
            View source info
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { activeSidebarPanel, sidebarVisible, sidebarWidth, setSidebarWidth, isMobile, theme, toggleSidebar } = usePortfolioStore();
  const isResizing = useRef(false);
  const isLight = theme === 'light';
  const ACTIVITY_BAR_WIDTH = 48;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
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

  const panelTitles: Record<string, string> = {
    explorer: 'Explorer',
    search: 'Search Files',
    git: 'Source Control (Git)',
    extensions: 'Extensions',
    contact: 'Contact Info',
    profile: 'Developer Profile',
    settings: 'Settings & Themes',
    assistant: 'Gemini AI Copilot',
    feedback: 'Reviews & Feedback',
  };

  const sidebarContent = (
    <div
      className={`flex-shrink-0 flex flex-col h-full overflow-hidden border-r transition-colors duration-150 ${isLight ? 'bg-[#f3f3f3] border-[#e4e4e4]' : 'bg-[#252526] border-[#1e1e1e]'
        }`}
      style={{ width: isMobile ? '100%' : sidebarWidth }}
    >
      {isMobile && (
        <div className={`flex items-center justify-between px-3.5 py-2.5 border-b flex-shrink-0 ${isLight ? 'bg-[#e8e8e8] border-[#d8d8d8]' : 'bg-[#1e1e1e] border-[#2d2d2d]'
          }`}>
          <span className={`text-[12.5px] font-semibold uppercase tracking-wider ${isLight ? 'text-[#24292f]' : 'text-[#e0e0e0]'}`}>
            {panelTitles[activeSidebarPanel] || activeSidebarPanel}
          </span>
          <button
            type="button"
            onClick={toggleSidebar}
            className={`p-1.5 rounded-md transition-colors cursor-pointer active:scale-95 ${isLight ? 'hover:bg-[#d0d0d0] text-[#333333]' : 'hover:bg-[#3c3c3c] text-[#cccccc]'
              }`}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {activeSidebarPanel === 'explorer' && <ExplorerPanel />}
      {activeSidebarPanel === 'search' && <SearchPanel />}
      {activeSidebarPanel === 'git' && <GitPanel />}
      {activeSidebarPanel === 'extensions' && <ExtensionsPanel />}
      {activeSidebarPanel === 'contact' && <ContactPanel />}
      {activeSidebarPanel === 'profile' && <ProfilePanel />}
      {activeSidebarPanel === 'settings' && <SettingsPanel />}
      {activeSidebarPanel === 'assistant' && <AssistantPanel />}
      {activeSidebarPanel === 'feedback' && <FeedbackPanel />}
    </div>
  );

  if (isMobile) {
    if (!sidebarVisible) return null;
    return (
      <>
        <div
          className="fixed inset-0 bg-black/60 z-40 animate-fadeIn backdrop-blur-[1px]"
          onClick={toggleSidebar}
        />
        <div
          className={`fixed left-0 top-0 bottom-[48px] w-[86vw] max-w-[340px] z-50 animate-slideInLeft shadow-2xl overflow-hidden rounded-r-xl border-r ${isLight ? 'border-[#d0d0d0]' : 'border-[#3c3c3c]'
            }`}
          style={{ willChange: 'transform' }}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden flex-shrink-0 ${sidebarVisible ? 'opacity-100' : 'max-w-0 opacity-0 pointer-events-none'
          }`}
        style={{ width: sidebarVisible ? sidebarWidth : 0 }}
      >
        {sidebarContent}
      </div>
      {sidebarVisible && (
        <div
          onMouseDown={handleMouseDown}
          className="w-1 cursor-col-resize hover:bg-[#007fd4] active:bg-[#007fd4] transition-colors flex-shrink-0 relative z-10"
        />
      )}
    </>
  );
}