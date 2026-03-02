'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

function routeImage(route) {
  if (route.image) {
    return route.image;
  }

  const safeName = encodeURIComponent(route.name ?? 'Vía');
  return `https://placehold.co/960x640/020617/e2e8f0?text=${safeName}`;
}

function RouteRow({ route, onSelect }) {
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 border-b border-slate-700/60 py-3 text-left last:border-0"
        onClick={() => onSelect(route)}
      >
      <div>
        <p className="font-medium text-slate-100">{route.name}</p>
        {route.type ? <p className="text-[11px] uppercase tracking-wide text-slate-400">{route.type}</p> : null}
        {route.description ? <p className="mt-1 line-clamp-1 text-xs text-slate-300">{route.description}</p> : null}
      </div>
      <div className="text-right">
        <p className="font-semibold text-sunset">{route.grade}</p>
        {route.stars ? <p className="text-xs text-slate-400">⭐ {route.stars}</p> : null}
      </div>
      </button>
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
  const [selectedRoute, setSelectedRoute] = useState(null);

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
        <div
          className="fixed inset-0 z-40 flex items-end bg-slate-950/70 p-3 backdrop-blur-sm"
          onClick={() => {
            setSelectedSubsectorId(null);
            setSelectedRoute(null);
          }}
        >
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
                onClick={() => {
                  setSelectedSubsectorId(null);
                  setSelectedRoute(null);
                }}
              >
                Cerrar
              </button>
            </header>

            <div className="overflow-y-auto px-4 pb-4">
              {selectedSubsector.routes.length ? (
                <ul>
                  {selectedSubsector.routes.map((route) => (
                    <RouteRow
                      key={route.id ?? `${selectedSubsector.id}-${route.name}`}
                      route={route}
                      onSelect={setSelectedRoute}
                    />
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-sm text-slate-400">Sin vías registradas en este subsector.</p>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {selectedRoute ? (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/80 p-3 backdrop-blur-sm" onClick={() => setSelectedRoute(null)}>
          <section
            className="max-h-[85vh] w-full overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-route-title"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={routeImage(selectedRoute)}
              alt={`Imagen de la vía ${selectedRoute.name}`}
              className="h-60 w-full object-cover"
              width={960}
              height={640}
              unoptimized
            />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 id="selected-route-title" className="text-lg font-semibold text-white">
                    {selectedRoute.name}
                  </h4>
                  <p className="text-sm text-slate-300">
                    {selectedRoute.grade}
                    {selectedRoute.type ? ` · ${selectedRoute.type}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
                  onClick={() => setSelectedRoute(null)}
                >
                  Cerrar
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-200">
                {selectedRoute.description ?? 'Todavía no hay una descripción cargada para esta vía.'}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
