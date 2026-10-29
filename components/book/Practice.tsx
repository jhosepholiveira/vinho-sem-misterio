"use client";

import { useState } from "react";
import { Check, ChevronRight, Heart, NotebookPen, TriangleAlert, Utensils, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { countries } from "@/content/countries";
import { grapes, matchGrape } from "@/content/grapes";
import { pairingCategories, pairings } from "@/content/pairings";
import { bookStore } from "@/lib/book-store";
import { wineRepository, type Tasting, type TastingInput } from "@/repositories/wine-repository";
import { ScalePicker } from "./shared";
import { Link, navigate } from "./router";

export function PracticeTabs({ active }: { active: "degustacao" | "harmonizar" }) {
  return (
    <nav className="explore-tabs" aria-label="Praticar">
      <Link to="/praticar" className={active === "degustacao" ? "active" : ""} aria-current={active === "degustacao" ? "page" : undefined}>
        <NotebookPen aria-hidden /> Ficha de degustação
      </Link>
      <Link to="/harmonizar" className={active === "harmonizar" ? "active" : ""} aria-current={active === "harmonizar" ? "page" : undefined}>
        <Utensils aria-hidden /> Harmonizador
      </Link>
    </nav>
  );
}

const QUICK_AROMAS = [
  "Frutas vermelhas",
  "Frutas escuras",
  "Cítricos",
  "Frutas tropicais",
  "Flores",
  "Ervas",
  "Especiarias",
  "Baunilha",
  "Tostado",
  "Terroso",
  "Mel",
  "Pão",
];
const APPEARANCES = ["Amarelo-esverdeado", "Palha", "Dourado", "Rosado", "Rubi", "Violáceo", "Granada", "Atijolado"];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const emptyForm = (prefill?: { grape?: string; country?: string }): TastingInput => ({
  wineName: "",
  producer: "",
  country: prefill?.country ?? "",
  region: "",
  grape: prefill?.grape ?? "",
  vintage: "",
  price: "",
  tastingDate: today(),
  appearance: "",
  aromas: "",
  acidity: 3,
  tannin: 3,
  body: 3,
  alcohol: 3,
  persistence: 3,
  rating: 7,
  buyAgain: true,
  favorite: false,
  notes: "",
});

const fromTasting = ({ id: _id, createdAt: _c, updatedAt: _u, ...rest }: Tasting): TastingInput => rest; // eslint-disable-line @typescript-eslint/no-unused-vars

export function TastingForm({ editing, prefill }: { editing?: Tasting; prefill?: { grape?: string; country?: string } }) {
  const [form, setForm] = useState<TastingInput>(() => (editing ? fromTasting(editing) : emptyForm(prefill)));
  const [status, setStatus] = useState<{ kind: "idle" } | { kind: "saved"; name: string } | { kind: "error"; message: string }>({ kind: "idle" });
  const set = <K extends keyof TastingInput>(key: K, value: TastingInput[K]) => setForm((p) => ({ ...p, [key]: value }));
  const grape = matchGrape(form.grape);
  const isWhite = grape?.color === "Branca";

  const toggleAroma = (aroma: string) => {
    const list = form.aromas
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    const has = list.some((a) => a.toLowerCase() === aroma.toLowerCase());
    set("aromas", (has ? list.filter((a) => a.toLowerCase() !== aroma.toLowerCase()) : [...list, aroma]).join(", "));
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.wineName.trim()) {
      setStatus({ kind: "error", message: "Dê um nome ao vinho para salvar a degustação." });
      return;
    }
    try {
      if (editing) {
        wineRepository.update(editing.id, form);
        bookStore.refreshTastings();
        navigate("/jornada");
        return;
      }
      wineRepository.create(form);
      bookStore.refreshTastings();
      setStatus({ kind: "saved", name: form.wineName.trim() });
      setForm((p) => ({ ...emptyForm(), country: p.country }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus({
        kind: "error",
        message: "Não conseguimos salvar sua degustação. Verifique se o navegador permite salvar dados e tente novamente.",
      });
    }
  };

  return (
    <form className="tasting-sheet" onSubmit={save} noValidate>
      <div className="form-intro">
        <span>{editing ? "EDITAR DEGUSTAÇÃO" : "FICHA DE DEGUSTAÇÃO"}</span>
        <h2>{editing ? "Ajuste o que percebeu." : "Registre o que você percebeu."}</h2>
        <p>Não há resposta errada. Memória sensorial se constrói voltando às próprias impressões — use palavras simples.</p>
      </div>

      {status.kind === "saved" && (
        <div className="form-success" role="status">
          <Check aria-hidden />
          <div>
            <b>{status.name} foi salvo no seu diário.</b>
            <span>
              <Link to="/jornada">Ver minha jornada</Link> ou registre o próximo vinho abaixo.
            </span>
          </div>
        </div>
      )}

      <fieldset className="form-block">
        <legend>O vinho</legend>
        <div className="fields">
          <Field label="Vinho *" id="wineName">
            <Input
              id="wineName"
              value={form.wineName}
              onChange={(e) => set("wineName", e.target.value)}
              placeholder="Nome do rótulo"
              autoComplete="off"
              aria-required
            />
          </Field>
          <Field label="Produtor" id="producer">
            <Input id="producer" value={form.producer} onChange={(e) => set("producer", e.target.value)} placeholder="Quem produziu" />
          </Field>
          <Field label="Uva" id="grape" hint={grape ? `Reconhecida: ${grape.name}` : undefined}>
            <Input id="grape" list="grape-options" value={form.grape} onChange={(e) => set("grape", e.target.value)} placeholder="Ex.: Merlot" />
          </Field>
          <Field label="País" id="country">
            <Input
              id="country"
              list="country-options"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              placeholder="Ex.: Brasil"
            />
          </Field>
          <Field label="Região" id="region">
            <Input
              id="region"
              list="region-options"
              value={form.region}
              onChange={(e) => set("region", e.target.value)}
              placeholder="Ex.: Vale dos Vinhedos"
            />
          </Field>
          <Field label="Safra" id="vintage">
            <Input
              id="vintage"
              inputMode="numeric"
              value={form.vintage}
              onChange={(e) => set("vintage", e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
              placeholder="2022"
            />
          </Field>
          <Field label="Preço (R$)" id="price">
            <Input id="price" inputMode="decimal" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="89,90" />
          </Field>
          <Field label="Data" id="tastingDate">
            <Input id="tastingDate" type="date" value={form.tastingDate} onChange={(e) => set("tastingDate", e.target.value)} />
          </Field>
        </div>
        <datalist id="grape-options">
          {grapes.map((g) => (
            <option key={g.slug} value={g.name.split(" / ")[0]} />
          ))}
        </datalist>
        <datalist id="country-options">
          {countries.map((c) => (
            <option key={c.slug} value={c.name} />
          ))}
        </datalist>
        <datalist id="region-options">
          {countries.flatMap((c) => c.regions.map((r) => <option key={`${c.slug}-${r.slug}`} value={r.name} />))}
        </datalist>
      </fieldset>

      <fieldset className="form-block">
        <legend>Olhar e nariz</legend>
        <p className="form-label">Aparência</p>
        <div className="chip-row" role="group" aria-label="Aparência">
          {APPEARANCES.map((a) => (
            <button
              key={a}
              type="button"
              className={form.appearance === a ? "active" : ""}
              aria-pressed={form.appearance === a}
              onClick={() => set("appearance", form.appearance === a ? "" : a)}
            >
              {a}
            </button>
          ))}
        </div>
        <Field label="Aromas percebidos" id="aromas">
          <Input id="aromas" value={form.aromas} onChange={(e) => set("aromas", e.target.value)} placeholder="Frutas, flores, especiarias…" />
        </Field>
        <div className="chip-row" role="group" aria-label="Sugestões de aromas">
          {QUICK_AROMAS.map((a) => {
            const on = form.aromas
              .toLowerCase()
              .split(",")
              .map((x) => x.trim())
              .includes(a.toLowerCase());
            return (
              <button key={a} type="button" className={on ? "active" : ""} aria-pressed={on} onClick={() => toggleAroma(a)}>
                {a}
              </button>
            );
          })}
        </div>
        {grape && (
          <p className="form-hint">
            Aromas comuns em {grape.name}: {grape.aromas.join(", ").toLowerCase()}.
          </p>
        )}
      </fieldset>

      <fieldset className="form-block">
        <legend>Boca</legend>
        <div className="scales">
          <ScalePicker name="acidity" label="Acidez" value={form.acidity} onChange={(v) => set("acidity", v)} />
          <ScalePicker
            name="tannin"
            label={isWhite ? "Tanino (pouco comum em brancos)" : "Tanino"}
            value={form.tannin}
            onChange={(v) => set("tannin", v)}
          />
          <ScalePicker name="body" label="Corpo" value={form.body} onChange={(v) => set("body", v)} />
          <ScalePicker name="alcohol" label="Álcool" value={form.alcohol ?? 3} onChange={(v) => set("alcohol", v)} />
          <ScalePicker name="persistence" label="Persistência" value={form.persistence} onChange={(v) => set("persistence", v)} />
        </div>
      </fieldset>

      <fieldset className="form-block">
        <legend>Conclusão</legend>
        <div className="rating-row">
          <Label htmlFor="rating-slider">
            Minha nota <b>{form.rating}/10</b>
          </Label>
          <Slider
            id="rating-slider"
            aria-label="Minha nota"
            min={0}
            max={10}
            step={1}
            value={[form.rating]}
            onValueChange={(v) => set("rating", v[0])}
          />
        </div>
        <Field label="Comentários" id="notes">
          <Textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Com o que comeu, com quem estava, o que mais chamou atenção…"
          />
        </Field>
        <div className="save-row">
          <div className="toggles">
            <label>
              <Switch checked={form.buyAgain} onCheckedChange={(v) => set("buyAgain", v)} /> Compraria novamente
            </label>
            <label>
              <Switch checked={Boolean(form.favorite)} onCheckedChange={(v) => set("favorite", v)} /> <Heart aria-hidden className="heart" /> Favorito
            </label>
          </div>
          <div className="save-actions">
            {editing && (
              <Button type="button" variant="outline" onClick={() => navigate("/jornada")}>
                Cancelar
              </Button>
            )}
            <Button size="lg" type="submit">
              {editing ? "Salvar alterações" : "Salvar degustação"}
            </Button>
          </div>
        </div>
        {status.kind === "error" && (
          <p className="form-error" role="alert">
            <TriangleAlert aria-hidden /> {status.message}
          </p>
        )}
      </fieldset>
    </form>
  );
}

function Field({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <small className="field-hint">{hint}</small>}
    </div>
  );
}

export function PracticeView({ editId, prefill }: { editId?: string; prefill?: { grape?: string; country?: string } }) {
  const editing = editId ? wineRepository.findById(editId) : undefined;
  return (
    <section className="content-shell page-space">
      <p className="eyebrow burgundy">APRENDA FAZENDO</p>
      <h1 className="page-title">
        Pratique com a <i>sua taça.</i>
      </h1>
      <PracticeTabs active="degustacao" />
      {editId && !editing ? (
        <div className="empty-state">
          <Wine aria-hidden />
          <h2>Não encontramos essa degustação.</h2>
          <p>Ela pode ter sido excluída ou registrada em outro aparelho.</p>
          <Button asChild>
            <Link to="/praticar">Registrar uma degustação</Link>
          </Button>
        </div>
      ) : (
        <TastingForm key={editId ?? `${prefill?.grape ?? ""}|${prefill?.country ?? ""}`} editing={editing} prefill={prefill} />
      )}
    </section>
  );
}

export function PairingView({ dish }: { dish?: string }) {
  const current = pairings.find((p) => p.dish === dish) ?? pairings[0];
  const [category, setCategory] = useState<string>(current.category);
  const list = pairings.filter((p) => p.category === category);
  return (
    <section className="content-shell page-space">
      <p className="eyebrow burgundy">APRENDA FAZENDO</p>
      <h1 className="page-title">
        O que você vai <i>comer?</i>
      </h1>
      <PracticeTabs active="harmonizar" />
      <div className="pairing-tool">
        <div>
          <p className="eyebrow">ESCOLHA O PRATO</p>
          <h2>Harmonizar é criar equilíbrio.</h2>
          <div className="category-row" role="group" aria-label="Categorias de pratos">
            {pairingCategories.map((c) => (
              <button key={c} type="button" className={category === c ? "active" : ""} aria-pressed={category === c} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="dish-list" role="group" aria-label="Pratos">
            {list.map((p) => (
              <button
                key={p.dish}
                type="button"
                className={current.dish === p.dish ? "active" : ""}
                aria-pressed={current.dish === p.dish}
                onClick={() => navigate(`/harmonizar?prato=${encodeURIComponent(p.dish)}`)}
              >
                {p.dish}
              </button>
            ))}
          </div>
        </div>
        <div className="pairing-result" aria-live="polite">
          <span>BOAS COMPANHIAS PARA</span>
          <h3>{current.dish}</h3>
          {current.wines.map((w) => {
            const g = matchGrape(w);
            return (
              <div key={w}>
                <Wine aria-hidden />
                {g ? (
                  <Link to={`/uvas/${g.slug}`}>
                    {w} <ChevronRight aria-hidden />
                  </Link>
                ) : (
                  w
                )}
              </div>
            );
          })}
          <p>{current.why}</p>
          {current.avoid && (
            <p className="pairing-avoid">
              <b>Vale evitar:</b> {current.avoid}
            </p>
          )}
          <small>Harmonização não é regra absoluta. Use como ponto de partida — vale experimentar e registrar o que funcionou para você.</small>
        </div>
      </div>
      <p className="compare-tip">
        Quer entender os princípios? Leia a <Link to="/aprender/parte-5">Parte V — Harmonização</Link>.
      </p>
    </section>
  );
}
