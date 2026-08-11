import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Minimal dialog focus management, shared across ImageViewerDialog,
 * YamlViewerDialog, and ProjectArtifacts' external-link confirm dialog.
 *
 * On open: moves focus to `initialFocusRef` (e.g. the close button) if set,
 * otherwise to the dialog container itself.
 * On close: restores focus to whatever had focus before the dialog opened
 * (the trigger element).
 * While open: Tab/Shift+Tab cycles within the dialog's focusable elements
 * (a basic trap — not full roving-focus arrow-key support).
 *
 * `isOpen` should reflect whether the dialog is actually present in the DOM
 * (e.g. an AnimatePresence-gated "isShowing" flag), not just the caller's
 * logical open state, so refs are attached by the time this runs.
 */
export function useDialogFocus<
  TContainer extends HTMLElement = HTMLElement,
  TInitial extends HTMLElement = HTMLElement,
>(isOpen: boolean) {
  const dialogRef = useRef<TContainer>(null)
  const initialFocusRef = useRef<TInitial>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null

    const focusTarget = initialFocusRef.current ?? dialogRef.current
    focusTarget?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null)

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (
          !active ||
          active === first ||
          !dialogRef.current.contains(active)
        ) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (!active || active === last || !dialogRef.current.contains(active)) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus?.()
    }
  }, [isOpen])

  return { dialogRef, initialFocusRef }
}
