export interface NewsArticle {
    title: string;
    description: string;
    content: string;
    url: string;
    urlToImage: string; // NewsAPI uses urlToImage
    publishedAt: string;
    source: {
        id?: string;
        name: string;
    };
}

const MOCK_ARTICLES: NewsArticle[] = [
    {
        title: "The Future of Artificial Intelligence in 2026",
        description: "AI continues to reshape the landscape of technology and society, with new breakthroughs in generative models and robotics.",
        content: "artificial intelligence has moved beyond simple pattern recognition to complex creative tasks. in 2026, we are seeing the emergence of truly multi-modal systems that can reason across text, vision, and audio seamlessly. these developments are not just restricted to silicon valley but are being adopted globally across industries from healthcare to agriculture, proving that the ai revolution is just beginning.",
        url: "https://example.com/ai-2026",
        urlToImage: "",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech Daily" }
    },
    {
        title: "SpaceX Announces Mars Colony Timeline",
        description: "Elon Musk reveals updated plans for the first human settlement on the Red Planet.",
        content: "the dream of becoming a multi-planetary species is closer than ever. spacex has announced a detailed timeline for the first starship mission to mars with a human crew. the mission, scheduled for the late 2020s, aims to establish a self-sustaining base that can support a small team of scientists and engineers. this historic endeavor represents the pinnacle of human ingenuity and our endless desire to explore the unknown.",
        url: "https://example.com/mars",
        urlToImage: "",
        publishedAt: new Date().toISOString(),
        source: { name: "Space News" }
    }
];

export async function getNews(category: string = 'general', country: string = 'us'): Promise<NewsArticle[]> {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        console.warn("NEWS_API_KEY not found, using mock data.");
        return MOCK_ARTICLES;
    }

    try {
        // Use a timestamp to bypass any caching layers
        const timestamp = Date.now();
        const baseUrl = category === 'general'
            ? `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=15&apiKey=${apiKey}`
            : `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&pageSize=15&apiKey=${apiKey}`;

        const url = `${baseUrl}&t=${timestamp}`;

        const response = await fetch(url, {
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch news: ${response.statusText}`);
        }

        const data = await response.json();

        // Filter out removed articles or those without content/description
        const articles = (data.articles || []).filter((a: any) =>
            a.title &&
            a.title !== "[Removed]" &&
            (a.content || a.description)
        ).map((article: any) => {
            let content = article.content || article.description;
            // Ultra-aggressive cleaning for truncation markers and API leaks
            content = content
                .replace(/[\.\.\.…]\s?\[?\+?\d+\s?chars?\]?/gi, "") // Catch [+1234 chars], [123 chars], ...[+12chars], etc.
                .replace(/\s?\[?\+?\d+\s?chars?\]?/gi, "")
                .replace(/[\.\.\.…]$/, "")
                .trim();

            return {
                ...article,
                content: content.toLowerCase()
            };
        });

        return articles;
    } catch (error) {
        console.error("Error fetching news:", error);
        return MOCK_ARTICLES;
    }
}

// Simple file-based caching for background updates
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export async function saveNewsToCache(articles: NewsArticle[], region: string = 'us') {
    try {
        const cacheFile = join(process.cwd(), `.news-cache-${region}.json`);
        await writeFile(cacheFile, JSON.stringify({
            timestamp: Date.now(),
            articles
        }));
    } catch (err) {
        console.error("Failed to save news cache:", err);
    }
}

export async function loadNewsFromCache(region: string = 'us'): Promise<NewsArticle[] | null> {
    try {
        const cacheFile = join(process.cwd(), `.news-cache-${region}.json`);
        const data = await readFile(cacheFile, 'utf-8');
        const parsed = JSON.parse(data);
        return parsed.articles;
    } catch (err) {
        return null;
    }
}
