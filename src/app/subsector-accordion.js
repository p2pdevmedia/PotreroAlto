'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import GradeDistributionChart from '@/app/grade-distribution-chart';
import { convertGrade, t } from '@/lib/i18n';

const SUBSECTOR_IMAGE_OVERRIDES = {
  'la chanchería':
    '/images/chancheria.jpeg',
  'cheto / pared este':
    '/images/cheto.jpeg',
  croto:
    '/images/croto.jpeg',
  'el arco':
    '/images/arco.jpeg',
  'el tablero':
    '/images/tablero.jpeg',
  'cañadón':
    '/images/caniadon.jpeg',
  'el derrumbe':
    '/images/derrumbe.jpeg'
};

function slugifySegment(value, defaultValue = 'item') {
  const normalized = String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || defaultValue;
}

function buildSubsectorPath(subsectorName) {
  return `/sector/${slugifySegment(subsectorName, 'subsector')}`;
}

function buildRoutePath(subsectorName, routeName) {
  return `${buildSubsectorPath(subsectorName)}/ruta/${slugifySegment(routeName, 'ruta')}`;
}

function routeImage(route) {
  return route.image;
}

function ratingIconCount(stars) {
  const numericStars = Number.parseFloat(stars);

  if (!Number.isFinite(numericStars) || numericStars <= 0) {
    return 0;
  }

  return Math.min(5, Math.round(numericStars));
}

function starToEmoji(stars) {
  const totalIcons = ratingIconCount(stars);

  if (!totalIcons) {
    return null;
  }

  const ratingScale = ['⭐', '🧉', '🍺', '🍕', '🚬'];

  return ratingScale.slice(0, totalIcons).reverse().join('');
}

function RouteRow({ route, onSelect, locale, gradeSystem }) {
  const hasImage = Boolean(route.image);
  const hasCoordinates = Number.isFinite(route.latitude) && Number.isFinite(route.longitude);
  const ratingEmojis = starToEmoji(route.stars);
  const routeMetrics = [
    route.lengthMeters ? `${route.lengthMeters}m` : null,
    route.quickdraws ? `${route.quickdraws} expreses` : null
  ]
    .filter(Boolean)
    .join(', ');

  const firstAscent = route.firstAscentBy
    ? `PA: ${route.firstAscentBy}${route.firstAscentDate ? `, ${route.firstAscentDate}` : ''}`
    : null;

  const equipped = route.equippedBy
    ? `Equip: ${route.equippedBy}${route.equippedDate ? `, ${route.equippedDate}` : ''}`
    : null;

  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${route.latitude},${route.longitude}`
    : null;

  return (
    <li>
      <div className="border-b border-slate-700/60 py-3 last:border-0">
        <button
          type="button"
          className="flex w-full items-start gap-3 text-left disabled:cursor-default disabled:opacity-70"
          onClick={() => onSelect(route)}
          disabled={!hasImage}
        >
          {hasImage ? (
            <Image
              src={route.image}
              alt={`${t(locale, 'routeImageAlt')} ${route.name}`}
              width={80}
              height={80}
              className="h-16 w-16 shrink-0 rounded-lg border border-sunset/60 object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-[10px] uppercase tracking-wide text-slate-400">
              {t(locale, 'noPhoto')}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 truncate font-medium text-slate-100">{route.name}</p>
              <p className="shrink-0 font-semibold text-sunset">{convertGrade(route.grade, gradeSystem) ?? t(locale, 'noGrade')}</p>
            </div>
            {route.type ? <p className="text-[11px] uppercase tracking-wide text-slate-400">{route.type}</p> : null}
            {routeMetrics ? <p className="text-xs text-slate-300">{routeMetrics}</p> : null}
            {firstAscent ? <p className="text-xs text-slate-300">{firstAscent}</p> : null}
            {equipped ? <p className="text-xs text-slate-300">{equipped}</p> : null}
            {route.description ? <p className="mt-1 line-clamp-1 text-xs text-slate-300">{route.description}</p> : null}
            {ratingEmojis ? (
              <p className="mt-1 text-xs text-slate-100" aria-label={`${t(locale, 'ratingAria')} ${route.stars} de 5`}>
                {ratingEmojis}
              </p>
            ) : null}
          </div>
        </button>
        <div className="mt-2 flex flex-wrap items-center gap-2 pl-[92px]">
          {directionsUrl ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-slate-600 px-2 py-1 text-xs font-medium text-slate-100 transition hover:border-slate-400"
              aria-label={`${t(locale, 'getRouteDirections')}: ${route.name}`}
            >
              <span aria-hidden="true">🧭</span>
              <span>{t(locale, 'getRouteDirections')}</span>
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function subsectorCover(subsector) {
  const overrideImage = SUBSECTOR_IMAGE_OVERRIDES[subsector.name?.toLowerCase()];

  if (overrideImage) {
    return overrideImage;
  }

  if (subsector.image) {
    return subsector.image;
  }

  return '/images/tablero.jpeg';
}

export default function SubsectorAccordion({
  subsectors = [],
  locale = 'es',
  gradeSystem = 'french',
  initialSubsectorSlug = null,
  initialRouteSlug = null
}) {
  const [selectedSubsectorId, setSelectedSubsectorId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const selectedSubsectorIdRef = useRef(null);
  const selectedRouteRef = useRef(null);
  const subsectorStatePushedRef = useRef(false);
  const routeStatePushedRef = useRef(false);

  const selectedSubsector = useMemo(
    () => subsectors.find((subsector) => subsector.id === selectedSubsectorId) ?? null,
    [selectedSubsectorId, subsectors]
  );

  useEffect(() => {
    if (!initialSubsectorSlug || !subsectors.length) {
      return;
    }

    const matchingSubsector = subsectors.find(
      (subsector) => slugifySegment(subsector.name, 'subsector') === initialSubsectorSlug
    );

    if (!matchingSubsector) {
      return;
    }

    setSelectedSubsectorId(matchingSubsector.id);

    if (!initialRouteSlug) {
      return;
    }

    const matchingRoute = matchingSubsector.routes.find((route) => {
      const routeSlug = slugifySegment(route.name, 'ruta');
      return routeSlug === initialRouteSlug && Boolean(routeImage(route));
    });

    setSelectedRoute(matchingRoute ?? null);
  }, [initialRouteSlug, initialSubsectorSlug, subsectors]);

  useEffect(() => {
    if (!selectedSubsector && !selectedRoute) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedSubsector, selectedRoute]);

  useEffect(() => {
    selectedSubsectorIdRef.current = selectedSubsectorId;
  }, [selectedSubsectorId]);

  useEffect(() => {
    selectedRouteRef.current = selectedRoute;
  }, [selectedRoute]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handlePopState = () => {
      if (selectedRouteRef.current) {
        routeStatePushedRef.current = false;
        setSelectedRoute(null);
        return;
      }

      if (selectedSubsectorIdRef.current) {
        routeStatePushedRef.current = false;
        subsectorStatePushedRef.current = false;
        setSelectedRoute(null);
        setSelectedSubsectorId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (selectedSubsector && !subsectorStatePushedRef.current) {
      window.history.pushState(
        { potreroOverlay: 'subsector' },
        '',
        buildSubsectorPath(selectedSubsector.name)
      );
      subsectorStatePushedRef.current = true;
    }

    if (!selectedSubsectorId) {
      subsectorStatePushedRef.current = false;
    }
  }, [selectedSubsector, selectedSubsectorId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (selectedRoute && selectedSubsector && !routeStatePushedRef.current) {
      window.history.pushState(
        { potreroOverlay: 'route' },
        '',
        buildRoutePath(selectedSubsector.name, selectedRoute.name)
      );
      routeStatePushedRef.current = true;
    }

    if (!selectedRoute) {
      routeStatePushedRef.current = false;
    }
  }, [selectedRoute, selectedSubsector]);

  const closeSelectedRoute = () => {
    if (typeof window !== 'undefined' && routeStatePushedRef.current) {
      window.history.back();
      return;
    }

    setSelectedRoute(null);
  };

  const closeSelectedSubsector = () => {
    if (typeof window !== 'undefined' && routeStatePushedRef.current) {
      window.history.back();
      return;
    }

    if (typeof window !== 'undefined' && subsectorStatePushedRef.current) {
      window.history.back();
      return;
    }

    setSelectedRoute(null);
    setSelectedSubsectorId(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {subsectors.map((subsector) => (
          <div
            key={subsector.id}
            role="button"
            tabIndex={0}
            className="group relative aspect-[3/4] overflow-hidden bg-slate-900 text-left"
            onClick={() => setSelectedSubsectorId(subsector.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedSubsectorId(subsector.id);
              }
            }}
            aria-label={`${t(locale, 'viewSubsectorRoutes')} ${subsector.name}`}
          >
            <Image
              src={subsectorCover(subsector)}
              alt={`${t(locale, 'subsectorImageAlt')} ${subsector.name}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              width={720}
              height={1280}
              loading="lazy"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-3 right-3 h-1/3 w-1/2">
              <GradeDistributionChart routes={subsector.routes} compact barsOnly className="pointer-events-none" locale={locale} gradeSystem={gradeSystem} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3 pr-[52%]">
              <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow">{subsector.name}</p>
              <p className="mt-1 text-xs text-slate-100/95">
                ▶ {subsector.routes.length} {subsector.routes.length === 1 ? t(locale, 'routeSingle') : t(locale, 'routePlural')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedSubsector ? (
        <div
          className="fixed inset-0 z-40 flex items-center bg-slate-950/70 p-3 backdrop-blur-sm"
          onClick={closeSelectedSubsector}
        >
          <section
            className="flex h-full max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-subsector-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-slate-700/70 px-4 py-3">
              <div>
                <h3 id="selected-subsector-title" className="text-lg font-semibold text-white">
                  {selectedSubsector.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedSubsector.routes.length} {selectedSubsector.routes.length === 1 ? t(locale, 'routeSingle') : t(locale, 'routePlural')}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
                onClick={closeSelectedSubsector}
              >
                {t(locale, 'closeButton')}
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <GradeDistributionChart
                routes={selectedSubsector.routes}
                title={`${t(locale, 'gradesIn')} ${selectedSubsector.name}`}
                className="mb-4"
                locale={locale}
                gradeSystem={gradeSystem}
              />

              {selectedSubsector.routes.length ? (
                <ul>
                  {selectedSubsector.routes.map((route) => (
                    <RouteRow
                      key={route.id ?? `${selectedSubsector.id}-${route.name}`}
                      route={route}
                      onSelect={setSelectedRoute}
                      locale={locale}
                      gradeSystem={gradeSystem}
                    />
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-sm text-slate-400">{t(locale, 'noRoutesInSubsector')}</p>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {selectedRoute ? (
        <div className="fixed inset-0 z-50 bg-slate-950/95" onClick={closeSelectedRoute}>
          <section
            className="relative h-full w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-route-title"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={routeImage(selectedRoute)}
              alt={`${t(locale, 'routeImageAlt')} ${selectedRoute.name}`}
              className="h-full w-full object-contain"
              fill
              sizes="100vw"
              unoptimized
            />
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full border border-slate-600 bg-slate-950/60 px-3 py-1 text-sm text-slate-100 backdrop-blur hover:bg-slate-900"
              onClick={closeSelectedRoute}
            >
              {t(locale, 'closeButton')}
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-16">
              <h4 id="selected-route-title" className="text-lg font-semibold text-white">
                {selectedRoute.name}
              </h4>
              <p className="text-sm text-slate-300">
                {convertGrade(selectedRoute.grade, gradeSystem) ?? t(locale, 'noGrade')}
                {selectedRoute.type ? ` · ${selectedRoute.type}` : ''}
              </p>
              <p className="mt-3 text-sm text-slate-200">
                {selectedRoute.description ?? t(locale, 'noDescription')}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
