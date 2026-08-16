'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquareQuote, Plus, RotateCw, Send, Check, User, Clock } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { playClickSound, playSuccessSound, playToastSound } from '@/lib/sound';

interface FeedbackItem {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  timestamp: number;
}

export default function FeedbackPanel() {
  const { theme, showToast } = usePortfolioStore();
  const isLight = theme === 'light';

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedbacks = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/feedback', { cache: 'no-store' });
      const data = await res.json();
      if (data && Array.isArray(data.feedbacks)) {
        setFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedContent = content.trim();

    if (!trimmedName || !trimmedContent) {
      showToast('Please provide your name and feedback.');
      return;
    }

    setSubmitting(true);
    playClickSound();

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, content: trimmedContent }),
      });
      const data = await res.json();

      if (data && data.success && data.feedback) {
        setFeedbacks((prev) => [data.feedback, ...prev]);
        setName('');
        setContent('');
        setIsFormOpen(false);
        playSuccessSound();
        showToast('Review submitted successfully! Thank you.');
      } else {
        showToast('Failed to save review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      showToast('Network error while saving review.');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="flex flex-col h-full min-h-0 select-none">
      <div
        className={`flex items-center justify-between px-4 py-2 border-b flex-shrink-0 ${isLight ? 'border-[#e4e4e4] bg-[#fafafa]' : 'border-[#3c3c3c] bg-[#1e1e1e]'
          }`}
      >
        <div className="flex items-center gap-2">
          <MessageSquareQuote className={`w-4 h-4 ${isLight ? 'text-[#007acc]' : 'text-[#007fd4]'}`} />
          <span className={`text-[11px] font-semibold tracking-wider uppercase ${isLight ? 'text-[#333333]' : 'text-[#bbbbbb]'}`}>
            Reviews & Feedback ({feedbacks.length})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fetchFeedbacks(true)}
            disabled={refreshing}
            className={`p-1 rounded transition-colors cursor-pointer ${isLight ? 'hover:bg-[#e0e0e0] text-[#555555]' : 'hover:bg-[#333333] text-[#aaaaaa]'
              }`}
            title="Refresh Reviews"
            aria-label="Refresh Reviews"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#007acc]' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsFormOpen(!isFormOpen);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${isFormOpen
                ? isLight
                  ? 'bg-[#e0e0e0] text-[#111111]'
                  : 'bg-[#3c3c3c] text-white'
                : 'bg-[#007acc] text-white hover:bg-[#0060c0]'
              }`}
          >
            <Plus className={`w-3 h-3 transition-transform ${isFormOpen ? 'rotate-45' : ''}`} />
            <span>{isFormOpen ? 'Close' : 'Add Review'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-3">
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className={`p-3 rounded-lg border shadow-sm animate-scaleIn ${isLight ? 'bg-white border-[#d0d0d0]' : 'bg-[#252526] border-[#3c3c3c]'
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[12px] font-semibold ${isLight ? 'text-[#24292f]' : 'text-[#cccccc]'}`}>
                Write Feedback
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name / Organization"
                  maxLength={60}
                  required
                  className={`w-full px-2.5 py-1.5 rounded border text-[12px] outline-none font-sans transition-colors ${isLight
                      ? 'bg-[#fbfbfb] border-[#cecece] text-[#24292f] placeholder:text-[#999999] focus:border-[#007acc] focus:bg-white'
                      : 'bg-[#1e1e1e] border-[#3c3c3c] text-[#cccccc] placeholder:text-[#6a6a6a] focus:border-[#007fd4] focus:bg-[#1f1f22]'
                    }`}
                />
              </div>

              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Your thoughts, review, recommendation, or comments..."
                  rows={3}
                  maxLength={1000}
                  required
                  className={`w-full px-2.5 py-1.5 rounded border text-[12px] outline-none font-sans resize-none transition-colors ${isLight
                      ? 'bg-[#fbfbfb] border-[#cecece] text-[#24292f] placeholder:text-[#999999] focus:border-[#007acc] focus:bg-white'
                      : 'bg-[#1e1e1e] border-[#3c3c3c] text-[#cccccc] placeholder:text-[#6a6a6a] focus:border-[#007fd4] focus:bg-[#1f1f22]'
                    }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${isLight ? 'text-[#666666] hover:bg-[#eaeaea]' : 'text-[#888888] hover:bg-[#333333]'
                    }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !content.trim()}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${submitting || !name.trim() || !content.trim()
                      ? isLight
                        ? 'bg-[#e0e0e0] text-[#999999] cursor-not-allowed'
                        : 'bg-[#333333] text-[#666666] cursor-not-allowed'
                      : 'bg-[#007acc] text-white hover:bg-[#0060c0] shadow-xs'
                    }`}
                >
                  <Send className="w-3 h-3" />
                  <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border animate-pulse ${isLight ? 'bg-[#f0f0f0] border-[#e0e0e0]' : 'bg-[#252526] border-[#333333]'
                  }`}
              >
                <div className="h-4 bg-black/10 rounded w-1/3 mb-2" />
                <div className="h-3 bg-black/10 rounded w-full mb-1" />
                <div className="h-3 bg-black/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquareQuote className={`w-8 h-8 mx-auto mb-2 opacity-40 ${isLight ? 'text-[#888888]' : 'text-[#666666]'}`} />
            <p className={`text-[13px] font-medium mb-1 ${isLight ? 'text-[#444444]' : 'text-[#cccccc]'}`}>
              No reviews yet
            </p>
            <p className={`text-[11px] mb-3 ${isLight ? 'text-[#777777]' : 'text-[#888888]'}`}>
              Be the first to share your feedback or testimonial.
            </p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="px-3 py-1.5 bg-[#007acc] text-white rounded text-[11px] font-medium hover:bg-[#0060c0] transition-colors cursor-pointer"
            >
              Add Review
            </button>
          </div>
        ) : (
          feedbacks.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all select-text ${isLight
                  ? 'bg-white border-[#e0e0e0] hover:border-[#007acc]/40 shadow-xs'
                  : 'bg-[#252526]/80 border-[#333333] hover:border-[#007fd4]/40 shadow-sm'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isLight ? 'bg-[#007acc]/10 text-[#007acc]' : 'bg-[#007fd4]/20 text-[#007fd4]'
                      }`}
                  >
                    {getInitials(item.name)}
                  </div>
                  <span className={`text-[12.5px] font-semibold truncate ${isLight ? 'text-[#24292f]' : 'text-[#e0e0e0]'}`}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 text-[10px] font-mono opacity-60">
                  <Clock className="w-3 h-3" />
                  <span>{item.createdAt}</span>
                </div>
              </div>
              <p className={`text-[12px] leading-relaxed break-words pl-8 ${isLight ? 'text-[#444444]' : 'text-[#b0b0b0]'}`}>
                {item.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
