# Arquitetura

Aplicação Next.js/Vinext de rota única para o MVP. O conteúdo editorial fica em `content/`, a persistência local em `repositories/` e a interface em `app/`. `wineRepository` isola o LocalStorage e permite migração futura para banco de dados sem acoplar a experiência visual.
