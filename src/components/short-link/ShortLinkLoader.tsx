import { ShortLinkLoaderClient } from './ShortLinkLoaderClient'

export function ShortLinkLoader() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

  return <ShortLinkLoaderClient apiBaseUrl={apiBaseUrl} />
}
