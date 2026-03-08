# Marvel Studios Timeline

Calendario actualizado con los próximos estrenos de películas y series de Marvel Studios. Consulta fechas, pósters y enlaces a IMDb de cada título.

🔗 **[marvel.ajra.es](https://marvel.ajra.es)**

![Marvel Studios Timeline](assets/images/image05.jpg)

## Cómo funciona

- Los datos se obtienen dinámicamente desde **Airtable** (tabla `eventos`, filtrados por franquicia Marvel y fechas futuras)
- Cada título se muestra como una tarjeta con póster, tipo (película/serie), fecha de estreno y enlace a IMDb
- Las tarjetas alternan su disposición (imagen-texto / texto-imagen) para dar ritmo visual
- Diseño responsive con breakpoint a 736px
- Caché local de 1 hora para reducir peticiones a la API

## Stack

- HTML, CSS y JavaScript vanilla (sin frameworks ni build tools)
- Airtable como backend de datos
- GitHub Pages para el hosting

## Desarrollo local

```bash
python3 -m http.server
```

Abrir `http://localhost:8000`.

## Autor

Desarrollado por [AJRA](https://ajra.es)
