import React, { Suspense, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink } from 'lucide-react'
import { Artifact, ArtifactStatus } from '../types'
import ImageViewerDialog from './ImageViewerDialog'

const YamlViewerDialog = React.lazy(() => import('./YamlViewerDialog'))

interface ProjectArtifactsProps {
  artifacts: Artifact[]
  title?: string
  description?: string
  sectionId?: string
  embedded?: boolean
  variant?: 'default' | 'timeline'
}

const statusLabelMap: Record<ArtifactStatus, string> = {
  planned: 'Planned',
  inProgress: 'In progress',
  ready: 'Ready',
}

interface ExternalDialogArtifact {
  title: string
  href: string
}

const ProjectArtifacts: React.FC<ProjectArtifactsProps> = ({
  artifacts,
  title = 'Build artifacts',
  description = 'Snapshots of the work: diagrams, flows, and the live product when it is available.',
  sectionId = 'artifacts',
  embedded = false,
  variant = 'default',
}) => {
  const [yamlDialogPath, setYamlDialogPath] = useState<string | null>(null)
  const [imageDialogPath, setImageDialogPath] = useState<string | null>(null)
  const [externalDialogArtifact, setExternalDialogArtifact] =
    useState<ExternalDialogArtifact | null>(null)

  useEffect(() => {
    if (!externalDialogArtifact) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExternalDialogArtifact(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    const previousScrollbarGutter =
      document.documentElement.style.scrollbarGutter

    document.addEventListener('keydown', handleEscape)
    document.documentElement.style.scrollbarGutter = 'stable'
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
      document.documentElement.style.scrollbarGutter = previousScrollbarGutter
    }
  }, [externalDialogArtifact])

  const handleArtifactClick = (artifact: Artifact) => {
    if (!artifact.href) return

    if (artifact.kind === 'yamlDialog') {
      setYamlDialogPath(artifact.href)
      return
    }

    if (artifact.kind === 'imageDialog') {
      setImageDialogPath(artifact.href)
      return
    }

    setExternalDialogArtifact({
      title: artifact.title,
      href: artifact.href,
    })
  }

  const artifactsGrid = (
    <div
      className={
        variant === 'timeline'
          ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
          : 'grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3'
      }
    >
      {artifacts.map((artifact, index) => {
        const statusLabel = artifact.status
          ? statusLabelMap[artifact.status]
          : null

        return (
          <article
            key={`${artifact.title}-${index}`}
            className="group relative overflow-hidden border border-line bg-surface-raised cursor-pointer hover:border-line-strong transition-colors duration-200"
            role="button"
            tabIndex={0}
            onClick={() => handleArtifactClick(artifact)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleArtifactClick(artifact)
              }
            }}
          >
            <div className="aspect-[16/9] w-full bg-surface-sunken">
              <img
                alt={artifact.thumbnailAlt}
                src={artifact.thumbnailSrc}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div
              className={
                variant === 'timeline' ? 'p-4 sm:p-5' : 'p-4 sm:p-6 md:p-7'
              }
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-display font-bold text-ink leading-tight text-base">
                  {artifact.title}
                </h3>
                {statusLabel ? (
                  <span className="whitespace-nowrap border border-line font-mono px-2 py-0.5 text-[11px] text-ink-subtle">
                    {statusLabel}
                  </span>
                ) : null}
              </div>

              <p className="font-body text-sm text-ink-muted leading-relaxed mb-4">
                {artifact.description}
              </p>
              <div className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:text-accent-strong transition-colors">
                Open artifact
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )

  return (
    <>
      {embedded ? (
        artifactsGrid
      ) : (
        <section
          id={sectionId}
          aria-labelledby={`${sectionId}-title`}
          className="py-section bg-surface text-ink"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12">
              <h2
                id={`${sectionId}-title`}
                className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-ink mb-3 sm:mb-4"
                style={{ fontStretch: '125%' }}
              >
                <span className="text-accent">{title}</span>
              </h2>
              <p className="font-body text-ink-muted text-base sm:text-lg max-w-3xl">
                {description}
              </p>
            </div>
            {artifactsGrid}
          </div>
        </section>
      )}
      <Suspense fallback={null}>
        <YamlViewerDialog
          isOpen={Boolean(yamlDialogPath)}
          filePath={yamlDialogPath}
          title="Swagger OpenAPI YAML"
          onClose={() => setYamlDialogPath(null)}
        />
      </Suspense>
      <ImageViewerDialog
        isOpen={Boolean(imageDialogPath)}
        imagePath={imageDialogPath}
        title="draw.io ERD"
        onClose={() => setImageDialogPath(null)}
      />
      {externalDialogArtifact
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`Open external artifact: ${externalDialogArtifact.title}`}
              onClick={() => setExternalDialogArtifact(null)}
            >
              <div
                className="flex w-full max-w-lg flex-col gap-5 border border-line-strong bg-surface p-6"
                onClick={(event) => event.stopPropagation()}
              >
                <div>
                  <h3 className="font-display font-bold text-lg text-ink">
                    Open external artifact
                  </h3>
                  <p className="mt-2 font-body text-sm text-ink-muted">
                    You are about to open{' '}
                    <span className="font-medium text-ink">
                      {externalDialogArtifact.title}
                    </span>{' '}
                    in a new tab.
                  </p>
                </div>
                <div className="border border-line bg-surface-sunken p-3 font-mono text-xs text-ink-subtle">
                  {externalDialogArtifact.href}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="border border-line px-4 py-2 font-mono text-sm text-ink-muted transition hover:border-ink hover:text-ink"
                    onClick={() => setExternalDialogArtifact(null)}
                  >
                    Cancel
                  </button>
                  <a
                    href={externalDialogArtifact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent px-4 py-2 font-mono text-sm text-white transition hover:bg-accent-strong"
                    onClick={() => setExternalDialogArtifact(null)}
                  >
                    Open link
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

export default ProjectArtifacts
