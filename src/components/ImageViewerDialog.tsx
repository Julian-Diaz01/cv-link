import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Minus, Plus, RotateCcw, X } from 'lucide-react'

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
  const minZoom = 0.5
  const maxZoom = 3
  const zoomStep = 0.25

  const clampZoom = (value: number) =>
    Math.min(maxZoom, Math.max(minZoom, value))

  const zoomIn = () => setZoom((current) => clampZoom(current + zoomStep))
  const zoomOut = () => setZoom((current) => clampZoom(current - zoomStep))
  const resetZoom = () => setZoom(1)

  useEffect(() => {
    if (!isOpen) return

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

  useEffect(() => {
    if (isOpen) {
      setZoom(1)
    }
  }, [isOpen, imagePath])

  if (!isOpen || !imagePath) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/80">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={zoomOut}
                className="rounded p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                aria-label="Zoom out"
                disabled={zoom <= minZoom}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-12 text-center text-xs font-medium text-slate-700 dark:text-slate-200">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                className="rounded p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                aria-label="Zoom in"
                disabled={zoom >= maxZoom}
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="rounded p-1 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Close image viewer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-4 dark:bg-slate-950">
          <div className="mx-auto max-w-6xl">
            <img
              src={imagePath}
              alt={title}
              className="h-auto rounded-lg border border-slate-200 bg-white shadow dark:border-slate-700 dark:bg-slate-900"
              style={{
                width: `${zoom * 100}%`,
                maxWidth: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ImageViewerDialog
