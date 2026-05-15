import { getPotreroAltoData } from '@/lib/potrero-alto-data';
import {
  buildRoutePath,
  buildSubsectorPath,
  getGradeBucketsWithRoutes,
  getRoutesWithSubsectors,
  gradeBucketToSlug
} from '@/lib/route-utils';
import { getSiteUrl } from '@/lib/site-seo';

function sitemapEntry(siteUrl, path, changeFrequency, priority, lastModified) {
  return {
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority
  };
}

export default async function sitemap() {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const data = await getPotreroAltoData();
  const subsectors = data?.subsectors ?? [];
  const routes = getRoutesWithSubsectors(subsectors);
  const gradeBuckets = getGradeBucketsWithRoutes(data);

  return [
    sitemapEntry(siteUrl, '/', 'weekly', 1, lastModified),
    sitemapEntry(siteUrl, '/rutas', 'weekly', 0.95, lastModified),
    sitemapEntry(siteUrl, '/grados', 'weekly', 0.85, lastModified),
    ...subsectors.map((subsector) =>
      sitemapEntry(siteUrl, buildSubsectorPath(subsector.name), 'weekly', 0.9, lastModified)
    ),
    ...routes.map((route) =>
      sitemapEntry(siteUrl, buildRoutePath(route.subsectorName, route.name), 'weekly', 0.8, lastModified)
    ),
    ...gradeBuckets.map(({ gradeBucket }) =>
      sitemapEntry(siteUrl, `/grados/${gradeBucketToSlug(gradeBucket)}`, 'weekly', 0.7, lastModified)
    ),
    sitemapEntry(siteUrl, '/privacy-policy', 'yearly', 0.3, lastModified),
    sitemapEntry(siteUrl, '/terms-of-service', 'yearly', 0.3, lastModified)
  ];
}
