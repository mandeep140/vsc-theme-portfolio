'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X, Eye, Code, Sparkles, FolderKanban, Terminal as TerminalIcon,
  Mail, Sliders, Settings, FileCode, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus, vs,
  oneDark, dracula, okaidia,
  solarizedDarkAtom, solarizedlight,
  nord, gruvboxDark, gruvboxLight,
  materialDark, materialLight, materialOceanic,
  nightOwl, synthwave84, lucario,
  atomDark, shadesOfPurple, tomorrow, oneLight,
  darcula, a11yDark, base16AteliersulphurpoolLight,
  coldarkDark, coldarkCold, xonokai, duotoneDark, duotoneEarth, duotoneLight, coy, twilight,
  ghcolors,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { usePortfolioStore } from '@/store/portfolio-store';
import { findFileById, fileTree } from '@/data/portfolio-data';
import Image from 'next/image';
import WelcomeStats from './WelcomeStats';
import { playClickSound } from '@/lib/sound';

function EditorTabs() {
  const {
    openTabs,
    activeTabId,
    setActiveTab,
    closeTab,
    reorderTabs,
    isMobile,
    theme,
    colorTheme,
  } = usePortfolioStore();

  const isLight =
    theme === 'light' ||
    colorTheme.includes('light') ||
    colorTheme.endsWith('-latte') ||
    colorTheme.endsWith('-dawn');

  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth pointer-based drag reordering (zero conflicts with editor text selection or click events)
  const dragRef = useRef<{
    startX: number;
    startIndex: number;
    tabId: string;
    isDragging: boolean;
  } | null>(null);

  const [dragState, setDragState] = useState<{
    fromIndex: number;
    targetIndex: number;
  } | null>(null);

  // Auto-scroll active tab into view whenever activeTabId changes
  useEffect(() => {
    if (activeTabId && containerRef.current) {
      const activeEl = containerRef.current.querySelector<HTMLElement>(`[data-tab-id="${activeTabId}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }, [activeTabId]);

  // Window listener to cleanly finish drag if cursor releases anywhere
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (dragRef.current?.isDragging && dragState) {
        if (dragState.fromIndex !== dragState.targetIndex) {
          reorderTabs(dragState.fromIndex, dragState.targetIndex);
          playClickSound();
        }
      }
      dragRef.current = null;
      setDragState(null);
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [dragState, reorderTabs]);

  // Horizontal mouse wheel scrolling for seamless browsing of many tabs
  const handleWheel = (e: React.WheelEvent) => {
    if (containerRef.current && e.deltaY !== 0) {
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handlePointerDown = (index: number, tabId: string, e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    dragRef.current = {
      startX: e.clientX,
      startIndex: index,
      tabId,
      isDragging: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;

    if (!dragRef.current.isDragging) {
      if (Math.abs(dx) > 7) {
        dragRef.current.isDragging = true;
      } else {
        return;
      }
    }

    if (containerRef.current) {
      const tabElements = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-tab-index]')
      );
      let targetIdx = dragRef.current.startIndex;
      for (const el of tabElements) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          targetIdx = parseInt(el.getAttribute('data-tab-index') || '0', 10);
          break;
        } else if (e.clientX > rect.right) {
          targetIdx = parseInt(el.getAttribute('data-tab-index') || '0', 10);
        }
      }
      setDragState({
        fromIndex: dragRef.current.startIndex,
        targetIndex: targetIdx,
      });
    }
  };

  const handlePointerUp = (index: number, tabId: string, e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const wasDragging = dragRef.current.isDragging;
    dragRef.current = null;

    if (wasDragging && dragState && dragState.fromIndex !== dragState.targetIndex) {
      reorderTabs(dragState.fromIndex, dragState.targetIndex);
      playClickSound();
    } else if (!wasDragging) {
      playClickSound();
      setActiveTab(tabId);
    }
    setDragState(null);
  };

  if (openTabs.length === 0) return null;

  return (
    <div
      ref={containerRef}
      data-panel="tab-bar"
      onWheel={handleWheel}
      onPointerMove={handlePointerMove}
      className={`flex items-center border-b overflow-x-auto overflow-y-hidden flex-shrink-0 transition-colors duration-150 scroll-smooth select-none ${
        isLight ? 'bg-[#f3f3f3] border-[#e4e4e4]' : 'bg-[#252526] border-[#1e1e1e]'
      }`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {openTabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        const isBeingDragged = dragState?.fromIndex === index;
        const isDropTarget = dragState?.targetIndex === index && dragState.fromIndex !== index;
        const isTargetAfter = isDropTarget && dragState.fromIndex < index;
        const isTargetBefore = isDropTarget && dragState.fromIndex > index;

        return (
          <div
            key={tab.id}
            data-tab-id={tab.id}
            data-tab-index={index}
            onPointerDown={(e) => handlePointerDown(index, tab.id, e)}
            onPointerUp={(e) => handlePointerUp(index, tab.id, e)}
            className={`group relative flex items-center gap-1.5 h-[35px] px-2 md:px-2.5 border-r cursor-pointer flex-shrink-0 transition-all duration-75 select-none ${
              isBeingDragged
                ? isLight
                  ? 'opacity-40 bg-[#e0e0e0] shadow-inner'
                  : 'opacity-40 bg-[#161616] shadow-inner'
                : 'opacity-100'
            } ${
              isActive
                ? isLight
                  ? 'bg-white border-t-[2px] border-t-[#007acc] border-r-[#e4e4e4] text-[#111111] font-medium shadow-xs'
                  : 'bg-[#1e1e1e] border-t-[2px] border-t-white border-r-[#252526] text-white font-medium'
                : isLight
                  ? 'bg-[#ececec] border-t-[2px] border-t-transparent border-r-[#e4e4e4] text-[#555555] hover:bg-[#e0e0e0]'
                  : 'bg-[#2d2d2d] border-t-[2px] border-t-transparent border-r-[#252526] text-[#969696] hover:bg-[#2a2a2a]'
            }`}
            style={{
              minWidth: isMobile ? '110px' : '140px',
              maxWidth: isMobile ? '160px' : '220px',
            }}
          >
            {/* Live drop target insertion indicator */}
            {isTargetBefore && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#007acc] z-30 pointer-events-none animate-pulse" />
            )}
            {isTargetAfter && (
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#007acc] z-30 pointer-events-none animate-pulse" />
            )}

            {/* Quick 1-click move left button on hover */}
            {openTabs.length > 1 && index > 0 && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  reorderTabs(index, index - 1);
                }}
                className={`p-0.5 rounded opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity cursor-pointer ${
                  isLight ? 'hover:bg-[#d8d8d8] text-[#555]' : 'hover:bg-[#404040] text-[#aaa]'
                }`}
                title="Move tab left (Alt+Left)"
                aria-label="Move tab left"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            )}

            <span
              className={`text-[11px] font-bold flex-shrink-0 ${
                tab.language === 'tsx'
                  ? 'text-[#519aba]'
                  : tab.language === 'typescript'
                    ? 'text-[#519aba]'
                    : tab.language === 'markdown'
                      ? 'text-[#519aba]'
                      : tab.language === 'binary'
                        ? 'text-[#a074c4]'
                        : 'text-[#858585]'
              }`}
            >
              {tab.language === 'typescript'
                ? 'TS'
                : tab.language === 'tsx'
                  ? 'TSX'
                  : tab.language === 'markdown'
                    ? 'MD'
                    : tab.language === 'binary'
                      ? 'PDF'
                      : 'JS'}
            </span>
            <span className="truncate text-[12px] md:text-[13px] flex-1 pointer-events-none">{tab.name}</span>

            {/* Quick 1-click move right button on hover */}
            {openTabs.length > 1 && index < openTabs.length - 1 && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  reorderTabs(index, index + 1);
                }}
                className={`p-0.5 rounded opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity cursor-pointer ${
                  isLight ? 'hover:bg-[#d8d8d8] text-[#555]' : 'hover:bg-[#404040] text-[#aaa]'
                }`}
                title="Move tab right (Alt+Right)"
                aria-label="Move tab right"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                closeTab(tab.id);
              }}
              className={`p-0.5 rounded ml-0.5 transition-all flex-shrink-0 cursor-pointer ${
                isActive
                  ? isLight
                    ? 'opacity-70 hover:opacity-100 hover:bg-[#e0e0e0]'
                    : 'opacity-70 hover:opacity-100 hover:bg-[#404040]'
                  : isLight
                    ? 'opacity-0 group-hover:opacity-100 hover:bg-[#dedede]'
                    : 'opacity-0 group-hover:opacity-100 hover:bg-[#404040]'
              }`}
              aria-label={`Close ${tab.name}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Per-theme syntax highlighter configuration
type ThemeConfig = { style: Record<string, React.CSSProperties>; bg: string; lineNumColor: string; };

const THEME_CONFIGS: Record<string, ThemeConfig> = {
  // Dark Themes
  'dark':               { style: vscDarkPlus,        bg: '#1e1e1e', lineNumColor: '#858585' },
  'one-dark-pro':       { style: oneDark,             bg: '#282c34', lineNumColor: '#5c6370' },
  'dracula':            { style: dracula,             bg: '#282a36', lineNumColor: '#6272a4' },
  'monokai':            { style: okaidia,             bg: '#272822', lineNumColor: '#75715e' },
  'solarized-dark':     { style: solarizedDarkAtom,   bg: '#002b36', lineNumColor: '#586e75' },
  'github-dark':        { style: coldarkDark,         bg: '#0d1117', lineNumColor: '#7d8590' },
  'catppuccin-mocha':   { style: atomDark,            bg: '#1e1e2e', lineNumColor: '#6c7086' },
  'nord':               { style: nord,               bg: '#2e3440', lineNumColor: '#616e88' },
  'tokyo-night':        { style: materialOceanic,     bg: '#1a1b26', lineNumColor: '#565f89' },
  'tokyo-night-storm':  { style: duotoneDark,         bg: '#24283b', lineNumColor: '#565f89' },
  'gruvbox':            { style: gruvboxDark,         bg: '#282828', lineNumColor: '#928374' },
  'ayu-mirage':         { style: darcula,             bg: '#1f2430', lineNumColor: '#707a8c' },
  'material-dark':      { style: materialDark,        bg: '#212121', lineNumColor: '#546e7a' },
  'cobalt2':            { style: lucario,             bg: '#193549', lineNumColor: '#5a7796' },
  'night-owl':          { style: nightOwl,            bg: '#011627', lineNumColor: '#4b6479' },
  'synthwave84':        { style: synthwave84,         bg: '#2b213a', lineNumColor: '#848bbd' },
  'rose-pine':          { style: a11yDark,            bg: '#191724', lineNumColor: '#6e6a86' },
  'shades-of-purple':   { style: shadesOfPurple,      bg: '#2d2b55', lineNumColor: '#8b8b9e' },
  'tomorrow-night':     { style: tomorrow,            bg: '#1d1f21', lineNumColor: '#969896' },
  'palenight':          { style: xonokai,             bg: '#292d3e', lineNumColor: '#676e95' },
  'horizon':            { style: coldarkCold,         bg: '#1c1e26', lineNumColor: '#6c6f93' },
  'abyss':              { style: twilight,            bg: '#000c18', lineNumColor: '#445577' },
  'red':                { style: duotoneEarth,        bg: '#390000', lineNumColor: '#aa6666' },

  // Light Themes
  'light':              { style: vs,                 bg: '#ffffff', lineNumColor: '#9e9e9e' },
  'github-light':       { style: ghcolors,           bg: '#ffffff', lineNumColor: '#57606a' },
  'solarized-light':    { style: solarizedlight,      bg: '#fdf6e3', lineNumColor: '#93a1a1' },
  'catppuccin-latte':   { style: base16AteliersulphurpoolLight, bg: '#eff1f5', lineNumColor: '#6c6f85' },
  'one-light':          { style: oneLight,            bg: '#fafafa', lineNumColor: '#696c77' },
  'quiet-light':        { style: materialLight,       bg: '#f5f3f4', lineNumColor: '#706b6e' },
  'gruvbox-light':      { style: gruvboxLight,        bg: '#fbf1c7', lineNumColor: '#7c6f64' },
  'rose-pine-dawn':     { style: duotoneLight,        bg: '#faf4ed', lineNumColor: '#797593' },
  'ayu-light':          { style: coy,                 bg: '#fafafa', lineNumColor: '#828a9a' },
};

function getThemeConfig(colorTheme: string): ThemeConfig {
  return THEME_CONFIGS[colorTheme] ?? THEME_CONFIGS['dark'];
}

function HighlightedCode({ content, language }: { content: string; language?: string }) {
  const { editorFontSize, showLineNumbers, wordWrap, cursorStyle, colorTheme } = usePortfolioStore();
  const lineHeight = Math.round(editorFontSize * 1.62);
  const minLineNumberWidth = Math.max(46, Math.round(editorFontSize * 3.4));
  const gutterWidth = showLineNumbers ? minLineNumberWidth + 16 : 16;
  const charWidth = editorFontSize * 0.602;

  const lines = content.split('\n');

  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: gutterWidth,
    y: 16,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const themeConfig = getThemeConfig(colorTheme);
  const { style: syntaxStyle, bg: bgColor, lineNumColor } = themeConfig;

  const normalizedLanguage =
    language === 'tsx'
      ? 'tsx'
      : language === 'typescript'
        ? 'typescript'
        : language === 'markdown'
          ? 'markdown'
          : language || 'typescript';

  const handleCodeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const clickY = e.clientY - rect.top + containerRef.current.scrollTop;

    const lineIdx = Math.max(0, Math.min(lines.length - 1, Math.floor((clickY - 16) / lineHeight)));
    const lineText = lines[lineIdx] || '';
    const colIdx = Math.max(0, Math.min(lineText.length, Math.round((clickX - gutterWidth) / charWidth)));

    const targetX = gutterWidth + colIdx * charWidth;
    const targetY = 16 + lineIdx * lineHeight;

    setCursorPos({ x: targetX, y: targetY });
  };

  const isCursorVisible = cursorStyle !== 'none';
  const cursorBlockWidth = Math.max(8, Math.round(editorFontSize * 0.58));

  return (
    <div
      ref={containerRef}
      onClick={handleCodeClick}
      data-panel="code-view"
      className="flex-1 min-h-0 overflow-auto relative cursor-text animate-fadeIn"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative min-w-full inline-block min-h-full">
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={syntaxStyle}
          showLineNumbers={showLineNumbers}
          wrapLines={wordWrap}
          wrapLongLines={wordWrap}
          lineNumberStyle={{
            minWidth: `${minLineNumberWidth}px`,
            paddingRight: '16px',
            paddingLeft: '12px',
            color: lineNumColor,
            textAlign: 'right',
            userSelect: 'none',
            fontSize: `${editorFontSize}px`,
            lineHeight: `${lineHeight}px`,
            fontFamily: 'Menlo, Monaco, "SF Mono", Consolas, "Liberation Mono", "Courier New", monospace',
          }}
          customStyle={{
            margin: 0,
            padding: showLineNumbers ? `16px 16px 16px 0` : '16px',
            background: bgColor,
            fontSize: `${editorFontSize}px`,
            lineHeight: `${lineHeight}px`,
            fontFamily: 'Menlo, Monaco, "SF Mono", Consolas, "Liberation Mono", "Courier New", monospace',
            width: '100%',
            overflow: 'visible',
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
            wordBreak: wordWrap ? 'break-word' : 'normal',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'Menlo, Monaco, "SF Mono", Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: `${editorFontSize}px`,
              lineHeight: `${lineHeight}px`,
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-word' : 'normal',
            },
          }}
        >
          {content}
        </SyntaxHighlighter>

        {isCursorVisible && (
          <span
            className="editor-blinking-cursor absolute pointer-events-none"
            style={{
              backgroundColor: '#aeafad',
              width: cursorStyle === 'block' ? `${cursorBlockWidth}px` : cursorStyle === 'underline' ? `${cursorBlockWidth}px` : '2px',
              height: cursorStyle === 'underline' ? '2px' : `${lineHeight - 2}px`,
              left: `${cursorPos.x}px`,
              top: cursorStyle === 'underline' ? `${cursorPos.y + lineHeight - 3}px` : `${cursorPos.y + 1}px`,
              opacity: cursorStyle === 'block' ? 0.65 : 1,
            }}
          />
        )}
      </div>
    </div>
  );
}

function renderMarkdown(md: string, isLight: boolean): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const bqBorder = isLight ? '#007acc' : '#007acc';
  const bqColor = isLight ? '#555555' : '#858585';
  const codeBg = isLight ? '#f0f0f0' : '#2d2d2d';
  const codeColor = isLight ? '#b83b19' : '#ce9178';
  const headingColor = isLight ? '#1f2328' : '#ffffff';
  const subHeadingColor = isLight ? '#24292f' : '#cccccc';
  const hrColor = isLight ? '#e1e4e8' : '#404040';

  html = html.replace(
    /^> (.+)$/gm,
    `<blockquote style="border-left:3px solid ${bqBorder};padding-left:12px;color:${bqColor};margin:8px 0">$1</blockquote>`
  );
  html = html.replace(
    /```([\s\S]*?)```/g,
    `<pre style="background:${codeBg};padding:12px;border-radius:4px;overflow-x:auto;margin:12px 0;font-family:monospace;font-size:13px;line-height:1.5"><code>$1</code></pre>`
  );
  html = html.replace(
    /`([^`]+)`/g,
    `<code style="background:${codeBg};padding:1px 5px;border-radius:3px;font-family:monospace;font-size:13px;color:${codeColor}">$1</code>`
  );
  html = html.replace(
    /^### (.+)$/gm,
    `<h3 style="font-size:16px;font-weight:600;margin:16px 0 8px;color:${subHeadingColor};border-bottom:1px solid ${hrColor};padding-bottom:4px">$1</h3>`
  );
  html = html.replace(
    /^## (.+)$/gm,
    `<h2 style="font-size:18px;font-weight:600;margin:20px 0 10px;color:${subHeadingColor};border-bottom:1px solid ${hrColor};padding-bottom:6px">$1</h2>`
  );
  html = html.replace(
    /^# (.+)$/gm,
    `<h1 style="font-size:22px;font-weight:700;margin:24px 0 12px;color:${headingColor}">$1</h1>`
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:600">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/^---$/gm, `<hr style="border:none;border-top:1px solid ${hrColor};margin:16px 0" />`);
  html = html.replace(/^- (.+)$/gm, '<li style="margin-left:16px;list-style:disc">$1</li>');
  html = html.replace(
    /(<li[^>]*>.*<\/li>\n?)+/g,
    (match) => `<ul style="margin:8px 0;padding-left:8px">${match}</ul>`
  );
  html = html.replace(
    /^(?!<[hupbodil]|<hr|<li|<ul|<blockquote|<pre|<code|<strong|<em)(.+)$/gm,
    '<p style="margin:4px 0">$1</p>'
  );
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#007acc;text-decoration:none">$1</a>'
  );

  return html;
}

function MarkdownPreview({ content }: { content: string }) {
  const { theme, editorFontSize } = usePortfolioStore();
  const isLight = theme === 'light';
  const html = renderMarkdown(content, isLight);

  return (
    <div
      className={`flex-1 min-h-0 overflow-auto p-6 md:p-10 leading-relaxed transition-colors duration-150 ${isLight ? 'bg-white text-[#24292f]' : 'bg-[#1e1e1e] text-[#cccccc]'
        }`}
      style={{ fontSize: `${editorFontSize}px`, lineHeight: 1.65 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function ImagePreview({ file }: { file: { name: string; id: string } }) {
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';

  const isPdf = file.name.endsWith('.pdf');
  const isImageFile =
    file.name.endsWith('.png') ||
    file.name.endsWith('.jpg') ||
    file.name.endsWith('.jpeg') ||
    file.name.endsWith('.gif') ||
    file.name.endsWith('.webp');

  const filePath = isPdf ? `/files/${file.name}` : `/images/${file.name}`;

  if (isPdf) {
    return (
      <div
        className={`flex-1 min-h-0 overflow-hidden flex flex-col ${isLight ? 'bg-[#f8f8f8]' : 'bg-[#1e1e1e]'}`}
      >
        <div className={`flex items-center gap-3 px-4 py-2 border-b flex-shrink-0 ${isLight ? 'bg-[#f3f3f3] border-[#e4e4e4]' : 'bg-[#252526] border-[#1e1e1e]'}`}>
          <span className={`text-[12px] font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>{file.name}</span>
          <a
            href={filePath}
            download={file.name}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium bg-[#007acc] text-white hover:bg-[#005f9e] transition-colors cursor-pointer"
          >
            Download Resume
          </a>
          <a
            href={filePath}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${isLight ? 'border-[#d0d0d0] text-[#333333] hover:border-[#007acc] hover:text-[#007acc]' : 'border-[#3c3c3c] text-[#cccccc] hover:border-[#007fd4] hover:text-white'}`}
          >
            Open in new tab
          </a>
        </div>
        <embed
          src={filePath}
          type="application/pdf"
          className="flex-1 w-full min-h-0"
        />
      </div>
    );
  }

  if (isImageFile) {
    return (
      <div
        className={`flex-1 min-h-0 overflow-auto flex items-center justify-center p-4 ${isLight ? 'bg-[#f8f8f8]' : 'bg-[#1e1e1e]'
          }`}
      >
        <img
          src={filePath}
          alt={file.name}
          className="max-w-full max-h-full object-contain rounded shadow-sm"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex-1 min-h-0 overflow-auto flex items-center justify-center ${isLight ? 'bg-white' : 'bg-[#1e1e1e]'
        }`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={`w-40 h-40 rounded-lg flex items-center justify-center border shadow-sm ${isLight
            ? 'bg-[#f0f0f0] border-[#d8d8d8] text-[#333333]'
            : 'bg-[#2d2d30] border-[#3c3c3c] text-white'
            }`}
        >
          <span className="text-3xl font-bold opacity-80">FILE</span>
        </div>
        <div>
          <p className={`text-sm font-medium ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>{file.name}</p>
          <p className={`text-xs mt-1 ${isLight ? 'text-[#777777]' : 'text-[#858585]'}`}>Binary asset</p>
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs({ path }: { path: string[] }) {
  const { theme, breadcrumbsVisible } = usePortfolioStore();
  const isLight = theme === 'light';

  if (!breadcrumbsVisible) return null;

  return (
    <div
      data-panel="breadcrumb"
      className={`flex items-center gap-1 px-3 md:px-4 py-1 text-[12px] flex-shrink-0 overflow-x-auto scrollbar-hide border-b transition-colors duration-150 ${isLight
        ? 'bg-white border-[#e4e4e4] text-[#6e7781]'
        : 'bg-[#1e1e1e] border-[#252526] text-[#858585]'
        }`}
    >
      {path.map((segment, i) => (
        <span key={i} className="flex items-center gap-1 flex-shrink-0">
          {i > 0 && <span className={isLight ? 'text-[#999999]' : 'text-[#666666]'}>/</span>}
          <span
            className={
              i === path.length - 1
                ? isLight
                  ? 'text-[#24292f] font-medium'
                  : 'text-[#cccccc] font-medium'
                : isLight
                  ? 'hover:text-[#24292f] cursor-pointer'
                  : 'hover:text-[#cccccc] cursor-pointer'
            }
          >
            {segment}
          </span>
        </span>
      ))}
    </div>
  );
}

function EmptyEditor() {
  const {
    toggleSidebar,
    toggleTerminal,
    isMobile,
    theme,
    startTour,
    setActiveSidebarPanel,
    sidebarVisible,
    openFile,
    toggleCommandPalette,
  } = usePortfolioStore();
  const isLight = theme === 'light';

  const handleOpenPanel = (panel: 'assistant' | 'feedback' | 'contact' | 'settings' | 'explorer') => {
    playClickSound();
    setActiveSidebarPanel(panel);
  };

  const handleOpenFileByName = (fileName: string) => {
    playClickSound();
    const allFiles = (function flatten(nodes: typeof fileTree): (typeof fileTree) {
      return nodes.flatMap((n) => (n.type === 'file' ? [n] : n.children ? flatten(n.children) : []));
    })(fileTree);

    const target = allFiles.find((f) => f.name.toLowerCase() === fileName.toLowerCase() || f.id.includes(fileName));
    if (target) openFile(target);
  };

  return (
    <div
      className={`relative flex-1 min-h-0 overflow-y-auto p-4 md:p-8 flex items-center justify-center transition-colors duration-150 animate-fadeIn select-none ${isLight ? 'bg-white text-[#24292f]' : 'bg-[#1e1e1e] text-[#cccccc]'
        }`}
    >
      <button
        type="button"
        onClick={startTour}
        className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border hover:-translate-y-0.5 active:scale-95 shadow-xs ${isLight
          ? 'bg-[#f8f8f8] border-[#d8d8d8] text-[#333333] hover:border-[#007acc] hover:text-[#007acc]'
          : 'bg-[#252526] border-[#3c3c3c] text-[#cccccc] hover:border-[#007fd4] hover:text-white'
          }`}
        title="Start Interactive Feature Tour"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#007acc]" />
        <span>Feature Tour</span>
      </button>

      <div className="w-full max-w-2xl mx-auto my-auto py-2 text-center">
        <div className="mb-6">
          <h1 className={`text-xl md:text-2xl font-bold tracking-tight mb-1 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
            Mandeep Nagar
          </h1>
          <p className={`text-xs md:text-sm font-medium mb-3 ${isLight ? 'text-[#555555]' : 'text-[#969696]'}`}>
            Full Stack Web Developer
          </p>

          <div className="flex justify-center">
            <WelcomeStats isLight={isLight} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-6 text-left">
          <button
            type="button"
            onClick={() => handleOpenFileByName('index.ts')}
            className={`group p-3 rounded-xl border transition-all duration-150 cursor-pointer active:scale-98 ${isLight
              ? 'bg-[#fafafa] border-[#e4e4e4] hover:bg-[#f0f0f0] hover:border-[#007acc]/50'
              : 'bg-[#252526] border-[#333333] hover:bg-[#2d2d2d] hover:border-[#007fd4]/50'
              }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FolderKanban className="w-4 h-4 text-[#007acc] group-hover:scale-110 transition-transform" />
              <span className="text-[12.5px] font-semibold">Index</span>
            </div>
            <p className={`text-[11px] leading-tight ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
              Always start with index file
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPanel('assistant')}
            className={`group p-3 rounded-xl border transition-all duration-150 cursor-pointer active:scale-98 ${isLight
              ? 'bg-[#fafafa] border-[#e4e4e4] hover:bg-[#f0f0f0] hover:border-[#007acc]/50'
              : 'bg-[#252526] border-[#333333] hover:bg-[#2d2d2d] hover:border-[#007fd4]/50'
              }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#007acc] group-hover:scale-110 transition-transform" />
              <span className="text-[12.5px] font-semibold">AI Copilot</span>
            </div>
            <p className={`text-[11px] leading-tight ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
              Ask Gemini AI assistant
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              toggleTerminal();
            }}
            className={`group p-3 rounded-xl border transition-all duration-150 cursor-pointer active:scale-98 ${isLight
              ? 'bg-[#fafafa] border-[#e4e4e4] hover:bg-[#f0f0f0] hover:border-[#007acc]/50'
              : 'bg-[#252526] border-[#333333] hover:bg-[#2d2d2d] hover:border-[#007fd4]/50'
              }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TerminalIcon className="w-4 h-4 text-[#007acc] group-hover:scale-110 transition-transform" />
              <span className="text-[12.5px] font-semibold">Terminal</span>
            </div>
            <p className={`text-[11px] leading-tight ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
              Built-in command shell
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              toggleCommandPalette();
            }}
            className={`group p-3 rounded-xl border transition-all duration-150 cursor-pointer active:scale-98 ${isLight
              ? 'bg-[#fafafa] border-[#e4e4e4] hover:bg-[#f0f0f0] hover:border-[#007acc]/50'
              : 'bg-[#252526] border-[#333333] hover:bg-[#2d2d2d] hover:border-[#007fd4]/50'
              }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-[#007acc] group-hover:scale-110 transition-transform" />
              <span className="text-[12.5px] font-semibold">Commands</span>
            </div>
            <p className={`text-[11px] leading-tight ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
              Quick command palette
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPanel('contact')}
            className={`group p-3 rounded-xl border transition-all duration-150 cursor-pointer active:scale-98 ${isLight
              ? 'bg-[#fafafa] border-[#e4e4e4] hover:bg-[#f0f0f0] hover:border-[#007acc]/50'
              : 'bg-[#252526] border-[#333333] hover:bg-[#2d2d2d] hover:border-[#007fd4]/50'
              }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-[#007acc] group-hover:scale-110 transition-transform" />
              <span className="text-[12.5px] font-semibold">Contact</span>
            </div>
            <p className={`text-[11px] leading-tight ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
              Get in touch directly
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPanel('settings')}
            className={`group p-3 rounded-xl border transition-all duration-150 cursor-pointer active:scale-98 ${isLight
              ? 'bg-[#fafafa] border-[#e4e4e4] hover:bg-[#f0f0f0] hover:border-[#007acc]/50'
              : 'bg-[#252526] border-[#333333] hover:bg-[#2d2d2d] hover:border-[#007fd4]/50'
              }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-[#007acc] group-hover:scale-110 transition-transform" />
              <span className="text-[12.5px] font-semibold">Settings</span>
            </div>
            <p className={`text-[11px] leading-tight ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
              Themes & preferences
            </p>
          </button>
        </div>

        <div>
          <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2.5 opacity-60 ${isLight ? 'text-[#333333]' : 'text-[#cccccc]'}`}>
            Featured Source Files
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            {['index.ts', 'skills.ts', 'contact.ts'].map((fileName) => (
              <button
                key={fileName}
                type="button"
                onClick={() => handleOpenFileByName(fileName)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-[11px] transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95 ${isLight
                  ? 'bg-[#f4f4f4] border-[#d8d8d8] text-[#24292f] hover:border-[#007acc] hover:text-[#007acc]'
                  : 'bg-[#252526] border-[#3c3c3c] text-[#cccccc] hover:border-[#007fd4] hover:text-white'
                  }`}
              >
                <FileCode className="w-3 h-3 text-[#519aba]" />
                <span>{fileName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPanel() {
  const { activeTabId, openTabs, mdPreviewMode, toggleMdPreview, theme, openFile } = usePortfolioStore();
  const [isDragOverEditor, setIsDragOverEditor] = useState(false);
  const isLight = theme === 'light';

  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const file = activeTabId ? findFileById(fileTree, activeTabId) : null;

  const isMarkdown = file?.language === 'markdown' && file.content;
  const isBinary = file?.language === 'binary' || file?.language === 'pdf';
  const showPreview = isMarkdown && mdPreviewMode;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverEditor(false);
    const fileId = e.dataTransfer.getData('application/portfolio-file-id') || e.dataTransfer.getData('text/plain');
    if (fileId) {
      const targetFile = findFileById(fileTree, fileId);
      if (targetFile && targetFile.type === 'file') {
        playClickSound();
        openFile(targetFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOverEditor) setIsDragOverEditor(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOverEditor(false);
  };

  return (
    <div
      data-panel="editor"
      onDragOver={handleDragOver}
      onDragEnter={() => setIsDragOverEditor(true)}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden transition-all duration-150 ${isDragOverEditor
        ? isLight
          ? 'bg-[#e6f4ff] ring-2 ring-inset ring-[#007acc]'
          : 'bg-[#002f5e]/30 ring-2 ring-inset ring-[#007acc]'
        : isLight
          ? 'bg-white'
          : 'bg-[#1e1e1e]'
        }`}
    >
      {isDragOverEditor && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#007acc]/10 backdrop-blur-[2px] animate-fadeIn">
          <div className="px-4 py-2 rounded-lg bg-[#007acc] text-white text-xs font-mono font-medium shadow-xl border border-white/20 animate-scaleIn">
            Drop file to open in Editor
          </div>
        </div>
      )}
      <EditorTabs />
      {activeTab && activeTab.path.length > 0 && <Breadcrumbs path={activeTab.path} />}
      {isMarkdown && (
        <div
          className={`flex items-center gap-1 px-3 py-1 border-b flex-shrink-0 transition-colors duration-150 ${isLight ? 'bg-[#f3f3f3] border-[#e4e4e4]' : 'bg-[#2d2d2d] border-[#252526]'
            }`}
        >
          <button
            type="button"
            onClick={() => {
              if (mdPreviewMode) toggleMdPreview();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[12px] font-medium transition-colors cursor-pointer ${!mdPreviewMode
              ? isLight
                ? 'bg-white text-black shadow-xs border border-[#d0d0d0]'
                : 'bg-[#1e1e1e] text-white'
              : isLight
                ? 'text-[#6e7781] hover:text-[#111111]'
                : 'text-[#858585] hover:text-[#cccccc]'
              }`}
          >
            <Code className="w-3.5 h-3.5" /> Source
          </button>
          <button
            type="button"
            onClick={() => {
              if (!mdPreviewMode) toggleMdPreview();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[12px] font-medium transition-colors cursor-pointer ${mdPreviewMode
              ? isLight
                ? 'bg-white text-black shadow-xs border border-[#d0d0d0]'
                : 'bg-[#1e1e1e] text-white'
              : isLight
                ? 'text-[#6e7781] hover:text-[#111111]'
                : 'text-[#858585] hover:text-[#cccccc]'
              }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      )}
      {file && isBinary ? (
        <ImagePreview file={file} />
      ) : file && file.content ? (
        showPreview ? (
          <MarkdownPreview content={file.content} />
        ) : (
          <HighlightedCode content={file.content} language={file.language} />
        )
      ) : (
        <EmptyEditor />
      )}
    </div>
  );
}