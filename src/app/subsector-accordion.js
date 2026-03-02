'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

function RouteRow({ route }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-slate-700/60 py-3 last:border-0">
      <div>
        <p className="font-medium text-slate-100">{route.name}</p>
        {route.type ? <p className="text-[11px] uppercase tracking-wide text-slate-400">{route.type}</p> : null}
      </div>
      <div className="text-right">
        <p className="font-semibold text-sunset">{route.grade}</p>
        {route.stars ? <p className="text-xs text-slate-400">⭐ {route.stars}</p> : null}
      </div>
    </li>
  );
}

function subsectorCover(subsector) {
  if (subsector.image) {
    return subsector.image;
  }

  const safeName = encodeURIComponent(subsector.name ?? 'Subsector');
  return `https://placehold.co/720x1280/020617/e2e8f0?text=${safeName}`;
}

export default function SubsectorAccordion({ subsectors }) {
  const [selectedSubsectorId, setSelectedSubsectorId] = useState(null);

  const selectedSubsector = useMemo(
    () => subsectors.find((subsector) => subsector.id === selectedSubsectorId) ?? null,
    [selectedSubsectorId, subsectors]
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {subsectors.map((subsector) => (
          <button
            key={subsector.id}
            type="button"
            className="group relative aspect-[3/4] overflow-hidden bg-slate-900 text-left"
            onClick={() => setSelectedSubsectorId(subsector.id)}
            aria-label={`Ver rutas del subsector ${subsector.name}`}
          >
            <Image
              src={subsectorCover(subsector)}
              alt={`Imagen del subsector ${subsector.name}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              width={720}
              height={1280}
              loading="lazy"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow">{subsector.name}</p>
              <p className="mt-1 text-xs text-slate-100/95">
                ▶ {subsector.routes.length} {subsector.routes.length === 1 ? 'ruta' : 'rutas'}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selectedSubsector ? (
        <div className="fixed inset-0 z-40 flex items-end bg-slate-950/70 p-3 backdrop-blur-sm" onClick={() => setSelectedSubsectorId(null)}>
          <section
            className="max-h-[80vh] w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-subsector-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-slate-700/70 px-4 py-3">
              <div>
                <h3 id="selected-subsector-title" className="text-lg font-semibold text-white">
                  {selectedSubsector.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedSubsector.routes.length} {selectedSubsector.routes.length === 1 ? 'ruta' : 'rutas'}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
                onClick={() => setSelectedSubsectorId(null)}
              >
                Cerrar
              </button>
            </header>

            <div className="overflow-y-auto px-4 pb-4">
              {selectedSubsector.routes.length ? (
                <ul>
                  {selectedSubsector.routes.map((route) => (
                    <RouteRow key={route.id ?? `${selectedSubsector.id}-${route.name}`} route={route} />
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-sm text-slate-400">Sin vías registradas en este subsector.</p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
