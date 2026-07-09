import { createPortal } from 'react-dom'
import { useFeedback } from '../core/context'
import { knobPoint } from '../core/geometry'
import { describeTarget } from '../core/targetAddress'
import type { FeedbackNote } from '../core/document'
import type { EdgeDraftApi } from '../hooks/useEdgeDraft'
import { StickyNote } from './note/StickyNote'
import { NoteKnobs } from './note/NoteKnobs'
import { Edge } from './edge/Edge'
import { DraftEdge } from './edge/DraftEdge'

interface OverlayProps {
  originX: number
  /** A just-created note to focus for typing. */
  focusId: string | null
  /** The note under review, highlighted. */
  reviewCurrentId: string | null
  reviewing: boolean
  selectedEdge: string | null
  onSelectEdge: (id: string) => void
  /** The live drag-from-a-knob gesture. */
  draft: EdgeDraftApi
}

/**
 * The draw layer: every note, knob, and arrow for the active region,
 * portalled into that region so they scroll and clip with its content.
 * Positions come in origin-relative and are lifted by `originX` here — the
 * one place the anchor line meets the screen.
 */
export function Overlay({ originX, focusId, reviewCurrentId, reviewing, selectedEdge, onSelectEdge, draft }: OverlayProps) {
  const { doc, region, section, nav, heightOf, rootClassName, rootStyle } = useFeedback()

  const inScope = (o: { page: string; section: string | null }) =>
    o.page === nav.page && (o.section ?? null) === (section ?? null)
  const noteById = (id: string): FeedbackNote | undefined => doc.notes.find((n) => n.id === id)
  const pageNotes = doc.notes.filter(inScope)
  const pageEdges = doc.edges.filter(inScope)
  const draftNote = draft.draft ? noteById(draft.draft.noteId) : null

  return createPortal(
    <div data-feedback className={`${rootClassName} fb-overlay`} style={rootStyle}>
      {pageEdges.map((edge) => {
        const note = noteById(edge.noteId)
        if (!note) return null
        return (
          <Edge
            key={edge.id}
            start={knobPoint(note, edge.port, heightOf(note.id))}
            head={{ x: edge.x, y: edge.y }}
            originX={originX}
            selected={selectedEdge === edge.id}
            onSelect={() => onSelectEdge(edge.id)}
            onMoveHead={(x, y) => doc.updateEdge(edge.id, { x, y })}
            onReaim={(x, y) => doc.updateEdge(edge.id, { target: describeTarget(x, y) })}
          />
        )
      })}

      {draft.draft && draftNote && (
        <DraftEdge start={knobPoint(draftNote, draft.draft.port, heightOf(draftNote.id))} head={draft.draft.head} originX={originX} />
      )}

      {pageNotes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          originX={originX}
          autoFocus={note.id === focusId}
          current={reviewing && note.id === reviewCurrentId}
          onMove={(x, y) => doc.updateNote(note.id, { x, y })}
          onEdit={(text) => doc.updateNote(note.id, { text })}
          onToggleResolved={() => doc.updateNote(note.id, { resolved: !note.resolved })}
          onRemove={() => doc.removeNote(note.id)}
        />
      ))}

      {pageNotes.map((note) => (
        <NoteKnobs
          key={`knobs-${note.id}`}
          note={note}
          height={heightOf(note.id)}
          originX={originX}
          onStart={draft.start}
          onMove={draft.move}
          onEnd={draft.end}
        />
      ))}
    </div>,
    region.element ?? document.body,
  )
}
