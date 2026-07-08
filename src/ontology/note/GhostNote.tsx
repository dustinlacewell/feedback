import { NOTE_WIDTH, NOTE_MIN_HEIGHT } from '../../core/geometry'

/** The dashed outline that trails the pointer, showing where a note will land. */
export function GhostNote({ x, y }: { x: number; y: number }) {
  return <div aria-hidden className="fb-ghost" style={{ left: x, top: y, width: NOTE_WIDTH, height: NOTE_MIN_HEIGHT }} />
}
