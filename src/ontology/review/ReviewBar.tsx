import { Toolbar, ToolbarDivider } from '../../design/Toolbar'
import { IconButton } from '../../design/IconButton'
import { FirstIcon, PrevIcon, NextIcon, LastIcon, CheckIcon, TrashIcon, EyeIcon, CloseIcon } from '../../design/icons'

interface ReviewBarProps {
  /** 1-based position of the current note, or 0 when the set is empty. */
  position: number
  total: number
  /** Whether there is a current note, so resolve/delete can enable. */
  hasCurrent: boolean
  currentResolved: boolean
  includeResolved: boolean
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
  onResolveCurrent: () => void
  onDeleteCurrent: () => void
  onToggleIncludeResolved: () => void
  onExit: () => void
}

/** The review stepper, plus resolve/delete for the current note. */
export function ReviewBar({
  position,
  total,
  hasCurrent,
  currentResolved,
  includeResolved,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onResolveCurrent,
  onDeleteCurrent,
  onToggleIncludeResolved,
  onExit,
}: ReviewBarProps) {
  const atStart = position <= 1
  const atEnd = position >= total
  const empty = total === 0

  return (
    <Toolbar className="fb-reviewbar" role="toolbar" aria-label="Review notes">
      <IconButton onClick={onFirst} disabled={atStart} title="First note">
        <FirstIcon />
      </IconButton>
      <IconButton onClick={onPrev} disabled={atStart} title="Previous note">
        <PrevIcon />
      </IconButton>

      <span className="fb-reviewbar__count">{empty ? 'no notes' : `${position} / ${total}`}</span>

      <IconButton onClick={onNext} disabled={atEnd} title="Next note">
        <NextIcon />
      </IconButton>
      <IconButton onClick={onLast} disabled={atEnd} title="Last note">
        <LastIcon />
      </IconButton>

      <ToolbarDivider />

      <IconButton
        tone="success"
        active={currentResolved}
        aria-pressed={currentResolved}
        onClick={onResolveCurrent}
        disabled={!hasCurrent}
        title={currentResolved ? 'Reopen this note' : 'Resolve this note'}
      >
        <CheckIcon />
      </IconButton>
      <IconButton tone="danger" onClick={onDeleteCurrent} disabled={!hasCurrent} title="Delete this note">
        <TrashIcon />
      </IconButton>

      <ToolbarDivider />

      <IconButton
        active={includeResolved}
        aria-pressed={includeResolved}
        onClick={onToggleIncludeResolved}
        title={includeResolved ? 'Including resolved notes' : 'Skipping resolved notes'}
      >
        <EyeIcon />
      </IconButton>
      <IconButton onClick={onExit} title="Exit review">
        <CloseIcon />
      </IconButton>
    </Toolbar>
  )
}
