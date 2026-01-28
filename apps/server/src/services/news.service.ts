export class NewsService {
    private static getApiKey() {
        // Updated to use NewsData API key from environment
        const key = process.env.NewsData_API_key;
        if (!key) {
            console.error("[NewsService] NewsData_API_key is missing from environment.");
        }
        return key;
    }

    /**
     * Get news directly from NewsData.io (Includes AI summary)
     */
    static async getNews(category: string = 'general', limit: number = 5): Promise<any[]> {
        try {
            const apiKey = this.getApiKey();
            if (!apiKey) return [];

            console.log(`[NewsService] Fetching NewsData.io for ${category}...`);
            // NewsData.io URL format. Language fixed to english.
            const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&size=${limit}`;

            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`NewsData API failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
            }

            const data = await response.json() as any;
            const articles = data.results || [];
            // console.log(articles)
            return articles.map((a: any) => {
                // Priority: ai_summary -> description -> content -> title
                // We use ai_summary if available as requested by user
                const typingContent = a.ai_summary || a.description || a.content || a.title;

                return {
                    title: a.title,
                    description: a.description || "",
                    content: typingContent,
                    source: { name: a.source_id || "Unknown Source" },
                    url: a.link,
                    imageUrl: a.image_url,
                    publishedAt: a.pubDate,
                    category,
                    isAiSummary: !!a.ai_summary
                };
            });
        } catch (error) {
            console.error("[NewsService] NewsData fetch error:", error);
            return [];
        }
    }

    /**
     * Status method (Simplified)
     */
    static async getStatus() {
        return {
            mode: "direct-fetch",
            provider: "NewsData.io",
            status: "ok",
            message: "News is fetched live from NewsData.io with native AI summaries."
        };
    }
}
