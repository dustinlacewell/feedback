import { useRef, useState } from 'react'
import { toContent, type Surface } from '../core/coordinates'
import { describeTarget } from '../core/targetAddress'
import { knobPoint, type Point, type Port } from '../core/geometry'
import type { EdgeTarget, FeedbackNote } from '../core/document'

/** Ignore a knob press that barely moved — it's a click, not an arrow. */
const MIN_DRAG = 16

export interface EdgeDraft {
  noteId: string
  port: Port
  /** The head so far, in content coordinates. */
  head: Point
}

export interface EdgeDraftApi {
  /** The live draft while a knob is being dragged, else null. */
  draft: EdgeDraft | null
  start: (noteId: string, port: Port) => void
  move: (clientX: number, clientY: number) => void
  end: (clientX: number, clientY: number) => void
}

interface EdgeDraftDeps {
  surface: Surface
  noteById: (id: string) => FeedbackNote | undefined
  heightOf: (id: string) => number
  onCommit: (noteId: string, port: Port, head: Point, target: EdgeTarget | null) => void
}

/**
 * The drag-from-a-knob gesture. Tracks a live head while dragging and
 * commits a real arrow on release, unless the drag was too short. A ref
 * mirrors the draft so the pointer-up handler never reads a stale head.
 */
export function useEdgeDraft({ surface, noteById, heightOf, onCommit }: EdgeDraftDeps): EdgeDraftApi {
  const [draft, setDraft] = useState<EdgeDraft | null>(null)
  const live = useRef<EdgeDraft | null>(null)

  const set = (next: EdgeDraft | null) => {
    live.current = next
    setDraft(next)
  }

  const start = (noteId: string, port: Port) => {
    const note = noteById(noteId)
    if (note) set({ noteId, port, head: knobPoint(note, port, heightOf(noteId)) })
  }

  const move = (clientX: number, clientY: number) => {
    const d = live.current
    if (d) set({ ...d, head: toContent(clientX, clientY, surface) })
  }

  const end = (clientX: number, clientY: number) => {
    const d = live.current
    const note = d && noteById(d.noteId)
    if (d && note) {
      const head = toContent(clientX, clientY, surface)
      const tail = knobPoint(note, d.port, heightOf(d.noteId))
      if (Math.hypot(head.x - tail.x, head.y - tail.y) > MIN_DRAG) {
        onCommit(d.noteId, d.port, head, describeTarget(clientX, clientY))
      }
    }
    set(null)
  }

  return { draft, start, move, end }
}
