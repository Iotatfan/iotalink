import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur sm:p-10">
        <div className="mb-6 text-6xl font-bold text-indigo-600">404</div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Link not found</h1>
        <p className="mt-2 text-sm text-slate-600">The short link you're looking for doesn't exist or has expired.</p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700"
        >
          Create a new link
        </Link>
      </section>
    </main>
  )
}
