import type { ReactNode } from 'react'
import { Link, useRouter } from '../../router'
import { GettingStarted } from './GettingStarted'
import { GivingFeedback } from './GivingFeedback'
import { Reviewing } from './Reviewing'
import { ScrollPanes } from './ScrollPanes'
import { RouterIntegration } from './RouterIntegration'
import { Submitting } from './Submitting'
import { Theming } from './Theming'
import { ApiReference } from './ApiReference'
import { FileFormat } from './FileFormat'

/**
 * The docs shell: a grouped sidebar and one page of content, resolved
 * from the path. Adding a page is one entry here plus its component.
 */

interface DocPage {
  slug: string
  title: string
  render: () => ReactNode
}

const GROUPS: { label: string; pages: DocPage[] }[] = [
  {
    label: 'Start here',
    pages: [{ slug: '', title: 'Getting started', render: () => <GettingStarted /> }],
  },
  {
    label: 'Using the overlay',
    pages: [
      { slug: 'giving-feedback', title: 'Giving feedback', render: () => <GivingFeedback /> },
      { slug: 'reviewing', title: 'Reviewing feedback', render: () => <Reviewing /> },
    ],
  },
  {
    label: 'Guide',
    pages: [
      { slug: 'scroll-panes', title: 'Scroll panes & sections', render: () => <ScrollPanes /> },
      { slug: 'router', title: 'Router integration', render: () => <RouterIntegration /> },
      { slug: 'submitting', title: 'Submitting to a server', render: () => <Submitting /> },
      { slug: 'theming', title: 'Theming', render: () => <Theming /> },
    ],
  },
  {
    label: 'Reference',
    pages: [
      { slug: 'api', title: 'API', render: () => <ApiReference /> },
      { slug: 'file-format', title: 'The feedback file', render: () => <FileFormat /> },
    ],
  },
]

const ALL_PAGES = GROUPS.flatMap((g) => g.pages)

export function Docs() {
  const { path } = useRouter()
  const slug = path.replace(/^\/docs\/?/, '').replace(/\/$/, '')
  const page = ALL_PAGES.find((p) => p.slug === slug) ?? ALL_PAGES[0]

  return (
    <section className="s-section">
      <div className="s-container s-docs">
        <aside className="s-docs__nav">
          {GROUPS.map((group) => (
            <div key={group.label} className="s-docs__group">
              <span className="s-docs__group-label">{group.label}</span>
              {group.pages.map((p) => (
                <Link
                  key={p.slug}
                  to={p.slug ? `/docs/${p.slug}` : '/docs'}
                  className={`s-docs__link ${p === page ? 'is-active' : ''}`}
                >
                  {p.title}
                </Link>
              ))}
            </div>
          ))}
        </aside>
        <main className="s-docs__body s-prose">{page.render()}</main>
      </div>
    </section>
  )
}
