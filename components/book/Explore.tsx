"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Check, ChevronRight, GitCompareArrows, Grape as GrapeIcon, MapPin, NotebookPen, Thermometer, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chapterForCountry, chapterForGrape } from "@/content/chapters";
import { countries } from "@/content/countries";
import { grapeBySlug, grapes, matchGrape } from "@/content/grapes";
import type { Country, Grape } from "@/content/types";
import { useBook } from "@/lib/book-store";
import { Prose, ScoreDots } from "./shared";
import { Link, navigate } from "./router";

type Tab = "uvas" | "regioes" | "comparar";

export function ExploreTabs({ active }: { active: Tab }) {
  const tabs: { id: Tab; label: string; to: string }[] = [
    { id: "uvas", label: "Uvas", to: "/explorar" },
    { id: "regioes", label: "Países e regiões", to: "/regioes" },
    { id: "comparar", label: "Comparador", to: "/comparar" },
  ];
  return (
    <nav className="explore-tabs" aria-label="Explorar">
      {tabs.map((t) => (
        <Link key={t.id} to={t.to} className={active === t.id ? "active" : ""} aria-current={active === t.id ? "page" : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

const useTastedSlugs = () => {
  const { tastings } = useBook();
  const counts = new Map<string, number>();
  for (const t of tastings) {
    const g = matchGrape(t.grape);
    if (g) counts.set(g.slug, (counts.get(g.slug) ?? 0) + 1);
  }
  return counts;
};

export function GrapeCatalog() {
  const [filter, setFilter] = useState<"todas" | "Tinta" | "Branca">("todas");
  const tasted = useTastedSlugs();
  const list = grapes.filter((g) => filter === "todas" || g.color === filter);
  return (
    <section className="content-shell page-space">
      <p className="eyebrow burgundy">ENCICLOPÉDIA VISUAL</p>
      <h1 className="page-title">
        Conheça as <i>uvas.</i>
      </h1>
      <p className="lead">Cada variedade tem uma assinatura. Abra uma ficha, compare sem pressa e descubra o que chama sua atenção.</p>
      <ExploreTabs active="uvas" />
      <div className="filter-chips" role="group" aria-label="Filtrar uvas">
        {(["todas", "Tinta", "Branca"] as const).map((f) => (
          <button key={f} type="button" className={filter === f ? "active" : ""} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "todas" ? `Todas (${grapes.length})` : f === "Tinta" ? "Tintas" : "Brancas"}
          </button>
        ))}
        <span className="filter-note">
          {tasted.size} de {grapes.length} já provadas
        </span>
      </div>
      <div className="grape-grid">
        {list.map((g) => (
          <Link key={g.slug} to={`/uvas/${g.slug}`} className="grape-tile" style={{ "--grape": g.accent } as React.CSSProperties}>
            <span>
              {g.color}
              {tasted.has(g.slug) && (
                <em className="tasted-tag">
                  <Check aria-hidden /> provada
                </em>
              )}
            </span>
            <GrapeIcon aria-hidden />
            <h3>{g.name}</h3>
            <p>{g.origin}</p>
            <div className="tile-metrics">
              <span>
                Corpo <ScoreDots value={g.body} label="Corpo" />
              </span>
              <span>
                Acidez <ScoreDots value={g.acidity} label="Acidez" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function GrapeDetail({ grape }: { grape: Grape }) {
  const { tastings } = useBook();
  const mine = tastings.filter((t) => matchGrape(t.grape)?.slug === grape.slug);
  const avg = mine.length ? (mine.reduce((s, t) => s + t.rating, 0) / mine.length).toFixed(1).replace(".", ",") : null;
  const chapter = chapterForGrape(grape.slug);
  const index = grapes.findIndex((g) => g.slug === grape.slug);
  const next = grapes[(index + 1) % grapes.length];
  const compareWith = grapes.find((g) => g.color === grape.color && g.slug !== grape.slug) ?? grapes[0];
  const metrics: [string, number][] = [
    ["Corpo", grape.body],
    ["Tanino", grape.tannin],
    ["Acidez", grape.acidity],
    ["Álcool", grape.alcohol],
    ["Doçura", grape.sweetness],
  ];
  return (
    <article className="content-shell page-space grape-page" style={{ "--grape": grape.accent } as React.CSSProperties}>
      <Link to="/explorar" className="back-link">
        <ArrowLeft aria-hidden /> Todas as uvas
      </Link>
      <p className="eyebrow burgundy">
        UVA {grape.color.toUpperCase()} · {grape.origin.toUpperCase()}
      </p>
      <h1 className="page-title">{grape.name}</h1>
      <p className="lead">{grape.summary}</p>
      <div className="grape-actions">
        <Button asChild>
          <Link to={`/praticar?uva=${encodeURIComponent(grape.name.split(" / ")[0])}`}>
            <NotebookPen aria-hidden /> Registrar degustação
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/comparar/${grape.slug},${compareWith.slug}`}>
            <GitCompareArrows aria-hidden /> Comparar
          </Link>
        </Button>
        {chapter && (
          <Button variant="outline" asChild>
            <Link to={`/capitulo/${chapter.slug}`}>
              <BookOpen aria-hidden /> Ler o capítulo
            </Link>
          </Button>
        )}
        <span className={`tasted-status ${mine.length ? "yes" : ""}`}>
          {mine.length ? (
            <>
              <Check aria-hidden /> Já provei · {mine.length} {mine.length === 1 ? "registro" : "registros"} · média {avg}
            </>
          ) : (
            "Ainda não provei"
          )}
        </span>
      </div>

      <div className="grape-detail">
        <div>
          <p className="eyebrow">AROMAS FREQUENTES</p>
          <div className="aromas">
            {grape.aromas.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
          <p className="eyebrow evolved-label">COM O TEMPO</p>
          <div className="aromas subtle">
            {grape.evolved.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        </div>
        <div className="metrics">
          {metrics.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <ScoreDots value={value} label={label} />
            </div>
          ))}
          <small>
            <Thermometer aria-hidden /> Servir a {grape.temperature} · {grape.glass}
          </small>
        </div>
      </div>

      <div className="grape-body">
        <div className="reading-column narrow">
          <Prose paragraphs={grape.story} />
          <aside>
            <span>CURIOSIDADE</span>
            <b>{grape.curiosity}</b>
            <p>{grape.aging}</p>
          </aside>
        </div>
        <div className="fact-columns">
          <section>
            <h2>
              <MapPin aria-hidden /> Onde brilha
            </h2>
            <ul>
              {grape.regions.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>
              <Wine aria-hidden /> À mesa
            </h2>
            <ul>
              {grape.pairings.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link to="/harmonizar" className="inline-link">
              Abrir o harmonizador <ChevronRight aria-hidden />
            </Link>
          </section>
        </div>
      </div>

      <Link to={`/uvas/${next.slug}`} className="next-grape">
        <span>Próxima uva</span>
        <strong>{next.name}</strong>
        <ChevronRight aria-hidden />
      </Link>
    </article>
  );
}

const COMPARE_ROWS: { key: keyof Pick<Grape, "body" | "tannin" | "acidity" | "alcohol" | "sweetness">; label: string; hint: string }[] = [
  { key: "body", label: "Corpo", hint: "peso na boca" },
  { key: "tannin", label: "Tanino", hint: "secura nas gengivas" },
  { key: "acidity", label: "Acidez", hint: "frescor e salivação" },
  { key: "alcohol", label: "Álcool", hint: "calor e densidade" },
  { key: "sweetness", label: "Doçura", hint: "açúcar residual típico" },
];

export function Comparator({ slugs }: { slugs: string[] }) {
  const initial = slugs
    .map(grapeBySlug)
    .filter((g): g is Grape => Boolean(g))
    .slice(0, 3);
  const selected = initial.length >= 2 ? initial : [grapes[0], grapes[1]];
  const update = (next: Grape[]) => navigate(`/comparar/${next.map((g) => g.slug).join(",")}`);
  return (
    <section className="content-shell page-space">
      <p className="eyebrow burgundy">COMPARADOR</p>
      <h1 className="page-title">
        Perceba as <i>diferenças.</i>
      </h1>
      <p className="lead">
        Escolha duas ou três uvas e veja, lado a lado, o que muda em estrutura, aromas e mesa. Os valores são tendências típicas, não regras.
      </p>
      <ExploreTabs active="comparar" />

      <p className="compare-instructions">
        Escolha de 2 a 3 uvas <b>({selected.length} selecionadas)</b>
      </p>
      <div className="compare-options" role="group" aria-label="Escolher uvas para comparar">
        {grapes.map((g) => {
          const isOn = selected.some((s) => s.slug === g.slug);
          return (
            <button
              key={g.slug}
              type="button"
              className={isOn ? "active" : ""}
              style={{ "--grape": g.accent } as React.CSSProperties}
              aria-pressed={isOn}
              disabled={(!isOn && selected.length >= 3) || (isOn && selected.length <= 2)}
              onClick={() => update(isOn ? selected.filter((s) => s.slug !== g.slug) : [...selected, g])}
            >
              {isOn && <Check aria-hidden />}
              {g.name}
            </button>
          );
        })}
      </div>

      <div className="compare-bars">
        {COMPARE_ROWS.map((row) => (
          <div key={row.key} className="compare-metric">
            <div className="compare-metric-label">
              <b>{row.label}</b>
              <small>{row.hint}</small>
            </div>
            <div className="compare-metric-bars">
              {selected.map((g) => (
                <div key={g.slug} className="bar-row" style={{ "--grape": g.accent } as React.CSSProperties}>
                  <span>{g.name.split(" / ")[0]}</span>
                  <div className="bar" role="img" aria-label={`${g.name}: ${row.label} ${g[row.key]} de 5`}>
                    <i style={{ width: `${g[row.key] * 20}%` }} />
                  </div>
                  <b>{g[row.key]}</b>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`compare-cards cols-${selected.length}`}>
        {selected.map((g) => (
          <article key={g.slug} style={{ "--grape": g.accent } as React.CSSProperties}>
            <span>{g.color}</span>
            <h2>{g.name}</h2>
            <p>{g.summary}</p>
            <dl>
              <dt>Aromas</dt>
              <dd>{g.aromas.join(", ")}</dd>
              <dt>Regiões</dt>
              <dd>{g.regions.slice(0, 4).join(", ")}</dd>
              <dt>À mesa</dt>
              <dd>{g.pairings.join(", ")}</dd>
              <dt>Serviço</dt>
              <dd>{g.temperature}</dd>
              <dt>Guarda</dt>
              <dd>{g.aging}</dd>
            </dl>
            <Link to={`/uvas/${g.slug}`} className="inline-link">
              Ficha completa <ChevronRight aria-hidden />
            </Link>
          </article>
        ))}
      </div>
      <p className="compare-tip">
        Para sentir de verdade: sirva as uvas escolhidas lado a lado, na mesma temperatura, e registre cada uma na ficha de degustação.
      </p>
    </section>
  );
}

export function RegionsView() {
  const { tastings } = useBook();
  const tastedCountries = new Set(tastings.map((t) => t.country.trim().toLowerCase()));
  const groups: Country["world"][] = ["Velho Mundo", "Novo Mundo"];
  return (
    <section className="content-shell page-space">
      <p className="eyebrow burgundy">VIAJE PELO VINHO</p>
      <h1 className="page-title">
        Países e <i>regiões.</i>
      </h1>
      <p className="lead">Onze países, mais de trinta regiões. Escolha um destino para conhecer clima, solos, uvas e estilos.</p>
      <ExploreTabs active="regioes" />
      {groups.map((world) => (
        <div key={world} className="world-group">
          <h2>{world}</h2>
          <div className="country-grid">
            {countries
              .filter((c) => c.world === world)
              .map((c) => (
                <Link key={c.slug} to={`/regioes/${c.slug}`} className="country-card">
                  <span>
                    {c.regions.length} regiões
                    {tastedCountries.has(c.name.toLowerCase()) && (
                      <em className="tasted-tag">
                        <Check aria-hidden /> provado
                      </em>
                    )}
                  </span>
                  <h3>{c.name}</h3>
                  <p>{c.summary}</p>
                  <small>{c.regions.map((r) => r.name).join(" · ")}</small>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export function CountryDetail({ country, highlight }: { country: Country; highlight?: string }) {
  const chapter = chapterForCountry(country.slug);
  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(`regiao-${highlight}`);
    const timer = setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    return () => clearTimeout(timer);
  }, [highlight]);
  return (
    <article className="content-shell page-space">
      <Link to="/regioes" className="back-link">
        <ArrowLeft aria-hidden /> Todos os países
      </Link>
      <p className="eyebrow burgundy">{country.world.toUpperCase()}</p>
      <h1 className="page-title">{country.name}</h1>
      <p className="lead">{country.summary}</p>
      <div className="grape-actions">
        {chapter && (
          <Button variant="outline" asChild>
            <Link to={`/capitulo/${chapter.slug}`}>
              <BookOpen aria-hidden /> Ler o capítulo
            </Link>
          </Button>
        )}
        <Button asChild>
          <Link to={`/praticar?pais=${encodeURIComponent(country.name)}`}>
            <NotebookPen aria-hidden /> Registrar um vinho daqui
          </Link>
        </Button>
      </div>
      <div className="reading-column narrow country-story">
        <Prose paragraphs={country.story} />
      </div>
      <div className="key-grapes">
        <span>UVAS PARA ASSOCIAR</span>
        <div>
          {country.keyGrapes.map((name) => {
            const g = matchGrape(name);
            return g ? (
              <Link key={name} to={`/uvas/${g.slug}`}>
                {name}
              </Link>
            ) : (
              <em key={name}>{name}</em>
            );
          })}
        </div>
      </div>
      <h2 className="regions-title">Regiões</h2>
      <div className="region-grid">
        {country.regions.map((r) => (
          <section key={r.slug} id={`regiao-${r.slug}`} className={`region-card ${highlight === r.slug ? "highlight" : ""}`}>
            <h3>{r.name}</h3>
            <p>{r.styles}</p>
            <dl>
              <dt>Clima</dt>
              <dd>{r.climate}</dd>
              <dt>Solo</dt>
              <dd>{r.soil}</dd>
              <dt>Uvas</dt>
              <dd>{r.grapes.join(", ")}</dd>
            </dl>
            <small>{r.note}</small>
          </section>
        ))}
      </div>
    </article>
  );
}
