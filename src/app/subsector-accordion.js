'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

const SUBSECTOR_IMAGE_OVERRIDES = {
  'la chanchería':
    'https://videos.openai.com/az/vg-assets/task_01kjr7njtfe2qbcdm2tfqbcjte%2F1772487378_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=qErrSv27kQKSsZR0RyGibAyWuAItM9acUvdMZIn72TE%3D&ac=oaivgprodscus2',
  'cheto / pared este':
    'https://videos.openai.com/az/vg-assets/task_01kjr7pvhbej1vs1tbe5vb6368%2F1772487421_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=MO0gcLygn4jljZzHYBn5hZWQz5wPXu0kp/xACbr6R70%3D&ac=oaivgprodscus2',
  croto:
    'https://videos.openai.com/az/vg-assets/task_01kjr7q6vre89bper3vp0b1s2h%2F1772487432_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=ayAihqZghPfDdQfHZGsHbxGYrQ4XntJ/%2BqjDYvH2RZE%3D&ac=oaivgprodscus2',
  'el arco':
    'https://videos.openai.com/az/vg-assets/task_01kjr7s21ge2drfqwcyt9sqdqv%2F1772487491_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=mjg%2B7AUiRzU1Y0Zzq/GSBY4nK/EVfSpZS597CTIf%2BUs%3D&ac=oaivgprodscus2',
  'el tablero':
    'https://videos.openai.com/az/vg-assets/task_01kjr80p7ee78amdxkshsc6dyh%2F1772487754_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=jT6mENgiCODGEBMo2QNR1fTleiZ9MwtHXmCoyuSxbfc%3D&ac=oaivgprodscus2',
  'cañadón':
    'https://videos.openai.com/az/vg-assets/task_01kjr819adet4rnc6hte1p3ent%2F1772487784_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=ALb7mHPqAMB/zHgGaEPaK4fTVaOOxZUuhFq/wSsyjOM%3D&ac=oaivgprodscus2',
  'el derrumbe':
    'https://videos.openai.com/az/vg-assets/task_01kjr7x9x7err8y52pzt0kjj3d%2F1772487643_img_0.webp?se=2026-03-08T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-02T03%3A20%3A41Z&ske=2026-03-09T03%3A25%3A41Z&sks=b&skv=2026-02-06&sig=xfuwclzsJPeSaM6I2BC87%2BpDzjq25Qw5iFuNhwtbdWA%3D&ac=oaivgprodscus2'
};

function routeImage(route) {
  return route.image;
}

function RouteRow({ route, onSelect }) {
  const hasImage = Boolean(route.image);

  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 border-b border-slate-700/60 py-3 text-left last:border-0 disabled:cursor-default disabled:opacity-70"
        onClick={() => onSelect(route)}
        disabled={!hasImage}
      >
      <div>
        <p className="font-medium text-slate-100">
          {route.name}
          {hasImage ? <span className="ml-2 text-xs text-sunset">📷</span> : null}
        </p>
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
  const overrideImage = SUBSECTOR_IMAGE_OVERRIDES[subsector.name?.toLowerCase()];

  if (overrideImage) {
    return overrideImage;
  }

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
          className="fixed inset-0 z-40 flex items-center bg-slate-950/70 p-3 backdrop-blur-sm"
          onClick={() => {
            setSelectedSubsectorId(null);
            setSelectedRoute(null);
          }}
        >
          <section
            className="flex h-full max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
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

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
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
        <div className="fixed inset-0 z-50 bg-slate-950/95" onClick={() => setSelectedRoute(null)}>
          <section
            className="relative h-full w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-route-title"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={routeImage(selectedRoute)}
              alt={`Imagen de la vía ${selectedRoute.name}`}
              className="h-full w-full object-contain"
              fill
              sizes="100vw"
              unoptimized
            />
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full border border-slate-600 bg-slate-950/60 px-3 py-1 text-sm text-slate-100 backdrop-blur hover:bg-slate-900"
              onClick={() => setSelectedRoute(null)}
            >
              Cerrar
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-16">
              <h4 id="selected-route-title" className="text-lg font-semibold text-white">
                {selectedRoute.name}
              </h4>
              <p className="text-sm text-slate-300">
                {selectedRoute.grade}
                {selectedRoute.type ? ` · ${selectedRoute.type}` : ''}
              </p>
              <p className="mt-3 text-sm text-slate-200">
                {selectedRoute.description ?? 'Todavía no hay una descripción cargada para esta vía.'}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
