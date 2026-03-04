import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import PWARegister from './pwa-register';

const DEFAULT_SITE_URL = 'https://potreroalto.xyz';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
const pageTitle = 'Potrero Alto | Escalada deportiva en San Martín de los Andes';
const pageDescription =
  'Guía del sector de escalada deportiva Potrero Alto en San Martín de los Andes, Neuquén, Argentina. Información de subsectores, vías, grados y ubicación para planificar tu visita.';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Potrero Alto',
  url: siteUrl,
  inLanguage: ['es-AR', 'en', 'pt', 'fr', 'de', 'it'],
  description: pageDescription,
  about: {
    '@type': 'SportsActivityLocation',
    name: 'Potrero Alto',
    description: 'Sector de escalada deportiva en San Martín de los Andes, Neuquén, Argentina.',
    sport: 'Climbing',
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
    }
  }
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: pageTitle,
  description: pageDescription,
  applicationName: 'Potrero Alto',
  keywords: [
    'Potrero Alto',
    'escalada deportiva',
    'San Martín de los Andes',
    'escalada en Neuquén',
    'guía de escalada',
    'vías de escalada',
    'subsectores de escalada',
    'sport climbing Argentina'
  ],
  alternates: {
    canonical: '/',
    languages: {
      'es-AR': '/',
      es: '/',
      en: '/',
      pt: '/',
      fr: '/',
      de: '/',
      it: '/',
      'x-default': '/'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    alternateLocale: ['en_US', 'pt_BR', 'fr_FR', 'de_DE', 'it_IT'],
    url: '/',
    siteName: 'Potrero Alto',
    title: pageTitle,
    description: pageDescription
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription
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
  },
  icons: {
    icon: '/potrero-alto-carabiner-orange-large.ico',
    apple: '/potrero-alto-carabiner-orange-large.ico'
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Potrero Alto'
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
        <PWARegister />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
