# Phase 3 Complete — Sanity Decoupling

> Handoff context for the next session. Repo: `D:\code\cv-link`.
> Phase 3 of `todo/projects-first-refactor.md` is **done**. Phases 1–3 complete.

## What was done

- `src/hooks/usePortfolioPage.ts`:
  - Removed `import { getProfile } from '../../sanity/lib/profile'`
  - Removed `usePortfolioProfile` hook (and its `useState` import)
  - Kept `useTrackPortfolioPageLoad` and `usePortfolioStructuredData` unchanged

## Remaining Sanity references in `src/`

Two files still import Sanity — they are **replaced / deleted in Phase 5**:
- `src/pages/PortfolioDesign.tsx` — imports `getProfile`, `getLanguages`
- `src/pages/ProjectsPage.tsx` — imports `getArtifactsFromCms`

`src/data/projects.json` contains the string "Sanity CMS" as a tech-stack label — that is content, not a code import, and should stay.

The Phase 3 gate (`grep -ri "sanity" src/` → zero import hits) is only fully satisfied after Phase 5 deletes those pages.

## Current phase status

| Phase | Status |
|-------|--------|
| 1 — Token layer | Done (see `phase1-complete.md`) |
| 2 — Data restructure | Done — `src/data/projects.json`, `src/types/index.ts` (Project/ProjectLink/ProjectImage), `src/data/jobs.json` (projectId on Konnektaro + iomoto) |
| 3 — Sanity decoupling | Done — `usePortfolioPage.ts` cleaned |
| 4 — New components | Not started |
| 5 — Page assembly + routing | Not started |
| 6 — Cleanup | Not started |

## Next: Phase 4 — New components

**Wait for explicit user instruction before starting.**

Files to create (all under `src/components/`):

- `src/components/motion/Reveal.tsx` — framer-motion `whileInView` fade + translate, `viewport={{ once: true }}`, `useReducedMotion()` guard -> render static if reduced motion
- `src/components/home/SectionHeading.tsx` — shared heading idiom
- `src/components/home/HomeHero.tsx` — from `profile.json`; Archivo-Expanded uppercase headline, mono status line, red CTA to `#projects`
- `src/components/home/ProjectCaseStudy.tsx` — core unit; `{ project: Project; index: number }`; DWG 0n/04 header; title-block table; narrative; tech chips; hero figure plate; `<ProjectArtifacts embedded variant="timeline" />`; alternates by `index % 2`
- `src/components/home/ProjectRail.tsx` — sticky desktop scroll-spy rail (IntersectionObserver)
- `src/components/home/ExperienceTimeline.tsx` — compact rows from `jobs.json`; rows with `projectId` link to `#project-{id}`
- `src/components/home/CredentialsSection.tsx` — education + languages two-column

Files to **restyle to tokens** (do not rename / change API):
- `src/components/Navigation.tsx` — update nav links (Home, `/#projects`, `/#experience`, CV.PDF); drop `variant='experiment'` branch; restyle to token classes
- `src/components/Contact.tsx` / `ContactPopup.tsx` — token restyle ok
- `src/components/ProjectArtifacts.tsx` — restyle to tokens (currently uses slate-* and orange-*)

## Key file paths for Phase 4 context

| File | Purpose |
|------|---------|
| `src/data/projects.json` | Source for all 4 case studies |
| `src/data/jobs.json` | Source for ExperienceTimeline (has `projectId` on 2 entries) |
| `src/data/education.json` | Source for CredentialsSection |
| `src/data/languages.json` | Source for CredentialsSection |
| `src/data/profile.json` | Source for HomeHero (name, title, bio, socialLinks) |
| `src/types/index.ts` | Project, Job, Education, Language, Artifact types all defined |
| `src/components/ProjectArtifacts.tsx` | Reuse unchanged (restyle only); supports `embedded` + `variant` props |
| `src/components/ImageViewerDialog.tsx` | Reuse in ProjectCaseStudy hero figure plate |
| `src/components/RunningCatScene.tsx` | Lazy scroll interlude between last case study and timeline |
| `src/components/DarkModeToggle.tsx` | Reuse as-is in Navigation |
| `src/context/ThemeContext.tsx` | ThemeProvider must wrap HomePage.tsx |

## Token reference (from `src/index.css` @theme)

| Token | Utility |
|-------|---------|
| `--color-surface` | `bg-surface text-surface` |
| `--color-surface-raised` | `bg-surface-raised` |
| `--color-ink` | `text-ink border-ink` |
| `--color-ink-muted` | `text-ink-muted` |
| `--color-ink-subtle` | `text-ink-subtle` |
| `--color-accent` | `text-accent bg-accent border-accent` |
| `--color-line` | `border-line` |
| `--color-line-strong` | `border-line-strong` |
| `--font-display` | `font-display` (Archivo; use `style={{ fontStretch: '125%' }}` for expanded) |
| `--font-body` | `font-body` |
| `--font-mono` | `font-mono` (Sometype Mono) |
| `--radius-card` | `rounded-card` (0px) |
| `--spacing-section` | `py-section` (6rem) |

## Pre-existing build warnings — do NOT fix

- `ExperimentBackground.tsx:165` — ref cleanup lint (component deleted in Phase 6)
- `ThemeContext.tsx:10` — react-refresh warning (keep as-is)
