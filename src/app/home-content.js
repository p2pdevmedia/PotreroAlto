'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import SubsectorAccordion from '@/app/subsector-accordion';
import Navbar from '@/app/_Navbar';
import GradeDistributionChart from '@/app/grade-distribution-chart';
import { createTranslator } from '@/app/i18n';
import { formatGradeForSystem } from '@/app/grade-system';

export default function HomeContent({ data, error }) {
  const [activeSection, setActiveSection] = useState('inicio');
  const [language, setLanguage] = useState('es');
  const [gradeSystem, setGradeSystem] = useState('french');
  const t = useMemo(() => createTranslator(language), [language]);
  const formatGrade = useMemo(
    () => (grade) => formatGradeForSystem(grade, gradeSystem),
    [gradeSystem]
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <Navbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        subsectors={data?.subsectors ?? []}
        language={language}
        onLanguageChange={setLanguage}
        gradeSystem={gradeSystem}
        onGradeSystemChange={setGradeSystem}
        formatGrade={formatGrade}
        t={t}
      />

      {activeSection === 'inicio' && (
        <>
          {error ? (
            <section className="card border-red-500/30 bg-red-900/20">
              <h2 className="text-xl font-semibold text-red-200">{t('loadErrorTitle')}</h2>
              <p className="mt-2 text-red-100">{error}</p>
              <p className="mt-4 text-sm text-red-100/80">{t('loadErrorHint')}</p>
            </section>
          ) : (
            <section className="space-y-6" aria-label={t('subsectorsAria')}>
              <GradeDistributionChart
                routes={data.subsectors.flatMap((subsector) => subsector.routes)}
                title="Potrero Alto"
                className="mb-6"
                formatGrade={formatGrade}
                t={t}
              />
              <SubsectorAccordion subsectors={data.subsectors} formatGrade={formatGrade} t={t} />
            </section>
          )}
        </>
      )}

      {activeSection === 'como-llegar' && (
        <section className="card">
          <h2 className="text-2xl font-bold text-white">{t('howToGetTitle')}</h2>
          <p className="mt-3 max-w-3xl text-slate-200">{t('howToGetText')}</p>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-700/60">
            <iframe
              title={t('mapTitle')}
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
            <h2 className="text-2xl font-bold text-white">{t('ratingSystem')}</h2>
            <p className="mt-3 text-slate-200">
              {t('ratingText1')}
              <span className="font-semibold text-slate-100"> ⭐ 🧉 🍺 🍕 🚬</span>.
            </p>
            <p className="mt-3 text-slate-200">{t('ratingText2')}</p>
          </article>

          <article className="card">
            <h2 className="text-2xl font-bold text-white">{t('faqTitle')}</h2>
            <div className="mt-4 space-y-4 text-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-white">{t('faqDistribution')}</h3>
                <p className="mt-1">{t('faqDistributionText')}</p>
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/40">
                  <Image
                    src="/WhatsApp Image 2026-03-03 at 3.20.04 PM.jpeg"
                    alt={t('faqDistribution')}
                    width={1600}
                    height={1200}
                    className="h-auto w-full"
                    priority={false}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t('faqSubsector')}</h3>
                <p className="mt-1">{t('faqSubsectorText')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t('faqHistogram')}</h3>
                <p className="mt-1">{t('faqHistogramText1')}</p>
                <p className="mt-2">{t('faqHistogramText2')}</p>
              </div>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
