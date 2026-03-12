'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminFrame, AdminLogin, AdminNav, Feedback } from '@/app/admin/_components/admin-shell';
import useAdminData from '@/app/admin/_hooks/use-admin-data';
import { encodePathSegment } from '@/app/admin/_lib/admin-utils';

export default function SubsectorEditorPage({ params }) {
  const subsectionIdParam = decodeURIComponent(params.subsectorId);
  const router = useRouter();
  const admin = useAdminData();
  const [inputPassword, setInputPassword] = useState('');

  const subsector = useMemo(
    () => admin.subsectors.find((item) => item.id === subsectionIdParam) ?? null,
    [admin.subsectors, subsectionIdParam]
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    await admin.login(inputPassword);
  };

  if (!admin.authenticated) {
    return (
      <AdminFrame title="Admin subsector" subtitle="Entrá con password para editar el subsector.">
        <AdminLogin onSubmit={handleLogin} password={inputPassword} setPassword={setInputPassword} loading={admin.loading} error={admin.error} />
      </AdminFrame>
    );
  }

  return (
    <AdminFrame
      title={`Subsector · ${subsector?.name ?? subsectionIdParam}`}
      subtitle="Edición del subsector y listado de vías"
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
          ← Volver al listado de subsectores
        </Link>
      </p>

      {!subsector ? (
        <section className="rounded-xl border border-red-500/40 bg-red-900/10 p-4 text-sm text-red-200">
          No se encontró el subsector <strong>{subsectionIdParam}</strong>.
        </section>
      ) : (
        <section className="space-y-4 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-200">
              ID
              <input
                value={subsector.id ?? ''}
                onChange={(event) => admin.updateSubsector(subsectionIdParam, 'id', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
              />
            </label>
            <label className="text-sm text-slate-200">
              Sector
              <select
                value={subsector.sector ?? 'Potrero Alto'}
                onChange={(event) => admin.updateSubsector(subsectionIdParam, 'sector', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              >
                {admin.sectorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-200 md:col-span-2">
              Nombre
              <input
                value={subsector.name ?? ''}
                onChange={(event) => admin.updateSubsector(subsectionIdParam, 'name', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              />
            </label>
          </div>

          <label className="block text-sm text-slate-200">
            Descripción
            <textarea
              value={subsector.description ?? ''}
              onChange={(event) => admin.updateSubsector(subsectionIdParam, 'description', event.target.value)}
              className="mt-1 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="block text-sm text-slate-200">
            Imagen URL
            <input
              value={subsector.image ?? ''}
              onChange={(event) => admin.updateSubsector(subsectionIdParam, 'image', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const newRouteId = admin.addRoute(subsectionIdParam);
                if (newRouteId) {
                  router.push(`/admin/${encodePathSegment(subsectionIdParam)}/${encodePathSegment(newRouteId)}`);
                }
              }}
              className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100"
            >
              + Agregar vía
            </button>
            <button
              type="button"
              onClick={() => {
                admin.removeSubsector(subsectionIdParam);
                router.push('/admin');
              }}
              className="rounded-lg border border-red-500/60 bg-red-700/20 px-3 py-2 text-sm font-semibold text-red-200"
            >
              Eliminar subsector
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-200">Vías del subsector</h3>
            {(subsector.routes ?? []).length ? (
              <ul className="space-y-2">
                {subsector.routes.map((route) => (
                  <li key={route.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2">
                    <p className="text-sm text-slate-100">
                      {route.id} · {route.name || '(sin nombre)'}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/${encodePathSegment(subsectionIdParam)}/${encodePathSegment(route.id)}`}
                        className="rounded border border-sky-500/60 bg-sky-700/20 px-2 py-1 text-xs font-semibold text-sky-100"
                      >
                        Editar vía
                      </Link>
                      <button
                        type="button"
                        onClick={() => admin.removeRoute(subsectionIdParam, route.id)}
                        className="rounded border border-red-500/60 bg-red-700/20 px-2 py-1 text-xs font-semibold text-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No hay vías cargadas.</p>
            )}
          </div>
        </section>
      )}
    </AdminFrame>
  );
}
