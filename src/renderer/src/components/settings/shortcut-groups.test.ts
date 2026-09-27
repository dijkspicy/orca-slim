import { describe, expect, it } from 'vitest'
import { groupDefinitions } from './shortcut-groups'

describe('shortcut groups', () => {
  it('exposes the agent dashboard toggle as a customizable Global row', () => {
    const global = groupDefinitions([]).find((group) => group.title === 'Global')

    expect(global?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'dashboard.toggle', title: 'Toggle Agent Dashboard' })
      ])
    )
  })
})
