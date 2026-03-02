'use client';

import { useState } from 'react';
import Image from 'next/image';

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

function subsectorCover(subsector) {
  if (subsector.image) {
    return subsector.image;
  }

  const safeName = encodeURIComponent(subsector.name ?? 'Subsector');
  return `https://placehold.co/640x360/0f172a/e2e8f0?text=${safeName}`;
}

export default function SubsectorAccordion({ subsectors }) {
  const [openSubsectorId, setOpenSubsectorId] = useState(null);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {subsectors.map((subsector) => {
        const isOpen = openSubsectorId === subsector.id;

        return (
          <details
            key={subsector.id}
            className="card group"
            open={isOpen}
            onToggle={(event) => {
              const nextOpen = event.currentTarget.open;
              setOpenSubsectorId(nextOpen ? subsector.id : null);
            }}
          >
            <summary className="list-none cursor-pointer outline-none">
              <Image
                src={subsectorCover(subsector)}
                alt={`Imagen del subsector ${subsector.name}`}
                className="h-44 w-full rounded-xl object-cover"
                width={640}
                height={360}
                loading="lazy"
                unoptimized
              />
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-white group-open:text-sunset">{subsector.name}</h3>
                <p className="mt-1 text-sm text-slate-300">
                  {subsector.routes.length} {subsector.routes.length === 1 ? 'ruta' : 'rutas'}
                </p>
              </div>
            </summary>

            {subsector.routes.length ? (
              <ul className="mt-4 border-t border-slate-700/50 pt-2">
                {subsector.routes.map((route) => (
                  <RouteRow key={route.id ?? `${subsector.id}-${route.name}`} route={route} />
                ))}
              </ul>
            ) : (
              <p className="mt-4 border-t border-slate-700/50 pt-4 text-sm text-slate-400">
                Sin vías registradas en este subsector.
              </p>
            )}
          </details>
        );
      })}
    </div>
  );
}
