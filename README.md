# shared

Código TypeScript usado por mais de um app da Vitallyze. Sem build e sem publicação: cada app
inclui este repositório como **submódulo git** em `app/src/shared` e importa direto do fonte
(`@/shared/...`). Só entra aqui o que não tem segredo nem regra de negócio de um app.

| Módulo | O que faz | Usado por |
|---|---|---|
| `privacy/redact.ts` | Redator de dados pessoais (LGPD): telefone, e-mail, CPF/RG/passaporte e chaves sensíveis em objetos de log | smartinn-app (logger, exportação de avaliação, texto antes da IA), bot-platform (console) |

## Mudar algo

1. Editar aqui (ou dentro de `app/src/shared` de qualquer app, que é um checkout deste repo), com teste.
2. `npm test` e `npm run type-check`; push na `main` (o CI roda os dois).
3. Em cada app que usa: `git submodule update --remote app/src/shared`, rodar a suíte do app e commitar o novo ponteiro.

## Usar num app novo

```sh
git submodule add https://github.com/Vitallyze/shared.git app/src/shared
```

No CI do app, o checkout precisa de `submodules: true` (repo público, não pede chave). Os
Dockerfiles que copiam a pasta `app/` inteira já levam o submódulo para a imagem.
