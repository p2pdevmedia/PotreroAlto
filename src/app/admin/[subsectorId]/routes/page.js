import AdminEditor from '@/app/admin/admin-editor';
import { getPublicImagePaths } from '@/lib/public-images';

export const metadata = {
  title: 'Vías del subsector | Admin | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminSubsectorRoutesPage({ params }) {
  const { subsectorId } = params;
  const availableImages = await getPublicImagePaths();

  return <AdminEditor view="routes" subsectorId={decodeURIComponent(subsectorId)} availableImages={availableImages} />;
}
