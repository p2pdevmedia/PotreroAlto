function normalizePublicImagePath(value) {
  const normalized = String(value ?? '').trim();
  return normalized.startsWith('/images/') ? normalized : null;
}

export function mapRouteRow(route) {
  return {
    id: route.id,
    name: route.name,
    grade: route.grade,
    stars: route.stars,
    type: route.type,
    description: route.description ?? '',
    image: route.image,
    lengthMeters: route.length_meters,
    quickdraws: route.quickdraws,
    equippedBy: route.equipped_by,
    equippedDate: route.equipped_date,
    firstAscentBy: route.first_ascent_by,
    firstAscentDate: route.first_ascent_date,
    latitude: route.latitude,
    longitude: route.longitude
  };
}

export function mapSubsectorRows(subsectorRows, routeRows) {
  const routeMap = new Map();

  for (const routeRow of routeRows) {
    const bucket = routeMap.get(routeRow.subsector_id) ?? [];
    bucket.push(mapRouteRow(routeRow));
    routeMap.set(routeRow.subsector_id, bucket);
  }

  return subsectorRows.map((subsector) => ({
    id: subsector.id,
    name: subsector.name,
    sector: subsector.sector,
    description: subsector.description ?? '',
    image: normalizePublicImagePath(subsector.image),
    routes: routeMap.get(subsector.id) ?? []
  }));
}
