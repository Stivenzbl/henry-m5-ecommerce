# 📋 Auditoría Técnica Baseline — Patagonix Retail

> **Fecha:** 10 de Noviembre de 2026  
> **Workspace:** `C:\Users\stive\henry_proyecto_m5_ecommerce`  
> **Rama Git:** `main`  
> **Commit Base:** `3c2b34e` (Tagged: `backup-pre-upgrade-pack`)  
> **Commit en Producción:** `64a1979`  
> **URL Producción:** [https://henry-m5-ecommerce.vercel.app](https://henry-m5-ecommerce.vercel.app)  
> **Auditor:** Antigravity CLI Senior Engineering Team  

---

## 1. Verificación de Entorno y Comandos Base

| Comando | Resultado | Tiempo | Estado |
| :--- | :--- | :--- | :---: |
| `npm run typecheck` (`tsc --noEmit`) | 0 errores de tipado | 1.8s | ✅ PASS |
| `npm test` (`vitest run`) | 19 / 19 pruebas pasando (4 suites) | 3.71s | ✅ PASS |
| `npm run build` (`vite build`) | Compilación limpia: bundle JS 232.46 kB (gzip: 66.88 kB), CSS 30.76 kB (gzip: 5.84 kB) | 2.35s | ✅ PASS |

### Detalle de Pruebas Unitarias e Integración:
- `src/tests/cartReducer.test.ts` (8 tests) — Inmutabilidad, agregación, incremento, decremento, remoción y vaciado de carrito.
- `src/tests/useDebounce.test.ts` (3 tests) — Manejo de temporizadores y retardos con `renderHook`.
- `src/tests/ProductCard.test.tsx` (5 tests) — Renderizado condicional, badges, callbacks y botón de compra.
- `src/tests/integration.test.tsx` (3 tests) — Flujo integral de compra desde catálogo hasta checkout en `OrderService`.

---

## 2. Contraste: Documentación vs. Código Real

| Componente | Documentación Anterior | Implementación Real en Código | Veredicto |
| :--- | :--- | :--- | :---: |
| **Autenticación** | "Firebase Authentication con Custom Claims y roles server-side" | `AuthContext.tsx` con sesión en `localStorage` (`patagonix_user_session_v1`) y función `switchRole()` en cliente. | ⚠️ SIMULACIÓN DEMO |
| **Catálogo** | "Cloud Firestore NoSQL en tiempo real" | `productService.ts` con catálogo semilla (`INITIAL_PRODUCTS`) y persistencia en `localStorage` (`patagonix_products_v2`). | ⚠️ SIMULACIÓN DEMO |
| **Pedidos / Checkout** | "Almacenamiento transaccional en Firestore" | `orderService.ts` con persistencia en `localStorage` (`patagonix_orders_v1`) y latencia simulada con `setTimeout`. | ⚠️ SIMULACIÓN DEMO |
| **AWS S3** | "URLs prefirmadas AWS S3 con firma criptográfica SDK" | `api/s3-presign.ts` genera URL con parámetro simulado (`simulated-presigned-token`). Código AWS SDK comentado. | ⚠️ SIMULACIÓN DEMO |
| **Reglas Firestore** | "Reglas de seguridad RBAC estrictas en producción" | `firestore.rules` permite creación de `/users/{userId}` por el propietario sin restringir el campo `role: admin`. | 🔴 VULNERABILIDAD P0 |

---

## 3. Estado de la Web en Producción (Vercel)

- **URL:** [https://henry-m5-ecommerce.vercel.app](https://henry-m5-ecommerce.vercel.app)
- **Framework Preset:** Vite
- **Despliegue:** Activo y respondiendo HTTP 200.
- **Rendimiento:** Carga inicial rápida, sin dependencias pesadas en el bundle del cliente.
- **Limitación en Vivo:** La web actual proclama servicios en la nube en su footer ("Firebase Firestore + AWS S3 Presigned URLs") cuando opera como Single Page Application local. Debe ajustarse al estándar de **Demo Premium Honesta**.
