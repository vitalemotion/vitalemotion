# Vital Emocion — Design Document

> Historical reference only.
> This file captures the original concept from 2026-03-10 and is no longer the source of truth for setup or operations.
> Current documentation lives in `README.md` and `docs/*.md`.

**Date**: 2026-03-10
**Status**: Approved

## Overview

Website for a psychology practice combining smart appointment scheduling, an online store (digital + physical products), and premium GSAP-animated visual design inspired by WS.Store.Bags.

## Goals

- Smart scheduling system with dynamic availability, auto-assignment, conflict prevention, and WhatsApp reminders
- E-commerce store for digital (ebooks, guides) and physical (books, materials) products with PayPal checkout
- Premium visual experience with GSAP frame-sequence animations, scroll-triggered reveals, and frosted glass effects
- Admin panel for psychologists to manage appointments, products, blog, and team
- Patient mini-portal for managing appointments, purchases, and profile

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5.9 |
| Styles | Tailwind CSS 4 |
| Animations | GSAP 3.14 + ScrollTrigger |
| State | Zustand |
| Auth | NextAuth.js (Admin, Psychologist, Patient roles) |
| Database | PostgreSQL + Prisma |
| Scheduling | Cal.com (API + embeds) |
| Payments | PayPal (@paypal/react-paypal-js) |
| Reminders | WhatsApp Business API / Twilio |
| Hosting | Vercel (frontend) + Supabase/Railway (PostgreSQL) |
| Assets | Pexels videos converted to WebP frames via FFmpeg |

## Visual Identity

### Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary | Sage Green | #7C9A8E |
| Primary Dark | Deep Sage | #5B7A6E |
| Secondary | Warm Sand | #E8DDD3 |
| Accent | Terracotta Soft | #C4916E |
| Background | Cream White | #FAF8F5 |
| Surface | Soft Linen | #F2EDE8 |
| Text Primary | Charcoal | #2D2D2D |
| Text Secondary | Warm Gray | #6B6560 |
| Text Muted | Light Gray | #9E9891 |
| Success | Moss Green | #6B9E7A |
| Error | Dusty Rose | #C47070 |

### Typography

- **Headlines**: Playfair Display (serif)
- **Body**: DM Sans (sans-serif)
- **Accent/Labels**: DM Sans uppercase, letter-spacing 0.1em

### Visual Effects (WS.Store.Bags style)

- Frosted glass: `backdrop-blur(24px) saturate(1.6)` with `rgba(250, 248, 245, 0.7)`
- Shadows: Warm tones, `shadow-black/5` max `/10`
- Border radius: `rounded-2xl` cards, `rounded-xl` buttons
- Hover: Scale 1.02 on cards, 300-400ms transitions

## Pages

### Home
- **Hero Scroll**: ~192 Pexels video frames on canvas, scroll-scrubbed via GSAP ScrollTrigger
- **Load animation**: Blur cascade 40px > 16px > 4px > 0px with brightness/saturation shift
- **Hero text**: "Tu bienestar emocional comienza aqui" fade-in + blur, fade-out at 15% scroll
- **Value proposition**: 3 cards (fade-up staggered 0.15s) — Terapia Individual, Terapia de Pareja, Talleres
- **Testimonials**: Carousel with blur-in animation
- **CTA Agendar**: Image collage + frosted glass overlay
- **Featured products**: Grid 3-4 products (fade-up + rotateX)

### Nosotros
- Hero with team photo + subtle parallax
- Psychologist cards (fade-left/right alternating): photo, name, specialty, credentials
- Philosophy section with scale + blur-in animation

### Servicios
- Hero with frame sequence (Pexels wellness video)
- Expandable cards per service: description, duration, price
- Each card enters with fade-up staggered
- CTA at bottom leading to Agendar

### Agendar Cita
- 3-step wizard with smooth transitions:
  1. Choose service (selectable cards)
  2. Choose psychologist (profiles with availability)
  3. Choose time slot (Cal.com embed, styled with palette)
- Success confirmation animation + WhatsApp/email reminder
- Animated progress indicator between steps

### Tienda
- Hero with frame sequence
- Filters: category (books, digital guides, materials), price
- Product grid with ProductCard animation (fade-up + rotateX staggered)
- Product detail page: image gallery, description, PayPal checkout
- Visual distinction: "Descarga inmediata" badge (digital) vs shipping info (physical)

### Blog/Recursos
- Article grid with animated cards
- Article page: Playfair titles, DM Sans body
- Related articles sidebar

### Contacto
- Form with inline validation
- Floating WhatsApp button (present on all pages)
- Location map (if applicable)

### Global Components
- **Navbar**: Transparent > frosted glass on scroll
- **Footer**: Columns with fade-up staggered
- **Scroll indicator**: Fade-out at 5% scroll
- **WhatsApp floating button**: Site-wide

## Smart Scheduling System

### Dynamic Availability
- Psychologists define weekly availability blocks (e.g., Monday 9-12, Tuesday 14-18)
- Auto-excludes holidays, vacations, manual blocks
- Configurable appointment duration per service type (50min, 90min, etc.)
- Automatic 15min buffer between appointments

### Intelligent Assignment
When patient doesn't choose a psychologist:
- Match specialty to selected service
- Balance workload (least busy that week)
- Suggest closest available time slots

### Conflict Prevention
- Real-time slot locking — first to confirm wins, second sees updated availability
- Duplicate detection (same patient, same day)
- Impossible to double-book

### Automated Reminders
- 24h before: WhatsApp + email
- 1h before: WhatsApp
- No confirmation: notification to psychologist
- Rescheduling link in every reminder

### Rescheduling & Cancellation
- Patient can reschedule up to 24h before without penalty
- Cancellation auto-releases the slot
- Optional waitlist — notify interested patients when a slot opens

### Cal.com Integration
- Cal.com handles scheduling engine (availability, conflicts, embeds)
- Custom intelligence layer on top: auto-assignment, load balancing, WhatsApp reminders
- Cal.com API for programmatic event creation/modification
- Cal.com webhooks trigger WhatsApp notifications
- Custom UI wraps Cal.com calendar with our palette and animations

## Store & Payments

### Catalog
- Products: name, description, price, images, category, type (digital/physical)
- Tags: "Nuevo", "Mas vendido", "Descarga inmediata"
- Search and filters by category and type

### Cart (Zustand)
- Lateral drawer with slide-in animation
- Frosted glass toast on add-to-cart
- Summary: subtotal, shipping (physical only), total
- localStorage persistence

### PayPal Checkout
- Embedded PayPal buttons (@paypal/react-paypal-js)
- Digital: successful payment > immediate download + email with link
- Physical: successful payment > shipping address form + confirmation email
- Mixed orders: both flows in single transaction

### Post-Purchase
- Success confirmation page with animation
- Email with order summary
- Digital products: download links valid 72h (regenerable from admin)

## Authentication & Roles

### 3 Roles (NextAuth.js)

| Role | Access |
|---|---|
| Admin | Full panel: products, orders, blog, team, config |
| Psychologist | Their calendar, their appointments, patient notes |
| Patient | Mini-portal: my appointments, my purchases, reschedule, downloads, profile |

### Account Creation
- Patient account auto-created on first appointment booking
- Email sent to set password
- Eliminates registration friction

### Patient Mini-Portal
- **My appointments**: upcoming (reschedule/cancel) + history
- **My purchases**: orders with status + re-download digital products
- **My profile**: personal data, saved shipping address, notification preferences

## Admin Panel

Functional design (no GSAP animations — fast and utilitarian).

| Module | Functionality |
|---|---|
| Dashboard | Summary: today's appointments, recent orders, monthly revenue, key metrics |
| Appointments | Weekly/monthly calendar view, appointment list, filter by psychologist/date/status |
| Products | Full CRUD: create, edit, delete. Upload images and digital files |
| Orders | Order list, status (paid, shipped, delivered), detail with items |
| Blog | Article editor with markdown/rich text, drafts, publish/unpublish |
| Team | Manage psychologists: profile, specialties, availability schedules |
| Settings | Practice info, social media, site copy, holidays |

## Database Models (Prisma)

- `User` — auth, role (ADMIN, PSYCHOLOGIST, PATIENT)
- `Psychologist` — public profile, specialties, availability
- `Service` — therapy types, duration, price
- `Appointment` — patient, psychologist, service, status, datetime
- `Patient` — name, email, phone, notes, shipping address
- `Product` — name, price, type (DIGITAL/PHYSICAL), images, digital file
- `Order` — items, status, shipping data, PayPal transaction ID
- `OrderItem` — product + quantity per order
- `BlogPost` — title, content, slug, status, author
- `SiteConfig` — general site configuration

## Project Structure

```
vitalemocion/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes with GSAP animations
│   │   │   ├── page.tsx       # Home
│   │   │   ├── nosotros/
│   │   │   ├── servicios/
│   │   │   ├── agendar/
│   │   │   ├── tienda/
│   │   │   ├── blog/
│   │   │   └── contacto/
│   │   ├── (auth)/            # Login, register, reset password
│   │   ├── admin/             # Admin panel (no GSAP, functional)
│   │   ├── portal/            # Patient mini-portal
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── animations/        # HeroScroll, AnimatedSection, etc.
│   │   ├── ui/                # Buttons, cards, modals, inputs
│   │   ├── layout/            # Navbar, Footer, WhatsApp button
│   │   ├── scheduling/        # Scheduling components
│   │   ├── store/             # Cart, ProductCard, checkout
│   │   └── admin/             # Admin panel components
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── calcom.ts          # Cal.com API integration
│   │   ├── paypal.ts          # PayPal configuration
│   │   └── whatsapp.ts        # Reminder API
│   ├── stores/                # Zustand stores (cart, UI state)
│   └── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma          # Database models
├── public/
│   ├── frames/                # WebP frame sequences
│   │   ├── hero/              # ~192 frames for home
│   │   └── servicios/         # Frames for services
│   └── images/                # Static assets
```

## Frame Pipeline

1. Download video from Pexels via API
2. FFmpeg: extract frames to WebP (`ffmpeg -i video.mp4 -vframes 192 frame_%04d.webp`)
3. Optimize: quality 80, resize to 1920px max width
4. First 30 frames: eager load, rest: lazy load

## Deploy

- **Vercel**: Next.js frontend (free tier to start)
- **Database**: Supabase PostgreSQL (generous free tier) or Railway
- **Domain**: Connect Vital Emocion custom domain
- **CI/CD**: Push to main > automatic deploy on Vercel
