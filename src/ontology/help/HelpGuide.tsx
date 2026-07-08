import type { ReactNode } from 'react'
import { Popover } from '../../design/Popover'
import { useFeedback } from '../../core/context'
import { NoteIcon, SaveIcon, GripIcon, CloseIcon } from '../../design/icons'

interface HelpGuideProps {
  /** The button the guide springs from. */
  anchor: HTMLElement | null
  onClose: () => void
}

/**
 * A short guide for someone leaving feedback, sprung from the help
 * button. Pure content over the `Popover` primitive; the provider's theme
 * follows it onto the portal.
 */
export function HelpGuide({ anchor, onClose }: HelpGuideProps) {
  const { rootClassName, rootStyle } = useFeedback()
  return (
    <Popover anchor={anchor} onClose={onClose} label="How feedback works" className={rootClassName} style={rootStyle}>
      <header className="fb-guide__header">
        <h2 className="fb-guide__title">Leaving feedback</h2>
        <button onClick={onClose} aria-label="Close" className="fb-guide__close">
          <CloseIcon />
        </button>
      </header>

      <p className="fb-guide__lead">See something worth flagging? Mark it up right here on the page.</p>

      <ul className="fb-guide__steps">
        <Step icon={<NoteIcon />}>
          <b>Drop a note.</b> Drag the{' '}
          <InlineIcon>
            <NoteIcon />
          </InlineIcon>{' '}
          button onto the page and let go where you want to comment.
        </Step>
        <Step icon={<GripIcon />}>
          <b>Move and describe.</b> Drag the note's top bar to slide it anywhere, and click its text to write down
          what you're flagging.
        </Step>
        <Step icon={<Knob />}>
          <b>Point at it.</b> Drag from a knob on a note's edge to draw an arrow at exactly what you mean. Drag the
          arrowhead to fine-tune, or select it and press Delete.
        </Step>
        <Step icon={<SaveIcon />}>
          <b>Send it in.</b> Notes save in your browser as you go. When you're done, hit{' '}
          <InlineIcon>
            <SaveIcon />
          </InlineIcon>{' '}
          to download them as a file and send it along.
        </Step>
      </ul>
    </Popover>
  )
}

function Step({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="fb-guide__step">
      <span className="fb-guide__step-icon">{icon}</span>
      <span className="fb-guide__step-text">{children}</span>
    </li>
  )
}

/** A dock button shown inline in the text, so its icon is recognisable on the page. */
function InlineIcon({ children }: { children: ReactNode }) {
  return <span className="fb-guide__inline-icon">{children}</span>
}

/** A miniature of a note's border knob, so the guide matches the page. */
function Knob() {
  return <span className="fb-guide__knob" />
}
