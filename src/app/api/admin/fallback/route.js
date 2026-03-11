import { NextResponse } from 'next/server';
import { mapSubsectorRows } from '@/lib/supabase-models';
import { query, withTransaction } from '@/lib/supabase';

const ADMIN_PASSWORD = 'Simonalacacaliza!';
const POTRERO_ALTO_SECTOR_ID = '6574670919';

function unauthorized() {
  return NextResponse.json({ error: 'Password inválido.' }, { status: 401 });
}

function validatePassword(request) {
  const password = request.headers.get('x-admin-password');
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
    const [sectorResult, subsectorsResult, routesResult] = await Promise.all([
      query('SELECT id, name, location, description FROM sectors WHERE id = $1 LIMIT 1', [POTRERO_ALTO_SECTOR_ID]),
      query(
        `SELECT id, sector_id, name, sector, description, image, sort_order
         FROM subsectors WHERE sector_id = $1 ORDER BY sort_order ASC, name ASC`,
        [POTRERO_ALTO_SECTOR_ID]
      ),
      query(
        `SELECT id, subsector_id, name, grade, stars, type, description, image,
                length_meters, quickdraws, equipped_by, equipped_date,
                first_ascent_by, first_ascent_date, latitude, longitude, sort_order
         FROM routes WHERE sector_id = $1 ORDER BY sort_order ASC, name ASC`,
        [POTRERO_ALTO_SECTOR_ID]
      )
    ]);

    const sector = sectorResult.rows[0] ?? {
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
      subsectors: mapSubsectorRows(subsectorsResult.rows, routesResult.rows)
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

    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO sectors (id, name, location, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id)
         DO UPDATE SET name = EXCLUDED.name, location = EXCLUDED.location, description = EXCLUDED.description`,
        [POTRERO_ALTO_SECTOR_ID, body?.name || 'Potrero Alto', body?.location || 'San Luis, Argentina', body?.description || '']
      );

      await client.query('DELETE FROM routes WHERE sector_id = $1', [POTRERO_ALTO_SECTOR_ID]);
      await client.query('DELETE FROM subsectors WHERE sector_id = $1', [POTRERO_ALTO_SECTOR_ID]);

      for (const subsector of subsectors) {
        await client.query(
          `INSERT INTO subsectors (id, sector_id, name, sector, description, image, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            subsector.id,
            POTRERO_ALTO_SECTOR_ID,
            subsector.name,
            subsector.sector,
            subsector.description,
            subsector.image,
            subsector.sortOrder
          ]
        );

        for (const route of subsector.routes) {
          await client.query(
            `INSERT INTO routes (
              id, sector_id, subsector_id, name, grade, stars, type, description, image,
              length_meters, quickdraws, equipped_by, equipped_date,
              first_ascent_by, first_ascent_date, latitude, longitude, sort_order
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9,
              $10, $11, $12, $13, $14, $15, $16, $17, $18
            )`,
            [
              route.id,
              POTRERO_ALTO_SECTOR_ID,
              subsector.id,
              route.name,
              route.grade,
              route.stars,
              route.type,
              route.description,
              route.image,
              route.lengthMeters,
              route.quickdraws,
              route.equippedBy,
              route.equippedDate,
              route.firstAscentBy,
              route.firstAscentDate,
              route.latitude,
              route.longitude,
              route.sortOrder
            ]
          );
        }
      }
    });

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
