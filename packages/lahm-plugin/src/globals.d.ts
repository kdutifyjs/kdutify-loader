import { TransformResult } from 'lahm'

declare module 'lahm' {
  interface LahmDevServer {
    _pendingRequests: Map<string, Promise<TransformResult | null>>
  }
}
