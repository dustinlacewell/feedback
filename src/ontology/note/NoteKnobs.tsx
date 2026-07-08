import { usePointerDrag } from '../../hooks/usePointerDrag'
import { knobPoint, PORTS, type Port } from '../../core/geometry'
import type { FeedbackNote } from '../../core/document'

interface NoteKnobsProps {
  note: FeedbackNote
  height: number
  originX: number
  onStart: (noteId: string, port: Port) => void
  onMove: (clientX: number, clientY: number) => void
  onEnd: (clientX: number, clientY: number) => void
}

/** The three border knobs an arrow can be drawn from. */
export function NoteKnobs({ note, height, originX, onStart, onMove, onEnd }: NoteKnobsProps) {
  return (
    <>
      {PORTS.map((port) => {
        const k = knobPoint(note, port, height)
        return (
          <Knob
            key={port}
            x={originX + k.x}
            y={k.y}
            onStart={() => onStart(note.id, port)}
            onMove={onMove}
            onEnd={onEnd}
          />
        )
      })}
    </>
  )
}

interface KnobProps {
  x: number
  y: number
  onStart: () => void
  onMove: (clientX: number, clientY: number) => void
  onEnd: (clientX: number, clientY: number) => void
}

function Knob({ x, y, onStart, onMove, onEnd }: KnobProps) {
  const drag = usePointerDrag({
    onStart,
    onMove: (p) => onMove(p.x, p.y),
    onEnd: (p) => onEnd(p.x, p.y),
  })
  return (
    <span
      {...drag}
      title="Drag to draw an arrow"
      aria-label="Draw an arrow"
      className="fb-knob"
      style={{ left: x, top: y }}
    />
  )
}
