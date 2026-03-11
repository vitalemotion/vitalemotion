"use client";

import { useState } from "react";
import AnimatedSection from "@/components/animations/AnimatedSection";

interface ServiceCardProps {
  name: string;
  description: string;
  duration: string;
  price: string;
  index: number;
}

export default function ServiceCard({
  name,
  description,
  duration,
  price,
  index,
}: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedSection animation="fade-up" delay={index * 0.1}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className="bg-surface rounded-2xl p-8 shadow-lg shadow-black/5 cursor-pointer transition-all duration-300"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(!expanded); } }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-serif text-xl text-text-primary">{name}</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">
                {duration}
              </span>
              <span className="text-accent font-semibold text-sm">{price}</span>
            </div>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            className={`text-text-muted transition-transform duration-300 mt-1 flex-shrink-0 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expanded ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-text-secondary leading-relaxed text-sm">
            {description}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
