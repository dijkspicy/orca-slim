import { toast } from 'sonner'
import type { AiVaultSession } from '../../../shared/ai-vault-types'
import { translate } from '@/i18n/i18n'
import { activateAndRevealWorktree } from './worktree-activation'
import { activateStructuredAgentSessionById } from './structured-agent-session-tab-activation'
import { useAppStore } from '@/store'

/** Why: republishing a chat from a host record rode on the culled mirror, so
 *  activation now only opens a tab this renderer already carries; the toast is
 *  what tells the user when it does not. */
export async function activateAiVaultStructuredSession(
  session: Pick<AiVaultSession, 'structuredSession'>
): Promise<boolean> {
  const structured = session.structuredSession
  if (!structured) {
    return false
  }
  const target = { worktreeId: structured.workspaceId, sessionId: structured.sessionId }
  if (!activateStructuredAgentSessionById(target)) {
    toast.error(
      translate(
        'auto.lib.activateAiVaultStructuredSession.unavailable',
        'The structured agent session is not available yet. Retry in a moment.'
      )
    )
    return true
  }
  if (useAppStore.getState().activeWorktreeId !== structured.workspaceId) {
    activateAndRevealWorktree(structured.workspaceId)
  }
  return true
}
