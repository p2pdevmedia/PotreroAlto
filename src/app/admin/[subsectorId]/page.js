import AdminEditor from '@/app/admin/admin-editor';
import { getPublicImagePaths } from '@/lib/public-images';

export const metadata = {
  title: 'Editar subsector | Admin | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminSubsectorPage({ params }) {
  const { subsectorId } = params;
  const availableImages = await getPublicImagePaths();

  return <AdminEditor view="subsector" subsectorId={decodeURIComponent(subsectorId)} availableImages={availableImages} />;
}
