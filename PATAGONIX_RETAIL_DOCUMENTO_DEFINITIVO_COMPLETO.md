# 🛍️ Patagonix Retail — Documento Definitivo Completo (Henry M5 & Enterprise Hardening Core)

> **Institución Académica:** Soy Henry — Carrera Web Full Stack con Inteligencia Artificial  
> **Cohorte:** `webpt35`  
> **Estudiante / Desarrollador:** Stiven Zabala (`Stivenzbl`)  
> **Software Factory:** Patagonix Tech  
> **Estado Oficial de Entrega:** ✅ **ENTREGADO Y CONFIRMADO EN PLATAFORMA SOY HENRY** (Petición API: `200 OK`)  
> **Repositorio Oficial en GitHub:** [https://github.com/Stivenzbl/henry-m5-ecommerce](https://github.com/Stivenzbl/henry-m5-ecommerce)  
> **Despliegue Activo en Producción:** [https://henry-m5-ecommerce.vercel.app](https://henry-m5-ecommerce.vercel.app)  
> **Rama de Entrega Original (Resguardada Intacta):** [`main`](https://github.com/Stivenzbl/henry-m5-ecommerce/tree/main) (Commit `692f064`)  
> **Rama de Hardening Empresarial Definitivo:** [`hardening/enterprise-security-core`](https://github.com/Stivenzbl/henry-m5-ecommerce/tree/hardening/enterprise-security-core)  
> **Fecha:** 12 de Noviembre de 2026 (Segunda Vuelta de Hardening & Enterprise Audit Remediation)  

---

## 📑 Índice General

1. [Resumen Ejecutivo y Estado del Proyecto](#1-resumen-ejecutivo-y-estado-del-proyecto)
2. [Estrategia de Ramas Git y Blindaje de la Entrega Oficial](#2-estrategia-de-ramas-git-y-blindaje-de-la-entrega-oficial)
3. [Matriz de Auditoría Forense: Consigna Henry M5 vs Estado Actual (HEN-01 al HEN-21)](#3-matriz-de-auditoría-forense-consigna-henry-m5-vs-estado-actual-hen-01-al-hen-21)
4. [Resolución de Hallazgos Críticos de Seguridad Ofensiva (P0 y P1 - Primera y Segunda Ronda)](#4-resolución-de-hallazgos-críticos-de-seguridad-ofensiva-p0-y-p1---primera-y-segunda-ronda)
5. [Arquitectura del Sistema y Screaming Architecture](#5-arquitectura-del-sistema-y-screaming-architecture)
6. [Autenticación Real, RBAC por Custom Claims y Rediseño Editorial de Login](#6-autenticación-real-rbac-por-custom-claims-y-rediseño-editorial-de-login)
7. [Carga Segura con AWS S3 Presigned POST y Verificación Criptográfica Google JWKS RS256 Zero-Bypass](#7-carga-segura-con-aws-s3-presigned-post-y-verificación-criptográfica-google-jwks-rs256-zero-bypass)
8. [Integridad Comercial Backend, Transacciones con Rollback y Reglas Firestore Blindadas](#8-integridad-comercial-backend-transacciones-con-rollback-y-reglas-firestore-blindadas)
9. [Parametrización Centralizada, Design Tokens y Configuración Tipada](#9-parametrización-centralizada-design-tokens-y-configuración-tipada)
10. [Los 3 Extra Credits Implementados (100% Operativos)](#10-los-3-extra-credits-implementados-100-operativos)
11. [Suite Integral de 54 Pruebas Automatizadas (100% PASS) en Vitest](#11-suite-integral-de-54-pruebas-automatizadas-100-pass-en-vitest)
12. [Identidad Visual (Aurora Obsidian) y Evidencias Gráficas](#12-identidad-visual-aurora-obsidian-y-evidencias-gráficas)
13. [Guion Estratégico y Respuestas a Preguntas Trampa para la Defensa Oral](#13-guion-estratégico-y-respuestas-a-preguntas-trampa-para-la-defensa-oral)
14. [Manual de Despliegue, Variables de Entorno Sanitizadas e Instrucciones](#14-manual-de-despliegue-variables-de-entorno-sanitizadas-e-instrucciones)

---

## 1. 📖 Resumen Ejecutivo y Estado del Proyecto

**Patagonix Retail** es una Single Page Application (SPA) de comercio electrónico de alta fidelidad desarrollada como Proyecto Integrador del Módulo 5 (Front-End con Inteligencia Artificial) en la carrera Web Full Stack de Soy Henry.

El proyecto ha cumplido exitosamente un doble hito técnico y profesional:

1. **Cumplimiento Académico Impecable (Entrega Oficial Registrada):**
   - La entrega obligatoria fue realizada formalmente dentro del plazo oficial mediante el formulario de evaluaciones de Soy Henry contra el endpoint `https://api.soyhenry.com/api/v1/homeworks/persons`.
   - Respuesta del servidor: **`HTTP 200 OK`** (*"Tu proyecto fue entregado con éxito"*).
   - El commit oficial enviado es el `692f064` en la rama `main`, el cual se mantiene **completamente congelado e inalterado** para garantizar la validez ante los evaluadores académicos.

2. **Hardening Empresarial Definitivo (Enterprise Security Core):**
   - Se ejecutó un proceso de dos vueltas de auditoría independiente de seguridad ofensiva para erradicar las vulnerabilidades clásicas de aplicaciones en desarrollo:
     - Manipulación de órdenes y precios mediante Client SDK directo.
     - Suplantación del estado de comprador verificado.
     - Bypasses de firma criptográfica en entornos de test.
     - Inconsistencia de inventario sin reversión atómica.
     - Simulación de subidas en caliente (fallbacks engañosos).
     - Bundles monolíticos sin code-splitting.
   - La arquitectura fue elevada al estándar de un e-commerce comercial listo para producción en la rama aislada [`hardening/enterprise-security-core`](https://github.com/Stivenzbl/henry-m5-ecommerce/tree/hardening/enterprise-security-core).

### Indicadores Clave de Calidad
- **Tipado Estricto TypeScript:** `0` errores en modo estricto (`tsc --noEmit`).
- **Pruebas Automatizadas:** **54 de 54 pruebas pasando (100% PASS)** en Vitest a lo largo de 9 suites de pruebas.
- **Rendimiento de Bundle:** Bundle principal reducido de 977 kB a tan solo **62 kB** (17 kB gzipped) gracias a `React.lazy`, `<Suspense>` y Rollup chunk splitting (`vendor-react`, `vendor-firebase`, `vendor-icons`).
- **Cumplimiento de Consigna Henry:** **21 de 21 requisitos (100% PASS)** incluyendo los 3 Extra Credits evaluados sobre 100/100.
- **Vulnerabilidades Críticas:** `0` P0s y `0` P1s residuales.

---

## 2. 🌳 Estrategia de Ramas Git y Blindaje de la Entrega Oficial

Para resguardar la seguridad jurídica y académica de la entrega, se implementó una estrategia de ramas aisladas:

```text
[origin/main] ───────────────────── 692f064 (Entrega Oficial en Plataforma Soy Henry - INTACTA)
                                       │
[hardening/enterprise-security-core]  ├── 208e5d5 (Firma Criptográfica JWKS RS256 + S3 Presigned POST)
                                       ├── 180a6a6 (Erradicación total de contraseñas en bundle público)
                                       ├── c013c93 (Precios autoritativos, stock, fail-closed y rules keys().hasOnly())
                                       ├── 28fc15a (32 pruebas automatizadas en Vitest)
                                       ├── 225a2c0 (Documentación técnica y matrices)
                                       ├── b19e2df (Docs dedicados de arquitectura y design tokens)
                                       └── [CURRENT] (Integridad Backend: POST /api/orders, POST /api/reviews,
                                                      allow create: if false, rollback atómico,
                                                      cero bypass RS256, 54 tests y code splitting)
```

### Tabla Comparativa entre Estados

| Dimensión Técnica | Rama Oficial `main` (Entrega Henry) | Rama `hardening/enterprise-security-core` (Empresarial) |
| :--- | :--- | :--- |
| **Autenticación** | Firebase Auth + Fallback local | Firebase Auth real con `onAuthStateChanged` y fail-closed |
| **Credenciales Demo** | Botones de 1 clic con credenciales | **Cero contraseñas en frontend**; solo autocompleta email |
| **Verificación JWT** | Decodificación Base64 en servidor | **Verificación criptográfica RS256 Google JWKS (`jose`) sin bypass** |
| **Control de Roles** | Verificación en cliente / token | **Custom Claims emitidos en servidor (`admin === true`)** |
| **Subida de Archivos** | `PutObjectCommand` (PUT) | **AWS S3 Presigned POST con `content-length-range` (1-5 MB)** |
| **Límite de 5 MB** | Pre-validado en body del cliente | **Forzado en el bucket S3 por política criptográfica de AWS** |
| **Subida en Frontend** | Fallback a blob simulado | **Fail-closed estricto: aborta y alerta en rojo ante fallo** |
| **Creación de Órdenes** | Client SDK directo (`addDoc`) | **Backend autoritativo `POST /api/orders`; cliente bloqueado** |
| **Cálculo de Precios** | Confiaba en total del cliente | **Recálculo autoritativo en backend desde catálogo con rollback** |
| **Validación de Stock** | En cliente | **Reserva y descuento atómico con reversión transaccional completa** |
| **Comprador Verificado** | Flag en cliente / orden simple | **Backend `POST /api/reviews` consulta órdenes `completed`** |
| **Reglas Firestore** | Reglas estándar por UID | **Bloqueo estricto: `orders` create false; `products` write admin** |
| **Optimización Bundle** | Bundle monolítico de 977 kB | **Code splitting (`React.lazy` + `Suspense`): index a 62 kB** |
| **Pruebas Automatizadas** | 19 tests | **54 pruebas automatizadas (100% Passing en Vitest, 9 suites)** |

---

## 3. 📋 Matriz de Auditoría Forense: Consigna Henry M5 vs Estado Actual (HEN-01 al HEN-21)

| ID | Requisito de la Consigna | Prioridad | Evidencia en Código | Prueba Automatizada | Estado |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **HEN-01** | Stack moderno: React 18, TypeScript, Vite, Tailwind | P0 | `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js` | `npm run typecheck` (0 errores), `npm run build` | **PASS** |
| **HEN-02** | Screaming Architecture (Modular por dominio) | P1 | `src/components/`, `src/contexts/`, `src/pages/`, `src/services/`, `api/` | Inspección estructural de carpetas y capas | **PASS** |
| **HEN-03** | Autenticación real y persistente | P0 | `src/lib/firebase.ts`, `src/contexts/AuthContext.tsx`, `src/pages/LoginView.tsx` | `src/tests/integration.test.tsx` (Inicio honesto sin fake user) | **PASS** |
| **HEN-04** | Roles confiables (`customer` / `admin`) sin selector | P0 | `src/contexts/AuthContext.tsx` (`mapFirebaseUser`), `src/pages/LoginView.tsx` | `src/tests/ProtectedRoute.test.tsx` (Aislamiento por roles) | **PASS** |
| **HEN-05** | Rutas protegidas y guard de acceso | P0 | `src/App.tsx`, `src/components/ProtectedRoute.tsx`, `src/components/ForbiddenView.tsx` | `src/tests/ProtectedRoute.test.tsx` (3 tests pass) | **PASS** |
| **HEN-06** | Catálogo con filtros reactivos y búsqueda con debounce | P0 | `src/pages/CatalogView.tsx`, `src/hooks/useDebounce.ts` | `src/tests/useDebounce.test.ts` (3 tests pass) | **PASS** |
| **HEN-07** | Tarjetas de producto informativas y stock badge | P1 | `src/components/ProductCard.tsx` | `src/tests/ProductCard.test.tsx` (5 tests pass) | **PASS** |
| **HEN-08** | Modal de detalle de producto ampliado | P1 | `src/components/ProductDetailModal.tsx` | `src/tests/ProductCard.test.tsx` (onViewDetail trigger) | **PASS** |
| **HEN-09** | Carrito global con Context API + `useReducer` puro | P0 | `src/contexts/CartContext.tsx`, `src/contexts/cartReducer.ts` | `src/tests/cartReducer.test.ts` (8 tests pass) | **PASS** |
| **HEN-10** | Drawer lateral del carrito interactivo | P1 | `src/components/CartDrawer.tsx` | `src/tests/cartReducer.test.ts` (Validación de límites de stock) | **PASS** |
| **HEN-11** | Pasarela de checkout con validación de dirección | P0 | `src/pages/CheckoutModal.tsx`, `src/services/orderService.ts` | `src/tests/integration.test.tsx` (Flujo de checkout completo) | **PASS** |
| **HEN-12** | Historial de órdenes de compra del usuario | P0 | `src/pages/OrdersView.tsx`, `src/services/orderService.ts` | `src/tests/orderApi.test.ts` (Persistencia autoritativa) | **PASS** |
| **HEN-13** | Panel de administración CRUD de catálogo | P0 | `src/pages/AdminView.tsx`, `src/components/AdminProductModal.tsx` | `src/tests/ProtectedRoute.test.tsx` (Acceso exclusivo admin) | **PASS** |
| **HEN-14** | Subida de imágenes a AWS S3 Presigned POST | P0 | `api/s3-presign.ts`, `src/components/AdminProductModal.tsx` | `src/tests/s3Presign.test.ts` (7 tests pass) | **PASS** |
| **HEN-15** | Límites y validación de subida (5 MB y formato imagen) | P0 | `api/s3-presign.ts` (`content-length-range`, MIME allowlist) | `src/tests/s3Presign.test.ts` (Tests 413 y 415 pass) | **PASS** |
| **HEN-16** | Persistencia real en base de datos Firestore | P0 | `src/services/productService.ts`, `src/services/orderService.ts` | `src/tests/integration.test.tsx` | **PASS** |
| **HEN-17** | Reglas de seguridad estrictas en servidor | P0 | `firestore.rules` (allow create: if false en orders, write admin) | `src/tests/orderApi.test.ts`, `src/tests/reviewsApi.test.ts` | **PASS** |
| **HEN-18** | Suite de pruebas automatizadas (>15 tests) | P0 | `src/tests/*.test.ts(x)` (54 tests automatizados) | `npm test` (54 tests passed / 100% PASS) | **PASS** |
| **HEN-19** | **Extra Credit 1:** Analytics Dashboard en Admin | Extra | `src/pages/AdminView.tsx` (KPIs, facturación y top productos) | Verificado en panel administrativo | **PASS** |
| **HEN-20** | **Extra Credit 2:** Paginación dinámica en catálogo | Extra | `src/pages/CatalogView.tsx` (Paginador 6/12/24 con reseteo) | Verificado en catálogo | **PASS** |
| **HEN-21** | **Extra Credit 3:** Reseñas con Comprador Verificado | Extra | `api/reviews.ts`, `src/components/ProductDetailModal.tsx` | `src/tests/reviewsApi.test.ts` (5 tests pass) | **PASS** |

---

## 4. 🛡️ Resolución de Hallazgos Críticos de Seguridad Ofensiva (P0 y P1 - Primera y Segunda Ronda)

### P0.1 — Creación de Órdenes Segura en Backend e Inviolabilidad de Precios
- **Vulnerabilidad Auditada (Segunda Vuelta):** Aunque `OrderService` recalculaba precios, el Client SDK de Firestore permitía escrituras directas (`addDoc(collection(db, 'orders'))`) y las reglas de seguridad de Firestore permitían que un atacante enviara órdenes con precios adulterados o cantidades manipuladas evadiendo el frontend.
- **Solución Definitiva:**
  1. Se creó el endpoint serverless dedicado [`api/orders.ts`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/api/orders.ts) (`POST /api/orders`).
  2. El endpoint extrae la identidad del usuario (`uid`, `email`) **exclusivamente del JWT verificado con RS256**. Se ignoran `userId`, `userEmail`, `unitPrice` y `totalPrice` enviados en el body.
  3. Los precios unitarios se consultan del catálogo autoritativo de la base de datos (`api/lib/serverStore.ts`).
  4. En [`firestore.rules`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/firestore.rules), se revocó completamente la creación directa por clientes:
     ```javascript
     match /orders/{orderId} {
       // PROHIBIDO CREAR ÓRDENES DIRECTAMENTE DESDE EL CLIENT SDK
       allow create: if false;
       allow read: if isAuthenticated() && (isOwner(resource.data.userId) || isAdmin());
       allow update: if isAdmin() && 
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt']) &&
         request.resource.data.status in ['pending', 'processing', 'completed', 'cancelled'];
       allow delete: if false;
     }
     ```
  5. Probado exhaustivamente en `src/tests/orderApi.test.ts` (7 tests).

---

### P0.2 — Blindaje del Comprador Verificado contra Spoofing de Reseñas
- **Vulnerabilidad Auditada (Segunda Vuelta):** Las reglas de Firestore permitían actualizar el campo `reviews` de un producto a usuarios autenticados. Un usuario con DevTools podía enviar `{ isVerifiedBuyer: true }` sin haber comprado nunca el artículo.
- **Solución Definitiva:**
  1. Se creó el endpoint serverless dedicado [`api/reviews.ts`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/api/reviews.ts) (`POST /api/reviews`).
  2. El backend ignora cualquier flag `isVerifiedBuyer` recibido del cliente.
  3. El backend consulta el historial de órdenes del usuario autenticado y verifica de manera estricta que exista al menos una orden con `status === 'completed'` que contenga el producto evaluado.
  4. En `firestore.rules`, se bloqueó la mutación directa de productos por parte de usuarios comunes:
     ```javascript
     match /products/{productId} {
       allow read: if true;
       allow write: if isAdmin(); // Clientes no pueden mutar productos ni reseñas directamente
     }
     ```
  5. Probado exhaustivamente en `src/tests/reviewsApi.test.ts` (5 tests).

---

### P1.3 — Verificación Criptográfica JWT RS256 Zero-Bypass
- **Vulnerabilidad Auditada (Segunda Vuelta):** `api/lib/verifyAuth.ts` contenía una condición `process.env.VITEST` que decodificaba el token en Base64 sin comprobar la firma digital durante las pruebas unitarias.
- **Solución Definitiva:**
  1. Se erradicó por completo cualquier bypass condicional.
  2. En todas las ejecuciones (producción y testing), `jwtVerify` verifica matemáticamente la firma criptográfica asimétrica **RS256**, emisor, audiencia y expiración.
  3. Se diseñó la suite [`src/tests/jwtVerify.test.ts`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/tests/jwtVerify.test.ts) (10 tests) que genera pares de claves RSA reales de 2048 bits con `jose.generateKeyPair('RS256')`, validando firmas válidas, manipuladas, llaves no confiables, expiración, emisor y audiencia.

---

### P1.4 — Motor Transaccional de Stock con Rollback Atómico
- **Vulnerabilidad Auditada (Segunda Vuelta):** Si un pedido contenía múltiples productos y uno de los últimos fallaba por falta de existencias, los descuentos de inventario de los primeros productos quedaban huérfanos.
- **Solución Definitiva:**
  1. En `api/lib/serverStore.ts`, se implementó `reserveProductStock(productId, qty)` y `rollbackProductStock(reservedItems)`.
  2. Durante el procesamiento de la orden en `api/orders.ts`, si cualquier ítem falla la validación o excede el stock, se ejecuta de inmediato el rollback restaurando el inventario original de todos los ítems previos de la transacción.
  3. Verificado con la prueba `rolls back previously reserved items if a subsequent item fails in checkout transaction` en `src/tests/orderApi.test.ts`.

---

### P1.5 — Principio Fail-Closed Estricto en Carga de Imágenes
- **Vulnerabilidad Auditada (Segunda Vuelta):** Ante un fallo de red o rechazo de AWS S3 en `AdminProductModal.tsx`, existía un fallback que utilizaba `URL.createObjectURL(file)` y una URL simulada `mockS3Url`, simulando una subida exitosa.
- **Solución Definitiva:**
  1. Se eliminó cualquier generación de URLs simuladas o mocks en el componente.
  2. Ante cualquier fallo del endpoint de presign o del POST a S3, el componente detiene el flujo, limpia estados temporales y muestra un mensaje de alerta visual en rojo (`uploadError`).
  3. El producto nunca se guarda con URLs locales o simuladas.

---

### P1.6 — Optimización de Rendimiento y Code Splitting del Bundle
- **Problema de Arquitectura:** El bundle de producción generaba un archivo JavaScript monolítico de 977 kB.
- **Solución Definitiva:**
  1. Se implementó `React.lazy` y `<Suspense>` en `src/App.tsx` para cargar bajo demanda las páginas `LoginView`, `OrdersView` y `AdminView`.
  2. Se configuró `build.rollupOptions.output.manualChunks` en `vite.config.ts`, aislando los módulos pesados de terceros en chunks independientes: `vendor-react` (181 kB), `vendor-firebase` (718 kB) y `vendor-icons` (19 kB).
  3. El chunk principal de la aplicación (`index.js`) se redujo a **62.08 kB** (17.15 kB gzip), acelerando drásticamente el First Contentful Paint (FCP).

---

## 5. 🏛️ Arquitectura del Sistema y Screaming Architecture

```text
henry_proyecto_m5_ecommerce/
├── api/
│   ├── lib/
│   │   ├── serverStore.ts        # Motor de almacenamiento autoritativo y reserva atómica de stock
│   │   └── verifyAuth.ts         # Verificación criptográfica RS256 Zero-Bypass con Google JWKS (`jose`)
│   ├── orders.ts                 # Serverless Function: Creación autoritativa de órdenes y rollback
│   ├── reviews.ts                # Serverless Function: Auditoría de comprador verificado y ratings
│   └── s3-presign.ts             # Serverless Function: Presigned POST S3 con content-length-range
├── src/
│   ├── components/               # Bloques visuales desacoplados
│   │   ├── AdminProductModal.tsx # CRUD modal fail-closed para catálogo
│   │   ├── CartDrawer.tsx        # Drawer lateral del carrito accesible
│   │   ├── ForbiddenView.tsx     # Pantalla visual de rechazo 403
│   │   ├── LoginModal.tsx        # Modal de acceso seguro
│   │   ├── Navbar.tsx            # Barra de navegación reactiva
│   │   ├── ProductCard.tsx       # Tarjeta de producto con stock badges
│   │   ├── ProductDetailModal.tsx# Detalle ampliado y reviews
│   │   └── ProtectedRoute.tsx    # Guard RBAC con sanitización returnTo
│   ├── config/                   # Configuración centralizada y Design Tokens
│   │   ├── appConfig.ts          # Identidad corporativa y rutas
│   │   ├── authConfig.ts         # Cuentas demo académicas
│   │   ├── catalogConfig.ts      # Paginación y categorías
│   │   ├── designTokens.ts       # Tokens de espaciado, colores Aurora Obsidian y tipografía
│   │   ├── orderConfig.ts        # Ciclo de vida de pedidos
│   │   └── uploadConfig.ts       # Políticas de almacenamiento
│   ├── contexts/                 # Estado global predecible
│   │   ├── AuthContext.tsx       # Sesión y Custom Claims
│   │   ├── CartContext.tsx       # Context API
│   │   └── cartReducer.ts        # Reducer inmutable puro
│   ├── hooks/
│   │   └── useDebounce.ts        # Amortiguador temporal (300 ms)
│   ├── pages/                    # Vistas con carga perezosa (React.lazy)
│   │   ├── AdminView.tsx         # Dashboard administrativo y Analytics (Extra 1)
│   │   ├── CatalogView.tsx       # Catálogo con paginación reactiva (Extra 2)
│   │   ├── CheckoutModal.tsx     # Pasarela de compra
│   │   ├── LoginView.tsx         # Formulario de login editorial
│   │   └── OrdersView.tsx        # Historial de compras por usuario
│   ├── services/                 # Servicios cliente conectados a APIs autoritativas
│   │   ├── orderService.ts       # Conexión con POST /api/orders
│   │   └── productService.ts     # Conexión con POST /api/reviews
│   └── tests/                    # 54 pruebas automatizadas con Vitest (100% PASS)
│       ├── cartReducer.test.ts   # 8 tests
│       ├── integration.test.tsx  # 6 tests
│       ├── jwtVerify.test.ts     # 10 tests (Criptografía RS256 con pares de claves reales)
│       ├── orderApi.test.ts      # 7 tests (Integridad comercial, stock y rollback)
│       ├── ProductCard.test.tsx  # 5 tests
│       ├── ProtectedRoute.test.tsx# 3 tests
│       ├── reviewsApi.test.ts    # 5 tests (Comprador verificado contra historial)
│       ├── s3Presign.test.ts     # 7 tests (Políticas AWS SigV4 y directivas de tamaño)
│       └── useDebounce.test.ts   # 3 tests
├── docs/                         # Documentación técnica modular por dominio
│   ├── AUTHENTICATION_RBAC.md
│   ├── AWS_STORAGE_SECURITY.md
│   ├── DESIGN_SYSTEM.md
│   ├── HENRY_TRACEABILITY.md
│   ├── ORDER_INTEGRITY.md
│   ├── QUALITY_GATES.md
│   ├── RELEASE_CHECKLIST.md
│   └── SECURITY_ARCHITECTURE.md
├── firestore.rules               # Reglas estrictas: orders create: false; products write: admin
├── vercel.json                   # Enrutamiento SPA y Serverless APIs
├── vite.config.ts                # Configuración de build con manualChunks
└── package.json
```

---

## 6. 🔒 Autenticación Real, RBAC por Custom Claims y Rediseño Editorial de Login

1. **Arranque Honesto:** `user = null`, `status = 'unauthenticated'` al iniciar la SPA.
2. **Custom Claims:** Los roles se leen exclusivamente del token (`tokenResult.claims.admin === true`).
3. **Erradicación de Passwords:** `LoginView.tsx` y `LoginModal.tsx` no contienen contraseñas en código fuente. Los botones de demo académica solo autocompletan el email.
4. **Protección `<ProtectedRoute>`:** Intercepta la navegación antes de montar vistas protegidas, sanitiza el parámetro `returnTo` para evitar Open Redirects y presenta `ForbiddenView` si un cliente intenta ingresar a `/admin`.

---

## 7. ☁️ Carga Segura con AWS S3 Presigned POST y Verificación Criptográfica Google JWKS RS256 Zero-Bypass

1. **Presigned POST Multipart con AWS SigV4:**
   - La API `/api/s3-presign` utiliza `createPresignedPost` de `@aws-sdk/s3-presigned-post`.
   - Impone la directiva obligatoria `['content-length-range', 1, 5242880]`.
   - Amazon S3 rechaza en su infraestructura cualquier subida que supere los 5 MB.
2. **Verificación Zero-Bypass RS256:**
   - Se conecta al endpoint JWKS oficial de Google.
   - Comprueba firma, expiración, emisor y audiencia en cualquier entorno.
3. **MIME Type Allowlist:**
   - Restricción estricta a `image/jpeg`, `image/png`, `image/webp`. Cualquier otro formato responde `415 Unsupported Media Type`.
4. **Fail-Closed:**
   - Si faltan credenciales AWS en el servidor, devuelve `503 Service Unavailable`.
   - Si la subida falla en el frontend, se cancela y alerta en rojo, sin simular cargas locales falsas.

---

## 8. 💰 Integridad Comercial Backend, Transacciones con Rollback y Reglas Firestore Blindadas

1. **Endpoint `POST /api/orders`:**
   - Requiere autenticación Bearer Token con RS256.
   - Extrae el UID del claim `sub`.
   - Consulta el catálogo de la base de datos para obtener precios unitarios oficiales.
   - Valida existencias y ejecuta reserva atómica de stock.
   - Ante cualquier falla en ítems posteriores, activa el rollback inmediato restaurando el inventario.
2. **Endpoint `POST /api/reviews`:**
   - Valida el rango de calificación (1 a 5).
   - Audita órdenes completadas del usuario para otorgar de manera autoritativa `isVerifiedBuyer: true`.
3. **Reglas de Seguridad Definitivas (`firestore.rules`):**
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
        request.auth.token.role == 'admin'
      );
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow create: if isOwner(userId) &&
        request.resource.data.role == 'customer' &&
        request.resource.data.keys().hasOnly(['email', 'name', 'role', 'createdAt', 'updatedAt']);
      allow update: if (isOwner(userId) &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['name', 'updatedAt'])) || isAdmin();
      allow delete: if false;
    }

    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /orders/{orderId} {
      allow create: if false; // Solo el backend serverless crea órdenes
      allow read: if isAuthenticated() && (isOwner(resource.data.userId) || isAdmin());
      allow update: if isAdmin() &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt']) &&
        request.resource.data.status in ['pending', 'processing', 'completed', 'cancelled'];
      allow delete: if false;
    }
  }
}
```

---

## 9. ⚙️ Parametrización Centralizada, Design Tokens y Configuración Tipada

El sistema erradica números mágicos mediante módulos en `src/config/`:
- `appConfig.ts`: Rutas, locale `es-CO`, moneda `USD`.
- `catalogConfig.ts`: Paginación (6, 12, 24), delay debounce (300 ms), categorías.
- `authConfig.ts`: Cuentas demo académicas.
- `orderConfig.ts`: Estados oficiales de órdenes y transiciones.
- `uploadConfig.ts`: Lista blanca MIME y límite de 5 MB.
- `designTokens.ts`: Tokens del sistema de diseño Aurora Obsidian (colores, sombras, espaciado, radios).

---

## 10. 🌟 Los 3 Extra Credits Implementados (100% Operativos)

1. **Extra Credit 1: Dashboard de Analytics en Panel Administrador**
   - Métricas de ingresos totales (`Revenue`), ticket promedio (`AOV`), total de órdenes y stock valorizado.
   - Gráfico porcentual de facturación por categoría.
   - Ranking de productos estrella por unidades vendidas e importe generado.
2. **Extra Credit 2: Paginación Dinámica en Catálogo**
   - Selector configurable (6, 12 o 24 artículos).
   - Navegación paginada con retorno automático a la página 1 ante cambios de filtros o búsqueda con debounce.
3. **Extra Credit 3: Reviews con Comprador Verificado Real**
   - Calificación de 1 a 5 estrellas con recálculo dinámico de promedios.
   - Insignia de comprador verificado calculada en backend (`POST /api/reviews`) auditando compras previas en estado `completed`.

---

## 11. 🧪 Suite Integral de 54 Pruebas Automatizadas (100% PASS) en Vitest

```bash
$ npm run typecheck
> henry-m5-ecommerce-patagonix@1.0.0 typecheck
> tsc --noEmit
# 0 ERRORES DE TIPO

$ npm test
> henry-m5-ecommerce-patagonix@1.0.0 test
> vitest run

 ✓ src/tests/cartReducer.test.ts (8 tests)
 ✓ src/tests/orderApi.test.ts (7 tests)
 ✓ src/tests/jwtVerify.test.ts (10 tests)
 ✓ src/tests/s3Presign.test.ts (7 tests)
 ✓ src/tests/reviewsApi.test.ts (5 tests)
 ✓ src/tests/useDebounce.test.ts (3 tests)
 ✓ src/tests/integration.test.tsx (6 tests)
 ✓ src/tests/ProductCard.test.tsx (5 tests)
 ✓ src/tests/ProtectedRoute.test.tsx (3 tests)

 Test Files  9 passed (9)
      Tests  54 passed (54) — 100% PASS
   Duration  4.30s
```

### Desglose de Pruebas:
1. `cartReducer.test.ts` (8 tests): Mutaciones puras e inmutabilidad del carrito.
2. `jwtVerify.test.ts` (10 tests): Verificación criptográfica RS256 con claves RSA de 2048 bits generadas al vuelo.
3. `orderApi.test.ts` (7 tests): Recálculo autoritativo de precios en backend, validación de stock y reversión (rollback) atómica ante transacciones fallidas.
4. `reviewsApi.test.ts` (5 tests): Validación de notas (1-5), auditoría de compras previas `completed` y rechazo de spoofing.
5. `s3Presign.test.ts` (7 tests): Respuestas HTTP 405, 401, 403, 415, 413, 400 y 503 con tokens RS256.
6. `useDebounce.test.ts` (3 tests): Comportamiento amortiguador de búsqueda.
7. `integration.test.tsx` (6 tests): Flujo integral de checkout y ciclo de comprador verificado.
8. `ProductCard.test.tsx` (5 tests): Badges de stock, rating y eventos.
9. `ProtectedRoute.test.tsx` (3 tests): Guards de ruta por rol con sanitización de `returnTo`.

---

## 12. 🎨 Identidad Visual (Aurora Obsidian) y Evidencias Gráficas

El sistema implementa el lenguaje visual **Aurora Obsidian** con fondos oscuros profundos, bordes refinados y acentos lumínicos índigo. Evidencias visuales disponibles en [`docs/audits/screenshots/`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/docs/audits/screenshots/):
1. `01_catalog_view.png`: Catálogo, filtros reactivos y paginación.
2. `02_login_view_desktop.png`: Formulario editorial sin selectores de roles y sin contraseñas en código.
3. `03_login_view_mobile.png`: Experiencia adaptable mobile-first.
4. `04_protected_route_redirect_login.png`: Intercepción de guardias con redirección sanitizada.
5. `05_product_detail_modal.png`: Detalle de producto, feed de reseñas y distintivo de comprador verificado.

---

## 13. 🎤 Guion Estratégico y Respuestas a Preguntas Trampa para la Defensa Oral

### Estructura de Exposición (8 Minutos):
- **0:00 - 2:00 (Arquitectura y Estado Global):** Screaming architecture, Context API con `useReducer` inmutable, tipado estricto TypeScript.
- **2:00 - 4:00 (Autenticación y Seguridad RBAC):** Firebase Auth real, Custom Claims emitidos por servidor, `<ProtectedRoute>` con sanitización contra Open Redirects y pantalla 403 explicativa.
- **4:00 - 6:00 (AWS S3 Presigned POST y Zero-Bypass RS256):** Presigned POST con política criptográfica de 5 MB a nivel de bucket y verificación asimétrica RS256 contra el JWKS oficial de Google sin excepciones de test.
- **6:00 - 8:00 (Integridad Comercial y Extra Credits):** Endpoints autoritativos `POST /api/orders` y `POST /api/reviews`, reversión transaccional de stock con rollback, reglas Firestore bloqueando escrituras directas de órdenes a clientes, y los 3 Extra Credits operativos.

### Banco de Preguntas Trampa:
- **P1: "¿Cómo evitan que un atacante cree una orden con precio de $0.01 directamente en Firestore?"**
  > *"Las reglas de Firestore tienen `allow create: if false;` en la colección `/orders`. Ningún cliente puede escribir órdenes directamente. Toda orden debe pasar por `POST /api/orders`, donde el backend autentica al usuario con RS256, consulta el catálogo oficial, computa el total autoritativamente y descuenta stock con rollback si la transacción falla."*
- **P2: "¿Cómo evitan que un usuario falsifique la insignia de Comprador Verificado en una reseña?"**
  > *"En `firestore.rules`, la colección de productos está restringida a administradores (`allow write: if isAdmin();`). Las reseñas deben enviarse mediante `POST /api/reviews`. El servidor ignora cualquier flag del cliente y consulta directamente en la base de datos si el usuario posee órdenes con `status === 'completed'` que contengan ese artículo."*
- **P3: "¿Por qué el tamaño máximo de 5 MB de las imágenes no se valida solo en el frontend?"**
  > *"Porque cualquier validación en el cliente es eludible con cURL o scripts. Usamos AWS S3 Presigned POST (`createPresignedPost`) con la directiva criptográfica `['content-length-range', 1, 5242880]`. Es el propio socket de Amazon Web Services el que rechaza cualquier archivo mayor a 5 MB."*

---

## 14. 💻 Manual de Despliegue, Variables de Entorno Sanitizadas e Instrucciones

```bash
# 1. Clonar y posicionarse en la rama de hardening empresarial
git clone https://github.com/Stivenzbl/henry-m5-ecommerce.git
cd henry-m5-ecommerce
git checkout hardening/enterprise-security-core
npm install

# 2. Verificación de calidad completa
npm run typecheck   # 0 errores TypeScript
npm test            # 54 pruebas pasando (100% PASS)
npm run build       # Compilación de producción con chunks optimizados
```
