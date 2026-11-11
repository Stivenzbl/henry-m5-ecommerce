# 01 — Auditoría de línea base y brechas verificadas

## 1. Hechos visibles en la rama `main`

La revisión se realizó sobre el repositorio público y los archivos actualmente visibles. Esto no equivale a ejecutar la aplicación localmente ni a validar sus variables privadas de Vercel.

| Área | Evidencia observada | Diagnóstico |
|---|---|---|
| Stack | `package.json` contiene React 18, TypeScript, Vite, Tailwind, Vitest y AWS SDK. No aparece `firebase`, `firebase-admin` ni `react-router-dom`. | La documentación debe coincidir con las dependencias reales. |
| AuthContext | `src/contexts/AuthContext.tsx` crea automáticamente un cliente al primer arranque, hidrata un objeto desde `localStorage` y expone `loginAs(role, ...)` y `switchRole()`. | No hay autenticación real en el flujo visible; el usuario y el rol se pueden fabricar desde el navegador. |
| Login | `LoginModal.tsx` permite acceso rápido como `customer` o `admin`. El formulario valida campos y formato de correo, pero no autentica las credenciales: llama a `loginAs(selectedRole, ...)`. | Correo y contraseña no se verifican; el selector de rol permite autoconcederse `admin`. |
| Primera visita | Debido a la sesión `customer` creada por defecto, el visitante no comienza como usuario anónimo. | La UX oculta el verdadero estado de acceso y debilita la demostración del login. |
| Rutas | `App.tsx` usa `useState` con vistas `catalog`, `orders` y `admin`; no hay `ProtectedRoute`, `BrowserRouter` ni ruta real `/admin` en el archivo inspeccionado. | La afirmación “ruta /admin protegida” no está respaldada por la implementación actual. |
| Productos | `src/services/productService.ts` usa `localStorage` para leer, crear, editar, borrar y reseñar productos; simula latencia. | Los cambios no son una persistencia central compartida ni una integración Firestore. |
| Órdenes | `src/services/orderService.ts` guarda, consulta y actualiza órdenes mediante `localStorage`. | Las órdenes no son un historial remoto ni están aisladas por seguridad del servidor. |
| Firestore | Existe `firestore.rules`, pero los servicios consultados no importan Firebase ni ejecutan queries de Firestore. | Tener reglas en un archivo no significa que la app esté conectada a Firestore. |
| Dependencias/config | `package.json` no incorpora Firebase y `.env.example` no declara variables `VITE_FIREBASE_*`. | No hay evidencia de Firebase configurado en el código público revisado. |
| S3 | `api/s3-presign.ts` acepta `POST` con `fileName` y `fileType`; no se encontró validación `Authorization` en el endpoint. Tiene fallback `mode: 'demo'` que devuelve una URL simulada. | La API no muestra control de identidad/rol antes de firmar y puede responder como demo en vez de fallar cerrada. |
| Reviews | En reglas Firestore, crear una reseña exige autenticación y que `userId` coincida, pero no se ve una verificación de compra completada. | La etiqueta “comprador verificado” debe tener una comprobación real o retirarse. |
| README | Describe Firebase Auth/Firestore, sesión, órdenes y reglas como funcionalidad ya implementada. | Actualizar después de implementar y probar; nunca documentar intención como hecho. |

## 2. Hallazgos P0 — deben cerrarse antes de afirmar cumplimiento total

### P0.1 — Login simulado y elevación de rol

El formulario actual hace `loginAs(selectedRole, displayName, customEmail)` después de validar el texto. La contraseña no se envía a un proveedor de identidad. Un usuario puede seleccionar `admin` sin autorización. El acceso rápido de administrador también asigna el rol desde el frontend.

**Acción obligatoria:** reemplazar este modelo por autenticación real y roles otorgados fuera del navegador. El formulario nunca debe recibir un campo “Rol asignado” para elegir permisos.

### P0.2 — Sesión inventada automáticamente

No debe existir un usuario ficticio conectado por defecto. La aplicación debe iniciar en estado `checking/loading` y terminar en usuario autenticado real o `null`.

**Acción obligatoria:** quitar la creación automática de `user-default-101` y toda identidad ficticia persistida como si fuera una sesión.

### P0.3 — Firebase descrito, pero no conectado

Los servicios `ProductService` y `OrderService` usan `localStorage`. La dependencia Firebase no aparece en el manifiesto observado.

**Acción obligatoria:** dado que el propio proyecto declara Firebase como BaaS, implementar Firebase Auth y Firestore; o, si la consigna original demuestra que no se requiere, corregir todas las afirmaciones del README y declarar honestamente la persistencia local. No conservar la afirmación de Firestore conectado si no es cierto. La opción objetivo de este pack es conectar Firebase.

### P0.4 — S3 presign sin autorización visible

La URL prefirmada es una capacidad de escritura temporal en el bucket. El endpoint debe validar el ID token y la autorización administrativa antes de emitirla.

**Acción obligatoria:** verificar token en servidor, exigir custom claim de administrador, validar archivo y configuración, y retirar el fallback simulado en producción.

### P0.5 — Seguridad de UI confundida con seguridad real

Ocultar un botón o bloquear una vista en React no protege Firestore ni S3. Cada operación sensible debe rechazarse en el servicio/reglas/API aunque el usuario invoque la petición manualmente.

## 3. Hallazgos P1 — calidad de entrega

- Convertir navegación interna en rutas reales si el requisito de Henry habla de rutas protegidas o `/admin`.
- Separar autenticación, autorización, perfil y estado de UI.
- Hacer que el carrito y los datos del usuario no se mezclen al cambiar de cuenta.
- Validar stock y precios desde la fuente de datos, no confiar en subtotales enviados por el navegador.
- Implementar reglas Firestore y pruebas con Emulator Suite.
- Corregir el flujo de reseñas verificadas.
- Añadir estados de carga, error, éxito, vacío, expiración de sesión y denegación de acceso.
- Agregar pruebas E2E para los recorridos de cliente y administrador.
- Corregir los documentos de entrega y retirar declaraciones sin evidencia.

## 4. Límites de esta auditoría

- No se dispone aquí de la consigna oficial completa de Henry; la matriz de aceptación debe basarse en el documento oficial que esté dentro del workspace, si existe, y en los requisitos aportados por el estudiante. No inventar requisitos ni ponderaciones.
- No se han inspeccionado secretos ni settings privados de Firebase, AWS o Vercel.
- La página desplegada no expuso contenido legible al rastreador; eso no demuestra por sí solo que esté caída o funcional.
- No se ejecutaron `npm install`, `npm test`, `npm run build` ni pruebas de navegador en este entorno.

## 5. Evidencias de repositorio a contrastar

- `package.json`
- `src/contexts/AuthContext.tsx`
- `src/components/LoginModal.tsx`
- `src/App.tsx`
- `src/services/productService.ts`
- `src/services/orderService.ts`
- `api/s3-presign.ts`
- `firestore.rules`
- `.env.example`
- `README.md`, `PROYECTO_M5_DOCUMENTO_COMPLETO.md`, `GUIA_DEFENSA_PROYECTO.md`
