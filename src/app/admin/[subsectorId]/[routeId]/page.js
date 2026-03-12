import RouteEditorPage from '@/app/admin/route-editor-page';

export const metadata = {
  title: 'Admin Vía | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default function Page({ params }) {
  return <RouteEditorPage params={params} />;
}
