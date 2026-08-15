import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development' ? true : false
    if (isDevelopment) {
      return NextResponse.json({ views: 0, likes: 0, success: true });
    }
    const [viewsRaw, likesRaw] = await Promise.all([
      redis.get<number | string>('portfolio:views'),
      redis.get<number | string>('portfolio:likes'),
    ]);

    const views = Number(viewsRaw) || 0;
    const likes = Number(likesRaw) || 0;

    return NextResponse.json({ views, likes, success: true });
  } catch (error) {
    console.error('Error fetching Redis stats:', error);
    return NextResponse.json(
      { views: 0, likes: 0, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action } = body;

    let views: number;
    let likes: number;

    const isDevelopment = process.env.NODE_ENV === 'development' ? true : false
    if (isDevelopment) {
      return NextResponse.json({ views: 0, likes: 0, success: true });
    }

    if (action === 'increment_view') {
      const [newViews, currentLikes] = await Promise.all([
        redis.incr('portfolio:views'),
        redis.get<number | string>('portfolio:likes'),
      ]);
      views = Number(newViews) || 0;
      likes = Number(currentLikes) || 0;
    } else if (action === 'like') {
      const [currentViews, newLikes] = await Promise.all([
        redis.get<number | string>('portfolio:views'),
        redis.incr('portfolio:likes'),
      ]);
      views = Number(currentViews) || 0;
      likes = Number(newLikes) || 0;
    } else {
      const [currentViews, currentLikes] = await Promise.all([
        redis.get<number | string>('portfolio:views'),
        redis.get<number | string>('portfolio:likes'),
      ]);
      views = Number(currentViews) || 0;
      likes = Number(currentLikes) || 0;
    }

    return NextResponse.json({ views, likes, success: true });
  } catch (error) {
    console.error('Error updating Redis stats:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
}
