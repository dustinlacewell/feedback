import { useCallback, useEffect, useState } from 'react'
import { uid, type FeedbackDoc, type FeedbackEdge, type FeedbackNote } from './document'
import { readDoc, writeDoc } from './persistence'

type NotePatch = Partial<Pick<FeedbackNote, 'x' | 'y' | 'text' | 'resolved'>>
type EdgePatch = Partial<Pick<FeedbackEdge, 'x' | 'y' | 'target'>>

export interface FeedbackDocApi {
  notes: FeedbackNote[]
  edges: FeedbackEdge[]
  addNote: (page: string, section: string | null, x: number, y: number) => string
  updateNote: (id: string, patch: NotePatch) => void
  removeNote: (id: string) => void
  addEdge: (edge: Omit<FeedbackEdge, 'id'>) => void
  updateEdge: (id: string, patch: EdgePatch) => void
  removeEdge: (id: string) => void
  /** Replace the whole document — the load path. */
  replace: (doc: FeedbackDoc) => void
}

/**
 * Holds the whole document in state and writes it back to `localStorage`
 * on any change — so a move, keystroke, resolve, arrow, or load is saved
 * the moment it happens.
 */
export function useFeedbackDoc(storageKey: string): FeedbackDocApi {
  const [doc, setDoc] = useState<FeedbackDoc>(() => readDoc(storageKey))

  useEffect(() => {
    writeDoc(storageKey, doc)
  }, [storageKey, doc])

  const addNote = useCallback((page: string, section: string | null, x: number, y: number) => {
    const note: FeedbackNote = { id: uid(), page, section, x, y, text: '', resolved: false }
    setDoc((d) => ({ ...d, notes: [...d.notes, note] }))
    return note.id
  }, [])

  const updateNote = useCallback((id: string, patch: NotePatch) => {
    setDoc((d) => ({ ...d, notes: d.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)) }))
  }, [])

  // Removing a note takes its arrows with it — an arrow to nowhere is noise.
  const removeNote = useCallback((id: string) => {
    setDoc((d) => ({
      notes: d.notes.filter((n) => n.id !== id),
      edges: d.edges.filter((e) => e.noteId !== id),
    }))
  }, [])

  const addEdge = useCallback((edge: Omit<FeedbackEdge, 'id'>) => {
    setDoc((d) => ({ ...d, edges: [...d.edges, { ...edge, id: uid() }] }))
  }, [])

  const updateEdge = useCallback((id: string, patch: EdgePatch) => {
    setDoc((d) => ({ ...d, edges: d.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)) }))
  }, [])

  const removeEdge = useCallback((id: string) => {
    setDoc((d) => ({ ...d, edges: d.edges.filter((e) => e.id !== id) }))
  }, [])

  const replace = useCallback((next: FeedbackDoc) => setDoc(next), [])

  return {
    notes: doc.notes,
    edges: doc.edges,
    addNote,
    updateNote,
    removeNote,
    addEdge,
    updateEdge,
    removeEdge,
    replace,
  }
}
