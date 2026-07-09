<div align="center">

# 💬 feedback

**Drag-and-drop feedback, right on your live React page.**

Reviewers drop sticky notes onto the running app, draw arrows at exactly what they mean, and send it all back as one JSON file. A built-in review mode steps through every note.

[![npm](https://img.shields.io/npm/v/@ldlework/feedback?color=%23e6a817&label=npm)](https://www.npmjs.com/package/@ldlework/feedback)
[![license](https://img.shields.io/npm/l/@ldlework/feedback?color=%23e6a817)](./LICENSE)
[![types](https://img.shields.io/npm/types/@ldlework/feedback?color=%23e6a817)](https://www.npmjs.com/package/@ldlework/feedback)
![react](https://img.shields.io/badge/React-18%20%7C%2019-%23e6a817)

**[Live demo](https://feedback.ldlework.com)** · **[Docs](https://feedback.ldlework.com/docs)** · **[npm](https://www.npmjs.com/package/@ldlework/feedback)**

</div>

---

`@ldlework/feedback` is a drop-in annotation overlay for React. Mount one provider and one component and a dock appears in the corner: drag a note onto the page, type what you're flagging, and draw an arrow at any element on the page. Notes save to `localStorage` as you go and export to a single file — arrows carry a CSS path to their target so a developer can find it without the picture.

- 🎯 **Drag to annotate** — drop notes anywhere, draw arrows from a note's edge straight at what you mean.
- 📐 **Pinned to content** — positions are stored in *content coordinates*, so notes stay glued to your layout across every window size.
- 🧱 **Inner scroll panes** — wrap a pane's content in a region so notes scroll and clip with it, not just the window.
- 🧭 **Review mode** — step through every note; it routes to the right page and section and scrolls it into view.
- 🎨 **Themeable** — one stylesheet, every colour a CSS variable; re-skin it all from a single `--fb-hue`.
- 💾 **Save to a file** — export/import one JSON document; nothing leaves the browser unless you send it.
- 📮 **Submit to a server** — point `submit` at an endpoint (or hand it a function) and the dock grows a send button.
- 🪶 **Zero runtime dependencies** — ships ESM + types, router-agnostic, no CSS framework required.

## Install

```bash
pnpm add @ldlework/feedback
# npm i @ldlework/feedback  ·  yarn add @ldlework/feedback
```

`react` and `react-dom` (v18 or v19) are peer dependencies. Import the stylesheet once, anywhere in your app:

```ts
import '@ldlework/feedback/styles.css'
```

## Quick start

Wrap your tree in `FeedbackProvider` and mount `FeedbackLayer` once inside it. On a page that scrolls the window, that's the entire integration.

```tsx
import { FeedbackProvider, FeedbackLayer } from '@ldlework/feedback'
import '@ldlework/feedback/styles.css'

export function App() {
  return (
    <FeedbackProvider>
      <YourApp />
      <FeedbackLayer />
    </FeedbackProvider>
  )
}
```

## Inner scroll & sections

When your content scrolls inside a panel rather than the window, wrap that content in a `<FeedbackRegion>` — inside whatever scroll container you already have. Notes then live in the region: they ride along with the scroll and clip with the pane.

```tsx
import { FeedbackRegion } from '@ldlework/feedback'

function DocumentPane() {
  return (
    <div style={{ overflow: 'auto', height: '100vh' }}>
      <FeedbackRegion anchorX="left">
        {/* content */}
      </FeedbackRegion>
    </div>
  )
}
```

A `section` is an optional sub-scope of a page — notes tagged with one only show while that section is active, so a carousel step or tab doesn't leak its notes onto its siblings. Provide `onReveal` so review can switch to a section before it scrolls to a note:

```tsx
<FeedbackRegion section={currentStepId} onReveal={(stepId) => goToStep(stepId)}>
  {steps[currentStepId]}
</FeedbackRegion>
```

## Submitting to a server

By default feedback leaves the browser only as a downloaded file. Give the provider a `submit` target and the dock adds a send button that delivers the document over the network instead — the button reports sending, sent, and failure states, and file export stays available alongside it.

An endpoint URL is the whole integration — the document is POSTed there as JSON with a `submittedAt` timestamp:

```tsx
<FeedbackProvider submit="https://api.example.com/feedback">
```

Need auth headers or a different method? Build the submitter with `endpointSubmitter`:

```tsx
import { endpointSubmitter } from '@ldlework/feedback'

<FeedbackProvider
  submit={endpointSubmitter('https://api.example.com/feedback', {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  })}
>
```

Or supply any `(doc: FeedbackDoc) => Promise<void>` for full control — an SDK call, a queue, whatever. Throw (or reject) to signal failure; the dock shows the error state and the reviewer can retry.

## The coordinate model

A note remembers where it belongs in the **content**, not on the screen. Its `y` is measured from the top of the content; its `x` is measured from an **anchor line** chosen by `anchorX`:

- **`left`** — x from the content's left edge (absolute).
- **`center`** *(default)* — x signed from the horizontal centre line, so a note dropped on a centred column stays glued to it as the window narrows.
- **`right`** — x from the content's right edge.

Because positions are stored this way, they survive a resize the way the content itself does. A **region** is the element those coordinates live in — the document/viewport by default, or the content you wrapped in a `<FeedbackRegion>`.

## Router integration

Review mode walks notes across pages. With no configuration it reads `location.pathname` and navigates through the History API. If you use a router, hand it an adapter:

```tsx
import { useMemo } from 'react'
import { FeedbackProvider, type FeedbackNavigation } from '@ldlework/feedback'
import { useLocation, useNavigate } from 'react-router-dom'

function Providers({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const navigation = useMemo<FeedbackNavigation>(
    () => ({ page: pathname, navigate: (to) => navigate(to) }),
    [pathname, navigate],
  )
  return <FeedbackProvider navigation={navigation}>{children}</FeedbackProvider>
}
```

## Theming

Every class is `fb-` prefixed and every colour is a `--fb-*` custom property scoped to `.fb-root`, so nothing leaks in or out. Re-skin the whole overlay from one knob:

```css
/* Shift the accent and the chrome together to a cool blue. */
.fb-root { --fb-hue: 220; }
```

Or override individual tokens:

```css
.fb-root {
  --fb-accent: #7c5cff;
  --fb-accent-contrast: #ffffff;
  --fb-surface-overlay: #1b1b2b;
  --fb-radius: 10px;
}
```

You can also scope a theme to one provider — `className` and `style` are applied to every portal root, including the ones the overlay teleports to.

Key tokens: `--fb-hue`, `--fb-accent`, `--fb-accent-hover`, `--fb-accent-contrast`, `--fb-surface`, `--fb-surface-raised`, `--fb-surface-overlay`, `--fb-surface-sunken`, `--fb-border`, `--fb-border-strong`, `--fb-text`, `--fb-text-secondary`, `--fb-text-muted`, `--fb-success`, `--fb-danger`, `--fb-radius`, `--fb-shadow`, `--fb-font`.

## API

### `<FeedbackProvider>`

| Prop | Type | Default — description |
| --- | --- | --- |
| `storageKey` | `string` | `"feedback"` — localStorage key the document is saved under. |
| `fileName` | `string` | `"feedback.json"` — suggested name for exported files. |
| `navigation` | `FeedbackNavigation` | History-API adapter — `{ page, navigate }` for router integration. |
| `submit` | `string \| FeedbackSubmitter` | Unset — an endpoint URL (document POSTed as JSON) or a custom async submitter; adds a send button to the dock. |
| `defaultAnchorX` | `AnchorX` | `"center"` — x anchoring for pages that mount no region. |
| `className` | `string` | Extra class on every portal root — e.g. a theme scope. |
| `style` | `CSSProperties` | CSS-variable overrides applied to every portal root. |

### `<FeedbackRegion>`

| Prop | Type | Description |
| --- | --- | --- |
| `anchorX` | `'left' \| 'center' \| 'right'` | How x is anchored within this region. |
| `section` | `string \| null` | A sub-scope so notes on one view don't leak onto siblings. |
| `onReveal` | `(section: string) => void` | How review reveals a section before scrolling to a note. |
| `className`, `style` | | Applied to the wrapper element (`position` is reserved). |

### Also exported

`FeedbackLayer` (the overlay, no props) · types `FeedbackProviderProps`, `FeedbackRegionProps`, `FeedbackNavigation`, `FeedbackSubmitter`, `EndpointOptions`, `AnchorX`, `Region`, `FeedbackNote`, `FeedbackEdge`, `FeedbackDoc`, `EdgeTarget`, `Port` · helpers `endpointSubmitter(url, options)`, `normalizeDoc(json)`, and `EMPTY_DOC` for reading an untrusted file back into a document.

## File format

Export writes one JSON file — an `exportedAt` timestamp plus the notes and edges. Each arrow carries a `target` (a CSS path and a text excerpt of the element it points at):

```json
{
  "exportedAt": "2026-07-08T12:00:00.000Z",
  "notes": [
    { "id": "…", "page": "/pricing", "section": null,
      "x": -120, "y": 480, "text": "This CTA is unclear", "resolved": false }
  ],
  "edges": [
    { "id": "…", "page": "/pricing", "section": null, "noteId": "…",
      "port": "right", "x": 40, "y": 500,
      "target": { "selector": "section.hero > button.cta", "text": "Start free" } }
  ]
}
```

## Contributing

This is a pnpm workspace: the library at the root, the demo site in `site/`.

```bash
pnpm install
pnpm build                      # build the library (tsup → dist/)
pnpm --filter feedback-site dev # run the demo + docs site
```

The site builds the library straight from source, so there's no build-then-run dance during development.

## License

MIT © [Dustin Lacewell](https://github.com/dustinlacewell)
