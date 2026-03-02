import { getPotreroAltoData } from '@/lib/thecrag';
import HomeContent from '@/app/home-content';

export default async function HomePage() {
  let data;
  let error = null;

  try {
    data = await getPotreroAltoData();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
  }

  return <HomeContent data={data} error={error} />;
}
