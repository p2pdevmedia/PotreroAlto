import { NextResponse } from 'next/server';
import { DEFAULT_THECRAG_URL, scrapeTheCragArea } from '@/lib/thecrag-scraper';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Simonalacacaliza!';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ error: 'Password inválido.' }, { status: 401 });
}

function validatePassword(request) {
  const password = request.headers.get('x-admin-password')?.trim();
  return password && password === ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!validatePassword(request)) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url') || DEFAULT_THECRAG_URL;

  try {
    const listing = await scrapeTheCragArea(targetUrl);
    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json(
      {
        error: `No se pudo generar el listado desde TheCrag: ${error instanceof Error ? error.message : 'error desconocido'}`
      },
      { status: 500 }
    );
  }
}
