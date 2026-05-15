import HomeContent from '@/app/home-content';
import { getPotreroAltoData } from '@/lib/potrero-alto-data';
import { notFound } from 'next/navigation';
import { getGradeBucketsWithRoutes, getRoutesForGradeSlug, gradeBucketToSlug } from '@/lib/route-utils';
import { buildPageMetadata, gradeSeoDescription, gradeSeoTitle } from '@/lib/site-seo';

export async function generateStaticParams() {
  const data = await getPotreroAltoData();

  return getGradeBucketsWithRoutes(data).map(({ gradeBucket }) => ({
    gradeSlug: gradeBucketToSlug(gradeBucket)
  }));
}

export async function generateMetadata({ params }) {
  const { gradeSlug } = await params;
  const data = await getPotreroAltoData();
  const { gradeBucket, routes } = getRoutesForGradeSlug(data, gradeSlug);

  if (!gradeBucket) {
    return {
      title: 'Grado no encontrado | Potrero Alto',
      robots: {
        index: false,
        follow: true
      }
    };
  }

  return buildPageMetadata({
    title: gradeSeoTitle(gradeBucket),
    description: gradeSeoDescription(gradeBucket, routes),
    path: `/grados/${gradeBucketToSlug(gradeBucket)}`,
    keywords: [`grado ${gradeBucket}`, `vías ${gradeBucket}`, ...routes.map((route) => route.name)]
  });
}

export default async function GradeBucketPage({ params }) {
  const { gradeSlug } = await params;

  let data;
  let error = null;

  try {
    data = await getPotreroAltoData();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
  }

  const { gradeBucket, routes } = getRoutesForGradeSlug(data, gradeSlug);

  if (!error && !gradeBucket) {
    notFound();
  }

  return (
    <>
      {gradeBucket ? (
        <section className="sr-only" aria-label={`Vías grado ${gradeBucket}`}>
          <h1>{gradeSeoTitle(gradeBucket)}</h1>
          <p>{gradeSeoDescription(gradeBucket, routes)}</p>
          <ul>
            {routes.map((route) => (
              <li key={route.id ?? `${route.subsectorName}-${route.name}`}>
                {route.name}, {route.subsectorName}
                {route.lengthMeters ? `, ${route.lengthMeters} metros` : ''}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <HomeContent data={data} error={error} initialGradeSlug={gradeSlug} />
    </>
  );
}
