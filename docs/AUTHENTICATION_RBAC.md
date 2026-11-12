# 🔐 Autenticación y Control de Acceso Basado en Roles (RBAC)

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Proveedor de Identidad:** Firebase Authentication + Google Cloud Identity  
> **Fecha:** 12 de Noviembre de 2026  

---

## 1. 📋 Implementado

1. **Sesión Honesta sin Usuarios Ficticios:**
   - La aplicación inicia con `status = 'unauthenticated'` y `user = null`.
   - Se eliminó la creación predeterminada de `user-default-101` o cualquier sesión inventada en `localStorage`.

2. **Autoridad Criptográfica de Roles (Custom Claims):**
   - El rol `admin` no se almacena en el documento del usuario en la base de datos ni se envía desde el cliente.
   - Se obtiene directamente del token firmado: `tokenResult.claims.admin === true`.
   - La función `mapFirebaseUser` en `src/contexts/AuthContext.tsx` mapea la identidad verificada.

3. **Formularios de Acceso Limpios:**
   - Tanto [`LoginView.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/pages/LoginView.tsx) como [`LoginModal.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/components/LoginModal.tsx) solicitan únicamente correo electrónico y contraseña.
   - Se erradicaron dropdowns o selectores de roles que permitían autoelevar privilegios.
   - Los botones demo académicos únicamente autocompletan el email sin exponer contraseñas en el bundle público.

4. **Componente `<ProtectedRoute>`:**
   - Intercepta el enrutamiento antes del montaje del componente protegido.
   - Protege rutas de cliente (`/orders`) y administrativas (`/admin`).
   - Sanitiza el parámetro `returnTo` asegurando que sea una ruta relativa interna que inicie con `/`.

---

## 2. 🧪 Probado

1. **Pruebas de Guardias de Ruta (`src/tests/ProtectedRoute.test.tsx`):**
   - Redirige a visitante anónimo a `/login?returnTo=%2Fadmin`.
   - Bloquea cliente con `isAdmin: false` en `/admin` mostrando `ForbiddenView` (código visual 403).
   - Concede acceso sin obstáculos a usuarios con claim `admin === true`.
2. **Pruebas de Integración (`src/tests/integration.test.tsx`):**
   - Valida el estado inicial desacoplado con sesión nula y carrito vacío.

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Script de Aprovisionamiento Administrativo con Firebase Admin SDK:** Crear un script Node.js CLI seguro (`scripts/set-admin-claim.mjs`) que utilice la clave privada del Service Account para otorgar Custom Claims a nuevos administradores fuera de la UI.
2. **Revocación Inmediata de Tokens:** Configurar la comprobación de `checkRevoked = true` en llamadas de alta sensibilidad utilizando Firebase Admin SDK.
3. **SSO Empresarial (Google Workspace / SAML):** Habilitar inicio de sesión federado para empleados del corporativo.

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Revocación de Sesiones en Consola Firebase:** El tiempo de caducidad por defecto de los tokens de Firebase es de 1 hora (3600 segundos); la revocación instantánea antes de la hora requiere sincronización con el servidor de metadatos de Firebase Auth.
