"use client";

import { useState, useMemo } from "react";
import AnimatedSection from "@/components/animations/AnimatedSection";
import ProductCard from "@/components/store/ProductCard";
import ProductFilters from "@/components/store/ProductFilters";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  type: "DIGITAL" | "PHYSICAL";
  category: string;
  tags: string[];
  description: string;
}

interface TiendaClientProps {
  products: Product[];
}

export default function TiendaClient({ products }: TiendaClientProps) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeType, setActiveType] = useState("Todos");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "Todos" || product.category === activeCategory;
      const matchesType =
        activeType === "Todos" ||
        (activeType === "Fisico" && product.type === "PHYSICAL") ||
        (activeType === "Digital" && product.type === "DIGITAL");
      return matchesCategory && matchesType;
    });
  }, [products, activeCategory, activeType]);

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary py-16 px-6 text-center pt-32">
        <AnimatedSection animation="fade-up">
          <h1 className="font-serif text-5xl text-text-primary mb-4">
            Nuestra Tienda
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Recursos y materiales para tu crecimiento personal
          </p>
        </AnimatedSection>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        <ProductFilters
          activeCategory={activeCategory}
          activeType={activeType}
          onCategoryChange={setActiveCategory}
          onTypeChange={setActiveType}
        />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">
              No hay productos que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={product.image}
                type={product.type}
                category={product.category}
                tags={product.tags}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
