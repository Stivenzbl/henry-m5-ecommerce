# 🛡️ Arquitectura de Seguridad Técnica — Patagonix Retail

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Estándar:** OWASP Top 10 Web & Cloud Security  
> **Fecha:** 12 de Noviembre de 2026  

---

## 1. 📋 Implementado

1. **Defensa en Profundidad (Multi-Tier Security):**
   - **Frontend SPA:** Guard `<ProtectedRoute>` con aislamiento de roles, interceptando navegación y sanitizando `returnTo` para bloquear Open Redirects.
   - **Capa Serverless (Edge / API):** Endpoint `/api/s3-presign` con autenticación Bearer Token obligatoria y validación de Custom Claims server-side.
   - **Proveedor de Identidad:** Firebase Authentication con hashing y salting de contraseñas gestionado por Google.
   - **Base de Datos BaaS:** Firestore con reglas de seguridad declarativas en servidor (`firestore.rules`).
   - **Almacenamiento Cloud:** Bucket AWS S3 en región `us-east-2` configurado con políticas de subida directa restringidas.

2. **Verificación Criptográfica de Tokens (`api/lib/verifyAuth.ts`):**
   - Utiliza la librería estándar `jose` para descargar dinámicamente el conjunto público JWKS de Google (`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`).
   - Verifica la firma digital asimétrica **RS256** del ID Token.
   - Valida la fecha de expiración (`exp`), vigencia (`nbf`), emisor (`iss == https://securetoken.google.com/<projectId>`) y audiencia (`aud == <projectId>`).
   - Extrae el Custom Claim `admin === true` de manera autoritativa.

3. **Erradicación de Secretos en el Frontend:**
   - Cero claves maestras de AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) en el bundle de Vite o código cliente.
   - Cero contraseñas hardcodeadas en `LoginView.tsx` o `LoginModal.tsx`.

---

## 2. 🧪 Probado

1. **Suite Automatizada de Seguridad (`src/tests/s3Presign.test.ts`):**
   - Rechazo de peticiones sin cabecera Authorization con código HTTP `401 Unauthorized` (`AUTH_REQUIRED`).
   - Rechazo de peticiones con firmas o tokens inválidos con código `401`.
   - Rechazo de clientes comunes autenticados (sin claim de admin) con código `403 Forbidden` (`FORBIDDEN_NOT_ADMIN`).
   - Rechazo de métodos HTTP no permitidos (`GET`, `PUT`, `DELETE`) con código `405 Method Not Allowed`.
   - Comportamiento fail-closed (`503 Service Unavailable`) si las credenciales del bucket no están configuradas en el entorno del servidor.
2. **Guards de Enrutamiento (`src/tests/ProtectedRoute.test.tsx`):**
   - Redirección de visitantes anónimos a `/login`.
   - Renderizado de pantalla `403 ForbiddenView` ante accesos no autorizados a `/admin`.
   - Concesión de acceso exclusivo a usuarios con `isAdmin: true`.

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Rotación Automática de Secretos IAM:** Implementar rotación programada de claves de acceso AWS mediante AWS Secrets Manager o IAM Roles Anywhere.
2. **Rate Limiting Distribuido:** Incorporar Upstash Redis en Vercel Edge Middleware para limitar peticiones por IP en `/api/s3-presign` (e.g. máximo 10 firmas por minuto por administrador).
3. **MFA (Autenticación Multifactor):** Habilitar SMS o TOTP para cuentas con privilegios administrativos en Firebase Auth.

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Configuración de Bloqueo de Acceso Público en Consola AWS S3:** La directiva *Block Public Access* a nivel de cuenta AWS se configura en la consola web de AWS y no puede inspeccionarse directamente desde el repositorio de código estático.
2. **Políticas IAM de Usuario AWS:** Los permisos adjuntos a la identidad IAM (`s3:PutObject`, `s3:AbortMultipartUpload`) dependen de la asignación en AWS IAM Console.
