import { useCallback } from 'react'
import { TOGGLE_TERMINAL_PANE_EXPAND_EVENT } from '@/constants/terminal'
import type { TerminalBulkCloseController } from './use-terminal-bulk-close-actions'

export function useTerminalActivationActions(controller: TerminalBulkCloseController) {
  const { activeWorktreeId, setActiveBrowserTab, setActiveTab, setActiveTabType } = controller
  const handleActivateTab = useCallback(
    (tabId: string) => {
      setActiveTab(tabId)
      setActiveTabType('terminal', activeWorktreeId)
    },
    [activeWorktreeId, setActiveTab, setActiveTabType]
  )

  const handleTogglePaneExpand = useCallback(
    (tabId: string) => {
      setActiveTab(tabId)
      requestAnimationFrame(() => {
        window.dispatchEvent(
          new CustomEvent(TOGGLE_TERMINAL_PANE_EXPAND_EVENT, { detail: { tabId } })
        )
      })
    },
    [setActiveTab]
  )

  const handleActivateBrowserTab = useCallback(
    (tabId: string) => {
      setActiveBrowserTab(tabId)
      setActiveTabType('browser', activeWorktreeId)
    },
    [activeWorktreeId, setActiveBrowserTab, setActiveTabType]
  )

  return { handleActivateTab, handleTogglePaneExpand, handleActivateBrowserTab }
}

export type TerminalActivationController = TerminalBulkCloseController &
  ReturnType<typeof useTerminalActivationActions>
