# 🧪 Puertas de Calidad Técnica y Testing Automatizado (Quality Gates)

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Framework:** Vitest + React Testing Library + JSDOM  
> **Fecha:** 12 de Noviembre de 2026 (Segunda Vuelta de Hardening)  

---

## 1. 📋 Implementado

1. **Pipeline de Tres Fases de Calidad:**
   - **Fase 1: Verificación de Tipos:** `npm run typecheck` (`tsc --noEmit`) en modo estricto.
   - **Fase 2: Ejecución de Pruebas Unitarias, de Integración y Criptográficas:** `npm test` (`vitest run`).
   - **Fase 3: Compilación y Chunk Splitting de Producción:** `npm run build` (`vite build`).

2. **Estructura de la Suite de 54 Pruebas Automatizadas (9 archivos):**
   - `src/tests/cartReducer.test.ts` (8 tests): Reducer inmutable del carrito y cálculo de totales.
   - `src/tests/jwtVerify.test.ts` (10 tests): Verificación matemática RS256 con pares de claves RSA reales de 2048 bits (cero bypass, expiración, tampering, claims).
   - `src/tests/orderApi.test.ts` (7 tests): Integridad del endpoint `/api/orders`, validación de cantidades, recálculo autoritativo de precios y rollback de stock atómico.
   - `src/tests/reviewsApi.test.ts` (5 tests): Integridad del endpoint `/api/reviews`, neutralización de spoofing de comprador verificado contra historial de órdenes completadas.
   - `src/tests/s3Presign.test.ts` (7 tests): Compuertas de seguridad del endpoint S3 (405, 401, 403, 415, 413, 400, 503 con tokens RS256).
   - `src/tests/useDebounce.test.ts` (3 tests): Amortiguador de búsqueda con temporizadores falsos.
   - `src/tests/integration.test.tsx` (6 tests): Flujo integral de checkout, neutralización de manipulación de precios, control de stock y ciclo de vida de comprador verificado.
   - `src/tests/ProductCard.test.tsx` (5 tests): Renderizado, badges de stock y eventos.
   - `src/tests/ProtectedRoute.test.tsx` (3 tests): Guardias de ruta por roles.

3. **Optimización de Rendimiento y Code Splitting:**
   - Vistas cargadas bajo demanda con `React.lazy` y `<Suspense>` (`OrdersView`, `LoginView`, `AdminView`).
   - Segmentación de chunks de terceros con Rollup (`vendor-react`, `vendor-firebase`, `vendor-icons`).
   - Reducción del bundle principal de 977 kB a tan solo **62 kB** (17 kB gzipped).

---

## 2. 🧪 Probado

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

$ npm run build
dist/index.html                            0.72 kB │ gzip:   0.38 kB
dist/assets/index-5jBeqwBc.css            42.80 kB │ gzip:   7.46 kB
dist/assets/OrdersView-BAytde3K.js         4.11 kB │ gzip:   1.49 kB
dist/assets/LoginView-DBihgwlE.js         12.68 kB │ gzip:   3.48 kB
dist/assets/vendor-icons-BFZGNXzF.js      19.79 kB │ gzip:   4.78 kB
dist/assets/AdminView-BYzG1TaA.js         25.27 kB │ gzip:   6.18 kB
dist/assets/index-BB6ewepM.js             62.08 kB │ gzip:  17.15 kB
dist/assets/vendor-react-Dr58VYPm.js     181.63 kB │ gzip:  59.86 kB
dist/assets/vendor-firebase-Blzb12hs.js  718.06 kB │ gzip: 181.47 kB
✓ built in 3.84s
```

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Generación de Reporte HTML de Cobertura:** Integrar `@vitest/coverage-v8` para emitir reportes porcentuales `lcov` en pipelines de CI.
2. **Pruebas End-to-End con Playwright:** Configurar suite E2E en Playwright ejecutando flujos completos con navegador visible (Chromium/Firefox/WebKit).

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Despliegues Automáticos de Vercel Git Hook:** El webhook de Vercel que activa la construcción tras cada push a GitHub se ejecuta en la nube de Vercel y depende de sus servidores de compilación.
