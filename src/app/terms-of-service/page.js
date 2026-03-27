import Link from 'next/link';

export const metadata = {
  title: 'Condiciones del servicio | Potrero Alto',
  description:
    'Condiciones del servicio de Potrero Alto con reglas de uso, disponibilidad y limitación de responsabilidad.'
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-black text-amber-300">Condiciones del servicio</h1>
          <p className="text-sm text-slate-300">Última actualización: 27 de marzo de 2026.</p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-slate-200">
          <p>
            Al usar Potrero Alto aceptás estas condiciones. El contenido de rutas, sectores y servicios se
            ofrece con fines informativos para la comunidad de escalada.
          </p>
          <p>
            Nos esforzamos por mantener la información actualizada, pero no garantizamos exactitud absoluta ni
            disponibilidad ininterrumpida del sitio o de integraciones externas.
          </p>
          <p>
            Cada persona es responsable de evaluar riesgos, verificar condiciones reales en el lugar y cumplir
            normas locales de seguridad y acceso.
          </p>
          <p>
            Podemos actualizar estas condiciones cuando sea necesario. El uso continuo de la aplicación implica
            la aceptación de la versión vigente.
          </p>
        </section>

        <Link
          href="/"
          className="inline-flex rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
