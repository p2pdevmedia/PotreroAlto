import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Privy fue removido. Usá /api/auth/native para login/signup/recover y wallet.' },
    { status: 410 }
  );
}
