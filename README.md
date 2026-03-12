# Potrero Alto - Next.js + Tailwind + Supabase PostgreSQL

Aplicación web para mostrar información de escalada del sector **Potrero Alto** usando **Supabase PostgreSQL** como fuente única de datos.

## Objetivo

- Guardar toda la información de sector, subsectores y vías en Supabase.
- Eliminar dependencia de theCrag para lectura runtime.
- Mantener edición desde `/admin`, persistiendo en PostgreSQL.

## Ejecutar en local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Crear `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_xxx
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

La app usa la REST API de Supabase (`/rest/v1`) con esas variables para lecturas/escrituras.


## Migración SQL a Supabase

1. Abrí Supabase SQL Editor.
2. Ejecutá `db/schema.sql` para crear tablas e índices.
3. Ejecutá `db/seed.sql` para migrar toda la información existente (generada desde `src/lib/fallback-subsectors.js`).
4. Ejecutá `db/migrations/001_privy_auth_schema.sql` para habilitar login con Privy (wallets + redes sociales).
5. Ejecutá `db/migrations/002_seed_privy_user.sql` para crear un usuario inicial de ejemplo.

También podés regenerar el seed con:

```bash
node scripts/generate-supabase-seed-sql.mjs
```

## Modelo de datos

- `sectors`: sector principal (Potrero Alto).
- `subsectors`: subsectores por sector.
- `routes`: vías por subsector, con metadata técnica (grado, chapas, longitud, equipador, FA, coordenadas, etc).

## Notas

- La lectura principal está en `src/lib/thecrag.js` (ahora conectado a Supabase).
- Cliente REST de Supabase en `src/lib/supabase.js`.
- Mapeo de modelos en `src/lib/supabase-models.js`.
- Edición admin usa `/api/admin/fallback` por compatibilidad de frontend, pero persiste en Supabase.


## Login con Privy (wallet + social)

Se agregó el endpoint `POST /api/auth/privy` para sincronizar usuarios autenticados con Privy en Supabase.

- Tabla principal: `app_users`.
- Tabla de identidades vinculadas (`wallet`, `google`, `twitter`, etc): `app_user_identities`.

Ejemplo de payload:

```json
{
  "user": {
    "id": "did:privy:abc123",
    "name": "Juan Escalador",
    "email": { "address": "juan@example.com" },
    "profilePictureUrl": "https://...",
    "isGuest": false,
    "createdAt": "2026-03-12T10:00:00.000Z",
    "linkedAccounts": [
      { "type": "wallet", "address": "0xabc...", "chainType": "ethereum" },
      { "type": "google", "email": "juan@example.com", "subject": "google-oauth-id" }
    ]
  }
}
```

El endpoint hace upsert automático de usuario e identidades.
