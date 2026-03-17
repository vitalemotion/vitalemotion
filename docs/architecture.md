# Arquitectura

## Modelo General

El proyecto usa una arquitectura hibrida:

- `Next.js App Router` para UI y APIs
- `Prisma/PostgreSQL` para datos transaccionales
- `Sanity` para contenido editorial

## Ownership De Datos

### Sanity

Contenido administrado en `Sanity Studio`:

- homepage
- pagina nosotros
- site settings
- blog

Archivos clave:

- [src/sanity/schemaTypes/post.ts](../src/sanity/schemaTypes/post.ts)
- [src/sanity/schemaTypes/homePage.ts](../src/sanity/schemaTypes/homePage.ts)
- [src/sanity/schemaTypes/aboutPage.ts](../src/sanity/schemaTypes/aboutPage.ts)
- [src/sanity/schemaTypes/siteSettings.ts](../src/sanity/schemaTypes/siteSettings.ts)
- [src/sanity/lib/content.ts](../src/sanity/lib/content.ts)

### Prisma / PostgreSQL

Datos operativos:

- auth y roles
- pacientes y psicologos
- servicios
- citas
- productos
- pedidos
- configuracion operativa

## Rutas

### Publico

- `/`
- `/nosotros`
- `/servicios`
- `/agendar`
- `/tienda`
- `/blog`
- `/contacto`

### Auth

- `/login`
- `/registro`
- `/reset-password`

### Admin

- `/admin`
- `/admin/citas`
- `/admin/productos`
- `/admin/pedidos`
- `/admin/equipo`
- `/admin/configuracion`
- `/admin/contenido`

### Portal

- `/portal`
- `/portal/citas`
- `/portal/compras`
- `/portal/perfil`

## Seguridad

### Proteccion De Paginas

[src/proxy.ts](../src/proxy.ts)

- `/admin/*`: requiere sesion y rol `ADMIN` o `PSYCHOLOGIST`
- `/portal/*`: requiere sesion y rol `PATIENT`

### Proteccion De APIs

[src/lib/route.ts](../src/lib/route.ts)

Helpers principales:

- `requireSession()`
- `requireRole()`
- `requireDatabase()`
- `handleRouteError()`

## Fallbacks

Las paginas editoriales usan `Sanity` primero. Si `Sanity` no esta disponible:

- blog puede caer a Prisma o placeholders
- home/about/contact pueden caer a valores locales y `SiteConfig`

Las integraciones externas no mockean silenciosamente por defecto. Eso queda controlado por:

- `ALLOW_MOCK_INTEGRATIONS`
- `ALLOW_MOCK_SCHEDULING_DATA`

## Build Y Performance

- El sitio publico sigue siendo server-rendered con App Router.
- El Studio de Sanity vive dentro del mismo proyecto, asi que el build de produccion es mas pesado.
- `next build` puede tardar sensiblemente mas desde que el Studio forma parte del bundle.
