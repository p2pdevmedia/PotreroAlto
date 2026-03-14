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
PRIVY_APP_ID=cmmnwy43j02im0bjgnc5ndmgh
```

La app usa la REST API de Supabase (`/rest/v1`) con esas variables para lecturas/escrituras.


## Migración SQL a Supabase

1. Abrí Supabase SQL Editor.
2. Ejecutá `db/schema.sql` para crear tablas e índices.
3. Ejecutá `db/seed.sql` para cargar la base inicial en Supabase.
4. Ejecutá `db/migrations/001_privy_auth_schema.sql` para habilitar login con Privy (wallets + redes sociales).
5. Ejecutá `db/migrations/002_seed_privy_user.sql` para crear un usuario inicial de ejemplo.


## Modelo de datos

- `sectors`: sector principal (Potrero Alto).
- `subsectors`: subsectores por sector.
- `routes`: vías por subsector, con metadata técnica (grado, chapas, longitud, equipador, FA, coordenadas, etc).

## Notas

- La lectura principal está en `src/lib/potrero-alto-data.js` (conectado a Supabase).
- Cliente REST de Supabase en `src/lib/supabase.js`.
- Mapeo de modelos en `src/lib/supabase-models.js`.
- Edición admin usa `/api/admin/database` y persiste en Supabase.


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

### Verificación automática de tokens de Privy

El endpoint `POST /api/auth/privy` valida automáticamente el access token firmado por Privy cuando existe `PRIVY_APP_ID` (o `NEXT_PUBLIC_PRIVY_APP_ID`) en variables de entorno.

- Header soportado: `Authorization: Bearer <access_token>` (o `x-privy-token`).
- JWKS usado para validación de firma: `https://auth.privy.io/api/v1/apps/<PRIVY_APP_ID>/jwks.json`.
- Además, se valida que el token pertenezca al app ID configurado y que `sub` coincida con `user.id` del payload enviado al backend.

Si no configurás `PRIVY_APP_ID`, la ruta mantiene compatibilidad y no fuerza validación de token.

## QA manual sugerido para `/admin`

- Después de ingresar el password en `/admin`, esperar entre **3 y 6 segundos** antes de validar la UI o sacar screenshots.
- La autenticación/carga inicial puede demorar unos segundos; validar demasiado rápido genera falsos negativos.

### Nota para QA automatizado (Playwright)

- Esperar un estado autenticado estable antes de hacer assertions (por ejemplo, verificar título + navegación visibles).
- Como alternativa, usar `networkidle` cuando aplique para asegurar que terminó la carga inicial.
- Este margen reduce flakiness en tests que entran a `/admin` inmediatamente después del login.

## Prisma models

Se agregó un esquema inicial en `prisma/schema.prisma` que mapea todas las tablas actuales (`sectors`, `subsectors`, `routes`, `app_users`, `app_user_identities`).

> Nota: para generar el cliente necesitás instalar dependencias de Prisma en tu entorno y definir `DATABASE_URL`.
