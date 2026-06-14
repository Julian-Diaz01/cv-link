import React from 'react'
import { Profile } from '../../types'
import { trackMetric } from '../../utils/sentry'

interface HomeHeroProps {
  profile: Profile
}

const HomeHero: React.FC<HomeHeroProps> = ({ profile }) => (
  <header className="relative min-h-[85vh] flex flex-col justify-end pb-16 pt-32 px-6 md:px-12 max-w-7xl mx-auto">
    <div className="hidden md:block absolute top-24 right-6 text-right">
      <span className="font-mono text-[10px] text-ink-subtle tracking-widest uppercase">
        PORTFOLIO — 2025
      </span>
    </div>

    <p className="font-mono text-xs text-ink-subtle mb-6 uppercase tracking-widest">
      {profile.firstName} {profile.lastName}&ensp;—&ensp;{profile.title}
      &ensp;—&ensp;{profile.location}
    </p>

    <h1
      className="font-display font-black uppercase text-ink leading-[0.88] mb-8"
      style={{
        fontStretch: '125%',
        fontSize: 'clamp(3rem, 10vw, 9rem)',
      }}
    >
      Projects
      <br />
      made
      <br />
      BY . . . . . ME
    </h1>

    <p className="font-body text-ink-muted max-w-2xl text-lg mb-10 leading-relaxed">
      {profile.bioImpersonal}
    </p>

    <div className="flex flex-wrap gap-3 items-center">
      <a
        href="#projects"
        className="font-mono text-sm bg-accent text-white px-6 py-3 border border-accent font-medium hover:bg-accent-strong transition-colors"
      >
        VIEW DRAWINGS
      </a>
      <a
        href="/julian_diaz_cv.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm border border-ink-muted text-ink px-6 py-3 hover:border-ink transition-colors"
        onClick={() => trackMetric('cv_button_click', { location: 'hero' })}
      >
        CV.PDF
      </a>
    </div>
  </header>
)

export default HomeHero
