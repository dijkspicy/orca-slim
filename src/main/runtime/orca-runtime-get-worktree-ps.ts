// @ts-nocheck -- mechanically split from OrcaRuntimeService; behavior is covered by AST equivalence and characterization tests.
import { collectRuntimeWorktreeAgentSources } from './runtime-worktree-agent-sources'
import { OrcaRuntimeWithStartTuiIdleVisibleReadProbe } from './orca-runtime-start-tui-idle-visible-read-probe'
import { DEFAULT_WORKTREE_PS_LIMIT } from './orca-runtime-postlude'
import type { RuntimeWorktreePsResult } from '../../shared/runtime-types'
import { buildRuntimeWorktreePsSummaries } from './runtime-worktree-ps-summaries'
import { buildRuntimeWorktreeSummaryPathIndex } from './runtime-worktree-summary-paths'
import {
  applyRuntimeWorktreePsSessionActivity,
  applyRuntimeWorktreePsTerminalActivity
} from './runtime-worktree-ps-activity'
import { attachRuntimeWorktreeAgentRows } from './runtime-worktree-agent-rows'
import { compareWorktreePs } from './runtime-worktree-status-projection'
import type { Repo } from '../../shared/repo-types'
import { enrichMissingRepoGitRemoteIdentities } from '../repo-git-remote-identity-enrichment'
import { buildWorktreeListingPage } from './worktree-listing-host-scope'

export class OrcaRuntimeWithGetWorktreePs extends OrcaRuntimeWithStartTuiIdleVisibleReadProbe {
  async getWorktreePs(
    limit = DEFAULT_WORKTREE_PS_LIMIT,
    sourceDefaultsSupported = true
  ): Promise<RuntimeWorktreePsResult> {
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error('invalid_limit')
    }
    const resolvedWorktreeSnapshot = await this.listResolvedWorktreeSnapshot()
    const visibilitySettings = this.store?.getSettings()
    const visibilitySourceMatchersByRepoId = this.buildRuntimeVisibilitySourceMatchersByRepoId(
      resolvedWorktreeSnapshot.worktrees,
      sourceDefaultsSupported,
      visibilitySettings
    )
    const resolvedWorktrees = resolvedWorktreeSnapshot.worktrees.filter((worktree) =>
      this.isRuntimeWorktreeVisible(
        worktree,
        visibilitySourceMatchersByRepoId.get(worktree.repoId),
        sourceDefaultsSupported,
        visibilitySettings
      )
    )
    // Why: worktree.ps backs the mobile sidebar, so it must use the same
    // host-owned imported-worktree visibility gate as worktree.list/desktop.
    const freshPtyLiveness = await this.refreshPtyWorktreeRecordsFromController(resolvedWorktrees)
    const repoById = new Map((this.store?.getRepos() ?? []).map((repo) => [repo.id, repo]))
    const platformByRepoId = resolvedWorktreeSnapshot.platformByRepoId
    const summaries = buildRuntimeWorktreePsSummaries({
      store: this.store,
      resolvedWorktrees,
      platformByRepoId
    })

    const runtimeWorktreeSummaryPathIndex = buildRuntimeWorktreeSummaryPathIndex(
      summaries,
      resolvedWorktrees,
      platformByRepoId
    )
    const missingRuntimeWorktreeIds = new Set<string>()
    const session = this.store?.getWorkspaceSession?.()
    const workingTerminalEvidenceByWorktreeId = applyRuntimeWorktreePsTerminalActivity({
      summaries,
      pathIndex: runtimeWorktreeSummaryPathIndex,
      missingIds: missingRuntimeWorktreeIds,
      freshPtyLiveness,
      leaves: this.leaves.values(),
      ptysById: this.ptysById,
      tabs: this.tabs,
      session,
      getPaneKey: (leaf) => this.makeRuntimePaneKey(leaf),
      getSummary: (summaryMap, pathIndex, missingIds, worktreeId) =>
        this.getSummaryForRuntimeWorktreeId(summaryMap, pathIndex, missingIds, worktreeId)
    })
    const { mirroredWorktreeIdByTabId, connectedPtyEvidence } =
      applyRuntimeWorktreePsSessionActivity({
        store: this.store,
        summaries,
        repoById,
        pathIndex: runtimeWorktreeSummaryPathIndex,
        missingIds: missingRuntimeWorktreeIds,
        ptysById: this.ptysById,
        tabs: this.tabs,
        getTerminalHandlesForPty: (ptyId) => this.getExistingTerminalHandlesForPtyId(ptyId),
        getSummary: (summaryMap, pathIndex, missingIds, worktreeId) =>
          this.getSummaryForRuntimeWorktreeId(summaryMap, pathIndex, missingIds, worktreeId)
      })
    attachRuntimeWorktreeAgentRows({
      summaries,
      pathIndex: runtimeWorktreeSummaryPathIndex,
      missingWorktreeIds: missingRuntimeWorktreeIds,
      workingTerminalEvidenceByWorktreeId,
      rowSources: collectRuntimeWorktreeAgentSources({
        mirroredWorktreeIdByTabId,
        connectedPtyEvidence,
        // Structured sessions are in here too: the host publishes them into the same store.
        hookSnapshots: this.getAgentStatusSnapshotFn?.() ?? []
      }),
      orchestrationByPaneKey: this.agentOrchestrationProjection.buildByPaneKey(),
      getSummary: (summaryMap, pathIndex, missingIds, worktreeId) =>
        this.getSummaryForRuntimeWorktreeId(summaryMap, pathIndex, missingIds, worktreeId)
    })

    const sorted = [...summaries.values()].sort(compareWorktreePs)
    // Why: the same cap starvation as worktree.list — a host whose rows all sort last gets no
    // page at all, which is indistinguishable from it having no workspaces (#18104).
    return buildWorktreeListingPage(sorted, limit, this.listKnownExecutionHostIds())
  }

  listRepos(): Repo[] {
    return this.store?.getRepos() ?? []
  }

  enrichMissingRepoGitRemoteIdentities(): void {
    if (!this.store) {
      return
    }
    enrichMissingRepoGitRemoteIdentities(this.store, {
      onChanged: () => {
        this.invalidateResolvedWorktreeCache()
        this.notifyReposChanged()
      }
    })
  }
}
