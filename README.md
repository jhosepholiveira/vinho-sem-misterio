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
| Comando de construção | npm run build:hostinger |
| Diretório de saída | dist/standalone |
| Arquivo de entrada | dist/standalone/server.js |

O arquivo de entrada é relativo à raiz da aplicação e não inclui o comando `node`.
O build específico gera um pacote Node.js com servidor, arquivos públicos e
dependências de execução. O log deve confirmar `Generated standalone output in
dist/standalone/`. A pasta é gerada durante a compilação, não é uma pasta a
selecionar no repositório. Para iniciar o pacote na raiz do projeto, execute
`npm run start:hostinger`.

O servidor usa `PORT` fornecida pelo ambiente (padrão 3000) e `HOST` (padrão
0.0.0.0). O build padrão continua disponível para o ambiente Sites/Cloudflare.

## Estrutura

- `app/`: experiência e estilos.
- `content/`: uvas, glossário e harmonizações.
- `repositories/`: persistência das degustações.
- `docs/`: arquitetura, conteúdo, visual, imagens e roadmap.

## Conteúdo

Para adicionar uma uva, inclua um objeto tipado em `content/wine-data.ts`. Para um capítulo, mantenha conceito simples, aprofundamento, experiência prática, quiz explicado e conclusão. Quizzes devem sempre explicar a resposta.

O MVP inclui home, primeiro capítulo, catálogo e comparador de uvas, ficha de degustação persistente, harmonizador, quiz, glossário pesquisável e progresso básico.
