# Vital Emocion

Referencia interna rapida para trabajar sobre el repo.

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm run sanity
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Arquitectura

```text
src/app/(public)   -> marketing, blog, tienda, agendar, contacto
src/app/(auth)     -> login, registro, reset-password
src/app/admin      -> panel administrativo + Sanity Studio
src/app/portal     -> portal del paciente
src/app/api        -> auth, scheduling, store, admin, portal, cron
src/sanity         -> schemas, structure, cliente, lectura editorial
src/lib            -> auth, db, paypal, calcom, whatsapp, route guards
prisma             -> schema + seed
```

## Reglas Practicas

- El contenido editorial vive en `Sanity`.
- Lo transaccional vive en `Prisma/Postgres`.
- `Sanity Studio` esta en `/admin/contenido`.
- La proteccion de paginas esta en `src/proxy.ts`.
- La proteccion real de APIs privadas esta en `src/lib/route.ts`.

## Integraciones

- `Cal.com`: `src/lib/calcom.ts` y `src/lib/calcom-event-types.ts`
- `PayPal`: `src/lib/paypal-server.ts`
- `Exchange rate`: `src/lib/exchange-rate.ts`
- `WhatsApp`: `src/lib/whatsapp.ts`
- `Password reset`: `src/lib/password-reset.ts`

## Variables Importantes

Revisa `.env.example` para la lista completa.

Especialmente:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `CALCOM_EVENT_TYPE_IDS`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `ALLOW_MOCK_INTEGRATIONS`
- `ALLOW_MOCK_SCHEDULING_DATA`

## Produccion

- **URL**: `https://somos-vital-emocion.vercel.app`
- **DB**: Supabase Session Pooler (puerto 5432, IPv4)
- **Repo**: `vitalemotion/vitalemocion` (GitHub, publico)
- **Deploy**: push a `main` → Vercel auto-deploy
- **Cron**: solo diarios en Hobby plan (`0 8 * * *`)
- Ver `docs/deployment.md` para gotchas y detalles completos.

## Notas

- El build puede tardar mas desde que `Sanity Studio` forma parte del proyecto.
- `postinstall` ejecuta `prisma generate` automaticamente.
- `prisma/seed.ts` esta excluido de `tsconfig.json` (no es parte de la app).
- No documentar secretos reales en el repo.
- `docs/` es la fuente de verdad documental; `docs/plans/` queda como archivo historico.
