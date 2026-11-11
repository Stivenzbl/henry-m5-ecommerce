# 11 — Definition of Done / criterios de aceptación

## Producto y UX

- [ ] La identidad Patagonix Retail es consistente en header, catálogo, detalle, carrito, checkout y admin.
- [ ] No hay texto que afirme pagos, auth, Firestore o S3 real si el camino demo está activo.
- [ ] Catálogo comunica cantidad de resultados, filtros, orden y paginación.
- [ ] Hay estados loading, empty y error con acciones útiles.
- [ ] Tarjetas y acciones son navegables por teclado.
- [ ] El usuario entiende qué ocurre al agregar producto, cambiar cantidades o confirmar un pedido.
- [ ] El checkout demo no presenta cargos reales ni guarda datos sensibles innecesarios.
- [ ] Las reviews semilla se identifican como demo.
- [ ] El panel admin y las métricas tienen alcance/datos claramente identificados.

## Responsive

- [ ] Sin overflow horizontal a 320, 375, 768, 1024 y 1440 px.
- [ ] Navegación accesible en móvil; ningún enlace queda escondido sin alternativa.
- [ ] Modales/drawers caben en alturas pequeñas y se pueden cerrar.
- [ ] Tablas/paneles se adaptan sin pérdida de información.
- [ ] Zoom 200% usable.

## Ingeniería

- [ ] `npm run typecheck` PASS.
- [ ] `npm test` PASS.
- [ ] `npm run build` PASS.
- [ ] E2E críticos PASS en local/preview.
- [ ] Sin errores de consola no justificados ni requests rotas en los flujos cubiertos.
- [ ] No se agregaron dependencias sin justificación y revisión de licencia/impacto.
- [ ] README refleja la arquitectura realmente implementada.

## Seguridad

- [ ] El modo demo está explícito y no usa roles como autorización real.
- [ ] No hay credenciales en código, bundle, logs o historial nuevo.
- [ ] Las reglas Firestore (si se habilitan) impiden self-promotion y pasan pruebas negativas en emulador.
- [ ] El endpoint S3 simulado queda deshabilitado o reemplazado con firma real autenticada.
- [ ] Totales/stock/estados de pedidos no se confían al navegador en camino producción.
- [ ] No se realizaron escrituras de prueba sobre producción.

## Accesibilidad y rendimiento

- [ ] Auditoría manual de teclado, foco y lector de pantalla básico completada.
- [ ] axe no reporta violaciones críticas/serias conocidas; cualquier excepción queda documentada.
- [ ] Contrastes revisados con herramienta.
- [ ] Lighthouse móvil registrado, comparado con baseline y sin regresiones relevantes.
- [ ] Imágenes reservan espacio, usan tamaños razonables y no bloquean el LCP.
- [ ] Se respetan `prefers-reduced-motion`.

## Release

- [ ] Branch/commit final identificado.
- [ ] Preview revisado visualmente.
- [ ] Diff revisado; rollback disponible.
- [ ] Producción publicada solo con autorización explícita.
- [ ] Reporte final con pruebas y limitaciones reales.
