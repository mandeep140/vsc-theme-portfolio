'use client';

import React from 'react';
import { X, Eye, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { usePortfolioStore } from '@/store/portfolio-store';
import { findFileById, fileTree } from '@/data/portfolio-data';

function EditorTabs() {
  const { openTabs, activeTabId, setActiveTab, closeTab, isMobile } = usePortfolioStore();

  if (openTabs.length === 0) return null;

  return (
    <div className="flex items-center bg-[#252526] border-b border-[#1e1e1e] overflow-x-auto flex-shrink-0 scrollbar-hide">
      {openTabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center gap-1.5 h-[35px] px-2 md:px-3 border-r border-[#252526] cursor-pointer min-w-0 transition-colors ${isActive
              ? 'bg-[#1e1e1e] border-t-[2px] border-t-white text-white'
              : 'bg-[#2d2d2d] border-t-[2px] border-t-transparent text-[#969696] hover:bg-[#2a2a2a]'
              }`}
            style={{ maxWidth: isMobile ? '120px' : '180px' }}
          >
            <span className={`text-[11px] font-bold flex-shrink-0 ${tab.language === 'tsx' ? 'text-[#519aba]' :
              tab.language === 'typescript' ? 'text-[#519aba]' :
                tab.language === 'markdown' ? 'text-[#519aba]' :
                  tab.language === 'binary' ? 'text-[#a074c4]' : 'text-[#858585]'
              }`}>
              {tab.language === 'typescript' ? 'TS' : tab.language === 'tsx' ? 'TSX' : tab.language === 'markdown' ? 'MD' : tab.language === 'binary' ? 'IMG' : 'F'}
            </span>
            <span className="text-[13px] truncate">{tab.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
              className={`ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[#404040] transition-all flex-shrink-0 ${isActive ? 'opacity-60 hover:!opacity-100' : ''
                }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function buildEditorTheme(baseTheme: Record<string, React.CSSProperties>) {
  return {
    ...baseTheme,
    linenumber: { color: '#858585' },
    'react-syntax-highlighter-line-number': { color: '#858585' },
  };
}

const darkEditorTheme = buildEditorTheme(vscDarkPlus);
const lightEditorTheme = buildEditorTheme(vs);

function HighlightedCode({ content, language }: { content: string; language?: string }) {
  const { editorFontSize, showLineNumbers, theme } = usePortfolioStore();
  const normalizedLanguage = language === 'tsx' ? 'tsx' : language === 'typescript' ? 'typescript' : language === 'markdown' ? 'markdown' : language || 'typescript';
  const editorTheme = theme === 'light' ? lightEditorTheme : darkEditorTheme;
  const bgColor = theme === 'light' ? '#ffffff' : '#1e1e1e';

  return (
    <div className="flex flex-1 min-h-0 bg-[#1e1e1e] overflow-hidden">
      <SyntaxHighlighter
        language={normalizedLanguage}
        style={editorTheme}
        showLineNumbers={showLineNumbers}
        lineNumberStyle={{
          minWidth: '50px',
          paddingRight: '16px',
          paddingLeft: '12px',
          color: theme === 'light' ? '#999999' : '#858585',
          textAlign: 'right',
          userSelect: 'none',
          fontSize: `${editorFontSize}px`,
          lineHeight: '20px',
        }}
        customStyle={{
          margin: 0,
          padding: '16px 16px 16px 0',
          background: bgColor,
          fontSize: `${editorFontSize}px`,
          lineHeight: '20px',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: `${editorFontSize}px`,
            lineHeight: '20px',
          },
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #007acc;padding-left:12px;color:#858585;margin:8px 0">$1</blockquote>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#2d2d2d;padding:12px;border-radius:4px;overflow-x:auto;margin:12px 0;font-family:monospace;font-size:13px;line-height:1.5"><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code style="background:#2d2d2d;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:13px;color:#ce9178">$1</code>');
  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:600;margin:16px 0 8px;color:#cccccc;border-bottom:1px solid #404040;padding-bottom:4px">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:18px;font-weight:600;margin:20px 0 10px;color:#cccccc;border-bottom:1px solid #404040;padding-bottom:6px">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:700;margin:24px 0 12px;color:#ffffff">$1</h1>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#e0e0e0;font-weight:600">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #404040;margin:16px 0" />');
  html = html.replace(/^- (.+)$/gm, '<li style="margin-left:16px;list-style:disc">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul style="margin:8px 0;padding-left:8px">${match}</ul>`);
  html = html.replace(/^(?!<[hupbodil]|<hr|<li|<ul|<blockquote|<pre|<code|<strong|<em)(.+)$/gm, '<p style="margin:4px 0">$1</p>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#3794ff;text-decoration:none">$1</a>');

  return html;
}

function MarkdownPreview({ content }: { content: string }) {
  const html = renderMarkdown(content);
  return (
    <div
      className="flex-1 min-h-0 overflow-auto p-6 md:p-10 bg-[#1e1e1e] text-[#cccccc] leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function ImagePreview({ file }: { file: { name: string; id: string } }) {
  const getPlaceholderContent = () => {
    if (file.name.includes('avatar')) {
      return { bg: '#007fd4', text: 'AC', sub: 'avatar.png' };
    }
    if (file.name.includes('og-image')) {
      return { bg: '#1e1e1e', text: 'OG', sub: 'og-image.png -- Open Graph Preview' };
    }
    if (file.name.includes('favicon')) {
      return { bg: '#dcb67a', text: 'DEV', sub: 'favicon.ico -- 32x32' };
    }
    return { bg: '#2d2d30', text: 'IMG', sub: file.name };
  };

  const { bg, text, sub } = getPlaceholderContent();
  const isImageFile = file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.gif');

  if (isImageFile) {
    return <img src={`/images/${file.name}`} alt={file.name} className="w-full h-full object-contain" />;
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#1e1e1e] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-48 h-48 md:w-64 md:h-64 rounded-lg flex items-center justify-center border border-[#3c3c3c]`}
          style={{ backgroundColor: bg }}
        >
          <span className="text-white text-4xl md:text-5xl font-bold opacity-80">{text}</span>
        </div>
        <div className="text-center">
          <p className="text-[#cccccc] text-sm font-medium">{sub}</p>
          <p className="text-[#858585] text-xs mt-1">Binary file -- {file.name}</p>
          <p className="text-[#858585] text-xs">Place actual images in /public/images/ to preview them here</p>
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs({ path }: { path: string[] }) {
  return (
    <div className="flex items-center gap-1 px-3 md:px-4 py-1 bg-[#1e1e1e] border-b border-[#252526] text-[12px] text-[#858585] flex-shrink-0 overflow-x-auto scrollbar-hide">
      {path.map((segment, i) => (
        <span key={i} className="flex items-center gap-1 flex-shrink-0">
          {i > 0 && <span className="text-[#666]">/</span>}
          <span className={i === path.length - 1 ? 'text-[#cccccc]' : 'hover:text-[#cccccc] cursor-pointer'}>
            {segment}
          </span>
        </span>
      ))}
    </div>
  );
}

function EmptyEditor() {
  const { toggleSidebar, toggleTerminal, isMobile } = usePortfolioStore();
  return (
    <div className="flex-1 min-h-0 flex items-center justify-center bg-[#1e1e1e]">
      <div className="text-center text-[#858585] px-4">
        <div className="text-4xl md:text-6xl mb-4 opacity-20 font-mono">
          {'</>'}
        </div>
        <p className="text-base md:text-lg font-light mb-2">Mandeep Nagar</p>
        <p className="text-sm">Full Stack Developer</p>
        <div className="mt-6 flex flex-col items-center gap-2 text-xs">
          {!isMobile && (
            <>
              <button
                onClick={toggleSidebar}
                className="px-3 py-1.5 bg-[#2d2d2d] rounded text-[#cccccc] hover:bg-[#37373d] transition-colors"
              >
                Ctrl+B -- Toggle Sidebar
              </button>
              <button
                onClick={toggleTerminal}
                className="px-3 py-1.5 bg-[#2d2d2d] rounded text-[#cccccc] hover:bg-[#37373d] transition-colors"
              >
                Ctrl+` -- Toggle Terminal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditorPanel() {
  const { activeTabId, openTabs, mdPreviewMode, toggleMdPreview, isMobile } = usePortfolioStore();

  const activeTab = openTabs.find((t) => t.id === activeTabId);
  const file = activeTabId ? findFileById(fileTree, activeTabId) : null;

  const isMarkdown = file?.language === 'markdown' && file.content;
  const isBinary = file?.language === 'binary';
  const showPreview = isMarkdown && mdPreviewMode;

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0 bg-[#1e1e1e] overflow-hidden">
      <EditorTabs />
      {activeTab && activeTab.path.length > 0 && (
        <Breadcrumbs path={activeTab.path} />
      )}
      {isMarkdown && (
        <div className="flex items-center gap-1 px-3 py-1 bg-[#2d2d2d] border-b border-[#252526] flex-shrink-0">
          <button
            onClick={() => { if (mdPreviewMode) toggleMdPreview(); }}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] transition-colors ${!mdPreviewMode ? 'bg-[#1e1e1e] text-white' : 'text-[#858585] hover:text-[#cccccc]'
              }`}
          >
            <Code className="w-3.5 h-3.5" /> Source
          </button>
          <button
            onClick={() => { if (!mdPreviewMode) toggleMdPreview(); }}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] transition-colors ${mdPreviewMode ? 'bg-[#1e1e1e] text-white' : 'text-[#858585] hover:text-[#cccccc]'
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