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
database_host=YOUR_SUPABASE_HOST:5432
database_password=YOUR_DB_PASSWORD
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

La conexión se construye así:

```txt
postgresql://postgres:[database_password]@[database_host]/postgres
```

## Migración SQL a Supabase

1. Abrí Supabase SQL Editor.
2. Ejecutá `db/schema.sql` para crear tablas e índices.
3. Ejecutá `db/seed.sql` para migrar toda la información existente (generada desde `src/lib/fallback-subsectors.js`).

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
- Conexión PostgreSQL en `src/lib/supabase.js`.
- Mapeo de modelos en `src/lib/supabase-models.js`.
- Edición admin usa `/api/admin/fallback` por compatibilidad de frontend, pero persiste en Supabase.
