import { countries } from "../countries";
import { grapes } from "../grapes";
import { slugify, wordCount } from "../helpers";
import type { Chapter, ChapterSeed, Country, Grape, QuizQuestion } from "../types";
import { part1 } from "./part1";
import { part2 } from "./part2";
import { part5 } from "./part5";
import { part6, part7 } from "./part6-7";
import { part8 } from "./part8";

export type { Chapter, QuizQuestion } from "../types";

export const chapterParts = [
  { id: "parte-1", label: "Parte I", title: "Entendendo o vinho", summary: "O que é vinho, estilos, produção, safra e rótulos." },
  { id: "parte-2", label: "Parte II", title: "Aprendendo a degustar", summary: "Olhar, cheirar e provar com método." },
  { id: "parte-3", label: "Parte III", title: "Uvas", summary: "Quinze uvas essenciais e suas assinaturas." },
  { id: "parte-4", label: "Parte IV", title: "Regiões", summary: "Uma viagem por onze países produtores." },
  { id: "parte-5", label: "Parte V", title: "Harmonização", summary: "Princípios e combinações, da carne de sol ao chocolate." },
  { id: "parte-6", label: "Parte VI", title: "Comprar vinho", summary: "Mercado, loja, restaurante, rótulos e preço." },
  { id: "parte-7", label: "Parte VII", title: "Adega", summary: "Guardar, conservar, decantar e servir." },
  { id: "parte-8", label: "Parte VIII", title: "Nível avançado", summary: "Terroir, barricas, técnicas e potencial de guarda." },
] as const;

const scaleWord = ["", "muito baixo", "baixo", "médio", "alto", "muito alto"];
const bodyWord = ["", "muito leve", "leve", "médio", "encorpado", "muito encorpado"];

/** Títulos usados nas versões anteriores, mantidos para preservar o progresso salvo. */
const grapeChapterTitle: Record<string, string> = { syrah: "Syrah e Shiraz" };

const grapeChapter = (g: Grape): ChapterSeed => ({
  title: grapeChapterTitle[g.slug] ?? g.name,
  intro: g.summary,
  body: [
    ...g.story,
    "## O perfil na taça",
    `${g.color === "Tinta" ? "Uva tinta" : "Uva branca"} de origem em ${g.origin}, costuma dar vinhos de corpo ${bodyWord[g.body]}, acidez ${scaleWord[g.acidity]}${g.color === "Tinta" ? `, tanino ${scaleWord[g.tannin]}` : ""} e álcool ${scaleWord[g.alcohol]}. Aromas frequentes: ${g.aromas.join(", ").toLowerCase()}. Com o tempo, podem surgir notas de ${g.evolved.join(", ").toLowerCase()}.`,
    "## Onde e como",
    `Regiões de referência: ${g.regions.join(", ")}. Sirva a ${g.temperature}, em ${g.glass.charAt(0).toLowerCase()}${g.glass.slice(1)}. ${g.aging}`,
    `À mesa, vale experimentar com ${g.pairings.join(", ").toLowerCase()}.`,
  ],
  takeaway: g.summary,
  practice: `Prove um ${g.name.split(" / ")[0]} e procure três destes aromas: ${g.aromas.slice(0, 4).join(", ").toLowerCase()}. Se puder, compare com um vinho de outra região da mesma uva e registre as diferenças na sua ficha.`,
  mistake: `Esperar que todo ${g.name.split(" / ")[0]} tenha o mesmo sabor. Clima, maturação, barrica e produtor mudam bastante o resultado.`,
  tip: g.curiosity,
  quiz: g.quiz,
  related: { grape: g.slug },
});

const countryChapter = (c: Country): ChapterSeed => ({
  title: c.name,
  intro: c.summary,
  body: [
    ...c.story,
    "## Regiões para conhecer",
    ...c.regions.map((r) => `${r.name}: ${r.styles} ${r.note}`),
    `Uvas que vale associar ao país: ${c.keyGrapes.join(", ")}.`,
  ],
  takeaway: c.summary,
  practice: c.regions.length > 1
    ? `Prove um vinho de ${c.regions[0].name} e outro de ${c.regions[1].name}. Anote como o clima de cada lugar aparece em corpo, acidez e aromas.`
    : `Prove um vinho de ${c.regions[0].name} e anote como o clima aparece em corpo, acidez e aromas.`,
  mistake: `Reduzir ${c.name === "Estados Unidos" ? "os Estados Unidos" : c.name} a um único tipo de vinho. Clima e tradição variam muito de uma região para outra.`,
  quiz: c.quiz,
  related: { country: c.slug },
});

/** Embaralha as alternativas de forma determinística (mesma ordem em toda visita), para a resposta certa não ficar sempre na mesma letra. */
const hash = (text: string) => [...text].reduce((h, ch) => (Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0), 2166136261);
const shuffleQuestion = (q: QuizQuestion): QuizQuestion => {
  if (q.options.length <= 2) return q;
  let seed = hash(q.question);
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { ...q, options: order.map((i) => q.options[i]), correct: order.indexOf(q.correct) };
};

const seeds: Record<string, ChapterSeed[]> = {
  "parte-1": part1,
  "parte-2": part2,
  "parte-3": grapes.map(grapeChapter),
  "parte-4": countries.map(countryChapter),
  "parte-5": part5,
  "parte-6": part6,
  "parte-7": part7,
  "parte-8": part8,
};

export const chapters: Chapter[] = chapterParts.flatMap((part) =>
  seeds[part.id].map((seed, index) => ({
    ...seed,
    quiz: seed.quiz.map(shuffleQuestion),
    slug: slugify(seed.title),
    part: part.id,
    partTitle: part.title,
    partLabel: part.label,
    number: index + 1,
    readingTime: Math.max(2, Math.round(wordCount([seed.intro, ...seed.body, seed.practice, seed.mistake]) / 180) + 2),
  })),
);

export const chapterBySlug = (slug: string) => chapters.find((c) => c.slug === slug);
export const chaptersOfPart = (partId: string) => chapters.filter((c) => c.part === partId);
export const chapterForGrape = (grapeSlug: string) => chapters.find((c) => c.related?.grape === grapeSlug);
export const chapterForCountry = (countrySlug: string) => chapters.find((c) => c.related?.country === countrySlug);
