import { Arrow, withOrigin } from '../../design/Arrow'
import type { Point } from '../../core/geometry'

/** The provisional arrow shown while dragging one out from a knob. */
export function DraftEdge({ start, head, originX }: { start: Point; head: Point; originX: number }) {
  return <Arrow start={withOrigin(start, originX)} head={withOrigin(head, originX)} color="var(--fb-accent)" width={2} />
}
