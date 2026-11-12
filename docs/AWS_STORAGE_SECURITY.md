# ☁️ Seguridad de Almacenamiento Cloud con AWS S3

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Servicio:** `api/s3-presign.ts`, `src/components/AdminProductModal.tsx`  
> **SDK:** `@aws-sdk/s3-presigned-post`  
> **Región:** `us-east-2`  
> **Fecha:** 12 de Noviembre de 2026 (Segunda Vuelta de Hardening)  

---

## 1. 📋 Implementado

1. **Arquitectura Presigned POST con Directiva Criptográfica:**
   - La función serverless `/api/s3-presign` utiliza `createPresignedPost` de `@aws-sdk/s3-presigned-post`.
   - Genera una política de subida multipart con firma AWS Signature Version 4 (SigV4).
   - Impone la directiva obligatoria `['content-length-range', 1, 5242880]`.
   - La propia infraestructura de Amazon S3 rechaza en la nube cualquier carga binaria que supere 5 MB, independientemente de lo que declare el cliente en el frontend.

2. **Lista Blanca de Formatos (MIME Allowlist):**
   - Restricción estricta a tipos de imagen: `image/jpeg`, `image/png`, `image/webp`.
   - La directiva de la política incluye `['starts-with', '$Content-Type', 'image/']`.
   - Si se envía un archivo no permitido (e.g. `.exe`, `.pdf`, `.sh`), el servidor responde con código HTTP `415 Unsupported Media Type`.

3. **Generación de Claves de Objeto Seguras:**
   - Sanitización de nombres de archivo mediante expresiones regulares (`fileName.replace(/[^a-zA-Z0-9.-]/g, '_')`).
   - Inyección de prefijo y timestamp único: `products/${Date.now()}-${cleanName}`.
   - Imposibilidad de sobreescribir archivos existentes o ejecutar Path Traversal (`../`).

4. **Principio Fail-Closed en Backend:**
   - Si las variables de entorno de AWS no están presentes en el servidor (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`), responde con código HTTP `503 Service Unavailable` (`STORAGE_UNCONFIGURED`).
   - Cero emisión de URLs simuladas o mocks en producción.

5. **Principio Fail-Closed Estricto en Frontend (`src/components/AdminProductModal.tsx`):**
   - Si la llamada al presigned endpoint o la posterior subida mediante `FormData` a S3 falla, el componente cancela la operación y presenta un mensaje de alerta visual en rojo (`uploadError`).
   - Se eliminaron todos los fallbacks engañosos a `URL.createObjectURL(file)` y simulaciones de URLs tipo `mockS3Url`. La aplicación jamás disfraza un fallo de red o autorización como una carga exitosa.

---

## 2. 🧪 Probado

1. **Suite de Seguridad del Endpoint (`src/tests/s3Presign.test.ts` - 7 tests):**
   - **405 Method Not Allowed:** Rechazo de llamadas GET o PUT directas a la API.
   - **401 Unauthorized:** Rechazo de peticiones sin cabecera `Authorization`.
   - **403 Forbidden:** Rechazo de clientes comunes autenticados sin rol admin (verificado con RS256).
   - **415 Unsupported Media Type:** Rechazo de archivos ejecutables (`application/x-msdownload`).
   - **413 Payload Too Large:** Rechazo defensivo previo si el cliente declara un tamaño superior a 5 MB.
   - **400 Bad Request:** Rechazo de peticiones con nombres o tipos vacíos.
   - **503 Service Unavailable:** Respuesta fail-closed al faltar credenciales en el entorno.

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Escaneo de Malware Asíncrono (AWS ClamAV / GuardDuty):** Configurar una función AWS Lambda activada por evento `s3:ObjectCreated:*` para escanear virus en imágenes antes de hacerlas públicas.
2. **Distribución CDN con Amazon CloudFront:** Asociar una distribución CloudFront delante del bucket para almacenamiento en caché global y bloqueo de geolocalizaciones específicas.

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Reglas CORS del Bucket en AWS S3:** La configuración XML/JSON de CORS aplicada en el bucket S3 (`AllowedOrigins`, `AllowedMethods: [POST]`, `AllowedHeaders: [*]`) reside en la consola de AWS.
2. **Políticas de Bucket IAM:** Las políticas adjuntas al bucket para permitir lectura pública de objetos `products/*` mientras se restringe la escritura a la clave de servicio.
