# 10 — Skills y MCPs recomendados para AGY

## Regla

No instalar “todo”. Usa pocas herramientas bien elegidas, verifica compatibilidad con la versión instalada de Antigravity CLI, lee su documentación y concede el mínimo privilegio. Los skills de terceros son código/instrucciones no confiables hasta revisarlos.

## Skills externas: flujo de descubrimiento

Desde la raíz del repo:

```bash
npx skills find frontend-design
npx skills find react
npx skills find accessibility
npx skills find testing
npx skills find security
npx skills find firebase
```

Para cada candidato, antes de instalar:
1. Revisar publisher, repo fuente, actividad, licencia, archivos y `SKILL.md`.
2. Buscar comandos shell, peticiones de red, lectura de `.env`, acceso a carpetas fuera del workspace o instrucciones de ignorar reglas.
3. Confirmar que sirve para React 18 + TS + Vite + Tailwind actuales.
4. Instalar solo la skill necesaria, no un pack entero por comodidad.
5. Releer cambios en `.agents/`, validar y documentar el origen/versión.

### Shortlist priorizada

- **Frontend design:** buscar `frontend-design` en `anthropics/skills` y verificar que la skill concreta exista en la versión actual antes de instalarla. Úsala para dirección visual y composición, no para inventar funcionalidades ni cambiar todo el stack.
- **Google Developer Knowledge:** skill oficial `retrieving-developer-knowledge` de `google/skills`, útil para consultar documentación de Firebase/Google Cloud cuando esa integración se active. Instalación documentada por Google:

```bash
npx skills add google/skills --skill retrieving-developer-knowledge --agent=antigravity
```

- **Testing / TDD:** buscar skills de TDD y Playwright; elegir una que trabaje con Vitest/Testing Library y Playwright, y revisar si se solapa con las skills locales de este pack.
- **Arquitectura:** buscar `improve-codebase-architecture` o equivalente solo si la auditoría demuestra deuda real; no refactorizar por moda.

Las skills locales `.agents/skills/patagonix-*` ya contienen protocolos específicos del proyecto y deben usarse siempre para las fases correspondientes.

## MCPs: recomendación

### 1. Context7 — recomendado

Uso: consultar documentación actual y versionada de React, TypeScript, Vite, Tailwind, Firebase, AWS SDK y herramientas relacionadas. No confiar en memoria del modelo para APIs cambiantes.

Endpoint documentado: `https://mcp.context7.com/mcp`. Context7 también documenta `npx ctx7 setup`; escoger método compatible con Antigravity y completar OAuth si la versión instalada lo solicita.

### 2. Playwright MCP — recomendado

Uso: abrir el sitio local y la URL de Vercel, recorrer flujos, obtener snapshots accesibles, comprobar formularios y capturar pantallas responsive. Ejecutar primero en local/preview; producción solo lectura.

Configuración stdio de referencia para Antigravity, después de revisar la compatibilidad de Node.js (Playwright MCP requiere Node.js 20+ según su guía):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### 3. Vercel MCP — condicional y útil para deploys

Endpoint oficial: `https://mcp.vercel.com`, OAuth. Sirve para consultar proyectos, deployments y logs. Vercel publica una lista de clientes compatibles; Antigravity CLI puede no figurar con ese nombre. AGY debe verificar compatibilidad antes de intentar conectarlo. Si el cliente no está admitido, usar Vercel CLI y el dashboard de forma manual.

Comenzar en lectura. No autorizar deploy, rollback, cambios de entorno ni modificaciones de proyecto sin aprobación explícita.

### 4. Google Developer Knowledge — opcional

Si se decide activar Firebase/Google Cloud, evaluar el MCP oficial de Google Developer Knowledge y la skill `retrieving-developer-knowledge`. Su propósito es documentación oficial, no acceso libre a producción.

### No instalar todavía

- MCP que conecte directamente a Firestore de producción: no es necesario para pulir la demo y amplía el riesgo de modificar datos.
- MCP AWS con credenciales amplias: no se justifica mientras S3 siga como stub.
- MCP de pago/Stripe: no hay proveedor ni requisitos de cobro aprobados.
- GitHub MCP con permisos de escritura: opcional en otra fase; los cambios pueden hacerse con Git local y PR manual.

## Configuración Antigravity CLI

La documentación de Antigravity indica que las configuraciones MCP pueden ser globales (`~/.gemini/config/mcp_config.json`) o del workspace (`.agents/mcp_config.json`), y que los servidores remotos usan `serverUrl` en el esquema actual. Los servidores locales usan `command` y `args`.

Ejemplo ilustrativo de config de workspace; no copiar sin validar compatibilidad y consentimiento OAuth:

```json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp"
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "vercel": {
      "serverUrl": "https://mcp.vercel.com"
    }
  }
}
```

No se incluye el archivo activo `mcp_config.json` deliberadamente: AGY debe probar cada conexión y el propietario debe autorizar OAuth/permisos. No guardar tokens ni claves dentro del repositorio.

## Verificación

```text
/mcp
/mcp list
/skills list
```

Tras instalar skills nuevas en Antigravity CLI:

```text
/skills reload
```

AGY debe informar servidor, transporte, estado, autenticación requerida, permisos y prueba funcional. Si no conecta, documentar la limitación en vez de inventar herramientas.
