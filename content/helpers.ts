import type { QuizQuestion } from "./types";

/** Cria uma pergunta de quiz. `correct` é o índice (0-based) da opção certa. */
export const q = (question: string, options: string[], correct: number, explanation: string): QuizQuestion => ({
  question,
  options,
  correct,
  explanation,
});

/** Verdadeiro ou falso. */
export const tf = (statement: string, isTrue: boolean, explanation: string): QuizQuestion =>
  q(`Verdadeiro ou falso: ${statement}`, ["Verdadeiro", "Falso"], isTrue ? 0 : 1, explanation);

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const wordCount = (texts: string[]) => texts.join(" ").split(/\s+/).filter(Boolean).length;
