# Integraciones

## Sanity

Uso:

- CMS embebido en `/admin/contenido`
- contenido editorial para home, about, blog y site settings

Archivos:

- [sanity.config.ts](../sanity.config.ts)
- [sanity.cli.ts](../sanity.cli.ts)
- [src/sanity/structure.ts](../src/sanity/structure.ts)

## Cal.com

Uso:

- slots disponibles
- booking real
- integracion con `eventTypeId` por servicio

Archivos:

- [src/lib/calcom.ts](../src/lib/calcom.ts)
- [src/lib/calcom-event-types.ts](../src/lib/calcom-event-types.ts)
- [src/app/api/scheduling/book/route.ts](../src/app/api/scheduling/book/route.ts)

Notas:

- El mapping principal hoy es `serviceId -> eventTypeId`.
- Si falta configuracion, la API responde error claro.
- Solo hay mock si `ALLOW_MOCK_INTEGRATIONS=true`.

## PayPal

Uso:

- creacion server-side de orden
- captura server-side
- persistencia real del pedido
- descuento de stock para productos fisicos

Archivos:

- [src/lib/paypal-server.ts](../src/lib/paypal-server.ts)
- [src/lib/store.ts](../src/lib/store.ts)
- [src/app/api/store/checkout/create-order/route.ts](../src/app/api/store/checkout/create-order/route.ts)
- [src/app/api/store/checkout/capture-order/route.ts](../src/app/api/store/checkout/capture-order/route.ts)

## Exchange Rate

Uso:

- conversion COP -> USD para PayPal

Archivo:

- [src/lib/exchange-rate.ts](../src/lib/exchange-rate.ts)

Notas:

- intenta tasa dinamica
- cae a `PAYPAL_COP_TO_USD_RATE` si la API externa falla

## WhatsApp / Twilio

Uso:

- recordatorios de citas

Archivo:

- [src/lib/whatsapp.ts](../src/lib/whatsapp.ts)

Cron:

- [src/app/api/cron/reminders/route.ts](../src/app/api/cron/reminders/route.ts)

Notas:

- Solo hay mock si `ALLOW_MOCK_INTEGRATIONS=true`.
- Si el canal no esta configurado, no debe asumirse entrega real.

## Password Reset

Uso:

- solicitud de token
- reseteo real de password

Archivos:

- [src/lib/password-reset.ts](../src/lib/password-reset.ts)
- [src/app/api/auth/forgot-password/route.ts](../src/app/api/auth/forgot-password/route.ts)
- [src/app/api/auth/reset-password/route.ts](../src/app/api/auth/reset-password/route.ts)

Notas:

- Con `Resend` configurado envía correo real.
- Sin `Resend`, en desarrollo cae a preview/log para no bloquear pruebas.
