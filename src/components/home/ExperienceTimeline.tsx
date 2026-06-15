import React from 'react'
import { Job } from '../../types'
import SectionHeading from './SectionHeading'

interface ExperienceTimelineProps {
  jobs: Job[]
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ jobs }) => (
  <section
    id="experience"
    className="py-section max-w-7xl mx-auto px-6 md:px-12 scroll-mt-20"
  >
    <SectionHeading label="Experience" id="experience-heading" />
    <div>
      {jobs.map((job, index) => (
        <div
          key={index}
          className="border-b border-line py-5 flex flex-col md:flex-row md:items-start gap-2 md:gap-8"
        >
          <span className="font-mono text-xs text-ink-subtle shrink-0 md:w-52">
            {job.monthYearRange}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
              <span className="font-display font-bold text-ink text-base">
                {job.title}
              </span>
              <span className="font-mono text-xs text-ink-muted">
                — {job.subTitle}
              </span>
              {job.projectId && (
                <a
                  href={`#project-${job.projectId}`}
                  className="font-mono text-xs text-accent hover:text-accent-strong transition-colors"
                >
                  view drawing ↑
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.chips.map((chip) => (
                <span
                  key={chip}
                  className="font-mono text-[11px] border border-ink-subtle text-ink-muted px-1.5 py-0.5"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
)

export default ExperienceTimeline
