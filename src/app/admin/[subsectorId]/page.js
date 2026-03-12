import SubsectorEditorPage from '@/app/admin/subsector-editor-page';

export const metadata = {
  title: 'Admin Subsector | Potrero Alto',
  robots: {
    index: false,
    follow: false
  }
};

export default function Page({ params }) {
  return <SubsectorEditorPage params={params} />;
}
