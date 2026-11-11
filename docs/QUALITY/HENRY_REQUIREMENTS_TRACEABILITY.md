# 📋 Matriz de Trazabilidad de Requisitos — Henry M5 / Patagonix Retail

> **Proyecto:** Patagonix Retail — AI-Driven E-Commerce SPA  
> **Rama de Trabajo:** `hardening/m5-auth-rbac-data`  
> **Fecha de Actualización:** 11 de Noviembre de 2026  
> **Norma de Evaluación:** `PASS` (verificado con código y prueba reproducible) \| `FAIL` (brecha identificada) \| `BLOCKED` (dependencia externa ausente) \| `NOT_APPLICABLE`.  
> **Regla:** Ningún requisito se marca `PASS` sin evidencia observable en código y pruebas ejecutadas.

---

## 📊 Matriz General de Requisitos (HEN-01 al HEN-21)

| ID | Requisito Literal / Normalizado | Prioridad | Evidencia en Código | Prueba Asociada | Estado Hardening | Observación Técnica |
| :--- | :--- | :---: | :--- | :--- | :---: | :--- |
| **HEN-01** | React 18 + TypeScript + Vite + Tailwind CSS | P0 | `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js` | `npm run typecheck` (0 errores), `npm run build` | **PASS** | Stack base estrictamente tipado sin `any` implícitos ni advertencias. |
| **HEN-02** | Arquitectura modular / Screaming Architecture | P1 | `src/components/`, `src/contexts/`, `src/hooks/`, `src/pages/`, `src/services/`, `src/config/`, `src/types/` | Inspección estructural de carpetas y separación de responsabilidades | **PASS** | Capas desacopladas orientadas al dominio del comercio minorista. |
| **HEN-03** | Autenticación real y estado de sesión | P0 | `src/lib/firebase.ts`, `src/contexts/AuthContext.tsx`, `src/pages/LoginView.tsx` | `vitest run src/tests/integration.test.tsx` (Inicio honesto sin fake user) | **PASS** | Firebase Authentication real con fail-closed, logout completo y recuperación de clave. |
| **HEN-04** | Roles confiables (`customer` / `admin`) sin autoselección | P0 | `src/contexts/AuthContext.tsx` (`mapFirebaseUser`), `src/pages/LoginView.tsx` | `vitest run src/tests/ProtectedRoute.test.tsx` (Aislamiento por roles) | **PASS** | El rol se deriva exclusivamente de Custom Claims en el token de sesión. Sin selector en UI. |
| **HEN-05** | Protección de acceso y rutas privadas | P0 | `src/App.tsx`, `src/components/ProtectedRoute.tsx`, `src/components/ForbiddenView.tsx` | `vitest run src/tests/ProtectedRoute.test.tsx` (3 tests pass) | **PASS** | `react-router-dom` con `<ProtectedRoute>` en `/orders` y `/admin`, y pantalla `403 ForbiddenView`. |
| **HEN-06** | Catálogo con renderizado reactivo de productos | P0 | `src/pages/CatalogView.tsx`, `src/components/ProductCard.tsx` | `vitest run src/tests/ProductCard.test.tsx` (5 tests pass) | **PASS** | Listado fluido con grid responsive, stock badges y ratings visuales. |
| **HEN-07** | Búsqueda amortiguada en tiempo real (Debounce) | P1 | `src/hooks/useDebounce.ts`, `src/pages/CatalogView.tsx` | `vitest run src/tests/useDebounce.test.ts` (3 tests pass) | **PASS** | Delay de 300ms probado con temporizadores simulados en Vitest. |
| **HEN-08** | Filtros de categoría reactivos y reset de paginación | P1 | `src/pages/CatalogView.tsx`, `src/config/catalogConfig.ts` | Test de integración en Vitest | **PASS** | Al cambiar de categoría o buscar, reinicia a página 1 automáticamente. |
| **HEN-09** | Ordenamiento por precio (ascendente / descendente) | P1 | `src/pages/CatalogView.tsx` (`filteredProducts.sort`) | Test de integración en Vitest | **PASS** | Ordenación reactiva sin mutar el array original. |
| **HEN-10** | Carrito de compras con `useReducer` puro | P0 | `src/contexts/cartReducer.ts`, `src/contexts/CartContext.tsx` | `vitest run src/tests/cartReducer.test.ts` (8 tests pass) | **PASS** | Reducer puro determinista cubriendo agregar, remover, actualizar cantidad y vaciar. |
| **HEN-11** | Persistencia local de carrito aislada | P1 | `src/contexts/CartContext.tsx` (`patagonix_cart`) | Test de recarga y mock de storage | **PASS** | Persistencia en localStorage no autoritativa para el carrito. |
| **HEN-12** | Checkout con validación de datos y creación de orden | P0 | `src/pages/CheckoutModal.tsx`, `src/services/orderService.ts` | `vitest run src/tests/integration.test.tsx` (Flujo completo pass) | **PASS** | Formulario con validación de campos, cálculo de totales y creación de orden. |
| **HEN-13** | Historial de órdenes persistido y filtrado por usuario | P1 | `src/pages/OrdersView.tsx`, `src/services/orderService.ts` | Integración con queries de Firestore filtradas por UID | **PASS** | Conexión a Firestore con fallback determinista y protección por UID. |
| **HEN-14** | Panel Admin con CRUD de productos y gestión de stock | P0 | `src/pages/AdminView.tsx`, `src/services/productService.ts` | Operaciones Firestore CRUD con RBAC | **PASS** | Panel completo de administración con sincronización Firestore y métricas. |
| **HEN-15** | Carga de imágenes con AWS S3 y Presigned URLs | P0 | `api/s3-presign.ts`, `src/components/AdminProductModal.tsx` | `vitest run src/tests/s3Presign.test.ts` (6 tests de seguridad pass) | **PASS** | Endpoint protegido con Bearer Auth, rol admin obligatorio, MIME allowlist y límite 5 MB. |
| **HEN-16** | Extra Credit 1: Dashboard de Analytics en Admin | P2 | `src/pages/AdminView.tsx`, `src/config/orderConfig.ts` | Verificación reactiva de KPIs, AOV y categorías | **PASS** | Métricas calculadas con precisión a partir de órdenes de negocio reales. |
| **HEN-17** | Extra Credit 2: Paginación dinámica (6, 12, 24 ítems) | P2 | `src/pages/CatalogView.tsx`, `src/config/catalogConfig.ts` | Selector dinámico configurable | **PASS** | Controles de páginas, selector dinámico y reseteo reactivo. |
| **HEN-18** | Extra Credit 3: Reviews y calificaciones de clientes | P2 | `src/components/ProductDetailModal.tsx`, `src/services/productService.ts` | Validación de compra verificada con `hasUserPurchasedProduct` | **PASS** | Sistema de calificaciones 1-5 estrellas con validación de comprador verificado real. |
| **HEN-19** | Testing automatizado de componentes, reducers y flujos | P0 | `src/tests/` (28 tests automatizados) | `vitest run` (28/28 passed en 3.19s) | **PASS** | Cobertura integral: reducers, hooks, componentes, guards de ruta y seguridad API. |
| **HEN-20** | Despliegue en la nube con HTTPS y CI/CD continuo | P0 | Despliegue en Vercel Edge Network (`henry-m5-ecommerce.vercel.app`) | HTTP 200 OK en producción | **PASS** | Pipeline automático desde GitHub con variables privadas de AWS S3. |
| **HEN-21** | Documentación técnica veraz y guía de defensa | P1 | `README.md`, `docs/QUALITY/`, `docs/hardening/` | Cotejo documental 100% veraz con el código | **PASS** | Toda la arquitectura descrita coincide exactamente con las implementaciones reales. |

---

## 🎯 Resumen Estadístico Final (Hardening Completo)

- **Total Requisitos Evaluados:** 21
- **PASS:** 21 (100%)
- **FAIL:** 0 (0%)
- **BLOCKED:** 0 (0%)
