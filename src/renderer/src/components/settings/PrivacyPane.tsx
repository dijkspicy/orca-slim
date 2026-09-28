import type { GlobalSettings } from '../../../../shared/global-settings-types'
import { PrivacyDiagnosticsSection } from './PrivacyDiagnosticsSection'

type PrivacyPaneProps = {
  settings: GlobalSettings
}

export function PrivacyPane({ settings }: PrivacyPaneProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <PrivacyDiagnosticsSection key={String(settings.telemetry?.optedIn ?? '')} />
    </div>
  )
}
