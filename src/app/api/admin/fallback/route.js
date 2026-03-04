import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'Simonalacacaliza!';
const FALLBACK_FILE_PATH = join(process.cwd(), 'src/lib/fallback-subsectors.js');
const EXPORT_PREFIX = 'export const POTRERO_ALTO_FALLBACK_DATA = ';

function unauthorized() {
  return NextResponse.json({ error: 'Password inválido.' }, { status: 401 });
}

function parseFallbackObject(content) {
  const trimmed = content.trim();

  if (!trimmed.startsWith(EXPORT_PREFIX)) {
    throw new Error('Formato de archivo fallback inválido.');
  }

  const objectLiteral = trimmed.slice(EXPORT_PREFIX.length).replace(/;\s*$/, '');
  return Function(`"use strict"; return (${objectLiteral});`)();
}

function sanitizeSubsectors(subsectors) {
  if (!Array.isArray(subsectors)) {
    throw new Error('Subsectores inválidos.');
  }

  return subsectors.map((subsector, subsectorIndex) => {
    const routes = Array.isArray(subsector.routes) ? subsector.routes : [];

    return {
      id: String(subsector.id || `fallback-subsector-${subsectorIndex + 1}`),
      name: String(subsector.name || 'Subsector sin nombre'),
      description: subsector.description ? String(subsector.description) : '',
      image: subsector.image ? String(subsector.image) : undefined,
      routes: routes.map((route, routeIndex) => ({
        id: String(route.id || `${subsector.id || `subsector-${subsectorIndex + 1}`}-route-${routeIndex + 1}`),
        name: String(route.name || 'Vía sin nombre'),
        grade: route.grade ? String(route.grade) : 'Sin grado',
        stars: route.stars === '' || route.stars == null ? null : Number(route.stars),
        type: route.type ? String(route.type) : 'Sport',
        description: route.description ? String(route.description) : '',
        lengthMeters:
          route.lengthMeters === '' || route.lengthMeters == null ? undefined : Number(route.lengthMeters),
        quickdraws: route.quickdraws === '' || route.quickdraws == null ? undefined : Number(route.quickdraws),
        image: route.image ? String(route.image) : undefined,
        equippedBy: route.equippedBy ? String(route.equippedBy) : undefined,
        equippedDate: route.equippedDate ? String(route.equippedDate) : undefined,
        firstAscentBy: route.firstAscentBy ? String(route.firstAscentBy) : undefined,
        firstAscentDate: route.firstAscentDate ? String(route.firstAscentDate) : undefined
      }))
    };
  });
}

function validatePassword(request) {
  const password = request.headers.get('x-admin-password');
  return password && password === ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!validatePassword(request)) {
    return unauthorized();
  }

  try {
    const content = await readFile(FALLBACK_FILE_PATH, 'utf8');
    const fallbackData = parseFallbackObject(content);

    return NextResponse.json({
      id: fallbackData.id,
      name: fallbackData.name,
      location: fallbackData.location,
      description: fallbackData.description,
      subsectors: Array.isArray(fallbackData.subsectors) ? fallbackData.subsectors : []
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `No se pudo leer el fallback: ${error instanceof Error ? error.message : 'error desconocido'}`
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
    const content = await readFile(FALLBACK_FILE_PATH, 'utf8');
    const currentData = parseFallbackObject(content);
    const subsectors = sanitizeSubsectors(body?.subsectors);

    const updatedData = {
      ...currentData,
      subsectors
    };

    const serialized = `${EXPORT_PREFIX}${JSON.stringify(updatedData, null, 2)};\n`;
    await writeFile(FALLBACK_FILE_PATH, serialized, 'utf8');

    return NextResponse.json({ ok: true, subsectorCount: subsectors.length });
  } catch (error) {
    return NextResponse.json(
      {
        error: `No se pudo guardar el fallback: ${error instanceof Error ? error.message : 'error desconocido'}`
      },
      { status: 500 }
    );
  }
}
