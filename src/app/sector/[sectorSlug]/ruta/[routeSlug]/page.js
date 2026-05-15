import HomeContent from '@/app/home-content';
import { getPotreroAltoData } from '@/lib/potrero-alto-data';
import { notFound } from 'next/navigation';
import { buildRoutePath, findRouteBySlugs, slugifySegment } from '@/lib/route-utils';
import {
  DEFAULT_OG_IMAGE,
  buildPageMetadata,
  buildRouteStructuredData,
  routeSeoDescription,
  routeSeoTitle
} from '@/lib/site-seo';

export async function generateStaticParams() {
  const data = await getPotreroAltoData();

  return (data?.subsectors ?? []).flatMap((subsector) =>
    (subsector.routes ?? []).map((route) => ({
      sectorSlug: slugifySegment(subsector.name, 'subsector'),
      routeSlug: slugifySegment(route.name, 'ruta')
    }))
  );
}

export async function generateMetadata({ params }) {
  const { sectorSlug, routeSlug } = await params;
  const data = await getPotreroAltoData();
  const match = findRouteBySlugs(data, sectorSlug, routeSlug);

  if (!match) {
    return {
      title: 'Vía no encontrada | Potrero Alto',
      robots: {
        index: false,
        follow: true
      }
    };
  }

  const { route, subsector } = match;
  const description = routeSeoDescription(route, subsector);

  return buildPageMetadata({
    title: routeSeoTitle(route, subsector),
    description,
    path: buildRoutePath(subsector.name, route.name),
    image: route.image || subsector.image || DEFAULT_OG_IMAGE,
    keywords: [route.name, subsector.name, route.grade, route.type].filter(Boolean)
  });
}

export default async function RoutePage({ params }) {
  const { sectorSlug, routeSlug } = await params;

  let data;
  let error = null;

  try {
    data = await getPotreroAltoData();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
  }

  const match = findRouteBySlugs(data, sectorSlug, routeSlug);

  if (!error && !match) {
    notFound();
  }

  const routePath = match ? buildRoutePath(match.subsector.name, match.route.name) : null;
  const description = match ? routeSeoDescription(match.route, match.subsector) : null;

  return (
    <>
      {match ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                buildRouteStructuredData(match.route, match.subsector, routePath, description)
              )
            }}
          />
          <article className="sr-only" aria-label={`Resumen de ${match.route.name}`}>
            <h1>{routeSeoTitle(match.route, match.subsector)}</h1>
            <p>{description}</p>
            <dl>
              <dt>Subsector</dt>
              <dd>{match.subsector.name}</dd>
              <dt>Grado</dt>
              <dd>{match.route.grade ?? 'Sin grado'}</dd>
              {match.route.lengthMeters ? (
                <>
                  <dt>Largo</dt>
                  <dd>{match.route.lengthMeters} metros</dd>
                </>
              ) : null}
              {match.route.quickdraws ? (
                <>
                  <dt>Expreses</dt>
                  <dd>{match.route.quickdraws}</dd>
                </>
              ) : null}
            </dl>
          </article>
        </>
      ) : null}
      <HomeContent
        data={data}
        error={error}
        initialSubsectorSlug={sectorSlug}
        initialRouteSlug={routeSlug}
      />
    </>
  );
}
