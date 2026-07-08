import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  /** `solid` is a standalone chip; `ghost` sits bare inside a toolbar. */
  variant?: 'solid' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  /** The colour a hover / active state pulls toward. */
  tone?: 'accent' | 'success' | 'danger'
  /** Pressed / toggled-on look. */
  active?: boolean
  /** A small count in the corner (hidden when undefined). */
  badge?: number
}

/**
 * The one round control the whole UI is built from — dock chips, review
 * steppers, note actions. Everything but the glyph is a prop, so each
 * caller stays a single expressive line.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, variant = 'ghost', size = 'md', tone = 'accent', active = false, badge, className, ...rest },
  ref,
) {
  const classes = [
    'fb-btn',
    `fb-btn--${variant}`,
    `fb-btn--${size}`,
    `fb-btn--${tone}`,
    active ? 'is-active' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const button = (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  )

  if (badge == null) return button
  return (
    <span className="fb-btn-wrap">
      {button}
      <span className="fb-btn__badge">{badge}</span>
    </span>
  )
})
