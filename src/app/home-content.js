'use client';

import { useState } from 'react';
import SubsectorAccordion from '@/app/subsector-accordion';
import Navbar from '@/app/_Navbar';
import GradeDistributionChart from '@/app/grade-distribution-chart';

export default function HomeContent({ data, error }) {
  const [activeSection, setActiveSection] = useState('inicio');

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <Navbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        subsectors={data?.subsectors ?? []}
      />

      {activeSection === 'inicio' && (
        <>
          <header className="relative mb-10 card overflow-hidden" style={{ aspectRatio: '7 / 3' }}>
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
                {data?.isFallback ? (
                  'Subsectores de escalada.'
                ) : (
                  <>
                    Web informativa conectada con <span className="font-semibold text-sunset">theCrag API</span> para
                    listar subsectores y vías del sector <span className="font-semibold">ID 6574670919</span>.
                  </>
                )}
              </p>
            </div>
          </header>

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
            <section className="space-y-6" aria-label="Subsectores de Potrero Alto">

            <GradeDistributionChart
              routes={data.subsectors.flatMap((subsector) => subsector.routes)}
              title="Potrero Alto"
              className="mb-6"
            />
              <SubsectorAccordion subsectors={data.subsectors} />
            </section>
          )}
        </>
      )}

      {activeSection === 'como-llegar' && (
        <section className="card">
          <h2 className="text-2xl font-bold text-white">Cómo llegar</h2>
          <p className="mt-3 max-w-3xl text-slate-200">
            Potrero Alto está ubicado en <span className="font-semibold">Q8370 San Martín de los Andes, Neuquén</span>.
            Podés usar el siguiente mapa para ver el punto exacto del sector.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-700/60">
            <iframe
              title="Mapa de Potrero Alto"
              src="https://maps.google.com/maps?q=-40.13691962008833,-71.2525320779115&z=14&output=embed"
              className="h-80 w-full md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      )}

      {activeSection === 'desarrollo-del-sector' && (
        <section className="card">
          <h2 className="text-2xl font-bold text-white">Desarrollo del sector</h2>
          <p className="mt-3 text-slate-200">
            El desarrollo de Potrero Alto comenzó con aperturas exploratorias de escaladores locales que buscaban nuevas
            líneas en la zona de San Martín de los Andes. Con el tiempo, la comunidad fue equipando rutas deportivas,
            limpiando accesos y compartiendo reseñas para que más personas pudieran conocer el lugar.
          </p>
          <p className="mt-3 text-slate-200">
            Hoy el sector sigue creciendo gracias al trabajo colaborativo: apertura de nuevas vías, mantenimiento del
            material fijo y difusión de buenas prácticas para conservar el entorno natural. Esta guía ayuda a centralizar
            la información de subsectores y vías para planificar visitas de forma responsable.
          </p>
        </section>
      )}
    </main>
  );
}
