# 07 — Rendimiento, accesibilidad y SEO

## Rendimiento

Medir baseline antes de optimizar. Objetivos “good” de Core Web Vitals en percentil 75: LCP ≤ 2.5 s, INP ≤ 200 ms y CLS ≤ 0.1. No declarar cumplimiento con una única medición sintética; separar Lighthouse de datos reales de campo.

Acciones:
- Imágenes en AVIF/WebP cuando convenga, `srcset`/`sizes`, compresión, dimensiones reservadas y fallback.
- Lazy load en imágenes fuera del primer viewport; no aplicar lazy a la imagen principal LCP si retrasa su carga.
- Skeletons con dimensiones estables para evitar CLS.
- Cargar panel admin/detalles de forma diferida si el análisis de bundle lo justifica.
- Evitar dependencias grandes por animaciones, iconos o componentes que el stack actual ya resuelve.
- Reducir filtros/ordenamientos costosos; virtualizar solo si el volumen real lo justifica.
- Revisar caché/CDN y headers con Vercel cuando haya assets y endpoints reales.

## Accesibilidad

Objetivo: WCAG 2.2 AA. Revisar:
- Navegación completa por teclado y foco visible.
- Orden de foco lógico, sin trampas; diálogos con nombre accesible, foco inicial, escape/cierre y retorno del foco.
- Labels asociados, instrucciones y mensajes de error anunciables.
- Contraste comprobado con herramienta; el color no debe ser el único indicador.
- Landmarks (`header`, `nav`, `main`, `footer`), jerarquía de headings y botones/enlaces semánticos.
- `alt` útil para imágenes significativas y `alt=""` para decorativas.
- Tabla/lista comprensible en móvil y lectores de pantalla.
- Respeto de `prefers-reduced-motion` y zoom 200%.
- Controles táctiles preferiblemente de 44 × 44 px. WCAG 2.2 AA incluye un mínimo de 24 × 24 CSS px para Target Size (Minimum), sujeto a excepciones.

Automatizar con axe cuando sea posible y completar con pruebas manuales. Un resultado axe sin errores no demuestra por sí solo conformidad total.

## SEO y metadatos

- Título de documento conciso y descripción real.
- Open Graph y favicon correctos para Patagonix.
- Idioma HTML coherente (`es` si todo el contenido está en español).
- URLs estables y canonical si se introduce navegación por rutas.
- `robots.txt` y sitemap solo si la estructura y el contenido indexable los justifican.
- Product structured data solo con precio, moneda, stock, nombre y review data reales/consistentes. No generar rich snippets con reseñas ficticias.
- No añadir claims “AI”, envío gratis, pagos seguros o disponibilidad instantánea si la función no está activa.

## Evidencia que debe adjuntar AGY

- Resultado Lighthouse móvil + desktop, fecha y commit.
- Core Web Vitals observados y método de medición.
- Capturas Playwright de pantallas clave y tamaños definidos.
- Resultado axe y checklist manual de teclado/zoom.
- Tamaño del bundle antes/después si se modificó.
