export interface NewsArticle {
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: string;
    source: {
        name: string;
        url: string;
    };
}

const MOCK_ARTICLES: NewsArticle[] = [
    {
        title: "The Future of Artificial Intelligence in 2026",
        description: "AI continues to reshape the landscape of technology and society, with new breakthroughs in generative models and robotics.",
        content: "Artificial Intelligence has moved beyond simple pattern recognition to complex creative tasks. In 2026, we are seeing the emergence of truly multi-modal systems that can reason across text, vision, and audio seamlessly. These developments are not just restricted to Silicon Valley but are being adopted globally across industries from healthcare to agriculture, proving that the AI revolution is just beginning.",
        url: "https://example.com/ai-2026",
        image: "",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech Daily", url: "https://example.com" }
    },
    {
        title: "SpaceX Announces Mars Colony Timeline",
        description: "Elon Musk reveals updated plans for the first human settlement on the Red Planet.",
        content: "The dream of becoming a multi-planetary species is closer than ever. SpaceX has announced a detailed timeline for the first Starship mission to Mars with a human crew. The mission, scheduled for the late 2020s, aims to establish a self-sustaining base that can support a small team of scientists and engineers. This historic endeavor represents the pinnacle of human ingenuity and our endless desire to explore the unknown.",
        url: "https://example.com/mars",
        image: "",
        publishedAt: new Date().toISOString(),
        source: { name: "Space News", url: "https://example.com" }
    }
];

export async function getNews(category: string = 'general'): Promise<NewsArticle[]> {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
        console.warn("GNEWS_API_KEY not found, using mock data.");
        return MOCK_ARTICLES;
    }

    try {
        const response = await fetch(
            `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&apikey=${apiKey}`,
            { next: { revalidate: 3600 } }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching news:", error);
        return MOCK_ARTICLES;
    }
}
