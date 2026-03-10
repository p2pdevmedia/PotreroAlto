'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useWallet } from '@/app/wallet-provider';
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


function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceInMeters(fromLat, fromLng, toLat, toLng) {
  const earthRadiusInMeters = 6371000;
  const latDistanceInRadians = toRadians(toLat - fromLat);
  const lngDistanceInRadians = toRadians(toLng - fromLng);
  const haversineValue =
    Math.sin(latDistanceInRadians / 2) * Math.sin(latDistanceInRadians / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(lngDistanceInRadians / 2) * Math.sin(lngDistanceInRadians / 2);

  const angularDistance = 2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

  return earthRadiusInMeters * angularDistance;
}

export default function Navbar({
  activeSection,
  onSectionChange,
  subsectors = [],
  locale,
  onLocaleChange,
  gradeSystem,
  onGradeSystemChange,
  onConnectWallet,
  onDisconnectWallet,
  walletError
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompact, setIsCompact] = useState(false);
  const [selectedSearchRoute, setSelectedSearchRoute] = useState(null);
  const [currentStandingRouteName, setCurrentStandingRouteName] = useState('');
  const [nearestRouteInfo, setNearestRouteInfo] = useState(null);
  const [nearestRouteMessage, setNearestRouteMessage] = useState('');
  const [routeLocatorError, setRouteLocatorError] = useState('');
  const compactStateRef = useRef(false);
  const { address, isConnected } = useWallet();
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  useEffect(() => {
    const compactThreshold = 96;
    // On Android, collapsing this navbar can reduce layout height enough to
    // briefly lower scrollY and cause rapid compact/expand loops. Requiring the
    // user to return very close to the top before expanding avoids that jitter.
    const expandThreshold = 6;

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

  const routesWithCoordinates = useMemo(
    () =>
      (subsectors ?? []).flatMap((subsector) =>
        (subsector.routes ?? [])
          .map((route) => ({
            routeName: route.name,
            subsectorName: subsector.name,
            latitude: Number(route.latitude),
            longitude: Number(route.longitude)
          }))
          .filter((route) => Number.isFinite(route.latitude) && Number.isFinite(route.longitude))
      ),
    [subsectors]
  );

  useEffect(() => {
    if (!routesWithCoordinates.length) {
      setCurrentStandingRouteName('');
      setNearestRouteInfo(null);
      setRouteLocatorError('');
      return undefined;
    }

    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      setCurrentStandingRouteName('');
      setNearestRouteInfo(null);
      setRouteLocatorError(t(locale, 'routeLocatorNotSupported'));
      return undefined;
    }

    const standingThresholdInMeters = 5;

    const watchId = window.navigator.geolocation.watchPosition(
      (position) => {
        const nearestRoute = routesWithCoordinates.reduce(
          (nearest, route) => {
            const distanceInMeters = calculateDistanceInMeters(
              position.coords.latitude,
              position.coords.longitude,
              route.latitude,
              route.longitude
            );

            if (distanceInMeters < nearest.distanceInMeters) {
              return { route, distanceInMeters };
            }

            return nearest;
          },
          { route: null, distanceInMeters: Number.POSITIVE_INFINITY }
        );

        if (nearestRoute.route && nearestRoute.distanceInMeters <= standingThresholdInMeters) {
          setCurrentStandingRouteName(nearestRoute.route.routeName);
          setNearestRouteInfo(nearestRoute);
          setRouteLocatorError('');
          return;
        }

        setCurrentStandingRouteName('');
        setNearestRouteInfo(nearestRoute.route ? nearestRoute : null);
        setRouteLocatorError('');
      },
      () => {
        setCurrentStandingRouteName('');
        setNearestRouteInfo(null);
        setRouteLocatorError(t(locale, 'routeLocatorPermissionError'));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      window.navigator.geolocation.clearWatch(watchId);
    };
  }, [locale, routesWithCoordinates]);

  const handleRouteLocatorClick = () => {
    if (routeLocatorError) {
      setNearestRouteMessage(routeLocatorError);
      return;
    }

    if (!routesWithCoordinates.length) {
      setNearestRouteMessage(t(locale, 'routeLocatorNoRoutesWithCoordinates'));
      return;
    }

    if (!nearestRouteInfo?.route) {
      setNearestRouteMessage(t(locale, 'routeLocatorWaitingPosition'));
      return;
    }

    setNearestRouteMessage(
      t(locale, 'routeLocatorNearestRoute')
        .replace('{route}', nearestRouteInfo.route.routeName)
        .replace('{subsector}', nearestRouteInfo.route.subsectorName)
        .replace('{distance}', Math.round(nearestRouteInfo.distanceInMeters).toString())
    );
  };

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
    setIsMobileUserMenuOpen(false);
  };

  const closeSelectedSearchRoute = () => {
    setSelectedSearchRoute(null);
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
        <div className="flex shrink-0 flex-col items-start gap-1">
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
            onClick={handleRouteLocatorClick}
            className="rounded-md border border-emerald-300/40 bg-slate-950/80 px-2 py-1 text-sm leading-none text-emerald-200 transition hover:border-emerald-200"
            aria-label={t(locale, 'routeLocatorButtonAria')}
          >
            📍
          </button>
          {currentStandingRouteName ? (
            <p className="max-w-44 rounded-md border border-emerald-300/40 bg-slate-950/80 px-2 py-1 text-[10px] font-medium leading-tight text-emerald-200 md:max-w-56 md:text-xs">
              {currentStandingRouteName}
            </p>
          ) : null}
          {nearestRouteMessage ? (
            <p className="max-w-56 rounded-md border border-slate-500/60 bg-slate-950/80 px-2 py-1 text-[10px] font-medium leading-tight text-slate-200 md:text-xs">
              {nearestRouteMessage}
            </p>
          ) : null}
        </div>

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
                <div className="space-y-2 border-t border-slate-700/70 pt-2">
                  {isConnected ? (
                    <>
                      <p className="text-xs text-slate-300">{t(locale, 'walletConnectedAs').replace('{address}', shortAddress)}</p>
                      <button
                        type="button"
                        onClick={onDisconnectWallet}
                        className="w-full rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-100 transition hover:border-sunset"
                      >
                        {t(locale, 'disconnectWallet')}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-400">{t(locale, 'walletNotConnected')}</p>
                      <button
                        type="button"
                        onClick={onConnectWallet}
                        className="w-full rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-100 transition hover:border-sunset"
                      >
                        {t(locale, 'connectWallet')}
                      </button>
                    </>
                  )}
                  {walletError ? <p className="text-xs text-red-300">{walletError}</p> : null}
                </div>
              </div>
            ) : null}
          </li>
        </ul>
      </div>

      <ul
        id="mobile-navbar-menu"
        className={`relative z-20 mt-3 flex-col gap-2 text-sm font-semibold text-slate-200 md:hidden ${
          isMobileMenuOpen ? 'flex' : 'hidden'
        }`}
      >
          <li>
            <button
              type="button"
              onClick={() => setIsMobileUserMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-900/70 text-lg transition hover:border-sunset"
              aria-label={t(locale, 'userPreferences')}
              aria-expanded={isMobileUserMenuOpen}
            >
              👤
            </button>
          </li>
          {isMobileUserMenuOpen ? (
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
              <div className="mt-2 space-y-2 border-t border-slate-700/70 pt-2">
                {isConnected ? (
                  <>
                    <p className="text-xs text-slate-300">{t(locale, 'walletConnectedAs').replace('{address}', shortAddress)}</p>
                    <button
                      type="button"
                      onClick={onDisconnectWallet}
                      className="w-full rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-100 transition hover:border-sunset"
                    >
                      {t(locale, 'disconnectWallet')}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-400">{t(locale, 'walletNotConnected')}</p>
                    <button
                      type="button"
                      onClick={onConnectWallet}
                      className="w-full rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-100 transition hover:border-sunset"
                    >
                      {t(locale, 'connectWallet')}
                    </button>
                  </>
                )}
                {walletError ? <p className="text-xs text-red-300">{walletError}</p> : null}
              </div>
            </li>
          ) : null}
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
      </ul>

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
                  <li key={route.id ?? `${route.subsectorName}-${route.name}`}>
                    <button
                      type="button"
                      className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 p-2 text-left transition hover:border-sunset/60 disabled:cursor-default disabled:hover:border-slate-700/70"
                      onClick={() => setSelectedSearchRoute(route)}
                      disabled={!route.image}
                    >
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
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-400">{t(locale, 'noSimilarRoutes')}</p>
            )
          ) : null}
        </div>
      ) : null}

      {selectedSearchRoute?.image ? (
        <div className="fixed inset-0 z-50 bg-slate-950/95" onClick={closeSelectedSearchRoute}>
          <section
            className="relative h-full w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-search-route-title"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedSearchRoute.image}
              alt={`${t(locale, 'routeImageAlt')} ${selectedSearchRoute.name}`}
              className="h-full w-full object-contain"
              fill
              sizes="100vw"
              unoptimized
            />
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full border border-slate-600 bg-slate-950/60 px-3 py-1 text-sm text-slate-100 backdrop-blur hover:bg-slate-900"
              onClick={closeSelectedSearchRoute}
            >
              {t(locale, 'closeButton')}
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-16">
              <h4 id="selected-search-route-title" className="text-lg font-semibold text-white">
                {selectedSearchRoute.name}
              </h4>
              <p className="text-sm text-slate-300">{selectedSearchRoute.subsectorName}</p>
              <p className="mt-1 text-sm text-slate-300">
                {t(locale, 'gradeLabel')}: {convertGrade(selectedSearchRoute.grade, gradeSystem) ?? t(locale, 'noGrade')}
              </p>
              <p className="mt-3 text-sm text-slate-200">
                {selectedSearchRoute.description ?? t(locale, 'noDescription')}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </nav>
  );
}
