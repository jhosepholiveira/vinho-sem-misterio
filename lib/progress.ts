import { chapters, chapterParts } from "../content/chapters";
import { allRegions, countries } from "../content/countries";
import { grapes, matchGrape } from "../content/grapes";
import type { Tasting } from "../repositories/wine-repository";

export type QuizScores = Record<string, { score: number; total: number }>;

export type JourneyState = {
  completed: string[];
  tastings: Tasting[];
  quizScores: QuizScores;
};

export const LEVELS = [
  { id: 1, name: "Curioso", min: 0, description: "Os primeiros passos: entender o que há na taça." },
  { id: 2, name: "Apreciador", min: 15, description: "Degustação, uvas e estilos começam a fazer sentido." },
  { id: 3, name: "Entusiasta", min: 45, description: "Regiões e harmonização entram no repertório." },
  { id: 4, name: "Conhecedor", min: 90, description: "Terroir, vinificação e guarda deixam de ser mistério." },
  { id: 5, name: "Connoisseur", min: 150, description: "Comparações finas, safras e degustação às cegas." },
] as const;

const norm = (v: string) => v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Pontos: capítulo concluído = 1; degustação registrada = 2; cada uva diferente provada = 2; quiz perfeito = 1. */
export const journeyPoints = ({ completed, tastings, quizScores }: JourneyState) => {
  const known = new Set(chapters.map((c) => c.slug));
  const chapterPoints = completed.filter((slug) => known.has(slug)).length;
  const perfectQuizzes = Object.values(quizScores).filter((s) => s.total > 0 && s.score === s.total).length;
  return chapterPoints + tastings.length * 2 + tastedGrapes(tastings).length * 2 + perfectQuizzes;
};

export const levelFor = (points: number) => {
  const index = LEVELS.reduce((acc, level, i) => (points >= level.min ? i : acc), 0);
  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  const progress = next ? Math.round(((points - current.min) / (next.min - current.min)) * 100) : 100;
  return { current, next, progress, missing: next ? next.min - points : 0 };
};

export const tastedGrapes = (tastings: Tasting[]) => {
  const slugs = new Set<string>();
  for (const t of tastings) {
    for (const part of t.grape.split(/[,/+&]| e /)) {
      const g = matchGrape(part);
      if (g) slugs.add(g.slug);
    }
  }
  return grapes.filter((g) => slugs.has(g.slug));
};

export const tastedCountries = (tastings: Tasting[]) => {
  const names = new Set(tastings.map((t) => norm(t.country)).filter(Boolean));
  return countries.filter((c) => names.has(norm(c.name)) || (c.slug === "estados-unidos" && (names.has("eua") || names.has("usa"))));
};

export const tastedRegions = (tastings: Tasting[]) => {
  const names = new Set(tastings.map((t) => norm(t.region ?? "")).filter(Boolean));
  return allRegions.filter((r) => names.has(norm(r.name)) || [...names].some((n) => n.length > 3 && norm(r.name).includes(n)));
};

export const journeyStats = (state: JourneyState) => {
  const { tastings, completed } = state;
  const ratings = tastings.map((t) => t.rating);
  return {
    tastings: tastings.length,
    grapes: tastedGrapes(tastings).length,
    grapesTotal: grapes.length,
    countries: new Set(tastings.map((t) => norm(t.country)).filter(Boolean)).size,
    countriesTotal: countries.length,
    regions: tastedRegions(tastings).length,
    regionsTotal: allRegions.length,
    average: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1).replace(".", ",") : "—",
    favorites: tastings.filter((t) => t.favorite).length,
    chapters: completed.filter((slug) => chapters.some((c) => c.slug === slug)).length,
    chaptersTotal: chapters.length,
  };
};

export const partProgress = (completed: string[]) =>
  chapterParts.map((part) => {
    const list = chapters.filter((c) => c.part === part.id);
    const done = list.filter((c) => completed.includes(c.slug)).length;
    return { ...part, done, total: list.length };
  });

export type Badge = { id: string; name: string; description: string; earned: boolean };

export const badges = (state: JourneyState): Badge[] => {
  const { tastings, quizScores } = state;
  const grapesTasted = tastedGrapes(tastings);
  const colorOf = (t: Tasting) => {
    const g = matchGrape(t.grape);
    return g?.color;
  };
  const byCountry = (name: string) => tastings.filter((t) => norm(t.country) === norm(name)).length;
  const parts = partProgress(state.completed);
  const perfect = Object.values(quizScores).filter((s) => s.total > 0 && s.score === s.total).length;
  return [
    { id: "primeira-taca", name: "Primeira Taça", description: "Registrar a primeira degustação.", earned: tastings.length >= 1 },
    { id: "cinco-uvas", name: "5 Uvas", description: "Provar cinco uvas diferentes do livro.", earned: grapesTasted.length >= 5 },
    { id: "dez-degustacoes", name: "10 Degustações", description: "Registrar dez vinhos.", earned: tastings.length >= 10 },
    {
      id: "brancos",
      name: "Descobrindo os Brancos",
      description: "Registrar três vinhos de uvas brancas.",
      earned: tastings.filter((t) => colorOf(t) === "Branca").length >= 3,
    },
    {
      id: "tintos",
      name: "Mestre dos Tintos",
      description: "Registrar dez vinhos de uvas tintas.",
      earned: tastings.filter((t) => colorOf(t) === "Tinta").length >= 10,
    },
    { id: "franca", name: "Explorador da França", description: "Provar três vinhos franceses.", earned: byCountry("França") >= 3 },
    { id: "italia", name: "Explorador da Itália", description: "Provar três vinhos italianos.", earned: byCountry("Itália") >= 3 },
    { id: "brasil", name: "Orgulho Nacional", description: "Provar três vinhos brasileiros.", earned: byCountry("Brasil") >= 3 },
    { id: "fundamentos", name: "Fundamentos Sólidos", description: "Concluir a Parte I do livro.", earned: parts[0].done === parts[0].total },
    { id: "degustador", name: "Paladar Treinado", description: "Concluir a Parte II do livro.", earned: parts[1].done === parts[1].total },
    { id: "quiz", name: "Resposta Certa", description: "Gabaritar cinco quizzes.", earned: perfect >= 5 },
  ];
};

export type SensoryProfile = {
  sample: number;
  lines: string[];
  averages: { label: string; value: number }[];
  topGrapes: string[];
};

/** Tendências observadas nas avaliações — não é uma verdade científica sobre o gosto da pessoa. */
export const sensoryProfile = (tastings: Tasting[]): SensoryProfile | undefined => {
  const liked = tastings.filter((t) => t.rating >= 7);
  const base = liked.length >= 2 ? liked : tastings;
  if (base.length < 2) return undefined;
  const avg = (pick: (t: Tasting) => number) => base.reduce((s, t) => s + pick(t), 0) / base.length;
  const body = avg((t) => t.body);
  const acidity = avg((t) => t.acidity);
  const tannin = avg((t) => t.tannin);
  const persistence = avg((t) => t.persistence);
  const word = (v: number, low: string, mid: string, high: string) => (v < 2.6 ? low : v < 3.6 ? mid : high);
  const colors = base.map((t) => matchGrape(t.grape)?.color).filter(Boolean);
  const reds = colors.filter((c) => c === "Tinta").length;
  const whites = colors.filter((c) => c === "Branca").length;
  const lines: string[] = [];
  if (colors.length >= 2) lines.push(reds > whites * 1.5 ? "Tintos" : whites > reds * 1.5 ? "Brancos" : "Tintos e brancos, sem preferência clara");
  lines.push(`Vinhos de corpo ${word(body, "leve", "médio", "médio a alto")}`);
  lines.push(`Acidez ${word(acidity, "suave", "equilibrada", "marcante")}`);
  if (reds > 0) lines.push(`Taninos ${word(tannin, "macios", "moderados", "firmes")}`);
  lines.push(`Persistência ${word(persistence, "curta", "média", "longa")}`);
  const counts = new Map<string, { sum: number; n: number }>();
  for (const t of base) {
    const g = matchGrape(t.grape);
    if (!g) continue;
    const c = counts.get(g.name) ?? { sum: 0, n: 0 };
    counts.set(g.name, { sum: c.sum + t.rating, n: c.n + 1 });
  }
  const topGrapes = [...counts.entries()]
    .sort((a, b) => b[1].sum / b[1].n - a[1].sum / a[1].n)
    .slice(0, 3)
    .map(([name]) => name);
  return {
    sample: base.length,
    lines,
    averages: [
      { label: "Corpo", value: body },
      { label: "Acidez", value: acidity },
      { label: "Tanino", value: tannin },
      { label: "Persistência", value: persistence },
    ],
    topGrapes,
  };
};
