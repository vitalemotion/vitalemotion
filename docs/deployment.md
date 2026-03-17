# Deployment

## Infraestructura Actual

| Servicio | Proveedor | Plan | Detalle |
| --- | --- | --- | --- |
| Hosting | Vercel | Hobby | Proyecto: `somos-vital-emocion` |
| Base de datos | Supabase | Free | Proyecto: `kwltnicddtodzyyjhifm` |
| Repositorio | GitHub | Public | Org: `vitalemotion/vitalemotion` |

URL de produccion: `https://somos-vital-emocion.vercel.app`

## Configuracion De Vercel

### Variables De Entorno En Produccion

| Variable | Valor / Notas |
| --- | --- |
| `DATABASE_URL` | Session Pooler de Supabase (puerto 5432) |
| `NEXTAUTH_SECRET` | Secreto unico de produccion |
| `NEXTAUTH_URL` | `https://somos-vital-emocion.vercel.app` |
| `ALLOW_MOCK_INTEGRATIONS` | `true` (mientras no haya API keys reales) |
| `ALLOW_MOCK_SCHEDULING_DATA` | `true` (mientras no haya Cal.com) |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `test` (mientras no haya PayPal real) |

### Cron

`vercel.json` define un cron diario:

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

El plan Hobby solo permite cron diarios (`0 8 * * *`), no intervalos mas cortos.

## Supabase

### Conexion

Se usa el **Session Pooler** (puerto 5432):

```
postgresql://postgres.[project-ref]:[password]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

Porque:

- Es compatible con IPv4 (requerido por Vercel serverless)
- Funciona correctamente con `PrismaPg` driver adapter
- El Transaction Pooler (puerto 6543) rompe prepared statements de Prisma
- La conexion directa (puerto 5432 en el host directo) es solo IPv6

### Schema

Las tablas se crearon con SQL directo en el SQL Editor de Supabase durante el primer deploy.

Para recrear el schema:

```bash
npx prisma db push
```

O usar el agente `supabase-sql` para generar el SQL equivalente.

## Gotchas Del Deploy

### 1. prisma generate en Vercel

Vercel no ejecuta `prisma generate` automaticamente. Sin el, `@prisma/client` no tiene tipos generados y el build falla con:

```
Type error: Module '"@prisma/client"' has no exported member 'PrismaClient'.
```

**Solucion**: `package.json` tiene `"postinstall": "prisma generate"`.

### 2. seed.ts en tsconfig

`prisma/seed.ts` importa `PrismaClient` pero no es parte de la app. Si `tsconfig.json` incluye `**/*.ts` sin excluir el seed, Next.js lo type-chequea durante el build y falla.

**Solucion**: `tsconfig.json` excluye `prisma/seed.ts`.

### 3. Cron en Hobby plan

Vercel Hobby solo permite cron jobs diarios. Expresiones como `*/30 * * * *` causan error en el deploy.

### 4. Nombre de proyecto en Vercel

Si el nombre deseado ya esta en uso, Vercel lo rechaza silenciosamente o le agrega un sufijo. Verificar el nombre final despues del deploy.

## Flujo De Deploy

1. Push a `main` en GitHub
2. Vercel detecta el push y dispara un build automatico
3. Build: `npm install` -> `postinstall (prisma generate)` -> `next build`
4. Si pasa, el deploy se asigna al dominio de produccion

## Seeding En Produccion

Las tablas estan creadas pero vacias. Para poblar con datos de ejemplo:

```bash
DATABASE_URL="postgresql://postgres.[ref]:[pass]@aws-1-us-east-1.pooler.supabase.com:5432/postgres" npx prisma db seed
```

O ejecutar el contenido de `prisma/seed.ts` adaptado como SQL directo en Supabase.
