import AdminEditor from '@/app/admin/admin-editor';

export const metadata = {
  title: 'Editar subsector | Admin | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminSubsectorPage({ params }) {
  const { subsectorId } = params;

  return <AdminEditor view="subsector" subsectorId={decodeURIComponent(subsectorId)} />;
}
