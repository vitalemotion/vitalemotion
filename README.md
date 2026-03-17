# Vital Emocion

Sitio web para una practica de psicologia con:

- marketing publico con animaciones GSAP
- agenda de citas con Cal.com
- tienda con checkout PayPal server-side
- portal de pacientes
- panel admin
- CMS editorial con Sanity

## Stack

| Capa | Tecnologia |
| --- | --- |
| Frontend | Next.js 16 App Router + React 19 |
| Estilos | Tailwind CSS 4 |
| Animacion | GSAP 3 + ScrollTrigger |
| Auth | NextAuth |
| Datos transaccionales | PostgreSQL + Prisma |
| CMS editorial | Sanity Studio embebido |
| Scheduling | Cal.com |
| Pagos | PayPal |
| Recordatorios | Twilio WhatsApp |
| Estado cliente | Zustand |

## Estado Actual

La app usa un modelo hibrido:

- `Sanity` gestiona contenido editorial de marca: home, about, site settings y blog.
- `Prisma/Postgres` gestiona lo transaccional: usuarios, pacientes, psicologos, servicios, citas, pedidos, productos y auth.

Si `Sanity` no esta configurado, las paginas editoriales caen a datos de base de datos o placeholders y el sitio sigue levantando.

## Quick Start

1. Instala dependencias:

```bash
npm install
```

2. Crea tu entorno local:

```bash
cp .env.example .env.local
```

3. Configura la base de datos y genera Prisma:

```bash
npx prisma generate
npx prisma db push
```

4. Opcionalmente carga datos semilla:

```bash
npx prisma db seed
```

5. Levanta la app:

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo local |
| `npm run build` | Build de produccion |
| `npm run start` | Servir build de produccion |
| `npm run lint` | ESLint |
| `npm run sanity` | CLI de Sanity |
| `npx prisma generate` | Generar cliente Prisma |
| `npx prisma db push` | Aplicar schema a la DB |
| `npx prisma db seed` | Poblar datos base |

## Variables De Entorno

Las variables actuales estan documentadas en [.env.example](./.env.example).

Grupos principales:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`
- `CALCOM_*`
- `PAYPAL_*`, `EXCHANGE_RATE_*`
- `TWILIO_*`
- `CRON_SECRET`
- `RESEND_*`
- `ALLOW_MOCK_INTEGRATIONS`, `ALLOW_MOCK_SCHEDULING_DATA`

## Sanity CMS

El Studio vive dentro de la app en `/admin/contenido`.

Contenido actual en Sanity:

- `siteSettings`
- `homePage`
- `aboutPage`
- `post`

Requisitos para usarlo:

- usuario autenticado con acceso a `/admin`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

## Credenciales Seed

Si ejecutas el seed, quedan usuarios de desarrollo:

- admin: `admin@vitalemocion.com` / `admin123`
- psicólogos: `maria@vitalemocion.com`, `carlos@vitalemocion.com`, `laura@vitalemocion.com` / `psych123`
- pacientes: `maria.garcia@email.com`, `andres@email.com` / `patient123`

## Arquitectura Rapida

```text
src/app/(public)   -> marketing, blog, contacto, tienda, agendar
src/app/(auth)     -> login, registro, reset-password
src/app/admin      -> backoffice y Sanity Studio
src/app/portal     -> portal del paciente
src/app/api        -> auth, scheduling, store, admin, portal, cron
src/sanity         -> schemas, structure, cliente y lectura editorial
src/lib            -> auth, db, route guards, paypal, calcom, whatsapp, scheduling
prisma             -> schema + seed
```

Proteccion de rutas:

- `/admin/*` -> `ADMIN` y `PSYCHOLOGIST`
- `/portal/*` -> `PATIENT`

La proteccion de pagina esta en [src/proxy.ts](./src/proxy.ts) y la proteccion fuerte de APIs privadas esta en [src/lib/route.ts](./src/lib/route.ts).

## Documentacion

- [Indice de docs](docs/README.md)
- [Setup](docs/setup.md)
- [Arquitectura](docs/architecture.md)
- [Integraciones](docs/integrations.md)
- [Contenido Editorial](docs/content-management.md)

Los archivos de `docs/plans/` quedan como referencia historica, no como fuente de verdad operativa.
