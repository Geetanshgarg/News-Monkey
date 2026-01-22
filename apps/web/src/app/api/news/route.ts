import { NextResponse } from 'next/server';
import { getNews } from '@/lib/fetchNews';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';

    try {
        const articles = await getNews(category);
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
