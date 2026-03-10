import HeroScroll from "@/components/animations/HeroScroll";
import AnimatedSection from "@/components/animations/AnimatedSection";

export default function Home() {
  return (
    <main>
      <HeroScroll
        framesPath="/frames/hero"
        frameCount={192}
        title="Tu bienestar emocional comienza aqui"
        subtitle="Psicologos profesionales dedicados a tu salud mental"
      />

      <section className="py-20 px-6">
        <AnimatedSection animation="fade-up">
          <div className="bg-surface p-12 rounded-2xl max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl mb-4">Bienvenido a Vital Emocion</h2>
            <p className="text-text-secondary">Contenido despues del hero scroll</p>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
