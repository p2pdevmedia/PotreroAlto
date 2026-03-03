const GRADE_BUCKETS = ['<5a', '5a', '5b', '5c', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c', '9a', '>9a'];

const DIFFICULTY_COLOR_STOPS = [
  { stop: 0, color: '34 197 94' }, // verde: muy fácil
  { stop: 0.35, color: '59 130 246' }, // azul: intermedio
  { stop: 0.7, color: '239 68 68' }, // rojo: difícil
  { stop: 1, color: '127 29 29' } // rojo oscuro: muy difícil
];

function interpolateColor(startColor, endColor, ratio) {
  return startColor.map((startChannel, index) => {
    const endChannel = endColor[index];
    return Math.round(startChannel + (endChannel - startChannel) * ratio);
  });
}

function parseRgbColor(color) {
  return color.split(' ').map((channel) => Number.parseInt(channel, 10));
}

function getDifficultyColor(gradeIndex) {
  if (GRADE_BUCKETS.length <= 1) {
    return 'rgb(239 68 68)';
  }

  const normalizedIndex = gradeIndex / (GRADE_BUCKETS.length - 1);
  const upperStopIndex = DIFFICULTY_COLOR_STOPS.findIndex((entry) => normalizedIndex <= entry.stop);

  if (upperStopIndex <= 0) {
    return `rgb(${DIFFICULTY_COLOR_STOPS[0].color})`;
  }

  const lowerStop = DIFFICULTY_COLOR_STOPS[upperStopIndex - 1];
  const upperStop = DIFFICULTY_COLOR_STOPS[upperStopIndex];
  const stopDistance = upperStop.stop - lowerStop.stop;
  const ratio = stopDistance > 0 ? (normalizedIndex - lowerStop.stop) / stopDistance : 0;

  const interpolatedColor = interpolateColor(parseRgbColor(lowerStop.color), parseRgbColor(upperStop.color), ratio);

  return `rgb(${interpolatedColor.join(' ')})`;
}

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
        {GRADE_BUCKETS.map((grade, gradeIndex) => {
          const count = distribution[grade];
          const heightPercent = (count / maxCount) * 100;
          const difficultyColor = getDifficultyColor(gradeIndex);

          return (
            <div
              key={grade}
              className="group relative flex cursor-default flex-col items-center gap-2 rounded-md px-1 py-1 transition-colors duration-200 hover:bg-slate-900/60"
              aria-label={`${count} vías en grado ${grade}`}
              title={`${grade}: ${count} vías`}
            >
              <div className="flex h-24 w-full max-w-10 items-end rounded bg-slate-900/70 px-1 pb-1">
                <div
                  className="w-full rounded transition-all duration-200 ease-out group-hover:-translate-y-0.5"
                  style={{
                    height: `${Math.max(count ? 8 : 0, heightPercent)}%`,
                    background: `linear-gradient(to top, color-mix(in srgb, ${difficultyColor} 72%, black), ${difficultyColor})`,
                    boxShadow: count ? `0 0 16px color-mix(in srgb, ${difficultyColor} 55%, transparent)` : 'none'
                  }}
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm font-semibold leading-none text-slate-100 transition-colors group-hover:text-white">{count}</p>
              <p className="text-xs font-medium leading-none text-slate-300 transition-colors group-hover:text-white">
                {grade}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
