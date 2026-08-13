import { ShortenerPageClient } from './ShortenerPageClient'

export function ShortenerPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-4xl flex-col p-8 backdrop-blur sm:p-10" aria-labelledby="shortener-title">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">URL Shortener</p>
          <h1 id="shortener-title" className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Shorten your link in seconds</h1>
        </div>
        <ShortenerPageClient apiBaseUrl={apiBaseUrl} />
      </section>
    </main>
  )
}
