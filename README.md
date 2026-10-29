# Vinho sem Mistério

Livro web interativo para aprender vinho lendo, explorando, provando, registrando e comparando.

## Stack

Next.js/Vinext, React, TypeScript, Tailwind CSS, componentes Shadcn e LocalStorage.

## Desenvolvimento

```bash
npm run dev
npm run lint
npm test
npm run build
```

## Hospedagem na Hostinger

Configure a aplicação Node.js no hPanel com:

| Campo | Valor |
| --- | --- |
| Configuração predefinida | Other |
| Branch | main |
| Node.js | 22.x (22.13.0 ou superior) |
| Diretório raiz | ./ |
| Gerenciador de pacotes | npm |
| Comando de construção | npm run build |
| Diretório de saída | dist/standalone |
| Arquivo de entrada | dist/standalone/server.js |

O arquivo de entrada é relativo à raiz da aplicação e não inclui o comando `node`.
O comando padrão `npm run build` chama `build:hostinger` e gera um pacote Node.js
com servidor, arquivos públicos e
dependências de execução. O log deve confirmar `Generated standalone output in
dist/standalone/`. A pasta é gerada durante a compilação, não é uma pasta a
selecionar no repositório. Para iniciar o pacote na raiz do projeto, execute
`npm start`. Os comandos `npm run build:hostinger` e `npm run start:hostinger`
também continuam disponíveis.

O servidor usa `PORT` fornecida pelo ambiente (padrão 3000) e `HOST` (padrão
0.0.0.0). Para o ambiente Sites/Cloudflare, use `npm run build:sites`.
O comando `npm test` continua usando esse build para os testes do Worker.

## O que há no livro

- **88 capítulos** em oito partes (fundamentos, degustação, 15 uvas, 11 países, harmonização, compra, adega e nível avançado), cada um com texto, “em poucas palavras”, erro comum, experiência prática com anotações salvas e quiz explicado.
- **Explorar**: fichas de 15 uvas, comparador visual de 2 a 3 uvas e 11 países com mais de 30 regiões.
- **Praticar**: ficha de degustação (criar, editar, favoritar, excluir) e harmonizador com 20 pratos, incluindo cozinha nordestina.
- **Jornada**: 5 níveis (Curioso → Connoisseur), pontos, conquistas, perfil sensorial e cópia de segurança do diário (exportar/importar JSON).
- **Biblioteca**: glossário com mais de 40 termos e busca global (Ctrl+K / ⌘K) sem distinção de acentos.

As telas usam endereços com hash (`#/capitulo/acidez`, `#/uvas/merlot`, `#/regioes/brasil`), então o botão voltar, o recarregar e o compartilhamento de links funcionam sem mudar a hospedagem.

## Estrutura

- `app/`: casca da aplicação (`page.tsx` faz o roteamento) e estilos (`book.css` concentra os módulos novos).
- `components/book/`: telas — `Home`, `Learn` (índice, leitor e quiz), `Explore` (uvas, comparador, regiões), `Practice` (ficha e harmonizador), `Journey`, `Glossary`, `Navigation` (menu e busca) e `router`.
- `content/`: conteúdo editorial tipado — `chapters/` (um arquivo por parte), `grapes.ts`, `countries.ts`, `glossary.ts`, `pairings.ts`.
- `lib/`: `progress.ts` (níveis, pontos, conquistas, perfil sensorial — funções puras e testadas) e `book-store.ts` (progresso, quizzes e anotações no LocalStorage).
- `repositories/`: `WineRepository`, a única peça que conhece o armazenamento das degustações.
- `tests/`: integridade do conteúdo, progresso, repository e HTML renderizado.
- `docs/`: arquitetura, conteúdo, visual, imagens e roadmap.

## Como adicionar conteúdo

- **Uva**: inclua um objeto em `content/grapes.ts` (escalas de 1 a 5, história, aromas e 3 perguntas). A ficha, o comparador, a busca e o capítulo da Parte III são gerados automaticamente.
- **País ou região**: edite `content/countries.ts`; o capítulo da Parte IV e a página do país vêm daí.
- **Capítulo**: adicione um objeto no arquivo da parte em `content/chapters/`. Parágrafos iniciados por `## ` viram subtítulos. Todo quiz precisa de explicação; a ordem das alternativas é embaralhada automaticamente.
- **Termo do glossário**: `content/glossary.ts`. **Prato**: `content/pairings.ts`.
- Rode `npm test`: os testes acusam slugs repetidos, respostas inválidas e links relacionados quebrados.

Para Open Graph com imagem, defina `NEXT_PUBLIC_SITE_URL` (ex.: `https://seu-dominio.com.br`) nas variáveis de ambiente da hospedagem.
