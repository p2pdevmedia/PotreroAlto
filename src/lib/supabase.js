const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

function getSupabaseConfig() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Faltan variables de entorno de Supabase: NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.'
    );
  }

  return {
    restBaseUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1`,
    apiKey: supabasePublishableKey
  };
}

function buildQueryString(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    params.set(key, value);
  });

  return params.toString();
}

async function supabaseRequest(path, { method = 'GET', filters, body, prefer } = {}) {
  const { restBaseUrl, apiKey } = getSupabaseConfig();
  const queryString = buildQueryString(filters);
  const url = `${restBaseUrl}/${path}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method,
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {})
    },
    body: body == null ? undefined : JSON.stringify(body),
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase REST error (${response.status}) en ${path}: ${errorText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function selectRows(table, filters = {}) {
  return supabaseRequest(table, { method: 'GET', filters });
}

export async function upsertRows(table, rows, { onConflict } = {}) {
  const filters = {};

  if (onConflict) {
    filters.on_conflict = onConflict;
  }

  return supabaseRequest(table, {
    method: 'POST',
    filters,
    body: rows,
    prefer: 'resolution=merge-duplicates,return=representation'
  });
}

export async function deleteRows(table, filters = {}) {
  return supabaseRequest(table, {
    method: 'DELETE',
    filters,
    prefer: 'return=representation'
  });
}
