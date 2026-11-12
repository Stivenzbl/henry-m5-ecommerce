# 🎨 Sistema de Diseño y Experiencia de Usuario — Aurora Obsidian

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Tokens:** `src/config/designTokens.ts`  
> **Fecha:** 12 de Noviembre de 2026  

---

## 1. 📋 Implementado

1. **Tokens Centralizados (`src/config/designTokens.ts`):**
   - **Paleta de Colores:** Fondo oscuro profundo (`#030712`), fondo base (`#0B0F19`), superficies de tarjetas (`#111827`), bordes sutiles (`rgba(255,255,255,0.08)`), y acento corporativo Índigo (`#6366F1`) y Violeta (`#8B5CF6`).
   - **Tipografía:** Escala modular con `Inter` como fuente sans y `JetBrains Mono` para códigos y números de orden.
   - **Radios y Sombras:** Radios consistentes (`md: 8px`, `lg: 12px`, `xl: 16px`, `2xl: 24px`) y efectos de resplandor `glow` para elementos activos.
   - **Capas Z-Index:** Jerarquía ordenada de elevación (`drawer: 40`, `modalBackdrop: 50`, `modalContent: 60`, `toast: 70`).

2. **Diseño Editorial del Login (`src/pages/LoginView.tsx`):**
   - **Desktop:** Composición de dos columnas con panel de identidad de marca a la izquierda y formulario enfocado a la derecha.
   - **Mobile-First:** Adaptación automática a pantallas estrechas de 375 px sin desbordamiento horizontal (`overflow-x-hidden`).
   - **Microinteracciones y Accesibilidad:** Indicadores de foco visibles (`focus:ring-2 focus:ring-indigo-500`), atributos ARIA (`aria-label`, `aria-live`), y toggle para visualizar contraseñas.

3. **Componentes Visuales Clave:**
   - [`Navbar.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/components/Navbar.tsx): Barra de navegación con avatar de iniciales reactivo y badge animado de ítems en carrito.
   - [`ProductCard.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/components/ProductCard.tsx): Tarjeta de producto con indicadores de stock bajo, estrellas de calificación y feedback de adición inmediata.
   - [`CartDrawer.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/components/CartDrawer.tsx): Carrito deslizante con actualización de cantidades en tiempo real.
   - [`ForbiddenView.tsx`](file:///C:/Users/stive/henry_proyecto_m5_ecommerce/src/components/ForbiddenView.tsx): Pantalla editorial informativa de error 403 con opción de retorno al catálogo.

---

## 2. 🧪 Probado

1. **Pruebas de Componentes UI en Vitest:**
   - `ProductCard.test.tsx` (5 tests): Renderizado de precio, imagen, categoría, badge de stock bajo cuando `stock <= 5`, y cambio de estado del botón a *"Agregado"*.
   - `ProtectedRoute.test.tsx` (3 tests): Renderizado visual de `ForbiddenView` cuando el usuario carece de permisos.
2. **Pruebas de Accesibilidad:**
   - Navegación completa por teclado (Tab, Enter, Escape) en modales y formularios.
   - Contraste de texto conforme a **WCAG 2.2 Nivel AA** (> 4.5:1 en textos principales sobre fondo oscuro).

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Modo Claro / Oscuro Conmutable:** Implementar toggle dinámico `dark/light` con almacenamiento de preferencia en `localStorage`.
2. **Skeleton Loaders:** Sustituir los spinners de carga con esqueletos animados que imiten la estructura de las tarjetas de producto durante la hidratación inicial.

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Percepción Estética Subjetiva:** La apreciación visual de la identidad Aurora Obsidian puede variar según el monitor, calibración de color o preferencias del evaluador humano.
