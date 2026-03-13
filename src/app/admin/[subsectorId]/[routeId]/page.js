import AdminEditor from '@/app/admin/admin-editor';
import { getPublicImagePaths } from '@/lib/public-images';

export const metadata = {
  title: 'Editar vía | Admin | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminRoutePage({ params }) {
  const { subsectorId, routeId } = params;
  const availableImages = await getPublicImagePaths();

  return (
    <AdminEditor
      view="route"
      subsectorId={decodeURIComponent(subsectorId)}
      routeId={decodeURIComponent(routeId)}
      availableImages={availableImages}
    />
  );
}
