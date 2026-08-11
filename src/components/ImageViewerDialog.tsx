import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Minus, Plus, RotateCcw, X } from 'lucide-react'
import { useDialogFocus } from '../hooks/useDialogFocus'

interface ImageViewerDialogProps {
  isOpen: boolean
  imagePath: string | null
  title?: string
  onClose: () => void
}

const ImageViewerDialog: React.FC<ImageViewerDialogProps> = ({
  isOpen,
  imagePath,
  title = 'Diagram preview',
  onClose,
}) => {
  const [zoom, setZoom] = useState(1)
  const prefersReducedMotion = useReducedMotion()
  const minZoom = 0.5
  const maxZoom = 3
  const zoomStep = 0.25

  // Retain the last known image/title through the close animation — the
  // caller nulls `imagePath` the same instant `isOpen` flips to false, so we
  // capture it while open and keep rendering it during the exit transition.
  const [lastContent, setLastContent] = useState<{
    imagePath: string
    title: string
  } | null>(null)

  useEffect(() => {
    if (imagePath) {
      setLastContent({ imagePath, title })
    }
  }, [imagePath, title])

  // Tracks whether the dialog is actually present in the DOM, including the
  // exit-animation window — `isOpen` flips false the instant the caller
  // requests a close, but the panel keeps fading out for ~180ms after that.
  // Body scroll must stay locked for that whole window, not just while
  // `isOpen` is true, or the page behind becomes scrollable mid-fade.
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isOpen) setIsMounted(true)
  }, [isOpen])

  const clampZoom = (value: number) =>
    Math.min(maxZoom, Math.max(minZoom, value))

  const zoomIn = () => setZoom((current) => clampZoom(current + zoomStep))
  const zoomOut = () => setZoom((current) => clampZoom(current - zoomStep))
  const resetZoom = () => setZoom(1)

  useEffect(() => {
    if (!isMounted) return

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

  useEffect(() => {
    if (isOpen) {
      setZoom(1)
    }
  }, [isOpen, imagePath])

  const isShowing = isOpen && Boolean(lastContent)

  const { dialogRef, initialFocusRef } = useDialogFocus<
    HTMLDivElement,
    HTMLButtonElement
  >(isShowing)

  return createPortal(
    <AnimatePresence onExitComplete={() => setIsMounted(false)}>
      {isShowing && lastContent && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/70"
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
              <h3 className="text-base font-semibold text-ink">
                {lastContent.title}
              </h3>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1 border border-line bg-surface p-1">
                  <button
                    type="button"
                    onClick={zoomOut}
                    className="p-1 text-ink-muted transition hover:text-ink disabled:opacity-50 press-feedback"
                    aria-label="Zoom out"
                    disabled={zoom <= minZoom}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-12 text-center text-xs font-medium text-ink-muted">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={zoomIn}
                    className="p-1 text-ink-muted transition hover:text-ink disabled:opacity-50 press-feedback"
                    aria-label="Zoom in"
                    disabled={zoom >= maxZoom}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={resetZoom}
                    className="p-1 text-ink-muted transition hover:text-ink press-feedback"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  ref={initialFocusRef}
                  className="p-2 text-ink-muted transition hover:text-ink press-feedback"
                  aria-label="Close image viewer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-surface-sunken p-4">
              <div className="mx-auto max-w-6xl">
                <img
                  src={lastContent.imagePath}
                  alt={lastContent.title}
                  className="h-auto border border-line bg-surface"
                  style={{
                    width: `${zoom * 100}%`,
                    maxWidth: 'none',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default ImageViewerDialog
