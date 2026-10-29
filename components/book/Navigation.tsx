"use client";

import { useEffect, useState } from "react";
import { BookOpen, Compass, Grape, House, Library, MapPin, NotebookPen, Search, Sparkles, Utensils, Wine } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { chapters } from "@/content/chapters";
import { countries } from "@/content/countries";
import { glossary } from "@/content/glossary";
import { grapes } from "@/content/grapes";
import { pairings } from "@/content/pairings";
import { Link, navigate, type Section } from "./router";

const NAV: { id: Section; label: string; to: string; icon: typeof House }[] = [
  { id: "inicio", label: "Início", to: "/", icon: House },
  { id: "aprender", label: "Aprender", to: "/aprender", icon: BookOpen },
  { id: "explorar", label: "Explorar", to: "/explorar", icon: Compass },
  { id: "praticar", label: "Praticar", to: "/praticar", icon: Wine },
  { id: "jornada", label: "Jornada", to: "/jornada", icon: Sparkles },
  { id: "biblioteca", label: "Biblioteca", to: "/biblioteca", icon: Library },
];

export function Header({ section, onSearch }: { section: Section; onSearch: () => void }) {
  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Vinho sem Mistério — início">
        <Wine aria-hidden />
        <span>
          VINHO <em>SEM MISTÉRIO</em>
        </span>
      </Link>
      <nav className="desktop-nav" aria-label="Navegação principal">
        {NAV.map((n) => (
          <Link key={n.id} to={n.to} className={section === n.id ? "active" : ""} aria-current={section === n.id ? "page" : undefined}>
            {n.label}
          </Link>
        ))}
      </nav>
      <button className="search-pill" onClick={onSearch} aria-label="Buscar no livro (Ctrl+K)">
        <Search aria-hidden />
        <span>Buscar</span>
        <kbd>Ctrl K</kbd>
      </button>
    </header>
  );
}

export function MobileNav({ section }: { section: Section }) {
  return (
    <nav className="mobile-nav" aria-label="Navegação móvel">
      {NAV.slice(0, 5).map(({ id, label, to, icon: Icon }) => (
        <Link key={id} to={to} className={section === id ? "active" : ""} aria-current={section === id ? "page" : undefined}>
          <Icon aria-hidden />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

const normalize = (v: string) => v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Filtro sem acentos: todas as palavras digitadas precisam aparecer. */
const filter = (value: string, search: string, keywords?: string[]) => {
  const haystack = normalize(`${value} ${(keywords ?? []).join(" ")}`);
  const words = normalize(search).split(/\s+/).filter(Boolean);
  if (!words.length) return 1;
  if (!words.every((w) => haystack.includes(w))) return 0;
  return haystack.startsWith(words[0]) ? 1 : 0.6;
};

export function useSearchShortcut(open: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
}

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const go = (to: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(to);
  };
  const regionItems = countries.flatMap((c) => c.regions.map((r) => ({ ...r, country: c })));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="search-dialog overflow-hidden p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">Buscar no livro</DialogTitle>
        <DialogDescription className="sr-only">Capítulos, uvas, países, regiões, glossário e harmonizações.</DialogDescription>
        <Command filter={filter} loop>
          <CommandInput value={query} onValueChange={setQuery} placeholder="Busque uma uva, região, termo ou capítulo…" />
          <CommandList>
            <CommandEmpty>Nada encontrado. Tente uma palavra mais curta.</CommandEmpty>
            {!query && (
              <CommandGroup heading="Atalhos">
                <CommandItem value="Registrar degustação" onSelect={() => go("/praticar")}>
                  <NotebookPen /> Registrar uma degustação
                </CommandItem>
                <CommandItem value="Harmonizador" onSelect={() => go("/harmonizar")}>
                  <Utensils /> O que você vai comer? Harmonizador
                </CommandItem>
                <CommandItem value="Comparar uvas" onSelect={() => go("/comparar")}>
                  <Grape /> Comparar uvas
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup heading="Uvas">
              {grapes.map((g) => (
                <CommandItem
                  key={g.slug}
                  value={`uva ${g.name}`}
                  keywords={[g.origin, ...g.aromas, ...g.regions]}
                  onSelect={() => go(`/uvas/${g.slug}`)}
                >
                  <Grape /> {g.name} <small>{g.color}</small>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Países e regiões">
              {countries.map((c) => (
                <CommandItem key={c.slug} value={`pais ${c.name}`} keywords={c.keyGrapes} onSelect={() => go(`/regioes/${c.slug}`)}>
                  <MapPin /> {c.name} <small>{c.world}</small>
                </CommandItem>
              ))}
              {regionItems.map((r) => (
                <CommandItem
                  key={`${r.country.slug}-${r.slug}`}
                  value={`regiao ${r.name} ${r.country.name}`}
                  keywords={r.grapes}
                  onSelect={() => go(`/regioes/${r.country.slug}?r=${r.slug}`)}
                >
                  <MapPin /> {r.name} <small>{r.country.name}</small>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Glossário">
              {glossary.map((t) => (
                <CommandItem key={t.slug} value={`termo ${t.term}`} keywords={[t.short]} onSelect={() => go(`/glossario/${t.slug}`)}>
                  <Library /> {t.term}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Harmonização">
              {pairings.map((p) => (
                <CommandItem
                  key={p.dish}
                  value={`prato ${p.dish}`}
                  keywords={p.wines}
                  onSelect={() => go(`/harmonizar?prato=${encodeURIComponent(p.dish)}`)}
                >
                  <Utensils /> {p.dish}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Capítulos">
              {chapters.map((c) => (
                <CommandItem
                  key={c.slug}
                  value={`capitulo ${c.title} ${c.partTitle}`}
                  keywords={[c.intro]}
                  onSelect={() => go(`/capitulo/${c.slug}`)}
                >
                  <BookOpen /> {c.title} <small>{c.partLabel}</small>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
