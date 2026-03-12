import AdminHome from '@/app/admin/admin-home';

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
  return <AdminHome />;
}
