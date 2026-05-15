export const GRADE_BUCKETS = ['5b', '5c', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c'];

export function slugifySegment(value, defaultValue = 'item') {
  const normalized = String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || defaultValue;
}

export function buildSubsectorPath(subsectorName) {
  return `/sector/${slugifySegment(subsectorName, 'subsector')}`;
}

export function buildRoutePath(subsectorName, routeName) {
  return `${buildSubsectorPath(subsectorName)}/ruta/${slugifySegment(routeName, 'ruta')}`;
}

export function gradeBucketToSlug(gradeBucket) {
  return String(gradeBucket ?? '')
    .trim()
    .toLowerCase()
    .replace(/\//g, '-slash-')
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function gradeBucketFromSlug(gradeSlug) {
  return GRADE_BUCKETS.find((gradeBucket) => gradeBucketToSlug(gradeBucket) === gradeSlug) ?? null;
}

export function normalizeGrade(grade) {
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

export function getRoutesWithSubsectors(subsectors = []) {
  return subsectors.flatMap((subsector) =>
    (subsector.routes ?? []).map((route) => {
      const subsectorName = subsector.name;
      const subsectorSlug = slugifySegment(subsectorName, 'subsector');
      const routeSlug = slugifySegment(route.name, 'ruta');

      return {
        ...route,
        subsectorId: route.subsectorId ?? subsector.id,
        subsectorName,
        subsectorSlug,
        routeSlug,
        path: `/sector/${subsectorSlug}/ruta/${routeSlug}`
      };
    })
  );
}

export function findSubsectorBySlug(data, sectorSlug) {
  return (data?.subsectors ?? []).find(
    (subsector) => slugifySegment(subsector.name, 'subsector') === sectorSlug
  ) ?? null;
}

export function findRouteBySlugs(data, sectorSlug, routeSlug) {
  const subsector = findSubsectorBySlug(data, sectorSlug);

  if (!subsector) {
    return null;
  }

  const route = (subsector.routes ?? []).find(
    (candidateRoute) => slugifySegment(candidateRoute.name, 'ruta') === routeSlug
  );

  if (!route) {
    return null;
  }

  return {
    subsector,
    route: {
      ...route,
      subsectorName: subsector.name,
      subsectorSlug: slugifySegment(subsector.name, 'subsector'),
      routeSlug: slugifySegment(route.name, 'ruta'),
      path: buildRoutePath(subsector.name, route.name)
    }
  };
}

export function getGradeBucketsWithRoutes(data) {
  const routesByGrade = new Map(GRADE_BUCKETS.map((gradeBucket) => [gradeBucket, []]));

  for (const route of getRoutesWithSubsectors(data?.subsectors ?? [])) {
    const gradeBucket = normalizeGrade(route.grade);

    if (routesByGrade.has(gradeBucket)) {
      routesByGrade.get(gradeBucket).push(route);
    }
  }

  return Array.from(routesByGrade.entries())
    .map(([gradeBucket, routes]) => ({ gradeBucket, routes }))
    .filter(({ routes }) => routes.length > 0);
}

export function getRoutesForGradeSlug(data, gradeSlug) {
  const gradeBucket = gradeBucketFromSlug(gradeSlug);

  if (!gradeBucket) {
    return { gradeBucket: null, routes: [] };
  }

  const routes = getRoutesWithSubsectors(data?.subsectors ?? []).filter(
    (route) => normalizeGrade(route.grade) === gradeBucket
  );

  return { gradeBucket, routes };
}

export function getGradeSummary(routes = []) {
  const normalizedGrades = routes
    .map((route) => normalizeGrade(route.grade))
    .filter(Boolean)
    .sort((gradeA, gradeB) => GRADE_BUCKETS.indexOf(gradeA) - GRADE_BUCKETS.indexOf(gradeB));

  if (!normalizedGrades.length) {
    return 'sin grados cargados';
  }

  const firstGrade = normalizedGrades[0];
  const lastGrade = normalizedGrades[normalizedGrades.length - 1];

  if (firstGrade === lastGrade) {
    return `grado ${firstGrade}`;
  }

  return `grados ${firstGrade} a ${lastGrade}`;
}
