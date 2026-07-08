import { useRef } from 'react'
import { usePointerDrag } from '../../hooks/usePointerDrag'
import { arrowGeometry, type Point } from '../../core/geometry'
import { ArrowBody, svgFrame, withOrigin } from '../../design/Arrow'

const ACCENT = 'var(--fb-accent)'
const ACCENT_HOVER = 'var(--fb-accent-hover)'

interface EdgeProps {
  /** Tail and head in stored (origin-relative) coordinates. */
  start: Point
  head: Point
  originX: number
  selected: boolean
  onSelect: () => void
  onMoveHead: (x: number, y: number) => void
  /** Fired on release with the drop point, to re-address what it lands on. */
  onReaim: (clientX: number, clientY: number) => void
}

/**
 * One committed arrow: click the shaft or head to select it, drag the
 * head to re-aim it. The tail follows its note (the parent recomputes
 * `start`).
 */
export function Edge({ start, head, originX, selected, onSelect, onMoveHead, onReaim }: EdgeProps) {
  const geo = arrowGeometry(withOrigin(start, originX), withOrigin(head, originX))

  // Head drag is a delta from the grab point; a viewport delta equals a
  // stored delta, so the anchor offset never enters the math.
  const grab = useRef({ hx: 0, hy: 0, px: 0, py: 0 })
  const drag = usePointerDrag({
    onStart: (p) => (grab.current = { hx: head.x, hy: head.y, px: p.x, py: p.y }),
    onMove: (p) => onMoveHead(grab.current.hx + (p.x - grab.current.px), grab.current.hy + (p.y - grab.current.py)),
    onEnd: (p) => onReaim(p.x, p.y),
  })

  const color = selected ? ACCENT_HOVER : ACCENT
  const select = (e: React.PointerEvent) => {
    e.stopPropagation()
    // Leave any note being edited, so a following Delete removes the arrow.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    onSelect()
  }

  return (
    <svg className="fb-arrow" style={svgFrame(geo)}>
      {/* fat transparent hit target along the shaft */}
      <line
        x1={geo.start.x}
        y1={geo.start.y}
        x2={geo.head.x}
        y2={geo.head.y}
        stroke="transparent"
        strokeWidth={14}
        strokeLinecap="round"
        className="fb-edge__hit"
        onPointerDown={select}
      />
      <ArrowBody geo={geo} color={color} width={selected ? 3 : 2} />
      <circle
        cx={geo.head.x}
        cy={geo.head.y}
        r={selected ? 7 : 5}
        fill={color}
        stroke="var(--fb-surface)"
        strokeWidth={selected ? 2 : 0}
        className="fb-edge__head"
        onPointerDown={(e) => {
          select(e)
          drag.onPointerDown(e)
        }}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
      />
    </svg>
  )
}
