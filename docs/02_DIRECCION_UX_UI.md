# 02 — Dirección UX/UI y experiencia de compra

## Posicionamiento visual

Mantener el nombre **Patagonix Retail** y el identificador PX mientras se eleva el acabado: retail tecnológico contemporáneo, limpio, editorial y confiable. Evitar que parezca una plantilla genérica de dashboard o un landing lleno de gradientes.

## Principios

1. **Producto primero:** fotografía limpia, nombre legible, precio y disponibilidad visibles.
2. **Jerarquía clara:** una acción principal por bloque; secundarios discretos.
3. **Confianza sin exageración:** no inventar sellos, compras verificadas, envíos gratis ni pagos seguros.
4. **Pocos efectos, bien ejecutados:** microinteracciones sutiles, sin animaciones que retrasen la compra.
5. **Responsive real:** no basta con apilar columnas; revisar navegación, filtros, modales, tablas y CTA con pulgar.
6. **Feedback inmediato:** cualquier acción produce un cambio visible y accesible.

## Arquitectura de pantallas sugerida

### Navegación global

- Marca PX + Patagonix Retail.
- Catálogo como entrada principal.
- Mis pedidos solo cuando corresponda al modo/usuario.
- Acceso admin solo en modo demo o sesión autorizada.
- Carrito con cantidad y acceso claro.
- Móvil: menú compacto o navegación inferior/menú desplegable real; nunca ocultar las opciones sin reemplazo.
- Estados de foco, hover, activo, disabled y loading.

### Catálogo

- Hero breve con propuesta de valor verificable, no texto técnico como “persistencia cloud” si no existe.
- Categorías de acceso rápido con imagen/ilustración consistente.
- Barra de búsqueda con label accesible, botón limpiar y estado “buscando”.
- Filtros visibles y fáciles de resetear; en móvil, panel desplegable con resumen de filtros.
- Ordenamiento: recomendado, precio menor/mayor, nombre y disponibilidad, siempre que el dato exista.
- Resultado: “X productos”; chips de filtros activos; paginación que no pierda el contexto.
- Loading skeleton, empty state útil y error con reintentar.

### Tarjeta de producto

- Relación de aspecto estable y recorte uniforme sin deformar.
- Imagen con `alt` significativo, `width`/`height` o espacio reservado y fallback.
- Categoría discreta; rating solo si hay fuente válida; stock sin urgencia falsa.
- Nombre, precio con moneda explícita y disponibilidad.
- CTA “Agregar al carrito” separado de “Ver detalles”.
- Toda acción accesible por teclado; evitar un `div` genérico como único control clicable.

### Detalle de producto

- Galería o imagen principal clara.
- Título, categoría, precio, estado de stock y descripción.
- Especificaciones solo si existen datos.
- Cantidad y CTA principal.
- Reviews con promedio/total y fecha; distinguir datos semilla de reseñas reales.
- Modal con rol/label de diálogo, gestión de foco, escape para cerrar y devolución del foco; alternativa de ruta/página si el detalle crece.

### Carrito

- Drawer accesible o vista dedicada con opción clara de cierre.
- Miniatura, nombre, precio unitario, selector de cantidad, eliminar.
- Subtotal y resumen transparente; impuestos/envío se muestran solo cuando la regla esté definida.
- Persistencia demo explicada si aplica.
- Estado vacío con CTA al catálogo.

### Checkout

- En modo demo, encabezado y CTA deben decir “Pedido de demostración” / “Simular pedido”, no “Pagar” ni “pago seguro”.
- Eliminar la dirección ficticia precargada; usar campos vacíos y ejemplos no presentados como datos del cliente.
- Validación inline, errores específicos y resumen persistente.
- Pantalla final con número de pedido de demo y explicación del alcance.
- En producción, el importe y stock serán revalidados en servidor antes de crear la orden; integración de pago requiere proveedor elegido.

### Historial de pedidos

- Estado vacío informativo.
- Tarjetas/lista con ID, fecha, total, unidades y estado.
- Timeline con lenguaje claro; no mostrar `delivered` o `paid` salvo que la transición esté respaldada por datos reales.

### Panel admin

- Panel separado visualmente de la tienda, pero coherente con el design system.
- KPIs con período y definición; etiqueta “Datos de demostración” en modo demo.
- Filtros por estado/fecha y búsqueda; tablas responsivas.
- CRUD con validación, confirmación destructiva y feedback de éxito/error.
- Carga de imagen con preview, formato/tamaño, progreso y error real.
- No prometer analíticas en tiempo real si el backend no lo soporta.

## Breakpoints para auditoría

- 320 × 720: móvil compacto.
- 375 × 812: móvil común.
- 768 × 1024: tablet.
- 1024 × 768: laptop pequeña.
- 1440 × 900: desktop.

AGY debe revisar también zoom 200%, orientación horizontal y reducción de movimiento.

## Flujos críticos a recorrer

1. Entrar como cliente demo.
2. Buscar producto y limpiar búsqueda.
3. Filtrar categoría y ordenar.
4. Cambiar tamaño de página y navegar.
5. Abrir detalle y cerrar con teclado.
6. Agregar, aumentar, reducir y quitar productos.
7. Completar checkout de demostración.
8. Ver pedido en historial.
9. Cambiar a admin demo solo cuando `VITE_DEMO_MODE` esté habilitado.
10. Crear/editar/eliminar producto demo y cambiar estado de una orden demo.
11. Cerrar sesión y comprobar que la UI vuelve al estado no autenticado.
