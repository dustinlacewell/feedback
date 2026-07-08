import type { CSSProperties } from 'react'
import { arrowGeometry, type ArrowGeometry, type Point } from '../core/geometry'

/** Lift a stored (origin-relative) point to absolute pixels for drawing. */
export function withOrigin(p: Point, originX: number): Point {
  return { x: originX + p.x, y: p.y }
}

/** The absolutely-positioned frame an arrow's svg occupies. */
export function svgFrame(geo: ArrowGeometry): CSSProperties {
  return { left: geo.origin.x, top: geo.origin.y, width: geo.width, height: geo.height }
}

interface ArrowBodyProps {
  geo: ArrowGeometry
  color: string
  width: number
}

/** The shaft and arrowhead, in an svg's local coordinates. */
export function ArrowBody({ geo, color, width }: ArrowBodyProps) {
  return (
    <>
      <line
        x1={geo.start.x}
        y1={geo.start.y}
        x2={geo.base.x}
        y2={geo.base.y}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <polygon
        points={`${geo.head.x},${geo.head.y} ${geo.wings[0].x},${geo.wings[0].y} ${geo.wings[1].x},${geo.wings[1].y}`}
        fill={color}
      />
    </>
  )
}

/** A complete arrow drawn between two absolute points. */
export function Arrow({ start, head, color, width }: { start: Point; head: Point; color: string; width: number }) {
  const geo = arrowGeometry(start, head)
  return (
    <svg className="fb-arrow" style={svgFrame(geo)}>
      <ArrowBody geo={geo} color={color} width={width} />
    </svg>
  )
}
