# Donde Mario — Astro

El sitio está en `src/pages/index.astro`. Los estilos originales están en
`src/styles/global.css`; las cartas y sucursales, en `src/data/restaurant.json`.
Las imágenes publicadas están en `public/assets/`.

El archivo `Main.dc.html`, `assets/`, `support.js` y `vendor/` conservan la
referencia original. No se incluyen en el sitio generado.

## Desarrollo

Usar Node.js 22.12 o superior (en Vercel, Node.js 24.x).

```sh
npm ci
npm run dev
```

## Producción

```sh
npm run build
npm run preview
```

## Vercel

Importar el repositorio con esta carpeta como raíz del proyecto.
La configuración `vercel.json` establece:

- Framework: Astro
- Build command: `npm run build`
- Output directory: `dist`

No requiere variables de entorno ni adaptador de servidor. Las fuentes
Antonio y Outfit se cargan de Google Fonts, como en el diseño original.

Documentación: https://docs.astro.build/en/guides/deploy/vercel/

## Dependencias

La auditoría de npm reporta un aviso de `http-cache-semantics` (dependencia
de Astro, GHSA-ch52-4w7c-c8xp). Al preparar esta migración no había una versión
corregida publicada. El sitio se genera estáticamente: esta dependencia no
forma parte del JavaScript enviado al navegador ni hay un servidor Astro
ejecutándose en Vercel. Revisar la actualización de Astro cuando haya corrección.
