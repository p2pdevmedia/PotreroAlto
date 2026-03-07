# Potrero Alto - Next.js + Tailwind

Aplicación web para mostrar información de escalada del sector **Potrero Alto** consumiendo la API pública de [theCrag](https://www.thecrag.com).

## Objetivo

- Cargar el sector con ID `6574670919`.
- Mostrar subsectores.
- Mostrar vías dentro de cada subsector.

## Ejecutar en local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Para APIs protegidas por OAuth, configurar un archivo `.env.local` con:

```bash
THECRAG_API_HOST=https://www.thecrag.com
THECRAG_API_RESOURCE_STEM=/api
THECRAG_OAUTH_ACCESS_TOKEN=tu_access_token
```

- `THECRAG_API_RESOURCE_STEM` es el *OAuth protected API resource stem* (ejemplo: `/api`).

`NEXT_PUBLIC_SITE_URL=https://tu-dominio.com` también es recomendable para SEO: se usa para generar `sitemap.xml` y `robots.txt` con URLs canónicas indexables.
- `NEXT_PUBLIC_PRIVY_APP_ID=tu_privy_app_id` habilita autenticación con Privy (email + wallet embebida).
- Si `THECRAG_OAUTH_ACCESS_TOKEN` no está definido, la app intentará consumir el API sin header `Authorization`.

## Notas

- Esta app usa App Router de Next.js.
- Estilos con Tailwind CSS.
- Los assets estáticos deben ubicarse en la carpeta `public/`.
- El acceso a datos usa endpoints canónicos de theCrag API, por ejemplo:
  - `/api/node/id/{nodeID}`
  - `/api/node/id/{nodeID}/children/area`
  - `/api/node/id/{nodeID}/children/route`
- La integración está en `src/lib/thecrag.js`.

## Autenticación y wallets

La app usa **Privy** para el flujo de autenticación (`signup/signin`) y para provisionar wallet por usuario con soporte de email y wallet externa.
