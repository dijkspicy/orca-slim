import { useEffect, useRef, useState } from 'react'
import type { GlobalSettings } from '../../../../shared/global-settings-types'
import { cn } from '@/lib/utils'
import { SearchableSetting } from './SearchableSetting'
import { EphemeralVmRuntimesSection } from './EphemeralVmRuntimesSection'
import { CloudVmSetupGuide } from './CloudVmSetupGuide'
import {
  getRuntimeEnvironmentsSearchEntry,
  getWebRuntimeEnvironmentsSearchEntry
} from './runtime-environments-search'
import { RuntimeActiveServerSection } from './runtime-active-server-section'
import { RuntimeEnvironmentSwitchDialog } from './runtime-environment-dialogs'
import {
  RuntimeServerShareSection,
  RuntimeServerTroubleshooting,
  RuntimeServerWorkflowPicker,
  type RemoteServerWorkflow
} from './runtime-server-workflow-sections'
import { useRuntimeEnvironmentCatalog } from './use-runtime-environment-catalog'
import { useRuntimeEnvironmentConnectionActions } from './use-runtime-environment-connection-actions'
import { useRuntimeEnvironmentMutationActions } from './use-runtime-environment-mutation-actions'
import { LOCAL_RUNTIME_VALUE, NO_RUNTIME_VALUE } from './runtime-environment-selection'

type RuntimeEnvironmentsPaneProps = {
  settings: GlobalSettings
  setActiveRuntimeEnvironmentPreference: (environmentId: string | null) => Promise<boolean>
  canGeneratePairingUrl?: boolean
  allowLocalRuntime?: boolean
  addServerIntentSignal?: number
}

export function RuntimeEnvironmentsPane({
  settings,
  setActiveRuntimeEnvironmentPreference,
  canGeneratePairingUrl = true,
  allowLocalRuntime = true,
  addServerIntentSignal
}: RuntimeEnvironmentsPaneProps): React.JSX.Element {
  const [pendingSwitchValue, setPendingSwitchValue] = useState<string | null>(null)
  const [addServerFormOpen, setAddServerFormOpen] = useState(false)
  const [shareServerFormOpen, setShareServerFormOpen] = useState(true)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [workflow, setWorkflow] = useState<RemoteServerWorkflow>('connect')
  const consumedAddServerIntentSignalRef = useRef(0)
  const {
    environments,
    isLoading,
    detailsByEnvironmentId,
    setDetailsByEnvironmentId,
    mountedRef,
    loadEnvironments
  } = useRuntimeEnvironmentCatalog()

  const getEnvironmentLabel = (value: string): string => {
    if (value === LOCAL_RUNTIME_VALUE) {
      return 'Local desktop'
    }
    if (value === NO_RUNTIME_VALUE) {
      return 'No server connected'
    }
    return environments.find((environment) => environment.id === value)?.name ?? 'remote server'
  }
  const { switchingValue, switchError, setSwitchError, connectEnvironment, switchToValue } =
    useRuntimeEnvironmentConnectionActions({
      allowLocalRuntime,
      mountedRef,
      setDetailsByEnvironmentId,
      setActiveRuntimeEnvironmentPreference,
      getEnvironmentLabel
    })
  const { isSaving, closeAddServerForm } = useRuntimeEnvironmentMutationActions({
    environments,
    settings,
    allowLocalRuntime,
    mountedRef,
    setAddServerFormOpen,
    loadEnvironments,
    connectEnvironment
  })

  useEffect(() => {
    if (
      !addServerIntentSignal ||
      consumedAddServerIntentSignalRef.current === addServerIntentSignal
    ) {
      return
    }
    consumedAddServerIntentSignalRef.current = addServerIntentSignal
    // Why: composer deep-links should land on the existing pairing form, not just
    // the server list.
    setAddServerFormOpen(true)
  }, [addServerIntentSignal])

  const activeValue =
    settings.activeRuntimeEnvironmentId ??
    (allowLocalRuntime ? LOCAL_RUNTIME_VALUE : NO_RUNTIME_VALUE)
  const isBusy = isSaving || switchingValue !== null
  const searchEntry = canGeneratePairingUrl
    ? getRuntimeEnvironmentsSearchEntry()
    : getWebRuntimeEnvironmentsSearchEntry()
  const visibleWorkflow: RemoteServerWorkflow = addServerFormOpen ? 'connect' : workflow

  const confirmSwitch = (): void => {
    const value = pendingSwitchValue
    if (!value) {
      return
    }
    void switchToValue(value).then((switched) => {
      if (switched && mountedRef.current) {
        setPendingSwitchValue(null)
      }
    })
  }

  return (
    <SearchableSetting
      title={searchEntry.title}
      description={searchEntry.description}
      keywords={searchEntry.keywords}
      className="space-y-4 py-2"
    >
      <RuntimeServerWorkflowPicker
        canGeneratePairingUrl={canGeneratePairingUrl}
        visibleWorkflow={visibleWorkflow}
        onCloseAddServerForm={closeAddServerForm}
        onWorkflowChange={setWorkflow}
      />

      <div className={cn('space-y-5 pt-2', visibleWorkflow !== 'cloud-vm' && 'hidden')}>
        <CloudVmSetupGuide />
        <EphemeralVmRuntimesSection active={visibleWorkflow === 'cloud-vm'} />
      </div>

      <RuntimeActiveServerSection
        visible={visibleWorkflow === 'connect'}
        advancedOpen={advancedOpen}
        allowLocalRuntime={allowLocalRuntime}
        localRuntimeValue={LOCAL_RUNTIME_VALUE}
        noRuntimeValue={NO_RUNTIME_VALUE}
        activeValue={activeValue}
        environments={environments}
        detailsByEnvironmentId={detailsByEnvironmentId}
        isBusy={isBusy}
        isLoading={isLoading}
        onToggleAdvanced={() => setAdvancedOpen((current) => !current)}
        onValueChange={(value) => {
          setSwitchError(null)
          setPendingSwitchValue(value)
        }}
        onRefresh={() => void loadEnvironments()}
      />

      {visibleWorkflow === 'share' && canGeneratePairingUrl ? (
        <RuntimeServerShareSection
          shareServerFormOpen={shareServerFormOpen}
          onToggleShareServerForm={() => setShareServerFormOpen((open) => !open)}
        />
      ) : null}

      {visibleWorkflow === 'connect' ? <RuntimeServerTroubleshooting /> : null}

      <RuntimeEnvironmentSwitchDialog
        pendingSwitchValue={pendingSwitchValue}
        switchingValue={switchingValue}
        switchError={switchError}
        getEnvironmentLabel={getEnvironmentLabel}
        onOpenChange={(open) => {
          if (!open && switchingValue === null) {
            setSwitchError(null)
            setPendingSwitchValue(null)
          }
        }}
        onCancel={() => {
          setSwitchError(null)
          setPendingSwitchValue(null)
        }}
        onConfirm={confirmSwitch}
      />
    </SearchableSetting>
  )
}
