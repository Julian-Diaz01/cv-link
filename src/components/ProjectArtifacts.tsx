import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink } from 'lucide-react'
import { Artifact, ArtifactStatus } from '../types'
import YamlViewerDialog from './YamlViewerDialog'
import ImageViewerDialog from './ImageViewerDialog'

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
            className={
              variant === 'timeline'
                ? 'group relative overflow-hidden rounded-xl border border-slate-300 bg-white/90 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-slate-400 hover:bg-white dark:border-white/20 dark:bg-white/5 dark:hover:border-white/40 dark:hover:bg-white/10'
                : 'group relative bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer'
            }
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
            <div
              className={
                variant === 'timeline'
                  ? 'aspect-[16/9] w-full bg-slate-200 dark:bg-slate-900/40'
                  : 'aspect-[16/9] w-full bg-slate-200 dark:bg-slate-700'
              }
            >
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
                <h3
                  className={
                    variant === 'timeline'
                      ? 'text-base sm:text-lg font-semibold leading-tight text-slate-900 dark:text-white'
                      : 'text-lg sm:text-xl font-semibold leading-tight'
                  }
                >
                  {artifact.title}
                </h3>
                {statusLabel ? (
                  <span
                    className={
                      variant === 'timeline'
                        ? 'whitespace-nowrap rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-700 dark:border-white/30 dark:text-slate-200'
                        : 'whitespace-nowrap rounded-full border border-slate-300 dark:border-slate-600 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300'
                    }
                  >
                    {statusLabel}
                  </span>
                ) : null}
              </div>

              <p
                className={
                  variant === 'timeline'
                    ? 'text-sm text-slate-700 leading-relaxed mb-4 dark:text-slate-200/85'
                    : 'text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 sm:mb-5'
                }
              >
                {artifact.description}
              </p>
              <div
                className={
                  variant === 'timeline'
                    ? 'inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-sky-700 dark:text-sky-200'
                    : 'inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400'
                }
              >
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
          className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12">
              <h2
                id={`${sectionId}-title`}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
              >
                <span className="text-orange-500 dark:text-orange-400">
                  {title}
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl">
                {description}
              </p>
            </div>
            {artifactsGrid}
          </div>
        </section>
      )}
      <YamlViewerDialog
        isOpen={Boolean(yamlDialogPath)}
        filePath={yamlDialogPath}
        title="Swagger OpenAPI YAML"
        onClose={() => setYamlDialogPath(null)}
      />
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
                className="flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-slate-300 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                onClick={(event) => event.stopPropagation()}
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Open external artifact
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    You are about to open{' '}
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {externalDialogArtifact.title}
                    </span>{' '}
                    in a new tab.
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                  {externalDialogArtifact.href}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => setExternalDialogArtifact(null)}
                  >
                    Cancel
                  </button>
                  <a
                    href={externalDialogArtifact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
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
