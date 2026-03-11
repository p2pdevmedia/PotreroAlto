import { query } from '@/lib/supabase';
import { mapSubsectorRows } from '@/lib/supabase-models';

const POTRERO_ALTO_SECTOR_ID = '6574670919';

export async function getPotreroAltoData() {
  const sectorResult = await query(
    `SELECT id, name, location, description
     FROM sectors
     WHERE id = $1
     LIMIT 1`,
    [POTRERO_ALTO_SECTOR_ID]
  );

  if (!sectorResult.rows.length) {
    throw new Error('No existe el sector Potrero Alto en Supabase. Ejecutá la migración SQL inicial.');
  }

  const subsectorsResult = await query(
    `SELECT id, sector_id, name, sector, description, image, sort_order
     FROM subsectors
     WHERE sector_id = $1
     ORDER BY sort_order ASC, name ASC`,
    [POTRERO_ALTO_SECTOR_ID]
  );

  const routesResult = await query(
    `SELECT id, subsector_id, name, grade, stars, type, description, image,
            length_meters, quickdraws, equipped_by, equipped_date,
            first_ascent_by, first_ascent_date, latitude, longitude, sort_order
     FROM routes
     WHERE sector_id = $1
     ORDER BY sort_order ASC, name ASC`,
    [POTRERO_ALTO_SECTOR_ID]
  );

  const sector = sectorResult.rows[0];

  return {
    id: sector.id,
    name: sector.name,
    location: sector.location,
    description: sector.description ?? '',
    subsectors: mapSubsectorRows(subsectorsResult.rows, routesResult.rows),
    isFallback: false
  };
}
