'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { adminLoginSchema, routeSchema, subsectorSchema } from '@/lib/admin-zod-schemas';

const ROUTE_TYPE_OPTIONS = ['Sport', 'Trad', 'Boulder', 'Proyecto'];
const STAR_OPTIONS = ['', '0', '1', '2', '3', '4', '5'];
const GRADE_OPTIONS = [
  'Sin grado', 'Proyecto', 'V+', '5a', '5a+', '5b', '5b+', '5c', '5c+', '6a', '6a+', '6b', '6b+', '6c', '6c/+', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+', '9b', '9b+', '9c'
];

const EMPTY_ROUTE = {
  id: '',
  name: '',
  grade: 'Sin grado',
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

const EMPTY_SUBSECTOR = {
  id: '',
  name: '',
  sector: 'Potrero Alto',
  description: '',
  image: ''
};

function issuesToFieldErrors(issues = []) {
  return issues.reduce((accumulator, issue) => {
    const fieldName = String(issue.path?.[issue.path.length - 1] ?? '');
    if (!fieldName || accumulator[fieldName]) return accumulator;
    return { ...accumulator, [fieldName]: issue.message || 'Valor inválido.' };
  }, {});
}

function Breadcrumbs({ subsector, route }) {
  return (
    <nav className="text-sm text-slate-300" aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/admin" className="underline">Potrero Alto</Link></li>
        {subsector ? <li>/ <Link href={`/admin/${subsector.id}`} className="underline">{subsector.name || subsector.id}</Link></li> : null}
        {route ? <li>/ <span>{route.name || route.id || 'Nueva vía'}</span></li> : null}
      </ol>
    </nav>
  );
}

function SubsectorImageField({ value, onChange, availableImages }) {
  return (
    <label className="text-sm text-slate-200">
      Imagen del subsector (/images)
      <select
        value={availableImages.includes(value) ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
      >
        <option value="">Sin imagen</option>
        {availableImages.map((imagePath) => <option key={imagePath} value={imagePath}>{imagePath}</option>)}
      </select>
      {value ? (
        <div className="relative mt-2 h-44 overflow-hidden rounded border border-slate-700">
          <Image src={value} alt="Preview" fill className="object-contain" unoptimized />
        </div>
      ) : null}
    </label>
  );
}

function RouteImageUrlField({ value, onChange }) {
  return (
    <label className="text-sm text-slate-200">
      Imagen de la vía (URL)
      <input
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://... o /images/archivo.jpg"
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
      />
      {value?.trim() ? (
        <div className="relative mt-2 h-44 overflow-hidden rounded border border-slate-700">
          <Image src={value} alt="Preview" fill className="object-contain" unoptimized />
        </div>
      ) : null}
    </label>
  );
}

export default function AdminEditor({ view = 'subsectors', subsectorId = null, routeId = null, availableImages = [] }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [subsectors, setSubsectors] = useState([]);
  const [currentSubsector, setCurrentSubsector] = useState(EMPTY_SUBSECTOR);
  const [routes, setRoutes] = useState([]);
  const [routeForm, setRouteForm] = useState(EMPTY_ROUTE);
  const [fieldErrors, setFieldErrors] = useState({});

  const authHeaders = useMemo(() => ({ 'x-admin-password': password }), [password]);

  const loadSubsectors = useCallback(async () => {
    const response = await fetch('/api/admin/database', { headers: authHeaders });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error ?? 'No se pudieron cargar los subsectores.');
    setSubsectors(payload.subsectors ?? []);
  }, [authHeaders]);

  const loadRoutes = useCallback(async (id) => {
    if (!id) return;
    const response = await fetch(`/api/admin/database?subsectorId=${encodeURIComponent(id)}`, { headers: authHeaders });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error ?? 'No se pudieron cargar las vías.');
    setRoutes(payload.routes ?? []);
  }, [authHeaders]);

  const onLogin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const parsed = adminLoginSchema.safeParse({ password });
      if (!parsed.success) throw new Error(parsed.error.issues?.[0]?.message ?? 'Password inválido.');
      await loadSubsectors();
      setAuthenticated(true);
      setMessage('Validación correcta.');
    } catch (loginError) {
      setAuthenticated(false);
      setError(loginError instanceof Error ? loginError.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated) return;

    const selected = subsectors.find((item) => item.id === subsectorId);
    if (view === 'subsector' || view === 'routes' || view === 'route' || view === 'new-route') {
      if (selected) setCurrentSubsector((current) => (current.id === selected.id ? current : selected));
    }
    if (view === 'new-subsector') {
      setCurrentSubsector(EMPTY_SUBSECTOR);
    }
  }, [authenticated, subsectorId, subsectors, view]);

  useEffect(() => {
    if (!authenticated) return;

    if (view === 'routes' || view === 'route' || view === 'new-route') {
      loadRoutes(subsectorId).catch((loadError) => setError(loadError.message));
    }
  }, [authenticated, loadRoutes, subsectorId, view]);

  useEffect(() => {
    if (view === 'route') {
      const existing = routes.find((item) => item.id === routeId);
      if (existing) setRouteForm(existing);
    }

    if (view === 'new-route') {
      setRouteForm(EMPTY_ROUTE);
    }
  }, [routeId, routes, view]);

  const saveSubsector = async () => {
    const parsed = subsectorSchema.safeParse({ ...currentSubsector, routes: [] });
    if (!parsed.success) {
      const nextErrors = issuesToFieldErrors(parsed.error.issues);
      setFieldErrors(nextErrors);
      throw new z.ZodError(parsed.error.issues);
    }

    const response = await fetch('/api/admin/database', {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'subsector', subsector: { ...parsed.data, routes: [] } })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error ?? 'No se pudo guardar subsector.');
    await loadSubsectors();
  };

  const saveRoute = async () => {
    const parsed = routeSchema.safeParse(routeForm);
    if (!parsed.success) {
      const nextErrors = issuesToFieldErrors(parsed.error.issues);
      setFieldErrors(nextErrors);
      throw new z.ZodError(parsed.error.issues);
    }

    const payloadRoute = {
      ...parsed.data,
      id: parsed.data.id?.trim() || `${subsectorId}-${Date.now()}`,
      subsectorId
    };

    const response = await fetch('/api/admin/database', {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'route', route: payloadRoute })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error ?? 'No se pudo guardar vía.');
    await loadRoutes(subsectorId);
  };

  const deleteSubsector = async () => {
    const response = await fetch('/api/admin/database', {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'delete-subsector', subsectorId: currentSubsector.id })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error ?? 'No se pudo borrar subsector.');
    await loadSubsectors();
  };

  const deleteRoute = async (id) => {
    const response = await fetch('/api/admin/database', {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'delete-route', routeId: id })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error ?? 'No se pudo borrar vía.');
    await loadRoutes(subsectorId);
  };

  const onSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    setFieldErrors({});

    try {
      if (view === 'subsector' || view === 'new-subsector') {
        await saveSubsector();
        setMessage('Subsector guardado.');
      }

      if (view === 'route' || view === 'new-route') {
        await saveRoute();
        setMessage('Vía guardada.');
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const selectedSubsector = subsectors.find((item) => item.id === subsectorId) || currentSubsector;
  const selectedRoute = view === 'new-route' ? { ...routeForm, name: routeForm.name || 'Nueva vía' } : routes.find((item) => item.id === routeId);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <section className="card space-y-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-100">Administrador</h1>
          <p className="text-sm text-slate-300">Panel modular para subsectores y vías.</p>
        </header>

        {!authenticated ? (
          <form onSubmit={onLogin} className="space-y-3 rounded-lg border border-slate-700 p-4">
            <label className="text-sm text-slate-200">
              Password de admin
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              />
            </label>
            <button type="submit" disabled={!password || loading} className="rounded border border-slate-500 px-4 py-2 text-sm text-slate-100">
              {loading ? 'Validando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <>
            <Breadcrumbs subsector={selectedSubsector?.id ? selectedSubsector : null} route={selectedRoute} />

            {(view === 'subsector' || view === 'new-subsector' || view === 'route' || view === 'new-route') ? (
              <button type="button" onClick={onSave} disabled={saving} className="rounded bg-emerald-700/30 px-4 py-2 text-sm font-semibold text-emerald-100">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            ) : null}

            {view === 'subsectors' ? (
              <section className="space-y-3">
                <Link href="/admin/new-subsector" className="inline-block rounded border border-slate-500 px-3 py-2 text-sm text-slate-100">+ Crear subsector</Link>
                <ul className="space-y-2">
                  {subsectors.map((item) => (
                    <li key={item.id} className="rounded border border-slate-700 p-3">
                      <p className="font-semibold text-slate-100">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.id}</p>
                      <div className="mt-2 flex gap-2">
                        <Link href={`/admin/${item.id}`} className="rounded border border-slate-500 px-2 py-1 text-xs text-slate-100">Editar subsector</Link>
                        <Link href={`/admin/${item.id}/routes`} className="rounded border border-slate-500 px-2 py-1 text-xs text-slate-100">Ver vías</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {view === 'subsector' || view === 'new-subsector' ? (
              <section className="space-y-3 rounded border border-slate-700 p-4">
                <label className="text-sm text-slate-200">ID
                  <input value={currentSubsector.id} onChange={(e) => setCurrentSubsector((c) => ({ ...c, id: e.target.value }))} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                  {fieldErrors.id ? <span className="text-xs text-red-300">{fieldErrors.id}</span> : null}
                </label>
                <label className="text-sm text-slate-200">Nombre
                  <input value={currentSubsector.name} onChange={(e) => setCurrentSubsector((c) => ({ ...c, name: e.target.value }))} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                  {fieldErrors.name ? <span className="text-xs text-red-300">{fieldErrors.name}</span> : null}
                </label>
                <label className="text-sm text-slate-200">Descripción
                  <textarea value={currentSubsector.description} onChange={(e) => setCurrentSubsector((c) => ({ ...c, description: e.target.value }))} className="mt-1 min-h-20 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                </label>
                <SubsectorImageField value={currentSubsector.image} onChange={(value) => setCurrentSubsector((c) => ({ ...c, image: value }))} availableImages={availableImages} />
                {view === 'subsector' ? <Link href={`/admin/${currentSubsector.id}/routes`} className="inline-block rounded border border-slate-500 px-3 py-1 text-sm text-slate-100">Ir a vías del subsector</Link> : null}
                {view === 'subsector' ? <button type="button" onClick={() => deleteSubsector().catch((deleteError) => setError(deleteError.message))} className="rounded border border-red-500/70 px-3 py-2 text-sm text-red-200">Eliminar subsector</button> : null}
              </section>
            ) : null}

            {view === 'routes' ? (
              <section className="space-y-3 rounded border border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-100">Vías de {selectedSubsector?.name || selectedSubsector?.id}</h2>
                  <Link href={`/admin/${selectedSubsector?.id}/new-route`} className="rounded border border-slate-500 px-3 py-1 text-sm text-slate-100">+ Nueva vía</Link>
                </div>
                <ul className="space-y-2">
                  {routes.map((item) => (
                    <li key={item.id} className="rounded border border-slate-700 p-3">
                      <p className="text-sm font-semibold text-slate-100">{item.name || '(sin nombre)'}</p>
                      <p className="text-xs text-slate-400">{item.id} · {item.grade || 'Sin grado'}</p>
                      <div className="mt-2 flex gap-2">
                        <Link href={`/admin/${selectedSubsector?.id}/${item.id}`} className="rounded border border-slate-500 px-2 py-1 text-xs text-slate-100">Editar</Link>
                        <button type="button" onClick={() => deleteRoute(item.id).catch((deleteError) => setError(deleteError.message))} className="rounded border border-red-500/70 px-2 py-1 text-xs text-red-200">Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {view === 'route' || view === 'new-route' ? (
              <section className="space-y-3 rounded border border-slate-700 p-4">
                <label className="text-sm text-slate-200">ID
                  <input value={routeForm.id ?? ''} onChange={(e) => setRouteForm((c) => ({ ...c, id: e.target.value }))} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                </label>
                <label className="text-sm text-slate-200">Nombre
                  <input value={routeForm.name ?? ''} onChange={(e) => setRouteForm((c) => ({ ...c, name: e.target.value }))} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                  {fieldErrors.name ? <span className="text-xs text-red-300">{fieldErrors.name}</span> : null}
                </label>
                <div className="grid gap-2 md:grid-cols-3">
                  <select value={routeForm.grade || 'Sin grado'} onChange={(e) => setRouteForm((c) => ({ ...c, grade: e.target.value }))} className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">{GRADE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                  <select value={routeForm.stars ?? ''} onChange={(e) => setRouteForm((c) => ({ ...c, stars: e.target.value }))} className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">{STAR_OPTIONS.map((option) => <option key={option} value={option}>{option || 'Sin estrellas'}</option>)}</select>
                  <select value={routeForm.type || 'Sport'} onChange={(e) => setRouteForm((c) => ({ ...c, type: e.target.value }))} className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">{ROUTE_TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                </div>
                <RouteImageUrlField value={routeForm.image} onChange={(value) => setRouteForm((c) => ({ ...c, image: value }))} />
                <label className="text-sm text-slate-200">Descripción
                  <textarea value={routeForm.description ?? ''} onChange={(e) => setRouteForm((c) => ({ ...c, description: e.target.value }))} className="mt-1 min-h-20 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-slate-200">Largo (m)
                    <input
                      value={routeForm.lengthMeters ?? ''}
                      onChange={(e) => setRouteForm((c) => ({ ...c, lengthMeters: e.target.value }))}
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    />
                    {fieldErrors.lengthMeters ? <span className="text-xs text-red-300">{fieldErrors.lengthMeters}</span> : null}
                  </label>
                  <label className="text-sm text-slate-200">Expresses
                    <input
                      value={routeForm.quickdraws ?? ''}
                      onChange={(e) => setRouteForm((c) => ({ ...c, quickdraws: e.target.value }))}
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    />
                    {fieldErrors.quickdraws ? <span className="text-xs text-red-300">{fieldErrors.quickdraws}</span> : null}
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-slate-200">Equipada por
                    <input
                      value={routeForm.equippedBy ?? ''}
                      onChange={(e) => setRouteForm((c) => ({ ...c, equippedBy: e.target.value }))}
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    />
                  </label>
                  <label className="text-sm text-slate-200">Fecha de equipamiento
                    <input
                      value={routeForm.equippedDate ?? ''}
                      onChange={(e) => setRouteForm((c) => ({ ...c, equippedDate: e.target.value }))}
                      placeholder="AAAA o YYYY-MM-DD"
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    />
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-slate-200">Primera ascensión por
                    <input
                      value={routeForm.firstAscentBy ?? ''}
                      onChange={(e) => setRouteForm((c) => ({ ...c, firstAscentBy: e.target.value }))}
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    />
                  </label>
                  <label className="text-sm text-slate-200">Fecha primera ascensión
                    <input
                      value={routeForm.firstAscentDate ?? ''}
                      onChange={(e) => setRouteForm((c) => ({ ...c, firstAscentDate: e.target.value }))}
                      placeholder="AAAA o YYYY-MM-DD"
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    />
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-slate-200">Latitud
                    <input
                      value={routeForm.latitude ?? ''}
                      onChange={(e) => setRouteForm((c) => ({ ...c, latitude: e.target.value }))}
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    />
                    {fieldErrors.latitude ? <span className="text-xs text-red-300">{fieldErrors.latitude}</span> : null}
                  </label>
                  <label className="text-sm text-slate-200">Longitud
                    <input
                      value={routeForm.longitude ?? ''}
                      onChange={(e) => setRouteForm((c) => ({ ...c, longitude: e.target.value }))}
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                    />
                    {fieldErrors.longitude ? <span className="text-xs text-red-300">{fieldErrors.longitude}</span> : null}
                  </label>
                </div>
              </section>
            ) : null}
          </>
        )}

        {(error || message) ? (
          <p className={`rounded border px-3 py-2 text-sm ${error ? 'border-red-500/70 text-red-200' : 'border-emerald-500/70 text-emerald-200'}`}>
            {error || message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
