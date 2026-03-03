'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { convertGrade, GRADE_SYSTEM_OPTIONS, LANGUAGE_OPTIONS, t } from '@/lib/i18n';

const navItems = [
  { id: 'como-llegar', labelKey: 'howToGetThere' },
  { id: 'faq', labelKey: 'faqGuide' }
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
export default function Navbar({
  activeSection,
  onSectionChange,
  subsectors = [],
  locale,
  onLocaleChange,
  gradeSystem,
  onGradeSystemChange
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompact, setIsCompact] = useState(false);
  const compactStateRef = useRef(false);

  useEffect(() => {
    const compactThreshold = 88;
    // On Android, collapsing this navbar can reduce layout height enough to
    // briefly lower scrollY and cause rapid compact/expand loops. Requiring the
    // user to return very close to the top before expanding avoids that jitter.
    const expandThreshold = 8;
    let rafId = null;

    const updateCompactState = () => {
      const currentScroll = window.scrollY;

      if (!compactStateRef.current && currentScroll > compactThreshold) {
        compactStateRef.current = true;
        setIsCompact(true);
      } else if (compactStateRef.current && currentScroll < expandThreshold) {
        compactStateRef.current = false;
        setIsCompact(false);
      }

      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(updateCompactState);
    };

    updateCompactState();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

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
      className={`sticky top-4 z-20 mb-6 overflow-visible rounded-2xl border border-slate-700/70 shadow-xl shadow-slate-950/50 transition-all ${
        isCompact ? 'p-2' : 'p-3'
      }`}
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.86), rgba(45, 99, 91, 0.4)), url("https://image.thecrag.com/1280x960/04/2a/042abb36f28639772ff48b7839955649f754f653")',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <p
        className={`pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-black uppercase tracking-[0.35em] text-slate-100/15 transition-all ${
          isCompact ? 'top-1/2 text-2xl opacity-40 md:text-3xl' : 'top-[42%] text-3xl md:text-5xl'
        }`}
      >
        Potrero Alto
      </p>

      <div className="relative z-30 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => handleSectionChange('inicio')}
          className="p-0 transition-opacity hover:opacity-90"
          aria-label={t(locale, 'goHome')}
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
          aria-label={isMobileMenuOpen ? t(locale, 'closeMenu') : t(locale, 'openMenu')}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navbar-menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">{isMobileMenuOpen ? t(locale, 'closeMenu') : t(locale, 'openMenu')}</span>
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
                {t(locale, item.labelKey)}
              </button>
            </li>
          ))}
          <li className="relative z-40">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-900/70 text-lg transition hover:border-sunset"
              aria-label={t(locale, 'userPreferences')}
            >
              👤
            </button>
            {isUserMenuOpen ? (
              <div className="absolute right-0 top-12 z-50 w-72 space-y-3 rounded-xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl">
                <label className="block text-xs text-slate-300">
                  {t(locale, 'language')}
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
                    value={locale}
                    onChange={(event) => onLocaleChange(event.target.value)}
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.code} value={option.code}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs text-slate-300">
                  {t(locale, 'gradeSystem')}
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
                    value={gradeSystem}
                    onChange={(event) => onGradeSystemChange(event.target.value)}
                  >
                    {GRADE_SYSTEM_OPTIONS.map((option) => (
                      <option key={option.code} value={option.code}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
          </li>
        </ul>
      </div>

      {isMobileMenuOpen && (
        <ul
          id="mobile-navbar-menu"
          className="relative z-20 mt-3 flex flex-col gap-2 text-sm font-semibold text-slate-200 md:hidden"
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
                {t(locale, item.labelKey)}
              </button>
            </li>
          ))}
          <li className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
            <label className="block text-xs text-slate-300">
              {t(locale, 'language')}
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
                value={locale}
                onChange={(event) => onLocaleChange(event.target.value)}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="mt-2 block text-xs text-slate-300">
              {t(locale, 'gradeSystem')}
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
                value={gradeSystem}
                onChange={(event) => onGradeSystemChange(event.target.value)}
              >
                {GRADE_SYSTEM_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>{option.label}</option>
                ))}
              </select>
            </label>
          </li>
        </ul>
      )}

      {!isCompact ? (
        <div className="relative z-0 mt-3 border-t border-slate-700/70 pt-3">
          <label htmlFor="route-search" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            {t(locale, 'searchRoute')}
          </label>
          <input
            id="route-search"
            type="search"
            placeholder={t(locale, 'routeNamePlaceholder')}
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
                          {t(locale, 'noPhoto')}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{route.name}</p>
                        <p className="text-xs text-slate-400">{route.subsectorName}</p>
                        <p className="mt-1 text-xs text-slate-200">{t(locale, 'gradeLabel')}: {convertGrade(route.grade, gradeSystem) ?? t(locale, 'noGrade')}</p>
                        <p className="line-clamp-2 text-xs text-slate-300">
                          {route.description || t(locale, 'noDescription')}
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
              <p className="mt-3 text-sm text-slate-400">{t(locale, 'noSimilarRoutes')}</p>
            )
          ) : null}
        </div>
      ) : null}
    </nav>
  );
}
