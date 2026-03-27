import Link from 'next/link';

export const metadata = {
  title: 'Política de privacidad | Potrero Alto',
  description:
    'Política de privacidad de Potrero Alto con información sobre el uso del sitio, datos técnicos y opciones de contacto.'
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-black text-amber-300">Política de privacidad</h1>
          <p className="text-sm text-slate-300">Última actualización: 27 de marzo de 2026.</p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-slate-200">
          <p>
            En Potrero Alto valoramos tu privacidad. Esta página explica qué información podemos recopilar
            cuando usás el sitio y cómo la utilizamos para mejorar la experiencia.
          </p>
          <p>
            El sitio puede procesar datos técnicos mínimos necesarios para su funcionamiento, como métricas
            anónimas de uso y datos de sesión para mantener preferencias de idioma y sistema de graduación.
          </p>
          <p>
            Cuando iniciás sesión, tu cuenta se gestiona a través de servicios de autenticación de terceros.
            Potrero Alto no vende datos personales ni comparte información privada con fines comerciales.
          </p>
          <p>
            Si tenés dudas sobre esta política o querés solicitar cambios, escribinos por los canales
            oficiales del proyecto.
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
