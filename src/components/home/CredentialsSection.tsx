import React from 'react'
import { Education, Language } from '../../types'
import SectionHeading from './SectionHeading'

interface CredentialsSectionProps {
  education: Education[]
  languages: Language[]
}

const CredentialsSection: React.FC<CredentialsSectionProps> = ({
  education,
  languages,
}) => (
  <section className="py-section max-w-7xl mx-auto px-6 md:px-12 border-b border-line">
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <SectionHeading label="Education" />
        <div className="space-y-6">
          {education.map((edu, i) => (
            <div
              key={i}
              className="border-b border-line pb-6 last:border-b-0 last:pb-0"
            >
              <span className="font-mono text-xs text-ink-subtle block mb-1">
                {edu.monthYearRange}
              </span>
              <a
                href={edu.cardLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-bold text-ink hover:text-accent transition-colors block mb-0.5 leading-snug"
              >
                {edu.title}
              </a>
              <span className="font-mono text-xs text-ink-muted block mb-3">
                {edu.subTitle}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {edu.chips.map((chip) => (
                  <span
                    key={chip}
                    className="font-mono text-[11px] border border-line text-ink-subtle px-1.5 py-0.5"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading label="Languages" />
        <div className="space-y-4">
          {languages.map((lang, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-line pb-4 last:border-b-0 last:pb-0"
            >
              <div>
                <span className="font-display font-bold text-ink block leading-snug">
                  {lang.name}
                </span>
                <span className="font-mono text-xs text-ink-muted">
                  {lang.description}
                </span>
              </div>
              <div className="flex gap-1.5">
                {lang.chips.map((chip) => (
                  <span
                    key={chip}
                    className="font-mono text-xs bg-accent-soft text-accent-strong px-2 py-0.5"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default CredentialsSection
