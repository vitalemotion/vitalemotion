"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface HeroScrollProps {
  framesPath: string;
  frameCount?: number;
  title: string;
  subtitle?: string;
}

const PRELOAD_COUNT = 30;

function frameUrl(basePath: string, index: number, total: number): string {
  const num = String(Math.min(Math.max(index, 1), total)).padStart(4, "0");
  return `${basePath}/frame_${num}.webp`;
}

export default function HeroScroll({
  framesPath,
  frameCount = 192,
  title,
  subtitle,
}: HeroScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // No frame available — draw solid fallback color
      canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
      ctx.fillStyle = "#5B7A6E"; // primary-dark
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  // Draw fallback on canvas when frames aren't available
  const drawFallback = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
    ctx.fillStyle = "#5B7A6E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Pre-create all image elements
      const images: HTMLImageElement[] = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        images.push(img);
      }
      imagesRef.current = images;

      // Track whether any frames loaded successfully
      let anyFrameLoaded = false;
      let eagerErrors = 0;
      let loadedEager = 0;

      const onEagerLoad = () => {
        loadedEager++;
        anyFrameLoaded = true;
        if (loadedEager === 1) {
          drawFrame(0);
          setLoaded(true);
        }
      };

      const onEagerError = () => {
        eagerErrors++;
        if (eagerErrors >= PRELOAD_COUNT && !anyFrameLoaded) {
          // No frames available — show fallback
          setLoaded(true);
          drawFallback();
        }
      };

      // Eagerly load first PRELOAD_COUNT frames
      for (let i = 0; i < Math.min(PRELOAD_COUNT, frameCount); i++) {
        images[i].onload = onEagerLoad;
        images[i].onerror = onEagerError;
        images[i].src = frameUrl(framesPath, i + 1, frameCount);
      }

      // Lazy-load the rest
      for (let i = PRELOAD_COUNT; i < frameCount; i++) {
        images[i].src = frameUrl(framesPath, i + 1, frameCount);
      }

      // --- GSAP: Frame scrubbing via ScrollTrigger ---
      const obj = { frame: 0 };
      const frameTween = gsap.to(obj, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          const idx = Math.round(obj.frame);
          if (idx !== currentFrameRef.current) {
            currentFrameRef.current = idx;
            drawFrame(idx);
          }
        },
      });
      cleanupFns.push(() => frameTween.kill());

      // --- Timeline 1: Page load fade-in (~2.5s) ---

      // Set initial states
      gsap.set(".hero-canvas-wrap", {
        filter: "blur(40px) brightness(2) saturate(0)",
        scale: 1.12,
      });
      gsap.set(".hero-fadein-gradient", { y: "0%" });
      gsap.set(".hero-fadein-overlay", { opacity: 1 });

      const fadeInTL = gsap.timeline({ delay: 0.2 });
      cleanupFns.push(() => fadeInTL.kill());

      fadeInTL
        // Overlay fades from opacity 1 -> 0
        .to(".hero-fadein-overlay", {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        // Gradient wipe slides down (y: 0% -> 100%)
        .to(
          ".hero-fadein-gradient",
          { y: "100%", duration: 1.2, ease: "power2.inOut" },
          0.1
        )
        // Canvas blur cascade: 40px -> 16px
        .to(
          ".hero-canvas-wrap",
          {
            filter: "blur(16px) brightness(1.5) saturate(0.3)",
            scale: 1.06,
            duration: 0.8,
            ease: "power2.out",
          },
          0
        )
        // 16px -> 4px
        .to(
          ".hero-canvas-wrap",
          {
            filter: "blur(4px) brightness(1.1) saturate(0.7)",
            scale: 1.02,
            duration: 0.7,
            ease: "power2.out",
          },
          0.6
        )
        // 4px -> 0px
        .to(
          ".hero-canvas-wrap",
          {
            filter: "blur(0px) brightness(1) saturate(1)",
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          1.1
        );

      // --- Timeline 2: Hero text entrance ---
      const titleAnim = gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          delay: 0.3,
        }
      );
      cleanupFns.push(() => titleAnim.kill());

      if (subtitle) {
        const subtitleAnim = gsap.fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7 }
        );
        cleanupFns.push(() => subtitleAnim.kill());
      }

      // --- Timeline 3: Text fade-out on scroll (0% -> 15%) ---
      const textFadeOut = gsap.to(".hero-text-container", {
        opacity: 0,
        y: -80,
        scale: 0.9,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "15% top",
          scrub: true,
        },
      });
      cleanupFns.push(() => textFadeOut.kill());

      // --- Timeline 5: Progressive dissolve (scroll 65% -> 100%) ---
      const dissolveTL = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "65% top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      cleanupFns.push(() => dissolveTL.kill());

      dissolveTL
        // 0-0.28: subtle blur + brightness lift
        .to(
          ".hero-canvas-wrap",
          {
            filter: "blur(4px) brightness(1.15) saturate(1)",
            scale: 1.02,
            duration: 0.28,
          },
          0
        )
        // 0.14-0.56: gradient wipe from bottom
        .to(
          ".hero-dissolve-gradient",
          { y: "0%", duration: 0.56 },
          0.14
        )
        // 0.28-0.56: heavier blur
        .to(
          ".hero-canvas-wrap",
          {
            filter: "blur(16px) brightness(1.6) saturate(0.3)",
            scale: 1.06,
            duration: 0.28,
          },
          0.28
        )
        // 0.56-0.85: full overlay fade in (cream #FAF8F5)
        .to(
          ".hero-dissolve-overlay",
          { opacity: 1, duration: 0.29 },
          0.56
        )
        // 0.56-1: extreme blur/brightness out
        .to(
          ".hero-canvas-wrap",
          {
            filter: "blur(40px) brightness(2) saturate(0)",
            scale: 1.12,
            duration: 0.44,
          },
          0.56
        );

      // --- Timeline 6: Scroll indicator fade (0% -> 5%) ---
      const scrollIndicatorFade = gsap.to(".hero-scroll-indicator", {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "5% top",
          scrub: true,
        },
      });
      cleanupFns.push(() => scrollIndicatorFade.kill());
    }

    init();

    return () => {
      cleanupFns.forEach((fn) => fn());
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, [drawFrame, drawFallback, framesPath, frameCount, subtitle]);

  return (
    <section>
      <div ref={containerRef} className="h-[500vh] relative">
        <div className="sticky top-0 h-dvh flex items-center justify-center overflow-hidden bg-primary-dark">
          {/* Canvas wrapper for scale + blur dissolve */}
          <div className="hero-canvas-wrap w-full h-full">
            <canvas
              ref={canvasRef}
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ maxHeight: "100dvh" }}
            />
          </div>

          {/* === FADE-IN layers === */}
          {/* Cream overlay that fades out at start */}
          <div
            className="hero-fadein-overlay absolute inset-0 pointer-events-none z-10"
            style={{ backgroundColor: "#FAF8F5" }}
          />
          {/* Gradient wipe from top -- slides down to reveal */}
          <div
            className="hero-fadein-gradient absolute inset-0 pointer-events-none z-[9]"
            style={{
              background:
                "linear-gradient(to bottom, #FAF8F5 0%, #FAF8F5 40%, rgba(250,248,245,0.8) 60%, rgba(250,248,245,0) 100%)",
            }}
          />

          {/* === FADE-OUT layers === */}
          {/* Gradient wipe from bottom -- starts below, slides up */}
          <div
            className="hero-dissolve-gradient absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #FAF8F5 0%, #FAF8F5 40%, rgba(250,248,245,0.8) 60%, rgba(250,248,245,0) 100%)",
              transform: "translateY(100%)",
            }}
          />

          {/* Final full cream dissolve */}
          <div
            className="hero-dissolve-overlay absolute inset-0 opacity-0 pointer-events-none"
            style={{ backgroundColor: "#FAF8F5" }}
          />

          {/* Overlay text -- fade out on scroll */}
          <div className="hero-text-container absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            <div className="text-center px-4">
              <h1 className="hero-title font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 opacity-0 text-text-primary drop-shadow-[0_2px_12px_rgba(250,248,245,0.7)]">
                {title}
              </h1>
              {subtitle && (
                <p className="hero-subtitle text-sm sm:text-lg md:text-2xl font-medium tracking-[0.15em] uppercase opacity-0 text-text-primary drop-shadow-[0_1px_8px_rgba(250,248,245,0.6)]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Loading skeleton while frames load */}
          {!loaded && (
            <div
              className="absolute inset-0 z-30 flex flex-col items-center justify-center"
              style={{ backgroundColor: "#FAF8F5" }}
            >
              <span className="font-serif text-xl font-bold tracking-[0.1em] uppercase text-primary-dark opacity-30 animate-pulse">
                Vital Emocion
              </span>
              <div className="mt-6 w-32 h-0.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full w-1/3 rounded-full bg-primary"
                  style={{
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          )}

          {/* Scroll indicator */}
          <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="flex flex-col items-center gap-2 text-text-primary">
              <span className="text-[10px] tracking-widest uppercase opacity-60">
                Scroll
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="animate-bounce"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
