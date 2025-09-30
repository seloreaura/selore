# React + TypeScript (Somente React e TS)

Boilerplate minimalista para colaboração rápida: **React + ReactDOM + TypeScript + Vite** (sem outras libs de runtime).
Inclui um **roteador por hash** e **auto-registro de rotas** para que cada pessoa crie telas de forma independente.

## Requisitos
- Node.js 18+
- npm

## Como começar
```bash
npm install
npm run dev
# abre http://localhost:5173
```

## Estrutura
```
src/
  app/
    router.tsx        # Roteador por hash (#/)
    routes.ts         # Agregador automático de rotas via import.meta.glob
    useTitleFromRoute.ts
  features/
    home/             # Exemplo de feature + rotas
      Home.tsx
      home.routes.tsx
    about/
      About.tsx
      about.routes.tsx
  main.tsx
  App.tsx
  styles.css
```

## Criando uma nova tela (rota)
1. Crie uma pasta dentro de `src/features`, por ex.: `src/features/produtos/`.
2. Adicione seu componente: `Produtos.tsx`.
3. Crie o arquivo `produtos.routes.tsx` exportando um array de rotas:
   ```tsx
   import React from 'react';
   import type { RouteConfig } from '../../app/router';
   import { Produtos } from './Produtos';

   const routes: RouteConfig[] = [
     { path: '/produtos', element: <Produtos />, title: 'Produtos' }
   ];

   export default routes;
   ```
4. Salve. O arquivo será encontrado automaticamente pelo `import.meta.glob` e a rota estará ativa em `#/produtos`.

> **Dica:** Para evitar conflitos em PRs, cada pessoa cria/edita **apenas os arquivos da sua feature**. O agregador lê todos os `*.routes.tsx` sem necessidade de mexer em um registro central.

## Layout por página (opcional)
Qualquer rota pode declarar `layout`, por exemplo:
```tsx
const routes: RouteConfig[] = [
  { path: '/clientes', element: <Clientes />, title: 'Clientes', layout: ({ children }) => <div className="card">{children}</div> }
];
```
Você pode compor `layout` no próprio componente ou em um HOC. (Por simplicidade, o exemplo base não usa.)

## Estilos
Arquivo único `src/styles.css` com estilo básico. Adapte como quiser (CSS puro, módulos CSS, etc.).

## Environments
- Copie `.env.example` para `.env` (se precisar) e acesse usando `import.meta.env.VITE_*`.

## Scripts
- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — preview local do build
- `npm run typecheck` — checagem de tipos sem emitir JS

## Git & Colaboração (sugestão prática)
- **Main protegida**. Trabalhem em _branches_ por feature: `feat/produtos`, `feat/clientes`.
- **Pull Requests** pequenos, focados por feature.
- Nomeiem commits de forma descritiva (ex.: `feat(produtos): nova listagem`).

## Por que hash router?
Sem dependências externas, funciona em qualquer host estático sem precisar de configurações especiais de rewrites no servidor.

## Observações
- Não usamos `@vitejs/plugin-react` para manter o runtime enxuto. Vite já lida com TS+JSX; você apenas não terá React Fast Refresh.
- Se no futuro quiser, você pode adicionar ESLint/Prettier como _devDependencies_ (não são libs de runtime).
