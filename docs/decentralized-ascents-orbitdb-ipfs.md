# Registro descentralizado de ascensiones (Social + Wallet + OrbitDB/IPFS)

Este documento define una propuesta para permitir que usuarios se autentiquen con **social login o wallet**, y registren:

- Ascensión de una vía.
- Sugerencia de grado.
- Descripción/notas.

Sin base de datos central, usando **OrbitDB sobre IPFS**.

## 1) Objetivo

Construir un flujo donde la app:

1. Identifica al usuario con proveedor social o wallet.
2. Crea eventos firmados de ascensión.
3. Publica eventos en un log distribuido de OrbitDB.
4. Lee eventos y reconstruye historial por ruta y por usuario.

## 2) Arquitectura propuesta

### Componentes

- **Frontend Next.js (cliente):**
  - Login social (Auth.js) o wallet (SIWE / EIP-4361).
  - Firma de eventos.
  - Escritura/lectura en OrbitDB.
- **IPFS node (usuario o gateway):**
  - Almacena bloques y replica.
- **OrbitDB event log:**
  - `ascents` (append-only).
  - `route_suggestions` (append-only para grado+descripción).

> Nota: sin una BD central, la consistencia se logra por replicación eventual y CRDT/event log.

## 3) Modelo de datos (evento canónico)

```json
{
  "kind": "ascent.v1",
  "eventId": "sha256(payload+signature)",
  "createdAt": "2026-03-03T18:10:00.000Z",
  "author": {
    "did": "did:pkh:eip155:1:0x...",
    "displayName": "Juan",
    "authProvider": "wallet|google|github"
  },
  "route": {
    "id": "thecrag-route-id",
    "name": "La fisura",
    "sectorId": "6574670919",
    "subsectorId": "..."
  },
  "ascent": {
    "date": "2026-03-02",
    "style": "onsight|flash|redpoint|toprope|project",
    "attempts": 1,
    "proposedGrade": "7a",
    "description": "placa técnica, crux al final"
  },
  "signature": {
    "algo": "secp256k1",
    "value": "0x...",
    "signedPayloadHash": "0x..."
  }
}
```

## 4) Autenticación híbrida (social + wallet)

### Wallet-first (recomendado)

- Login con wallet para obtener identidad verificable por firma.
- Usar SIWE para sesión en frontend.
- DID sugerido: `did:pkh`.

### Social login

- Login con Auth.js (Google/GitHub/etc).
- Para no depender de servidor central al firmar eventos:
  - Generar un par de claves local (WebCrypto) en primer login social.
  - Guardarlo cifrado localmente (IndexedDB + passphrase opcional).
- Asociar social account -> DID local para autoría de eventos.

## 5) Escritura y lectura en OrbitDB

### Escritura

1. Construir payload canónico (sin firma).
2. Firmar hash del payload.
3. Calcular `eventId`.
4. `db.add(event)` en `ascents`.

### Lectura

- Cargar últimas N entradas.
- Validar firma de cada evento.
- Dedupe por `eventId`.
- Agregar vistas:
  - Historial por usuario.
  - Últimas ascensiones por vía.
  - Propuestas de grado (promedio, moda o ranking por reputación futura).

## 6) Reglas de negocio mínimas

- Un usuario puede registrar múltiples ascensiones por vía.
- `proposedGrade` y `description` son opcionales, pero al menos uno recomendado.
- Eventos inválidos por firma o schema se descartan en cliente.
- No borrar eventos: usar inmutabilidad + filtros de moderación local.

## 7) Moderación sin centralización

- Lista local de bloqueo por DID.
- Filtro por antigüedad/reputación del autor.
- Mostrar advertencia de “dato comunitario no verificado”.

## 8) Seguridad

- Nunca persistir secretos en texto plano.
- Cifrar claves locales para usuarios social-login.
- Versionar schema: `kind = ascent.v1`.
- Validar tamaño de texto para evitar spam y payloads gigantes.

## 9) Fase de implementación sugerida

1. Definir schema + validación (Zod).
2. Integrar wallet login y firma.
3. Integrar OrbitDB/IPFS con un log de `ascents`.
4. UI para marcar ascensión en cada ruta.
5. Vista “propuestas de grado” por ruta.
6. Soporte social login con clave local.

## 10) Trade-offs

- **Pros:** soberanía de datos, resistencia a censura, no dependencia de BD central.
- **Contras:** mayor complejidad UX, sincronización eventual, moderación distribuida.
