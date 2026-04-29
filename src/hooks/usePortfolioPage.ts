import { useEffect, useMemo, useState } from 'react'
import { Education, Job, Profile } from '../types'
import {
  generateComprehensiveProfileSchema,
  generateWorkExperienceSchema,
  generateEducationSchema,
  generateFAQSchema,
} from '../utils/seoStructuredData'
import { trackMetric } from '../utils/sentry'
import { getProfile } from '../lib/sanity/profile'

export const useTrackPortfolioPageLoad = () => {
  useEffect(() => {
    trackMetric('page_load', {
      page: 'portfolio',
      timestamp: Date.now(),
    })
  }, [])
}

export const usePortfolioProfile = (profileFallback: Profile) => {
  const [profile, setProfile] = useState<Profile>(profileFallback)

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

  return profile
}

interface UsePortfolioStructuredDataProps {
  profile: Profile
  jobs: Job[]
  education: Education[]
}

export const usePortfolioStructuredData = ({
  profile,
  jobs,
  education,
}: UsePortfolioStructuredDataProps) =>
  useMemo(() => {
    const faqs = [
      {
        question: 'Who is Julian Diaz?',
        answer: `Julian Diaz is a frontend Engineer based in Berlin, Germany with ${profile.yearsOfExperience}+ years of experience in web development, specializing in React, TypeScript, Next.js, and modern web technologies.`,
      },
      {
        question: 'What technologies does Julian Diaz work with?',
        answer:
          'Julian has expertise in React, TypeScript, JavaScript, Next.js, Node.js, Express, Flutter, React Native, Firebase, MongoDB, Tailwind CSS, and various modern web development tools and frameworks.',
      },
      {
        question: 'Where is Julian Diaz located?',
        answer: `Julian is based in ${profile.location} and is available for remote work opportunities globally.`,
      },
      {
        question: 'What kind of projects has Julian worked on?',
        answer:
          'Julian has worked on diverse projects including fleet management platforms for 5000+ vehicles at ZF Group, mobile-first progressive web apps for real-time learning, educational technology solutions, and B2C automotive sales applications.',
      },
      {
        question: 'How can I contact Julian Diaz?',
        answer: 'You can reach Julian via on LinkedIn or GitHub.',
      },
    ]

    return {
      '@context': 'https://schema.org',
      '@graph': [
        generateComprehensiveProfileSchema(jobs, education),
        ...generateWorkExperienceSchema(jobs),
        ...generateEducationSchema(education),
        generateFAQSchema(faqs),
        {
          '@type': 'ItemList',
          name: 'Professional Experience',
          itemListElement: jobs.map((job, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Organization',
              name: job.subTitle,
              url: job.cardLink,
            },
          })),
        },
      ],
    }
  }, [profile, jobs, education])
