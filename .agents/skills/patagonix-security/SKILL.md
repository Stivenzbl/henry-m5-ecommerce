---
name: patagonix-security
description: Revisa roles, sesión, Firestore Rules, checkout, precios, inventario y carga S3 para Patagonix Retail.
---

# Patagonix Security Skill

1. Leer el modelo de amenazas y `docs/06_SEGURIDAD.md`.
2. Considerar no confiable todo valor del navegador, incluido rol, UID, precio, stock, total y estado.
3. Revisar creación/edición de perfil y escalamiento de privilegios; los roles se asignan server-side.
4. Si Firestore se activa, usar Emulator Suite y casos positivos/negativos antes de deploy.
5. Si S3 se activa, comprobar autenticación, firma real, MIME/tamaño, key, TTL, CORS y bucket policy.
6. No consultar/escribir datos reales de producción para pruebas.
7. No exponer secretos ni incluirlos en logs.
8. Entregar hallazgos reproducibles y corregir primero P0 solo en entorno autorizado.
