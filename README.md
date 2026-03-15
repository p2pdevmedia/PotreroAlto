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
3. Ejecutá `db/seed.sql` para cargar la base inicial en Supabase.
4. (Opcional) Ejecutá `db/migrations/002_seed_privy_user.sql` si querés datos de ejemplo en `app_users`.

## Modelo de datos

- `sectors`: sector principal (Potrero Alto).
- `subsectors`: subsectores por sector.
- `routes`: vías por subsector, con metadata técnica (grado, chapas, longitud, equipador, FA, coordenadas, etc).
- `app_users`: usuarios de autenticación nativa (email/password o wallet).
- `app_user_identities`: identidades vinculadas (wallet y otras fuentes).

## Notas

- La lectura principal está en `src/lib/potrero-alto-data.js` (conectado a Supabase).
- Cliente REST de Supabase en `src/lib/supabase.js`.
- Mapeo de modelos en `src/lib/supabase-models.js`.
- Edición admin usa `/api/admin/database` y persiste en Supabase.

## Login nativo (email/password + wallet)

Se agregó el endpoint `POST /api/auth/native` con acciones:

- `login`: email + password.
- `signup`: registro con email + password.
- `recover`: solicitud de recuperación por email.
- `wallet`: login con wallet inyectada.

La UI mantiene el look & feel de Privy, pero proveedores sociales/passkey quedan deshabilitados (en gris) mientras se usa autenticación nativa.

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
