import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

type ShortLinkLoaderProps = {
  apiBaseUrl: string
}

export function ShortLinkLoader({ apiBaseUrl }: ShortLinkLoaderProps) {
  const { short_code } = useParams<{ short_code?: string }>()
  const isMountedRef = useRef(true)
  const [statusMessage, setStatusMessage] = useState(() => 
    short_code ? 'Loading your destination...' : ''
  )
  const [error, setError] = useState(() => 
    short_code ? '' : 'No short code was provided.'
  )

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!short_code) {
      return
    }

    try {
      window.location.replace(`${apiBaseUrl}/shortlink/${encodeURIComponent(short_code)}`)
    } catch (err) {
      if (isMountedRef.current) {
        setStatusMessage('')
        setError(err instanceof Error ? err.message : 'Unable to resolve this short link.')
      }
    }
  }, [apiBaseUrl, short_code])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur sm:p-10" aria-live="polite">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Opening your link</h1>
        <p className="mt-2 text-sm text-slate-600">{statusMessage}</p>
        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      </section>
    </main>
  )
}
