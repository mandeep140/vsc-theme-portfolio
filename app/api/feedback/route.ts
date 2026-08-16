import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export interface FeedbackItem {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  timestamp: number;
}

const FALLBACK_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-demo-1',
    name: 'Internal System',
    content: "There's some error with Redis, please try again later.",
    createdAt: 'Aug 14, 2026, 11:30 AM',
    timestamp: 1786687800000,
  },
];

export async function GET() {
  try {
    const isConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

    if (!isConfigured) {
      return NextResponse.json({ feedbacks: FALLBACK_FEEDBACKS, success: true });
    }

    const rawList = await redis.lrange<string | FeedbackItem>('portfolio:feedbacks', 0, 49);

    if (!rawList || rawList.length === 0) {
      return NextResponse.json({ feedbacks: FALLBACK_FEEDBACKS, success: true });
    }

    const feedbacks: FeedbackItem[] = rawList
      .map((item) => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item) as FeedbackItem;
          } catch {
            return null;
          }
        }
        return item as FeedbackItem;
      })
      .filter((item): item is FeedbackItem => Boolean(item && item.name && item.content));

    return NextResponse.json({ feedbacks: feedbacks.length > 0 ? feedbacks : FALLBACK_FEEDBACKS, success: true });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json({ feedbacks: FALLBACK_FEEDBACKS, success: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawName = typeof body.name === 'string' ? body.name.trim() : '';
    const rawContent = typeof body.content === 'string' ? body.content.trim() : '';

    if (!rawName || !rawContent) {
      return NextResponse.json(
        { error: 'Name and content are required', success: false },
        { status: 400 }
      );
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: rawName.slice(0, 60),
      content: rawContent.slice(0, 1000),
      createdAt: formattedDate,
      timestamp: Date.now(),
    };

    const isConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

    if (isConfigured) {
      await redis.lpush('portfolio:feedbacks', JSON.stringify(newFeedback));
      await redis.ltrim('portfolio:feedbacks', 0, 99);
    }

    return NextResponse.json({ feedback: newFeedback, success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback', success: false },
      { status: 500 }
    );
  }
}
