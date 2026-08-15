'use client';

import React from 'react';
import { X, Eye, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { usePortfolioStore } from '@/store/portfolio-store';
import { findFileById, fileTree } from '@/data/portfolio-data';

function EditorTabs() {
  const { openTabs, activeTabId, setActiveTab, closeTab, isMobile, theme } = usePortfolioStore();
  const isLight = theme === 'light';

  if (openTabs.length === 0) return null;

  return (
    <div
      className={`flex items-center border-b overflow-x-auto flex-shrink-0 scrollbar-hide transition-colors duration-150 ${
        isLight
          ? 'bg-[#f3f3f3] border-[#e4e4e4]'
          : 'bg-[#252526] border-[#1e1e1e]'
      }`}
    >
      {openTabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center gap-1.5 h-[35px] px-2 md:px-3 border-r cursor-pointer min-w-0 transition-colors duration-100 ${
              isActive
                ? isLight
                  ? 'bg-white border-t-[2px] border-t-[#007acc] border-r-[#e4e4e4] text-[#111111] font-medium shadow-xs'
                  : 'bg-[#1e1e1e] border-t-[2px] border-t-white border-r-[#252526] text-white font-medium'
                : isLight
                  ? 'bg-[#ececec] border-t-[2px] border-t-transparent border-r-[#e4e4e4] text-[#555555] hover:bg-[#e0e0e0]'
                  : 'bg-[#2d2d2d] border-t-[2px] border-t-transparent border-r-[#252526] text-[#969696] hover:bg-[#2a2a2a]'
            }`}
            style={{ maxWidth: isMobile ? '130px' : '190px' }}
          >
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
                      ? 'IMG'
                      : 'F'}
            </span>
            <span className="text-[13px] truncate">{tab.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className={`ml-auto p-0.5 rounded transition-all flex-shrink-0 ${
                isActive
                  ? isLight
                    ? 'opacity-70 hover:opacity-100 hover:bg-[#dedede]'
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

function buildEditorTheme(baseTheme: Record<string, React.CSSProperties>, lineNumberColor: string) {
  return {
    ...baseTheme,
    linenumber: { color: lineNumberColor },
    'react-syntax-highlighter-line-number': { color: lineNumberColor },
  };
}

const darkEditorTheme = buildEditorTheme(vscDarkPlus, '#858585');
const lightEditorTheme = buildEditorTheme(vs, '#9e9e9e');

function HighlightedCode({ content, language }: { content: string; language?: string }) {
  const { editorFontSize, showLineNumbers, theme } = usePortfolioStore();
  const isLight = theme === 'light';
  const normalizedLanguage =
    language === 'tsx'
      ? 'tsx'
      : language === 'typescript'
        ? 'typescript'
        : language === 'markdown'
          ? 'markdown'
          : language || 'typescript';

  const editorTheme = isLight ? lightEditorTheme : darkEditorTheme;
  const bgColor = isLight ? '#ffffff' : '#1e1e1e';

  return (
    <div
      className={`flex flex-1 min-h-0 overflow-hidden ${
        isLight ? 'bg-white' : 'bg-[#1e1e1e]'
      }`}
    >
      <SyntaxHighlighter
        language={normalizedLanguage}
        style={editorTheme}
        showLineNumbers={showLineNumbers}
        lineNumberStyle={{
          minWidth: '46px',
          paddingRight: '16px',
          paddingLeft: '12px',
          color: isLight ? '#9e9e9e' : '#858585',
          textAlign: 'right',
          userSelect: 'none',
          fontSize: `${editorFontSize}px`,
          lineHeight: '22px',
        }}
        customStyle={{
          margin: 0,
          padding: showLineNumbers ? '16px 16px 16px 0' : '16px',
          background: bgColor,
          fontSize: `${editorFontSize}px`,
          lineHeight: '22px',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: `${editorFontSize}px`,
            lineHeight: '22px',
          },
        }}
      >
        {content}
      </SyntaxHighlighter>
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
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';
  const html = renderMarkdown(content, isLight);

  return (
    <div
      className={`flex-1 min-h-0 overflow-auto p-6 md:p-10 leading-relaxed transition-colors duration-150 ${
        isLight ? 'bg-white text-[#24292f]' : 'bg-[#1e1e1e] text-[#cccccc]'
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function ImagePreview({ file }: { file: { name: string; id: string } }) {
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';
  const isImageFile =
    file.name.endsWith('.png') ||
    file.name.endsWith('.jpg') ||
    file.name.endsWith('.jpeg') ||
    file.name.endsWith('.gif') ||
    file.name.endsWith('.webp');

  if (isImageFile) {
    return (
      <div
        className={`flex-1 min-h-0 overflow-auto flex items-center justify-center p-4 ${
          isLight ? 'bg-[#f8f8f8]' : 'bg-[#1e1e1e]'
        }`}
      >
        <img
          src={`/images/${file.name}`}
          alt={file.name}
          className="max-w-full max-h-full object-contain rounded shadow-sm"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex-1 min-h-0 overflow-auto flex items-center justify-center ${
        isLight ? 'bg-white' : 'bg-[#1e1e1e]'
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={`w-40 h-40 rounded-lg flex items-center justify-center border shadow-sm ${
            isLight
              ? 'bg-[#f0f0f0] border-[#d8d8d8] text-[#333333]'
              : 'bg-[#2d2d30] border-[#3c3c3c] text-white'
          }`}
        >
          <span className="text-3xl font-bold opacity-80">IMG</span>
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
  const { theme } = usePortfolioStore();
  const isLight = theme === 'light';

  return (
    <div
      className={`flex items-center gap-1 px-3 md:px-4 py-1 text-[12px] flex-shrink-0 overflow-x-auto scrollbar-hide border-b transition-colors duration-150 ${
        isLight
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
  const { toggleSidebar, toggleTerminal, isMobile, theme } = usePortfolioStore();
  const isLight = theme === 'light';

  return (
    <div
      className={`flex-1 min-h-0 flex items-center justify-center transition-colors duration-150 ${
        isLight ? 'bg-white' : 'bg-[#1e1e1e]'
      }`}
    >
      <div className="text-center px-4">
        <div
          className={`text-4xl md:text-6xl mb-4 font-mono select-none ${
            isLight ? 'opacity-15 text-black' : 'opacity-20 text-white'
          }`}
        >
          {'</>'}
        </div>
        <p className={`text-base md:text-lg font-semibold mb-1 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
          Mandeep Nagar
        </p>
        <p className={`text-sm ${isLight ? 'text-[#6e7781]' : 'text-[#858585]'}`}>Full Stack Developer</p>
        <div className="mt-6 flex flex-col items-center gap-2 text-xs">
          {!isMobile && (
            <>
              <button
                type="button"
                onClick={toggleSidebar}
                className={`px-3.5 py-1.5 rounded transition-colors cursor-pointer border ${
                  isLight
                    ? 'bg-[#f4f4f4] border-[#d4d4d4] text-[#24292f] hover:bg-[#eaeaea]'
                    : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#cccccc] hover:bg-[#37373d]'
                }`}
              >
                Ctrl+B — Toggle Sidebar
              </button>
              <button
                type="button"
                onClick={toggleTerminal}
                className={`px-3.5 py-1.5 rounded transition-colors cursor-pointer border ${
                  isLight
                    ? 'bg-[#f4f4f4] border-[#d4d4d4] text-[#24292f] hover:bg-[#eaeaea]'
                    : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#cccccc] hover:bg-[#37373d]'
                }`}
              >
                Ctrl+` — Toggle Terminal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditorPanel() {
  const { activeTabId, openTabs, mdPreviewMode, toggleMdPreview, theme } = usePortfolioStore();
  const isLight = theme === 'light';

  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const file = activeTabId ? findFileById(fileTree, activeTabId) : null;

  const isMarkdown = file?.language === 'markdown' && file.content;
  const isBinary = file?.language === 'binary';
  const showPreview = isMarkdown && mdPreviewMode;

  return (
    <div
      className={`flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden transition-colors duration-150 ${
        isLight ? 'bg-white' : 'bg-[#1e1e1e]'
      }`}
    >
      <EditorTabs />
      {activeTab && activeTab.path.length > 0 && <Breadcrumbs path={activeTab.path} />}
      {isMarkdown && (
        <div
          className={`flex items-center gap-1 px-3 py-1 border-b flex-shrink-0 transition-colors duration-150 ${
            isLight ? 'bg-[#f3f3f3] border-[#e4e4e4]' : 'bg-[#2d2d2d] border-[#252526]'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (mdPreviewMode) toggleMdPreview();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[12px] font-medium transition-colors cursor-pointer ${
              !mdPreviewMode
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
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[12px] font-medium transition-colors cursor-pointer ${
              mdPreviewMode
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