export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

/** Parágrafos de um capítulo. Uma string iniciada por "## " vira subtítulo. */
export type ChapterSeed = {
  title: string;
  intro: string;
  body: string[];
  takeaway: string;
  practice: string;
  mistake: string;
  quiz: QuizQuestion[];
  tip?: string;
  related?: { grape?: string; country?: string; glossary?: string[] };
};

export type Chapter = ChapterSeed & {
  slug: string;
  part: string;
  partTitle: string;
  partLabel: string;
  number: number;
  readingTime: number;
};

export type Scale = 1 | 2 | 3 | 4 | 5;

export type Grape = {
  slug: string;
  name: string;
  color: "Tinta" | "Branca";
  origin: string;
  summary: string;
  story: string[];
  body: Scale;
  tannin: Scale;
  acidity: Scale;
  alcohol: Scale;
  sweetness: Scale;
  aromas: string[];
  evolved: string[];
  regions: string[];
  pairings: string[];
  temperature: string;
  glass: string;
  aging: string;
  curiosity: string;
  accent: string;
  quiz: QuizQuestion[];
};

export type Region = {
  slug: string;
  name: string;
  climate: string;
  soil: string;
  grapes: string[];
  styles: string;
  note: string;
};

export type Country = {
  slug: string;
  name: string;
  world: "Velho Mundo" | "Novo Mundo";
  summary: string;
  story: string[];
  keyGrapes: string[];
  regions: Region[];
  quiz: QuizQuestion[];
};

export type GlossaryTerm = {
  slug: string;
  term: string;
  short: string;
  example?: string;
  related?: string[];
};

export type Pairing = {
  dish: string;
  category: "Carnes" | "Peixes e frutos do mar" | "Massas e grãos" | "Brasileiros" | "Queijos e petiscos" | "Doces";
  wines: string[];
  avoid?: string;
  why: string;
};
