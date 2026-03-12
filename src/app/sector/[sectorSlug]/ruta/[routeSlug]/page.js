import HomeContent from '@/app/home-content';
import { getPotreroAltoData } from '@/lib/potrero-alto-data';

export default async function RoutePage({ params }) {
  const { sectorSlug, routeSlug } = params;

  let data;
  let error = null;

  try {
    data = await getPotreroAltoData();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
  }

  return (
    <HomeContent
      data={data}
      error={error}
      initialSubsectorSlug={sectorSlug}
      initialRouteSlug={routeSlug}
    />
  );
}
