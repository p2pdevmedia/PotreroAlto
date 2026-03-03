'use client';

import { useEffect, useState } from 'react';
import {
  connectWallet,
  createAndStoreAscentEvent,
  getAscentsByRoute,
  getOrCreateSocialIdentity,
  publishJsonToIpfs
} from '@/lib/decentralized-ascents';

const ASCENT_STYLES = ['onsight', 'flash', 'redpoint', 'toprope', 'project'];

export default function AscentPanel({ route }) {
  const [identity, setIdentity] = useState(null);
  const [socialName, setSocialName] = useState('');
  const [socialProvider, setSocialProvider] = useState('google');
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    style: 'redpoint',
    attempts: 1,
    proposedGrade: '',
    description: ''
  });

  useEffect(() => {
    setHistory(getAscentsByRoute(route.id));
  }, [route.id]);

  async function handleWalletLogin() {
    try {
      setStatus('Conectando wallet...');
      const user = await connectWallet();
      setIdentity(user);
      setStatus(`Wallet conectada: ${user.displayName}`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleSocialLogin() {
    try {
      setStatus('Creando identidad social local...');
      const user = await getOrCreateSocialIdentity({
        displayName: socialName,
        provider: socialProvider
      });
      setIdentity(user);
      setStatus(`Identidad lista: ${user.displayName}`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!identity) {
      setStatus('Primero iniciá sesión con wallet o social.');
      return;
    }

    try {
      setSaving(true);
      setStatus('Firmando y guardando ascensión...');

      const ascentEvent = await createAndStoreAscentEvent({
        identity,
        route,
        ascent: {
          date: form.date,
          style: form.style,
          attempts: Number(form.attempts),
          proposedGrade: form.proposedGrade || null,
          description: form.description || null
        }
      });

      const cid = await publishJsonToIpfs(ascentEvent);
      setHistory(getAscentsByRoute(route.id));
      setForm((current) => ({ ...current, description: '' }));
      setStatus(cid ? `Ascensión guardada y publicada en IPFS: ${cid}` : 'Ascensión guardada localmente.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-900/80 p-3">
      <h5 className="text-sm font-semibold text-white">Registrar ascensión (descentralizado)</h5>
      <p className="mt-1 text-xs text-slate-300">
        Firma local del evento. Se guarda en este navegador y, si existe <code>window.ipfs</code>, se publica en IPFS.
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className="rounded border border-slate-600 px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
          onClick={handleWalletLogin}
        >
          Login con Wallet
        </button>

        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            placeholder="Nombre social"
            value={socialName}
            onChange={(event) => setSocialName(event.target.value)}
          />
          <select
            className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            value={socialProvider}
            onChange={(event) => setSocialProvider(event.target.value)}
          >
            <option value="google">Google</option>
            <option value="github">GitHub</option>
            <option value="x">X</option>
          </select>
          <button
            type="button"
            className="rounded border border-slate-600 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800"
            onClick={handleSocialLogin}
          >
            Login social
          </button>
        </div>
      </div>

      <form className="mt-3 grid gap-2 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="text-xs text-slate-300">
          Fecha
          <input
            type="date"
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
          />
        </label>

        <label className="text-xs text-slate-300">
          Estilo
          <select
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            value={form.style}
            onChange={(event) => setForm((current) => ({ ...current, style: event.target.value }))}
          >
            {ASCENT_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-slate-300">
          Intentos
          <input
            type="number"
            min="1"
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            value={form.attempts}
            onChange={(event) => setForm((current) => ({ ...current, attempts: event.target.value }))}
          />
        </label>

        <label className="text-xs text-slate-300">
          Grado sugerido
          <input
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            placeholder="ej: 7a"
            value={form.proposedGrade}
            onChange={(event) => setForm((current) => ({ ...current, proposedGrade: event.target.value }))}
          />
        </label>

        <label className="text-xs text-slate-300 sm:col-span-2">
          Descripción
          <textarea
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            rows={2}
            placeholder="Condiciones, beta, protección, etc."
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </label>

        <button
          type="submit"
          className="rounded border border-sunset/60 bg-sunset/20 px-3 py-2 text-xs font-semibold text-sunset hover:bg-sunset/30 sm:col-span-2"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Firmar y registrar ascensión'}
        </button>
      </form>

      {status ? <p className="mt-2 text-xs text-slate-300">{status}</p> : null}

      <div className="mt-3 border-t border-slate-700/70 pt-2">
        <p className="text-xs font-semibold text-slate-200">Historial local de esta vía</p>
        {history.length ? (
          <ul className="mt-1 space-y-1 text-xs text-slate-300">
            {history.slice(0, 5).map((item) => (
              <li key={item.eventId} className="rounded bg-slate-800/70 px-2 py-1">
                {item.ascent.date} · {item.ascent.style} · {item.author.displayName}
                {item.ascent.proposedGrade ? ` · grado ${item.ascent.proposedGrade}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-slate-400">Todavía no hay ascensiones guardadas para esta vía.</p>
        )}
      </div>
    </div>
  );
}
