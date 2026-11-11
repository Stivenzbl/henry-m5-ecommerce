# PATAGONIX RETAIL — Pack de hardening y cumplimiento Henry M5

**Propósito:** llevar el proyecto a un estado sólido, demostrable y profesional, con especial prioridad en un login auténtico, RBAC real, rutas protegidas, persistencia consistente y pruebas que demuestren el cumplimiento.

**Repositorio objetivo:** `Stivenzbl/henry-m5-ecommerce`  
**Aplicación:** `https://henry-m5-ecommerce.vercel.app`  
**Stack actual observado:** React 18, TypeScript, Vite, Tailwind, Vitest, AWS SDK y Vercel Functions.

## Orden de lectura y ejecución

1. `MASTER_PROMPT_AGY.md` — instrucción principal para el agente.
2. `01_AUDITORIA_BASELINE.md` — hechos observados y brechas, no supuestos.
3. `02_AUTH_RBAC_LOGIN.md` — autenticación, roles, rutas y sesión.
4. `03_FIREBASE_DATOS_Y_S3.md` — persistencia real, reglas, endpoint de imágenes.
5. `04_LOGIN_UX_UI.md` — experiencia visual y accesibilidad del acceso.
6. `05_PARAMETRIZACION.md` — configuración centralizada y límites de seguridad.
7. `06_QA_RUBRICA_Y_RELEASE.md` — matriz de aceptación, pruebas y publicación.
8. `07_SKILLS_MCPS_Y_METODO_AGY.md` — descubrimiento y uso responsable de skills/MCPs.

## Regla fundamental

No se considera terminado porque compile, porque exista un componente o porque el agente escriba “100%”. Cada requisito debe tener:

- implementación real;
- prueba reproducible;
- evidencia verificable;
- estado explícito: `PASS`, `FAIL`, `BLOCKED` o `NOT_APPLICABLE`.

No se promete una nota de Henry. El objetivo es demostrar con evidencia el cumplimiento de los requisitos conocidos y evitar afirmaciones que el repositorio no respalde.

## Decisión de arquitectura

El repositorio y su README afirman utilizar Firebase Authentication y Firestore, pero el código público inspeccionado no contiene el SDK ni la integración: los servicios de productos y órdenes usan `localStorage`. Por tanto, la ruta recomendada es **materializar Firebase Auth + Firestore** y mantener `localStorage` únicamente para estado local no autoritativo (por ejemplo, preferencias o un carrito temporal si la consigna lo permite).

Antes de activar la integración real, el agente debe comprobar si ya existe un proyecto Firebase configurado localmente (sin imprimir secretos). Si no existe, implementará la integración y el emulador, dejará la configuración documentada y señalará claramente que el despliegue real queda `BLOCKED` hasta que se configuren las variables y credenciales. No debe simular una conexión.

## Cómo usarlo

Copia estos archivos en la raíz del repositorio, por ejemplo en `docs/agy/`, o abre `MASTER_PROMPT_AGY.md` desde tu agente y pídele ejecutar las fases en orden. El agente debe modificar el proyecto real, no limitarse a producir otro informe.
