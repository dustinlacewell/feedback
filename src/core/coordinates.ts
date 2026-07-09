import { useEffect, useState } from 'react'
import type { Point } from './geometry'

/**
 * The coordinate system.
 *
 * A note stores its position in *content* coordinates — independent of
 * how the page is scrolled or where its region sits on screen. `y` is
 * measured from the content top; `x` is measured from an **anchor line**
 * chosen by `anchorX`, so positions survive a resize the way the content
 * itself does:
 *
 *  - `left`   — x from the content's left edge (absolute).
 *  - `center` — x signed from the horizontal centre line. A note dropped
 *    on a centred column stays glued to it as the window narrows. This is
 *    the default, because most sites centre their main content.
 *  - `right`  — x from the content's right edge.
 *
 * A **region** is the element those coordinates live in: either the
 * document/viewport (the default) or the content a page wrapped in a
 * `<FeedbackRegion>`. This module is the single seam that converts a live
 * pointer into stored coordinates and back; every part above it stays
 * origin-agnostic.
 */

export type AnchorX = 'left' | 'center' | 'right'

export interface Region {
  /** The bound content element, or null for the document/viewport. */
  element: HTMLElement | null
  /** Which edge of the content x is measured from. */
  anchorX: AnchorX
}

/** The width of a region's content box. */
function contentWidth(region: Region): number {
  return region.element?.clientWidth ?? document.documentElement.clientWidth
}

/**
 * The anchor line, in region-local pixels: the x origin a stored `x` is
 * added to when drawing and subtracted from when capturing.
 */
export function originX(region: Region): number {
  const width = contentWidth(region)
  switch (region.anchorX) {
    case 'left':
      return 0
    case 'center':
      return width / 2
    case 'right':
      return width
  }
}

/**
 * A viewport (client) point, in stored content coordinates: `x` relative
 * to the region's anchor line, `y` from the content top. The math is
 * agnostic to what was bound: a scroll container's rect is fixed while
 * its scroll offset varies; a content wrapper's rect moves with the
 * scroll while its own offset stays zero. Either way the sum is the
 * distance into the content.
 */
export function toContent(clientX: number, clientY: number, region: Region): Point {
  const origin = originX(region)
  if (!region.element) {
    return { x: clientX + window.scrollX - origin, y: clientY + window.scrollY }
  }
  const rect = region.element.getBoundingClientRect()
  return {
    x: clientX - rect.left + region.element.scrollLeft - origin,
    y: clientY - rect.top + region.element.scrollTop,
  }
}

/** Reactive `originX`, so drawn positions re-flow live as the region resizes. */
export function useOriginX(region: Region): number {
  const [origin, setOrigin] = useState(() => originX(region))
  useEffect(() => {
    const update = () => setOrigin(originX(region))
    update()
    window.addEventListener('resize', update)
    const observer = region.element ? new ResizeObserver(update) : null
    if (region.element) observer?.observe(region.element)
    return () => {
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
  }, [region.element, region.anchorX])
  return origin
}
