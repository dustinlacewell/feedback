import type { EdgeTarget } from './document'

const MAX_DEPTH = 8
const MAX_TEXT = 120

/**
 * Describe the page element an arrowhead lands on, so it can be
 * identified later without the picture: a CSS path carrying every class
 * at each level, plus a short text excerpt. Feedback UI (tagged
 * `data-feedback`) is skipped, so an arrow addresses the content beneath
 * it, never the overlay itself.
 */
export function describeTarget(clientX: number, clientY: number): EdgeTarget | null {
  const el = topPageElement(clientX, clientY)
  return el ? { selector: cssPath(el), text: excerpt(el) } : null
}

function topPageElement(x: number, y: number): Element | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (!el.closest('[data-feedback]') && el !== document.documentElement && el !== document.body) {
      return el
    }
  }
  return null
}

function cssPath(el: Element): string {
  const parts: string[] = []
  let node: Element | null = el
  while (node && node !== document.body && node !== document.documentElement && parts.length < MAX_DEPTH) {
    parts.unshift(describeNode(node))
    node = node.parentElement
  }
  return parts.join(' > ')
}

function describeNode(el: Element): string {
  const id = el.id ? `#${esc(el.id)}` : ''
  const classes = Array.from(el.classList)
    .map((c) => `.${esc(c)}`)
    .join('')
  return `${el.tagName.toLowerCase()}${id}${classes}${nthOfType(el)}`
}

/** Disambiguate among same-tag siblings, so the path resolves to one element. */
function nthOfType(el: Element): string {
  const siblings = el.parentElement
    ? Array.from(el.parentElement.children).filter((c) => c.tagName === el.tagName)
    : []
  return siblings.length < 2 ? '' : `:nth-of-type(${siblings.indexOf(el) + 1})`
}

function excerpt(el: Element): string | null {
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return null
  return text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}…` : text
}

function esc(value: string): string {
  return window.CSS?.escape ? window.CSS.escape(value) : value
}
