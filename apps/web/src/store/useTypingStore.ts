import { create } from 'zustand';

interface Article {
  title: string;
  content: string;
  url: string;
  source: string;
  category: string;
}

interface TypingState {
  // Config
  duration: number; // in seconds
  category: string;

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

  // Settings
  soundEnabled: boolean;
  focusMode: boolean;

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
  toggleFocusMode: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  duration: 60,
  category: 'general',
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
  soundEnabled: true,
  focusMode: false,

  setDuration: (duration) => set({ duration }),
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
    cpm: 0
  }),

  pauseTest: () => set({ isPaused: true, isActive: false }),
  resumeTest: () => set({ isPaused: false, isActive: true }),

  resetTest: () => set({
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
    cpm: 0
  }),

  finishTest: () => {
    const { calculateStats } = get();
    calculateStats();
    set({ isFinished: true, isActive: false, endTime: Date.now() });
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
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode }))
}));
