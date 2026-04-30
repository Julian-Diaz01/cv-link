import React, { useState } from 'react'
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
}

const statusLabelMap: Record<ArtifactStatus, string> = {
  planned: 'Planned',
  inProgress: 'In progress',
  ready: 'Ready',
}

const ProjectArtifacts: React.FC<ProjectArtifactsProps> = ({
  artifacts,
  title = 'Build artifacts',
  description = 'Snapshots of the work: diagrams, flows, and the live product when it is available.',
  sectionId = 'artifacts',
  embedded = false,
}) => {
  const [yamlDialogPath, setYamlDialogPath] = useState<string | null>(null)
  const [imageDialogPath, setImageDialogPath] = useState<string | null>(null)

  const handleArtifactClick = (artifact: Artifact) => {
    const primaryLink = artifact.links[0]
    if (!primaryLink) return

    if (primaryLink.kind === 'yamlDialog') {
      setYamlDialogPath(primaryLink.href)
      return
    }

    if (primaryLink.kind === 'imageDialog') {
      setImageDialogPath(primaryLink.href)
      return
    }

    window.open(primaryLink.href, '_blank', 'noopener,noreferrer')
  }

  const artifactsGrid = (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {artifacts.map((artifact) => {
        const statusLabel = artifact.status
          ? statusLabelMap[artifact.status]
          : null

        return (
          <article
            key={artifact.id}
            className="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
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
            <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-700">
              <img
                alt={artifact.thumbnailAlt}
                src={artifact.thumbnailSrc}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="p-4 sm:p-6 md:p-7">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                  {artifact.title}
                </h3>
                {statusLabel ? (
                  <span className="whitespace-nowrap rounded-full border border-slate-300 dark:border-slate-600 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300">
                    {statusLabel}
                  </span>
                ) : null}
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 sm:mb-5">
                {artifact.description}
              </p>
              <div className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">
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
    </>
  )
}

export default ProjectArtifacts
