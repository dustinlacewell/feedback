import { useRef, useState } from 'react'
import { usePointerDrag, type DragPoint } from './usePointerDrag'
import { NOTE_WIDTH } from '../core/geometry'

const TAP_THRESHOLD = 8

/**
 * The drag-to-create gesture for the dock's launcher. Exposes a live
 * `ghost` outline (viewport coordinates) while dragging and reports the
 * viewport point where the pointer lands. A near-motionless press (a tap)
 * drops a note into view instead of burying it under the dock.
 */
export function useSpawnGesture(onDrop: (clientX: number, clientY: number) => void) {
  const [ghost, setGhost] = useState<DragPoint | null>(null)
  const origin = useRef<DragPoint | null>(null)

  const handlers = usePointerDrag({
    onStart: (p) => {
      origin.current = p
      setGhost(p)
    },
    onMove: setGhost,
    onEnd: (p) => {
      setGhost(null)
      const from = origin.current
      const tapped = !from || Math.hypot(p.x - from.x, p.y - from.y) < TAP_THRESHOLD
      const drop = tapped ? viewportSpot() : p
      onDrop(drop.x, drop.y)
    },
  })

  return { ghost, handlers }
}

/** Upper third of the current viewport, in client coordinates. */
function viewportSpot(): DragPoint {
  return { x: window.innerWidth / 2 - NOTE_WIDTH / 2, y: window.innerHeight / 3 }
}
