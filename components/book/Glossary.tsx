"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { glossary, glossaryByTerm } from "@/content/glossary";
import { Link } from "./router";

const normalize = (v: string) => v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function GlossaryView({ focus }: { focus?: string }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = normalize(q.trim());
    const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
    if (!term) return sorted;
    return sorted
      .filter((g) => normalize(`${g.term} ${g.short} ${g.example ?? ""}`).includes(term))
      .sort((a, b) => Number(!normalize(a.term).startsWith(term)) - Number(!normalize(b.term).startsWith(term)));
  }, [q]);

  useEffect(() => {
    if (!focus) return;
    const el = document.getElementById(`termo-${focus}`);
    const timer = setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
    return () => clearTimeout(timer);
  }, [focus]);

  return (
    <section className="content-shell page-space">
      <p className="eyebrow burgundy">BIBLIOTECA · GLOSSÁRIO</p>
      <h1 className="page-title">
        Palavras sem <i>complicação.</i>
      </h1>
      <p className="lead">{glossary.length} termos explicados em linguagem simples, com exemplos e conexões.</p>
      <div className="glossary-search">
        <Search aria-hidden />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busque acidez, tanino, terroir…" aria-label="Buscar no glossário" />
      </div>
      <p className="sr-only" role="status">
        {results.length} termos encontrados
      </p>
      <div className="glossary-list">
        {results.map((g) => (
          <article key={g.slug} id={`termo-${g.slug}`} className={focus === g.slug ? "highlight" : ""}>
            <span aria-hidden>{g.term[0]}</span>
            <div>
              <h2>{g.term}</h2>
              <p>{g.short}</p>
              {g.example && <p className="glossary-example">Exemplo: {g.example}</p>}
              {g.related && g.related.length > 0 && (
                <p className="glossary-related">
                  Veja também:{" "}
                  {g.related.map((r, i) => {
                    const target = glossaryByTerm(r);
                    return (
                      <span key={r}>
                        {i > 0 && ", "}
                        {target ? <Link to={`/glossario/${target.slug}`}>{r}</Link> : r}
                      </span>
                    );
                  })}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
      {!results.length && (
        <div className="empty-state">
          <Search aria-hidden />
          <h2>Nenhum termo encontrado.</h2>
          <p>Tente uma palavra mais curta ou sem acentos.</p>
        </div>
      )}
    </section>
  );
}
