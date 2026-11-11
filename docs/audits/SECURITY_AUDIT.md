# 🔒 Auditoría de Seguridad — Patagonix Retail

> **Clasificación:** P0 (Crítico) / P1 (Alto) / P2 (Medio)  
> **Alcance:** Autenticación, Autorización (RBAC), Reglas Firestore, Endpoints Serverless y Manejo de Datos  

---

## 1. Hallazgos de Seguridad

### 🔴 SEC-01 [P0] — Escalamiento de Privilegios en `firestore.rules`
- **Archivo:** `firestore.rules` (líneas 40–45)
- **Código Vulnerable:**
  ```javascript
  match /users/{userId} {
    allow read: if isOwner(userId) || isAdmin();
    allow create: if isOwner(userId);
    allow update: if isOwner(userId) && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) || isAdmin();
    allow delete: if isAdmin();
  }
  ```
- **Riesgo:** Aunque en `update` se prohíbe modificar el campo `role`, en `create` **no hay ninguna restricción sobre los campos entrantes**. Cualquier usuario recién registrado podría enviar un documento inicial con `{ role: 'admin' }`. Como la función `isAdmin()` consulta:
  ```javascript
  get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
  ```
  El atacante adquiriría de inmediato permisos administrativos completos sobre productos y órdenes en la base de datos Firestore.
- **Remediación:**
  ```javascript
  allow create: if isOwner(userId) && 
    (!('role' in request.resource.data) || request.resource.data.role == 'customer');
  ```
  En producción real, los roles **nunca** deben consultarse desde el documento de usuario en la base de datos; deben asignarse exclusivamente como **Firebase Custom Claims** desde un entorno privilegiado con Firebase Admin SDK.

---

### 🟡 SEC-02 [P0] — Falsa Autorización en Cliente (`switchRole`)
- **Archivo:** `src/contexts/AuthContext.tsx` y `src/components/Navbar.tsx`
- **Descripción:** El rol se conmuta en el cliente invocando `switchRole()` y se persiste en `localStorage` (`patagonix_user_session_v1`).
- **Riesgo:** Si bien es adecuado para propósitos de demostración, crea una falsa sensación de seguridad si no está rotulado explícitamente. Ningún cliente debe determinar sus propios privilegios.
- **Remediación:**
  - Aislar el selector de rol dentro de un banner o control flotante rotulado explícitamente como **"Modo Demo / Selector de Pruebas"**.
  - Evitar vincular esta función a tokens de producción.

---

### 🟡 SEC-03 [P0] — Endpoint S3 Presigned URL Simulado
- **Archivo:** `api/s3-presign.ts`
- **Descripción:** El endpoint devuelve:
  ```typescript
  const uploadUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}?simulated-presigned-token=${Date.now()}`;
  ```
  Esto no es una firma AWS HMAC-SHA256 válida. Cualquier subida `PUT` contra esta URL devolverá `403 Forbidden` en AWS S3.
- **Remediación:**
  - En **Camino A (Demo Premium):** Identificar la subida de imágenes como demostración local con fallback a URLs seguras de muestra o imágenes locales/Unsplash, deshabilitando el intento de red a una URL AWS no firmada.
  - En **Camino B (Producción Real):** Descomentar e instalar `@aws-sdk/client-s3` y `@aws-sdk/s3-request-presigner`, validando variables de entorno seguras (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) en Vercel.

---

### 🟡 SEC-04 [P1] — Integridad de Precios e Importe en Checkout
- **Archivo:** `src/pages/CheckoutModal.tsx`
- **Descripción:** El importe total (`totalPrice`) se calcula en el navegador a partir del estado de `CartContext` y se envía directamente al servicio de órdenes.
- **Riesgo:** En una pasarela real, un usuario malintencionado podría manipular el payload de la petición HTTP y enviar `totalPrice: 0.01`.
- **Remediación:**
  - En modo demo: Declarar explícitamente "Simulación de Checkout (Cálculo en Cliente)".
  - En producción: El backend debe recalcular el importe total consultando el precio oficial de cada producto en la base de datos.
