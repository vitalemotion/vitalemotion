import AnimatedSection from "@/components/animations/AnimatedSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="h-screen flex items-center justify-center flex-col">
        <h1 className="font-serif text-5xl text-primary">Vital Emocion</h1>
        <p className="text-text-secondary mt-4">
          Scroll para ver las animaciones
        </p>
      </div>

      <AnimatedSection animation="fade-up">
        <div className="bg-surface p-12 rounded-2xl max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl">Fade Up</h2>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-left" delay={0.15}>
        <div className="bg-surface p-12 rounded-2xl max-w-2xl mx-auto mt-12">
          <h2 className="font-serif text-3xl">Fade Left</h2>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-right" delay={0.3}>
        <div className="bg-surface p-12 rounded-2xl max-w-2xl mx-auto mt-12">
          <h2 className="font-serif text-3xl">Fade Right</h2>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="scale">
        <div className="bg-surface p-12 rounded-2xl max-w-2xl mx-auto mt-12">
          <h2 className="font-serif text-3xl">Scale</h2>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="blur-in">
        <div className="bg-surface p-12 rounded-2xl max-w-2xl mx-auto mt-12 mb-24">
          <h2 className="font-serif text-3xl">Blur In</h2>
        </div>
      </AnimatedSection>
    </main>
  );
}
