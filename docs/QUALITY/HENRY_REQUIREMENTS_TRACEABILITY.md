# 📋 Matriz de Trazabilidad de Requisitos — Henry M5 / Patagonix Retail

> **Proyecto:** Patagonix Retail — AI-Driven E-Commerce SPA  
> **Rama de Trabajo:** `hardening/m5-auth-rbac-data`  
> **Fecha de Línea Base:** 11 de Noviembre de 2026  
> **Norma de Evaluación:** `PASS` (verificado con código y prueba reproducible) \| `FAIL` (brecha identificada) \| `BLOCKED` (dependencia externa ausente) \| `NOT_APPLICABLE`.  
> **Regla:** Ningún requisito se marca `PASS` sin evidencia observable en código y pruebas ejecutadas.

---

## 📊 Matriz General de Requisitos (HEN-01 al HEN-21)

| ID | Requisito Literal / Normalizado | Prioridad | Evidencia en Código | Prueba Asociada | Estado Línea Base | Observación Técnica |
| :--- | :--- | :---: | :--- | :--- | :---: | :--- |
| **HEN-01** | React 18 + TypeScript + Vite + Tailwind CSS | P0 | `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js` | `npm run typecheck` (0 errores), `npm run build` | **PASS** | Stack base estrictamente tipado sin `any` implícitos ni advertencias. |
| **HEN-02** | Arquitectura modular / Screaming Architecture | P1 | `src/components/`, `src/contexts/`, `src/hooks/`, `src/pages/`, `src/services/`, `src/types/` | Inspección estructural de carpetas y separación de responsabilidades | **PASS** | Capas desacopladas orientadas al dominio del comercio minorista. |
| **HEN-03** | Autenticación real y estado de sesión | P0 | `src/contexts/AuthContext.tsx`, `src/components/LoginModal.tsx` | Inspección de código: usa `loginAs(role)` y `localStorage` con sesión fija | **FAIL** | Sesión simulada y usuario ficticio `user-default-101` creado por defecto. Requiere Firebase Auth real. |
| **HEN-04** | Roles confiables (`customer` / `admin`) sin autoselección | P0 | `src/components/LoginModal.tsx` (selector `selectedRole`), `AuthContext.tsx` (`switchRole`) | Inspección de código: el cliente puede autoconcederse rol admin | **FAIL** | El rol debe provenir de token confiable / claims del servidor, no de un input del frontend. |
| **HEN-05** | Protección de acceso y rutas privadas | P0 | `src/App.tsx` (selector con `useState` y apertura de modal) | Intento de navegación directa: no hay Router ni guards reales | **FAIL** | No existe `ProtectedRoute` ni `react-router-dom`. La ruta `/admin` no está aislada a nivel de URL. |
| **HEN-06** | Catálogo con renderizado reactivo de productos | P0 | `src/pages/CatalogView.tsx`, `src/components/ProductCard.tsx` | `vitest run src/tests/ProductCard.test.tsx` (5 tests pass) | **PASS** | Listado fluido con grid responsive, stock badges y ratings visuales. |
| **HEN-07** | Búsqueda amortiguada en tiempo real (Debounce) | P1 | `src/hooks/useDebounce.ts`, `src/pages/CatalogView.tsx` | `vitest run src/tests/useDebounce.test.ts` (3 tests pass) | **PASS** | Delay de 300ms probado con temporizadores simulados en Vitest. |
| **HEN-08** | Filtros de categoría reactivos y reset de paginación | P1 | `src/pages/CatalogView.tsx` (`handleCategoryChange`) | Prueba manual y test de integración | **PASS** | Al cambiar de categoría o buscar, reinicia a página 1 automáticamente. |
| **HEN-09** | Ordenamiento por precio (ascendente / descendente) | P1 | `src/pages/CatalogView.tsx` (`filteredProducts.sort`) | Test de integración en Vitest | **PASS** | Ordenación reactiva sin mutar el array original. |
| **HEN-10** | Carrito de compras con `useReducer` puro | P0 | `src/contexts/cartReducer.ts`, `src/contexts/CartContext.tsx` | `vitest run src/tests/cartReducer.test.ts` (8 tests pass) | **PASS** | Reducer puro determinista cubriendo agregar, remover, actualizar cantidad y vaciar. |
| **HEN-11** | Persistencia local de carrito aislada | P1 | `src/contexts/CartContext.tsx` (`patagonix_cart`) | Test de recarga y mock de storage | **PASS** | Persistencia en localStorage no autoritativa para el carrito. |
| **HEN-12** | Checkout con validación de datos y creación de orden | P0 | `src/pages/CheckoutModal.tsx`, `src/services/orderService.ts` | `vitest run src/tests/integration.test.tsx` (Flujo completo pass) | **PASS** | Formulario con validación de campos, cálculo de totales y creación de orden. |
| **HEN-13** | Historial de órdenes persistido y filtrado por usuario | P1 | `src/pages/OrdersView.tsx`, `src/services/orderService.ts` | Inspección de persistencia: almacena en `localStorage` | **FAIL** | Las órdenes viven en el navegador local y no en base de datos central protegida. |
| **HEN-14** | Panel Admin con CRUD de productos y gestión de stock | P0 | `src/pages/AdminView.tsx`, `src/components/AdminProductModal.tsx` | Inspección de persistencia: muta `localStorage` | **FAIL** | Funcionalidad completa en UI, pero la persistencia no es centralizada ni remota. |
| **HEN-15** | Carga de imágenes con AWS S3 y Presigned URLs | P0 | `api/s3-presign.ts`, `src/components/AdminProductModal.tsx` | AWS SDK v3 operativo en Vercel, pero endpoint sin auth check | **FAIL** | Falta autenticación Bearer en `/api/s3-presign` para restringir emisión de URLs solo a administradores. |
| **HEN-16** | Extra Credit 1: Dashboard de Analytics en Admin | P2 | `src/pages/AdminView.tsx` (KPIs, AOV, ventas por categoría) | Verificación reactiva con órdenes en memoria | **PASS** | Métricas calculadas con precisión a partir de la colección de órdenes. |
| **HEN-17** | Extra Credit 2: Paginación dinámica (6, 12, 24 ítems) | P2 | `src/pages/CatalogView.tsx` (`itemsPerPage`, `currentPage`) | Prueba interactiva de catálogo | **PASS** | Selector dinámico con botones Anterior/Siguiente y páginas numéricas. |
| **HEN-18** | Extra Credit 3: Reviews y calificaciones de clientes | P2 | `src/components/ProductDetailModal.tsx`, `src/services/productService.ts` | Prueba de adición de reseñas y recálculo de promedio | **FAIL** | El sistema calcula ratings, pero la marca "Comprador verificado" no comprueba órdenes reales. |
| **HEN-19** | Testing automatizado de componentes, reducers y flujos | P0 | `src/tests/` (19 tests automatizados) | `vitest run` (19/19 passed en 5.84s) | **PASS** | Cobertura sólida actual; requiere ampliarse con tests de Auth, Guards y API. |
| **HEN-20** | Despliegue en la nube con HTTPS y CI/CD continuo | P0 | Despliegue en Vercel Edge Network (`henry-m5-ecommerce.vercel.app`) | HTTP 200 OK en producción | **PASS** | Pipeline automático desde GitHub con variables privadas de AWS S3. |
| **HEN-21** | Documentación técnica veraz y guía de defensa | P1 | `README.md`, `GUIA_DEFENSA_PROYECTO.md`, `docs/` | Cotejo documental vs código real | **FAIL** | El README afirma conexión activa a Firebase Auth + Firestore cuando los servicios usaban localStorage. |

---

## 🎯 Resumen Estadístico de Línea Base

- **Total Requisitos Evaluados:** 21
- **PASS:** 12 (57.1%)
- **FAIL (Brechas Técnicas Identificadas):** 9 (42.9%)
- **BLOCKED:** 0 (en línea base)

Las 9 brechas se agrupan en **3 núcleos de ingeniería**:
1. **Autenticación, RBAC y Rutas (HEN-03, HEN-04, HEN-05):** Reemplazar `loginAs` y sesión simulada por Firebase Auth real + Protected Routes con `react-router-dom`.
2. **Persistencia Central y Reglas (HEN-13, HEN-14, HEN-18, HEN-21):** Integrar Firestore con fallback seguro y emulador local; validar órdenes y compradores verificados.
3. **Seguridad en API Cloud (HEN-15):** Exigir token de autorización de administrador en `/api/s3-presign` con fail-closed.
