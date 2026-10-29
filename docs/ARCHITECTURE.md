# Arquitetura

Aplicação Next.js/Vinext de rota única. A navegação interna usa hash (`#/caminho`), tratado por `components/book/router.tsx` com `useSyncExternalStore`: dá endereços, histórico e links compartilháveis sem exigir rotas no servidor da Hostinger.

## Camadas

1. **Conteúdo** (`content/`): dados tipados (`content/types.ts`). Capítulos das Partes III e IV são derivados das fichas de uvas e países, evitando duplicação. Os slugs dos capítulos são os mesmos da primeira versão para preservar o progresso salvo.
2. **Domínio** (`lib/progress.ts`): funções puras para pontos, níveis, conquistas, estatísticas e perfil sensorial.
3. **Persistência**: `repositories/wine-repository.ts` (degustações, com normalização de dados antigos, exportação e importação) e `lib/book-store.ts` (capítulos concluídos, notas de quiz e anotações). Para migrar a um banco, troca-se o adaptador de armazenamento.
4. **Interface** (`components/book/`): telas pequenas e independentes; `app/page.tsx` apenas escolhe a tela pela rota.

## Chaves no LocalStorage

- `vinho-sem-misterio:tastings`
- `vinho-sem-misterio:completed-chapters`
- `vinho-sem-misterio:quiz-scores`
- `vinho-sem-misterio:chapter-notes`
