'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, Heart, Sparkles, MessageSquareQuote } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolio-store';
import { playPopSound, playClickSound } from '@/lib/sound';

export default function WelcomeStats({ isLight }: { isLight: boolean }) {
  const [views, setViews] = useState<number | null>(null);
  const [likes, setLikes] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const { showToast, setActiveSidebarPanel, sidebarVisible, toggleSidebar } = usePortfolioStore();

  useEffect(() => {
    let isMounted = true;

    const initStats = async () => {
      try {
        const hasViewedInSession = typeof window !== 'undefined' && sessionStorage.getItem('portfolio_viewed');

        let res: Response;
        if (!hasViewedInSession) {
          res = await fetch('/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'increment_view' }),
          });
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('portfolio_viewed', 'true');
          }
        } else {
          res = await fetch('/api/stats');
        }

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setViews(data.views ?? 0);
            setLikes(data.likes ?? 0);
          }
        }
      } catch (err) {
        console.error('Failed to initialize stats:', err);
      }
    };

    initStats();

    if (typeof window !== 'undefined') {
      const storedLike = localStorage.getItem('portfolio_liked');
      if (storedLike === 'true') {
        setHasLiked(true);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLike = useCallback(async () => {
    if (isLiking) return;
    setIsLiking(true);

    playPopSound();
    setLikes((prev) => (prev !== null ? prev + 1 : 1));
    setHasLiked(true);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);

    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_liked', 'true');
    }

    showToast('Thanks for supporting my portfolio!');

    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes ?? 0);
        if (data.views !== undefined) setViews(data.views);
      }
    } catch (err) {
      console.error('Failed to register like:', err);
    } finally {
      setIsLiking(false);
    }
  }, [isLiking, showToast]);

  const handleOpenReviews = () => {
    playClickSound();
    setActiveSidebarPanel('feedback');
    if (!sidebarVisible) toggleSidebar();
  };

  return (
    <div data-tour="welcome-stats" className="flex items-center justify-center gap-2.5 my-3 flex-wrap select-none">
      <div
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all ${isLight
            ? 'bg-[#f4f4f4] border-[#d8d8d8] text-[#333333]'
            : 'bg-[#252526] border-[#3c3c3c] text-[#cccccc]'
          }`}
        title="Total portfolio views tracked in Redis"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <Eye className="w-3.5 h-3.5 opacity-70" />
        <span className="text-[11px] opacity-70 uppercase tracking-wider">Views:</span>
        <span className="font-semibold tabular-nums">
          {views !== null ? views.toLocaleString() : '...'}
        </span>
      </div>

      <button
        type="button"
        onClick={handleLike}
        className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all duration-200 cursor-pointer active:scale-95 ${hasLiked
            ? isLight
              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-400 shadow-xs'
            : isLight
              ? 'bg-[#f4f4f4] border-[#d8d8d8] text-[#333333] hover:border-rose-300 hover:text-rose-600'
              : 'bg-[#252526] border-[#3c3c3c] text-[#cccccc] hover:border-rose-600/60 hover:text-rose-400'
          }`}
        title="Click to like this portfolio"
      >
        <Heart
          className={`w-3.5 h-3.5 transition-transform duration-300 ${heartAnim ? 'scale-135 animate-bounce' : 'group-hover:scale-110'
            } ${hasLiked ? 'fill-current text-rose-500' : ''}`}
        />
        <span className="text-[11px] opacity-70 uppercase tracking-wider">Likes:</span>
        <span className="font-semibold tabular-nums">
          {likes !== null ? likes.toLocaleString() : '...'}
        </span>
        {heartAnim && (
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-amber-400 animate-spin" />
        )}
      </button>

      <button
        type="button"
        onClick={handleOpenReviews}
        className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all duration-200 cursor-pointer active:scale-95 ${isLight
            ? 'bg-[#f4f4f4] border-[#d8d8d8] text-[#333333] hover:border-amber-400 hover:text-amber-600'
            : 'bg-[#252526] border-[#3c3c3c] text-[#cccccc] hover:border-amber-500/60 hover:text-amber-400'
          }`}
        title="Open Reviews & Feedback panel"
      >
        <MessageSquareQuote className="w-3.5 h-3.5 text-amber-500 transition-transform group-hover:scale-110" />
        <span className="text-[11px] opacity-70 uppercase tracking-wider">Reviews</span>
      </button>
    </div>
  );
}
