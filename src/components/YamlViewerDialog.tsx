import React, { Suspense, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FileCode2, ScrollText, X } from 'lucide-react'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = React.lazy(() => import('swagger-ui-react'))

interface YamlViewerDialogProps {
  isOpen: boolean
  filePath: string | null
  title?: string
  onClose: () => void
}

const YamlViewerDialog: React.FC<YamlViewerDialogProps> = ({
  isOpen,
  filePath,
  title = 'Swagger YAML',
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !filePath) {
      return
    }

    const validateYamlFile = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(filePath)

        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.status}`)
        }

        await response.text()
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load YAML file.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    validateYamlFile()
  }, [isOpen, filePath])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-orange-500" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Close YAML viewer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-4 dark:bg-slate-950">
          {isLoading ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <ScrollText className="h-4 w-4 animate-pulse text-orange-500" />
              Loading YAML...
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : null}

          {!isLoading && !error ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800">
              <div className="border-b border-slate-200 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {filePath}
              </div>
              <div className="h-[calc(100vh-11rem)] overflow-auto">
                <Suspense
                  fallback={
                    <div className="inline-flex items-center gap-2 p-4 text-sm text-slate-700 dark:text-slate-200">
                      <ScrollText className="h-4 w-4 animate-pulse text-orange-500" />
                      Loading Swagger UI...
                    </div>
                  }
                >
                  <SwaggerUI
                    url={filePath ?? undefined}
                    docExpansion="list"
                    defaultModelsExpandDepth={-1}
                    displayRequestDuration
                  />
                </Suspense>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default YamlViewerDialog
