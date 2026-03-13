import { NextResponse } from 'next/server';
import { mapSubsectorRows } from '@/lib/supabase-models';
import { deleteRows, selectRows, upsertRows } from '@/lib/supabase';
import { normalizeSubsectorImagePath } from '@/lib/subsector-images';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Simonalacacaliza!';
const POTRERO_ALTO_SECTOR_ID = '6574670919';

function unauthorized() {
  return NextResponse.json({ error: 'Password inválido.' }, { status: 401 });
}

function validatePassword(request) {
  const password = request.headers.get('x-admin-password')?.trim();
  return password && password === ADMIN_PASSWORD;
}

function sanitizeSubsector(subsector, subsectorIndex = 0) {
  const routes = Array.isArray(subsector?.routes) ? subsector.routes : [];

  return {
    id: String(subsector?.id || `subsector-${subsectorIndex + 1}`),
    name: String(subsector?.name || 'Subsector sin nombre'),
    sector: String(subsector?.sector || 'Potrero Alto'),
    description: subsector?.description ? String(subsector.description) : '',
    image: (() => {
      const normalizedImage = normalizeSubsectorImagePath(subsector?.image);
      return normalizedImage || null;
    })(),
    sortOrder: Number.isInteger(subsector?.sortOrder) ? subsector.sortOrder : subsectorIndex,
    routes: routes.map((route, routeIndex) => sanitizeRoute(route, { subsectorIndex, routeIndex }))
  };
}

function sanitizeRoute(route, { subsectorIndex = 0, routeIndex = 0 } = {}) {
  return {
    id: String(route?.id || `route-${subsectorIndex + 1}-${routeIndex + 1}`),
    subsectorId: String(route?.subsectorId || ''),
    name: String(route?.name || 'Vía sin nombre'),
    grade: route?.grade ? String(route.grade) : 'Sin grado',
    stars: route?.stars === '' || route?.stars == null ? null : Number(route.stars),
    type: route?.type ? String(route.type) : 'Sport',
    description: route?.description ? String(route.description) : '',
    lengthMeters: route?.lengthMeters === '' || route?.lengthMeters == null ? null : Number(route.lengthMeters),
    quickdraws: route?.quickdraws === '' || route?.quickdraws == null ? null : Number(route.quickdraws),
    image: route?.image ? String(route.image) : null,
    latitude: route?.latitude === '' || route?.latitude == null ? null : Number(route.latitude),
    longitude: route?.longitude === '' || route?.longitude == null ? null : Number(route.longitude),
    equippedBy: route?.equippedBy ? String(route.equippedBy) : null,
    equippedDate: route?.equippedDate ? String(route.equippedDate) : null,
    firstAscentBy: route?.firstAscentBy ? String(route.firstAscentBy) : null,
    firstAscentDate: route?.firstAscentDate ? String(route.firstAscentDate) : null,
    sortOrder: Number.isInteger(route?.sortOrder) ? route.sortOrder : routeIndex
  };
}

function sanitizeSubsectors(subsectors) {
  if (!Array.isArray(subsectors)) {
    throw new Error('Subsectores inválidos.');
  }

  return subsectors.map((subsector, subsectorIndex) => sanitizeSubsector(subsector, subsectorIndex));
}

async function saveSectorInfo(body) {
  await upsertRows(
    'sectors',
    [
      {
        id: POTRERO_ALTO_SECTOR_ID,
        name: body?.name || 'Potrero Alto',
        location: body?.location || 'San Luis, Argentina',
        description: body?.description || ''
      }
    ],
    { onConflict: 'id' }
  );
}

async function saveFullDataset(body) {
  const subsectors = sanitizeSubsectors(body?.subsectors);

  await saveSectorInfo(body);
  await deleteRows('routes', { sector_id: `eq.${POTRERO_ALTO_SECTOR_ID}` });
  await deleteRows('subsectors', { sector_id: `eq.${POTRERO_ALTO_SECTOR_ID}` });

  const subsectorPayload = subsectors.map((subsector) => ({
    id: subsector.id,
    sector_id: POTRERO_ALTO_SECTOR_ID,
    name: subsector.name,
    sector: subsector.sector,
    description: subsector.description,
    image: subsector.image,
    sort_order: subsector.sortOrder
  }));

  if (subsectorPayload.length) {
    await upsertRows('subsectors', subsectorPayload, { onConflict: 'id' });
  }

  const routesPayload = subsectors.flatMap((subsector) =>
    subsector.routes.map((route) => ({
      id: route.id,
      sector_id: POTRERO_ALTO_SECTOR_ID,
      subsector_id: subsector.id,
      name: route.name,
      grade: route.grade,
      stars: route.stars,
      type: route.type,
      description: route.description,
      image: route.image,
      length_meters: route.lengthMeters,
      quickdraws: route.quickdraws,
      equipped_by: route.equippedBy,
      equipped_date: route.equippedDate,
      first_ascent_by: route.firstAscentBy,
      first_ascent_date: route.firstAscentDate,
      latitude: route.latitude,
      longitude: route.longitude,
      sort_order: route.sortOrder
    }))
  );

  if (routesPayload.length) {
    await upsertRows('routes', routesPayload, { onConflict: 'id' });
  }

  return { ok: true, mode: 'full', subsectorCount: subsectors.length };
}

async function saveSingleSubsector(body) {
  const subsector = sanitizeSubsector(body?.subsector);

  await upsertRows(
    'subsectors',
    [
      {
        id: subsector.id,
        sector_id: POTRERO_ALTO_SECTOR_ID,
        name: subsector.name,
        sector: subsector.sector,
        description: subsector.description,
        image: subsector.image,
        sort_order: subsector.sortOrder
      }
    ],
    { onConflict: 'id' }
  );

  await deleteRows('routes', {
    sector_id: `eq.${POTRERO_ALTO_SECTOR_ID}`,
    subsector_id: `eq.${subsector.id}`
  });

  const routesPayload = (subsector.routes ?? []).map((route) => ({
    id: route.id,
    sector_id: POTRERO_ALTO_SECTOR_ID,
    subsector_id: subsector.id,
    name: route.name,
    grade: route.grade,
    stars: route.stars,
    type: route.type,
    description: route.description,
    image: route.image,
    length_meters: route.lengthMeters,
    quickdraws: route.quickdraws,
    equipped_by: route.equippedBy,
    equipped_date: route.equippedDate,
    first_ascent_by: route.firstAscentBy,
    first_ascent_date: route.firstAscentDate,
    latitude: route.latitude,
    longitude: route.longitude,
    sort_order: route.sortOrder
  }));

  if (routesPayload.length) {
    await upsertRows('routes', routesPayload, { onConflict: 'id' });
  }

  return { ok: true, mode: 'subsector', subsectorId: subsector.id, routeCount: routesPayload.length };
}

async function saveSingleRoute(body) {
  const route = sanitizeRoute(body?.route);

  if (!route.subsectorId) {
    throw new Error('La vía no tiene subsector asociado.');
  }

  await upsertRows(
    'routes',
    [
      {
        id: route.id,
        sector_id: POTRERO_ALTO_SECTOR_ID,
        subsector_id: route.subsectorId,
        name: route.name,
        grade: route.grade,
        stars: route.stars,
        type: route.type,
        description: route.description,
        image: route.image,
        length_meters: route.lengthMeters,
        quickdraws: route.quickdraws,
        equipped_by: route.equippedBy,
        equipped_date: route.equippedDate,
        first_ascent_by: route.firstAscentBy,
        first_ascent_date: route.firstAscentDate,
        latitude: route.latitude,
        longitude: route.longitude,
        sort_order: route.sortOrder
      }
    ],
    { onConflict: 'id' }
  );

  return { ok: true, mode: 'route', routeId: route.id, subsectorId: route.subsectorId };
}

export async function GET(request) {
  if (!validatePassword(request)) {
    return unauthorized();
  }

  try {
    const [sectorRows, subsectorsRows, routesRows] = await Promise.all([
      selectRows('sectors', {
        select: 'id,name,location,description',
        id: `eq.${POTRERO_ALTO_SECTOR_ID}`,
        limit: '1'
      }),
      selectRows('subsectors', {
        select: 'id,sector_id,name,sector,description,image,sort_order',
        sector_id: `eq.${POTRERO_ALTO_SECTOR_ID}`,
        order: 'sort_order.asc,name.asc'
      }),
      selectRows('routes', {
        select:
          'id,subsector_id,name,grade,stars,type,description,image,length_meters,quickdraws,equipped_by,equipped_date,first_ascent_by,first_ascent_date,latitude,longitude,sort_order',
        sector_id: `eq.${POTRERO_ALTO_SECTOR_ID}`,
        order: 'sort_order.asc,name.asc'
      })
    ]);

    const sector = sectorRows?.[0] ?? {
      id: POTRERO_ALTO_SECTOR_ID,
      name: 'Potrero Alto',
      location: 'San Luis, Argentina',
      description: ''
    };

    return NextResponse.json({
      id: sector.id,
      name: sector.name,
      location: sector.location,
      description: sector.description,
      subsectors: mapSubsectorRows(subsectorsRows ?? [], routesRows ?? [])
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `No se pudo leer desde Supabase: ${error instanceof Error ? error.message : 'error desconocido'}`
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!validatePassword(request)) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    let result;
    if (body?.mode === 'route') {
      result = await saveSingleRoute(body);
    } else if (body?.mode === 'subsector') {
      result = await saveSingleSubsector(body);
    } else if (body?.mode === 'sector') {
      await saveSectorInfo(body?.sector ?? {});
      result = { ok: true, mode: 'sector' };
    } else {
      result = await saveFullDataset(body);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: `No se pudo guardar en Supabase: ${error instanceof Error ? error.message : 'error desconocido'}`
      },
      { status: 500 }
    );
  }
}
