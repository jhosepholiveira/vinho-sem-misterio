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

## Estrutura

- `app/`: experiência e estilos.
- `content/`: uvas, glossário e harmonizações.
- `repositories/`: persistência das degustações.
- `docs/`: arquitetura, conteúdo, visual, imagens e roadmap.

## Conteúdo

Para adicionar uma uva, inclua um objeto tipado em `content/wine-data.ts`. Para um capítulo, mantenha conceito simples, aprofundamento, experiência prática, quiz explicado e conclusão. Quizzes devem sempre explicar a resposta.

O MVP inclui home, primeiro capítulo, catálogo e comparador de uvas, ficha de degustação persistente, harmonizador, quiz, glossário pesquisável e progresso básico.
