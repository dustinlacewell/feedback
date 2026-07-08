import { useState } from 'react'

interface CodeBlockProps {
  code: string
  file?: string
}

/** A code window with a title bar and a copy button. Plain text, no runtime highlighter. */
export function CodeBlock({ code, file }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="s-code">
      <div className="s-code__bar">
        <span className="s-code__dot" />
        <span className="s-code__dot" />
        <span className="s-code__dot" />
        {file && <span className="s-code__file">{file}</span>}
        <button className="s-code__copy" onClick={copy} aria-label="Copy code">
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
