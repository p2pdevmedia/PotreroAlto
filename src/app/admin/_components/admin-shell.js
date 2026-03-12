'use client';

import Link from 'next/link';

export function AdminFrame({ children, title, subtitle, actions }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <section className="card space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">{actions}</div>
        </div>
        {children}
      </section>
    </main>
  );
}

export function AdminLogin({ onSubmit, password, setPassword, loading, error }) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block text-sm text-slate-200">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sunset"
        />
      </label>
      <button
        type="submit"
        disabled={loading || !password}
        className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Validando...' : 'Entrar'}
      </button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </form>
  );
}

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2 rounded-xl border border-slate-700/70 bg-slate-900/40 p-2">
      <Link href="/admin" className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 hover:border-slate-500">
        Sectores y Subsectores
      </Link>
    </nav>
  );
}

export function Feedback({ error, message }) {
  if (!error && !message) {
    return null;
  }

  return (
    <p
      role={error ? 'alert' : 'status'}
      aria-live="polite"
      className={`rounded-lg border px-3 py-2 text-sm ${
        error ? 'border-red-500/50 bg-red-900/20 text-red-200' : 'border-emerald-500/50 bg-emerald-900/20 text-emerald-200'
      }`}
    >
      {error || message}
    </p>
  );
}
