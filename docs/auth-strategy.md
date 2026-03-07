# Estrategia de autenticación y wallets (Privy)

## Resumen
Sí, **Privy** encaja bien para este proyecto como motor de **sign up / sign in** y para crear una **wallet embebida** por usuario.

## Cómo aplicaría en Potrero Alto
- Mantener el modelo actual de app Next.js (App Router) y reemplazar el flujo de conexión manual de wallet inyectada por un provider de autenticación moderno.
- Permitir login por email (OTP o magic link) y opcionalmente social login.
- Crear wallet embebida para cada usuario autenticado, evitando fricción de instalación de extensiones.

## Modelo recomendado
1. **Identidad principal:** Privy con email.
2. **Wallet por usuario:** wallet embebida creada automáticamente al registrarse.
3. **Compatibilidad avanzada:** dejar opción de conectar wallet externa (MetaMask) para usuarios pro.

## Beneficios
- Onboarding más simple para usuarios no cripto.
- Menos abandono en el alta.
- Unificar login y wallet bajo un mismo flujo.

## Consideraciones
- Definir si la wallet embebida será custodial o con exportación de clave para usuarios avanzados.
- Configurar políticas de recuperación de cuenta por email.
- Revisar implicaciones de cumplimiento/privacidad según país objetivo.
