# TODO: Projects-First Portfolio Refactor

> Handoff plan — self-contained, written for an agent with no prior conversation context.
> Repo: `D:\code\cv-link` (Vite 7 + React 18 + TS + Tailwind 4, deployed to Firebase Hosting from `build/`).
> Status: **approved plan, not yet implemented.** Visual direction already chosen by the user.

## Goal

The site is a portfolio that reads like a CV: the home page (`/`) is a hero plus text-heavy Experience/Education/Languages sections, while the real evidence of the work (architecture diagrams, ERDs, OpenAPI specs, Figma links in `src/data/projectArtifacts.json`) hides on a secondary `/projects` page. Refactor so **projects ARE the display of the experience**: a fresh visual identity, a case-study-driven home page, `src/data/*.json` as the single source of truth.

## Hard requirements (user-confirmed — do not relitigate)

1. **Home = case-study scroll**: hero → each project as a full case-study section → compact experience timeline → education + spoken languages → contact.
2. **Restructure `src/data`** into a projects-first model (it stays the single source of truth).
3. **Ignore Sanity entirely**: remove every Sanity import/fetch from `src/`; do **NOT** delete or modify the `sanity/` folder, `sanity.config.ts`, `sanity.cli.ts`, the `sanity:*` package scripts, or sanity deps.
4. **Keep the 3D running-cat scene** (`src/components/RunningCatScene.tsx`) somewhere tasteful.
5. **`/cv` page completely untouched** — the user needs its print/PDF output. Its data contracts are frozen (see Phase 2).
6. **Drop `/experiment(s)`** route and its components.
7. **Visual direction: A — "Schematic"** (chosen from three rendered sketches; specs below). Keep the existing dark/light toggle working.

## Visual direction — "Schematic" (drafting-sheet light)

The site presents itself the way its artifacts do: as an engineering drawing sheet. Project metadata rendered as a drawing **title block** (bordered table: ROLE / COMPANY / PERIOD / STATUS), figure plates with captions (`FIG 1.0 — …`), hairline rules, red registration-mark corner details, a `DWG 01/04` sheet header per case study (this numbered system is deliberate brand voice — projects are literally numbered drawings), optional ruler-tick details. Brand voice: engineered, candid, playful-precise.

Tokens (light default):
- `--color-surface`: paper white `oklch(0.985 0 0)`
- `--color-ink`: `oklch(0.21 0.01 260)`; muted `oklch(0.42 0.01 260)`
- `--color-accent`: drafting-pen red `oklch(0.55 0.21 27)` — used Committed (~30%): title-block keys, active states, links, primary CTA, highlighted diagram nodes
- `--color-line`: `oklch(0.87 0.005 260)`; strong structural borders use ink at 1.5px
- Dark mode: surface deep graphite `oklch(0.2 0.01 260)`, ink `oklch(0.96 0.005 260)`, accent lifted to `oklch(0.66 0.19 27)`
- Fonts: **Archivo** (variable, `wdth` axis; display = font-stretch 125%, weight 800–900, uppercase for h1; normal width for body) + **Sometype Mono** (400/500/700) for all data labels: periods, tech chips, artifact names, statuses, table keys, captions. Both on Google Fonts — self-host woff2 in `public/fonts/`, preload display face in `index.html`.
- Buttons/chips: square corners, 1.5px ink borders; primary CTA = solid red block with white mono text.
- Body text ≥4.5:1 contrast in both themes. No gradients, no glassmorphism, no shadows (borders carry structure).

A validated sketch exists: hero ("WORK YOU CAN INSPECT" in Archivo Expanded 900) + Konnektaro case study with title-block table right, narrative left, SVG architecture figure in a bordered plate with red corner marks. Reproduce that composition language.

Alternates B ("Control room" dark/amber) and C ("Ultramarine drench") were rejected; don't use them, but keep the token layer swappable (that's its job).

## Current-state facts (verified)

- Routes in `src/App.tsx` (lazy): `/` → `src/pages/PortfolioDesign.tsx`, `/projects` → `src/pages/ProjectsPage.tsx`, `/cv` → `src/pages/CvPage.tsx`, `/experiment(s)` → `src/pages/ExperimentPage.tsx`, `*` → NotFoundPage.
- Tailwind 4 is CSS-first: config lives in `src/index.css` (`@import 'tailwindcss'`); `tailwind.config.js` is dead under v4 → delete it.
- Sanity is referenced by exactly 3 src files: `src/hooks/usePortfolioPage.ts` (getProfile), `src/pages/PortfolioDesign.tsx` (getProfile, getLanguages), `src/pages/ProjectsPage.tsx` (getArtifactsFromCms). All already have JSON fallbacks.
- `src/components/ProjectArtifacts.tsx` already supports `embedded?: boolean` and `variant?: 'default' | 'timeline'` props and owns the image/yaml/external dialog logic (`ImageViewerDialog`, `YamlViewerDialog`) — reuse it inside case studies.
- `framer-motion` + `gsap` are installed; currently only used by the soon-deleted `ExperimentBackground.tsx`.
- Component dependency notes: `Hero.tsx` lazily imports `Scene.tsx` (dies with Hero). `RunningCatScene.tsx` imports `Model.tsx` → `Particles.tsx` (all three survive). `Services.tsx`, `DividedContentSection.tsx`, `src/hooks/useSEO.ts` are already dead code.
- `public/sitemap.xml` is already broken (lists phantom `/home`, `/home/projects`, `/version2`).
- `public/artifacts/iomoto-app-architecture.drawio.png` exists but is unused by `projectArtifacts.json`.
- `pnpm build` runs eslint with `--max-warnings 0` — any unused import fails the build.

## Implementation phases (in order; compiles at every step)

### Phase 1 — Token layer
`src/index.css`: add `@theme` block with semantic OKLCH tokens (`--color-surface`, `--color-surface-raised`, `--color-surface-sunken`, `--color-ink`, `--color-ink-muted`, `--color-ink-subtle`, `--color-accent`, `--color-accent-strong`, `--color-accent-soft`, `--color-line`, `--color-line-strong`, `--font-display`, `--font-body`, `--font-mono`, `--radius-card`, `--spacing-section`) using the Schematic values above. Components consume them as `bg-surface text-ink border-line font-mono` etc.
**Critical Tailwind v4 gotcha**: dark-mode overrides go in `@layer base { .dark { --color-surface: …; } }` — *outside* `@theme`, or v4 mints junk utilities. The existing `@variant dark` + ThemeContext class toggle then re-skins everything with zero `dark:` prefixes on tokenized colors.
Add `@font-face` for Archivo + Sometype Mono (self-hosted `public/fonts/*.woff2`; download from Google Fonts), preload the display face in `index.html`. Delete `tailwind.config.js`. Untouched pages (`/cv`, NotFound) keep their literal `slate-*/orange-*` classes — the default palette coexists with `@theme` additions.

### Phase 2 — Data restructure
**New `src/data/projects.json`** — display-ordered array:
```jsonc
{
  "id": "konnektaro",            // slug; home section anchor = #project-konnektaro
  "name": "Konnektaro",
  "shortTitle": "Konnektaro",
  "tagline": "Real-time learning & networking PWA",
  "narrative": ["paragraph 1", "paragraph 2"],
  "role": "Frontend Engineer",
  "company": "Konnektaro",
  "companyUrl": "https://…",
  "period": "May 2025 – Dec 2025",
  "techStack": ["React TS", "Next.js", "…"],
  "links": [{ "title": "Live site", "url": "https://…", "kind": "live" }],
  "heroImage": { "src": "/artifacts/….png", "alt": "…" },
  "artifacts": [ /* Artifact objects migrated verbatim from projectArtifacts.json */ ],
  "jobRef": "konnektaro"         // optional; pairs with jobs.json projectId
}
```
Four entries (author narrative/role/period from `jobs.json` + `projectArtifacts.json` content):
1. `konnektaro` ← Konnektaro job + `konnektaro` artifact group
2. `fleet-manager` ← iomoto (ZF) job; promote unused `public/artifacts/iomoto-app-architecture.drawio.png` as its hero/imageDialog artifact
3. `tenant-res` ← `tenant-app` artifact group (personal project; role "Founder / Full-stack")
4. `portfolio` ← `cv-app-architecture` group (this site)

Types (`src/types/index.ts`): add `Project`, `ProjectLink { title; url; kind?: 'live'|'repo'|'figma'|'store'|'other' }`, `ProjectImage { src; alt }`; add optional `projectId?: string` to `Job`. Reuse `Artifact`/`ArtifactKind`/`ArtifactStatus` unchanged.
`jobs.json`: **additive only** — add `projectId` to the two matching entries (Konnektaro, iomoto Frontend). Never rename/remove existing keys.
**Frozen for `/cv`**: `experienceCV.json`, `services.json`, `education.json`, `languages.json`, `profile.json` — do not change their shapes at all.

### Phase 3 — Sanity decoupling
- `src/hooks/usePortfolioPage.ts`: remove the `getProfile` import and the `usePortfolioProfile` hook; keep `useTrackPortfolioPageLoad` and `usePortfolioStructuredData`.
- The other two Sanity consumers are replaced/deleted in Phase 5.
- Gate: `grep -ri "sanity" src/` → zero hits. `sanity/` folder and configs stay untouched.

### Phase 4 — New components (token-only styling, Schematic language)
Under `src/components/home/` and `src/components/motion/`:
- `motion/Reveal.tsx` — single motion primitive: framer-motion `whileInView` fade + small translate, `viewport={{ once: true }}`; uses `useReducedMotion()` → render static. ALL reveals go through it.
- `home/HomeHero.tsx` — from `profile.json`; big Archivo-Expanded uppercase headline, mono status line, red CTA to `#projects`, CV (PDF) link. No three.js here.
- `home/ProjectCaseStudy.tsx` — the core unit. Props `{ project: Project; index: number }`. `id="project-{id}"` + `scroll-mt`. `DWG 0n/04` mono sheet header; title-block table (ROLE/COMPANY/PERIOD/STATUS); name + tagline; narrative; tech chips (mono, 1.5px ink borders); hero visual in a figure plate (red corner registration marks, `FIG` caption, opens `ImageViewerDialog`); links; `<ProjectArtifacts artifacts={project.artifacts} embedded variant="timeline" />`. Alternate composition by `index % 2`.
- `home/ProjectRail.tsx` — sticky scroll-spy rail of `shortTitle`s (IntersectionObserver; port `activeProjectId` logic from `ProjectsPage.tsx` before deleting it). Desktop only.
- `home/ExperienceTimeline.tsx` — compact rows from `jobs.json` (mono period, title, company, condensed chips); rows with `projectId` link to `#project-{id}` ("view drawing ↑").
- `home/CredentialsSection.tsx` — education + spoken languages, compact two-column.
- `home/SectionHeading.tsx` — one shared heading idiom (no repeated eyebrow labels above every section).

Reused unchanged: `ImageViewerDialog`, `YamlViewerDialog`, `ProjectArtifacts` (restyle to tokens), `RunningCatScene` (+`Model`, `Particles`) as a lazy scroll interlude between last case study and the timeline — style its ground as a drawn line on the sheet; `SEO`, `DarkModeToggle`, `ThemeContext`, `ErrorBoundary`, `Contact`/`ContactPopup` (token restyle ok), `components/cv/*` (frozen).
`Navigation.tsx`: links → Home, Projects (`/#projects`), Experience (`/#experience`), CV.PDF; delete the dead `variant='experiment'` branch; restyle to tokens.

### Phase 5 — Page assembly, routing, SEO
- New `src/pages/HomePage.tsx` (replaces `PortfolioDesign.tsx`): static JSON imports only, no fetch state. Order: Navigation → HomeHero → `#projects` (ProjectRail + 4× ProjectCaseStudy) → RunningCatScene (lazy, Suspense + fixed-height placeholder) → `#experience` ExperienceTimeline → CredentialsSection → Contact. Keep `useTrackPortfolioPageLoad`.
- New `src/hooks/useScrollToHash.ts` — react-router does NOT scroll to hashes; **load-bearing** for the `/projects` redirect and nav anchors. `scrollIntoView({ behavior: prefers-reduced-motion ? 'auto' : 'smooth' })` on mount + hash change.
- `src/App.tsx`: `/` → HomePage; `/projects` → `<Navigate to="/#projects" replace />`; `/cv` untouched; remove `/experiment(s)` routes + lazy import (they fall through to NotFound).
- SEO: extend `usePortfolioStructuredData` to emit one `CreativeWork` per project via the existing `generateProjectSchema` in `src/utils/seoStructuredData.ts`; update `SEO.tsx` default title/description to projects-first copy; rewrite `public/sitemap.xml` to exactly `/` (1.0) and `/cv` (0.6); refresh meta/OG descriptions in `index.html`.

### Phase 6 — Cleanup
Delete: `src/pages/ExperimentPage.tsx`, `src/pages/ProjectsPage.tsx`, `src/pages/PortfolioDesign.tsx`, `src/components/ExperimentBackground.tsx`, `src/components/ExperimentHeroIntro.tsx`, `src/components/Hero.tsx`, `src/components/Scene.tsx`, `src/components/Experience.tsx`, `src/components/Education.tsx`, `src/components/Languages.tsx`, `src/components/Services.tsx`, `src/components/DividedContentSection.tsx`, `src/hooks/useSEO.ts`, `src/data/projectArtifacts.json`, `tailwind.config.js`.
Types: remove `ProjectArtifactsGroup`; keep `Service` (CvPage uses it).
`package.json`: remove `styled-components` only (unused in src; it's a peer of sanity v3 — pnpm 10 auto-installs peers, re-add if `pnpm sanity:dev` complains). Keep gsap, swagger-ui-react, all sanity deps. `pnpm install`.
Sweep: `grep -rn "Experiment\|ProjectsPage\|PortfolioDesign\|projectArtifacts\|styled-components" src/` → zero hits.

## Verification (run all)

1. `pnpm lint` clean.
2. `pnpm build` — then check `build/assets/`: three.js and swagger-ui must NOT be in the entry chunk. If `swagger-ui.css` lands in the home chunk, `React.lazy` the `YamlViewerDialog` import inside `ProjectArtifacts.tsx`.
3. `pnpm dev` + browser pass at 375 / 768 / 1440 px, light AND dark:
   - `/`: hero, 4 case studies (title blocks, figure plates, working dialogs: image zoom, swagger yaml, external confirm), cat interlude animates on scroll, timeline anchors jump to case studies, contact popup, dark toggle re-skins everything, headings don't overflow at 375px.
   - `/projects` redirects to `/#projects` and scrolls there; `/experiment` → 404; `/cv` → **pixel-identical to pre-refactor** (print preview Ctrl+P diff; PDF nav link works).
   - Emulate `prefers-reduced-motion: reduce`: all content visible, no translate animations, instant hash scroll.
   - Body text contrast ≥4.5:1 both themes.
4. `pnpm preview` (serves `build/`, what Firebase hosts): deep-load `/cv` and `/projects` through the SPA rewrite.
5. View source: JSON-LD includes Person, WebSite, 4× CreativeWork, WorkExperience.

## Risks / guardrails

- **Print CV regression** is the #1 risk: only `jobs.json` may change, additively. Print-preview diff is the gate.
- **Hash scroll**: without `useScrollToHash` the `/projects` redirect looks broken.
- **Tailwind v4**: dark token overrides outside `@theme` (see Phase 1) or junk utilities get generated.
- **Firebase**: don't touch `firebase.json` or Vite `outDir`; `public/fonts/` deploys automatically.
- Design bans: no gradient text, no glassmorphism, no side-stripe borders, no identical card grids, no eyebrow labels above every section. The `DWG` numbering is the one deliberate numbered system; don't add others.
