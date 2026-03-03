const GRADE_BUCKETS = ['<5a', '5a', '5b', '5c', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c', '9a', '>9a'];

function normalizeGrade(grade) {
  if (!grade) {
    return null;
  }

  const cleanedGrade = String(grade).trim().toLowerCase();

  if (!cleanedGrade || cleanedGrade.includes('sin grado') || cleanedGrade.includes('proyecto')) {
    return null;
  }

  const primaryGrade = cleanedGrade.split('/')[0]?.trim();
  const match = primaryGrade?.match(/(\d)([abc]?)(\+)?/);

  if (!match) {
    return null;
  }

  const numericGrade = Number.parseInt(match[1], 10);
  const letter = match[2] || (match[3] ? 'c' : 'a');

  if (numericGrade < 5) {
    return '<5a';
  }

  if (numericGrade > 9) {
    return '>9a';
  }

  return `${numericGrade}${letter}`;
}

function buildDistribution(routes = []) {
  const counts = Object.fromEntries(GRADE_BUCKETS.map((grade) => [grade, 0]));

  for (const route of routes) {
    const grade = normalizeGrade(route.grade);

    if (grade && grade in counts) {
      counts[grade] += 1;
    }
  }

  return counts;
}

export default function GradeDistributionChart({ routes = [], title, className = '' }) {
  const distribution = buildDistribution(routes);
  const maxCount = Math.max(...Object.values(distribution), 1);
  const totalRoutesWithGrade = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return (
    <section className={`rounded-xl border border-slate-700/70 bg-slate-950/60 p-4 ${className}`}>
      <header className="mb-4 flex items-end justify-between gap-4">
        <div>
          {title ? <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">{title}</h3> : null}
          <p className="text-xs text-slate-400">Distribución de vías por grado</p>
        </div>
        <p className="text-xs text-slate-300">{totalRoutesWithGrade} con grado</p>
      </header>

      <div className="grid grid-cols-5 gap-x-2 gap-y-5 sm:grid-cols-8 lg:grid-cols-[repeat(15,minmax(0,1fr))]">
        {GRADE_BUCKETS.map((grade) => {
          const count = distribution[grade];
          const heightPercent = (count / maxCount) * 100;

          return (
            <div
              key={grade}
              className="group relative flex cursor-default flex-col items-center gap-2 rounded-md px-1 py-1 transition-colors duration-200 hover:bg-slate-900/60"
              aria-label={`${count} vías en grado ${grade}`}
              title={`${grade}: ${count} vías`}
            >
              <div className="flex h-24 w-full max-w-10 items-end rounded bg-slate-900/70 px-1 pb-1">
                <div
                  className="w-full rounded bg-gradient-to-t from-fuchsia-700 to-fuchsia-400 transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:from-fuchsia-600 group-hover:to-fuchsia-300 group-hover:shadow-[0_0_16px_rgba(217,70,239,0.6)]"
                  style={{ height: `${Math.max(count ? 8 : 0, heightPercent)}%` }}
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm font-semibold leading-none text-slate-100 transition-colors group-hover:text-white">{count}</p>
              <p className="text-xs font-medium leading-none text-slate-300 transition-colors group-hover:text-fuchsia-200">
                {grade}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
