import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  logLevel: "error",
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true },
});
after(() => vite.close());

const load = (path) => vite.ssrLoadModule(path);
const { chapters, chapterParts } = await load("/content/chapters/index.ts");
const { grapes, matchGrape } = await load("/content/grapes.ts");
const { countries } = await load("/content/countries.ts");
const { glossary } = await load("/content/glossary.ts");
const { pairings } = await load("/content/pairings.ts");
const progress = await load("/lib/progress.ts");
const { createWineRepository, TASTINGS_KEY } = await load("/repositories/wine-repository.ts");

const memoryStore = () => {
  const data = new Map();
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)), data };
};

const tasting = (overrides = {}) => ({
  wineName: "Teste",
  producer: "",
  country: "Brasil",
  region: "",
  grape: "Merlot",
  vintage: "2022",
  price: "",
  tastingDate: "2026-10-01",
  appearance: "",
  aromas: "",
  acidity: 3,
  tannin: 3,
  body: 3,
  alcohol: 3,
  persistence: 3,
  rating: 8,
  buyAgain: true,
  favorite: false,
  notes: "",
  ...overrides,
});

test("o livro tem 88 capítulos em oito partes, com slugs únicos", () => {
  assert.equal(chapters.length, 88);
  assert.equal(chapterParts.length, 8);
  assert.equal(new Set(chapters.map((c) => c.slug)).size, chapters.length);
  for (const part of chapterParts) assert.ok(chapters.some((c) => c.part === part.id), part.id);
});

test("slugs antigos continuam válidos para preservar o progresso salvo", () => {
  for (const slug of ["afinal-o-que-e-vinho", "syrah-e-shiraz", "carmenere", "o-que-faz-um-vinho-custar-r-50-r-200-ou-r-1-000", "potencial-de-guarda"]) {
    assert.ok(chapters.some((c) => c.slug === slug), slug);
  }
});

test("todo capítulo tem conteúdo real e um quiz explicado e válido", () => {
  for (const c of chapters) {
    assert.ok(c.body.filter((p) => !p.startsWith("## ")).length >= 2, `${c.slug}: corpo curto`);
    assert.ok(c.practice.length > 30 && c.mistake.length > 20, `${c.slug}: prática/erro`);
    assert.ok(c.quiz.length >= 3, `${c.slug}: quiz`);
    for (const q of c.quiz) {
      assert.ok(q.options.length >= 2, `${c.slug}: opções`);
      assert.ok(q.correct >= 0 && q.correct < q.options.length, `${c.slug}: índice correto fora do intervalo em "${q.question}"`);
      assert.equal(new Set(q.options).size, q.options.length, `${c.slug}: opções repetidas`);
      assert.ok(q.explanation.length > 10, `${c.slug}: explicação ausente`);
      assert.notEqual(q.options[q.correct], c.takeaway, `${c.slug}: resposta é a própria frase-resumo`);
    }
  }
});

test("os quizzes não têm todas as respostas na mesma posição", () => {
  const positions = new Set(chapters.flatMap((c) => c.quiz.filter((q) => q.options.length > 2).map((q) => q.correct)));
  assert.ok(positions.size >= 3);
  const trueFalse = chapters.flatMap((c) => c.quiz.filter((q) => q.options.length === 2));
  assert.ok(trueFalse.some((q) => q.correct === 1), "existem afirmações falsas");
});

test("links relacionados apontam para conteúdo existente", () => {
  const terms = new Set(glossary.map((g) => g.slug));
  for (const c of chapters) {
    for (const slug of c.related?.glossary ?? []) assert.ok(terms.has(slug), `${c.slug} → glossário ${slug}`);
    if (c.related?.grape) assert.ok(grapes.some((g) => g.slug === c.related.grape));
    if (c.related?.country) assert.ok(countries.some((x) => x.slug === c.related.country));
  }
  for (const g of glossary) for (const r of g.related ?? []) assert.ok(glossary.some((x) => x.term === r), `${g.term} → ${r}`);
});

test("uvas, países, glossário e harmonizações cobrem o escopo do livro", () => {
  assert.equal(grapes.length, 15);
  assert.equal(countries.length, 11);
  assert.ok(glossary.length >= 30);
  assert.ok(pairings.length >= 16);
  for (const dish of ["Carne de sol", "Sururu", "Escondidinho de carne de sol", "Churrasco", "Risoto de cogumelos"]) {
    assert.ok(pairings.some((p) => p.dish === dish), dish);
  }
  for (const g of grapes) {
    for (const key of ["body", "tannin", "acidity", "alcohol", "sweetness"]) assert.ok(g[key] >= 1 && g[key] <= 5, `${g.slug}.${key}`);
  }
});

test("reconhece uvas escritas de formas diferentes", () => {
  assert.equal(matchGrape("Shiraz")?.slug, "syrah");
  assert.equal(matchGrape("cabernet sauvignon")?.slug, "cabernet-sauvignon");
  assert.equal(matchGrape("Espumante Moscatel")?.slug, "moscato");
  assert.equal(matchGrape("Tinta Roriz")?.slug, "tempranillo");
  assert.equal(matchGrape("Côtes du Rhône"), undefined);
  assert.equal(matchGrape(""), undefined);
});

test("repository cria, edita, exclui e persiste degustações", () => {
  const store = memoryStore();
  const repo = createWineRepository(() => store);
  const a = repo.create(tasting({ wineName: "Primeiro", tastingDate: "2026-01-01" }));
  const b = repo.create(tasting({ wineName: "Segundo", tastingDate: "2026-05-01" }));
  assert.equal(repo.findAll().length, 2);
  assert.equal(repo.findAll()[0].id, b.id, "mais recente primeiro");
  const updated = repo.update(a.id, { rating: 10, favorite: true });
  assert.equal(updated.rating, 10);
  assert.ok(updated.updatedAt);
  assert.equal(createWineRepository(() => store).findById(a.id).favorite, true, "persistiu no armazenamento");
  repo.delete(b.id);
  assert.deepEqual(repo.findAll().map((t) => t.id), [a.id]);
  assert.throws(() => repo.create(tasting({ wineName: "   " })));
});

test("repository tolera dados antigos ou corrompidos e importa backups", () => {
  const store = memoryStore();
  store.setItem(TASTINGS_KEY, JSON.stringify([{ id: "x", wineName: "Antigo", grape: "Merlot", rating: 9, acidity: 9, createdAt: "2026-01-01T00:00:00.000Z" }, { nope: true }]));
  const repo = createWineRepository(() => store);
  const [old] = repo.findAll();
  assert.equal(repo.findAll().length, 1);
  assert.equal(old.acidity, 5, "escala limitada a 5");
  assert.equal(old.tastingDate, "2026-01-01");
  const backup = repo.exportJson();
  const otherStore = memoryStore();
  const other = createWineRepository(() => otherStore);
  assert.equal(other.importJson(backup), 1);
  assert.equal(other.importJson(backup), 0, "não duplica");
  store.setItem(TASTINGS_KEY, "{corrompido");
  assert.deepEqual(repo.findAll(), []);
});

test("níveis e pontos de progresso", () => {
  assert.equal(progress.levelFor(0).current.name, "Curioso");
  assert.equal(progress.levelFor(15).current.name, "Apreciador");
  assert.equal(progress.levelFor(14).missing, 1);
  assert.equal(progress.levelFor(1000).next, undefined);
  const state = {
    completed: [chapters[0].slug, chapters[1].slug, "slug-inexistente"],
    tastings: [tasting({ grape: "Merlot" }), tasting({ grape: "Shiraz" }), tasting({ grape: "Merlot" })],
    quizScores: { a: { score: 3, total: 3 }, b: { score: 2, total: 3 } },
  };
  // 2 capítulos + 3 degustações×2 + 2 uvas×2 + 1 quiz perfeito
  assert.equal(progress.journeyPoints(state), 2 + 6 + 4 + 1);
});

test("estatísticas, conquistas e perfil sensorial", () => {
  const tastings = [
    tasting({ grape: "Cabernet Sauvignon", country: "França", body: 5, tannin: 5, rating: 9 }),
    tasting({ grape: "Malbec", country: "Argentina", body: 4, tannin: 4, rating: 8 }),
    tasting({ grape: "Riesling", country: "Alemanha", body: 2, tannin: 1, rating: 5 }),
  ];
  const state = { completed: [], tastings, quizScores: {} };
  const stats = progress.journeyStats(state);
  assert.equal(stats.tastings, 3);
  assert.equal(stats.grapes, 3);
  assert.equal(stats.countries, 3);
  assert.equal(stats.average, "7,3");
  const badges = progress.badges(state);
  assert.ok(badges.find((b) => b.id === "primeira-taca").earned);
  assert.ok(!badges.find((b) => b.id === "dez-degustacoes").earned);
  assert.equal(progress.sensoryProfile([tastings[0]]), undefined, "precisa de pelo menos dois vinhos");
  const profile = progress.sensoryProfile(tastings);
  assert.equal(profile.sample, 2, "usa os vinhos com nota 7 ou mais");
  assert.ok(profile.lines.includes("Tintos"));
  assert.equal(profile.topGrapes[0], "Cabernet Sauvignon");
});

test("progresso por parte", () => {
  const firstPart = chapters.filter((c) => c.part === "parte-1").map((c) => c.slug);
  const parts = progress.partProgress(firstPart);
  assert.equal(parts[0].done, parts[0].total);
  assert.equal(parts[1].done, 0);
  assert.ok(progress.badges({ completed: firstPart, tastings: [], quizScores: {} }).find((b) => b.id === "fundamentos").earned);
});
