/**
 * The feedback document: notes and edges, plus the coercion that turns
 * untrusted data (a loaded file, or restored storage) into a valid one.
 *
 * Notes are the sticky notes a reviewer drops; edges are arrows drawn
 * from a note's knob to a free point. Coordinates are stored in content
 * space (see `coordinates.ts`) so they track the layout across window
 * sizes. Pure data — the React binding lives in `useFeedbackDoc`.
 */

import type { Port } from './geometry'

export interface FeedbackNote {
  id: string
  /** Top-level scope the note was dropped on (a route/path); revisited during review. */
  page: string
  /** Sub-scope within the page (e.g. a carousel step); null spans the page. */
  section: string | null
  /** Stored in content coordinates — see `coordinates.ts`. */
  x: number
  y: number
  text: string
  /** Marked done during review; kept, not deleted. */
  resolved: boolean
}

/** The page element an arrow lands on, addressed for later identification. */
export interface EdgeTarget {
  /** A CSS path carrying every class at each level, e.g. `article.prose > p.lead`. */
  selector: string
  /** A short text excerpt from the element, or null when it has none. */
  text: string | null
}

export interface FeedbackEdge {
  id: string
  page: string
  section: string | null
  /** The note this arrow's tail is pinned to. */
  noteId: string
  /** Which of the note's knobs the tail grows from. */
  port: Port
  /** The arrowhead, in the same content coordinates as a note. */
  x: number
  y: number
  /** What the arrowhead points at, captured on draw and re-aim. */
  target: EdgeTarget | null
}

export interface FeedbackDoc {
  notes: FeedbackNote[]
  edges: FeedbackEdge[]
}

export const EMPTY_DOC: FeedbackDoc = { notes: [], edges: [] }

/**
 * Coerce untrusted data into a document. Accepts a `{ notes, edges }`
 * envelope, or a bare notes array from an older export. Edges whose note
 * is gone are dropped.
 */
export function normalizeDoc(data: unknown): FeedbackDoc {
  const notes = normalizeNotes(data)
  const edges = normalizeEdges(isRecord(data) ? data.edges : undefined).filter((edge) =>
    notes.some((note) => note.id === edge.noteId),
  )
  return { notes, edges }
}

function normalizeNotes(data: unknown): FeedbackNote[] {
  const raw = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.notes) ? data.notes : []
  return raw.filter(isRecord).map(toNote)
}

function normalizeEdges(data: unknown): FeedbackEdge[] {
  return Array.isArray(data) ? data.filter(isRecord).map(toEdge) : []
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toNote(r: Record<string, unknown>): FeedbackNote {
  return {
    id: typeof r.id === 'string' ? r.id : uid(),
    page: typeof r.page === 'string' ? r.page : '/',
    section: typeof r.section === 'string' ? r.section : null,
    x: Number(r.x) || 0,
    y: Number(r.y) || 0,
    text: typeof r.text === 'string' ? r.text : '',
    resolved: r.resolved === true,
  }
}

function toEdge(r: Record<string, unknown>): FeedbackEdge {
  const port = r.port === 'left' || r.port === 'bottom' || r.port === 'right' ? r.port : 'right'
  return {
    id: typeof r.id === 'string' ? r.id : uid(),
    page: typeof r.page === 'string' ? r.page : '/',
    section: typeof r.section === 'string' ? r.section : null,
    noteId: typeof r.noteId === 'string' ? r.noteId : '',
    port,
    x: Number(r.x) || 0,
    y: Number(r.y) || 0,
    target: toTarget(r.target),
  }
}

function toTarget(data: unknown): EdgeTarget | null {
  if (!isRecord(data) || typeof data.selector !== 'string') return null
  return { selector: data.selector, text: typeof data.text === 'string' ? data.text : null }
}

/** A collision-resistant id, with a fallback for non-secure contexts. */
export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `fb-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
}
