"use client";

import { useState, useEffect, useCallback } from "react";
import AnimatedSection from "@/components/animations/AnimatedSection";

interface Testimonial {
  quote: string;
  name: string;
}

const defaultTestimonials = [
  {
    quote:
      "Gracias a Vital Emocion encontre las herramientas para manejar mi ansiedad. Mi vida ha cambiado completamente.",
    name: "Maria G.",
  },
  {
    quote:
      "La terapia de pareja nos ayudo a reconectar y entender nuestras necesidades. Muy agradecidos.",
    name: "Carlos y Ana",
  },
  {
    quote:
      "Los talleres de mindfulness me han dado paz interior. Un equipo excepcional de profesionales.",
    name: "Laura P.",
  },
  {
    quote:
      "Despues de meses buscando ayuda, encontre en Vital Emocion el apoyo que necesitaba.",
    name: "Andres M.",
  },
];

export default function TestimonialsCarousel({
  heading = "Lo que dicen nuestros pacientes",
  testimonials = defaultTestimonials,
}: {
  heading?: string;
  testimonials?: Testimonial[];
}) {
  const resolvedTestimonials =
    testimonials.length > 0 ? testimonials : defaultTestimonials;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % resolvedTestimonials.length);
  }, [resolvedTestimonials.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="bg-secondary py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section header */}
        <AnimatedSection animation="blur-in" className="mb-12">
          <h2 className="font-serif text-4xl text-text-primary">
            {heading}
          </h2>
        </AnimatedSection>

        {/* Carousel */}
        <div className="relative min-h-[220px] flex flex-col items-center justify-center">
          {/* Quote icon */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary/30 mb-6"
          >
            <path
              d="M10 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2c0 1.65-1.35 3-3 3v1c2.76 0 5-2.24 5-5V10c0-1.1-.9-2-2-2h-2zm-7 0c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2c0 1.65-1.35 3-3 3v1c2.76 0 5-2.24 5-5V10c0-1.1-.9-2-2-2H3z"
              fill="currentColor"
              transform="rotate(180 12 12)"
            />
          </svg>

          {/* Testimonials */}
          {resolvedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="absolute inset-x-0 top-12 transition-opacity duration-500 ease-in-out"
              style={{
                opacity: index === current ? 1 : 0,
                pointerEvents: index === current ? "auto" : "none",
              }}
            >
              <blockquote className="text-lg md:text-xl text-text-primary leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <p className="text-accent font-medium">&mdash; {testimonial.name}</p>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {resolvedTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Ir al testimonio ${index + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-primary w-6"
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
