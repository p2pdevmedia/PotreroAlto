export const DEFAULT_SECTOR_INFO = {
  name: 'Potrero Alto',
  location: 'San Luis, Argentina',
  description: ''
};

export const EMPTY_ROUTE = {
  id: '',
  name: '',
  grade: '',
  stars: '',
  type: 'Sport',
  description: '',
  lengthMeters: '',
  quickdraws: '',
  image: '',
  equippedBy: '',
  equippedDate: '',
  firstAscentBy: '',
  firstAscentDate: '',
  latitude: '',
  longitude: ''
};

export const ROUTE_TYPE_OPTIONS = ['Sport', 'Trad', 'Boulder', 'Proyecto'];
export const STAR_OPTIONS = ['', '0', '1', '2', '3', '4', '5'];

export function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function routeSectorFromSubsectorId(subsectorId) {
  if (!subsectorId) {
    return 'subsector';
  }

  return String(subsectorId).replace(/^(fallback-|subsector-)/, '') || 'subsector';
}

export function splitRouteId(routeId, defaultRouteSector) {
  const normalized = String(routeId ?? '').trim();
  const matched = normalized.match(/^(.*?)-(\d+)$/);

  if (matched) {
    return {
      fallbackSector: matched[1] || defaultRouteSector,
      routeNumber: matched[2]
    };
  }

  return {
    fallbackSector: normalized || defaultRouteSector,
    routeNumber: ''
  };
}

export function buildRouteId(fallbackSector, routeNumber) {
  const normalizedFallbackSector = String(fallbackSector ?? '').trim() || 'subsector';
  const normalizedRouteNumber = String(routeNumber ?? '').replace(/\D/g, '');

  return normalizedRouteNumber ? `${normalizedFallbackSector}-${normalizedRouteNumber}` : normalizedFallbackSector;
}

export function normalizeCoordinate(value) {
  const parsed = Number.parseFloat(String(value ?? '').replace(',', '.').trim());

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

export function buildGoogleMapsUrl(latitude, longitude) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export function encodePathSegment(value) {
  return encodeURIComponent(String(value ?? ''));
}
