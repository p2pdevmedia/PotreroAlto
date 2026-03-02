import { getPotreroAltoData } from '@/lib/thecrag';
import SubsectorAccordion from '@/app/subsector-accordion';

export default async function HomePage() {
  let data;
  let error = null;

  try {
    data = await getPotreroAltoData();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header
        className="relative mb-10 card overflow-hidden"
        style={{ aspectRatio: '7 / 3' }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[125%]"
          style={{
            backgroundImage:
              'url("https://image.thecrag.com/1280x960/04/2a/042abb36f28639772ff48b7839955649f754f653")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top'
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom right, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.88), rgba(45, 99, 91, 0.45))'
          }}
        />
        <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Guía de escalada</p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Potrero Alto</h1>
          <p className="mt-4 max-w-3xl text-slate-200">
            Web informativa conectada con <span className="font-semibold text-sunset">theCrag API</span> para listar
            subsectores y vías del sector <span className="font-semibold">ID 6574670919</span>.
          </p>
        </div>
      </header>

      {data?.isFallback && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-400/60 bg-red-700/90 px-4 py-3 text-sm font-semibold text-red-100 shadow-lg"
        >
          ⚠️ Mostrando datos de respaldo locales: esta información puede no estar actualizada.
        </div>
      )}

      {error ? (
        <section className="card border-red-500/30 bg-red-900/20">
          <h2 className="text-xl font-semibold text-red-200">No se pudo cargar la información en este entorno</h2>
          <p className="mt-2 text-red-100">{error}</p>
          <p className="mt-4 text-sm text-red-100/80">
            En tu entorno local ejecuta <code className="rounded bg-red-950 px-1 py-0.5">npm install</code> y
            verifica acceso de red y disponibilidad de la API pública de theCrag.
          </p>
        </section>
      ) : (
        <section className="space-y-6">
          <SubsectorAccordion subsectors={data.subsectors} />
        </section>
      )}
    </main>
  );
}
