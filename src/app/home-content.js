'use client';

import { useState } from 'react';
import Image from 'next/image';
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

      {activeSection === 'faq' && (
        <section className="space-y-6">
          <article className="card">
            <h2 className="text-2xl font-bold text-white">Sistema de puntuación</h2>
            <p className="mt-3 text-slate-200">
              En los resultados de búsqueda, la valoración de cada vía aparece con una combinación de emojis en este orden:
              <span className="font-semibold text-slate-100"> ⭐ 🧉 🍺 🍕 🚬</span>.
            </p>
            <p className="mt-3 text-slate-200">
              A mayor cantidad de símbolos, mejor puntuada está la vía por la comunidad. Si no ves emojis, significa que
              todavía no tiene puntuación cargada.
            </p>
          </article>

          <article className="card">
            <h2 className="text-2xl font-bold text-white">FAQ: cómo entender la guía de escalada</h2>
            <div className="mt-4 space-y-4 text-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-white">Distribución de subsectores en el predio</h3>
                <p className="mt-1">
                  Esta imagen muestra la distribución de los subsectores dentro del Predio Potrero Alto para que puedas
                  ubicarte más rápido al llegar.
                </p>
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/40">
                  <Image
                    src="/WhatsApp Image 2026-03-03 at 3.20.04 PM.jpeg"
                    alt="Distribución de los subsectores dentro del Predio Potrero Alto"
                    width={1600}
                    height={1200}
                    className="h-auto w-full"
                    priority={false}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">¿Qué muestra cada subsector?</h3>
                <p className="mt-1">
                  Cada subsector agrupa las vías por pared o zona. Ahí vas a encontrar cantidad de rutas, dificultad,
                  descripciones y, cuando está disponible, foto de referencia.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">¿Cómo uso el histograma de grados?</h3>
                <p className="mt-1">
                  El gráfico de distribución te ayuda a ver rápidamente si el sector tiene más rutas fáciles, intermedias
                  o duras. Es ideal para planificar una jornada según tu nivel y el de tu cordada.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">¿Para qué sirve el buscador de vías?</h3>
                <p className="mt-1">
                  Podés escribir el nombre de una vía y el buscador te sugiere coincidencias similares. En cada resultado
                  vas a ver subsector, grado, descripción y puntuación.
                </p>
              </div>
            </div>
          </article>

          <article className="card">
            <h2 className="text-2xl font-bold text-white">Reglamento del sector — Potrero Alto</h2>
            <div className="mt-4 space-y-4 text-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-white">1️⃣ 🏕️ No acampar</h3>
                <p className="mt-1">🚫 No está permitido acampar dentro del sector de escalada.</p>
                <p className="mt-1">🌿 Ayudamos a reducir el impacto ambiental y visual.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">2️⃣ 🔥 No hacer fuego</h3>
                <p className="mt-1">🚫 Prohibido hacer fuego o fogatas.</p>
                <p className="mt-1">🌲 Zona sensible a incendios.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">3️⃣ 🗑️ Basura</h3>
                <p className="mt-1">♻️ Todo lo que entra, sale.</p>
                <p className="mt-1">🧹 Llevarse siempre la basura propia.</p>
                <p className="mt-1">💚 Si podés, llevar también basura que encuentres.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">4️⃣ 🧗 Respeto por el sector</h3>
                <p className="mt-1">🤫 Mantener volumen bajo y ambiente tranquilo.</p>
                <p className="mt-1">🌱 Respetar la flora y el entorno natural.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">5️⃣ 🤝 Comunidad</h3>
                <p className="mt-1">🛠️ Si disfrutás del lugar, ayudá a mejorarlo.</p>
                <p className="mt-1">🚶 Podés colaborar limpiando senderos o moviendo piedras sueltas.</p>
                <p className="mt-1">💬 Compartí buenas prácticas con otros escaladores.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">6️⃣ 🚙 Estacionamiento responsable🅿️</h3>
                <p className="mt-1">↔️ Estacionar pensando en ocupar la menor parte posible del camino.</p>
                <p className="mt-1">🚗 Dejar espacio suficiente para el paso de otros vehículos.</p>
                <p className="mt-1">🚜 Mantener libre el acceso para vecinos, servicios y emergencias.</p>
                <p className="mt-1">
                  El acceso depende del respeto y la buena convivencia con los vecinos. Estacionar bien es parte de cuidar
                  el sector.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">⭐ Espíritu del lugar</h3>
                <p className="mt-1">
                  Potrero Alto es un espacio construido entre todos. Cuidarlo es responsabilidad compartida.
                </p>
              </div>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
