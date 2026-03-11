import { lookup as dnsLookup } from 'node:dns';
import { Pool } from 'pg';

const databasePassword = process.env.database_password;
const databaseHost = process.env.database_host;

function normalizeHost(rawHost) {
  const value = String(rawHost ?? '').trim();

  if (!value) {
    return '';
  }

  return value
    .replace(/^\[+/, '')
    .replace(/\]+$/, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

function getConnectionConfig() {
  if (!databasePassword || !databaseHost) {
    throw new Error('Faltan variables de entorno para Supabase: database_password y/o database_host.');
  }

  const normalizedHost = normalizeHost(databaseHost);
  const parsed = new URL(`postgresql://postgres:${encodeURIComponent(databasePassword)}@${normalizedHost}/postgres`);

  return {
    user: parsed.username,
    password: decodeURIComponent(parsed.password),
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 5432,
    database: parsed.pathname.replace(/^\//, '') || 'postgres',
    ssl: { rejectUnauthorized: false },
    lookup(hostname, options, callback) {
      dnsLookup(hostname, { ...options, family: 4 }, (ipv4Error, ipv4Address, ipv4Family) => {
        if (!ipv4Error) {
          callback(null, ipv4Address, ipv4Family);
          return;
        }

        dnsLookup(hostname, options, callback);
      });
    }
  };
}

const globalForDb = globalThis;

export const supabasePool = globalForDb.__potreroSupabasePool ?? new Pool(getConnectionConfig());

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__potreroSupabasePool = supabasePool;
}

export async function query(text, values) {
  return supabasePool.query(text, values);
}

export async function withTransaction(callback) {
  const client = await supabasePool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
