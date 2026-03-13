const PUBLIC_IMAGE_PREFIX = '/images/';

export const SUBSECTOR_IMAGE_OPTIONS = [
  '/images/arco.jpeg',
  '/images/caniadon.jpeg',
  '/images/chancheria.jpeg',
  '/images/cheto.jpeg',
  '/images/croto.jpeg',
  '/images/derrumbe.jpeg',
  '/images/tablero.jpeg'
];

export const DEFAULT_SUBSECTOR_IMAGE = '/images/tablero.jpeg';

export function normalizeSubsectorImagePath(value) {
  const normalized = String(value ?? '').trim();

  if (!normalized) {
    return '';
  }

  if (normalized.startsWith(PUBLIC_IMAGE_PREFIX)) {
    return normalized;
  }

  return `${PUBLIC_IMAGE_PREFIX}${normalized.replace(/^\/+/, '')}`;
}

