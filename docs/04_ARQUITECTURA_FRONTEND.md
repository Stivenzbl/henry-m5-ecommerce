# 04 — Arquitectura Frontend

## Principio

Evolución incremental. Mantener React + TypeScript + Vite + Tailwind salvo evidencia técnica para cambiar. No introducir un framework nuevo para resolver problemas de componentes.

## Estructura objetivo orientativa

Ajustar a la estructura real del repo; no mover archivos masivamente solo para parecer “enterprise”.

```text
src/
  app/                 # composición, providers y navegación
  components/
    ui/                # primitives compartidos y accesibles
    layout/            # navbar, footer, shell
    catalog/           # product card, filters, grid
    cart/              # drawer, item, summary
    admin/             # tables, forms, dashboard
  features/
    auth/
    catalog/
    cart/
    checkout/
    orders/
    reviews/
    admin/
  services/            # interfaces/adapters de datos
  hooks/
  types/
  utils/               # currency, dates, validation
  styles/              # tokens/global styles
  tests/
```

No es obligatorio crear todas las carpetas si la base de código actual no lo necesita.

## Límites de responsabilidad

- Componentes visuales no conocen Firebase, S3 ni `localStorage` directamente.
- Las features llaman a servicios tipados mediante interfaces.
- Los servicios son responsables de parsear/validar respuestas y mapear DTOs.
- La UI no calcula autoridad comercial (precio final, impuestos, stock reservado).
- Los contextos globales se reservan para auth y carrito/sesión si realmente son globales.
- Estado de modal, tab y filtros permanece cerca de la pantalla.

## Adaptadores por entorno

Si el proyecto seguirá siendo demo, formalizar `DemoProductRepository`, `DemoOrderRepository` y `DemoAuthProvider`, con almacenamiento local validado y etiqueta visible.

Si pasa a producción, añadir repositorios reales (`FirestoreProductRepository`, `FirestoreOrderRepository`) y autenticación Firebase como otro adaptador, sin mezclar en el mismo método lógica mock y real.

Seleccionar modo por configuración explícita y fail-closed. Nunca inferir producción porque existe una variable o porque falla el backend.

## Estado y contratos

- TypeScript strict.
- Discriminated unions para loading/success/error cuando mejore claridad.
- Tipos de dominio separados de tipos de Firestore/API.
- Valores monetarios: definir `currency` y representación exacta. Preferir enteros en unidades menores (por ejemplo centavos) en el backend; evitar acumulaciones con float.
- Estados de orden definidos en un único enum/contrato y con transiciones permitidas.
- Fechas persistidas en formato normalizado; presentar según locale.

## Rendimiento React

- Medir antes de añadir `memo`, `useMemo` o `useCallback`.
- Evitar provider que rerenderice toda la aplicación si cambia un dato irrelevante.
- Cargar panel admin y módulos pesados de forma diferida si el bundle lo justifica.
- Listas grandes: paginación consultada en backend; no descargar todo para paginar en el navegador.
- No crear un componente genérico gigantesco ni un sistema de abstracciones prematuro.

## Navegación

La app actual orquesta vistas mediante estado local en `App.tsx`. Evaluar si merece la pena introducir router para rutas compartibles, refresco y navegación atrás/adelante. No añadirlo antes de enumerar requisitos y revisar tamaño del proyecto.

Si se adopta router, probar deep links en Vercel con rewrites; actualizar canonical/metadata por página cuando el SEO real lo requiera.

## Manejo de errores

Crear un contrato pequeño para errores de datos y acciones. Mostrar mensajes comprensibles con retry cuando proceda; registrar solo metadatos técnicos sin PII ni secretos.
