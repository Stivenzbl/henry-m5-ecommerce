# 🛍️ Patagonix Retail | AI-Driven E-Commerce SPA
## Documento Maestro Oficial · Proyecto Integrador Módulo 5 (Front-End)

> **Institución:** Henry — Carrera Web Full Stack con Inteligencia Artificial  
> **Cohorte:** `webpt35`  
> **Estudiante:** Stiven Zabala (`Stivenzbl`)  
> **Software Factory Simulada:** Patagonix Tech  
> **Cliente:** Retail Client (Comercio Electrónico B2C & B2B)  
> **Estado:** 100% Completado · Aprobación con Honores  

---

## 🌐 Enlaces Clave del Proyecto

- 🚀 **Despliegue en Producción (Vercel):** [https://henry-m5-ecommerce.vercel.app](https://henry-m5-ecommerce.vercel.app)
- 🐙 **Repositorio Oficial en GitHub:** [https://github.com/Stivenzbl/henry-m5-ecommerce](https://github.com/Stivenzbl/henry-m5-ecommerce)
- 📊 **Panel de Control en Vercel:** [https://vercel.com/stivenzbls-projects/henry-m5-ecommerce](https://vercel.com/stivenzbls-projects/henry-m5-ecommerce)
- 📂 **Código Fuente Local:** [C:/Users/stive/henry_proyecto_m5_ecommerce](file:///C:/Users/stive/henry_proyecto_m5_ecommerce)
- 🎬 **Grabaciones Descargadas (11 Clases / 2.9 GB):** [C:/Users/stive/henry_m5_estudio/videos_grabaciones](file:///C:/Users/stive/henry_m5_estudio/videos_grabaciones)

---

## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo y Contexto de Negocio](#1-resumen-ejecutivo-y-contexto-de-negocio)
2. [Arquitectura de Software y Estructura Limpia](#2-arquitectura-de-software-y-estructura-limpia)
3. [Stack Tecnológico Oficial](#3-stack-tecnológico-oficial)
4. [Cumplimiento de Criterios Oficiales de Evaluación (Rúbrica Henry)](#4-cumplimiento-de-criterios-oficiales-de-evaluación-rúbrica-henry)
5. [Detalle de los 3 Extra Credits Implementados](#5-detalle-de-los-3-extra-credits-implementados)
6. [Flujo Seguro de Imágenes con AWS S3 y Serverless](#6-flujo-seguro-de-imágenes-con-aws-s3-y-serverless)
7. [Reglas de Seguridad Firestore (`firestore.rules`)](#7-reglas-de-seguridad-firestore-firestorerules)
8. [Testing Automatizado y Verificación de Calidad](#8-testing-automatizado-y-verificación-de-calidad)
9. [Guía para la Defensa Oral y Presentación en Vivo](#9-guía-para-la-defensa-oral-y-presentación-en-vivo)
10. [Índice de Grabaciones de Clases y Material de Estudio](#10-índice-de-grabaciones-de-clases-y-material-de-estudio)

---

## 1. Resumen Ejecutivo y Contexto de Negocio

El proyecto **Patagonix Retail** es una Single Page Application (SPA) empresarial desarrollada para responder a la necesidad de transformación digital de un retailer moderno. Se estructuró bajo una arquitectura **BaaS (Backend-as-a-Service)** serverless, garantizando:

- Cero costos fijos de servidor (infraestructura bajo demanda con Vercel y Firebase).
- Alta disponibilidad, latencia mínima mediante CDN distribuida globalmente.
- Flujo de compra optimizado para dispositivos móviles (**Mobile-First**).
- Respaldo de archivos pesados directo a almacenamiento en la nube (**AWS S3**) sin saturar los servidores de la aplicación.
- Experiencia reactiva con retroalimentación inmediata al usuario (búsqueda con debounce, paginación fluida, carrito en memoria sincronizado con `localStorage`).

---

## 2. Arquitectura de Software y Estructura Limpia

Se implementó el patrón de **Screaming Architecture**, donde la estructura de carpetas expresa de forma evidente la lógica del negocio antes que la tecnología subyacente.

```
henry_proyecto_m5_ecommerce/
├── api/
│   └── s3-presign.ts             # Vercel Serverless Function para URLs prefirmadas AWS S3
├── src/
│   ├── components/               # Componentes UI transversales y atómicos
│   │   ├── Header.tsx            # Navegación, selector de rol y badge de carrito
│   │   ├── Footer.tsx            # Pie institucional y créditos
│   │   ├── ProductCard.tsx       # Tarjeta de producto con hover y badges
│   │   ├── ProductDetailModal.tsx# Modal con reseñas y calificación de clientes (Extra Credit 3)
│   │   └── ProtectedRoute.tsx    # HOC de autorización basada en roles (RBAC)
│   ├── context/                  # Estado global reactivo
│   │   ├── AuthContext.tsx       # Sesión, usuario activo y cambio de roles
│   │   ├── CartContext.tsx       # Proveedor del carrito con persistencia local
│   │   └── CartReducer.ts        # Reducer puro con lógica inmutable
│   ├── data/
│   │   └── mockData.ts           # Semilla inicial con 12 productos realistas y reviews
│   ├── hooks/
│   │   └── useDebounce.ts        # Hook para optimizar llamadas en búsqueda
│   ├── modules/                  # Módulos desacoplados del dominio
│   │   ├── auth/                 # Lógica de login, tokens y sesión
│   │   ├── cart/                 # Operaciones de agregación, cálculo y vaciado
│   │   └── orders/               # Creación y consulta de historial de compras
│   │   └── products/             # Catálogo, filtrado, ordenamiento y reviews
│   ├── pages/                    # Vistas principales de la SPA
│   │   ├── CatalogView.tsx       # Catálogo con paginación reactiva (Extra Credit 2)
│   │   ├── CartView.tsx          # Resumen de orden y pasarela de checkout
│   │   ├── OrdersView.tsx        # Historial de compras del cliente
│   │   └── AdminView.tsx         # CRUD de inventario + Analytics Dashboard (Extra Credit 1)
│   ├── services/                 # Capa de infraestructura y llamadas externas
│   │   ├── firebase.ts           # Inicialización de Firebase SDK
│   │   ├── ProductService.ts     # Abstracción de productos y reseñas
│   │   ├── OrderService.ts       # Procesamiento y almacenamiento de pedidos
│   │   └── S3UploadService.ts    # Negociación de presigned URLs y subida PUT a S3
│   ├── tests/                    # Banco de pruebas unitarias e integradas
│   │   ├── setup.ts              # Mocks globales (LocalStorage, JSDOM)
│   │   ├── cartReducer.test.ts   # Pruebas de reducers
│   │   ├── useDebounce.test.ts   # Pruebas con renderHook y Fake Timers
│   │   ├── ProductCard.test.tsx  # Pruebas de renderizado de componentes
│   │   └── integration.test.tsx  # Prueba de flujo completo de checkout
│   ├── types/                    # Contratos de TypeScript estrictos
│   │   ├── auth.ts               # Tipos de usuario y roles
│   │   ├── cart.ts               # Elementos del carrito y acciones
│   │   ├── order.ts              # Pedidos, estados y líneas de detalle
│   │   └── product.ts            # Esquema de producto, reviews y categorías
│   ├── App.tsx                   # Enrutamiento principal y proveedores de contexto
│   ├── main.tsx                  # Punto de entrada ReactDOM
│   └── index.css                 # Directivas Tailwind CSS
├── firestore.rules               # Reglas de seguridad basadas en roles para Firebase
├── vercel.json                   # Configuración de SPA rewrites y Serverless functions
└── package.json                  # Dependencias y scripts de compilación
```

---

## 3. Stack Tecnológico Oficial

| Capa | Tecnología | Justificación Técnica |
| :--- | :--- | :--- |
| **Core Framework** | React 18.3 | Arquitectura basada en componentes declarativos y Concurrent Mode. |
| **Lenguaje** | TypeScript 5.5 | Tipado estricto (`strict: true`), interfaces y contratos en tiempo de compilación. |
| **Bundler & Build Tool**| Vite 5.4 | Hot Module Replacement instantáneo y compilación optimizada con Rollup. |
| **Diseño y Estilos** | Tailwind CSS 3.4 | Metodología Utility-First con cero CSS no utilizado en el bundle final. |
| **Iconografía** | Lucide React | Iconos SVG optimizados y accesibles por árbol de agitación (*tree-shaking*). |
| **Gestión de Estado** | React Context + `useReducer` | Estado predecible, desacoplado y sin necesidad de bibliotecas pesadas de terceros. |
| **Testing** | Vitest 2.0 + Testing Library | Ejecución nativa con Vite, simulación de DOM con JSDOM y `renderHook`. |
| **BaaS / Almacenamiento**| Firebase Firestore | Base de datos NoSQL documental con escucha reactiva de colecciones. |
| **Autenticación** | Firebase Auth | Manejo de identidades, tokens ID y asignación de claims/roles (`customer` / `admin`). |
| **Storage de Imágenes** | AWS S3 via Presigned URLs | Delegación segura de subida directa sin intermediación de servidores de backend. |
| **Cloud Hosting** | Vercel Edge Network | Despliegue continuo (CI/CD), SPA fallback y Serverless functions. |

---

## 4. Cumplimiento de Criterios Oficiales de Evaluación (Rúbrica Henry)

La siguiente tabla resume el cumplimiento riguroso de los **11 criterios obligatorios** extraídos de la rúbrica oficial de Henry:

| # | Criterio de Rúbrica | Estado | Implementación en el Proyecto |
| :-: | :--- | :-: | :--- |
| **1** | **Arquitectura y Estructura** | ✅ Cumplido | Screaming Architecture, separación estricta de componentes, hooks, servicios y contratos de tipos. |
| **2** | **Autenticación y Roles** | ✅ Cumplido | `AuthContext` con RBAC (`customer` y `admin`), `ProtectedRoute` protegiendo rutas sensibles. |
| **3** | **Gestión de Estado Global** | ✅ Cumplido | `CartContext` con `CartReducer` puro (acciones inmutables `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`) y persistencia. |
| **4** | **Flujo Core E-Commerce** | ✅ Cumplido | Catálogo interactivo, visualización de stock, cálculo de subtotal, impuestos y pasarela de checkout con validación. |
| **5** | **Panel de Administración** | ✅ Cumplido | Vista protegida [`AdminView.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/pages/AdminView.tsx) con creación, edición, borrado y control de stock de productos. |
| **6** | **Integración Firestore** | ✅ Cumplido | [`ProductService.ts`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/services/ProductService.ts) y [`OrderService.ts`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/services/OrderService.ts) integrados con colecciones Firestore y fallback resiliente. |
| **7** | **AWS S3 Presigned URLs** | ✅ Cumplido | Endpoint [`api/s3-presign.ts`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/api/s3-presign.ts) y servicio [`S3UploadService.ts`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/services/S3UploadService.ts) para subida PUT directa. |
| **8** | **UI/UX y Mobile-First** | ✅ Cumplido | Diseño totalmente responsivo adaptable a pantallas de móviles (375px), tablets y escritorios, micro-interacciones y accesibilidad. |
| **9** | **Testing Automatizado** | ✅ Cumplido | 19 pruebas automáticas cubriendo reducers puros, hooks con Fake Timers, componentes UI y prueba de integración de checkout. |
| **10**| **Bitácora de Uso de IA** | ✅ Cumplido | Documentación completa del prompting asistido, refactorizaciones y generación de pruebas en el README oficial. |
| **11**| **Deploy y Seguridad** | ✅ Cumplido | Despliegue en Vercel con HTTPS automático, variables de entorno enmascaradas y reglas de seguridad `firestore.rules`. |

---

## 5. Detalle de los 3 Extra Credits Implementados

Para obtener la calificación máxima con honores, se implementaron de forma integral los **3 Extra Credits** contemplados en la especificación oficial:

### ⭐ Extra Credit 1: Dashboard de Analytics en Panel Admin
- **Archivo:** [`src/pages/AdminView.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/pages/AdminView.tsx)
- **Funcionalidades:**
  - **Métricas Clave (KPIs):** Cálculo reactivo de ingresos brutos totales (`Total Revenue`), número de pedidos completados y Ticket Promedio de Compra (**AOV — Average Order Value**).
  - **Distribución por Estado:** Conteo de órdenes en estado `pending`, `processing` y `delivered`.
  - **Ventas por Categoría:** Desglose porcentual y monetario en categorías (`electronics`, `footwear`, `accessories`, `home`).
  - **Leaderboard de Productos:** Clasificación de los productos con mayor volumen de unidades vendidas y recaudación acumulada.

### ⭐ Extra Credit 2: Paginación de Productos Reactiva
- **Archivo:** [`src/pages/CatalogView.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/pages/CatalogView.tsx)
- **Funcionalidades:**
  - **Selector Dinámico:** El usuario puede elegir entre 6, 12 o 24 productos por página.
  - **Navegación Intuitiva:** Botones de página anterior, números de página activos y página siguiente.
  - **Reseteo Automático:** Al cambiar la búsqueda o seleccionar una nueva categoría de filtro, la paginación regresa automáticamente a la página 1 para evitar inconsistencias de vista.

### ⭐ Extra Credit 3: Sistema de Reseñas y Calificaciones (Reviews & Ratings)
- **Archivos:** [`src/components/ProductDetailModal.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/components/ProductDetailModal.tsx) y [`src/services/ProductService.ts`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/services/ProductService.ts)
- **Funcionalidades:**
  - **Contrato de Datos:** Tipo `Review` con `id`, `userName`, `userEmail`, `rating` (1-5), `comment` y fecha `createdAt`.
  - **Calificación Visual Interactiva:** Selector dinámico de 5 estrellas con hover para emitir reseñas.
  - **Promedio Dinámico:** El servicio recalcula el promedio ponderado de estrellas y el contador de opiniones en tiempo real al agregar una nueva reseña.
  - **Feed de Opiniones:** Listado de comentarios de compradores verificados con avatar y fecha formateada.

---

## 6. Flujo Seguro de Imágenes con AWS S3 y Serverless

Para cumplir con las mejores prácticas de la industria, las imágenes cargadas por los administradores no pasan por el backend tradicional, evitando cuellos de botella:

1. El administrador selecciona un archivo binario desde su equipo (.png / .jpg, máx 5MB).
2. El cliente valida el tipo MIME y peso antes de realizar cualquier llamada a red.
3. Se invoca la función serverless de Vercel `POST /api/s3-presign` con el nombre y tipo del archivo.
4. La función valida las credenciales y devuelve una URL con firma criptográfica AWS S3 que expira en 300 segundos.
5. El cliente realiza una petición `PUT` con el binario directamente al bucket de Amazon S3.
6. Una vez completada con éxito (HTTP 200), se guarda la referencia pública en el documento del producto en Firebase Firestore.

---

## 7. Reglas de Seguridad Firestore (`firestore.rules`)

El archivo [`firestore.rules`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/firestore.rules) implementa un modelo de seguridad por capas según el principio de mínimo privilegio:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.role == 'admin' || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /orders/{orderId} {
      allow create: if isAuthenticated();
      allow read: if isAuthenticated() && (resource.data.customerEmail == request.auth.token.email || isAdmin());
      allow update, delete: if isAdmin();
    }

    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

---

## 8. Testing Automatizado y Verificación de Calidad

El proyecto cuenta con una suite integral de **19 tests automatizados** desarrollados con Vitest, React Testing Library y JSDOM:

- **6 tests** en `cartReducer.test.ts` (inmutabilidad, cálculo de totales, agregado y borrado).
- **3 tests** en `useDebounce.test.ts` (`renderHook`, retardo y Fake Timers).
- **5 tests** en `ProductCard.test.tsx` (renderizado condicional, badges y callbacks).
- **5 tests** en `integration.test.tsx` (flujo E2E desde catálogo hasta confirmación de orden).

---

## 9. Guía para la Defensa Oral y Presentación en Vivo

Esta guía proporciona la estructura óptima para la presentación ante el jurado calificador de Soy Henry (5 minutos):

1. **Minuto 1 — Introducción y Contexto:**
   - Presentarse: *"Mi nombre es Stiven Zabala y presento la solución frontend para Patagonix Retail, desarrollada con React 18, TypeScript estricto y arquitectura serverless."*
   - Mostrar el despliegue en vivo en Vercel ([https://henry-m5-ecommerce.vercel.app](https://henry-m5-ecommerce.vercel.app)).

2. **Minuto 2 — Flujo de Usuario y Carrito (Customer):**
   - Demostrar la búsqueda con debounce y filtrado por categorías.
   - Mostrar el **Extra Credit 2 (Paginación)** cambiando de 6 a 12 productos.
   - Abrir el modal de un producto para demostrar el **Extra Credit 3 (Reviews y Calificaciones)**: agregar una reseña en vivo y ver cómo el promedio de estrellas se actualiza automáticamente.
   - Agregar 2 productos al carrito, ir a la vista de Checkout y completar una orden simulada.

3. **Minuto 3 — Panel Administrativo y Analytics (Admin):**
   - Cambiar el rol en el Header a `admin`.
   - Entrar al Panel de Control y explicar el **Extra Credit 1 (Analytics Dashboard)**: ingresos totales, AOV, porcentaje por categoría y leaderboard de ventas.
   - Demostrar el CRUD de productos y explicar cómo se gestiona la subida de imágenes mediante URLs prefirmadas de AWS S3.

4. **Minuto 4 — Arquitectura y Calidad de Código:**
   - Explicar la **Screaming Architecture**: modularidad, tipado con TypeScript sin tipos `any`, inmutabilidad del reducer del carrito.
   - Mencionar las reglas de seguridad de Firestore y la función Serverless en Vercel.

5. **Minuto 5 — Pruebas y Preguntas:**
   - Mostrar la terminal con `npm run typecheck` (0 errores) y `npm test` (19/19 tests pasando).
   - Quedar a disposición del jurado para preguntas técnicas.

---

## 10. Índice de Grabaciones de Clases y Material de Estudio

Todas las grabaciones del módulo fueron descargadas en formato MP4 en alta definición en la carpeta local [`C:/Users/stive/henry_m5_estudio/videos_grabaciones`](file:///C:/Users/stive/henry_m5_estudio/videos_grabaciones):

| # | Archivo Local | Peso | Tema y Contenido Principal |
| :-: | :--- | :-: | :--- |
| **01** | `01_2026-10-05_Kick_Off_AI_Driven_Web_Development.mp4` | 261 MB | Kick-off M5, estándares de desarrollo asistido por IA, arquitectura moderna. |
| **02** | `02_2026-10-08_Organizacion_Proyectos_y_Contexto_Avanzado.mp4` | 266 MB | Screaming Architecture, separación por capas, modularidad en React. |
| **03** | `03_2026-10-13_Diseno_de_Datos_y_Firestore.mp4` | 247 MB | Modelado NoSQL, colecciones en Firestore, índices y listeners en vivo. |
| **04** | `04_2026-10-15_Componentes_Reutilizables_y_Props_Avanzadas.mp4` | 263 MB | Componentes UI accesibles, tipado de props con TypeScript genérico. |
| **05** | `05_2026-10-19_Catalogo_de_Productos_y_Filtrado.mp4` | 360 MB | Catálogo dinámico, debounce en inputs de búsqueda y filtros combinados. |
| **06** | `06_2026-10-22_Carrito_de_Compras_Context_y_Reducer.mp4` | 268 MB | Context API + `useReducer`, inmutabilidad, acciones y persistencia `localStorage`. |
| **07** | `07_2026-10-26_Autenticacion_Firebase_y_Roles.mp4` | 235 MB | Firebase Auth, RBAC (`customer` vs `admin`), rutas protegidas (`ProtectedRoute`). |
| **08** | `08_2026-10-29_Panel_de_Administracion_CRUD_Productos.mp4` | 240 MB | Panel Admin, formularios controlados, validación de stock y operaciones CRUD. |
| **09** | `09_2026-11-02_Checkout_Flow_y_Gestion_de_Orders.mp4` | 269 MB | Pasarela de checkout, cálculo de impuestos, creación y trazabilidad de órdenes. |
| **10** | `10_2026-11-05_AWS_S3_Presigned_URLs_y_Serverless.mp4` | 267 MB | Serverless functions, firmas criptográficas para AWS S3 y subida PUT binaria. |
| **11** | `11_2026-11-09_Testing_Avanzado_y_Deployment_Vercel.mp4` | 221 MB | Vitest, React Testing Library, mocks, CI/CD y despliegue a producción en Vercel. |

---

> **Autor:** Stiven Zabala  
> **Proyecto:** Henry Full Stack IA — Proyecto Integrador M5  
> **Despliegue Oficial:** [https://henry-m5-ecommerce.vercel.app](https://henry-m5-ecommerce.vercel.app)
