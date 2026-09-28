import type { ILink } from '@xterm/xterm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createTerminalHandleLinkProvider,
  extractOrchestrationTaskLinks,
  extractTerminalHandleLinks,
  focusRendererTerminalHandle
} from './terminal-handle-links'
import type { TerminalLinkActionContext } from './terminal-link-action-request'

const mocks = vi.hoisted(() => ({
  activateTabAndFocusPane: vi.fn(),
  focusTerminalTabSurface: vi.fn(),
  storeState: {
    tabsByWorktree: {},
    ptyIdsByTabId: {},
    terminalLayoutsByTabId: {},
    agentStatusByPaneKey: {},
    retainedAgentsByPaneKey: {},
    runtimeAgentOrchestrationByPaneKey: {},
    setActiveWorktree: vi.fn(),
    markWorktreeVisited: vi.fn(),
    setActiveView: vi.fn(),
    setActiveTabType: vi.fn(),
    revealWorktreeInSidebar: vi.fn(),
    setActiveTab: vi.fn()
  }
}))

vi.mock('@/store', () => ({
  useAppStore: {
    getState: () => mocks.storeState
  }
}))

vi.mock('@/lib/activate-tab-and-focus-pane', () => ({
  activateTabAndFocusPane: mocks.activateTabAndFocusPane
}))

vi.mock('@/lib/focus-terminal-tab-surface', () => ({
  focusTerminalTabSurface: mocks.focusTerminalTabSurface
}))

type TestBufferLine = {
  isWrapped: boolean
  length: number
  translateToString: (
    trimRight?: boolean,
    startColumn?: number,
    endColumn?: number,
    outColumns?: number[]
  ) => string
}

function makeBufferLine(text: string, options: { isWrapped?: boolean } = {}): TestBufferLine {
  return {
    isWrapped: options.isWrapped ?? false,
    length: text.length,
    translateToString: (
      _trimRight?: boolean,
      startColumn = 0,
      endColumn = text.length,
      outColumns?: number[]
    ) => {
      if (outColumns) {
        outColumns.length = 0
        for (let index = startColumn; index <= endColumn; index++) {
          outColumns.push(index)
        }
      }
      return text.slice(startColumn, endColumn)
    }
  }
}

function setPlatform(userAgent: string): void {
  vi.stubGlobal('navigator', { userAgent })
}

async function collectLinks(
  rows: TestBufferLine[],
  bufferLineNumber = 1,
  runtimeEnvironmentId: string | null = null,
  linkActionContext?: TerminalLinkActionContext
): Promise<ILink[]> {
  const terminal = {
    buffer: {
      active: {
        getLine: (y: number) => rows[y]
      }
    },
    clearSelection: vi.fn()
  }
  const provider = createTerminalHandleLinkProvider({
    getTerminal: () => terminal as never,
    getRuntimeEnvironmentId: () => runtimeEnvironmentId,
    linkTooltip: { textContent: '', style: { display: '' } } as unknown as HTMLElement,
    getLinkActionContext: () => linkActionContext ?? null
  })
  return await new Promise<ILink[]>((resolve) => {
    provider.provideLinks(bufferLineNumber, (links) => resolve(links ?? []))
  })
}

describe('extractTerminalHandleLinks', () => {
  it('detects UUID terminal handles from orchestration output', () => {
    const line = '- Terminal: term_d422ff9f-42c8-4d70-bb6a-71762b21ab95'

    expect(extractTerminalHandleLinks(line)).toEqual([
      {
        handle: 'term_d422ff9f-42c8-4d70-bb6a-71762b21ab95',
        startIndex: 12,
        endIndex: 53
      }
    ])
  })

  it('trims sentence punctuation without matching inside longer tokens', () => {
    expect(extractTerminalHandleLinks('Open term_worker, not xterm_worker.')).toEqual([
      { handle: 'term_worker', startIndex: 5, endIndex: 16 }
    ])
  })

  it('scans huge handle-like terminal lines without regex iteration', () => {
    const matchAll = vi.spyOn(String.prototype, 'matchAll')
    const line = `${'term_'.repeat(20_000)} Open term_worker`

    expect(extractTerminalHandleLinks(line)).toEqual([
      {
        handle: 'term_worker',
        startIndex: line.length - 'term_worker'.length,
        endIndex: line.length
      }
    ])
    expect(matchAll).not.toHaveBeenCalled()
  })

  it('ignores overlong handle tokens', () => {
    expect(extractTerminalHandleLinks(`Open term_${'a'.repeat(129)}`)).toEqual([])
  })
})

describe('extractOrchestrationTaskLinks', () => {
  it('detects task IDs from orchestration dispatch output', () => {
    const line = 'Ran orca orchestration dispatch --task task_88f323f654c0 --to term_worker'

    expect(extractOrchestrationTaskLinks(line)).toEqual([
      {
        taskId: 'task_88f323f654c0',
        startIndex: 39,
        endIndex: 56
      }
    ])
  })

  it('trims sentence punctuation without matching inside longer tokens', () => {
    expect(extractOrchestrationTaskLinks('Open task_worker, not xtask_worker.')).toEqual([
      { taskId: 'task_worker', startIndex: 5, endIndex: 16 }
    ])
  })

  it('caps orchestration task IDs by full token length', () => {
    const maxLengthTaskId = `task_${'a'.repeat(123)}`

    expect(extractOrchestrationTaskLinks(`Open ${maxLengthTaskId}`)).toEqual([
      { taskId: maxLengthTaskId, startIndex: 5, endIndex: 133 }
    ])
    expect(extractOrchestrationTaskLinks(`Open task_${'a'.repeat(124)}`)).toEqual([])
  })
})

describe('findTerminalHandleTarget', () => {})

describe('focusRendererTerminalHandle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.storeState.tabsByWorktree = {
      'wt-1': [
        {
          id: 'tab-1',
          worktreeId: 'wt-1',
          ptyId: 'term_direct',
          title: 'Terminal',
          customTitle: null,
          color: null,
          sortOrder: 0,
          createdAt: 1
        }
      ]
    }
    mocks.storeState.ptyIdsByTabId = { 'tab-1': ['term_direct'] }
    mocks.storeState.terminalLayoutsByTabId = {
      'tab-1': { root: null, activeLeafId: null, expandedLeafId: null }
    }
    mocks.storeState.agentStatusByPaneKey = {}
    mocks.storeState.retainedAgentsByPaneKey = {}
    mocks.storeState.runtimeAgentOrchestrationByPaneKey = {}
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('activates a local renderer target without runtime lookup', () => {
    expect(focusRendererTerminalHandle('term_direct')).toBe(true)

    expect(mocks.storeState.setActiveWorktree).toHaveBeenCalledWith('wt-1')
    expect(mocks.storeState.setActiveView).toHaveBeenCalledWith('terminal')
    expect(mocks.storeState.setActiveTabType).toHaveBeenCalledWith('terminal', 'wt-1')
    expect(mocks.storeState.setActiveTab).toHaveBeenCalledWith('tab-1')
    expect(mocks.focusTerminalTabSurface).toHaveBeenCalledWith('tab-1')
  })
})

describe('createTerminalHandleLinkProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setPlatform('Macintosh')
    mocks.storeState.tabsByWorktree = {}
    mocks.storeState.ptyIdsByTabId = {}
    mocks.storeState.terminalLayoutsByTabId = {}
    mocks.storeState.agentStatusByPaneKey = {}
    mocks.storeState.retainedAgentsByPaneKey = {}
    mocks.storeState.runtimeAgentOrchestrationByPaneKey = {}
    vi.stubGlobal('window', {
      api: {
        runtime: {
          call: vi.fn().mockImplementation(({ method }) => {
            if (method === 'orchestration.dispatchShow') {
              return Promise.resolve({
                ok: true,
                result: { dispatch: { assignee_handle: 'term_worker' } }
              })
            }
            return Promise.resolve({
              ok: true,
              result: { focus: { handle: 'term_worker', tabId: 'tab-1', worktreeId: 'wt-1' } }
            })
          })
        },
        runtimeEnvironments: {
          call: vi.fn()
        }
      }
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('provides wrapped terminal handle links and focuses through runtime on activation', async () => {
    const rows = [makeBufferLine('Worker: term_work'), makeBufferLine('er', { isWrapped: true })]
    const links = await collectLinks(rows, 1)

    expect(links.map((link) => link.text)).toEqual(['term_worker'])
    links[0].activate(
      {
        metaKey: true,
        ctrlKey: false,
        preventDefault: vi.fn()
      } as unknown as MouseEvent,
      links[0].text
    )
    await Promise.resolve()

    expect(window.api.runtime.call).toHaveBeenCalledWith({
      method: 'terminal.focus',
      params: { terminal: 'term_worker', navigation: 'host' }
    })
  })

  it('defers a plain terminal-handle click to the action popover', async () => {
    const request = vi.fn()
    const links = await collectLinks([makeBufferLine('Worker: term_worker')], 1, null, {
      paneId: 4,
      pointerGesture: { canRequestAction: () => true, dispose: vi.fn() },
      claimPtyMouse: vi.fn(() => true),
      request,
      focusTerminal: vi.fn()
    })

    links[0].activate(
      {
        button: 0,
        metaKey: false,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        clientX: 20,
        clientY: 30,
        preventDefault: vi.fn()
      } as unknown as MouseEvent,
      links[0].text
    )

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: 'term_worker',
        kind: 'terminal',
        primary: expect.objectContaining({ label: 'Switch terminal' })
      })
    )
    expect(window.api.runtime.call).not.toHaveBeenCalled()
  })

  it('focuses resolved task terminals directly when they are already mounted', async () => {
    mocks.storeState.tabsByWorktree = {
      'wt-1': [
        {
          id: 'tab-1',
          worktreeId: 'wt-1',
          ptyId: 'term_worker',
          title: 'Worker',
          customTitle: null,
          color: null,
          sortOrder: 0,
          createdAt: 1
        }
      ]
    }
    mocks.storeState.ptyIdsByTabId = { 'tab-1': ['term_worker'] }
    mocks.storeState.terminalLayoutsByTabId = {
      'tab-1': { root: null, activeLeafId: null, expandedLeafId: null }
    }
    const links = await collectLinks([makeBufferLine('Task: task_worker')])

    links[0].activate(
      {
        metaKey: true,
        ctrlKey: false,
        preventDefault: vi.fn()
      } as unknown as MouseEvent,
      links[0].text
    )
    await Promise.resolve()
    await Promise.resolve()

    expect(window.api.runtime.call).toHaveBeenCalledTimes(1)
    expect(window.api.runtime.call).toHaveBeenCalledWith({
      method: 'orchestration.dispatchShow',
      params: { task: 'task_worker' }
    })
    expect(mocks.storeState.setActiveWorktree).toHaveBeenCalledWith('wt-1')
    expect(mocks.storeState.markWorktreeVisited).toHaveBeenCalledWith('wt-1')
    expect(mocks.storeState.setActiveView).toHaveBeenCalledWith('terminal')
    expect(mocks.storeState.setActiveTabType).toHaveBeenCalledWith('terminal', 'wt-1')
    expect(mocks.storeState.revealWorktreeInSidebar).toHaveBeenCalledWith('wt-1')
    expect(mocks.storeState.setActiveTab).toHaveBeenCalledWith('tab-1')
    expect(mocks.focusTerminalTabSurface).toHaveBeenCalledWith('tab-1')
  })

  it('returns task and terminal links in line order', async () => {
    const links = await collectLinks([
      makeBufferLine('Dispatch --task task_worker --to term_worker')
    ])

    expect(links.map((link) => link.text)).toEqual(['task_worker', 'term_worker'])
  })
})
