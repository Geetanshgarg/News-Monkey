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
    const {
        duration,
        setDuration,
        soundEnabled,
        toggleSound,
        soundProfile,
        setSoundProfile,
        focusMode,
        toggleFocusMode
    } = useTypingStore();

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
                    desc: "Play mechanical keyboard sounds as you type.",
                    component: (
                        <button
                            onClick={toggleSound}
                            className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-primary' : 'bg-white/10'}`}
                        >
                            <motion.div
                                animate={{ x: soundEnabled ? 24 : 4 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    )
                },
                {
                    label: "Sound Profile",
                    desc: "Choose your preferred mechanical switch or sci-fi sound.",
                    component: (
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 flex-wrap">
                            {(['mechanical', 'clicky', 'thock', 'blaster', 'lightsaber'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setSoundProfile(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${soundProfile === p ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 text-muted-foreground'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )
                },
                {
                    label: "Focus Mode",
                    desc: "Automatically hide the Navbar and Stats during typing sessions.",
                    component: (
                        <button
                            onClick={toggleFocusMode}
                            className={`w-12 h-6 rounded-full relative transition-colors ${focusMode ? 'bg-primary' : 'bg-white/10'}`}
                        >
                            <motion.div
                                animate={{ x: focusMode ? 24 : 4 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
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
            </motion.div>
        </div>
    );
}
