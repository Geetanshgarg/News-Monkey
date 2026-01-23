import { NextResponse } from 'next/server';
import { getNews, loadNewsFromCache, saveNewsToCache } from '@/lib/fetchNews';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';
    const country = searchParams.get('country') || 'us';
    const force = searchParams.get('force') === 'true';

    try {
        // Serve-then-Update strategy
        const cachedArticles = await loadNewsFromCache(country);

        // Background fetch function
        const updateCache = async () => {
            try {
                const freshArticles = await getNews(category, country);
                if (freshArticles && freshArticles.length > 0) {
                    await saveNewsToCache(freshArticles, country);
                }
            } catch (err) {
                console.error("Background fetch failed:", err);
            }
        };

        if (cachedArticles && cachedArticles.length > 0 && !force) {
            // Shuffle cached articles so user gets something different even from cache
            const shuffled = [...cachedArticles].sort(() => Math.random() - 0.5);

            // Trigger background update for next time
            updateCache();

            return NextResponse.json(shuffled);
        }

        // blocking fetch if no cache or force
        const articles = await getNews(category, country);
        await saveNewsToCache(articles, country);
        return NextResponse.json(articles);
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
