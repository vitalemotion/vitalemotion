"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function CTASection({
  title = "Comienza tu camino hacia el bienestar",
  description = "Agenda tu primera cita y da el primer paso hacia una vida mas plena.",
  buttonLabel = "Agendar Cita",
  buttonHref = "/agendar",
}: {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      // Initial state: hidden, blurred, scaled
      gsap.set(".cta-bg-wrap", {
        filter: "blur(40px) brightness(2) saturate(0)",
        scale: 1.15,
      });
      gsap.set(".cta-glass-overlay", { opacity: 0 });
      gsap.set(".cta-fadein-overlay", { opacity: 1 });
      gsap.set(".cta-fadein-gradient", { y: "-100%" });
      gsap.set(".cta-content", { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "top 30%",
          scrub: true,
        },
      });

      tl
        // White overlay fades out
        .to(".cta-fadein-overlay", { opacity: 0, duration: 0.3 }, 0)
        // Gradient wipe reveals from top
        .to(".cta-fadein-gradient", { y: "100%", duration: 0.6 }, 0)
        // Background materializes: extreme blur -> medium
        .to(
          ".cta-bg-wrap",
          {
            filter: "blur(16px) brightness(1.4) saturate(0.4)",
            scale: 1.08,
            duration: 0.4,
          },
          0
        )
        // Medium -> subtle
        .to(
          ".cta-bg-wrap",
          {
            filter: "blur(4px) brightness(1.1) saturate(0.8)",
            scale: 1.03,
            duration: 0.3,
          },
          0.3
        )
        // Fully resolved
        .to(
          ".cta-bg-wrap",
          {
            filter: "blur(0px) brightness(1) saturate(1)",
            scale: 1,
            duration: 0.3,
          },
          0.5
        )
        // Glass overlay fades in
        .to(".cta-glass-overlay", { opacity: 1, duration: 0.4 }, 0.4)
        // Content appears
        .to(".cta-content", { opacity: 1, y: 0, duration: 0.3 }, 0.6);

      // Content stagger animations
      gsap.fromTo(
        ".cta-title",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 60%", once: true },
        }
      );
      gsap.fromTo(
        ".cta-desc",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 60%", once: true },
        }
      );
      gsap.fromTo(
        ".cta-button",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 60%", once: true },
        }
      );
    }

    init();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-36 text-center overflow-hidden"
    >
      {/* Background: gradient placeholder */}
      <div
        className="cta-bg-wrap absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #7C9A8E 0%, #5B7A6E 40%, #4A6A5E 70%, #3D5D51 100%)",
        }}
      />

      {/* Fade-in layers (start visible, removed by scroll) */}
      <div
        className="cta-fadein-overlay absolute inset-0 pointer-events-none z-10"
        style={{ backgroundColor: "#FAF8F5" }}
      />
      <div
        className="cta-fadein-gradient absolute inset-0 pointer-events-none z-[9]"
        style={{
          background:
            "linear-gradient(to bottom, #FAF8F5 0%, #FAF8F5 40%, rgba(250,248,245,0.8) 60%, rgba(250,248,245,0) 100%)",
        }}
      />

      {/* Frosted glass overlay */}
      <div
        className="cta-glass-overlay absolute inset-0 opacity-0"
        style={{
          backgroundColor: "rgba(91, 122, 110, 0.55)",
          backdropFilter: "saturate(1.6) blur(24px)",
          WebkitBackdropFilter: "saturate(1.6) blur(24px)",
        }}
      />

      {/* Soft top edge */}
      <div
        className="absolute inset-x-0 top-0 h-20 md:h-36 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to bottom, #FAF8F5 0%, rgba(250,248,245,0.7) 40%, rgba(250,248,245,0) 100%)",
        }}
      />

      {/* Content */}
      <div className="cta-content relative max-w-2xl mx-auto px-6 z-30">
        <h2 className="cta-title text-2xl sm:text-3xl md:text-5xl font-serif text-white mb-3 md:mb-4 drop-shadow-lg">
          {title}
        </h2>
        <p className="cta-desc text-white/80 mb-6 md:mb-10 text-base md:text-lg drop-shadow">
          {description}
        </p>
        <Link
          href={buttonHref}
          className="cta-button inline-block bg-accent text-white rounded-xl px-8 py-4 font-medium transition-all duration-300 hover:bg-accent/90 hover:scale-[1.02] hover:shadow-lg active:scale-95"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
