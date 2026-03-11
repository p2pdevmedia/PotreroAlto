import { Pool } from 'pg';

const databasePassword = process.env.database_password;
const databaseHost = process.env.database_host;

function getConnectionString() {
  if (!databasePassword || !databaseHost) {
    throw new Error('Faltan variables de entorno para Supabase: database_password y/o database_host.');
  }

  return `postgresql://postgres:${encodeURIComponent(databasePassword)}@${databaseHost}/postgres`;
}

const globalForDb = globalThis;

export const supabasePool =
  globalForDb.__potreroSupabasePool ??
  new Pool({
    connectionString: getConnectionString(),
    ssl: { rejectUnauthorized: false }
  });

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
