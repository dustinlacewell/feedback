import { useRef } from 'react'
import { usePointerDrag } from '../../hooks/usePointerDrag'
import { useAutoGrow } from '../../hooks/useAutoGrow'
import { useElementHeight } from '../../hooks/useElementHeight'
import { useFeedback } from '../../core/context'
import { NOTE_WIDTH, NOTE_MIN_HEIGHT } from '../../core/geometry'
import { IconButton } from '../../design/IconButton'
import { GripIcon, CloseIcon, CheckIcon } from '../../design/icons'
import type { FeedbackNote } from '../../core/document'

interface StickyNoteProps {
  note: FeedbackNote
  /** The anchor line the note's x is measured from. */
  originX: number
  autoFocus: boolean
  /** Highlighted as the note under review right now. */
  current: boolean
  onMove: (x: number, y: number) => void
  onEdit: (text: string) => void
  onToggleResolved: () => void
  onRemove: () => void
}

/**
 * One sticky note: drag the grip bar to reposition, type in the body to
 * edit, check it off when resolved. Every gesture flows straight to the
 * parent, which persists it; the note reports its own live height so
 * edges can follow its border.
 */
export function StickyNote({ note, originX, autoFocus, current, onMove, onEdit, onToggleResolved, onRemove }: StickyNoteProps) {
  const { reportHeight, clearHeight } = useFeedback()
  const rootRef = useRef<HTMLDivElement>(null)
  const bodyRef = useAutoGrow(note.text)
  useElementHeight(rootRef, (h) => reportHeight(note.id, h), () => clearHeight(note.id))

  // Track the drag as a delta from where it began: a viewport delta
  // equals a stored delta, so the anchor offset never enters the math.
  const origin = useRef({ px: 0, py: 0, nx: 0, ny: 0 })
  const grip = usePointerDrag({
    onStart: (p) => (origin.current = { px: p.x, py: p.y, nx: note.x, ny: note.y }),
    onMove: (p) => {
      const o = origin.current
      onMove(o.nx + (p.x - o.px), Math.max(0, o.ny + (p.y - o.py)))
    },
  })

  const className = [
    'fb-note',
    current ? 'fb-note--current' : '',
    note.resolved ? 'fb-note--resolved' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={rootRef} data-note-id={note.id} className={className} style={{ left: originX + note.x, top: note.y, width: NOTE_WIDTH }}>
      <header {...grip} className="fb-note__header">
        <GripIcon />
        <div className="fb-note__actions">
          <IconButton
            variant="ghost"
            size="sm"
            tone="success"
            active={note.resolved}
            onClick={onToggleResolved}
            onPointerDown={stop}
            title={note.resolved ? 'Resolved — click to reopen' : 'Mark resolved'}
            aria-label={note.resolved ? 'Reopen note' : 'Mark resolved'}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            tone="danger"
            onClick={onRemove}
            onPointerDown={stop}
            title="Delete note"
            aria-label="Delete note"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </header>
      <textarea
        ref={bodyRef}
        value={note.text}
        autoFocus={autoFocus}
        onChange={(e) => onEdit(e.target.value)}
        placeholder="Write feedback…"
        className="fb-note__body"
        style={{ minHeight: NOTE_MIN_HEIGHT - 28 }}
      />
    </div>
  )
}

/** Keep a header button's press from starting a note drag. */
const stop = (e: React.PointerEvent) => e.stopPropagation()
