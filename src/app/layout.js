import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import PWARegister from './pwa-register';
import WalletProvider from './wallet-provider';
import {
  DEFAULT_OG_IMAGE,
  SITE_DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
  buildPageMetadata,
  getSiteUrl
} from '@/lib/site-seo';

const siteUrl = getSiteUrl();

const structuredData = {
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
      description: 'Sector de escalada deportiva en San Martín de los Andes, Neuquén, Argentina.',
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
      image: absoluteUrl(DEFAULT_OG_IMAGE),
      keywords: SITE_KEYWORDS.join(', ')
    }
  ],
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  ...buildPageMetadata({
    title: SITE_DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    path: '/',
    image: DEFAULT_OG_IMAGE
  }),
  applicationName: SITE_NAME,
  category: 'sports',
  classification: 'Escalada deportiva',
  icons: {
    icon: '/potrero-alto-carabiner-orange-large.ico',
    apple: '/potrero-alto-carabiner-orange-large.ico'
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <WalletProvider>
          <PWARegister />
          <Analytics />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
