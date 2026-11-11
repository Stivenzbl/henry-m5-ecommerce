# 03 — Design system Patagonix Retail

## Dirección de arte

**Concepto:** tecnología accesible, comercio moderno y confianza. Conservar el ADN índigo/azul actual, reducir la saturación de gradientes y construir el acabado premium con tipografía, proporciones, fotografía y consistencia.

## Tokens iniciales propuestos

Estos valores son un punto de partida, no una instrucción para cambiar cada color existente de golpe. AGY debe contrastarlos con el UI actual y probar WCAG.

| Token | Valor inicial | Uso |
|---|---|---|
| `--color-brand-950` | `#111827` | Texto/zonas oscuras principales |
| `--color-brand-800` | `#1E293B` | Navegación y títulos oscuros |
| `--color-primary-700` | `#4338CA` | Acción principal hover |
| `--color-primary-600` | `#4F46E5` | Botón/links principales |
| `--color-primary-100` | `#E0E7FF` | Superficies activas suaves |
| `--color-accent` | `#06B6D4` | Acento secundario ocasional |
| `--color-surface` | `#FFFFFF` | Superficies de contenido |
| `--color-canvas` | `#F8FAFC` | Fondo general |
| `--color-border` | `#E2E8F0` | Bordes y divisores |
| `--color-text` | `#0F172A` | Texto principal |
| `--color-muted` | `#64748B` | Texto secundario, validar contraste |
| `--color-success` | `#15803D` | Éxito |
| `--color-warning` | `#B45309` | Advertencias |
| `--color-danger` | `#B91C1C` | Errores y acciones destructivas |

No uses el color como único canal de información. Verifica contraste de texto normal y grande con herramienta, no a ojo.

## Tipografía

- Preferir una familia sans-serif legible y consistente ya disponible; evaluar Inter/Geist solo si carga, licencia y rendimiento lo justifican.
- Escala sugerida: display 36–48 px desktop / 30–36 px móvil; H1 30–36; H2 24–30; H3 18–22; body 14–16; caption 12–13.
- Texto de producto y formularios nunca debe bajar de un tamaño que comprometa legibilidad.
- Pesos 400, 500, 600, 700; evitar demasiados pesos y fuentes externas.

## Espaciado y geometría

- Escala base de 4/8 px; secciones con 24–48 px según pantalla.
- Radios: 8 px controles compactos, 12 px tarjetas, 16–20 px paneles; evitar redondear todo a 3xl.
- Botones con altura cómoda; objetivo de interacción de 44 × 44 px cuando sea viable.
- Contenedor principal con ancho máximo coherente, márgenes laterales adaptables y grid consistente.
- Sombras suaves; jerarquía mediante superficie/borde antes que sombras pesadas.

## Componentes que deben compartir variantes

`Button`, `IconButton`, `Input`, `Select`, `Checkbox`, `Badge`, `Card`, `Modal/Dialog`, `Drawer`, `Toast/Alert`, `Skeleton`, `EmptyState`, `ErrorState`, `ProductCard`, `Price`, `Rating`, `StockIndicator`, `Pagination`, `DataTable`.

Cada componente debe definir:
- variantes: primary / secondary / ghost / danger según corresponda;
- estados: default / hover / focus-visible / active / disabled / loading;
- tamaños y uso responsive;
- semántica y accesibilidad;
- ejemplos y tests.

## Motion

- Transiciones funcionales breves (120–200 ms como referencia), sin animar dimensiones grandes continuamente.
- Mantener `prefers-reduced-motion`.
- Evitar `animate-pulse` en información que distraiga de forma persistente.
- No usar animación para ocultar latencia o simular actividad de servidor.

## Criterios de consistencia

- No mezclar iconos de diferentes estilos.
- No usar emojis como sustituto de iconos del producto.
- El precio mantiene formato y alineación en todas las tarjetas.
- Los badges no se multiplican sin significado.
- Los estados de foco son visibles.
- Las imágenes tienen ratios y tratamiento consistentes.
- El dark gradient actual del hero puede permanecer como acento, no como solución para cada sección.
