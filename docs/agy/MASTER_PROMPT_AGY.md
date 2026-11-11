# MASTER PROMPT — PATAGONIX RETAIL / HENRY M5 HARDENING

Actúa como un equipo senior de ingeniería de producto y auditoría académica. Tu misión es **mejorar el repositorio real `Stivenzbl/henry-m5-ecommerce` al máximo nivel razonable, cerrar las brechas de autenticación/RBAC y persistencia, y demostrar rigurosamente los requisitos conocidos de Henry M5**.

No quiero una lluvia de ideas, otro informe teórico ni un rediseño superficial. Quiero que audites, planifiques, implementes, pruebes y documentes cambios reales en el código. Trabaja por fases, sin romper la entrega original.

## A. Contexto y objetivos

Proyecto: Patagonix Retail — AI-Driven E-Commerce SPA  
Autor: Stiven Zabala (`Stivenzbl`)  
Stack reportado: React 18, TypeScript, Vite, Tailwind, Vitest, AWS S3 y Vercel. El README también declara Firebase Auth + Firestore, pero debes verificarlo en código, no asumirlo.

Objetivos prioritarios:

1. Login profesional, real y convincente; el login actual es insuficiente.
2. RBAC real: `customer` y `admin`, sin autoselección de rol.
3. Protección de rutas reales, especialmente `/admin`, si la rúbrica la solicita.
4. Integración coherente de Firebase Auth y Firestore, porque hoy los servicios de dominio observados usan `localStorage` aunque el README diga Firestore.
5. Proteger `/api/s3-presign` para que solo un admin autenticado pueda obtener una URL de escritura.
6. Parametrizar de forma centralizada locale/moneda, paginación, búsqueda, estados, transiciones, límites de upload y flags de entorno.
7. Pruebas funcionales y negativas con evidencia.
8. Mantener todos los extras existentes y corregir sus afirmaciones si el comportamiento no es real.

## B. Lee primero todos los documentos del pack

Lee en su totalidad:

- `00_LEEME_PRIMERO.md`
- `01_AUDITORIA_BASELINE.md`
- `02_AUTH_RBAC_LOGIN.md`
- `03_FIREBASE_DATOS_Y_S3.md`
- `04_LOGIN_UX_UI.md`
- `05_PARAMETRIZACION.md`
- `06_QA_RUBRICA_Y_RELEASE.md`
- `07_SKILLS_MCPS_Y_METODO_AGY.md`

Si estos archivos no están en el repo, el usuario los puede abrir desde su carpeta local; no asumas que ya se copiaron.

## C. Auditoría inicial obligatoria

Antes de tocar código:

1. Ejecuta `git status`, identifica rama y commit actual.
2. Crea o propone una rama segura `hardening/m5-auth-rbac-data`; preserva el commit de entrega original.
3. Lee `package.json`, `README.md`, `.env.example`, `firestore.rules`, todos los contexts, servicios, `App.tsx`, `Navbar.tsx`, `LoginModal.tsx`, panel admin, checkout, orders, product detail y tests.
4. Busca globalmente `loginAs`, `switchRole`, `user-default-101`, `admin-root-001`, `localStorage`, `selectedRole`, `firebase`, `firestore`, `mode: 'demo'`, `presign` y `ProtectedRoute`.
5. Inspecciona de forma segura si existe `.env.local`, configuración Firebase local y credenciales disponibles; **no muestres valores ni los copies al output**.
6. Localiza la consigna oficial de Henry en el workspace. Si no está, usa los requisitos conocidos que se listan más abajo y deja explícita la limitación. No inventes rúbrica ni porcentajes.
7. Ejecuta baseline: `npm ci`, `npm run typecheck`, `npm test`, `npm run build`. Registra exactamente qué pasa y qué falla.
8. Descubre skills y MCPs reales disponibles siguiendo `07_SKILLS_MCPS_Y_METODO_AGY.md`. No inventes nombres ni instalaciones.

Entrega un breve diagnóstico técnico y el plan por fases antes de modificar archivos. Después de presentar ese diagnóstico, continúa con la implementación sin detenerte a pedir confirmación, salvo que se requiera una acción externa irreparable o una credencial que solo el propietario pueda suministrar.

## D. Hechos actuales que debes verificar, no ignorar

La auditoría previa del repositorio público detectó:

- `AuthContext.tsx` crea un cliente por defecto y persiste un perfil arbitrario en localStorage.
- `loginAs(role, ...)` puede asignar `admin` directamente desde el cliente.
- `LoginModal.tsx` valida presencia/formato de campos, pero `handleFormSubmit` termina llamando a `loginAs`; no autentica la contraseña.
- El formulario incluye un selector de rol customer/admin.
- `switchRole()` alterna a admin desde el frontend.
- `App.tsx` usa `useState` para cambiar entre vistas; no se observó `ProtectedRoute` ni router real.
- `productService.ts` y `orderService.ts` guardan datos en localStorage; no se encontró uso de Firestore.
- `package.json` observado no contiene Firebase ni React Router.
- `firestore.rules` existe, pero las reglas no se están usando si la app no está conectada a Firestore.
- `api/s3-presign.ts` no mostró verificación Authorization y tiene fallback que devuelve URL simulada `mode: 'demo'`.

Si la rama actual ya corrigió alguno de estos puntos, actualiza la auditoría con evidencia nueva y no reintroduzcas la brecha.

## E. Decisiones obligatorias de seguridad

- No crear usuario anónimo por defecto.
- No permitir seleccionar admin en un formulario.
- No aceptar rol desde query params, body, `localStorage`, context manual o perfil editable.
- Autenticar usando Firebase Authentication real.
- Escuchar cambios de sesión con `onAuthStateChanged`.
- Obtener el permiso administrativo de un custom claim confiable, asignado únicamente por Firebase Admin SDK desde entorno de confianza.
- Cliente se crea como `customer` por defecto.
- El frontend solo presenta UI basada en permisos; Firestore Rules y endpoints vuelven a verificar permisos.
- El endpoint S3 requiere Bearer Firebase ID token válido y claim `admin === true`; customer debe recibir 403 y anónimo 401.
- Si falta configuración de Firebase/AWS en producción, falla cerrada; jamás inventar un éxito demo.
- Ninguna clave privada o service account va en `VITE_*`, git, bundle o logs.
- No desplegar a Production ni sobrescribir `main` sin autorización expresa.

## F. Arquitectura de autenticación objetivo

Implementa Firebase Authentication Email/Password + Firestore si la consigna/README del proyecto los mantiene como BaaS. Si falta Firebase Project ID o configuración, termina el código, emulator y documentación; marca deploy real como `BLOCKED` por configuración externa, sin falsear una conexión.

AuthContext debe exponer `user`, `status`, `isLoading`, `isAdmin`, `login(email,password)`, `logout()`, `sendPasswordReset(email)` y `refreshClaims()`. No exponer `loginAs(role)` ni `switchRole()`.

Usa rutas reales cuando la consigna hable de rutas protegidas:

- `/` o `/catalog`
- `/login`
- `/orders`
- `/admin`
- `*`

Crea guards composables para autenticación y rol. El parámetro `returnTo` solo acepta rutas internas permitidas. Customer que vaya a `/admin` recibe 403; visitante se redirige a login; admin válido entra.

Los accesos demo, si se conservan, deben autenticar contra cuentas Firebase reales previamente creadas. Son cuentas ficticias de un entorno académico separado; no pueden fabricar roles ni usar contraseñas privadas reales. El feature flag de demo no debe convertirse en una puerta trasera.

## G. Datos y persistencia objetivo

El proyecto declara Firebase, por lo que sustituye ProductService/OrderService local-only por repositorios Firestore reales, si esa arquitectura es consistente con la consigna. Elimina `localStorage` como autoridad de productos, inventario, reviews, roles y órdenes. Se puede mantener para preferencias/carrito local siempre que quede aislado por UID y no sea fuente de autorización.

Reglas mínimas:

- Productos: lectura pública según consigna; escritura admin.
- Orders: cliente crea/lee solo sus propias órdenes; admin gestiona lo permitido.
- Users: propietario lee su perfil; no cambia su rol.
- Reviews: valida usuario, campos y rating; “comprador verificado” solo con prueba real de compra.
- Rules cubiertas con Emulator Suite, no solo mocks.

En checkout no confíes en total o precio enviados por el navegador; valida precio/stock en fuente confiable y crea orden/actualización de inventario de forma atómica cuando aplique. Si el pago es demo, etiquetarlo claramente como demo.

## H. Login UI que quiero

Haz que el login se sienta de producto terminado, no un modal genérico:

- página `/login` responsive con layout editorial de dos columnas en desktop y una columna en móvil;
- identidad Patagonix consistente con la app;
- formulario limpio con email, contraseña, show/hide, recuperar contraseña y CTA claro;
- loading, errores, disabled state y estados de éxito;
- accesibilidad WCAG AA, labels, foco, keyboard-only, aria-live;
- accesos demo separados visualmente y visibles solo en entorno demo, si existen cuentas reales;
- nada de selector de rol;
- Navbar con nombre, avatar/badge derivado de sesión real y logout funcional.

No rediseñes el resto del e-commerce de forma gratuita ni rompas los flujos actuales.

## I. Endpoint S3

Protege `/api/s3-presign` con Firebase Admin SDK y claim de admin. Valida método, token, MIME allowlist, tamaño, CORS, región/bucket y expiración corta. Genera key aleatoria bajo `products/`. Elimina el fallback simulado en producción: configuración AWS ausente responde 503. Devuelve errores JSON coherentes. No registrar tokens/secretos. Prueba los casos 401, 403, 405, 415, límite de tamaño y 200 admin real contra bucket de prueba.

## J. Parametrización

Centraliza configuración tipada para marca, locale, currency, categorías, tamaños de página, debounce, estados/transiciones, límites de imagen, TTL, persistencia y flags. No parametrices los permisos desde UI. Valida env vars al inicio; `.env.example` solo tendrá placeholders. No repetir números mágicos ni lógica de moneda en varios componentes.

## K. Calidad, rúbrica y pruebas

Crear `docs/QUALITY/HENRY_REQUIREMENTS_TRACEABILITY.md` con una fila para cada requisito y estados `PASS/FAIL/BLOCKED/NOT_APPLICABLE`. Requisitos conocidos: React/TS/Vite/Tailwind; arquitectura; auth/roles; acceso privado; catálogo/búsqueda/filtros/orden; carrito useReducer y persistencia; checkout; historial de órdenes; admin CRUD/stock; S3 presigned; tests; analytics; paginación; reviews; Vercel HTTPS/CI; documentación/entrega.

Mantén y prueba extras existentes. No declares “19 tests passing” sin ejecutar `npm test` ahora. Añade pruebas de AuthContext, guards, rules Firebase Emulator, S3 endpoint y recorridos E2E con Playwright si se puede.

Casos mínimos negativos:

- contraseña incorrecta;
- localStorage alterado para `role: admin`;
- cliente cambia el payload a `admin`;
- cliente abre `/admin` por URL directa;
- cliente llama API S3 directamente;
- anónimo llama API S3;
- usuario lee orden ajena;
- usuario intenta editar su claim/perfil de rol;
- MIME no permitido y archivo demasiado grande;
- configuración de Firebase/AWS faltante.

## L. Fases de ejecución

**Fase 0 — Baseline y trazabilidad.** Diagnóstico, rama, pruebas iniciales, matriz de requisitos.  
**Fase 1 — Firebase Auth.** SDK, configuración, AuthContext, login/logout/reset, sesión sin fake user.  
**Fase 2 — RBAC y rutas.** Claims, ProtectedRoute, `/login`, `/orders`, `/admin`, returnTo seguro.  
**Fase 3 — Firestore.** Migrar servicios y rules, seeds demo, tests de reglas, aislamiento de usuarios.  
**Fase 4 — Seguridad S3.** Verify ID token, require admin, validación y fail-closed.  
**Fase 5 — Login UX.** Diseño final, estados, responsive, accesibilidad y Navbar.  
**Fase 6 — Parametrización.** Config central, env schema, eliminar valores mágicos.  
**Fase 7 — QA completa.** unit, integration, rules, E2E, build, responsive, security negative tests.  
**Fase 8 — Documentación/release.** README veraz, guía defensa, reporte y preview con release gate.

No realices solo la Fase 5 y declares terminado. La autenticación, las reglas y la persistencia deben estar conectadas.

## M. Restricciones de cambios

- Preserva el trabajo existente y los tres extras.
- No borres funcionalidades para simplificar.
- No reemplaces tecnologías centrales sin justificación.
- No agregues dependencias innecesarias.
- No ejecutes comandos destructivos ni borres datos de producción.
- No publiques a producción ni hagas merge a main sin aprobación.
- Usa commits pequeños y descriptivos en la rama de hardening.
- No dejes `TODO`, mocks, stubs, fake login, bypasses o `console.log` sensibles en la versión final.

## N. Entregables obligatorios

1. Código real implementado.
2. Rama de trabajo y resumen de commits.
3. `docs/QUALITY/HENRY_REQUIREMENTS_TRACEABILITY.md`.
4. `docs/QUALITY/AUTH_RBAC_TEST_MATRIX.md`.
5. `docs/QUALITY/SECURITY_CHECKLIST.md`.
6. `docs/QUALITY/RELEASE_REPORT.md`.
7. Capturas desktop/móvil del login, catálogo, 403 y panel admin.
8. Resultados exactos de `npm run typecheck`, `npm test`, rules tests, E2E y `npm run build`.
9. `.env.example` actualizado sin secretos.
10. README, guía de defensa y documento completo corregidos para reflejar solo lo implementado.

## O. Forma de reportar

Al final de cada fase indica: archivos modificados, decisiones, pruebas ejecutadas y resultados, requisitos que pasan, bloqueos externos y siguiente fase. Si un test falla, corrígelo antes de continuar. Si falta una credencial externa, implementa lo posible y marca exactamente el bloqueo; no hagas pasar una simulación por producción.

**Criterio final:** Patagonix Retail queda listo cuando el login autentica de verdad, el rol admin no puede falsificarse desde frontend, la ruta `/admin` y las operaciones se protegen server-side, Firestore persiste los datos que se documentan, S3 solo firma para admins, y todos los requisitos conocidos tienen pruebas y evidencia. No prometas la nota ni uses “100%” si falta alguna condición.
