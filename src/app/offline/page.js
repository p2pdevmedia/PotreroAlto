export const metadata = {
  title: 'Sin conexión | Potrero Alto',
  description: 'No tenés conexión a internet. Revisá tu red e intentá nuevamente.'
};

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold text-orange-600">Sin conexión</h1>
      <p className="text-lg text-slate-700">
        Estás viendo la versión offline de Potrero Alto. Cuando vuelva internet, recargá para obtener datos actualizados.
      </p>
    </main>
  );
}
