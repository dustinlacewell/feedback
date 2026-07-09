import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import type { AnchorX } from './coordinates'
import { useFeedback } from './context'

export interface FeedbackRegionProps {
  children: ReactNode
  /** How x is anchored within this region. Overrides the provider default. */
  anchorX?: AnchorX
  /** A sub-scope so notes on one view don't leak onto its siblings. */
  section?: string | null
  /** How review asks this page to reveal a section before scrolling to a note. */
  onReveal?: (section: string) => void
  /** Extra class on the wrapper element. */
  className?: string
  /** Extra styles on the wrapper element (`position` is reserved). */
  style?: CSSProperties
}

/**
 * The element notes live in. Wrap your page's content — inside whatever
 * scroll container you already have — and notes drop into it, ride along
 * with its scroll, and measure their coordinates against it. Pages that
 * scroll the window and have no sub-scopes don't need this at all — the
 * layer works out of the box. Reach for it to keep notes inside a
 * scrollable pane, change how x is anchored, or split a page into
 * review-navigable sections.
 */
export function FeedbackRegion({ children, anchorX, section = null, onReveal, className, style }: FeedbackRegionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { bindRegion } = useFeedback()
  const revealRef = useRef(onReveal)
  revealRef.current = onReveal
  const hasReveal = !!onReveal

  useEffect(() => {
    bindRegion({
      element: ref.current,
      anchorX,
      section,
      reveal: hasReveal ? (s) => revealRef.current?.(s) : undefined,
    })
    return () => bindRegion(null)
  }, [anchorX, section, hasReveal, bindRegion])

  // The wrapper is the containing block notes are absolutely positioned
  // in — the whole coordinate model hangs on this `position`, so it wins
  // over anything passed in `style`.
  return (
    <div ref={ref} className={className} style={{ ...style, position: 'relative' }}>
      {children}
    </div>
  )
}
