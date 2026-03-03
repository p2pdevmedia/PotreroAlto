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

## Registro descentralizado de ascensiones

Se agregó una propuesta técnica para soportar login social + wallet y registro de ascensiones/sugerencias de grado usando OrbitDB/IPFS, sin base de datos central.

Ver: `docs/decentralized-ascents-orbitdb-ipfs.md`.


## Registro de ascensiones (MVP)

La app ahora permite registrar ascensiones por vía desde la interfaz:

- Login con **wallet EVM** (si hay `window.ethereum`).
- Login **social local** (genera identidad criptográfica local con WebCrypto).
- Firma del evento `ascent.v1` y guardado en `localStorage`.
- Publicación opcional a IPFS si el navegador expone `window.ipfs` (por ejemplo con IPFS Companion).

Este MVP no incluye aún replicación OrbitDB automática entre nodos, pero deja operativo el flujo de creación y firma de eventos en cliente.

