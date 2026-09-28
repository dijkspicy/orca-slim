import type { ExecutionHostId } from '../../../shared/execution-host'
import type { GlobalSettings } from '../../../shared/global-settings-types'
import type { OnboardingState } from '../../../shared/onboarding-state-types'
import type { TuiAgent } from '../../../shared/tui-agent'
import type { AgentLaunchRouteStore } from '@/lib/agent-launch-route-input'
import {
  planAgentSessionLaunch,
  type AgentSessionLaunchPlan
} from '@/lib/agent-session-launch-plan'
import { buildAgentStartupPlan } from '@/lib/tui-agent-startup'
import {
  resolveTuiAgentLaunchArgs,
  resolveTuiAgentLaunchEnv
} from '../../../shared/tui-agent-launch-defaults'
import { isTuiAgentEnabled } from '../../../shared/tui-agent-selection'
import type { WorktreeStartupPayload } from '@/lib/worktree-startup-payload'
import { activateAndRevealWorktree } from '@/lib/worktree-activation'
import { beginStructuredAgentSessionProvisionalLaunch } from '@/lib/structured-agent-session-provisional-tab'

type OnboardingFolderAgentStartup = WorktreeStartupPayload

// Why: the shared startup builder was culled with the telemetry graph; the folder onboarding
// launch keeps the same payload shape minus the deleted session-options/telemetry plumbing.
function shouldSeedFolderAgentAfterDismissedOnboarding(
  onboarding: OnboardingState | null,
  hasExistingProject: boolean
): boolean {
  return (
    onboarding?.outcome === 'dismissed' &&
    !hasExistingProject &&
    !onboarding.checklist.addedRepo &&
    !onboarding.checklist.addedFolder
  )
}

function getClientPlatform(): NodeJS.Platform {
  if (navigator.userAgent.includes('Windows')) {
    return 'win32'
  }
  return navigator.userAgent.includes('Mac') ? 'darwin' : 'linux'
}

function buildOnboardingFolderAgentStartup(
  settings: GlobalSettings | null
): OnboardingFolderAgentStartup | undefined {
  const agent = settings?.defaultTuiAgent
  if (
    !settings ||
    !agent ||
    agent === 'blank' ||
    !isTuiAgentEnabled(agent, settings.disabledTuiAgents)
  ) {
    return undefined
  }
  const startupPlan = buildAgentStartupPlan({
    agent,
    prompt: '',
    cmdOverrides: settings.agentCmdOverrides ?? {},
    agentArgs: resolveTuiAgentLaunchArgs(agent, settings.agentDefaultArgs),
    agentEnv: resolveTuiAgentLaunchEnv(agent, settings.agentDefaultEnv),
    platform: getClientPlatform(),
    allowEmptyPromptLaunch: true
  })
  if (!startupPlan) {
    return undefined
  }
  return {
    command: startupPlan.launchCommand,
    ...(startupPlan.env ? { env: startupPlan.env } : {}),
    launchConfig: startupPlan.launchConfig,
    launchAgent: agent,
    ...(startupPlan.startupCommandDelivery
      ? { startupCommandDelivery: startupPlan.startupCommandDelivery }
      : {})
  }
}

export type OnboardingFolderAgentLaunch = {
  agent: TuiAgent | null
  /** Planned before the folder workspace row exists; null when no default agent applies. */
  plan: AgentSessionLaunchPlan | null
  startup?: OnboardingFolderAgentStartup
}

/** Why: lives beside the launch, not the startup builder, because the store root imports that
 *  builder eagerly and the planner's launch graph reaches back to the store root. */
export function resolveDismissedOnboardingFolderAgentLaunch(args: {
  store: AgentLaunchRouteStore
  onboarding: OnboardingState | null
  hasExistingProject: boolean
  executionHostId: string
  nativeChatTranscriptIsLocalReadable?: boolean
}): OnboardingFolderAgentLaunch {
  const startup = (() => {
    if (!shouldSeedFolderAgentAfterDismissedOnboarding(args.onboarding, args.hasExistingProject)) {
      return undefined
    }
    return buildOnboardingFolderAgentStartup(args.store.settings ?? null)
  })()
  const agent = startup?.launchAgent ?? null
  if (!startup || !agent) {
    return { agent: null, plan: null }
  }
  const plan = planAgentSessionLaunch(args.store, {
    agent,
    workspace: { kind: 'folder', executionHostId: args.executionHostId },
    initialSessionOptions: startup.sessionOptions
  })
  return {
    agent,
    plan,
    ...(plan.route === 'structured-native-chat' ? {} : { startup })
  }
}

/** Reveal a folder just added after dismissed onboarding and start its default agent on the
 *  planned route. Both add-folder paths (local store action, SSH dialog) share this; the store
 *  path must import it lazily because the launch graph reaches the store root. */
export async function revealOnboardingFolderWithAgentLaunch(args: {
  worktreeId: string
  executionHostId: ExecutionHostId | undefined
  launch: OnboardingFolderAgentLaunch
}): Promise<void> {
  const reveal = (
    startup: OnboardingFolderAgentStartup | undefined,
    providesInitialSurface = false
  ) =>
    activateAndRevealWorktree(args.worktreeId, {
      sidebarRevealBehavior: 'auto',
      ...(args.executionHostId ? { executionHostId: args.executionHostId } : {}),
      ...(startup ? { startup } : {}),
      ...(providesInitialSurface ? { providesInitialSurface: true } : {})
    })
  const { plan } = args.launch
  const structured = plan?.route === 'structured-native-chat'
  if (!structured) {
    reveal(args.launch.startup)
    return
  }
  beginStructuredAgentSessionProvisionalLaunch({
    plan,
    hooks: {},
    target: { worktreeId: args.worktreeId },
    beforeOpen: () => reveal(undefined, true) !== false
  })
}
