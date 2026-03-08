# Marvel Studios - Plan de Mejoras

## P0 - Seguridad (Crítico)

- [x] **1. Sanitizar datos de Airtable antes de innerHTML** — Función `escapeHTML()` + error genérico
- [x] **2. Eliminar console.log de producción** — Eliminado volcado de datos a consola

> Nota: El token de Airtable expuesto requiere un backend/serverless proxy (Cloudflare Worker, etc.) que está fuera del alcance de cambios puramente frontend. Se documenta como pendiente.

## P1 - SEO y Analytics

- [x] **3. Corregir GA4 page_location** — `marvel.ajra.es` en vez de `marvelstudios.carrd.co`
- [x] **4. Arreglar enlace #start roto** — Añadido `<div id="start">` antes de dynamic-content
- [x] **5. Mejorar `<title>` y meta description** — "Próximos Estrenos Marvel Studios - Películas y Series"
- [x] **6. Añadir canonical, og:url, og:image, Twitter Cards** — Meta tags completos
- [x] **7. Añadir alt text a imagen hero** — Alt descriptivo añadido
- [x] **8. Crear robots.txt y sitemap.xml** — Creados en raíz del proyecto

## P2 - Rendimiento

- [x] **9. Añadir preconnect a dominios externos** — fonts.googleapis.com, fonts.gstatic.com, api.airtable.com
- [x] **10. Lazy loading en imágenes dinámicas** — `loading="lazy"` en pósters
- [x] **11. Mover estilos inyectados por JS a CSS propio** — `app.css` creado, `injectStyles()` eliminado
- [x] **12. Añadir caché localStorage para datos de Airtable** — TTL de 1 hora

## P3 - Usabilidad

- [x] **13. Links sociales del footer con target="_blank"** — Threads, Instagram, Facebook
- [x] **14. Mejorar texto "CONTINUARA"** — "SE ANUNCIARÁN MÁS TÍTULOS PRÓXIMAMENTE"

## Fuera de alcance (requiere infraestructura)

- Token de Airtable expuesto → necesita serverless proxy
- Pre-rendering de contenido para SEO → necesita build step o SSR
- Purgar CSS/JS de Carrd no usado → main.css/main.js no se deben modificar
- PWA manifest + service worker → mejora futura
