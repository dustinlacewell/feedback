import { useState } from 'react'
import {
  CheckGlyph,
  CloseGlyph,
  EyeGlyph,
  FbBtn,
  FirstGlyph,
  GripGlyph,
  LastGlyph,
  NextGlyph,
  PrevGlyph,
  Stage,
  TrashGlyph,
} from './kit'

/*
 * A working replica of review mode: the stepper bar over a hand of sample
 * notes. Everything is wired — navigate, resolve, delete, include-resolved
 * — so the reader can feel the triage loop before installing anything.
 * The close button resets the demo instead of exiting.
 */

interface SampleNote {
  id: string
  page: string
  text: string
}

const SAMPLE: SampleNote[] = [
  { id: 'n1', page: '/', text: 'Logo could be 20% bigger at this width.' },
  { id: 'n2', page: '/pricing', text: 'This CTA is unclear — start what, exactly?' },
  { id: 'n3', page: '/pricing', text: 'Table overflows on mobile.' },
  { id: 'n4', page: '/about', text: 'Love this section. Ship it.' },
]

export function ReviewDemo() {
  const [notes, setNotes] = useState(SAMPLE)
  const [resolved, setResolved] = useState<ReadonlySet<string>>(new Set())
  const [includeResolved, setIncludeResolved] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(SAMPLE[0].id)

  // The walk order: unresolved notes, plus resolved ones when the eye is
  // on. The current note always stays walkable so resolving it in place
  // doesn't strand the stepper.
  const order = notes.filter((n) => includeResolved || !resolved.has(n.id) || n.id === currentId)
  const pos = order.findIndex((n) => n.id === currentId)
  const current = pos >= 0 ? order[pos] : null

  const empty = order.length === 0
  const atStart = empty || pos === 0
  const atEnd = empty || pos === order.length - 1
  const count = empty ? 'no notes' : `${pos + 1} / ${order.length}`

  const go = (i: number) => {
    const n = order[Math.min(Math.max(i, 0), order.length - 1)]
    if (n) setCurrentId(n.id)
  }

  const resolveCurrent = () => {
    if (!current) return
    const next = new Set(resolved)
    if (next.has(current.id)) next.delete(current.id)
    else next.add(current.id)
    setResolved(next)
  }

  const deleteCurrent = () => {
    if (!current) return
    const neighbor = order[pos + 1]?.id ?? order[pos - 1]?.id ?? null
    setNotes((ns) => ns.filter((n) => n.id !== current.id))
    setCurrentId(neighbor)
  }

  const reset = () => {
    setNotes(SAMPLE)
    setResolved(new Set())
    setIncludeResolved(false)
    setCurrentId(SAMPLE[0].id)
  }

  return (
    <Stage>
      <div className="s-reviewdemo">
        <div className="fb-toolbar fb-reviewbar" role="toolbar" aria-label="Review demo">
          <FbBtn onClick={() => go(0)} disabled={atStart} title="First note">
            <FirstGlyph />
          </FbBtn>
          <FbBtn onClick={() => go(pos - 1)} disabled={atStart} title="Previous note">
            <PrevGlyph />
          </FbBtn>

          <span className="fb-reviewbar__count">{count}</span>

          <FbBtn onClick={() => go(pos + 1)} disabled={atEnd} title="Next note">
            <NextGlyph />
          </FbBtn>
          <FbBtn onClick={() => go(order.length - 1)} disabled={atEnd} title="Last note">
            <LastGlyph />
          </FbBtn>

          <span className="fb-toolbar__divider" />

          <FbBtn
            tone="success"
            active={current != null && resolved.has(current.id)}
            onClick={resolveCurrent}
            disabled={!current}
            title={current && resolved.has(current.id) ? 'Reopen this note' : 'Resolve this note'}
          >
            <CheckGlyph />
          </FbBtn>
          <FbBtn tone="danger" onClick={deleteCurrent} disabled={!current} title="Delete this note">
            <TrashGlyph />
          </FbBtn>

          <span className="fb-toolbar__divider" />

          <FbBtn
            active={includeResolved}
            onClick={() => setIncludeResolved((v) => !v)}
            title={includeResolved ? 'Including resolved notes' : 'Skipping resolved notes'}
          >
            <EyeGlyph />
          </FbBtn>
          <FbBtn onClick={reset} title="Reset the demo">
            <CloseGlyph />
          </FbBtn>
        </div>

        {notes.length > 0 ? (
          <div className="s-reviewdemo__cards">
            {notes.map((n) => {
              const classes = [
                'fb-note',
                n.id === currentId ? 'fb-note--current' : '',
                resolved.has(n.id) ? 'fb-note--resolved' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <div key={n.id} className={classes} role="button" tabIndex={0} onClick={() => setCurrentId(n.id)} onKeyDown={(e) => e.key === 'Enter' && setCurrentId(n.id)}>
                  <header className="fb-note__header">
                    <GripGlyph />
                    <span className="s-reviewdemo__page">{n.page}</span>
                    {resolved.has(n.id) && (
                      <span className="s-reviewdemo__done">
                        <CheckGlyph />
                      </span>
                    )}
                  </header>
                  <div className="s-reviewdemo__text">{n.text}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <button type="button" className="s-restore s-restore--static" onClick={reset}>
            all notes deleted — restore the sample
          </button>
        )}
      </div>
    </Stage>
  )
}
