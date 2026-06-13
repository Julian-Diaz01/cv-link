# Phase 4 Complete — New Components

> Handoff context for the next session. Repo: `D:\code\cv-link`.
> Phase 4 of `todo/projects-first-refactor.md` is **done**. Phases 1–4 complete.
> `pnpm build` exits 0 (only pre-existing warnings: ExperimentBackground.tsx:165 ref cleanup, ThemeContext.tsx:10 react-refresh).

## What was done

### New files created

| File | Purpose |
|------|---------|
| `src/components/motion/Reveal.tsx` | framer-motion `whileInView` fade+translate; renders static div when `useReducedMotion()` is true |
| `src/components/home/SectionHeading.tsx` | Shared section heading: mono label + hairline rule |
| `src/components/home/HomeHero.tsx` | Hero section from `profile.json`; Archivo Expanded 900 "WORK YOU CAN INSPECT", red CTA to `#projects`, CV.PDF link |
| `src/components/home/ProjectCaseStudy.tsx` | Core case study unit: `DWG 0n/04` header, title-block table (ROLE/COMPANY/PERIOD/STATUS), narrative, tech chips, figure plate with registration marks, `<ProjectArtifacts embedded variant="timeline" />`, alternates layout by `index % 2` |
| `src/components/home/ProjectRail.tsx` | Sticky desktop-only (`xl:`) scroll-spy rail; IntersectionObserver tracks `#project-{id}` sections; active link gets accent left-border |
| `src/components/home/ExperienceTimeline.tsx` | Compact rows from `jobs.json`; rows with `projectId` show "view drawing ↑" link to `#project-{id}` |
| `src/components/home/CredentialsSection.tsx` | Two-column education + languages; all token classes |

### Restyled (API unchanged)

| File | Change |
|------|--------|
| `src/components/ProjectArtifacts.tsx` | Replaced `slate-*`/`orange-*`/`rounded-xl` classes with token classes (`border-line`, `bg-surface-raised`, `text-ink`, etc.); external dialog also token-styled |
| `src/components/Navigation.tsx` | Full rewrite: removed `variant` prop and all experiment-variant branches; nav links → Home/`/#projects`/`/#experience`/CV.PDF; logo badge is square `border-ink`; all classes use tokens |
| `src/components/Contact.tsx` | Replaced gradient+rounded-full with `bg-ink text-surface`; buttons are square token-bordered; email link keeps obfuscation logic |
| `src/components/ContactPopup.tsx` | Inline CSS bubble uses `var(--color-ink)`; button replaced with `bg-accent text-white font-mono` |

### Bug fixed in passing

- `src/pages/ExperimentPage.tsx:38` — removed `variant="experiment"` prop from `<Navigation>` call (prop was deleted from Navigation; ExperimentPage is deleted in Phase 6 anyway)

## Current phase status

| Phase | Status |
|-------|--------|
| 1 — Token layer | Done |
| 2 — Data restructure | Done |
| 3 — Sanity decoupling | Done |
| 4 — New components | Done |
| 5 — Page assembly + routing | **Not started** |
| 6 — Cleanup | Not started |

## Next: Phase 5 — Page assembly, routing, SEO

### Files to create

**`src/pages/HomePage.tsx`** — replaces `PortfolioDesign.tsx`
- Static JSON imports only (`profile.json`, `projects.json`, `jobs.json`, `education.json`, `languages.json`)
- Wrap with `<ThemeProvider>` (same pattern as existing pages)
- Order: `<Navigation>` → `<HomeHero>` → `#projects` section (flex row: `<ProjectRail>` + 4× `<ProjectCaseStudy>`) → `<RunningCatScene>` (lazy, Suspense + fixed-height placeholder) → `<ExperienceTimeline>` → `<CredentialsSection>` → `<Contact>` → `<ContactPopup>`
- Keep `useTrackPortfolioPageLoad` and `usePortfolioStructuredData` from `usePortfolioPage.ts`

**`src/hooks/useScrollToHash.ts`** — **load-bearing** for hash nav
- On mount + hash change: `scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })`
- React Router does NOT scroll to hashes automatically

### Files to modify

**`src/App.tsx`**
- `/` → `HomePage` (lazy)
- `/projects` → `<Navigate to="/#projects" replace />`
- `/cv` — untouched
- Remove `/experiment(s)` routes + lazy import (fall through to NotFound)

**SEO**
- `src/utils/seoStructuredData.ts` — extend `usePortfolioStructuredData` to emit one `CreativeWork` per project using `generateProjectSchema`
- `src/components/SEO.tsx` — update default title/description to projects-first copy
- `public/sitemap.xml` — rewrite to exactly `/` (1.0) and `/cv` (0.6)
- `index.html` — refresh meta/OG descriptions

### Key implementation notes

- `RunningCatScene` must stay lazy (`React.lazy`) — Three.js must NOT land in the entry chunk
- `useScrollToHash` must be called inside `HomePage` (needs router context)
- `<ThemeProvider>` wraps the whole page component — same as existing pages

### Token reference (unchanged from Phase 1)

| Token | Utility |
|-------|---------|
| `--color-surface` | `bg-surface text-surface` |
| `--color-ink` | `text-ink border-ink` |
| `--color-ink-muted` | `text-ink-muted` |
| `--color-accent` | `text-accent bg-accent border-accent` |
| `--color-line` | `border-line` |
| `--font-display` | `font-display` (Archivo; `style={{ fontStretch: '125%' }}` for expanded) |
| `--font-mono` | `font-mono` (Sometype Mono) |

### Pre-existing build warnings — do NOT fix

- `ExperimentBackground.tsx:165` — ref cleanup lint (component deleted in Phase 6)
- `ThemeContext.tsx:10` — react-refresh warning (keep as-is)
