import type { Metadata } from "next";
import "./globals.css";
import "./chapters.css";
import "./editorial.css";
export const metadata:Metadata={title:"Vinho sem Mistério — Da primeira taça ao conhecimento",description:"Aprenda a escolher, degustar, entender e harmonizar vinhos em uma jornada prática e visual.",applicationName:"Vinho sem Mistério",keywords:["vinho","degustação","uvas","harmonização"],other:{"codex-preview":"development","theme-color":"#541d2c"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="pt-BR"><body>{children}</body></html>}
