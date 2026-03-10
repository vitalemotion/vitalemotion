"use client";

import { use, useState } from "react";
import Link from "next/link";
import AnimatedSection from "@/components/animations/AnimatedSection";
import ProductCard from "@/components/store/ProductCard";
import { useCartStore } from "@/stores/cart";
import { useToastStore } from "@/components/store/CartToast";
import { placeholderProducts } from "../page";

function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const [added, setAdded] = useState(false);

  const product = placeholderProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-6 text-center pt-36">
        <h1 className="font-serif text-3xl text-text-primary mb-4">
          Producto no encontrado
        </h1>
        <Link
          href="/tienda"
          className="text-primary hover:text-primary-dark transition-colors duration-300"
        >
          &larr; Volver a la tienda
        </Link>
      </div>
    );
  }

  const relatedProducts = placeholderProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: product.type,
    });
    showToast(`${product.name} agregado al carrito`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="pt-24">
      <div className="max-w-6xl mx-auto py-20 px-6">
        {/* Back link */}
        <AnimatedSection animation="fade-up">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors duration-300 mb-8"
          >
            &larr; Volver a la tienda
          </Link>
        </AnimatedSection>

        {/* Product detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <div
              className="h-96 rounded-2xl w-full"
              style={{ backgroundColor: product.image }}
            />
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                {product.type === "DIGITAL" ? (
                  <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success">
                    Descarga inmediata
                  </span>
                ) : (
                  <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                    {product.category} &middot; Producto fisico
                  </span>
                )}
              </div>

              <h1 className="font-serif text-4xl text-text-primary mb-4">
                {product.name}
              </h1>

              <p className="text-accent font-bold text-2xl mb-6">
                {formatCOP(product.price)}
              </p>

              <p className="text-text-secondary leading-relaxed mb-8">
                {product.description}
              </p>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl text-base font-medium transition-all duration-300 ${
                  added
                    ? "bg-success text-white"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {added ? "Agregado \u2713" : "Agregar al carrito"}
              </button>
            </div>
          </AnimatedSection>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <AnimatedSection animation="fade-up">
              <h2 className="font-serif text-3xl text-text-primary mb-8">
                Productos relacionados
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={p.price}
                  image={p.image}
                  type={p.type}
                  category={p.category}
                  tags={p.tags}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
