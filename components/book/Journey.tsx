"use client";

import { useRef, useState } from "react";
import { Award, BookOpen, Download, Globe2, Grape, Heart, Pencil, Sparkles, Trash2, Upload, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { bookStore, useBook } from "@/lib/book-store";
import { LEVELS, badges, journeyPoints, journeyStats, levelFor, partProgress, sensoryProfile, tastedGrapes } from "@/lib/progress";
import { wineRepository, type Tasting } from "@/repositories/wine-repository";
import { ScoreDots, formatDate } from "./shared";
import { Link, navigate } from "./router";

export function JourneyView() {
  const book = useBook();
  const stats = journeyStats(book);
  const points = journeyPoints(book);
  const level = levelFor(points);
  const profile = sensoryProfile(book.tastings);
  const earned = badges(book);
  const parts = partProgress(book.completed);
  const grapesTasted = tastedGrapes(book.tastings);
  const [filter, setFilter] = useState<"todas" | "favoritas">("todas");
  const list = book.tastings.filter((t) => filter === "todas" || t.favorite);

  return (
    <section className="content-shell page-space">
      <p className="eyebrow burgundy">MINHA JORNADA</p>
      <h1 className="page-title">
        Sua curiosidade em <i>movimento.</i>
      </h1>

      <div className="level-card">
        <div>
          <span>
            NÍVEL {level.current.id} DE {LEVELS.length}
          </span>
          <strong>{level.current.name}</strong>
          <p>{level.current.description}</p>
        </div>
        <div className="level-progress">
          <b>{points} pontos</b>
          <Progress value={level.progress} aria-label="Progresso até o próximo nível" />
          <small>{level.next ? `Faltam ${level.missing} pontos para ${level.next.name}.` : "Você chegou ao último nível. Continue provando!"}</small>
          <small className="muted">Capítulo concluído: 1 ponto · degustação: 2 · uva nova provada: 2 · quiz gabaritado: 1</small>
        </div>
      </div>

      <div className="stat-grid">
        <Stat icon={Wine} n={stats.tastings} l="Vinhos degustados" />
        <Stat icon={Grape} n={`${stats.grapes}/${stats.grapesTotal}`} l="Uvas do livro provadas" />
        <Stat icon={Globe2} n={stats.countries} l="Países" />
        <Stat icon={Sparkles} n={stats.average} l="Média das notas" />
      </div>

      <div className="journey-columns">
        <div className="journey-progress">
          <div>
            <h2>Progresso no livro</h2>
            <strong>{Math.round((stats.chapters / stats.chaptersTotal) * 100)}%</strong>
          </div>
          <Progress value={(stats.chapters / stats.chaptersTotal) * 100} aria-label="Capítulos concluídos" />
          <ul className="part-progress">
            {parts.map((p) => (
              <li key={p.id}>
                <Link to={`/aprender/${p.id}`}>
                  <span>
                    {p.label} · {p.title}
                  </span>
                  <b>
                    {p.done}/{p.total}
                  </b>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="profile-card">
          <span>PERFIL SENSORIAL</span>
          {profile ? (
            <>
              <h2>Você tende a preferir:</h2>
              <ul>
                {profile.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <div className="profile-bars">
                {profile.averages.map((a) => (
                  <div key={a.label}>
                    <span>{a.label}</span>
                    <div className="bar" role="img" aria-label={`${a.label}: média ${a.value.toFixed(1)} de 5`}>
                      <i style={{ width: `${a.value * 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {profile.topGrapes.length > 0 && <p>Uvas com melhores notas: {profile.topGrapes.join(", ")}.</p>}
              <small>
                Tendências observadas nas suas avaliações ({profile.sample} vinhos{profile.sample < book.tastings.length ? " com nota 7 ou mais" : ""}
                ). Não é uma verdade científica — é um retrato que muda com cada taça.
              </small>
            </>
          ) : (
            <>
              <h2>Seu retrato aparece aqui.</h2>
              <p>Registre pelo menos dois vinhos para ver as tendências do seu gosto: corpo, acidez, taninos e uvas preferidas.</p>
            </>
          )}
        </div>
      </div>

      {grapesTasted.length > 0 && (
        <div className="grapes-tasted">
          <span>UVAS DO LIVRO QUE VOCÊ JÁ PROVOU</span>
          <div>
            {grapesTasted.map((g) => (
              <Link key={g.slug} to={`/uvas/${g.slug}`} style={{ "--grape": g.accent } as React.CSSProperties}>
                <i aria-hidden /> {g.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="badges">
        <div className="section-head">
          <h2>Conquistas</h2>
          <span>
            {earned.filter((b) => b.earned).length} de {earned.length}
          </span>
        </div>
        <ul>
          {earned.map((b) => (
            <li key={b.id} className={b.earned ? "earned" : ""}>
              <Award aria-hidden />
              <div>
                <b>{b.name}</b>
                <small>{b.description}</small>
              </div>
              <span className="sr-only">{b.earned ? "Conquistada" : "Ainda não conquistada"}</span>
            </li>
          ))}
        </ul>
      </div>

      {book.tastings.length === 0 ? (
        <div className="empty-state">
          <Wine aria-hidden />
          <h2>Você ainda não registrou nenhuma degustação.</h2>
          <p>Registre um vinho e comece a construir sua memória sensorial.</p>
          <Button asChild>
            <Link to="/praticar">Registrar meu primeiro vinho</Link>
          </Button>
          <BackupTools compact />
        </div>
      ) : (
        <div className="tasting-list">
          <div className="section-head">
            <h2>Meu diário</h2>
            <div className="section-actions">
              <div className="filter-chips small" role="group" aria-label="Filtrar diário">
                <button
                  type="button"
                  className={filter === "todas" ? "active" : ""}
                  aria-pressed={filter === "todas"}
                  onClick={() => setFilter("todas")}
                >
                  Todas ({book.tastings.length})
                </button>
                <button
                  type="button"
                  className={filter === "favoritas" ? "active" : ""}
                  aria-pressed={filter === "favoritas"}
                  onClick={() => setFilter("favoritas")}
                >
                  Favoritas ({stats.favorites})
                </button>
              </div>
              <Button variant="outline" asChild>
                <Link to="/praticar">Nova degustação</Link>
              </Button>
            </div>
          </div>
          {list.length === 0 && <p className="muted">Nenhuma favorita ainda. Marque um vinho como favorito ao editar a degustação.</p>}
          {list.map((t) => (
            <TastingCard key={t.id} tasting={t} />
          ))}
          <BackupTools />
        </div>
      )}
    </section>
  );
}

function TastingCard({ tasting: t }: { tasting: Tasting }) {
  const [confirm, setConfirm] = useState(false);
  const toggleFavorite = () => {
    wineRepository.update(t.id, { favorite: !t.favorite });
    bookStore.refreshTastings();
  };
  const remove = () => {
    wineRepository.delete(t.id);
    bookStore.refreshTastings();
  };
  return (
    <article className="tasting-card">
      <div className="tasting-main">
        <span>{[t.country || "Origem não informada", t.region, t.vintage, formatDate(t.tastingDate)].filter(Boolean).join(" · ")}</span>
        <h3>{t.wineName}</h3>
        <p>{[t.producer, t.grape, t.price ? `R$ ${t.price}` : ""].filter(Boolean).join(" · ")}</p>
        {t.aromas && <p className="tasting-aromas">{t.aromas}</p>}
        <div className="tasting-scores">
          <span>
            Acidez <ScoreDots value={t.acidity} label="Acidez" />
          </span>
          <span>
            Tanino <ScoreDots value={t.tannin} label="Tanino" />
          </span>
          <span>
            Corpo <ScoreDots value={t.body} label="Corpo" />
          </span>
          <span>
            Persistência <ScoreDots value={t.persistence} label="Persistência" />
          </span>
        </div>
        {t.notes && <p className="tasting-notes">“{t.notes}”</p>}
        <div className="tasting-actions">
          <button type="button" onClick={toggleFavorite} aria-pressed={Boolean(t.favorite)} className={t.favorite ? "fav on" : "fav"}>
            <Heart aria-hidden /> {t.favorite ? "Favorito" : "Favoritar"}
          </button>
          <button type="button" onClick={() => navigate(`/praticar/editar/${t.id}`)}>
            <Pencil aria-hidden /> Editar
          </button>
          {confirm ? (
            <span className="confirm-delete">
              Excluir mesmo?
              <button type="button" className="danger" onClick={remove}>
                Sim, excluir
              </button>
              <button type="button" onClick={() => setConfirm(false)}>
                Cancelar
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirm(true)}>
              <Trash2 aria-hidden /> Excluir
            </button>
          )}
        </div>
      </div>
      <strong>
        {t.rating}
        <small>/10</small>
        {t.buyAgain && <em>compraria de novo</em>}
      </strong>
    </article>
  );
}

function BackupTools({ compact = false }: { compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const exportData = () => {
    const blob = new Blob([wineRepository.exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vinho-sem-misterio-diario-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Cópia de segurança gerada.");
  };
  const importData = async (file?: File) => {
    if (!file) return;
    try {
      const added = wineRepository.importJson(await file.text());
      bookStore.refreshTastings();
      setMessage(
        added ? `${added} ${added === 1 ? "degustação importada" : "degustações importadas"}.` : "Nenhuma degustação nova encontrada no arquivo.",
      );
    } catch {
      setMessage("Não conseguimos ler esse arquivo. Use uma cópia gerada por este livro.");
    }
    if (input.current) input.current.value = "";
  };
  return (
    <div className={`backup-tools ${compact ? "compact" : ""}`}>
      {!compact && (
        <p>
          <BookOpen aria-hidden /> Seu diário fica salvo apenas neste navegador. Faça uma cópia de segurança para não perder seus registros ou para
          levá-los a outro aparelho.
        </p>
      )}
      <div>
        {!compact && (
          <Button variant="outline" onClick={exportData}>
            <Download aria-hidden /> Exportar diário
          </Button>
        )}
        <Button variant={compact ? "ghost" : "outline"} onClick={() => input.current?.click()}>
          <Upload aria-hidden /> {compact ? "Importar um diário salvo" : "Importar"}
        </Button>
        <input ref={input} type="file" accept="application/json,.json" hidden onChange={(e) => importData(e.target.files?.[0])} />
      </div>
      <p role="status" className="backup-message">
        {message}
      </p>
    </div>
  );
}

function Stat({ icon: Icon, n, l }: { icon: typeof Wine; n: string | number; l: string }) {
  return (
    <div>
      <Icon aria-hidden />
      <b>{n}</b>
      <span>{l}</span>
    </div>
  );
}
