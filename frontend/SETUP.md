# Setup do Frontend — Caneta e Adaga

Guia passo a passo para configurar a base do projeto Vue 3 + Vite. A ordem foi pensada para minimizar retrabalho: primeiro a fundação (TypeScript, estrutura de pastas), depois a infraestrutura (Router, Pinia, tema), e por último as libs de UI (PrimeVue, ícones), que já se beneficiam de tudo isso pronto.

Estado atual do projeto (`frontend/`): Vite + Vue 3 puro, sem TypeScript, Pinia, Router, PrimeVue ou ícones instalados.

---

## 1. Instalar TypeScript

Faça isso primeiro: migrar depois de já ter Router/Pinia/PrimeVue instalados dá muito mais arquivo pra converter.

```bash
npm install -D typescript vue-tsc
```

Crie o `tsconfig.json` na raiz de `frontend/`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"]
}
```

Renomeie `main.js` → `main.ts` e atualize a referência no `index.html`:

```html
<script type="module" src="/src/main.ts"></script>
```

Adicione o arquivo `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

Ajuste o `vite.config.js` → `vite.config.ts` (adicionando o resolve de alias, já aproveitando para o `@/`):

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

Adicione o script de checagem de tipos no `package.json`:

```json
"scripts": {
  "type-check": "vue-tsc --noEmit"
}
```

A partir daqui, novos componentes usam `<script setup lang="ts">`.

---

## 2. Estrutura de pastas

Com TS já configurado, monte o esqueleto de pastas antes de adicionar Router/Pinia/PrimeVue, para já criar cada peça no lugar certo.

```
src/
├── assets/          # imagens, svgs, fontes
├── components/       # componentes reutilizáveis (botões, cards, inputs)
├── layouts/          # layouts de página (DefaultLayout, AuthLayout, etc.)
├── views/            # páginas roteadas (uma por rota)
├── router/           # configuração do vue-router
├── stores/           # stores do Pinia
├── services/         # chamadas HTTP / integração com API
├── composables/       # funções reutilizáveis com Composition API (use*)
├── styles/            # tema, variáveis de cor, tipografia
└── types/             # tipos e interfaces TS compartilhados
```

Comandos:

```bash
mkdir -p src/layouts src/views src/router src/stores src/services src/composables src/styles src/types
```

Mova `style.css` para `src/styles/base.css` (o tema centralizado do passo 5 vai morar ao lado dele).

---

## 3. Tema, cores e tipografia centralizados

Você já tem a paleta — o objetivo aqui é ter uma única fonte de verdade que tanto o CSS puro quanto o PrimeVue (passo 6) vão consumir.

Crie `src/styles/theme.css` com as variáveis (adapte os valores para a sua paleta; o projeto já tem uma base em `style.css` com `--accent`, `--text`, `--bg`, etc. — use como ponto de partida):

```css
:root {
  /* Cores */
  --color-primary: #aa3bff;
  --color-primary-hover: #c084fc;
  --color-bg: #ffffff;
  --color-bg-alt: #f4f3ec;
  --color-text: #08060d;
  --color-text-muted: #6b6375;
  --color-border: #e5e4e7;

  /* Tipografia */
  --font-sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, Consolas, monospace;
  --font-size-base: 16px;
  --line-height-base: 1.45;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #16171d;
    --color-bg-alt: #1f2028;
    --color-text: #f3f4f6;
    --color-text-muted: #9ca3af;
    --color-border: #2e303a;
  }
}
```

Importe em `main.ts`, antes do `base.css`:

```ts
import './styles/theme.css'
import './styles/base.css'
```

No passo 6, o PrimeVue vai referenciar essas mesmas variáveis no preset de tema, evitando duas paletas divergentes.

---

## 4. Vue Router

```bash
npm install vue-router@4
```

Crie `src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
      ],
    },
  ],
})

export default router
```

Crie um `DefaultLayout.vue` mínimo em `src/layouts/` (com um `<router-view />`) e um `HomeView.vue` em `src/views/`.

Registre no `main.ts`:

```ts
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './styles/theme.css'
import './styles/base.css'

createApp(App).use(router).mount('#app')
```

E no `App.vue`, troque o conteúdo atual por `<router-view />`.

---

## 5. Pinia (estado global)

```bash
npm install pinia
```

Registre no `main.ts` (a ordem entre Pinia e Router não importa, mas mantenha os `.use()` juntos):

```ts
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).use(router).mount('#app')
```

Crie uma store de exemplo em `src/stores/counter.ts` para validar a instalação:

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }
  return { count, increment }
})
```

---

## 6. PrimeVue

```bash
npm install primevue @primevue/themes
```

No `main.ts`:

```ts
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark',
      },
    },
  })
  .mount('#app')
```

Para alinhar o preset do PrimeVue com a paleta do passo 3, sobrescreva os tokens do preset (em vez de manter duas paletas separadas):

```ts
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const CanetaEAdagaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      500: '{color.primary}', // ou o valor hex direto, ex: '#aa3bff'
    },
  },
})
```

Instale também os ícones do PrimeIcons se for usar os componentes que dependem deles (menus, inputs com ícone embutido, etc.):

```bash
npm install primeicons
```

```ts
import 'primeicons/primeicons.css'
```

Teste com um componente simples num view, ex. `<Button label="Testar" />`.

---

## 7. Ícones — Vue Feather ou alternativa

`vue-feather` está sem manutenção há anos e não tem suporte oficial ao Vue 3 com tree-shaking adequado. Recomendo substituir por uma das duas opções abaixo:

- **`unplugin-icons`** (recomendado): permite importar qualquer ícone do Iconify (incluindo o set `feather`) como componente, sob demanda, com tree-shaking automático. Mantido ativamente.
- **`lucide-vue-next`**: sucessor espiritual do Feather Icons (mesmo estilo visual, ícones adicionais), com build para Vue 3 nativo.

Passo a passo com `unplugin-icons` (mantendo a estética Feather):

```bash
npm install -D unplugin-icons @iconify-json/feather
```

No `vite.config.ts`:

```ts
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    vue(),
    Icons({ compiler: 'vue3' }),
  ],
})
```

Uso em componente:

```vue
<script setup lang="ts">
import IconHome from '~icons/feather/home'
</script>

<template>
  <IconHome />
</template>
```

Se preferir a alternativa mais simples (sem plugin de build), use `lucide-vue-next`:

```bash
npm install lucide-vue-next
```

```vue
<script setup lang="ts">
import { Home } from 'lucide-vue-next'
</script>

<template>
  <Home :size="20" />
</template>
```

---

## Ordem resumida

1. TypeScript
2. Estrutura de pastas
3. Tema/cores/tipografia centralizados
4. Vue Router
5. Pinia
6. PrimeVue
7. Ícones (Vue Feather → sugerido substituir por `unplugin-icons` + set `feather`, ou `lucide-vue-next`)

Depois de cada passo, rode `npm run dev` e `npm run type-check` para confirmar que nada quebrou antes de seguir para o próximo.
