"use client";

/* eslint-disable @next/next/no-img-element */
import { BookOpen, ChevronRight, Compass, NotebookPen, Utensils, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { chapters } from "@/content/chapters";
import { grapes } from "@/content/grapes";
import { useBook } from "@/lib/book-store";
import { journeyPoints, levelFor, partProgress, tastedGrapes } from "@/lib/progress";
import { Link } from "./router";

export function HomeView() {
  const book = useBook();
  const { completed } = book;
  const done = completed.filter((slug) => chapters.some((c) => c.slug === slug)).length;
  const percent = Math.round((done / chapters.length) * 100);
  const next = chapters.find((c) => !completed.includes(c.slug)) ?? chapters[0];
  const level = levelFor(journeyPoints(book));
  const parts = partProgress(completed);
  const tasted = new Set(tastedGrapes(book.tastings).map((g) => g.slug));
  const untasted = grapes.find((g) => !tasted.has(g.slug)) ?? grapes[0];
  return (
    <>
      <section className="hero">
        <img src="/wine-hero.jpg" alt="" width={1600} height={1000} fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">UM LIVRO VIVO SOBRE VINHOS</p>
          <h1>
            Vinho sem
            <br />
            <i>mistério.</i>
          </h1>
          <p>Aprenda a escolher, degustar, entender e harmonizar vinhos em uma jornada prática e visual.</p>
          <div className="hero-actions">
            <Button size="lg" asChild>
              <Link to={`/capitulo/${next.slug}`}>
                {done ? "Continuar de onde parei" : "Começar a aprender"}
                <ChevronRight />
              </Link>
            </Button>
            <Link to="/praticar" className="text-button">
              <Wine aria-hidden /> Registrar uma taça
            </Link>
          </div>
        </div>
        <Link to={`/capitulo/${next.slug}`} className="hero-note">
          <span>{String(next.number).padStart(2, "0")}</span>
          <p>
            <b>{done ? "Seu próximo capítulo" : "Comece por aqui"}</b>
            {next.title}
          </p>
        </Link>
      </section>

      <section className="content-shell welcome-grid">
        <div>
          <p className="eyebrow burgundy">SUA JORNADA</p>
          <h2>
            Conhecimento que cresce
            <br />a cada taça.
          </h2>
          <p className="lead">
            {chapters.length} capítulos, {grapes.length} uvas e onze países, dos fundamentos ao nível avançado — sempre com linguagem clara e uma
            experiência prática para fazer com a sua taça.
          </p>
        </div>
        <Link to="/jornada" className="progress-card">
          <div className="progress-head">
            <div>
              <span>NÍVEL {level.current.id}</span>
              <strong>{level.current.name}</strong>
            </div>
            <b>{percent}%</b>
          </div>
          <Progress value={percent} aria-label="Capítulos concluídos" />
          <div className="progress-row">
            <span>
              Capítulos{" "}
              <b>
                {done} / {chapters.length}
              </b>
            </span>
            <span>
              Degustações <b>{book.tastings.length}</b>
            </span>
          </div>
          {level.next && (
            <small className="progress-hint">
              Faltam {level.missing} pontos para {level.next.name}
            </small>
          )}
        </Link>
      </section>

      <section className="content-shell cycle">
        <p className="eyebrow burgundy">O CICLO DO LIVRO</p>
        <h2>Ler, provar, registrar, comparar.</h2>
        <div className="path-grid">
          <Link to={`/capitulo/${next.slug}`} className="path-card">
            <span className="number">01 · LER</span>
            <BookOpen aria-hidden />
            <h3>{next.title}</h3>
            <p>{next.intro}</p>
            <span className="card-link">
              Abrir capítulo <ChevronRight aria-hidden />
            </span>
          </Link>
          <Link to={`/uvas/${untasted.slug}`} className="path-card">
            <span className="number">02 · EXPLORAR</span>
            <Compass aria-hidden />
            <h3>{untasted.name}</h3>
            <p>{untasted.summary}</p>
            <span className="card-link">
              Conhecer a uva <ChevronRight aria-hidden />
            </span>
          </Link>
          <Link to="/praticar" className="path-card">
            <span className="number">03 · PROVAR</span>
            <NotebookPen aria-hidden />
            <h3>Ficha de degustação</h3>
            <p>Registre o que percebeu. Com algumas taças, a Jornada mostra as tendências do seu gosto.</p>
            <span className="card-link">
              Registrar um vinho <ChevronRight aria-hidden />
            </span>
          </Link>
        </div>
        <Link to="/harmonizar" className="pairing-teaser">
          <Utensils aria-hidden />
          <span>
            <b>O que você vai comer hoje?</b> Do sururu ao chocolate: sugestões de vinho com explicação.
          </span>
          <ChevronRight aria-hidden />
        </Link>
      </section>

      <section className="content-shell">
        <p className="eyebrow burgundy">O LIVRO COMPLETO</p>
        <h2>Oito partes. Uma jornada.</h2>
        <div className="part-summary">
          {parts.map((part) => (
            <Link key={part.id} to={`/aprender/${part.id}`}>
              <span>{part.label}</span>
              <strong>{part.title}</strong>
              <small>{part.done ? `${part.done}/${part.total}` : `${part.total} capítulos`}</small>
              <ChevronRight aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
