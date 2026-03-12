const PRIVY_AUTH_ORIGIN = 'https://auth.privy.io';

const jwksCache = new Map();
const JWKS_CACHE_TTL_MS = 10 * 60 * 1000;

function getPrivyAppId() {
  return process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID || null;
}

function getBearerToken(request) {
  const authHeader = request.headers.get('authorization') || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme?.toLowerCase() === 'bearer' && token) {
    return token;
  }

  return request.headers.get('x-privy-token') || null;
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(normalized + '='.repeat(padding), 'base64');
}

function parseJwt(token) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error('Token JWT inválido.');
  }

  const header = JSON.parse(decodeBase64Url(encodedHeader).toString('utf8'));
  const payload = JSON.parse(decodeBase64Url(encodedPayload).toString('utf8'));
  const signature = decodeBase64Url(encodedSignature);

  return {
    header,
    payload,
    signature,
    signingInput: `${encodedHeader}.${encodedPayload}`
  };
}

async function fetchJwks(jwksUrl) {
  const cached = jwksCache.get(jwksUrl);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.body;
  }

  const response = await fetch(jwksUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`No se pudo descargar JWKS de Privy (status ${response.status}).`);
  }

  const body = await response.json();
  jwksCache.set(jwksUrl, {
    body,
    expiresAt: now + JWKS_CACHE_TTL_MS
  });

  return body;
}

function mapJwtAlgToSubtle(alg) {
  if (alg === 'RS256') {
    return {
      importAlgorithm: { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      verifyAlgorithm: { name: 'RSASSA-PKCS1-v1_5' }
    };
  }

  if (alg === 'ES256') {
    return {
      importAlgorithm: { name: 'ECDSA', namedCurve: 'P-256' },
      verifyAlgorithm: { name: 'ECDSA', hash: 'SHA-256' }
    };
  }

  throw new Error(`Algoritmo JWT no soportado: ${alg}`);
}

async function verifyJwtSignature(token, jwks) {
  const parsed = parseJwt(token);
  const { header, signature, signingInput } = parsed;

  if (!header?.kid) {
    throw new Error('El token no incluye kid en el header.');
  }

  const key = (jwks?.keys || []).find((candidate) => candidate.kid === header.kid);
  if (!key) {
    throw new Error('No se encontró una clave JWKS compatible con el token.');
  }

  const { importAlgorithm, verifyAlgorithm } = mapJwtAlgToSubtle(header.alg);
  const cryptoKey = await crypto.subtle.importKey('jwk', key, importAlgorithm, false, ['verify']);

  const verified = await crypto.subtle.verify(
    verifyAlgorithm,
    cryptoKey,
    signature,
    new TextEncoder().encode(signingInput)
  );

  if (!verified) {
    throw new Error('Firma JWT inválida para el token de Privy.');
  }

  return parsed.payload;
}

function audienceMatches(audienceClaim, appId) {
  if (Array.isArray(audienceClaim)) {
    return audienceClaim.includes(appId);
  }

  return audienceClaim === appId;
}

function appIdMatches(payload, appId) {
  return (
    payload?.appId === appId ||
    payload?.applicationId === appId ||
    payload?.client_id === appId ||
    payload?.azp === appId ||
    audienceMatches(payload?.aud, appId)
  );
}

function validateTimestamps(payload) {
  const now = Math.floor(Date.now() / 1000);

  if (typeof payload?.exp === 'number' && payload.exp < now) {
    throw new Error('El token de Privy está expirado (exp).');
  }

  if (typeof payload?.nbf === 'number' && payload.nbf > now) {
    throw new Error('El token de Privy todavía no es válido (nbf).');
  }
}

export async function verifyPrivyAccessTokenFromRequest(request) {
  const appId = getPrivyAppId();
  if (!appId) {
    return {
      token: null,
      payload: null,
      appId: null,
      jwksUrl: null,
      userId: null,
      skipped: true
    };
  }

  const token = getBearerToken(request);
  if (!token) {
    throw new Error('Falta token de Privy en Authorization: Bearer <token> o x-privy-token.');
  }

  const jwksUrl = `${PRIVY_AUTH_ORIGIN}/api/v1/apps/${appId}/jwks.json`;
  const jwks = await fetchJwks(jwksUrl);
  const payload = await verifyJwtSignature(token, jwks);

  validateTimestamps(payload);

  if (!appIdMatches(payload, appId)) {
    throw new Error('El token de Privy no pertenece al app ID configurado.');
  }

  return {
    token,
    payload,
    appId,
    jwksUrl,
    userId: typeof payload?.sub === 'string' ? payload.sub : null,
    skipped: false
  };
}
