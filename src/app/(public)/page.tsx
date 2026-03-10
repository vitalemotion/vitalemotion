import HeroScroll from "@/components/animations/HeroScroll";
import ValueProposition from "@/components/home/ValueProposition";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import CTASection from "@/components/home/CTASection";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <main>
      <HeroScroll
        framesPath="/frames/hero"
        frameCount={192}
        title="Tu bienestar emocional comienza aqui"
        subtitle="Psicologos profesionales dedicados a tu salud mental"
      />
      <ValueProposition />
      <TestimonialsCarousel />
      <CTASection />
      <FeaturedProducts />
    </main>
  );
}
