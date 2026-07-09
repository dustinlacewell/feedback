import { CodeBlock } from '../../components/CodeBlock'

const THEME_HUE = `/* One knob shifts the accent and the chrome together. */
.fb-root { --fb-hue: 220; }         /* cool blue */`

const THEME_TOKENS = `/* Or override individual tokens. */
.fb-root {
  --fb-accent: #7c5cff;
  --fb-accent-contrast: #fff;
  --fb-surface-overlay: #1b1b2b;
  --fb-radius: 10px;
}`

const THEME_SCOPED = `// Per-instance theme, applied to every portal root.
<FeedbackProvider style={{ ['--fb-hue' as string]: 320 }}>
  ...
</FeedbackProvider>`

export function Theming() {
  return (
    <>
      <h1>Theming</h1>
      <p>
        The overlay is one self-contained stylesheet. Every class is <code>fb-</code> prefixed and every colour is a{' '}
        <code>--fb-*</code> custom property scoped to <code>.fb-root</code>, so nothing leaks in or out. Re-skin the
        whole thing from one knob:
      </p>
      <CodeBlock code={THEME_HUE} file="theme.css" lang="css" />
      <p>Or override any individual token:</p>
      <CodeBlock code={THEME_TOKENS} file="theme.css" lang="css" />
      <p>
        You can also scope a theme to one provider — the <code>className</code> and <code>style</code> props are
        applied to every portal root, including the ones the overlay teleports to.
      </p>
      <CodeBlock code={THEME_SCOPED} file="App.tsx" />
      <p>
        Key tokens: <code>--fb-hue</code>, <code>--fb-accent</code>, <code>--fb-accent-hover</code>,{' '}
        <code>--fb-accent-contrast</code>, <code>--fb-surface</code>, <code>--fb-surface-raised</code>,{' '}
        <code>--fb-surface-overlay</code>, <code>--fb-surface-sunken</code>, <code>--fb-border</code>,{' '}
        <code>--fb-border-strong</code>, <code>--fb-text</code>, <code>--fb-text-secondary</code>,{' '}
        <code>--fb-text-muted</code>, <code>--fb-success</code>, <code>--fb-danger</code>, <code>--fb-radius</code>,{' '}
        <code>--fb-shadow</code>, <code>--fb-font</code>.
      </p>
    </>
  )
}
