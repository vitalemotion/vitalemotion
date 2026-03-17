# Setup

## Requisitos

- Node.js 22+
- npm 10+
- PostgreSQL accesible desde `DATABASE_URL`

Opcional:

- credenciales de Sanity
- credenciales de Cal.com
- credenciales de PayPal
- credenciales de Twilio WhatsApp
- credenciales de Resend para password reset por email

## Instalacion

```bash
npm install          # tambien ejecuta postinstall -> prisma generate
cp .env.example .env.local
npx prisma db push
npx prisma db seed
npm run dev
```

Nota: `prisma generate` se ejecuta automaticamente via `postinstall` en `package.json`.

## Variables De Entorno

### Core

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Si | Prisma/PostgreSQL |
| `NEXTAUTH_SECRET` | Si | Sesiones y JWT |
| `NEXTAUTH_URL` | Si | URL base de auth |

### Sanity

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Para CMS | Proyecto Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Para CMS | Dataset Sanity |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Version de API |
| `SANITY_API_READ_TOKEN` | Opcional | Lectura autenticada si el dataset no es publico |

### Scheduling

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `CALCOM_API_KEY` | Para agenda real | API de Cal.com |
| `CALCOM_API_URL` | No | Base URL de Cal.com |
| `CALCOM_EVENT_TYPE_IDS` | Para booking real | Mapa `serviceId -> eventTypeId` |

### Pagos

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `PAYPAL_CLIENT_ID` | Para checkout real | Credencial server-side |
| `PAYPAL_CLIENT_SECRET` | Para checkout real | Credencial server-side |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Para checkout real | SDK en cliente |
| `PAYPAL_API_BASE_URL` | No | Sandbox o produccion |
| `EXCHANGE_RATE_API_URL` | No | Fuente de tasa COP/USD |
| `EXCHANGE_RATE_CACHE_MS` | No | Cache de tasa |
| `PAYPAL_COP_TO_USD_RATE` | Fallback | Tasa fija si falla la API |

### WhatsApp y Cron

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `TWILIO_ACCOUNT_SID` | Para reminders reales | Twilio |
| `TWILIO_AUTH_TOKEN` | Para reminders reales | Twilio |
| `TWILIO_WHATSAPP_NUMBER` | Para reminders reales | Remitente WhatsApp |
| `CRON_SECRET` | Si usas cron | Protege `/api/cron/reminders` |

### Password Reset

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `RESEND_API_KEY` | Opcional | Envio de email |
| `RESEND_FROM_EMAIL` | Opcional | Remitente del email |

### Mocks De Desarrollo

| Variable | Default | Uso |
| --- | --- | --- |
| `ALLOW_MOCK_INTEGRATIONS` | `false` | Permite mock explicito de integraciones externas |
| `ALLOW_MOCK_SCHEDULING_DATA` | `false` | Permite usar data mock de agenda |

## Sanity

Con las credenciales configuradas, el Studio queda disponible en:

```text
/admin/contenido
```

La app usa Sanity para:

- `siteSettings`
- `homePage`
- `aboutPage`
- `post`

## Base De Datos

Modelos centrales en [prisma/schema.prisma](../prisma/schema.prisma):

- `User`
- `Psychologist`
- `Patient`
- `Service`
- `Appointment`
- `Product`
- `Order`
- `OrderItem`
- `BlogPost`
- `SiteConfig`

## Credenciales Seed

Si ejecutas `npx prisma db seed`, quedan estos accesos locales:

- `admin@vitalemocion.com` / `admin123`
- `maria@vitalemocion.com` / `psych123`
- `carlos@vitalemocion.com` / `psych123`
- `laura@vitalemocion.com` / `psych123`
- `maria.garcia@email.com` / `patient123`
- `andres@email.com` / `patient123`

## Verificacion Recomendada

```bash
npx eslint src prisma scripts sanity.config.ts sanity.cli.ts --ext .ts,.tsx --no-error-on-unmatched-pattern
npx tsc --noEmit --pretty false
npm run build
```

Nota: el build de produccion puede tardar bastante mas que antes porque ahora tambien empaqueta `Sanity Studio`.
