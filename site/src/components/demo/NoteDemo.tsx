import { useRef, useState } from 'react'
import { DemoNote, NOTE_W, Stage, useRect, type Pt } from './kit'

/*
 * The first exhibit: a sticky note over a skeleton of an app, with a real
 * arrow pointed at the copy it complains about. Everything works — drag
 * the note by its grip, pull new arrows out of the knobs, re-aim a head
 * by dragging it. Tails follow the note; heads stay where they're aimed,
 * same as the overlay.
 */

const PAD = 10
const HOME_Y = 40

type Port = 'left' | 'bottom' | 'right'
const PORTS: Port[] = ['left', 'bottom', 'right']

/** Shaft base and arrowhead wings — the library's arrow math, in stage space. */
function arrowShapes(start: Pt, head: Pt) {
  const len = Math.hypot(head.x - start.x, head.y - start.y) || 1
  const ux = (head.x - start.x) / len
  const uy = (head.y - start.y) / len
  const base = { x: head.x - ux * 12, y: head.y - uy * 12 }
  const wings: [Pt, Pt] = [
    { x: base.x - uy * 6.5, y: base.y + ux * 6.5 },
    { x: base.x + uy * 6.5, y: base.y - ux * 6.5 },
  ]
  return { base, wings }
}

export function NoteDemo() {
  const [canvasRef, canvasRect, canvasEl] = useRect<HTMLDivElement>()
  const [copyRef, copyRect] = useRect<HTMLDivElement>()
  const [noteRef, noteRect] = useRect<HTMLDivElement>()

  const [dragged, setDragged] = useState<Pt | null>(null)
  const [text, setText] = useState('Can we clarify this copy somehow?')
  const [resolved, setResolved] = useState(false)
  const [gone, setGone] = useState(false)
  const [heads, setHeads] = useState<Partial<Record<Port, Pt>>>({})
  const [draft, setDraft] = useState<{ port: Port; head: Pt } | null>(null)

  const noteH = noteRect?.height ?? 148

  const clamp = (p: Pt): Pt =>
    canvasRect
      ? {
          x: Math.min(Math.max(p.x, PAD), Math.max(PAD, canvasRect.width - NOTE_W - PAD)),
          y: Math.min(Math.max(p.y, PAD), Math.max(PAD, canvasRect.height - noteH - PAD)),
        }
      : p

  // Until dragged, the note sits at its home spot in the upper right — the
  // right margin scales with the canvas so it doesn't hug the edge on a
  // wide stage.
  const raw = dragged ?? (canvasRect ? { x: canvasRect.width - NOTE_W - Math.max(26, canvasRect.width * 0.14), y: HOME_Y } : null)
  const pos = raw ? clamp(raw) : null

  /** Pointer position in stage coordinates, fresh per event. */
  const stagePoint = (e: React.PointerEvent): Pt => {
    const r = canvasEl!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  // Grip drag, as a delta from where it began.
  const origin = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const grip = {
    onPointerDown: (e: React.PointerEvent) => {
      if (!pos) return
      e.currentTarget.setPointerCapture(e.pointerId)
      origin.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y }
    },
    onPointerMove: (e: React.PointerEvent) => {
      const o = origin.current
      if (o) setDragged({ x: o.x + (e.clientX - o.px), y: o.y + (e.clientY - o.py) })
    },
    onPointerUp: () => (origin.current = null),
    onPointerCancel: () => (origin.current = null),
  }

  // Arrow drawing: drag from a knob (or a committed head) to aim.
  const drawing = useRef<Port | null>(null)
  const aim = (port: Port) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      e.stopPropagation()
      drawing.current = port
      setDraft({ port, head: stagePoint(e) })
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (drawing.current === port) setDraft({ port, head: stagePoint(e) })
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (drawing.current !== port) return
      drawing.current = null
      setHeads((h) => ({ ...h, [port]: stagePoint(e) }))
      setDraft(null)
    },
  })

  // The seeded arrow aims at the skeleton copy until the user re-aims it.
  const seededHead: Pt | null =
    canvasRect && copyRect
      ? { x: copyRect.left - canvasRect.left + copyRect.width * 0.55, y: copyRect.top - canvasRect.top + copyRect.height / 2 }
      : null

  const knobs: Record<Port, Pt> | null = pos
    ? {
        left: { x: pos.x, y: pos.y + noteH / 2 },
        bottom: { x: pos.x + NOTE_W / 2, y: pos.y + noteH },
        right: { x: pos.x + NOTE_W, y: pos.y + noteH / 2 },
      }
    : null

  const arrows = knobs
    ? PORTS.flatMap((port) => {
        const head = draft?.port === port ? draft.head : heads[port] ?? (port === 'left' ? seededHead : null)
        return head ? [{ port, start: knobs[port], head, ...arrowShapes(knobs[port], head) }] : []
      })
    : []

  const reset = () => {
    setGone(false)
    setResolved(false)
    setDragged(null)
    setHeads({})
    setDraft(null)
  }

  return (
    <Stage>
      <div ref={canvasRef} className="s-notestage">
        <div className="s-mock">
          <span className="s-skel s-skel--title" style={{ width: '62%' }} />
          <div ref={copyRef} className="s-skelblock">
            <span className="s-skel" style={{ width: '100%' }} />
            <span className="s-skel" style={{ width: '92%' }} />
            <span className="s-skel" style={{ width: '70%' }} />
          </div>
          <span className="s-mock__pill" />
        </div>

        {!gone && (
          <svg className="s-stage__arrow">
            {arrows.map((a) => (
              <g key={a.port}>
                <line x1={a.start.x} y1={a.start.y} x2={a.base.x} y2={a.base.y} stroke="var(--fb-accent)" strokeWidth={2} strokeLinecap="round" />
                <polygon
                  points={`${a.head.x},${a.head.y} ${a.wings[0].x},${a.wings[0].y} ${a.wings[1].x},${a.wings[1].y}`}
                  fill="var(--fb-accent)"
                />
                <circle
                  {...aim(a.port)}
                  cx={a.head.x}
                  cy={a.head.y}
                  r={6}
                  fill="var(--fb-accent)"
                  className="s-stage__head"
                />
              </g>
            ))}
          </svg>
        )}

        {!gone && pos && knobs && (
          <>
            <DemoNote
              pos={pos}
              text={text}
              resolved={resolved}
              noteRef={noteRef}
              grip={grip}
              onText={setText}
              onToggleResolved={() => setResolved((v) => !v)}
              onRemove={() => setGone(true)}
            />
            {PORTS.map((port) => (
              <span key={port} {...aim(port)} className="fb-knob" style={{ left: knobs[port].x, top: knobs[port].y }} title="Drag to draw an arrow" />
            ))}
          </>
        )}

        {gone && (
          <button type="button" className="s-restore" onClick={reset}>
            note deleted — bring it back
          </button>
        )}
      </div>
    </Stage>
  )
}
