# 03 — Persistencia real, Firestore y seguridad S3

## 1. Alcance de la migración de datos

El README actual declara Firebase/Firestore, pero los servicios observados (`ProductService` y `OrderService`) usan `localStorage` y latencias artificiales. El objetivo es que la arquitectura que se documente sea la arquitectura que realmente corre.

### Colecciones sugeridas

**`users/{uid}`**

- `displayName`
- `email`
- `createdAt`
- `updatedAt`
- campos de perfil no sensibles

El permiso administrativo no debe depender de campos que el cliente pueda editar. Usar custom claim `admin` asignado desde Admin SDK.

**`products/{productId}`**

- `sku`, `title`, `description`, `category`
- `price`, `currency`
- `imageUrl`, `imageKey`
- `stock`, `active`
- `createdAt`, `updatedAt`, `createdBy`
- agregados de rating si se calculan de forma consistente

**`orders/{orderId}`**

- `userId`, `userEmail` (solo lo necesario)
- `items`: `productId`, snapshot de título, precio unitario validado y cantidad
- `subtotal`, `shipping`, `total`, `currency`
- `status`, `shippingAddress`, `createdAt`, `updatedAt`

**`products/{productId}/reviews/{reviewId}`** o colección raíz equivalente

- `userId`, `userName`, `rating`, `comment`, `createdAt`
- campo/verificación de compra derivado de un proceso confiable; jamás aceptar `verifiedPurchase: true` sin validación.

El agente debe adaptar el esquema a los tipos actuales y a la consigna oficial, no reemplazarlo a ciegas.

## 2. Sustitución de servicios

Refactorizar `ProductService` y `OrderService` para que los componentes no conozcan Firestore directamente.

Ejemplo de API de servicio (adaptar a convenciones existentes):

```ts
interface ProductRepository {
  getAll(filters?: ProductFilters): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(input: CreateProductInput, actor: AuthenticatedUser): Promise<Product>;
  update(id: string, input: UpdateProductInput, actor: AuthenticatedUser): Promise<Product>;
  delete(id: string, actor: AuthenticatedUser): Promise<void>;
}

interface OrderRepository {
  create(input: CreateOrderInput, actor: AuthenticatedUser): Promise<Order>;
  getMine(actor: AuthenticatedUser): Promise<Order[]>;
  getAll(actor: AuthenticatedUser): Promise<Order[]>;
  updateStatus(id: string, status: OrderStatus, actor: AuthenticatedUser): Promise<Order>;
}
```

- Usar `uid` del usuario autenticado; nunca confiar en `userId` del formulario para decidir propietario.
- El catálogo debe manejar estados `loading`, `error`, `empty`, `success`.
- Las órdenes del cliente deben consultarse por UID y las rules deben volver a comprobarlo.
- La vista Admin consulta métricas basadas en órdenes reales persistidas, no en contadores inventados ni en datos de localStorage.
- CRUD debe persistir y reflejarse en otra sesión/dispositivo al recargar (si la aplicación está conectada al mismo proyecto).
- `localStorage` puede persistir preferencias de UI o un carrito temporal aislado por UID; no puede ser la autoridad de productos, inventario, roles, reviews u órdenes.

## 3. Checkout e integridad de pedidos

- El cliente envía producto/variante y cantidad, no un total confiable.
- Releer o validar precio, existencia y estado `active` desde la fuente autorizada antes de crear el pedido.
- Evitar cantidades cero/negativas y productos duplicados inconsistentes.
- Aplicar la operación de forma atómica cuando cambie stock y se cree la orden; usar transacción Firestore o backend confiable según limitaciones del modelo.
- No marcar pedido como pagado si solo existe un checkout simulado. Etiquetar la pasarela como demo si no procesa un pago real.
- Definir transiciones de estado permitidas. Por ejemplo: `pending -> processing -> completed` y `pending/processing -> cancelled`, según las reglas de negocio. No permitir cualquier transición arbitraria desde la UI.
- Mantener un snapshot de precio/título para el historial, sin cambiar órdenes antiguas cuando el producto se edite.

## 4. Analytics

Calcular indicadores desde la colección de órdenes consultadas por admin:

- ingresos: solo estados que la definición de negocio considere facturados/completados;
- AOV: ingresos divididos por órdenes válidas con denominador mayor que cero;
- órdenes por estado;
- ventas por categoría a partir de snapshots de ítems;
- top productos por unidades e ingresos;
- inventario: suma de stock por producto activo y valor unitario definido.

Mostrar un estado vacío si no hay órdenes. No mostrar ingresos ficticios como si fueran reales. Definir el periodo temporal y moneda en la UI y en la configuración.

## 5. Endpoint `/api/s3-presign`

El endpoint actual acepta `POST` con `fileName` y `fileType`, no evidencia un chequeo `Authorization` y ofrece un fallback de URL simulada. El endpoint final debe cumplir todo lo siguiente:

1. Aceptar únicamente métodos permitidos; devolver `405` en otro método.
2. Responder `401` si falta bearer token o el ID token no es válido/está vencido/revocado.
3. Verificar token Firebase en servidor con Firebase Admin SDK (`verifyIdToken`; comprobar revocación cuando la configuración lo permita).
4. Responder `403` si el claim administrativo no es verdadero.
5. No confiar en `role`, `uid`, `isAdmin` o cualquier permiso procedente del body.
6. Validar `Content-Type` con allowlist (por ejemplo JPEG, PNG y WEBP) y tamaño máximo configurado.
7. Normalizar el nombre; generar una key no predecible, con UUID, bajo `products/`; no permitir path traversal ni prefijos arbitrarios.
8. Firmar con tipo de contenido exacto, expiración corta parametrizada (por ejemplo 180–300 segundos) y solo operación `PutObject` necesaria.
9. Configurar CORS para dominios permitidos (producción y localhost de desarrollo), no `*` por defecto cuando no sea necesario.
10. No escribir secretos ni tokens completos en logs.
11. Verificar que AWS env vars existan. Si faltan, responder `503` y mensaje de servicio no configurado; nunca devolver `200` con URL falsa en producción.
12. Responder con errores JSON uniformes y sin filtrar detalles internos.
13. El cliente debe manejar `401`, `403`, `413`, `415`, `429` y `5xx` con mensajes claros.
14. Después del PUT, comprobar respuesta HTTP y guardar `fileUrl`/`key` en el producto únicamente si el upload concluyó.

### Validación de archivo

- Tamaño máximo definido por `UPLOAD_MAX_BYTES`/config server-side; valor inicial sugerido 5 MB, sujeto al requisito real.
- Tipos permitidos: `image/jpeg`, `image/png`, `image/webp` salvo que la consigna pida otros.
- Rechazar SVG por defecto si no hay un proceso explícito de sanitización.
- Verificar extensión y MIME; no confiar exclusivamente en el nombre del archivo.
- No permitir que el cliente escoja bucket o región arbitrariamente.

### Acceso al bucket

- Nunca hacer público el bucket entero solo para mostrar fotos.
- Definir lectura pública solo si las imágenes de catálogo están diseñadas para ser públicas; restringir escritura a la URL prefirmada emitida por el backend.
- Revisar CORS S3 para el origen de Vercel y headers estrictamente requeridos.
- Usar IAM con privilegios mínimos y limitar al bucket/prefijo necesario.
- No exponer credenciales AWS al frontend ni al repositorio.

## 6. Reglas Firestore: criterios mínimos

- `isSignedIn()` exige `request.auth != null`.
- `isAdmin()` depende exclusivamente del custom claim fiable `request.auth.token.admin == true`.
- El cliente no puede asignarse `admin` en `users/{uid}`.
- Validar claves permitidas con `keys().hasOnly(...)` y tipos de campos.
- En órdenes comprobar `request.resource.data.userId == request.auth.uid` en creación y `resource.data.userId == request.auth.uid` en lectura.
- En updates del cliente impedir cambio de `userId`, monto, ítems y propietario; definir exactamente qué puede cambiar.
- Los admin pueden operar CRUD sobre productos y estados de órdenes, con transiciones controladas.
- Las reviews validan autor, rating, comment y compra verificada si el UI la etiqueta como tal.
- Agregar reglas `match` de denegación por defecto si corresponde a la estructura.
- No confiar en las reglas hasta probarlas con Emulator Suite.

## 7. Migración sin perder el proyecto actual

- Antes de migrar, revisar tipos y datos seed actuales.
- Mantener el seed inicial como script/fixture de demo; no duplicar automáticamente en cada carga.
- Crear un import idempotente para catálogo de demo si es necesario.
- No subir datos locales del navegador de usuarios sin una decisión explícita.
- Separar `demo`, `emulator` y `production` por configuración.
- Preparar rollback: conservar rama/tag del estado enviado y no borrar código anterior hasta que la nueva solución pase las pruebas.

## 8. Criterios de aceptación

- [ ] Productos se consultan desde Firestore.
- [ ] CRUD admin persiste en Firestore y se refleja al recargar/otra sesión.
- [ ] Orden cliente se guarda con UID auténtico.
- [ ] Un cliente no lee órdenes de otro cliente usando acceso directo.
- [ ] Un cliente no cambia estado, precio o stock mediante Firestore/API.
- [ ] Admin puede consultar y cambiar órdenes permitidas.
- [ ] Reviews persisten; “comprador verificado” está validado o retirado.
- [ ] Analytics se calculan desde datos persistidos y se explican sus fórmulas.
- [ ] S3 rechaza anónimo y customer (401/403 según estado).
- [ ] S3 acepta admin válido con archivo permitido.
- [ ] S3 rechaza MIME y tamaño fuera de política.
- [ ] S3 no devuelve URL demo en producción si falta configuración.
- [ ] AWS/Firebase secretos no aparecen en el bundle, logs o Git.
