import type { TuiAgent } from '../../../shared/tui-agent'
import type { StartupCommandDelivery } from '../../../shared/codex-startup-delivery'
import type {
  AgentProviderSessionMetadata,
  SleepingAgentLaunchConfig
} from '../../../shared/agent-session-resume'

/**
 * Mirrors the launch-site fields main used to report as `agent_started` (agent kind, launch
 * surface, request kind, onboarding cohort). The telemetry sink is gone; the launch sites still
 * thread the triple so any future reporter keeps one shape.
 */
export type AgentStartedTelemetry = {
  agent_kind:
    | 'claude-code'
    | 'claude-agent-teams'
    | 'openclaude'
    | 'codex'
    | 'autohand'
    | 'opencode'
    | 'opencode2'
    | 'mimo-code'
    | 'pi'
    | 'omp'
    | 'prime-agent'
    | 'gemini'
    | 'antigravity'
    | 'aider'
    | 'goose'
    | 'amp'
    | 'kilo'
    | 'kiro'
    | 'crush'
    | 'aug'
    | 'cline'
    | 'codebuff'
    | 'command-code'
    | 'continue'
    | 'cursor'
    | 'droid'
    | 'kimi'
    | 'mistral-vibe'
    | 'qwen-code'
    | 'rovo'
    | 'hermes'
    | 'openclaw'
    | 'copilot'
    | 'grok'
    | 'devin'
    | 'ante'
    | 'trae'
    | 'muse'
    | 'zcode'
    | 'other'
  launch_source:
    | 'command_palette'
    | 'sidebar'
    | 'quick_command'
    | 'tab_bar_quick_launch'
    | 'task_page'
    | 'new_workspace_composer'
    | 'workspace_jump_palette'
    | 'shortcut'
    | 'onboarding'
    | 'diff_notes_send'
    | 'notes_send'
    | 'conflict_resolution'
    | 'source_control_recovery'
    | 'terminal_context_menu'
    | 'unknown'
  request_kind: 'new' | 'resume' | 'followup'
  nth_repo_added?: number
}

/** Startup command threaded onto a worktree's first terminal at activation. */
export type WorktreeStartupPayload = {
  command: string
  env?: Record<string, string>
  launchConfig?: SleepingAgentLaunchConfig
  resumeProviderSession?: AgentProviderSessionMetadata
  launchToken?: string
  launchAgent?: TuiAgent
  draftPrompt?: string
  /**
   * The unsent launch context, for the initial view-mode decision ONLY.
   *
   * Deliberately separate from `draftPrompt`, which drives the bracketed paste
   * in pty-connection: an argv-prefill launch already carries the draft inside
   * `command`, so reusing `draftPrompt` here would paste it a second time.
   * Set this on every draft launch; set `draftPrompt` only for paste delivery.
   */
  launchDraftText?: string
  startupCommandDelivery?: StartupCommandDelivery
  initialAgentStatus?: { agent: TuiAgent; prompt: string }
  sessionOptions?: Record<string, string | boolean>
  telemetry?: AgentStartedTelemetry
}

/**
 * The unsent launch context a startup payload carries, whichever way the agent
 * receives it: argv prefill sets only `launchDraftText`, post-ready paste sets
 * `draftPrompt`. Gating on `draftPrompt` alone silently misses every
 * argv-prefill launch.
 */
export function resolveStartupLaunchDraftText(
  startup: Pick<WorktreeStartupPayload, 'draftPrompt' | 'launchDraftText'> | undefined
): string | undefined {
  return startup?.draftPrompt ?? startup?.launchDraftText
}

/** Shared by both tab-creation sites so the draft gate can't drift between them. */
export function draftViewModeProps(draftText: string | undefined): {
  promptDelivery?: 'draft'
  launchDraftText?: string
} {
  return draftText == null ? {} : { promptDelivery: 'draft', launchDraftText: draftText }
}
