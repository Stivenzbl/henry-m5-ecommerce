---
name: patagonix-audit
description: Audita Patagonix Retail en modo de solo lectura, confirma diferencias entre documentación, código y producción, y prioriza riesgos con evidencia.
---

# Patagonix Audit Skill

1. Leer `AGENTS.md` y `docs/00_DIAGNOSTICO_ESTADO_ACTUAL.md`.
2. Inspeccionar rama/commit/dependencias/servicios/entorno. No imprimir secretos.
3. Ejecutar baseline y navegador; producción solo lectura.
4. Identificar mocks, `localStorage`, APIs simuladas, claims cloud no demostrados y riesgo de permisos.
5. Registrar hallazgos con ruta, línea, prueba, severidad, impacto, solución y rollback.
6. No modificar código, instalar tooling ni ejecutar migraciones en modo auditoría.
7. Entregar informe con `PASS`, `FAIL`, `BLOCKED` y evidencia reproducible; no inferir PASS.
