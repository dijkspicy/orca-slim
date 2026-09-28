import { describe, expect, it } from 'vitest'
import type { GitHubReaction } from './pr-comment-reactions'
import {
  restoreCommentReaction,
  setCommentReaction,
  setReactionOnSubject
} from './pr-comment-reactions'

type TestComment = {
  id: number
  reactionSubjectId: string
  reactions?: GitHubReaction[]
}

function comment(overrides: Partial<TestComment> = {}): TestComment {
  return {
    id: 1,
    reactionSubjectId: 'IC_1',
    ...overrides
  }
}

describe('setCommentReaction', () => {
  it('adds a viewer reaction in GitHub order', () => {
    expect(
      setCommentReaction(
        comment({ reactions: [{ content: 'heart', count: 2, viewerHasReacted: false }] }),
        '+1',
        true
      ).reactions
    ).toEqual([
      { content: '+1', count: 1, viewerHasReacted: true },
      { content: 'heart', count: 2, viewerHasReacted: false }
    ])
  })

  it('removes the final viewer reaction', () => {
    expect(
      setCommentReaction(
        comment({ reactions: [{ content: 'rocket', count: 1, viewerHasReacted: true }] }),
        'rocket',
        false
      ).reactions
    ).toBeUndefined()
  })

  it('updates only the targeted comment', () => {
    const target = comment({ reactionSubjectId: 'IC_1' })
    const other = comment({ id: 2, reactionSubjectId: 'IC_2' })
    const result = setReactionOnSubject([target, other], 'IC_1', 'eyes', true)

    expect(result[0].reactions).toEqual([{ content: 'eyes', count: 1, viewerHasReacted: true }])
    expect(result[1]).toBe(other)
  })

  it('restores only the failed reaction while preserving concurrent updates', () => {
    const result = restoreCommentReaction(
      comment({
        reactions: [
          { content: 'heart', count: 3, viewerHasReacted: true },
          { content: 'eyes', count: 1, viewerHasReacted: false }
        ]
      }),
      'heart',
      { content: 'heart', count: 2, viewerHasReacted: false }
    )

    expect(result.reactions).toEqual([
      { content: 'heart', count: 2, viewerHasReacted: false },
      { content: 'eyes', count: 1, viewerHasReacted: false }
    ])
  })
})
