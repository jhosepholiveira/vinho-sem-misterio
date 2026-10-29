import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./chapters.css";
import "./editorial.css";
import "./book.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const title = "Vinho sem Mistério — Da primeira taça ao conhecimento";
const description = "Livro web interativo para aprender vinho: 88 capítulos, 15 uvas, 11 países, quizzes, harmonizador e diário de degustação.";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title,
  description,
  applicationName: "Vinho sem Mistério",
  keywords: ["vinho", "degustação", "uvas", "harmonização", "sommelier", "curso de vinho", "vinhos brasileiros"],
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/icon-192.png" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Vinho sem Mistério",
    title,
    description,
    ...(siteUrl ? { images: [{ url: "/wine-hero.jpg", width: 1600, height: 1000, alt: "Taça de vinho tinto ao lado de uma videira" }] } : {}),
  },
  twitter: { card: "summary_large_image", title, description },
  appleWebApp: { capable: true, title: "Vinho sem Mistério", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#541d2c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
