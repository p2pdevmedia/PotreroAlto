import AdminEditor from '@/app/admin/admin-editor';
import { getPublicImagePaths } from '@/lib/public-images';

export const metadata = {
  title: 'Nuevo subsector | Admin | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminNewSubsectorPage() {
  const availableImages = await getPublicImagePaths();

  return <AdminEditor view="new-subsector" availableImages={availableImages} />;
}
