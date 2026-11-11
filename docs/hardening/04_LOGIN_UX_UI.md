# 04 — Rediseño del login: UX premium, claro y accesible

## Resultado esperado

El acceso debe parecer parte de un e-commerce profesional y demostrar con claridad quién entra, qué está pasando y por qué una acción fue permitida o denegada. La mejora no es solo estética: el flujo visual tiene que representar el estado real del proveedor de autenticación.

## 1. Decisión de UX

Preferir una ruta/página dedicada `/login` sobre el modal actual como flujo principal. Un modal secundario solo se conserva si existe una razón clara y mantiene el mismo componente/formulario de autenticación. Evitar dos implementaciones de login distintas.

### Layout desktop

Composición de dos columnas:

- **Columna de marca (40–45 %):** fondo profundo navy/índigo, marca Patagonix Retail, mensaje de bienvenida, imagen editorial de productos/e-commerce, 2–3 beneficios concretos del catálogo y un tratamiento visual sutil de textura/degradado.
- **Columna de acceso (55–60 %):** formulario centrado de ancho contenido, título con jerarquía fuerte, texto explicativo, campos, CTA principal, recuperación de contraseña y pie de ayuda.

### Layout mobile

- Una columna, sin scroll horizontal.
- Marca en cabecera compacta; formulario visible sin decoración que empuje los campos fuera de pantalla.
- Inputs de al menos 44–48 px de alto.
- CTA de ancho completo.
- Espaciado consistente y teclado móvil adecuado (`email`, `password`).

No usar una imagen decorativa grande que retrase el login o reduzca la legibilidad. El diseño debe funcionar aunque la imagen falle.

## 2. Estructura del formulario

1. Marca/identidad.
2. Título: `Bienvenido de nuevo`.
3. Texto: `Ingresa con tu cuenta de Patagonix Retail`.
4. Campo `Correo electrónico`.
5. Campo `Contraseña` con mostrar/ocultar.
6. Link `¿Olvidaste tu contraseña?`.
7. CTA `Iniciar sesión`.
8. Separador de demo (solo cuando `VITE_ENABLE_DEMO_ACCOUNTS` está activo).
9. Footer con aviso de proyecto académico/demo, si aplica.

**Eliminar completamente el selector de rol del login.** El rol se determina después de autenticar al usuario y verificar sus claims.

## 3. Accesos demo

Si hay cuentas demo reales habilitadas:

- Presentar dos cards compactas: `Explorar como cliente demo` y `Entrar al panel demo`.
- Mostrar el alcance de cada demo, no prometer permisos no probados.
- Usar botones reales (`button`) y no `div onClick`.
- Desactivar el botón mientras el proveedor autentica.
- Dar estado de éxito/error y redirigir según el claim real recibido.
- Si el backend no reconoce el claim admin, detener el flujo aunque la cuenta tenga nombre “Admin”.
- Etiquetar los datos como ficticios y de demostración.

Los accesos demo no reemplazan el login normal ni crean roles. Si se necesita contraseña pública para la cuenta demo, declarar que es una cuenta compartida y aislada, nunca una cuenta privada.

## 4. Estados que debe diseñar

- `initializing`: pantalla de carga sobria mientras Firebase resuelve la sesión.
- `unauthenticated`: formulario normal.
- `submitting`: botón bloqueado y feedback progresivo.
- `invalid-credentials`: error claro bajo el formulario.
- `network-error`: reintentar sin perder el correo.
- `firebase-not-configured`: mensaje técnico útil para desarrollo; no fingir login exitoso.
- `password-reset-sent`: confirmación sin revelar innecesariamente si el correo está registrado.
- `authenticated-customer`: redirección al destino autorizado.
- `authenticated-admin`: acceso al panel si claim validado.
- `forbidden`: acceso denegado con acción `Volver al catálogo`.
- `session-expired`: explicar que debe volver a iniciar sesión.

## 5. Accesibilidad

- Cada input debe tener `label` explícito asociado.
- `aria-invalid` y `aria-describedby` para errores.
- `aria-live="polite"` para feedback de autenticación.
- Iconos decorativos con `aria-hidden`; botones icon-only con `aria-label`.
- Todos los controles accesibles por teclado y con foco visible.
- Contraste WCAG 2.2 AA; no comunicar rol únicamente por color.
- No usar `div` como botón.
- No bloquear el zoom móvil ni el escalado de texto.
- Si se mantiene un modal: focus trap, Escape, devolución de foco al disparador y scroll lock correcto.
- Respeta `prefers-reduced-motion`.

## 6. Detalles que dan calidad profesional

- Validación inmediata sin mostrar errores antes de interacción innecesaria.
- Normalizar espacios exteriores del correo; no transformar la contraseña.
- Mostrar/ocultar contraseña sin perder el valor ni el foco.
- `autocomplete="username"` o `email` y `autocomplete="current-password"`.
- Prevenir doble submit.
- Evitar mensajes que permitan enumerar cuentas.
- Mantener el email tras un error, limpiar la contraseña solo si la política UX lo recomienda.
- No imprimir credenciales ni tokens en consola.
- No mostrar badges admin hasta que el proveedor confirme el claim.
- Avatar/menú de usuario consistente en Navbar con nombre y rol reales.
- Cerrar sesión visible, funcional y con confirmación solo si existe una acción destructiva real.

## 7. Navbar y sesión

Visitante:

- CTA visible `Iniciar sesión`.
- Catálogo público disponible.
- No mostrar órdenes ni administración como vistas abiertas.

Cliente autenticado:

- Nombre/avatar.
- Badge `Cliente` discreto.
- Acceso `Mis pedidos`.
- `Cerrar sesión`.
- Sin link administrativo o, si se muestra por transparencia, al pulsarlo debe producir un 403 claro.

Administrador autenticado:

- Badge `Administrador` distinguible, sin exageración.
- Acceso al panel.
- Menú de cuenta y logout.

La UI no es la barrera de seguridad; solo refleja permisos ya verificados.

## 8. Criterios de aceptación visual

- [ ] No hay selector de rol en el formulario.
- [ ] Login se entiende en menos de 5 segundos.
- [ ] Se distingue login normal de demo.
- [ ] Botones y inputs son cómodos en móvil y desktop.
- [ ] Carga y errores no producen saltos ni modal congelado.
- [ ] Teclado permite completar el flujo completo.
- [ ] Contraste, labels, foco y anuncios de error verificados.
- [ ] El estado de sesión del Navbar coincide con Firebase.
- [ ] No hay usuario autenticado por defecto.
- [ ] Las capturas antes/después evidencian el rediseño en desktop y móvil.
