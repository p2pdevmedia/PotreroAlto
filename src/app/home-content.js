'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SubsectorAccordion from '@/app/subsector-accordion';
import Navbar from '@/app/_Navbar';
import GradeDistributionChart from '@/app/grade-distribution-chart';
import { convertGrade, detectPreferredLocale, GRADE_SYSTEM_OPTIONS, LANGUAGE_OPTIONS, t } from '@/lib/i18n';

const GRADE_CONVERSION_ROWS = [
  ['V+', '5.9', 'VI-', '17'],
  ['6a', '5.10a', 'VI+', '18'],
  ['6a+', '5.10b', 'VII-', '19'],
  ['6b', '5.10c', 'VII', '20'],
  ['6b+', '5.10d', 'VII+', '21'],
  ['6c', '5.11a', 'VIII-', '22'],
  ['6c/+', '5.11b', 'VIII', '23'],
  ['6c+', '5.11c', 'VIII+', '24'],
  ['7a', '5.11d', 'IX-', '25'],
  ['7a+', '5.12a', 'IX', '26'],
  ['7b', '5.12b', 'IX+', '27'],
  ['7b+', '5.12c', 'X-', '28'],
  ['7c', '5.12d', 'X', '29'],
  ['7c+', '5.13a', 'X+', '30'],
  ['8a', '5.13b', 'XI-', '31'],
  ['8a+', '5.13c', 'XI', '32'],
  ['8b', '5.13d', 'XI+', '33'],
  ['8b+', '5.14a', 'XII-', '34'],
  ['8c', '5.14b', 'XII', '35'],
  ['8c+', '5.14c', 'XII+', '36'],
  ['9a', '5.14d', 'XIII-', '37'],
  ['9a+', '5.15a', 'XIII', '38'],
  ['9b', '5.15b', 'XIII+', '39'],
  ['9b+', '5.15c', 'XIV-', '40'],
  ['9c', '5.15d', 'XIV', '41']
];

const SECTOR_COORDINATES = {
  lat: -40.13691962008833,
  lng: -71.2525320779115
};

const SECTOR_RADIUS_METERS = 1000;


function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceInMeters(fromLat, fromLng, toLat, toLng) {
  const earthRadiusInMeters = 6371000;
  const latDistanceInRadians = toRadians(toLat - fromLat);
  const lngDistanceInRadians = toRadians(toLng - fromLng);
  const a =
    Math.sin(latDistanceInRadians / 2) * Math.sin(latDistanceInRadians / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(lngDistanceInRadians / 2) * Math.sin(lngDistanceInRadians / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusInMeters * c;
}


function slugifySegment(value, fallback = 'item') {
  const normalized = String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || fallback;
}

function buildRoutePath(subsectorName, routeName) {
  const sectorSlug = slugifySegment(subsectorName, 'subsector');
  const routeSlug = slugifySegment(routeName, 'ruta');

  return `/sector/${sectorSlug}/ruta/${routeSlug}`;
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

export default function HomeContent({ data, error }) {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isSectorMapOpen, setIsSectorMapOpen] = useState(false);
  const [selectedGradeBucket, setSelectedGradeBucket] = useState(null);
  const [selectedGradeRoute, setSelectedGradeRoute] = useState(null);
  const [locale, setLocale] = useState('es');
  const [gradeSystem, setGradeSystem] = useState('french');
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [locationCheckMessage, setLocationCheckMessage] = useState('');
  const sectorMapStatePushedRef = useRef(false);
  const gradeBucketStatePushedRef = useRef(false);
  const gradeRouteStatePushedRef = useRef(false);
  const selectedGradeBucketRef = useRef(null);
  const selectedGradeRouteRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedLocale = window.localStorage.getItem('potrero-locale');
    const savedGradeSystem = window.localStorage.getItem('potrero-grade-system');

    if (savedLocale && LANGUAGE_OPTIONS.some((option) => option.code === savedLocale)) {
      setLocale(savedLocale);
    } else {
      setLocale(detectPreferredLocale());
    }

    if (savedGradeSystem && GRADE_SYSTEM_OPTIONS.some((option) => option.code === savedGradeSystem)) {
      setGradeSystem(savedGradeSystem);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('potrero-locale', locale);
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('potrero-grade-system', gradeSystem);
  }, [gradeSystem]);


  useEffect(() => {
    selectedGradeBucketRef.current = selectedGradeBucket;
  }, [selectedGradeBucket]);

  useEffect(() => {
    selectedGradeRouteRef.current = selectedGradeRoute;
  }, [selectedGradeRoute]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handlePopState = () => {
      if (selectedGradeRouteRef.current) {
        gradeRouteStatePushedRef.current = false;
        setSelectedGradeRoute(null);
        return;
      }

      if (selectedGradeBucketRef.current) {
        gradeRouteStatePushedRef.current = false;
        gradeBucketStatePushedRef.current = false;
        setSelectedGradeRoute(null);
        setSelectedGradeBucket(null);
        return;
      }

      if (isSectorMapOpen) {
        sectorMapStatePushedRef.current = false;
        setIsSectorMapOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isSectorMapOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (isSectorMapOpen && !sectorMapStatePushedRef.current) {
      window.history.pushState({ potreroOverlay: 'sector-map' }, '', window.location.href);
      sectorMapStatePushedRef.current = true;
    }

    if (!isSectorMapOpen) {
      sectorMapStatePushedRef.current = false;
    }
  }, [isSectorMapOpen]);

  const closeSectorMap = () => {
    if (typeof window !== 'undefined' && sectorMapStatePushedRef.current) {
      window.history.back();
      return;
    }

    setIsSectorMapOpen(false);
  };

  const closeSelectedGradeBucket = () => {
    if (typeof window !== 'undefined' && selectedGradeRoute) {
      window.history.back();
      return;
    }

    if (typeof window !== 'undefined' && selectedGradeBucket) {
      window.history.back();
      return;
    }

    setSelectedGradeBucket(null);
    setSelectedGradeRoute(null);
  };


  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (selectedGradeBucket && !gradeBucketStatePushedRef.current) {
      window.history.pushState({ potreroOverlay: 'grade-bucket' }, '', '/grados');
      gradeBucketStatePushedRef.current = true;
    }

    if (!selectedGradeBucket) {
      gradeBucketStatePushedRef.current = false;
    }
  }, [selectedGradeBucket]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (selectedGradeRoute && !gradeRouteStatePushedRef.current) {
      window.history.pushState(
        { potreroOverlay: 'grade-route' },
        '',
        buildRoutePath(selectedGradeRoute.subsectorName, selectedGradeRoute.name)
      );
      gradeRouteStatePushedRef.current = true;
    }

    if (!selectedGradeRoute) {
      gradeRouteStatePushedRef.current = false;
    }
  }, [selectedGradeRoute]);

  const allRoutesWithSubsector = (data?.subsectors ?? []).flatMap((subsector) =>
    (subsector.routes ?? []).map((route) => ({ ...route, subsectorName: subsector.name }))
  );

  const checkIfUserIsNearSector = () => {
    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      setLocationCheckMessage(t(locale, 'locationNotSupported'));
      return;
    }

    setIsCheckingLocation(true);
    setLocationCheckMessage('');

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        const distanceInMeters = calculateDistanceInMeters(
          userLatitude,
          userLongitude,
          SECTOR_COORDINATES.lat,
          SECTOR_COORDINATES.lng
        );

        if (distanceInMeters <= SECTOR_RADIUS_METERS) {
          setLocationCheckMessage(t(locale, 'insideClimbingSector'));
        } else {
          setLocationCheckMessage(
            t(locale, 'outsideClimbingSector').replace('{distance}', Math.round(distanceInMeters).toString())
          );
        }

        setIsCheckingLocation(false);
      },
      () => {
        setLocationCheckMessage(t(locale, 'locationPermissionError'));
        setIsCheckingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <Navbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        subsectors={data?.subsectors ?? []}
        locale={locale}
        onLocaleChange={setLocale}
        gradeSystem={gradeSystem}
        onGradeSystemChange={setGradeSystem}
      />

      {activeSection === 'inicio' && (
        <>
          {error ? (
            <section className="card border-red-500/30 bg-red-900/20">
              <h2 className="text-xl font-semibold text-red-200">{t(locale, 'loadErrorTitle')}</h2>
              <p className="mt-2 text-red-100">{error}</p>
              <p className="mt-4 text-sm text-red-100/80">
                {t(locale, 'loadErrorHintBefore')} <code className="rounded bg-red-950 px-1 py-0.5">npm install</code>{' '}
                {t(locale, 'loadErrorHintAfter')}
              </p>
            </section>
          ) : (
            <section className="space-y-6" aria-label="Subsectores de Potrero Alto">
              <GradeDistributionChart
                routes={allRoutesWithSubsector}
                className="mb-6"
                locale={locale}
                gradeSystem={gradeSystem}
                onGradeSelect={setSelectedGradeBucket}
              />
              <SubsectorAccordion subsectors={data.subsectors} locale={locale} gradeSystem={gradeSystem} />
            </section>
          )}
        </>
      )}

      {activeSection === 'como-llegar' && (
        <section className="card">
          <h2 className="text-2xl font-bold text-white">{t(locale, 'howToGetThere')}</h2>
          <p className="mt-3 max-w-3xl text-slate-200">{t(locale, 'howToGetThereText')}</p>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-700/60">
            <iframe
              title={t(locale, 'mapTitle')}
              src="https://maps.google.com/maps?q=-40.13691962008833,-71.2525320779115&z=14&output=embed"
              className="h-80 w-full md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={checkIfUserIsNearSector}
              disabled={isCheckingLocation}
              className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingLocation ? t(locale, 'checkingLocation') : t(locale, 'checkMyLocation')}
            </button>
            {locationCheckMessage && <p className="mt-3 text-sm text-slate-200">{locationCheckMessage}</p>}
          </div>
        </section>
      )}

      {activeSection === 'faq' && (
        <section className="space-y-6">
          <article className="card">
            <h2 className="text-2xl font-bold text-white">{t(locale, 'faqRatingTitle')}</h2>
            <p className="mt-3 text-slate-200">
              {t(locale, 'faqRatingBody1')}
              <span className="font-semibold text-slate-100"> ⭐ 🧉 🍺 🍕 🚬</span>.
            </p>
            <p className="mt-3 text-slate-200">{t(locale, 'faqRatingBody2')}</p>
          </article>

          <article className="card">
            <h2 className="text-2xl font-bold text-white">{t(locale, 'faqClimbingGuideTitle')}</h2>
            <div className="mt-4 space-y-4 text-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'faqDistributionTitle')}</h3>
                <p className="mt-1">{t(locale, 'faqDistributionBody')}</p>
                <button
                  type="button"
                  onClick={() => setIsSectorMapOpen(true)}
                  className="mt-3 block w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/40 text-left transition hover:border-slate-500/80"
                  aria-label={t(locale, 'openLargeImage')}
                >
                  <Image
                    src="/WhatsApp Image 2026-03-03 at 3.20.04 PM.jpeg"
                    alt={t(locale, 'sectorImageAlt')}
                    width={1600}
                    height={1200}
                    className="h-auto w-full"
                    priority={false}
                  />
                </button>
                <p className="mt-2 text-xs text-slate-400">{t(locale, 'clickImageToZoom')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'faqSubsectorTitle')}</h3>
                <p className="mt-1">{t(locale, 'faqSubsectorBody')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'faqHistogramTitle')}</h3>
                <p className="mt-1">{t(locale, 'faqHistogramBody1')}</p>
                <p className="mt-2">{t(locale, 'gradeColorSentence')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'faqConversionTitle')}</h3>
                <p className="mt-1">{t(locale, 'faqConversionBody')}</p>
                <div className="mt-3 overflow-x-auto rounded-xl border border-slate-700/60">
                  <table className="min-w-full divide-y divide-slate-700/70 text-left text-sm">
                    <thead className="bg-slate-900/70 text-slate-100">
                      <tr>
                        <th className="px-3 py-2 font-semibold">{t(locale, 'conversionFrench')}</th>
                        <th className="px-3 py-2 font-semibold">{t(locale, 'conversionYds')}</th>
                        <th className="px-3 py-2 font-semibold">{t(locale, 'conversionUiaa')}</th>
                        <th className="px-3 py-2 font-semibold">{t(locale, 'conversionEwbank')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40 text-slate-200">
                      {GRADE_CONVERSION_ROWS.map(([french, yds, uiaa, ewbank]) => (
                        <tr key={french}>
                          <td className="px-3 py-2 font-medium text-slate-100">{french}</td>
                          <td className="px-3 py-2">{yds}</td>
                          <td className="px-3 py-2">{uiaa}</td>
                          <td className="px-3 py-2">{ewbank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-slate-400">{t(locale, 'conversionNote')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'faqSearchTitle')}</h3>
                <p className="mt-1">{t(locale, 'faqSearchBody')}</p>
              </div>
            </div>
          </article>

          <article className="card">
            <h2 className="text-2xl font-bold text-white">{t(locale, 'rulesTitle')}</h2>
            <div className="mt-4 space-y-4 text-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'rules1Title')}</h3>
                <p className="mt-1">{t(locale, 'rules1Line1')}</p>
                <p className="mt-1">{t(locale, 'rules1Line2')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'rules2Title')}</h3>
                <p className="mt-1">{t(locale, 'rules2Line1')}</p>
                <p className="mt-1">{t(locale, 'rules2Line2')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'rules3Title')}</h3>
                <p className="mt-1">{t(locale, 'rules3Line1')}</p>
                <p className="mt-1">{t(locale, 'rules3Line2')}</p>
                <p className="mt-1">{t(locale, 'rules3Line3')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'rules4Title')}</h3>
                <p className="mt-1">{t(locale, 'rules4Line1')}</p>
                <p className="mt-1">{t(locale, 'rules4Line2')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'rules5Title')}</h3>
                <p className="mt-1">{t(locale, 'rules5Line1')}</p>
                <p className="mt-1">{t(locale, 'rules5Line2')}</p>
                <p className="mt-1">{t(locale, 'rules5Line3')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'rules6Title')}</h3>
                <p className="mt-1">{t(locale, 'rules6Line1')}</p>
                <p className="mt-1">{t(locale, 'rules6Line2')}</p>
                <p className="mt-1">{t(locale, 'rules6Line3')}</p>
                <p className="mt-1">{t(locale, 'rules6Line4')}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{t(locale, 'spiritTitle')}</h3>
                <p className="mt-1">{t(locale, 'spiritBody')}</p>
              </div>
            </div>
          </article>
        </section>
      )}

      {isSectorMapOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t(locale, 'zoomedImageLabel')}
          onClick={closeSectorMap}
        >
          <button
            type="button"
            onClick={closeSectorMap}
            className="absolute right-4 top-4 rounded-md border border-slate-600 bg-slate-900/90 px-3 py-1 text-sm font-medium text-slate-100 transition hover:border-slate-300"
          >
            {t(locale, 'close')}
          </button>
          <div className="max-h-[90vh] max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src="/WhatsApp Image 2026-03-03 at 3.20.04 PM.jpeg"
              alt={t(locale, 'zoomedImageAlt')}
              width={2400}
              height={1800}
              className="max-h-[90vh] w-auto rounded-xl border border-slate-700"
              priority={false}
            />
          </div>
        </div>
      )}

      {selectedGradeBucket ? (
        <div className="fixed inset-0 z-50 bg-slate-950/90 p-4 backdrop-blur-sm" onClick={closeSelectedGradeBucket}>
          <div
            className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedGradeBucket.gradeLabel} ${t(locale, 'gradeLabel').toLowerCase()}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-100">
                {selectedGradeBucket.gradeLabel} · {selectedGradeBucket.routes.length}{' '}
                {selectedGradeBucket.routes.length === 1 ? t(locale, 'routeSingle') : t(locale, 'routePlural')}
              </h2>
              <button
                type="button"
                onClick={closeSelectedGradeBucket}
                className="rounded-md border border-slate-600 px-3 py-1 text-sm font-medium text-slate-100 transition hover:border-slate-300"
              >
                {t(locale, 'closeButton')}
              </button>
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
              {selectedGradeBucket.routes.map((route) => {
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

                return (
                  <li key={`${route.id ?? route.name}-${route.grade ?? 'no-grade'}`} className="border-b border-slate-800 py-3 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-100">{route.name}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Subsector: {route.subsectorName ?? '-'}</p>
                        {route.image ? (
                          <button
                            type="button"
                            className="mt-2 overflow-hidden rounded-lg border border-slate-700/80 transition hover:border-sunset/60"
                            onClick={() => setSelectedGradeRoute(route)}
                            aria-label={`${t(locale, 'photo')}: ${route.name}`}
                          >
                            <Image
                              src={route.image}
                              alt={`${t(locale, 'routeImageAlt')} ${route.name}`}
                              width={176}
                              height={112}
                              className="h-20 w-32 object-cover"
                              unoptimized
                            />
                          </button>
                        ) : null}
                        {route.type ? <p className="text-[11px] uppercase tracking-wide text-slate-400">{route.type}</p> : null}
                        {routeMetrics ? <p className="text-xs text-slate-300">{routeMetrics}</p> : null}
                        {firstAscent ? <p className="text-xs text-slate-300">{firstAscent}</p> : null}
                        {equipped ? <p className="text-xs text-slate-300">{equipped}</p> : null}
                        {route.description ? <p className="mt-1 text-xs text-slate-300">{route.description}</p> : null}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-sunset">{convertGrade(route.grade, gradeSystem) ?? t(locale, 'noGrade')}</p>
                        {ratingEmojis ? <p className="mt-1 text-xs text-slate-200">{ratingEmojis}</p> : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      {selectedGradeRoute?.image ? (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/95"
          onClick={() => {
            if (typeof window !== 'undefined' && gradeRouteStatePushedRef.current) {
              window.history.back();
              return;
            }

            setSelectedGradeRoute(null);
          }}
        >
          <section
            className="relative h-full w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`${t(locale, 'routeImageAlt')} ${selectedGradeRoute.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedGradeRoute.image}
              alt={`${t(locale, 'routeImageAlt')} ${selectedGradeRoute.name}`}
              className="h-full w-full object-contain"
              fill
              sizes="100vw"
              unoptimized
            />
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full border border-slate-600 bg-slate-950/60 px-3 py-1 text-sm text-slate-100 backdrop-blur hover:bg-slate-900"
              onClick={() => {
                if (typeof window !== 'undefined' && gradeRouteStatePushedRef.current) {
                  window.history.back();
                  return;
                }

                setSelectedGradeRoute(null);
              }}
            >
              {t(locale, 'closeButton')}
            </button>
          </section>
        </div>
      ) : null}

      <footer className="mt-10 border-t border-slate-700/60 pt-6 text-center text-slate-300">
        <p className="text-sm">{t(locale, 'footerMadeWith')}</p>
        <a
          href="https://link.mercadopago.com.ar/potreroalto"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
        >
          {t(locale, 'footerGiftBeer').includes('🍺') ? (
            <>
              {t(locale, 'footerGiftBeer').replace('🍺', '').trimEnd()} <span className="animate-logo-breathe inline-block">🍺</span>
            </>
          ) : (
            t(locale, 'footerGiftBeer')
          )}
        </a>
      </footer>
    </main>
  );
}
