# Portfolio — contexto completo para IA

Documento de consciência do projeto. Preferir **este arquivo + o código** ao `README.md` quando houver conflito (o README ainda menciona hash routing, que já foi substituído por pathname).

| Campo | Valor |
| --- | --- |
| Repo | `d:\Personal\Projects\portfolio` |
| Produto | Portfólio pessoal de **Yanni Nadur** |
| Live | https://yanni-nadur.github.io/portfolio/ |
| Versão | `3.0.0` |
| Base path | `/portfolio/` (GitHub Pages project site) |

---

## 1. Conceito do produto

SPA única com **três modos**:

| View | Path | Função |
| --- | --- | --- |
| `landing` | `/portfolio/` | Tela inicial: escolher portfólio simples ou OS |
| `simple` | `/portfolio/simple` | Portfólio one-page legível (scroll) |
| `os` | `/portfolio/os` ou path de app | Desktop interativo (wallpaper, top bar, dock, janelas) |

No modo OS, o conteúdo real é apresentado como apps:

| App ID | Metáfora | Conteúdo real |
| --- | --- | --- |
| `contacts` | Contatos | Perfil, canais, work/education/stack, depoimentos como mensagens |
| `calendar` | Calendário | Carreira/formação em Gantt + detalhe do cargo |
| `photos` | Fotos | Projetos (library/favorites/case study) |
| `music` | Música | Skills como álbuns/faixas + player simulado |
| `mail` | Mail | Compose mailto + canais + currículos |
| `settings` | Ajustes | Tema, idioma, parallax, limpar localStorage |

Árvore de providers (`src/App.tsx`):

`SettingsProvider` → `I18nProvider` → `ViewProvider` → rotas.

No OS: `WindowProvider pathSyncEnabled={true}` envolve `DesktopShell` + `BootScreen`.

---

## 2. Stack e tooling

| Camada | Escolha |
| --- | --- |
| UI | React 18.3 |
| Linguagem | TypeScript (`strict`, `noUnusedLocals`, `noUnusedParameters`) |
| Bundler | Vite 5.4 (`base: "/portfolio/"`, `outDir: "dist"`) |
| CSS | Tailwind 3.4 + PostCSS + Autoprefixer |
| Motion | `@react-spring/web`, `@use-gesture/react` |
| Router | **Sem react-router** — `src/system/pathRouting.ts` + History API |
| Estado | React Context (`settingsStore`, `viewStore`, `windowStore`) |
| Deploy | GitHub Actions → GitHub Pages |

### Scripts (`package.json`)

| Comando | Efeito |
| --- | --- |
| `npm run dev` | Vite (ex.: `http://localhost:5173/portfolio/`) |
| `npm run build` | `tsc --noEmit && vite build` |
| `npm run preview` | Serve `dist/` |
| `npm run validate` | `node scripts/validate.mjs` |
| `npm test` | build + validate |

### Vite

- Plugin `githubPagesSpaFallbackPlugin` em `vite.config.ts` copia `dist/index.html` → `dist/404.html` (deep links no Pages).
- Alias `@/*` → `src/*`.

### CI (`.github/workflows/deploy.yml`)

Push em `main`/`master` ou `workflow_dispatch` → Node 20 → `npm ci` → validate → build → upload `dist` → `deploy-pages`.

---

## 3. Mapa de diretórios

```text
portfolio/
  PROJECT_CONTEXT.md          # Este arquivo
  README.md                   # Visão humana (routing desatualizado)
  index.html                  # Meta, fontes, favicons, FOUC de tema
  vite.config.ts
  tsconfig.json / tsconfig.node.json
  tailwind.config.js
  postcss.config.js
  package.json
  .github/workflows/deploy.yml
  scripts/validate.mjs
  public/
    favicon.ico, favicon-16.png, favicon-32.png, apple-touch-icon.png
    files/resume-en.pdf, resume-pt.pdf
    images/                   # avatar, projetos, depoimentos, origami.svg
    images/companies/         # logos de experiência/educação
    media/demos/.gitkeep      # demos sanitizadas (vazio por enquanto)
  src/
    main.tsx, App.tsx, index.css, vite-env.d.ts
    content/                  # Dados EN/PT + ui strings
    i18n/I18nProvider.tsx
    store/settingsStore.tsx, viewStore.tsx
    system/                   # Shell, routing, windows, registry
    apps/{contacts,calendar,photos,music,mail,settings}/
    views/SimplePortfolio.tsx
    components/               # CompanyMark, ProjectMedia, GanttTimeline, SkillCarousel, AppearanceControls
    hooks/                    # useMediaQuery, useFocusTrap
```

---

## 4. Roteamento (pathname — não hash)

**Fonte da verdade:** `src/system/pathRouting.ts`.

Helpers principais:

- `getBasePath()` / `getPathSegmentArray()` / `buildAbsolutePath()`
- `parseViewFromPath()` / `buildViewPath()`
- `parseAppFromPath()` / `buildAppPath()`
- `migrateLegacyHashRoute()` — se existir `#/…`, migra para path e limpa hash
- `replacePath()` — `history.replaceState`

### Views

| Path | View |
| --- | --- |
| `/portfolio/` (sem segmentos) | `landing` |
| `/portfolio/simple` | `simple` |
| `/portfolio/os` **ou** qualquer `AppId` | `os` |

### Deep links de apps

| Path | Significado |
| --- | --- |
| `/portfolio/os` | Desktop sem app focado no path |
| `/portfolio/photos` | Abre Photos |
| `/portfolio/photos/kongsberg` | Case study |
| `/portfolio/photos/favorites` | Aba favoritos |
| `/portfolio/os/photos/kongsberg` | Também válido |

`AppId`: `contacts` | `calendar` | `photos` | `music` | `mail` | `settings`.

Photos é o principal consumidor de `window.route` via `setAppRoute`.

### Atenção: README vs código

`README.md` ainda lista `#/simple`, `#/os`. **Ignorar** — o código usa paths. Hash só é migrado no boot.

### Favicons e base path

Em `index.html`, usar:

```html
<link rel="icon" href="/favicon.ico" …>
```

**Não** usar `%BASE_URL%favicon…`: o Vite já prefixa `/` com `base`, e `%BASE_URL%` duplicava para `/portfolio/portfolio/…` (404 → browser mantinha favicon antigo em cache).

---

## 5. Estado e i18n

### `settingsStore` (`src/store/settingsStore.tsx`)

- **Persistência:** `localStorage` key `portfolio-os-settings`
- **Campos:** `theme` (`light`|`dark`, default `dark`), `language` (`en`|`pt`, default `en`), `parallaxEnabled`, `favoriteProjectIdArray`, `favoriteTrackKeyArray`
- **Side effects:** `html.dark`, `documentElement.lang` (`en` / `pt-BR`)
- **FOUC:** script inline em `index.html` lê a mesma key antes do paint
- **API:** `setTheme`, `setLanguage`, `setParallaxEnabled`, toggles de favoritos, `clearSettings`

### `viewStore` (`src/store/viewStore.tsx`)

- Sem persistência local — URL é a fonte
- API: `view`, `openLanding`, `openSimple`, `openOs`
- Body classes: `simple-scroll` / `landing-scroll` (`App.tsx`)

### `windowStore` (`src/system/windowStore.tsx`)

- Só em memória (sem localStorage)
- Por app: `isOpen`, `isMinimized`, `zIndex`, `position`, `size`, `route`
- Com `pathSyncEnabled`: `popstate` → sync; app focado → `replacePath(buildAppPath(…))`
- API: `openApp`, `closeApp`, `minimizeApp`, `focusApp`, `moveWindow`, `resizeWindow`, `setAppRoute`

### i18n (`src/i18n/I18nProvider.tsx`)

- `t(key)` → `uiCopy[language][key]` com fallback EN
- `localize(pair)` → `pair[language]`
- Idiomas: `"en" | "pt"`
- Chrome UI: chaves camelCase em `src/content/ui.ts` (parity EN/PT validada)
- Conteúdo biográfico: objetos com blocos `en:` / `pt:` (`LocalizedPair<T>`)

---

## 6. Módulos de conteúdo

Barrel: `src/content/index.ts` — reexports + `getAssetUrl(relativePath)` + `findFeaturedProject` / `findAnyProject`.

### Dados reais (editar para biografia/portfólio)

| Arquivo | Exports | Campos importantes |
| --- | --- | --- |
| `profile.ts` | `profileLinks`, `profileCopy` | email, github, linkedin, whatsapp, resumes, avatar; name/role/status/about/initials |
| `experience.ts` | `experienceArray` | id, concurrentGroup, track (`career`\|`education`), dates, **logo**, copy EN/PT |
| `projects.ts` | `featuredProjectArray`, `additionalProjectArray` | id, url, image, accent, media; featured tem case study completo; **sem campo `logo`** |
| `skills.ts` | `skillGroupArray` | 6 grupos (frontend, backend, etc.) |
| `testimonials.ts` | `testimonialArray` | 5 depoimentos + imagem |
| `skillIcons.ts` | `skillIconByNameMap` | paths SVG (Simple Icons) para o carousel |

### Snapshot atual do conteúdo

- **Perfil:** Yanni Nadur — Senior AI & Full Stack Software Engineer; email `yanninadur@gmail.com`; WhatsApp ativo; avatar `images/avatar.webp`
- **Featured:** só `kongsberg` (público; `media.sources: []`)
- **Additional:** `notco`, `nordic-batteries`, `karen-oliveira`, `nantes-mello`, `solon` (todos com URL pública)
- **Carreira:** synorios, bamhub (`concurrentGroup: "sister"`), daytwo, futurebrand, tinpix, aurora, intermeio (`logo: null`)
- **Educação:** `unip`
- **Projetos privados** (sem URL pública no produto): Synorios / New Art Fiction / BAMHUB — não inventar “Visit Website”

### Chrome (não é biografia)

| Arquivo | Papel |
| --- | --- |
| `ui.ts` | Strings de dock, apps, landing, simple, boot, mail, settings |
| `types.ts` | Tipos compartilhados |

---

## 7. System shell

| Arquivo | Papel |
| --- | --- |
| `DesktopShell.tsx` | Wallpaper + TopBar + WindowManager + Dock |
| `Wallpaper.tsx` | Night (estrelas) vs sakura (pétalas) conforme tema; parallax opcional |
| `TopBar.tsx` | Voltar ao landing, avatar, nome + app focado, relógio |
| `Dock.tsx` | Launcher com spring hover; desktop pill / mobile full-width |
| `WindowManager.tsx` | Desktop: stack de janelas; mobile: uma janela fullscreen |
| `AppWindow.tsx` | Lazy load, drag/resize, minimize/close, focus trap (mobile) |
| `BootScreen.tsx` | Overlay timed (`os`\|`simple`); skip se reduced motion |
| `LandingScreen.tsx` | CTAs → simple / OS; language switch |
| `appRegistry.ts` | Lazy imports, accents, default sizes, `titleKey` |
| `icons.tsx` | Ícones SVG dos apps |
| `pathRouting.ts` | Helpers de URL |

Mobile: `useIsDesktop` — um app por vez; `useFocusTrap` na janela aberta.

---

## 8. Simple portfolio

**Arquivo:** `src/views/SimplePortfolio.tsx`

**Seções (ids):** `banner` → `skills` → `experience` → `work` → `testimonials` → `contact`

**UX relevante:**

- Wallpaper + parallax compartilhados
- Aside sticky (`w-72`) com nav + CTA OS (`simpleHeroCtaOs`: “Try OS” / “Abrir OS”, `whitespace-nowrap`)
- Menu mobile drawer
- Cards de projeto com `.project-card-glow` (glow uniforme, gap-6)
- Contato: email, WhatsApp, LinkedIn, GitHub, resumes, copy email
- FAB circular “back to top” (seta SVG; mobile `bottom-5`)
- Boot overlay variant `simple`

---

## 9. Design system

**Fontes (Google Fonts em `index.html`):**

- Display: Shippori Mincho (`font-display`)
- Body: Zen Kaku Gothic New (`font-sans`)

**Cores (Tailwind extend):** `ink`, `slateSoft`, `mist`, `surface`, `line`, `accent` `#D9772F`, `accentDeep`, `night`, `sky`, `sakura`, `washi`

**Temas:** `darkMode: "class"` em `<html>`; dark ≈ night/preto; light ≈ washi/sakura

**Wallpaper CSS:** `night-sky`, `sakura-sky`, glows, vignettes (`src/index.css`)

**Glow:** `shadow-glow`; `.project-card-glow` (blur curto ~8–10px, 4 direções)

**Motion:** boot, springs de janela/dock, parallax; respeita `prefers-reduced-motion`

### Padrão de código (obrigatório neste repo)

- Allman braces (chave de abertura em linha própria)
- 4 espaços, sem tabs
- Sem trailing commas
- Comentários de seção: `// -- IMPORTS`, `// -- CONSTANTS`, `// -- TYPES`, `// -- OPERATIONS`, etc.
- `// ~~` entre blocos significativos
- Funções nomeadas preferidas a arrows (exceto callbacks)
- Mudanças mínimas e coerentes; não reformatar o projeto inteiro

---

## 10. Assets em `public/`

| Categoria | Arquivos |
| --- | --- |
| Favicons | `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` (origami branco em círculo preto, pouco respiro) |
| Brand / OG | `images/origami.svg` (também og:image / twitter:image) |
| Avatar | `images/avatar.webp` |
| Projetos | `*image.webp` (kongsberg, notco, nordic, karen, nantes, solon) |
| Depoimentos | `erick.jpg`, `leandro.jpg`, `ulisses.jpeg`, `felipe.jpeg`, `rodolfo.jpeg` |
| Empresas | `images/companies/{synorios,bamhub,daytwo,futurebrand,tinpix,aurora,unip}.*` |
| Currículos | `files/resume-en.pdf`, `files/resume-pt.pdf` |
| Demos | `media/demos/` (só `.gitkeep`) |

URLs de runtime de conteúdo: sempre `getAssetUrl(...)`.

**Nota:** logos de projeto foram removidos do modelo/dados; só experience usa `logo` via `CompanyMark`.

---

## 11. Decisões e restrições importantes

1. **Path routing**, não hash; migrar hash legado uma vez no boot.
2. **Projetos sem `logo`/`logoInvert`** — só `image`/`media`; logos ficam em experience.
3. **Favicon:** paths absolutos `/favicon…` no HTML (evitar double-base); cache de favicon no browser é agressivo (hard refresh / aba anônima).
4. **GitHub Pages:** `base: "/portfolio/"`, Actions, `404.html` SPA fallback.
5. **`scripts/validate.mjs`:** estrutura de conteúdo, parity EN/PT de `ui.ts`, existência de assets, sem em/en dashes em content/README/package; featured deve ser `kongsberg`; 5 additional; 6 skill groups; 5 testimonials.
6. **Confidencialidade:** não publicar código privado, keys, endpoints internos, dados de cliente/pagamento ou demos não sanitizadas.
7. **README desatualizado** em routing e em alguns “assets still needed” (avatar e WhatsApp já existem no código).

---

## 12. Como rodar

```bash
cd d:\Personal\Projects\portfolio
npm install
npm run dev          # http://localhost:5173/portfolio/ (porta pode variar)
npm run build
npm run preview
npm run validate
npm test             # build + validate
```

Deploy: Pages Source = GitHub Actions; push em `main`/`master`.

---

## 13. Onde editar o quê

### Conteúdo / biografia

- `src/content/profile.ts`
- `src/content/experience.ts`
- `src/content/projects.ts`
- `src/content/skills.ts`
- `src/content/testimonials.ts`
- `src/content/skillIcons.ts`
- `src/content/types.ts`
- `public/images/**`, `public/files/**`, `public/media/demos/**`

### Copy de UI / i18n

- `src/content/ui.ts`
- `src/i18n/I18nProvider.tsx`
- `src/components/AppearanceControls.tsx`

### Superfícies de produto

- `src/system/LandingScreen.tsx`
- `src/views/SimplePortfolio.tsx`
- `src/apps/*/*App.tsx`
- `src/components/{ProjectMedia,GanttTimeline,SkillCarousel,CompanyMark}.tsx`

### Sistema / routing / shell

- `src/system/pathRouting.ts`
- `src/store/viewStore.tsx`
- `src/system/windowStore.tsx`
- `src/store/settingsStore.tsx`
- `src/system/{DesktopShell,Dock,TopBar,Wallpaper,BootScreen,WindowManager,AppWindow,appRegistry,icons}.tsx`
- `src/App.tsx`, `src/main.tsx`

### Design / build / deploy

- `src/index.css`, `tailwind.config.js`, `index.html`
- `vite.config.ts`, `package.json`, `scripts/validate.mjs`
- `.github/workflows/deploy.yml`

---

## 14. Mapa rápido app ↔ conteúdo

| Superfície | Conteúdo principal |
| --- | --- |
| Landing | `profileCopy`, `profileLinks`, keys `landing*` em `ui.ts` |
| Simple | Todos os content modules + SkillCarousel |
| Contacts | profile, experience, skills, testimonials |
| Calendar | experience + GanttTimeline |
| Photos | projects + favoritos (settings) |
| Music | skills + favoritos de tracks (settings) |
| Mail | profileLinks + defaults de `ui.ts` |
| Settings | settingsStore |

---

## 15. Fluxo mental para tarefas comuns

1. **Mudar texto do site** → `ui.ts` (chrome) ou content modules (biografia); manter EN + PT.
2. **Novo projeto** → `projects.ts` + imagem em `public/images/` + `npm run validate`.
3. **Nova experiência** → `experience.ts` + logo em `public/images/companies/` se houver.
4. **Ajustar visual simple** → `SimplePortfolio.tsx` + `index.css` / Tailwind.
5. **Ajustar OS** → `system/*` + app correspondente.
6. **URL / deep link** → `pathRouting.ts` + `viewStore` / `windowStore` (nunca reintroduzir hash como fonte da verdade).
7. **Antes de considerar pronto** → `npm test`.

---

## 16. Instruções para a IA consumidora

- Tratar este arquivo como briefing operacional; validar no código se algo parecer antigo.
- Não reintroduzir hash routing, logos de projeto, ou `%BASE_URL%` em favicons.
- Não inventar URLs públicas para projetos privados.
- Seguir o coding standard Allman / 4 espaços / seções `// --`.
- Preferir mudanças mínimas e coerentes; não reescrever o design system sem pedido.
- Após edições de conteúdo/estrutura, rodar `npm run validate` (e `npm run build` se tocar TS/CSS).
