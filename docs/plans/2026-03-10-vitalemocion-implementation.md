# Vital Emocion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a premium psychology practice website with smart scheduling, e-commerce store, admin panel, and patient portal — with GSAP frame-sequence animations inspired by WS.Store.Bags.

**Architecture:** Next.js 16 App Router with route groups: `(public)` for animated client pages, `(auth)` for login/register, `admin/` for practice management, `portal/` for patient self-service. PostgreSQL via Prisma for persistence. Cal.com API for scheduling engine. PayPal for payments. GSAP ScrollTrigger for premium scroll animations with canvas-rendered frame sequences.

**Tech Stack:** Next.js 16, TypeScript 5.9, Tailwind CSS 4, GSAP 3.14, Zustand, NextAuth.js, Prisma, PostgreSQL, Cal.com, PayPal, Pexels API, FFmpeg

**Reference project:** `/home/jegx/jegx/desktop/work/org/wendy_sarmiento/WS.Store.Bags/` — reuse animation patterns from this codebase.

**Pexels API Key:** `G20trunMsy5EZcxZ6s4TC0d2Df31dhkFv7kaUoQ46WTAhm6wVbBNEjLu`

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `.env.local`, `.env.example`, `.gitignore`

**Step 1: Create Next.js 16 project**

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"`

Expected: Project scaffolded with default files.

**Step 2: Install core dependencies**

Run:
```bash
npm install gsap zustand @paypal/react-paypal-js next-auth @prisma/client @auth/prisma-adapter
npm install prisma --save-dev
```

**Step 3: Create .env.example**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vitalemocion"

# Auth
NEXTAUTH_SECRET="generate-a-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cal.com
CALCOM_API_KEY=""
CALCOM_API_URL="https://api.cal.com/v1"

# PayPal
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""

# Pexels
PEXELS_API_KEY=""

# WhatsApp / Twilio
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_WHATSAPP_NUMBER=""
```

**Step 4: Create .env.local with Pexels key**

Copy `.env.example` to `.env.local` and fill in the Pexels API key.

**Step 5: Verify dev server starts**

Run: `npm run dev`
Expected: Next.js dev server running on localhost:3000.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js 16 project with core dependencies"
```

---

### Task 2: Configure Tailwind theme with Vital Emocion palette

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/app/fonts.ts`

**Step 1: Configure fonts**

Create `src/app/fonts.ts`:
```typescript
import { Playfair_Display, DM_Sans } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});
```

**Step 2: Set up Tailwind CSS 4 theme in globals.css**

Replace `src/app/globals.css` with the full theme using Tailwind v4 `@theme` syntax:
```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-playfair), ui-serif, Georgia, serif;

  --color-primary: #7C9A8E;
  --color-primary-dark: #5B7A6E;
  --color-secondary: #E8DDD3;
  --color-accent: #C4916E;
  --color-background: #FAF8F5;
  --color-surface: #F2EDE8;
  --color-text-primary: #2D2D2D;
  --color-text-secondary: #6B6560;
  --color-text-muted: #9E9891;
  --color-success: #6B9E7A;
  --color-error: #C47070;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background-color: var(--color-background);
}
```

**Step 3: Update layout.tsx with fonts**

Modify `src/app/layout.tsx` to apply font CSS variables to `<html>`:
```tsx
import { playfair, dmSans } from "./fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Step 4: Verify fonts and colors render**

Run: `npm run dev`
Visit localhost:3000 — verify body uses DM Sans, background is cream (#FAF8F5).

**Step 5: Commit**

```bash
git add .
git commit -m "feat: configure Tailwind theme with Vital Emocion palette and typography"
```

---

### Task 3: Database schema with Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`

**Step 1: Initialize Prisma**

Run: `npx prisma init`

**Step 2: Write the full schema**

Replace `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  PSYCHOLOGIST
  PATIENT
}

enum ProductType {
  DIGITAL
  PHYSICAL
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

enum BlogPostStatus {
  DRAFT
  PUBLISHED
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  passwordHash  String?
  image         String?
  role          Role      @default(PATIENT)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  psychologist Psychologist?
  patient      Patient?
  blogPosts    BlogPost[]
  accounts     Account[]
  sessions     Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Psychologist {
  id           String   @id @default(cuid())
  userId       String   @unique
  bio          String?  @db.Text
  specialties  String[]
  photoUrl     String?
  calcomUserId String?
  availability Json?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  appointments Appointment[]
  services     Service[]     @relation("PsychologistServices")
}

model Patient {
  id              String   @id @default(cuid())
  userId          String   @unique
  phone           String?
  shippingAddress Json?
  notes           String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  appointments Appointment[]
  orders       Order[]
}

model Service {
  id          String @id @default(cuid())
  name        String
  description String @db.Text
  duration    Int    // minutes
  price       Float
  bufferTime  Int    @default(15) // minutes between appointments
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  psychologists Psychologist[] @relation("PsychologistServices")
  appointments  Appointment[]
}

model Appointment {
  id             String            @id @default(cuid())
  patientId      String
  psychologistId String
  serviceId      String
  calcomEventId  String?
  startTime      DateTime
  endTime        DateTime
  status         AppointmentStatus @default(PENDING)
  notes          String?           @db.Text
  reminderSent24h Boolean          @default(false)
  reminderSent1h  Boolean          @default(false)
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  patient      Patient      @relation(fields: [patientId], references: [id])
  psychologist Psychologist @relation(fields: [psychologistId], references: [id])
  service      Service      @relation(fields: [serviceId], references: [id])

  @@index([psychologistId, startTime])
  @@index([patientId])
  @@index([status])
}

model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String      @db.Text
  price       Float
  type        ProductType
  category    String
  images      String[]
  digitalFile String?
  tags        String[]
  stock       Int?
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  orderItems OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  patientId       String
  status          OrderStatus @default(PENDING)
  subtotal        Float
  shippingCost    Float       @default(0)
  total           Float
  paypalOrderId   String?
  shippingAddress Json?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  patient Patient     @relation(fields: [patientId], references: [id])
  items   OrderItem[]

  @@index([patientId])
  @@index([status])
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float  // price at time of purchase

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}

model BlogPost {
  id        String         @id @default(cuid())
  title     String
  slug      String         @unique
  content   String         @db.Text
  excerpt   String?
  coverImage String?
  status    BlogPostStatus @default(DRAFT)
  authorId  String
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  author User @relation(fields: [authorId], references: [id])

  @@index([status])
  @@index([slug])
}

model SiteConfig {
  id          String @id @default(cuid())
  key         String @unique
  value       Json
  updatedAt   DateTime @updatedAt
}
```

**Step 3: Create Prisma client singleton**

Create `src/lib/db.ts`:
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Step 4: Generate Prisma client**

Run: `npx prisma generate`
Expected: Prisma client generated successfully.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add Prisma schema with all database models"
```

---

### Task 4: Authentication with NextAuth.js (3 roles)

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/types/next-auth.d.ts`

**Step 1: Create NextAuth type augmentation**

Create `src/types/next-auth.d.ts`:
```typescript
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
```

**Step 2: Create auth configuration**

Create `src/lib/auth.ts`:
```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/registro",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
```

**Step 3: Create API route**

Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Step 4: Install bcryptjs**

Run: `npm install bcryptjs && npm install @types/bcryptjs --save-dev`

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add NextAuth.js authentication with 3 roles (admin, psychologist, patient)"
```

---

## Phase 2: Animation System

### Task 5: AnimatedSection reusable component

**Files:**
- Create: `src/components/animations/AnimatedSection.tsx`

**Reference:** `/home/jegx/jegx/desktop/work/org/wendy_sarmiento/WS.Store.Bags/src/components/AnimatedSection.tsx`

**Step 1: Create AnimatedSection component**

Port the AnimatedSection from WS.Store.Bags, adapting it for Vital Emocion. The component supports 5 animation presets:
- `fade-up`: opacity 0→1, y: 80→0
- `fade-left`: opacity 0→1, x: -60→0
- `fade-right`: opacity 0→1, x: 60→0
- `scale`: opacity 0→1, scale: 0.9→1
- `blur-in`: opacity 0→1, filter: blur(10px)→blur(0px)

All use `ease: "power3.out"`, trigger at `top 85%`, fire `once: true`.

Read the reference file and replicate the pattern with identical GSAP config.

**Step 2: Verify it renders without errors**

Import into `src/app/page.tsx` with a test `<AnimatedSection animation="fade-up"><p>Test</p></AnimatedSection>`.
Run: `npm run dev` — verify no errors and animation triggers on scroll.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add AnimatedSection component with 5 GSAP animation presets"
```

---

### Task 6: HeroScroll component with canvas frame rendering

**Files:**
- Create: `src/components/animations/HeroScroll.tsx`

**Reference:** `/home/jegx/jegx/desktop/work/org/wendy_sarmiento/WS.Store.Bags/src/components/HeroScroll.tsx`

**Step 1: Create HeroScroll component**

Port the HeroScroll from WS.Store.Bags. Key behaviors:
- Preload 192 WebP frames (30 eager, rest lazy)
- Canvas rendering with scroll-scrubbed frame changes
- Load animation: blur cascade 40px → 16px → 4px → 0px with brightness/saturation
- Hero text entrance: fromTo opacity 0→1, y: 40→0, scale: 0.95→1
- Text fade-out on scroll (0% → 15%)
- Progressive dissolve at end (65% → 100%)
- Scroll indicator that fades at 5%

Adapt: change color overlay to match Vital Emocion palette (cream white instead of pure white), update text content.

Props should include:
- `framesPath: string` — path to frames directory
- `frameCount: number` — number of frames
- `title: string`
- `subtitle: string`

**Step 2: Verify rendering**

This requires frames to exist. For now, create a placeholder that shows a solid color canvas. We'll add real frames in the frame pipeline task.

Run: `npm run dev` — verify component renders without crash.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add HeroScroll component with GSAP canvas frame scrubbing"
```

---

### Task 7: Frame pipeline — download Pexels videos and extract frames

**Files:**
- Create: `scripts/download-video.ts`
- Create: `scripts/extract-frames.sh`
- Create: `public/frames/hero/` (directory with ~192 WebP frames)
- Create: `public/frames/servicios/` (directory with ~192 WebP frames)

**Step 1: Create video download script**

Create `scripts/download-video.ts` — uses Pexels API to search and download videos:
```typescript
// Search for calming/wellness/nature videos
// Download highest quality MP4
// Save to scripts/temp/
```

Key: Search terms should be "nature calm meditation" or "wellness therapy peaceful" to match psychology theme.

**Step 2: Create frame extraction script**

Create `scripts/extract-frames.sh`:
```bash
#!/bin/bash
# Usage: ./extract-frames.sh input.mp4 output_dir frame_count
# Extracts frames as WebP, resized to 1920px max width, quality 80

INPUT=$1
OUTPUT_DIR=$2
FRAME_COUNT=${3:-192}

mkdir -p "$OUTPUT_DIR"

ffmpeg -i "$INPUT" \
  -vframes $FRAME_COUNT \
  -vf "scale=1920:-1" \
  -c:v libwebp \
  -quality 80 \
  "$OUTPUT_DIR/frame_%04d.webp"

echo "Extracted $FRAME_COUNT frames to $OUTPUT_DIR"
```

**Step 3: Run the pipeline for hero and servicios**

Run:
```bash
chmod +x scripts/extract-frames.sh
npx ts-node scripts/download-video.ts
./scripts/extract-frames.sh scripts/temp/hero.mp4 public/frames/hero 192
./scripts/extract-frames.sh scripts/temp/servicios.mp4 public/frames/servicios 192
```

Expected: `public/frames/hero/frame_0001.webp` through `frame_0192.webp` exist.

**Step 4: Verify HeroScroll renders with real frames**

Update Home page to point HeroScroll to `/frames/hero/`.
Run: `npm run dev` — verify scroll-scrubbing works with real frames.

**Step 5: Add frames directory to .gitignore (too large for git)**

Add to `.gitignore`:
```
public/frames/
scripts/temp/
```

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Pexels video download and FFmpeg frame extraction pipeline"
```

---

## Phase 3: Layout & Public Pages

### Task 8: Global layout components (Navbar, Footer, WhatsApp button)

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/WhatsAppButton.tsx`
- Create: `src/components/layout/ScrollIndicator.tsx`
- Modify: `src/app/(public)/layout.tsx`

**Step 1: Create Navbar**

Transparent by default, transitions to frosted glass on scroll via GSAP:
- `backdrop-blur(28px) saturate(1.8)` + `rgba(250, 248, 245, 0.85)` background
- Logo on left, nav links center, auth buttons right
- Mobile: hamburger menu with slide-in drawer
- Links: Inicio, Nosotros, Servicios, Agendar, Tienda, Blog, Contacto

**Step 2: Create Footer**

Columns with fade-up staggered animation (0.8s duration, 0.15s stagger):
- Column 1: Logo + brief description
- Column 2: Quick links
- Column 3: Services
- Column 4: Contact info + social media
- Bottom bar: copyright

**Step 3: Create WhatsAppButton**

Floating button bottom-right, pulse animation on idle:
- Green WhatsApp icon
- Opens `https://wa.me/<number>` in new tab
- Scale 1.05 on hover, 0.95 on active

**Step 4: Create ScrollIndicator**

Animated chevron/arrow at bottom of hero sections:
- Bounce animation
- Fades out at 5% scroll via GSAP ScrollTrigger

**Step 5: Create public layout**

Create `src/app/(public)/layout.tsx` that wraps children with Navbar + Footer + WhatsAppButton.

**Step 6: Verify layout renders on all routes**

Run: `npm run dev` — navbar, footer, and WhatsApp button visible.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add global layout — Navbar with frosted glass, Footer, WhatsApp button"
```

---

### Task 9: Home page

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Create: `src/components/home/ValueProposition.tsx`
- Create: `src/components/home/TestimonialsCarousel.tsx`
- Create: `src/components/home/CTASection.tsx`
- Create: `src/components/home/FeaturedProducts.tsx`

**Step 1: Build Home page structure**

Compose the page with sections in order:
1. `<HeroScroll>` — 192 frames, title "Tu bienestar emocional comienza aqui"
2. `<ValueProposition>` — 3 cards (Terapia Individual, Terapia de Pareja, Talleres)
3. `<TestimonialsCarousel>` — placeholder testimonials with blur-in animation
4. `<CTASection>` — image collage + frosted glass overlay + CTA to /agendar
5. `<FeaturedProducts>` — grid of 3-4 products (placeholder data for now)

**Step 2: Create ValueProposition component**

3 cards using AnimatedSection fade-up with stagger delay (0, 0.15, 0.3):
- Each card: icon, title, short description
- Rounded-2xl, surface background, shadow-lg shadow-black/5

**Step 3: Create TestimonialsCarousel**

Carousel with blur-in animation. Auto-play + manual navigation.
Placeholder quotes from fictional patients.

**Step 4: Create CTASection**

Reference: CTA from WS.Store.Bags — image collage with frosted glass overlay.
Adapt colors to Vital Emocion palette. CTA button links to /agendar.

**Step 5: Create FeaturedProducts**

Grid of product cards (fade-up + rotateX staggered). Placeholder data.
Reuse ProductCard pattern from WS.Store.Bags.

**Step 6: Verify full home page**

Run: `npm run dev` — full home page scrolls through all sections with animations.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: build complete Home page with hero, value props, testimonials, CTA, products"
```

---

### Task 10: Nosotros page

**Files:**
- Create: `src/app/(public)/nosotros/page.tsx`
- Create: `src/components/nosotros/PsychologistCard.tsx`

**Step 1: Build Nosotros page**

Sections:
1. Hero — team photo placeholder with subtle parallax (GSAP y offset on scroll)
2. Mission statement — AnimatedSection scale + blur-in
3. Psychologist cards — alternating fade-left/fade-right
4. Philosophy section — centered text with fade-up

**Step 2: Create PsychologistCard**

Card with: photo, name, title, specialty tags, brief bio. Placeholder data.
Alternate between fade-left and fade-right based on index.

**Step 3: Verify page**

Run: `npm run dev` — visit /nosotros, verify animations trigger correctly.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Nosotros page with team cards and philosophy section"
```

---

### Task 11: Servicios page

**Files:**
- Create: `src/app/(public)/servicios/page.tsx`
- Create: `src/components/servicios/ServiceCard.tsx`

**Step 1: Build Servicios page**

Sections:
1. Hero — frame sequence from `/frames/servicios/` (or static hero if frames not ready)
2. Services grid — expandable cards with fade-up staggered
3. CTA bottom — "Agenda tu cita" button linking to /agendar

**Step 2: Create ServiceCard**

Expandable card: click to reveal full description, duration, price.
AnimatedSection fade-up with stagger. Placeholder service data.

**Step 3: Verify page**

Run: `npm run dev` — visit /servicios, cards expand on click.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Servicios page with expandable service cards"
```

---

### Task 12: Blog page

**Files:**
- Create: `src/app/(public)/blog/page.tsx`
- Create: `src/app/(public)/blog/[slug]/page.tsx`
- Create: `src/components/blog/BlogCard.tsx`

**Step 1: Build blog listing page**

Grid of BlogCard components with fade-up staggered animation.
For now, use placeholder articles (later connected to DB).

**Step 2: Build blog article page**

Dynamic route `[slug]`. Playfair Display for title, DM Sans for body.
Related articles sidebar. AnimatedSection for content entrance.

**Step 3: Create BlogCard**

Card: cover image, title, excerpt, date, author. fade-up animation.

**Step 4: Verify**

Run: `npm run dev` — visit /blog and /blog/test-article.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add Blog pages with article listing and detail view"
```

---

### Task 13: Contacto page

**Files:**
- Create: `src/app/(public)/contacto/page.tsx`
- Create: `src/components/contacto/ContactForm.tsx`

**Step 1: Build Contacto page**

Sections:
1. Header with AnimatedSection fade-up
2. Contact form (name, email, phone, message) with inline validation
3. Contact info sidebar (phone, email, address, social media)
4. Map embed placeholder (Google Maps or static image)

**Step 2: Create ContactForm**

Client component with form state. Inline validation (email format, required fields).
Submit sends to API route (created later). Success/error feedback with animation.

**Step 3: Verify**

Run: `npm run dev` — visit /contacto, form validates correctly.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Contacto page with validated contact form"
```

---

## Phase 4: Store & Cart

### Task 14: Zustand cart store

**Files:**
- Create: `src/stores/cart.ts`
- Create: `src/types/store.ts`

**Step 1: Define store types**

Create `src/types/store.ts`:
```typescript
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "DIGITAL" | "PHYSICAL";
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
  subtotal: () => number;
  shippingCost: () => number;
  hasPhysicalItems: () => boolean;
  itemCount: () => number;
}
```

**Step 2: Create cart store with localStorage persistence**

Create `src/stores/cart.ts` using Zustand with `persist` middleware.
Reference WS.Store.Bags cart store pattern. Include shipping cost logic (only for physical items).

**Step 3: Write test for cart logic**

Create `src/stores/__tests__/cart.test.ts`:
```typescript
// Test: addItem adds new item with quantity 1
// Test: addItem increments quantity if item exists
// Test: removeItem removes item
// Test: updateQuantity changes quantity
// Test: clearCart empties cart
// Test: total calculates correctly
// Test: shippingCost returns 0 if only digital items
// Test: hasPhysicalItems returns true when physical items present
```

**Step 4: Run tests**

Run: `npm test`
Expected: All cart store tests pass.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add Zustand cart store with persistence and shipping logic"
```

---

### Task 15: Product catalog & detail pages (Tienda)

**Files:**
- Create: `src/app/(public)/tienda/page.tsx`
- Create: `src/app/(public)/tienda/[slug]/page.tsx`
- Create: `src/components/store/ProductCard.tsx`
- Create: `src/components/store/ProductFilters.tsx`
- Create: `src/components/store/CartDrawer.tsx`
- Create: `src/components/store/CartToast.tsx`
- Create: `src/app/api/products/route.ts`

**Step 1: Create Product API route**

GET `/api/products` — fetches products from DB with optional filters (category, type, search).
For now, return placeholder data until DB is seeded.

**Step 2: Create ProductCard**

Reference WS.Store.Bags ProductCard:
- Staggered entrance: fade-up + rotateX 8→0, 0.9s duration
- Image with hover scale 110% + pulse
- "Descarga inmediata" badge for digital products
- "Add to cart" button with color transition on added state
- Uses cart store's `addItem`

**Step 3: Create ProductFilters**

Sidebar/top bar with filters: category buttons, type toggle (digital/physical), search input.

**Step 4: Create CartDrawer**

Slide-in drawer from right. Shows cart items, quantities, subtotal, shipping, total.
Remove/update quantity controls. "Ir a pagar" button.
Frosted glass backdrop.

**Step 5: Create CartToast**

Frosted glass toast notification on add-to-cart. Auto-dismiss after 3s.
Reference WS.Store.Bags toast pattern.

**Step 6: Build Tienda listing page**

Compose: Hero (frame sequence or static) + ProductFilters + ProductCard grid.

**Step 7: Build product detail page**

Dynamic route `[slug]`: image gallery, full description, price, PayPal button, related products.
AnimatedSection for content entrance.

**Step 8: Verify**

Run: `npm run dev` — browse /tienda, filter products, add to cart, view detail page.

**Step 9: Commit**

```bash
git add .
git commit -m "feat: add Tienda pages with product catalog, filters, cart drawer, and detail view"
```

---

### Task 16: PayPal checkout

**Files:**
- Create: `src/components/store/PayPalCheckout.tsx`
- Create: `src/app/(public)/tienda/checkout/page.tsx`
- Create: `src/app/(public)/tienda/confirmacion/page.tsx`
- Create: `src/app/api/orders/route.ts`
- Create: `src/app/api/orders/[id]/route.ts`
- Create: `src/lib/paypal.ts`

**Step 1: Create PayPal configuration**

Create `src/lib/paypal.ts`:
```typescript
// PayPal SDK configuration
// Helper to create order on PayPal
// Helper to capture payment
```

**Step 2: Create Orders API**

POST `/api/orders` — creates order in DB from cart items, returns order ID.
POST `/api/orders/[id]/capture` — captures PayPal payment, updates order status.
GET `/api/orders/[id]` — returns order details.

**Step 3: Create PayPalCheckout component**

Uses `@paypal/react-paypal-js` PayPalButtons.
On approve: capture payment, clear cart, redirect to confirmation.
Handle errors gracefully with user feedback.

**Step 4: Create checkout page**

Shows order summary + shipping form (if physical items) + PayPal buttons.
Patient must be logged in (redirect to /login if not).

**Step 5: Create confirmation page**

Success animation + order summary.
For digital items: show download links immediately.
For physical items: show shipping info and estimated delivery.

**Step 6: Verify checkout flow**

Run: `npm run dev` — add items to cart, proceed to checkout, test with PayPal sandbox.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add PayPal checkout flow with order creation and confirmation"
```

---

## Phase 5: Scheduling

### Task 17: Cal.com API integration

**Files:**
- Create: `src/lib/calcom.ts`
- Create: `src/app/api/scheduling/available-slots/route.ts`
- Create: `src/app/api/scheduling/book/route.ts`

**Step 1: Create Cal.com client**

Create `src/lib/calcom.ts`:
```typescript
// Cal.com API wrapper
// getAvailableSlots(psychologistCalcomId, dateRange) -> slots[]
// createBooking(slot, patientInfo, serviceId) -> booking
// cancelBooking(bookingId) -> void
// rescheduleBooking(bookingId, newSlot) -> booking
```

**Step 2: Create available-slots API**

GET `/api/scheduling/available-slots?serviceId=X&psychologistId=Y&date=Z`
Returns available time slots from Cal.com, filtered by service duration and buffer time.

**Step 3: Create booking API**

POST `/api/scheduling/book` — creates booking on Cal.com + Appointment in our DB.
If patient doesn't have an account, auto-create one (email with password setup link).
Prevents double-booking via Cal.com's built-in conflict resolution.

**Step 4: Create intelligent assignment logic**

When `psychologistId` is not provided:
1. Find psychologists whose specialties match the service
2. For each, count appointments this week
3. Pick the one with fewest appointments (load balancing)
4. Return their available slots

**Step 5: Write tests for assignment logic**

Test: selects psychologist with fewest weekly appointments.
Test: filters by specialty match.
Test: returns empty if no psychologist available.

**Step 6: Run tests**

Run: `npm test`
Expected: Assignment logic tests pass.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add Cal.com integration with intelligent psychologist assignment"
```

---

### Task 18: Scheduling wizard (Agendar page)

**Files:**
- Create: `src/app/(public)/agendar/page.tsx`
- Create: `src/components/scheduling/StepService.tsx`
- Create: `src/components/scheduling/StepPsychologist.tsx`
- Create: `src/components/scheduling/StepTimeSlot.tsx`
- Create: `src/components/scheduling/ProgressIndicator.tsx`
- Create: `src/components/scheduling/BookingConfirmation.tsx`
- Create: `src/stores/scheduling.ts`

**Step 1: Create scheduling store**

Zustand store for wizard state:
```typescript
// selectedService, selectedPsychologist, selectedSlot, currentStep
// Actions: setService, setPsychologist, setSlot, nextStep, prevStep, reset
```

**Step 2: Create ProgressIndicator**

3-step animated indicator. Current step highlighted with primary color.
GSAP transition between steps (scale + color).

**Step 3: Create StepService**

Grid of selectable service cards. Each card shows: name, description, duration, price.
AnimatedSection fade-up staggered. Clicking a card advances to step 2.

**Step 4: Create StepPsychologist**

Shows psychologists who offer the selected service.
Cards with: photo, name, specialty, "Siguiente disponible: [date]".
Option: "No tengo preferencia" — triggers intelligent assignment.
Clicking advances to step 3.

**Step 5: Create StepTimeSlot**

Fetches available slots from API. Calendar date picker + time slot grid.
Slots shown as buttons with available times.
Clicking a slot shows confirmation summary.

**Step 6: Create BookingConfirmation**

Summary: service, psychologist, date/time. "Confirmar cita" button.
On confirm: POST to booking API, show success animation.
Auto-create patient account if not logged in (email field required).

**Step 7: Compose Agendar page**

Wizard container with smooth GSAP transitions between steps.
ProgressIndicator at top, step content below.

**Step 8: Verify full flow**

Run: `npm run dev` — go through all 3 steps and confirm a booking.

**Step 9: Commit**

```bash
git add .
git commit -m "feat: add 3-step scheduling wizard with intelligent assignment"
```

---

### Task 19: WhatsApp reminder system

**Files:**
- Create: `src/lib/whatsapp.ts`
- Create: `src/app/api/reminders/send/route.ts`
- Create: `src/app/api/cron/reminders/route.ts`

**Step 1: Create WhatsApp client**

Create `src/lib/whatsapp.ts`:
```typescript
// Uses Twilio WhatsApp API
// sendReminder(phone, message) -> void
// Templates: appointment_reminder_24h, appointment_reminder_1h, booking_confirmation
```

**Step 2: Create cron endpoint for reminders**

GET `/api/cron/reminders` (called by Vercel Cron):
- Query appointments where startTime is 24h from now and reminderSent24h is false
- Query appointments where startTime is 1h from now and reminderSent1h is false
- Send WhatsApp + email reminders
- Update reminder flags

**Step 3: Configure Vercel Cron**

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add WhatsApp reminder system with Vercel cron"
```

---

## Phase 6: Auth Pages

### Task 20: Login, Register, and Password Reset pages

**Files:**
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/registro/page.tsx`
- Create: `src/app/(auth)/reset-password/page.tsx`
- Create: `src/app/api/auth/register/route.ts`
- Create: `src/app/api/auth/reset-password/route.ts`

**Step 1: Create auth layout**

Centered card layout with Vital Emocion branding. No navbar/footer — clean auth pages.
Background: cream with subtle gradient.

**Step 2: Create login page**

Email + password form. "Iniciar sesion" button.
Link to register and reset password.
On success: redirect based on role (admin → /admin, psychologist → /admin, patient → /portal).

**Step 3: Create register page**

Name, email, password, confirm password.
Creates User with PATIENT role + Patient record.
On success: redirect to /portal.

**Step 4: Create register API**

POST `/api/auth/register` — validates input, hashes password, creates User + Patient.
Returns error if email already exists.

**Step 5: Create reset password page and API**

Form: email → sends reset link.
API: generates token, sends email with reset link (integrate email service later).

**Step 6: Verify auth flows**

Run: `npm run dev` — register new user, login, verify redirect by role.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add auth pages — login, register, password reset"
```

---

## Phase 7: Admin Panel

### Task 21: Admin layout and dashboard

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/DashboardStats.tsx`
- Create: `src/middleware.ts`

**Step 1: Create middleware for route protection**

Create `src/middleware.ts`:
- `/admin/*` routes: require ADMIN or PSYCHOLOGIST role
- `/portal/*` routes: require PATIENT role
- Redirect to /login if not authenticated

**Step 2: Create AdminSidebar**

Left sidebar navigation:
- Dashboard, Citas, Productos, Pedidos, Blog, Equipo, Configuracion
- Psychologist role only sees: Dashboard, Citas
- Collapsible on mobile

**Step 3: Create admin layout**

AdminSidebar + main content area. No GSAP — clean, functional Tailwind UI.

**Step 4: Create DashboardStats**

Cards showing: citas de hoy, pedidos recientes, ingresos del mes, pacientes activos.
Data from API routes (placeholder for now).

**Step 5: Create dashboard page**

Compose: DashboardStats + recent appointments list + recent orders list.

**Step 6: Verify admin access**

Run: `npm run dev` — login as admin, verify sidebar and dashboard render.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add admin panel layout with dashboard and route protection"
```

---

### Task 22: Admin — Product management (CRUD)

**Files:**
- Create: `src/app/admin/productos/page.tsx`
- Create: `src/app/admin/productos/nuevo/page.tsx`
- Create: `src/app/admin/productos/[id]/page.tsx`
- Create: `src/app/api/admin/products/route.ts`
- Create: `src/app/api/admin/products/[id]/route.ts`
- Create: `src/components/admin/ProductForm.tsx`
- Create: `src/components/admin/ProductTable.tsx`

**Step 1: Create admin products API**

GET `/api/admin/products` — list all products with pagination.
POST `/api/admin/products` — create product.
PUT `/api/admin/products/[id]` — update product.
DELETE `/api/admin/products/[id]` — soft delete (isActive = false).

All routes protected: require ADMIN role.

**Step 2: Create ProductTable**

Table with columns: image, name, type, category, price, stock, status.
Actions: edit, delete. Pagination controls.

**Step 3: Create ProductForm**

Form for create/edit: name, slug (auto-generated), description, price, type (digital/physical), category, images upload, digital file upload, tags, stock (physical only).

**Step 4: Create listing page**

`/admin/productos` — ProductTable + "Nuevo producto" button.

**Step 5: Create create/edit pages**

`/admin/productos/nuevo` — ProductForm in create mode.
`/admin/productos/[id]` — ProductForm in edit mode (pre-filled).

**Step 6: Verify CRUD**

Run: `npm run dev` — create, edit, and delete a product from admin.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add admin product management with full CRUD"
```

---

### Task 23: Admin — Appointment management

**Files:**
- Create: `src/app/admin/citas/page.tsx`
- Create: `src/app/api/admin/appointments/route.ts`
- Create: `src/app/api/admin/appointments/[id]/route.ts`
- Create: `src/components/admin/AppointmentCalendar.tsx`
- Create: `src/components/admin/AppointmentList.tsx`

**Step 1: Create admin appointments API**

GET `/api/admin/appointments` — list with filters (psychologist, date range, status).
PUT `/api/admin/appointments/[id]` — update status, notes.
Psychologist role: only sees their own appointments.

**Step 2: Create AppointmentCalendar**

Weekly/monthly calendar view. Color-coded by status.
Click on appointment to view/edit details.

**Step 3: Create AppointmentList**

Table view: patient name, service, psychologist, date/time, status.
Filters: date range, psychologist, status.

**Step 4: Build citas page**

Toggle between calendar and list views. Filter controls at top.

**Step 5: Verify**

Run: `npm run dev` — view appointments in calendar and list view.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add admin appointment management with calendar and list views"
```

---

### Task 24: Admin — Order management

**Files:**
- Create: `src/app/admin/pedidos/page.tsx`
- Create: `src/app/admin/pedidos/[id]/page.tsx`
- Create: `src/app/api/admin/orders/route.ts`
- Create: `src/app/api/admin/orders/[id]/route.ts`
- Create: `src/components/admin/OrderTable.tsx`
- Create: `src/components/admin/OrderDetail.tsx`

**Step 1: Create admin orders API**

GET `/api/admin/orders` — list with filters and pagination.
PUT `/api/admin/orders/[id]` — update status (mark as shipped, delivered).

**Step 2: Create OrderTable**

Table: order ID, patient, date, items count, total, status.
Click row to view detail.

**Step 3: Create OrderDetail**

Full order view: patient info, items list, shipping address, payment info, status history.
Action buttons: mark shipped, mark delivered, regenerate download links.

**Step 4: Build pedidos pages**

Listing + detail pages.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add admin order management with table and detail views"
```

---

### Task 25: Admin — Blog management

**Files:**
- Create: `src/app/admin/blog/page.tsx`
- Create: `src/app/admin/blog/nuevo/page.tsx`
- Create: `src/app/admin/blog/[id]/page.tsx`
- Create: `src/app/api/admin/blog/route.ts`
- Create: `src/app/api/admin/blog/[id]/route.ts`
- Create: `src/components/admin/BlogEditor.tsx`
- Create: `src/components/admin/BlogTable.tsx`

**Step 1: Create admin blog API**

CRUD for blog posts. Auto-generate slug from title.

**Step 2: Create BlogEditor**

Rich text / markdown editor. Fields: title, content, excerpt, cover image, status (draft/published).

**Step 3: Create BlogTable**

Table: title, status, author, date. Actions: edit, publish/unpublish, delete.

**Step 4: Build blog admin pages**

Listing + create + edit pages.

**Step 5: Connect public blog pages to DB**

Update `/blog` and `/blog/[slug]` to fetch from DB instead of placeholder data.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add admin blog management with rich editor and public page connection"
```

---

### Task 26: Admin — Team management

**Files:**
- Create: `src/app/admin/equipo/page.tsx`
- Create: `src/app/admin/equipo/[id]/page.tsx`
- Create: `src/app/api/admin/team/route.ts`
- Create: `src/app/api/admin/team/[id]/route.ts`
- Create: `src/components/admin/TeamForm.tsx`

**Step 1: Create team API**

CRUD for psychologists. Create also creates associated User account.
Manage: profile info, specialties, availability schedule, Cal.com user ID, active status.

**Step 2: Create TeamForm**

Form: name, email, bio, photo upload, specialties (multi-select), availability schedule (weekly grid), Cal.com user ID.

**Step 3: Build team pages**

Listing (cards with quick stats) + edit page.

**Step 4: Connect Nosotros page to DB**

Update `/nosotros` to fetch psychologist data from DB.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add admin team management and connect to public Nosotros page"
```

---

### Task 27: Admin — Settings

**Files:**
- Create: `src/app/admin/configuracion/page.tsx`
- Create: `src/app/api/admin/settings/route.ts`
- Create: `src/components/admin/SettingsForm.tsx`

**Step 1: Create settings API**

GET/PUT `/api/admin/settings` — reads/writes SiteConfig entries.
Keys: practice_name, practice_description, phone, email, address, social_media, holidays, whatsapp_number.

**Step 2: Create SettingsForm**

Organized in sections: General, Contact, Social Media, Holidays.
Save button persists to SiteConfig table.

**Step 3: Build settings page**

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add admin settings page for site configuration"
```

---

## Phase 8: Patient Portal

### Task 28: Patient portal layout and dashboard

**Files:**
- Create: `src/app/portal/layout.tsx`
- Create: `src/app/portal/page.tsx`
- Create: `src/components/portal/PortalSidebar.tsx`

**Step 1: Create PortalSidebar**

Simple navigation: Inicio, Mis Citas, Mis Compras, Mi Perfil.
Lighter design than admin — warmer, more inviting.

**Step 2: Create portal layout**

PortalSidebar + content area. Mobile-friendly.

**Step 3: Create portal dashboard**

Welcome message, next upcoming appointment (if any), recent orders.
Quick links: "Agendar nueva cita", "Ver tienda".

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add patient portal layout with dashboard"
```

---

### Task 29: Patient — My appointments

**Files:**
- Create: `src/app/portal/citas/page.tsx`
- Create: `src/app/api/portal/appointments/route.ts`
- Create: `src/app/api/portal/appointments/[id]/cancel/route.ts`
- Create: `src/components/portal/AppointmentCard.tsx`

**Step 1: Create portal appointments API**

GET — returns logged-in patient's appointments (upcoming + past).
POST `[id]/cancel` — cancels appointment (only if >24h before).

**Step 2: Create AppointmentCard**

Shows: service, psychologist, date/time, status.
Actions: "Reagendar" (link to /agendar pre-filled), "Cancelar" (with confirmation).

**Step 3: Build citas page**

Two tabs: "Proximas" and "Historial".

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add patient portal appointments with reschedule and cancel"
```

---

### Task 30: Patient — My purchases

**Files:**
- Create: `src/app/portal/compras/page.tsx`
- Create: `src/app/api/portal/orders/route.ts`
- Create: `src/app/api/portal/orders/[id]/download/route.ts`
- Create: `src/components/portal/OrderCard.tsx`

**Step 1: Create portal orders API**

GET — returns logged-in patient's orders.
GET `[id]/download` — returns signed download URL for digital product (validates 72h expiry, regenerable).

**Step 2: Create OrderCard**

Shows: order date, items, total, status.
For digital items: "Descargar" button. For physical: shipping status.

**Step 3: Build compras page**

List of orders with OrderCards.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add patient portal purchases with digital download support"
```

---

### Task 31: Patient — My profile

**Files:**
- Create: `src/app/portal/perfil/page.tsx`
- Create: `src/app/api/portal/profile/route.ts`
- Create: `src/components/portal/ProfileForm.tsx`

**Step 1: Create profile API**

GET/PUT — read/update patient profile (name, email, phone, shipping address, notification preferences).

**Step 2: Create ProfileForm**

Sections: Personal Data, Shipping Address, Notification Preferences (email, WhatsApp).
Change password section.

**Step 3: Build perfil page**

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add patient portal profile management"
```

---

## Phase 9: Polish & Deploy

### Task 32: Database seeding with sample data

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add seed script)

**Step 1: Create seed script**

Seed with:
- 1 admin user
- 3 psychologists with availability
- 5 services
- 10 products (mix of digital and physical)
- 5 blog posts
- Site config entries
- Sample patients and appointments

**Step 2: Run seed**

Run: `npx prisma db seed`
Expected: All sample data created.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add database seed with sample data for all models"
```

---

### Task 33: Connect all public pages to database

**Files:**
- Modify: `src/app/(public)/page.tsx` (home — featured products from DB)
- Modify: `src/app/(public)/servicios/page.tsx` (services from DB)
- Modify: `src/app/(public)/tienda/page.tsx` (products from DB)
- Modify: API routes to use real DB queries

**Step 1: Replace all placeholder data with DB queries**

Use Prisma queries in Server Components and API routes.
Ensure all pages render with seeded data.

**Step 2: Verify all pages work end-to-end**

Run: `npm run dev` — navigate every page, confirm data displays correctly.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: connect all public pages to database with real data"
```

---

### Task 34: SEO, meta tags, and accessibility

**Files:**
- Modify: all page files (add metadata exports)
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Step 1: Add metadata to all pages**

Each page exports `metadata` with title, description, openGraph.

**Step 2: Create dynamic sitemap**

`src/app/sitemap.ts` — generates sitemap from pages + blog posts + products.

**Step 3: Create robots.txt**

Allow all, disallow /admin and /portal.

**Step 4: Accessibility pass**

Verify: semantic HTML, ARIA labels, keyboard navigation, contrast ratios.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add SEO metadata, sitemap, robots.txt, and accessibility improvements"
```

---

### Task 35: Deploy to Vercel + Supabase

**Files:**
- Modify: `vercel.json` (cron config)
- Modify: `.env.example` (document all required env vars)

**Step 1: Create Supabase project**

Create PostgreSQL database on Supabase. Copy connection string.

**Step 2: Push schema to production DB**

Run: `npx prisma db push`
Run: `npx prisma db seed`

**Step 3: Deploy to Vercel**

```bash
vercel --prod
```

Set environment variables in Vercel dashboard:
- DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
- CALCOM_API_KEY
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
- PEXELS_API_KEY

**Step 4: Verify production deployment**

Visit production URL. Test: home page, scheduling flow, store, admin login.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: configure production deployment with Vercel and Supabase"
```

---

## Summary

| Phase | Tasks | Focus |
|---|---|---|
| 1. Foundation | 1-4 | Next.js, Tailwind, Prisma, Auth |
| 2. Animations | 5-7 | AnimatedSection, HeroScroll, Frame pipeline |
| 3. Layout & Pages | 8-13 | Navbar, Footer, all public pages |
| 4. Store & Cart | 14-16 | Cart store, Tienda pages, PayPal checkout |
| 5. Scheduling | 17-19 | Cal.com, Booking wizard, WhatsApp reminders |
| 6. Auth Pages | 20 | Login, Register, Reset password |
| 7. Admin Panel | 21-27 | Dashboard, Products, Appointments, Orders, Blog, Team, Settings |
| 8. Patient Portal | 28-31 | Dashboard, Appointments, Purchases, Profile |
| 9. Polish & Deploy | 32-35 | Seed data, DB connection, SEO, Deploy |

**Total: 35 tasks across 9 phases.**
