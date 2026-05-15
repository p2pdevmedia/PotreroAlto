import Link from 'next/link';
import { getPotreroAltoData } from '@/lib/potrero-alto-data';
import { buildRoutePath, buildSubsectorPath, getGradeSummary } from '@/lib/route-utils';
import { buildPageMetadata, buildRouteItemListJsonLd } from '@/lib/site-seo';

export const metadata = buildPageMetadata({
  title: 'Rutas de escalada | Potrero Alto',
  description:
    'Índice completo de vías de escalada deportiva de Potrero Alto en San Martín de los Andes, con subsectores, grados, largos y expreses.',
  path: '/rutas',
  keywords: ['rutas Potrero Alto', 'vías Potrero Alto', 'topo Potrero Alto', 'escalada San Martín de los Andes']
});

function routeFacts(route) {
  return [
    route.grade || 'Sin grado',
    route.lengthMeters ? `${route.lengthMeters}m` : null,
    route.quickdraws ? `${route.quickdraws} expreses` : null,
    route.type || null
  ]
    .filter(Boolean)
    .join(' · ');
}

export default async function RoutesIndexPage() {
  const data = await getPotreroAltoData();
  const subsectors = data?.subsectors ?? [];
  const routeCount = subsectors.reduce((total, subsector) => total + (subsector.routes?.length ?? 0), 0);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 text-slate-100 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildRouteItemListJsonLd(data)) }}
      />

      <header className="mb-8 space-y-4">
        <Link href="/" className="inline-flex text-sm font-semibold text-amber-300 hover:text-amber-200">
          Potrero Alto
        </Link>
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white md:text-5xl">Rutas de escalada en Potrero Alto</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            {routeCount} vías de escalada deportiva en {subsectors.length} subsectores de San Martín de los Andes,
            Neuquén. Índice por sector, grado, largo y expreses.
          </p>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-2" aria-label="Índice de subsectores y rutas">
        {subsectors.map((subsector) => (
          <article key={subsector.id ?? subsector.name} className="rounded-lg border border-slate-700/70 bg-slate-950/70 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  <Link href={buildSubsectorPath(subsector.name)} className="hover:text-amber-300">
                    {subsector.name}
                  </Link>
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {(subsector.routes ?? []).length} vías · {getGradeSummary(subsector.routes ?? [])}
                </p>
              </div>
            </div>

            <ul className="divide-y divide-slate-800">
              {(subsector.routes ?? []).map((route) => (
                <li key={route.id ?? `${subsector.name}-${route.name}`} className="py-3">
                  <Link
                    href={buildRoutePath(subsector.name, route.name)}
                    className="group block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block font-semibold text-slate-100 group-hover:text-amber-300">{route.name}</span>
                        {route.description ? (
                          <span className="mt-1 line-clamp-2 block text-xs text-slate-400">{route.description}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-right text-xs font-medium text-slate-300">{routeFacts(route)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
