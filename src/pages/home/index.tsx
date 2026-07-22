import { type FormEvent, useState } from 'react'

type ShortLinkPayload = {
  short_code: string
  expired_at?: string | null
}

type ShortenerPageProps = {
  apiBaseUrl: string
}



export function ShortenerPage({ apiBaseUrl }: ShortenerPageProps) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copyState, setCopyState] = useState('Copy')
  const [statusMessage, setStatusMessage] = useState('')
  const [expiredAt, setExpiredAt] = useState('')
  const [selectedExpiryDays, setSelectedExpiryDays] = useState(10)

  const EXPIRY_TIME = [
    {
      "text": "10 Days",
      "value": "10"
    },
    {
      "text": "15 Days",
      "value": "15"
    },
    {
      "text": "30 Days",
      "value": "30"
    }
  ]

  const handleCopy = async () => {
    if (!shortenedUrl) {
      return
    }

    try {
      await navigator.clipboard.writeText(shortenedUrl)
      setCopyState('Copied!')
      window.setTimeout(() => setCopyState('Copy'), 2000)
    } catch {
      setCopyState('Failed')
      window.setTimeout(() => setCopyState('Copy'), 2000)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedUrl = originalUrl.trim()
    if (!trimmedUrl) {
      setError('Please enter a URL to shorten.')
      setShortenedUrl('')
      return
    }

    let normalizedUrl = trimmedUrl
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    setIsLoading(true)
    setError('')
    setShortenedUrl('')
    setExpiredAt('')
    setStatusMessage('')

    try {
      const response = await fetch(`${apiBaseUrl}/shortlink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_url: normalizedUrl,
          expiry_days: selectedExpiryDays,
        }),
      })

      const contentType = response.headers.get('content-type') ?? ''
      let payload: ShortLinkPayload | string | null = null

      if (contentType.includes('application/json')) {
        payload = (await response.json()) as ShortLinkPayload
      } else {
        const text = await response.text()
        payload = text ? text : null
      }

      if (!response.ok) {
        const detail =
          typeof payload === 'string'
            ? payload
            : payload && typeof payload === 'object' && (payload as any).error
              ? String((payload as any).error)
              : 'Unable to shorten the URL.'

        throw new Error(detail)
      }

      let resolvedUrl = ''
      if (typeof payload === 'string') {
        resolvedUrl = payload
      } else if (payload && payload.short_code) {
        resolvedUrl = `${window.location.origin}/${payload.short_code}`
      }

      if (!resolvedUrl) {
        throw new Error('The server did not return a shortened URL.')
      }

      setShortenedUrl(resolvedUrl)
      if (payload && typeof payload === 'object' && payload.expired_at) {
        setExpiredAt(payload.expired_at)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while shortening the URL.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-4xl flex-col p-8 backdrop-blur sm:p-10" aria-labelledby="shortener-title">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
            URL Shortener
          </p>
          <h1 id="shortener-title" className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Shorten your link in seconds
          </h1>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="original-url">
            Original URL
          </label>
          <input
            id="original-url"
            name="original-url"
            type="url"
            placeholder="https://example.com"
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base bg-white/90 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur sm:p-10">

            <div className='flex flex-col'>
              <label htmlFor="expires" className='mb-3 inline-flex py-1 text-base font-semibold'>
                Expires in
              </label>

              <select id="expires"
                className='w-full border border-slate-300 rounded-2xl px-4 py-3 text-base'
                value={selectedExpiryDays}
                onChange={(event) => setSelectedExpiryDays(Number(event.target.value))}
              >
                {EXPIRY_TIME.map((exp) => (
                  <option
                    className='mx-auto text-base rounded-3xl'
                    value={exp.value} key={exp.value}>
                    {exp.text}
                  </option>
                ))}
              </select>

            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl my-5 bg-indigo-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-80"
            >
              {isLoading ? 'Shortening...' : 'Shorten Now'}
            </button>

            {shortenedUrl ? (
              <div className="mt-5 border-t border-gray-400 bg-white/90 p-4" role="status">
                <p className="mb-1 text-sm font-semibold text-slate-700">Shortened URL</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <a className="break-all text-sm font-medium text-indigo-700 underline" href={shortenedUrl} target="_blank" rel="noreferrer">
                    {shortenedUrl}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-full border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
                  >
                    {copyState}
                  </button>
                </div>
                {expiredAt ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Expires at: <span className="font-medium text-slate-700">{new Date(expiredAt).toLocaleString()}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

          </div>

        </form>

        {statusMessage ? <p className="mt-4 text-sm font-medium text-indigo-600">{statusMessage}</p> : null}
        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}


      </section>
    </main>
  )
}
