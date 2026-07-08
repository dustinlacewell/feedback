/** Shared dimensions and arrow math for notes and their edges. */

export const NOTE_WIDTH = 224
export const NOTE_MIN_HEIGHT = 132

/** Which knob on a note's border an edge grows from. */
export type Port = 'left' | 'bottom' | 'right'

export const PORTS: Port[] = ['left', 'bottom', 'right']

export interface Point {
  x: number
  y: number
}

/** The content-space position of a note's knob for the given port. */
export function knobPoint(note: Point, port: Port, height: number): Point {
  switch (port) {
    case 'left':
      return { x: note.x, y: note.y + height / 2 }
    case 'right':
      return { x: note.x + NOTE_WIDTH, y: note.y + height / 2 }
    case 'bottom':
      return { x: note.x + NOTE_WIDTH / 2, y: note.y + height }
  }
}

export interface ArrowGeometry {
  /** Top-left of the bounding svg, in content coordinates. */
  origin: Point
  width: number
  height: number
  /** Tail, arrowhead base, and tip — all in the svg's local coordinates. */
  start: Point
  base: Point
  head: Point
  wings: [Point, Point]
}

const PAD = 14
const ARROW_LEN = 12
const ARROW_HALF = 6.5

/**
 * Everything needed to draw an arrow from `start` to `head`: a padded
 * bounding box plus local-space points for the shaft and arrowhead.
 */
export function arrowGeometry(start: Point, head: Point): ArrowGeometry {
  const origin = { x: Math.min(start.x, head.x) - PAD, y: Math.min(start.y, head.y) - PAD }
  const s = { x: start.x - origin.x, y: start.y - origin.y }
  const h = { x: head.x - origin.x, y: head.y - origin.y }
  const len = Math.hypot(h.x - s.x, h.y - s.y) || 1
  const ux = (h.x - s.x) / len
  const uy = (h.y - s.y) / len
  const base = { x: h.x - ux * ARROW_LEN, y: h.y - uy * ARROW_LEN }
  return {
    origin,
    width: Math.abs(head.x - start.x) + PAD * 2,
    height: Math.abs(head.y - start.y) + PAD * 2,
    start: s,
    base,
    head: h,
    wings: [
      { x: base.x - uy * ARROW_HALF, y: base.y + ux * ARROW_HALF },
      { x: base.x + uy * ARROW_HALF, y: base.y - ux * ARROW_HALF },
    ],
  }
}
