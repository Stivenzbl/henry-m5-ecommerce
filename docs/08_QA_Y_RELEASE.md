# 08 — QA, pruebas y despliegue

## Baseline obligatorio

Ejecutar desde la raíz y guardar logs sanitizados:

```bash
node --version
npm --version
git status --short
git branch --show-current
git rev-parse HEAD
npm ci
npm run typecheck
npm test
npm run build
```

Si un comando no existe o falla por configuración, registrar `BLOCKED` y causa; no inventar un resultado PASS. No modificar scripts solo para que el pipeline parezca verde.

## Pirámide de pruebas

### Unitarias

- reducer de carrito: agregar, duplicar producto, actualizar, límite stock, borrar, vaciar y estado inválido.
- moneda, redondeos, cantidades y totales.
- validadores de producto, dirección y review.
- transiciones de estado de pedido.

### Integración

- providers de auth demo y cart.
- repositorio demo y persistencia/versionado de localStorage.
- checkout demo y manejo de fallos.
- CRUD de catálogo.
- estados error/loading/empty.

### E2E con Playwright

- Cliente: entrada → catálogo → búsqueda → filtro → detalle → carrito → checkout demo → historial.
- Admin demo: entrada → panel → crear/editar/borrar producto → cambiar estado de pedido.
- Responsive en 320, 375, 768, 1024 y 1440 px.
- Teclado: tab, shift+tab, enter, espacio y escape.
- Persistencia, reload y datos corruptos.
- No ejecutar escrituras de prueba en producción.

### Seguridad (solo emulador/staging)

- Cliente no puede obtener permisos admin.
- Usuario A no lee pedidos de B.
- Cliente no puede actualizar total/estado/propietario.
- Precio alterado en request se recalcula/rechaza.
- Subida S3 sin token/admin falla; MIME y tamaño inválidos se rechazan.
- Token expirado, firma alterada y repetición de idempotency key se prueban.

## CI recomendada

En GitHub Actions: instalación reproducible (`npm ci`), typecheck, test, build y opcionalmente E2E en preview. No almacenar secretos en artifacts ni logs. Proteger `main` con checks requeridos.

## Política de release

1. Trabajar en rama `feat/patagonix-premium-experience` o subramas por fase.
2. Un checkpoint/commit por entregable coherente.
3. Crear preview de Vercel y ejecutar QA allí.
4. Revisar diff completo y dependencias/lockfile.
5. Solo publicar a producción con aprobación del propietario.
6. Conservar último deploy estable y documentar rollback.

## Reporte final de AGY

- Commit base y commit final.
- Archivos cambiados y motivo.
- Dependencias añadidas/eliminadas y por qué.
- Comandos ejecutados con resultado real.
- Tests añadidos y cobertura funcional.
- Screenshots responsive.
- Hallazgos de accesibilidad y rendimiento.
- Pendientes, riesgos y pasos manuales para el propietario.
