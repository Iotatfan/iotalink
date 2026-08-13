'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function ShortLinkLoaderClient({ apiBaseUrl }: { apiBaseUrl: string }) {
  const params = useParams<{ short_code?: string }>()
  const shortCode = params?.short_code
  const [error, setError] = useState(shortCode ? '' : 'No short code was provided.')

  useEffect(() => {
    if (!shortCode) return

    try {
      const resolvedApiBaseUrl = apiBaseUrl || window.location.origin
      window.location.replace(`${resolvedApiBaseUrl}/shortlink/${encodeURIComponent(shortCode)}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to resolve this short link.'
      window.setTimeout(() => setError(message), 0)
    }
  }, [apiBaseUrl, shortCode])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur sm:p-10" aria-live="polite">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Opening your link</h1>
        <p className="mt-2 text-sm text-slate-600">Loading your destination...</p>
        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      </section>
    </main>
  )
}
