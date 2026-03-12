'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminFrame, AdminLogin, AdminNav, Feedback } from '@/app/admin/_components/admin-shell';
import useAdminData from '@/app/admin/_hooks/use-admin-data';
import {
  buildGoogleMapsUrl,
  encodePathSegment,
  normalizeCoordinate,
  ROUTE_TYPE_OPTIONS,
  routeSectorFromSubsectorId,
  splitRouteId,
  STAR_OPTIONS,
  buildRouteId
} from '@/app/admin/_lib/admin-utils';

export default function RouteEditorPage({ params }) {
  const subsectorId = decodeURIComponent(params.subsectorId);
  const routeId = decodeURIComponent(params.routeId);
  const router = useRouter();
  const admin = useAdminData();
  const [inputPassword, setInputPassword] = useState('');
  const [locatingRouteId, setLocatingRouteId] = useState('');

  const subsector = useMemo(() => admin.subsectors.find((item) => item.id === subsectorId) ?? null, [admin.subsectors, subsectorId]);
  const route = useMemo(() => (subsector?.routes ?? []).find((item) => item.id === routeId) ?? null, [routeId, subsector]);

  const handleLogin = async (event) => {
    event.preventDefault();
    await admin.login(inputPassword);
  };

  const updateRouteIdPart = (field, value) => {
    if (!subsector || !route) {
      return;
    }

    const defaultFallbackSector = routeSectorFromSubsectorId(subsector.id);
    const partKey = field === 'fallbackSector' ? 'fallbackSector' : 'routeNumber';
    const currentParts = splitRouteId(route.id, defaultFallbackSector);
    const nextParts = {
      ...currentParts,
      [partKey]: value
    };
    const nextRouteId = buildRouteId(nextParts.fallbackSector, nextParts.routeNumber);

    admin.updateRoute(subsector.id, route.id, 'id', nextRouteId);
    router.replace(`/admin/${encodePathSegment(subsector.id)}/${encodePathSegment(nextRouteId)}`);
  };

  const captureRouteLocation = () => {
    if (!subsector || !route) {
      return;
    }

    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      return;
    }

    setLocatingRouteId(route.id);

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        admin.updateRoute(subsector.id, route.id, 'latitude', String(latitude));
        admin.updateRoute(subsector.id, route.id, 'longitude', String(longitude));
        setLocatingRouteId('');
      },
      () => {
        setLocatingRouteId('');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  if (!admin.authenticated) {
    return (
      <AdminFrame title="Admin vía" subtitle="Entrá con password para editar la vía.">
        <AdminLogin onSubmit={handleLogin} password={inputPassword} setPassword={setInputPassword} loading={admin.loading} error={admin.error} />
      </AdminFrame>
    );
  }

  return (
    <AdminFrame
      title={`Vía · ${route?.name ?? routeId}`}
      subtitle="Edición detallada de la vía"
      actions={
        <>
          <button
            type="button"
            onClick={admin.save}
            disabled={admin.saving}
            className="rounded-lg border border-emerald-500/60 bg-emerald-700/20 px-3 py-2 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {admin.saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button type="button" onClick={admin.logout} className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100">
            Salir
          </button>
        </>
      }
    >
      <AdminNav />
      <Feedback error={admin.error} message={admin.message} />

      <p className="text-sm text-slate-300">
        <Link href="/admin" className="underline">
          ← Admin
        </Link>{' '}
        ·{' '}
        <Link href={`/admin/${encodePathSegment(subsectorId)}`} className="underline">
          Subsector
        </Link>
      </p>

      {!subsector || !route ? (
        <section className="rounded-xl border border-red-500/40 bg-red-900/10 p-4 text-sm text-red-200">
          No se encontró la vía <strong>{routeId}</strong> en el subsector <strong>{subsectorId}</strong>.
        </section>
      ) : (
        <section className="space-y-4 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
          {(() => {
            const latitude = normalizeCoordinate(route.latitude);
            const longitude = normalizeCoordinate(route.longitude);
            const hasCoordinates = latitude != null && longitude != null;

            if (!hasCoordinates) {
              return null;
            }

            return (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-emerald-600/40 bg-emerald-950/20 px-2 py-1.5 text-xs text-emerald-100">
                <span>
                  Coordenadas cargadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </span>
                <a
                  href={buildGoogleMapsUrl(latitude, longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-emerald-500/60 bg-emerald-700/20 px-2 py-1 font-semibold"
                >
                  Ver en Google Maps
                </a>
              </div>
            );
          })()}

          <div className="grid gap-2 md:grid-cols-4">
            {(() => {
              const defaultFallbackSector = routeSectorFromSubsectorId(subsector.id);
              const routeIdParts = splitRouteId(route.id, defaultFallbackSector);

              return (
                <>
                  <input
                    value={routeIdParts.fallbackSector}
                    onChange={(event) => updateRouteIdPart('fallbackSector', event.target.value)}
                    className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                  />
                  <input
                    value={routeIdParts.routeNumber}
                    onChange={(event) => updateRouteIdPart('routeNumber', event.target.value)}
                    placeholder="N° vía"
                    inputMode="numeric"
                    className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                  />
                </>
              );
            })()}
            <input
              value={route.name ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'name', event.target.value)}
              placeholder="Nombre"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
            <input
              value={route.grade ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'grade', event.target.value)}
              placeholder="Grado"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
          </div>

          <div className="grid gap-2 md:grid-cols-4">
            <select
              value={route.type ?? 'Sport'}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'type', event.target.value)}
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            >
              {ROUTE_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={route.stars ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'stars', event.target.value)}
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            >
              <option value="">Stars</option>
              {STAR_OPTIONS.filter((option) => option !== '').map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              value={route.lengthMeters ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'lengthMeters', event.target.value)}
              placeholder="Largo (m)"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
            <input
              value={route.quickdraws ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'quickdraws', event.target.value)}
              placeholder="Expreses"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
          </div>

          <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={route.latitude ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'latitude', event.target.value)}
              placeholder="Latitud"
              inputMode="decimal"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
            <input
              value={route.longitude ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'longitude', event.target.value)}
              placeholder="Longitud"
              inputMode="decimal"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
            <button
              type="button"
              onClick={captureRouteLocation}
              disabled={locatingRouteId === route.id}
              className="rounded border border-sky-500/60 bg-sky-700/20 px-3 py-1 text-xs font-semibold text-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {locatingRouteId === route.id ? 'Ubicando...' : 'Usar mi ubicación'}
            </button>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={route.equippedBy ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'equippedBy', event.target.value)}
              placeholder="Equipada por"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
            <input
              value={route.equippedDate ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'equippedDate', event.target.value)}
              placeholder="Fecha equipada"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={route.firstAscentBy ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'firstAscentBy', event.target.value)}
              placeholder="Primera ascensión por"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
            <input
              value={route.firstAscentDate ?? ''}
              onChange={(event) => admin.updateRoute(subsector.id, route.id, 'firstAscentDate', event.target.value)}
              placeholder="Fecha primera ascensión"
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            />
          </div>

          <input
            value={route.image ?? ''}
            onChange={(event) => admin.updateRoute(subsector.id, route.id, 'image', event.target.value)}
            placeholder="Imagen URL"
            className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
          />
          <textarea
            value={route.description ?? ''}
            onChange={(event) => admin.updateRoute(subsector.id, route.id, 'description', event.target.value)}
            placeholder="Descripción"
            className="min-h-16 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
          />

          <button
            type="button"
            onClick={() => {
              admin.removeRoute(subsector.id, route.id);
              router.push(`/admin/${encodePathSegment(subsector.id)}`);
            }}
            className="rounded border border-red-500/60 bg-red-700/20 px-2 py-1 text-xs font-semibold text-red-200"
          >
            Eliminar vía
          </button>
        </section>
      )}
    </AdminFrame>
  );
}
