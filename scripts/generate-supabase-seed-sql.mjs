import { writeFile } from 'node:fs/promises';
import { POTRERO_ALTO_FALLBACK_DATA } from '../src/lib/fallback-subsectors.js';

function sqlString(value) {
  if (value == null) {
    return 'NULL';
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlNumber(value) {
  if (value == null || value === '') {
    return 'NULL';
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? String(parsed) : 'NULL';
}

const lines = [];

lines.push('-- Seed generado automáticamente desde src/lib/fallback-subsectors.js');
lines.push('BEGIN;');
lines.push('');
lines.push('DELETE FROM routes WHERE sector_id = \'6574670919\';');
lines.push('DELETE FROM subsectors WHERE sector_id = \'6574670919\';');
lines.push('DELETE FROM sectors WHERE id = \'6574670919\';');
lines.push('');
lines.push(`INSERT INTO sectors (id, name, location, description) VALUES (${sqlString(POTRERO_ALTO_FALLBACK_DATA.id)}, ${sqlString(POTRERO_ALTO_FALLBACK_DATA.name)}, ${sqlString(POTRERO_ALTO_FALLBACK_DATA.location)}, ${sqlString(POTRERO_ALTO_FALLBACK_DATA.description)});`);
lines.push('');

POTRERO_ALTO_FALLBACK_DATA.subsectors.forEach((subsector, subsectorIndex) => {
  lines.push(
    `INSERT INTO subsectors (id, sector_id, name, sector, description, image, sort_order) VALUES (${sqlString(subsector.id)}, '6574670919', ${sqlString(subsector.name)}, ${sqlString(subsector.sector ?? 'Potrero Alto')}, ${sqlString(subsector.description ?? '')}, ${sqlString(subsector.image ?? null)}, ${subsectorIndex});`
  );

  (subsector.routes ?? []).forEach((route, routeIndex) => {
    lines.push(
      `INSERT INTO routes (id, sector_id, subsector_id, name, grade, stars, type, description, image, length_meters, quickdraws, equipped_by, equipped_date, first_ascent_by, first_ascent_date, latitude, longitude, sort_order) VALUES (${sqlString(route.id)}, '6574670919', ${sqlString(subsector.id)}, ${sqlString(route.name ?? 'Vía sin nombre')}, ${sqlString(route.grade ?? 'Sin grado')}, ${sqlNumber(route.stars)}, ${sqlString(route.type ?? 'Sport')}, ${sqlString(route.description ?? '')}, ${sqlString(route.image ?? null)}, ${sqlNumber(route.lengthMeters)}, ${sqlNumber(route.quickdraws)}, ${sqlString(route.equippedBy ?? null)}, ${sqlString(route.equippedDate ?? null)}, ${sqlString(route.firstAscentBy ?? null)}, ${sqlString(route.firstAscentDate ?? null)}, ${sqlNumber(route.latitude)}, ${sqlNumber(route.longitude)}, ${routeIndex});`
    );
  });

  lines.push('');
});

lines.push('COMMIT;');
lines.push('');

await writeFile(new URL('../db/seed.sql', import.meta.url), lines.join('\n'));
console.log('db/seed.sql generado');
