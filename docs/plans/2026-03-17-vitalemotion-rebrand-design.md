# Vital Emotion — Rediseno & Rebranding

> **Referencia principal:** [Anima Wellness](https://kindly-2e8okmvk.peachworlds.com/) (Awwwards Honorable Mention)
> **Referencia secundaria:** [Vibrant Wellness](https://vibrant.noomoagency.com/) (Awwwards SOTD, 7.31/10)

## 1. Identidad del Cliente

### Marca
- **Nombre actual:** Vital Emocion
- **Nombre nuevo:** Vital Emotion (renombrar todo)
- **Fundadora:** Psicóloga Daniela Quiroga (@psicologa_danielaq)
- **Verificada en Instagram**, +4,080 seguidores, +5,000 consultas realizadas

### Perfiles de Instagram

**@somos.vital.bienestar**
- Centro de bienestar integral
- CEO: @psicologa_danielaq
- Servicios: Medicina, Nutricion, Psicologia, Fisioterapia
- Logo: Loto morado sobre fondo claro
- Tono visual: Profesional, calido, colores pasteles

**@psicologa_danielaq**
- Daniela Quiroga — Psicologa verificada
- +5,000 consultas
- Ofrece: Podcast, talleres, cursos, consultoria empresarial
- CEO de Vital Emocion
- Estilo: Personal, cercano, educativo

**@vitalemocion**
- 1,070 seguidores
- Productos digitales + podcast + talleres
- Logo pastel con texto "Vital Emocion"
- Colores: Lavanda, rosa pastel, crema

### Productos (Hotmart)

| Producto | Tipo | Descripcion |
|----------|------|-------------|
| Diario Emocional | Digital | Herramienta de autoconocimiento emocional |
| Enamoremonos Juntos | Digital | Herramienta para parejas |
| Tu Psicologa en un Libro | Digital/Fisico | Libro de psicologia practica |
| Tarjetas Emocionales | Digital/Fisico | Tarjetas para trabajo emocional |
| Curso (inscripcion con cupos) | Curso | Curso de crecimiento emocional |
| Podcast | Audio | Contenido educativo gratuito |
| Test "Limpiar la casa de tu mente" | Gratuito | Test de psicologia como lead magnet |

### Beneficios comunicados
1. Reconocer y aceptar tus emociones
2. Entender las causas y gestionar tus emociones
3. Generar habito de meditar y constancia
4. Mejorar resiliencia

### Mision
> "Acompanarte en tu camino de autoconocimiento y transformacion, recordandote que no estas solo en tus procesos y que cada paso hacia tu bienestar cuenta."

### Paleta de colores actual
- Purpura principal: #831ED1
- Tonos pastel: lavanda, rosa suave, crema
- Logo: loto morado

### Contacto
- WhatsApp/Telegram: 3135891811
- Soporte por Telegram

---

## 2. Investigacion Awwwards

### Sitios analizados

**Anima Wellness (Honorable Mention) — REFERENCIA PRINCIPAL**
- URL: https://kindly-2e8okmvk.peachworlds.com/
- Awwwards: https://www.awwwards.com/sites/anima-wellness-i-peachweb
- Tech: PeachWeb Builder (3D/WebGL), scroll-driven storytelling
- Paleta: Azul-lavanda (#555e7d) + gris (#d4d3d6)
- Tipografia: Serif elegante para titulos, sans-serif para cuerpo
- Tags: Animation, Scrolling, Illustration, Storytelling, 3D, Interaction Design

**Secciones de Anima (capturadas via Chrome):**
1. **Hero** — Titulo serif grande + subtitulo + CTA "Book Session" + imagen de montana/lago + "Scroll to Discover"
2. **Services** — "Therapy is a journey that leads you back to yourself" + objetos 3D metaforicos (esculturas clasicas, arco de cristal)
3. **Approach (Toolkit)** — "Toolkit for transformation" + cards (Cognitive, Mindfulness, Psychodynamic) + llave 3D en arco
4. **Benefits** — "Therapeutic journey brings invaluable rewards" + piedras zen balanceadas + cards (Greater self-awareness, Emotional resilience)
5. **Who We Help** — "Everyone deserves support and understanding" + piezas de ajedrez 3D + categorias (adults, teens, couples, individuals)
6. **Testimonials** — Texto grande centrado + comillas serif + escaleras 3D al fondo
7. **CTA final** — Vuelve al hero (loop circular)

**Vibrant Wellness (SOTD, 7.31/10) — REFERENCIA VISUAL**
- URL: https://vibrant.noomoagency.com/
- Awwwards: https://www.awwwards.com/sites/vibrant-wellness
- Tech: Three.js + GSAP + WebGL
- Paleta: Lavanda/purpura suave (#8EBEF9 → #0774C4) + glassmorphism
- Concepto: Modelo 3D de cuerpo humano interactivo con zoom a organos
- Tags: Animation, Unusual Navigation, Data Visualization, Storytelling, 3D, WebGL, GSAP, Three.js

**Q Psychology (Honorable Mention)**
- Awwwards: https://www.awwwards.com/sites/q-psychology
- Clinica psicologica australiana
- Diseno limpio, colores suaves, tipografia elegante

**Debski Clinic (Honorable Mention)**
- Awwwards: https://www.awwwards.com/sites/debski-clinic
- Clinica con enfoque cercano y prestigioso
- Parallax, tipografia, minimal, Webflow

### Tendencias de diseno 2025-2026 para terapia/bienestar
- Estetica calmante que se siente segura, no clinica
- Navegacion intuitiva
- Tipografia elegante y sofisticada
- Espacios en blanco generosos
- Fotografia humana y cercana
- Integracion multi-plataforma (podcast, libro, newsletter)
- Balance entre claridad y compasion

---

## 3. Decision de Arquitectura

**Monolito Next.js (sin separar frontend/backend)**

Razones:
- Escala del proyecto no justifica microservicios
- SSR con acceso directo a Prisma = paginas rapidas
- Tipos compartidos entre frontend y API routes
- Un solo deploy en Vercel
- Las API routes ya sirven como backend para futura app movil

---

## 4. Enfoque de Diseno: Anima Wellness adaptado con GSAP + IA

### Que tomamos de Anima
- Estructura de secciones (storytelling en scroll)
- Tipografia serif elegante para titulos
- Transiciones suaves entre "escenas"
- Ritmo del scroll (pin sections, reveal elements)
- Cards con glassmorphism sutil
- CTA prominentes y claros

### Que NO tomamos
- WebGL / Three.js / PeachWeb (muy pesado)
- Modelos 3D reales (requiere modelador profesional)

### Como lo logramos
- **GSAP ScrollTrigger** para parallax y transiciones
- **Imagenes generadas con IA** (escenas 3D-like, ilustraciones)
- **CSS parallax layers** (foreground/midground/background)
- **Lottie animations** para elementos decorativos
- Ver seccion 5 para detalle completo

---

## 5. Efecto Anima con IA — Enfoque Tecnico

### Paso 1: Generacion de escenas con IA
Usar Midjourney/DALL-E/Stable Diffusion para generar imagenes de "habitaciones terapeuticas" estilo Anima:
- Habitacion con arcos, luz suave, objetos simbolicos
- Paleta purpura/lavanda consistente
- Estilo: 3D render fotorrealista, iluminacion volumetrica

### Paso 2: Separacion en capas (parallax)
Cada escena se divide en 2-3 capas con IA (remove background):
- **Background:** habitacion/paisaje
- **Midground:** objetos principales (silla, libro, loto)
- **Foreground:** elementos decorativos (particulas, luz)

### Paso 3: Animacion con GSAP ScrollTrigger
- Pin cada seccion al viewport
- Mover capas a velocidades distintas = efecto 3D
- Fade in/out texto con stagger
- Scale + opacity en transiciones

### Paso 4: Elementos interactivos
- Hover effects en cards de servicios
- Cursor personalizado sutil
- Text split animation en titulos
- Smooth scroll con Lenis

---

## 6. Paleta de Colores Propuesta

| Rol | Color | Hex |
|-----|-------|-----|
| Primario | Purpura profundo | #7C3AED |
| Primario oscuro | Violeta | #6D28D9 |
| Secundario | Lavanda suave | #EDE9FE |
| Acento | Rosa pastel | #FCE7F3 |
| CTA | Dorado calido | #F59E0B |
| Fondo | Crema | #FAFAF5 |
| Texto | Gris oscuro | #1F2937 |
| Texto secundario | Gris medio | #6B7280 |

---

## 7. Secciones del Home (adaptando Anima a Vital Emotion)

| # | Seccion Anima | Adaptacion Vital Emotion | Escena IA |
|---|--------------|--------------------------|-----------|
| 1 | Hero | "Tu bienestar emocional comienza aqui" + CTA Agendar | Habitacion con ventana, luz purpura, loto flotante |
| 2 | Services | Servicios (Psicologia, Talleres, Cursos, Empresas) | Silla de terapeuta + libros + planta |
| 3 | Toolkit | Productos (Diario, Tarjetas, Libro, Podcast) | Mesa con objetos emocionales, luz calida |
| 4 | Benefits | Beneficios del acompanamiento | Piedras zen + agua + arco iris sutil |
| 5 | Who We Help | "Para todos" (individuos, parejas, empresas) | Siluetas diversas, arcos de luz |
| 6 | Testimonials | Testimonios reales de pacientes | Escaleras ascendentes + cielo |
| 7 | Team | Daniela Quiroga + equipo | Fotos reales con efecto parallax |
| 8 | CTA | "Agenda tu primera sesion" | Puerta abierta con luz |

---

## 8. Nuevas Funcionalidades

### Sistema de Membresia
- Modelo freemium: contenido gratuito (blog, podcast) + premium (cursos, productos)
- Niveles: Gratis → Basico → Premium
- Acceso gated a productos digitales y podcast exclusivo
- Integracion con el sistema de auth existente (NextAuth)
- Tabla `Membership` en Prisma

### Renombrar a "vitalemotion"
- Nombre del proyecto, repo, org en GitHub
- Textos en toda la UI
- Metadata, SEO, sitemap
- Variables de entorno

### Deploy
- GitHub org: vitalemotion
- Repo: vitalemotion
- Vercel: conectar repo
- Supabase: PostgreSQL managed

---

## 9. Enfoque Final: Video IA + Fotogramas en Scroll

> **Decision (2026-03-17):** En vez de parallax multicapa con imagenes estaticas,
> generamos **video IA** de escenas terapeuticas y usamos el pipeline de fotogramas
> que ya existe en el codebase (`scripts/download-video.ts` + `HeroScroll` canvas).

### Como funciona
1. Generar video IA (Sora/Runway/Kling) de un recorrido cinematico por habitacion terapeutica purpura
2. `scripts/download-video.ts` extrae ~120-200 fotogramas WebP
3. `HeroScroll` component reproduce fotogramas en canvas atados al scroll
4. Texto + UI se superponen con GSAP sobre el canvas
5. El usuario scrollea = la camara "recorre" el espacio

### Prompt base para generar el video
```
Slow cinematic camera dolly through a serene therapy room.
Soft purple volumetric lighting. Marble arches, floating lotus
flower, zen stones on reflective water floor. Camera moves
smoothly from room to room, passing through archways.
Lavender and cream color palette. 3D render aesthetic,
no people. Dreamy, peaceful atmosphere. 21:9 aspect ratio.
```

### Ventajas vs parallax multicapa
| Aspecto | Capas parallax | Video IA |
|---------|---------------|----------|
| Realismo | ~80% | ~95% |
| Movimiento | Simulado | Real y fluido |
| Continuidad | Cortes entre secciones | Transicion continua |
| Pipeline | Nuevo | **Ya existe en codebase** |
| Complejidad de codigo | Alta | Baja (ya hecho) |

---

## 10. Funcionalidades Completas (44 features)

### Frontend Publico
1. **Home** — Hero con video IA scroll-driven, proposicion de valor, testimonios, servicios, CTA, WhatsApp flotante
2. **Nosotros** — Historia, mision, perfil de Daniela Quiroga y equipo, especialidades
3. **Servicios / Agendar** — Wizard 3 pasos: servicio → psicologo → horario (Cal.com API) → confirmacion
4. **Blog** — Listado con cards, paginas individuales, contenido desde Sanity CMS, SEO por articulo
5. **Tienda** — Catalogo, filtros, carrito (Zustand), checkout PayPal, confirmacion, conversion USD/COP
6. **Contacto** — Formulario, ubicacion, redes sociales, WhatsApp directo
7. **Podcast** (nuevo) — Listado de episodios, player embebido, acceso gated para premium
8. **Membresia** (nuevo) — Planes Gratis/Basico/Premium, acceso a contenido exclusivo

### Frontend Auth
9. **Login** — Email + password, redireccion por rol
10. **Registro** — Nombre, email, password, creacion automatica de Patient
11. **Reset Password** — Solicitar reset por email, token seguro, formulario nueva contrasena

### Frontend Portal del Paciente
12. **Dashboard** — Proximas citas, compras recientes, estado membresia
13. **Mis Citas** — Listado, estados, cancelar, notas
14. **Mis Compras** — Historial, estado pedido, acceso a productos digitales
15. **Mi Perfil** — Editar datos, cambiar contrasena, eliminar cuenta (GDPR)

### Frontend Admin
16. **Dashboard Admin** — Estadisticas (pacientes, citas, ingresos), graficos
17. **Gestion Productos** — CRUD completo, tipo digital/fisico, imagenes, stock
18. **Gestion Citas** — Ver todas, filtrar, actualizar estado
19. **Gestion Ordenes** — Listado, filtros, actualizar estado envio
20. **Gestion Blog** — CRUD posts, editor, borrador/publicado
21. **Gestion Equipo** — CRUD psicologos, bio, especialidades, servicios
22. **Configuracion Sitio** — Nombre, horarios, contacto, redes sociales
23. **Sanity Studio** — CMS en /admin/contenido, gestion editorial independiente

### Backend (API Routes)
24. **Auth API** — registro, forgot-password, reset-password, NextAuth handlers
25. **Scheduling API** — servicios, psicologos, slots disponibles, reservar cita
26. **Store API** — productos, checkout PayPal, exchange rate USD/COP
27. **Admin API** — CRUD protegido (rol ADMIN) para productos, blog, equipo, citas, ordenes, config
28. **Portal API** — perfil, citas, compras, contrasena, eliminacion cuenta
29. **Cron API** — recordatorios WhatsApp automaticos (24h y 1h antes)

### Integraciones
30. **Cal.com** — agendamiento y disponibilidad
31. **PayPal** — procesamiento de pagos
32. **WhatsApp/Twilio** — recordatorios automaticos
33. **Sanity** — CMS editorial
34. **Sentry** — monitoreo de errores
35. **Pexels** → sera reemplazado por IA para imagenes/video

### Infraestructura
36. **PostgreSQL** via Supabase + Prisma 7 (driver adapter PrismaPg)
37. **Autenticacion** — NextAuth.js con JWT + bcrypt
38. **Proteccion de rutas** — proxy.ts (paginas) + route.ts (APIs)
39. **SEO** — metadata dinamica, sitemap.xml, robots.txt
40. **GDPR** — privacidad, terminos, cookies, eliminacion de cuenta
41. **Seguridad** — headers, rate limiting, sanitizacion
42. **Loading skeletons** — todas las rutas
43. **Error pages** — 404 y 500 personalizadas
44. **Responsive** — mobile-first, todas las paginas

---

## 11. Infraestructura de Deploy

| Servicio | Recurso | Estado |
|----------|---------|--------|
| GitHub | org: vitalemotion, repo: vitalemotion | Creado |
| Vercel | proyecto conectado al repo | Pendiente |
| Supabase | PostgreSQL managed | Pendiente |

### Variables de entorno para produccion
```
DATABASE_URL=postgresql://...supabase...
NEXTAUTH_SECRET=<generar-secreto-seguro>
NEXTAUTH_URL=https://vitalemotion.vercel.app
NEXT_PUBLIC_SANITY_PROJECT_ID=<crear-proyecto-sanity>
NEXT_PUBLIC_SANITY_DATASET=production
CALCOM_API_KEY=<cuando-tengan>
PAYPAL_CLIENT_ID=<cuando-tengan>
PAYPAL_CLIENT_SECRET=<cuando-tengan>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<cuando-tengan>
ALLOW_MOCK_INTEGRATIONS=true
```

---

## 12. Stack Tecnico Final

| Componente | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 |
| Styling | Tailwind CSS 4 |
| Animaciones | GSAP + ScrollTrigger + Lenis |
| Video scroll | Canvas + fotogramas WebP (pipeline existente) |
| CMS | Sanity |
| DB | Prisma 7 + Supabase (PostgreSQL) + PrismaPg adapter |
| Auth | NextAuth.js |
| Pagos | PayPal |
| Agendamiento | Cal.com |
| Mensajeria | WhatsApp (Twilio) |
| Monitoreo | Sentry |
| Deploy | Vercel |
| Video IA | Sora / Runway Gen-3 / Kling 2.0 |

---

## 13. Conversaciones y Decisiones Clave

| Fecha | Decision | Razon |
|-------|----------|-------|
| 2026-03-17 | Monolito Next.js (no separar FE/BE) | Escala no lo justifica, SSR directo a DB, un solo deploy |
| 2026-03-17 | Referencia: Anima Wellness | Negocio casi identico, estetica premium, storytelling |
| 2026-03-17 | NO usar WebGL/Three.js | Pesado para celulares en Colombia, overkill |
| 2026-03-17 | Video IA en vez de parallax multicapa | Pipeline ya existe, resultado mas realista, menos codigo |
| 2026-03-17 | Renombrar a "vitalemotion" | Pedido del cliente |
| 2026-03-17 | Agregar membresia | Pedido del cliente para gated content |
| 2026-03-17 | Deploy en Vercel + Supabase | Infra managed, gratis para empezar |
