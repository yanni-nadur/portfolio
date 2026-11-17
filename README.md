# Yanni Nadur - Portfolio

Personal portfolio presented as a desktop OS shell, with apps for contacts, calendar, photos, music, mail, and settings.

Live site (GitHub Pages): https://yanni-nadur.github.io/portfolio/

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS 3
- `@react-spring/web` + `@use-gesture/react`
- Context + `useReducer` for window and settings state
- Hash deep links (`#/photos/kongsberg`) without react-router
- GitHub Pages under the `/portfolio/` base path

## Project structure

```text
index.html
vite.config.ts
public/images/             # Static imagery and favicons
public/files/              # Resume PDFs
public/media/demos/        # Optional sanitized demo media
src/
  content/                 # Typed EN/PT content modules
  i18n/                    # Language provider
  system/                  # Desktop shell, dock, windows
  apps/                    # Contacts, Calendar, Photos, Music, Mail, Settings
  components/              # ProjectMedia, GanttTimeline
  store/                   # Settings persistence
scripts/validate.mjs
.github/workflows/deploy.yml
```

## Setup

```bash
npm install
npm run build
```

## Local development

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/portfolio/`).

```bash
npm run preview
```

serves the production build locally.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run validate` | Validate content structure, translations, and assets |
| `npm test` | Build + validate |

## Apps

| App | Content |
| --- | --- |
| Contacts | Profile, channels, work/education/stack sidebar, testimonials as messages |
| Calendar | Career gantt + detailed roles (education track appears when dated entries exist) |
| Photos | Project library, favorites, full case-study viewer, media fallbacks |
| Music | Skill groups as albums/tracks, favorites, simulated player |
| Mail | Prefill compose to `yanninadur@gmail.com`, channels, resume downloads |
| Settings | Theme, language, parallax, clear localStorage |

Private projects (Synorios, New Art Fiction, BAMHUB) stay without public URLs and without “Visit Website”.

## Language support

English is the default. Portuguese is available in Settings.

UI strings live in `src/content/ui.ts`. Profile, projects, experience, skills, and testimonials are localized under `en` / `pt` in `src/content/`.

## Entry modes

- `#/` - start screen (Simplified Version / Boot the Portfolio OS)
- `#/simple` - readable single-page portfolio
- `#/os` - interactive desktop OS
- `#/contacts`, `#/photos/kongsberg`, … - open an OS app directly

## Adding a featured case study

1. Open `src/content/projects.ts`.
2. Add an object to `featuredProjectArray` with complete `en` / `pt` fields and `media`.
3. Run `npm test`.

## Adding demo GIF / video media

Place sanitized files in `public/media/demos/`, then reference them from the project entry:

```ts
media: {
    sources: [
        "media/demos/synorios-preview.webm",
        "media/demos/synorios-preview.mp4"
    ],
    poster: "media/demos/synorios-poster.webp",
    illustrative: false
}
```

Missing media shows an elegant project fallback - never a broken player.

## Resumes

- `public/files/resume-en.pdf`
- `public/files/resume-pt.pdf`

## GitHub Pages deployment

This repo includes `.github/workflows/deploy.yml`.

1. In the GitHub repo: Settings → Pages → Build and deployment → Source: GitHub Actions.
2. Push to `main` / `master`, or run the workflow manually.
3. Confirm publication at `https://yanni-nadur.github.io/portfolio/`.

`dist/` is build output and is gitignored.

## Assets still needed from you

1. Avatar photo for Contacts (initials fallback is used until then)
2. Education institution + start/end dates if you want the Calendar education track
3. Confirm whether WhatsApp (`+55 11 94927-2576`) should return
4. Sanitized demos for Synorios / New Art Fiction / BAMHUB

## Confidentiality

Do not publish private source code, API keys, internal endpoints, customer/payment data, or unsanitized recordings.
