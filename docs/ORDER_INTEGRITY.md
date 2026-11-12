# 💰 Integridad Comercial, Precios y Ciclo de Vida de Órdenes

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Servicio:** `src/services/orderService.ts`  
> **Fecha:** 12 de Noviembre de 2026  

---

## 1. 📋 Implementado

1. **Recálculo Autoritativo de Precios y Subtotales:**
   - `OrderService.createOrder` desconfía de cualquier precio unitario, subtotal o `totalPrice` enviado desde el frontend.
   - Para cada producto del pedido, consulta `ProductService.getById(item.product.id)` para recuperar el registro oficial del catálogo.
   - Sustituye los datos del ítem con el precio oficial de la base de datos.
   - Calcula subtotales: `subtotal = authoritativePrice * quantity`.
   - Suma el total general con redondeo matemático a dos decimales (`Math.round(sum * 100) / 100`).

2. **Control Estricto de Inventario (Stock Validation):**
   - Comprueba que la cantidad solicitada sea un entero positivo mayor a cero.
   - Valida que `product.stock >= item.quantity`.
   - Si no hay suficiente inventario disponible, rechaza la transacción con un error explícito: *"Stock insuficiente para [producto]"*.

3. **Inmutabilidad y Estados Permitidos:**
   - Cada orden nueva se inicializa forzosamente con `status: 'pending'`.
   - El cliente no puede registrar órdenes en estados privilegiados como `completed` o `shipped`.
   - La transición de estados queda reservada a administradores mediante `OrderService.updateOrderStatus`.

4. **Ciclo de Vida del Comprador Verificado:**
   - `OrderService.hasUserPurchasedProduct(userId, productId)` exige de manera estricta que la orden posea `status === 'completed'`.
   - Órdenes en estado `pending`, `processing` o `cancelled` retornan `false`.

5. **Política Fail-Closed:**
   - Si Firebase está configurado en producción y Firestore rechaza la escritura de la orden, el sistema lanza una excepción y no crea órdenes fantasmas locales.
   - El fallback a `localStorage` queda relegado exclusivamente al desarrollo local offline cuando no se han inyectado variables de Firebase.

---

## 2. 🧪 Probado

1. **Pruebas de Integración (`src/tests/integration.test.tsx`):**
   - **Neutralización de Manipulación de Precios:** Se probó el envío de una orden con un precio manipulado de $0.01 y total de $0.02. El sistema sobreescribió los importes calculando el precio real del catálogo ($189.99 * 2 = $379.98).
   - **Rechazo por Producto Inexistente:** Se verificó que solicitar un producto inexistente lanza una excepción `Producto no existe en el catálogo`.
   - **Rechazo por Stock Insuficiente:** Se verificó que solicitar 9999 unidades de un artículo con stock 15 lanza una excepción `Stock insuficiente`.
   - **Ciclo de Vida de Comprador Verificado:**
     - Usuario sin compras ➔ `false`.
     - Orden en estado `pending` ➔ `false`.
     - Orden actualizada a `processing` ➔ `false`.
     - Orden actualizada a `completed` ➔ `true`.
     - Orden actualizada a `cancelled` ➔ `false`.

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Descuento Atómico de Stock con Transacciones Firestore:** Implementar `runTransaction()` en Firestore para decrementar el stock del catálogo en la misma operación atómica de creación de la orden.
2. **Integración con Pasarela de Pagos Real (Stripe / Mercado Pago):** Configurar webhooks serverless (`api/stripe-webhook.ts`) para transicionar el estado de la orden de `pending` a `completed` únicamente tras la confirmación de cobro del procesador bancario.

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Confirmación Bancaria Real:** En el entorno actual, la transición a `completed` es simulada por el panel administrativo o el flujo de pruebas, ya que no hay una cuenta de Stripe o Mercado Pago en vivo conectada con fondos reales.
