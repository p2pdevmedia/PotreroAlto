import { getSiteUrl } from '@/lib/site-seo';

function getHostName(url) {
  return new URL(url).hostname;
}

export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/offline']
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: getHostName(siteUrl)
  };
}
