"use client";

import { useTypingStore } from "@/store/useTypingStore";
import { motion } from "framer-motion";
import {
    Clock,
    Volume2,
    EyeOff,
    Monitor,
    Type,
    Keyboard,
    ShieldCheck
} from "lucide-react";

export default function SettingsPage() {
    const { duration, setDuration } = useTypingStore();

    const settingsGroups = [
        {
            title: "Test Preferences",
            icon: Clock,
            items: [
                {
                    label: "Test Duration",
                    desc: "Choose how long you want each practice session to last.",
                    component: (
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            {[30, 60, 180].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${duration === d ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 text-muted-foreground'
                                        }`}
                                >
                                    {d === 180 ? '3m' : `${d}s`}
                                </button>
                            ))}
                        </div>
                    )
                }
            ]
        },
        {
            title: "Experience",
            icon: Monitor,
            items: [
                {
                    label: "Sound Effects",
                    desc: "Play subtle mechanical keyboard sounds as you type.",
                    component: (
                        <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-not-allowed">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full" />
                        </div>
                    )
                },
                {
                    label: "Focus Mode",
                    desc: "Automatically hide the Navbar and Stats during typing sessions.",
                    component: (
                        <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-not-allowed">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-muted-foreground rounded-full" />
                        </div>
                    )
                }
            ]
        }
    ];

    return (
        <div className="container mx-auto px-4 py-20 max-w-3xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="space-y-2">
                    <h1 className="text-4xl font-black font-outfit">Settings</h1>
                    <p className="text-muted-foreground text-lg">Customize your typing experience and workspace.</p>
                </div>

                <div className="space-y-12">
                    {settingsGroups.map((group, i) => (
                        <div key={i} className="space-y-6">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <group.icon className="w-5 h-5" />
                                <h2 className="font-bold uppercase tracking-widest text-sm">{group.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {group.items.map((item, j) => (
                                    <div key={j} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between gap-8">
                                        <div className="space-y-1">
                                            <p className="font-bold text-lg">{item.label}</p>
                                            <p className="text-sm text-muted-foreground max-w-sm">{item.desc}</p>
                                        </div>
                                        {item.component}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
                    <div className="space-y-1">
                        <p className="font-bold text-amber-500">Experimental Features</p>
                        <p className="text-sm text-amber-500/80">Some settings like Sound Effects and Focus Mode are currently in preview and will be fully enabled in the next update.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
