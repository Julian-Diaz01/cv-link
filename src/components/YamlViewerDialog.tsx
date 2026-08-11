import React, { Suspense, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FileCode2, ScrollText, X } from 'lucide-react'
import 'swagger-ui-react/swagger-ui.css'
import { useDialogFocus } from '../hooks/useDialogFocus'

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
  const prefersReducedMotion = useReducedMotion()

  // Retain the last known file path/title through the close animation — the
  // caller nulls `filePath` the same instant `isOpen` flips to false, so we
  // capture it while open and keep rendering it during the exit transition.
  const [lastContent, setLastContent] = useState<{
    filePath: string
    title: string
  } | null>(null)

  useEffect(() => {
    if (filePath) {
      setLastContent({ filePath, title })
    }
  }, [filePath, title])

  // Tracks whether the dialog is actually present in the DOM, including the
  // exit-animation window — `isOpen` flips false the instant the caller
  // requests a close, but the panel keeps fading out for ~180ms after that.
  // Body scroll must stay locked for that whole window, not just while
  // `isOpen` is true, or the page behind becomes scrollable mid-fade.
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isOpen) setIsMounted(true)
  }, [isOpen])

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
    if (!isMounted) {
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
  }, [isMounted, onClose])

  const isShowing = isOpen && Boolean(lastContent)

  const { dialogRef, initialFocusRef } = useDialogFocus<
    HTMLDivElement,
    HTMLButtonElement
  >(isShowing)

  return createPortal(
    <AnimatePresence onExitComplete={() => setIsMounted(false)}>
      {isShowing && lastContent && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-label={lastContent.title}
          onClick={onClose}
          ref={dialogRef}
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="flex h-full w-full flex-col overflow-hidden bg-surface"
            onClick={(event) => event.stopPropagation()}
            initial={
              prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98 }
            }
            animate={
              prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }
            }
            exit={
              prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98 }
            }
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line bg-surface-raised px-4 py-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-accent" />
                <h3 className="text-base font-semibold text-ink">
                  {lastContent.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                ref={initialFocusRef}
                className="p-2 text-ink-muted transition hover:text-ink press-feedback"
                aria-label="Close YAML viewer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-surface-sunken p-4">
              {isLoading ? (
                <div className="inline-flex items-center gap-2 border border-line bg-surface px-3 py-2 text-sm text-ink-muted">
                  <ScrollText className="h-4 w-4 animate-pulse text-accent" />
                  Loading YAML...
                </div>
              ) : null}

              {error ? <p className="text-sm text-accent">{error}</p> : null}

              {!isLoading && !error ? (
                <div className="overflow-hidden border border-line bg-surface">
                  <div className="border-b border-line px-4 py-2 text-xs text-ink-subtle">
                    {lastContent.filePath}
                  </div>
                  <div className="h-[calc(100vh-11rem)] overflow-auto">
                    <Suspense
                      fallback={
                        <div className="inline-flex items-center gap-2 p-4 text-sm text-ink-muted">
                          <ScrollText className="h-4 w-4 animate-pulse text-accent" />
                          Loading Swagger UI...
                        </div>
                      }
                    >
                      <SwaggerUI
                        url={lastContent.filePath}
                        docExpansion="list"
                        defaultModelsExpandDepth={-1}
                        displayRequestDuration
                      />
                    </Suspense>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default YamlViewerDialog
