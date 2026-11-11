# 05 — Datos, catálogo, pedidos y estrategia backend

## Contrato de producto

Definir y validar al menos: `id`, `slug` opcional, `title`, `description`, `category`, `price`, `currency`, `stock`, `images`, `createdAt`, `updatedAt`, `active`. Ratings y reviews se mantienen como agregados derivados de reseñas válidas, no como valores libres editables por el cliente.

## Contrato de carrito

Cada línea contiene `productId`, `quantity` y datos mínimos de presentación. El precio persistido en carrito es una referencia visual, no el valor final de cobro. Antes de pedido real, consultar productos y precios actuales desde un servicio confiable.

## Contrato de pedido

Campos sugeridos: `id`, `userId`, `items[{productId, titleSnapshot, unitPriceMinor, quantity}]`, `currency`, `subtotal`, `tax`, `shipping`, `total`, `status`, `paymentStatus`, `shippingAddress`, `createdAt`, `updatedAt`, `idempotencyKey`.

- El navegador nunca decide `total` definitivo.
- El servidor valida cantidades, disponibilidad, precios y moneda.
- Los datos históricos del producto deben conservarse como snapshot para que un cambio de precio no altere una orden antigua.
- Definir las transiciones válidas; no saltar libremente de `pending` a `delivered`.
- No usar `completed`, `paid` o `delivered` hasta tener eventos/fuentes verificables.

## Camino demo

- Mantener productos/órdenes de muestra y localStorage, pero aislarlos detrás de repositorios demo.
- Mostrar una etiqueta persistente “Entorno de demostración”.
- Añadir un botón “Restablecer datos demo” protegido contra uso accidental.
- Validar y versionar el JSON guardado; recuperarse de datos corruptos sin bloquear toda la app.
- Etiquetar opiniones de muestra y métricas de demostración.
- No enviar emails, crear transacciones, llamar a AWS ni modificar Firestore.

## Camino producción real (no implementar sin aprobación)

### Firebase Auth

- Usar identidad Firebase real y restauración de sesión oficial.
- Claims privilegiados asignados desde backend/Admin SDK; nunca confiar en `localStorage` ni en `user.role` recibido del navegador.
- Los datos de perfil y claims se separan; claim solo para autorización.

### Firestore

- Colecciones y subcolecciones documentadas, índices versionados y reglas probadas con Emulator Suite.
- Usuarios solo editan campos de perfil permitidos; no pueden crear ni modificar `role`, `admin`, permisos o `uid`.
- Pedidos se crean desde backend o con reglas que validen los campos críticos, pero el precio final/stock se calcula de forma confiable.
- Inventario usa transacción/reserva para evitar overselling.
- Paginación en query y límites explícitos; evitar lecturas ilimitadas.

### Checkout y pago

- País, moneda, impuestos, envío, política de devolución y proveedor de pago son decisiones de negocio pendientes.
- Crear pedido idempotente y reservar stock desde el backend.
- No almacenar datos de tarjeta ni afirmar que hay pasarela real hasta integrarla y pasar pruebas.

### AWS S3

- Solo un backend autenticado genera presigned URL.
- El servidor genera el object key aleatorio; no confiar en path enviado por usuario.
- Validar usuario/admin, MIME permitido, extensión coherente y tamaño; el método de carga debe imponer límites también en servidor/policy, no solo con HTML.
- TTL corto, CORS limitado al origen, sin credenciales en bundle frontend.
- Bloquear escritura pública/listado del bucket. La lectura pública de imágenes de producto, si se necesita, se define de forma explícita y separada.
- Confirmar subida antes de guardar metadatos como imagen válida del producto.

## Métricas del admin

Definir cada KPI antes de graficar:
- Ingresos: solo órdenes/pagos que correspondan a la definición contable.
- AOV: ingresos reconocidos dividido por órdenes válidas pagadas/completadas según política.
- Pedidos pendientes y cancelados como métricas operativas, no revenue.
- Ventas por categoría según snapshot de línea y período definido.
- Inventario valorizado con coste o precio de venta explícitamente etiquetado.

No mezclar ingresos brutos, pedidos pendientes, pagos intentados ni datos de muestra en un mismo total.
