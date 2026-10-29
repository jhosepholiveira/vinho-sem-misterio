"use client";

import { useCallback, useState } from "react";
import { Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChapterReader, LearnView } from "@/components/book/Learn";
import { Comparator, CountryDetail, GrapeCatalog, GrapeDetail, RegionsView } from "@/components/book/Explore";
import { GlossaryView } from "@/components/book/Glossary";
import { HomeView } from "@/components/book/Home";
import { JourneyView } from "@/components/book/Journey";
import { Header, MobileNav, SearchDialog, useSearchShortcut } from "@/components/book/Navigation";
import { PairingView, PracticeView } from "@/components/book/Practice";
import { Link, sectionOf, useRoute, type Route } from "@/components/book/router";
import { chapterBySlug } from "@/content/chapters";
import { countryBySlug } from "@/content/countries";
import { grapeBySlug } from "@/content/grapes";

export default function Page() {
  const route = useRoute();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  useSearchShortcut(openSearch);
  const section = sectionOf(route);
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header section={section} onSearch={openSearch} />
      <main id="conteudo" tabIndex={-1}>
        <Screen route={route} />
      </main>
      <footer className="site-footer">
        <p>
          <Wine aria-hidden /> <b>Vinho sem Mistério</b> — da primeira taça ao conhecimento.
        </p>
        <p>
          <Link to="/biblioteca">Glossário</Link> · <Link to="/regioes">Regiões</Link> · <Link to="/harmonizar">Harmonizador</Link> ·{" "}
          <Link to="/jornada">Minha jornada</Link>
        </p>
        <small>Beba com moderação. Seu progresso e seu diário ficam salvos apenas neste navegador.</small>
      </footer>
      <MobileNav section={section} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function Screen({ route }: { route: Route }) {
  const [first, second, third] = route.path;
  switch (first) {
    case undefined:
      return <HomeView />;
    case "aprender":
      return <LearnView partId={second} />;
    case "capitulo": {
      const chapter = second ? chapterBySlug(second) : undefined;
      return chapter ? <ChapterReader chapter={chapter} /> : <NotFound />;
    }
    case "explorar":
      return <GrapeCatalog />;
    case "uvas": {
      if (!second) return <GrapeCatalog />;
      const grape = grapeBySlug(second);
      return grape ? <GrapeDetail grape={grape} /> : <NotFound />;
    }
    case "comparar":
      return <Comparator slugs={(second ?? "").split(",").filter(Boolean)} />;
    case "regioes": {
      if (!second) return <RegionsView />;
      const country = countryBySlug(second);
      return country ? <CountryDetail country={country} highlight={route.query.get("r") ?? undefined} /> : <NotFound />;
    }
    case "praticar":
      return (
        <PracticeView
          editId={second === "editar" ? third : undefined}
          prefill={{ grape: route.query.get("uva") ?? undefined, country: route.query.get("pais") ?? undefined }}
        />
      );
    case "harmonizar": {
      const dish = route.query.get("prato") ?? undefined;
      return <PairingView key={dish} dish={dish} />;
    }
    case "jornada":
      return <JourneyView />;
    case "biblioteca":
      return <GlossaryView />;
    case "glossario":
      return <GlossaryView focus={second} />;
    default:
      return <NotFound />;
  }
}

function NotFound() {
  return (
    <section className="content-shell page-space">
      <div className="empty-state">
        <Wine aria-hidden />
        <h2>Esta página não existe — ou mudou de lugar.</h2>
        <p>Use a busca ou volte ao início para continuar a leitura.</p>
        <Button asChild>
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    </section>
  );
}
