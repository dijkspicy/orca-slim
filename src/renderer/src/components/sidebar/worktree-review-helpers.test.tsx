import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ReviewIcon } from './worktree-review-helpers'
import type { WorktreeCardPrDisplay } from './worktree-card-pr-display'

const gitlabReview: WorktreeCardPrDisplay = {
  provider: 'gitlab',
  number: 456,
  title: 'Review me',
  state: 'open',
  status: 'pending'
}

describe('ReviewIcon', () => {
  it('uses the provider-specific GitLab MR icon by default', () => {
    const markup = renderToStaticMarkup(<ReviewIcon review={gitlabReview} className="size-3" />)

    expect(markup).toContain('lucide-git-merge')
  })

  it('can use the generic review icon for compact lanes', () => {
    const markup = renderToStaticMarkup(
      <ReviewIcon review={gitlabReview} className="size-3" variant="generic" />
    )

    expect(markup).toContain('viewBox="0 0 16 16"')
    expect(markup).not.toContain('lucide-git-merge')
  })

  // Why: #13088 — a draft with failing checks must never be painted red like a
  // failing open review; drafts keep the muted state tone.
  it('never paints a draft with a check tone', () => {
    const draft = renderToStaticMarkup(
      <ReviewIcon
        review={{
          provider: 'github',
          number: 1,
          title: 'Draft',
          state: 'draft',
          status: 'failure'
        }}
        className="size-3"
        variant="generic"
      />
    )

    expect(draft).not.toContain('text-rose-500/85')
    expect(draft).toContain('text-muted-foreground/50')
  })

  it('keeps check tones on open reviews so failing checks still stand out', () => {
    const failing = renderToStaticMarkup(
      <ReviewIcon
        review={{ provider: 'github', number: 1, title: 'Open', state: 'open', status: 'failure' }}
        className="size-3"
        variant="generic"
      />
    )

    expect(failing).toContain('text-rose-500/85')
  })

  it('paints merged reviews with the merged state tone', () => {
    const merged = renderToStaticMarkup(
      <ReviewIcon
        review={{ provider: 'github', number: 1, title: 'Merged', state: 'merged' }}
        className="size-3"
        variant="generic"
      />
    )

    expect(merged).toContain('text-purple-600/70')
    expect(merged).not.toContain('text-emerald-500/80')
  })

  // Why: folder cards render a stateless row while a linked review loads or its
  // details fail. There is no state glyph to contradict, so problems must still be
  // visible — but a tone-less row must not be promoted to a passing green.
  it('flags problems on a stateless row without ever claiming success', () => {
    const stateless = (status: 'failure' | 'pending' | 'success') =>
      renderToStaticMarkup(
        <ReviewIcon
          review={{ provider: 'github', number: 1, title: 'Loading PR...', status }}
          className="size-3"
        />
      )

    expect(stateless('failure')).toContain('text-rose-500/85')
    expect(stateless('pending')).toContain('text-amber-500/85')
    expect(stateless('success')).not.toContain('text-emerald-500/80')
  })
})
