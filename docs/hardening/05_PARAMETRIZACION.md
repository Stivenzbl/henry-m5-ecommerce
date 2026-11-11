# 05 — Parametrización real y configuración central

## Principio

Parametrizar significa centralizar las decisiones que razonablemente cambian entre entornos o negocio. No significa convertir cada valor interno en un control editable ni permitir que una variable del frontend cambie permisos de seguridad.

## 1. Configuración central sugerida

Crear carpetas/módulos solo cuando el análisis confirme que mejoran la estructura existente. Evitar capas vacías o abstracciones sin uso.

### `src/config/appConfig.ts`

- nombre de marca y nombre corto;
- locale (`es-CO` u otro definido por proyecto);
- currency (`COP`, `USD` u otra que establezca el modelo real);
- URLs y rutas internas;
- nombre/versión del producto.

### `src/config/catalogConfig.ts`

- tamaño por defecto de página;
- tamaños disponibles (actualmente 6, 12, 24 si coinciden con consigna);
- debounce de búsqueda;
- ordenamientos disponibles;
- categorías y etiquetas;
- máximo de resultados.

### `src/config/authConfig.ts`

- persistencia (`local` o `session` de Firebase);
- rutas públicas y privadas;
- política para redirección tras login;
- flag para habilitar cuentas demo;
- mensajes y comportamiento de sesión.

**Nunca** usar este módulo para definir quién es admin ni para almacenar secretos.

### `src/config/orderConfig.ts`

- estados permitidos;
- transiciones válidas;
- estados que cuentan como ventas/ingresos;
- reglas de cancelación;
- información de checkout de demostración.

### `src/config/uploadConfig.ts`

- MIME allowlist;
- bytes máximos;
- expiración de URL prefirmada;
- prefijo S3 permitido;
- formatos/tamaños aceptados.

La política de servidor debe vivir en variables/constantes server-side, no depender de valores que el navegador pueda manipular.

### `src/config/analyticsConfig.ts`

- moneda y locale;
- estados válidos para revenue;
- rango de fechas inicial;
- formato de métricas;
- precisión de decimales.

## 2. Variables de entorno

Separar claramente variables públicas y privadas.

### Frontend (`VITE_*`, públicas en el bundle)

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_APP_ENV` (`development`, `preview`, `production`)
- `VITE_ENABLE_DEMO_ACCOUNTS` (`true` solo donde corresponda)

Solo usar las claves Firebase que realmente requiera el SDK y documentar cuáles son públicas por diseño. Aplicar restricciones de dominio/API cuando corresponda.

### Servidor Vercel (privadas; nunca `VITE_`)

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` o mecanismo de identidad seguro equivalente para Firebase Admin SDK.
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET_NAME`
- `ALLOWED_ORIGINS`
- `UPLOAD_MAX_BYTES`
- `PRESIGNED_URL_TTL_SECONDS`

No exigir que todos estos nombres se usen exactamente; adaptar al proveedor y la forma de autenticación elegida. Nunca versionar secretos. Añadir `.env.local`, archivos de service account y dumps al `.gitignore` si no lo están.

## 3. Validación al arrancar

Crear un parser tipado para `import.meta.env` y otro para variables server-side:

- detectar campos faltantes;
- validar booleanos, números, URL y valores permitidos;
- lanzar error descriptivo en desarrollo;
- en producción, devolver error controlado sin exponer secretos;
- no sustituir silenciosamente configuración faltante por URLs o credenciales falsas.

## 4. Parámetros de negocio consistentes

- Un solo origen de verdad para moneda/locale.
- Un solo origen de verdad para categorías.
- Un solo origen de verdad para estados y transiciones de órdenes.
- Un solo origen de verdad para paginación y debounce.
- Un solo origen de verdad para límites de subida.
- Formatos de fecha consistentes.
- No duplicar el mismo valor mágico en componentes diferentes.
- No permitir que settings de frontend amplíen las capacidades del usuario.

## 5. UI de ajustes

No crear un panel de administración de configuración genérico si no aparece en la consigna. La parametrización debe ser mantenible por código/env vars primero. Si se agrega una pantalla de ajustes, restringirla a opciones de negocio permitidas y persistirlas de forma segura.

## 6. Criterios de aceptación

- [ ] No hay valores de negocio críticos repetidos arbitrariamente.
- [ ] `.env.example` documenta variables y no contiene secretos.
- [ ] Configuración pública no incluye AWS ni service-account.
- [ ] Configuración faltante falla de forma explícita.
- [ ] Los cambios de locale/moneda afectan catálogo, carrito, checkout y analytics consistentemente.
- [ ] Los límites de archivos se comprueban en cliente y servidor.
- [ ] Ningún parámetro de UI otorga admin o desactiva reglas de backend.
