"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Grape, Library, MapPin, NotebookPen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { chapterParts, chapters, chaptersOfPart, type Chapter } from "@/content/chapters";
import { countryBySlug } from "@/content/countries";
import { glossaryBySlug } from "@/content/glossary";
import { grapeBySlug } from "@/content/grapes";
import { bookStore, useBook } from "@/lib/book-store";
import { Prose, anchorOf, useHydrated } from "./shared";
import { Link, navigate } from "./router";

export function LearnView({ partId }: { partId?: string }) {
  const { completed, quizScores } = useBook();
  const part = chapterParts.find((p) => p.id === partId) ?? chapterParts[0];
  const list = chaptersOfPart(part.id);
  const done = completed.filter((slug) => chapters.some((c) => c.slug === slug)).length;
  return (
    <section className="content-shell page-space chapter-library">
      <p className="eyebrow burgundy">APRENDER</p>
      <h1 className="page-title">
        Todos os <i>capítulos.</i>
      </h1>
      <p className="lead">
        Escolha uma parte, avance no seu ritmo e conclua cada leitura respondendo ao quiz. O progresso fica salvo neste aparelho.
      </p>
      <div className="library-progress">
        <div>
          <strong>{done}</strong>
          <span>de {chapters.length} concluídos</span>
        </div>
        <Progress value={(done / chapters.length) * 100} aria-label="Progresso no livro" />
      </div>
      <nav className="part-tabs" aria-label="Partes do livro">
        {chapterParts.map((p) => {
          const items = chaptersOfPart(p.id);
          const doneHere = items.filter((c) => completed.includes(c.slug)).length;
          return (
            <Link
              key={p.id}
              to={`/aprender/${p.id}`}
              className={part.id === p.id ? "active" : ""}
              aria-current={part.id === p.id ? "page" : undefined}
            >
              <span>
                {p.label}
                {doneHere > 0 && ` · ${doneHere}/${items.length}`}
              </span>
              {p.title}
            </Link>
          );
        })}
      </nav>
      <div className="chapter-list">
        <div className="chapter-list-title">
          <span>{part.label}</span>
          <h2>{part.title}</h2>
          <b>{list.length} capítulos</b>
        </div>
        {list.map((c) => {
          const isDone = completed.includes(c.slug);
          const quiz = quizScores[c.slug];
          return (
            <Link key={c.slug} to={`/capitulo/${c.slug}`}>
              <span className="chapter-number">{String(c.number).padStart(2, "0")}</span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.intro}</p>
                <small className="chapter-meta">
                  {c.readingTime} min de leitura{quiz ? ` · quiz ${quiz.score}/${quiz.total}` : ""}
                </small>
              </div>
              <span className={`chapter-status ${isDone ? "done" : ""}`} aria-label={isDone ? "Concluído" : "Não concluído"}>
                {isDone ? <Check aria-hidden /> : <ChevronRight aria-hidden />}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ChapterReader({ chapter }: { chapter: Chapter }) {
  const { completed, notes } = useBook();
  const hydrated = useHydrated();
  const isDone = completed.includes(chapter.slug);
  const index = chapters.findIndex((c) => c.slug === chapter.slug);
  const prev = chapters[index - 1];
  const next = chapters[index + 1];
  const headings = chapter.body.filter((p) => p.startsWith("## ")).map((p) => p.slice(3));
  const grape = chapter.related?.grape ? grapeBySlug(chapter.related.grape) : undefined;
  const country = chapter.related?.country ? countryBySlug(chapter.related.country) : undefined;
  const terms = (chapter.related?.glossary ?? []).map(glossaryBySlug).filter((t) => t !== undefined);

  return (
    <article className="chapter content-shell" key={chapter.slug}>
      <Link to={`/aprender/${chapter.part}`} className="back-link">
        <ArrowLeft aria-hidden /> {chapter.partLabel} · {chapter.partTitle}
      </Link>
      <header className="chapter-hero">
        <p className="eyebrow burgundy">
          CAPÍTULO {String(chapter.number).padStart(2, "0")} · {chapter.partTitle.toUpperCase()}
        </p>
        <span>
          LEITURA · {chapter.readingTime} MIN{isDone ? " · CONCLUÍDO" : ""}
        </span>
        <h1>{chapter.title}</h1>
        <p>{chapter.intro}</p>
      </header>
      <div className="reading-column">
        {headings.length >= 2 && (
          <nav className="learning-objectives" aria-label="Neste capítulo">
            <span>NESTE CAPÍTULO</span>
            <ul>
              {headings.map((h) => (
                <li key={h}>
                  <Check aria-hidden />
                  <a
                    href={`#${anchorOf(h)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(anchorOf(h))?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    {h}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <Prose paragraphs={chapter.body} />

        <aside>
          <span>EM POUCAS PALAVRAS</span>
          <b>{chapter.takeaway}</b>
          {chapter.tip && <p>{chapter.tip}</p>}
        </aside>

        <div className="mistake-box">
          <span>UM ERRO COMUM</span>
          <h3>Evite conclusões automáticas</h3>
          <p>{chapter.mistake}</p>
        </div>

        {(grape || country || terms.length > 0) && (
          <div className="related-links">
            <span>PARA IR ALÉM</span>
            <div>
              {grape && (
                <Link to={`/uvas/${grape.slug}`}>
                  <Grape aria-hidden /> Ficha da uva {grape.name}
                </Link>
              )}
              {country && (
                <Link to={`/regioes/${country.slug}`}>
                  <MapPin aria-hidden /> Regiões de {country.name}
                </Link>
              )}
              {terms.map((t) => (
                <Link key={t.slug} to={`/glossario/${t.slug}`}>
                  <Library aria-hidden /> {t.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        <PracticeBox key={`${chapter.slug}-${hydrated}`} chapter={chapter} note={notes[chapter.slug] ?? ""} />

        <ChapterQuiz chapter={chapter} key={`quiz-${chapter.slug}`} />

        <div className="chapter-summary">
          <span>LEVE COM VOCÊ</span>
          <h2>{chapter.takeaway}</h2>
          <p>
            Conhecimento de vinho não é uma coleção de certezas. É a capacidade de perceber, comparar e explicar o que muda de uma taça para outra.
          </p>
        </div>

        <nav className="chapter-pager" aria-label="Capítulos vizinhos">
          {prev ? (
            <Link to={`/capitulo/${prev.slug}`}>
              <ChevronLeft aria-hidden />
              <span>
                <small>Anterior</small>
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/capitulo/${next.slug}`} className="next">
              <span>
                <small>Próximo</small>
                {next.title}
              </span>
              <ChevronRight aria-hidden />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}

function PracticeBox({ chapter, note }: { chapter: Chapter; note: string }) {
  const [draft, setDraft] = useState(note);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const save = () => {
    const ok = bookStore.saveNote(chapter.slug, draft);
    setStatus(ok ? "saved" : "error");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  };
  return (
    <section className="practical" aria-labelledby={`pratica-${chapter.slug}`}>
      <p className="eyebrow">EXPERIÊNCIA PRÁTICA</p>
      <h3 id={`pratica-${chapter.slug}`}>Aprenda pela comparação</h3>
      <p>{chapter.practice}</p>
      <label className="practice-note">
        <span>
          <NotebookPen aria-hidden /> Minhas anotações
        </span>
        <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="O que você percebeu? Escreva com suas palavras." rows={4} />
      </label>
      <div className="practice-actions">
        <Button variant="secondary" onClick={save} disabled={draft === note}>
          {status === "saved" ? (
            <>
              <Check aria-hidden /> Anotação salva
            </>
          ) : (
            "Salvar anotação"
          )}
        </Button>
        <Link to="/praticar" className="practice-link">
          Registrar o vinho na ficha <ChevronRight aria-hidden />
        </Link>
      </div>
      <p role="status" className="sr-only">
        {status === "saved" ? "Anotação salva." : ""}
      </p>
      {status === "error" && <p className="form-error">Não conseguimos salvar sua anotação neste navegador. Tente novamente.</p>}
    </section>
  );
}

function ChapterQuiz({ chapter }: { chapter: Chapter }) {
  const { completed } = useBook();
  const isDone = completed.includes(chapter.slug);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const total = chapter.quiz.length;
  const answered = Object.keys(answers).length;
  const score = chapter.quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const finished = answered === total;

  const answer = (qIndex: number, oIndex: number) => {
    const nextAnswers = { ...answers, [qIndex]: oIndex };
    setAnswers(nextAnswers);
    if (Object.keys(nextAnswers).length === total) {
      const finalScore = chapter.quiz.reduce((acc, q, i) => acc + (nextAnswers[i] === q.correct ? 1 : 0), 0);
      bookStore.saveQuiz(chapter.slug, finalScore, total);
    }
  };

  const next = chapters[chapters.findIndex((c) => c.slug === chapter.slug) + 1];

  return (
    <>
      <section className="quiz chapter-quiz" aria-labelledby={`quiz-${chapter.slug}`}>
        <div className="quiz-heading">
          <div>
            <p className="eyebrow burgundy">QUIZ DO CAPÍTULO</p>
            <h3 id={`quiz-${chapter.slug}`}>Confira o que ficou.</h3>
          </div>
          <span aria-label={`${answered} de ${total} respondidas`}>
            {answered}/{total}
          </span>
        </div>
        {chapter.quiz.map((question, qIndex) => {
          const chosen = answers[qIndex];
          const revealed = chosen !== undefined;
          return (
            <fieldset className="quiz-question" key={question.question}>
              <legend>
                <span>{qIndex + 1}</span>
                {question.question}
              </legend>
              {question.options.map((option, oIndex) => {
                const isCorrect = oIndex === question.correct;
                const cls = chosen === oIndex ? (isCorrect ? "correct" : "wrong") : revealed && isCorrect ? "correct muted-answer" : "";
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={revealed}
                    className={cls}
                    onClick={() => answer(qIndex, oIndex)}
                    aria-pressed={chosen === oIndex}
                  >
                    <span aria-hidden>{String.fromCharCode(65 + oIndex)}</span>
                    {option}
                    {revealed && isCorrect && <Check aria-label="Resposta correta" />}
                  </button>
                );
              })}
              {revealed && (
                <p className="feedback" role="status">
                  <b>{chosen === question.correct ? "Resposta correta. " : "Ainda não. "}</b>
                  {question.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
        {finished && (
          <div className="quiz-result">
            <strong>
              {score}/{total}
            </strong>
            <div>
              <b>{score === total ? "Excelente percepção." : score >= total - 1 ? "Muito bem." : "Vale revisitar os pontos-chave."}</b>
              <span>As explicações ficam disponíveis para revisão.</span>
            </div>
            <button type="button" className="quiz-retry" onClick={() => setAnswers({})}>
              <RotateCcw aria-hidden /> Refazer
            </button>
          </div>
        )}
      </section>
      <div className="chapter-actions">
        <Button variant="outline" asChild>
          <Link to={`/aprender/${chapter.part}`}>Voltar ao índice</Link>
        </Button>
        <Button
          size="lg"
          disabled={!finished && !isDone}
          onClick={() => {
            bookStore.completeChapter(chapter.slug);
            navigate(next ? `/capitulo/${next.slug}` : "/jornada");
          }}
        >
          {!finished && !isDone
            ? "Responda ao quiz para concluir"
            : isDone
              ? next
                ? "Próximo capítulo"
                : "Ver minha jornada"
              : "Concluir e continuar"}
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </>
  );
}
