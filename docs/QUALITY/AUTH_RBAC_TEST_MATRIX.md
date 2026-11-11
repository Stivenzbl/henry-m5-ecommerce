# 🔐 Matriz de Pruebas de Autenticación y RBAC

> **Proyecto:** Patagonix Retail — AI-Driven E-Commerce SPA  
> **Rama de Hardening:** `hardening/m5-auth-rbac-data`  
> **Framework:** Vitest + React Testing Library  
> **Estado:** 100% Casos Probados y Verificados

---

## 📋 Casos de Prueba Funcionales y de Seguridad Negativa

| ID Caso | Escenario Evaluado | Tipo de Prueba | Entrada / Condición | Comportamiento Esperado | Resultado |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **AUTH-01** | Inicio en estado visitante honesto | Positivo | Primer arranque sin sesión guardada | `status = 'unauthenticated'`, `user = null`, carrito vacío. Cero usuarios ficticios. | **PASS** |
| **AUTH-02** | Login con credenciales válidas | Positivo | `login(email, password)` con cuenta activa | Emite ID token, extrae Custom Claims (`admin`), `status = 'authenticated'`. | **PASS** |
| **AUTH-03** | Login con contraseña incorrecta | Negativo | Credenciales erróneas enviadas a proveedor | Lanza error legible (`Correo electrónico o contraseña incorrectos.`), no altera sesión. | **PASS** |
| **AUTH-04** | Intento de login sin Firebase configurado | Negativo | `isFirebaseConfigured === false` | Falla cerrada inmediata con mensaje explícito de configuración requerida. | **PASS** |
| **AUTH-05** | Redirección de visitante anónimo en ruta privada | Negativo / Seguridad | Visitante navega a `/orders` | Redirige de inmediato a `/login?returnTo=%2Forders`. | **PASS** |
| **RBAC-01** | Cliente accediendo a ruta de cliente (`/orders`) | Positivo | Usuario autenticado con rol `customer` | Acceso concedido al historial propio. | **PASS** |
| **RBAC-02** | Cliente intentando acceder a `/admin` | Negativo / Seguridad | Usuario con rol `customer` navega a `/admin` | Interceptado por `ProtectedRoute`: renderiza pantalla `403 ForbiddenView` con aviso de permisos insuficientes. | **PASS** |
| **RBAC-03** | Administrador con Custom Claim accediendo a `/admin` | Positivo | Usuario con token `admin: true` | Acceso concedido a la consola administrativa completa. | **PASS** |
| **RBAC-04** | Ausencia de selector de rol en formulario | Seguridad de Diseño | Inspección de `LoginView.tsx` y `LoginModal.tsx` | El campo para autoseleccionar rol `admin` fue eliminado al 100%. | **PASS** |
| **S3-01** | Petición anónima a `/api/s3-presign` | Negativo / Seguridad | `POST /api/s3-presign` sin header Authorization | HTTP `401 Unauthorized` (`AUTH_REQUIRED`). | **PASS** |
| **S3-02** | Petición de cliente regular a `/api/s3-presign` | Negativo / Seguridad | `POST /api/s3-presign` con Bearer token de customer | HTTP `403 Forbidden` (`FORBIDDEN_NOT_ADMIN`). | **PASS** |
| **S3-03** | Petición de archivo ejecutable o inválido | Negativo / Seguridad | `fileType: 'application/x-msdownload'` | HTTP `415 Unsupported Media Type` (MIME allowlist). | **PASS** |
| **S3-04** | Petición con archivo mayor a 5 MB | Negativo / Seguridad | `fileSize: 10485760` (10 MB) | HTTP `413 Payload Too Large`. | **PASS** |
| **S3-05** | Petición válida de Administrador | Positivo | Bearer token con `admin: true` + imagen JPEG | HTTP `200 OK` con URL prefirmada HMAC-SHA256 y expiración a 300s. | **PASS** |
