import { useLayoutEffect, useState, type RefObject } from 'react'

const GAP = 8
const MARGIN = 12

export interface AnchoredPosition {
  top: number
  left: number
}

/**
 * Place a floating panel against an anchor element, opening up and to the
 * left of it, and clamp the result inside the viewport so it never spills
 * off an edge. Recomputes on resize and scroll. Null until measured, so
 * the panel can render hidden on its first paint.
 */
export function useAnchoredPosition(
  anchor: HTMLElement | null,
  panelRef: RefObject<HTMLElement | null>,
): AnchoredPosition | null {
  const [pos, setPos] = useState<AnchoredPosition | null>(null)

  useLayoutEffect(() => {
    const place = () => {
      const panel = panelRef.current
      if (!panel || !anchor) return
      const a = anchor.getBoundingClientRect()
      const p = panel.getBoundingClientRect()
      setPos({
        left: clamp(a.right - p.width, MARGIN, window.innerWidth - p.width - MARGIN),
        top: clamp(a.top - p.height - GAP, MARGIN, window.innerHeight - p.height - MARGIN),
      })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [anchor, panelRef])

  return pos
}

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(value, hi))
}
