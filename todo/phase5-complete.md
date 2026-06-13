# Phase 5 Complete — Page Assembly, Routing, SEO

> Handoff context for the next session. Repo: `D:\code\cv-link`.
> Phase 5 of `todo/projects-first-refactor.md` is **done**. Phases 1–5 complete.
> `pnpm build` exits 0 (only pre-existing warning: `ThemeContext.tsx:10` react-refresh).

## What was done

### New files created

| File | Purpose |
|------|---------|
| `src/hooks/useScrollToHash.ts` | On mount + hash change: `scrollIntoView({ behavior: 'smooth' \| 'auto' })`; respects `prefers-reduced-motion` |
| `src/pages/HomePage.tsx` | New `/` page; static JSON imports only; wraps with `<ThemeProvider>`; assembles Navigation → HomeHero → #projects (ProjectRail + 4×ProjectCaseStudy) → RunningCatScene (lazy) → #experience ExperienceTimeline → CredentialsSection → Contact → ContactPopup |

### Files modified

| File | Change |
|------|--------|
| `src/hooks/usePortfolioPage.ts` | Added `projects?: Project[]` to `UsePortfolioStructuredDataProps`; `usePortfolioStructuredData` now emits one `generateProjectSchema` per project in `@graph` |
| `src/App.tsx` | `/` → `HomePage` (lazy); `/projects` → `<Navigate to="/#projects" replace />`; removed `/experiment` and `/experiments` routes + their lazy imports |
| `src/components/SEO.tsx` | Default `title` → `"Julian Diaz — Frontend Engineer"`; default `description` → projects-first copy |
| `src/components/ProjectArtifacts.tsx` | `YamlViewerDialog` now `React.lazy` + wrapped in `<Suspense fallback={null}>` to keep swagger-ui CSS out of the home chunk |
| `public/sitemap.xml` | Rewritten: only `/` (priority 1.0) and `/cv` (priority 0.6); phantom URLs removed |
| `index.html` | All `<title>`, `<meta name="title/description">`, OG, Twitter, AI, and static JSON-LD descriptions updated to projects-first copy |

## Build chunk verification (passing)

| Chunk | Size | Notes |
|-------|------|-------|
| `RunningCatScene-*.js` | ~880 kB | Three.js correctly lazy — NOT in entry chunk |
| `YamlViewerDialog-*.css` | ~177 kB | swagger-ui CSS correctly lazy — NOT in home chunk |
| `HomePage-*.js` | ~161 kB | Home page JS only |
| `index-*.js` (large) | ~1309 kB | Shared vendor bundle (react, framer-motion, etc.) |

## Current phase status

| Phase | Status |
|-------|--------|
| 1 — Token layer | Done |
| 2 — Data restructure | Done |
| 3 — Sanity decoupling | Done |
| 4 — New components | Done |
| 5 — Page assembly + routing | Done |
| 6 — Cleanup | **Not started** |

## Next: Phase 6 — Cleanup

### Files to DELETE

```
src/pages/ExperimentPage.tsx
src/pages/ProjectsPage.tsx
src/pages/PortfolioDesign.tsx
src/components/ExperimentBackground.tsx
src/components/ExperimentHeroIntro.tsx
src/components/Hero.tsx
src/components/Scene.tsx
src/components/Experience.tsx
src/components/Education.tsx
src/components/Languages.tsx
src/components/Services.tsx
src/components/DividedContentSection.tsx
src/hooks/useSEO.ts
src/data/projectArtifacts.json
tailwind.config.js
```

### Types cleanup (`src/types/index.ts`)
- Remove `ProjectArtifactsGroup` interface (now unused)
- Keep `Service` (used by `CvPage`)

### `package.json`
- Remove `styled-components` (unused in `src/`; was a Sanity peer dep — re-add only if `pnpm sanity:dev` complains)

### Sweep gate (run after all deletes)
```
grep -rn "Experiment\|ProjectsPage\|PortfolioDesign\|projectArtifacts\|styled-components" src/
```
Must return zero hits.

### Final gate
`pnpm lint` + `pnpm build` must both exit 0.

## Pre-existing warnings — do NOT fix

- `ThemeContext.tsx:10` — react-refresh/only-export-components (keep as-is, `/cv` page also uses ThemeContext)
