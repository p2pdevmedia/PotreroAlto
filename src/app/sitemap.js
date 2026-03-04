const DEFAULT_SITE_URL = 'https://potreroalto.xyz';

const LOCALE_PATHS = {
  'es-AR': '/',
  es: '/',
  en: '/',
  pt: '/',
  fr: '/',
  de: '/',
  it: '/',
  'x-default': '/'
};

function normalizeSiteUrl(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export default function sitemap() {
  const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(LOCALE_PATHS).map(([locale, path]) => [locale, `${siteUrl}${path}`])
        )
      }
    }
  ];
}
