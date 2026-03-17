# Vital Emocion Implementation Plan

> Historical archive.
> This file is preserved only as a record of the original implementation intent from 2026-03-10.
> It is not the current setup, deployment, or operational guide.

## Current Source Of Truth

Use these files instead:

- `README.md`
- `docs/setup.md`
- `docs/architecture.md`
- `docs/integrations.md`
- `docs/content-management.md`

## Why This Plan Was Archived

The original implementation plan no longer reflects the current codebase. Since then, the project changed substantially:

- `Sanity Studio` was embedded into the app at `/admin/contenido`
- route protection moved to `src/proxy.ts`
- server-side authorization was added to private API routes
- PayPal checkout moved to server-side order creation and capture
- password reset became a real token-based flow
- scheduling, reminders, and integration mocks were hardened
- the environment variable surface grew beyond the original plan

## Sanitization Note

Any previously embedded secrets or real credentials were intentionally removed from this archived document.

## Historical Scope Summary

The original plan aimed to build:

- a premium animated public website
- appointment scheduling with Cal.com
- a store with PayPal checkout
- an admin panel
- a patient portal

That intent is still broadly valid, but the execution details in the original plan are obsolete.
