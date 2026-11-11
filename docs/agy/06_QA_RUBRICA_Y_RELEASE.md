# 06 — QA, trazabilidad Henry M5 y release gate

## 1. Fuente de verdad

El agente debe localizar en el workspace la consigna oficial, rúbrica, instrucciones o PDF de Henry. Si no aparece, no inventar requisitos o ponderaciones. Usar los requisitos que el estudiante ha compartido como línea base y registrar como `SOURCE_NOT_PROVIDED` cualquier detalle que no pueda contrastarse con la consigna original.

Crear `docs/QUALITY/HENRY_REQUIREMENTS_TRACEABILITY.md` con una fila por cada requisito:

| ID | Requisito literal/normalizado | Prioridad | Evidencia código | Prueba | Estado | Observación |
|---|---|---|---|---|---|---|

Estados válidos: `PASS`, `FAIL`, `BLOCKED`, `NOT_APPLICABLE`. No permitir celdas vacías para requisitos evaluados. No usar porcentajes sin definir denominador.

## 2. Matriz funcional que debe auditarse

Basada en el resumen de consigna proporcionado por el estudiante; cotejar contra el PDF oficial si existe.

| ID | Funcionalidad | Criterio mínimo de aceptación |
|---|---|---|
| HEN-01 | React + TypeScript + Vite + Tailwind | Arranca, compila y usa tipos estrictos sin errores. |
| HEN-02 | Arquitectura modular/Screaming Architecture | Carpetas representan dominios/responsabilidades; UI, hooks, servicios, modelos y configuración separados con criterio. |
| HEN-03 | Autenticación | Identidad real, login/logout y estado de sesión consistente. |
| HEN-04 | Roles | `customer` y `admin` se determinan de forma confiable; no hay autoselección de admin. |
| HEN-05 | Protección de acceso | Rutas/vistas privadas y operaciones protegidas; cliente no puede ejecutar CRUD admin. |
| HEN-06 | Catálogo | Lista productos desde la fuente configurada, responde a filtros y muestra estados. |
| HEN-07 | Búsqueda | Debounce verificable; búsqueda y filtro no se pisan. |
| HEN-08 | Categorías | Filtrado correcto y reset de página cuando se altera la consulta. |
| HEN-09 | Ordenamiento | Precio ascendente/descendente (si así lo exige consigna), orden estable. |
| HEN-10 | Carrito | Estado global, `useReducer` puro, cantidades y subtotales consistentes. |
| HEN-11 | Persistencia de carrito | Rehidratación sin mezclar usuarios; limpiar/aislar al cerrar sesión. |
| HEN-12 | Checkout | Validaciones, dirección y creación de orden; declarar claramente si el pago es demo. |
| HEN-13 | Historial de órdenes | Cliente ve solo las suyas; admin ve las que la consigna autorice. |
| HEN-14 | Admin CRUD | Crear, editar, eliminar y modificar stock con persistencia real. |
| HEN-15 | Carga de imágenes S3 | URL prefirmada real, auth admin server-side, MIME/size/expiry/CORS correctos. |
| HEN-16 | Analytics | Revenue, AOV, órdenes y categorías con fórmulas definidas y datos verdaderos. |
| HEN-17 | Paginación extra | Opciones 6/12/24 si corresponden, navegación y reset de página. |
| HEN-18 | Reviews extra | Rating 1–5, comentario validado y comprador verificado real o insignia removida. |
| HEN-19 | Testing | Reducers, hooks, componentes, flujos, auth, reglas y API cubiertos por pruebas. |
| HEN-20 | Deploy | Build reproducible, HTTPS, preview validado, variables correctas. |
| HEN-21 | Documentación | README, guía de defensa, arquitectura y bitácora coinciden con el código que funciona. |

No declarar `PASS` por encontrar el nombre del archivo. Exigir comportamiento observado y una prueba que pueda volver a ejecutarse.

## 3. Suite de pruebas requerida

### Unitarias — Vitest

- `cartReducer`: cada acción, cantidad inválida, producto repetido, límites, mutación accidental.
- `useDebounce`: espera, cancelación y valor final.
- validadores de formulario y config.
- formato monetario, cálculos AOV/revenue y transiciones de orden.
- transformadores de Firestore a tipos de dominio.

### Componentes — React Testing Library

- Login con estados y errores.
- password visibility.
- Navbar para invitado/customer/admin.
- ProtectedRoute para loading, login y forbidden.
- ProductCard, ProductDetail, AdminProductModal, checkout y órdenes.

### Integración

- Login real con Firebase Emulator.
- perfil y claims hidratados.
- logout y persistencia.
- customer crea/lee su orden.
- customer no lee orden ajena ni muta stock/estados.
- admin CRUD productos.
- reseña no verificada y compra verificada.
- endpoint S3: sin token 401; token customer 403; admin válido firma; MIME inválido 415; método incorrecto 405; AWS config ausente 503.

### Firestore Rules

Usar Firebase Emulator Suite + `@firebase/rules-unit-testing`. No probar reglas solo con mocks del componente.

### E2E — Playwright recomendado

Si no existe E2E, valorar instalar Playwright como dev dependency:

1. visitante abre catálogo;
2. visitante entra a `/orders`, es enviado a login;
3. cliente demo inicia sesión de verdad y ve sus órdenes;
4. cliente prueba `/admin` y recibe 403;
5. admin demo inicia sesión y accede a `/admin`;
6. admin crea/edita/borra producto de prueba y stock;
7. admin sube imagen real a bucket de staging/demo;
8. cliente añade producto, checkout simulado crea orden, historial muestra la orden;
9. logout y recarga no conserva permisos;
10. flujo responsive en viewport móvil y desktop.

Nunca ejecutar tests destructivos contra datos de producción. Preparar proyecto Firebase/S3 de staging/emulator.

## 4. Accesibilidad y responsive

- Test de keyboard-only en login y modales.
- Foco visible y labels.
- Contraste AA.
- No overflow a 320/375/390/768/1024/1440 px.
- Componentes de navegación usables por touch.
- Reduced motion y escalado de texto.
- No superposición con barras móviles o contenido sticky.

## 5. Comandos mínimos de validación

Ejecutar los scripts existentes y documentar el resultado real:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Añadir scripts cuando sean necesarios y luego ejecutarlos, por ejemplo:

```bash
npm run test:rules
npm run test:e2e
npm run test:coverage
```

No fijar thresholds de coverage inventados antes de generar baseline; después establecer un mínimo razonable (objetivo inicial ≥80 % statements/branches en lógica crítica, y cobertura completa de los casos RBAC/seguridad). La cobertura agregada no sustituye las pruebas negativas de permisos.

## 6. Release gate

No desplegar ni publicar automáticamente durante la refactorización.

1. Crear rama `hardening/m5-auth-rbac-data` sin tocar el historial entregado.
2. Guardar el commit actual como punto de retorno.
3. Ejecutar pruebas en local/emulador.
4. Crear preview Vercel.
5. Ejecutar smoke tests contra preview con Firebase/S3 de staging.
6. Revisar variables y logs sin exponer secretos.
7. Actualizar docs y matriz de trazabilidad.
8. Solo entonces preparar merge/promoción a producción, sin hacerlo hasta autorización explícita del propietario.

## 7. Evidencias que AGY debe entregar

- `docs/QUALITY/HENRY_REQUIREMENTS_TRACEABILITY.md`
- `docs/QUALITY/AUTH_RBAC_TEST_MATRIX.md`
- `docs/QUALITY/SECURITY_CHECKLIST.md`
- `docs/QUALITY/RELEASE_REPORT.md`
- capturas de login desktop/móvil, cliente, acceso denegado y admin;
- logs reales de `typecheck`, unit tests, rules tests, E2E y build;
- lista de variables requeridas (nombres solamente, nunca valores);
- limitaciones `BLOCKED` que exijan configuración externa.

## 8. Definición de “terminado”

La fase se cierra solo cuando todos los P0 están `PASS`, todos los requisitos conocidos están trazados y pasan, ninguna prueba de seguridad está omitida, y cualquier bloqueo externo está identificado sin ocultarlo. No usar “100 %” si existe algún `FAIL` o `BLOCKED`.
