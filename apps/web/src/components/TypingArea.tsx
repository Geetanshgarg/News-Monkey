"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTypingStore } from '@/store/useTypingStore';
import { Keyboard } from 'lucide-react';

export default function TypingArea() {
    const {
        article,
        userInput,
        updateInput,
        isActive,
        isPaused,
        isFinished,
        cursorIndex,
        soundEnabled,
        focusMode,
        toggleFocusMode,
        pauseTest,
        resumeTest
    } = useTypingStore();

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState(false);
    const [cheatWarning, setCheatWarning] = useState(false);

    // Mechanical Click Audio Logic
    const playClick = () => {
        if (!soundEnabled) return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    useEffect(() => {
        if (isActive && !isPaused && !isFinished) {
            inputRef.current?.focus();
        }
    }, [isActive, isPaused, isFinished]);

    // Anti-cheat: Detect tab switch
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive && !isFinished) {
                pauseTest();
                setCheatWarning(true);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isActive, isFinished, pauseTest]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isFinished) return;
        playClick();
        updateInput(e.target.value);
    };

    const handleFocus = () => {
        setFocus(true);
        if (isPaused && !isFinished) resumeTest();
    };

    const handleBlur = () => setFocus(false);

    // Auto-scroll logic
    useEffect(() => {
        const cursorElement = document.getElementById('typing-cursor');
        if (cursorElement && scrollRef.current) {
            const container = scrollRef.current;
            const cursorTop = cursorElement.offsetTop;
            const containerHeight = container.clientHeight;

            if (cursorTop > container.scrollTop + containerHeight - 120) {
                container.scrollTo({
                    top: cursorTop - 120,
                    behavior: 'smooth'
                });
            }
        }
    }, [cursorIndex]);

    const text = article?.content || "";

    return (
        <div className={`relative w-full max-w-4xl mx-auto group transition-all duration-700 ${focusMode && isActive ? 'mt-4 scale-105' : 'mt-12'}`}>
            {/* Container for the text */}
            <div
                ref={scrollRef}
                onClick={() => inputRef.current?.focus()}
                className={`relative min-h-[300px] max-h-[400px] overflow-y-auto p-12 rounded-[2.5rem] border transition-all duration-500 cursor-text scrollbar-hide ${focus
                        ? 'bg-black/60 border-primary/40 shadow-[0_0_80px_rgba(59,130,246,0.1)] ring-1 ring-primary/20'
                        : 'bg-black/20 border-white/5 shadow-xl'
                    }`}
            >
                <div className={`relative text-2xl md:text-3xl font-medium leading-relaxed tracking-tight select-none transition-all ${focusMode && isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
                    {text.split('').map((char, i) => {
                        let color = 'text-muted-foreground/30';
                        let isTyped = i < userInput.length;
                        let isCorrect = isTyped && userInput[i] === text[i];
                        let isCurrent = i === userInput.length;

                        if (isTyped) {
                            color = isCorrect ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'text-red-500 bg-red-500/10 rounded-sm';
                        }

                        return (
                            <span
                                key={i}
                                className={`${color} transition-colors duration-150 relative`}
                                id={isCurrent ? 'typing-cursor' : undefined}
                            >
                                {char}
                                {isCurrent && (
                                    <motion.span
                                        layoutId="cursor"
                                        className="absolute -bottom-1 left-0 w-full h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    />
                                )}
                            </span>
                        );
                    })}
                </div>

                {/* Focus Warning Overlay */}
                {!focus && !isFinished && isActive && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center z-20 transition-all">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
                                <Keyboard className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-2xl font-black font-outfit">Focus Required</p>
                                <p className="text-muted-foreground">Click anywhere to resume your session</p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Anti-cheat Overlay */}
                {cheatWarning && isPaused && !focus && (
                    <div className="absolute inset-x-0 top-0 p-4 bg-red-500/20 border-b border-red-500/30 backdrop-blur-md text-center text-xs font-bold uppercase tracking-widest text-red-500 z-30">
                        Tab switch detected. Test paused to ensure accuracy.
                    </div>
                )}
            </div>

            {/* Hidden Textarea */}
            <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={isFinished}
                className="absolute top-0 left-0 opacity-0 w-1 h-1 pointer-events-none"
                autoFocus
            />

            <div className={`mt-6 flex justify-between items-center px-4 transition-opacity duration-500 ${focusMode && isActive && focus ? 'opacity-0' : 'opacity-100'}`}>
                <div className="text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    Source: <span className="text-white font-medium">{article?.source || 'Unknown'}</span>
                </div>
                <div className="flex gap-6 items-center">
                    <button
                        onClick={toggleFocusMode}
                        className={`text-xs font-bold uppercase tracking-widest transition-colors ${focusMode ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        Focus Mode {focusMode ? '(ON)' : '(OFF)'}
                    </button>
                </div>
            </div>
        </div>
    );
}
