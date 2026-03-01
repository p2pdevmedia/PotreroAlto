const POTRERO_ALTO_SECTOR_ID = '6574670919';
const THECRAG_API_BASE_URL = 'https://www.thecrag.com/api';

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
    grade: route.grade ?? route.grades?.[0]?.label ?? route.difficulty ?? 'Sin grado',
    stars: route.stars ?? route.rating ?? null,
    type: route.type ?? route.node_type ?? route.climb_type ?? null
  };
}

function normalizeSubsector(subsector, routes = []) {
  return {
    id: subsector.id ?? subsector.node_id ?? subsector.uuid,
    name: subsector.name ?? subsector.label ?? 'Subsector sin nombre',
    description: subsector.description ?? subsector.summary ?? '',
    routes: routes.map(normalizeRoute)
  };
}

async function fetchTheCrag(path) {
  const response = await fetch(`${THECRAG_API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json'
    },
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`theCrag API respondió con estado ${response.status} en ${path}.`);
  }

  return response.json();
}

function readList(payload) {
  return toArray(payload?.list ?? payload?.items ?? payload?.children ?? payload?.data ?? payload);
}

async function fetchSubsectorRoutes(subsectorId) {
  const routesPayload = await fetchTheCrag(`/node/id/${subsectorId}/children/route`);
  return readList(routesPayload);
}

export async function getPotreroAltoData() {
  const [sectorPayload, subsectorsPayload] = await Promise.all([
    fetchTheCrag(`/node/id/${POTRERO_ALTO_SECTOR_ID}`),
    fetchTheCrag(`/node/id/${POTRERO_ALTO_SECTOR_ID}/children/area`)
  ]);

  const sector = sectorPayload?.node ?? sectorPayload?.area ?? sectorPayload;
  const subsectorsRaw = readList(subsectorsPayload);

  const subsectors = await Promise.all(
    subsectorsRaw.map(async (subsector) => {
      const subsectorId = subsector.id ?? subsector.node_id;

      if (!subsectorId) {
        return normalizeSubsector(subsector, []);
      }

      try {
        const routes = await fetchSubsectorRoutes(subsectorId);
        return normalizeSubsector(subsector, routes);
      } catch {
        return normalizeSubsector(subsector, []);
      }
    })
  );

  return {
    id: sector.id ?? sector.node_id ?? POTRERO_ALTO_SECTOR_ID,
    name: sector.name ?? 'Potrero Alto',
    location: sector.location ?? sector.region ?? 'San Luis, Argentina',
    description: sector.description ?? sector.summary ?? '',
    subsectors
  };
}
