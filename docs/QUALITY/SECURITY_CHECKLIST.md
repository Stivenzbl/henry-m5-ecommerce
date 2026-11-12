# 🛡️ Checklist de Seguridad Técnica — Patagonix Retail (Enterprise Hardening)

> **Proyecto:** Patagonix Retail — AI-Driven E-Commerce SPA  
> **Rama:** `hardening/enterprise-security-core`  
> **Fecha:** 11 de Noviembre de 2026  
> **Auditoría:** Estándar OWASP Top 10 Web & Cloud Security — Hardening Definitivo

---

## 1. Autenticación y Gestión de Identidad (Auth)

- [x] **Sin Sesión Fantasma:** Se eliminó la creación automática de `user-default-101` y cualquier sesión fabricada en el navegador.
- [x] **Proveedor Criptográfico:** Autenticación delegada a Firebase Authentication con hash de contraseñas server-side.
- [x] **Formulario Seguro Sin Exposición de Credenciales (P0.2):** Se erradicaron contraseñas en duro tanto en `LoginView.tsx` como en `LoginModal.tsx`. Los accesos rápidos demo únicamente autocompletan el email para comodidad del evaluador; la clave jamás viaja en el bundle público.
- [x] **Flujo Fail-Closed:** Si el proveedor no está configurado, la aplicación rechaza intentos de login con advertencia explícita en lugar de simular éxito.
- [x] **Toggle de Contraseña Accesible:** Implementado control show/hide con atributos ARIA y botones semánticos.

---

## 2. Control de Acceso Basado en Roles (RBAC) & Verificación Criptográfica

- [x] **Verificación Criptográfica de Tokens JWT (P0.1):**
  - Creado `api/lib/verifyAuth.ts` utilizando la librería estándar `jose`.
  - Descarga del conjunto de claves públicas JWKS de Google (`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`).
  - Validación de firma digital asimétrica RS256, expiración, emisor (`https://securetoken.google.com/<projectId>`) y audiencia (`projectId`).
  - Imposibilidad matemática de falsificar tokens mediante firmas locales o manipulaciones en Base64.
- [x] **Autoridad de Roles Server-Side:** El rol `admin` se valida exclusivamente mediante Custom Claims en el token (`token.claims.admin === true`).
- [x] **Rutas Protegidas:** Implementado componente `<ProtectedRoute>` con aislamiento por roles:
  - Visitante anónimo ➔ Redirección limpia a `/login?returnTo=...`.
  - Cliente regular intentando entrar a `/admin` ➔ Bloqueo estricto con pantalla `403 ForbiddenView`.
  - Administrador verificado ➔ Acceso concedido.
- [x] **Sanitización de Redirección:** El parámetro `returnTo` solo permite rutas relativas internas que comiencen con `/`, bloqueando Open Redirects.

---

## 3. Integridad Comercial y Reglas Firestore (Commerce Integrity)

- [x] **Recálculo Autoritativo de Precios y Stock (P0.3):**
  - `OrderService.createOrder` no confía en `totalPrice` ni en `product.price` enviados por el cliente.
  - Consulta directa e individual a `ProductService.getById()` para obtener el precio oficial y validar el stock disponible.
  - Si el stock es insuficiente o el producto no existe, la transacción se aborta inmediatamente.
  - Sobrescritura forzosa con el subtotal y total calculado autoritativamente.
- [x] **Condición Estricta de Comprador Verificado (P0.4):**
  - `OrderService.hasUserPurchasedProduct` únicamente otorga la insignia de comprador verificado a órdenes con estado `'completed'`.
  - Órdenes en estado `'pending'`, `'processing'`, `'cancelled'` o guardadas temporalmente en almacenamiento local jamás otorgan estatus verificado.
- [x] **Reglas de Seguridad en Servidor (`firestore.rules`):**
  - `/products`: Lectura pública; creación y eliminación restringida a administradores; actualización restringida a administradores salvo para clientes autenticados que únicamente pueden añadir reseñas (`hasOnly(['reviews', 'rating', 'ratingCount'])`). Se impide que usuarios modifiquen precios o existencias.
  - `/orders`: Creación autorizada únicamente con estado inicial `'pending'`, importes positivos, y lista de campos estrictamente permitidos (`hasOnly`). La transición de estados queda reservada a administradores.
  - `/users`: Restricción estricta de autoelevación de privilegios (`diff().affectedKeys().hasAny(['role', 'admin']) == false`).
- [x] **Fail-Closed en Base de Datos:** Si Firestore falla al persistir una orden en producción, el sistema falla de manera explícita y no crea órdenes fantasmas locales.

---

## 4. Seguridad de Almacenamiento Cloud y Endpoint Serverless (AWS S3)

- [x] **Cero Credenciales en Frontend:** Ni `AWS_ACCESS_KEY_ID` ni `AWS_SECRET_ACCESS_KEY` se exponen en Vite ni en el bundle final.
- [x] **Autenticación Bearer Criptográfica:** `/api/s3-presign` exige cabecera `Authorization: Bearer <token>` y valida la firma RS256 con Google JWKS (`401 Unauthorized`).
- [x] **Autorización de Administrador:** El endpoint valida que el token cuente con el Custom Claim `admin === true` antes de emitir cualquier política de subida (`403 Forbidden`).
- [x] **Límite de Tamaño Forzado en Bucket S3 (P0.5):**
  - Migración a AWS S3 Presigned POST (`createPresignedPost` de `@aws-sdk/s3-presigned-post`).
  - Directiva de política obligatoria: `['content-length-range', 1, 5242880]`.
  - Amazon S3 rechaza en la propia infraestructura de AWS cualquier archivo que exceda 5 MB, independientemente de lo que declare el cliente en el frontend.
  - Validación defensiva temprana en servidor (`413 Payload Too Large`).
- [x] **MIME Type Allowlist:** Rechaza formatos no permitidos (`415 Unsupported Media Type`), aceptando únicamente `image/jpeg`, `image/png` e `image/webp`.
- [x] **Prefijo y Clave Segura:** Las claves en S3 se generan aleatoriamente con timestamp bajo el prefijo `products/`, evitando sobrescritura maliciosa de archivos existentes.
- [x] **Fail-Closed en Almacenamiento:** Si faltan credenciales en el servidor, responde `503 Service Unavailable`, clausurando el servicio sin emitir URLs simuladas.

---

## 5. Garantía de Calidad y Pruebas Automatizadas

- [x] **32 Pruebas Automatizadas (100% Passing):**
  - `cartReducer.test.ts`: 8 pruebas unitarias de reducción de estado del carrito.
  - `s3Presign.test.ts`: 7 pruebas unitarias de compuertas de seguridad del endpoint S3 (405, 401, 403, 415, 413, 400, 503).
  - `integration.test.tsx`: 6 pruebas de integración incluyendo validación de precios autoritativos, rechazo por stock, y ciclo de vida de comprador verificado (pending ➔ false, completed ➔ true, cancelled ➔ false).
  - `ProductCard.test.tsx`: 5 pruebas de renderizado y eventos de productos.
  - `ProtectedRoute.test.tsx`: 3 pruebas de guardias de rutas y protección RBAC.
  - `useDebounce.test.ts`: 3 pruebas de debounce para búsqueda en catálogo.
- [x] **Compilación y Tipado:** `npm run typecheck` y `npm run build` ejecutan con 0 errores y 0 advertencias de tipos.
