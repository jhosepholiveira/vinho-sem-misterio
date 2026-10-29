"use client";

import { useEffect, useMemo, useSyncExternalStore, type AnchorHTMLAttributes, type ReactNode } from "react";

/**
 * Roteador por hash (#/caminho). Mantém a aplicação como uma única página —
 * compatível com a hospedagem atual — e dá endereços, botão voltar e links compartilháveis.
 */
export type Route = { path: string[]; query: URLSearchParams; raw: string };

export const parseRoute = (hash: string): Route => {
  const raw = hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart = ""] = raw.split("?");
  const path = pathPart
    .split("/")
    .filter(Boolean)
    .map((p) => {
      try {
        return decodeURIComponent(p);
      } catch {
        return p;
      }
    });
  return { path, query: new URLSearchParams(queryPart), raw };
};

export const href = (path: string) => `#${path.startsWith("/") ? path : `/${path}`}`;

export const navigate = (path: string) => {
  const target = href(path);
  if (window.location.hash === target) {
    window.scrollTo({ top: 0 });
    return;
  }
  window.location.hash = target;
};

const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};

export function useRoute(): Route {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const route = useMemo(() => parseRoute(hash), [hash]);
  const pathKey = route.path.join("/");
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathKey]);
  return route;
}

export function Link({ to, children, ...props }: { to: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href(to)} {...props}>
      {children}
    </a>
  );
}

export type Section = "inicio" | "aprender" | "explorar" | "praticar" | "jornada" | "biblioteca";

/** Seção principal da navegação correspondente a uma rota. */
export const sectionOf = (route: Route): Section => {
  const first = route.path[0] ?? "";
  if (["aprender", "capitulo"].includes(first)) return "aprender";
  if (["explorar", "uvas", "comparar", "regioes"].includes(first)) return "explorar";
  if (["praticar", "harmonizar"].includes(first)) return "praticar";
  if (first === "jornada") return "jornada";
  if (["biblioteca", "glossario"].includes(first)) return "biblioteca";
  return "inicio";
};
