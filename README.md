# Potrero Alto - Next.js + Tailwind

Aplicación web para mostrar información de escalada del sector **Potrero Alto** usando la librería [`thecrag-javascript`](https://github.com/theCrag/thecrag-javascript).

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
- `thecrag-javascript` se instala directamente desde GitHub (`github:theCrag/thecrag-javascript`) porque no está publicado en npm.
- La integración en `src/lib/thecrag.js` incluye compatibilidad defensiva para distintos nombres de métodos de la librería.
