import React, { Suspense, useEffect } from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import { Profile, Artifact } from '../types'
import SEO from '../components/SEO'
import { trackMetric } from '../utils/sentry'
import DividedContentSection from '../components/DividedContentSection'

import profileData from '../data/profile.json'
import artifactsData from '../data/projectArtifacts.json'

const Navigation = React.lazy(() => import('../components/Navigation'))
const ProjectArtifacts = React.lazy(
  () => import('../components/ProjectArtifacts'),
)

const profile = profileData as Profile
const artifacts = artifactsData as Artifact[]
const groupedArtifacts = artifacts.reduce<Record<string, Artifact[]>>(
  (acc, artifact) => {
    if (!acc[artifact.projectName]) {
      acc[artifact.projectName] = []
    }

    acc[artifact.projectName].push(artifact)
    return acc
  },
  {},
)

const ProjectsPage: React.FC = () => {
  useEffect(() => {
    trackMetric('page_load', {
      page: 'projects',
      timestamp: Date.now(),
    })
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-lg">Loading...</div>
            </div>
          }
        >
          <Navigation profile={profile} />
          <main className="pt-20 sm:pt-24">
            <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="mb-8 sm:mb-12">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                    <span className="text-orange-500 dark:text-orange-400">
                      Projects & Experiments
                    </span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl">
                    Snapshots of the work: diagrams, flows, and the live product
                    when it is available.
                  </p>
                </div>

                {Object.entries(groupedArtifacts).map(
                  ([projectName, projectArtifacts]) => (
                    <DividedContentSection
                      key={projectName}
                      title={projectName}
                    >
                      <ProjectArtifacts
                        artifacts={projectArtifacts}
                        embedded
                        sectionId={projectName
                          .toLowerCase()
                          .replace(/\s+/g, '-')}
                      />
                    </DividedContentSection>
                  ),
                )}
              </div>
            </section>
          </main>
        </Suspense>
      </div>
    </ThemeProvider>
  )
}

export default ProjectsPage
