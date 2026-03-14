import AdminEditor from '@/app/admin/admin-editor';
import { getPublicImagePaths } from '@/lib/public-images';

export const metadata = {
  title: 'Nueva vía | Admin | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminNewRoutePage({ params }) {
  const { subsectorId } = params;
  const availableImages = await getPublicImagePaths();

  return <AdminEditor view="new-route" subsectorId={decodeURIComponent(subsectorId)} availableImages={availableImages} />;
}
