import TerminalPane from './terminal-pane/TerminalPane'
import { shouldMountBackgroundWorktreeTab } from './terminal/background-terminal-worktree-mount'
import type { TerminalController } from './use-terminal-controller'

export function TerminalLegacyTerminalPanes({
  controller
}: {
  controller: TerminalController
}): React.JSX.Element {
  const {
    activeTabId,
    activeTabType,
    activeView,
    backgroundMountTabIdsByWorktreeRef,
    effectiveParkedTerminalWorktreeIds,
    evictionExemptTerminalTabIds,
    handleCloseTab,
    handlePtyExit,
    measurableBackgroundWorktreeIdsRef,
    mountedWorktreeIdsRef,
    renderedActiveWorktreeId,
    tabsByWorktree,
    worktreeBrowserTabs,
    worktreeFiles,
    workspaceSurfaces
  } = controller
  return (
    <div
      className={`relative flex-1 min-h-0 overflow-hidden ${
        (activeTabType === 'editor' && worktreeFiles.length > 0) ||
        (activeTabType === 'browser' && worktreeBrowserTabs.length > 0) ||
        activeTabType === 'simulator'
          ? 'hidden'
          : ''
      }`}
    >
      {workspaceSurfaces
        .filter((workspace) => mountedWorktreeIdsRef.current.has(workspace.id))
        .map((workspace) => {
          const isVisible = activeView === 'terminal' && workspace.id === renderedActiveWorktreeId
          const shouldMeasureHiddenWorktree =
            !isVisible && measurableBackgroundWorktreeIdsRef.current.has(workspace.id)
          const shouldColdParkTerminalPanes =
            !isVisible &&
            !shouldMeasureHiddenWorktree &&
            effectiveParkedTerminalWorktreeIds.has(workspace.id)
          return (
            <div
              key={workspace.id}
              className={
                isVisible
                  ? 'absolute inset-0'
                  : shouldMeasureHiddenWorktree
                    ? 'absolute inset-0 opacity-0 pointer-events-none'
                    : 'absolute inset-0 hidden'
              }
              aria-hidden={!isVisible}
            >
              {(tabsByWorktree[workspace.id] ?? [])
                .filter((tab) =>
                  shouldMountBackgroundWorktreeTab(
                    backgroundMountTabIdsByWorktreeRef.current.get(workspace.id) ?? null,
                    tab.id
                  )
                )
                .map((tab) => {
                  const isActiveTerminalTab =
                    isVisible && tab.id === activeTabId && activeTabType === 'terminal'
                  if (shouldColdParkTerminalPanes && !evictionExemptTerminalTabIds.has(tab.id)) {
                    return null
                  }
                  return (
                    <TerminalPane
                      key={`${tab.id}-${tab.generation ?? 0}`}
                      tabId={tab.id}
                      worktreeId={workspace.id}
                      cwd={tab.startupCwd ?? workspace.path}
                      isActive={isActiveTerminalTab}
                      isVisible={isActiveTerminalTab}
                      isWorktreeActive={isVisible}
                      onPtyExit={(ptyId, exitCode) => handlePtyExit(tab.id, ptyId, exitCode)}
                      onCloseTab={() => handleCloseTab(tab.id)}
                    />
                  )
                })}
            </div>
          )
        })}
    </div>
  )
}
