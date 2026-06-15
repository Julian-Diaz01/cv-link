import React, { Suspense } from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import {
  useTrackPortfolioPageLoad,
  usePortfolioStructuredData,
} from '../hooks/usePortfolioPage'
import { useScrollToHash } from '../hooks/useScrollToHash'
import SEO from '../components/SEO'
import Navigation from '../components/Navigation'
import HomeHero from '../components/home/HomeHero'
import ProjectCaseStudy from '../components/home/ProjectCaseStudy'
import ProjectRail from '../components/home/ProjectRail'
import ExperienceTimeline from '../components/home/ExperienceTimeline'
import CredentialsSection from '../components/home/CredentialsSection'
import Contact from '../components/Contact'
import ContactPopup from '../components/ContactPopup'

import profileData from '../data/profile.json'
import projectsData from '../data/projects.json'
import jobsData from '../data/jobs.json'
import educationData from '../data/education.json'
import languagesData from '../data/languages.json'

import type { Profile, Project, Job, Education, Language } from '../types'

const profile = profileData as unknown as Profile
const projects = projectsData as Project[]
const jobs = jobsData as Job[]
const education = educationData as Education[]
const languages = languagesData as Language[]

const RunningCatScene = React.lazy(
  () => import('../components/RunningCatScene'),
)

function HomePageInner() {
  useTrackPortfolioPageLoad()
  useScrollToHash()
  const structuredData = usePortfolioStructuredData({
    profile,
    jobs,
    education,
    projects,
  })

  return (
    <>
      <SEO
        title="Julian Diaz — Frontend Engineer"
        description="Case-study portfolio of Julian Diaz, Frontend Engineer in Berlin. Real-time PWAs, fleet platforms, and full-stack web applications — architecture diagrams and specs included."
        structuredData={structuredData}
      />
      <Navigation profile={profile} />
      <main className="bg-surface text-ink min-h-screen">
        <HomeHero profile={profile} />

        <section id="projects" className="scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-section flex gap-16">
            <ProjectRail projects={projects} />
            <div className="flex-1 min-w-0 flex flex-col gap-24">
              {projects.map((project, index) => (
                <ProjectCaseStudy
                  key={project.id}
                  project={project}
                  index={index}
                  total={projects.length}
                />
              ))}
            </div>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="h-64 border-t border-b border-line flex items-center justify-center">
              <span className="font-mono text-[10px] text-ink-subtle uppercase tracking-widest">
                Loading Scene 3D
              </span>
            </div>
          }
        >
          <RunningCatScene />
        </Suspense>

        <section id="experience" className="scroll-mt-20">
          <ExperienceTimeline jobs={jobs} />
        </section>

        <CredentialsSection education={education} languages={languages} />

        <Contact profile={profile} />
        <ContactPopup />
      </main>
    </>
  )
}

export default function HomePage() {
  return (
    <ThemeProvider>
      <HomePageInner />
    </ThemeProvider>
  )
}
