/**
 * A decorative sticky note pinned in the hero, arrow drawn at the
 * headline — a still frame of what the overlay does, always on. It mimics
 * the real note's chrome but isn't wired to the document, so it's present
 * on every load and never moves.
 */
export function HeroNote() {
  return (
    <div className="s-heronote" aria-hidden>
      <div className="s-heronote__card">
        <div className="s-heronote__bar">
          <span className="s-heronote__grip">
            <i /> <i /> <i /> <i /> <i /> <i />
          </span>
        </div>
        <p className="s-heronote__body">
          Drop a note, point it at <b>anything</b> on the page — like this headline.
        </p>
      </div>
      <svg className="s-heronote__arrow" viewBox="0 0 140 118" fill="none" aria-hidden>
        <defs>
          <marker id="heronote-head" markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="currentColor" />
          </marker>
        </defs>
        <path
          d="M126 10 C 96 58 66 74 26 100"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#heronote-head)"
        />
      </svg>
    </div>
  )
}
