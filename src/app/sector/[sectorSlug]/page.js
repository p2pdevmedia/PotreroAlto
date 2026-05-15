import HomeContent from '@/app/home-content';
import { getPotreroAltoData } from '@/lib/potrero-alto-data';
import { notFound } from 'next/navigation';
import { buildSubsectorPath, findSubsectorBySlug, slugifySegment } from '@/lib/route-utils';
import {
  DEFAULT_OG_IMAGE,
  buildPageMetadata,
  buildSubsectorStructuredData,
  subsectorSeoDescription,
  subsectorSeoTitle
} from '@/lib/site-seo';

export async function generateStaticParams() {
  const data = await getPotreroAltoData();

  return (data?.subsectors ?? []).map((subsector) => ({
    sectorSlug: slugifySegment(subsector.name, 'subsector')
  }));
}

export async function generateMetadata({ params }) {
  const { sectorSlug } = await params;
  const data = await getPotreroAltoData();
  const subsector = findSubsectorBySlug(data, sectorSlug);

  if (!subsector) {
    return {
      title: 'Sector no encontrado | Potrero Alto',
      robots: {
        index: false,
        follow: true
      }
    };
  }

  const description = subsectorSeoDescription(subsector);

  return buildPageMetadata({
    title: subsectorSeoTitle(subsector),
    description,
    path: buildSubsectorPath(subsector.name),
    image: subsector.image || DEFAULT_OG_IMAGE,
    keywords: [subsector.name, ...((subsector.routes ?? []).map((route) => route.name))]
  });
}

export default async function SectorPage({ params }) {
  const { sectorSlug } = await params;

  let data;
  let error = null;

  try {
    data = await getPotreroAltoData();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
  }

  const subsector = findSubsectorBySlug(data, sectorSlug);

  if (!error && !subsector) {
    notFound();
  }

  const description = subsector ? subsectorSeoDescription(subsector) : null;

  return (
    <>
      {subsector ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                buildSubsectorStructuredData(subsector, buildSubsectorPath(subsector.name), description)
              )
            }}
          />
          <section className="sr-only" aria-label={`Resumen de ${subsector.name}`}>
            <h1>{subsectorSeoTitle(subsector)}</h1>
            <p>{description}</p>
            <ul>
              {(subsector.routes ?? []).map((route) => (
                <li key={route.id ?? route.name}>
                  {route.name}
                  {route.grade ? `, ${route.grade}` : ''}
                  {route.lengthMeters ? `, ${route.lengthMeters} metros` : ''}
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
      <HomeContent data={data} error={error} initialSubsectorSlug={sectorSlug} />
    </>
  );
}
