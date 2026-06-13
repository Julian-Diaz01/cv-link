# Phase 1 Complete — Token Layer

> Handoff context for the next session. Repo: `D:\code\cv-link`.
> Phase 1 of `todo/projects-first-refactor.md` is **done and verified** (`pnpm build` exit 0).

## What was done

- `src/index.css` — replaced with full Schematic token setup:
  - `@font-face` for Archivo Variable (wght axis + wdth axis) and Sometype Mono (400/500/700)
  - `@theme` block with all semantic OKLCH tokens (surfaces, ink, accent, lines, font stacks, layout)
  - `@layer base { .dark { … } }` dark-mode overrides — placed **outside** `@theme` per Tailwind v4 requirement
- `public/fonts/` — created with 5 woff2 files:
  - `archivo-variable.woff2` (weight axis, 100–900)
  - `archivo-variable-wdth.woff2` (width axis, 62%–125%, for display headings at 125% stretch)
  - `sometype-mono-400.woff2`, `sometype-mono-500.woff2`, `sometype-mono-700.woff2`
- `index.html` — `<link rel="preload" href="/fonts/archivo-variable.woff2" as="font" ...>` added
- `tailwind.config.js` — deleted (dead under Tailwind v4)
- `package.json` — `@fontsource-variable/archivo` + `@fontsource/sometype-mono` added as devDependencies

## Available Tailwind utilities (from @theme)

| Token | Utility class(es) |
|-------|------------------|
| `--color-surface` | `bg-surface`, `text-surface`, `border-surface` |
| `--color-surface-raised` | `bg-surface-raised` |
| `--color-surface-sunken` | `bg-surface-sunken` |
| `--color-ink` | `text-ink`, `bg-ink`, `border-ink` |
| `--color-ink-muted` | `text-ink-muted` |
| `--color-ink-subtle` | `text-ink-subtle` |
| `--color-accent` | `text-accent`, `bg-accent`, `border-accent` |
| `--color-accent-strong` | `text-accent-strong`, `bg-accent-strong` |
| `--color-accent-soft` | `text-accent-soft`, `bg-accent-soft` |
| `--color-line` | `border-line`, `divide-line` |
| `--color-line-strong` | `border-line-strong` |
| `--font-display` | `font-display` → Archivo (use with `font-stretch: 125%` for expanded heading) |
| `--font-body` | `font-body` → Archivo |
| `--font-mono` | `font-mono` → Sometype Mono |
| `--radius-card` | `rounded-card` → `0px` (square corners) |
| `--spacing-section` | `py-section`, `mt-section`, etc. → `6rem` |

## Dark mode mechanics

- `.dark` class is toggled on `<html>` by `ThemeContext` (via `document.documentElement.classList`)
- `ThemeProvider` is scoped **per-page** — each page component wraps with `<ThemeProvider>` (see `PortfolioDesign.tsx`, `ProjectsPage.tsx`, `ExperimentPage.tsx`)
- **New `HomePage.tsx` (Phase 5) must also wrap with `<ThemeProvider>`**
- The `@variant dark` in `src/index.css` makes standard `dark:` prefixed utilities work site-wide

## Schematic font usage guidance

- **Display headings (h1, DWG headers)**: `font-display font-black uppercase` + inline `style={{ fontStretch: '125%' }}` — uses `archivo-variable-wdth.woff2`
- **Body/narrative text**: `font-body` — uses `archivo-variable.woff2`
- **All data labels** (periods, tech chips, statuses, table keys, captions, figure numbers): `font-mono` — Sometype Mono

## Pre-existing build warnings (do NOT fix in Phase 2–6)

- `ExperimentBackground.tsx:165` — ref cleanup lint warning (component is deleted in Phase 6)
- `ThemeContext.tsx:10` — react-refresh/only-export-components (keep as-is)

## Next: Phase 2 — Data restructure

**Goal**: Create `src/data/projects.json` as the single source of truth for case studies.

**Files to create/modify**:
1. `src/data/projects.json` — new file; display-ordered array of 4 projects with shape from the plan
2. `src/types/index.ts` — add `Project`, `ProjectLink`, `ProjectImage` types; add optional `projectId?: string` to `Job`
3. `src/data/jobs.json` — **additive only** — add `projectId` to Konnektaro + iomoto (ZF) entries

**Frozen** (do not touch): `experienceCV.json`, `services.json`, `education.json`, `languages.json`, `profile.json`

**Key source material**:
- `src/data/jobs.json` — role/company/period for each project entry
- `src/data/projectArtifacts.json` — artifact groups to migrate verbatim into `projects.json`
- `public/artifacts/iomoto-app-architecture.drawio.png` — currently unused; promote as fleet-manager hero image

**4 project entries**:
1. `konnektaro` ← Konnektaro job + konnektaro artifact group
2. `fleet-manager` ← iomoto (ZF) job + iomoto-app-architecture.drawio.png
3. `tenant-res` ← tenant-app artifact group (personal project)
4. `portfolio` ← cv-app-architecture artifact group (this site)

See `todo/projects-first-refactor.md` Phase 2 for full JSON shape and type definitions.
