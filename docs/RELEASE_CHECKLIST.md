# 🚀 Checklist de Lanzamiento a Producción (Release Checklist)

> **Rama de Trabajo:** `hardening/enterprise-security-core`  
> **Plataforma de Despliegue:** Vercel Edge Network  
> **Fecha:** 12 de Noviembre de 2026  

---

## 1. 📋 Implementado

1. **Gestión de Ramas de Despliegue:**
   - Rama `main`: resguarda la entrega oficial de Henry (commit `692f064`).
   - Rama `hardening/enterprise-security-core`: resguarda el endurecimiento de nivel empresarial con las 32 pruebas y correcciones P0/P1.

2. **Variables de Entorno para Producción:**
   - Frontend (Vite): prefijo obligatorio `VITE_FIREBASE_*`.
   - Backend Serverless (Vercel): variables privadas de AWS S3 (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`) configuradas exclusivamente en Vercel Dashboard sin exponerse al cliente.

3. **Configuración de Rewrites en `vercel.json`:**
   - Enrutamiento SPA hacia `/index.html`.
   - Excepción para `/api/(.*)` preservando la ejecución de Serverless Functions.

---

## 2. 🧪 Probado

- [x] `npm run typecheck` ejecutado con código de salida `0` (0 errores de TypeScript).
- [x] `npm test` ejecutado con código de salida `0` (32 pruebas pasando al 100%).
- [x] `npm run build` ejecutado con código de salida `0` (assets compilados en `dist/`).
- [x] Cero exposición de credenciales privadas de AWS o Firebase en archivos versionados.
- [x] Cero contraseñas de evaluación expuestas en componentes de interfaz.

---

## 3. ⏳ Pendiente (Mejoras Futuras)

1. **Verificación de SHA en Panel de Vercel:**
   - Acceder a Vercel Dashboard > Project Settings > Git.
   - Si se desea que el dominio de producción `https://henry-m5-ecommerce.vercel.app` sirva la versión de hardening empresarial, cambiar la *Production Branch* de `main` a `hardening/enterprise-security-core` (o abrir un Pull Request para fusionar tras la evaluación de Henry).

---

## 4. 🔍 No Verificable (Dependencias de Entorno Externo)

1. **Panel de Vercel de la Cuenta de Stiven:** Desde el entorno local de línea de comandos sin token de Vercel CLI no es posible comprobar directamente qué commit específico tiene asignado el dominio público en los servidores de Vercel. Se requiere acceso con credenciales del usuario a `vercel.com`.
