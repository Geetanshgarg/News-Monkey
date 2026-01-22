"use client";

import { useTypingStore } from "@/store/useTypingStore";
import ArticleSelector from "@/components/ArticleSelector";
import TypingArea from "@/components/TypingArea";
import PracticeStats from "@/components/PracticeStats";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowLeft, BookOpen, Settings2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PracticePage() {
    const { article, resetTest, isFinished } = useTypingStore();
    const router = useRouter();

    useEffect(() => {
        if (isFinished) {
            router.push("/results");
        }
    }, [isFinished, router]);

    return (
        <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-64px)]">
            <AnimatePresence mode="wait">
                {!article ? (
                    <motion.div
                        key="selector"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black font-outfit">Select Your Story</h1>
                            <p className="text-xl text-muted-foreground mx-auto max-w-2xl">
                                Choose a category and pick an article to start your practice session.
                            </p>
                        </div>
                        <ArticleSelector />
                    </motion.div>
                ) : (
                    <motion.div
                        key="practice"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="relative"
                    >
                        {/* Practice Header */}
                        <div className="flex justify-between items-end mb-12">
                            <div className="space-y-2">
                                <button
                                    onClick={resetTest}
                                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Change Article
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black font-outfit line-clamp-1 max-w-xl">
                                            {article.title}
                                        </h2>
                                        <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
                                            Practice Session • {article.source}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => useTypingStore.getState().resetTest()}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                    title="Restart Test"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                                <Link
                                    href="/settings"
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <Settings2 className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        <PracticeStats />
                        <TypingArea />

                        <div className="mt-12 text-center text-muted-foreground/40 text-sm font-medium italic">
                            Tip: Start typing to begin the timer automatically. Use "Enter" to restart.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
