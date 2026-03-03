'use client';

const ASCENTS_STORAGE_KEY = 'potrero.ascents.v1';
const SOCIAL_IDENTITY_STORAGE_KEY = 'potrero.social.identity.v1';

function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

async function sha256Hex(message) {
  const bytes = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return `0x${Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

function readLocalAscents() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(ASCENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalAscents(events) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ASCENTS_STORAGE_KEY, JSON.stringify(events));
}

export function getAscentsByRoute(routeId) {
  const events = readLocalAscents();
  return events.filter((event) => event?.route?.id === routeId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function connectWallet() {
  if (!window.ethereum?.request) {
    throw new Error('No se encontró wallet EVM. Instala MetaMask o usa un navegador con wallet.');
  }

  const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!address) {
    throw new Error('No se pudo obtener una cuenta de wallet.');
  }

  return {
    did: `did:pkh:eip155:1:${address}`,
    displayName: `${address.slice(0, 6)}...${address.slice(-4)}`,
    authProvider: 'wallet',
    address
  };
}

export async function getOrCreateSocialIdentity({ displayName, provider }) {
  const existing = localStorage.getItem(SOCIAL_IDENTITY_STORAGE_KEY);

  if (existing) {
    const parsed = JSON.parse(existing);
    return { ...parsed, displayName: displayName || parsed.displayName, authProvider: provider || parsed.authProvider };
  }

  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256'
    },
    true,
    ['sign', 'verify']
  );

  const privateJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const thumbprint = await sha256Hex(stableStringify(publicJwk));

  const identity = {
    did: `did:key:${thumbprint.slice(2, 18)}`,
    displayName: displayName || 'Escalador local',
    authProvider: provider || 'social-local',
    privateJwk,
    publicJwk
  };

  localStorage.setItem(SOCIAL_IDENTITY_STORAGE_KEY, JSON.stringify(identity));
  return identity;
}

async function signPayload(payload, identity) {
  const payloadHash = await sha256Hex(stableStringify(payload));

  if (identity.authProvider === 'wallet') {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [payloadHash, identity.address]
    });

    return {
      algo: 'secp256k1',
      value: signature,
      signedPayloadHash: payloadHash
    };
  }

  const privateKey = await crypto.subtle.importKey(
    'jwk',
    identity.privateJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256'
    },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256'
    },
    privateKey,
    new TextEncoder().encode(payloadHash)
  );

  return {
    algo: 'p256',
    value: btoa(String.fromCharCode(...new Uint8Array(signatureBuffer))),
    signedPayloadHash: payloadHash
  };
}

export async function createAndStoreAscentEvent({ identity, route, ascent }) {
  const payload = {
    kind: 'ascent.v1',
    createdAt: new Date().toISOString(),
    author: {
      did: identity.did,
      displayName: identity.displayName,
      authProvider: identity.authProvider
    },
    route: {
      id: route.id,
      name: route.name
    },
    ascent
  };

  const signature = await signPayload(payload, identity);
  const event = {
    ...payload,
    signature,
    eventId: await sha256Hex(stableStringify({ payload, signature }))
  };

  const currentEvents = readLocalAscents();
  writeLocalAscents([event, ...currentEvents]);

  return event;
}

export async function publishJsonToIpfs(event) {
  if (!window.ipfs?.add) {
    return null;
  }

  const result = await window.ipfs.add(JSON.stringify(event));
  return result?.cid?.toString?.() ?? null;
}
