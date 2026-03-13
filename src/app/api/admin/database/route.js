import { NextResponse } from 'next/server';
import { mapSubsectorRows } from '@/lib/supabase-models';
import { deleteRows, selectRows, upsertRows } from '@/lib/supabase';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Simonalacacaliza!';
const POTRERO_ALTO_SECTOR_ID = '6574670919';

function unauthorized() {
  return NextResponse.json({ error: 'Password inválido.' }, { status: 401 });
}

function validatePassword(request) {
  const password = request.headers.get('x-admin-password')?.trim();
  return password && password === ADMIN_PASSWORD;
}

function sanitizeSubsectors(subsectors) {
  if (!Array.isArray(subsectors)) {
    throw new Error('Subsectores inválidos.');
  }

  return subsectors.map((subsector, subsectorIndex) => {
    const routes = Array.isArray(subsector.routes) ? subsector.routes : [];

    return {
      id: String(subsector.id || `subsector-${subsectorIndex + 1}`),
      name: String(subsector.name || 'Subsector sin nombre'),
      sector: String(subsector.sector || 'Potrero Alto'),
      description: subsector.description ? String(subsector.description) : '',
      image: subsector.image ? String(subsector.image) : null,
      sortOrder: subsectorIndex,
      routes: routes.map((route, routeIndex) => ({
        id: String(route.id || `route-${subsectorIndex + 1}-${routeIndex + 1}`),
        name: String(route.name || 'Vía sin nombre'),
        grade: route.grade ? String(route.grade) : 'Sin grado',
        stars: route.stars === '' || route.stars == null ? null : Number(route.stars),
        type: route.type ? String(route.type) : 'Sport',
        description: route.description ? String(route.description) : '',
        lengthMeters: route.lengthMeters === '' || route.lengthMeters == null ? null : Number(route.lengthMeters),
        quickdraws: route.quickdraws === '' || route.quickdraws == null ? null : Number(route.quickdraws),
        image: route.image ? String(route.image) : null,
        latitude: route.latitude === '' || route.latitude == null ? null : Number(route.latitude),
        longitude: route.longitude === '' || route.longitude == null ? null : Number(route.longitude),
        equippedBy: route.equippedBy ? String(route.equippedBy) : null,
        equippedDate: route.equippedDate ? String(route.equippedDate) : null,
        firstAscentBy: route.firstAscentBy ? String(route.firstAscentBy) : null,
        firstAscentDate: route.firstAscentDate ? String(route.firstAscentDate) : null,
        sortOrder: routeIndex
      }))
    };
  });
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
    const subsectors = sanitizeSubsectors(body?.subsectors);

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

    return NextResponse.json({ ok: true, subsectorCount: subsectors.length });
  } catch (error) {
    return NextResponse.json(
      {
        error: `No se pudo guardar en Supabase: ${error instanceof Error ? error.message : 'error desconocido'}`
      },
      { status: 500 }
    );
  }
}
