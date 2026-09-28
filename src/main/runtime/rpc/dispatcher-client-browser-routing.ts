// Client-hosted browser RPC routing was culled with the paired browser host; every
// dispatch now answers "not handled" so the normal RPC method table takes over.
export function routeDispatcherClientHostedBrowserRpc(
  _runtime: unknown,
  _method: string,
  _params: unknown
) {
  return { handled: false as const }
}
