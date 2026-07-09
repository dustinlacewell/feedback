import type { ReactNode } from 'react'

export type Lang = 'tsx' | 'ts' | 'bash' | 'css' | 'json'

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function', 'return',
  'type', 'interface', 'extends', 'implements', 'new', 'await', 'async', 'if', 'else',
  'for', 'of', 'in', 'void', 'as', 'typeof', 'class',
])
const CONSTS = new Set(['true', 'false', 'null', 'undefined'])

interface Matcher {
  kind: 'com' | 'str' | 'num' | 'type' | 'word'
  re: RegExp
}

/** Ordered sticky matchers — comments and strings first so their contents aren't re-scanned. */
function matchers(lang: Lang): Matcher[] {
  const m: Matcher[] = []
  if (lang === 'bash') m.push({ kind: 'com', re: /#[^\n]*/y })
  if (lang === 'tsx' || lang === 'ts') m.push({ kind: 'com', re: /\/\/[^\n]*/y })
  if (lang === 'tsx' || lang === 'ts' || lang === 'css') m.push({ kind: 'com', re: /\/\*[\s\S]*?\*\//y })
  m.push({ kind: 'str', re: /`(?:[^`\\]|\\.)*`/y })
  m.push({ kind: 'str', re: /"(?:[^"\\]|\\.)*"/y })
  m.push({ kind: 'str', re: /'(?:[^'\\]|\\.)*'/y })
  if (lang === 'css') m.push({ kind: 'num', re: /#[0-9a-fA-F]{3,8}\b/y })
  if (lang === 'css') m.push({ kind: 'type', re: /--[\w-]+/y })
  m.push({ kind: 'num', re: /\b\d[\w.]*/y })
  m.push({ kind: 'word', re: /[A-Za-z_$][\w$]*/y })
  return m
}

/**
 * A small, dependency-free tokenizer for the languages this site shows.
 * It walks the source once with sticky matchers, so a token is never
 * re-highlighted from inside another — enough for correct, tasteful
 * colour on well-formed snippets, without shipping a full grammar engine.
 */
export function highlight(code: string, lang: Lang = 'tsx'): ReactNode[] {
  const ms = matchers(lang)
  const out: ReactNode[] = []
  let buf = ''
  let key = 0

  const flush = () => {
    if (buf) {
      out.push(buf)
      buf = ''
    }
  }
  const emit = (cls: string, text: string) => {
    flush()
    out.push(
      <span key={key++} className={cls}>
        {text}
      </span>,
    )
  }

  let i = 0
  while (i < code.length) {
    let hit: Matcher | null = null
    let text = ''
    for (const m of ms) {
      m.re.lastIndex = i
      const r = m.re.exec(code)
      if (r) {
        hit = m
        text = r[0]
        break
      }
    }
    if (!hit || !text) {
      buf += code[i]
      i += 1
      continue
    }
    i += text.length
    if (hit.kind === 'word') {
      if (KEYWORDS.has(text)) emit('tok-key', text)
      else if (CONSTS.has(text)) emit('tok-num', text)
      else if (/^[A-Z]/.test(text)) emit('tok-type', text)
      else buf += text
    } else {
      emit(`tok-${hit.kind}`, text)
    }
  }
  flush()
  return out
}
