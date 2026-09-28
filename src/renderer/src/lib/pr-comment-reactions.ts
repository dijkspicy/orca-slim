// Why: the shared GitHub comment types were culled; these structural shapes keep the reaction
// contract the surviving comment UI still calls.
export type GitHubReactionContent =
  | '+1'
  | '-1'
  | 'laugh'
  | 'confused'
  | 'heart'
  | 'hooray'
  | 'rocket'
  | 'eyes'

export type GitHubReaction = {
  content: GitHubReactionContent
  count: number
  viewerHasReacted: boolean
}

type ReactableComment = {
  reactionSubjectId: string
  reactions?: GitHubReaction[]
}

export const GITHUB_REACTION_ORDER: readonly GitHubReactionContent[] = [
  '+1',
  '-1',
  'laugh',
  'confused',
  'heart',
  'hooray',
  'rocket',
  'eyes'
]

function sortReactions(reactions: GitHubReaction[]): GitHubReaction[] {
  return reactions.sort(
    (left, right) =>
      GITHUB_REACTION_ORDER.indexOf(left.content) - GITHUB_REACTION_ORDER.indexOf(right.content)
  )
}

export function setCommentReaction<T extends ReactableComment>(
  comment: T,
  content: GitHubReactionContent,
  reacted: boolean
): T {
  const reactions = comment.reactions ?? []
  const current = reactions.find((reaction) => reaction.content === content)
  if (Boolean(current?.viewerHasReacted) === reacted) {
    return comment
  }

  const nextCount = Math.max(0, (current?.count ?? 0) + (reacted ? 1 : -1))
  const nextReaction: GitHubReaction = {
    content,
    count: nextCount,
    viewerHasReacted: reacted
  }
  const nextReactions = sortReactions(
    reactions
      .filter((reaction) => reaction.content !== content)
      .concat(nextCount > 0 ? nextReaction : [])
  )

  return { ...comment, reactions: nextReactions.length > 0 ? nextReactions : undefined }
}

export function restoreCommentReaction<T extends ReactableComment>(
  comment: T,
  content: GitHubReactionContent,
  previousReaction?: GitHubReaction
): T {
  const reactions = sortReactions([
    ...(comment.reactions ?? []).filter((reaction) => reaction.content !== content),
    ...(previousReaction ? [previousReaction] : [])
  ])
  return { ...comment, reactions: reactions.length > 0 ? reactions : undefined }
}

export function setReactionOnSubject<T extends ReactableComment>(
  comments: readonly T[],
  reactionSubjectId: string,
  content: GitHubReactionContent,
  reacted: boolean
): T[] {
  return comments.map((comment) =>
    comment.reactionSubjectId === reactionSubjectId
      ? setCommentReaction(comment, content, reacted)
      : comment
  )
}

export function restoreReactionOnSubject<T extends ReactableComment>(
  comments: readonly T[],
  reactionSubjectId: string,
  content: GitHubReactionContent,
  previousReaction?: GitHubReaction
): T[] {
  return comments.map((comment) =>
    comment.reactionSubjectId === reactionSubjectId
      ? restoreCommentReaction(comment, content, previousReaction)
      : comment
  )
}
