# 💰 Integridad Comercial, Precios y Ciclo de Vida de Órdenes

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Servicios:** `api/orders.ts`, `api/reviews.ts`, `api/lib/serverStore.ts`, `src/services/orderService.ts`, `firestore.rules`  
> **Fecha:** 12 de Noviembre de 2026 (Segunda Vuelta de Hardening)  

---

## 1. 📋 Implementado

1. **Endpoint Backend Autoritativo (`POST /api/orders`):**
   - **Cero Confianza en el Cliente:** El backend ignora completamente `userId`, `userEmail`, `unitPrice` y `totalPrice` enviados por el cliente.
   - **Identidad Criptográfica:** El `userId` (`sub`) y `email` se extraen exclusivamente del JWT verificado con RS256.
   - **Catálogo Autoritativo:** Cada producto se consulta en el catálogo autoritativo del servidor. Precios manipulados son sobreescritos automáticamente con el precio oficial de la base de datos.
   - **Validación de Cantidad:** Exige números enteros estrictamente positivos (`quantity > 0` y `Number.isInteger(quantity)`).
   - **Reglas Firestore Blindadas (`firestore.rules`):**
     ```javascript
     match /orders/{orderId} {
       // PROHIBIDO CREAR ÓRDENES DIRECTAMENTE DESDE EL CLIENT SDK
       // Toda orden debe originarse en POST /api/orders
       allow create: if false;
       allow read: if isAuthenticated() && (isOwner(resource.data.userId) || isAdmin());
       allow update: if isAdmin() && 
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt']) &&
         request.resource.data.status in ['pending', 'processing', 'completed', 'cancelled'];
       allow delete: if false;
     }
     ```

2. **Motor Transaccional y Reserva Atómica de Stock con Rollback:**
   - La función `reserveProductStock(productId, quantity)` descuenta inventario atómicamente si hay stock suficiente.
   - Si cualquier ítem subsecuente falla (por ejemplo, producto sin stock o inexistente), se activa inmediatamente `rollbackProductStock(reservedItems)` restaurando el inventario original de todos los ítems previamente reservados.
   - La orden se inicializa forzosamente con `status: 'pending'`.

3. **Endpoint Autoritativo de Reseñas y Comprador Verificado (`POST /api/reviews`):**
   - **Cero Manipulación de Verificación:** El backend ignora cualquier flag `isVerifiedBuyer: true` enviado por el cliente.
   - **Auditoría de Compras Completadas:** Consulta en el almacenamiento del servidor si el `userId` autenticado posee órdenes con `status === 'completed'` que contengan el producto evaluado.
   - Si la orden está en `pending`, `processing` o `cancelled`, `isVerifiedBuyer` se fija en `false`. Solo si la orden está completada se otorga `isVerifiedBuyer: true`.
   - **Reglas de Productos Blindadas (`firestore.rules`):**
     ```javascript
     match /products/{productId} {
       allow read: if true;
       // Las mutaciones de productos, stock y reseñas están restringidas a Admin o Backend API
       allow write: if isAdmin();
     }
     ```

---

## 2. 🧪 Probado

1. **Suite de Integridad de Órdenes (`src/tests/orderApi.test.ts` - 7 tests):**
   - `rejects unauthenticated requests (HTTP 401)`: Solicitudes sin Bearer token son rechazadas.
   - `rejects empty order items (HTTP 400)`: Carritos vacíos son bloqueados.
   - `rejects invalid quantities (zero, negative, float) (HTTP 400)`: Cantidades `<= 0` o decimales son bloqueadas.
   - `rejects non-existent product in catalog (HTTP 400)`: Ítems no catalogados devuelven 400.
   - `rejects order when requested quantity exceeds available stock (HTTP 400)`: Sobredemanda rechazada.
   - `calculates authoritative total price and ignores client-forged prices`: Ataque de precio manipulado ($0.01) sobreescrito con precio de catálogo ($189.99 * 2 = $379.98) y status `pending`.
   - `rolls back previously reserved items if a subsequent item fails in checkout transaction`: Transacción fallida revierte automáticamente el stock de ítems previos.

2. **Suite de Reseñas y Comprador Verificado (`src/tests/reviewsApi.test.ts` - 5 tests):**
   - `rejects unauthenticated review submissions (HTTP 401)`.
   - `rejects invalid ratings out of range 1-5 (HTTP 400)`.
   - `denies verified buyer status even if client sends isVerifiedBuyer: true`: Intento de spoofing bloqueado (retorna `isVerifiedBuyer: false`).
   - `marks isVerifiedBuyer as false when user has orders in pending/processing status`.
   - `grants isVerifiedBuyer: true strictly when user has a completed order for the product`.

3. **Pruebas de Reducer y Frontend (`src/tests/cartReducer.test.ts`, `src/tests/integration.test.tsx`):**
   - Comprobación de estado local, persistencia y ciclo de vida.

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Webhook de Pasarela de Pagos Externa (Stripe / Mercado Pago):** Configurar webhooks serverless (`api/webhooks/stripe.ts`) con firma criptográfica HMAC SHA-256 para pasar automáticamente órdenes de `pending` a `completed` tras la captura de fondos.

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Captura Bancaria en Vivo:** La transición de `pending` a `completed` en este entorno académico/demo se efectúa mediante el panel de administración o llamadas autorizadas, al no contar con un adquirente financiero de producción con fondos reales.
