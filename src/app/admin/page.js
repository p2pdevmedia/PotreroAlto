import AdminEditor from '@/app/admin/admin-editor';
import { getPublicImagePaths } from '@/lib/public-images';

export const metadata = {
  title: 'Admin | Potrero Alto',
  alternates: {
    canonical: '/admin'
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage() {
  const availableImages = await getPublicImagePaths();

  return <AdminEditor view="subsectors" availableImages={availableImages} />;
}
