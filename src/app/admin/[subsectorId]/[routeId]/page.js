import AdminEditor from '@/app/admin/admin-editor';

export const metadata = {
  title: 'Editar vía | Admin | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminRoutePage({ params }) {
  const { subsectorId, routeId } = params;

  return (
    <AdminEditor
      view="route"
      subsectorId={decodeURIComponent(subsectorId)}
      routeId={decodeURIComponent(routeId)}
    />
  );
}
