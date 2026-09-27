# SCC delete plan (generated)

> generated from HEAD by /tmp/opencode/scc-plan.mjs

## Delete-set

| domain | files |
| --- | --- |
| renderer-mirror | 2325 |
| remote-host | 1096 |
| agent-stack | 805 |
| browser | 542 |
| shared | 523 |
| forge-task | 493 |
| ai-vault | 412 |
| already-done | 201 |
| telemetry-stack | 111 |
| automations | 73 |
| computer | 64 |
| cloud-profiles | 44 |
| ephemeral-vm | 21 |
| artifacts | 13 |
| **total** | **6723** |

## Keep-side call sites (non-test)

| file | domains | specifiers |
| --- | --- | --- |
| `src/cli/artifact-format.ts` | shared | `../shared/artifacts` |
| `src/cli/automation-destination.ts` | shared | `../shared/ssh-types` |
| `src/cli/cli-error.ts` | shared | `../shared/computer-use-error-recovery` |
| `src/cli/handlers/account.ts` | agent-stack | `../../main/claude-accounts/keychain` |
| `src/cli/handlers/artifacts.ts` | shared | `../../shared/artifacts`, `../../shared/artifact-cli-bridge`, `../../shared/artifact-file-read`, `../../shared/artifact-sharing-gate` |
| `src/cli/handlers/automation-handler-flags.ts` | shared | `../../shared/task-source-context` |
| `src/cli/handlers/automations.ts` | shared | `../../shared/task-source-context` |
| `src/cli/handlers/browser-identity.ts` | shared | `../../shared/browser-user-agent-mode` |
| `src/cli/handlers/computer-action-flags.ts` | shared | `../../shared/computer-use-key-spec` |
| `src/cli/handlers/linear-list-issues.ts` | shared | `../../shared/linear/agent-access` |
| `src/cli/handlers/linear-relation-write.ts` | shared | `../../shared/linear/agent-access` |
| `src/cli/handlers/linear-save-issue.ts` | shared | `../../shared/linear/agent-access` |
| `src/cli/handlers/linear.ts` | shared | `../../shared/linear/agent-access` |
| `src/cli/handlers/orchestration/dispatch-handlers.ts` | shared | `../../../shared/orchestration-rpc-contract` |
| `src/cli/handlers/orchestration/message-check-handler.ts` | shared | `../../../shared/orchestration-check-output` |
| `src/cli/handlers/orchestration/message-inbox-handlers.ts` | shared | `../../../shared/orchestration-check-output` |
| `src/cli/handlers/orchestration/mutation-request-show-handler.ts` | shared | `../../../shared/orchestration-mutation-request` |
| `src/cli/handlers/orchestration/question-handler.ts` | shared | `../../../shared/orchestration-ask-timeout`, `../../../shared/orchestration-check-output` |
| `src/cli/handlers/orchestration/run-handlers.ts` | shared | `../../../shared/orchestration-run-pagination` |
| `src/cli/handlers/orchestration/task-handlers.ts` | shared | `../../../shared/orchestration-task-summary` |
| `src/cli/handlers/orchestration/worker-observation-handlers.ts` | shared | `../../../shared/orchestration-worker-output` |
| `src/cli/handlers/orchestration/worker-output.ts` | shared | `../../../shared/orchestration-worker-output` |
| `src/cli/handlers/skill-sharing.ts` | shared | `../../shared/skill-bundle-name`, `../../shared/skill-cloud-contract` |
| `src/cli/handlers/vm.ts` | shared | `../../shared/orca-yaml`, `../../shared/ephemeral-vm-recipes`, `../../shared/ephemeral-vm-recipe-diagnostics`, `../../shared/ephemeral-vm-recipe-doctor`, `../../shared/ephemeral-vm-recipe-runner`, `../../shared/orca-yaml-hook-types` |
| `src/cli/handlers/worktree-linear-issue-link.ts` | shared | `../../shared/linear/links` |
| `src/cli/linear-format.ts` | shared | `../shared/linear/agent-access`, `../shared/linear/list-truncation-format`, `../shared/linear/priority-label`, `../shared/linear/project-list-format` |
| `src/cli/linear-request-builders.ts` | shared | `../shared/linear/agent-access`, `../shared/linear/uuid` |
| `src/cli/linear-save-issue-request.ts` | shared | `../shared/linear/agent-access` |
| `src/cli/retry-request-flag.ts` | shared | `../shared/orchestration-retry-request-id` |
| `src/cli/runtime/client.ts` | shared | `../../shared/orchestration-rpc-contract`, `../../shared/orchestration-timing-budgets` |
| `src/cli/runtime/launch.ts` | shared | `../../shared/ephemeral-vm-recipes` |
| `src/cli/runtime/orchestration-compatibility-envelope.ts` | shared | `../../shared/orchestration-compatibility-evidence` |
| `src/cli/runtime/types.ts` | shared | `../../shared/orchestration-compatibility-evidence` |
| `src/cli/runtime/websocket-transport.ts` | shared | `../../shared/remote-runtime-client` |
| `src/main/agent-auth-restart-preservation.ts` | agent-stack | `./claude-accounts/runtime-auth-service`, `./codex-accounts/runtime-home-service` |
| `src/main/agent-hooks/first-work-branch-rename.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/agent-hooks/first-work-generation-target.ts` | remote-host | `../providers/ssh-git-provider` |
| `src/main/agent-hooks/install-telemetry.ts` | shared, telemetry-stack | `../../shared/telemetry-events`, `../telemetry/client` |
| `src/main/agent-hooks/managed-agent-hook-registry.ts` | shared | `../../shared/telemetry-events` |
| `src/main/agent-hooks/server/server-constants.ts` | shared | `../../../shared/telemetry-events` |
| `src/main/agent-hooks/server/server-ingest-remote.ts` | telemetry-stack | `../../telemetry/client` |
| `src/main/agent-hooks/server/server-ingest-structured.ts` | shared | `../../../shared/structured-agent-session-projection`, `../../../shared/structured-agent-session-agent-status`, `../../../shared/structured-agent-session-status-started-at` |
| `src/main/agent-hooks/server/server-ingest-terminal.ts` | telemetry-stack | `../../telemetry/client` |
| `src/main/agent-hooks/server/server-status-application.ts` | telemetry-stack | `../../telemetry/cohort-classifier`, `../../telemetry/client` |
| `src/main/agent-hooks/server/server-status-identity.ts` | shared | `../../../shared/telemetry-events` |
| `src/main/agent-hooks/server/server-transport-rules.ts` | telemetry-stack | `../../telemetry/client` |
| `src/main/agent-hooks/server/server-types.ts` | shared | `../../../shared/telemetry-events` |
| `src/main/agent-hooks/wsl-guest-plugin-install.ts` | remote-host | `../ssh/ssh-channel-multiplexer`, `../../relay/plugin-overlay` |
| `src/main/agent-hooks/wsl-hook-fs-adapter.ts` | remote-host | `../ssh/ssh-channel-multiplexer` |
| `src/main/agent-hooks/wsl-hook-relay-deps.ts` | remote-host | `../../relay/plugin-overlay` |
| `src/main/agent-hooks/wsl-hook-relay-guest-install.ts` | remote-host | `../ssh/ssh-channel-multiplexer`, `../../relay/plugin-overlay` |
| `src/main/agent-hooks/wsl-hook-relay-launch.ts` | remote-host | `../ssh/ssh-channel-multiplexer` |
| `src/main/agent-hooks/wsl-hook-relay-link.ts` | remote-host | `../ssh/ssh-channel-multiplexer` |
| `src/main/agent-hooks/wsl-hook-relay-manager.ts` | remote-host | `../ssh/ssh-channel-multiplexer` |
| `src/main/agent-hooks/wsl-hook-relay-sentinel.ts` | remote-host | `../ssh/relay-protocol`, `../ssh/ssh-channel-multiplexer` |
| `src/main/agent-hooks/wsl-hook-relay-state.ts` | remote-host | `../ssh/ssh-channel-multiplexer` |
| `src/main/agent-trust-presets.ts` | agent-stack | `./codex-accounts/fs-utils` |
| `src/main/app-relaunch.ts` | telemetry-stack | `./crash-reporting/durable-crash-breadcrumb` |
| `src/main/claude/claude-background-task-frames.ts` | shared | `../../shared/native-chat-background-task-row` |
| `src/main/claude/claude-background-task-memory.ts` | shared | `../../shared/native-chat-background-task-row` |
| `src/main/claude/claude-background-task-roster.ts` | shared | `../../shared/native-chat-background-task-row` |
| `src/main/claude/claude-background-task-row-journal.ts` | shared, agent-stack | `../../shared/native-chat-background-task-row`, `../../shared/native-chat-types`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-background-task-row-lifecycle.ts` | shared | `../../shared/native-chat-background-task-row`, `../../shared/native-chat-types` |
| `src/main/claude/claude-background-task-row-test-support.ts` | shared, agent-stack | `../../shared/native-chat-types`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-background-task-row-writer.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-background-task-rows.ts` | shared, agent-stack | `../../shared/native-chat-background-task-row`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-background-task-start.ts` | shared | `../../shared/native-chat-background-task-row` |
| `src/main/claude/claude-child-process-environment.ts` | agent-stack | `../claude-accounts/environment` |
| `src/main/claude/claude-child-work-producer-harness.test-fixture.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-context-facts.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-context-usage-test-support.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-journal-translator-contract.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-message-journaling.ts` | agent-stack | `../native-chat/agent-session-journal/journal-payload-bounds`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-model-catalog-probe.ts` | agent-stack | `../native-chat/agent-model-catalog/agent-model-catalog-store` |
| `src/main/claude/claude-open-turn.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-prompt-journaling.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-provisional-row-corrections.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-stream-json-connection.ts` | agent-stack | `../claude-accounts/live-pty-gate` |
| `src/main/claude/claude-streamed-text-checkpoints.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink`, `../native-chat/agent-session-wire/agent-session-delta-coalescer` |
| `src/main/claude/claude-structured-acquisition-launch.ts` | agent-stack, telemetry-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../observability/agent-session-instrumentation` |
| `src/main/claude/claude-structured-compaction.ts` | agent-stack | `../native-chat/agent-session-wire/structured-session-compaction`, `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/claude/claude-structured-dispatch-content.ts` | shared | `../../shared/native-chat-types` |
| `src/main/claude/claude-structured-dispatch.ts` | agent-stack, shared | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/agent-session-journal/journal-dispatch-doubt-reasons`, `../native-chat/agent-session-wire/structured-agent-session-operation-settlement`, `../../shared/structured-agent-session-dispatch-rejection` |
| `src/main/claude/claude-structured-history-window.ts` | agent-stack, shared | `../native-chat/session-file-resolver`, `../native-chat/agent-session-journal/journal-submission-reconciler`, `../native-chat/transcript-record-blocks`, `../../shared/native-chat-types` |
| `src/main/claude/claude-structured-init-proof.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/claude/claude-structured-item-translation.ts` | shared, agent-stack | `../../shared/native-chat-types`, `../native-chat/agent-session-journal/journal-payload-bounds` |
| `src/main/claude/claude-structured-journal-prompts.ts` | agent-stack | `../native-chat/agent-session-journal/journal-prompt-body-bounds`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-structured-journal-translation.ts` | agent-stack | `../native-chat/agent-session-wire/agent-session-delta-coalescer`, `../native-chat/agent-session-wire/structured-agent-session-event-sink`, `../native-chat/agent-session-wire/provider-frame-activity` |
| `src/main/claude/claude-structured-launch-resolution.ts` | agent-stack | `../runtime/structured-worker-child-identity-env`, `../claude-accounts/environment`, `../claude-accounts/claude-structured-auth-policy`, `../claude-accounts/live-pty-gate`, `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/claude-structured-managed-account-support`, `../native-chat/session-file-resolver` |
| `src/main/claude/claude-structured-options.ts` | agent-stack, shared | `../native-chat/agent-session-wire/structured-agent-session-option-error`, `../../shared/structured-agent-session-option-codec` |
| `src/main/claude/claude-structured-prompt-items.ts` | shared, agent-stack | `../../shared/native-chat-tool-summary`, `../native-chat/agent-session-journal/journal-prompt-body-bounds` |
| `src/main/claude/claude-structured-prompt-ownership.ts` | agent-stack, shared | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/agent-session-wire/structured-session-compaction`, `../../shared/structured-agent-session-dispatch-rejection` |
| `src/main/claude/claude-structured-provider-fallback.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink`, `../native-chat/agent-session-journal/journal-payload-bounds`, `../native-chat/agent-session-wire/claude-stream-json-frame-schema`, `../native-chat/agent-session-wire/unhandled-provider-frame` |
| `src/main/claude/claude-structured-session-acquisition.ts` | agent-stack, telemetry-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../claude-accounts/environment`, `../claude-accounts/live-pty-gate`, `../native-chat/agent-model-catalog/agent-model-catalog-fingerprint`, `../observability/agent-session-instrumentation` |
| `src/main/claude/claude-structured-session-adapter.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/agent-session-wire/structured-session-compaction` |
| `src/main/claude/claude-structured-session-close.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/claude/claude-structured-session-journal-control.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-structured-session-options.ts` | shared | `../../shared/structured-agent-session-option-codec` |
| `src/main/claude/claude-structured-session-publication.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/claude/claude-structured-session-startup-gate.ts` | agent-stack, shared | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/agent-session-wire/structured-agent-session-operation-settlement`, `../native-chat/agent-session-wire/structured-agent-session-dead-generation-settlement`, `../../shared/structured-agent-session-dispatch-rejection` |
| `src/main/claude/claude-structured-session-startup.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/claude/claude-structured-session-state.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink`, `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/agent-model-catalog/agent-model-catalog-store` |
| `src/main/claude/claude-structured-session-test-support.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-subagent-group-row.ts` | shared, agent-stack | `../../shared/native-chat-subagent-summary`, `../../shared/native-chat-types`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-subagent-roster-state.ts` | shared | `../../shared/native-chat-types` |
| `src/main/claude/claude-subagent-roster.ts` | shared, agent-stack | `../../shared/native-chat-subagent-summary`, `../../shared/native-chat-types`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-subagent-task-frames.ts` | shared | `../../shared/native-chat-types` |
| `src/main/claude/claude-transcript-branch-proof.ts` | agent-stack | `../native-chat/transcript-stream-lines` |
| `src/main/claude/claude-turn-lifecycle-item.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/claude/claude-turn-row-revision.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink-estimate`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/cli/wsl-cli-registration-registry.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/codex-usage/codex-automation-run-attribution.ts` | agent-stack | `../usage/automation-usage-scan-forcing` |
| `src/main/codex-usage/codex-rollout-file-parse.ts` | agent-stack | `../usage/jsonl-line-offsets`, `../usage/usage-worktree-resolver` |
| `src/main/codex-usage/codex-session-file-discovery.ts` | agent-stack | `../usage/usage-path-comparison` |
| `src/main/codex-usage/codex-usage-aggregation.ts` | agent-stack | `../usage/usage-event-aggregation` |
| `src/main/codex-usage/codex-usage-event-attribution.ts` | agent-stack | `../usage/usage-event-attribution`, `../usage/usage-provider-contract`, `../usage/usage-worktree-resolver` |
| `src/main/codex-usage/codex-usage-provider.ts` | agent-stack | `../usage/usage-provider-contract`, `../usage/usage-scan-worker-spawn` |
| `src/main/codex-usage/codex-usage-record-parser.ts` | agent-stack | `../usage/usage-record-coercion` |
| `src/main/codex-usage/codex-usage-rollup-projections.ts` | agent-stack | `../usage/highest-usage-key` |
| `src/main/codex-usage/codex-usage-scope-filters.ts` | agent-stack | `../usage/usage-scope-filters` |
| `src/main/codex-usage/codex-usage-token-delta.ts` | agent-stack | `../usage/usage-record-coercion` |
| `src/main/codex-usage/scanner.ts` | agent-stack | `../usage/usage-worktree-resolver` |
| `src/main/codex-usage/store-test-harness.ts` | agent-stack | `../usage/usage-scan-worker-spawn` |
| `src/main/codex-usage/store.ts` | agent-stack | `../usage/usage-provider-store-lifecycle` |
| `src/main/codex/codex-account-home-discovery.ts` | agent-stack | `../codex-accounts/host-codex-managed-home-ownership` |
| `src/main/codex/codex-ai-vault-session-resume.ts` | agent-stack | `../codex-accounts/runtime-home-service` |
| `src/main/codex/codex-app-server-process-teardown.ts` | telemetry-stack | `../crash-reporting/self-initiated-tree-kill-log` |
| `src/main/codex/codex-background-task-frames.ts` | shared | `../../shared/native-chat-types` |
| `src/main/codex/codex-config-mirror.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/codex/codex-hook-legacy-cleanup.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/codex/codex-image-item-translation.ts` | shared, agent-stack | `../../shared/native-chat-types`, `../native-chat/agent-session-journal/journal-payload-bounds` |
| `src/main/codex/codex-legacy-session-resume.ts` | agent-stack | `../codex-accounts/host-codex-managed-home-ownership` |
| `src/main/codex/codex-model-catalog-probe.ts` | agent-stack | `../native-chat/agent-model-catalog/agent-model-catalog-store` |
| `src/main/codex/codex-pane-launch-account.ts` | agent-stack | `../codex-accounts/runtime-selection` |
| `src/main/codex/codex-prompt-registry-bounds.ts` | agent-stack | `../native-chat/agent-session-journal/journal-payload-bounds` |
| `src/main/codex/codex-real-home-hooks-json.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/codex/codex-rollout-session-meta.ts` | agent-stack | `../native-chat/wsl-transcript-fs-access`, `../native-chat/wsl-transcript-fs-gate` |
| `src/main/codex/codex-session-backfill-marker.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/codex/codex-session-index-heal-state.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/codex/codex-session-resume-home.ts` | agent-stack | `../codex-accounts/host-codex-managed-home-ownership` |
| `src/main/codex/codex-stale-pane-accounts.ts` | agent-stack | `../codex-accounts/runtime-selection` |
| `src/main/codex/codex-state-db-backfill-recovery.ts` | agent-stack | `../codex-accounts/wsl-codex-command`, `../rate-limits/codex-probe-termination` |
| `src/main/codex/codex-structured-acquire-catalog.ts` | agent-stack | `../native-chat/agent-model-catalog/agent-model-catalog-fingerprint` |
| `src/main/codex/codex-structured-acquisition-lifecycle.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/codex/codex-structured-child-environment.ts` | agent-stack | `../runtime/structured-worker-child-identity-env` |
| `src/main/codex/codex-structured-dispatch-test-support.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-structured-fast-mode.ts` | shared | `../../shared/structured-agent-session-option-codec` |
| `src/main/codex/codex-structured-item-stream-bounds.ts` | shared | `../../shared/native-chat-tool-identity` |
| `src/main/codex/codex-structured-item-stream-contracts.ts` | agent-stack | `../native-chat/agent-session-wire/agent-session-delta-coalescer`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-structured-item-streams.ts` | agent-stack | `../native-chat/agent-session-wire/agent-session-delta-coalescer` |
| `src/main/codex/codex-structured-item-translation.ts` | shared, agent-stack | `../../shared/native-chat-tool-identity`, `../../shared/native-chat-types`, `../native-chat/agent-session-journal/journal-payload-bounds`, `../native-chat/agent-session-wire/unhandled-provider-frame` |
| `src/main/codex/codex-structured-journal-compactions.ts` | agent-stack | `../native-chat/agent-session-wire/structured-session-compaction`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-structured-journal-contracts.ts` | agent-stack | `../native-chat/agent-session-wire/agent-session-delta-coalescer`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-structured-journal-generic-frames.ts` | agent-stack | `../native-chat/agent-session-wire/unhandled-provider-frame`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-structured-journal-goals.ts` | agent-stack | `../native-chat/agent-session-wire/unhandled-provider-frame`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-structured-journal-items.ts` | agent-stack | `../native-chat/agent-session-journal/journal-terminal-settlement` |
| `src/main/codex/codex-structured-journal-prompts.ts` | agent-stack | `../native-chat/agent-session-journal/journal-prompt-body-bounds`, `../native-chat/agent-session-journal/journal-row-builders` |
| `src/main/codex/codex-structured-journal-settlement.ts` | agent-stack | `../native-chat/agent-session-journal/journal-row-builders`, `../native-chat/agent-session-wire/structured-agent-session-event-sink`, `../native-chat/agent-session-journal/journal-prompt-body-bounds` |
| `src/main/codex/codex-structured-journal-sink.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink`, `../native-chat/agent-session-journal/journal-lifecycle-batch-partition`, `../native-chat/agent-session-journal/journal-row-builders` |
| `src/main/codex/codex-structured-journal-translation-turn-boundaries.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-structured-journal-translation-turns.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-structured-journal-translation.ts` | agent-stack | `../native-chat/agent-session-wire/provider-frame-activity` |
| `src/main/codex/codex-structured-prompt-items.ts` | agent-stack | `../native-chat/agent-session-journal/journal-payload-bounds` |
| `src/main/codex/codex-structured-prompt-ownership.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/agent-session-wire/structured-session-compaction` |
| `src/main/codex/codex-structured-rewind.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/agent-session-wire/agent-session-history-page-bounds` |
| `src/main/codex/codex-structured-session-acquire.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/codex/codex-structured-session-adapter.ts` | agent-stack | `../native-chat/agent-session-wire/structured-session-compaction`, `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/codex/codex-structured-session-close.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/codex/codex-structured-session-options.ts` | agent-stack, shared | `../native-chat/agent-session-wire/structured-agent-session-option-error`, `../native-chat/agent-model-catalog/agent-model-catalog-store`, `../../shared/structured-agent-session-option-codec` |
| `src/main/codex/codex-structured-session-state.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-adapter`, `../native-chat/agent-model-catalog/agent-model-catalog-store` |
| `src/main/codex/codex-structured-turn-start.ts` | shared, agent-stack | `../../shared/native-chat-types`, `../../shared/structured-agent-session-dispatch-rejection`, `../../shared/structured-agent-session-option-codec`, `../native-chat/agent-session-wire/structured-agent-session-adapter` |
| `src/main/codex/codex-subagent-executions.ts` | shared | `../../shared/native-chat-types`, `../../shared/native-chat-subagent-summary` |
| `src/main/codex/codex-subagent-group-body.ts` | shared | `../../shared/native-chat-types`, `../../shared/native-chat-subagent-summary` |
| `src/main/codex/codex-subagent-roster.ts` | shared, agent-stack | `../../shared/native-chat-subagent-summary`, `../../shared/native-chat-types`, `../native-chat/agent-session-wire/structured-agent-session-event-sink` |
| `src/main/codex/codex-trust-config-rollback.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/codex/codex-trust-grant-host.ts` | agent-stack | `../codex-accounts/wsl-codex-command` |
| `src/main/codex/codex-trust-grant-telemetry.ts` | agent-stack | `../codex-accounts/wsl-codex-command` |
| `src/main/codex/codex-turn-ordinals.ts` | agent-stack | `../native-chat/agent-session-journal/journal-payload-bounds` |
| `src/main/codex/config-settings-promotion.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/codex/config-toml-atomic-write.ts` | agent-stack | `../codex-accounts/fs-utils` |
| `src/main/daemon/daemon-adoption-telemetry-event.ts` | shared, telemetry-stack | `../../shared/telemetry-events`, `../telemetry/client` |
| `src/main/daemon/daemon-audit-eligibility-event.ts` | telemetry-stack, shared | `../telemetry/client`, `../../shared/telemetry-events` |
| `src/main/daemon/daemon-folder-access-mismatch.ts` | shared, telemetry-stack | `../../shared/telemetry-events`, `../telemetry/client` |
| `src/main/daemon/daemon-folder-access-reset.ts` | shared, telemetry-stack | `../../shared/telemetry-events`, `../telemetry/client` |
| `src/main/daemon/daemon-launch-paths.ts` | telemetry-stack | `../observability/logs-directory` |
| `src/main/daemon/daemon-lifecycle-event.ts` | telemetry-stack | `../telemetry/client` |
| `src/main/daemon/daemon-provider-init.ts` | agent-stack | `../claude-accounts/live-pty-gate` |
| `src/main/durable-file-write.ts` | agent-stack | `./codex-accounts/fs-utils` |
| `src/main/effective-hook-config.ts` | shared | `../shared/orca-yaml-hook-types` |
| `src/main/git/command-runner/gh-bound-account-env.ts` | shared, src/main/git/command-runner/gh-bound-account-env.ts | `../../../shared/github/account-binding`, `shared,[object Set]`, `src/main/git/command-runner/gh-bound-account-env.ts,[object Map]` |
| `src/main/git/command-runner/git-exec-file.ts` | telemetry-stack | `../../observability/instrumentation` |
| `src/main/git/command-runner/git-spawn.ts` | telemetry-stack | `../../observability/instrumentation` |
| `src/main/git/command-runner/git-stream-stdout.ts` | telemetry-stack | `../../observability/instrumentation` |
| `src/main/git/git-capability-state.ts` | remote-host | `../providers/ssh-git-provider` |
| `src/main/git/git-username.ts` | remote-host | `../providers/ssh-git-provider` |
| `src/main/git/local-repo-ref-maintenance.ts` | telemetry-stack | `../observability/tracer` |
| `src/main/git/remote-name-listing.ts` | forge-task, remote-host | `../github/local-git-config-signature`, `../providers/ssh-git-dispatch` |
| `src/main/git/remote-ref-probe-cache.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/git/remote-url-probe.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/git/worktree-removal.ts` | telemetry-stack | `../observability/instrumentation`, `../observability/tracer` |
| `src/main/hooks.ts` | shared | `../shared/orca-yaml`, `../shared/orca-yaml-hook-types` |
| `src/main/index.ts` | shared, telemetry-stack | `../shared/skill-share-link`, `./crash-reporting/durable-crash-breadcrumb` |
| `src/main/ipc/agent-status-ipc-boundary.ts` | shared | `../../shared/orchestration-fleet-agent-status-evidence` |
| `src/main/ipc/bitbucket.ts` | forge-task | `../bitbucket/credential-connection` |
| `src/main/ipc/codex-config-sync.ts` | agent-stack | `../codex-accounts/runtime-home-service` |
| `src/main/ipc/cursor-accounts.ts` | agent-stack | `../cursor-accounts/status` |
| `src/main/ipc/diagnostics.ts` | telemetry-stack | `../observability`, `../observability/bundle`, `../observability/diagnostic-bundle-upload`, `../observability/diagnostic-upload-endpoint` |
| `src/main/ipc/filesystem-download-folder.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/filesystem-mutations.ts` | remote-host, shared | `../providers/ssh-filesystem-dispatch`, `./filesystem-import-ssh`, `../ssh/ssh-connection-generation`, `../../shared/ssh-types` |
| `src/main/ipc/filesystem-watcher-handlers.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/filesystem-watcher-remote-dormant.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/filesystem-watcher-remote-install.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/filesystem-watcher-remote-removal.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/filesystem/filesystem-download-handlers.ts` | remote-host | `../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/filesystem/filesystem-file-content-inspection.ts` | ai-vault | `../../ai-vault/local-log-tail-reader` |
| `src/main/ipc/filesystem/filesystem-git-commit-generation-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-git-commit-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-git-diff-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-git-index-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-git-model-discovery-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-git-pull-request-generation-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-git-status-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-git-url-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-read-handlers.ts` | remote-host, telemetry-stack | `../../providers/ssh-filesystem-dispatch`, `../../crash-reporting/crash-breadcrumb-store` |
| `src/main/ipc/filesystem/filesystem-search-handlers.ts` | remote-host | `../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/filesystem/filesystem-source-control-ai-targets.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/filesystem-write-handlers.ts` | shared, remote-host | `../../../shared/ssh-types`, `../../ssh/ssh-connection-generation`, `../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/filesystem/git-remote/branch-mutation-handlers.ts` | remote-host | `../../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/git-remote/compare-handlers.ts` | remote-host | `../../../providers/ssh-git-dispatch` |
| `src/main/ipc/filesystem/git-remote/sync-handlers.ts` | remote-host | `../../../providers/ssh-git-dispatch` |
| `src/main/ipc/git-status-upstream-ref-watch-request.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/ipc/grok-accounts.ts` | agent-stack | `../grok-accounts/status` |
| `src/main/ipc/hooks/register-worktree-hook-check-handler.ts` | remote-host | `../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/hooks/register-worktree-hook-file-handlers.ts` | remote-host | `../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/hooks/register-worktree-hook-inspection-handler.ts` | remote-host | `../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/local-log-tail.ts` | ai-vault | `../ai-vault/local-log-tail-reader` |
| `src/main/ipc/local-network-connection-test.ts` | shared | `../../shared/remote-pairing-address` |
| `src/main/ipc/minimax-credentials.ts` | agent-stack | `../rate-limits/minimax/minimax-request-context`, `../rate-limits/service` |
| `src/main/ipc/preflight-remote-windows-terminal-capabilities.ts` | remote-host | `../ssh/ssh-target-registry` |
| `src/main/ipc/pty-spawn-timing.ts` | telemetry-stack | `../observability/tracer` |
| `src/main/ipc/pty/delivery/accept.ts` | remote-host | `../../ssh-pty-legacy-projection` |
| `src/main/ipc/pty/delivery/pending.ts` | telemetry-stack | `../../../crash-reporting/crash-breadcrumb-store` |
| `src/main/ipc/pty/delivery/ssh-intake.ts` | remote-host | `../../ssh-pty-output-intake`, `../../ssh-pty-output-intake-registry` |
| `src/main/ipc/pty/host-env/codex-home.ts` | agent-stack | `../../../codex-accounts/managed-codex-auth-readiness`, `../../../codex-accounts/runtime-selection` |
| `src/main/ipc/pty/host-env/codex-resume.ts` | agent-stack | `../../../codex-accounts/runtime-selection` |
| `src/main/ipc/pty/host-env/spawn-cwd.ts` | remote-host | `../../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/pty/host-env/types.ts` | agent-stack | `../../../claude-accounts/runtime-auth-service`, `../../../claude-accounts/runtime-selection`, `../../../codex-accounts/runtime-selection` |
| `src/main/ipc/pty/ipc/inspect.ts` | remote-host | `../../../providers/ssh-pty-id` |
| `src/main/ipc/pty/ipc/renderer-kill.ts` | remote-host | `../../../providers/ssh-pty-id` |
| `src/main/ipc/pty/ipc/spawn-commit.ts` | agent-stack | `../../../claude-accounts/live-pty-gate` |
| `src/main/ipc/pty/ipc/spawn-env.ts` | agent-stack | `../../../claude-accounts/live-pty-gate`, `../../../claude-accounts/environment` |
| `src/main/ipc/pty/ipc/spawn-execute.ts` | remote-host, telemetry-stack, shared | `../../../providers/ssh-pty-errors`, `../../../telemetry/classify-error`, `../../../telemetry/client`, `../../../telemetry/cohort-classifier`, `../../../../shared/telemetry-events` |
| `src/main/ipc/pty/ipc/spawn-options.ts` | agent-stack | `../../../claude-accounts/environment` |
| `src/main/ipc/pty/ipc/spawn-preflight.ts` | agent-stack | `../../../claude-accounts/live-pty-gate`, `../../../claude-accounts/environment` |
| `src/main/ipc/pty/ipc/spawn-state.ts` | agent-stack | `../../../codex-accounts/runtime-selection`, `../../../claude-accounts/runtime-auth-service` |
| `src/main/ipc/pty/ipc/spawn-types.ts` | agent-stack | `../../../codex-accounts/runtime-selection` |
| `src/main/ipc/pty/pane/spawn-telemetry.ts` | telemetry-stack, shared | `../../../telemetry/client`, `../../../telemetry/cohort-classifier`, `../../../../shared/telemetry-events` |
| `src/main/ipc/pty/pane/stable-owner.ts` | remote-host | `../../../providers/ssh-pty-id` |
| `src/main/ipc/pty/provider/bind-listeners.ts` | agent-stack | `../../../claude-accounts/live-pty-gate` |
| `src/main/ipc/pty/provider/liveness.ts` | remote-host, agent-stack | `../../../providers/ssh-pty-errors`, `../../../claude-accounts/live-pty-gate` |
| `src/main/ipc/pty/provider/local-configure.ts` | agent-stack | `../../../codex-accounts/runtime-selection`, `../../../claude-accounts/live-pty-gate` |
| `src/main/ipc/pty/provider/registry.ts` | remote-host | `../../../providers/ssh-pty-id` |
| `src/main/ipc/pty/provider/state-cleanup.ts` | agent-stack | `../../../claude-accounts/live-pty-gate` |
| `src/main/ipc/pty/runtime/controller-deps.ts` | agent-stack | `../../../codex-accounts/runtime-selection` |
| `src/main/ipc/pty/runtime/kill.ts` | remote-host | `../../../providers/ssh-pty-id` |
| `src/main/ipc/pty/runtime/operations.ts` | remote-host | `../../../providers/ssh-pty-id` |
| `src/main/ipc/pty/runtime/spawn-commit.ts` | agent-stack | `../../../claude-accounts/live-pty-gate` |
| `src/main/ipc/pty/runtime/spawn-execute.ts` | remote-host | `../../../providers/ssh-pty-errors` |
| `src/main/ipc/pty/runtime/spawn-options.ts` | agent-stack | `../../../claude-accounts/environment` |
| `src/main/ipc/pty/runtime/spawn-preflight.ts` | agent-stack | `../../../claude-accounts/live-pty-gate`, `../../../claude-accounts/environment` |
| `src/main/ipc/pty/runtime/spawn-state.ts` | agent-stack | `../../../codex-accounts/runtime-selection`, `../../../claude-accounts/runtime-auth-service` |
| `src/main/ipc/pty/session.ts` | remote-host | `../ssh-pty-legacy-projection`, `../ssh-pty-output-intake` |
| `src/main/ipc/register-core-handlers/register-core-handlers.ts` | agent-stack, forge-task, telemetry-stack, ephemeral-vm, ai-vault, computer, browser, automations, cloud-profiles | `../usage-provider-handlers`, `../rate-limits`, `../native-chat`, `../codex-accounts`, `../claude-accounts`, `../../claude-usage/store`, `../../rate-limits/service`, `../../codex-accounts/service`, `../../claude-accounts/service`, `../github`, `../gitlab`, `../hosted-review`, `../linear`, `../jira`, `../crash-reporting`, `../telemetry`, `../../crash-reporting/crash-report-store`, `../ephemeral-vm`, `../ai-vault`, `../ai-vault-search`, `../../ai-vault/runtime-session-scanner`, `../../ai-vault/runtime-session-search-call`, `../computer-use-permissions`, `../browser`, `../browser-renderer-trust`, `../automations`, `../../automations/service`, `../orca-profiles` |
| `src/main/ipc/remote-workspace-connected-clients.ts` | shared, remote-host | `../../shared/remote-workspace-types`, `./ssh` |
| `src/main/ipc/remote-workspace-namespace.ts` | shared | `../../shared/ssh-types` |
| `src/main/ipc/remote-workspace-relay-sync.ts` | shared, remote-host | `../../shared/remote-workspace-types`, `../../shared/ssh-types`, `./ssh` |
| `src/main/ipc/remote-workspace-snapshot-cache.ts` | shared | `../../shared/remote-workspace-types` |
| `src/main/ipc/remote-workspace-snapshot-normalization.ts` | shared | `../../shared/remote-workspace-types` |
| `src/main/ipc/remote-workspace-stale-resync.ts` | shared | `../../shared/remote-workspace-types`, `../../shared/ssh-types` |
| `src/main/ipc/remote-workspace-target-session-export.ts` | shared | `../../shared/remote-workspace-session-projection`, `../../shared/remote-workspace-types` |
| `src/main/ipc/remote-workspace.ts` | remote-host, shared | `./ssh`, `../../shared/remote-workspace-types` |
| `src/main/ipc/repos/base-ref-query-handlers.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/repos/folder-workspace-handlers.ts` | remote-host | `../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/repos/host-repo-catalog-snapshot.ts` | shared, remote-host | `../../../shared/ssh-retained-payload-admission`, `../../ssh/ssh-provider-authority`, `../../providers/ssh-git-dispatch` |
| `src/main/ipc/repos/nested-repo-import-handler.ts` | remote-host | `../../providers/ssh-git-dispatch`, `../ssh` |
| `src/main/ipc/repos/nested-repo-scan-ipc.ts` | remote-host | `../../providers/ssh-git-dispatch`, `../../providers/ssh-filesystem-dispatch`, `../ssh` |
| `src/main/ipc/repos/project-host-setup-handlers.ts` | remote-host | `./remote-repo-registration` |
| `src/main/ipc/repos/repo-added-telemetry.ts` | shared, telemetry-stack | `../../../shared/telemetry-events`, `../../telemetry/client`, `../../telemetry/cohort-classifier` |
| `src/main/ipc/repos/repo-clone-lifecycle.ts` | remote-host | `./remote-repo-clone` |
| `src/main/ipc/repos/repo-creation-handlers.ts` | remote-host | `./remote-repo-registration`, `./remote-repo-creation` |
| `src/main/ipc/repos/repo-git-username-handler.ts` | remote-host | `../../providers/ssh-git-dispatch` |
| `src/main/ipc/repos/repo-ipc-arg-schemas.ts` | shared | `../../../shared/task-source-context-schema` |
| `src/main/ipc/repos/repo-update-handler.ts` | shared | `../../../shared/github/account-binding` |
| `src/main/ipc/runtime-environment-abortable-requests.ts` | shared | `../../shared/remote-runtime-client` |
| `src/main/ipc/runtime-environment-browser-client-host-handler.ts` | shared, browser | `../../shared/browser-client-host-placement`, `../browser/paired-runtime-browser-client-host-runtime`, `../browser/browser-client-host-placement-preparation` |
| `src/main/ipc/runtime-environment-connectivity-handlers.ts` | shared, browser | `../../shared/remote-runtime-client-error`, `../browser/browser-route-partition-storage-runtime`, `../browser/browser-route-partition-storage-retirement` |
| `src/main/ipc/runtime-environment-diagnostics-broadcast.ts` | shared | `../../shared/remote-runtime-shared-control-types` |
| `src/main/ipc/runtime-environment-pairing-verification.ts` | shared | `../../shared/remote-pairing-address`, `../../shared/remote-pairing-verification`, `../../shared/remote-runtime-client-error`, `../../shared/remote-runtime-client` |
| `src/main/ipc/runtime-environment-request-connections.ts` | shared | `../../shared/remote-runtime-request-connection`, `../../shared/remote-runtime-shared-control-connection`, `../../shared/remote-runtime-shared-control-types` |
| `src/main/ipc/runtime-environment-shared-control-support.ts` | shared | `../../shared/remote-runtime-client-error` |
| `src/main/ipc/runtime-environment-status-owner.ts` | shared | `../../shared/remote-runtime-client` |
| `src/main/ipc/runtime-environment-support-routing.ts` | shared | `../../shared/remote-runtime-client`, `../../shared/remote-runtime-tailscale-hint` |
| `src/main/ipc/runtime-environment-tailscale-response.ts` | shared | `../../shared/remote-runtime-tailscale-hint` |
| `src/main/ipc/runtime-environment-transport-routing.ts` | shared | `../../shared/orchestration-rpc-contract`, `../../shared/remote-runtime-client`, `../../shared/remote-runtime-tailscale-hint` |
| `src/main/ipc/runtime-environments.ts` | shared, browser | `../../shared/remote-runtime-client`, `../browser/paired-runtime-browser-client-host-runtime` |
| `src/main/ipc/settings.ts` | telemetry-stack, shared, browser, ai-vault | `../telemetry/client`, `../../shared/telemetry-events`, `../../shared/mobile-pairing-custom-address`, `../browser/browser-session-proxy`, `../browser/browser-session-registry`, `../ai-vault-search/session-search-enablement` |
| `src/main/ipc/shell.ts` | remote-host | `../ssh/vscode-ssh-authority` |
| `src/main/ipc/skill-cloud-install-ipc-schemas.ts` | shared | `../../shared/skill-bundle-install-contract`, `../../shared/skill-install-contract` |
| `src/main/ipc/skill-cloud-ipc-handlers.ts` | shared, already-done | `../../shared/skill-install-capability`, `../../shared/skill-cloud-contract`, `../../shared/skill-bundle-install-contract`, `../skills/skill-cloud-grant-installation`, `../skills/skill-remote-install-cancellation`, `../skills/skill-cloud-install-target`, `../skills/skill-cloud-grant-version`, `../skills/skill-share-preparation-service`, `../skills/skill-runtime-capability` |
| `src/main/ipc/skill-delete/handlers.ts` | shared, already-done | `../../../shared/skill-delete-contract`, `../../skills/skill-delete/request-service`, `../../skills/skill-discovery-target` |
| `src/main/ipc/skill-install-management-ipc-handlers.ts` | shared, already-done | `../../shared/skill-install-capability`, `../../shared/skill-bundle-install-contract`, `../../shared/skill-install-contract`, `../skills/skill-runtime-capability` |
| `src/main/ipc/skill-install-progress-ipc.ts` | shared | `../../shared/skill-bundle-install-contract`, `../../shared/skill-sharing-contract` |
| `src/main/ipc/skills.ts` | shared, already-done | `../../shared/skill-freshness`, `../skills/skill-freshness-inventory`, `../skills/skill-update-run`, `../skills/skill-update-outcome`, `../skills/skill-update-registration`, `../skills/skill-discovery-target` |
| `src/main/ipc/terminal-startup-color-query-replies.ts` | shared | `../../shared/telemetry-events` |
| `src/main/ipc/workspace-cleanup-git-evidence.ts` | remote-host | `../providers/ssh-git-dispatch`, `../providers/ssh-git-provider` |
| `src/main/ipc/workspace-cleanup-git-route.ts` | remote-host | `../providers/ssh-git-provider` |
| `src/main/ipc/workspace-create-error-classifier.ts` | shared | `../../shared/telemetry-events` |
| `src/main/ipc/worktree-base-directory-watch-targets.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/worktree-base-directory-watcher.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/worktree-push-target-cleanup.ts` | forge-task | `../github/gh-utils` |
| `src/main/ipc/worktree-push-target-reconciliation.ts` | remote-host | `../providers/ssh-git-provider` |
| `src/main/ipc/worktree-remote.ts` | shared, forge-task, remote-host | `../../shared/orca-yaml-hook-types`, `../github/client`, `../providers/ssh-git-dispatch`, `../providers/ssh-filesystem-dispatch`, `../providers/ssh-git-provider`, `./ssh-worktree-create-root-registration` |
| `src/main/ipc/worktrees-test-harness.ts` | remote-host | `../ssh/ssh-provider-authority` |
| `src/main/ipc/worktrees/create/register-review-base-handlers.ts` | remote-host, forge-task | `../../../providers/ssh-git-dispatch`, `../../../github/pr-head-tracking-ref`, `../../../github/pr-start-point`, `../../../github/review-head-remote` |
| `src/main/ipc/worktrees/create/register-worktree-create-handlers.ts` | telemetry-stack, shared, automations | `../../../observability/instrumentation`, `../../../telemetry/client`, `../../../telemetry/cohort-classifier`, `../../../../shared/telemetry-events`, `../../../automations/workspace-provenance` |
| `src/main/ipc/worktrees/ipc-context-schemas.ts` | shared | `../../../shared/task-source-context-schema` |
| `src/main/ipc/worktrees/listing/detected-provider-listing.ts` | remote-host, shared | `../../../providers/ssh-git-dispatch`, `../../../providers/ssh-git-provider`, `../../../../shared/ssh-retained-payload-admission` |
| `src/main/ipc/worktrees/listing/host-qualified-worktree-listing.ts` | remote-host | `../../../ssh/ssh-provider-authority`, `../../../providers/ssh-git-dispatch` |
| `src/main/ipc/worktrees/listing/register-detected-worktree-handlers.ts` | remote-host | `../../../ssh/ssh-provider-authority`, `../../../providers/ssh-git-dispatch` |
| `src/main/ipc/worktrees/listing/register-worktree-catalog-handlers.ts` | remote-host | `../../../providers/ssh-git-dispatch` |
| `src/main/ipc/worktrees/metadata/host-lineage-listing.ts` | remote-host | `../../../providers/ssh-git-dispatch`, `../../../providers/ssh-git-provider`, `../../../ssh/ssh-provider-authority` |
| `src/main/ipc/worktrees/removal/execute-worktree-removal.ts` | remote-host, telemetry-stack | `../../../providers/ssh-git-dispatch`, `../../../observability/instrumentation` |
| `src/main/ipc/worktrees/removal/register-worktree-forget-handlers.ts` | remote-host | `../../../providers/ssh-git-dispatch` |
| `src/main/ipc/worktrees/removal/register-worktree-removal-handlers.ts` | telemetry-stack | `../../../observability/instrumentation` |
| `src/main/ipc/worktrees/removal/remove-folder-workspace.ts` | telemetry-stack | `../../../observability/instrumentation` |
| `src/main/ipc/worktrees/removal/remove-registered-local-worktree.ts` | telemetry-stack | `../../../observability/instrumentation` |
| `src/main/ipc/worktrees/removal/remove-registered-remote-worktree.ts` | remote-host, telemetry-stack | `../../../providers/ssh-git-provider`, `../../../observability/instrumentation` |
| `src/main/ipc/worktrees/removal/remove-unregistered-worktree.ts` | remote-host | `../../../providers/ssh-git-provider`, `../../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/worktrees/removal/worktree-archive-hook.ts` | shared, remote-host | `../../../../shared/orca-yaml-hook-types`, `../../../providers/ssh-filesystem-dispatch`, `../../../providers/ssh-git-dispatch` |
| `src/main/ipc/worktrees/removal/worktree-removal-filesystem.ts` | remote-host | `../../../providers/ssh-filesystem-dispatch` |
| `src/main/ipc/worktrees/removal/worktree-removal-ownership.ts` | forge-task | `../../../github/pr-refresh-coordinator` |
| `src/main/issue-command-file.ts` | remote-host | `./providers/ssh-git-dispatch` |
| `src/main/macos-press-and-hold-default.ts` | agent-stack | `./codex-accounts/fs-utils` |
| `src/main/macos-tcc-prompt-notice.ts` | agent-stack | `./codex-accounts/fs-utils` |
| `src/main/muse-usage/muse-usage-provider.ts` | agent-stack | `../usage/usage-provider-contract`, `../usage/usage-scan-worker-spawn` |
| `src/main/muse-usage/muse-usage-record-parser.ts` | agent-stack | `../usage/usage-record-coercion` |
| `src/main/muse-usage/scanner.ts` | agent-stack | `../usage/usage-event-attribution`, `../usage/usage-event-aggregation`, `../usage/jsonl-line-offsets`, `../usage/usage-provider-contract`, `../usage/usage-worktree-resolver` |
| `src/main/muse-usage/snapshot-rollups.ts` | agent-stack | `../usage/highest-usage-key` |
| `src/main/muse-usage/store.ts` | agent-stack | `../usage/usage-provider-store-lifecycle`, `../usage/usage-scope-filters` |
| `src/main/muse-usage/types.ts` | agent-stack | `../usage/usage-rollup-records` |
| `src/main/opencode-usage/opencode-database-discovery.ts` | agent-stack | `../native-chat/wsl-transcript-fs-access`, `../native-chat/wsl-transcript-fs-gate` |
| `src/main/opencode-usage/opencode-usage-provider.ts` | agent-stack | `../usage/usage-provider-contract`, `../usage/usage-scan-worker-spawn` |
| `src/main/opencode-usage/opencode-usage-row-parsing.ts` | agent-stack | `../usage/usage-record-coercion` |
| `src/main/opencode-usage/opencode-usage-worktree-attribution.ts` | agent-stack | `../usage/usage-path-comparison`, `../usage/usage-provider-contract`, `../usage/usage-worktree-resolver` |
| `src/main/opencode-usage/scanner.ts` | agent-stack | `../usage/usage-event-aggregation`, `../usage/usage-worktree-resolver` |
| `src/main/opencode-usage/scope-range-filter.ts` | agent-stack | `../usage/usage-calendar-range` |
| `src/main/opencode-usage/snapshot-rollups.ts` | agent-stack | `../usage/highest-usage-key` |
| `src/main/opencode-usage/store.ts` | agent-stack | `../usage/usage-provider-store-lifecycle` |
| `src/main/opencode/opencode-session-binder.ts` | ai-vault | `../ai-vault/session-scanner-opencode-sqlite-open` |
| `src/main/orca-chromium-process-pids.ts` | telemetry-stack | `./crash-reporting/durable-crash-breadcrumb` |
| `src/main/orca-profiles/profile-active-transfer.ts` | shared | `../../shared/orca-profiles` |
| `src/main/orca-profiles/profile-artifact-cloud-cleanup.ts` | shared, artifacts | `../../shared/orca-profiles`, `../artifacts/artifact-create-intent-store`, `../artifacts/artifact-share-record-store` |
| `src/main/orca-profiles/profile-index-store.ts` | shared | `../../shared/orca-profiles` |
| `src/main/orca-profiles/profile-project-presence.ts` | shared | `../../shared/orca-profiles` |
| `src/main/orca-profiles/profile-project-session-transfer.ts` | shared | `../../shared/browser-workspace-types`, `../../shared/browser-page-doc-location` |
| `src/main/orca-profiles/profile-project-transfer-payload.ts` | shared | `../../shared/ssh-types` |
| `src/main/orca-profiles/profile-project-transfer.ts` | shared | `../../shared/orca-profiles` |
| `src/main/own-chromium-tree-kill-guard.ts` | telemetry-stack | `./crash-reporting/self-initiated-tree-kill-log` |
| `src/main/persistence/applying-settings/feature-interaction-recording.ts` | telemetry-stack | `../../telemetry/client`, `../../telemetry/cohort-classifier` |
| `src/main/persistence/applying-settings/settings-update.ts` | shared | `../../../shared/task-providers`, `../../../shared/mobile-pairing-custom-address` |
| `src/main/persistence/applying-settings/ui-state-read.ts` | shared | `../../../shared/browser-page-zoom` |
| `src/main/persistence/applying-settings/ui-state-update.ts` | shared | `../../../shared/browser-page-zoom` |
| `src/main/persistence/loading-store/automation-persistence.ts` | automations | `../scheduling-automations/automation-context-migration`, `../scheduling-automations/automation-definition-operations`, `../scheduling-automations/automation-run-operations`, `../scheduling-automations/automation-schedule-operations`, `../scheduling-automations/automation-owner-projection` |
| `src/main/persistence/loading-store/loaded-state-parsing.ts` | shared, remote-host, automations | `../../../shared/browser-url`, `../../../shared/ssh-types`, `../leasing-ssh-ptys/secret-validation`, `../leasing-ssh-ptys/ssh-normalization`, `../scheduling-automations/automation-context-migration`, `../../automations/automation-owner-migration` |
| `src/main/persistence/loading-store/normalize-loaded-global-settings.ts` | shared | `../../../shared/native-chat-shell-environment` |
| `src/main/persistence/loading-store/normalize-loaded-profile-state.ts` | shared, remote-host | `../../../shared/ssh-types`, `../leasing-ssh-ptys/ssh-normalization` |
| `src/main/persistence/loading-store/prepare-loaded-profile-settings.ts` | shared | `../../../shared/task-providers`, `../../../shared/mobile-pairing-custom-address` |
| `src/main/persistence/loading-store/pty-binding-span.ts` | telemetry-stack | `../../observability/tracer` |
| `src/main/persistence/loading-store/repo-lifecycle-operations.ts` | shared | `../../../shared/github/account-binding` |
| `src/main/persistence/loading-store/ssh-lease-recovery-operations.ts` | shared, remote-host | `../../../shared/ssh-pending-pty-kill`, `../../../shared/ssh-types`, `../leasing-ssh-ptys/ssh-pty-kill-intent-operations`, `../leasing-ssh-ptys/ssh-pty-lease-operations`, `../leasing-ssh-ptys/ssh-pty-pane-supersession`, `../leasing-ssh-ptys/ssh-pty-consumer-recovery`, `../leasing-ssh-ptys/ssh-pty-binding-cleanup` |
| `src/main/persistence/loading-store/ssh-profile-operations.ts` | shared, remote-host, automations | `../../../shared/ssh-types`, `../leasing-ssh-ptys/ssh-target-state`, `../leasing-ssh-ptys/ssh-target-reassignment`, `../../ssh/ssh-connection-generation`, `../scheduling-automations/automation-owner-projection` |
| `src/main/persistence/loading-store/store-runtime-state.ts` | automations | `../scheduling-automations/automation-owner-projection` |
| `src/main/persistence/loading-store/terminal-binding-recovery.ts` | shared, remote-host | `../../../shared/ssh-types`, `../../providers/ssh-pty-id` |
| `src/main/persistence/loading-store/worktree-meta-write-normalization.ts` | shared | `../../../shared/task-source-context` |
| `src/main/persistence/profile-state/profile-state-access-owner.ts` | agent-stack | `../../codex-accounts/fs-utils` |
| `src/main/persistence/profile-state/profile-state-startup-authority.ts` | automations | `../scheduling-automations/automation-owner-projection` |
| `src/main/persistence/profile-state/profile-state-store-factory.ts` | automations | `../scheduling-automations/automation-owner-projection` |
| `src/main/persistence/restoring-sessions/folder-workspace-operations.ts` | shared | `../../../shared/task-source-context` |
| `src/main/persistence/restoring-sessions/workspace-pane-normalization.ts` | shared | `../../../shared/ssh-types` |
| `src/main/persistence/tracking-repos/missing-local-worktree-metadata-pruning.ts` | shared | `../../../shared/ssh-types` |
| `src/main/persistence/tracking-repos/repo-hydration.ts` | shared | `../../../shared/github/account-binding` |
| `src/main/persistence/tracking-repos/repo-sanitization.ts` | shared | `../../../shared/github/account-binding` |
| `src/main/persistence/tracking-repos/repo-update-operations.ts` | shared, forge-task | `../../../shared/github/account-binding`, `../../github/gh-account-token` |
| `src/main/persistence/tracking-repos/worktree-identity-migration.ts` | shared | `../../../shared/browser-workspace-types`, `../../../shared/browser-page-doc-location` |
| `src/main/persistence/tracking-repos/worktree-metadata-normalization.ts` | shared | `../../../shared/task-source-context` |
| `src/main/preflight/agent-detection.ts` | forge-task, remote-host | `../azure-devops/client`, `../bitbucket/client`, `../gitea/client`, `../gitlab/gl-utils`, `../ssh/ssh-target-registry` |
| `src/main/providers/execution-host-provider-dispatch.ts` | remote-host | `./ssh-git-dispatch`, `./ssh-git-provider`, `./ssh-filesystem-dispatch` |
| `src/main/provisioned-root-ssh-adoption.ts` | shared, remote-host, ephemeral-vm | `../shared/ephemeral-vm-recipes`, `../shared/ephemeral-vm-runtime-store`, `../shared/ephemeral-vm-runtimes`, `./providers/ssh-git-dispatch`, `./ssh/ssh-provider-authority`, `./ephemeral-vm-runtime-attachment` |
| `src/main/pty/posix-pty-process-groups.ts` | telemetry-stack | `../crash-reporting/self-initiated-tree-kill-log` |
| `src/main/pty/wsl-orca-env.ts` | shared | `../../shared/orchestration-compatibility-evidence` |
| `src/main/remote-agent-trust-presets.ts` | remote-host | `./ssh/ssh-target-registry`, `./providers/ssh-filesystem-dispatch` |
| `src/main/repo-icon-autodetect.ts` | shared, forge-task | `../shared/github/pull-request-types`, `./github/client` |
| `src/main/rolling-file-backup.ts` | agent-stack | `./codex-accounts/fs-utils` |
| `src/main/runtime/agent-prompt-submission-verification.ts` | shared | `../../shared/orchestration-timing-budgets` |
| `src/main/runtime/agent-session-tab-table.ts` | shared | `../../shared/structured-agent-session-projection` |
| `src/main/runtime/browser-client-download-transfers.ts` | shared | `../../shared/browser-client-file-channel-protocol`, `../../shared/browser-download-filename` |
| `src/main/runtime/browser-host-client-page-adoption.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-client-page-command-issue.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-client-page-creation.ts` | shared | `../../shared/browser-client-host-protocol`, `../../shared/browser-client-page-creation-timeouts` |
| `src/main/runtime/browser-host-command-ledger.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-command-replay.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-command-state.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-lease-attachment.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-lease-reconnect.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-lease-records.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-lease-registry.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-page-command-admission.ts` | shared | `../../shared/browser-client-host-protocol`, `../../shared/browser-client-automation-protocol`, `../../shared/browser-client-file-channel-protocol`, `../../shared/browser-client-file-channel-methods` |
| `src/main/runtime/browser-host-page-inventory-snapshot.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-page-reconciliation-actions.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-page-reconciliation-executor.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-page-reconciliation-orchestration.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-host-page-reconciliation-plan.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/browser-tab-create-publication.ts` | browser | `../browser/agent-browser-bridge` |
| `src/main/runtime/bundled-mobile-web-bundle.ts` | shared | `../../shared/mobile-web-bundle/manifest-contract` |
| `src/main/runtime/claude-agent-teams-shim-env.ts` | shared | `../../shared/orca-cli-command-name` |
| `src/main/runtime/device-registry.ts` | remote-host, shared | `./relay/relay-revoke-outbox`, `../../shared/mobile-pairing-connection-mode`, `../../shared/mobile-push-contract` |
| `src/main/runtime/mobile-notification-dismissal-store.ts` | agent-stack | `./runtime-mobile-notification-controller` |
| `src/main/runtime/mobile-notification-replay.ts` | agent-stack | `./runtime-mobile-notification-controller` |
| `src/main/runtime/orca-runtime-adopt-terminal-orphans-from-inventory.ts` | agent-stack | `./structured-worker-authority` |
| `src/main/runtime/orca-runtime-attach-window.ts` | remote-host | `./orca-runtime-notify-ssh-state-changed` |
| `src/main/runtime/orca-runtime-build-pty-terminal-summary.ts` | agent-stack | `./structured-worker-terminal-refusal` |
| `src/main/runtime/orca-runtime-close-headless-mobile-terminal-tab.ts` | shared | `../../shared/ssh-pty-id` |
| `src/main/runtime/orca-runtime-close-mobile-session-tab.ts` | shared | `../../shared/structured-agent-session-projection` |
| `src/main/runtime/orca-runtime-close-structured-agent-session-tab.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-registry`, `./structured-agent-session-tab-retirement` |
| `src/main/runtime/orca-runtime-file-commands.ts` | agent-stack, forge-task | `../native-chat/native-chat-file-provenance`, `../gitlab/gitlab-project-recents` |
| `src/main/runtime/orca-runtime-files-test-harness.ts` | remote-host | `../ssh/ssh-connection-generation` |
| `src/main/runtime/orca-runtime-fit-override-listeners.ts` | agent-stack, shared | `./runtime-mobile-notification-controller`, `../../shared/ssh-pty-id` |
| `src/main/runtime/orca-runtime-get-orchestration-dispatch-authority.ts` | shared, agent-stack | `../../shared/orchestration-fleet-agent-status-evidence`, `./structured-worker-authority` |
| `src/main/runtime/orca-runtime-get-pty-record-for-pane-key.ts` | agent-stack | `./structured-worker-authority`, `./structured-worker-identity` |
| `src/main/runtime/orca-runtime-get-status.ts` | browser, shared | `../browser/browser-identity-mode-store`, `../../shared/mobile-web-bundle/mobile-web-bundle-capability` |
| `src/main/runtime/orca-runtime-get-structured-agent-session-create-support.ts` | agent-stack, shared | `../native-chat/agent-session-wire/structured-agent-session-registry`, `../native-chat/structured-agent-session-create-support`, `./structured-agent-session-create-adoption`, `../native-chat/agent-session-wire/structured-agent-session-attach`, `./structured-agent-account-home`, `./structured-agent-session-runtime`, `../../shared/native-chat-session-option-defaults` |
| `src/main/runtime/orca-runtime-get-terminal-interactive-wait.ts` | agent-stack, shared | `./structured-worker-authority`, `../../shared/orchestration-worker-output` |
| `src/main/runtime/orca-runtime-get-worktree-ps.ts` | agent-stack, shared | `./structured-agent-session-runtime`, `../claude-accounts/claude-structured-auth-policy`, `../../shared/native-chat-shell-environment` |
| `src/main/runtime/orca-runtime-has-exact-persisted-terminal-surface-identity.ts` | automations, artifacts, shared | `../automations/service`, `../artifacts/artifact-cloud-service`, `../../shared/artifacts` |
| `src/main/runtime/orca-runtime-list-known-resolved-worktrees-for-explicit-target.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/runtime/orca-runtime-perform-mobile-session-pty-records-refresh.ts` | shared | `../../shared/ssh-pty-id` |
| `src/main/runtime/orca-runtime-preserved-branch-cleanup.ts` | agent-stack, remote-host | `../native-chat/agent-session-wire/structured-agent-session-status-feed`, `../ipc/repos/remote-repo-registration` |
| `src/main/runtime/orca-runtime-prune-mobile-session-tab-group-layout.ts` | agent-stack | `./runtime-mobile-session-projection`, `./runtime-mobile-session-projection-contract`, `./runtime-mobile-agent-status-builder`, `../native-chat/agent-session-wire/structured-agent-session-registry`, `./structured-conversation-tab-replacement`, `./structured-worker-authority` |
| `src/main/runtime/orca-runtime-pty-foreground-process-reads.ts` | shared | `../../shared/native-chat-session-options` |
| `src/main/runtime/orca-runtime-publish-pty-backed-mobile-session-terminal.ts` | remote-host | `./orca-runtime-has-live-or-persisted-serve-or-ssh-owned-pty-binding` |
| `src/main/runtime/orca-runtime-reconcile-headless-mobile-session-browser-tabs.ts` | shared | `../../shared/ssh-pty-id`, `../../shared/ssh-types` |
| `src/main/runtime/orca-runtime-record-pty-worktree.ts` | shared | `../../shared/ssh-pty-id` |
| `src/main/runtime/orca-runtime-refresh-pty-worktree-records-with-controller-inventory.ts` | shared | `../../shared/ssh-pty-id` |
| `src/main/runtime/orca-runtime-refresh-repo-worktree-scan.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/runtime/orca-runtime-remove-managed-worktree.ts` | telemetry-stack | `../observability/instrumentation` |
| `src/main/runtime/orca-runtime-resolve-authoritative-terminal-wait-permission.ts` | agent-stack, remote-host | `./runtime-mobile-agent-status-projection`, `../ssh/ssh-target-registry` |
| `src/main/runtime/orca-runtime-resolve-browser-network-execution-host-for-worktree.ts` | shared, remote-host | `../../shared/browser-client-host-protocol`, `../ssh/ssh-target-registry` |
| `src/main/runtime/orca-runtime-resolve-terminal-pane.ts` | agent-stack | `./structured-worker-terminal-read` |
| `src/main/runtime/orca-runtime-resolve-terminal-split-source-authority.ts` | agent-stack | `../claude-accounts/environment` |
| `src/main/runtime/orca-runtime-restore-structured-agent-session-tabs-once.ts` | agent-stack, shared | `../native-chat/agent-session-wire/structured-agent-session-registry`, `./structured-conversation-tab-replacement`, `../native-chat/agent-session-wire/structured-conversation-command`, `../../shared/ssh-pty-id` |
| `src/main/runtime/orca-runtime-runtime-id.ts` | agent-stack | `../native-chat/agent-session-wire/structured-agent-session-registry`, `./structured-conversation-tab-replacement` |
| `src/main/runtime/orca-runtime-state-fields.ts` | agent-stack, ai-vault | `../native-chat/agent-session-wire/structured-agent-session-status-feed`, `../native-chat/host-readable-transcript-path`, `../ai-vault/cached-session-list` |
| `src/main/runtime/orca-runtime-stop-requested-pty-ids.ts` | agent-stack, browser | `./structured-worker-identity`, `./structured-worker-authority`, `../browser/agent-browser-bridge`, `../browser/browser-backend` |
| `src/main/runtime/orca-runtime-subscribe-to-terminal-resize.ts` | agent-stack, shared | `./structured-worker-identity`, `../../shared/orchestration-task-display` |
| `src/main/runtime/orca-runtime-terminal-create-deduplication.ts` | remote-host | `../ssh/ssh-target-registry` |
| `src/main/runtime/orca-runtime-test-fixtures.spec.ts` | shared | `../../shared/ssh-pty-id` |
| `src/main/runtime/orca-runtime-test-mocks.spec.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/orca-runtime-test-mocks/imported-values.spec.ts` | remote-host | `../../providers/ssh-filesystem-dispatch`, `../../providers/ssh-git-dispatch` |
| `src/main/runtime/orca-runtime-tests/browser-capabilities.spec.ts` | browser | `../../browser/browser-identity-mode-store` |
| `src/main/runtime/orca-runtime-tests/mobile-web-bundle-capability.spec.ts` | shared | `../../../shared/mobile-web-bundle/mobile-web-bundle-capability` |
| `src/main/runtime/orca-runtime-tests/terminal-creation-and-readiness-part-07.spec.ts` | shared | `../../../shared/orca-dispatch-status-prompt` |
| `src/main/runtime/orca-runtime-transition-graph-reload-to-terminal-state.ts` | remote-host, browser | `../providers/ssh-filesystem-dispatch`, `../browser/browser-network-execution-route` |
| `src/main/runtime/orca-runtime-verify-orchestration-compatibility-caller.ts` | shared | `../../shared/orchestration-compatibility-evidence` |
| `src/main/runtime/orca-runtime-write-orchestration-pointer-pty.ts` | agent-stack, shared | `./runtime-mobile-agent-status-projection`, `../../shared/ssh-pty-id` |
| `src/main/runtime/orca-runtime.ts` | agent-stack | `./runtime-mobile-notification-controller` |
| `src/main/runtime/orchestration-fleet-agent-status-snapshot.ts` | shared | `../../shared/orchestration-fleet-agent-status-evidence` |
| `src/main/runtime/orchestration/canonical-orca-session-id.ts` | shared | `../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/db/contract-constants.ts` | shared | `../../../../shared/orchestration-rpc-contract` |
| `src/main/runtime/orchestration/db/dispatch-context/dispatch-context-store.ts` | agent-stack | `../../../structured-worker-identity` |
| `src/main/runtime/orchestration/db/dispatch-depth.ts` | shared | `../../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/db/dispatch-row-writer.ts` | shared | `../../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/db/orca-session-address-sql.ts` | shared | `../../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/db/runs/run-binding.ts` | shared | `../../../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/db/runs/run-coordinator-orca-session.ts` | shared | `../../../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/db/runs/run-create.ts` | shared | `../../../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/db/runs/run-lookup.ts` | shared | `../../../../../shared/orchestration-run-pagination` |
| `src/main/runtime/orchestration/db/schema/structured-worker-orca-session-backfill.ts` | shared, agent-stack | `../../../../../shared/orca-session-address`, `../../../structured-worker-identity` |
| `src/main/runtime/orchestration/db/tasks/task-store.ts` | shared | `../../../../../shared/orchestration-task-display` |
| `src/main/runtime/orchestration/db/worker-dispatch/worker-dispatch-authority.ts` | agent-stack | `../../../structured-worker-identity` |
| `src/main/runtime/orchestration/db/worker-terminal/failed-start-dispatch-identity.ts` | agent-stack | `../../../structured-worker-identity` |
| `src/main/runtime/orchestration/formatter.ts` | shared | `../../../shared/orchestration-rpc-contract` |
| `src/main/runtime/orchestration/orchestration-caller-identity.ts` | shared | `../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/orchestration-legacy-worker-terminal-recovery.ts` | agent-stack | `../structured-worker-identity` |
| `src/main/runtime/orchestration/orchestration-party.ts` | shared, agent-stack | `../../../shared/orca-session-address`, `../../../shared/orchestration-session-caller-codes`, `../structured-worker-authority` |
| `src/main/runtime/orchestration/preamble.ts` | shared | `../../../shared/orca-dispatch-status-prompt` |
| `src/main/runtime/orchestration/structured-mailbox-pointer-host.ts` | agent-stack | `../../native-chat/agent-session-wire/structured-agent-session-mutation-admission`, `../../native-chat/agent-session-wire/structured-agent-session-registry` |
| `src/main/runtime/orchestration/structured-session-pointer-delivery.ts` | shared | `../../../shared/structured-agent-session-projection` |
| `src/main/runtime/orchestration/structured-worker-group-addressing.ts` | agent-stack | `../structured-worker-authority`, `../structured-worker-identity` |
| `src/main/runtime/orchestration/structured-worker-journal-archive.ts` | shared | `../../../shared/native-chat-types`, `../../../shared/structured-agent-session-projection` |
| `src/main/runtime/orchestration/structured-worker-journal-page.ts` | agent-stack | `../../native-chat/agent-session-wire/structured-agent-session-registry` |
| `src/main/runtime/orchestration/task-dispatch-refusal.ts` | shared | `../../../shared/orchestration-dispatch-refusal-contract` |
| `src/main/runtime/orchestration/types.ts` | shared | `../../../shared/orca-session-address` |
| `src/main/runtime/orchestration/worker-attention-context.ts` | shared | `../../../shared/orchestration-fleet-agent-status-evidence`, `../../../shared/orchestration-fleet-attention`, `../../../shared/orchestration-fleet-outcome-resolution`, `../../../shared/orchestration-fleet-worker-projection` |
| `src/main/runtime/orchestration/worker-output-archive.ts` | shared, remote-host, agent-stack | `../../../shared/native-chat-types`, `../../../shared/orchestration-worker-output`, `../../providers/ssh-filesystem-dispatch`, `../structured-worker-authority`, `../structured-worker-identity` |
| `src/main/runtime/orchestration/worker-provider-session.ts` | shared | `../../../shared/orchestration-worker-output` |
| `src/main/runtime/orchestration/worker-transcript-activity-block-bounds.ts` | shared | `../../../shared/native-chat-background-task-row`, `../../../shared/native-chat-subagent-summary`, `../../../shared/native-chat-types` |
| `src/main/runtime/orchestration/worker-transcript-local-read.ts` | shared, agent-stack | `../../../shared/native-chat-types`, `../../native-chat/transcript-tail-reader`, `../../native-chat/transcript-fallback-id` |
| `src/main/runtime/orchestration/worker-transcript-payload.ts` | shared, agent-stack | `../../../shared/native-chat-types`, `../../native-chat/subagent-entry-id-bounds` |
| `src/main/runtime/orchestration/worker-transcript-read.ts` | shared, agent-stack | `../../../shared/native-chat-types`, `../../../shared/native-chat-agent-support`, `../../../shared/orchestration-worker-output`, `../../native-chat/session-file-resolver`, `../../native-chat/transcript-tail-reader` |
| `src/main/runtime/orchestration/worker-transcript-remote-read.ts` | shared, agent-stack, remote-host | `../../../shared/native-chat-types`, `../../../shared/orchestration-worker-output`, `../../native-chat/transcript-tail-reader`, `../../native-chat/transcript-fallback-id`, `../../ssh/ssh-file-stream-read-cap` |
| `src/main/runtime/pairing-endpoint.ts` | shared | `../../shared/mobile-pairing-protocol-limits` |
| `src/main/runtime/pairing-network-interfaces.ts` | shared | `../../shared/pairing-address-auto-selection`, `../../shared/tailnet-address` |
| `src/main/runtime/remote-browser-screencast-frame-admission.ts` | shared | `../../shared/remote-runtime-memory-limits` |
| `src/main/runtime/rpc/core.ts` | shared | `../../../shared/mobile-relay-credential-contract`, `../../../shared/orchestration-compatibility-evidence` |
| `src/main/runtime/rpc/dispatcher-caller-fingerprint.ts` | shared | `../../../shared/orchestration-rpc-contract` |
| `src/main/runtime/rpc/e2ee-channel.ts` | shared, telemetry-stack | `../../../shared/remote-runtime-request-frames`, `../../../shared/telemetry-events`, `../../telemetry/client` |
| `src/main/runtime/rpc/e2ee-crypto.ts` | shared | `../../../shared/e2ee-crypto` |
| `src/main/runtime/rpc/errors.ts` | shared | `../../../shared/orchestration-session-caller-codes`, `../../../shared/computer-use-error-recovery`, `../../../shared/linear/agent-access`, `../../../shared/artifact-sharing-gate`, `../../../shared/skill-install-failure` |
| `src/main/runtime/rpc/methods/agent-launch-replay.ts` | agent-stack | `../../../native-chat/agent-session-wire/structured-agent-session-replay-outcome`, `../../../native-chat/agent-session-wire/structured-agent-session-registry` |
| `src/main/runtime/rpc/methods/agent-launch-structured-prompt.ts` | shared, agent-stack | `../../../../shared/structured-agent-session-outbox`, `../../../../shared/structured-agent-session-mutation`, `../../../native-chat/agent-session-wire/structured-agent-session-host`, `../../../native-chat/agent-session-wire/structured-agent-session-host-types` |
| `src/main/runtime/rpc/methods/agent-launch-surfaces.ts` | shared, agent-stack | `../../../../shared/telemetry-property-schemas`, `../../../../shared/native-chat-session-option-defaults`, `../../../../shared/structured-agent-session-mutation`, `../../../../shared/structured-agent-session-projection`, `../../../../shared/structured-agent-session-create`, `../../../native-chat/agent-session-wire/structured-agent-session-registry`, `../../../native-chat/agent-session-wire/structured-agent-session-host` |
| `src/main/runtime/rpc/methods/agent-launch-worktree-creation.ts` | automations | `../../../automations/workspace-provenance` |
| `src/main/runtime/rpc/methods/client-events.ts` | remote-host | `../../../ssh/ssh-target-registry`, `../../public-ssh-state` |
| `src/main/runtime/rpc/methods/client-ui.ts` | shared | `../../../../shared/pairing-local-ui-fields` |
| `src/main/runtime/rpc/methods/computer.ts` | computer, src/main/runtime/rpc/methods/computer.ts | `../../../computer/sidecar-client`, `../../../computer/macos-computer-use-permissions`, `computer,[object Set]`, `src/main/runtime/rpc/methods/computer.ts,[object Map]` |
| `src/main/runtime/rpc/methods/files-remote-content-budget.ts` | shared | `../../../../shared/remote-rpc-content-budget` |
| `src/main/runtime/rpc/methods/git-diff-methods.ts` | shared | `../../../../shared/remote-rpc-content-budget` |
| `src/main/runtime/rpc/methods/index.ts` | forge-task | `./ai-vault`, `./browser-core`, `./browser-identity-rpc`, `./browser-extras`, `./browser-screencast`, `./browser-client-host`, `./browser-client-file-channel`, `./browser-network-tunnel`, `./native-chat`, `./github`, `./gitlab`, `./linear`, `./linear-agent-access`, `./jira`, `./skills` |
| `src/main/runtime/rpc/methods/mobile-web-bundle-asset-reader.ts` | shared | `../../../../shared/mobile-web-bundle/manifest-contract` |
| `src/main/runtime/rpc/methods/mobile-web-bundle-range-encoding.ts` | shared | `../../../../shared/mobile-web-bundle/bundle-rpc-contract` |
| `src/main/runtime/rpc/methods/mobile-web-bundle.test-fixture.ts` | shared | `../../../../shared/mobile-web-bundle/bundle-rpc-contract`, `../../../../shared/mobile-web-bundle/manifest-contract` |
| `src/main/runtime/rpc/methods/mobile-web-bundle.ts` | shared | `../../../../shared/mobile-web-bundle/bundle-rpc-contract`, `../../../../shared/mobile-web-bundle/manifest-contract` |
| `src/main/runtime/rpc/methods/notification-stream-policy.ts` | agent-stack | `../../runtime-mobile-notification-controller` |
| `src/main/runtime/rpc/methods/orchestration-caller-workspace.ts` | agent-stack | `../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration-structured-worker-lifecycle.ts` | shared, agent-stack | `../../../../shared/native-chat-types`, `../../../../shared/orchestration-worker-output`, `../../../../shared/structured-agent-session-projection`, `../../structured-worker-authority`, `../../structured-worker-identity`, `../../structured-agent-session-close` |
| `src/main/runtime/rpc/methods/orchestration-structured-worker-session.ts` | agent-stack | `../../../native-chat/agent-session-wire/structured-agent-session-host`, `../../../native-chat/agent-session-wire/structured-agent-session-registry`, `../../structured-agent-session-tab-retirement`, `../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration/federation/federated-fleet-host-groups.ts` | shared | `../../../../../../shared/orchestration-fleet-projection` |
| `src/main/runtime/rpc/methods/orchestration/federation/federated-fleet-snapshot.ts` | shared | `../../../../../../shared/orchestration-fleet-projection`, `../../../../../../shared/orchestration-fleet-worker-projection` |
| `src/main/runtime/rpc/methods/orchestration/federation/federated-worker-read.ts` | shared | `../../../../../../shared/orchestration-worker-output` |
| `src/main/runtime/rpc/methods/orchestration/federation/federated-worker-show.ts` | shared | `../../../../../../shared/orchestration-fleet-projection` |
| `src/main/runtime/rpc/methods/orchestration/federation/federated-worker-start.ts` | shared | `../../../../../../shared/orchestration-rpc-contract`, `../../../../../../shared/orchestration-timing-budgets` |
| `src/main/runtime/rpc/methods/orchestration/federation/federation.ts` | shared | `../../../../../../shared/orchestration-timing-budgets` |
| `src/main/runtime/rpc/methods/orchestration/messaging/ask-methods.ts` | shared | `../../../../../../shared/orchestration-ask-timeout` |
| `src/main/runtime/rpc/methods/orchestration/messaging/ask-remote.ts` | shared | `../../../../../../shared/orchestration-ask-timeout` |
| `src/main/runtime/rpc/methods/orchestration/messaging/check-direct.ts` | shared | `../../../../../../shared/orchestration-rpc-contract` |
| `src/main/runtime/rpc/methods/orchestration/messaging/check-methods.ts` | shared | `../../../../../../shared/orchestration-rpc-contract` |
| `src/main/runtime/rpc/methods/orchestration/messaging/message-methods.ts` | shared | `../../../../../../shared/orchestration-rpc-contract`, `../../../../../../shared/orchestration-task-summary` |
| `src/main/runtime/rpc/methods/orchestration/messaging/recipient-routing.ts` | agent-stack | `../../../../structured-worker-authority`, `../../../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration/messaging/send-methods.ts` | shared | `../../../../../../shared/orchestration-rpc-contract` |
| `src/main/runtime/rpc/methods/orchestration/runs/mutation-request-show.ts` | shared | `../../../../../../shared/orchestration-mutation-request` |
| `src/main/runtime/rpc/methods/orchestration/runs/run-scope.ts` | shared | `../../../../../../shared/orchestration-compatibility-evidence`, `../../../../../../shared/orchestration-rpc-contract` |
| `src/main/runtime/rpc/methods/orchestration/worker/explicit-worker-terminal-validation.ts` | agent-stack | `../../../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration/worker/structured-worker-release-stop.ts` | agent-stack | `../../../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-archive-read.ts` | shared | `../../../../../../shared/orchestration-worker-output` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-legacy-federated-read.ts` | shared | `../../../../../../shared/orchestration-worker-output` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-list-method.ts` | shared | `../../../../../../shared/orchestration-fleet-projection` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-list-projection.ts` | shared | `../../../../../../shared/orchestration-fleet-projection`, `../../../../../../shared/orchestration-fleet-outcome-resolution` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-observation.ts` | shared | `../../../../../../shared/orchestration-fleet-projection` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-output.ts` | shared, remote-host | `../../../../../../shared/orchestration-worker-output`, `../../../../../providers/ssh-filesystem-dispatch` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-release-completion.ts` | agent-stack | `../../../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-start-budgets.ts` | shared | `../../../../../../shared/orchestration-timing-budgets` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-start-prompt-budget.ts` | shared | `../../../../../../shared/orchestration-worker-start-prompt-budget` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-start-receipt.ts` | agent-stack | `../../../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-start-turn-observation.ts` | shared | `../../../../../../shared/orchestration-timing-budgets` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-stop.ts` | agent-stack | `../../../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-terminal-release-lease.ts` | agent-stack | `../../../../structured-worker-authority`, `../../../../structured-worker-identity` |
| `src/main/runtime/rpc/methods/orchestration/worker/worker-topology.ts` | shared | `../../../../../../shared/native-chat-session-option-defaults` |
| `src/main/runtime/rpc/methods/orchestration/worker/workers.ts` | shared | `../../../../../../shared/orchestration-timing-budgets` |
| `src/main/runtime/rpc/methods/pairing.ts` | shared | `../../../../shared/mobile-relay-credential-contract` |
| `src/main/runtime/rpc/methods/repo.ts` | forge-task | `./github-repo-target-schemas` |
| `src/main/runtime/rpc/methods/session-tab-close-methods.ts` | telemetry-stack | `../../../observability/tracer` |
| `src/main/runtime/rpc/methods/session-tabs.ts` | ai-vault | `../../../ai-vault/structured-session-ownership` |
| `src/main/runtime/rpc/methods/ssh.ts` | remote-host, shared | `../../../ssh/ssh-target-registry`, `../../public-ssh-state`, `../../../../shared/ssh-types` |
| `src/main/runtime/rpc/methods/status.ts` | remote-host | `../../remote-server-updater` |
| `src/main/runtime/rpc/methods/structured-agent-session-conversation-outline.ts` | agent-stack | `../../../native-chat/agent-session-wire/agent-session-conversation-outline` |
| `src/main/runtime/rpc/methods/structured-agent-session-create.ts` | agent-stack, shared | `../../../native-chat/agent-session-wire/structured-agent-session-attach`, `../../../native-chat/agent-session-wire/structured-agent-session-host`, `../../../native-chat/agent-session-wire/structured-agent-session-host-types`, `../../../../shared/structured-agent-session-create` |
| `src/main/runtime/rpc/methods/structured-agent-session-gate.ts` | agent-stack | `../../../native-chat/agent-session-wire/structured-agent-session-registry`, `../../../native-chat/agent-session-wire/structured-agent-session-host`, `../../../native-chat/agent-session-wire/structured-agent-session-host-types` |
| `src/main/runtime/rpc/methods/structured-agent-session-reveal.ts` | agent-stack | `../../../native-chat/agent-session-wire/structured-agent-session-host-types`, `../../../native-chat/agent-session-wire/structured-agent-session-mutation-admission` |
| `src/main/runtime/rpc/methods/structured-agent-session-rpc.test-fixture.ts` | agent-stack | `../../../native-chat/agent-session-journal/journal-store`, `../../../native-chat/agent-session-wire/structured-agent-session-host`, `../../../native-chat/agent-session-wire/structured-agent-session-registry`, `../../../native-chat/agent-session-wire/structured-agent-session-status-feed` |
| `src/main/runtime/rpc/methods/structured-agent-session-send-compatibility.ts` | agent-stack | `../../../native-chat/agent-session-wire/structured-agent-session-host` |
| `src/main/runtime/rpc/methods/structured-agent-session.ts` | agent-stack | `../../../native-chat/agent-session-wire/structured-agent-session-attach` |
| `src/main/runtime/rpc/methods/terminal/terminal-send-method.ts` | ai-vault | `../../../../ai-vault/structured-session-ownership` |
| `src/main/runtime/rpc/methods/worktree.ts` | automations | `../../../automations/workspace-provenance` |
| `src/main/runtime/rpc/mobile-e2ee-auth-validation.ts` | shared | `../../../shared/remote-runtime-request-frames` |
| `src/main/runtime/rpc/mobile-e2ee-outbound-admission.ts` | shared | `../../../shared/remote-runtime-memory-limits` |
| `src/main/runtime/rpc/mobile-e2ee-v2-client-capabilities.ts` | shared | `../../../shared/remote-runtime-request-frames` |
| `src/main/runtime/rpc/mobile-e2ee-v2-desktop-session.ts` | shared | `../../../shared/mobile-e2ee-v2-contract`, `../../../shared/mobile-e2ee-v2-framing`, `../../../shared/remote-runtime-memory-limits` |
| `src/main/runtime/rpc/orchestration-contract-fence.ts` | shared | `../../../shared/orchestration-rpc-contract` |
| `src/main/runtime/rpc/orchestration-legacy-authority.ts` | shared | `../../../shared/orchestration-compatibility-evidence` |
| `src/main/runtime/rpc/orchestration-legacy-compatibility-dispatcher-test-fixture.ts` | shared | `../../../shared/orchestration-compatibility-evidence` |
| `src/main/runtime/rpc/orchestration-legacy-mail.ts` | shared | `../../../shared/orchestration-message-wait-timeout` |
| `src/main/runtime/rpc/orchestration-legacy-question.ts` | shared | `../../../shared/orchestration-ask-timeout` |
| `src/main/runtime/rpc/orchestration-mutation-executor.ts` | shared | `../../../shared/orchestration-rpc-contract`, `../../../shared/orca-session-address` |
| `src/main/runtime/rpc/orchestration-mutation-receipt.ts` | shared | `../../../shared/orchestration-rpc-contract`, `../../../shared/orca-session-address` |
| `src/main/runtime/rpc/orchestration-session-caller-test-fixture.ts` | shared, agent-stack | `../../../shared/orchestration-compatibility-evidence`, `../../../shared/orca-session-address`, `../../../shared/orca-session-address-test-fixture`, `../structured-worker-identity` |
| `src/main/runtime/rpc/orchestration-session-caller.ts` | shared, agent-stack | `../../../shared/orca-session-address`, `../../../shared/orchestration-session-caller-codes`, `../../native-chat/agent-session-wire/structured-agent-session-registry`, `../structured-worker-identity` |
| `src/main/runtime/rpc/terminal-close-attribution.ts` | telemetry-stack | `../../observability/tracer` |
| `src/main/runtime/runtime-account-controller.ts` | agent-stack | `../claude-accounts/service`, `../codex-accounts/service`, `../codex-accounts/runtime-selection`, `../rate-limits/service`, `../claude-accounts/runtime-selection` |
| `src/main/runtime/runtime-agent-orchestration-projection.ts` | shared | `../../shared/orchestration-fleet-agent-status-evidence`, `../../shared/orchestration-task-display` |
| `src/main/runtime/runtime-ai-vault-commands.ts` | ai-vault | `../ai-vault/cached-session-list`, `../ai-vault/session-title-resolver` |
| `src/main/runtime/runtime-artifact-controller.ts` | shared, artifacts | `../../shared/artifacts`, `../artifacts/artifact-cloud-service` |
| `src/main/runtime/runtime-automation-controller.ts` | automations | `../automations/service`, `../automations/refused-manual-run` |
| `src/main/runtime/runtime-browser-client-automation.ts` | shared | `../../shared/browser-client-automation-protocol` |
| `src/main/runtime/runtime-browser-client-page-adoption.ts` | shared | `../../shared/browser-client-host-protocol` |
| `src/main/runtime/runtime-browser-client-page-creation.ts` | shared, browser | `../../shared/browser-client-host-protocol`, `../../shared/browser-client-automation-protocol`, `../browser/browser-network-execution-route` |
| `src/main/runtime/runtime-browser-client-page-recovery.ts` | shared | `../../shared/browser-client-automation-protocol`, `../../shared/browser-client-host-protocol` |
| `src/main/runtime/runtime-browser-commands-active-screencasts-by-page-id.ts` | browser | `../browser/agent-browser-bridge`, `../browser/browser-error`, `../ipc/browser-tab-registration-wait` |
| `src/main/runtime/runtime-browser-commands-browser-click.ts` | browser | `../browser/browser-screencast-stream-types` |
| `src/main/runtime/runtime-browser-commands-browser-command-target-params.ts` | browser, shared | `../browser/browser-screencast-stream-types`, `../browser/browser-screencast-frame-budget`, `../browser/agent-browser-bridge`, `../browser/browser-backend`, `../../shared/browser-client-host-protocol` |
| `src/main/runtime/runtime-browser-commands-browser-profile-import-from-browser.ts` | browser | `../browser/browser-session-registry`, `../browser/browser-cookie-import` |
| `src/main/runtime/runtime-browser-commands-browser-screencast.ts` | browser | `../browser/browser-error`, `../browser/browser-screencast-stream`, `../browser/browser-screencast-stream-types` |
| `src/main/runtime/runtime-browser-commands-browser-tab-close.ts` | browser | `../browser/browser-error`, `../browser/browser-manager`, `../browser/browser-session-registry` |
| `src/main/runtime/runtime-browser-commands-browser-tab-create.ts` | shared, browser | `../../shared/browser-client-host-placement`, `../../shared/browser-client-automation-protocol`, `../browser/browser-session-registry`, `../browser/browser-error`, `../browser/browser-network-execution-route`, `../ipc/browser-tab-registration-wait` |
| `src/main/runtime/runtime-browser-commands-browser-tab-list.ts` | shared, browser | `../../shared/browser-workspace-types`, `../browser/browser-manager`, `../browser/browser-error` |
| `src/main/runtime/runtime-browser-commands-browser-tab-set-profile.ts` | browser | `../browser/browser-error`, `../browser/browser-session-registry`, `../browser/browser-manager`, `../ipc/browser-tab-registration-wait`, `../browser/browser-cookie-import` |
| `src/main/runtime/runtime-browser-commands-factory.ts` | browser | `../browser/browser-error` |
| `src/main/runtime/runtime-browser-commands-list-logical-browser-tabs.ts` | browser | `../browser/browser-session-registry`, `../browser/browser-error`, `../browser/browser-manager` |
| `src/main/runtime/runtime-browser-network-execution-host.ts` | shared | `../../shared/browser-client-host-protocol`, `../../shared/ssh-types` |
| `src/main/runtime/runtime-browser-screencast-controller.ts` | browser | `../browser/browser-error` |
| `src/main/runtime/runtime-client-settings.ts` | shared | `../../shared/artifact-sharing-gate`, `../../shared/task-providers`, `../../shared/native-chat-session-option-defaults`, `../../shared/native-chat-session-options` |
| `src/main/runtime/runtime-file-command-target.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/runtime/runtime-file-commands-active-runtime-text-searches.ts` | agent-stack | `./runtime-mobile-file-path-search` |
| `src/main/runtime/runtime-file-commands-assert-remote-terminal-file-grant-path-still-canonical.ts` | remote-host | `../providers/ssh-filesystem-dispatch`, `./runtime-file-commands-ssh-file-watcher-rearm` |
| `src/main/runtime/runtime-file-commands-constructor.ts` | agent-stack | `./runtime-mobile-file-path-search` |
| `src/main/runtime/runtime-file-commands-mobile-file-list-limit.ts` | remote-host, shared | `../ssh/ssh-filesystem-stream-reader`, `../ssh/ssh-connection-generation`, `../../shared/remote-rpc-content-budget` |
| `src/main/runtime/runtime-file-commands-read-file-explorer-preview.ts` | remote-host | `./ssh-file-explorer-chunk-read` |
| `src/main/runtime/runtime-file-commands-resolve-allowed-terminal-artifact-path.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/runtime/runtime-file-commands-resolve-terminal-path.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/runtime/runtime-file-watcher-leases.ts` | remote-host | `./runtime-file-commands-ssh-file-watcher-rearm` |
| `src/main/runtime/runtime-git-command-target.ts` | remote-host | `../providers/ssh-git-dispatch`, `../providers/ssh-git-provider` |
| `src/main/runtime/runtime-git-generation-commands.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/runtime/runtime-github-issue-comment-commands.ts` | shared, forge-task | `../../shared/github/pull-request-types`, `../../shared/github/comment-types`, `../github/client` |
| `src/main/runtime/runtime-github-project-commands.ts` | forge-task, shared | `../github/project-view`, `../../shared/github/project-request-types` |
| `src/main/runtime/runtime-github-repository-query-commands.ts` | shared, forge-task | `../../shared/github/work-item-types`, `../../shared/github/repository-identity-key`, `../github/client`, `../github/gh-account-binding-inventory`, `../github/rate-limit`, `../github/work-item-details` |
| `src/main/runtime/runtime-github-review-mutation-commands.ts` | shared, forge-task | `../../shared/github/pull-request-types`, `../../shared/github/comment-types`, `../github/client` |
| `src/main/runtime/runtime-github-review-query-commands.ts` | shared, forge-task | `../../shared/github/pull-request-types`, `../github/client`, `../github/work-item-details` |
| `src/main/runtime/runtime-github-worktree-base.ts` | forge-task, remote-host | `../github/pr-head-tracking-ref`, `../github/pr-start-point`, `../github/review-head-remote`, `../providers/ssh-git-dispatch` |
| `src/main/runtime/runtime-gitlab-fork-mr-base.ts` | forge-task, remote-host | `../gitlab/mr-head-tracking-ref`, `../providers/ssh-git-dispatch` |
| `src/main/runtime/runtime-gitlab-issue-source-remote.ts` | forge-task, remote-host | `../gitlab/client`, `../gitlab/gl-utils`, `../providers/ssh-git-dispatch` |
| `src/main/runtime/runtime-gitlab-mutation-commands.ts` | shared, forge-task | `../../shared/gitlab-types`, `../gitlab/client` |
| `src/main/runtime/runtime-gitlab-query-commands.ts` | shared, forge-task | `../../shared/gitlab-types`, `../gitlab/client`, `../gitlab/gitlab-preload-args`, `../gitlab/work-item-details` |
| `src/main/runtime/runtime-gitlab-worktree-base.ts` | forge-task, remote-host | `../gitlab/client`, `../gitlab/gl-utils`, `../providers/ssh-git-dispatch` |
| `src/main/runtime/runtime-hosted-review-commands.ts` | shared, forge-task | `../../shared/github/pull-request-types`, `../../shared/github/pull-request-refresh-types`, `../github/client`, `../github/pr-refresh-candidate-policy` |
| `src/main/runtime/runtime-jira-commands.ts` | shared, forge-task | `../../shared/jira-types`, `../jira/client`, `../jira/issues` |
| `src/main/runtime/runtime-legacy-worker-terminal-recovery-controller.ts` | shared | `../../shared/ssh-pty-id` |
| `src/main/runtime/runtime-legacy-worker-terminal-recovery-runner.ts` | shared | `../../shared/ssh-pty-id` |
| `src/main/runtime/runtime-linear-browse-commands.ts` | shared, forge-task | `../../shared/linear/project-types`, `../../shared/linear/workspace-types`, `../../shared/linear/issue-read-limits`, `../linear/linear-issue-comments`, `../linear/projects`, `../linear/teams` |
| `src/main/runtime/runtime-linear-command-dependencies.ts` | shared, forge-task | `../../shared/linear/agent-access`, `../../shared/linear/project-types`, `../../shared/linear/workspace-types`, `../../shared/linear/issue-read-limits`, `../../shared/linear/uuid`, `../linear/client`, `../linear/linear-issue-comments`, `../linear/linear-issue-mutations`, `../linear/linear-issue-lookups`, `../linear/linear-issue-listing`, `../linear/linear-issue-query-documents`, `../linear/linear-issue-write-support`, `../linear/issue-context`, `../linear/issue-context-errors`, `../linear/mcp-issue-list`, `../linear/issue-relation-write`, `../linear/projects`, `../linear/teams` |
| `src/main/runtime/runtime-linear-read-commands.ts` | shared | `../../shared/linear/priority-label` |
| `src/main/runtime/runtime-local-worktree-create-candidate.ts` | forge-task | `../github/client` |
| `src/main/runtime/runtime-managed-worktree-create-types.ts` | shared | `../../shared/task-source-context` |
| `src/main/runtime/runtime-message-waiters.ts` | shared | `../../shared/orchestration-message-wait-timeout` |
| `src/main/runtime/runtime-orchestration-federation.ts` | shared | `../../shared/orchestration-rpc-contract` |
| `src/main/runtime/runtime-preserved-branch-cleanup.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/runtime/runtime-project-group-controller.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/runtime/runtime-registered-remote-worktree-removal.ts` | remote-host | `../providers/ssh-git-provider` |
| `src/main/runtime/runtime-repository-fork-backfill.ts` | shared, forge-task | `../../shared/github/pull-request-types`, `../github/client` |
| `src/main/runtime/runtime-repository-hooks-commands.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/runtime/runtime-repository-issue-command.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/runtime/runtime-repository-ref-queries.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/runtime/runtime-repository-settings-controller.ts` | shared | `../../shared/github/account-binding` |
| `src/main/runtime/runtime-rpc-startup-failure.ts` | shared, telemetry-stack | `../../shared/telemetry-events`, `../telemetry/client` |
| `src/main/runtime/runtime-rpc/runtime-rpc-mobile-pairing.ts` | shared | `../../../shared/mobile-pairing-connection-mode`, `../../../shared/mobile-relay-mint-failure` |
| `src/main/runtime/runtime-rpc/runtime-rpc-pairing-types.ts` | shared, remote-host | `../../../shared/mobile-relay-pairing-offer`, `../../../shared/mobile-pairing-connection-mode`, `../../../shared/mobile-relay-mint-failure`, `../../../shared/mobile-relay-credential-contract`, `../relay/relay-revoke-outbox` |
| `src/main/runtime/runtime-rpc/runtime-rpc-pairing.ts` | remote-host | `../relay/relay-revoke-outbox`, `../push/push-unregister-outbox` |
| `src/main/runtime/runtime-rpc/runtime-rpc-state.ts` | remote-host | `../relay/relay-revoke-outbox`, `../push/push-unregister-outbox` |
| `src/main/runtime/runtime-rpc/runtime-rpc-websocket-dispatch.ts` | shared | `../../../shared/mobile-relay-credential-contract` |
| `src/main/runtime/runtime-service-command-surface.ts` | agent-stack | `./runtime-mobile-notification-controller` |
| `src/main/runtime/runtime-skill-command-contract.ts` | shared, already-done | `../../shared/skill-bundle-install-contract`, `../../shared/skill-upload-session-contract`, `../skills/skill-upload-session-service` |
| `src/main/runtime/runtime-skill-command-surface.ts` | already-done | `../skills/agent-skill-selection`, `../skills/skill-share-preparation-service` |
| `src/main/runtime/runtime-skill-install-authority.ts` | shared, already-done | `../../shared/skill-ssh-relay-contract`, `../skills/skill-install-destinations`, `../skills/skill-provider-runtime-roots` |
| `src/main/runtime/runtime-skill-install-commands.ts` | already-done, shared | `../skills/skill-install-request-service`, `../skills/skill-bundle-install-request-service`, `../skills/skill-upload-session-service`, `../skills/skill-upload-staging-ownership`, `../skills/skill-bundle-ssh-relay-service`, `../skills/skill-ssh-relay-destination`, `../skills/skill-ssh-relay-service`, `../../shared/skill-bundle-install-contract` |
| `src/main/runtime/runtime-skill-install-queries.ts` | already-done | `../skills/skill-install-provenance`, `../skills/skill-wsl-install-filesystem`, `../skills/skill-install-filesystem`, `../skills/skill-ssh-relay-service`, `../skills/skill-bundle-ssh-relay-service`, `../skills/skill-install-management-service`, `../skills/skill-ssh-relay-destination` |
| `src/main/runtime/runtime-skill-types.ts` | shared, already-done | `../../shared/skill-cloud-contract`, `../../shared/skill-install-contract`, `../../shared/skill-bundle-install-contract`, `../../shared/skill-upload-session-contract`, `../skills/skill-cloud-service`, `../skills/skill-provider-destinations` |
| `src/main/runtime/runtime-terminal-contracts.ts` | shared | `../../shared/orchestration-compatibility-evidence` |
| `src/main/runtime/runtime-terminal-spawn-push-target-materialization.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/runtime/runtime-worktree-agent-startup.ts` | shared | `../../shared/telemetry-property-schemas` |
| `src/main/runtime/runtime-worktree-create-git.ts` | forge-task | `../github/client` |
| `src/main/runtime/selected-review-branch.ts` | forge-task | `../github/client` |
| `src/main/runtime/worktree-teardown.ts` | agent-stack | `./structured-session-worktree-teardown` |
| `src/main/source-control/forge-provider.ts` | forge-task | `../azure-devops/client`, `../azure-devops/pull-request-creation`, `../bitbucket/client`, `../bitbucket/pull-request-creation`, `../gitea/client`, `../gitea/pull-request-creation`, `../github/client`, `../gitlab/client`, `../gitlab/merge-request-creation` |
| `src/main/source-control/forge-review-mappers.ts` | shared, forge-task | `../../shared/github/pull-request-types`, `../../shared/gitlab-types`, `../azure-devops/pull-request-mappers`, `../bitbucket/pull-request-mappers`, `../gitea/pull-request-mappers` |
| `src/main/source-control/hosted-review-creation-git-state.ts` | forge-task | `../github/gh-utils` |
| `src/main/source-control/hosted-review-creation-provider.ts` | forge-task | `../azure-devops/pull-request-creation`, `../bitbucket/pull-request-creation`, `../gitea/pull-request-creation`, `../github/github-enterprise-repository`, `../github/gh-utils`, `../gitlab/client`, `../gitlab/gl-utils` |
| `src/main/source-control/hosted-review-creation.ts` | forge-task, shared | `../github/client`, `../../shared/github/repository-identity-key` |
| `src/main/source-control/hosted-review-git-options.ts` | shared | `../../shared/github/account-binding` |
| `src/main/source-control/pull-request-linked-issue.ts` | forge-task | `../github/issues`, `../gitlab/issues` |
| `src/main/source-control/pull-request-template.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/source-control/repo-default-branch.ts` | remote-host | `../providers/ssh-git-dispatch` |
| `src/main/source-control/stacked-hosted-review-creation.ts` | forge-task | `../github/stacked-pr-creation` |
| `src/main/startup/cli-launch-redirect.ts` | remote-host | `./serve-mode-argv` |
| `src/main/startup/codex-launch-preparation.ts` | agent-stack | `../codex-accounts/runtime-selection` |
| `src/main/startup/codex-session-resume-launch.ts` | agent-stack | `../codex-accounts/runtime-selection`, `../codex-accounts/host-codex-managed-home-ownership` |
| `src/main/startup/gpu-lifecycle.ts` | telemetry-stack | `../crash-reporting/gpu-fallback-recovered-launch`, `../crash-reporting/gpu-fallback-restart-prompt`, `../crash-reporting/gpu-fallback-engagement`, `../crash-reporting/crash-breadcrumb-store`, `../crash-reporting/durable-crash-breadcrumb` |
| `src/main/startup/main-process-account-services.ts` | agent-stack, browser | `../rate-limits/service`, `../codex-accounts/runtime-home-service`, `../codex-accounts/service`, `../claude-accounts/runtime-auth-service`, `../claude-accounts/service`, `../rate-limits/codex-rate-limit-target`, `../rate-limits/claude-rate-limit-target`, `../rate-limits/account-runtime-target-sync`, `../codex-accounts/runtime-selection`, `../claude-accounts/runtime-selection`, `../browser/browser-manager` |
| `src/main/startup/main-process-automations.ts` | automations | `../automations/service`, `../automations/headless-dispatch`, `../automations/headless-workspace-create`, `../automations/runtime-terminal-run-observer` |
| `src/main/startup/main-process-error-guards.ts` | telemetry-stack | `../crash-reporting/durable-crash-breadcrumb` |
| `src/main/startup/main-process-i18n-menu.ts` | telemetry-stack | `../crash-reporting/crash-breadcrumb-store` |
| `src/main/startup/main-process-observers.ts` | telemetry-stack, already-done, agent-stack | `../telemetry/client`, `../observability`, `../crash-reporting/durable-crash-breadcrumb`, `../telemetry/cohort-classifier`, `../telemetry/onboarding-cohort-classifier`, `../skills/skill-transaction-startup-recovery`, `../claude-usage/store` |
| `src/main/startup/main-process-preflight.ts` | remote-host, ai-vault, agent-stack, browser, telemetry-stack | `./serve-mode-argv`, `../server/serve-stdout-boundary`, `./serve-desktop-activation`, `../ai-vault/session-parse-cache-persistence`, `../claude-usage/store`, `../browser/doc-preview-protocol`, `../browser/browser-process-user-agent`, `../browser/browser-identity-mode-store`, `../crash-reporting/crashpad-capture`, `../crash-reporting/crash-report-store`, `../crash-reporting/crash-breadcrumb-store`, `../crash-reporting/durable-crash-breadcrumb`, `../crash-reporting/gpu-crash-diagnostics`, `../crash-reporting/main-process-lifecycle-identity` |
| `src/main/startup/main-process-pty-startup.ts` | telemetry-stack | `../telemetry/classify-error`, `../telemetry/client` |
| `src/main/startup/main-process-quit.ts` | remote-host, agent-stack, browser, telemetry-stack, src/main/startup/main-process-quit.ts | `../ipc/ssh-shutdown-drain`, `../runtime/structured-agent-session-runtime`, `../runtime/structured-agent-session-runtime-teardown`, `../browser/paired-runtime-browser-client-host-runtime`, `../browser/browser-manager`, `../browser/local-ssh-browser-route`, `../telemetry/client`, `../observability`, `remote-host,[object Set]`, `agent-stack,[object Set]`, `browser,[object Set]`, `telemetry-stack,[object Set]`, `src/main/startup/main-process-quit.ts,[object Map]` |
| `src/main/startup/main-process-ready-foundation.ts` | browser, remote-host, agent-stack, telemetry-stack | `../browser/browser-manager`, `../browser/browser-client-host-id`, `../browser/browser-session-proxy`, `../browser/doc-preview-protocol`, `../ipc/doc-preview-grant-ipc`, `../browser/browser-session-startup`, `../browser/browser-session-registry`, `../ssh/ssh-host-key-store`, `../claude-accounts/live-pty-gate`, `../crash-reporting/durable-crash-breadcrumb` |
| `src/main/startup/main-process-ready-runtime.ts` | browser, telemetry-stack | `../browser/agent-browser-bridge`, `../browser/browser-manager`, `../browser/browser-client-page-automation-runtime`, `../browser/browser-client-page-command-failure`, `../crash-reporting/process-gone-diagnostics`, `../crash-reporting/gpu-crash-fallback-decision` |
| `src/main/startup/main-process-ready.ts` | remote-host | `./serve-desktop-activation` |
| `src/main/startup/main-process-relay-status.ts` | shared | `../../shared/mobile-relay-status` |
| `src/main/startup/main-process-runtime-launch.ts` | cloud-profiles, agent-stack, browser, remote-host | `../orca-profiles/profile-cloud-auth-config`, `../ipc/mobile`, `../browser/offscreen-browser-backend`, `../browser/browser-manager`, `../browser/browser-identity-mode-store`, `../runtime/relay/desktop-relay-service`, `./main-process-serve`, `./serve-signal-handlers`, `./serve-desktop-activation`, `./main-process-push-startup`, `../server/serve-stdout-boundary` |
| `src/main/startup/main-process-runtime-service.ts` | ai-vault, browser, artifacts, already-done, shared | `../ai-vault-search/session-search-enablement`, `../ai-vault-search/session-search-store-scope-catalog`, `../browser/browser-manager`, `../artifacts/artifact-cloud-service`, `../skills/skill-cloud-service`, `../../shared/artifact-sharing-gate` |
| `src/main/startup/main-process-state.ts` | agent-stack, remote-host, telemetry-stack, automations, browser | `../claude-usage/store`, `../codex-accounts/service`, `../codex-accounts/runtime-home-service`, `../claude-accounts/service`, `../claude-accounts/runtime-auth-service`, `../rate-limits/service`, `../runtime/relay/desktop-relay-service`, `../runtime/push/desktop-push-service`, `../runtime/relay/relay-session-broker`, `./serve-desktop-activation`, `./main-process-serve`, `../server/serve-readiness`, `../crash-reporting/crash-report-store`, `../crash-reporting/gpu-crash-fallback-decision`, `../crash-reporting/gpu-crash-diagnostics`, `../automations/service`, `../browser/agent-browser-bridge` |
| `src/main/startup/main-window-actions.ts` | telemetry-stack | `../crash-reporting/crash-breadcrumb-store`, `../crash-reporting/durable-crash-breadcrumb` |
| `src/main/startup/main-window-controller.ts` | telemetry-stack | `../crash-reporting/crash-breadcrumb-store`, `../crash-reporting/durable-crash-breadcrumb`, `../crash-reporting/process-gone-classification`, `../telemetry/consent`, `../telemetry/client` |
| `src/main/startup/main-window-core-services.ts` | shared | `../../shared/relay-host-close-reason` |
| `src/main/startup/main-window-lifecycle-flags.ts` | telemetry-stack | `../crash-reporting/expected-teardown-state`, `../crash-reporting/process-gone-classification`, `../crash-reporting/process-gone-recorder` |
| `src/main/startup/single-instance-lock.ts` | remote-host | `./serve-mode-argv` |
| `src/main/startup/skill-share-deep-link-state.ts` | shared | `../../shared/skill-share-link` |
| `src/main/startup/windows-install-dir-acl-probe.ts` | telemetry-stack | `../crash-reporting/durable-crash-breadcrumb` |
| `src/main/startup/windows-install-dir-package-acl-repair.ts` | telemetry-stack | `../crash-reporting/durable-crash-breadcrumb` |
| `src/main/system-resume-broadcast.ts` | telemetry-stack | `./crash-reporting/crash-breadcrumb-store` |
| `src/main/text-generation/commit-message-agent-environment.ts` | agent-stack | `../claude-accounts/runtime-auth-service`, `../claude-accounts/environment` |
| `src/main/text-generation/commit-message-model-discovery.ts` | remote-host | `../ssh/ssh-channel-multiplexer` |
| `src/main/text-generation/source-control-remote-generation.ts` | remote-host | `../ssh/ssh-channel-multiplexer` |
| `src/main/window/attach-main-window-services.ts` | remote-host, browser, agent-stack | `../ipc/ssh`, `../browser/browser-manager`, `../browser/browser-media-access`, `../claude-accounts/runtime-auth-service`, `../claude-accounts/runtime-selection` |
| `src/main/window/clipboard-image-temp-file.ts` | remote-host | `../providers/ssh-filesystem-dispatch` |
| `src/main/window/clipboard-remote-file-copy.ts` | telemetry-stack, remote-host | `../observability/tracer`, `../providers/ssh-filesystem-dispatch` |
| `src/main/window/createMainWindow.ts` | browser, shared, telemetry-stack | `../browser/browser-client-host-id`, `../../shared/browser-client-host-id-argument`, `../crash-reporting/expected-teardown-state`, `../crash-reporting/durable-crash-breadcrumb` |
| `src/main/window/main-window-focus-lifecycle.ts` | telemetry-stack, browser | `../crash-reporting/renderer-recovery-circuit-breaker`, `../browser/browser-route-session-runtime`, `../browser/browser-client-page-renderer-runtime` |
| `src/main/window/main-window-webview-security.ts` | shared, browser | `../../shared/browser-guest-web-preferences`, `../../shared/browser-url`, `../browser/browser-manager`, `../browser/browser-session-registry`, `../browser/local-ssh-browser-partitions`, `../browser/browser-route-session-runtime`, `../browser/doc-preview-failure-notice`, `../browser/doc-preview-grant-registry`, `../browser/doc-preview-protocol` |
| `src/main/window/mobile-markdown-request-relay.ts` | shared | `../../shared/mobile-markdown-document` |
| `src/main/window/privileged-window-navigation.ts` | shared | `../../shared/browser-url` |
| `src/main/window/renderer-recovery-reload-watchdog.ts` | telemetry-stack | `../crash-reporting/expected-teardown-state` |
| `src/main/window/runtime-window-lifecycle.ts` | shared | `../../shared/mobile-markdown-document` |
| `src/main/windows/windows-pty-job.ts` | telemetry-stack | `../crash-reporting/self-initiated-tree-kill-log` |
| `src/main/worktree-create-base-prefetch.ts` | remote-host | `./providers/ssh-git-dispatch` |
| `src/main/worktree-removal-execution-host-route.ts` | remote-host | `./providers/ssh-git-dispatch`, `./providers/ssh-git-provider` |
| `src/main/worktree-retirement-discovery.ts` | ai-vault, agent-stack | `./ai-vault/claude-project-dir-encoding`, `./native-chat/wsl-transcript-fs-access` |
| `src/main/worktree-retirement-namespace.ts` | remote-host | `./ssh/ssh-target-identity` |
| `src/main/worktree-runner-script.ts` | shared | `../shared/orca-yaml-hook-types` |
| `src/preload/api/agent-hook-api.ts` | shared | `../../shared/orca-yaml-hook-types` |
| `src/preload/api/agent-skill-api.ts` | shared | `../../shared/skill-cloud-contract`, `../../shared/skill-sharing-contract`, `../../shared/skill-freshness`, `../../shared/skill-delete-contract` |
| `src/preload/api/browser-api.ts` | shared | `../../shared/browser-annotation-viewport-bridge`, `../../shared/browser-user-agent-mode`, `../../shared/browser-client-page-metadata-protocol`, `../../shared/browser-webauthn-account`, `../../shared/browser-grab-types`, `../../shared/browser-guest-events`, `../../shared/browser-workspace-types`, `../../shared/browser-client-page-renderer-protocol` |
| `src/preload/api/browser-bridge-guest-registration-and-downloads.ts` | shared | `../../shared/browser-workspace-types`, `../../shared/browser-webauthn-account`, `../../shared/browser-client-host-id-argument` |
| `src/preload/api/browser-bridge-page-interaction-and-sessions.ts` | shared | `../../shared/browser-user-agent-mode` |
| `src/preload/api/ephemeral-vm-api.ts` | shared | `../../shared/orca-yaml-hook-types`, `../../shared/ephemeral-vm-recipes`, `../../shared/ephemeral-vm-recipe-diagnostics`, `../../shared/ephemeral-vm-runtimes` |
| `src/preload/api/filesystem-api.ts` | shared | `../../shared/ssh-types` |
| `src/preload/api/fs-bridge.ts` | shared | `../../shared/ssh-types` |
| `src/preload/api/gh-bridge-mutations-and-projects.ts` | shared | `../../shared/github/comment-types`, `../../shared/github/pull-request-types`, `../../shared/github/rate-limit-types`, `../../shared/github/auth-types`, `../../shared/task-source-context`, `../../shared/github/project-result-types`, `../../shared/github/project-request-types` |
| `src/preload/api/gh-bridge-pull-requests-and-work-items.ts` | shared | `../../shared/github/comment-types`, `../../shared/github/pull-request-refresh-types`, `../../shared/github/pull-request-types`, `../../shared/github/work-item-types`, `../../shared/task-source-context` |
| `src/preload/api/github-account-api.ts` | shared | `../../shared/github/auth-types` |
| `src/preload/api/github-pull-request-api.ts` | shared | `../../shared/github/auth-types`, `../../shared/task-source-context`, `../../shared/github/check-types`, `../../shared/github/comment-types`, `../../shared/github/pull-request-refresh-types`, `../../shared/github/pull-request-types`, `../../shared/github/rate-limit-types` |
| `src/preload/api/github-work-item-api.ts` | shared | `../../shared/github/project-result-types`, `../../shared/github/project-request-types`, `../../shared/task-source-context`, `../../shared/github/comment-types`, `../../shared/github/pull-request-types`, `../../shared/github/work-item-types` |
| `src/preload/api/gitlab-api.ts` | shared | `../../shared/task-source-context`, `../../shared/gitlab-types` |
| `src/preload/api/jira-api.ts` | shared | `../../shared/jira-types` |
| `src/preload/api/jira-bridge.ts` | shared | `../../shared/jira-types` |
| `src/preload/api/linear-api.ts` | shared | `../../shared/linear/issue-attribute-filter`, `../../shared/linear/issue-types`, `../../shared/linear/project-types`, `../../shared/linear/workspace-types` |
| `src/preload/api/linear-bridge.ts` | shared | `../../shared/linear/project-types` |
| `src/preload/api/mobile-api.ts` | shared | `../../shared/mobile-relay-status`, `../../shared/mobile-pairing-connection-mode`, `../../shared/mobile-relay-mint-failure` |
| `src/preload/api/mobile-bridge.ts` | shared | `../../shared/mobile-relay-status`, `../../shared/mobile-pairing-connection-mode`, `../../shared/mobile-relay-mint-failure` |
| `src/preload/api/native-chat-api.ts` | shared | `../../shared/native-chat-types` |
| `src/preload/api/native-chat-bridge.ts` | shared | `../../shared/native-chat-types` |
| `src/preload/api/orca-profile-api.ts` | shared | `../../shared/orca-profiles` |
| `src/preload/api/orca-profiles-bridge.ts` | shared | `../../shared/orca-profiles` |
| `src/preload/api/os-permission-api.ts` | shared | `../../shared/computer-use-permissions-types` |
| `src/preload/api/pty-api.ts` | shared | `../../shared/telemetry-events` |
| `src/preload/api/pty-bridge-session-control.ts` | shared | `../../shared/telemetry-events` |
| `src/preload/api/remote-workspace-bridge.ts` | shared | `../../shared/remote-workspace-types` |
| `src/preload/api/repository-api.ts` | shared | `../../shared/github/account-binding` |
| `src/preload/api/runtime-api.ts` | shared | `../../shared/remote-pairing-verification`, `../../shared/browser-client-host-placement`, `../../shared/remote-runtime-shared-control-types` |
| `src/preload/api/runtime-environments-bridge.ts` | shared | `../../shared/remote-pairing-verification`, `../../shared/remote-runtime-shared-control-types` |
| `src/preload/api/skills-bridge.ts` | shared | `../../shared/skill-delete-contract`, `../../shared/skill-cloud-contract`, `../../shared/skill-sharing-contract`, `../../shared/skill-freshness` |
| `src/preload/api/ssh-api.ts` | shared | `../../shared/ssh-types` |
| `src/preload/api/ssh-bridge.ts` | shared | `../../shared/ssh-types`, `../../shared/ssh-retained-payload-admission` |
| `src/preload/api/telemetry-api.ts` | shared | `../../shared/telemetry-consent-types` |
| `src/preload/api/ui-bridge-clipboard-and-window-controls.ts` | shared | `../../shared/mobile-markdown-document` |
| `src/preload/api/ui-bridge-tab-and-browser-commands.ts` | shared | `../../shared/browser-page-command-target`, `../../shared/browser-page-zoom` |
| `src/preload/api/ui-command-event-api.ts` | shared | `../../shared/browser-find-source`, `../../shared/browser-page-command-target`, `../../shared/browser-page-zoom`, `../../shared/mobile-markdown-document` |
| `src/preload/api/workspace-session-api.ts` | shared | `../../shared/github/pull-request-types`, `../../shared/remote-workspace-types` |
| `src/preload/browser-client-page-renderer-requests.ts` | shared | `../shared/browser-client-page-renderer-protocol` |
| `src/preload/browser-find-subscriptions.ts` | shared | `../shared/browser-find-source` |
| `src/preload/gitlab.ts` | shared | `../shared/task-source-context` |
| `src/renderer/src/app-shell/AppBackgroundServices.tsx` | renderer-mirror | `../components/native-chat/StructuredAgentSessionAttentionBridge`, `../components/native-chat/StructuredAgentSessionStatusBridge` |
| `src/renderer/src/app-shell/AppRootSurfaces.tsx` | renderer-mirror, src/renderer/src/app-shell/AppRootSurfaces.tsx | `../components/crash-report/CrashReportDialog`, `../components/skills/SkillFreshnessUpdateDialog`, `../components/feature-wall/FeatureWallModal`, `../components/feature-tips/FeatureTipsModal`, `../components/contextual-tours/ContextualTourOverlay`, `renderer-mirror,[object Set]`, `src/renderer/src/app-shell/AppRootSurfaces.tsx,[object Map]` |
| `src/renderer/src/app-shell/AppWorkspaceShell.tsx` | src/renderer/src/app-shell/AppWorkspaceShell.tsx | `src/renderer/src/app-shell/AppWorkspaceShell.tsx,[object Map]` |
| `src/renderer/src/app-shell/TitlebarMainStrip.tsx` | renderer-mirror | `../components/activity/ActivityTitlebarControls` |
| `src/renderer/src/app-shell/use-app-session-persistence.ts` | shared | `../../../shared/remote-workspace-types` |
| `src/renderer/src/app-shell/use-app-shell-services.ts` | renderer-mirror | `../runtime/web-session-tabs-sync`, `../runtime/local-structured-session-tabs-sync`, `../runtime/use-remote-runtime-recovery-triggers`, `../components/browser-pane/browser-user-agent-migration-notice` |
| `src/renderer/src/app-shell/use-app-startup-hydration.ts` | renderer-mirror, src/renderer/src/app-shell/use-app-startup-hydration.ts | `../runtime/local-structured-session-tabs-sync`, `../runtime/local-runtime-capabilities`, `../components/activity/dev-activity-fixture`, `renderer-mirror,[object Set]`, `src/renderer/src/app-shell/use-app-startup-hydration.ts,[object Map]` |
| `src/renderer/src/app-shell/use-document-appearance.ts` | renderer-mirror | `../runtime/sync-runtime-graph` |
| `src/renderer/src/app-shell/use-onboarding-and-feature-tips.ts` | renderer-mirror | `../components/feature-tips/feature-tip-startup-gate`, `../components/feature-tips/feature-tip-telemetry` |
| `src/renderer/src/app-shell/use-runtime-graph-sync.ts` | renderer-mirror | `../runtime/sync-runtime-graph` |
| `src/renderer/src/App.tsx` | renderer-mirror | `./components/browser-pane/workspace-doc/doc-preview-external-link-confirmation`, `./components/skills/SkillFreshnessNudge` |
| `src/renderer/src/components/browser-favicon.tsx` | renderer-mirror | `./browser-pane/describe-page/browser-favicon-url` |
| `src/renderer/src/components/browser-webauthn-account-dialog.tsx` | shared | `../../../shared/browser-webauthn-account` |
| `src/renderer/src/components/cmd-j/native-chat-split-quick-actions.ts` | renderer-mirror | `@/components/native-chat/native-chat-split-shortcut` |
| `src/renderer/src/components/cmd-j/palette-live-status.tsx` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/cmd-j/PaletteCreateWorktreeRow.tsx` | shared | `../../../../shared/linear/issue-types` |
| `src/renderer/src/components/cmd-j/quick-action-context.ts` | shared, renderer-mirror | `../../../../shared/ssh-types`, `@/components/native-chat/native-chat-layout-actions`, `@/components/native-chat/native-chat-split-shortcut` |
| `src/renderer/src/components/dashboard-popout/terminal-preview-unavailable-message.ts` | shared | `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/dashboard/dashboard-card-terminal-input.ts` | shared, renderer-mirror | `../../../../shared/ssh-pty-id`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/components/dashboard/dashboard-snapshot-workspaces.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-stream`, `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/editor/check-annotation-path.ts` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/editor/check-job-step-status.ts` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/editor/check-run-clipboard-text.ts` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/editor/check-run-details-fix-context.ts` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/editor/check-run-details-fix-with-ai.ts` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/editor/check-run-details-tab.ts` | shared | `../../../../shared/gitlab-types`, `../../../../shared/github/check-types`, `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/editor/CheckRunAnnotations.tsx` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/editor/CheckRunDetailsPanel.tsx` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/editor/CheckRunJobs.tsx` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/editor/combined-diff/load-sections/fetch-combined-diff-section.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-git-client` |
| `src/renderer/src/components/editor/combined-diff/review-controls/use-combined-diff-section-actions.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/editor-external-change-telemetry.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/editor/editor-restored-tab-conflict-scan.ts` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/editor-save-queue.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/EditorPanel.tsx` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/EditorPanelHeader.tsx` | shared, renderer-mirror | `../../../../shared/artifacts`, `@/components/artifacts/ArtifactPublishButton` |
| `src/renderer/src/components/editor/EditorPanelShell.tsx` | shared | `../../../../shared/artifacts` |
| `src/renderer/src/components/editor/ExternalFileChangeBanner.tsx` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/ExternalFileChangeCompareDialog.tsx` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/local-image-src-reader.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/markdown-artifact-upload.ts` | shared | `../../../../shared/artifacts`, `../../../../shared/artifact-cli-bridge` |
| `src/renderer/src/components/editor/markdown-document-list-request.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/markdown-preview-link-actions.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/markdown-preview-local-images.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/markdown-preview-system-link-action.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/MonacoGutterContextMenu.tsx` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/editor/ReviewNotesSendMenuContent.tsx` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/editor/rich-markdown-editor-click-routing.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/rich-markdown-extensions.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/rich-markdown-image-context.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/rich-markdown-image-insert.ts` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/rich-markdown-paste-image.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/use-markdown-preview-source-foundation.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/useEditorPanelDiffContentLoader.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-git-client` |
| `src/renderer/src/components/editor/useEditorPanelFileContentLoader.ts` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/useLocalImageSrc.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/editor/useMarkdownDocuments.ts` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/editor/useUntitledFileRename.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/FirstLaunchBanner.tsx` | renderer-mirror | `../lib/telemetry` |
| `src/renderer/src/components/floating-terminal/floating-terminal-panel-test-fixtures.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/floating-terminal/floating-terminal-panel-test-harness.ts` | renderer-mirror | `@/components/contextual-tours/use-contextual-tour` |
| `src/renderer/src/components/floating-terminal/FloatingBrowserSlot.tsx` | renderer-mirror, shared | `@/components/browser-pane/BrowserPane`, `@/components/browser-pane/host-guest/browser-page-viewport`, `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/floating-terminal/FloatingTerminalOrchestrationDialog.tsx` | renderer-mirror | `@/components/skills/SkillFreshnessStatusPill` |
| `src/renderer/src/components/floating-terminal/use-floating-terminal-panel-controller.ts` | renderer-mirror | `@/components/contextual-tours/use-contextual-tour` |
| `src/renderer/src/components/floating-terminal/use-floating-terminal-panel-items.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/github-checks-tab-state.ts` | shared | `../../../shared/github/check-types` |
| `src/renderer/src/components/github-pr-merge-state.ts` | shared | `../../../shared/github/pull-request-types`, `../../../shared/github/pull-request-auto-merge-availability` |
| `src/renderer/src/components/github-pr-reviewer-display.ts` | shared | `../../../shared/github/pull-request-types`, `../../../shared/github/work-item-types` |
| `src/renderer/src/components/GitHubItemDialog.tsx` | renderer-mirror | `./github-item-dialog/open-dialog/github-item-dialog`, `./github/github-work-item-identity`, `./github-item-dialog/load-item-details/github-item-dialog-types`, `./github-item-dialog/load-item-details/work-item-details-cache` |
| `src/renderer/src/components/gitlab-item-dialog-parts.tsx` | shared | `../../../shared/gitlab-types` |
| `src/renderer/src/components/GitLabItemDialog.tsx` | renderer-mirror | `./gitlab-item-dialog/gitlab-item-dialog-view`, `./gitlab-item-dialog/gitlab-item-dialog-types`, `./gitlab-item-dialog/use-gitlab-details-editing`, `./gitlab-item-dialog/use-gitlab-item-dialog-effects`, `./gitlab-item-dialog/use-gitlab-item-dialog-state`, `./gitlab-item-dialog/use-gitlab-pipeline-actions`, `./gitlab-item-dialog/use-gitlab-primary-actions`, `./gitlab-item-dialog/use-gitlab-review-actions` |
| `src/renderer/src/components/jira-issue-sorter.ts` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/jira-issue-workspace-actions.ts` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/jira-issue-workspace-chrome.tsx` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/jira-issue-workspace-content.tsx` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/jira-project-picker-filter.ts` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/jira-user-picker.tsx` | renderer-mirror, shared | `@/runtime/runtime-jira-client`, `../../../shared/jira-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/JiraIssueWorkspace.tsx` | renderer-mirror, shared | `@/runtime/runtime-jira-client`, `../../../shared/jira-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/landing-preflight-runtime.ts` | renderer-mirror | `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/components/linear-api-key-dialog.tsx` | shared, renderer-mirror | `../../../shared/linear/workspace-types`, `../../../shared/linear/links`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/linear-custom-view-table-content.tsx` | shared | `../../../shared/linear/project-types` |
| `src/renderer/src/components/linear-issue-activity.tsx` | shared | `../../../shared/linear/issue-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/linear-issue-attribute-filter-dropdowns.tsx` | renderer-mirror, shared | `@/runtime/runtime-linear-client`, `../../../shared/linear/issue-attribute-filter`, `../../../shared/linear/workspace-types` |
| `src/renderer/src/components/linear-issue-attribute-filter-pills.ts` | shared | `../../../shared/linear/issue-attribute-filter` |
| `src/renderer/src/components/linear-issue-attribute-filter-primary-team.ts` | shared | `../../../shared/linear/workspace-types` |
| `src/renderer/src/components/linear-issue-attribute-filter-sections.tsx` | renderer-mirror, shared | `@/components/github/PRFilterPickers`, `../../../shared/linear/issue-attribute-filter` |
| `src/renderer/src/components/linear-issue-attribute-filter-team-ids.ts` | shared | `../../../shared/linear/workspace-types` |
| `src/renderer/src/components/linear-issue-project-selector.tsx` | renderer-mirror, shared | `@/runtime/runtime-linear-issue-mutations`, `@/runtime/runtime-linear-project-client`, `../../../shared/linear/issue-types`, `../../../shared/linear/project-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/linear-issue-sub-issues.tsx` | renderer-mirror, shared | `@/runtime/runtime-linear-issue-mutations`, `../../../shared/linear/issue-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/linear-issue-text-draft-state.ts` | shared | `../../../shared/linear/issue-types` |
| `src/renderer/src/components/linear-issue-text-save-plan.ts` | shared | `../../../shared/linear/issue-types` |
| `src/renderer/src/components/linear-issue-view-storage.ts` | shared | `../../../shared/linear/issue-view-resume-state` |
| `src/renderer/src/components/linear-issue-workspace-detail-state.ts` | renderer-mirror, shared | `@/runtime/runtime-linear-issue-mutations`, `@/runtime/runtime-linear-client`, `../../../shared/linear/issue-types`, `../../../shared/linear/project-types` |
| `src/renderer/src/components/linear-issue-workspace-header.tsx` | shared | `../../../shared/linear/issue-types` |
| `src/renderer/src/components/linear-issue-workspace-sidebar.tsx` | shared | `../../../shared/linear/issue-types`, `../../../shared/linear/project-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/linear-issue-workspace-text.ts` | shared | `../../../shared/linear/issue-types` |
| `src/renderer/src/components/linear-item-drawer-comment-footer.tsx` | renderer-mirror, shared | `@/runtime/runtime-linear-issue-mutations`, `../../../shared/task-source-context` |
| `src/renderer/src/components/linear-item-drawer-edit-controller.tsx` | renderer-mirror | `@/runtime/runtime-linear-issue-mutations` |
| `src/renderer/src/components/linear-item-drawer-sheet.tsx` | shared | `../../../shared/linear/issue-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/linear-item-drawer-types.ts` | shared | `../../../shared/linear/issue-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/linear-project-overview-content.tsx` | shared | `../../../shared/linear/project-types` |
| `src/renderer/src/components/linear-project-presentation.ts` | shared | `../../../shared/linear/project-types` |
| `src/renderer/src/components/linear-project-search-query.ts` | renderer-mirror | `@/runtime/runtime-provider-search-bounds` |
| `src/renderer/src/components/linear-project-table-content.tsx` | shared | `../../../shared/linear/project-types` |
| `src/renderer/src/components/linear-project-view-surfaces.tsx` | shared | `../../../shared/linear/project-types`, `../../../shared/linear/workspace-types` |
| `src/renderer/src/components/linear-scope-selector.tsx` | shared | `../../../shared/linear/workspace-types` |
| `src/renderer/src/components/LinearIssueTextEditor.tsx` | renderer-mirror, shared | `@/runtime/runtime-linear-issue-mutations`, `../../../shared/linear/issue-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/LinearIssueWorkspace.tsx` | shared | `../../../shared/linear/issue-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/LinearItemDrawer.tsx` | shared, renderer-mirror | `../../../shared/linear/issue-types`, `@/runtime/runtime-linear-issue-mutations` |
| `src/renderer/src/components/native-chat-resume-on-restart-store.ts` | renderer-mirror | `@/runtime/structured-agent-session-client`, `@/runtime/structured-agent-session-status-feed` |
| `src/renderer/src/components/new-workspace/new-workspace-composer-card-props.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/gitlab-types`, `../../../../shared/jira-types`, `../../../../shared/linear/issue-types`, `../../../../shared/orca-yaml-hook-types`, `../../../../shared/ssh-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/components/new-workspace/new-workspace-composer-ssh-status.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/new-workspace/run-target-options.ts` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/new-workspace/smart-workspace-github-direct-link.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/components/new-workspace/smart-workspace-name-field-model.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/gitlab-types`, `../../../../shared/jira-types`, `../../../../shared/linear/issue-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/components/new-workspace/smart-workspace-repo-slug.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `../../../../shared/github/repository-identity-key`, `../../../../shared/task-source-context` |
| `src/renderer/src/components/new-workspace/smart-workspace-source-row-content.tsx` | shared | `../../../../shared/jira-types` |
| `src/renderer/src/components/new-workspace/use-jira-source-connection.ts` | shared | `../../../../shared/task-source-context`, `../../../../shared/jira-types` |
| `src/renderer/src/components/new-workspace/use-jira-url-source.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `../../../../shared/jira-issue-url`, `../../../../shared/jira-summary-lookup`, `../../../../shared/task-source-context`, `../../../../shared/jira-types` |
| `src/renderer/src/components/new-workspace/use-smart-workspace-field-availability.ts` | shared | `../../../../shared/task-providers` |
| `src/renderer/src/components/new-workspace/use-smart-workspace-github-search.ts` | shared | `../../../../shared/github/work-item-types` |
| `src/renderer/src/components/new-workspace/use-smart-workspace-gitlab-search.ts` | shared | `../../../../shared/gitlab-types` |
| `src/renderer/src/components/new-workspace/use-smart-workspace-name-field-actions.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/components/new-workspace/use-smart-workspace-name-field-foundation.ts` | shared | `../../../../shared/task-source-context` |
| `src/renderer/src/components/new-workspace/use-smart-workspace-name-field-state.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/gitlab-types`, `../../../../shared/jira-types`, `../../../../shared/linear/issue-types` |
| `src/renderer/src/components/new-workspace/use-smart-workspace-secondary-searches.ts` | renderer-mirror, shared | `@/runtime/runtime-repo-client`, `../../../../shared/linear/workspace-types` |
| `src/renderer/src/components/NewWorkspaceComposerCard.tsx` | renderer-mirror | `@/components/contextual-tours/use-contextual-tour`, `@/runtime/runtime-rpc-client`, `@/ssh/ssh-connect-ui-timeout`, `@/ssh/ssh-connect-in-flight` |
| `src/renderer/src/components/NewWorkspaceComposerModal.tsx` | shared | `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/onboarding/agent-picked-payload.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/onboarding/FeatureSetupInlineTerminal.tsx` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/onboarding/onboarding-feature-setup.ts` | shared | `../../../../shared/computer-use-permissions-types`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/onboarding/onboarding-flow-state.ts` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/onboarding/ThemeStep.tsx` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/onboarding/use-onboarding-flow-actions.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/onboarding/use-onboarding-flow-persistence.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/onboarding/use-onboarding-flow-telemetry.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/onboarding/use-onboarding-flow.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/onboarding/windows-terminal-onboarding-telemetry.ts` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/ports/WorkspacePortScanner.tsx` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-client-target` |
| `src/renderer/src/components/pr-check-counts.ts` | shared | `../../../shared/github/check-types` |
| `src/renderer/src/components/pr-comments-resolution-prompt.ts` | shared | `../../../shared/github/comment-types` |
| `src/renderer/src/components/PullRequestPage.tsx` | renderer-mirror | `@/components/github/github-work-item-identity`, `@/components/pull-request-page/page-types`, `@/components/pull-request-page/cache/work-item-details`, `@/components/pull-request-page/page/surface` |
| `src/renderer/src/components/quick-open-file-list.ts` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/runtime-file-request-debounce` |
| `src/renderer/src/components/repo/CreateFromPicker.tsx` | renderer-mirror | `@/runtime/runtime-repo-client`, `@/runtime/runtime-repo-search-bounds` |
| `src/renderer/src/components/repo/repo-fork-indicator.tsx` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/active-checks-status.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/activity-bar-buttons.tsx` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/ai-vault-session-resume-in-chat-workspace.ts` | renderer-mirror | `@/runtime/local-runtime-capabilities` |
| `src/renderer/src/components/right-sidebar/buildSourceControlAgentDeliveryPlan.ts` | renderer-mirror | `@/lib/source-control-agent-action-plan`, `@/components/native-chat/native-chat-launch-session-options` |
| `src/renderer/src/components/right-sidebar/checks-panel-async-result-key.ts` | shared | `../../../../shared/github/pull-request-types`, `../../../../shared/github/repository-identity-key` |
| `src/renderer/src/components/right-sidebar/checks-panel-pr-refresh-request.ts` | shared | `../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/components/right-sidebar/checks-panel-review-copy.ts` | shared | `../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/components/right-sidebar/checks-panel-review-creation.ts` | shared | `../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/components/right-sidebar/checks-panel-review-state-model.ts` | shared | `../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/components/right-sidebar/checks-panel-review.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/check-details-model.ts` | shared | `../../../../../shared/github/check-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/check-presentation.tsx` | shared | `../../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/check-run-details.tsx` | shared | `../../../../../shared/gitlab-types`, `../../../../../shared/github/check-types`, `../../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/comment-controls.tsx` | shared | `../../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/comment-group.tsx` | shared | `../../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/comment-row.tsx` | renderer-mirror, shared | `@/components/github/CommentReactions`, `../../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/conflict-summary.tsx` | shared | `../../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/gitlab-review-client.ts` | shared, renderer-mirror | `../../../../../shared/github/comment-types`, `../../../../../shared/gitlab-types`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/right-sidebar/checks-panel/triage-strip.tsx` | shared | `../../../../../shared/github/check-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-list-state.tsx` | shared | `../../../../../shared/gitlab-types`, `../../../../../shared/github/check-types`, `../../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-ai-queue.tsx` | shared | `../../../../../shared/github/links` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-check-and-review-actions.tsx` | renderer-mirror, shared | `@/runtime/gitlab-job-trace-client`, `../../../../../shared/github/check-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-comment-mutations.tsx` | shared | `../../../../../shared/github/project-identity`, `../../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-comment-resolution.tsx` | shared | `../../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-context-state.tsx` | shared | `../../../../../shared/github/pull-request-types`, `../../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-controller-state.tsx` | shared | `../../../../../shared/github/check-types`, `../../../../../shared/github/comment-types`, `../../../../../shared/github/pull-request-refresh-types`, `../../../../../shared/gitlab-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-generation.tsx` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-git-status-effects.tsx` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-manual-refresh.tsx` | renderer-mirror, shared | `@/runtime/runtime-git-client`, `../../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-polling.tsx` | shared | `../../../../../shared/gitlab-pipeline-checks` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-review-data.tsx` | renderer-mirror, shared | `@/runtime/gitlab-job-trace-client`, `../../../../../shared/github/check-types`, `../../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-checks-panel-review-state.tsx` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/checks-panel/use-comments-list-state.tsx` | shared | `../../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/create-pull-request-dialog-field-model.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/file-explorer-directory-listing.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/file-explorer-row-action-visibility.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/file-explorer-row-file-transfer.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/FileExplorerRow.tsx` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/FileExplorerVirtualRows.tsx` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/FolderWorkspacePrChecksPanel.tsx` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/right-sidebar/FolderWorkspacePrChecksRow.tsx` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/right-sidebar/git-status-refresh.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/github-pr-stack-confirmation.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/github-pr-stack-merge.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/github-refresh-error-copy.ts` | shared | `../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/components/right-sidebar/GitHubPRStackMap.tsx` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/hosted-review-github-actions.ts` | shared, renderer-mirror | `../../../../shared/github/pull-request-types`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/right-sidebar/hosted-review-gitlab-actions.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/right-sidebar/HostedReviewActions.tsx` | shared | `../../../../shared/github/pull-request-types`, `../../../../shared/github/pull-request-merge-methods` |
| `src/renderer/src/components/right-sidebar/local-workspace-ports-panel.tsx` | renderer-mirror | `@/runtime/use-worktree-runtime-target` |
| `src/renderer/src/components/right-sidebar/parent-pr-checks-github-pr-cache.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/parent-pr-checks-hosted-review-cache.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/parent-pr-checks-refresh.ts` | shared | `../../../../shared/github/check-types`, `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/parent-pr-checks-row-status.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/parent-pr-checks-row-types.ts` | shared | `../../../../shared/github/check-types`, `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/parent-pr-checks-rows.ts` | shared | `../../../../shared/github/check-types` |
| `src/renderer/src/components/right-sidebar/pr-comment-fixing-reply-body.ts` | shared | `../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/pr-comment-thread-resolution.ts` | shared | `../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/pr-comments-ai-launch-ack.ts` | shared | `../../../../shared/github/comment-types`, `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/pr-comments-list-selection.ts` | shared | `../../../../shared/github/comment-types` |
| `src/renderer/src/components/right-sidebar/right-sidebar-top-activity-bar.tsx` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/runSourceControlAgentActionStart.ts` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/right-sidebar/source-control-fix-split-button.tsx` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/right-sidebar/source-control-primary-action-types.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/source-control/ai/use-ai.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/commit/use-bulk-actions.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/commit/use-commit-action.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/commit/use-commit-message-generation.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/commit/use-discard-confirmation.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/commit/use-entry-mutations.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/listing/operation-target.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/listing/use-submodule-status.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/review/create-pr-intent-run-snapshot.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/review/use-create-pr-intent-commit-message.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/review/use-create-pr-intent-probes.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/review/use-create-pr-intent-review.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/review/use-pull-request-generation.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/sync/use-base-ref-default.ts` | renderer-mirror | `@/runtime/runtime-repo-client` |
| `src/renderer/src/components/right-sidebar/source-control/sync/use-branch-compare.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/sync/use-conflict-abort.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/sync/use-git-history-commit-actions.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/sync/use-git-history.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/source-control/sync/use-status-refresh.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/SourceControlAgentActionDialog.tsx` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/right-sidebar/ssh-detected-port-row.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/right-sidebar/ssh-forwarded-port-row.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/right-sidebar/ssh-port-forward-dialog.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/right-sidebar/ssh-ports-panel.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/right-sidebar/stale-conflict-operation-poll.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/use-checks-panel-terminal-worktree.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-inspection`, `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/right-sidebar/use-create-pull-request-base-ref-discovery.ts` | renderer-mirror | `@/runtime/runtime-repo-client` |
| `src/renderer/src/components/right-sidebar/use-create-pull-request-field-generation.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/use-create-pull-request-field-seeding.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/use-file-explorer-ignored-paths.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/use-file-explorer-tree-pane-state.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/use-git-status-upstream-ref-watch.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/right-sidebar/use-hosted-review-actions.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/use-ready-hosted-review-action.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/right-sidebar/useFileDeletion.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/useFileDuplicate.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/useFileExplorerImport.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/useFileExplorerInlineInput.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/useFileExplorerTree.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/useFileExplorerWatch.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/useFileSearchRunner.ts` | renderer-mirror | `@/runtime/runtime-file-search-bounds`, `@/runtime/runtime-file-client` |
| `src/renderer/src/components/right-sidebar/useSourceControlAgentActionDialog.ts` | renderer-mirror | `@/runtime/local-runtime-capabilities` |
| `src/renderer/src/components/right-sidebar/useSourceControlAgentActionStart.ts` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/settings/accounts-pane-claude-section.tsx` | renderer-mirror | `@/runtime/runtime-provider-accounts-client` |
| `src/renderer/src/components/settings/accounts-pane-codex-account-row.tsx` | renderer-mirror | `@/runtime/runtime-provider-accounts-client` |
| `src/renderer/src/components/settings/accounts-pane-codex-section.tsx` | renderer-mirror | `@/runtime/runtime-provider-accounts-client` |
| `src/renderer/src/components/settings/accounts-pane-removal-dialogs.tsx` | renderer-mirror | `@/runtime/runtime-provider-accounts-client` |
| `src/renderer/src/components/settings/AccountsPane.tsx` | renderer-mirror | `@/runtime/runtime-provider-accounts-client` |
| `src/renderer/src/components/settings/AgentSkillSetupPanel.tsx` | renderer-mirror | `../skills/SkillFreshnessStatusPill` |
| `src/renderer/src/components/settings/BaseRefPicker.tsx` | renderer-mirror | `@/runtime/runtime-repo-client`, `@/runtime/runtime-repo-search-bounds` |
| `src/renderer/src/components/settings/BrowserDefaultZoomSetting.tsx` | shared | `../../../../shared/browser-page-zoom` |
| `src/renderer/src/components/settings/BrowserHomePageSetting.tsx` | shared | `../../../../shared/browser-url` |
| `src/renderer/src/components/settings/BrowserProfileRow.tsx` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/settings/BrowserSearchEngineSetting.tsx` | shared | `../../../../shared/browser-url` |
| `src/renderer/src/components/settings/BrowserSessionCookiesSection.tsx` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/settings/BrowserUserAgentSetting.tsx` | shared | `../../../../shared/browser-user-agent-mode` |
| `src/renderer/src/components/settings/CommitMessageAiPane.tsx` | renderer-mirror | `../../runtime/runtime-git-client` |
| `src/renderer/src/components/settings/ComputerUsePane.tsx` | shared | `../../../../shared/computer-use-permissions-types` |
| `src/renderer/src/components/settings/EphemeralVmCleanupStopDialog.tsx` | shared | `../../../../shared/ephemeral-vm-runtimes` |
| `src/renderer/src/components/settings/EphemeralVmRecipeRow.tsx` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/settings/EphemeralVmRuntimeRow.tsx` | shared | `../../../../shared/ephemeral-vm-runtimes`, `../../../../shared/ephemeral-vm-recipes` |
| `src/renderer/src/components/settings/EphemeralVmRuntimesSection.tsx` | shared | `../../../../shared/ephemeral-vm-runtimes`, `../../../../shared/ephemeral-vm-recipe-destroy-result` |
| `src/renderer/src/components/settings/GeneralPane.tsx` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/settings/GitProviderApiBudgetPane.tsx` | renderer-mirror | `../github/github-rate-limit-display`, `../gitlab/gitlab-rate-limit-display` |
| `src/renderer/src/components/settings/KagiSessionLinkForm.tsx` | shared | `../../../../shared/browser-url` |
| `src/renderer/src/components/settings/LinearAgentSkillPane.tsx` | shared | `../../../../shared/task-providers` |
| `src/renderer/src/components/settings/mobile-network-interface-selection.ts` | shared | `../../../../shared/pairing-address-auto-selection` |
| `src/renderer/src/components/settings/MobilePairedDevicesSection.tsx` | renderer-mirror | `../mobile/paired-mobile-devices` |
| `src/renderer/src/components/settings/MobilePairingConnectionOptions.tsx` | shared | `../../../../shared/mobile-relay-status`, `../../../../shared/mobile-pairing-connection-mode` |
| `src/renderer/src/components/settings/MobilePairingSetupSection.tsx` | renderer-mirror, shared | `../mobile/NetworkInterfacePicker`, `../../../../shared/mobile-pairing-connection-mode` |
| `src/renderer/src/components/settings/MobilePane.tsx` | renderer-mirror, shared | `../mobile/paired-mobile-devices`, `../mobile/mobile-relay-mint-failure-notice`, `../mobile/WindowsFirewallNotice`, `../mobile/use-mobile-pairing-connection-mode`, `../mobile/use-mobile-pairing-address-preference`, `../../../../shared/mobile-pairing-connection-mode`, `../../../../shared/mobile-relay-mint-failure` |
| `src/renderer/src/components/settings/NativeChatShellEnvironmentSetting.tsx` | shared | `../../../../shared/native-chat-shell-environment` |
| `src/renderer/src/components/settings/NativeChatSupportedAgents.tsx` | shared | `../../../../shared/native-chat-agent-support` |
| `src/renderer/src/components/settings/PrivacyPane.tsx` | shared, renderer-mirror | `../../../../shared/telemetry-consent-types`, `../../lib/telemetry` |
| `src/renderer/src/components/settings/RemoteServerUpdateDialog.tsx` | renderer-mirror | `@/runtime/remote-server-update-coordinator` |
| `src/renderer/src/components/settings/RemoteServerUpdateStatus.tsx` | renderer-mirror | `@/runtime/remote-server-update-coordinator` |
| `src/renderer/src/components/settings/repository-github-account.ts` | shared, renderer-mirror | `../../../../shared/github/account-binding`, `../../../../shared/github/auth-types`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/settings/repository-hook-settings-draft.ts` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/settings/repository-icon-github.ts` | shared, renderer-mirror | `../../../../shared/github/pull-request-types`, `../../../../shared/github/repository-identity-key`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/settings/RepositoryForkSyncSection.tsx` | renderer-mirror | `../../runtime/runtime-git-client` |
| `src/renderer/src/components/settings/RepositoryGitHubAccountSection.tsx` | shared, renderer-mirror | `../../../../shared/github/account-binding`, `../../../../shared/github/auth-types`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/settings/RepositoryHookPolicySettings.tsx` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/settings/RepositoryHooksSection.tsx` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/settings/RepositoryHooksYamlStatus.tsx` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/settings/RepositoryHostSetupsSection.tsx` | renderer-mirror | `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/components/settings/RepositoryIconPicker.tsx` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/settings/RepositoryPane.tsx` | shared | `../../../../shared/github/account-binding`, `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/settings/runtime-environment-host-details.ts` | renderer-mirror | `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/components/settings/runtime-server-row.tsx` | renderer-mirror | `@/runtime/remote-server-update-coordinator`, `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/components/settings/runtime-servers-connect-section.tsx` | shared, renderer-mirror | `../../../../shared/remote-server-update`, `@/runtime/remote-server-update-coordinator` |
| `src/renderer/src/components/settings/RuntimeHostAccessForm.tsx` | shared | `../../../../shared/remote-pairing-address`, `../../../../shared/remote-pairing-verification` |
| `src/renderer/src/components/settings/settings-interface-secondary-section-renderers.tsx` | renderer-mirror | `../stats/StatsPane` |
| `src/renderer/src/components/settings/settings-setup-guide-progress.ts` | renderer-mirror | `../feature-wall/feature-wall-setup-progress` |
| `src/renderer/src/components/settings/SettingsSetupGuidePane.tsx` | renderer-mirror | `../feature-wall/FeatureWallSetupChecklist` |
| `src/renderer/src/components/settings/SettingsSidebar.tsx` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/settings/ssh-session-termination.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/settings/ssh-target-action-state.ts` | renderer-mirror, shared | `@/ssh/ssh-connection-recoverability`, `../../../../shared/ssh-types` |
| `src/renderer/src/components/settings/ssh-target-draft.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/settings/ssh-target-save-payload.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/settings/SshHostAdvancedFields.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/settings/SshPane.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/settings/SshTargetCard.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/settings/SshTargetDestructiveActions.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/settings/task-source-setup-state.ts` | shared | `../../../../shared/task-providers` |
| `src/renderer/src/components/settings/TasksPane.tsx` | shared | `../../../../shared/task-providers` |
| `src/renderer/src/components/settings/use-mobile-paired-device-revocation.ts` | renderer-mirror | `../mobile/paired-mobile-devices` |
| `src/renderer/src/components/settings/use-repository-hook-settings-draft.ts` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/settings/use-repository-issue-command.ts` | renderer-mirror | `@/runtime/runtime-hooks-client` |
| `src/renderer/src/components/settings/use-runtime-environment-catalog.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-status-probe-diagnostics` |
| `src/renderer/src/components/settings/use-runtime-environment-connection-actions.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-status-probe-diagnostics` |
| `src/renderer/src/components/settings/use-settings-repo-scroll-effects.ts` | shared, renderer-mirror | `../../../../shared/orca-yaml-hook-types`, `@/runtime/runtime-hooks-client` |
| `src/renderer/src/components/settings/use-settings-store-model.ts` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/components/settings/use-settings-terminal-model.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/settings/use-task-source-provider-readiness.ts` | shared | `../../../../shared/task-providers` |
| `src/renderer/src/components/setup-guide/setup-guide-browser-milestone-progress.ts` | renderer-mirror | `../feature-wall/feature-wall-setup-progress` |
| `src/renderer/src/components/setup-guide/setup-guide-progress-readiness.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `../../../../shared/computer-use-permissions-types` |
| `src/renderer/src/components/setup-guide/SetupGuideModal.tsx` | renderer-mirror | `../feature-wall/FeatureWallSetupChecklist` |
| `src/renderer/src/components/setup-guide/use-setup-guide-progress.ts` | renderer-mirror | `@/runtime/runtime-hooks-client`, `../feature-wall/feature-wall-setup-progress`, `../feature-wall/use-integration-connection-status` |
| `src/renderer/src/components/setup-guide/use-setup-guide-telemetry.ts` | renderer-mirror | `../feature-wall/feature-wall-setup-progress`, `@/lib/feature-education-telemetry` |
| `src/renderer/src/components/shared/MacFolderAccessFixDialog.tsx` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/sidebar/add-remote-host-ssh-actions.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/add-repo-existing-workspaces-telemetry.ts` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/sidebar/AddRemoteHostDialog.tsx` | shared | `../../../../shared/ssh-types`, `../../../../shared/remote-pairing-address` |
| `src/renderer/src/components/sidebar/AddRemoteHostFields.tsx` | shared | `../../../../shared/remote-pairing-address` |
| `src/renderer/src/components/sidebar/AddRemoteHostServerFormPanel.tsx` | shared | `../../../../shared/remote-pairing-address` |
| `src/renderer/src/components/sidebar/AddRemoteHostSshConfigPicker.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/AddRepoDialogStepContent.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/AddRepoRemoteStep.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/AddRepoSteps.tsx` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/comment-markdown-element-renderers.tsx` | shared | `../../../../shared/native-chat-href-routing` |
| `src/renderer/src/components/sidebar/comment-markdown-native-chat-file-links.ts` | shared | `../../../../shared/native-chat-href-routing` |
| `src/renderer/src/components/sidebar/folder-workspace-agent-startup.ts` | shared | `../../../../shared/native-chat-session-options` |
| `src/renderer/src/components/sidebar/folder-workspace-composer-helpers.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/gitlab-types`, `../../../../shared/linear/issue-types` |
| `src/renderer/src/components/sidebar/folder-workspace-composer-submit.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events`, `../../../../shared/native-chat-session-options`, `../../../../shared/task-source-context` |
| `src/renderer/src/components/sidebar/host-section-rows.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/HostSectionHeaderMenu.tsx` | renderer-mirror | `@/ssh/ssh-connect-verb`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/sidebar/index.tsx` | renderer-mirror | `@/components/activity/activity-thread-collapse-context` |
| `src/renderer/src/components/sidebar/mobile-sidebar-onboarding-badge.ts` | renderer-mirror | `../mobile/paired-mobile-devices` |
| `src/renderer/src/components/sidebar/NoticeHostGlyph.tsx` | renderer-mirror | `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/components/sidebar/project-added-default-checkout.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/sidebar/repo-header-create-state.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/setup-script-prompt-exposure-telemetry.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/sidebar/SetupGuideSidebarEntry.tsx` | renderer-mirror | `../feature-wall/feature-wall-setup-progress` |
| `src/renderer/src/components/sidebar/SetupScriptPromptCard.tsx` | renderer-mirror | `@/lib/telemetry`, `@/runtime/runtime-hooks-client` |
| `src/renderer/src/components/sidebar/sidebar-header-actions.tsx` | renderer-mirror | `../contextual-tours/workspace-creation-tour-handoff` |
| `src/renderer/src/components/sidebar/sidebar-host-options.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/SidebarAgentsList.tsx` | renderer-mirror | `@/components/activity/activity-thread-actions`, `@/components/activity/use-activity-thread-action-bindings`, `@/components/activity/activity-thread-list-pane`, `@/components/activity/use-agent-pane-threads`, `@/components/activity/activity-thread-controls`, `@/components/activity/activity-thread-types` |
| `src/renderer/src/components/sidebar/SidebarFeedbackDialog.tsx` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/sidebar/SidebarTaskNavButton.tsx` | shared | `../../../../shared/task-preset-query`, `../../../../shared/task-providers` |
| `src/renderer/src/components/sidebar/ssh-host-remove-resolution.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/ssh-target-duplicate.ts` | shared | `../../../../shared/ssh-config-alias`, `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/ssh-workspace-forget-resolution.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/SshTargetRow.tsx` | shared, renderer-mirror | `../../../../shared/ssh-types`, `@/ssh/ssh-connection-recoverability`, `@/ssh/ssh-connect-in-flight` |
| `src/renderer/src/components/sidebar/track-nested-folder-open.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/sidebar/use-add-repo-host-selection.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/components/sidebar/use-add-repo-remote-nested-scan.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/sidebar/use-complete-git-repo-add.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/sidebar/use-delete-worktree-status-hydration.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/sidebar/use-remote-file-browser-listing.ts` | renderer-mirror | `@/runtime/runtime-server-directory-browser` |
| `src/renderer/src/components/sidebar/use-worktree-card-foundation.ts` | renderer-mirror | `@/runtime/runtime-environment-ssh-state`, `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/components/sidebar/use-worktree-card-linked-details.ts` | shared | `../../../../shared/github/pull-request-types`, `../../../../shared/linear/issue-types` |
| `src/renderer/src/components/sidebar/use-worktree-card-secondary-details.ts` | shared | `../../../../shared/github/work-item-types` |
| `src/renderer/src/components/sidebar/use-worktree-issue-link.ts` | shared | `../../../../shared/linear/links`, `../../../../shared/task-source-context` |
| `src/renderer/src/components/sidebar/useAddRepoCloneFlow.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/sidebar/useAddRepoLocalFolderFlow.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/sidebar/useAddRepoNestedImportFlow.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/sidebar/useAddRepoNestedReviewController.ts` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/sidebar/useAddRepoServerPathFlow.ts` | renderer-mirror, shared | `@/lib/telemetry`, `../../../../shared/telemetry-events` |
| `src/renderer/src/components/sidebar/useCreateProjectDefaults.ts` | renderer-mirror | `@/runtime/runtime-server-directory-browser`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/sidebar/useCreateRepo.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/sidebar/visible-worktree-activity-inputs.ts` | shared, renderer-mirror | `../../../../shared/browser-workspace-types`, `@/components/native-chat/structured-agent-session-tabs` |
| `src/renderer/src/components/sidebar/workspace-board-task-status-sync.ts` | renderer-mirror, shared | `@/runtime/runtime-linear-issue-mutations`, `@/runtime/runtime-linear-project-client`, `@/runtime/runtime-linear-client`, `../../../../shared/linear/issue-types`, `../../../../shared/linear/workspace-types` |
| `src/renderer/src/components/sidebar/WorkspaceKanbanDrawer.tsx` | renderer-mirror | `@/components/contextual-tours/use-contextual-tour` |
| `src/renderer/src/components/sidebar/worktree-card-meta-types.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/sidebar/worktree-card-pr-display.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/sidebar/worktree-list/listing/use-sort-order.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/components/sidebar/worktree-meta-updates.ts` | shared | `../../../../shared/linear/links` |
| `src/renderer/src/components/sidebar/worktree-review-helpers.tsx` | renderer-mirror | `@/components/github/review-state-presentation` |
| `src/renderer/src/components/sidebar/WorktreeCardAutomationDetailSection.tsx` | renderer-mirror | `@/components/automations/automation-host-client` |
| `src/renderer/src/components/sidebar/WorktreeCardHelpers.tsx` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/sidebar/WorktreeCardMetadataStatusBadges.tsx` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/components/sidebar/WorktreeCardPorts.tsx` | renderer-mirror | `@/runtime/use-worktree-runtime-target` |
| `src/renderer/src/components/sidebar/WorktreeCardSshHostControl.tsx` | renderer-mirror, shared | `@/runtime/runtime-environment-ssh-state`, `@/ssh/ssh-connection-recoverability`, `@/ssh/ssh-connect-verb`, `@/ssh/ssh-connect-ui-timeout`, `@/ssh/ssh-connect-in-flight`, `../../../../shared/ssh-types` |
| `src/renderer/src/components/status-bar/ClaudeSwitcherMenu.tsx` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-provider-accounts-client` |
| `src/renderer/src/components/status-bar/ports-status-popover-rows.tsx` | renderer-mirror | `@/runtime/use-worktree-runtime-target` |
| `src/renderer/src/components/status-bar/PortsStatusSegment.tsx` | renderer-mirror | `@/runtime/use-worktree-runtime-target` |
| `src/renderer/src/components/status-bar/remote-host-connection-status.ts` | shared, renderer-mirror | `../../../../shared/ssh-types`, `../../../../shared/remote-runtime-shared-control-types`, `@/runtime/runtime-host-connection-state`, `@/ssh/ssh-connection-recoverability` |
| `src/renderer/src/components/status-bar/resource-usage-merge-types.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/status-bar/resource-usage-session-rows.tsx` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/status-bar/runtime-environment-explicit-connect.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/status-bar/RuntimeHostStatusRow.tsx` | renderer-mirror, shared | `@/runtime/runtime-host-connection-state`, `../../../../shared/remote-runtime-shared-control-types` |
| `src/renderer/src/components/status-bar/SkillUpdateStatusSegment.tsx` | renderer-mirror | `../skills/skill-freshness-update-dialog`, `../skills/skill-update-run-store` |
| `src/renderer/src/components/status-bar/SshStatusSegment.tsx` | shared, renderer-mirror | `../../../../shared/ssh-types`, `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/components/status-bar/SshTargetStatusRow.tsx` | renderer-mirror, shared | `@/ssh/ssh-connection-recoverability`, `@/ssh/ssh-connect-verb`, `@/ssh/ssh-connect-in-flight`, `../../../../shared/ssh-types` |
| `src/renderer/src/components/status-bar/use-codex-switcher-controller.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-provider-accounts-client` |
| `src/renderer/src/components/status-bar/use-workspace-space-git-refresh-action.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/components/tab-bar/BrowserTab.tsx` | shared, renderer-mirror | `../../../../shared/browser-url`, `../../../../shared/browser-workspace-types`, `../browser-pane/describe-page/live-browser-url-registry` |
| `src/renderer/src/components/tab-bar/ClientHostedBrowserTabRows.tsx` | renderer-mirror | `../../runtime/client-hosted-browser-row-close` |
| `src/renderer/src/components/tab-bar/editor-tab-local-open-guard.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/tab-bar/open-tab-selection-routing.ts` | renderer-mirror | `@/components/browser-pane/host-guest/browser-focus` |
| `src/renderer/src/components/tab-bar/QuickLaunchButton.tsx` | shared | `../../../../shared/telemetry-events` |
| `src/renderer/src/components/tab-bar/tab-agent-types-by-tab-id.ts` | renderer-mirror | `../native-chat/native-chat-leaf-routing` |
| `src/renderer/src/components/tab-bar/tab-bar-item-model.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/tab-bar/tab-bar-item-surface.tsx` | renderer-mirror | `../native-chat/native-chat-availability` |
| `src/renderer/src/components/tab-bar/tab-bar-props.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/tab-bar/tab-create-entry-absolute-file.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/tab-bar/tab-create-entry-action.ts` | renderer-mirror, shared | `@/runtime/runtime-file-client`, `../../../../shared/browser-url` |
| `src/renderer/src/components/tab-bar/tab-create-entry-active-option.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/tab-bar/tab-create-entry-classifier.ts` | shared | `../../../../shared/browser-url` |
| `src/renderer/src/components/tab-bar/tab-create-entry-local-path.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/tab-bar/tab-create-entry-url-classification.ts` | shared | `../../../../shared/browser-url` |
| `src/renderer/src/components/tab-bar/TabBarCreateEntry.tsx` | shared | `../../../../shared/browser-url` |
| `src/renderer/src/components/tab-bar/TabBarCreateEntryRow.tsx` | shared | `../../../../shared/browser-url` |
| `src/renderer/src/components/tab-bar/use-omnibox-browser-history.ts` | renderer-mirror | `../browser-pane/assemble-chrome/browser-address-bar-suggestions` |
| `src/renderer/src/components/tab-bar/use-tab-bar-runtime-model.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/tab-bar/web-runtime-tab-move-mirror.ts` | renderer-mirror | `../../runtime/web-runtime-session` |
| `src/renderer/src/components/tab-group/tab-drag-gesture-lifecycle.ts` | renderer-mirror | `../browser-pane/host-guest/webview-registry` |
| `src/renderer/src/components/tab-group/useTabGroupActivationCommands.ts` | renderer-mirror | `../../runtime/web-runtime-session`, `@/runtime/remote-browser-tab-ownership` |
| `src/renderer/src/components/tab-group/useTabGroupCreationCommands.ts` | renderer-mirror | `../../runtime/web-runtime-session`, `@/runtime/remote-browser-tab-ownership` |
| `src/renderer/src/components/tab-group/useTabGroupItemProjections.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/tab-group/useTabGroupWorkspaceModel.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/components/task-page-cache-selectors.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-checks-pill.ts` | shared | `../../../shared/github/pull-request-types` |
| `src/renderer/src/components/task-page-draft-storage.tsx` | shared, renderer-mirror | `../../../shared/github/pull-request-types`, `@/components/github/IssueSourceIndicator` |
| `src/renderer/src/components/task-page-github-dialog-state-authority.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-github-landing-refresh-run.tsx` | renderer-mirror, shared | `./use-task-page-github-search-pagination`, `../../../shared/task-query`, `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-quiet-refresh-run.tsx` | renderer-mirror, shared | `./use-task-page-github-quiet-refresh`, `../../../shared/task-query`, `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-resume-cache.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-review-model.tsx` | shared, renderer-mirror | `../../../shared/github/pull-request-types`, `../../../shared/github/work-item-types`, `../../../shared/github/project-identity`, `@/components/github/IssueSourceIndicator` |
| `src/renderer/src/components/task-page-github-reviewer-actions.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `../../../shared/github/pull-request-types`, `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-github-status-actions.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-status-state.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-task-kind.ts` | shared | `../../../shared/task-preset-query`, `../../../shared/task-query` |
| `src/renderer/src/components/task-page-github-work-item-filter-membership.ts` | shared | `../../../shared/task-query`, `../../../shared/github/pull-request-types`, `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-work-item-mutation-composition.ts` | shared | `../../../shared/task-query`, `../../../shared/github/pull-request-types`, `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-work-item-mutation-lifecycle.ts` | shared | `../../../shared/task-query`, `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-github-work-item-mutation-pages.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-github-work-item-mutation-patches.ts` | shared | `../../../shared/github/pull-request-types`, `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-work-item-mutation-registry.ts` | shared | `../../../shared/github/pull-request-types` |
| `src/renderer/src/components/task-page-github-work-item-mutation-types.ts` | shared | `../../../shared/task-query`, `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-github-work-item-mutations.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/task-source-context`, `../../../shared/task-query` |
| `src/renderer/src/components/task-page-github-work-item-quiet-adopt.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-github-work-item-quiet-revalidate.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-github-work-item-registry-types.ts` | shared | `../../../shared/github/pull-request-types`, `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-github-work-item-status.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-jira-cache-selectors.ts` | shared | `../../../shared/task-source-context`, `../../../shared/jira-types` |
| `src/renderer/src/components/task-page-jira-create-fields.ts` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/task-page-jira-issue-list.tsx` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/task-page-jira-item-source-context.ts` | shared | `../../../shared/jira-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-jira-load-state.ts` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/task-page-jira-project-selection.ts` | shared | `../../../shared/jira-types` |
| `src/renderer/src/components/task-page-jira-status-order.ts` | shared, renderer-mirror | `../../../shared/jira-types`, `@/runtime/runtime-jira-client` |
| `src/renderer/src/components/task-page-linear-cache-selectors.ts` | shared | `../../../shared/linear/issue-types`, `../../../shared/linear/workspace-types` |
| `src/renderer/src/components/task-page-linear-in-orca-issues.ts` | shared | `../../../shared/linear/issue-types`, `../../../shared/linear/workspace-types`, `../../../shared/linear/links`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-linear-issue-empty-state.ts` | shared | `../../../shared/linear/issue-attribute-filter` |
| `src/renderer/src/components/task-page-linear-issue-model.tsx` | shared, renderer-mirror | `../../../shared/linear/issue-types`, `../../../shared/linear/project-types`, `../../../shared/linear/workspace-types`, `../../../shared/task-source-context`, `@/runtime/runtime-linear-issue-mutations` |
| `src/renderer/src/components/task-page-linear-issue-request.ts` | shared | `../../../shared/linear/issue-attribute-filter`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-linear-jira-list-model.tsx` | shared | `../../../shared/linear/issue-types`, `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-linear-team-selection.ts` | shared | `../../../shared/linear/workspace-types` |
| `src/renderer/src/components/task-page-list-chrome-visibility.ts` | shared | `../../../shared/task-providers` |
| `src/renderer/src/components/task-page-localized-options.tsx` | shared | `../../../shared/linear/issue-view-resume-state`, `../../../shared/task-preset-query`, `../../../shared/task-providers` |
| `src/renderer/src/components/task-page-new-issue-draft.ts` | shared | `../../../shared/github/pull-request-types` |
| `src/renderer/src/components/task-page-pr-check-summary.ts` | shared | `../../../shared/github/check-types`, `../../../shared/github/pull-request-types` |
| `src/renderer/src/components/task-page-pr-delta-summary.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-source-context.tsx` | shared | `../../../shared/github/work-item-types`, `../../../shared/gitlab-types`, `../../../shared/jira-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-page-work-item-pagination.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-page-work-item-signatures.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/components/task-source-context-summary.ts` | shared | `../../../shared/ssh-types`, `../../../shared/task-providers`, `../../../shared/task-source-context` |
| `src/renderer/src/components/task-source-provider-availability.ts` | shared | `../../../shared/task-providers`, `../../../shared/task-source-context` |
| `src/renderer/src/components/terminal-cold-activation.ts` | renderer-mirror | `../runtime/sync-runtime-graph`, `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/agent-completion-coordinator-test-harness.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/agent-completion-coordinator-types.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/agent-completion-inspection-result.ts` | shared, renderer-mirror | `../../../../shared/ssh-pty-id`, `../../../../shared/remote-foreground-evidence-admission`, `@/runtime/runtime-terminal-stream`, `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/codex-detached-pane-restart.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/components/terminal-pane/pane-foreground-agent-tracker.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/pane-foreground-process-reader.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-inspection`, `@/runtime/runtime-terminal-stream`, `../../../../shared/ssh-pty-id`, `../../../../shared/remote-foreground-evidence-admission` |
| `src/renderer/src/components/terminal-pane/parked-terminal-byte-watcher.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/parked-terminal-command-status.ts` | shared | `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/pending-runtime-pane-close-test-fixture.ts` | src/renderer/src/components/terminal-pane/pending-runtime-pane-close-test-fixture.ts | `src/renderer/src/components/terminal-pane/pending-runtime-pane-close-test-fixture.ts,[object Map]` |
| `src/renderer/src/components/terminal-pane/pty-connection-types.ts` | shared | `../../../../shared/telemetry-events`, `../../../../shared/native-chat-session-options` |
| `src/renderer/src/components/terminal-pane/pty-connection/agent-idle-working-handlers.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-stream`, `@/runtime/web-terminal-surface-id`, `../../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/pty-connection/deferred-session-reattach-choice.ts` | renderer-mirror | `@/runtime/sync-runtime-graph`, `@/runtime/web-terminal-surface-id` |
| `src/renderer/src/components/terminal-pane/pty-connection/hidden-output-snapshot-serialize.ts` | renderer-mirror | `@/runtime/remote-runtime-terminal-multiplexer` |
| `src/renderer/src/components/terminal-pane/pty-connection/paired-parked-terminal-restore.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/components/terminal-pane/pty-connection/pane-agent-identity.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-inspection`, `../../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/pty-connection/pane-pty-visibility-bind.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/components/terminal-pane/pty-connection/pane-serializer-settle.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/pty-connection/pty-exit-hibernate.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/components/terminal-pane/pty-connection/reattach-result-handler.ts` | renderer-mirror, shared | `@/runtime/sync-runtime-graph`, `../../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/pty-connection/ssh-snapshot-prepaint.ts` | shared | `../../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/pty-connection/terminal-keydown-fit.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/pty-shutdown-exit-deferral.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/components/terminal-pane/pty-transport-types.ts` | shared, renderer-mirror | `../../../../shared/telemetry-events`, `../../runtime/remote-runtime-terminal-multiplexer` |
| `src/renderer/src/components/terminal-pane/remote-execution-host-pty.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-inspection`, `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/remote-pane-layout-push.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/components/terminal-pane/remote-runtime-pty-transport.ts` | renderer-mirror, shared | `@/runtime/agent-session-keyboard-capability`, `../../runtime/agent-resume-host-authority-capability`, `../../runtime/runtime-rpc-client`, `../../runtime/runtime-terminal-stream`, `../../runtime/remote-runtime-terminal-multiplexer`, `../../runtime/runtime-worktree-selector`, `@/runtime/agent-session-create-operation`, `@/runtime/web-terminal-surface-id`, `@/runtime/remote-runtime-session-tabs-inflight`, `@/runtime/web-session-terminal-handle-events`, `@/runtime/remote-agent-session-launch`, `@/runtime/web-agent-session-handoff`, `@/runtime/web-runtime-session`, `@/runtime/runtime-environment-revision`, `../../../../shared/remote-runtime-client-error-classification` |
| `src/renderer/src/components/terminal-pane/resolve-split-cwd.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/retire-unbound-runtime-terminal-pane.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/components/terminal-pane/ssh-pane-connect-gate.ts` | shared | `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/ssh-reattach-model-restore.ts` | shared | `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/terminal-file-link-hit-testing.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/terminal-pane/terminal-file-open-routing.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/terminal-pane/terminal-fit-restore.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/components/terminal-pane/terminal-handle-links.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/components/terminal-pane/terminal-hidden-view-parking.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-inspection`, `@/runtime/runtime-terminal-stream`, `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/terminal-hidden-worktree-retention.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/terminal-http-link-source-owner.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-stream`, `../../../../shared/ssh-pty-id` |
| `src/renderer/src/components/terminal-pane/terminal-input-host-platform.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/components/terminal-pane/terminal-link-handlers-test-harness.ts` | renderer-mirror | `@/runtime/runtime-compatibility-test-fixture`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/terminal-pane/terminal-link-handlers.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/terminal-pane/terminal-live-layout-reconciliation.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/terminal-native-file-drop.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/terminal-pane/terminal-orchestration-task-links.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/components/terminal-pane/terminal-pane-close-admission.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream`, `@/runtime/runtime-environment-revision` |
| `src/renderer/src/components/terminal-pane/terminal-pane-manager-options.ts` | renderer-mirror | `@/runtime/sync-runtime-graph`, `../browser-pane/host-guest/webview-registry` |
| `src/renderer/src/components/terminal-pane/terminal-pane-mount-events.ts` | renderer-mirror | `@/runtime/web-runtime-session`, `@/runtime/sync-runtime-graph` |
| `src/renderer/src/components/terminal-pane/terminal-pane-mount-preparation.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/components/terminal-pane/terminal-pane-pane-closed.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/components/terminal-pane/terminal-pane-pane-created.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/components/terminal-pane/terminal-pane-split-completion.ts` | renderer-mirror | `@/lib/feature-education-telemetry` |
| `src/renderer/src/components/terminal-pane/terminal-pane-split-with-inherited-cwd.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/components/terminal-pane/terminal-parked-pty-watcher.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/components/terminal-pane/terminal-parked-watcher-registry.ts` | shared | `../../../../shared/remote-runtime-pty-id` |
| `src/renderer/src/components/terminal-pane/terminal-path-existence-batch.ts` | renderer-mirror | `@/runtime/runtime-file-client-types`, `@/runtime/runtime-path-existence-batch`, `@/runtime/runtime-client-target`, `@/runtime/runtime-environment-revision` |
| `src/renderer/src/components/terminal-pane/terminal-remote-file-download-open.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/components/terminal-pane/TerminalContextMenu.tsx` | renderer-mirror | `../native-chat/native-chat-shortcut` |
| `src/renderer/src/components/terminal-pane/TerminalOverlaySlot.tsx` | renderer-mirror | `../activity/activity-terminal-portal` |
| `src/renderer/src/components/terminal-pane/TerminalPaneNativeChatPortal.tsx` | renderer-mirror | `../native-chat/NativeChatView` |
| `src/renderer/src/components/terminal-pane/TerminalPaneOverlayLayer.tsx` | renderer-mirror | `../activity/activity-terminal-portal`, `../native-chat/use-native-chat-toggle-shortcut` |
| `src/renderer/src/components/terminal-pane/TerminalPaneRuntimePortals.tsx` | renderer-mirror | `../native-chat/native-chat-send-eligibility` |
| `src/renderer/src/components/terminal-pane/TerminalSshReconnectOverlay.tsx` | shared, renderer-mirror | `../../../../shared/ssh-types`, `@/runtime/runtime-environment-ssh-state`, `@/ssh/ssh-connection-recoverability`, `@/ssh/ssh-connect-verb`, `@/ssh/ssh-connect-ui-timeout`, `@/ssh/ssh-connect-in-flight` |
| `src/renderer/src/components/terminal-pane/use-terminal-pane-chat-state.ts` | renderer-mirror | `../native-chat/native-chat-availability`, `../native-chat/native-chat-leaf-routing` |
| `src/renderer/src/components/terminal-pane/use-terminal-pane-close-actions.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/components/terminal-pane/use-terminal-pane-foundation.ts` | renderer-mirror | `@/runtime/runtime-environment-ssh-state` |
| `src/renderer/src/components/terminal-pane/use-terminal-pane-layout-persistence.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection`, `@/runtime/web-runtime-session` |
| `src/renderer/src/components/terminal-pane/use-terminal-pane-mount-lifecycle.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/components/terminal-pane/use-terminal-pane-projection.ts` | renderer-mirror | `../native-chat/native-chat-leaf-routing` |
| `src/renderer/src/components/terminal-pane/use-terminal-tab-cold-parking.ts` | renderer-mirror | `../activity/activity-terminal-portal` |
| `src/renderer/src/components/terminal/pty-running-work-probe.ts` | renderer-mirror, shared | `@/runtime/runtime-terminal-inspection`, `../../../../shared/remote-execution-host-pty-id` |
| `src/renderer/src/components/terminal/terminal-close-incarnation.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/components/terminal/terminal-tab-actions.ts` | renderer-mirror | `@/runtime/web-runtime-session`, `@/runtime/web-session-tabs-sync` |
| `src/renderer/src/components/terminal/terminal-tab-bulk-actions.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/components/terminal/terminal-tab-create.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/components/terminal/window-close-running-work.ts` | shared | `../../../../shared/remote-execution-host-pty-id` |
| `src/renderer/src/components/TerminalLegacyBrowserPanes.tsx` | renderer-mirror | `./browser-pane/BrowserPane` |
| `src/renderer/src/components/TerminalLegacyTerminalPanes.tsx` | renderer-mirror | `./activity/activity-terminal-portal` |
| `src/renderer/src/components/TerminalSplitWorkspaceSurfaces.tsx` | renderer-mirror | `./browser-pane/host-guest/browser-guest-paint-retention` |
| `src/renderer/src/components/TerminalSurface.tsx` | renderer-mirror | `./browser-pane/host-guest/browser-guest-paint-retention` |
| `src/renderer/src/components/TerminalWorkbenchContainer.tsx` | renderer-mirror | `./browser-pane/host-guest/browser-guest-paint-retention` |
| `src/renderer/src/components/TerminalWorktreeSplitSurface.tsx` | renderer-mirror | `./activity/activity-terminal-portal`, `./browser-pane/host-guest/browser-guest-paint-retention`, `./browser-pane/host-guest/browser-worktree-surface-paintability`, `./browser-pane/assemble-chrome/BrowserPaneOverlayLayer`, `./native-chat/StructuredAgentSessionPaneOverlayLayer` |
| `src/renderer/src/components/unexpected-signout/unexpected-signout-visibility.ts` | shared | `../../../../shared/orca-profiles` |
| `src/renderer/src/components/use-terminal-activation-actions.ts` | renderer-mirror | `@/runtime/web-runtime-session`, `@/runtime/remote-browser-tab-ownership` |
| `src/renderer/src/components/use-terminal-browser-retention.ts` | renderer-mirror | `./browser-pane/host-guest/browser-guest-paint-retention`, `./browser-pane/host-guest/browser-guest-worktree-retention`, `./browser-pane/navigate/browser-page-download-activity`, `./browser-pane/host-guest/webview-registry` |
| `src/renderer/src/components/use-terminal-bulk-close-actions.ts` | renderer-mirror | `@/runtime/web-runtime-session`, `@/runtime/browser-workspace-tab-close` |
| `src/renderer/src/components/use-terminal-create-actions.ts` | renderer-mirror | `@/runtime/web-runtime-session`, `@/runtime/remote-browser-tab-ownership` |
| `src/renderer/src/components/use-terminal-watcher-effects.ts` | renderer-mirror | `./activity/activity-terminal-portal` |
| `src/renderer/src/components/use-terminal-workspace-projection.ts` | renderer-mirror | `./contextual-tours/use-contextual-tour` |
| `src/renderer/src/components/use-terminal-workspace-store-bindings.ts` | renderer-mirror | `./activity/activity-terminal-portal` |
| `src/renderer/src/components/use-worktree-jump-palette-selection-lifecycle.ts` | renderer-mirror | `@/components/browser-pane/host-guest/browser-focus` |
| `src/renderer/src/components/use-worktree-jump-palette-task-url.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/linear/issue-types`, `../../../shared/task-source-context` |
| `src/renderer/src/components/workspace-cleanup/workspace-cleanup-candidate-row.tsx` | renderer-mirror | `@/components/github/review-state-presentation` |
| `src/renderer/src/components/workspace-cleanup/workspace-cleanup-confirm-remove.tsx` | renderer-mirror | `@/components/github/review-state-presentation` |
| `src/renderer/src/components/worktree-jump-palette-create-worktree.ts` | shared | `../../../shared/task-source-context` |
| `src/renderer/src/hooks/__tests__/remote-workspace-target-sync-test-harness.ts` | shared | `../../../../shared/remote-workspace-types`, `../../../../shared/ssh-types` |
| `src/renderer/src/hooks/agent-auto-ack-surfaces.ts` | renderer-mirror | `@/components/native-chat/structured-attention-surface` |
| `src/renderer/src/hooks/agent-auto-ack-targets.ts` | renderer-mirror | `@/components/native-chat/structured-agent-session-tabs` |
| `src/renderer/src/hooks/agent-hook-completion-notifications.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/hooks/automation-dispatch-completion.ts` | renderer-mirror | `@/components/automations/automation-run-output-snapshot` |
| `src/renderer/src/hooks/automation-dispatch-handler.ts` | renderer-mirror | `@/components/automations/automation-host-client` |
| `src/renderer/src/hooks/composer-state/async-composer-state.ts` | shared, renderer-mirror | `../../../../shared/orca-yaml-hook-types`, `../../../../shared/github/work-item-types`, `../../../../shared/github/pull-request-types`, `@/runtime/runtime-hooks-client`, `@/components/contextual-tours/contextual-tour-composer-events` |
| `src/renderer/src/hooks/composer-state/async-model.ts` | shared, renderer-mirror | `../../../../shared/github/work-item-types`, `../../../../shared/orca-yaml-hook-types`, `../../../../shared/github/pull-request-types`, `@/runtime/runtime-hooks-client` |
| `src/renderer/src/hooks/composer-state/attachment-drop-state.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/hooks/composer-state/branch-start-point-actions.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/gitlab-types` |
| `src/renderer/src/hooks/composer-state/composer-decisions.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/composer-state/composer-navigation-actions.ts` | shared | `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/composer-state/composer-source-model.ts` | shared | `../../../../shared/gitlab-types`, `../../../../shared/github/work-item-types`, `../../../../shared/jira-types`, `../../../../shared/task-source-context`, `../../../../shared/linear/issue-types` |
| `src/renderer/src/hooks/composer-state/composer-store-actions.ts` | shared | `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/composer-state/composer-target-store.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/composer-state/derived-composer-state.ts` | shared | `../../../../shared/github/repository-identity-key`, `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/hooks/composer-state/derived-model.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/hooks/composer-state/folder-submit-orchestration.ts` | renderer-mirror | `@/components/native-chat/native-chat-launch-session-options` |
| `src/renderer/src/hooks/composer-state/full-creation-execution.ts` | renderer-mirror | `@/components/native-chat/native-chat-session-option-cache` |
| `src/renderer/src/hooks/composer-state/full-submit-preparation.ts` | renderer-mirror | `@/components/native-chat/native-chat-launch-session-options`, `@/lib/telemetry` |
| `src/renderer/src/hooks/composer-state/github-provider-selection.ts` | shared | `../../../../shared/github/work-item-types` |
| `src/renderer/src/hooks/composer-state/github-source-application.ts` | shared | `../../../../shared/github/work-item-types` |
| `src/renderer/src/hooks/composer-state/github-submit-resolution.ts` | shared | `../../../../shared/task-source-context`, `../../../../shared/github/work-item-types` |
| `src/renderer/src/hooks/composer-state/gitlab-provider-selection.ts` | shared, renderer-mirror | `../../../../shared/gitlab-types`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/hooks/composer-state/host-runtime-effects.ts` | renderer-mirror | `@/runtime/runtime-hooks-client` |
| `src/renderer/src/hooks/composer-state/issue-source-actions.ts` | shared | `../../../../shared/linear/issue-types`, `../../../../shared/jira-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/composer-state/linked-item-lookup-effects.ts` | shared | `../../../../shared/github/work-item-types` |
| `src/renderer/src/hooks/composer-state/provider-runtime-sync.ts` | shared, renderer-mirror | `../../../../shared/orca-yaml-hook-types`, `../../../../shared/github/pull-request-types`, `@/runtime/runtime-hooks-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/hooks/composer-state/provider-sync-model.ts` | shared, renderer-mirror | `../../../../shared/orca-yaml-hook-types`, `@/runtime/runtime-hooks-client` |
| `src/renderer/src/hooks/composer-state/quick-creation-execution.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/hooks/composer-state/quick-creation-request.ts` | shared | `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/composer-state/quick-startup-plan.ts` | renderer-mirror | `@/components/native-chat/native-chat-launch-session-options`, `@/lib/telemetry` |
| `src/renderer/src/hooks/composer-state/quick-submit-preparation.ts` | renderer-mirror | `@/runtime/runtime-hooks-client`, `@/runtime/worktree-create-base` |
| `src/renderer/src/hooks/composer-state/runtime-target-model.ts` | shared | `../../../../shared/ssh-types`, `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/hooks/composer-state/setup-policy-decisions.ts` | shared | `../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/hooks/composer-state/source-context-model.ts` | shared | `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/composer-state/source-context-state.ts` | shared | `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/composer-state/source-identity-actions.ts` | shared | `../../../../shared/gitlab-types`, `../../../../shared/github/work-item-types` |
| `src/renderer/src/hooks/composer-state/source-selection-decisions.ts` | shared | `../../../../shared/github/work-item-types` |
| `src/renderer/src/hooks/composer-state/target-store-model.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/ssh-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/hooks/direct-ssh-host-hydration-scope.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-host-hydration.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-reconnect-coordinator-stabilization.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-reconnect-coordinator-types.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-reconnect-coordinator.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-reconnect-preparation.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-reconnect-tokens.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-state-routing.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-worktree-refresh-scheduler-types.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/direct-ssh-worktree-refresh-scheduler.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/editor-external-watch-disk-verification.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/hooks/installed-agent-skill-discovery.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-skills-client` |
| `src/renderer/src/hooks/ipc-events/agent-status-event-applicator.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/hooks/ipc-events/app-lifetime-ipc-bridge.ts` | renderer-mirror | `@/runtime/mobile-markdown-bridge` |
| `src/renderer/src/hooks/ipc-events/browser-automation-bootstrap-lease.ts` | renderer-mirror | `@/components/browser-pane/host-guest/browser-automation-visibility` |
| `src/renderer/src/hooks/ipc-events/browser-request-ipc-bridge.ts` | renderer-mirror | `@/components/browser-pane/host-guest/webview-registry` |
| `src/renderer/src/hooks/ipc-events/browser-state-ipc-bridge.ts` | renderer-mirror, shared | `@/components/browser-pane/describe-page/live-browser-url-registry`, `@/components/browser-pane/host-guest/browser-automation-visibility`, `../../../../shared/browser-url` |
| `src/renderer/src/hooks/ipc-events/direct-ssh-bridge-runtime.ts` | renderer-mirror, shared | `@/lib/direct-ssh-reconnect-product-telemetry`, `../../../../shared/ssh-types` |
| `src/renderer/src/hooks/ipc-events/direct-ssh-initial-state-hydration.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/hooks/ipc-events/direct-ssh-state-ipc-bridge.ts` | renderer-mirror, shared | `@/ssh/ssh-connection-recoverability`, `../../../../shared/ssh-types` |
| `src/renderer/src/hooks/ipc-events/mobile-driver-ipc-bridge.ts` | renderer-mirror | `@/runtime/native-chat-launch-draft-runtime-resolution` |
| `src/renderer/src/hooks/ipc-events/runtime-client-ipc-bridge.ts` | renderer-mirror | `@/runtime/native-chat-launch-draft-runtime-resolution`, `@/runtime/runtime-environment-revision`, `@/runtime/runtime-environment-ssh-state`, `@/runtime/runtime-client-events`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/hooks/ipc-events/runtime-environment-subscription-selection.ts` | renderer-mirror | `@/runtime/runtime-environment-revision`, `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/hooks/ipc-events/session-tab-ipc-bridge.ts` | renderer-mirror | `@/runtime/local-session-tab-close-owner`, `@/runtime/mobile-session-tab-close` |
| `src/renderer/src/hooks/ipc-events/tab-lifecycle-ipc-bridge.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/hooks/ipc-events/terminal-command-state.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/hooks/ipc-events/terminal-presentation-ipc-bridge.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/hooks/ipc-events/terminal-ui-routing-ipc-bridge.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/hooks/modal-return-focus-action.ts` | renderer-mirror | `../components/browser-pane/host-guest/browser-focus` |
| `src/renderer/src/hooks/remote-workspace-deferred-placement-retry.ts` | shared | `../../../shared/ssh-types`, `../../../shared/remote-workspace-types` |
| `src/renderer/src/hooks/remote-workspace-push-status.ts` | shared | `../../../shared/remote-workspace-types` |
| `src/renderer/src/hooks/remote-workspace-snapshot-apply.ts` | shared | `../../../shared/remote-workspace-types`, `../../../shared/remote-workspace-session-projection`, `../../../shared/ssh-types` |
| `src/renderer/src/hooks/remote-workspace-snapshot-placement.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/hooks/remote-workspace-target-sync-types.ts` | shared | `../../../shared/remote-workspace-types`, `../../../shared/ssh-types` |
| `src/renderer/src/hooks/remote-workspace-target-sync.ts` | shared | `../../../shared/remote-workspace-types`, `../../../shared/ssh-types` |
| `src/renderer/src/hooks/settings-navigation-interface-sections.ts` | renderer-mirror | `@/components/stats/stats-search` |
| `src/renderer/src/hooks/ssh-reconnect-pane-retry.ts` | shared | `../../../shared/ssh-pty-id` |
| `src/renderer/src/hooks/use-active-skill-discovery-runtime-target.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/hooks/useActiveProjectSkillRuntime.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/hooks/useComposerState.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/hooks/useEditorExternalWatch.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/hooks/useEphemeralVmRecipeOptions.ts` | shared | `../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/hooks/useGitHubSlugMetadata.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `../../../shared/github/pull-request-types`, `../../../shared/github/project-result-types`, `../../../shared/github/repository-identity-key`, `../../../shared/github/project-identity` |
| `src/renderer/src/hooks/useGlobalFileDrop.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/hooks/useIssueMetadata.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-linear-project-client`, `@/runtime/runtime-linear-client`, `../../../shared/github/pull-request-types`, `../../../shared/linear/workspace-types`, `../../../shared/task-source-context` |
| `src/renderer/src/hooks/useMacTccAttributionSeveredNotice.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/hooks/useModalReturnFocus.ts` | renderer-mirror | `../components/browser-pane/host-guest/browser-focus` |
| `src/renderer/src/hooks/useSettingsNavigationMetadata.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/hooks/useSkillFreshness.ts` | shared | `../../../shared/skill-freshness` |
| `src/renderer/src/hooks/useTaskPageGitHubWorkItemMutation.ts` | shared | `../../../shared/task-query`, `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/lib/activate-ai-vault-structured-session.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-worktree-selector`, `@/runtime/local-structured-session-tabs-sync`, `@/runtime/runtime-protocol-compat` |
| `src/renderer/src/lib/active-agent-note-send-delivery.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/active-agent-note-send.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/active-agent-note-target.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/lib/active-agent-terminal-send-readiness.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/adopt-agent-background-session-tab.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/agent-background-session-contract.ts` | shared | `../../../shared/telemetry-events` |
| `src/renderer/src/lib/agent-background-session-test-state.ts` | renderer-mirror | `@/runtime/runtime-compatibility-test-fixture`, `@/runtime/runtime-rpc-client`, `@/runtime/remote-runtime-terminal-multiplexer` |
| `src/renderer/src/lib/agent-background-session-timeout-toast.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/lib/agent-draft-paste-content.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/lib/agent-draft-readiness.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/lib/agent-followup-delivery.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/lib/agent-hibernation-coordinator-test-fixture.ts` | renderer-mirror | `../runtime/runtime-compatibility-test-fixture`, `../runtime/runtime-rpc-client` |
| `src/renderer/src/lib/agent-hibernation-coordinator.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/lib/agent-hibernation-pane-eligibility.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/lib/agent-launch-route-input.ts` | renderer-mirror | `@/runtime/local-runtime-capabilities` |
| `src/renderer/src/lib/agent-paste-draft.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/lib/agent-ready-wait.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/lib/agent-row-primary-text.ts` | shared | `../../../shared/orca-dispatch-status-prompt` |
| `src/renderer/src/lib/agent-session-continuation.ts` | shared | `../../../shared/telemetry-events` |
| `src/renderer/src/lib/agent-session-launch-plan.ts` | shared | `../../../shared/structured-agent-session-create` |
| `src/renderer/src/lib/agent-skill-nav-install-status.ts` | shared | `../../../shared/skill-freshness` |
| `src/renderer/src/lib/agent-status-connection-ownership.ts` | shared, renderer-mirror | `../../../shared/ssh-pty-id`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/lib/agent-status.ts` | shared | `../../../shared/telemetry-events` |
| `src/renderer/src/lib/automation-session-observer.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/remote-runtime-terminal-multiplexer`, `@/runtime/runtime-terminal-inspection`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/lib/browser-cookie-import-toast.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/browser-history-match.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/browser-page-conversion-history.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/browser-palette-page-entries.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/browser-palette-search.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/cmd-j-github-url-lookup.ts` | shared | `../../../shared/github/links`, `../../../shared/github/work-item-types`, `../../../shared/task-source-context` |
| `src/renderer/src/lib/codex-pane-restart-eligibility.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/lib/codex-pane-selection-lane.ts` | renderer-mirror, shared | `@/runtime/runtime-client-target`, `@/runtime/runtime-terminal-stream`, `../../../shared/ssh-pty-id` |
| `src/renderer/src/lib/codex-session-restart.ts` | renderer-mirror | `@/runtime/runtime-terminal-inspection` |
| `src/renderer/src/lib/create-untitled-markdown.ts` | renderer-mirror | `../runtime/runtime-file-client` |
| `src/renderer/src/lib/doc-preview-grants.ts` | renderer-mirror | `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/lib/duplicate-browser-tab-options.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/ensure-hooks-confirmed.ts` | shared, renderer-mirror | `../../../shared/orca-yaml-hook-types`, `@/runtime/runtime-hooks-client` |
| `src/renderer/src/lib/ephemeral-vm-workspace-target.ts` | shared, renderer-mirror | `../../../shared/ephemeral-vm-recipes`, `../../../shared/ephemeral-vm-recipe-diagnostics`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/execute-open-editor-path-move.ts` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/close-mirrored-editor-tab` |
| `src/renderer/src/lib/file-preview.ts` | shared | `../../../shared/browser-page-doc-location`, `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/fix-checks-agent-launch.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/telemetry-events` |
| `src/renderer/src/lib/floating-workspace-tab-creation.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/floating-workspace-terminal-actions.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/github-pr-start-point.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/github-source-runtime-context.ts` | shared, renderer-mirror | `../../../shared/task-source-context`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/github-work-item-details-cache-events.ts` | shared | `../../../shared/task-source-context` |
| `src/renderer/src/lib/github-work-item-source-lookup.ts` | shared, renderer-mirror | `../../../shared/github/work-item-types`, `../../../shared/task-source-context`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/github-work-item-workspace-attachment.ts` | shared | `../../../shared/github/work-item-types` |
| `src/renderer/src/lib/gitlab-work-item-source-lookup.ts` | shared, renderer-mirror | `../../../shared/gitlab-types`, `../../../shared/task-source-context`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/host-mirror-handle-gap-wait.ts` | renderer-mirror, shared | `@/runtime/web-session-tab-rpc-timeout`, `@/runtime/runtime-host-connection-state`, `../../../shared/remote-runtime-pty-id` |
| `src/renderer/src/lib/host-mirrored-pane-liveness.ts` | shared, renderer-mirror | `../../../shared/remote-runtime-pty-id`, `@/runtime/host-session-mirror-hydration` |
| `src/renderer/src/lib/launch-agent-background-session.ts` | renderer-mirror | `@/lib/telemetry`, `@/runtime/runtime-rpc-client`, `@/lib/runtime-agent-background-create`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/lib/launch-agent-in-new-tab.ts` | renderer-mirror, shared | `@/lib/telemetry`, `@/runtime/web-runtime-session`, `@/components/native-chat/native-chat-launch-session-options`, `@/components/native-chat/native-chat-session-option-cache`, `../../../shared/telemetry-events` |
| `src/renderer/src/lib/launch-agent-paste-timeout-notice.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/lib/launch-agent-session-continuation.ts` | shared | `../../../shared/telemetry-events` |
| `src/renderer/src/lib/launch-agent-web-host-tab.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/lib/launch-ai-vault-session.ts` | renderer-mirror | `@/lib/telemetry`, `@/runtime/web-runtime-session` |
| `src/renderer/src/lib/launch-structured-agent-session.ts` | shared, renderer-mirror | `../../../shared/structured-agent-session-create`, `../../../shared/native-chat-session-option-defaults`, `@/runtime/structured-agent-session-client`, `@/runtime/runtime-worktree-selector`, `@/runtime/web-session-focus-intent`, `@/runtime/local-structured-session-owner` |
| `src/renderer/src/lib/launch-work-item-direct-agent-routing.ts` | renderer-mirror | `@/lib/launch-work-item-direct-agent` |
| `src/renderer/src/lib/launch-work-item-direct-preflight.ts` | renderer-mirror, shared | `@/runtime/runtime-hooks-client`, `../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/lib/launch-work-item-direct-types.ts` | shared | `../../../shared/task-providers`, `../../../shared/telemetry-events` |
| `src/renderer/src/lib/launch-work-item-direct.ts` | renderer-mirror | `@/lib/launch-work-item-direct-agent` |
| `src/renderer/src/lib/launch-worktree-background-terminals.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/linear-issue-context-snapshot.ts` | shared | `../../../shared/linear/issue-types` |
| `src/renderer/src/lib/linear-issue-url-lookup.ts` | renderer-mirror, shared | `@/runtime/runtime-linear-client`, `../../../shared/linear/links`, `../../../shared/linear/issue-types`, `../../../shared/linear/workspace-types`, `../../../shared/task-source-context` |
| `src/renderer/src/lib/linear-issue-workspace-attachment.ts` | shared | `../../../shared/linear/issue-types`, `../../../shared/linear/links` |
| `src/renderer/src/lib/linear-linked-work-item.ts` | shared | `../../../shared/linear/issue-types` |
| `src/renderer/src/lib/linked-work-item-context.ts` | shared | `../../../shared/task-providers` |
| `src/renderer/src/lib/markdown-document-templates.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/lib/native-chat-supported-agent.ts` | shared | `../../../shared/native-chat-agent-support` |
| `src/renderer/src/lib/new-workspace-ssh-gate.ts` | renderer-mirror, shared | `@/ssh/ssh-connection-recoverability`, `../../../shared/ssh-types` |
| `src/renderer/src/lib/new-workspace.ts` | shared | `../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/lib/onboarding-folder-agent-launch.ts` | renderer-mirror | `@/lib/onboarding-folder-agent-startup` |
| `src/renderer/src/lib/onboarding-project-checklist.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/lib/pending-worktree-creation.ts` | shared | `../../../shared/task-source-context` |
| `src/renderer/src/lib/pr-comment-action-state.ts` | shared | `../../../shared/github/comment-types` |
| `src/renderer/src/lib/pr-comment-reactions.ts` | shared | `../../../shared/github/comment-types` |
| `src/renderer/src/lib/react-commit-cascade-observer.ts` | renderer-mirror | `@/lib/react-commit-cascade-telemetry` |
| `src/renderer/src/lib/remote-pairing-copy.ts` | shared | `../../../shared/remote-pairing-address`, `../../../shared/remote-pairing-verification` |
| `src/renderer/src/lib/renderer-memory-sampling.ts` | renderer-mirror | `../components/browser-pane/host-guest/webview-registry` |
| `src/renderer/src/lib/repo-slug-cache.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `../../../shared/github/repository-identity-key` |
| `src/renderer/src/lib/repo-slug-index.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `../../../shared/github/repository-identity-key` |
| `src/renderer/src/lib/resume-sleeping-agent-session.ts` | renderer-mirror | `@/runtime/host-session-mirror-hydration` |
| `src/renderer/src/lib/retire-unowned-background-terminal.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/runtime-session-mirror-targets.ts` | renderer-mirror | `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/lib/setup-script-prompt.ts` | shared, renderer-mirror | `../../../shared/orca-yaml-hook-types`, `@/runtime/runtime-hooks-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/setup-script-status.ts` | renderer-mirror | `@/runtime/runtime-hooks-client` |
| `src/renderer/src/lib/simulator-pane-shutdown-scheduler.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/skill-freshness-display-status.ts` | shared | `../../../shared/skill-freshness` |
| `src/renderer/src/lib/sleeping-agent-session-launch.ts` | renderer-mirror | `@/lib/telemetry` |
| `src/renderer/src/lib/smart-github-submit.ts` | shared | `../../../shared/github/work-item-types`, `../../../shared/task-source-context`, `../../../shared/github/repository-identity-key` |
| `src/renderer/src/lib/ssh-mutation-expectation.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/lib/structured-agent-session-launch-callers.ts` | shared | `../../../shared/structured-agent-session-outbox`, `../../../shared/structured-agent-session-create` |
| `src/renderer/src/lib/structured-agent-session-launch-draft.ts` | shared | `../../../shared/structured-agent-session-projection` |
| `src/renderer/src/lib/structured-agent-session-launch-options.ts` | shared, renderer-mirror | `../../../shared/native-chat-session-option-defaults`, `../../../shared/structured-agent-session-mutation`, `@/runtime/structured-agent-session-client` |
| `src/renderer/src/lib/structured-agent-session-launch-persistence.ts` | shared | `../../../shared/structured-agent-session-create` |
| `src/renderer/src/lib/structured-agent-session-launch-prompt.ts` | shared, renderer-mirror | `../../../shared/structured-agent-session-outbox`, `../../../shared/structured-agent-session-mutation`, `@/components/native-chat/structured-agent-session-outbox-storage`, `@/runtime/structured-agent-session-client` |
| `src/renderer/src/lib/structured-agent-session-launch-recovery.ts` | renderer-mirror | `@/runtime/structured-agent-session-client`, `@/runtime/local-structured-session-tabs-sync` |
| `src/renderer/src/lib/structured-agent-session-launch-registry.ts` | shared | `../../../shared/structured-agent-session-create` |
| `src/renderer/src/lib/structured-agent-session-launch.ts` | renderer-mirror | `@/components/native-chat/structured-agent-session-outbox-storage` |
| `src/renderer/src/lib/structured-agent-session-provisional-tab.ts` | shared | `../../../shared/structured-agent-session-projection` |
| `src/renderer/src/lib/structured-agent-session-tab-activation.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/lib/structured-agent-synthetic-sleeping-record.ts` | shared | `../../../shared/structured-agent-session-projection` |
| `src/renderer/src/lib/tab-agent-remote-pty-selector.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/lib/tab-number-shortcuts.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/lib/update-check-click-options.ts` | shared | `../../../shared/remote-server-update` |
| `src/renderer/src/lib/web-runtime-worktree-terminal-after-wake.ts` | renderer-mirror | `@/runtime/web-runtime-session`, `@/runtime/web-session-tabs-sync`, `@/runtime/web-runtime-wake-terminal-respawn` |
| `src/renderer/src/lib/windows-terminal-capability-read.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/worker-terminal-takeover-report.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/workspace-activation-terminal-focus.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/lib/workspace-browser-tab-close.ts` | renderer-mirror | `@/runtime/browser-workspace-tab-close` |
| `src/renderer/src/lib/workspace-browser-tab-open.ts` | renderer-mirror, shared | `@/runtime/web-runtime-session`, `../../../shared/browser-url`, `../../../shared/browser-client-host-placement` |
| `src/renderer/src/lib/workspace-doc-address-input.ts` | shared | `../../../shared/browser-url`, `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/workspace-file-host-routing.ts` | renderer-mirror | `@/runtime/runtime-file-client`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/workspace-port-actions.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/lib/workspace-port-scan-client.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/workspace-port-urls.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/lib/workspace-session-browser-tabs.ts` | shared | `../../../shared/browser-workspace-types` |
| `src/renderer/src/lib/workspace-session-reconnect-targets.ts` | shared | `../../../shared/ssh-pty-id` |
| `src/renderer/src/lib/workspace-tab-palette-activation.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/lib/workspace-terminal-host-authority.ts` | renderer-mirror | `@/runtime/host-live-terminal-probe`, `@/runtime/web-runtime-session` |
| `src/renderer/src/lib/worktree-activation.ts` | renderer-mirror | `@/runtime/web-runtime-session` |
| `src/renderer/src/lib/worktree-agent-structured-inventory.ts` | renderer-mirror | `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/lib/worktree-creation-agent-seeds.ts` | renderer-mirror, src/renderer/src/lib/worktree-creation-agent-seeds.ts | `@/components/native-chat/native-chat-session-option-cache`, `@/runtime/web-terminal-surface-id`, `@/runtime/web-runtime-session`, `renderer-mirror,[object Set]`, `src/renderer/src/lib/worktree-creation-agent-seeds.ts,[object Map]` |
| `src/renderer/src/lib/worktree-creation-flow-startup.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/worktree-default-terminal-tabs.ts` | renderer-mirror | `@/components/native-chat/native-chat-session-option-cache` |
| `src/renderer/src/lib/worktree-initial-terminal-seeding.ts` | renderer-mirror | `@/components/native-chat/native-chat-session-option-cache` |
| `src/renderer/src/lib/worktree-live-terminal-surface-owners.ts` | renderer-mirror | `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/lib/worktree-operation-generation.ts` | renderer-mirror | `@/runtime/runtime-environment-revision` |
| `src/renderer/src/lib/worktree-palette-task-url-match.ts` | shared | `../../../shared/github/links`, `../../../shared/github/repository-identity-key`, `../../../shared/jira-issue-url`, `../../../shared/linear/links` |
| `src/renderer/src/lib/worktree-sort-order-persistence.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/lib/worktree-startup-payload.ts` | shared | `../../../shared/telemetry-events`, `../../../shared/native-chat-session-options` |
| `src/renderer/src/main.tsx` | renderer-mirror | `./components/automations/automation-host-diagnostics`, `./components/skills/SkillWarningPreviewLauncher`, `./components/browser-pane/browser-client-page-renderer-installation` |
| `src/renderer/src/popout.tsx` | renderer-mirror | `./lib/react-commit-cascade-telemetry` |
| `src/renderer/src/startup/active-workspace-ssh-targets.ts` | shared | `../../../shared/ssh-pty-id` |
| `src/renderer/src/startup/ssh-startup-reconnect.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/startup/startup-ssh-connection-restore.ts` | shared | `../../../shared/ssh-types` |
| `src/renderer/src/store/folder-workspaces/folder-path-status-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/folder-workspaces/folder-workspace-catalog-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/folder-workspaces/folder-workspace-catalog.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/folder-workspaces/folder-workspace-mutations.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/folder-workspaces/folder-workspace-routing.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/cache-identity.ts` | shared, renderer-mirror | `../../../../shared/github/repository-identity-key`, `../../../../shared/github/project-identity`, `../../../../shared/github/check-types`, `../../../../shared/github/pull-request-types`, `../../../../shared/github/project-request-types`, `../../../../shared/task-source-context`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/cache-model.ts` | shared | `../../../../shared/github/pull-request-types`, `../../../../shared/github/pull-request-refresh-types`, `../../../../shared/github/project-result-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/store/github/check-actions.ts` | shared, renderer-mirror | `../../../../shared/github/check-types`, `../../runtime/runtime-rpc-client`, `@/runtime/github-check-details-timeout` |
| `src/renderer/src/store/github/comment-fetch-actions.ts` | shared, renderer-mirror | `../../../../shared/github/comment-types`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/comment-mutation-actions.ts` | shared, renderer-mirror | `../../../../shared/github/comment-types`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/conversation-comment-actions.ts` | shared, renderer-mirror | `../../../../shared/github/comment-types`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/issue-actions.ts` | shared, renderer-mirror | `../../../../shared/github/pull-request-types`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/pr-check-status-cache.ts` | shared | `../../../../shared/github/pull-request-refresh-types`, `../../../../shared/github/pull-request-types` |
| `src/renderer/src/store/github/pr-comment-cache.ts` | shared | `../../../../shared/github/comment-types` |
| `src/renderer/src/store/github/pr-refresh-state.ts` | shared | `../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/store/github/pr-result-cache.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/store/github/pr-result-routing.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/store/github/project-actions.ts` | shared, renderer-mirror | `../../../../shared/github/project-types`, `../../../../shared/github/project-result-types`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/project-cache.ts` | shared | `../../../../shared/github/project-types` |
| `src/renderer/src/store/github/project-row-actions.ts` | shared, renderer-mirror | `../../../../shared/github/project-types`, `../../../../shared/github/project-result-types`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/pull-request-actions.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/store/github/pull-request-execution.ts` | shared, renderer-mirror | `../../../../shared/github/pull-request-types`, `../../../../shared/github/pull-request-refresh-types`, `../../../../shared/github/pull-request-for-branch-outcome`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/refresh-routing-actions.ts` | shared | `../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/store/github/refresh-sweep-actions.ts` | shared | `../../../../shared/github/pull-request-refresh-types` |
| `src/renderer/src/store/github/repository-routing.ts` | shared, renderer-mirror | `../../../../shared/github/pull-request-refresh-types`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/request-coordination.ts` | shared | `../../../../shared/github/check-types`, `../../../../shared/github/comment-types`, `../../../../shared/github/pull-request-types`, `../../../../shared/github/work-item-types`, `../../../../shared/github/project-result-types` |
| `src/renderer/src/store/github/review-thread-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/slice-types.ts` | shared | `../../../../shared/github/check-types`, `../../../../shared/github/comment-types`, `../../../../shared/github/pull-request-refresh-types`, `../../../../shared/github/pull-request-types`, `../../../../shared/github/work-item-types`, `../../../../shared/github/project-types`, `../../../../shared/github/project-result-types`, `../../../../shared/github/project-request-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/store/github/work-item-aggregate-actions.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/store/github/work-item-fetch-actions.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/store/github/work-item-mutation-actions.ts` | shared, renderer-mirror | `../../../../shared/github/work-item-types`, `../../../../shared/task-source-context`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/work-item-routing.ts` | shared, renderer-mirror | `../../../../shared/github/work-item-types`, `../../../../shared/task-source-context`, `../../../../shared/github/api-availability`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/github/worktree-refresh.ts` | shared | `../../../../shared/github/pull-request-refresh-types`, `../../../../shared/github/pull-request-types` |
| `src/renderer/src/store/host-catalog-fencing.ts` | renderer-mirror | `../runtime/runtime-rpc-client` |
| `src/renderer/src/store/index.ts` | renderer-mirror, src/renderer/src/store/index.ts | `@/runtime/web-runtime-session`, `renderer-mirror,[object Set]`, `src/renderer/src/store/index.ts,[object Map]` |
| `src/renderer/src/store/project-groups/nested-repository-operations.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/project-groups/project-group-catalog-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/project-groups/project-group-catalog.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/project-groups/project-group-mutations.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/project-groups/project-group-owner-stamping.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/projects/project-host-routing.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/projects/project-host-setup-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/projects/project-update.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/all-host-repo-catalog-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/owner-routing.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/repo-add-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/repo-catalog-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/repo-catalog-merge.ts` | shared, renderer-mirror | `../../../../shared/ssh-types`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/repo-ordering.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/repo-removal.ts` | renderer-mirror | `../../runtime/runtime-rpc-client`, `../../runtime/runtime-worktree-selector` |
| `src/renderer/src/store/repos/repo-state.ts` | shared | `../../../../shared/github/account-binding`, `../../../../shared/ssh-types` |
| `src/renderer/src/store/repos/repo-update.ts` | shared, renderer-mirror | `../../../../shared/github/account-binding`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/runtime-repo-catalog-actions.ts` | renderer-mirror | `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/repos/safe-auto-fork-sync.ts` | renderer-mirror | `../../runtime/runtime-git-client` |
| `src/renderer/src/store/runtime-target-host.ts` | renderer-mirror | `../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/agent-status-orchestration-context.ts` | shared | `../../../../shared/orchestration-fleet-attention` |
| `src/renderer/src/store/slices/browser-page-conversion.ts` | shared | `../../../../shared/browser-workspace-types`, `../../../../shared/browser-page-doc-location` |
| `src/renderer/src/store/slices/browser-page-records.ts` | shared | `../../../../shared/browser-workspace-types`, `../../../../shared/browser-page-doc-location`, `../../../../shared/browser-url` |
| `src/renderer/src/store/slices/browser-slice-test-harness.ts` | renderer-mirror | `../../runtime/runtime-compatibility-test-fixture`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/browser-webview-cleanup.ts` | shared, renderer-mirror | `../../../../shared/browser-workspace-types`, `../../components/browser-pane/host-guest/webview-registry`, `../../components/browser-pane/host-guest/browser-page-zoom` |
| `src/renderer/src/store/slices/browser/browser-close-actions.ts` | shared, renderer-mirror | `../../../../../shared/browser-workspace-types`, `@/components/browser-pane/host-guest/browser-page-mount-admission` |
| `src/renderer/src/store/slices/browser/browser-cookie-import-actions.ts` | shared, renderer-mirror | `../../../../../shared/browser-workspace-types`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/browser/browser-history-actions.ts` | shared | `../../../../../shared/browser-workspace-types`, `../../../../../shared/browser-url`, `../../../../../shared/browser-page-doc-location` |
| `src/renderer/src/store/slices/browser/browser-host-actions.ts` | renderer-mirror | `@/runtime/client-hosted-browser-close-intents` |
| `src/renderer/src/store/slices/browser/browser-host-state.ts` | shared | `../../../../../shared/browser-workspace-types` |
| `src/renderer/src/store/slices/browser/browser-hydration-actions.ts` | shared, renderer-mirror | `../../../../../shared/browser-workspace-types`, `@/runtime/restored-client-hosted-browser-host-attach` |
| `src/renderer/src/store/slices/browser/browser-page-annotation.ts` | shared | `../../../../../shared/browser-grab-types` |
| `src/renderer/src/store/slices/browser/browser-page-conversion-actions.ts` | shared | `../../../../../shared/browser-workspace-types` |
| `src/renderer/src/store/slices/browser/browser-page-create-actions.ts` | renderer-mirror | `@/components/browser-pane/host-guest/browser-page-mount-admission` |
| `src/renderer/src/store/slices/browser/browser-page-metadata-actions.ts` | shared | `../../../../../shared/browser-grab-types` |
| `src/renderer/src/store/slices/browser/browser-profile-import-actions.ts` | shared, renderer-mirror | `../../../../../shared/browser-workspace-types`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/browser/browser-profile-list-actions.ts` | shared, renderer-mirror | `../../../../../shared/browser-workspace-types`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/browser/browser-remote-close.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/client-hosted-browser-close-intent-replay`, `@/runtime/client-hosted-browser-close-intents`, `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/store/slices/browser/browser-slice-contract.ts` | shared, renderer-mirror | `../../../../../shared/browser-workspace-types`, `../../../../../shared/browser-grab-types`, `@/runtime/client-hosted-browser-close-intents` |
| `src/renderer/src/store/slices/browser/browser-tab-actions.ts` | renderer-mirror, src/renderer/src/store/slices/browser/browser-tab-actions.ts | `@/components/browser-pane/host-guest/browser-page-mount-admission`, `@/runtime/web-runtime-session`, `renderer-mirror,[object Set]`, `src/renderer/src/store/slices/browser/browser-tab-actions.ts,[object Map]` |
| `src/renderer/src/store/slices/diff-comment-persistence.ts` | renderer-mirror | `../../runtime/runtime-rpc-client`, `../../runtime/runtime-worktree-selector` |
| `src/renderer/src/store/slices/direct-ssh-pane-retry-ledger.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/direct-ssh-terminal-authority-ledger.ts` | shared | `../../../../shared/ssh-types`, `../../../../shared/ssh-pty-id` |
| `src/renderer/src/store/slices/direct-ssh-terminal-recovery-types.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/direct-ssh-terminal-recovery.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/direct-ssh-terminal-workspace-scope.ts` | shared | `../../../../shared/ssh-pty-id` |
| `src/renderer/src/store/slices/editor/actions/check-run-details-actions.ts` | renderer-mirror | `@/runtime/gitlab-job-trace-client` |
| `src/renderer/src/store/slices/editor/actions/close-file-action.ts` | renderer-mirror | `@/runtime/close-mirrored-editor-tab` |
| `src/renderer/src/store/slices/editor/actions/git-remote-push-pull.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/store/slices/editor/actions/git-remote-status.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/store/slices/editor/actions/git-remote-sync.ts` | renderer-mirror | `@/runtime/runtime-git-client` |
| `src/renderer/src/store/slices/editor/actions/markdown-link-action.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-file-client` |
| `src/renderer/src/store/slices/editor/actions/recently-closed-editor-tabs.ts` | renderer-mirror | `@/runtime/close-mirrored-editor-tab` |
| `src/renderer/src/store/slices/editor/tabs/untitled-file-cleanup.ts` | renderer-mirror | `@/runtime/runtime-file-client` |
| `src/renderer/src/store/slices/github-checks.ts` | shared | `../../../../shared/github/check-types`, `../../../../shared/github/pull-request-types`, `../../../../shared/github/repository-identity-key` |
| `src/renderer/src/store/slices/github-slice-test-harness.ts` | shared, renderer-mirror | `../../../../shared/github/pull-request-types`, `../../../../shared/task-source-context`, `../../../../shared/github/pull-request-refresh-types`, `../../runtime/runtime-compatibility-test-fixture`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/github-work-items-query-bounds.ts` | shared | `../../../../shared/github/work-items-query-bounds` |
| `src/renderer/src/store/slices/hosted-review.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/jira-collection-read-actions.ts` | renderer-mirror, shared | `@/runtime/runtime-jira-client`, `../../../../shared/jira-types` |
| `src/renderer/src/store/slices/jira-connection-actions.ts` | renderer-mirror | `@/runtime/runtime-jira-client` |
| `src/renderer/src/store/slices/jira-issue-patch-action.ts` | shared | `../../../../shared/task-source-context` |
| `src/renderer/src/store/slices/jira-issue-read-actions.ts` | renderer-mirror, shared | `@/runtime/runtime-jira-client`, `../../../../shared/jira-types` |
| `src/renderer/src/store/slices/jira-read-coordination.ts` | shared | `../../../../shared/jira-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/store/slices/jira-slice-contract.ts` | shared | `../../../../shared/jira-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/store/slices/linear-slice-test-harness.ts` | shared | `../../../../shared/linear/issue-types`, `../../../../shared/linear/project-types` |
| `src/renderer/src/store/slices/linear/linear-cache.ts` | shared | `../../../../../shared/linear/issue-types`, `../../../../../shared/linear/workspace-types`, `../../../../../shared/linear/issue-attribute-filter` |
| `src/renderer/src/store/slices/linear/linear-custom-view-detail-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/project-types`, `@/runtime/runtime-linear-project-client` |
| `src/renderer/src/store/slices/linear/linear-custom-view-issue-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/issue-types`, `../../../../../shared/linear/issue-read-limits`, `@/runtime/runtime-linear-project-client` |
| `src/renderer/src/store/slices/linear/linear-custom-view-list-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/project-types`, `@/runtime/runtime-linear-project-client` |
| `src/renderer/src/store/slices/linear/linear-custom-view-project-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/project-types`, `@/runtime/runtime-linear-project-client` |
| `src/renderer/src/store/slices/linear/linear-invalidation-actions.ts` | shared | `../../../../../shared/linear/issue-types`, `../../../../../shared/task-source-context` |
| `src/renderer/src/store/slices/linear/linear-issue-cache-actions.ts` | shared | `../../../../../shared/linear/issue-read-limits` |
| `src/renderer/src/store/slices/linear/linear-issue-detail-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/issue-types`, `@/runtime/runtime-linear-issue-mutations` |
| `src/renderer/src/store/slices/linear/linear-issue-list-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/issue-types`, `../../../../../shared/linear/workspace-types`, `../../../../../shared/linear/issue-read-limits`, `@/runtime/runtime-linear-client` |
| `src/renderer/src/store/slices/linear/linear-project-detail-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/project-types`, `@/runtime/runtime-linear-project-client` |
| `src/renderer/src/store/slices/linear/linear-project-issue-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/issue-types`, `../../../../../shared/linear/issue-read-limits`, `@/runtime/runtime-linear-project-client` |
| `src/renderer/src/store/slices/linear/linear-project-list-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/project-types`, `@/runtime/runtime-linear-project-client` |
| `src/renderer/src/store/slices/linear/linear-slice-connection-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/workspace-types`, `@/runtime/runtime-linear-client` |
| `src/renderer/src/store/slices/linear/linear-slice-contract.ts` | shared | `../../../../../shared/linear/issue-types`, `../../../../../shared/linear/project-types`, `../../../../../shared/linear/workspace-types`, `../../../../../shared/task-source-context`, `../../../../../shared/linear/issue-attribute-filter` |
| `src/renderer/src/store/slices/linear/linear-slice-request-state.ts` | shared | `../../../../../shared/linear/issue-types`, `../../../../../shared/linear/project-types`, `../../../../../shared/linear/workspace-types` |
| `src/renderer/src/store/slices/linear/linear-slice-scope.ts` | shared | `../../../../../shared/task-source-context`, `../../../../../shared/linear/issue-attribute-filter` |
| `src/renderer/src/store/slices/linear/linear-slice-status-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/workspace-types`, `@/runtime/runtime-linear-client` |
| `src/renderer/src/store/slices/linear/linear-team-actions.ts` | shared, renderer-mirror | `../../../../../shared/linear/workspace-types`, `@/runtime/runtime-linear-project-client` |
| `src/renderer/src/store/slices/new-issue-draft.ts` | shared | `../../../../shared/github/pull-request-types` |
| `src/renderer/src/store/slices/orca-profiles-auth-actions.ts` | shared | `../../../../shared/orca-profiles` |
| `src/renderer/src/store/slices/orca-profiles.ts` | shared | `../../../../shared/orca-profiles` |
| `src/renderer/src/store/slices/preflight.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/readopted-ssh-worktree-rows.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/remote-server-updates.ts` | shared, renderer-mirror | `../../../../shared/remote-server-update`, `@/runtime/runtime-rpc-client`, `@/runtime/remote-server-update-coordinator`, `@/runtime/remote-server-update-batch` |
| `src/renderer/src/store/slices/repos-runtime-routing-fixture.ts` | renderer-mirror | `../../runtime/runtime-compatibility-test-fixture`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/runtime-detected-agents.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/runtime-environment-ssh-selectors.ts` | shared, renderer-mirror | `../../../../shared/ssh-types`, `@/runtime/runtime-host-connection-state` |
| `src/renderer/src/store/slices/runtime-environment-ssh.ts` | shared | `../../../../shared/ssh-types`, `../../../../shared/ssh-target-generation` |
| `src/renderer/src/store/slices/runtime-status-refresh.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-environment-revision`, `@/runtime/runtime-status-probe-diagnostics` |
| `src/renderer/src/store/slices/runtime-status-snapshot.ts` | renderer-mirror | `@/runtime/restored-client-hosted-browser-host-attach`, `@/runtime/client-hosted-browser-close-intent-replay` |
| `src/renderer/src/store/slices/runtime-status.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-environment-revision`, `@/runtime/client-hosted-browser-close-intent-replay`, `@/runtime/restored-client-hosted-browser-host-attach` |
| `src/renderer/src/store/slices/settings.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-protocol-compat`, `../../../../shared/task-providers`, `../../../../shared/mobile-pairing-custom-address` |
| `src/renderer/src/store/slices/ssh-target-cleanup.ts` | shared | `../../../../shared/ssh-types`, `../../../../shared/ssh-pty-id`, `../../../../shared/ssh-target-generation` |
| `src/renderer/src/store/slices/ssh.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/store-cascades-test-harness.ts` | renderer-mirror | `../../runtime/runtime-compatibility-test-fixture` |
| `src/renderer/src/store/slices/store-session-test-harness.ts` | shared | `../../../../shared/browser-workspace-types` |
| `src/renderer/src/store/slices/superseded-ssh-repo-rows.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/tabs/tabs-close-actions.ts` | renderer-mirror, shared | `@/runtime/runtime-rpc-client`, `@/runtime/structured-agent-session-tab-retirement`, `@/runtime/web-session-focus-intent`, `@/runtime/local-structured-session-owner`, `../../../../../shared/structured-agent-session-projection` |
| `src/renderer/src/store/slices/tabs/tabs-host-mirroring.ts` | src/renderer/src/store/slices/tabs/tabs-host-mirroring.ts | `src/renderer/src/store/slices/tabs/tabs-host-mirroring.ts,[object Map]` |
| `src/renderer/src/store/slices/tabs/tabs-label-actions.ts` | renderer-mirror | `@/lib/native-chat-telemetry` |
| `src/renderer/src/store/slices/terminal-quick-command-hosts.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/terminal-tab-retirement.ts` | renderer-mirror | `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/store/slices/ui/ui-slice-agent-actions.ts` | src/renderer/src/store/slices/ui/ui-slice-agent-actions.ts | `src/renderer/src/store/slices/ui/ui-slice-agent-actions.ts,[object Map]` |
| `src/renderer/src/store/slices/ui/ui-slice-contextual-tour-progression.ts` | renderer-mirror | `../../../components/contextual-tours/contextual-tour-gate` |
| `src/renderer/src/store/slices/ui/ui-slice-contract-contextual.ts` | shared | `../../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/store/slices/ui/ui-slice-contract-core.ts` | shared | `../../../../../shared/github/work-item-types`, `../../../../../shared/gitlab-types`, `../../../../../shared/jira-types`, `../../../../../shared/linear/issue-types`, `../../../../../shared/task-providers`, `../../../../../shared/telemetry-events`, `../../../../../shared/task-source-context` |
| `src/renderer/src/store/slices/ui/ui-slice-hydration-actions.ts` | shared | `../../../../../shared/browser-page-zoom`, `../../../../../shared/browser-url` |
| `src/renderer/src/store/slices/ui/ui-slice-hydration-sanitizers.ts` | shared | `../../../../../shared/orca-yaml-hook-types` |
| `src/renderer/src/store/slices/ui/ui-slice-task-actions.ts` | shared | `../../../../../shared/task-providers` |
| `src/renderer/src/store/slices/ui/ui-slice-tour-actions.ts` | renderer-mirror | `../../../components/contextual-tours/contextual-tour-gate` |
| `src/renderer/src/store/slices/ui/ui-slice-update-actions.ts` | shared | `../../../../../shared/browser-page-zoom`, `../../../../../shared/browser-url` |
| `src/renderer/src/store/slices/worktree-helpers.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/worktree-nav-history.ts` | shared | `../../../../shared/github/work-item-types`, `../../../../shared/jira-types`, `../../../../shared/linear/issue-types`, `../../../../shared/gitlab-types`, `../../../../shared/task-source-context` |
| `src/renderer/src/store/slices/worktree-visibility-owner-settings.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktree-visibility-settings-write.ts` | renderer-mirror | `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees-detected-listing-fixtures.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/worktrees-slice-test-harness.ts` | renderer-mirror | `../../runtime/runtime-compatibility-test-fixture`, `../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/create/create-worktree.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/create/prefetch-worktree-create-base.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/create/worktree-create-payload.ts` | shared | `../../../../../../shared/task-source-context` |
| `src/renderer/src/store/slices/worktrees/listing/detected-worktree-provider-request.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/listing/detected-worktree-refresh.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/listing/direct-ssh-authority.ts` | shared | `../../../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/worktrees/listing/known-ssh-worktree-fetch.ts` | shared | `../../../../../../shared/ssh-types` |
| `src/renderer/src/store/slices/worktrees/listing/runtime-scope-forbidden-toast.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/listing/runtime-worktree-rpc-errors.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/listing/worktree-slice-types.ts` | shared, renderer-mirror | `../../../../../../shared/ssh-types`, `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/metadata/hosted-review-push-target.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/metadata/worktree-lineage-refresh.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client`, `../../../../runtime/runtime-worktree-selector` |
| `src/renderer/src/store/slices/worktrees/metadata/worktree-meta-persist.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client`, `../../../../runtime/runtime-worktree-selector` |
| `src/renderer/src/store/slices/worktrees/session/worktree-identity-rename-state.ts` | shared | `../../../../../../shared/browser-workspace-types`, `../../../../../../shared/browser-page-doc-location` |
| `src/renderer/src/store/slices/worktrees/teardown/dispatch-worktree-removal.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client`, `../../../../runtime/runtime-worktree-selector` |
| `src/renderer/src/store/slices/worktrees/teardown/force-delete-preserved-branch.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client`, `../../../../runtime/runtime-worktree-selector` |
| `src/renderer/src/store/slices/worktrees/teardown/host-qualified-worktree-removal.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/teardown/missing-worktree-terminal-teardown.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/teardown/preserved-branch-cleanup-target.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/teardown/remove-worktree.ts` | renderer-mirror | `../../../../runtime/runtime-rpc-client` |
| `src/renderer/src/store/slices/worktrees/teardown/worktree-purge-state.ts` | renderer-mirror | `@/components/native-chat/structured-agent-session-outbox-storage`, `@/runtime/web-session-focus-intent`, `@/runtime/local-structured-session-owner` |
| `src/renderer/src/store/terminals/terminal-actions.ts` | shared | `../../../../shared/ssh-types`, `../../../../shared/native-chat-session-options` |
| `src/renderer/src/store/terminals/terminal-active-workspace-creation.ts` | src/renderer/src/store/terminals/terminal-active-workspace-creation.ts | `src/renderer/src/store/terminals/terminal-active-workspace-creation.ts,[object Map]` |
| `src/renderer/src/store/terminals/terminal-contracts.ts` | shared | `../../../../shared/ssh-types` |
| `src/renderer/src/store/terminals/terminal-pane-hibernation.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-worktree-selector` |
| `src/renderer/src/store/terminals/terminal-pty-bindings.ts` | shared, renderer-mirror | `../../../../shared/ssh-pty-id`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/store/terminals/terminal-pty-identities.ts` | shared, renderer-mirror | `../../../../shared/ssh-types`, `@/runtime/runtime-terminal-stream` |
| `src/renderer/src/store/terminals/terminal-pty-release.ts` | shared | `../../../../shared/ssh-pty-id` |
| `src/renderer/src/store/terminals/terminal-shutdown.ts` | renderer-mirror | `@/runtime/runtime-rpc-client`, `@/runtime/runtime-worktree-selector`, `@/runtime/remote-worktree-sleep` |
| `src/renderer/src/store/terminals/terminal-state.ts` | shared | `../../../../shared/native-chat-session-options` |
| `src/renderer/src/store/terminals/terminal-tab-attention.ts` | renderer-mirror, src/renderer/src/store/terminals/terminal-tab-attention.ts | `@/runtime/sync-runtime-graph`, `@/runtime/web-runtime-session`, `renderer-mirror,[object Set]`, `src/renderer/src/store/terminals/terminal-tab-attention.ts,[object Map]` |
| `src/renderer/src/store/terminals/terminal-tab-close-providers.ts` | renderer-mirror | `@/runtime/runtime-environment-revision`, `@/runtime/runtime-rpc-client` |
| `src/renderer/src/store/terminals/terminal-tab-presentation.ts` | renderer-mirror | `@/runtime/sync-runtime-graph` |
| `src/renderer/src/store/terminals/workspace-terminal-hydration-patch.ts` | shared | `../../../../shared/ssh-pty-id` |
| `src/renderer/src/store/terminals/workspace-terminal-reconnect.ts` | shared | `../../../../shared/ssh-pty-id` |
| `src/shared/agent-kind.ts` | shared | `./telemetry-events` |
| `src/shared/agent-session-conversation-outline.ts` | shared | `./native-chat-types`, `./native-chat-row-content`, `./structured-agent-session-message-projection`, `./native-chat-transcript-projection` |
| `src/shared/agent-session-journal-types.ts` | shared | `./native-chat-tool-identity`, `./native-chat-types` |
| `src/shared/agent-session-option-catalog-types.ts` | shared | `./native-chat-session-options` |
| `src/shared/agent-session-option-catalog.ts` | shared | `./native-chat-session-options` |
| `src/shared/agent-session-option-launch.ts` | shared | `./native-chat-session-options` |
| `src/shared/agent-session-wire.ts` | shared | `./structured-agent-session-projection` |
| `src/shared/agent-skill-sharing-contract.ts` | shared | `./skill-cloud-contract` |
| `src/shared/agent-startup-plan-inputs.ts` | shared | `./native-chat-session-options` |
| `src/shared/agent-status-field-normalization.ts` | shared | `./orca-dispatch-status-prompt` |
| `src/shared/agent-status-types.ts` | shared | `./orchestration-fleet-attention` |
| `src/shared/automation-list-scope.ts` | shared | `./ssh-target-generation` |
| `src/shared/automation-owner-precondition.ts` | shared | `./ssh-target-generation` |
| `src/shared/automation-workspace-repin.ts` | shared | `./ssh-target-generation` |
| `src/shared/automations-types.ts` | shared | `./task-source-context` |
| `src/shared/bundled-ripgrep.ts` | shared | `./relay-artifacts` |
| `src/shared/constants.ts` | shared | `./orca-yaml-hook-types`, `./browser-page-zoom` |
| `src/shared/default-global-settings.ts` | shared | `./task-providers` |
| `src/shared/detected-worktree-provider-contract.ts` | shared | `./ssh-types` |
| `src/shared/execution-host-registry.ts` | shared | `./ssh-types` |
| `src/shared/folder-workspace-types.ts` | shared | `./task-source-context` |
| `src/shared/folder-workspaces.ts` | shared | `./task-source-context` |
| `src/shared/git-diff-transport-budget.ts` | shared | `./remote-rpc-content-budget` |
| `src/shared/global-settings-types.ts` | shared | `./github/project-types`, `./gitlab-types`, `./task-providers`, `./native-chat-session-options` |
| `src/shared/hook-command-source-policy.ts` | shared | `./orca-yaml-hook-types` |
| `src/shared/host-lineage-contract.ts` | shared | `./ssh-types` |
| `src/shared/host-repo-catalog-contract.ts` | shared | `./ssh-types` |
| `src/shared/hosted-review-github.ts` | shared | `./github/pull-request-types` |
| `src/shared/hosted-review.ts` | shared | `./github/pull-request-types` |
| `src/shared/issue-link-input.ts` | shared | `./github/links`, `./linear/links` |
| `src/shared/network/manual-address.ts` | shared | `../mobile-pairing-protocol-limits` |
| `src/shared/network/pairing-url.ts` | shared | `../mobile-pairing-protocol-limits` |
| `src/shared/new-workspace/github-links.ts` | shared | `../github/links` |
| `src/shared/new-workspace/smart-workspace-linear-intent.ts` | shared | `../linear/issue-types`, `../linear/links` |
| `src/shared/new-workspace/smart-workspace-source-results.ts` | shared | `../github/work-item-types`, `../gitlab-types`, `../jira-types`, `../linear/issue-types`, `../linear/workspace-types`, `../jira-issue-url`, `../github/links` |
| `src/shared/new-workspace/smart-workspace-url-source-results.ts` | shared | `../github/links`, `../github/repository-identity-key`, `../github/work-item-types`, `../gitlab-types`, `../linear/issue-types` |
| `src/shared/new-workspace/work-item-lookup-text.ts` | shared | `../jira-issue-url` |
| `src/shared/new-workspace/workspace-source.ts` | shared | `../linear/links`, `../jira-types`, `../linear/issue-types` |
| `src/shared/pairing.ts` | shared | `./mobile-relay-pairing-offer`, `./mobile-pairing-protocol-limits` |
| `src/shared/persisted-state-types.ts` | shared | `./ssh-types`, `./github/pull-request-types` |
| `src/shared/persisted-ui-state-types.ts` | shared | `./orca-yaml-hook-types` |
| `src/shared/pr-check-severity-order.ts` | shared | `./github/check-types` |
| `src/shared/pr-check-status.ts` | shared | `./github/check-types`, `./github/pull-request-types` |
| `src/shared/pr-checks-fix-prompt.ts` | shared | `./github/check-types` |
| `src/shared/pr-comment-audience.ts` | shared | `./github/comment-types` |
| `src/shared/pr-comment-groups.ts` | shared | `./github/comment-types` |
| `src/shared/project-host-setup-projection.ts` | shared | `./github/repository-identity-key` |
| `src/shared/project-types.ts` | shared | `./orca-yaml-hook-types` |
| `src/shared/protocol-version.ts` | shared | `./remote-server-update`, `./skill-install-capability` |
| `src/shared/provider-check-summary.ts` | shared | `./github/pull-request-types` |
| `src/shared/repo-types.ts` | shared | `./github/account-binding`, `./github/pull-request-types`, `./orca-yaml-hook-types` |
| `src/shared/rpc-contract/agent-launch-params.ts` | shared | `../structured-agent-session-create` |
| `src/shared/rpc-contract/artifacts-params.ts` | shared | `../artifacts` |
| `src/shared/rpc-contract/browser-tab-create-params.ts` | shared | `../browser-client-host-placement` |
| `src/shared/rpc-contract/client-settings-params.ts` | shared | `../task-providers` |
| `src/shared/rpc-contract/computer-schemas-params.ts` | shared | `../computer-use-key-spec` |
| `src/shared/rpc-contract/folder-workspace-params.ts` | shared | `../task-source-context-schema` |
| `src/shared/rpc-contract/github-pull-request-params.ts` | shared | `../github/pull-request-refresh-types` |
| `src/shared/rpc-contract/linear-issue-attribute-filter-params.ts` | shared | `../linear/issue-attribute-filter` |
| `src/shared/rpc-contract/native-chat-params.ts` | shared | `../native-chat-types` |
| `src/shared/rpc-contract/notifications-params.ts` | shared | `../mobile-push-contract` |
| `src/shared/rpc-contract/orchestration-federation-control-params.ts` | shared | `../orchestration-worker-output` |
| `src/shared/rpc-contract/orchestration-runs-params.ts` | shared | `../orchestration-run-pagination` |
| `src/shared/rpc-contract/orchestration-worker-control-params.ts` | shared | `../orchestration-worker-output` |
| `src/shared/rpc-contract/orchestration-worker-release-schemas-params.ts` | shared | `../orchestration-fleet-projection` |
| `src/shared/rpc-contract/repo-update-params.ts` | shared | `../github/account-binding` |
| `src/shared/rpc-contract/rpc-params-catalog.generated.ts` | shared | `../browser-client-file-channel-protocol`, `../browser-client-host-protocol`, `../browser-client-page-metadata-protocol`, `../mobile-relay-credential-contract`, `../mobile-web-bundle/bundle-rpc-contract`, `../skill-bundle-install-contract`, `../skill-delete-contract`, `../skill-install-contract`, `../skill-upload-session-contract` |
| `src/shared/rpc-contract/worktree-create-params.ts` | shared | `../task-source-context-schema`, `../telemetry-events` |
| `src/shared/rpc-contract/worktree-params.ts` | shared | `../task-source-context-schema` |
| `src/shared/runtime-browser-contracts.ts` | shared | `./browser-workspace-types` |
| `src/shared/runtime-client-events.ts` | shared | `./ssh-types` |
| `src/shared/runtime-environment-store.ts` | shared | `./remote-pairing-address` |
| `src/shared/runtime-host-status.ts` | shared | `./remote-runtime-shared-control-types` |
| `src/shared/runtime-mobile-session-tab-contracts.ts` | shared | `./browser-workspace-types` |
| `src/shared/runtime-rpc-call-queue.ts` | shared | `./remote-runtime-memory-limits` |
| `src/shared/runtime-rpc-envelope.ts` | shared | `./orchestration-compatibility-evidence` |
| `src/shared/runtime-session-contracts.ts` | shared | `./remote-server-update`, `./remote-runtime-shared-control-types` |
| `src/shared/runtime-types.ts` | shared | `./computer-use-runtime-types`, `./mobile-markdown-document` |
| `src/shared/runtime-upload-staging-contract.ts` | shared | `./ssh-types` |
| `src/shared/setup-agent-startup-policy.ts` | shared | `./orca-yaml-hook-types` |
| `src/shared/setup-script-telemetry.ts` | shared | `./telemetry-events` |
| `src/shared/source-control-primary-action-decision-types.ts` | shared | `./github/pull-request-types` |
| `src/shared/structured-agent-turn-clock-anchor.ts` | shared | `./structured-agent-session-reducer`, `./structured-agent-session-turn-timing` |
| `src/shared/terminal-execution-host.ts` | shared | `./remote-runtime-pty-id`, `./ssh-pty-id` |
| `src/shared/terminal-github-pr-link-detector.ts` | shared | `./github/links` |
| `src/shared/tui-agent-config.ts` | shared | `./orca-cli-command-name` |
| `src/shared/tui-agent-launch-command.ts` | shared | `./native-chat-session-options` |
| `src/shared/tui-agent-resume-startup.ts` | shared | `./native-chat-session-options` |
| `src/shared/tui-agent-startup.ts` | shared | `./native-chat-session-options` |
| `src/shared/ui-chrome-types.ts` | shared | `./linear/workspace-types`, `./linear/project-types` |
| `src/shared/worker-transcript-text.ts` | shared | `./native-chat-background-task-row`, `./native-chat-subagent-summary`, `./native-chat-types` |
| `src/shared/workspace-doc-history.ts` | shared | `./browser-workspace-types` |
| `src/shared/workspace-linked-item-source-context.ts` | shared | `./jira-issue-url`, `./task-source-context` |
| `src/shared/workspace-session-browser-history.ts` | shared | `./browser-workspace-types`, `./browser-url` |
| `src/shared/workspace-session-browser-schema.ts` | shared | `./browser-workspace-types` |
| `src/shared/workspace-session-state-types.ts` | shared | `./browser-workspace-types` |
| `src/shared/worktree/create-types.ts` | shared | `../task-source-context` |
| `src/shared/worktree/launch-types.ts` | shared | `../telemetry-events`, `../orca-yaml-hook-types` |
| `src/shared/worktree/meta-types.ts` | shared | `../task-source-context`, `../orca-yaml-hook-types` |
| `src/shared/worktree/types.ts` | shared | `../task-source-context`, `../orca-yaml-hook-types` |
