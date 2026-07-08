import { useEffect, useState } from 'react'
import type { Point } from './geometry'

/**
 * The coordinate system.
 *
 * A note stores its position in *content* coordinates — independent of
 * how the page is scrolled or where its surface sits on screen. `y` is
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
 * A **surface** is the region those coordinates live in: either the
 * document/viewport (the default) or an inner scroll container an app
 * opts into. This module is the single seam that converts a live pointer
 * into stored coordinates and back; every part above it stays
 * origin-agnostic.
 */

export type AnchorX = 'left' | 'center' | 'right'

export interface Surface {
  /** The inner scroll container, or null for the document/viewport. */
  element: HTMLElement | null
  /** Which edge of the content x is measured from. */
  anchorX: AnchorX
}

/** The visible width of a surface's content box. */
function contentWidth(surface: Surface): number {
  return surface.element?.clientWidth ?? document.documentElement.clientWidth
}

/**
 * The anchor line, in surface-local pixels: the x origin a stored `x` is
 * added to when drawing and subtracted from when capturing.
 */
export function originX(surface: Surface): number {
  const width = contentWidth(surface)
  switch (surface.anchorX) {
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
 * to the surface's anchor line, `y` from the content top — both including
 * however far the surface is scrolled.
 */
export function toContent(clientX: number, clientY: number, surface: Surface): Point {
  const origin = originX(surface)
  if (!surface.element) {
    return { x: clientX + window.scrollX - origin, y: clientY + window.scrollY }
  }
  const rect = surface.element.getBoundingClientRect()
  return {
    x: clientX - rect.left + surface.element.scrollLeft - origin,
    y: clientY - rect.top + surface.element.scrollTop,
  }
}

/** Reactive `originX`, so drawn positions re-flow live as the surface resizes. */
export function useOriginX(surface: Surface): number {
  const [origin, setOrigin] = useState(() => originX(surface))
  useEffect(() => {
    const update = () => setOrigin(originX(surface))
    update()
    window.addEventListener('resize', update)
    const observer = surface.element ? new ResizeObserver(update) : null
    if (surface.element) observer?.observe(surface.element)
    return () => {
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
  }, [surface.element, surface.anchorX])
  return origin
}
