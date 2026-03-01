const POTRERO_ALTO_SECTOR_ID = '6574670919';

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}

function normalizeRoute(route) {
  return {
    id: route.id ?? route.node_id ?? route.uuid,
    name: route.name ?? route.label ?? 'Vía sin nombre',
    grade: route.grade ?? route.difficulty ?? 'Sin grado',
    stars: route.stars ?? route.rating ?? null,
    type: route.type ?? route.climb_type ?? null
  };
}

function normalizeSubsector(subsector) {
  const routes =
    toArray(subsector.routes).map(normalizeRoute) ||
    toArray(subsector.children?.routes).map(normalizeRoute);

  return {
    id: subsector.id ?? subsector.node_id ?? subsector.uuid,
    name: subsector.name ?? subsector.label ?? 'Subsector sin nombre',
    description: subsector.description ?? subsector.summary ?? '',
    routes
  };
}

export async function getPotreroAltoData() {
  const theCrag = await import('thecrag-javascript');

  const client =
    theCrag.createClient?.({ language: 'es' }) ??
    (theCrag.default ? new theCrag.default({ language: 'es' }) : null);

  if (!client) {
    throw new Error('No se pudo inicializar thecrag-javascript.');
  }

  // Soporta distintas versiones de la librería.
  const sectorResponse =
    (await client.getArea?.(POTRERO_ALTO_SECTOR_ID, {
      include: ['children', 'routes']
    })) ??
    (await client.getNode?.(POTRERO_ALTO_SECTOR_ID, {
      include_children: true,
      include_routes: true
    })) ??
    (await client.area?.(POTRERO_ALTO_SECTOR_ID, {
      children: true,
      routes: true
    }));

  if (!sectorResponse) {
    throw new Error('No se obtuvo respuesta desde theCrag para Potrero Alto.');
  }

  const sector = sectorResponse.sector ?? sectorResponse.area ?? sectorResponse;
  const subsectors =
    toArray(sector.children)
      .filter((child) => (child.type ?? child.node_type ?? '').toLowerCase().includes('sector'))
      .map(normalizeSubsector) || [];

  return {
    id: sector.id ?? sector.node_id ?? POTRERO_ALTO_SECTOR_ID,
    name: sector.name ?? 'Potrero Alto',
    location: sector.location ?? sector.region ?? 'San Luis, Argentina',
    description: sector.description ?? sector.summary ?? '',
    subsectors
  };
}
