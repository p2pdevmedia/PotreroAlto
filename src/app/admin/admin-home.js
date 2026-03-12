'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminFrame, AdminLogin, AdminNav, Feedback } from '@/app/admin/_components/admin-shell';
import useAdminData from '@/app/admin/_hooks/use-admin-data';
import { encodePathSegment } from '@/app/admin/_lib/admin-utils';

export default function AdminHome() {
  const router = useRouter();
  const admin = useAdminData();
  const [inputPassword, setInputPassword] = useState('');
  const [selectedSubsectorId, setSelectedSubsectorId] = useState(null);

  const selectedSubsector = useMemo(
    () => admin.subsectors.find((subsector) => subsector.id === selectedSubsectorId) ?? null,
    [admin.subsectors, selectedSubsectorId]
  );

  const saveButtonLabel = admin.saving ? 'Guardando...' : 'Guardar cambios';

  const handleLogin = async (event) => {
    event.preventDefault();
    await admin.login(inputPassword);
  };

  if (!admin.authenticated) {
    return (
      <AdminFrame title="Admin de base de datos" subtitle="Entrá con password para editar sectores y subsectores.">
        <AdminLogin onSubmit={handleLogin} password={inputPassword} setPassword={setInputPassword} loading={admin.loading} error={admin.error} />
      </AdminFrame>
    );
  }

  return (
    <AdminFrame
      title="Admin · Sectores y Subsectores"
      subtitle="Página principal: información del sector y listado de subsectores."
      actions={
        <>
          <button
            type="button"
            onClick={admin.save}
            disabled={admin.saving}
            className="rounded-lg border border-emerald-500/60 bg-emerald-700/20 px-3 py-2 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveButtonLabel}
          </button>
          <button
            type="button"
            onClick={admin.logout}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-100"
          >
            Salir
          </button>
        </>
      }
    >
      <AdminNav />
      <Feedback error={admin.error} message={admin.message} />

      <section className="grid gap-3 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 md:grid-cols-3">
        <label className="text-sm text-slate-200">
          Sector (nombre)
          <input
            value={admin.sectorInfo.name}
            onChange={(event) => admin.setSectorInfo((current) => ({ ...current, name: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />
        </label>
        <label className="text-sm text-slate-200">
          Ubicación
          <input
            value={admin.sectorInfo.location}
            onChange={(event) => admin.setSectorInfo((current) => ({ ...current, location: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />
        </label>
        <label className="text-sm text-slate-200 md:col-span-3">
          Descripción general
          <textarea
            value={admin.sectorInfo.description}
            onChange={(event) => admin.setSectorInfo((current) => ({ ...current, description: event.target.value }))}
            className="mt-1 min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />
        </label>
      </section>

      <section className="grid gap-4 md:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Subsectores</h2>
            <button
              type="button"
              onClick={() => {
                const nextId = admin.addSubsector();
                setSelectedSubsectorId(nextId);
              }}
              className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-100"
            >
              +
            </button>
          </div>
          <ul className="space-y-2">
            {admin.subsectors.map((subsector) => (
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
          <section className="space-y-3 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4">
            <h3 className="text-base font-semibold text-slate-100">Editar subsector seleccionado</h3>
            <input
              value={selectedSubsector.name ?? ''}
              onChange={(event) => admin.updateSubsector(selectedSubsector.id, 'name', event.target.value)}
              placeholder="Nombre"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push(`/admin/${encodePathSegment(selectedSubsector.id)}`)}
                className="rounded-lg border border-sky-500/60 bg-sky-700/20 px-3 py-2 text-sm font-semibold text-sky-100"
              >
                Ir al detalle del subsector
              </button>
              <button
                type="button"
                onClick={() => {
                  admin.removeSubsector(selectedSubsector.id);
                  setSelectedSubsectorId(null);
                }}
                className="rounded-lg border border-red-500/60 bg-red-700/20 px-3 py-2 text-sm font-semibold text-red-200"
              >
                Eliminar subsector
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Ruta de edición: <Link href={`/admin/${encodePathSegment(selectedSubsector.id)}`}>/admin/{selectedSubsector.id}</Link>
            </p>
          </section>
        ) : (
          <section className="rounded-xl border border-slate-700/70 bg-slate-900/40 p-4 text-sm text-slate-300">
            Seleccioná un subsector para abrir su página.
          </section>
        )}
      </section>
    </AdminFrame>
  );
}
