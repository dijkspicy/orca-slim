import type {
  AiVaultPrepareSessionResumeArgs,
  AiVaultPrepareSessionResumeResult
} from '../../shared/ai-vault-resume-preparation'
import { prepareLegacySharedCodexSessionResume } from './codex-legacy-session-resume'

/** Structural slice of the runtime home service this resume gate needs. */
type CodexAiVaultRuntimeHome = {
  isHostSystemDefaultRealHome: (launchEnv?: NodeJS.ProcessEnv) => boolean
  resolveSelectedHostAccountCodexHomePathForResume: () => string | null
}

/** Keeps window and serve AI Vault resumes behind the same refusing account-home gate. */
export function prepareCodexAiVaultSessionResume(
  args: AiVaultPrepareSessionResumeArgs,
  options: {
    runtimeHome: CodexAiVaultRuntimeHome | null
    systemCodexHomePath: string | undefined
  }
): Promise<AiVaultPrepareSessionResumeResult> {
  return prepareLegacySharedCodexSessionResume(args, {
    isHostSystemDefaultRealHome: () => options.runtimeHome?.isHostSystemDefaultRealHome() === true,
    getSelectedHostAccountCodexHomePath: () =>
      options.runtimeHome?.resolveSelectedHostAccountCodexHomePathForResume() ?? null,
    systemCodexHomePath: options.systemCodexHomePath
  })
}
