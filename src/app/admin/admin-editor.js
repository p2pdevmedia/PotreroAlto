'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminLoginSchema, routeSchema, sectorSchema, subsectorSchema } from '@/lib/admin-zod-schemas';

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const EMPTY_ROUTE = {
  id: '',
  name: '',
  grade: '',
  stars: '',
  type: 'Sport',
  description: '',
  lengthMeters: '',
  quickdraws: '',
  image: '',
  equippedBy: '',
  equippedDate: '',
  firstAscentBy: '',
  firstAscentDate: '',
  latitude: '',
  longitude: ''
};

const ROUTE_TYPE_OPTIONS = ['Sport', 'Trad', 'Boulder', 'Proyecto'];
const STAR_OPTIONS = ['', '0', '1', '2', '3', '4', '5'];

const DEFAULT_SECTOR_INFO = {
  name: 'Potrero Alto',
  location: 'San Luis, Argentina',
  description: ''
};

function routeSectorFromSubsectorId(subsectorId) {
  if (!subsectorId) {
    return 'subsector';
  }

  return String(subsectorId).replace(/^(subsector-)/, '') || 'subsector';
}

function splitRouteId(routeId, defaultRouteSector) {
  const normalized = String(routeId ?? '').trim();
  const matched = normalized.match(/^(.*?)-(\d+)$/);

  if (matched) {
    return {
      routeSector: matched[1] || defaultRouteSector,
      routeNumber: matched[2]
    };
  }

  return {
    routeSector: normalized || defaultRouteSector,
    routeNumber: ''
  };
}

function buildRouteId(routeSector, routeNumber) {
  const normalizedRouteSector = String(routeSector ?? '').trim() || 'subsector';
  const normalizedRouteNumber = String(routeNumber ?? '').replace(/\D/g, '');

  return normalizedRouteNumber ? `${normalizedRouteSector}-${normalizedRouteNumber}` : normalizedRouteSector;
}

function normalizeCoordinate(value) {
  const parsed = Number.parseFloat(String(value ?? '').replace(',', '.').trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function buildGoogleMapsUrl(latitude, longitude) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

function ImageField({
  label,
  value,
  onChange,
  availableImages = []
}) {
  const normalizedValue = availableImages.includes(value) ? value : '';
  const hasImage = Boolean(normalizedValue);

  return (
    <div className="space-y-2">
      <label className="block text-sm text-slate-200">
        {label}
        <select
          value={normalizedValue}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        >
          <option value="">Elegir desde /public/images</option>
          {availableImages.map((imagePath) => (
            <option key={imagePath} value={imagePath}>{imagePath}</option>
          ))}
        </select>
      </label>

      {hasImage ? (
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
          <Image
            src={normalizedValue}
            alt={`Previsualización de ${label}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-slate-700 text-xs text-slate-400">
          Sin imagen seleccionada
        </div>
      )}
    </div>
  );
}

export default function AdminEditor({ view = 'subsectors', subsectorId = null, routeId = null, availableImages = [] }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [subsectors, setSubsectors] = useState([]);
  const [sectorInfo, setSectorInfo] = useState(DEFAULT_SECTOR_INFO);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaveResult, setLastSaveResult] = useState('idle');
  const [locatingRouteId, setLocatingRouteId] = useState('');
  const [draftReady, setDraftReady] = useState(false);
  const [draftSubsectorId, setDraftSubsectorId] = useState('');
  const [draftRouteId, setDraftRouteId] = useState('');

  const authHeaders = useMemo(() => ({ 'x-admin-password': password }), [password]);

  const selectedSubsector = useMemo(
    () => {
      if (view === 'new-subsector') {
        return subsectors.find((subsector) => subsector.id === draftSubsectorId) ?? null;
      }

      return subsectors.find((subsector) => subsector.id === subsectorId) ?? null;
    },
    [draftSubsectorId, subsectorId, subsectors, view]
  );

  const selectedRoute = useMemo(
    () => {
      if (view === 'new-route') {
        return (selectedSubsector?.routes ?? []).find((route) => route.id === draftRouteId) ?? null;
      }

      return (selectedSubsector?.routes ?? []).find((route) => route.id === routeId) ?? null;
    },
    [draftRouteId, routeId, selectedSubsector, view]
  );

  const hasFeedback = Boolean(error || message);

  const saveButtonLabel = useMemo(() => {
    if (saving) return 'Guardando...';
    if (lastSaveResult === 'success') return 'Guardado con éxito ✅';
    if (lastSaveResult === 'error') return 'Error al guardar ❌';
    return 'Guardar cambios';
  }, [lastSaveResult, saving]);

  const login = useCallback(async (rawPassword) => {
    const candidate = rawPassword ?? password;
    const parsedLogin = adminLoginSchema.safeParse({ password: candidate });

    if (!parsedLogin.success) {
      setError(parsedLogin.error.issues[0]?.message ?? 'Password inválido.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/database', {
        headers: { 'x-admin-password': candidate }
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? 'No se pudo validar el password.');
      }

      setPassword(candidate);
      setSectorInfo({
        name: payload?.name || DEFAULT_SECTOR_INFO.name,
        location: payload?.location || DEFAULT_SECTOR_INFO.location,
        description: payload?.description || ''
      });
      const normalizedSubsectors = Array.isArray(payload.subsectors)
        ? payload.subsectors.map((subsector) => ({
            ...subsector,
            image: availableImages.includes(subsector?.image) ? subsector.image : '',
            routes: Array.isArray(subsector?.routes)
              ? subsector.routes.map((route) => ({
                  ...route,
                  image: availableImages.includes(route?.image) ? route.image : ''
                }))
              : []
          }))
        : [];
      setSubsectors(normalizedSubsectors);
      setAuthenticated(true);
      setLastSaveResult('idle');
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('potrero-admin-password', candidate);
      }
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Error desconocido de autenticación.');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [availableImages, password]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedPassword = window.sessionStorage.getItem('potrero-admin-password');
    if (savedPassword) {
      setPassword(savedPassword);
      login(savedPassword);
    }
  }, [login]);

  const updateSubsector = (currentSubsectorId, field, value) => {
    setSubsectors((current) =>
      current.map((subsector) => (subsector.id === currentSubsectorId ? { ...subsector, [field]: value } : subsector))
    );
  };

  const updateRoute = (currentSubsectorId, currentRouteId, field, value) => {
    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== currentSubsectorId) return subsector;

        return {
          ...subsector,
          routes: (subsector.routes ?? []).map((route) => (route.id === currentRouteId ? { ...route, [field]: value } : route))
        };
      })
    );
  };

  const removeSubsector = (currentSubsectorId) => {
    setSubsectors((current) => current.filter((subsector) => subsector.id !== currentSubsectorId));
    setMessage('Subsector eliminado de la edición actual.');
  };

  const updateRouteIdPart = (currentSubsectorId, currentRouteId, field, value) => {
    const defaultRouteSector = routeSectorFromSubsectorId(currentSubsectorId);
    const partKey = field === 'routeSector' ? 'routeSector' : 'routeNumber';

    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== currentSubsectorId) {
          return subsector;
        }

        return {
          ...subsector,
          routes: (subsector.routes ?? []).map((route) => {
            if (route.id !== currentRouteId) {
              return route;
            }

            const currentParts = splitRouteId(route.id, defaultRouteSector);
            const nextParts = { ...currentParts, [partKey]: value };

            return { ...route, id: buildRouteId(nextParts.routeSector, nextParts.routeNumber) };
          })
        };
      })
    );
  };

  const removeRoute = (currentSubsectorId, currentRouteId) => {
    setSubsectors((current) =>
      current.map((subsector) =>
        subsector.id === currentSubsectorId
          ? { ...subsector, routes: (subsector.routes ?? []).filter((route) => route.id !== currentRouteId) }
          : subsector
      )
    );
    setMessage('Vía eliminada de la edición actual.');
  };

  const captureRouteLocation = (currentSubsectorId, currentRouteId) => {
    setError('');
    setMessage('');

    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      setError('Este dispositivo no soporta geolocalización.');
      return;
    }

    setLocatingRouteId(currentRouteId);

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        updateRoute(currentSubsectorId, currentRouteId, 'latitude', String(position.coords.latitude));
        updateRoute(currentSubsectorId, currentRouteId, 'longitude', String(position.coords.longitude));
        setMessage('Ubicación capturada para la vía.');
        setLocatingRouteId('');
      },
      () => {
        setError('No se pudo obtener la ubicación. Verificá permisos/GPS.');
        setLocatingRouteId('');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const save = async () => {
    setError('');
    setMessage('');
    setSaving(true);
    setLastSaveResult('idle');

    try {
      let savePayload = null;

      if (view === 'route' && selectedSubsector && selectedRoute) {
        savePayload = {
          mode: 'route',
          route: {
            ...selectedRoute,
            subsectorId: selectedSubsector.id
          }
        };
      } else if (view === 'subsector' && selectedSubsector) {
        savePayload = {
          mode: 'subsector',
          subsector: selectedSubsector
        };
      } else {
        savePayload = {
          mode: 'sector',
          sector: sectorInfo
        };
      }

      if (view === 'route' && selectedSubsector && selectedRoute) {
        const parsedRoute = routeSchema.safeParse(selectedRoute);
        if (!parsedRoute.success) {
          throw new Error(parsedRoute.error.issues[0]?.message ?? 'La vía tiene datos inválidos.');
        }
      } else if (view === 'subsector' && selectedSubsector) {
        const parsedSubsector = subsectorSchema.safeParse(selectedSubsector);
        if (!parsedSubsector.success) {
          throw new Error(parsedSubsector.error.issues[0]?.message ?? 'El subsector tiene datos inválidos.');
        }
      } else {
        const parsedSector = sectorSchema.safeParse(sectorInfo);
        if (!parsedSector.success) {
          throw new Error(parsedSector.error.issues[0]?.message ?? 'El sector tiene datos inválidos.');
        }
      }

      const response = await fetch('/api/admin/database', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(savePayload)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? 'No se pudo guardar.');
      }

      setLastSaveResult('success');
      if (payload?.mode === 'route') {
        setMessage('Vía guardada correctamente.');
      } else if (payload?.mode === 'subsector') {
        setMessage('Subsector guardado correctamente.');
      } else if (payload?.mode === 'sector') {
        setMessage('Datos del sector guardados correctamente.');
      } else {
        setMessage(`Guardado exitoso. Subsectores: ${payload?.subsectorCount ?? 0}.`);
      }
      await login(password);
    } catch (saveError) {
      setLastSaveResult('error');
      setError(saveError instanceof Error ? saveError.message : 'Error desconocido guardando cambios.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!authenticated || !subsectors.length) {
      return;
    }

    if (view === 'new-subsector' && !draftReady) {
      const draftId = createId('subsector');
      setSubsectors((current) => {
        if (current.some((subsector) => subsector.id === draftId)) {
          return current;
        }

        return [
          ...current,
          { id: draftId, name: 'Nuevo subsector', sector: 'Potrero Alto', description: '', image: '', routes: [] }
        ];
      });
      setDraftSubsectorId(draftId);
      setDraftReady(true);
      setMessage('Subsector creado. Completá el formulario y guardá cambios.');
      return;
    }

    if (view === 'new-route' && selectedSubsector && !draftReady) {
      const routeSector = routeSectorFromSubsectorId(selectedSubsector.id);
      const nextIndex = Math.max(1, (selectedSubsector.routes ?? []).length + 1);
      const newId = `${routeSector}-${nextIndex}`;

      setSubsectors((current) =>
        current.map((subsector) =>
          subsector.id === selectedSubsector.id
            ? { ...subsector, routes: [...(subsector.routes ?? []), { ...EMPTY_ROUTE, id: newId, name: 'Nueva vía' }] }
            : subsector
        )
      );
      setDraftRouteId(newId);
      setDraftReady(true);
      setMessage('Vía agregada. Completá el formulario y guardá cambios.');
    }
  }, [authenticated, draftReady, selectedSubsector, subsectors.length, view]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <section className="card space-y-4">
        <h1 className="text-2xl font-bold text-white">Admin de base de datos</h1>
        <p className="text-sm text-slate-300">Flujo modular: Subsectores → vías → edición de vía.</p>

        {!authenticated ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              login();
            }}
            className="space-y-3"
          >
            <label className="block text-sm text-slate-200">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              />
            </label>
            <button
              type="submit"
              disabled={loading || !password}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100"
            >
              {loading ? 'Validando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <>
            <nav className="flex flex-wrap gap-2 text-sm">
              <Link href="/admin" className="rounded border border-slate-600 px-3 py-1 text-slate-200">
                Subsectores
              </Link>
              {selectedSubsector ? (
                <Link href={`/admin/${selectedSubsector.id}`} className="rounded border border-slate-600 px-3 py-1 text-slate-200">
                  Subsector actual
                </Link>
              ) : null}
              {selectedSubsector && selectedRoute ? (
                <Link
                  href={`/admin/${selectedSubsector.id}/${selectedRoute.id}`}
                  className="rounded border border-slate-600 px-3 py-1 text-slate-200"
                >
                  Vía actual
                </Link>
              ) : null}
            </nav>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={save} disabled={saving} className="rounded-lg border border-emerald-500/60 bg-emerald-700/20 px-3 py-2 text-sm font-semibold text-emerald-100">
                {saveButtonLabel}
              </button>
              <Link href="/admin/new-subsector" className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100">
                + Agregar subsector
              </Link>
            </div>

            {view === 'subsectors' ? (
              <section className="space-y-4">
                <div className="grid gap-3 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 md:grid-cols-3">
                  <label className="text-sm text-slate-200">
                    Sector (nombre)
                    <input value={sectorInfo.name} onChange={(event) => setSectorInfo((current) => ({ ...current, name: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                  </label>
                  <label className="text-sm text-slate-200">
                    Ubicación
                    <input value={sectorInfo.location} onChange={(event) => setSectorInfo((current) => ({ ...current, location: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                  </label>
                  <label className="text-sm text-slate-200 md:col-span-3">
                    Descripción general
                    <textarea value={sectorInfo.description} onChange={(event) => setSectorInfo((current) => ({ ...current, description: event.target.value }))} className="mt-1 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                  </label>
                </div>

                <ul className="space-y-2 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
                  {subsectors.map((subsector) => (
                    <li key={subsector.id} className="rounded border border-slate-700 transition-colors hover:border-slate-500 hover:bg-slate-800/60">
                      <Link href={`/admin/${subsector.id}`} className="block px-3 py-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-100">{subsector.name || '(sin nombre)'}</p>
                            <p className="text-xs text-slate-400">ID: {subsector.id}</p>
                            <p className="text-xs text-slate-300">Sector: {subsector.sector || 'Potrero Alto'}</p>
                            <p className="text-xs text-slate-400">Vías cargadas: {(subsector.routes ?? []).length}</p>
                            <p className="text-xs text-slate-300">
                              Descripción: {subsector.description?.trim() ? subsector.description : 'Sin descripción'}
                            </p>
                            <p className="text-xs text-slate-400">Foto: {subsector.image?.trim() ? subsector.image : 'Sin foto'}</p>
                          </div>

                          {subsector.image?.trim() ? (
                            <Image
                              src={subsector.image}
                              alt={`Foto del subsector ${subsector.name || subsector.id}`}

                              width={80}
                              height={80}
                              className="h-16 w-16 shrink-0 rounded-lg border border-sunset/60 object-cover"

                              unoptimized
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[10px] uppercase tracking-wide text-slate-400">
                              SIN FOTO
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {view === 'subsector' || view === 'new-subsector' ? (
              selectedSubsector ? (
                <section className="space-y-4 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
                  <h2 className="text-lg font-semibold text-slate-100">
                    {view === 'new-subsector' ? 'Nuevo subsector' : `Editar subsector: ${selectedSubsector.name || selectedSubsector.id}`}
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-sm text-slate-200">
                      ID
                      <input value={selectedSubsector.id ?? ''} onChange={(event) => updateSubsector(selectedSubsector.id, 'id', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100" />
                    </label>
                    <label className="text-sm text-slate-200">
                      Nombre
                      <input value={selectedSubsector.name ?? ''} onChange={(event) => updateSubsector(selectedSubsector.id, 'name', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                    </label>
                  </div>
                  <label className="block text-sm text-slate-200">
                    Descripción
                    <textarea value={selectedSubsector.description ?? ''} onChange={(event) => updateSubsector(selectedSubsector.id, 'description', event.target.value)} className="mt-1 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                  </label>
                  <ImageField
                    label="Imagen del subsector"
                    value={selectedSubsector.image ?? ''}
                    onChange={(nextValue) => updateSubsector(selectedSubsector.id, 'image', nextValue)}
                    availableImages={availableImages}
                  />
                  <Link href={`/admin/${selectedSubsector.id}/new-route`} className="inline-block rounded border border-slate-500 px-3 py-1 text-sm text-slate-100">
                    + Agregar vía
                  </Link>
                  <ul className="space-y-2">
                    {(selectedSubsector.routes ?? []).map((route) => (
                      <li key={route.id} className="rounded border border-slate-700 p-2 transition-colors hover:border-slate-500 hover:bg-slate-800/60">
                        <div className="flex items-start gap-3">
                          <Link href={`/admin/${selectedSubsector.id}/${route.id}`} className="block flex-1 rounded px-1 py-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-100">{route.name || '(sin nombre)'}</p>
                                <p className="text-xs text-slate-400">ID: {route.id}</p>
                                <p className="text-xs text-slate-300">Grado: {route.grade || 'Sin grado'} · Tipo: {route.type || 'Sport'} · Estrellas: {route.stars ?? 'Sin dato'}</p>
                                <p className="text-xs text-slate-400">Largo: {route.lengthMeters ?? 'Sin dato'} m · Chapas: {route.quickdraws ?? 'Sin dato'}</p>
                                <p className="text-xs text-slate-300">Descripción: {route.description?.trim() ? route.description : 'Sin descripción'}</p>
                              </div>

                              {route.image?.trim() ? (
                                <Image
                                  src={route.image}
                                  alt={`Foto de la vía ${route.name || route.id}`}
                                  width={80}
                                  height={80}
                                  className="h-16 w-16 shrink-0 rounded-lg border border-sunset/60 object-cover"

                                  unoptimized
                                />
                              ) : (
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[10px] uppercase tracking-wide text-slate-400">
                                  SIN FOTO
                                </div>
                              )}
                            </div>
                          </Link>

                          <button type="button" onClick={() => removeRoute(selectedSubsector.id, route.id)} className="rounded border border-red-500/60 bg-red-700/20 px-2 py-1 text-xs font-semibold text-red-200">Eliminar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => removeSubsector(selectedSubsector.id)} className="rounded-lg border border-red-500/60 bg-red-700/20 px-3 py-2 text-sm font-semibold text-red-100">
                    Eliminar subsector
                  </button>
                </section>
              ) : (
                <p className="text-sm text-slate-300">Subsector no encontrado.</p>
              )
            ) : null}

            {view === 'route' || view === 'new-route' ? (
              selectedSubsector && selectedRoute ? (
                <section className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
                  <h2 className="mb-3 text-lg font-semibold text-slate-100">
                    {view === 'new-route' ? `Nueva vía en ${selectedSubsector.name || selectedSubsector.id}` : `Editar vía: ${selectedRoute.name || selectedRoute.id}`}
                  </h2>
                  {(() => {
                    const defaultRouteSector = routeSectorFromSubsectorId(selectedSubsector.id);
                    const routeIdParts = splitRouteId(selectedRoute.id, defaultRouteSector);
                    const latitude = normalizeCoordinate(selectedRoute.latitude);
                    const longitude = normalizeCoordinate(selectedRoute.longitude);
                    const hasValidCoordinates = latitude !== null && longitude !== null;

                    return (
                      <>
                        <div className="mb-2 grid gap-2 md:grid-cols-[1fr_140px]">
                          <input value={routeIdParts.routeSector} onChange={(event) => updateRouteIdPart(selectedSubsector.id, selectedRoute.id, 'routeSector', event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100" />
                          <input value={routeIdParts.routeNumber} onChange={(event) => updateRouteIdPart(selectedSubsector.id, selectedRoute.id, 'routeNumber', event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100" />
                        </div>
                        <input value={selectedRoute.name ?? ''} onChange={(event) => updateRoute(selectedSubsector.id, selectedRoute.id, 'name', event.target.value)} placeholder="Nombre" className="mb-2 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100" />
                        <div className="mb-2 grid gap-2 md:grid-cols-4">
                          <input value={selectedRoute.grade ?? ''} onChange={(event) => updateRoute(selectedSubsector.id, selectedRoute.id, 'grade', event.target.value)} placeholder="Grado" className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100" />
                          <select value={selectedRoute.stars ?? ''} onChange={(event) => updateRoute(selectedSubsector.id, selectedRoute.id, 'stars', event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100">
                            {STAR_OPTIONS.map((starOption) => <option key={starOption} value={starOption}>{starOption || 'Sin estrellas'}</option>)}
                          </select>
                          <select value={selectedRoute.type ?? 'Sport'} onChange={(event) => updateRoute(selectedSubsector.id, selectedRoute.id, 'type', event.target.value)} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100">
                            {ROUTE_TYPE_OPTIONS.map((typeOption) => <option key={typeOption} value={typeOption}>{typeOption}</option>)}
                          </select>
                          <input value={selectedRoute.lengthMeters ?? ''} onChange={(event) => updateRoute(selectedSubsector.id, selectedRoute.id, 'lengthMeters', event.target.value)} placeholder="Largo (m)" className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100" />
                        </div>
                        <div className="mb-2">
                          <ImageField
                            label="Imagen de la vía"
                            value={selectedRoute.image ?? ''}
                            onChange={(nextValue) => updateRoute(selectedSubsector.id, selectedRoute.id, 'image', nextValue)}
                            availableImages={availableImages}
                          />
                        </div>
                        <div className="mb-2 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                          <input value={selectedRoute.latitude ?? ''} onChange={(event) => updateRoute(selectedSubsector.id, selectedRoute.id, 'latitude', event.target.value)} placeholder="Latitud" className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100" />
                          <input value={selectedRoute.longitude ?? ''} onChange={(event) => updateRoute(selectedSubsector.id, selectedRoute.id, 'longitude', event.target.value)} placeholder="Longitud" className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100" />
                          <button type="button" onClick={() => captureRouteLocation(selectedSubsector.id, selectedRoute.id)} disabled={locatingRouteId === selectedRoute.id} className="rounded border border-sky-500/60 bg-sky-700/20 px-3 py-1 text-xs font-semibold text-sky-100 disabled:cursor-not-allowed disabled:opacity-60">{locatingRouteId === selectedRoute.id ? 'Ubicando...' : 'Usar mi ubicación'}</button>
                        </div>
                        {hasValidCoordinates ? <a href={buildGoogleMapsUrl(latitude, longitude)} target="_blank" rel="noreferrer" className="mb-2 inline-block text-xs text-sky-300 underline">Ver en Google Maps</a> : null}
                        <textarea value={selectedRoute.description ?? ''} onChange={(event) => updateRoute(selectedSubsector.id, selectedRoute.id, 'description', event.target.value)} placeholder="Descripción" className="mb-2 min-h-16 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100" />
                      </>
                    );
                  })()}
                </section>
              ) : (
                <p className="text-sm text-slate-300">Vía no encontrada.</p>
              )
            ) : null}
          </>
        )}

        {hasFeedback ? (
          <p
            role={error ? 'alert' : 'status'}
            aria-live="polite"
            className={`rounded-lg border px-3 py-2 text-sm ${
              error ? 'border-red-500/50 bg-red-900/20 text-red-200' : 'border-emerald-500/50 bg-emerald-900/20 text-emerald-200'
            }`}
          >
            {error || message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
