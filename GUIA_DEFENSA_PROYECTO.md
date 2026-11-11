# 🎯 Guía Maestra para la Defensa en Vivo — Proyecto Integrador M5
**Estudiante:** Stiven Zabala  
**Cohorte:** Webpt35  
**Especialización:** Front-End (AI-Driven E-Commerce)  
**Calificación Objetivo:** 100 / 100 (Excepcional 🚀 + Extra Credits)

---

## ⏱️ Estructura del Tiempo de Presentación (15 - 20 minutos recomendados)

| Minutos | Sección | Objetivo Principal |
| :---: | :--- | :--- |
| **00 - 02** | **Introducción y Contexto** | Presentar a Patagonix Tech, el requerimiento del cliente y el stack técnico. |
| **02 - 07** | **Demo en Vivo (Customer & Admin)** | Flujo de compra completo, catálogo paginado, reviews, y gestión de admin. |
| **07 - 12** | **Arquitectura y Decisiones Técnicas** | Screaming architecture, Context + useReducer, S3 Presigned URLs y seguridad. |
| **12 - 15** | **Uso de IA y Bitácora** | Explicar cómo la IA fue un copiloto de toma de decisiones y no solo generador. |
| **15 - 20** | **Preguntas y Respuestas del Jurado** | Responder con solvencia usando los argumentos preparados. |

---

## 🎬 Paso a Paso del "Live Demo"

### 1. Experiencia del Cliente (Customer Flow)
1. **Mostrar Catálogo:**
   - Destacar el diseño **Mobile-First** responsivo.
   - Mostrar la búsqueda por nombre: escribir *"auriculares"* y explicar que el hook `useDebounce` retrasa la evaluación 300ms para no sobrecargar el render.
   - Demostrar el filtro de categorías (*Electrónica*, *Calzado*, etc.).
2. **Mostrar Extra Credit 2 (Paginación de Productos):**
   - Cambiar el selector de items por página (de 6 a 12).
   - Navegar entre la página 1 y la página 2 con los controles.
   - Mostrar cómo al buscar o cambiar de categoría, la página vuelve automáticamente a la página 1.
3. **Mostrar Extra Credit 3 (Reviews y Calificaciones):**
   - Hacer clic en un producto (ej. *"Auriculares Inalámbricos Pro"*).
   - Se abre el modal `ProductDetailModal` con la foto en alta resolución, stock restante y opiniones de clientes.
   - Enviar una nueva reseña interactiva seleccionando 5 estrellas y escribiendo un comentario breve: *"Excelente producto, llegó rápido"*.
   - Mostrar cómo el promedio de estrellas y el contador de opiniones se actualizan en tiempo real.
4. **Carrito y Checkout Flow:**
   - Agregar 2 unidades al carrito.
   - Abrir el drawer lateral del carrito: modificar cantidades y mostrar el cálculo automático de subtotales e impuestos.
   - Hacer clic en *"Proceder al Pago"*.
   - Completar el formulario de envío (dirección, ciudad, código postal) y seleccionar método de pago simulado.
   - Confirmar pedido. El carrito se vacía automáticamente y se redirige a la vista *"Mis Órdenes"*.
5. **Historial de Órdenes:**
   - Mostrar la orden recién creada con su ID único, estado *"Pendiente"*, desglose de productos y fecha.

---

### 2. Experiencia del Administrador (Admin Flow)
1. **Alternar Rol:**
   - Hacer clic en el selector rápido de rol en el Navbar: *"Cambiar a Admin"*.
   - Aparece el botón *"Panel Admin"* (restringido para clientes).
2. **Mostrar Extra Credit 1 (Dashboard de Analytics):**
   - Mostrar las métricas en tiempo real:
     - Ingresos Totales acumulados ($).
     - Total de Órdenes y desglose por estado.
     - Ticket Promedio (AOV).
     - Valor del inventario y unidades en stock.
   - Explicar el gráfico de distribución de ventas por categoría y el ranking de productos más vendidos.
3. **CRUD de Productos y AWS S3:**
   - Ir a la pestaña *"Productos"*.
   - Hacer clic en *"Nuevo Producto"*.
   - Explicar la subida de imagen con el botón *"Subir archivo a S3"*: detallar cómo la Serverless Function genera la URL prefirmada para que el navegador suba el archivo directamente a AWS S3 sin exponer claves.
4. **Gestión de Órdenes:**
   - Ir a la pestaña *"Órdenes"*.
   - Filtrar órdenes por estado (*Pendientes*, *En Proceso*, *Completadas*).
   - Cambiar el estado de la orden del cliente de *"Pendiente"* a *"En Proceso"* o *"Completada"*.
   - Volver a la vista del cliente para mostrar que el estado se actualizó de inmediato.

---

## 💡 Preguntas Típicas del Jurado y Respuestas Clave

### P1: ¿Por qué usaste `useReducer` con Context API en lugar de `useState` o una librería externa como Zustand o Redux?
> **Respuesta modelo:**  
> *"Elegí `useReducer` nativo porque el carrito de compras es un dominio con múltiples acciones interdependientes: agregar producto incrementando cantidad si ya existe, decrementar, validar stock, calcular subtotales y vaciar el carrito tras el checkout.  
> Con `useReducer`, toda esa lógica está centralizada en una función pura (`cartReducer`) desacoplada del UI. Esto nos permite garantizar que dado un estado y una acción, el resultado siempre sea determinista. Además, facilitó escribir 8 tests unitarios en Vitest que se ejecutan en milisegundos sin sobrecargar el bundle de la aplicación con librerías pesadas."*

---

### P2: ¿Cómo garantizas la seguridad al subir fotos a AWS S3 desde el navegador?
> **Respuesta modelo:**  
> *"El frontend de React jamás conoce `AWS_ACCESS_KEY_ID` ni `AWS_SECRET_ACCESS_KEY`. Si las pusiéramos en el frontend, cualquier usuario podría inspeccionar el código de Vite y robar las credenciales de AWS.  
> En su lugar, el frontend hace un `POST` a nuestra Serverless Function de Vercel (`/api/s3-presign`). Esta función corre en el backend y es la única que tiene acceso seguro a las variables de entorno de AWS. La función firma una URL temporal con método `PUT` válida por solo 5 minutos. Luego, el navegador usa esa URL para subir el archivo binario directamente al bucket de S3 sin intermediarios ni costo de transferencia de datos en nuestro servidor."*

---

### P3: ¿Cómo manejas el estado intermedio cuando el usuario recarga la página y se está leyendo su rol desde Firestore?
> **Respuesta modelo:**  
> *"Ese es un edge case crítico de autenticación. Si el componente de rutas protegidas evalúa el rol de inmediato en el primer render, verá que `user.role` es `undefined` y redirigirá al usuario injustamente al login antes de que la consulta asíncrona a Firestore termine.  
> Para resolverlo, en `AuthContext` expongo un flag `isLoading: boolean`. La aplicación muestra un estado de carga visual neutro y bloquea la decisión de enrutamiento hasta que la sesión de Firebase y el rol del documento en Firestore están 100% hidratados."*

---

### P4: ¿Cómo fue tu experiencia utilizando IA durante este módulo?
> **Respuesta modelo:**  
> *"La IA la utilicé como un compañero de arquitectura técnica y code review. En el README documenté una bitácora con 6 casos reales.  
> Por ejemplo, cuando evaluamos la estrategia de testing, le pedí a la IA comparar pruebas de componentes completas versus aislar los reducers y usar `renderHook`. La IA me ayudó a identificar que probar funciones puras y hooks de forma aislada ofrece mayor velocidad de ejecución y menor fragilidad ante cambios de diseño. También la utilicé para validar las reglas de seguridad de Firestore y diseñar la estructura de los cálculos memoizados del dashboard de analytics."*

---

## 🏆 Checklist Rápido antes de Prender Cámara
- [ ] Servidor local corriendo (`npm run dev`) en `http://localhost:5173`.
- [ ] Consola del navegador limpia de errores (`F12` > Console).
- [ ] Terminal abierta mostrando que todos los tests pasan con éxito (`npm test`: 19 passed).
- [ ] Repositorio de GitHub abierto con el `README.md` formateado.
- [ ] Buena iluminación, audio claro y actitud positiva y segura.
