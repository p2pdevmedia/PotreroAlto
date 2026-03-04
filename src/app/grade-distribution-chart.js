import { getBucketGradeLabel, t } from '@/lib/i18n';

const GRADE_BUCKETS = ['<5a', '5a', '5b', '5c', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c', '9a', '>9a'];
const MOBILE_HIDDEN_BUCKETS = new Set(['<5a', '9a', '>9a']);

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
  const bucketedRoutes = Object.fromEntries(GRADE_BUCKETS.map((grade) => [grade, []]));

  for (const route of routes) {
    const grade = normalizeGrade(route.grade);

    if (grade && grade in counts) {
      counts[grade] += 1;
      bucketedRoutes[grade].push(route);
    }
  }

  return { counts, bucketedRoutes };
}

export default function GradeDistributionChart({
  routes = [],
  title,
  className = '',
  compact = false,
  barsOnly = false,
  locale = 'es',
  gradeSystem = 'french',
  onGradeSelect
}) {
  const { counts: distribution, bucketedRoutes } = buildDistribution(routes);
  const maxCount = Math.max(...Object.values(distribution), 1);
  const totalRoutesWithGrade = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const chartHeightClass = compact ? 'h-10 sm:h-12' : 'h-20 sm:h-24';
  const mobileColumnCount = GRADE_BUCKETS.length - MOBILE_HIDDEN_BUCKETS.size;
  const chartWrapperClass = compact
    ? `grid h-full grid-cols-[repeat(${mobileColumnCount},minmax(0,1fr))] sm:grid-cols-[repeat(${GRADE_BUCKETS.length},minmax(0,1fr))] ${barsOnly ? 'gap-x-0.5' : 'gap-x-1 pb-0.5'}`
    : `grid grid-cols-[repeat(${mobileColumnCount},minmax(0,1fr))] gap-x-1.5 gap-y-3 pb-1 sm:grid-cols-[repeat(${GRADE_BUCKETS.length},minmax(0,1fr))] sm:gap-x-2 sm:gap-y-4`;
  const containerClass = barsOnly
    ? `h-full w-full ${className}`
    : compact
      ? `rounded-lg border border-slate-700/60 bg-slate-950/65 p-2.5 ${className}`
      : `rounded-xl border border-slate-700/70 bg-slate-950/60 p-4 ${className}`;

  return (
    <section className={containerClass}>
      {!barsOnly ? (
        <header className={`flex items-end justify-between gap-4 ${compact ? 'mb-2' : 'mb-4'}`}>
          <div>
            {title ? (
              <h3 className={`${compact ? 'text-[10px]' : 'text-sm'} font-semibold uppercase tracking-wide text-slate-200`}>
                {title}
              </h3>
            ) : null}
            {!compact ? <p className="text-xs text-slate-400">{t(locale, 'distributionByGrade')}</p> : null}
          </div>
          <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-slate-300`}>
            {totalRoutesWithGrade} {t(locale, 'withGrade')}
          </p>
        </header>
      ) : null}

      <div className={chartWrapperClass}>
        {GRADE_BUCKETS.map((grade, gradeIndex) => {
          const count = distribution[grade];
          const heightPercent = (count / maxCount) * 100;
          const difficultyColor = getDifficultyColor(gradeIndex);
          const isSelectable = typeof onGradeSelect === 'function' && count > 0;
          const hiddenOnMobile = MOBILE_HIDDEN_BUCKETS.has(grade);

          return (
            <div
              key={grade}
              className={`group relative flex min-w-0 flex-col items-center rounded-md px-0.5 py-1 transition-colors duration-200 hover:bg-slate-900/60 ${
                isSelectable ? 'cursor-pointer' : 'cursor-default'
              } ${compact ? 'gap-1' : 'gap-1.5 sm:gap-2'} ${hiddenOnMobile ? 'hidden sm:flex' : ''}`}
              aria-label={`${count} ${t(locale, 'gradeLabel').toLowerCase()} ${getBucketGradeLabel(grade, gradeSystem)}`}
              title={`${getBucketGradeLabel(grade, gradeSystem)}: ${count}`}
              role={isSelectable ? 'button' : undefined}
              tabIndex={isSelectable ? 0 : undefined}
              onClick={
                isSelectable
                  ? () =>
                      onGradeSelect({
                        gradeBucket: grade,
                        gradeLabel: getBucketGradeLabel(grade, gradeSystem),
                        routes: bucketedRoutes[grade]
                      })
                  : undefined
              }
              onKeyDown={
                isSelectable
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onGradeSelect({
                          gradeBucket: grade,
                          gradeLabel: getBucketGradeLabel(grade, gradeSystem),
                          routes: bucketedRoutes[grade]
                        });
                      }
                    }
                  : undefined
              }
            >
              <div className={`flex w-full items-end ${barsOnly ? 'h-full bg-transparent px-0 pb-0' : `rounded bg-slate-900/70 ${chartHeightClass} ${compact ? 'px-0 pb-0.5' : 'px-0.5 pb-1 sm:px-1'}`}`}>
                <div
                  className={`w-full transition-all duration-200 ease-out group-hover:-translate-y-0.5 ${barsOnly ? 'rounded-sm opacity-65 group-hover:opacity-90' : 'rounded'}`}
                  style={{
                    height: `${Math.max(count ? 8 : 0, heightPercent)}%`,
                    background: `linear-gradient(to top, color-mix(in srgb, ${difficultyColor} 72%, black), ${difficultyColor})`,
                    boxShadow: count ? `0 0 16px color-mix(in srgb, ${difficultyColor} 55%, transparent)` : 'none'
                  }}
                  aria-hidden="true"
                />
              </div>
              {!barsOnly ? (
                <>
                  <p
                    className={`${compact ? 'text-[9px] sm:text-[10px]' : 'text-[11px] sm:text-sm'} font-semibold leading-none text-slate-100 transition-colors group-hover:text-white`}
                  >
                    {count}
                  </p>
                  {!compact ? (
                    <p className="text-[10px] font-medium leading-none text-slate-300 transition-colors group-hover:text-white sm:text-xs">
                      {getBucketGradeLabel(grade, gradeSystem)}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
