# 🎨 Auditoría de Experiencia de Usuario (UX/UI & A11y) — Patagonix Retail

> **Objetivo:** Identificar fricciones, fallos de navegación responsiva, problemas de accesibilidad (WCAG 2.2) e inconsistencias visuales.

---

## 1. Hallazgos de UX y Accesibilidad

### 🔴 UX-01 [P0] — Navegación Oculta en Dispositivos Móviles (<640px)
- **Archivo:** `src/components/Navbar.tsx` (línea 36)
- **Código:**
  ```tsx
  <nav className="hidden sm:flex items-center space-x-1">
  ```
- **Problema:** En pantallas pequeñas (320px–639px), los enlaces a "Catálogo", "Mis Órdenes" y "Panel Admin" desaparecen por completo sin que exista un botón de menú tipo hamburguesa ni una barra de navegación inferior (*bottom navigation bar*). El usuario móvil queda atrapado sin poder navegar entre vistas.
- **Solución Propuesta:** Implementar un menú móvil desplegable o una barra de navegación fija accesible con íconos y etiquetas claras.

---

### 🟡 UX-02 [P1] — Falta de Semántica y Navegación por Teclado en `ProductCard`
- **Archivo:** `src/components/ProductCard.tsx` (línea 29)
- **Código:**
  ```tsx
  <div onClick={handleCardClick} className="group bg-white rounded-2xl ... cursor-pointer">
  ```
- **Problema:** La tarjeta completa actúa como disparador de acción mediante un `div` con `onClick`. Carece de `role="button"`, `tabIndex={0}`, y no maneja eventos de teclado (`onKeyDown` para `Enter` o `Space`). Los usuarios que navegan mediante teclado o lectores de pantalla (tecla Tab) no pueden acceder al detalle ni a las reseñas. Además, contiene un botón anidado ("Agregar"), lo que viola la especificación HTML de controles anidados interactivos.
- **Solución Propuesta:** Separar el disparador de vista de detalle en un enlace/botón semántico explícito o asignar accesibilidad ARIA completa con teclas de activación.

---

### 🟡 UX-03 [P1] — Textos y Dirección Ficticia en Checkout
- **Archivo:** `src/pages/CheckoutModal.tsx`
- **Problema:** El formulario precarga por defecto `"Av. Siempre Viva 742, Santiago, Chile"`, lo cual resta profesionalismo y seriedad corporativa a la solución.
- **Solución Propuesta:** Iniciar los campos vacíos con placeholders orientativos, permitir al usuario ingresar su dirección real o una dirección de prueba representativa de Colombia/LATAM, y mostrar un badge transparente de **"Modo Demostración — No se cobra dinero real"**.

---

### 🟡 UX-04 [P1] — Retroalimentación en Búsqueda Vacía
- **Archivo:** `src/pages/CatalogView.tsx`
- **Problema:** Cuando el usuario busca un término que no arroja resultados (ej. "Zapatos Espaciales"), la grilla simplemente desaparece sin mostrar un mensaje empático ni un botón para limpiar el filtro.
- **Solución Propuesta:** Agregar un estado vacío (*empty state*) elegante con ícono, mensaje explicativo y botón directo de "Restablecer filtros".

---

### 🟢 UX-05 [P2] — Veracidad de Reseñas de Clientes (Extra Credit 3)
- **Archivo:** `src/components/ProductDetailModal.tsx`
- **Problema:** Las opiniones sembradas muestran el badge "Comprador verificado" sin comprobar si el usuario efectivamente adquirió ese producto en una orden previa.
- **Solución Propuesta:** Para el modo demo, etiquetar las opiniones muestra como "Reseñas de muestra (Demo)" y verificar en `OrderService` si el usuario activo tiene una orden con ese `productId` antes de asignarle el badge "Comprador verificado" a su nueva reseña.
