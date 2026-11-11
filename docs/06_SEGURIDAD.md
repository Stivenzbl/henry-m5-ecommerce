# 06 — Seguridad y límites de confianza

## Modelo de amenaza mínimo

Proteger cuentas, roles, perfiles, direcciones, pedidos, precios, stock, reseñas, imágenes y credenciales. Considerar que cualquier dato del navegador puede modificarse con DevTools o una petición manual.

## P0: roles y sesión

- `localStorage` no sirve para autenticar ni autorizar.
- En demo, `switchRole` debe quedar tras `VITE_DEMO_MODE=true`, con etiqueta visible y sin acceso a recursos reales.
- En producción, quitar el selector de rol del navbar y usar sesión de proveedor real.
- Roles admin solo los asigna un servidor con privilegios; el usuario no escribe su propio rol.
- Validar ID token y custom claims desde backend.

## P0: Firestore Rules

La versión de `firestore.rules` inspeccionada permite crear el documento propio `/users/{uid}` con `allow create: if isOwner(userId)`, mientras `isAdmin()` acepta el `role` consultado en ese mismo documento. Sin una restricción adicional, el usuario puede crear su propio documento declarando `role: 'admin'`. No desplegar estas reglas sin corregir y demostrar el bloqueo.

Requisitos para reglas nuevas:

- `users/{uid}`: creación con allowlist de campos y rol no privilegiado, o creación exclusiva desde backend; actualización solo de campos de perfil permitidos.
- Rechazar siempre cambios de `role`, `admin`, permisos, ownership e identificadores desde el cliente.
- Administrador comprobado por custom claim confiable (`request.auth.token.admin == true`) o mecanismo server-managed equivalente, con pruebas.
- `orders/{id}`: cliente solo lee órdenes propias; no puede leer otras; no actualiza estado ni importes; cualquier creación debe comprobar identidad y esquema permitido.
- `products/{id}`: lectura pública solo si es catálogo público; cambios solo admin verdadero.
- `reviews`: crear solo autenticado; limitar contenido/tamaño/rating y asociar UID; evitar que el autor se autodeclare “verified”.
- Denegar por defecto rutas/colecciones sin reglas explícitas.

Probar las reglas con Firebase Emulator Suite y casos negativos. No confiar en inspección visual del archivo.

## Checkout / integridad comercial

- El browser puede cambiar cantidad, price, stock, UID y total; no aceptar esos valores como autoridad.
- Backend recalcula con catálogo de confianza y comprueba disponibilidad antes de confirmar.
- Añadir idempotencia para evitar pedidos duplicados por doble clic/reintento.
- No aceptar actualizaciones de estado desde el cliente.

## API de S3

El endpoint actual contiene un stub comentado y una URL con `simulated-presigned-token`. No es una firma válida y no debe habilitarse para cargas reales.

Implementación real requiere:
- POST únicamente con respuesta HTTP correcta y errores HTTP adecuados.
- ID token verificado y claim admin en backend.
- Validación estricta de MIME/tipo, tamaño y nombre.
- Key aleatoria y prefijo fijo (`products/`), no aceptar rutas arbitrarias.
- TTL corto; firma ligada al método, bucket, key y content-type esperado.
- Secrets exclusivamente en entorno server-side; ausencia de variables debe fallar cerrada.
- CORS limitado a orígenes conocidos; bucket sin escritura/listado público.
- Rate limit/logging sin registrar tokens ni URLs firmadas completas.

## Higiene de secretos y supply chain

- Nunca copiar `.env` a prompts, issues, README, logs ni screenshots.
- `.env.example` solo nombres de variables y placeholders vacíos.
- No ejecutar skills o scripts descargados sin leerlos; revisar comandos shell, acceso a archivos, red y exfiltración.
- MCPs con permisos mínimos y preferiblemente lectura primero; pedir consentimiento antes de acciones de escritura o despliegue.
- Fijar versiones o revisar cambios antes de actualizar dependencias críticas.

## Respuesta a incidentes

Si aparece una credencial real en Git o logs: detener despliegue, revocar/rotar la credencial desde el proveedor, limpiar historial según política, auditar uso y documentar incidente. Borrar el texto del repo no basta.
