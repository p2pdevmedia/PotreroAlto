import { POTRERO_ALTO_FALLBACK_DATA } from '@/lib/fallback-subsectors';

const POTRERO_ALTO_SECTOR_ID = '6574670919';
const THECRAG_API_HOST = process.env.THECRAG_API_HOST ?? 'https://www.thecrag.com';
const THECRAG_API_RESOURCE_STEM = process.env.THECRAG_API_RESOURCE_STEM ?? '/api';
const THECRAG_API_BASE_URL = `${THECRAG_API_HOST}${THECRAG_API_RESOURCE_STEM}`;
const THECRAG_OAUTH_ACCESS_TOKEN = process.env.THECRAG_OAUTH_ACCESS_TOKEN;

const ROUTE_IMAGE_OVERRIDES = {
  diamante: 'https://image.thecrag.com/1280x960/filters:rotate(270)/dc/b2/dcb2b678e32cdbf2601b1d71392acd513206152b',
  'el peon': 'https://image.thecrag.com/899x1599/e3/af/e3af4b6502756b857698771db3d5154521edd309',
  'estacionamiento medido': 'https://image.thecrag.com/1280x960/8d/87/8d8736b9168cd854c0339fb5d7f46e2214433c6c',
  musgotopia: 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1',
  'sombra chinesca': 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1',
  'eяяeяяaяa': 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1',
  empotrebro: 'https://image.thecrag.com/1280x960/filters:rotate(270)/c3/6f/c36f6dad63f4a93876e600031a459dca0a8229b1'
};

function normalizeRouteName(name) {
  return name
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? [value] : [];
}

function normalizeRoute(route) {
  const routeName = route.name ?? route.label ?? 'Vía sin nombre';
  const normalizedRouteName = normalizeRouteName(routeName);

  return {
    id: route.id ?? route.node_id ?? route.uuid,
    name: routeName,
    grade: route.grade ?? route.grades?.[0]?.label ?? route.difficulty ?? 'Sin grado',
    stars: route.stars ?? route.rating ?? null,
    type: route.type ?? route.node_type ?? route.climb_type ?? null,
    description: route.description ?? route.summary ?? route.notes ?? '',
    image:
      ROUTE_IMAGE_OVERRIDES[normalizedRouteName] ??
      route.image ??
      route.photo ??
      route.thumbnail ??
      route.images?.[0]?.url ??
      route.media?.[0]?.url ??
      null
  };
}

function normalizeSubsector(subsector, routes = []) {
  return {
    id: subsector.id ?? subsector.node_id ?? subsector.uuid,
    name: subsector.name ?? subsector.label ?? 'Subsector sin nombre',
    description: subsector.description ?? subsector.summary ?? '',
    image:
      subsector.image ??
      subsector.photo ??
      subsector.thumbnail ??
      subsector.images?.[0]?.url ??
      subsector.media?.[0]?.url ??
      null,
    routes: routes.map(normalizeRoute)
  };
}

async function fetchTheCrag(path) {
  const headers = {
    Accept: 'application/json'
  };

  if (THECRAG_OAUTH_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${THECRAG_OAUTH_ACCESS_TOKEN}`;
  }

  const response = await fetch(`${THECRAG_API_BASE_URL}${path}`, {
    headers,
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
  let sectorPayload;
  let subsectorsPayload;

  try {
    [sectorPayload, subsectorsPayload] = await Promise.all([
      fetchTheCrag(`/node/id/${POTRERO_ALTO_SECTOR_ID}`),
      fetchTheCrag(`/node/id/${POTRERO_ALTO_SECTOR_ID}/children/area`)
    ]);
  } catch (error) {
    console.error('Error al consultar theCrag API. Se usará el fallback local.', error);
    return {
      ...POTRERO_ALTO_FALLBACK_DATA,
      isFallback: true
    };
  }

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
    subsectors,
    isFallback: false
  };
}
