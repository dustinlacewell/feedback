import type { HTMLAttributes, ReactNode } from 'react'

interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/** A floating, blurred pill that groups a row of controls. */
export function Toolbar({ children, className, ...rest }: ToolbarProps) {
  return (
    <div className={['fb-toolbar', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}

/** A hairline separator between groups of toolbar controls. */
export function ToolbarDivider() {
  return <span className="fb-toolbar__divider" />
}
