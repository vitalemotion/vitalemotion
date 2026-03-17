# Production Hardening: 72 → 100 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring Vital Emocion from MVP (72/100) to production-ready (100/100) by adding error handling, security, emails, tests, monitoring, GDPR compliance, and verifying all flows in-browser.

**Architecture:** Incremental hardening — each task is independent and commits separately. Security and error handling first, then business features (emails), then quality (tests/monitoring), then verification.

**Tech Stack:** Next.js 16, Vitest, Resend (emails), Sentry (monitoring), Tailwind CSS 4

---

## Phase 1: Security & Error Handling (Tasks 1-5)

### Task 1: Security Headers in next.config.ts

**Files:**
- Modify: `next.config.ts`

**Step 1: Add security headers**

```typescript
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
```

**Step 2: Verify headers**

Run: `curl -I http://localhost:3456/ | grep -i "x-frame\|x-content\|strict\|referrer"`
Expected: All security headers present in response

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: add security headers and image optimization config"
```

---

### Task 2: Error Pages (not-found, error, global-error)

**Files:**
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/global-error.tsx`

**Step 1: Create 404 page**

```tsx
// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-6xl text-primary mb-4">404</h1>
        <h2 className="font-serif text-2xl text-text-primary mb-4">
          Pagina no encontrada
        </h2>
        <p className="text-text-secondary mb-8">
          Lo sentimos, la pagina que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
```

**Step 2: Create error boundary**

```tsx
// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl text-primary mb-4">
          Algo salio mal
        </h1>
        <p className="text-text-secondary mb-8">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Create global error boundary**

```tsx
// src/app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#FAF8F5", color: "#2D2D2D" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#7C9A8E" }}>
              Error del sistema
            </h1>
            <p style={{ color: "#6B6560", marginBottom: "2rem" }}>
              Ha ocurrido un error critico. Por favor, recarga la pagina.
            </p>
            <button
              onClick={reset}
              style={{
                background: "#7C9A8E",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Recargar pagina
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

**Step 4: Commit**

```bash
git add src/app/not-found.tsx src/app/error.tsx src/app/global-error.tsx
git commit -m "feat: add 404, error boundary, and global error pages"
```

---

### Task 3: Rate Limiting Middleware

**Files:**
- Create: `src/lib/rate-limit.ts`
- Modify: `src/app/api/auth/register/route.ts` (add rate limit)
- Modify: `src/app/api/auth/forgot-password/route.ts` (add rate limit)
- Modify: `src/app/api/scheduling/book/route.ts` (add rate limit)
- Modify: `src/app/api/store/checkout/create-order/route.ts` (add rate limit)

**Step 1: Create rate limiter utility**

```typescript
// src/lib/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetTime) rateLimitMap.delete(key);
    }
  }, 5 * 60 * 1000);
}

export function rateLimit(
  identifier: string,
  { maxRequests = 10, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: maxRequests - entry.count };
}

export function getRateLimitHeaders(identifier: string, maxRequests: number) {
  const entry = rateLimitMap.get(identifier);
  return {
    "X-RateLimit-Limit": String(maxRequests),
    "X-RateLimit-Remaining": String(entry ? Math.max(0, maxRequests - entry.count) : maxRequests),
  };
}
```

**Step 2: Apply to critical API routes**

Add to the top of each route handler (register, forgot-password, book, create-order):

```typescript
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

// Inside the POST handler, before any logic:
const headersList = await headers();
const ip = headersList.get("x-forwarded-for") ?? "unknown";
const { success } = rateLimit(`route-name:${ip}`, { maxRequests: 5, windowMs: 60_000 });
if (!success) {
  return Response.json(
    { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
    { status: 429 }
  );
}
```

Limits per route:
- `/api/auth/register` → 5 req/min
- `/api/auth/forgot-password` → 3 req/min
- `/api/scheduling/book` → 10 req/min
- `/api/store/checkout/create-order` → 10 req/min

**Step 3: Commit**

```bash
git add src/lib/rate-limit.ts src/app/api/auth/register/route.ts src/app/api/auth/forgot-password/route.ts src/app/api/scheduling/book/route.ts src/app/api/store/checkout/create-order/route.ts
git commit -m "feat: add in-memory rate limiting to critical API routes"
```

---

### Task 4: Input Sanitization Module

**Files:**
- Create: `src/lib/sanitize.ts`
- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/app/api/scheduling/book/route.ts`
- Modify: `src/app/api/store/checkout/create-order/route.ts`
- Modify: `src/app/api/portal/profile/route.ts`

**Step 1: Create sanitization utility**

```typescript
// src/lib/sanitize.ts

/** Strip HTML tags and encode special chars to prevent XSS */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/** Sanitize an object's string values recursively */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return result;
}

/** Validate and sanitize email */
export function sanitizeEmail(email: string): string | null {
  const clean = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(clean) ? clean : null;
}

/** Validate phone (Colombia format) */
export function sanitizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return null;
  return digits;
}
```

**Step 2: Apply to API routes**

Import and use `sanitizeString`, `sanitizeEmail`, `sanitizeObject` in the routes listed above, replacing raw string inputs.

**Step 3: Commit**

```bash
git add src/lib/sanitize.ts src/app/api/auth/register/route.ts src/app/api/scheduling/book/route.ts src/app/api/store/checkout/create-order/route.ts src/app/api/portal/profile/route.ts
git commit -m "feat: add input sanitization module and apply to API routes"
```

---

### Task 5: Console.log Cleanup

**Files:**
- Modify: All files containing console.log (30 instances across ~10 files)

**Step 1: Replace console.logs with structured approach**

- In integration files (`calcom.ts`, `whatsapp.ts`, `password-reset.ts`): Keep console.warn/error for mock mode detection, remove console.log
- In API routes: Remove all console.log, rely on error responses
- In components: Remove all console.log

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove console.log statements, keep console.warn for mock mode"
```

---

## Phase 2: Email System (Tasks 6-7)

### Task 6: Email Utility Module + Transactional Templates

**Files:**
- Create: `src/lib/email.ts`

**Step 1: Create generic email utility**

```typescript
// src/lib/email.ts

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "Vital Emocion <noreply@vitalemocion.com>";

async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set, logging email to console");
    console.warn(`[email] To: ${to} | Subject: ${subject}`);
    return true;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  return res.ok;
}

// --- Templates ---

const baseStyles = `
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #2D2D2D;
  background-color: #FAF8F5;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const headerStyle = `
  font-family: 'Playfair Display', Georgia, serif;
  color: #7C9A8E;
  font-size: 24px;
  margin-bottom: 24px;
`;

function wrap(title: string, content: string): string {
  return `
    <div style="${baseStyles}">
      <h1 style="${headerStyle}">${title}</h1>
      ${content}
      <hr style="border: none; border-top: 1px solid #E8DDD3; margin: 32px 0;" />
      <p style="font-size: 12px; color: #9E9891;">
        Vital Emocion — Bienestar Psicologico<br/>
        Bogota, Colombia | contacto@vitalemocion.com
      </p>
    </div>
  `;
}

export async function sendAppointmentConfirmation(data: {
  to: string;
  patientName: string;
  service: string;
  psychologist: string;
  date: string;
  time: string;
}) {
  return sendEmail({
    to: data.to,
    subject: "Confirmacion de tu cita — Vital Emocion",
    html: wrap("Cita Confirmada", `
      <p>Hola <strong>${data.patientName}</strong>,</p>
      <p>Tu cita ha sido agendada exitosamente:</p>
      <div style="background: #F2EDE8; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Servicio:</strong> ${data.service}</p>
        <p style="margin: 4px 0;"><strong>Psicologo/a:</strong> ${data.psychologist}</p>
        <p style="margin: 4px 0;"><strong>Fecha:</strong> ${data.date}</p>
        <p style="margin: 4px 0;"><strong>Hora:</strong> ${data.time}</p>
      </div>
      <p>Si necesitas cancelar o reprogramar, puedes hacerlo desde tu <a href="${process.env.NEXTAUTH_URL}/portal/citas" style="color: #7C9A8E;">portal de paciente</a> con al menos 24 horas de anticipacion.</p>
    `),
  });
}

export async function sendOrderConfirmation(data: {
  to: string;
  patientName: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}) {
  const itemsHtml = data.items
    .map(i => `<tr><td style="padding: 8px; border-bottom: 1px solid #E8DDD3;">${i.name}</td><td style="padding: 8px; border-bottom: 1px solid #E8DDD3; text-align: center;">${i.quantity}</td><td style="padding: 8px; border-bottom: 1px solid #E8DDD3; text-align: right;">$${i.price.toLocaleString("es-CO")}</td></tr>`)
    .join("");

  return sendEmail({
    to: data.to,
    subject: `Confirmacion de tu pedido #${data.orderId} — Vital Emocion`,
    html: wrap("Pedido Confirmado", `
      <p>Hola <strong>${data.patientName}</strong>,</p>
      <p>Tu pedido ha sido procesado exitosamente.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr style="background: #F2EDE8;">
            <th style="padding: 8px; text-align: left;">Producto</th>
            <th style="padding: 8px; text-align: center;">Cant.</th>
            <th style="padding: 8px; text-align: right;">Precio</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 8px; font-weight: bold;">Total</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">$${data.total.toLocaleString("es-CO")}</td>
          </tr>
        </tfoot>
      </table>
      <p>Puedes ver el estado de tu pedido en tu <a href="${process.env.NEXTAUTH_URL}/portal/compras" style="color: #7C9A8E;">portal de paciente</a>.</p>
    `),
  });
}

export async function sendWelcomeEmail(data: { to: string; name: string }) {
  return sendEmail({
    to: data.to,
    subject: "Bienvenido/a a Vital Emocion",
    html: wrap("Bienvenido/a", `
      <p>Hola <strong>${data.name}</strong>,</p>
      <p>Tu cuenta ha sido creada exitosamente. Ya puedes:</p>
      <ul>
        <li><a href="${process.env.NEXTAUTH_URL}/agendar" style="color: #7C9A8E;">Agendar tu primera cita</a></li>
        <li><a href="${process.env.NEXTAUTH_URL}/tienda" style="color: #7C9A8E;">Explorar nuestra tienda</a></li>
        <li><a href="${process.env.NEXTAUTH_URL}/portal" style="color: #7C9A8E;">Acceder a tu portal de paciente</a></li>
      </ul>
      <p>Estamos aqui para acompanarte en tu camino hacia el bienestar emocional.</p>
    `),
  });
}
```

**Step 2: Commit**

```bash
git add src/lib/email.ts
git commit -m "feat: add email utility with appointment, order, and welcome templates"
```

---

### Task 7: Wire Email Triggers Into Existing Flows

**Files:**
- Modify: `src/app/api/auth/register/route.ts` (add welcome email)
- Modify: `src/app/api/scheduling/book/route.ts` (add appointment confirmation)
- Modify: `src/app/api/store/checkout/capture-order/route.ts` (add order confirmation)

**Step 1: Add welcome email after registration**

In `register/route.ts`, after successful user creation, add:

```typescript
import { sendWelcomeEmail } from "@/lib/email";
// After user is created successfully:
await sendWelcomeEmail({ to: email, name }).catch(() => {});
```

**Step 2: Add appointment confirmation after booking**

In `book/route.ts`, after successful booking, add:

```typescript
import { sendAppointmentConfirmation } from "@/lib/email";
// After appointment is saved:
await sendAppointmentConfirmation({
  to: patientEmail,
  patientName,
  service: serviceName,
  psychologist: psychologistName,
  date: formattedDate,
  time: formattedTime,
}).catch(() => {});
```

**Step 3: Add order confirmation after payment capture**

In `capture-order/route.ts`, after successful PayPal capture, add:

```typescript
import { sendOrderConfirmation } from "@/lib/email";
// After order status updated to PAID:
await sendOrderConfirmation({
  to: order.patient.user.email,
  patientName: order.patient.user.name,
  orderId: order.id,
  items: order.items.map(i => ({ name: i.product.name, quantity: i.quantity, price: i.price })),
  total: order.total,
}).catch(() => {});
```

**Step 4: Commit**

```bash
git add src/app/api/auth/register/route.ts src/app/api/scheduling/book/route.ts src/app/api/store/checkout/capture-order/route.ts
git commit -m "feat: wire transactional emails into registration, booking, and checkout flows"
```

---

## Phase 3: GDPR & Legal (Tasks 8-10)

### Task 8: Privacy Policy & Terms Pages

**Files:**
- Create: `src/app/(public)/politica-privacidad/page.tsx`
- Create: `src/app/(public)/terminos/page.tsx`

**Step 1: Create privacy policy page**

Create a privacy policy page in Spanish covering: data collection, usage, retention, patient rights (access, rectification, deletion), contact for data requests, cookie policy.

**Step 2: Create terms of service page**

Create terms covering: service description, liability limitations, payment terms, cancellation policy (24h), intellectual property.

**Step 3: Add footer links**

Modify `src/components/layout/Footer.tsx` to add links to both pages in a "Legal" column.

**Step 4: Commit**

```bash
git add "src/app/(public)/politica-privacidad/page.tsx" "src/app/(public)/terminos/page.tsx" src/components/layout/Footer.tsx
git commit -m "feat: add privacy policy and terms of service pages"
```

---

### Task 9: Account Deletion (Right to be Forgotten)

**Files:**
- Modify: `src/app/api/portal/profile/route.ts` (add DELETE handler)
- Modify: `src/components/portal/ProfileForm.tsx` (add delete account button)

**Step 1: Add DELETE handler**

```typescript
// In src/app/api/portal/profile/route.ts
export async function DELETE(request: Request) {
  // Verify session
  // Check for pending appointments (block if any within 24h)
  // Delete in order: OrderItems → Orders → Appointments → Patient → User
  // Sign out session
  // Return success
}
```

**Step 2: Add UI for account deletion**

Add a danger zone section at the bottom of ProfileForm with confirmation dialog.

**Step 3: Commit**

```bash
git add src/app/api/portal/profile/route.ts src/components/portal/ProfileForm.tsx
git commit -m "feat: add account deletion with GDPR right-to-be-forgotten"
```

---

### Task 10: Cookie Consent Banner

**Files:**
- Create: `src/components/layout/CookieConsent.tsx`
- Modify: `src/app/(public)/layout.tsx` (add cookie banner)

**Step 1: Create cookie consent component**

A simple banner that:
- Shows on first visit (check localStorage)
- Allows Accept / Reject
- Stores preference in localStorage
- Does NOT block page usage
- Links to privacy policy

**Step 2: Add to public layout**

**Step 3: Commit**

```bash
git add src/components/layout/CookieConsent.tsx "src/app/(public)/layout.tsx"
git commit -m "feat: add cookie consent banner with preference storage"
```

---

## Phase 4: Loading States (Task 11)

### Task 11: Loading Skeletons for Main Pages

**Files:**
- Create: `src/app/(public)/loading.tsx`
- Create: `src/app/(public)/blog/loading.tsx`
- Create: `src/app/(public)/tienda/loading.tsx`
- Create: `src/app/admin/loading.tsx`
- Create: `src/app/portal/loading.tsx`

**Step 1: Create shared skeleton styles**

Each loading.tsx should render shimmer-animated placeholder blocks matching the page layout. Use the existing `shimmer` keyframe from globals.css.

**Step 2: Commit**

```bash
git add src/app/*/loading.tsx "src/app/(public)/*/loading.tsx"
git commit -m "feat: add loading skeletons for all main route groups"
```

---

## Phase 5: Testing (Tasks 12-14)

### Task 12: Test Infrastructure Setup

**Files:**
- Modify: `package.json` (add vitest, testing-library)
- Create: `vitest.config.ts`

**Step 1: Install dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

**Step 2: Create vitest config**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

**Step 3: Create setup file**

```typescript
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

**Step 4: Add test script to package.json**

```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "feat: add Vitest test infrastructure with React Testing Library"
```

---

### Task 13: Unit Tests for Critical Utilities

**Files:**
- Create: `src/lib/__tests__/rate-limit.test.ts`
- Create: `src/lib/__tests__/sanitize.test.ts`
- Create: `src/lib/__tests__/exchange-rate.test.ts`

**Step 1: Write rate limit tests**

Test: rate limit blocks after max requests, resets after window, different identifiers are independent.

**Step 2: Write sanitization tests**

Test: HTML entities escaped, nested objects sanitized, email validation, phone validation.

**Step 3: Write exchange rate tests**

Test: conversion returns number, fallback rate used when API unavailable.

**Step 4: Run tests**

```bash
npm run test:run
```
Expected: All tests pass

**Step 5: Commit**

```bash
git add src/lib/__tests__/
git commit -m "test: add unit tests for rate-limit, sanitize, and exchange-rate"
```

---

### Task 14: Integration Tests for Auth and Store APIs

**Files:**
- Create: `src/app/api/__tests__/auth-register.test.ts`
- Create: `src/app/api/__tests__/store-checkout.test.ts`

**Step 1: Test registration flow**

Test: valid registration returns 201, duplicate email returns 409, weak password returns 400, missing fields return 400.

**Step 2: Test checkout flow**

Test: empty cart returns 400, invalid quantities return 400, valid order creation returns 200.

**Step 3: Run tests**

```bash
npm run test:run
```

**Step 4: Commit**

```bash
git add src/app/api/__tests__/
git commit -m "test: add integration tests for auth and store API routes"
```

---

## Phase 6: Monitoring (Task 15)

### Task 15: Error Tracking with Sentry

**Files:**
- Create: `src/lib/sentry.ts`
- Modify: `src/app/error.tsx` (report to Sentry)
- Modify: `src/app/global-error.tsx` (report to Sentry)
- Modify: `next.config.ts` (add Sentry source maps)

**Step 1: Install Sentry**

```bash
npx @sentry/wizard@latest -i nextjs
```

Or manual setup:

```bash
npm install @sentry/nextjs
```

**Step 2: Configure Sentry**

Follow Sentry wizard output. Add `SENTRY_DSN` to `.env.example` and `.env.local`.

**Step 3: Wire error pages to Sentry**

In error.tsx and global-error.tsx, add `Sentry.captureException(error)` in the useEffect.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Sentry error tracking integration"
```

---

## Phase 7: Build Verification (Task 16)

### Task 16: Full Build Test

**Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds with 0 errors. Note any warnings.

**Step 2: Run linter**

```bash
npm run lint
```

Expected: 0 errors.

**Step 3: Run tests**

```bash
npm run test:run
```

Expected: All tests pass.

**Step 4: Fix any issues found**

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build warnings and lint issues"
```

---

## Phase 8: Browser Verification (Tasks 17-24)

> **NOTE:** Use Claude-in-Chrome MCP tools to verify EVERY flow. Start dev server with `npx next dev -p 3456` before testing.

### Task 17: Verify Public Pages Flow

**Test all 6 public pages in Chrome:**

1. Navigate to `http://localhost:3456/` — Verify hero animation loads with ink-in-water frames, scroll triggers frame animation, value proposition cards render, testimonials carousel works, CTA section visible
2. Navigate to `/nosotros` — Verify team cards load, psychologist photos/bios render
3. Navigate to `/servicios` — Verify service cards with icons, HeroScroll servicios section works
4. Navigate to `/blog` — Verify blog cards render, click into a post, verify slug page renders with content
5. Navigate to `/contacto` — Verify contact form renders, WhatsApp button visible
6. Navigate to `/tienda` — Verify product grid loads, filters work, click product detail

**Verify responsive:** Resize to mobile (375px) and verify navbar hamburger, stacked layouts

---

### Task 18: Verify Auth Flow

1. Navigate to `/login` — Verify form renders
2. Click "Registrarse" — Navigate to register page
3. Test registration with invalid email — Verify error shown
4. Test registration with weak password — Verify error shown
5. Register with valid credentials — Verify redirect to portal
6. Log out — Verify redirect to home
7. Log back in with created credentials — Verify success
8. Navigate to "Olvidaste tu contraseña" — Verify reset password form

---

### Task 19: Verify Scheduling Flow (Agendar)

1. Navigate to `/agendar`
2. Step 1: Select a service — Verify service cards render, selection highlights
3. Step 2: Select a psychologist — Verify psychologist cards render with availability
4. Step 3: Select a time slot — Verify calendar renders, slots appear, selection works
5. Submit booking — Verify confirmation screen shows

---

### Task 20: Verify Store & Checkout Flow

1. Navigate to `/tienda` — Verify products load
2. Click a product — Verify detail page
3. Add to cart — Verify cart toast appears
4. Open cart drawer — Verify items listed
5. Proceed to checkout — Verify `/tienda/checkout` loads
6. Verify PayPal button renders (sandbox mode)
7. Verify shipping form if physical products

---

### Task 21: Verify Admin Panel

1. Log in as admin (seed credentials)
2. Navigate to `/admin` — Verify dashboard stats load
3. Navigate to `/admin/blog` — Verify blog list renders
4. Test create new blog post — Verify form works
5. Navigate to `/admin/citas` — Verify appointments list
6. Navigate to `/admin/pedidos` — Verify orders list
7. Navigate to `/admin/equipo` — Verify team management
8. Navigate to `/admin/configuracion` — Verify settings form

---

### Task 22: Verify Patient Portal

1. Log in as patient (seed credentials)
2. Navigate to `/portal` — Verify dashboard loads with next appointment and recent order
3. Navigate to `/portal/citas` — Verify appointment list
4. Navigate to `/portal/compras` — Verify order history
5. Navigate to `/portal/perfil` — Verify profile form, test edit, test password change

---

### Task 23: Verify Sanity Studio (CMS Headless)

1. Navigate to `/admin/contenido`
2. Verify Sanity Studio loads embedded in the app
3. Verify schemas are visible: homePage, siteSettings, post, aboutPage
4. Test creating a new document (if Sanity project configured)
5. Verify content appears on public pages

---

### Task 24: Verify Error & Edge Cases

1. Navigate to `/ruta-que-no-existe` — Verify custom 404 page renders with "Volver al inicio" link
2. Navigate to `/blog/slug-que-no-existe` — Verify 404 or graceful error
3. Test submitting empty contact form — Verify validation messages
4. Test submitting empty register form — Verify validation
5. Verify cookie consent banner appears on first visit
6. Verify privacy policy page loads from footer link
7. Verify terms page loads from footer link
8. Check loading states on slow connections (throttle network in DevTools)

---

## Summary

| Phase | Tasks | Estimated Time |
|-------|-------|---------------|
| 1. Security & Error Handling | 1-5 | 3-4 hours |
| 2. Email System | 6-7 | 2-3 hours |
| 3. GDPR & Legal | 8-10 | 3-4 hours |
| 4. Loading States | 11 | 1-2 hours |
| 5. Testing | 12-14 | 4-6 hours |
| 6. Monitoring | 15 | 1-2 hours |
| 7. Build Verification | 16 | 1 hour |
| 8. Browser Verification | 17-24 | 2-3 hours |
| **Total** | **24 tasks** | **17-25 hours** |
