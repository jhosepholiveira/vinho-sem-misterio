/**
 * Persistência das degustações. A interface (WineRepository) isola o armazenamento:
 * hoje usa LocalStorage; no futuro, basta trocar o adaptador por uma API ou banco.
 */
export type Tasting = {
  id: string;
  wineName: string;
  producer: string;
  country: string;
  region?: string;
  grape: string;
  vintage: string;
  price?: string;
  tastingDate?: string;
  appearance?: string;
  aromas: string;
  acidity: number;
  tannin: number;
  body: number;
  alcohol?: number;
  persistence: number;
  rating: number;
  buyAgain: boolean;
  favorite?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

export type TastingInput = Omit<Tasting, "id" | "createdAt" | "updatedAt">;

export type KeyValueStore = Pick<Storage, "getItem" | "setItem">;

export interface WineRepository {
  findAll(): Tasting[];
  findById(id: string): Tasting | undefined;
  create(input: TastingInput): Tasting;
  update(id: string, changes: Partial<TastingInput>): Tasting | undefined;
  delete(id: string): void;
  exportJson(): string;
  importJson(json: string): number;
}

export const TASTINGS_KEY = "vinho-sem-misterio:tastings";

const browserStore = (): KeyValueStore | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const clampScale = (value: unknown, max: number, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(1, Math.round(n))) : fallback;
};

/** Garante um registro válido mesmo vindo de versões antigas ou de um arquivo importado. */
export const normalizeTasting = (raw: Partial<Tasting>): Tasting | undefined => {
  if (!raw || typeof raw.wineName !== "string" || !raw.wineName.trim()) return undefined;
  const now = new Date().toISOString();
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : newId(),
    wineName: raw.wineName.trim(),
    producer: String(raw.producer ?? ""),
    country: String(raw.country ?? ""),
    region: raw.region ? String(raw.region) : "",
    grape: String(raw.grape ?? ""),
    vintage: String(raw.vintage ?? ""),
    price: raw.price ? String(raw.price) : "",
    tastingDate: raw.tastingDate ? String(raw.tastingDate) : (raw.createdAt ?? now).slice(0, 10),
    appearance: raw.appearance ? String(raw.appearance) : "",
    aromas: String(raw.aromas ?? ""),
    acidity: clampScale(raw.acidity, 5, 3),
    tannin: clampScale(raw.tannin, 5, 3),
    body: clampScale(raw.body, 5, 3),
    alcohol: clampScale(raw.alcohol, 5, 3),
    persistence: clampScale(raw.persistence, 5, 3),
    rating: Math.min(10, Math.max(0, Math.round(Number(raw.rating ?? 0)))),
    buyAgain: Boolean(raw.buyAgain),
    favorite: Boolean(raw.favorite),
    notes: raw.notes ? String(raw.notes) : "",
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  };
};

export const createWineRepository = (getStore: () => KeyValueStore | undefined = browserStore): WineRepository => {
  const read = (): Tasting[] => {
    const store = getStore();
    if (!store) return [];
    try {
      const parsed = JSON.parse(store.getItem(TASTINGS_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.map(normalizeTasting).filter((t): t is Tasting => Boolean(t)) : [];
    } catch {
      return [];
    }
  };
  const write = (items: Tasting[]) => {
    const store = getStore();
    if (!store) throw new Error("Armazenamento indisponível neste navegador.");
    store.setItem(TASTINGS_KEY, JSON.stringify(items));
  };
  const sortByDate = (items: Tasting[]) =>
    [...items].sort((a, b) => (b.tastingDate ?? b.createdAt).localeCompare(a.tastingDate ?? a.createdAt) || b.createdAt.localeCompare(a.createdAt));

  return {
    findAll: () => sortByDate(read()),
    findById: (id) => read().find((t) => t.id === id),
    create(input) {
      const item = normalizeTasting({ ...input, id: newId(), createdAt: new Date().toISOString() });
      if (!item) throw new Error("Informe o nome do vinho.");
      write([item, ...read()]);
      return item;
    },
    update(id, changes) {
      let found: Tasting | undefined;
      const next = read().map((item) => {
        if (item.id !== id) return item;
        found = normalizeTasting({ ...item, ...changes, id, createdAt: item.createdAt, updatedAt: new Date().toISOString() });
        return found ?? item;
      });
      write(next);
      return found;
    },
    delete(id) {
      write(read().filter((item) => item.id !== id));
    },
    exportJson: () => JSON.stringify({ app: "vinho-sem-misterio", version: 2, exportedAt: new Date().toISOString(), tastings: read() }, null, 2),
    importJson(json) {
      const data = JSON.parse(json);
      const incoming: unknown[] = Array.isArray(data) ? data : Array.isArray(data?.tastings) ? data.tastings : [];
      const current = read();
      const ids = new Set(current.map((t) => t.id));
      const added = incoming
        .map((raw) => normalizeTasting(raw as Partial<Tasting>))
        .filter((t): t is Tasting => Boolean(t) && !ids.has((t as Tasting).id));
      write([...added, ...current]);
      return added.length;
    },
  };
};

export const wineRepository = createWineRepository();
