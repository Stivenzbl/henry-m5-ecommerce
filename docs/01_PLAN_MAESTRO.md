# 01 — Plan maestro de evolución de Patagonix Retail

## Objetivo

Convertir Patagonix Retail en una experiencia de comercio digital que se sienta profesional, rápida, confiable y diferenciada, sin sacrificar lo que ya funciona ni fingir funcionalidades que no existen.

## Estrategia de alcance

El código revisado indica que el estado actual es principalmente una demo con persistencia local y servicios simulados. Por ello, el plan se divide en dos caminos:

- **Camino A — Demo premium (alcance inicial recomendado):** conservar el stack, pulir producto/UX, mantener datos locales y checkout simulado, rotularlo honestamente, probarlo y dejarlo listo para demostración.
- **Camino B — Producción real (fase separada y opt-in):** implementar autenticación real, backend confiable, Firestore o alternativa, inventario transaccional, creación de pedidos segura, firma S3 real y proveedor de pagos elegido. No se activa hasta aprobación expresa.

No intentes hacer ambos caminos simultáneamente. Primero resuelve la discrepancia documentación/código.

## Prioridades

### P0 — Integridad antes que maquillaje

- Confirmar estado local, commit desplegado, dependencias, pruebas y configuración Vercel.
- Corregir textos que afirman persistencia cloud cuando hay `localStorage`.
- Añadir bandera de modo demo y restringir el cambio de rol a ese modo.
- Dejar el endpoint S3 desconectado en demo o implementar una firma real y autorizada; nunca conservar el token simulado como si fuera válido.
- Corregir y probar reglas Firestore antes de cualquier despliegue de reglas.
- Evitar que pedidos, reseñas, ventas y KPIs de muestra aparezcan como transacciones reales.

**Salida P0:** informe de auditoría, amenazas, decisión de alcance y tests base. No hacer rediseño hasta cerrar los bloqueantes de seguridad/veracidad.

### P1 — Nueva capa visual premium

- Definir tokens visuales, tipografía, escalas de espaciado, radios, sombras y estados.
- Rediseñar navbar/menú móvil, hero, filtros, tarjetas, producto, carrito y checkout.
- Estandarizar botones, campos, badges, modales, toast, skeletons y tablas.
- Crear estados loading/empty/error/success consistentes.
- Hacer responsive de 320 px hacia arriba y mantener una composición cuidada en desktop.

**Salida P1:** catálogo y compra simulada se ven cohesionados, funcionan con teclado y móvil y no tienen controles muertos.

### P2 — Conversión y experiencia de compra

- Buscar por nombre/descripción; filtros por categoría y rango de precio; orden por relevancia, precio y disponibilidad.
- Mantener búsqueda/filtros/paginación coherentes; indicar cantidad de resultados y chips de filtros activos.
- Mejorar vista de detalle: galería, descripción, especificaciones, stock, precio, promedio y reseñas.
- Carrito con cantidades, eliminación, subtotal, gastos/impuestos claramente identificados y persistencia.
- Checkout demo con formulario validado y confirmación claramente simulada.
- Historial de pedidos demo con timeline, estados y estados vacíos.
- Admin con tabs comprensibles, filtros y confirmaciones; métricas identificadas como datos de demo.

**Salida P2:** todos los flujos principales se recorren de inicio a fin sin errores y con feedback.

### P3 — Calidad técnica

- Refactor modular incremental con servicios/repositorios, componentes UI reutilizables y tipos consistentes.
- Validación de datos en límites de entrada; manejo centralizado de errores.
- Tests unitarios, integración y E2E con Playwright.
- A11y con WCAG 2.2 AA como objetivo.
- Mejorar imágenes, chunking y Core Web Vitals.
- CI con typecheck, tests y build bloqueando merge cuando falla.

**Salida P3:** evidencia reproducible, matriz de navegadores/dispositivos y build estable.

### P4 — Producción real, solo con aprobación

1. Definir país/mercado, moneda, impuestos, envío, devoluciones, inventario, datos personales y proveedor de pago.
2. Integrar Firebase Auth o una solución aprobada; el rol admin se asigna solo desde servidor privilegiado.
3. Implementar catálogo y pedidos persistidos en Firestore con reglas estrictas y Firebase Emulator Suite.
4. Calcular precio/stock/impuestos/envío en servidor; crear orden idempotente y reservar inventario con transacción.
5. Implementar S3 con SDK real, token de Firebase verificado, admin claim, tipos y límites estrictos, nombres aleatorios y bucket protegido.
6. Incorporar proveedor de pago elegido. Nunca almacenar datos de tarjetas; no inventar pagos.
7. Migrar datos y secretos mediante procedimiento documentado, rollback y ambiente staging.

**Salida P4:** no se considera “producción” hasta pasar pruebas de seguridad, pagos, datos, observabilidad y despliegue.

## Secuencia de ejecución por entregas

| Entrega | Contenido | Puede continuar cuando |
|---|---|---|
| E0 | Baseline + inventario técnico + decision log | Hay evidencia, riesgos y modo objetivo definidos. |
| E1 | P0: demo truthfulness, auth demo aislada, endpoint S3 bloqueado o real | No existen claims cloud falsos ni rutas de privilegio inseguras activas. |
| E2 | Design system + header + responsive | Componentes comunes aprobados y comprobados en tamaños clave. |
| E3 | Catálogo + producto + carrito | Búsqueda, filtros, paginación, estados y carrito pasan pruebas. |
| E4 | Checkout demo + historial + admin | Flujo completo y métricas transparentes. |
| E5 | QA, accesibilidad, rendimiento, documentación | Todas las puertas de aceptación pasan. |
| E6 | Backend real opcional | Alcance, cuentas, costes y reglas de negocio aprobados. |

## Regla de oro

Una fase no se considera terminada porque AGY diga “listo”. Se considera terminada cuando hay código, comandos ejecutados, tests pasando, evidencia visual y criterios de aceptación cumplidos.
