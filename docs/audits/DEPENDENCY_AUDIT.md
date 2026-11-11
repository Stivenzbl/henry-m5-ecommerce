# 📦 Auditoría de Dependencias y Stack — Patagonix Retail

> **Objetivo:** Auditar versiones, peso del bundle, compatibilidad y discrepancias entre lo documentado y lo instalado.

---

## 1. Inventario de Dependencias Actuales

### Dependencias de Producción (`dependencies`):
- `react`: `^18.3.1` (Estable, compatible con ecosistema actual)
- `react-dom`: `^18.3.1`
- `lucide-react`: `^1.16.0` (Iconos SVG optimizados, ligeros)

### Dependencias de Desarrollo (`devDependencies`):
- `@testing-library/react`: `^16.3.3`
- `@types/node`: `^22.10.1`
- `@types/react`: `^18.3.12`
- `@types/react-dom`: `^18.3.1`
- `@vitejs/plugin-react`: `^4.3.4`
- `autoprefixer`: `^10.4.20`
- `jsdom`: `^31.0.0`
- `postcss`: `^8.4.49`
- `tailwindcss`: `^3.4.16`
- `typescript`: `^5.7.2`
- `vite`: `^6.0.3`
- `vitest`: `^2.1.8`

---

## 2. Hallazgos y Análisis de Brechas

| Paquete Mencionada en Docs | ¿Presente en `package.json`? | Impacto Operativo | Recomendación |
| :--- | :---: | :--- | :--- |
| `firebase` (SDK) | ❌ NO | La aplicación no conecta directamente con Firebase Auth ni Firestore vía red; usa `localStorage`. | Mantener Camino A (Demo) sin añadir la librería pesada de Firebase (~400 kB) hasta que el usuario decida Camino B. |
| `@aws-sdk/client-s3` | ❌ NO | La función `/api/s3-presign.ts` no puede importar el cliente S3 en local sin el paquete. | Mantener desacoplado en demo; instalar condicionalmente si se activa AWS S3 real. |
| `@aws-sdk/s3-request-presigner`| ❌ NO | Necesario para generar firmas criptográficas reales. | Instalar en Fase P4 únicamente con credenciales válidas. |

---

## 3. Salud del Bundle y Rendimiento

- **Total JS Compilado:** `232.46 kB` (Comprimido gzip: `66.88 kB`)
- **Total CSS Compilado:** `30.76 kB` (Comprimido gzip: `5.84 kB`)
- **Tiempo de Build:** ~2.3 segundos
- **Veredicto:** El peso del bundle es excelente (<70 kB gzipped total), logrando tiempos de First Contentful Paint (FCP) y Largest Contentful Paint (LCP) óptimos que cumplen con los estándares de Core Web Vitals.
