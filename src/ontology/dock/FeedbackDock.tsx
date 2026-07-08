import type { Ref } from 'react'
import type { PointerDragHandlers } from '../../hooks/usePointerDrag'
import { IconButton } from '../../design/IconButton'
import { NoteIcon, SaveIcon, LoadIcon, ReviewIcon, HelpIcon } from '../../design/icons'

interface FeedbackDockProps {
  /** Pointer handlers for the drag-to-create gesture. */
  launcher: PointerDragHandlers
  onSave: () => void
  onLoad: () => void
  onToggleReview: () => void
  reviewing: boolean
  onToggleHelp: () => void
  helpOpen: boolean
  helpRef: Ref<HTMLButtonElement>
  /** Total notes across all pages — badges the launcher, gates save/review. */
  count: number
}

/** The persistent corner: help, create, save, load, and enter review. */
export function FeedbackDock({ launcher, onSave, onLoad, onToggleReview, reviewing, onToggleHelp, helpOpen, helpRef, count }: FeedbackDockProps) {
  return (
    <div className="fb-dock">
      <IconButton
        ref={helpRef}
        variant="solid"
        size="lg"
        active={helpOpen}
        aria-pressed={helpOpen}
        onClick={onToggleHelp}
        title="How feedback works"
      >
        <HelpIcon />
      </IconButton>

      <IconButton
        {...launcher}
        variant="solid"
        size="lg"
        badge={count || undefined}
        title="Drag onto the page to leave a feedback note"
        className="fb-dock__launcher"
      >
        <NoteIcon />
      </IconButton>

      <IconButton variant="solid" size="lg" onClick={onSave} disabled={count === 0} title="Save all feedback notes to a file">
        <SaveIcon />
      </IconButton>

      <IconButton variant="solid" size="lg" onClick={onLoad} title="Load feedback notes from a file">
        <LoadIcon />
      </IconButton>

      <IconButton
        variant="solid"
        size="lg"
        active={reviewing}
        aria-pressed={reviewing}
        onClick={onToggleReview}
        disabled={count === 0}
        title={reviewing ? 'Exit review mode' : 'Review the loaded notes'}
      >
        <ReviewIcon />
      </IconButton>
    </div>
  )
}
