# 00 — Diagnóstico del estado actual

**Fuentes revisadas:** documento maestro aportado por el propietario y archivos públicos de la rama `main` del repositorio `Stivenzbl/henry-m5-ecommerce`. La web de Vercel respondió como no accesible desde la herramienta de inspección usada en esta auditoría; por tanto, no se afirma haber validado visualmente su renderizado ni sus flujos en vivo. AGY debe ejecutar el navegador en la URL publicada y en local.

## 1. Contraste entre documentación y código

La documentación presenta React + TypeScript + Vite + Tailwind, Firebase Auth/Firestore, subida real con AWS S3 prefirmado y 19 pruebas. En el código público de `main` inspeccionado aparecen diferencias materiales:

| Área | Evidencia en `main` | Conclusión operativa |
|---|---|---|
| Dependencias | `package.json` contiene React 18.3.1, Vite 6.0.3, TypeScript 5.7.2, Tailwind 3.4.16 y Vitest 2.1.8; no declara `firebase`, `@aws-sdk/client-s3` ni `@aws-sdk/s3-request-presigner`. | El stack documentado no coincide plenamente con las dependencias actuales. Verificar lockfile, imports, Vercel y despliegue antes de instalar nada. |
| Autenticación | `src/contexts/AuthContext.tsx` restaura `patagonix_user_session_v1` desde `localStorage`, crea un usuario por defecto y expone `loginAs`/`switchRole`. | Es una sesión de demostración local, no Firebase Auth. Cambiar el rol en el navegador no autentica al usuario. |
| Rol admin | `src/components/Navbar.tsx` ofrece un conmutador Customer/Admin que llama a `switchRole`; `AuthContext.tsx` guarda el nuevo rol localmente. | El control debe existir únicamente en modo demo explícito; no es una barrera de seguridad. |
| Catálogo | `src/services/productService.ts` contiene `INITIAL_PRODUCTS` y guarda/lee `patagonix_products_v2` en `localStorage`. | No es catálogo cloud multiusuario. Las operaciones se limitan al navegador. |
| Pedidos | `src/services/orderService.ts` guarda `patagonix_orders_v1` en `localStorage` y simula latencia con `setTimeout`. | No es persistencia de Firestore ni sistema de órdenes compartido. |
| Checkout | `src/pages/CheckoutModal.tsx` dice “Simulación de Checkout”, usa dirección precargada `Av. Siempre Viva 742`, Santiago, Chile, y muestra un mensaje que asegura Firestore. | La interfaz contiene texto contradictorio con `OrderService`; corregir textos y defaults. No hay pasarela real demostrada. |
| AWS S3 | `api/s3-presign.ts` tiene el SDK comentado, genera `simulated-presigned-token` y usa valores fallback de bucket/región. | No genera una URL prefirmada criptográficamente válida. No debe presentarse como subida S3 activa. |
| Seguridad Firestore | `firestore.rules` deja `create` de `/users/{userId}` a cualquier usuario dueño del UID, sin limitar campos ni prohibir `role`; `isAdmin()` consulta el documento `users/{uid}` como alternativa al claim. | Si estas reglas se despliegan, un usuario podría crear su propio perfil con `role: 'admin'` y satisfacer el chequeo documental. Hallazgo P0 que debe probarse con Emulator y corregirse antes de habilitar Firestore. |
| Accesibilidad de tarjeta | `ProductCard.tsx` usa un `div` clicable para abrir detalle. | Falta semántica de control, navegación por teclado y comportamiento accesible equivalente. |
| Navegación móvil | `Navbar.tsx` oculta los links de navegación con `hidden sm:flex`; el fragmento inspeccionado no muestra un menú móvil alternativo. | Validar en 320–375 px y añadir navegación móvil funcional si no existe en otra capa. |
| Analíticas | `AdminView.tsx` calcula métricas a partir de `OrderService.getAllOrders()`; el total excluye cancelados, pero no distingue necesariamente pagos liquidados de pedidos pendientes/procesando. | En demo debe etiquetarse como dato simulado. En producción, definir revenue con base en pagos confirmados y reglas contables. |
| Reseñas | `productService.ts` contiene reseñas sembradas en memoria/localStorage. | No presentar opiniones semilla como clientes reales ni usar “comprador verificado” sin comprobación de compra. |

## 2. Hallazgos de máxima prioridad

### P0 — Veracidad del producto y seguridad

1. El modo actual es, según los servicios revisados, un prototipo local con datos de demostración; la documentación habla de servicios cloud como si estuvieran activos.
2. `switchRole()` permite alternar entre cliente y administrador en el cliente. Debe estar deshabilitado fuera de un modo demo explícito.
3. El endpoint S3 devuelve una URL simulada; reemplazar por firma real y autorización o mantenerlo desconectado y claramente marcado como demo.
4. Las reglas Firestore deben impedir que el propio usuario cree su documento con `role: admin`. Asignar roles desde un entorno privilegiado con Firebase Admin SDK / custom claims, nunca desde el cliente.
5. El checkout debe dejar de afirmar que guardó en Firestore cuando utiliza almacenamiento local.

### P1 — Experiencia y calidad

- Mejorar navegación móvil, semántica de tarjetas, estados de carga/error/vacío y feedback de acciones.
- Normalizar precios, moneda, stock, reviews y métricas.
- Revisar modales, foco, teclado, validación y errores.
- Validar imágenes y rendimiento real en móvil.

### P2 — Evolución

- Preparar rutas compartibles/product detail, filtros y ordenamiento mejorados.
- Añadir favoritos, comparación o B2B únicamente después de medir valor y definir requisitos.
- Añadir observabilidad ligera y analíticas respetuosas con privacidad solo si existe objetivo claro.

## 3. URLs y referencias de evidencia

- Repositorio: https://github.com/Stivenzbl/henry-m5-ecommerce
- Web publicada: https://henry-m5-ecommerce.vercel.app
- `package.json`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/package.json
- `AuthContext.tsx`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/src/contexts/AuthContext.tsx
- `Navbar.tsx`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/src/components/Navbar.tsx
- `productService.ts`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/src/services/productService.ts
- `orderService.ts`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/src/services/orderService.ts
- `CheckoutModal.tsx`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/src/pages/CheckoutModal.tsx
- `api/s3-presign.ts`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/api/s3-presign.ts
- `firestore.rules`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/firestore.rules
- `ProductCard.tsx`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/src/components/ProductCard.tsx
- `AdminView.tsx`: https://raw.githubusercontent.com/Stivenzbl/henry-m5-ecommerce/main/src/pages/AdminView.tsx

## 4. Auditoría que debe completar AGY

- Confirmar el commit desplegado en Vercel frente al HEAD de `main`.
- Ejecutar web visual y flujos con Playwright a 320, 375, 768, 1024 y 1440 px.
- Ejecutar `npm ci`, `npm run typecheck`, `npm test` y `npm run build`.
- Revisar todos los imports y dependencias para comprobar si Firebase/AWS están activos o solo documentados.
- Comprobar en DevTools Network si el navegador contacta Firebase/S3 y distinguir llamadas reales de mocks.
- Inspeccionar `.env.example`, `vercel.json`, API endpoints y reglas; nunca imprimir secretos.
- Crear un informe `docs/audits/BASELINE.md` con PASS/FAIL/BLOCKED y evidencias reproducibles.

No conviertas ninguna hipótesis en hecho hasta comprobarla en el entorno local y en la web desplegada.
