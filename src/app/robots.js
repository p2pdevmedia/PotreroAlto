const DEFAULT_SITE_URL = 'https://potreroalto.xyz';

function normalizeSiteUrl(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function getHostName(url) {
  return new URL(url).hostname;
}

export default function robots() {
  const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: []
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: getHostName(siteUrl)
  };
}
