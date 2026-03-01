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

## Notas

- Esta app usa App Router de Next.js.
- Estilos con Tailwind CSS.
- El acceso a datos usa endpoints canónicos de theCrag API, por ejemplo:
  - `/api/node/id/{nodeID}`
  - `/api/node/id/{nodeID}/children/area`
  - `/api/node/id/{nodeID}/children/route`
- La integración está en `src/lib/thecrag.js`.
