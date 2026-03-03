'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

const navItems = [
  { id: 'inicio', label: 'Potrero Alto' },
  { id: 'como-llegar', label: 'Cómo llegar' },
  { id: 'faq', label: 'FAQ guía' }
];


function normalizeText(value) {
  return (
    value
      ?.normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim() ?? ''
  );
}

function similarityScore(candidateName, query) {
  const candidate = normalizeText(candidateName);
  const target = normalizeText(query);

  if (!candidate || !target) {
    return 0;
  }

  if (candidate.includes(target)) {
    return 1;
  }

  const targetTokens = target.split(/\s+/).filter(Boolean);
  const candidateTokens = candidate.split(/\s+/).filter(Boolean);

  return targetTokens.reduce((max, token) => {
    if (candidate.includes(token)) {
      return Math.max(max, 0.85);
    }

    const partialMatch = candidateTokens.some((candidateToken) =>
      candidateToken.startsWith(token.slice(0, Math.max(2, Math.floor(token.length / 2))))
    );

    return partialMatch ? Math.max(max, 0.7) : max;
  }, 0);
}

function ratingEmojis(stars) {
  const numericStars = Number.parseFloat(stars);

  if (!Number.isFinite(numericStars) || numericStars <= 0) {
    return null;
  }

  const ratingScale = ['⭐', '🧉', '🍺', '🍕', '🚬'];
  return ratingScale.slice(0, Math.min(5, Math.round(numericStars))).reverse().join('');
}
export default function Navbar({ activeSection, onSectionChange, subsectors = [] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const routeSearchResults = useMemo(() => {
    if (!searchTerm?.trim()) {
      return [];
    }

    return (subsectors ?? [])
      .flatMap((subsector) =>
        (subsector.routes ?? []).map((route) => ({
          ...route,
          subsectorName: subsector.name,
          score: similarityScore(route.name, searchTerm)
        }))
      )
      .filter((route) => route.score >= 0.7)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [searchTerm, subsectors]);

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-4 z-20 mb-6 rounded-2xl border border-slate-700/70 p-3 shadow-xl shadow-slate-950/50"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.86), rgba(45, 99, 91, 0.4)), url("https://image.thecrag.com/1280x960/04/2a/042abb36f28639772ff48b7839955649f754f653")',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => handleSectionChange('inicio')}
          className="p-0 transition-opacity hover:opacity-90"
          aria-label="Ir al inicio"
        >
          <Image
            src="/ChatGPT%20Image%20Mar%203,%202026%20at%2002_13_58%20PM.png"
            alt="Logo Potrero Alto"
            width={48}
            height={48}
            className="h-10 w-10 rounded-lg object-cover md:h-12 md:w-12"
            priority
          />
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition hover:bg-slate-800 md:hidden"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navbar-menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">{isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span className="text-xl leading-none">☰</span>
        </button>

        <ul className="hidden items-center justify-center gap-2 text-sm font-semibold text-slate-200 md:flex md:gap-4 md:text-base">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSectionChange(item.id)}
                className={`rounded-full px-4 py-2 transition ${
                  activeSection === item.id
                    ? 'bg-slate-200 text-slate-900'
                    : 'hover:bg-slate-800 hover:text-sunset'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isMobileMenuOpen && (
        <ul
          id="mobile-navbar-menu"
          className="mt-3 flex flex-col gap-2 text-sm font-semibold text-slate-200 md:hidden"
        >
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSectionChange(item.id)}
                className={`w-full rounded-full px-4 py-2 text-left transition ${
                  activeSection === item.id
                    ? 'bg-slate-200 text-slate-900'
                    : 'hover:bg-slate-800 hover:text-sunset'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 border-t border-slate-700/70 pt-3">
        <label htmlFor="route-search" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Buscar vía
        </label>
        <input
          id="route-search"
          type="search"
          placeholder="Nombre de la vía..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sunset"
        />

        {searchTerm.trim() ? (
          routeSearchResults.length ? (
            <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
              {routeSearchResults.map((route) => (
                <li key={route.id ?? `${route.subsectorName}-${route.name}`} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-2">
                  <div className="flex gap-3">
                    {route.image ? (
                      <Image
                        src={route.image}
                        alt={`Foto de la vía ${route.name}`}
                        width={80}
                        height={80}
                        className="h-16 w-16 rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800 text-[10px] uppercase tracking-wide text-slate-400">
                        Sin foto
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{route.name}</p>
                      <p className="text-xs text-slate-400">{route.subsectorName}</p>
                      <p className="mt-1 text-xs text-slate-200">Grado: {route.grade ?? 'Sin grado'}</p>
                      <p className="line-clamp-2 text-xs text-slate-300">
                        {route.description || 'Todavía no hay una descripción cargada para esta vía.'}
                      </p>
                      {ratingEmojis(route.stars) ? (
                        <p className="mt-1 text-xs text-slate-100">{ratingEmojis(route.stars)}</p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No encontramos vías con un nombre similar.</p>
          )
        ) : null}
      </div>
    </nav>
  );
}
