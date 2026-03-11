import { lookup as dnsLookup } from 'node:dns';
import { Pool } from 'pg';

const globalForDb = globalThis;

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

function parseHostAndPort(rawHost) {
  const normalized = normalizeHost(rawHost);

  if (!normalized) {
    return { host: '', port: 5432 };
  }

  const withScheme = normalized.includes('://') ? normalized : `postgresql://${normalized}`;

  try {
    const parsed = new URL(withScheme);

    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 5432
    };
  } catch {
    return {
      host: normalized,
      port: 5432
    };
  }
}

function getConnectionConfig() {
  const databasePassword = process.env.database_password;
  const databaseHost = process.env.database_host;

  if (!databasePassword || !databaseHost) {
    throw new Error('Faltan variables de entorno para Supabase: database_password y/o database_host.');
  }

  const { host, port } = parseHostAndPort(databaseHost);

  if (!host) {
    throw new Error('database_host es inválido.');
  }

  return {
    user: 'postgres',
    password: databasePassword,
    host,
    port,
    database: 'postgres',
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

function getPool() {
  if (!globalForDb.__potreroSupabasePool) {
    globalForDb.__potreroSupabasePool = new Pool(getConnectionConfig());
  }

  return globalForDb.__potreroSupabasePool;
}

export async function query(text, values) {
  return getPool().query(text, values);
}

export async function withTransaction(callback) {
  const client = await getPool().connect();

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
