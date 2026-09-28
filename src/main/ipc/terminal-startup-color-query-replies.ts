import { parsePtyStartupIngressIntent } from '../../shared/pty-startup-ingress-intent'
import { recognizeAgentProcessFromCommandLine } from '../../shared/agent-process-recognition'
import { isTuiAgent } from '../../shared/tui-agent-config'
import type { SleepingAgentLaunchConfig } from '../../shared/agent-session-resume'
import {
  terminalOscColorQueryReply,
  type TerminalOscColorQueryReplyColors
} from '../../shared/terminal-osc-color-reply'

function normalizeTerminalColorQueryReplyColors(
  value: unknown
): TerminalOscColorQueryReplyColors | null {
  if (!value || typeof value !== 'object') {
    return null
  }
  const record = value as { foreground?: unknown; background?: unknown }
  const colors = {
    ...(typeof record.foreground === 'string' ? { foreground: record.foreground } : {}),
    ...(typeof record.background === 'string' ? { background: record.background } : {})
  }
  if (!terminalOscColorQueryReply(colors, 10) || !terminalOscColorQueryReply(colors, 11)) {
    return null
  }
  return colors
}

function shouldReplyToStartupTerminalColorQueries(args: {
  launchAgent?: unknown
  command?: string
  launchConfig?: SleepingAgentLaunchConfig
}): boolean {
  if (isTuiAgent(args.launchAgent)) {
    return true
  }
  const command = args.launchConfig?.agentCommand?.trim() || args.command?.trim() || ''
  return recognizeAgentProcessFromCommandLine(command) !== null
}

export function getStartupTerminalIngressIntent(args: {
  launchAgent?: unknown
  command?: string
  launchConfig?: SleepingAgentLaunchConfig
  terminalColorQueryReplies?: unknown
  terminalKittyKeyboardProtocol?: boolean
}) {
  if (!shouldReplyToStartupTerminalColorQueries(args)) {
    return undefined
  }
  return parsePtyStartupIngressIntent({
    colors: normalizeTerminalColorQueryReplyColors(args.terminalColorQueryReplies) ?? {},
    kittyKeyboardProtocol: args.terminalKittyKeyboardProtocol,
    deadlineMs: 5_000
  })
}
