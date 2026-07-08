import { useCallback, useRef } from 'react'

/** A pointer position in viewport (client) space. */
export interface DragPoint {
  x: number
  y: number
}

export interface PointerDragHandlers {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
}

interface UsePointerDragOptions {
  onStart?: (p: DragPoint) => void
  onMove?: (p: DragPoint) => void
  onEnd?: (p: DragPoint) => void
}

const pointOf = (e: React.PointerEvent): DragPoint => ({ x: e.clientX, y: e.clientY })

/**
 * A drag reported in viewport coordinates. Captures the pointer on press
 * so movement is tracked even once it leaves the source element. Returns
 * handlers to spread onto any element.
 */
export function usePointerDrag({ onStart, onMove, onEnd }: UsePointerDragOptions): PointerDragHandlers {
  const dragging = useRef(false)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      onStart?.(pointOf(e))
    },
    [onStart],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging.current) onMove?.(pointOf(e))
    },
    [onMove],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      dragging.current = false
      e.currentTarget.releasePointerCapture(e.pointerId)
      onEnd?.(pointOf(e))
    },
    [onEnd],
  )

  return { onPointerDown, onPointerMove, onPointerUp }
}
