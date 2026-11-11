# PACK DE EVOLUCIÓN — PATAGONIX RETAIL

**Preparado para:** Stiven Zabala · Stivenzbl  
**Proyecto:** `henry-m5-ecommerce` · Patagonix Retail  
**Agente:** Antigravity CLI (`agy`)  
**Objetivo:** elevar el producto a una experiencia de e-commerce premium, coherente, accesible, rápida y técnicamente honesta.

## Qué contiene

- `AGENTS.md`: reglas persistentes para AGY en este proyecto.
- `docs/`: diagnóstico, plan por fases, diseño, arquitectura, seguridad, rendimiento, QA y prompt de ejecución.
- `.agents/skills/`: cuatro skills locales y específicas del proyecto para auditar, diseñar, revisar seguridad y validar entregas.
- `docs/10_SKILLS_Y_MCPS.md`: proceso para descubrir skills externas y conectar MCPs compatibles sin entregar permisos innecesarios.

## Cómo instalar el pack en el repositorio

1. Haz una copia o commit del estado actual del repositorio.
2. Descomprime este paquete en la raíz del proyecto `henry-m5-ecommerce`.
3. Integra `AGENTS.md`, `docs/` y `.agents/` con cuidado. Si ya existen, no sobrescribas archivos del proyecto: compara y fusiona las reglas.
4. Abre una terminal en la raíz real del repositorio y ejecuta `agy`.
5. Pídele a AGY que lea primero `AGENTS.md`, `docs/00_DIAGNOSTICO_ESTADO_ACTUAL.md`, `docs/01_PLAN_MAESTRO.md` y `docs/12_PROMPT_MAESTRO_AGY.md`.
6. Ejecuta `/skills reload` si acabas de añadir skills y luego `/skills list` para confirmar que las detectó. Usa `/mcp` y `/mcp list` para verificar servidores MCP.

## Primer mensaje recomendado para AGY

Abre `docs/12_PROMPT_MAESTRO_AGY.md` y copia el bloque completo. La primera orden es **auditoría de solo lectura**. AGY no debe editar, instalar, desplegar, migrar ni modificar datos hasta terminar el diagnóstico y mostrar un plan con evidencia.

## Decisión de producto incluida

El repositorio público inspeccionado muestra varias capas actualmente simuladas. Por eso, el alcance inicial recomendado es elevar una **demo e-commerce premium, estable y transparente** sin fingir pagos, autenticación ni persistencia cloud. La conversión a una tienda real es una fase separada que requiere aprobación expresa, credenciales, reglas de negocio y pruebas de seguridad.

## Restricciones esenciales

- No exponer, imprimir ni copiar secretos de `.env`, Firebase, AWS, Vercel o GitHub.
- No desplegar ni ejecutar escrituras sobre producción sin aprobación explícita.
- No instalar una skill o MCP solo por popularidad: inspeccionar fuente, instrucciones, permisos, compatibilidad y mantenimiento.
- No reemplazar React/Vite/Tailwind ni reescribir todo sin justificarlo con evidencia.
- No inventar pagos reales, reviews verificadas, ventas, clientes, stock ni integraciones cloud.
- Mantener cambios pequeños, reversibles y probados; trabajar en rama de mejora.

## Documentación oficial útil

- Antigravity customization discovery: https://antigravity.google/docs/customization-discovery?tab=cli
- Antigravity MCP CLI: https://www.antigravity.google/docs/cli/mcp/
- Skills CLI: https://www.skills.sh/docs/cli
- Playwright MCP: https://playwright.dev/docs/getting-started-mcp
- Context7: https://context7.com/docs/installation
- Firebase custom claims: https://firebase.google.com/docs/auth/admin/custom-claims
- WCAG 2.2: https://www.w3.org/TR/wcag/
- Core Web Vitals: https://web.dev/explore/learn-core-web-vitals
