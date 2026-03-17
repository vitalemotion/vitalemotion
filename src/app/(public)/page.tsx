import type { Metadata } from "next";
import HeroScroll from "@/components/animations/HeroScroll";
import ValueProposition from "@/components/home/ValueProposition";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import CTASection from "@/components/home/CTASection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { prisma } from "@/lib/db";
import { getHomePageContent } from "@/sanity/lib/content";

interface FeaturedProduct {
  title: string;
  price: string;
  tag: string;
  slug: string;
}

const PLACEHOLDER_FEATURED: FeaturedProduct[] = [
  { title: "El Arte de la Calma", price: "$45.000", tag: "Libro", slug: "el-arte-de-la-calma" },
  { title: "Guia de Mindfulness", price: "$25.000", tag: "Digital", slug: "guia-de-mindfulness" },
  { title: "Diario de Emociones", price: "$35.000", tag: "Libro", slug: "diario-de-emociones" },
  { title: "Taller de Autoestima (Video)", price: "$60.000", tag: "Digital", slug: "taller-de-autoestima-video" },
];

export const metadata: Metadata = {
  title: "Vital Emocion | Bienestar Psicologico",
  description:
    "Centro de bienestar psicologico. Terapia individual, terapia de pareja, talleres y recursos para tu salud mental.",
  openGraph: {
    title: "Vital Emocion | Bienestar Psicologico",
    description: "Tu bienestar emocional comienza aqui",
    type: "website",
  },
};

function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        title: p.name,
        price: formatCOP(p.price),
        tag: p.type === "DIGITAL" ? "Digital" : p.category,
        slug: p.slug,
      }));
    }
    return PLACEHOLDER_FEATURED;
  } catch {
    return PLACEHOLDER_FEATURED;
  }
}

export default async function Home() {
  const homeContent = await getHomePageContent();
  const featuredProducts = await getFeaturedProducts();
  const heroTitle =
    homeContent?.heroTitle || "Tu bienestar emocional comienza aqui";
  const heroSubtitle =
    homeContent?.heroSubtitle ||
    "Psicologos profesionales dedicados a tu salud mental";

  return (
    <main>
      <HeroScroll
        framesPath="/frames/hero"
        frameCount={192}
        title={heroTitle}
        subtitle={heroSubtitle}
      />
      <ValueProposition
        eyebrow={homeContent?.servicesEyebrow || undefined}
        heading={homeContent?.servicesHeading || undefined}
        services={
          homeContent?.serviceHighlights?.length
            ? homeContent.serviceHighlights
            : undefined
        }
      />
      <TestimonialsCarousel
        heading={homeContent?.testimonialsHeading || undefined}
        testimonials={
          homeContent?.testimonials?.length ? homeContent.testimonials : undefined
        }
      />
      <CTASection
        title={homeContent?.ctaTitle || undefined}
        description={homeContent?.ctaDescription || undefined}
        buttonLabel={homeContent?.ctaButtonLabel || undefined}
        buttonHref={homeContent?.ctaButtonHref || undefined}
      />
      <FeaturedProducts products={featuredProducts} />
    </main>
  );
}
