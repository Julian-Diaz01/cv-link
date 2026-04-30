import React, { Suspense, useEffect, useState } from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import { Profile, ProjectArtifactsGroup } from '../types'
import SEO from '../components/SEO'
import { trackMetric } from '../utils/sentry'

import profileData from '../data/profile.json'
import artifactsData from '../data/projectArtifacts.json'

const Navigation = React.lazy(() => import('../components/Navigation'))
const ProjectArtifacts = React.lazy(
  () => import('../components/ProjectArtifacts'),
)

const profile = profileData as Profile
const artifactGroups = artifactsData as ProjectArtifactsGroup[]
const projectNames = artifactGroups.map((group) => group.projectName)
const getProjectSectionId = (projectName: string) =>
  projectName.toLowerCase().replace(/\s+/g, '-')

const ProjectsPage: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string>(
    artifactGroups[0] ? getProjectSectionId(artifactGroups[0].projectName) : '',
  )

  useEffect(() => {
    trackMetric('page_load', {
      page: 'projects',
      timestamp: Date.now(),
    })
  }, [])

  useEffect(() => {
    const projectIds = artifactGroups.map((group) =>
      getProjectSectionId(group.projectName),
    )
    const observedSections = projectIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (!observedSections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries[0]?.target.id) {
          setActiveProjectId(visibleEntries[0].target.id)
        }
      },
      {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: [0.15, 0.3, 0.5, 0.7],
      },
    )

    observedSections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <ThemeProvider>
      <SEO
        title={`Projects & Experiments - ${profile.firstName} ${profile.lastName}`}
        description="Projects, experiments, and build artifacts: diagrams, flows, and live products."
        keywords="Projects, Experiments, Build Artifacts, Web Development, Julian Diaz"
        author={`${profile.firstName} ${profile.lastName}`}
        ogUrl={`${profile.website}projects`}
        canonicalUrl={`${profile.website}projects`}
        breadcrumbs={[
          { name: 'Home', url: profile.website },
          { name: 'Projects & Experiments', url: `${profile.website}projects` },
        ]}
      />
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-white">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <div className="text-lg">Loading projects...</div>
            </div>
          }
        >
          <Navigation profile={profile} />
          <main className="pt-20 sm:pt-24">
            <section className="relative isolate">
              <div className="absolute inset-0 bg-[url('/artifacts/cv-app-architecture.drawio.png')] bg-cover bg-center opacity-15" />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 to-orange-50/90 dark:from-slate-900/90 dark:to-slate-800/90" />
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
                  <aside className="lg:sticky lg:top-28 h-fit">
                    <p className="text-xs tracking-[0.25em] uppercase text-slate-600 mb-4 dark:text-slate-300/80">
                      Time mode
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                      Projects
                    </h2>
                    <p className="mt-4 text-sm text-slate-700 leading-relaxed dark:text-slate-200/80">
                      A view of architecture, wireframes, APIs, and shipped
                      experiments.
                    </p>
                    <ol className="mt-8 space-y-3 border-l border-slate-300 pl-4 dark:border-white/20">
                      {projectNames.map((projectName, index) => (
                        <li key={projectName} className="text-sm">
                          {(() => {
                            const sectionId = getProjectSectionId(projectName)
                            const isActive = activeProjectId === sectionId

                            return (
                              <a
                                href={`#${sectionId}`}
                                onClick={() => setActiveProjectId(sectionId)}
                                className={`transition-colors duration-200 ${
                                  isActive
                                    ? 'text-slate-900 font-semibold dark:text-white'
                                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-200/75 dark:hover:text-white'
                                }`}
                                aria-current={isActive ? 'true' : undefined}
                              >
                                <span
                                  className={`mr-2 ${
                                    isActive
                                      ? 'text-orange-600 dark:text-orange-400'
                                      : 'text-slate-500 dark:text-slate-400'
                                  }`}
                                >
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                {projectName}
                              </a>
                            )
                          })()}
                        </li>
                      ))}
                    </ol>
                  </aside>

                  <div className="space-y-12 sm:space-y-16">
                    {artifactGroups.map((group, index) => (
                      <section
                        key={group.id}
                        id={getProjectSectionId(group.projectName)}
                        aria-label={group.projectName}
                        className="grid grid-cols-1 lg:grid-cols-[72px_1fr] gap-4 sm:gap-6 scroll-mt-28"
                      >
                        <div className="hidden lg:flex flex-col items-center pt-2">
                          <span className="h-4 w-4 rounded-full bg-orange-500/80 shadow-[0_0_0_6px_rgba(251,146,60,0.2)] dark:bg-orange-400/80" />
                          <span className="mt-3 text-xs tracking-wide text-slate-600 text-center dark:text-slate-300">
                            {group.shortTitle}
                          </span>
                          <span className="mt-2 h-full w-px bg-slate-300 dark:bg-white/20" />
                        </div>

                        <article className="rounded-2xl border border-slate-300 bg-white/80 backdrop-blur-md p-5 sm:p-7 dark:border-white/20 dark:bg-slate-900/55">
                          <div className="mb-5 sm:mb-6">
                            <p className="text-xs tracking-[0.2em] uppercase text-slate-600 mb-2 dark:text-slate-300/80">
                              Project {String(index + 1).padStart(2, '0')}
                            </p>
                            <h3 className="text-2xl sm:text-3xl font-semibold tracking-wide">
                              {group.projectName}
                            </h3>
                            <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-700 dark:text-slate-200/85">
                              {group.description}
                            </p>
                          </div>

                          <ProjectArtifacts
                            artifacts={group.artifacts}
                            embedded
                            variant="timeline"
                            sectionId={getProjectSectionId(group.projectName)}
                          />
                        </article>
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </Suspense>
      </div>
    </ThemeProvider>
  )
}

export default ProjectsPage
