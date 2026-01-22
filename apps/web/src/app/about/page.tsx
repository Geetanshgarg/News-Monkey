"use client";

import { motion } from "framer-motion";
import { Newspaper, Keyboard, Cpu, Globe, Rocket, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-20"
            >
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto text-primary"
                    >
                        <Newspaper className="w-10 h-10" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black font-outfit">About NewsType</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We believe that practicing your skills shouldn't be boring. NewsType was born from the idea that you can stay informed and grow faster at the same time.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        {
                            title: "The Mission",
                            desc: "To provide a premium, distraction-free environment for people to improve their typing speed using relevant, real-world content.",
                            icon: Rocket,
                            color: "text-blue-400"
                        },
                        {
                            title: "Real-Time Flux",
                            desc: "Our platform connects directly to global news APIs to ensure you're always typing the latest headlines, not static text.",
                            icon: Globe,
                            color: "text-purple-400"
                        },
                        {
                            title: "Privacy First",
                            desc: "Your data stays with you. We don't track your keystrokes or private information beyond what's needed for your session stats.",
                            icon: ShieldCheck,
                            color: "text-emerald-400"
                        },
                        {
                            title: "Open Source Soul",
                            desc: "Built with the latest web technologies like Next.js, Framer Motion, and Three.js to provide a world-class experience.",
                            icon: Cpu,
                            color: "text-pink-400"
                        }
                    ].map((item, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-4">
                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black font-outfit">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-white/10 text-center space-y-8">
                    <h2 className="text-4xl font-black font-outfit">Ready to start?</h2>
                    <p className="text-xl text-muted-foreground">Join thousands of users who are master their typing every day.</p>
                    <Link
                        href="/practice"
                        className="inline-flex px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-primary/40"
                    >
                        Start Your First Session
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground pt-12">
                    <span>Made with</span>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>for the typing community</span>
                </div>
            </motion.div>
        </div>
    );
}
