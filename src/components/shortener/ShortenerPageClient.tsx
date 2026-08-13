'use client'

import { type FormEvent, useState } from 'react'

type ShortLinkPayload = {
  short_code: string
  expired_at?: string | null
  error?: string
}

type ShortenerPageClientProps = {
  apiBaseUrl: string
}

const EXPIRY_TIME = [
  { text: '10 Days', value: 10 },
  { text: '15 Days', value: 15 },
  { text: '30 Days', value: 30 },
]

export function ShortenerPageClient({ apiBaseUrl }: ShortenerPageClientProps) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [originalUrl, setOriginalUrl] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copyState, setCopyState] = useState('Copy')
  const [expiredAt, setExpiredAt] = useState('')
  const [selectedExpiryDays, setSelectedExpiryDays] = useState(10)

  const handleCopy = async () => {
    if (!shortenedUrl) return

    try {
      await navigator.clipboard.writeText(shortenedUrl)
      setCopyState('Copied!')
    } catch {
      setCopyState('Failed')
    }

    window.setTimeout(() => setCopyState('Copy'), 2000)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedUrl = originalUrl.trim()
    if (!trimmedUrl) {
      setError('Please enter a URL to shorten.')
      setShortenedUrl('')
      return
    }

    const normalizedUrl = /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`

    setIsLoading(true)
    setError('')
    setShortenedUrl('')
    setExpiredAt('')

    try {
      const response = await fetch(`${apiBaseUrl || window.location.origin}/shortlink`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_url: normalizedUrl,
          custom_url: customUrl.trim() || undefined,
          expiry_days: selectedExpiryDays,
        }),
      })

      const contentType = response.headers.get('content-type') ?? ''
      const payload: ShortLinkPayload | string | null = contentType.includes('application/json')
        ? await response.json() as ShortLinkPayload
        : await response.text()

      if (!response.ok) {
        const detail = typeof payload === 'string'
          ? payload
          : payload?.error ?? 'Unable to shorten the URL.'
        throw new Error(detail)
      }

      const shortCode = typeof payload === 'string' ? '' : payload?.short_code
      const resolvedUrl = typeof payload === 'string'
        ? payload
        : shortCode
          ? `${window.location.origin}/${shortCode}`
          : ''

      if (!resolvedUrl) throw new Error('The server did not return a shortened URL.')

      setShortenedUrl(resolvedUrl)
      if (typeof payload !== 'string' && payload.expired_at) {
        setExpiredAt(payload.expired_at)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while shortening the URL.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="original-url">Original URL</label>
      <input
        id="original-url"
        name="original-url"
        type="url"
        placeholder="https://example.com"
        value={originalUrl}
        onChange={(event) => setOriginalUrl(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
      <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur sm:p-10">
        <label className="mb-3 inline-flex py-1 text-base font-semibold">
          <a onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} className="cursor-pointer text-indigo-600 hover:text-indigo-800">
            Advanced Options
          </a>
        </label>
        {
          showAdvancedOptions ? (
            <>
              <label htmlFor='custom-url' className="mb-3 inline-flex py-1 text-base font-semibold">Custom URL</label>
              <input
                id="custom-url"
                type="text"
                placeholder="Optional custom URL"
                value={customUrl}
                onChange={(event) => setCustomUrl(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </>
          ) : null
        }
        <label htmlFor="expires" className="mb-3 inline-flex py-1 text-base font-semibold">Expires in</label>
        <select
          id="expires"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base"
          value={selectedExpiryDays}
          onChange={(event) => setSelectedExpiryDays(Number(event.target.value))}
        >
          {EXPIRY_TIME.map((expiry) => <option value={expiry.value} key={expiry.value}>{expiry.text}</option>)}
        </select>
        <button type="submit" disabled={isLoading} className="my-5 rounded-2xl bg-indigo-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-80">
          {isLoading ? 'Shortening...' : 'Shorten Now'}
        </button>
        {shortenedUrl ? (
          <div className="mt-5 border-t border-gray-400 bg-white/90 p-4" role="status">
            <p className="mb-1 text-sm font-semibold text-slate-700">Shortened URL</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <a className="break-all text-sm font-medium text-indigo-700 underline" href={shortenedUrl} target="_blank" rel="noreferrer">{shortenedUrl}</a>
              <button type="button" onClick={handleCopy} className="rounded-full border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100">{copyState}</button>
            </div>
            {expiredAt ? <p className="mt-2 text-sm text-slate-600">Expires at: <span className="font-medium text-slate-700">{new Date(expiredAt).toLocaleString()}</span></p> : null}
          </div>
        ) : null}
        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}
      </div>
    </form>
  )
}
