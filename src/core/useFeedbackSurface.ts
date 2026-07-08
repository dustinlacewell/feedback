import { useEffect, useRef, type RefObject } from 'react'
import type { AnchorX } from './coordinates'
import { useFeedback } from './context'

export interface FeedbackSurfaceOptions {
  /**
   * A scrollable element notes should live inside, so they scroll and
   * clip with its content instead of the window. Give it
   * `position: relative` so it forms a containing block. Omit for pages
   * that scroll the window.
   */
  ref?: RefObject<HTMLElement | null>
  /** How x is anchored within this surface. Overrides the provider default. */
  anchorX?: AnchorX
  /** A sub-scope so notes on one view don't leak onto its siblings. */
  section?: string | null
  /** How review asks this page to reveal a section before scrolling to a note. */
  onReveal?: (section: string) => void
}

/**
 * Bind the current page to the feedback layer while it's mounted. Pages
 * that scroll the window and have no sub-scopes don't need this at all —
 * the layer works out of the box. Reach for it to attach notes to an
 * inner scroll container, change how x is anchored, or split a page into
 * review-navigable sections.
 */
export function useFeedbackSurface({ ref, anchorX, section = null, onReveal }: FeedbackSurfaceOptions): void {
  const { bindSurface } = useFeedback()
  const revealRef = useRef(onReveal)
  revealRef.current = onReveal
  const hasReveal = !!onReveal

  useEffect(() => {
    bindSurface({
      element: ref?.current ?? null,
      anchorX,
      section,
      reveal: hasReveal ? (s) => revealRef.current?.(s) : undefined,
    })
    return () => bindSurface(null)
  }, [ref, anchorX, section, hasReveal, bindSurface])
}
