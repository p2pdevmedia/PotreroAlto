import { getPotreroAltoData } from '@/lib/thecrag';

function RouteRow({ route }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-slate-700/50 py-3 last:border-0">
      <div>
        <p className="font-medium text-slate-100">{route.name}</p>
        {route.type ? <p className="text-xs uppercase tracking-wide text-slate-400">{route.type}</p> : null}
      </div>
      <div className="text-right">
        <p className="font-semibold text-sunset">{route.grade}</p>
        {route.stars ? <p className="text-xs text-slate-400">⭐ {route.stars}</p> : null}
      </div>
    </li>
  );
}

export default async function HomePage() {
  let data;
  let error = null;

  try {
    data = await getPotreroAltoData();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-10 card bg-gradient-to-br from-slate-900 via-slate-900 to-pine/30">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Guía de escalada</p>
        <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Potrero Alto</h1>
        <p className="mt-4 max-w-3xl text-slate-200">
          Web informativa conectada con <span className="font-semibold text-sunset">theCrag</span> para listar
          subsectores y vías del sector <span className="font-semibold">ID 6574670919</span>.
        </p>
      </header>

      {error ? (
        <section className="card border-red-500/30 bg-red-900/20">
          <h2 className="text-xl font-semibold text-red-200">No se pudo cargar la información en este entorno</h2>
          <p className="mt-2 text-red-100">{error}</p>
          <p className="mt-4 text-sm text-red-100/80">
            En tu entorno local ejecuta <code className="rounded bg-red-950 px-1 py-0.5">npm install</code> y
            verifica credenciales/API si la librería de theCrag las requiere.
          </p>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold text-white">{data.name}</h2>
            <p className="mt-1 text-slate-300">{data.location}</p>
            {data.description ? <p className="mt-4 text-slate-200">{data.description}</p> : null}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {data.subsectors.map((subsector) => (
              <article key={subsector.id} className="card">
                <h3 className="text-xl font-semibold text-white">{subsector.name}</h3>
                {subsector.description ? <p className="mt-2 text-sm text-slate-300">{subsector.description}</p> : null}

                {subsector.routes.length ? (
                  <ul className="mt-4">
                    {subsector.routes.map((route) => (
                      <RouteRow key={route.id ?? `${subsector.id}-${route.name}`} route={route} />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">Sin vías registradas en este subsector.</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
