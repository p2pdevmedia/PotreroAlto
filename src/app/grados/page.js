import HomeContent from '@/app/home-content';
import { getPotreroAltoData } from '@/lib/potrero-alto-data';
import { buildPageMetadata } from '@/lib/site-seo';

export const metadata = buildPageMetadata({
  title: 'Vías por grado | Potrero Alto',
  description:
    'Explorá las vías de escalada deportiva de Potrero Alto agrupadas por grado, con subsectores, dificultad y datos útiles para planificar tu día.',
  path: '/grados',
  keywords: ['vías por grado', 'grados escalada', 'escalada deportiva Potrero Alto']
});

export default async function GradesPage() {
  let data;
  let error = null;

  try {
    data = await getPotreroAltoData();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
  }

  return <HomeContent data={data} error={error} />;
}
