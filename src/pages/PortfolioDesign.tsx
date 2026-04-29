import React, { Suspense, useEffect, useState } from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import { Profile, Job, Education, Language } from '../types'
import SEO from '../components/SEO'
import { trackMetric } from '../utils/sentry'
import { getProfile } from '../lib/sanity/profile'
import { getLanguages } from '../lib/sanity/language'
import { usePortfolioStructuredData } from '../hooks/usePortfolioPage'

// Lazy load components for code splitting
const Navigation = React.lazy(() => import('../components/Navigation'))
const Hero = React.lazy(() => import('../components/Hero'))
const Experience = React.lazy(() => import('../components/Experience'))
const EducationSection = React.lazy(() => import('../components/Education'))
const Languages = React.lazy(() => import('../components/Languages.tsx'))
const Contact = React.lazy(() => import('../components/Contact'))
const ContactPopup = React.lazy(() => import('../components/ContactPopup'))

// Import JSON data
import profileData from '../data/profile.json'
import jobsData from '../data/jobs.json'
import educationData from '../data/education.json'
import languagesData from '../data/languages.json'

const PortfolioDesign: React.FC = () => {
  const profileFallback = profileData as Profile
  const [profile, setProfile] = useState<Profile>(profileFallback)
  const jobs = jobsData as Job[]
  const education = educationData as Education[]

  const languagesFallback = languagesData as Language[]
  const [languages, setLanguages] = useState<Language[]>(languagesFallback)

  const structuredData = usePortfolioStructuredData({
    profile,
    jobs,
    education,
  })

  const breadcrumbs = [{ name: 'Home', url: 'https://juliandiaz.web.app/' }]

  // Track page load
  useEffect(() => {
    trackMetric('page_load', {
      page: 'portfolio',
      timestamp: Date.now(),
    })
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      const cmsProfile = await getProfile(profileFallback)
      if (isMounted) {
        setProfile(cmsProfile)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [profileFallback])

  useEffect(() => {
    let isMounted = true

    const loadLanguages = async () => {
      const cmsLanguages = await getLanguages(languagesFallback)
      if (isMounted) {
        setLanguages(cmsLanguages)
      }
    }

    loadLanguages()

    return () => {
      isMounted = false
    }
  }, [languagesFallback])

  return (
    <ThemeProvider>
      <SEO
        title={`${profile.firstName} ${profile.lastName} - ${profile.title}`}
        description={profile.bio}
        keywords="Frontend Engineer, Web Developer, React, TypeScript, JavaScript, Berlin, Full Stack Developer, Frontend Developer, Julian Diaz, Next.js, Node.js, Mobile Development"
        author={`${profile.firstName} ${profile.lastName}`}
        ogUrl={profile.website}
        canonicalUrl={profile.website}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-lg">Loading components...</div>
            </div>
          }
        >
          <Navigation profile={profile} />
          <Hero profile={profile} />
          <Experience jobs={jobs} />
          <EducationSection education={education} />
          <Languages languages={languages} />
          <Contact profile={profile} />
          <ContactPopup />
        </Suspense>
      </div>
    </ThemeProvider>
  )
}

export default PortfolioDesign
