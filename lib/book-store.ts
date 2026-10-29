import { useSyncExternalStore } from "react";
import { chapters } from "../content/chapters";
import { wineRepository, type Tasting } from "../repositories/wine-repository";
import type { QuizScores } from "./progress";

/** Estado pessoal do leitor, persistido neste aparelho (LocalStorage). */
export type BookData = {
  completed: string[];
  quizScores: QuizScores;
  notes: Record<string, string>;
  tastings: Tasting[];
};

export const STORAGE_KEYS = {
  completed: "vinho-sem-misterio:completed-chapters",
  legacyFirstChapter: "vinho-sem-misterio:chapter-1",
  quizScores: "vinho-sem-misterio:quiz-scores",
  notes: "vinho-sem-misterio:chapter-notes",
} as const;

const EMPTY: BookData = { completed: [], quizScores: {}, notes: {}, tastings: [] };

const storage = () => {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
};

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const value = storage()?.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const load = (): BookData => {
  const legacy = storage()?.getItem(STORAGE_KEYS.legacyFirstChapter) === "done" ? [chapters[0].slug] : [];
  const completed = readJson<string[]>(STORAGE_KEYS.completed, legacy);
  return {
    completed: Array.isArray(completed) ? completed : legacy,
    quizScores: readJson<QuizScores>(STORAGE_KEYS.quizScores, {}),
    notes: readJson<Record<string, string>>(STORAGE_KEYS.notes, {}),
    tastings: wineRepository.findAll(),
  };
};

let cache: BookData | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const write = (key: string, value: unknown) => {
  try {
    storage()?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const bookStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = () => {
      cache = load();
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot(): BookData {
    if (!cache) cache = load();
    return cache;
  },
  getServerSnapshot: (): BookData => EMPTY,

  completeChapter(slug: string) {
    const data = bookStore.getSnapshot();
    if (data.completed.includes(slug)) return;
    const completed = [...data.completed, slug];
    write(STORAGE_KEYS.completed, completed);
    cache = { ...data, completed };
    emit();
  },
  saveQuiz(slug: string, score: number, total: number) {
    const data = bookStore.getSnapshot();
    const previous = data.quizScores[slug];
    if (previous && previous.score >= score) return;
    const quizScores = { ...data.quizScores, [slug]: { score, total } };
    write(STORAGE_KEYS.quizScores, quizScores);
    cache = { ...data, quizScores };
    emit();
  },
  saveNote(slug: string, text: string) {
    const data = bookStore.getSnapshot();
    const notes = { ...data.notes };
    if (text.trim()) notes[slug] = text;
    else delete notes[slug];
    const ok = write(STORAGE_KEYS.notes, notes);
    cache = { ...data, notes };
    emit();
    return ok;
  },
  refreshTastings() {
    cache = { ...bookStore.getSnapshot(), tastings: wineRepository.findAll() };
    emit();
  },
  resetProgress() {
    write(STORAGE_KEYS.completed, []);
    write(STORAGE_KEYS.quizScores, {});
    cache = { ...bookStore.getSnapshot(), completed: [], quizScores: {} };
    emit();
  },
};

export const useBook = () => useSyncExternalStore(bookStore.subscribe, bookStore.getSnapshot, bookStore.getServerSnapshot);
