"use client";

import { useEffect, useRef } from "react";

export default function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!ref.current) return;

      gsap.to(ref.current, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "5% top",
          scrub: true,
        },
      });
    }
    init();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="flex flex-col items-center gap-2 text-text-muted">
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
          className="animate-scroll-bounce"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
