"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypingStore } from '@/store/useTypingStore';
import { Newspaper, ChevronRight, RefreshCw, Layers } from 'lucide-react';

const categories = [
    { id: 'general', name: 'General', icon: '🌍' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'business', name: 'Business', icon: '📈' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'health', name: 'Health', icon: '🏥' },
];

export default function ArticleSelector() {
    const { setArticle, category, setCategory } = useTypingStore();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchArticles = async (cat: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/news?category=${cat}`);
            const data = await res.json();
            setArticles(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(category);
    }, [category]);

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4">
            {/* Category Selector */}
            <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95 border ${category === cat.id
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span className="font-semibold">{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Article List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="wait">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                        ))
                    ) : (
                        articles.map((article, idx) => (
                            <motion.button
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => setArticle({
                                    title: article.title,
                                    content: article.content || article.description,
                                    url: article.url,
                                    source: article.source.name,
                                    category: category
                                })}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-left space-y-3 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider">
                                    <Layers className="w-3 h-3" />
                                    {article.source.name}
                                </div>
                                <h3 className="font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {article.description}
                                </p>
                            </motion.button>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {!loading && articles.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No articles found. Try another category or check your API key.</p>
                    <button
                        onClick={() => fetchArticles(category)}
                        className="mt-4 px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl flex items-center gap-2 mx-auto transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry Fetch
                    </button>
                </div>
            )}
        </div>
    );
}
