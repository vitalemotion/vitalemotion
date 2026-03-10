"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "blur-in";
  delay?: number;
  duration?: number;
}

const animations = {
  "fade-up": { from: { opacity: 0, y: 80 }, to: { opacity: 1, y: 0 } },
  "fade-left": { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
  "fade-right": { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
  scale: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
  },
  "blur-in": {
    from: { opacity: 0, filter: "blur(10px)" },
    to: { opacity: 1, filter: "blur(0px)" },
  },
};

export default function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!ref.current) return;

      const anim = animations[animation];
      gsap.fromTo(ref.current, anim.from, {
        ...anim.to,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    }
    init();
  }, [animation, delay, duration]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
