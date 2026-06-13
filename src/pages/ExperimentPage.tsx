import React, { Suspense } from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import SEO from '../components/SEO'
import { Profile } from '../types'
import profileData from '../data/profile.json'
import ExperimentBackground from '../components/ExperimentBackground'
import ExperimentHeroIntro from '../components/ExperimentHeroIntro'

const Navigation = React.lazy(() => import('../components/Navigation'))

const profile = profileData as Profile

const ExperimentPage: React.FC = () => {
  return (
    <ThemeProvider>
      <SEO
        title={`Experiment - ${profile.firstName} ${profile.lastName}`}
        description="A frame-by-frame scroll animation experiment using the new two-part sequence."
        keywords="Scroll animation, experiment, frontend animation, Julian Diaz"
        author={`${profile.firstName} ${profile.lastName}`}
        ogUrl={`${profile.website}experiment`}
        canonicalUrl={`${profile.website}experiment`}
        breadcrumbs={[
          { name: 'Home', url: profile.website },
          { name: 'Experiment', url: `${profile.website}experiment` },
        ]}
      />
      <div className="relative min-h-[320vh] bg-slate-950 text-slate-100">
        <ExperimentBackground />

        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-lg">Loading...</div>
            </div>
          }
        >
          <Navigation profile={profile} />

          <main className="relative min-h-screen pt-20 sm:pt-24">
            <ExperimentHeroIntro />
            <section className="relative">
              <div className="h-[220vh]" />
            </section>
          </main>
        </Suspense>

        <style>
          {`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translate3d(0, 28px, 0);
              }
              to {
                opacity: 1;
                transform: translate3d(0, 0, 0);
              }
            }
            @keyframes pulseSlow {
              0%, 100% {
                opacity: 0.5;
                transform: scaleX(0.96);
              }
              50% {
                opacity: 1;
                transform: scaleX(1.04);
              }
            }
            .animate-fade-in-up {
              animation: fadeInUp 850ms cubic-bezier(0.2, 0.65, 0.2, 1) both;
            }
            .animate-pulse-slow {
              animation: pulseSlow 2.6s ease-in-out infinite;
            }
          `}
        </style>
      </div>
    </ThemeProvider>
  )
}

export default ExperimentPage
