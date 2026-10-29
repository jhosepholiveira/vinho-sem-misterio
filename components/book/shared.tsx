"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
/** true apenas no navegador, depois da hidratação. */
export const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

export function ScoreDots({ value, max = 5, label }: { value: number; max?: number; label?: string }) {
  return (
    <span className="score" role="img" aria-label={`${label ? `${label}: ` : ""}${value} de ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <i key={i} className={i < value ? "on" : ""} />
      ))}
    </span>
  );
}

/** Renderiza parágrafos editoriais. Strings iniciadas por "## " viram subtítulos. */
export function Prose({ paragraphs, dropcap = true }: { paragraphs: string[]; dropcap?: boolean }) {
  const firstParagraph = dropcap ? paragraphs.findIndex((t) => !t.startsWith("## ")) : -1;
  return (
    <>
      {paragraphs.map((text, i) => {
        if (text.startsWith("## ")) {
          const title = text.slice(3);
          return (
            <h2 key={i} id={anchorOf(title)}>
              {title}
            </h2>
          );
        }
        return (
          <p key={i} className={i === firstParagraph ? "dropcap" : undefined}>
            {text}
          </p>
        );
      })}
    </>
  );
}

export const anchorOf = (title: string) =>
  title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const scaleLabels: Record<string, [string, string]> = {
  acidity: ["Suave", "Vibrante"],
  tannin: ["Macio", "Firme"],
  body: ["Leve", "Encorpado"],
  alcohol: ["Discreto", "Quente"],
  persistence: ["Curta", "Longa"],
};

export function ScalePicker({ name, label, value, onChange }: { name: string; label: string; value: number; onChange: (v: number) => void }) {
  const [low, high] = scaleLabels[name] ?? ["Baixo", "Alto"];
  return (
    <fieldset className="scale-picker">
      <legend>
        {label} <b>{value}/5</b>
      </legend>
      <div role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${label} ${n} de 5`}
            className={n <= value ? "on" : ""}
            onClick={() => onChange(n)}
          >
            <span />
          </button>
        ))}
      </div>
      <small>
        <span>{low}</span>
        <span>{high}</span>
      </small>
    </fieldset>
  );
}

export const formatDate = (iso?: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
};
