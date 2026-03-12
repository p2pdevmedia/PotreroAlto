import { NextResponse } from 'next/server';
import { upsertRows } from '@/lib/supabase';
import { verifyPrivyAccessTokenFromRequest } from '@/lib/privy-auth';

function normalizeString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeProvider(accountType) {
  const provider = normalizeString(accountType)?.toLowerCase();
  return provider || 'unknown';
}

function buildIdentityRecord(userId, account, index) {
  const provider = normalizeProvider(account?.type);
  const walletAddress = normalizeString(account?.address);
  const providerUserId =
    normalizeString(account?.id) ||
    normalizeString(account?.subject) ||
    normalizeString(account?.username) ||
    normalizeString(account?.email) ||
    walletAddress ||
    `identity-${index + 1}`;

  return {
    user_id: userId,
    provider,
    provider_user_id: providerUserId,
    wallet_address: walletAddress,
    chain_type: normalizeString(account?.chainType),
    is_primary: index === 0,
    profile: account ?? {}
  };
}

function inferLoginMethod(linkedAccounts = []) {
  const wallet = linkedAccounts.find((account) => normalizeProvider(account?.type) === 'wallet');
  if (wallet) {
    return 'wallet';
  }

  const firstProvider = normalizeProvider(linkedAccounts?.[0]?.type);
  return firstProvider || 'unknown';
}

export async function POST(request) {
  try {
    const body = await request.json();
    const tokenVerification = await verifyPrivyAccessTokenFromRequest(request);
    const privyUser = body?.user ?? body;

    const userId = normalizeString(privyUser?.id);
    if (!userId) {
      return NextResponse.json({ error: 'Falta user.id de Privy.' }, { status: 400 });
    }

    if (tokenVerification.userId && tokenVerification.userId !== userId) {
      return NextResponse.json(
        { error: 'El user.id recibido no coincide con el subject (sub) del token de Privy.' },
        { status: 401 }
      );
    }

    const linkedAccounts = Array.isArray(privyUser?.linkedAccounts) ? privyUser.linkedAccounts : [];
    const primaryWallet = linkedAccounts.find((account) => normalizeProvider(account?.type) === 'wallet');

    const userRecord = {
      id: userId,
      email: normalizeString(privyUser?.email?.address) || normalizeString(privyUser?.email),
      display_name: normalizeString(privyUser?.name),
      avatar_url: normalizeString(privyUser?.profilePictureUrl),
      login_method: inferLoginMethod(linkedAccounts),
      primary_wallet_address: normalizeString(primaryWallet?.address),
      is_guest: Boolean(privyUser?.isGuest),
      privy_created_at: normalizeString(privyUser?.createdAt),
      metadata: privyUser ?? {},
      last_login_at: new Date().toISOString()
    };

    await upsertRows('app_users', [userRecord], { onConflict: 'id' });

    if (linkedAccounts.length) {
      const identityRows = linkedAccounts.map((account, index) => buildIdentityRecord(userId, account, index));
      await upsertRows('app_user_identities', identityRows, { onConflict: 'provider,provider_user_id' });
    }

    return NextResponse.json({ ok: true, userId, identities: linkedAccounts.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error desconocido';
    const isAuthError =
      message.toLowerCase().includes('token') ||
      message.toLowerCase().includes('jwks') ||
      message.toLowerCase().includes('authorization') ||
      message.toLowerCase().includes('app id') ||
      message.toLowerCase().includes('jwt');

    return NextResponse.json(
      {
        error: `No se pudo sincronizar el usuario de Privy: ${message}`
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
