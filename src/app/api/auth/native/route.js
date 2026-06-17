import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { selectRows, upsertRows } from '@/lib/supabase';

function normalizeString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeEmail(value) {
  return normalizeString(value)?.toLowerCase() || null;
}

function normalizeWallet(address) {
  return normalizeString(address)?.toLowerCase() || null;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
    return false;
  }

  const [salt, hash] = storedHash.split(':');
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

async function findUserByEmail(email) {
  const rows = await selectRows('app_users', {
    select: 'id,email,display_name,login_method,primary_wallet_address,metadata',
    email: `eq.${email}`,
    limit: '1'
  });

  return rows?.[0] ?? null;
}

async function loginWithEmailPassword(body) {
  const email = normalizeEmail(body?.email);
  const password = normalizeString(body?.password);

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y password son obligatorios.' }, { status: 400 });
  }

  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user?.metadata?.password_hash)) {
    return NextResponse.json({ error: 'Credenciales inválidas.' }, { status: 401 });
  }

  await upsertRows('app_users', [{ id: user.id, last_login_at: new Date().toISOString() }], { onConflict: 'id' });

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, walletAddress: user.primary_wallet_address } });
}

async function signupWithEmailPassword(body) {
  const email = normalizeEmail(body?.email);
  const password = normalizeString(body?.password);
  const displayName = normalizeString(body?.displayName);

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y password son obligatorios.' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'El password debe tener al menos 8 caracteres.' }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'Ya existe una cuenta con este email.' }, { status: 409 });
  }

  const userId = `native:${email}`;
  const metadata = {
    password_hash: hashPassword(password),
    auth_provider: 'native-email'
  };

  await upsertRows(
    'app_users',
    [
      {
        id: userId,
        email,
        display_name: displayName,
        login_method: 'email_password',
        is_guest: false,
        metadata,
        last_login_at: new Date().toISOString()
      }
    ],
    { onConflict: 'id' }
  );

  return NextResponse.json({ ok: true, user: { id: userId, email, walletAddress: null } });
}

async function recoverPassword(body) {
  const email = normalizeEmail(body?.email);

  if (!email) {
    return NextResponse.json({ error: 'Email obligatorio.' }, { status: 400 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ ok: true, message: 'Si el email existe, enviamos instrucciones de recuperación.' });
  }

  const recoveryToken = crypto.randomBytes(24).toString('hex');
  await upsertRows(
    'app_users',
    [
      {
        id: user.id,
        metadata: {
          ...(user.metadata ?? {}),
          password_recovery_token: recoveryToken,
          password_recovery_requested_at: new Date().toISOString()
        }
      }
    ],
    { onConflict: 'id' }
  );

  return NextResponse.json({ ok: true, message: 'Si el email existe, enviamos instrucciones de recuperación.' });
}

async function loginWithWallet(body) {
  const walletAddress = normalizeWallet(body?.walletAddress);

  if (!walletAddress) {
    return NextResponse.json({ error: 'No se recibió una wallet válida.' }, { status: 400 });
  }

  const userId = `wallet:${walletAddress}`;

  await upsertRows(
    'app_users',
    [
      {
        id: userId,
        login_method: 'wallet',
        primary_wallet_address: walletAddress,
        is_guest: false,
        metadata: { auth_provider: 'native-wallet' },
        last_login_at: new Date().toISOString()
      }
    ],
    { onConflict: 'id' }
  );

  return NextResponse.json({ ok: true, user: { id: userId, email: null, walletAddress } });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = normalizeString(body?.action)?.toLowerCase();

    if (!action) {
      return NextResponse.json({ error: 'Falta action.' }, { status: 400 });
    }

    if (action === 'login') return loginWithEmailPassword(body);
    if (action === 'signup') return signupWithEmailPassword(body);
    if (action === 'recover') return recoverPassword(body);
    if (action === 'wallet') return loginWithWallet(body);

    return NextResponse.json({ error: 'Acción no soportada.' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error desconocido';
    return NextResponse.json({ error: `No se pudo procesar autenticación nativa: ${message}` }, { status: 500 });
  }
}
