# 02 — Autenticación real, RBAC y rutas protegidas

## Objetivo no negociable

El usuario debe autenticarse con un proveedor real. El rol `customer` o `admin` debe derivarse de información confiable emitida/administrada por el servidor, nunca de un selector en el navegador, un parámetro de URL, `localStorage`, un `uid` fijo ni un campo editable del formulario.

## 1. Proveedor objetivo

Usar Firebase Authentication Email/Password + Firebase Auth JS SDK, coherente con el BaaS que el README ya declara.

Primero inspeccionar el workspace y los entornos locales para detectar un proyecto Firebase existente, sin imprimir valores secretos. Si existe, reutilizarlo. Si no existe:

1. instalar el SDK `firebase` compatible con el stack;
2. crear un módulo único `src/lib/firebase.ts` que inicialice Firebase de forma segura y sin duplicar apps;
3. tipar y validar variables públicas requeridas (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` y las que realmente se utilicen);
4. actualizar `.env.example` con placeholders, nunca con credenciales reales;
5. documentar los pasos necesarios para crear/configurar el proyecto y habilitar Email/Password;
6. configurar Firebase Emulator Suite para pruebas locales.

No colocar service-account JSON, `private_key`, `AWS_SECRET_ACCESS_KEY` ni claves privadas en variables `VITE_*`.

## 2. AuthContext nuevo

Reemplazar la API de autenticación simulada. Contrato recomendado:

```ts
interface AuthContextValue {
  user: AuthenticatedUser | null;
  status: 'initializing' | 'authenticated' | 'unauthenticated' | 'error';
  isLoading: boolean;
  isAdmin: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  refreshClaims(): Promise<void>;
}
```

`AuthenticatedUser` debe derivar el UID, email y displayName del usuario autenticado; `role` se deriva del token validado/claims confiables o de un perfil Firestore protegido. No aceptar `role` como argumento en `login()`.

### Comportamiento obligatorio

- Al arrancar: estado `initializing`; no asumir cliente.
- Suscribirse a `onAuthStateChanged(auth, ...)` desde el provider y limpiar la suscripción al desmontar.
- En usuario autenticado: obtener los claims del ID token, recuperar perfil público desde Firestore y construir un modelo normalizado.
- En usuario anónimo: `user = null`, `isAdmin = false`.
- Si Firebase falla o no está configurado: mostrar estado de error real y una instrucción de configuración; no crear una sesión ficticia.
- Desconectar el listener correctamente y evitar condiciones de carrera durante hidratación.
- Para logout: llamar `signOut(auth)`, limpiar datos específicos de usuario en memoria y navegar a catálogo/inicio.
- No leer ni escribir un objeto `UserProfile` arbitrario desde `localStorage` para decidir el acceso.
- Se permite la persistencia de sesión administrada por Firebase (`browserLocalPersistence` o `browserSessionPersistence`, parametrizada); no persistir permisos manuales.

## 3. Asignación de roles segura

### Cliente

- Todo usuario creado por registro o seed comienza con rol `customer`.
- La creación de perfil desde cliente no puede incluir `admin: true` ni `role: 'admin'`.
- El cliente no puede editar el rol propio ni el de otros.

### Administrador

- Asignar el custom claim `admin: true` únicamente desde un entorno de confianza mediante Firebase Admin SDK o un script administrativo ejecutado localmente con credenciales privadas.
- No crear endpoint público del tipo `setRole`, `makeAdmin` o `switchRole`.
- No aceptar un `role` enviado en JSON desde el navegador como evidencia de permiso.
- Implementar script de bootstrap/seed que asigne el claim a un UID/email específico mediante variable protegida. Debe ser idempotente, documentado y nunca ejecutarse automáticamente desde el frontend.
- Tras cambiar claims, forzar/esperar renovación del ID token y volver a evaluar los permisos.

### Cuentas de demostración para el evaluador

Los accesos rápidos solo pueden ser accesos a cuentas reales de Firebase Authentication, previamente creadas. No pueden invocar `loginAs` ni fabricar usuarios.

- Activarlos solo con `VITE_ENABLE_DEMO_ACCOUNTS=true` en despliegue de demostración.
- Las cuentas deben contener exclusivamente datos ficticios y aislados de clientes reales.
- Si el correo/contraseña demo se muestran en la UI, declarar explícitamente que son credenciales públicas de entorno académico y jamás reutilizarlas en producción.
- No colocar contraseñas reales o privadas de administradores en el bundle.
- Si no se pueden crear cuentas demo reales, ocultar los botones y dejar el login normal; no simular éxito.

## 4. Eliminar por completo el modelo inseguro

Buscar y eliminar:

- `loginAs(role, ...)`;
- `switchRole()`;
- `user-default-101` y `admin-root-001` como identidades de sesión;
- la creación automática de usuario cliente al no existir `localStorage`;
- el selector `Cliente / Administrador` del formulario;
- accesos rápidos que escriban roles directamente;
- guards que solo comprueben un objeto local editable.

Hacer búsqueda global por `loginAs`, `switchRole`, `admin-root-001`, `user-default-101`, `patagonix_user_session_v1`, `selectedRole` y corregir todas las referencias y pruebas obsoletas.

## 5. Rutas reales

El `App.tsx` actual cambia vistas con `useState`. Si la rúbrica exige rutas protegidas o `/admin`, implementar `react-router-dom` y rutas directas:

- `/` o `/catalog` — catálogo público.
- `/login` — página de inicio de sesión.
- `/orders` — historial del cliente autenticado.
- `/admin` — panel solo para admin.
- `*` — página 404 útil.

Crear `RequireAuth` y `RequireRole` o un `ProtectedRoute` composable.

### Matriz de navegación

| Estado | Ruta solicitada | Resultado esperado |
|---|---|---|
| Visitante | `/` | Catálogo. |
| Visitante | `/orders` | Redirigir a `/login?returnTo=/orders`; no renderizar órdenes. |
| Visitante | `/admin` | Redirigir a `/login?returnTo=/admin`; explicar acceso administrativo requerido. |
| Customer | `/orders` | Mostrar exclusivamente sus propias órdenes. |
| Customer | `/admin` | Mostrar página 403/Acceso denegado; nunca renderizar AdminView. |
| Admin | `/admin` | Mostrar panel. |
| Admin | `/orders` | Según consigna: vista propia o administración separada; no mezclar historiales. |
| Usuario que cierra sesión | cualquier vista privada | Limpiar contexto y redirigir fuera del área privada. |

El parámetro `returnTo` debe validarse contra rutas internas permitidas. Rechazar URLs externas para evitar open redirects.

## 6. Reglas Firestore

Revisar `firestore.rules` y usar custom claim de admin como autoridad, por ejemplo `request.auth.token.admin == true`. No depender de `localStorage` ni de un rol enviado por el cliente.

- `users/{uid}`: lectura del perfil propio; escritura propia limitada a campos permitidos y sin posibilidad de alterar claims/rol; operación administrativa protegida.
- `products/{productId}`: lectura pública si la consigna lo permite; escritura solo admin.
- `orders/{orderId}`: cliente solo puede crear/leer su propia orden; admin puede gestionar las órdenes permitidas por consigna. Validar campos obligatorios y propietario en rules.
- `products/{productId}/reviews/{reviewId}`: crear solo autenticado; `userId` debe ser el UID del token; validar rating 1–5 y longitud del comentario; si se declara “comprador verificado”, comprobar una orden completada que incluya ese producto o quitar esa insignia.
- Denegar explícitamente operaciones no definidas.

Crear pruebas con Firebase Emulator Suite para lectura/escritura por anónimo, cliente y admin. Una prueba de UI no sustituye estas pruebas.

## 7. Login: contrato funcional

- Email con `type=email`, `autocomplete=email`, `required`, normalización sin alterar mayúsculas de contraseña.
- Contraseña con `type=password`, `autocomplete=current-password`, botón mostrar/ocultar accesible.
- Botón principal con estado pending, spinner/texto y deshabilitado mientras autentica.
- Enter envía el formulario; no enviar múltiples veces.
- Errores traducidos a mensajes amigables sin revelar si una cuenta existe cuando corresponda.
- Botón “¿Olvidaste tu contraseña?” que invoque `sendPasswordResetEmail`.
- Mantener el usuario en `/login` si falla; al autenticar, consultar el rol real y redirigir de forma segura.
- Una cuenta customer nunca se convierte en admin por escoger una opción visual.
- Mostrar nombre y rol real en el menú de cuenta cuando la sesión esté autenticada.

## 8. Criterios de aceptación

- [ ] Primera visita: usuario anónimo real, no cuenta automática.
- [ ] Credenciales inválidas: error y no hay sesión.
- [ ] Credenciales válidas de cliente: sesión Firebase real, claim/rol customer.
- [ ] Credenciales válidas de admin: sesión Firebase real, claim admin emitido desde entorno confiable.
- [ ] Ningún formulario permite elegir el rol.
- [ ] Editar `localStorage` no permite obtener permisos.
- [ ] Customer no puede entrar a `/admin` por URL directa ni invocar operación protegida.
- [ ] Admin sí puede entrar y operar CRUD.
- [ ] Recargar y volver a abrir mantiene sesión según la persistencia configurada.
- [ ] Cerrar sesión invalida el estado y no deja páginas privadas expuestas.
- [ ] Error/configuración Firebase ausente: falla cerrada y mensaje claro.
