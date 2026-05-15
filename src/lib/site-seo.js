import {
  buildRoutePath,
  buildSubsectorPath,
  getGradeSummary,
  getRoutesWithSubsectors
} from '@/lib/route-utils';

export const DEFAULT_SITE_URL = 'https://potreroalto.xyz';
export const SITE_NAME = 'Potrero Alto';
export const SITE_DEFAULT_TITLE = 'Potrero Alto | Escalada deportiva en San Martín de los Andes';
export const SITE_DESCRIPTION =
  'Potrero Alto, escalada en San Martín de los Andes: guía del sector de escalada deportiva en Neuquén, Argentina. Información de subsectores, vías, grados y ubicación para planificar tu visita.';
export const DEFAULT_OG_IMAGE = '/images/tablero.jpeg';

export const SITE_KEYWORDS = [
  'Potrero Alto',
  'escalada deportiva',
  'San Martín de los Andes',
  'escalada San Martín de los Andes',
  'escalada san martin de los andes',
  'escalada en San Martín de los Andes',
  'escalada en Neuquén',
  'escalada Patagonia',
  'escalada Patagonia Argentina',
  'guía de escalada',
  'guía de vías de escalada',
  'vías de escalada',
  'subsectores de escalada',
  'topo escalada Argentina',
  'sector de escalada Neuquén',
  'sport climbing Argentina',
  'rock climbing san martin de los andes',
  'potrero alto escalada',
  'climbing argentina patagonia',
  'vias escalada lanin',
  'climbing topo argentina',
  'sport climbing san martin de los andes',
  'sma',
  'sanmarland',
  'kletten',
  'grampe'
];

export function normalizeSiteUrl(url) {
  const siteUrl = String(url ?? DEFAULT_SITE_URL);
  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
}

export function getSiteUrl() {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);
}

export function absoluteUrl(pathOrUrl, siteUrl = getSiteUrl()) {
  if (!pathOrUrl) {
    return siteUrl;
  }

  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${siteUrl}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function truncateDescription(description, maxLength = 155) {
  const compactDescription = String(description ?? '').replace(/\s+/g, ' ').trim();

  if (compactDescription.length <= maxLength) {
    return compactDescription;
  }

  return `${compactDescription.slice(0, maxLength - 1).trim()}…`;
}

function openGraphImages(image = DEFAULT_OG_IMAGE) {
  return [
    {
      url: absoluteUrl(image),
      alt: 'Potrero Alto, sector de escalada deportiva en San Martín de los Andes'
    }
  ];
}

export function buildPageMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  keywords = [],
  type = 'website'
}) {
  const safeDescription = truncateDescription(description || SITE_DESCRIPTION);
  const fullTitle = title || SITE_DEFAULT_TITLE;

  return {
    title: fullTitle,
    description: safeDescription,
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: {
      canonical: path
    },
    openGraph: {
      type,
      locale: 'es_AR',
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description: safeDescription,
      images: openGraphImages(image)
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: safeDescription,
      images: openGraphImages(image).map((entry) => entry.url)
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    }
  };
}

export function routeSeoTitle(route, subsector) {
  const grade = route.grade && !String(route.grade).toLowerCase().includes('sin grado') ? ` ${route.grade}` : '';
  return `${route.name}${grade} | ${subsector.name} | Potrero Alto`;
}

export function routeSeoDescription(route, subsector) {
  const facts = [
    `Vía ${route.name}`,
    route.grade ? `grado ${route.grade}` : null,
    route.type ? route.type : 'escalada deportiva',
    route.lengthMeters ? `${route.lengthMeters} metros` : null,
    route.quickdraws ? `${route.quickdraws} expreses` : null,
    `en ${subsector.name}`,
    'Potrero Alto, San Martín de los Andes, Neuquén'
  ].filter(Boolean);

  const description = route.description ? `${facts.join(', ')}. ${route.description}` : `${facts.join(', ')}.`;
  return truncateDescription(description);
}

export function subsectorSeoTitle(subsector) {
  return `${subsector.name} | Vías de escalada en Potrero Alto`;
}

export function subsectorSeoDescription(subsector) {
  const routeCount = subsector.routes?.length ?? 0;
  const gradeSummary = getGradeSummary(subsector.routes ?? []);
  return truncateDescription(
    `${subsector.name} en Potrero Alto tiene ${routeCount} ${routeCount === 1 ? 'vía' : 'vías'} de escalada deportiva, ${gradeSummary}, en San Martín de los Andes, Neuquén.`
  );
}

export function gradeSeoTitle(gradeBucket) {
  return `Vías grado ${gradeBucket} | Potrero Alto`;
}

export function gradeSeoDescription(gradeBucket, routes = []) {
  const subsectorNames = [...new Set(routes.map((route) => route.subsectorName).filter(Boolean))];
  const subsectorSummary = subsectorNames.length ? ` en ${subsectorNames.join(', ')}` : '';
  return truncateDescription(
    `Listado de ${routes.length} ${routes.length === 1 ? 'vía' : 'vías'} grado ${gradeBucket}${subsectorSummary}. Guía de escalada deportiva de Potrero Alto, San Martín de los Andes.`
  );
}

export function buildBreadcrumbJsonLd(items) {
  const siteUrl = getSiteUrl();

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteUrl)
    }))
  };
}

export function buildWebPageJsonLd({ title, description, path, about }) {
  const siteUrl = getSiteUrl();
  const pageUrl = absoluteUrl(path, siteUrl);

  return {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    inLanguage: 'es-AR',
    isPartOf: {
      '@id': `${siteUrl}/#website`
    },
    about
  };
}

export function buildRouteItemListJsonLd(data, path = '/rutas') {
  const routes = getRoutesWithSubsectors(data?.subsectors ?? []);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vías de escalada de Potrero Alto',
    url: absoluteUrl(path),
    numberOfItems: routes.length,
    itemListElement: routes.map((route, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(buildRoutePath(route.subsectorName, route.name)),
      name: route.grade ? `${route.name} ${route.grade}` : route.name
    }))
  };
}

export function buildHomeStructuredData(data) {
  const siteUrl = getSiteUrl();
  const routeCount = getRoutesWithSubsectors(data?.subsectors ?? []).length;
  const subsectorCount = data?.subsectors?.length ?? 0;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: SITE_NAME,
        url: siteUrl,
        inLanguage: 'es-AR',
        description: SITE_DESCRIPTION,
        keywords: SITE_KEYWORDS.join(', ')
      },
      {
        '@type': 'SportsActivityLocation',
        '@id': `${siteUrl}/#climbing-sector`,
        name: SITE_NAME,
        description: `Sector de escalada deportiva con ${subsectorCount} subsectores y ${routeCount} vías en San Martín de los Andes, Neuquén, Argentina.`,
        sport: 'Escalada deportiva',
        url: siteUrl,
        isPartOf: {
          '@id': `${siteUrl}/#website`
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'San Martín de los Andes',
          addressRegion: 'Neuquén',
          addressCountry: 'AR'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -40.13691962008833,
          longitude: -71.2525320779115
        },
        keywords: SITE_KEYWORDS.join(', ')
      }
    ]
  };
}

export function buildSubsectorStructuredData(subsector, path, description) {
  const title = subsectorSeoTitle(subsector);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd([
        { name: SITE_NAME, path: '/' },
        { name: subsector.name, path }
      ]),
      buildWebPageJsonLd({
        title,
        description,
        path,
        about: {
          '@type': 'SportsActivityLocation',
          name: `${subsector.name} - Potrero Alto`,
          sport: 'Escalada deportiva',
          url: absoluteUrl(buildSubsectorPath(subsector.name)),
          isPartOf: {
            '@id': `${getSiteUrl()}/#climbing-sector`
          }
        }
      })
    ]
  };
}

export function buildRouteStructuredData(route, subsector, path, description) {
  const title = routeSeoTitle(route, subsector);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBreadcrumbJsonLd([
        { name: SITE_NAME, path: '/' },
        { name: subsector.name, path: buildSubsectorPath(subsector.name) },
        { name: route.name, path }
      ]),
      buildWebPageJsonLd({
        title,
        description,
        path,
        about: {
          '@type': 'SportsActivityLocation',
          name: `${route.name} - ${subsector.name}`,
          sport: 'Escalada deportiva',
          url: absoluteUrl(path),
          isPartOf: {
            '@id': `${getSiteUrl()}/#climbing-sector`
          }
        }
      })
    ]
  };
}
