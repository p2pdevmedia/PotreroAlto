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
  firstAscentDate: ''
};

const ROUTE_TYPE_OPTIONS = ['Sport', 'Trad', 'Boulder', 'Proyecto'];
const STAR_OPTIONS = ['', '0', '1', '2', '3', '4', '5'];

function fallbackSectorFromSubsectorId(subsectorId) {
  if (!subsectorId) {
    return 'subsector';
  }

  return String(subsectorId).replace(/^fallback-/, '') || 'subsector';
}

function splitRouteId(routeId, defaultFallbackSector) {
  const normalized = String(routeId ?? '').trim();
  const matched = normalized.match(/^(.*?)-(\d+)$/);

  if (matched) {
    return {
      fallbackSector: matched[1] || defaultFallbackSector,
      routeNumber: matched[2]
    };
  }

  return {
    fallbackSector: normalized || defaultFallbackSector,
    routeNumber: ''
  };
}

function buildRouteId(fallbackSector, routeNumber) {
  const normalizedFallbackSector = String(fallbackSector ?? '').trim() || 'subsector';
  const normalizedRouteNumber = String(routeNumber ?? '').replace(/\D/g, '');

  return normalizedRouteNumber ? `${normalizedFallbackSector}-${normalizedRouteNumber}` : normalizedFallbackSector;
}

export default function AdminEditor() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [subsectors, setSubsectors] = useState([]);
  const [selectedSubsectorId, setSelectedSubsectorId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedSubsector = useMemo(
    () => subsectors.find((subsector) => subsector.id === selectedSubsectorId) ?? null,
    [selectedSubsectorId, subsectors]
  );

  const sectorOptions = useMemo(() => {
    const options = Array.from(new Set(subsectors.map((subsector) => String(subsector.sector ?? '').trim()).filter(Boolean)));

    if (!options.length) {
      return ['Potrero Alto'];
    }

    return options;
  }, [subsectors]);

  const fallbackSectorOptions = useMemo(
    () =>
      Array.from(
        new Set(subsectors.map((subsector) => fallbackSectorFromSubsectorId(subsector.id)).filter(Boolean))
      ),
    [subsectors]
  );

  const authHeaders = useMemo(() => ({ 'x-admin-password': password }), [password]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/fallback', { headers: authHeaders });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? 'No se pudo validar el password.');
      }

      const nextSubsectors = Array.isArray(payload.subsectors) ? payload.subsectors : [];
      setSubsectors(nextSubsectors);
      setSelectedSubsectorId(nextSubsectors[0]?.id ?? null);
      setAuthenticated(true);
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
    const id = createId('fallback-subsector');
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
  };

  const removeSubsector = (subsectorId) => {
    setSubsectors((current) => current.filter((subsector) => subsector.id !== subsectorId));

    if (selectedSubsectorId === subsectorId) {
      const remaining = subsectors.filter((subsector) => subsector.id !== subsectorId);
      setSelectedSubsectorId(remaining[0]?.id ?? null);
    }
  };

  const addRoute = (subsectorId) => {
    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== subsectorId) {
          return subsector;
        }

        const fallbackSector = fallbackSectorFromSubsectorId(subsectorId);
        const nextRouteNumber = String((subsector.routes ?? []).length + 1);
        const newRoute = { ...EMPTY_ROUTE, id: buildRouteId(fallbackSector, nextRouteNumber) };

        return { ...subsector, routes: [...(subsector.routes ?? []), newRoute] };
      })
    );
  };

  const updateRouteIdPart = (subsectorId, routeId, field, value) => {
    const defaultFallbackSector = fallbackSectorFromSubsectorId(subsectorId);
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

            return {
              ...route,
              id: buildRouteId(nextParts.fallbackSector, nextParts.routeNumber)
            };
          })
        };
      })
    );
  };

  const removeRoute = (subsectorId, routeId) => {
    setSubsectors((current) =>
      current.map((subsector) =>
        subsector.id === subsectorId
          ? { ...subsector, routes: (subsector.routes ?? []).filter((route) => route.id !== routeId) }
          : subsector
      )
    );
  };

  const save = async () => {
    setError('');
    setMessage('');
    setSaving(true);

    try {
      const response = await fetch('/api/admin/fallback', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subsectors })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? 'No se pudo guardar.');
      }

      setMessage(`Guardado exitoso. Subsectores: ${payload.subsectorCount}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Error desconocido guardando cambios.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <section className="card space-y-4">
        <h1 className="text-2xl font-bold text-white">Admin de fallback</h1>
        <p className="text-sm text-slate-300">Entrá con password para editar subsectores y vías.</p>

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
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[280px_1fr]">
              <aside className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-3">
                <h2 className="mb-2 text-sm font-semibold text-slate-200">Subsectores</h2>
                <ul className="space-y-2">
                  {subsectors.map((subsector) => (
                    <li key={subsector.id} className="space-y-1">
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
                        onChange={(event) => updateSubsector(selectedSubsector.id, 'id', event.target.value)}
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
                    <label className="text-sm text-slate-200">
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
                    Imagen (URL)
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

                  <div className="space-y-3 border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-100">Vías</h3>
                      <button
                        type="button"
                        onClick={() => addRoute(selectedSubsector.id)}
                        className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100"
                      >
                        + Agregar vía
                      </button>
                    </div>

                    {(selectedSubsector.routes ?? []).map((route) => (
                      <article key={route.id} className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
                        <div className="mb-2 grid gap-2 md:grid-cols-4">
                          {(() => {
                            const defaultFallbackSector = fallbackSectorFromSubsectorId(selectedSubsector.id);
                            const routeIdParts = splitRouteId(route.id, defaultFallbackSector);
                            const routeIdFallbackOptions = Array.from(
                              new Set([...fallbackSectorOptions, defaultFallbackSector, routeIdParts.fallbackSector].filter(Boolean))
                            );

                            return (
                              <>
                                <select
                                  value={routeIdParts.fallbackSector}
                                  onChange={(event) =>
                                    updateRouteIdPart(selectedSubsector.id, route.id, 'fallbackSector', event.target.value)
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
                                    updateRouteIdPart(selectedSubsector.id, route.id, 'routeNumber', event.target.value)
                                  }
                                  placeholder="N° vía"
                                  inputMode="numeric"
                                  className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                                />
                              </>
                            );
                          })()}
                          <input
                            value={route.name ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'name', event.target.value)}
                            placeholder="Nombre"
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          />
                          <input
                            value={route.grade ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'grade', event.target.value)}
                            placeholder="Grado"
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          />
                          <select
                            value={route.stars ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'stars', event.target.value)}
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          >
                            <option value="">Stars</option>
                            {STAR_OPTIONS.filter((option) => option !== '').map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2 grid gap-2 md:grid-cols-3">
                          <select
                            value={route.type ?? 'Sport'}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'type', event.target.value)}
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          >
                            {ROUTE_TYPE_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <input
                            value={route.lengthMeters ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'lengthMeters', event.target.value)}
                            placeholder="Largo (m)"
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          />
                          <input
                            value={route.quickdraws ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'quickdraws', event.target.value)}
                            placeholder="Expreses"
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          />
                        </div>
                        <div className="mb-2 grid gap-2 md:grid-cols-2">
                          <input
                            value={route.equippedBy ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'equippedBy', event.target.value)}
                            placeholder="Equipada por"
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          />
                          <input
                            value={route.equippedDate ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'equippedDate', event.target.value)}
                            placeholder="Fecha equipada"
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          />
                        </div>
                        <div className="mb-2 grid gap-2 md:grid-cols-2">
                          <input
                            value={route.firstAscentBy ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'firstAscentBy', event.target.value)}
                            placeholder="Primera ascensión por"
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          />
                          <input
                            value={route.firstAscentDate ?? ''}
                            onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'firstAscentDate', event.target.value)}
                            placeholder="Fecha primera ascensión"
                            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                          />
                        </div>
                        <input
                          value={route.image ?? ''}
                          onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'image', event.target.value)}
                          placeholder="Imagen URL"
                          className="mb-2 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                        />
                        <textarea
                          value={route.description ?? ''}
                          onChange={(event) => updateRoute(selectedSubsector.id, route.id, 'description', event.target.value)}
                          placeholder="Descripción"
                          className="mb-2 min-h-16 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => removeRoute(selectedSubsector.id, route.id)}
                          className="rounded border border-red-500/60 bg-red-700/20 px-2 py-1 text-xs font-semibold text-red-200"
                        >
                          Eliminar vía
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 text-sm text-slate-300">
                  No hay subsector seleccionado.
                </section>
              )}
            </div>
          </div>
        )}

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      </section>
    </main>
  );
}
