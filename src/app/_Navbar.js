'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { LANGUAGES } from '@/app/i18n';
import { GRADE_SYSTEMS } from '@/app/grade-system';

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

export default function Navbar({
  activeSection,
  onSectionChange,
  subsectors = [],
  language,
  onLanguageChange,
  gradeSystem,
  onGradeSystemChange,
  formatGrade,
  t
}) {
  const navItems = [
    { id: 'como-llegar', label: t('howToGet') },
    { id: 'faq', label: t('faq') }
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
      className="sticky top-4 z-20 mb-6 overflow-visible rounded-2xl border border-slate-700/70 p-3 shadow-xl shadow-slate-950/50"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.86), rgba(45, 99, 91, 0.4)), url("https://image.thecrag.com/1280x960/04/2a/042abb36f28639772ff48b7839955649f754f653")',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <p className="pointer-events-none absolute left-1/2 top-[42%] z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-3xl font-black uppercase tracking-[0.35em] text-slate-100/15 md:text-5xl">
        Potrero Alto
      </p>

      <div className="relative z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleSectionChange('inicio')}
          className="p-0 transition-opacity hover:opacity-90"
          aria-label={t('goHome')}
        >
          <Image
            src="/ChatGPT%20Image%20Mar%203,%202026%20at%2002_13_58%20PM.png"
            alt="Logo Potrero Alto"
            width={48}
            height={48}
            className="animate-logo-breathe h-10 w-10 rounded-lg object-cover md:h-12 md:w-12"
            priority
          />
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition hover:bg-slate-800 md:hidden"
          aria-label={isMobileMenuOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navbar-menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">{isMobileMenuOpen ? t('closeMenu') : t('openMenu')}</span>
          <span className="text-xl leading-none">☰</span>
        </button>

        <div className="ml-auto hidden items-center gap-4 md:flex">
          <ul className="flex items-center justify-start gap-2 text-sm font-semibold text-slate-200 md:gap-4 md:text-base">
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

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-950/70 text-base text-slate-100 hover:bg-slate-800"
              aria-label={t('accountMenu')}
              aria-expanded={isUserMenuOpen}
            >
              👤
            </button>
            {isUserMenuOpen ? (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl">
                <label htmlFor="lang" className="text-xs font-semibold text-slate-300">{t('language')}</label>
                <select
                  id="lang"
                  value={language}
                  onChange={(event) => onLanguageChange(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
                >
                  {LANGUAGES.map((item) => (
                    <option key={item.code} value={item.code}>{item.label}</option>
                  ))}
                </select>

                <label htmlFor="grade-system" className="mt-3 block text-xs font-semibold text-slate-300">{t('gradeSystem')}</label>
                <select
                  id="grade-system"
                  value={gradeSystem}
                  onChange={(event) => onGradeSystemChange(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
                >
                  {GRADE_SYSTEMS.map((item) => (
                    <option key={item.code} value={item.code}>{item.label}</option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        </div>

      </div>

      {isMobileMenuOpen && (
        <ul
          id="mobile-navbar-menu"
          className="relative z-10 mt-3 flex flex-col gap-2 text-sm font-semibold text-slate-200 md:hidden"
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

      <div className="relative z-10 mt-3 border-t border-slate-700/70 pt-3">
        <label htmlFor="route-search" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          {t('searchRoute')}
        </label>
        <input
          id="route-search"
          type="search"
          placeholder={t('routeName')}
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
                        alt={`${t('photo')} ${route.name}`}
                        width={80}
                        height={80}
                        className="h-16 w-16 rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800 text-[10px] uppercase tracking-wide text-slate-400">
                        {t('noPhoto')}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{route.name}</p>
                      <p className="text-xs text-slate-400">{route.subsectorName}</p>
                      <p className="mt-1 text-xs text-slate-200">{t('grade')}: {formatGrade(route.grade ?? t('noGrade'))}</p>
                      <p className="line-clamp-2 text-xs text-slate-300">
                        {route.description || t('noDescription')}
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
            <p className="mt-3 text-sm text-slate-400">{t('noMatches')}</p>
          )
        ) : null}
      </div>
    </nav>
  );
}
