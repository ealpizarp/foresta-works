# Foresta Works — sitio web

Sitio estático de Foresta Works, construido con [Astro](https://astro.build) 7 y TypeScript estricto. Español de Costa Rica (`/es/`) e inglés (`/en/`), sin base de datos, CMS, autenticación ni renderizado en servidor.

## Requisitos

- Node.js 22.12 o superior (ver `.nvmrc`).

## Comandos

| Comando           | Descripción                                        |
| ----------------- | -------------------------------------------------- |
| `npm install`     | Instala dependencias.                              |
| `npm run dev`     | Servidor de desarrollo en `http://localhost:4321`. |
| `npm run check`   | Verificación de tipos y diagnósticos de Astro.     |
| `npm test`        | Pruebas de rutas, contacto nulo y JSON-LD.         |
| `npm run build`   | Genera el sitio estático en `dist/`.               |
| `npm run preview` | Sirve `dist/` para revisar el build.               |

El build descarga las fuentes desde Fontsource una vez y las guarda en caché (`node_modules/.astro/fonts`); requiere internet la primera vez.

## Idiomas y URLs

Cada página vive bajo `/es/…` o `/en/…`. Los slugs siguen el idioma:

| Clave        | Español              | English            |
| ------------ | -------------------- | ------------------ |
| Inicio       | `/es/`               | `/en/`             |
| Servicios    | `/es/servicios/`     | `/en/services/`    |
| Automatización | `/es/automatizacion/` | `/en/automation/` |
| Proceso      | `/es/proceso/`       | `/en/process/`     |
| Nosotros     | `/es/nosotros/`      | `/en/about/`       |
| Contacto     | `/es/contacto/`      | `/en/contact/`     |

El texto está en `src/i18n/es.ts` y `src/i18n/en.ts`. Los nombres de producto (Arranque, Crecimiento, Inteligente) no se traducen.

`/` y las rutas antiguas sin prefijo (`/servicios`, `/services`, …) redirigen al idioma guardado en la cookie `fw_locale` (en `astro dev` vía middleware; en Cloudflare vía `src/edge/worker.ts`). Sin cookie, el idioma por defecto es español.

`astro.config.ts` solo corrige slugs cruzados (`/en/servicios/` → `/en/services/`). Las URLs sin prefijo no se fijan a español en el build: si lo hicieran, la cookie no podría elegir inglés.

En `astro dev`, la integración `src/edge/dev-locale.ts` se inserta al frente del servidor de Vite para leer la cookie del request de Node. El middleware de Astro en páginas prerenderizadas no ve el header `Cookie` de forma fiable.

## Estructura

```
astro.config.ts             site, i18n, fuentes, sitemap, redirecciones estáticas
vitest.config.ts            alias `@/` para las pruebas
wrangler.jsonc              assets en dist/ + worker de locale
public/                     favicon, manifests, / (redirección por cookie si no hay worker)
src/
  assets/images/            fotos editoriales (astro:assets)
  data/                     negocio, planes, navegación, JSON-LD
  edge/dev-locale.ts        redirecciones con cookie en `astro dev`
  edge/worker.ts            redirecciones con cookie en Cloudflare
  i18n/                     locales, slugs, diccionarios
  layouts/BaseLayout.astro  <head>, SEO, fuentes, header y footer
  middleware.ts             mismas redirecciones en `astro dev`
  pages/[locale]/           una plantilla por slug (es y en)
  templates/                cuerpo compartido de cada página
  components/               header, footer, secciones, UI
  styles/                   tokens y base
```

Las fotos editoriales (posicionamiento, fundador, banda de cierre) pasan por `astro:assets`. Los mockups decorativos del hero siguen en `public/images/mockup/`.

## Datos pendientes de confirmar

Todo lo que el negocio no ha confirmado está en `src/data/site.ts` como `null` con `TODO(business)`. Mientras sea `null`, la interfaz correspondiente no se muestra:

- **WhatsApp** (`contact.whatsappNumber`): botones y formulario de contacto.
- **Correo** (`contact.email`).
- **Horario** (`contact.hoursValue` en ambos diccionarios i18n).
- **Redes** (`social.*`).
- **Dominio de producción**: variable de entorno `SITE_URL` (canonical, Open Graph, sitemap, robots). El valor por defecto en `astro.config.ts` es un placeholder; confírmelo antes del primer deploy indexable.
- **Logo oficial**: se usa el nombre en texto (`Wordmark.astro`) y `public/favicon.svg`.
- **Dirección física**: no va en el JSON-LD hasta confirmar una ubicación pública.

Los montos de permanencia, aviso de cancelación y hora extra viven en `src/data/services.ts` (`subscriptionNumbers`) y se interpolan en las condiciones.

## Formulario de contacto

No hay backend. El formulario es un `GET` a `https://wa.me/<número>`: el texto viaja en `text` y WhatsApp se abre con el mensaje listo. No se almacena nada aquí. Solo se renderiza cuando hay número de WhatsApp.

## Despliegue en Cloudflare Workers

```
npm run build
npx wrangler login      # una sola vez
npx wrangler deploy
```

`wrangler.jsonc` sirve `dist/` y ejecuta `src/edge/worker.ts` primero, para que `/` y las URLs antiguas respeten el idioma guardado. No hay secretos en el repositorio.

`dist/` está en `.gitignore`. No despliegue una carpeta `dist/` vieja: genere el build justo antes de `wrangler deploy`.
