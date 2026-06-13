import React, { useState } from 'react'
import { Project } from '../../types'
import ProjectArtifacts from '../ProjectArtifacts'
import ImageViewerDialog from '../ImageViewerDialog'
import Reveal from '../motion/Reveal'

interface ProjectCaseStudyProps {
  project: Project
  index: number
  total: number
}

const statusFromPeriod = (period: string): string => {
  const lower = period.toLowerCase()
  if (lower.includes('present')) return 'Active'
  return 'Complete'
}

const RegistrationMark = () => (
  <span
    className="select-none text-accent font-mono text-xs leading-none"
    aria-hidden
  >
    +
  </span>
)

const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({
  project,
  index,
  total,
}) => {
  const [imageOpen, setImageOpen] = useState(false)
  const isOdd = index % 2 !== 0
  const dwgLabel = `DWG ${String(index + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`
  const status = statusFromPeriod(project.period)

  const titleBlock = (
    <table className="w-full border border-line-strong text-left">
      <tbody>
        {(
          [
            ['ROLE', project.role],
            ['COMPANY', project.company],
            ['PERIOD', project.period],
            ['STATUS', status],
          ] as [string, string][]
        ).map(([key, value]) => (
          <tr key={key} className="border-b border-line last:border-b-0">
            <td className="font-mono text-[11px] text-accent font-medium px-3 py-2 border-r border-line whitespace-nowrap w-20">
              {key}
            </td>
            <td className="font-mono text-[11px] text-ink px-3 py-2 leading-snug">
              {key === 'COMPANY' && project.companyUrl ? (
                <a
                  href={project.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {value}
                </a>
              ) : (
                value
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const figurePlate = (
    <div className="border border-line-strong relative">
      <div className="absolute top-2 left-2">
        <RegistrationMark />
      </div>
      <div className="absolute top-2 right-2">
        <RegistrationMark />
      </div>
      <div className="absolute bottom-8 left-2">
        <RegistrationMark />
      </div>
      <div className="absolute bottom-8 right-2">
        <RegistrationMark />
      </div>
      <button
        type="button"
        onClick={() => setImageOpen(true)}
        className="block w-full aspect-[4/3] bg-surface-sunken cursor-zoom-in overflow-hidden"
        aria-label={`Open ${project.heroImage.alt} in full view`}
      >
        <img
          src={project.heroImage.src}
          alt={project.heroImage.alt}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </button>
      <div className="border-t border-line px-4 py-2 flex items-center gap-3">
        <span className="font-mono text-[11px] text-accent shrink-0">
          FIG {index + 1}.0
        </span>
        <span className="font-mono text-[11px] text-ink-muted truncate">
          — {project.heroImage.alt}
        </span>
      </div>
    </div>
  )

  const rightPanel = (
    <div className="flex flex-col gap-6 w-full lg:w-[44%] shrink-0">
      {titleBlock}
      {figurePlate}
    </div>
  )

  const leftPanel = (
    <div className="flex-1 min-w-0">
      <Reveal>
        <h2
          className="font-display font-black text-ink leading-[0.9] mb-3"
          style={{
            fontStretch: '125%',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          }}
        >
          {project.name}
        </h2>
      </Reveal>
      <p className="font-mono text-xs text-ink-muted mb-6 uppercase tracking-wide">
        {project.tagline}
      </p>

      <div className="space-y-4 mb-8">
        {project.narrative.map((para, i) => (
          <p key={i} className="font-body text-ink-muted leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-[11px] border border-ink-subtle text-ink-muted px-2 py-1"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.links.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs bg-accent text-white border border-accent px-4 py-2 hover:bg-accent-strong transition-colors"
            >
              {link.title} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <section
      id={`project-${project.id}`}
      className="py-section border-b border-line scroll-mt-20"
    >
      {/* DWG header */}
      <div className="flex items-center gap-4 mb-10">
        <span className="font-mono text-[11px] text-ink-subtle shrink-0">
          {dwgLabel}
        </span>
        <div className="flex-1 border-t border-line" />
        <span className="font-mono text-[11px] text-ink-subtle uppercase shrink-0">
          {project.id}
        </span>
      </div>

      {/* Main two-column layout — alternating on desktop */}
      <div
        className={`flex flex-col gap-8 lg:flex-row ${isOdd ? 'lg:flex-row-reverse' : ''}`}
      >
        {leftPanel}
        {rightPanel}
      </div>

      {/* Supporting artifacts */}
      {project.artifacts.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[10px] text-ink-subtle uppercase tracking-widest shrink-0">
              Supporting artifacts
            </span>
            <div className="flex-1 border-t border-line" />
          </div>
          <ProjectArtifacts
            artifacts={project.artifacts}
            embedded
            variant="timeline"
          />
        </div>
      )}

      <ImageViewerDialog
        isOpen={imageOpen}
        imagePath={project.heroImage.src}
        title={project.heroImage.alt}
        onClose={() => setImageOpen(false)}
      />
    </section>
  )
}

export default ProjectCaseStudy
