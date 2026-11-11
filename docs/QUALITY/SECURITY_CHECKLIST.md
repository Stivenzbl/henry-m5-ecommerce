# 🛡️ Checklist de Seguridad Técnica — Patagonix Retail

> **Proyecto:** Patagonix Retail — AI-Driven E-Commerce SPA  
> **Fecha:** 11 de Noviembre de 2026  
> **Auditoría:** Estándar OWASP Top 10 Web & Cloud Security

---

## 1. Autenticación y Gestión de Identidad (Auth)

- [x] **Sin Sesión Fantasma:** Se eliminó la creación automática de `user-default-101` y cualquier sesión fabricada en el navegador.
- [x] **Proveedor Criptográfico:** Autenticación delegada a Firebase Authentication con hash de contraseñas server-side.
- [x] **Formulario Seguro:** El formulario de login envía credenciales al proveedor y no admite campos para autoseleccionar roles administrativos.
- [x] **Flujo Fail-Closed:** Si el proveedor no está configurado, la aplicación rechaza intentos de login con advertencia explícita en lugar de simular éxito.
- [x] **Toggle de Contraseña Accesible:** Implementado control show/hide con atributos ARIA y botones semánticos.

---

## 2. Control de Acceso Basado en Roles (RBAC)

- [x] **Autoridad de Roles Server-Side:** El rol `admin` se valida exclusivamente mediante Custom Claims en el token (`token.claims.admin === true`).
- [x] **Rutas Protegidas:** Implementado componente `<ProtectedRoute>` con aislamiento por roles:
  - Visitante anónimo ➔ Redirección limpia a `/login?returnTo=...`.
  - Cliente regular intentando entrar a `/admin` ➔ Bloqueo estricto con pantalla `403 ForbiddenView`.
  - Administrador verificado ➔ Acceso concedido.
- [x] **Sanitización de Redirección:** El parámetro `returnTo` solo permite rutas relativas internas que comiencen con `/`, bloqueando Open Redirects.

---

## 3. Seguridad de Datos y Firestore Rules

- [x] **Reglas de Seguridad en Servidor:**
  - `/products`: Lectura pública para cualquier visitante; escritura/edición/borrado restringido estrictamente a `isAdmin()`.
  - `/orders`: Clientes solo pueden crear y leer órdenes con `userId == request.auth.uid`. Admins tienen acceso de auditoría y gestión de estados.
  - `/users`: Restricción estricta `allow create: if isOwner(userId) && (!('role' in request.resource.data) || request.resource.data.role == 'customer')` que bloquea la autoelevación de privilegios en el documento.
- [x] **Aislamiento de Almacenamiento Local:** `localStorage` queda restringido a almacenamiento de conveniencia no autoritativo (carrito local y caché de catálogo).

---

## 4. Seguridad de Almacenamiento Cloud y Endpoint Serverless (S3)

- [x] **Cero Credenciales en Frontend:** Ni `AWS_ACCESS_KEY_ID` ni `AWS_SECRET_ACCESS_KEY` se exponen en Vite ni en el bundle final.
- [x] **Autenticación Bearer Requerida:** `/api/s3-presign` exige cabecera `Authorization: Bearer <token>` y responde `401 Unauthorized` si falta.
- [x] **Autorización de Administrador:** El endpoint valida que el emisor cuente con el claim de `admin` antes de emitir cualquier URL de escritura (`403 Forbidden`).
- [x] **MIME Type Allowlist:** Rechaza formatos no permitidos (`415 Unsupported Media Type`), aceptando únicamente `image/jpeg`, `image/png` e `image/webp`.
- [x] **Límite de Tamaño:** Enforce de tamaño máximo de archivo a 5 MB (`413 Payload Too Large`).
- [x] **Prefijo y Clave Segura:** Las claves en S3 se generan aleatoriamente con timestamp bajo el prefijo `products/`, evitando sobrescritura maliciosa de archivos existentes.
- [x] **Sin Fallback Simulado en Producción:** Si faltan credenciales en el servidor, responde `503 Service Unavailable` cerrando el servicio.
