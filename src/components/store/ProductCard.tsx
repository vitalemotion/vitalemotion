"use client";

import { useState } from "react";
import Link from "next/link";
import AnimatedSection from "@/components/animations/AnimatedSection";
import { useCartStore } from "@/stores/cart";
import { useToastStore } from "@/components/store/CartToast";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  type: "DIGITAL" | "PHYSICAL";
  category: string;
  tags: string[];
  index: number;
}

function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  type,
  category,
  index,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({ id, name, price, image, type });
    showToast(`${name} agregado al carrito`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <AnimatedSection animation="fade-up" delay={index * 0.15}>
      <div className="bg-surface rounded-2xl overflow-hidden shadow-lg shadow-black/5 flex flex-col h-full">
        <Link href={`/tienda/${slug}`} className="block overflow-hidden">
          <div
            className="h-64 transition-transform duration-500 hover:scale-110"
            style={{ backgroundColor: image }}
          />
        </Link>

        <div className="p-5 flex flex-col flex-1">
          <div className="mb-3">
            {type === "DIGITAL" ? (
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">
                Descarga inmediata
              </span>
            ) : (
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {category}
              </span>
            )}
          </div>

          <Link href={`/tienda/${slug}`}>
            <h3 className="font-serif text-lg text-text-primary mb-2 hover:text-primary transition-colors duration-300">
              {name}
            </h3>
          </Link>

          <p className="text-accent font-semibold text-lg mb-4">
            {formatCOP(price)}
          </p>

          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                added
                  ? "bg-success text-white"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {added ? "Agregado \u2713" : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
