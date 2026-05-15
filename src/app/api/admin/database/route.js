import { NextResponse } from 'next/server';
import { readLocalDataset, writeLocalDataset } from '@/lib/local-dataset';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Simonalacacaliza!';
const POTRERO_ALTO_SECTOR_ID = '6574670919';

function unauthorized() {
  return NextResponse.json({ error: 'Password inválido.' }, { status: 401 });
}

function validatePassword(request) {
  const password = request.headers.get('x-admin-password')?.trim();
  return password && password === ADMIN_PASSWORD;
}

function normalizePublicImagePath(value) {
  const normalized = String(value ?? '').trim();
  return normalized.startsWith('/images/') ? normalized : null;
}

function sanitizeSubsector(subsector, subsectorIndex = 0) {
  const routes = Array.isArray(subsector?.routes) ? subsector.routes : [];

  return {
    id: String(subsector?.id || `subsector-${subsectorIndex + 1}`),
    name: String(subsector?.name || 'Subsector sin nombre'),
    sector: String(subsector?.sector || 'Potrero Alto'),
    description: subsector?.description ? String(subsector.description) : '',
    image: normalizePublicImagePath(subsector?.image),
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
    image: normalizePublicImagePath(route?.image),
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
  if (!Array.isArray(subsectors)) throw new Error('Subsectores inválidos.');
  return subsectors.map((subsector, subsectorIndex) => sanitizeSubsector(subsector, subsectorIndex));
}

export async function GET(request) {
  if (!validatePassword(request)) return unauthorized();

  try {
    const dataset = await readLocalDataset();
    const { searchParams } = new URL(request.url);
    const subsectorId = searchParams.get('subsectorId')?.trim();

    if (subsectorId) {
      const subsector = dataset.subsectors.find((item) => item.id === subsectorId);
      return NextResponse.json({ subsectorId, routes: subsector?.routes ?? [] });
    }

    return NextResponse.json({
      id: dataset.id,
      name: dataset.name,
      location: dataset.location,
      description: dataset.description,
      subsectors: (dataset.subsectors ?? []).map(({ routes, ...subsector }) => ({ ...subsector, routes: [] }))
    });
  } catch (error) {
    return NextResponse.json({ error: `No se pudo leer JSON local: ${error instanceof Error ? error.message : 'error desconocido'}` }, { status: 500 });
  }
}

export async function POST(request) {
  if (!validatePassword(request)) return unauthorized();

  try {
    const body = await request.json();
    const dataset = await readLocalDataset();

    if (body?.mode === 'route') {
      const route = sanitizeRoute(body?.route);
      if (!route.subsectorId) throw new Error('La vía no tiene subsector asociado.');
      const subsectors = [...dataset.subsectors];
      const idx = subsectors.findIndex((s) => s.id === route.subsectorId);
      if (idx < 0) throw new Error('Subsector no encontrado.');
      const routes = [...(subsectors[idx].routes ?? [])];
      const routeIdx = routes.findIndex((r) => r.id === route.id);
      if (routeIdx >= 0) routes[routeIdx] = route; else routes.push(route);
      subsectors[idx] = { ...subsectors[idx], routes };
      await writeLocalDataset({ ...dataset, subsectors });
      return NextResponse.json({ ok: true, mode: 'route', routeId: route.id, subsectorId: route.subsectorId });
    }

    if (body?.mode === 'subsector') {
      const subsector = sanitizeSubsector(body?.subsector);
      const subsectors = [...dataset.subsectors];
      const idx = subsectors.findIndex((s) => s.id === subsector.id);
      if (idx >= 0) subsectors[idx] = { ...subsectors[idx], ...subsector, routes: subsectors[idx].routes ?? [] };
      else subsectors.push({ ...subsector, routes: [] });
      await writeLocalDataset({ ...dataset, subsectors });
      return NextResponse.json({ ok: true, mode: 'subsector', subsectorId: subsector.id });
    }

    if (body?.mode === 'delete-route') {
      const routeId = String(body?.routeId ?? '').trim();
      const subsectors = dataset.subsectors.map((s) => ({ ...s, routes: (s.routes ?? []).filter((r) => r.id !== routeId) }));
      await writeLocalDataset({ ...dataset, subsectors });
      return NextResponse.json({ ok: true, mode: 'delete-route', routeId });
    }

    if (body?.mode === 'delete-subsector') {
      const subsectorId = String(body?.subsectorId ?? '').trim();
      const subsectors = dataset.subsectors.filter((s) => s.id !== subsectorId);
      await writeLocalDataset({ ...dataset, subsectors });
      return NextResponse.json({ ok: true, mode: 'delete-subsector', subsectorId });
    }

    if (body?.mode === 'sector') {
      await writeLocalDataset({ ...dataset, id: POTRERO_ALTO_SECTOR_ID, ...(body?.sector ?? {}) });
      return NextResponse.json({ ok: true, mode: 'sector' });
    }

    const subsectors = sanitizeSubsectors(body?.subsectors);
    await writeLocalDataset({
      id: POTRERO_ALTO_SECTOR_ID,
      name: body?.name || 'Potrero Alto',
      location: body?.location || 'San Luis, Argentina',
      description: body?.description || '',
      subsectors
    });

    return NextResponse.json({ ok: true, mode: 'full', subsectorCount: subsectors.length });
  } catch (error) {
    return NextResponse.json({ error: `No se pudo guardar JSON local: ${error instanceof Error ? error.message : 'error desconocido'}` }, { status: 500 });
  }
}
