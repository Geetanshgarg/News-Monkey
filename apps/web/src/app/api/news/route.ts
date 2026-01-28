import { NextResponse } from 'next/server';
import { getNews } from '@/lib/fetchNews';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';
    const country = searchParams.get('country') || 'us';

    try {
        const articles = await getNews(category, country);
        return NextResponse.json(articles);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
