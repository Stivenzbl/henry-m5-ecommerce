# 🛡️ Arquitectura de Seguridad Técnica — Patagonix Retail

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Estándar:** OWASP Top 10 Web & Cloud Security  
> **Fecha:** 12 de Noviembre de 2026 (Segunda Vuelta de Hardening)  

---

## 1. 📋 Implementado

1. **Defensa en Profundidad y Confianza Cero (Zero-Trust Architecture):**
   - **Frontend SPA:** Guard `<ProtectedRoute>` con aislamiento de roles, interceptando navegación y sanitizando `returnTo` para bloquear Open Redirects. Code splitting con `React.lazy` y `<Suspense>`.
   - **Capa Serverless Backend (Endpoints Autoritativos):**
     - `/api/s3-presign`: Firma AWS Presigned POST con SigV4, cuotas de 5 MB en servidor y verificación RS256 de Custom Claims.
     - `/api/orders`: Endpoint autoritativo de creación de órdenes. Recalcula precios consultando el catálogo oficial, descuenta stock atómicamente con rollback y rechaza parámetros cliente manipulados.
     - `/api/reviews`: Endpoint autoritativo de valoraciones. Verifica criptográficamente compras completadas previas (`status === 'completed'`) antes de otorgar el distintivo `isVerifiedBuyer: true`.
   - **Base de Datos BaaS (Firestore Rules Estrictas):**
     - `/orders/{orderId}`: `allow create: if false;` (bloqueo total a escrituras directas desde el cliente). Modificaciones restringidas a administradores únicamente sobre los campos `status` y `updatedAt`.
     - `/products/{productId}`: `allow write: if isAdmin();` (prohibida la alteración de precios, stock o reseñas por usuarios regulares o atacantes).
     - `/users/{userId}`: Validaciones estrictas de esquema, prohibición de autoelevación de rol `admin` y bloqueo de eliminación.
   - **Proveedor de Identidad:** Firebase Authentication con hashing y salting de contraseñas gestionado por Google.
   - **Almacenamiento Cloud:** Bucket AWS S3 en región `us-east-2` con políticas Presigned POST delimitadas por directivas `content-length-range` y MIME types de imagen.

2. **Verificación Criptográfica Zero-Bypass (`api/lib/verifyAuth.ts`):**
   - Utiliza la librería estándar `jose` con el conjunto público JWKS de Google (`securetoken@system.gserviceaccount.com`).
   - Verifica la firma digital asimétrica **RS256** del ID Token sin excepciones ni bypasses condicionales.
   - Valida la fecha de expiración (`exp`), vigencia (`nbf`), emisor (`iss == https://securetoken.google.com/<projectId>`) y audiencia (`aud == <projectId>`).
   - Extrae el identificador de usuario exclusivamente desde el claim `sub` y los privilegios administrativos desde `admin === true` o `role === 'admin'`.

3. **Erradicación de Secretos y Fallbacks Engañosos en Frontend:**
   - Cero claves maestras de AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) en el bundle de Vite o código cliente.
   - Cero contraseñas hardcodeadas en `LoginView.tsx` o `LoginModal.tsx`.
   - Fail-closed total en subidas de imágenes (`AdminProductModal.tsx`): ante errores de red o credenciales, se aborta y alerta en rojo, sin simular cargas ficticias en `localStorage` o `URL.createObjectURL`.

---

## 2. 🧪 Probado

1. **Suite Criptográfica de Verificación (`src/tests/jwtVerify.test.ts` - 10 tests):**
   - Generación de pares de claves RSA reales de 2048 bits con `jose`.
   - Pruebas de tokens válidos, payloads adulterados, firmas con claves ajenas, expiración, emisor incorrecto, audiencia incorrecta, falta de `sub`, omisión de claim admin y tokens corruptos.

2. **Suite de Integridad de Órdenes (`src/tests/orderApi.test.ts` - 7 tests):**
   - Comprobación de neutralización de manipulación de precios ($0.01 ➔ $379.98).
   - Validación de cantidades positivas enteras.
   - Reserva y descuento atómico de stock.
   - Mecanismo de rollback automático ante fallo en ítems subsecuentes.

3. **Suite de Reseñas y Comprador Verificado (`src/tests/reviewsApi.test.ts` - 5 tests):**
   - Rechazo de flag manipulada `isVerifiedBuyer: true` enviada por el cliente.
   - Verificación de compras completadas en base de datos.

4. **Suite de Almacenamiento AWS S3 (`src/tests/s3Presign.test.ts` - 7 tests):**
   - Restricción de métodos HTTP, tipos MIME permitidos, tamaño máximo y comportamiento fail-closed ante falta de credenciales.

5. **Pruebas de Componentes y Reducers (25 tests adicionales):**
   - Cart reducer, debounce, ProtectedRoute, ProductCard e integración de checkout.
   - **Total de la Suite:** 54 pruebas automatizadas — 100% PASS.

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Rotación Automática de Secretos IAM:** Implementar rotación programada de claves de acceso AWS mediante AWS Secrets Manager o IAM Roles Anywhere.
2. **Rate Limiting Distribuido:** Incorporar Upstash Redis en Vercel Edge Middleware para limitar peticiones por IP en `/api/s3-presign` y `/api/orders`.
3. **MFA (Autenticación Multifactor):** Habilitar SMS o TOTP para cuentas con privilegios administrativos en Firebase Auth.

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Configuración de Bloqueo de Acceso Público en Consola AWS S3:** La directiva *Block Public Access* a nivel de cuenta AWS se configura en la consola web de AWS.
2. **Políticas IAM de Usuario AWS:** Los permisos adjuntos a la identidad IAM (`s3:PutObject`, `s3:AbortMultipartUpload`) dependen de la asignación en AWS IAM Console.
