"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Zap, Target, TrendingUp, ArrowRight, History, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface TypingResult {
  id: string;
  articleTitle: string;
  articleSource: string;
  wpm: number;
  accuracy: number;
  createdAt: string;
  category: string;
}

export default function Dashboard({ session }: { session: typeof authClient.$Infer.Session }) {
  const [results, setResults] = useState<TypingResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/typing/results");
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const stats = {
    totalSessions: results.length,
    averageWPM: results.length > 0
      ? Math.round(results.reduce((acc, curr) => acc + curr.wpm, 0) / results.length)
      : 0,
    averageAccuracy: results.length > 0
      ? Math.round(results.reduce((acc, curr) => acc + curr.accuracy, 0) / results.length)
      : 0,
    headlinesCompleted: results.length,
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black font-outfit">
              Welcome back, {session.user.name.split(' ')[0]}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Your typing journey is evolving.
            </p>
          </div>

          <Link
            href="/practice"
            className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 overflow-hidden"
          >
            <Zap className="w-5 h-5" />
            Start Practice
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Sessions", value: stats.totalSessions, icon: History, color: "text-blue-400" },
            { label: "Average WPM", value: stats.averageWPM, icon: Zap, color: "text-yellow-400" },
            { label: "Accuracy", value: `${stats.averageAccuracy}%`, icon: TrendingUp, color: "text-emerald-400" },
            { label: "Articles Done", value: stats.headlinesCompleted, icon: Target, color: "text-purple-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/50 transition-all space-y-4"
            >
              <div className={`p-3 rounded-xl bg-white/5 w-fit ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black font-outfit">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent History */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black font-outfit">Recent Activity</h2>
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
            {loading ? (
              <div className="p-12 text-center animate-pulse text-muted-foreground">Loading history...</div>
            ) : results.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground italic">No practice sessions found. Time to start!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">Article</th>
                      <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">Category</th>
                      <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">WPM</th>
                      <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">Accuracy</th>
                      <th className="p-6 text-sm font-bold uppercase tracking-widest text-muted-foreground text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 10).map((result) => (
                      <tr key={result.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="p-6">
                          <p className="font-bold line-clamp-1 group-hover:text-primary transition-colors">{result.articleTitle}</p>
                          <p className="text-xs text-muted-foreground">{result.articleSource}</p>
                        </td>
                        <td className="p-6">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-tighter">
                            {result.category}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <span className="text-xl font-black font-outfit">{result.wpm}</span>
                        </td>
                        <td className="p-6 text-center">
                          <span className="text-xl font-black font-outfit">{result.accuracy}%</span>
                        </td>
                        <td className="p-6 text-right text-sm text-muted-foreground">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-white/10">
          <h3 className="text-2xl font-black font-outfit mb-6">💡 Typing Fundamentals</h3>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p>Focus on 100% accuracy first; speed is a natural byproduct of correct muscle memory.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p>Daily 15-minute bursts are more effective than weekly 2-hour marathons.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
