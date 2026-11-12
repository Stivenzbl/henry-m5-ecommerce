# 🚀 Checklist de Lanzamiento a Producción (Release Checklist)

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Plataforma de Despliegue:** Vercel Edge Network  
> **Fecha:** 12 de Noviembre de 2026 (Segunda Vuelta de Hardening)  

---

## 1. 📋 Implementado

1. **Gestión de Ramas de Despliegue:**
   - Rama `main`: resguarda la entrega oficial de Henry (commit `692f064`).
   - Rama `hardening/enterprise-security-core`: resguarda el endurecimiento de nivel empresarial con las 54 pruebas y correcciones completas P0/P1 de ambas rondas de auditoría.

2. **Variables de Entorno para Producción:**
   - Frontend (Vite): prefijo obligatorio `VITE_FIREBASE_*`.
   - Backend Serverless (Vercel): variables privadas de AWS S3 (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`) y Firebase Admin configuradas exclusivamente en Vercel Dashboard sin exponerse al cliente.

3. **Configuración de Rewrites en `vercel.json`:**
   - Enrutamiento SPA hacia `/index.html`.
   - Excepción para `/api/(.*)` preservando la ejecución de Serverless Functions (`api/s3-presign.ts`, `api/orders.ts`, `api/reviews.ts`).

4. **Code Splitting y Rendimiento Web:**
   - Lazy loading en rutas no primarias (`LoginView`, `OrdersView`, `AdminView`).
   - Bundle principal reducido de 977 kB a **62 kB** (17 kB gzipped).
   - Aislamiento de vendor chunks (`vendor-react`, `vendor-firebase`, `vendor-icons`).

---

## 2. 🧪 Probado

- [x] `npm run typecheck` ejecutado con código de salida `0` (0 errores de TypeScript en modo estricto).
- [x] `npm test` ejecutado con código de salida `0` (54 pruebas pasando al 100% en 9 archivos de test).
- [x] `npm run build` ejecutado con código de salida `0` (assets compilados con chunks optimizados en `dist/`).
- [x] Cero exposición de credenciales privadas de AWS o Firebase en archivos versionados.
- [x] Cero contraseñas de evaluación expuestas en componentes de interfaz.
- [x] Verificación criptográfica RS256 con 0 bypass probada con pares de claves RSA reales de 2048 bits.
- [x] `allow create: if false;` en `firestore.rules` validado; órdenes forzadas exclusivamente por `/api/orders`.
- [x] `allow write: if isAdmin();` en `firestore.rules` para productos; reseñas forzadas por `/api/reviews`.
- [x] Subida a S3 fail-closed sin fallback de simulación en `AdminProductModal.tsx`.

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Verificación de SHA en Panel de Vercel:**
   - Acceder a Vercel Dashboard > Project Settings > Git.
   - Si se desea que el dominio de producción `https://henry-m5-ecommerce.vercel.app` sirva la versión de hardening empresarial, cambiar la *Production Branch* de `main` a `hardening/enterprise-security-core` (o abrir un Pull Request para fusionar tras la evaluación de Henry).

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Panel de Vercel de la Cuenta de Stiven:** Desde el entorno local de línea de comandos sin token de Vercel CLI no es posible comprobar directamente qué commit específico tiene asignado el dominio público en los servidores de Vercel. Se requiere acceso con credenciales del usuario a `vercel.com`.
