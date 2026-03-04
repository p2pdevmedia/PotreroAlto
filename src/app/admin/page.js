import AdminEditor from '@/app/admin/admin-editor';

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

export default function AdminPage() {
  return <AdminEditor />;
}
