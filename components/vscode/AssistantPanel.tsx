'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, Sparkles, Trash2, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { usePortfolioStore } from '@/store/portfolio-store';
import { playSuccessSound, playKeypressSound, playClickSound } from '@/lib/sound';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STORAGE_KEY = 'portfolio_chat_history';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const QUICK_PROMPTS = [
  "What is Mandeep's primary tech stack?",
  "Tell me about his CTO role at Showa",
  "What SaaS projects has he built?",
  "How can I hire or contact him?",
];

const THINKING_STEPS = [
  "Analyzing question...",
  "Scanning Mandeep's codebase and repositories...",
  "Checking project architectures and experience...",
  "Formulating technical details...",
  "Synthesizing stack and deployment info...",
  "Finalizing response...",
];

const INITIAL_MESSAGE: Message = {
  id: 'welcome-msg',
  role: 'assistant',
  content:
    "Hey! I am Mandeep's AI Copilot. Ask me anything about his technical stack, engineering background, SaaS projects, or availability.",
  timestamp: 'Now',
};

export default function AssistantPanel() {
  const { theme, showToast } = usePortfolioStore();
  const isLight = theme === 'light';

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingText, setThinkingText] = useState('Thinking...');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed.timestamp === 'number' &&
          Date.now() - parsed.timestamp < MAX_AGE_MS &&
          Array.isArray(parsed.messages) &&
          parsed.messages.length > 0
        ) {
          setMessages(parsed.messages);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveHistory = useCallback((newMessages: Message[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: newMessages,
          timestamp: Date.now(),
        })
      );
    } catch {}
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setThinkingText('Thinking...');
      return;
    }

    let stepIndex = 0;
    let rotateInterval: NodeJS.Timeout | null = null;

    const delayTimeout = setTimeout(() => {
      setThinkingText(THINKING_STEPS[0]);
      stepIndex = 1;
      rotateInterval = setInterval(() => {
        setThinkingText(THINKING_STEPS[stepIndex % THINKING_STEPS.length]);
        stepIndex++;
      }, 2400);
    }, 3200);

    return () => {
      clearTimeout(delayTimeout);
      if (rotateInterval) clearInterval(rotateInterval);
    };
  }, [isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, thinkingText]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast('Copied message to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    playClickSound();
    const clearedMessages = [
      {
        id: 'welcome-msg-reset',
        role: 'assistant' as const,
        content: 'Chat cleared. What else would you like to know about Mandeep?',
        timestamp: 'Now',
      },
    ];
    setMessages(clearedMessages);
    saveHistory(clearedMessages);
  };

  const handleSend = useCallback(async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedAfterUser = [...messages, userMsg];
    setMessages(updatedAfterUser);
    saveHistory(updatedAfterUser);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome-msg' && m.id !== 'welcome-msg-reset')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
        }),
      });

      const data = await res.json();

      let assistantMsg: Message;
      if (res.ok && data.reply) {
        playSuccessSound();
        assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        assistantMsg = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: data.error || 'Could not connect to Gemini service. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      setMessages((prev) => {
        const next = [...prev, assistantMsg];
        saveHistory(next);
        return next;
      });
    } catch {
      const fallbackMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Network connection error. Please check your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => {
        const next = [...prev, fallbackMsg];
        saveHistory(next);
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, saveHistory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 select-none">
      <div
        className={`flex items-center justify-between px-3 py-1.5 border-b text-[11px] font-semibold tracking-wider uppercase flex-shrink-0 ${isLight ? 'bg-[#f3f3f3] border-[#e4e4e4] text-[#555555]' : 'bg-[#252526] border-[#1e1e1e] text-[#bbbbbb]'
          }`}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#007fd4]" />
          <span>Copilot Chat</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse ml-0.5" />
        </div>
        <button
          type="button"
          onClick={handleClear}
          className={`p-1 rounded transition-colors cursor-pointer ${isLight ? 'hover:bg-[#e0e0e0] text-[#666666]' : 'hover:bg-[#3c3c3c] text-[#858585]'
            }`}
          title="Clear Conversation"
          aria-label="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 min-h-0 text-[12px] md:text-[13px] leading-relaxed"
        style={{ scrollbarWidth: 'thin' }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] opacity-70">
                {isUser ? (
                  <>
                    <span>You</span>
                    <User className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-[#007fd4]" />
                    <span>Mandeep AI</span>
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`relative group max-w-[92%] px-3 py-2 rounded-lg text-[12px] leading-[18px] break-words ${isUser
                    ? isLight
                      ? 'bg-[#007acc] text-white rounded-br-none shadow-xs'
                      : 'bg-[#094771] text-white rounded-br-none'
                    : isLight
                      ? 'bg-white border border-[#d8d8d8] text-[#24292f] rounded-bl-none shadow-xs'
                      : 'bg-[#2d2d2d] border border-[#3c3c3c] text-[#cccccc] rounded-bl-none'
                  }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap font-sans select-text">{msg.content}</div>
                ) : (
                  <div className="font-sans select-text text-inherit">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-[19px]">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-outside pl-4 space-y-1 mb-2 last:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-outside pl-4 space-y-1 mb-2 last:mb-0">{children}</ol>,
                        li: ({ children }) => <li className="leading-[18px]">{children}</li>,
                        strong: ({ children }) => (
                          <strong className={isLight ? 'font-semibold text-[#111111]' : 'font-semibold text-white'}>
                            {children}
                          </strong>
                        ),
                        h1: ({ children }) => <h1 className="text-[13.5px] font-bold mt-2 mb-1 text-inherit">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-[13px] font-bold mt-2 mb-1 text-inherit">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-[12px] font-semibold mt-1.5 mb-1 text-inherit">{children}</h3>,
                        code: ({ children }) => (
                          <code className={`px-1 py-0.5 rounded text-[11px] font-mono ${
                            isLight ? 'bg-[#ececec] text-[#b02222]' : 'bg-[#1e1e1e] text-[#ce9178]'
                          }`}>
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className={`p-2 rounded overflow-x-auto text-[11px] font-mono my-2 border ${
                            isLight ? 'bg-[#f4f4f4] border-[#e0e0e0] text-[#24292f]' : 'bg-[#181818] border-[#333333] text-[#d4d4d4]'
                          }`}>
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}

                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className={`absolute -bottom-2 right-2 p-1 rounded border opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${isLight
                        ? 'bg-white border-[#d0d0d0] text-[#555555] hover:text-black'
                        : 'bg-[#1e1e1e] border-[#404040] text-[#858585] hover:text-white'
                      }`}
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start animate-fadeIn">
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] opacity-70">
              <Bot className="w-3 h-3 text-[#007fd4]" />
              <span className="font-mono text-[#007fd4] transition-all duration-300">Mandeep AI • {thinkingText}</span>
            </div>
            <div
              className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${isLight
                  ? 'bg-white border-[#d8d8d8] text-[#666666]'
                  : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#858585]'
                }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#007fd4] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#007fd4] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#007fd4] animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] opacity-80 font-mono ml-1">{thinkingText}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-2.5 pb-1 flex flex-wrap gap-1 flex-shrink-0">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className={`text-[10.5px] px-2 py-0.5 rounded border transition-colors truncate max-w-full cursor-pointer text-left ${isLight
                  ? 'bg-white border-[#d0d0d0] text-[#555555] hover:border-[#007acc] hover:text-[#007acc]'
                  : 'bg-[#2d2d2d] border-[#3c3c3c] text-[#858585] hover:border-[#007fd4] hover:text-[#cccccc]'
                }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div
        className={`p-2 border-t flex-shrink-0 ${isLight ? 'bg-[#f3f3f3] border-[#e4e4e4]' : 'bg-[#252526] border-[#1e1e1e]'
          }`}
      >
        <div
          className={`flex items-end gap-1.5 p-1.5 rounded border transition-all ${isLight
              ? 'bg-white border-[#cecece] focus-within:border-[#007acc]'
              : 'bg-[#1e1e1e] border-[#3c3c3c] focus-within:border-[#007fd4]'
            }`}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              playKeypressSound();
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Mandeep's experience, stack, projects..."
            rows={1}
            className={`flex-1 bg-transparent border-none outline-none resize-none text-[12px] leading-[18px] max-h-20 min-h-[20px] font-sans ${isLight ? 'text-[#24292f] placeholder:text-[#999999]' : 'text-[#cccccc] placeholder:text-[#6a6a6a]'
              }`}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`p-1.5 rounded transition-all flex-shrink-0 cursor-pointer ${input.trim() && !isLoading
                ? 'bg-[#007acc] text-white hover:bg-[#0060c0] shadow-xs'
                : isLight
                  ? 'text-[#cccccc] cursor-not-allowed'
                  : 'text-[#505050] cursor-not-allowed'
              }`}
            title="Send message"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-[9.5px] text-center mt-1 opacity-50 font-mono">
          Powered by Google Gemini • Press Enter to send
        </div>
      </div>
    </div>
  );
}
