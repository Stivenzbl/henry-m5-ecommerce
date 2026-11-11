# 07 — Skills, MCPs y protocolo de trabajo para AGY

## Objetivo

Hacer que el agente trabaje como un pequeño equipo senior: auditor de arquitectura, especialista React/TypeScript, diseñador UX/UI, ingeniero Firebase/Security, QA y release engineer. Debe descubrir herramientas reales del entorno antes de usarlas.

## 1. Descubrimiento antes de instalar

Al iniciar:

1. Ejecutar el comando de ayuda/documentación que corresponda a la versión instalada de AntiGravity/AGY.
2. Enumerar skills disponibles, MCP servers y herramientas conectadas en el workspace.
3. Verificar versiones, estado de conexión y permisos disponibles.
4. Identificar skills aplicables a:
   - React 18 + TypeScript;
   - frontend architecture/refactoring;
   - UI/UX product design;
   - accessibility/WCAG;
   - Firebase Authentication/Firestore security rules;
   - AWS S3 presigned uploads;
   - Vitest/React Testing Library;
   - Playwright/browser verification;
   - Vercel deployment/CI.
5. Si existe un skill de “find/recommend skills”, usarlo para localizar los skills más específicos, pero validar que realmente estén instalados y leer sus instrucciones completas antes de invocarlos.
6. Usar MCPs relevantes solo si están conectados y su acceso es necesario. No instalar paquetes de skills/MCP desconocidos ni autorizar acciones externas sin confirmación.

**Prohibido:** inventar nombres de skills, MCPs, comandos o funciones; afirmar que un MCP se usó sin evidencia; instalar varias skills redundantes; delegar cambios destructivos sin revisión.

## 2. Principio de especialización

- **Auditoría:** entender el flujo actual antes de editar.
- **Arquitectura:** diseñar una solución mínima, coherente con el stack y la rúbrica.
- **Implementación:** cambios por fase con commits lógicos.
- **Seguridad:** revisar amenazas y probar denegaciones, no solo accesos exitosos.
- **UI/UX:** producir pantallas consistentes, no solo CSS nuevo.
- **QA:** ejecutar pruebas reales después de cada fase.
- **Documentación:** actualizar solo cuando las pruebas confirmen el comportamiento.

## 3. Ciclo obligatorio por fase

Para cada fase:

1. Leer los archivos involucrados y dependencias.
2. Crear un resumen de impacto y lista de archivos previstos.
3. Formular un plan pequeño y comprobable.
4. Implementar cambios completos, no pseudocódigo ni stubs.
5. Ejecutar los tests afectados.
6. Corregir regresiones antes de seguir.
7. Revisar el diff buscando credenciales, mocks, bypasses y código muerto.
8. Actualizar la matriz de trazabilidad y el reporte.
9. Registrar decisiones y limitaciones.

No pasar a la siguiente fase con tests fallidos sin documentar un bloqueo y una estrategia concreta.

## 4. Uso de MCPs con seguridad

- Browser MCP: abrir preview y comprobar flujos visuales y responsive; nunca exponer credenciales en capturas.
- GitHub MCP: inspeccionar ramas/commits y crear cambios solo en la rama de trabajo; no alterar release original ni cambiar settings sin autorización.
- Firebase tooling/MCP: usar proyecto emulator o staging; no aplicar rules/deploy a producción sin autorización.
- Vercel MCP: crear Preview Deployment si está autorizado; no promover a Production.
- AWS MCP: revisar configuración con mínimos permisos; no mostrar claves, no ampliar permisos IAM innecesariamente.
- Terminal: ejecutar comandos localmente y conservar salidas relevantes; no copiar `.env` ni JSON de service account al informe.

Si un MCP no existe, usar CLI/SDK oficial disponible localmente o declarar la limitación; no simular resultados.

## 5. Reglas para preservar el proyecto

- No reescribir toda la aplicación de una sola vez.
- No cambiar React/Vite/Tailwind por otro stack sin evidencia de que Henry lo permita.
- No incorporar un framework grande por estética.
- No introducir dependencias sin explicar su necesidad.
- No romper `useReducer` del carrito si ya satisface la consigna.
- No borrar extras funcionales para simplificar.
- Mantener la entrega original intacta; trabajar en una rama.
- No alterar la URL de producción hasta que la rama de hardening pase pruebas.
- No llenar el repo con documentación redundante: mantener una guía central y reportes actualizados.

## 6. Antialucinación y honestidad técnica

El agente no puede afirmar:

- “Firebase conectado” si los servicios no hacen llamadas Firebase.
- “Login seguro” si solo valida campos o usa `localStorage`.
- “Ruta protegida” si solo oculta una vista.
- “S3 real” si entrega `mode: demo` o una URL ficticia.
- “Comprador verificado” si no valida una orden.
- “19/19 tests” si no los ejecutó en esta revisión.
- “100% Henry” sin cotejar la consigna completa y producir evidencia.

## 7. Informe de fase

Al cerrar cada fase escribir:

- Qué se modificó.
- Por qué se modificó.
- Archivos afectados.
- Dependencias añadidas/retiradas.
- Pruebas ejecutadas y resultado exacto.
- Riesgos pendientes.
- Evidencia visual/funcional.
- Requisitos que pasan y los bloqueados.

## 8. Secuencia de trabajo recomendada

1. Auditoría y baseline.
2. Firebase Auth real y modelo de roles.
3. Guards y rutas.
4. Reglas y persistencia Firestore.
5. Endpoint S3 protegido.
6. UI/UX login y Navbar.
7. Tests unitarios, integración, reglas y E2E.
8. Responsive, accesibilidad y regresión completa.
9. Docs y matriz Henry.
10. Preview y release gate.
