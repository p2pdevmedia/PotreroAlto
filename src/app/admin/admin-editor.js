'use client';

import { useMemo, useState } from 'react';

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
const ADMIN_VIEWS = [
  { id: 'sectors', label: 'Sectores' },
  { id: 'subsectors', label: 'Subsectores' },
  { id: 'routes', label: 'Vías' }
];

function routeSectorFromSubsectorId(subsectorId) {
  if (!subsectorId) {
    return 'subsector';
  }

  return String(subsectorId).replace(/^(fallback-|subsector-)/, '') || 'subsector';
}

function splitRouteId(routeId, defaultRouteSector) {
  const normalized = String(routeId ?? '').trim();
  const matched = normalized.match(/^(.*?)-(\d+)$/);

  if (matched) {
    return {
      fallbackSector: matched[1] || defaultRouteSector,
      routeNumber: matched[2]
    };
  }

  return {
    fallbackSector: normalized || defaultRouteSector,
    routeNumber: ''
  };
}

function buildRouteId(fallbackSector, routeNumber) {
  const normalizedFallbackSector = String(fallbackSector ?? '').trim() || 'subsector';
  const normalizedRouteNumber = String(routeNumber ?? '').replace(/\D/g, '');

  return normalizedRouteNumber ? `${normalizedFallbackSector}-${normalizedRouteNumber}` : normalizedFallbackSector;
}

function normalizeCoordinate(value) {
  const parsed = Number.parseFloat(String(value ?? '').replace(',', '.').trim());

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function buildGoogleMapsUrl(latitude, longitude) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

const DEFAULT_SECTOR_INFO = {
  name: 'Potrero Alto',
  location: 'San Luis, Argentina',
  description: ''
};

export default function AdminEditor() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [subsectors, setSubsectors] = useState([]);
  const [sectorInfo, setSectorInfo] = useState(DEFAULT_SECTOR_INFO);
  const [selectedSubsectorId, setSelectedSubsectorId] = useState(null);
  const [selectedRouteSubsectorId, setSelectedRouteSubsectorId] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [activeView, setActiveView] = useState('sectors');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaveResult, setLastSaveResult] = useState('idle');
  const [locatingRouteId, setLocatingRouteId] = useState('');

  const selectedSubsector = useMemo(
    () => subsectors.find((subsector) => subsector.id === selectedSubsectorId) ?? null,
    [selectedSubsectorId, subsectors]
  );

  const selectedRouteSubsector = useMemo(
    () => subsectors.find((subsector) => subsector.id === selectedRouteSubsectorId) ?? null,
    [selectedRouteSubsectorId, subsectors]
  );

  const selectedRoute = useMemo(
    () => (selectedRouteSubsector?.routes ?? []).find((route) => route.id === selectedRouteId) ?? null,
    [selectedRouteId, selectedRouteSubsector]
  );

  const sectorOptions = useMemo(() => {
    const options = Array.from(new Set(subsectors.map((subsector) => String(subsector.sector ?? '').trim()).filter(Boolean)));

    if (!options.length) {
      return ['Potrero Alto'];
    }

    return options;
  }, [subsectors]);

  const routeSectorOptions = useMemo(
    () => Array.from(new Set(subsectors.map((subsector) => routeSectorFromSubsectorId(subsector.id)).filter(Boolean))),
    [subsectors]
  );

  const authHeaders = useMemo(() => ({ 'x-admin-password': password }), [password]);
  const hasFeedback = Boolean(error || message);

  const saveButtonLabel = useMemo(() => {
    if (saving) {
      return 'Guardando...';
    }

    if (lastSaveResult === 'success') {
      return 'Guardado con éxito ✅';
    }

    if (lastSaveResult === 'error') {
      return 'Error al guardar ❌';
    }

    return 'Guardar cambios';
  }, [lastSaveResult, saving]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/database', { headers: authHeaders });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? 'No se pudo validar el password.');
      }

      const nextSubsectors = Array.isArray(payload.subsectors) ? payload.subsectors : [];
      const firstSubsectorId = nextSubsectors[0]?.id ?? null;

      setSectorInfo({
        name: payload?.name || DEFAULT_SECTOR_INFO.name,
        location: payload?.location || DEFAULT_SECTOR_INFO.location,
        description: payload?.description || ''
      });
      setSubsectors(nextSubsectors);
      setSelectedSubsectorId(firstSubsectorId);
      setSelectedRouteSubsectorId(firstSubsectorId);
      setSelectedRouteId(nextSubsectors[0]?.routes?.[0]?.id ?? null);
      setAuthenticated(true);
      setLastSaveResult('idle');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Error desconocido de autenticación.');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const updateSubsector = (subsectorId, field, value) => {
    setSubsectors((current) =>
      current.map((subsector) => (subsector.id === subsectorId ? { ...subsector, [field]: value } : subsector))
    );
  };

  const updateSubsectorId = (subsectorId, value) => {
    setSubsectors((current) => current.map((subsector) => (subsector.id === subsectorId ? { ...subsector, id: value } : subsector)));

    if (selectedSubsectorId === subsectorId) {
      setSelectedSubsectorId(value);
    }

    if (selectedRouteSubsectorId === subsectorId) {
      setSelectedRouteSubsectorId(value);
    }
  };

  const updateRoute = (subsectorId, routeId, field, value) => {
    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== subsectorId) {
          return subsector;
        }

        return {
          ...subsector,
          routes: (subsector.routes ?? []).map((route) => (route.id === routeId ? { ...route, [field]: value } : route))
        };
      })
    );
  };

  const addSubsector = () => {
    const id = createId('subsector');
    const next = {
      id,
      name: 'Nuevo subsector',
      sector: 'Potrero Alto',
      description: '',
      image: '',
      routes: []
    };

    setSubsectors((current) => [...current, next]);
    setSelectedSubsectorId(id);
    setSelectedRouteSubsectorId(id);
    setSelectedRouteId(null);
    setActiveView('subsectors');
  };

  const removeSubsector = (subsectorId) => {
    setSubsectors((current) => {
      const remaining = current.filter((subsector) => subsector.id !== subsectorId);

      if (selectedSubsectorId === subsectorId) {
        setSelectedSubsectorId(remaining[0]?.id ?? null);
      }

      if (selectedRouteSubsectorId === subsectorId) {
        setSelectedRouteSubsectorId(remaining[0]?.id ?? null);
        setSelectedRouteId(remaining[0]?.routes?.[0]?.id ?? null);
      }

      return remaining;
    });
  };

  const addRoute = (subsectorId) => {
    let createdRouteId = null;

    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== subsectorId) {
          return subsector;
        }

        const routeSector = routeSectorFromSubsectorId(subsectorId);
        const nextRouteNumber = String((subsector.routes ?? []).length + 1);
        const newRoute = { ...EMPTY_ROUTE, id: buildRouteId(routeSector, nextRouteNumber) };
        createdRouteId = newRoute.id;

        return { ...subsector, routes: [...(subsector.routes ?? []), newRoute] };
      })
    );

    setSelectedRouteSubsectorId(subsectorId);
    setSelectedRouteId(createdRouteId);
    setActiveView('routes');
  };

  const updateRouteIdPart = (subsectorId, routeId, field, value) => {
    const defaultFallbackSector = routeSectorFromSubsectorId(subsectorId);
    const partKey = field === 'fallbackSector' ? 'fallbackSector' : 'routeNumber';

    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== subsectorId) {
          return subsector;
        }

        return {
          ...subsector,
          routes: (subsector.routes ?? []).map((route) => {
            if (route.id !== routeId) {
              return route;
            }

            const currentParts = splitRouteId(route.id, defaultFallbackSector);
            const nextParts = {
              ...currentParts,
              [partKey]: value
            };
            const nextRouteId = buildRouteId(nextParts.fallbackSector, nextParts.routeNumber);

            if (selectedRouteId === route.id) {
              setSelectedRouteId(nextRouteId);
            }

            return {
              ...route,
              id: nextRouteId
            };
          })
        };
      })
    );
  };

  const removeRoute = (subsectorId, routeId) => {
    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== subsectorId) {
          return subsector;
        }

        const remainingRoutes = (subsector.routes ?? []).filter((route) => route.id !== routeId);

        if (selectedRouteSubsectorId === subsectorId && selectedRouteId === routeId) {
          setSelectedRouteId(remainingRoutes[0]?.id ?? null);
        }

        return { ...subsector, routes: remainingRoutes };
      })
    );
  };

  const captureRouteLocation = (subsectorId, routeId) => {
    setError('');
    setMessage('');

    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      setError('Este dispositivo no soporta geolocalización.');
      return;
    }

    setLocatingRouteId(routeId);

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateRoute(subsectorId, routeId, 'latitude', String(latitude));
        updateRoute(subsectorId, routeId, 'longitude', String(longitude));
        setMessage('Ubicación capturada para la vía.');
        setLocatingRouteId('');
      },
      () => {
        setError('No se pudo obtener la ubicación. Verificá permisos/GPS.');
        setLocatingRouteId('');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const save = async () => {
    setError('');
    setMessage('');
    setSaving(true);
    setLastSaveResult('idle');

    try {
      const response = await fetch('/api/admin/database', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...sectorInfo,
          subsectors
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? 'No se pudo guardar.');
      }

      const refreshResponse = await fetch('/api/admin/database', { headers: authHeaders });
      const refreshPayload = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error(refreshPayload?.error ?? 'Se guardó, pero no se pudo recargar desde la base.');
      }

      const refreshedSubsectors = Array.isArray(refreshPayload.subsectors) ? refreshPayload.subsectors : [];
      setSectorInfo({
        name: refreshPayload?.name || DEFAULT_SECTOR_INFO.name,
        location: refreshPayload?.location || DEFAULT_SECTOR_INFO.location,
        description: refreshPayload?.description || ''
      });
      setSubsectors(refreshedSubsectors);
      setSelectedSubsectorId((currentId) =>
        refreshedSubsectors.some((subsector) => subsector.id === currentId) ? currentId : refreshedSubsectors[0]?.id ?? null
      );
      setSelectedRouteSubsectorId((currentId) =>
        refreshedSubsectors.some((subsector) => subsector.id === currentId) ? currentId : refreshedSubsectors[0]?.id ?? null
      );
      setSelectedRouteId((currentRouteId) => {
        const activeSubsector = refreshedSubsectors.find((subsector) => subsector.id === selectedRouteSubsectorId) ?? refreshedSubsectors[0];
        const nextRoutes = activeSubsector?.routes ?? [];
        return nextRoutes.some((route) => route.id === currentRouteId) ? currentRouteId : nextRoutes[0]?.id ?? null;
      });
      setLastSaveResult('success');
      setMessage(`Guardado exitoso. Subsectores: ${payload.subsectorCount}.`);
    } catch (saveError) {
      setLastSaveResult('error');
      setError(saveError instanceof Error ? saveError.message : 'Error desconocido guardando cambios.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <section className="card space-y-4">
        <h1 className="text-2xl font-bold text-white">Admin de base de datos</h1>
        <p className="text-sm text-slate-300">Entrá con password para editar sectores, subsectores y vías.</p>

        {!authenticated ? (
          <form onSubmit={handleLogin} className="space-y-3">
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
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={addSubsector} className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100">
                + Agregar subsector
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-lg border border-emerald-500/60 bg-emerald-700/20 px-3 py-2 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveButtonLabel}
              </button>
            </div>

            <nav className="flex flex-wrap gap-2 rounded-xl border border-slate-700/70 bg-slate-900/40 p-2">
              {ADMIN_VIEWS.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeView === view.id
                      ? 'bg-slate-200 text-slate-900'
                      : 'border border-slate-700 bg-slate-950/60 text-slate-100 hover:border-slate-500'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </nav>

            {hasFeedback ? (
              <p
                role={error ? 'alert' : 'status'}
                aria-live="polite"
                className={`rounded-lg border px-3 py-2 text-sm ${
                  error
                    ? 'border-red-500/50 bg-red-900/20 text-red-200'
                    : 'border-emerald-500/50 bg-emerald-900/20 text-emerald-200'
                }`}
              >
                {error || message}
              </p>
            ) : null}

            {activeView === 'sectors' ? (
              <section className="grid gap-3 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 md:grid-cols-3">
                <label className="text-sm text-slate-200">
                  Sector (nombre)
                  <input
                    value={sectorInfo.name}
                    onChange={(event) => setSectorInfo((current) => ({ ...current, name: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  />
                </label>
                <label className="text-sm text-slate-200">
                  Ubicación
                  <input
                    value={sectorInfo.location}
                    onChange={(event) => setSectorInfo((current) => ({ ...current, location: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  />
                </label>
                <label className="text-sm text-slate-200 md:col-span-3">
                  Descripción general
                  <textarea
                    value={sectorInfo.description}
                    onChange={(event) => setSectorInfo((current) => ({ ...current, description: event.target.value }))}
                    className="mt-1 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                  />
                </label>
              </section>
            ) : null}

            {activeView === 'subsectors' ? (
              <div className="grid gap-4 md:grid-cols-[280px_1fr]">
                <aside className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-3">
                  <h2 className="mb-2 text-sm font-semibold text-slate-200">Subsectores</h2>
                  <ul className="space-y-2">
                    {subsectors.map((subsector) => (
                      <li key={subsector.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSubsectorId(subsector.id)}
                          className={`w-full rounded-lg px-2 py-2 text-left text-sm ${
                            selectedSubsectorId === subsector.id ? 'bg-slate-200 text-slate-900' : 'bg-slate-800/70 text-slate-100'
                          }`}
                        >
                          {subsector.name || '(sin nombre)'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>

                {selectedSubsector ? (
                  <section className="space-y-4 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="text-sm text-slate-200">
                        ID
                        <input
                          value={selectedSubsector.id ?? ''}
                          onChange={(event) => updateSubsectorId(selectedSubsector.id, event.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                        />
                      </label>
                      <label className="text-sm text-slate-200">
                        Sector
                        <select
                          value={selectedSubsector.sector ?? 'Potrero Alto'}
                          onChange={(event) => updateSubsector(selectedSubsector.id, 'sector', event.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        >
                          {sectorOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm text-slate-200 md:col-span-2">
                        Nombre
                        <input
                          value={selectedSubsector.name ?? ''}
                          onChange={(event) => updateSubsector(selectedSubsector.id, 'name', event.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        />
                      </label>
                    </div>

                    <label className="block text-sm text-slate-200">
                      Descripción
                      <textarea
                        value={selectedSubsector.description ?? ''}
                        onChange={(event) => updateSubsector(selectedSubsector.id, 'description', event.target.value)}
                        className="mt-1 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                      />
                    </label>

                    <label className="block text-sm text-slate-200">
                      Imagen URL
                      <input
                        value={selectedSubsector.image ?? ''}
                        onChange={(event) => updateSubsector(selectedSubsector.id, 'image', event.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removeSubsector(selectedSubsector.id)}
                      className="rounded-lg border border-red-500/60 bg-red-700/20 px-3 py-2 text-sm font-semibold text-red-200"
                    >
                      Eliminar subsector
                    </button>
                  </section>
                ) : (
                  <section className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 text-sm text-slate-300">
                    No hay subsector seleccionado.
                  </section>
                )}
              </div>
            ) : null}

            {activeView === 'routes' ? (
              <div className="grid gap-4 md:grid-cols-[280px_1fr]">
                <aside className="space-y-3 rounded-xl border border-slate-700/70 bg-slate-900/40 p-3">
                  <label className="block text-sm text-slate-200">
                    Subsector
                    <select
                      value={selectedRouteSubsectorId ?? ''}
                      onChange={(event) => {
                        const nextSubsectorId = event.target.value;
                        const nextSubsector = subsectors.find((subsector) => subsector.id === nextSubsectorId) ?? null;
                        setSelectedRouteSubsectorId(nextSubsectorId);
                        setSelectedRouteId(nextSubsector?.routes?.[0]?.id ?? null);
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    >
                      {subsectors.map((subsector) => (
                        <option key={subsector.id} value={subsector.id}>
                          {subsector.name || subsector.id}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => selectedRouteSubsectorId && addRoute(selectedRouteSubsectorId)}
                    disabled={!selectedRouteSubsectorId}
                    className="w-full rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    + Agregar vía
                  </button>

                  <ul className="space-y-2">
                    {(selectedRouteSubsector?.routes ?? []).map((route) => (
                      <li key={route.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedRouteId(route.id)}
                          className={`w-full rounded-lg px-2 py-2 text-left text-sm ${
                            selectedRouteId === route.id ? 'bg-slate-200 text-slate-900' : 'bg-slate-800/70 text-slate-100'
                          }`}
                        >
                          {route.id} · {route.name || '(sin nombre)'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>

                {selectedRoute && selectedRouteSubsector ? (
                  <section className="space-y-4 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
                    {(() => {
                      const latitude = normalizeCoordinate(selectedRoute.latitude);
                      const longitude = normalizeCoordinate(selectedRoute.longitude);
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
                        const defaultFallbackSector = routeSectorFromSubsectorId(selectedRouteSubsector.id);
                        const routeIdParts = splitRouteId(selectedRoute.id, defaultFallbackSector);
                        const routeIdFallbackOptions = Array.from(
                          new Set([...routeSectorOptions, defaultFallbackSector, routeIdParts.fallbackSector].filter(Boolean))
                        );

                        return (
                          <>
                            <select
                              value={routeIdParts.fallbackSector}
                              onChange={(event) =>
                                updateRouteIdPart(selectedRouteSubsector.id, selectedRoute.id, 'fallbackSector', event.target.value)
                              }
                              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                            >
                              {routeIdFallbackOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <input
                              value={routeIdParts.routeNumber}
                              onChange={(event) =>
                                updateRouteIdPart(selectedRouteSubsector.id, selectedRoute.id, 'routeNumber', event.target.value)
                              }
                              placeholder="N° vía"
                              inputMode="numeric"
                              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                            />
                          </>
                        );
                      })()}
                      <input
                        value={selectedRoute.name ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'name', event.target.value)}
                        placeholder="Nombre"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                      <input
                        value={selectedRoute.grade ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'grade', event.target.value)}
                        placeholder="Grado"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                    </div>

                    <div className="grid gap-2 md:grid-cols-4">
                      <select
                        value={selectedRoute.type ?? 'Sport'}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'type', event.target.value)}
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      >
                        {ROUTE_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedRoute.stars ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'stars', event.target.value)}
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
                        value={selectedRoute.lengthMeters ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'lengthMeters', event.target.value)}
                        placeholder="Largo (m)"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                      <input
                        value={selectedRoute.quickdraws ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'quickdraws', event.target.value)}
                        placeholder="Expreses"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                    </div>

                    <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                      <input
                        value={selectedRoute.latitude ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'latitude', event.target.value)}
                        placeholder="Latitud"
                        inputMode="decimal"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                      <input
                        value={selectedRoute.longitude ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'longitude', event.target.value)}
                        placeholder="Longitud"
                        inputMode="decimal"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => captureRouteLocation(selectedRouteSubsector.id, selectedRoute.id)}
                        disabled={locatingRouteId === selectedRoute.id}
                        className="rounded border border-sky-500/60 bg-sky-700/20 px-3 py-1 text-xs font-semibold text-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {locatingRouteId === selectedRoute.id ? 'Ubicando...' : 'Usar mi ubicación'}
                      </button>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        value={selectedRoute.equippedBy ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'equippedBy', event.target.value)}
                        placeholder="Equipada por"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                      <input
                        value={selectedRoute.equippedDate ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'equippedDate', event.target.value)}
                        placeholder="Fecha equipada"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        value={selectedRoute.firstAscentBy ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'firstAscentBy', event.target.value)}
                        placeholder="Primera ascensión por"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                      <input
                        value={selectedRoute.firstAscentDate ?? ''}
                        onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'firstAscentDate', event.target.value)}
                        placeholder="Fecha primera ascensión"
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                      />
                    </div>

                    <input
                      value={selectedRoute.image ?? ''}
                      onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'image', event.target.value)}
                      placeholder="Imagen URL"
                      className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                    />
                    <textarea
                      value={selectedRoute.description ?? ''}
                      onChange={(event) => updateRoute(selectedRouteSubsector.id, selectedRoute.id, 'description', event.target.value)}
                      placeholder="Descripción"
                      className="min-h-16 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeRoute(selectedRouteSubsector.id, selectedRoute.id)}
                      className="rounded border border-red-500/60 bg-red-700/20 px-2 py-1 text-xs font-semibold text-red-200"
                    >
                      Eliminar vía
                    </button>
                  </section>
                ) : (
                  <section className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 text-sm text-slate-300">
                    Seleccioná un subsector y una vía para editar.
                  </section>
                )}
              </div>
            ) : null}
          </div>
        )}

        {!authenticated && error ? <p className="text-sm text-red-300">{error}</p> : null}
        {!authenticated && message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      </section>
    </main>
  );
}
