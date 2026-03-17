# Contenido Editorial

## Donde Se Edita

El contenido editorial se edita en:

```text
/admin/contenido
```

Ese path monta `Sanity Studio` dentro del mismo proyecto.

## Que Vive En Sanity

### `siteSettings`

Campos principales:

- nombre de marca
- descripcion
- contacto
- redes
- footer

### `homePage`

Campos principales:

- hero
- seccion de servicios destacados
- testimonios
- CTA

### `aboutPage`

Campos principales:

- hero de nosotros
- mision
- titulo de equipo
- filosofia

### `post`

Campos principales:

- titulo
- slug
- excerpt
- autor
- portada
- portable text body

## Fallbacks

Las paginas publicas leen desde `Sanity` pero no dependen ciegamente de el:

- si `Sanity` esta configurado, usan el contenido editorial real
- si no, caen a datos locales, Prisma o placeholders segun la pagina

Eso permite desarrollar sin bloquear el sitio por falta de CMS.

## Flujo Recomendado

1. Configura `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET`.
2. Entra a `/admin/contenido`.
3. Crea o edita:
   - `Configuracion del sitio`
   - `Pagina de inicio`
   - `Pagina nosotros`
   - `Articulo de blog`
4. Publica contenido.
5. Verifica el resultado en las rutas publicas.

## Limites Actuales

Hoy `Sanity` cubre lo editorial, no lo transaccional.

No se debe mover a Sanity:

- auth
- citas
- pedidos
- pagos
- stock
- datos clinicos de pacientes

## Archivos Clave

- [src/sanity/schemaTypes/post.ts](../src/sanity/schemaTypes/post.ts)
- [src/sanity/schemaTypes/homePage.ts](../src/sanity/schemaTypes/homePage.ts)
- [src/sanity/schemaTypes/aboutPage.ts](../src/sanity/schemaTypes/aboutPage.ts)
- [src/sanity/schemaTypes/siteSettings.ts](../src/sanity/schemaTypes/siteSettings.ts)
- [src/sanity/lib/content.ts](../src/sanity/lib/content.ts)
- [src/app/admin/blog/page.tsx](../src/app/admin/blog/page.tsx)
