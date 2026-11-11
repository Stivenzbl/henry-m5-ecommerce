# 12 — Prompt maestro para ejecutar con AGY

Copia el siguiente bloque completo en Antigravity CLI desde la raíz de `henry-m5-ecommerce`.

---

## PROMPT

Actúa como un equipo senior de producto e ingeniería. Tu misión es llevar **Patagonix Retail** al siguiente nivel sin romper el proyecto ni inventar capacidades.

### Contexto

Lee `AGENTS.md` y todos los documentos de `docs/` de este pack. El documento maestro dice Firebase Auth/Firestore y AWS S3; sin embargo, en la rama pública `main` se han observado servicios basados en `localStorage`, un `AuthContext` de demostración, un `OrderService` local y un endpoint S3 simulado. Debes confirmar el estado actual de ESTE workspace, el commit desplegado y cualquier diferencia con esa auditoría.

### Fase 0 — SOLO LECTURA, sin excepciones

1. Comprueba `pwd`, estado Git, rama, HEAD, estructura, `package.json`, lockfile y scripts.
2. Lee los servicios, providers, pantallas, componentes, tests, `firestore.rules`, API, Vercel config y env example. No imprimas valores de secretos.
3. Ejecuta baseline: `npm ci`, `npm run typecheck`, `npm test`, `npm run build` (si el entorno lo permite). Registra salida.
4. Abre la URL local y `https://henry-m5-ecommerce.vercel.app` con Playwright MCP si está conectado; inspecciona 320, 375, 768, 1024 y 1440 px.
5. Traza flujos catálogo, detalle, carrito, checkout, pedidos y admin; mira consola y Network. En producción, solo lectura.
6. Comprueba si Firebase y AWS están realmente conectados; identifica mocks, fallbacks y código muerto.
7. Revisa riesgos de self-promotion en Firestore, rol demo, integridad de pedido y firma S3.
8. Genera `docs/audits/BASELINE.md`, `docs/audits/UX_AUDIT.md`, `docs/audits/SECURITY_AUDIT.md` y `docs/audits/DEPENDENCY_AUDIT.md`.
9. Entrega una matriz P0/P1/P2 con evidencia, archivos afectados, propuesta, riesgos, dependencias y rollback.

**No modifiques archivos, no instales skills/MCPs, no actualices dependencias, no cambies Firebase/AWS/Vercel, no hagas deploy y no escribas datos en producción durante la fase 0.**

### Puerta de decisión

Después de la auditoría, toma como objetivo por defecto una **demo premium honesta**. Conserva las simulaciones y hazlas transparentes. Prepara el diseño y arquitectura para producción, pero no actives Firebase real, AWS real, checkout real o proveedor de pagos sin autorización expresa y credenciales válidas.

### Fase 1 — Preparación de agentes y herramientas

1. Revisa `docs/10_SKILLS_Y_MCPS.md`.
2. Descubre skills con `npx skills find` y revisa fuentes antes de instalar.
3. Prioriza `frontend-design` y la skill oficial `retrieving-developer-knowledge` solo si aplica; no instales packs completos innecesarios.
4. Conecta Context7 y Playwright MCP; Vercel MCP solo si la versión/cliente es compatible y el propietario autoriza OAuth.
5. Verifica con `/skills list`, `/skills reload` y `/mcp list`.
6. No instales MCP de producción Firestore/AWS ni MCPs de escritura innecesarios.

### Fase 2 — Plan de implementación

Antes de editar, presenta un plan ejecutable por entregas E1–E5, incluyendo:
- objetivo medible;
- componentes/archivos exactos;
- cambios de datos y dependencias;
- riesgos y estrategia de rollback;
- tests que se añadirán;
- evidencias visuales a capturar.

### Fase 3 — Implementación incremental

Ejecuta una entrega a la vez:
1. P0: modo demo explícito, textos honestos, selector de rol aislado, stub S3 desconectado y reglas Firestore corregidas en caso de que Firebase esté/ vaya a estar activo.
2. Design system y navegación responsive.
3. Catálogo, filtros, producto y tarjetas accesibles.
4. Carrito, checkout demo, pedidos e historial coherentes.
5. Admin, analytics y feedback/error states.
6. QA, accesibilidad, rendimiento, docs y reporte.

No refactorices toda la aplicación en un solo paso. Preserva funcionalidades académicas obligatorias y explica cualquier cambio.

### Fase 4 — Verificación de cada entrega

Tras cada entrega ejecuta typecheck, tests y build. Corre E2E relevantes, revisa consola, prueba teclado, y compara screenshots. Si algo falla, arregla antes de continuar. Nunca marques PASS algo que no ejecutaste.

### Límites

- No usar datos reales ni hacer pruebas que escriban en producción.
- No desplegar producción ni modificar secretos.
- No cambiar precios, moneda, impuestos, logística ni pagos sin una decisión explícita.
- No añadir reviews falsas ni marcar compradores no verificados.
- No afirmar Firebase/S3/AI/pagos reales mientras no estén conectados y comprobados.
- No reemplazar stack o añadir librerías pesadas sin pruebas/argumento.
- No leer ni enviar el contenido de `.env` a ninguna herramienta externa.

### Resultado esperado

Quiero una tienda visualmente premium, coherente y responsive, con flujos sin errores, accesibilidad cuidada, rendimiento medido, arquitectura mantenible y documentación veraz. Entrega un reporte final con: cambios por fase, archivos modificados, dependencias, comandos/test ejecutados, capturas, métricas, riesgos restantes y pasos manuales. Si la auditoría detecta un bloqueo, no lo escondas: resuélvelo o déjalo claramente señalado.

---
