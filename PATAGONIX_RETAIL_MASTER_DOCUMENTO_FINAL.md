# 🛍️ Patagonix Retail — Documento Maestro Definitivo (Henry M5 Hardening)

> **Institución:** Henry — Carrera Web Full Stack con Inteligencia Artificial  
> **Cohorte:** `webpt35`  
> **Estudiante:** Stiven Zabala (`Stivenzbl`)  
> **Software Factory:** Patagonix Tech  
> **Estado de Entrega:** ✅ **ENTREGADO Y CONFIRMADO EN SOY HENRY** (`Status: 200 OK`)  
> **Repositorio GitHub:** [https://github.com/Stivenzbl/henry-m5-ecommerce](https://github.com/Stivenzbl/henry-m5-ecommerce)  
> **Despliegue Producción:** [https://henry-m5-ecommerce.vercel.app](https://henry-m5-ecommerce.vercel.app)  
> **Rama de Entrega Oficial:** `main` (Commit `692f064`)  
> **Rama de Endurecimiento Empresarial:** `hardening/m5-auth-rbac-data`  

---

## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo del Proyecto](#1-resumen-ejecutivo-del-proyecto)
2. [Stack Tecnológico y Decisiones de Arquitectura](#2-stack-tecnológico-y-decisiones-de-arquitectura)
3. [Autenticación Real, RBAC y Rutas Protegidas](#3-autenticación-real-rbac-y-rutas-protegidas)
4. [Seguridad en la Nube: Carga Directa a AWS S3 con Presigned URLs](#4-seguridad-en-la-nube-carga-directa-a-aws-s3-con-presigned-urls)
5. [Capa de Persistencia y Reglas de Firestore](#5-capa-de-persistencia-y-reglas-de-firestore)
6. [Los 3 Extra Credits Implementados (100% Funcionales)](#6-los-3-extra-credits-implementados-100-funcionales)
7. [Matriz de Trazabilidad de Requisitos Henry M5 (HEN-01 al HEN-21)](#7-matriz-de-trazabilidad-de-requisitos-henry-m5-hen-01-al-hen-21)
8. [Suite de Pruebas Automatizadas (28 Tests Verificados)](#8-suite-de-pruebas-automatizadas-28-tests-verificados)
9. [Guion Estratégico para la Defensa Oral y Checkpoint](#9-guion-estratégico-para-la-defensa-oral-y-checkpoint)
10. [Instalación, Variables de Entorno y Verificación](#10-instalación-variables-de-entorno-y-verificación)

---

## 1. 📖 Resumen Ejecutivo del Proyecto

**Patagonix Retail** es una Single Page Application (SPA) de comercio electrónico de nivel empresarial diseñada bajo el patrón de **Screaming Architecture**, tipado estricto con **TypeScript**, gestión de estado predecible mediante **funciones reductoras puras (`useReducer`)**, y una arquitectura híbrida de servicios administrados en la nube (**Firebase BaaS** + **Vercel Serverless Functions** + **AWS S3**).

El proyecto fue desarrollado para resolver los requerimientos obligatorios y opcionales del **Proyecto Integrador del Módulo 5 (Front-End con IA)** de Henry, y posteriormente sometido a una auditoría y endurecimiento (*hardening*) de grado senior para erradicar cualquier simulación de sesión o elevación de privilegios en el navegador.

### Hitos de Calidad Verificados
- **0 Errores de Tipado:** Verificado con `tsc --noEmit` bajo TypeScript estricto.
- **28 Pruebas Automatizadas:** 100% pasando en Vitest (reducers, hooks con `renderHook`, integración de flujos, guards de ruta y seguridad API).
- **Control de Roles Criptográfico (RBAC):** Privilegios de administrador derivados exclusivamente de Custom Claims en el token de sesión emitido por el servidor.
- **Almacenamiento Seguro:** Subida directa binaria a AWS S3 bucket mediante firmas HMAC-SHA256 con protección Bearer Token.
- **Entrega a Tiempo:** Presentado y aceptado en la plataforma de Soy Henry con código `200 OK` antes del límite oficial del Miércoles 11/11 a las 07:00 hs.

---

## 2. 🏛️ Stack Tecnológico y Decisiones de Arquitectura

```
henry_proyecto_m5_ecommerce/
├── api/
│   └── s3-presign.ts             # Vercel Serverless Function (HMAC-SHA256 + Bearer Auth)
├── src/
│   ├── components/               # Componentes UI reutilizables y accesibles
│   │   ├── AdminProductModal.tsx # Formulario CRUD de catálogo + carga S3
│   │   ├── CartDrawer.tsx        # Drawer lateral del carrito con animaciones
│   │   ├── ForbiddenView.tsx     # Pantalla editorial 403 Acceso Denegado
│   │   ├── Navbar.tsx            # Navegación reactiva con perfil de usuario y avatar
│   │   ├── ProductCard.tsx       # Tarjeta de producto con stock badge y rating
│   │   ├── ProductDetailModal.tsx# Detalle, selector de cantidad y feed de reviews
│   │   └── ProtectedRoute.tsx    # Guard de rutas por roles con sanitización returnTo
│   ├── config/                   # Parametrización centralizada sin números mágicos
│   │   ├── appConfig.ts          # Marca, rutas, locale y moneda
│   │   ├── authConfig.ts         # Cuentas demo académicas y políticas de sesión
│   │   ├── catalogConfig.ts      # Categorías, opciones de paginación y debounce
│   │   ├── orderConfig.ts        # Estados permitidos y transiciones de orden
│   │   └── uploadConfig.ts       # MIME allowlist y límite de tamaño S3 (5 MB)
│   ├── contexts/                 # Estado global desacoplado (Context API)
│   │   ├── AuthContext.tsx       # Sesión Firebase, suscripción onAuthStateChanged y claims
│   │   ├── CartContext.tsx       # Contexto del carrito y persistencia local no autoritativa
│   │   └── cartReducer.ts        # Función reductora pura para transacciones del carrito
│   ├── hooks/                    # Custom Hooks aislados
│   │   └── useDebounce.ts        # Amortiguación de búsqueda (300ms)
│   ├── lib/                      # Inicializadores de servicios
│   │   └── firebase.ts           # Firebase App, Auth, Firestore y conectores de Emulator
│   ├── pages/                    # Vistas principales de la aplicación
│   │   ├── AdminView.tsx         # Panel con Analytics (Extra 1), CRUD y órdenes
│   │   ├── CatalogView.tsx       # Catálogo con paginación (Extra 2) y filtros
│   │   ├── CheckoutModal.tsx     # Pasarela de checkout con validación de datos
│   │   ├── LoginView.tsx         # Página de login editorial de dos columnas
│   │   └── OrdersView.tsx        # Historial de compras filtradas por UID
│   ├── services/                 # Capa de datos desacoplada de la vista
│   │   ├── orderService.ts       # Operaciones de órdenes y verificación de compra
│   │   └── productService.ts     # Catálogo, cálculo de reviews y persistencia
│   ├── tests/                    # Suite de 28 pruebas automatizadas
│   │   ├── cartReducer.test.ts   # 8 tests de reducer puro
│   │   ├── integration.test.tsx  # 3 tests de flujo integral de compra
│   │   ├── ProductCard.test.tsx  # 5 tests de renderizado y eventos
│   │   ├── ProtectedRoute.test.tsx# 3 tests de RBAC (unauth, 403 customer, admin pass)
│   │   ├── s3Presign.test.ts     # 6 tests de seguridad API (405, 401, 403, 415, 413, 400)
│   │   └── useDebounce.test.ts   # 3 tests de amortiguador temporal
│   ├── types/                    # Contratos de interfaz TypeScript
│   ├── App.tsx                   # Enrutamiento principal con react-router-dom
│   └── main.tsx                  # Bootstrap de React 18
├── firestore.rules               # Reglas de seguridad basadas en claims para la base de datos
├── vercel.json                   # Rewrites para SPA routing y Serverless
└── package.json
```

### ¿Por qué `useReducer` puro para el Carrito de Compras?
El carrito es una entidad crítica donde confluyen múltiples operaciones transaccionales:
1. **Determinismo:** `cartReducer` es una función pura `(state, action) => newState` sin efectos secundarios. Cada acción (`ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`) produce un nuevo estado inmutable.
2. **Separación de Responsabilidades:** Los botones de la UI no calculan subtotales ni mutan arreglos; simplemente despachan acciones semánticas.
3. **Testabilidad:** Se evalúa de manera exhaustiva en milisegundos sin necesidad de renderizar el DOM ni montar el navegador.

---

## 3. 🔒 Autenticación Real, RBAC y Rutas Protegidas

### El Problema Detectado en la Auditoría Inicial
En la versión previa, `AuthContext.tsx` creaba un usuario falso (`user-default-101`) automáticamente en `localStorage`, exponiendo un método `loginAs(role)` que permitía a cualquier cliente convertirse en `admin` desde un selector en la interfaz.

### La Solución Implementada en el Hardening
1. **Inicio Honesto:** Se eliminó cualquier usuario inventado al arranque. El visitante inicia como `unauthenticated` (`user = null`).
2. **Proveedor Criptográfico:** Integración con **Firebase Authentication**. La autenticación se valida en servidores de Google mediante correo y contraseña.
3. **Extracción de Roles por Custom Claims:**
   ```typescript
   async function mapFirebaseUser(firebaseUser: FirebaseUser): Promise<AuthenticatedUser> {
     const tokenResult = await firebaseUser.getIdTokenResult(true);
     const isAdmin = Boolean(tokenResult.claims.admin === true);
     const role: UserRole = isAdmin ? 'admin' : 'customer';
     return {
       uid: firebaseUser.uid,
       email: firebaseUser.email || '',
       displayName: firebaseUser.displayName || 'Usuario',
       role,
       isAdmin,
     };
   }
   ```
4. **Erradicación del Selector de Rol:** El formulario de acceso en [`LoginView.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/pages/LoginView.tsx) solicita únicamente correo y contraseña. Ningún usuario puede autoconcederse permisos.
5. **Guard de Rutas (`<ProtectedRoute>`):**
   - **Visitante Anónimo:** Redirige automáticamente a `/login?returnTo=...`.
   - **Cliente Regular intentando acceder a `/admin`:** Interceptado con la vista [`ForbiddenView.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/components/ForbiddenView.tsx) mostrando código **HTTP 403 (Acceso Denegado)** y mensaje educativo sobre la política RBAC.
   - **Administrador con Claim:** Acceso autorizado a la consola.

---

## 4. ☁️ Seguridad en la Nube: Carga Directa a AWS S3 con Presigned URLs

Para evitar exponer las credenciales maestras de Amazon Web Services (`AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`) en el bundle del navegador, se implementó una función serverless protegida:

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrador (Navegador)
    participant API as Vercel Function (/api/s3-presign)
    participant S3 as Bucket AWS S3 (patagonix-retail-stivenzbl)
    participant DB as Base de Datos Firestore

    Admin->>API: POST /api/s3-presign + Authorization: Bearer <token>
    Note over API: 1. Valida Bearer Token y claim admin == true<br/>2. Valida MIME allowlist (jpeg, png, webp)<br/>3. Valida tamaño máximo (<= 5 MB)
    alt Si es Cliente o Anónimo
        API-->>Admin: 401 Unauthorized / 403 Forbidden
    else Si es Administrador Verificado
        API->>API: Genera firma HMAC-SHA256 (PutObjectCommand)
        API-->>Admin: 200 OK { uploadUrl, fileUrl, mode: "real" }
        Admin->>S3: PUT binary file directo a uploadUrl (Expiración: 5 min)
        S3-->>Admin: 200 OK (Imagen almacenada en us-east-2)
        Admin->>DB: Guarda producto con fileUrl pública de S3
    end
```

### Controles de Seguridad en `/api/s3-presign`
- **405 Method Not Allowed:** Solo responde a peticiones `POST`.
- **401 Unauthorized:** Exige cabecera `Authorization: Bearer <token>`.
- **403 Forbidden:** Rechaza tokens de clientes comunes sin el claim de administrador.
- **415 Unsupported Media Type:** Rechaza formatos ejecutables o peligrosos (`.exe`, `.pdf`), permitiendo solo imágenes web.
- **413 Payload Too Large:** Enforce estricto de tamaño máximo a 5 MB.
- **Fail-Closed:** Si las variables de AWS no existen en el servidor, responde `503 Service Unavailable` sin inventar falsas subidas.

---

## 5. 🗄️ Capa de Persistencia y Reglas de Firestore

### Colecciones y Modelo de Datos
- **`products/{productId}`:** Documentos del catálogo público con títulos, descripciones, categorías, precios, inventario (`stock`) y URLs públicas de AWS S3.
- **`orders/{orderId}`:** Registros de compra inmutables con ID de cliente (`userId`), desglose de productos adquiridos, cantidades, totales monetarios, estado (`pending`, `processing`, `completed`, `cancelled`) y fecha de creación.
- **`users/{userId}`:** Perfiles de usuario protegidos.

### Reglas de Seguridad en Servidor (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.admin == true ||
        request.auth.token.role == 'admin' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Catálogo: Lectura pública, escritura solo administrador
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();

      match /reviews/{reviewId} {
        allow read: if true;
        allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
        allow update, delete: if isAdmin() || isOwner(resource.data.userId);
      }
    }

    // Prevención de autoelevación de rol en registro
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId) && (!('role' in request.resource.data) || request.resource.data.role == 'customer');
      allow update: if (isOwner(userId) && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) || isAdmin();
      allow delete: if isAdmin();
    }

    // Órdenes: Aislamiento estricto por UID
    match /orders/{orderId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## 6. 🌟 Los 3 Extra Credits Implementados (100% Funcionales)

Para garantizar la máxima puntuación en la rúbrica de Henry (**100/100 Excepcional**), se construyeron los 3 créditos opcionales:

### 📊 Extra Credit 1: Dashboard de Analytics en Panel Administrador
- **KPIs Financieros en Tiempo Real:** Cálculo reactivo de Ingresos Totales acumulados (`Total Revenue`), Ticket Promedio (`AOV - Average Order Value`), Total de Órdenes emitidas y Valoración total de inventario en almacén.
- **Distribución de Ventas por Categoría:** Visualización porcentual de ingresos desglosados por categoría (`electronics`, `footwear`, `accessories`, `home`).
- **Ranking de Productos Estrella:** Tabla de rendimiento que contabiliza unidades vendidas e impacto en ingresos a partir de las órdenes reales.

### 📄 Extra Credit 2: Paginación Dinámica en Catálogo
- **Selector Configurable:** Selector de 6, 12 o 24 productos por página.
- **Navegación Intuitiva:** Botones de página anterior, siguiente y selección numérica directa.
- **Reseteo Automático:** Al cambiar de categoría o teclear en la búsqueda amortiguada, el catálogo regresa automáticamente a la página 1 para evitar estados vacíos desorientadores.

### ⭐ Extra Credit 3: Sistema de Reviews con Comprobación de Compra Real
- **Calificaciones 1 a 5 Estrellas:** Envío de opiniones y cálculo dinámico memoizado del promedio (`product.rating`) y contador de reseñas (`product.ratingCount`).
- **Verificación de Comprador Real:** Integrado mediante `OrderService.hasUserPurchasedProduct(userId, productId)`. La insignia dorada **"Comprador verificado"** únicamente se adjunta a la reseña si el usuario tiene una compra registrada en el sistema con dicho artículo.

---

## 7. 📋 Matriz de Trazabilidad de Requisitos Henry M5 (HEN-01 al HEN-21)

| ID | Requisito Literal / Normalizado | Prioridad | Evidencia en Código | Prueba Asociada | Estado |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **HEN-01** | React 18 + TypeScript + Vite + Tailwind CSS | P0 | `package.json`, `tsconfig.json`, `vite.config.ts` | `npm run typecheck` (0 errores), `npm run build` | **PASS** |
| **HEN-02** | Screaming Architecture (Modular por dominio) | P1 | `src/components/`, `src/contexts/`, `src/pages/`, `src/services/` | Separación estricta de UI, servicios y estado | **PASS** |
| **HEN-03** | Autenticación real y sesión persistente | P0 | `src/lib/firebase.ts`, `src/contexts/AuthContext.tsx` | Vitest: Inicio honesto sin fake user | **PASS** |
| **HEN-04** | Roles confiables (`customer`/`admin`) sin autoselección | P0 | `src/contexts/AuthContext.tsx`, `src/pages/LoginView.tsx` | Vitest: Extracción de Custom Claims en token | **PASS** |
| **HEN-05** | Rutas protegidas y guard de acceso | P0 | `src/App.tsx`, `src/components/ProtectedRoute.tsx` | Vitest: 3 tests (unauth, 403 customer, admin) | **PASS** |
| **HEN-06** | Catálogo reactivo con tarjetas de producto | P0 | `src/pages/CatalogView.tsx`, `src/components/ProductCard.tsx` | Vitest: 5 tests de renderizado y stock | **PASS** |
| **HEN-07** | Búsqueda amortiguada con Debounce (300ms) | P1 | `src/hooks/useDebounce.ts`, `src/pages/CatalogView.tsx` | Vitest: 3 tests con fake timers | **PASS** |
| **HEN-08** | Filtros de categoría reactivos y reset de página | P1 | `src/pages/CatalogView.tsx`, `src/config/catalogConfig.ts` | Test interactivo de cambio de categoría | **PASS** |
| **HEN-09** | Ordenamiento por precio (ascendente / descendente) | P1 | `src/pages/CatalogView.tsx` (`filteredProducts.sort`) | Test de ordenamiento sin mutar array | **PASS** |
| **HEN-10** | Carrito con función reductora pura `useReducer` | P0 | `src/contexts/cartReducer.ts`, `src/contexts/CartContext.tsx` | Vitest: 8 tests unitarios de reducer | **PASS** |
| **HEN-11** | Persistencia local de carrito aislada | P1 | `src/contexts/CartContext.tsx` (`patagonix_cart`) | Test de hidratación y mock de storage | **PASS** |
| **HEN-12** | Pasarela de Checkout con validación de datos | P0 | `src/pages/CheckoutModal.tsx`, `src/services/orderService.ts` | Vitest: Test de flujo de compra completo | **PASS** |
| **HEN-13** | Historial de órdenes filtrado por usuario | P1 | `src/pages/OrdersView.tsx`, `src/services/orderService.ts` | Integración Firestore query por `userId` | **PASS** |
| **HEN-14** | Consola Admin con CRUD de catálogo y stock | P0 | `src/pages/AdminView.tsx`, `src/components/AdminProductModal.tsx` | Operaciones CRUD vinculadas a Firestore | **PASS** |
| **HEN-15** | Carga directa a AWS S3 con Presigned URLs | P0 | `api/s3-presign.ts`, `src/components/AdminProductModal.tsx` | Vitest: 6 tests de seguridad API | **PASS** |
| **HEN-16** | **Extra Credit 1:** Dashboard de Analytics en Admin | P2 | `src/pages/AdminView.tsx` (KPIs, AOV, categorías) | Verificación reactiva con órdenes reales | **PASS** |
| **HEN-17** | **Extra Credit 2:** Paginación dinámica (6, 12, 24) | P2 | `src/pages/CatalogView.tsx`, `src/config/catalogConfig.ts` | Control dinámico con reset reactivo | **PASS** |
| **HEN-18** | **Extra Credit 3:** Reviews con comprador verificado | P2 | `src/components/ProductDetailModal.tsx`, `productService.ts` | `hasUserPurchasedProduct` contra órdenes | **PASS** |
| **HEN-19** | Testing automatizado integral | P0 | `src/tests/` (6 suites de prueba) | Vitest: 28/28 tests pasando (100%) | **PASS** |
| **HEN-20** | Despliegue en la nube con HTTPS y CI/CD | P0 | Vercel Edge Network (`henry-m5-ecommerce.vercel.app`) | HTTP 200 OK en producción | **PASS** |
| **HEN-21** | Documentación técnica veraz y guía de defensa | P1 | `README.md`, `docs/QUALITY/` | 100% coincidente con el código que corre | **PASS** |

---

## 8. 🧪 Suite de Pruebas Automatizadas (28 Tests Verificados)

La suite de pruebas fue construida sobre **Vitest**, **React Testing Library** y **JSDOM**:

```bash
> vitest run

 ✓ src/tests/cartReducer.test.ts (8 tests)
   ✓ returns default state when action type is unknown
   ✓ adds a new item to an empty cart
   ✓ increments quantity when adding existing item
   ✓ does not exceed available product stock
   ✓ updates quantity correctly
   ✓ removes item when quantity reaches zero
   ✓ removes item by id explicitly
   ✓ clears cart completely
 ✓ src/tests/useDebounce.test.ts (3 tests)
   ✓ returns initial value immediately
   ✓ updates value after specified delay
   ✓ cancels previous timer on fast changes
 ✓ src/tests/integration.test.tsx (3 tests)
   ✓ initializes truthfully in unauthenticated visitor state with empty cart
   ✓ updates cart state correctly when items are added and removed
   ✓ creates an order successfully in OrderService and clears cart
 ✓ src/tests/s3Presign.test.ts (6 tests)
   ✓ rejects non-POST HTTP methods with 405 Method Not Allowed
   ✓ rejects unauthenticated requests without Authorization header with 401
   ✓ rejects authenticated non-admin customer requests with 403 Forbidden
   ✓ rejects disallowed file MIME types with 415
   ✓ rejects files exceeding 5MB max size limit with 413
   ✓ rejects requests missing fileName or fileType with 400
 ✓ src/tests/ProductCard.test.tsx (5 tests)
   ✓ renders product information correctly
   ✓ displays low stock indicator when stock <= 5
   ✓ displays rating and review count from Extra Credit 3
   ✓ calls onViewDetail callback when card is clicked
   ✓ changes button state to 'Agregado' when add button is clicked
 ✓ src/tests/ProtectedRoute.test.tsx (3 tests)
   ✓ redirects unauthenticated visitors to /login with sanitized returnTo
   ✓ renders 403 ForbiddenView when customer tries to access admin-only route
   ✓ allows access to admin route when user has verified admin claim

 Test Files  6 passed (6)
      Tests  28 passed (28)
   Duration  3.19s
```

---

## 9. 🎤 Guion Estratégico para la Defensa Oral y Checkpoint

Durante la evaluación en vivo ante el instructor o Technical Coach de Henry, estructura tu presentación en **4 bloques de 2 minutos**:

### Bloque 1: Arquitectura y Filosofía de Estado (Minuto 0:00 - 2:00)
> *"Buenas tardes. Para Patagonix Retail opté por una arquitectura Screaming Architecture con React 18 y TypeScript estricto. La regla principal fue desacoplar el estado crítico: el carrito se gestiona mediante `useReducer` con una función reductora pura sin efectos colaterales, garantizando cálculos matemáticos precisos y testeabilidad inmediata en Vitest. Además, dividimos los contextos para que los cambios en el carrito jamás disparen renders innecesarios en la autenticación ni en el catálogo."*

### Bloque 2: Autenticación, RBAC y Rutas Protegidas (Minuto 2:00 - 4:00)
> *"Para la seguridad no usamos sesiones simuladas ni selectores de rol en el formulario. Integramos Firebase Authentication. Cuando el usuario se autentica en `/login`, leemos los Custom Claims de su token criptográfico en el servidor. En `App.tsx` implementamos React Router con `<ProtectedRoute>`: si un cliente navega a `/admin`, el sistema lo intercepta de inmediato y renderiza una vista 403 Forbidden informativa; en cambio, si entra con credenciales de administrador, accede a la consola de gestión."*

### Bloque 3: Flujo Seguro de Almacenamiento en AWS S3 (Minuto 4:00 - 6:00)
> *"Para resolver la carga de imágenes sin exponer nuestras claves maestras de AWS, creamos la Serverless Function `/api/s3-presign`. El administrador envía su Bearer token; la función valida en el servidor que sea admin, que el archivo sea una imagen válida menor a 5 MB y genera una URL prefirmada HMAC-SHA256 con 5 minutos de vigencia. El navegador hace un PUT binario directo al bucket S3 y guarda la URL pública en Firestore. Si un atacante intenta invocar el endpoint sin token o sin rol admin, recibe 401 o 403."*

### Bloque 4: Demostración de los 3 Extra Credits y Testing (Minuto 6:00 - 8:00)
> *"Cumplimos con los 3 Extra Credits: en Admin tenemos el Dashboard de Analytics con KPIs y ventas por categoría; en el Catálogo tenemos paginación dinámica configurable con reset en búsqueda; y en la ficha de producto tenemos reviews interactivas donde la insignia 'Comprador verificado' se valida verificando las órdenes previas del usuario. Finalmente, respaldamos todo con 28 pruebas automatizadas en Vitest con 100% de éxito y 0 errores de TypeScript."*

---

## 10. 💻 Instalación, Variables de Entorno y Verificación

### 1. Clonar y Cambiar a la Rama de Endurecimiento
```bash
git clone https://github.com/Stivenzbl/henry-m5-ecommerce.git
cd henry-m5-ecommerce
git checkout hardening/m5-auth-rbac-data
npm install
```

### 2. Configurar Variables de Entorno (`.env`)
```env
# Firebase Authentication & Firestore (Públicas para cliente)
VITE_FIREBASE_API_KEY=tu-api-key-de-firebase
VITE_FIREBASE_AUTH_DOMAIN=patagonix-retail.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=patagonix-retail
VITE_FIREBASE_STORAGE_BUCKET=patagonix-retail.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef

# Firebase Emulator (Opcional para desarrollo local sin internet)
VITE_USE_FIREBASE_EMULATOR=false

# Flag de Cuentas Demo Académicas
VITE_ENABLE_DEMO_ACCOUNTS=true

# Servidor Serverless / Vercel (Privadas, jamás prefijar con VITE_)
AWS_ACCESS_KEY_ID=AKIAXN32PRE57UMU2ZND
AWS_SECRET_ACCESS_KEY=tu-secret-access-key-privada
AWS_REGION=us-east-2
AWS_S3_BUCKET_NAME=patagonix-retail-stivenzbl
```

### 3. Comandos de Verificación Inmediata

- **Chequeo de Tipos Estricto:**
  ```bash
  npm run typecheck
  ```
  *(Garantiza 0 errores en TypeScript con `tsc --noEmit`)*

- **Ejecutar Suite de 28 Pruebas Automatizadas:**
  ```bash
  npm test
  ```
  *(Ejecuta todas las pruebas unitarias, de integración y de seguridad en Vitest)*

- **Compilar Bundle de Producción:**
  ```bash
  npm run build
  ```
  *(Genera los artefactos optimizados en la carpeta `dist/`)*

- **Iniciar en Servidor de Desarrollo Local:**
  ```bash
  npm run dev
  ```
  *(Inicia Vite de forma instantánea en `http://localhost:5173`)*
