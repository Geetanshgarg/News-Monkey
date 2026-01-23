import { create } from 'zustand';

interface Article {
  title: string;
  content: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

export interface HistoryItem {
  id: string;
  article: Article;
  wpm: number;
  accuracy: number;
  cpm: number;
  date: string;
  region: 'us' | 'in';
}

interface TypingState {
  // Config
  duration: number; // in seconds
  category: string;
  region: 'us' | 'in';

  // Article Data
  article: Article | null;

  // Game State
  startTime: number | null;
  endTime: number | null;
  isPaused: boolean;
  isActive: boolean;
  isFinished: boolean;

  // Typing Progress
  userInput: string;
  cursorIndex: number;
  errors: number;
  totalCharsTyped: number;
  correctCharsTyped: number;

  // Stats
  wpm: number;
  accuracy: number;
  cpm: number;
  timeLeft: number;

  // Settings
  soundEnabled: boolean;
  soundProfile: 'mechanical' | 'clicky' | 'thock' | 'blaster' | 'lightsaber';
  focusMode: boolean;

  // Persistence
  history: HistoryItem[];

  // Actions
  setDuration: (duration: number) => void;
  setCategory: (category: string) => void;
  setArticle: (article: Article) => void;
  startTest: () => void;
  pauseTest: () => void;
  resumeTest: () => void;
  resetTest: () => void;
  finishTest: () => void;
  updateInput: (input: string) => void;
  calculateStats: () => void;
  toggleSound: () => void;
  setSoundProfile: (profile: 'mechanical' | 'clicky' | 'thock' | 'blaster' | 'lightsaber') => void;
  toggleFocusMode: () => void;
  repeatArticle: () => void;
  setTimeLeft: (time: number) => void;
  setRegion: (region: 'us' | 'in') => void;
  clearHistory: () => void;
}

import { persist, createJSONStorage } from 'zustand/middleware';

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({
      duration: 60,
      category: 'general',
      region: 'us',
      article: null,
      startTime: null,
      endTime: null,
      isPaused: false,
      isActive: false,
      isFinished: false,
      userInput: '',
      cursorIndex: 0,
      errors: 0,
      totalCharsTyped: 0,
      correctCharsTyped: 0,
      wpm: 0,
      accuracy: 0,
      cpm: 0,
      timeLeft: 60,
      soundEnabled: true,
      soundProfile: 'mechanical',
      focusMode: false,
      history: [],

      setDuration: (duration) => set({ duration, timeLeft: duration }),
      setCategory: (category) => set({ category }),
      setArticle: (article) => set({ article, userInput: '', cursorIndex: 0, errors: 0, isActive: false, isFinished: false }),

      startTest: () => set({
        startTime: Date.now(),
        isActive: true,
        isPaused: false,
        isFinished: false,
        userInput: '',
        cursorIndex: 0,
        errors: 0,
        totalCharsTyped: 0,
        correctCharsTyped: 0,
        wpm: 0,
        accuracy: 100,
        cpm: 0,
        timeLeft: get().duration
      }),

      pauseTest: () => set({ isPaused: true, isActive: false }),
      resumeTest: () => set({ isPaused: false, isActive: true }),

      resetTest: () => set({
        article: null,
        isActive: false,
        isPaused: false,
        isFinished: false,
        userInput: '',
        cursorIndex: 0,
        errors: 0,
        startTime: null,
        endTime: null,
        wpm: 0,
        accuracy: 0,
        cpm: 0,
        timeLeft: get().duration
      }),

      finishTest: () => {
        const { calculateStats, article, wpm, accuracy, cpm, region, history } = get();
        calculateStats();

        // Final stats might need one last update if finishTest is called immediately after last char
        const now = Date.now();
        const stats = get(); // grab latest after calculateStats

        if (article) {
          const newItem: HistoryItem = {
            id: Math.random().toString(36).substr(2, 9),
            article,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            cpm: stats.cpm,
            date: new Date().toISOString(),
            region
          };
          set({ history: [newItem, ...history].slice(0, 50) }); // Keep last 50
        }

        set({ isFinished: true, isActive: false, endTime: now });
      },

      updateInput: (input: string) => {
        const { article, isActive, startTest, isFinished } = get();
        if (isFinished) return;
        if (!isActive) startTest();

        const targetText = article?.content || '';
        let errors = 0;
        let correctChars = 0;

        for (let i = 0; i < input.length; i++) {
          if (input[i] !== targetText[i]) {
            errors++;
          } else {
            correctChars++;
          }
        }

        set({
          userInput: input,
          cursorIndex: input.length,
          errors,
          totalCharsTyped: input.length,
          correctCharsTyped: correctChars
        });

        if (input.length === targetText.length) {
          get().finishTest();
        } else {
          get().calculateStats();
        }
      },

      calculateStats: () => {
        const { startTime, correctCharsTyped, totalCharsTyped, isFinished, endTime } = get();
        if (!startTime) return;

        const now = isFinished && endTime ? endTime : Date.now();
        const timeElapsedMinutes = (now - startTime) / 60000;

        if (timeElapsedMinutes <= 0) return;

        // Standard WPM calculation: (characters / 5) / minutes
        const wpm = Math.round((correctCharsTyped / 5) / timeElapsedMinutes);
        const cpm = Math.round(correctCharsTyped / timeElapsedMinutes);
        const accuracy = totalCharsTyped > 0
          ? Math.round((correctCharsTyped / totalCharsTyped) * 100)
          : 100;

        set({ wpm, cpm, accuracy });
      },

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundProfile: (soundProfile) => set({ soundProfile }),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
      repeatArticle: () => {
        const { article } = get();
        if (article) {
          set({
            userInput: '',
            cursorIndex: 0,
            errors: 0,
            isActive: false,
            isFinished: false,
            startTime: null,
            endTime: null,
            wpm: 0,
            accuracy: 100,
            cpm: 0,
            timeLeft: get().duration
          });
        }
      },
      setTimeLeft: (timeLeft) => set({ timeLeft }),
      setRegion: (region) => set({ region }),
      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'news-monkey-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        soundEnabled: state.soundEnabled,
        soundProfile: state.soundProfile,
        focusMode: state.focusMode
      }),
    }
  )
);
