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

export const placeholderProducts: Product[] = [
  {
    id: "1",
    name: "El Arte de la Calma",
    slug: "el-arte-de-la-calma",
    price: 45000,
    image: "#A8C5B8",
    type: "PHYSICAL",
    category: "Libros",
    tags: ["bienestar", "calma"],
    description:
      "Una guia completa para encontrar paz interior en medio del caos cotidiano. Este libro te ofrece herramientas practicas para cultivar la serenidad y mejorar tu calidad de vida a traves de ejercicios de respiracion, meditacion y reflexion.",
  },
  {
    id: "2",
    name: "Guia de Mindfulness",
    slug: "guia-de-mindfulness",
    price: 25000,
    image: "#D4B896",
    type: "DIGITAL",
    category: "Digital",
    tags: ["mindfulness", "meditacion"],
    description:
      "Descarga inmediata de nuestra guia digital de mindfulness. Incluye 30 ejercicios practicos, meditaciones guiadas en audio y un plan de 21 dias para incorporar la atencion plena en tu rutina diaria.",
  },
  {
    id: "3",
    name: "Diario de Emociones",
    slug: "diario-de-emociones",
    price: 35000,
    image: "#C4916E",
    type: "PHYSICAL",
    category: "Materiales",
    tags: ["emociones", "diario"],
    description:
      "Un hermoso diario diseñado especificamente para el registro y exploracion de tus emociones. Con prompts diarios, espacios para reflexion y ejercicios de autoconocimiento que te ayudaran a entender mejor tu mundo emocional.",
  },
  {
    id: "4",
    name: "Taller de Autoestima (Video)",
    slug: "taller-de-autoestima-video",
    price: 60000,
    image: "#B8A8C5",
    type: "DIGITAL",
    category: "Digital",
    tags: ["autoestima", "taller"],
    description:
      "Acceso inmediato a nuestro taller en video sobre autoestima. 6 modulos con mas de 4 horas de contenido, ejercicios practicos y material complementario para fortalecer tu relacion contigo mismo.",
  },
  {
    id: "5",
    name: "Manual de Terapia Cognitiva",
    slug: "manual-de-terapia-cognitiva",
    price: 55000,
    image: "#7C9A8E",
    type: "PHYSICAL",
    category: "Libros",
    tags: ["terapia", "cognitiva"],
    description:
      "Manual completo de tecnicas de terapia cognitivo-conductual adaptado para el autoconocimiento. Incluye ejercicios, cuestionarios de evaluacion y estrategias comprobadas para modificar patrones de pensamiento negativos.",
  },
  {
    id: "6",
    name: "Meditaciones Guiadas",
    slug: "meditaciones-guiadas",
    price: 20000,
    image: "#96B8D4",
    type: "DIGITAL",
    category: "Digital",
    tags: ["meditacion", "audio"],
    description:
      "Coleccion de 15 meditaciones guiadas en formato digital. Desde relajacion profunda hasta visualizacion creativa, cada sesion esta diseñada para diferentes momentos y necesidades emocionales.",
  },
  {
    id: "7",
    name: "Cuaderno de Gratitud",
    slug: "cuaderno-de-gratitud",
    price: 30000,
    image: "#D4C896",
    type: "PHYSICAL",
    category: "Materiales",
    tags: ["gratitud", "bienestar"],
    description:
      "Un cuaderno bellamente ilustrado para practicar la gratitud diaria. Con espacios para escribir, reflexionar y visualizar lo positivo en tu vida. 365 paginas para un año completo de practica.",
  },
  {
    id: "8",
    name: "Curso: Inteligencia Emocional",
    slug: "curso-inteligencia-emocional",
    price: 80000,
    image: "#C5A8B8",
    type: "DIGITAL",
    category: "Digital",
    tags: ["inteligencia emocional", "curso"],
    description:
      "Curso digital completo de inteligencia emocional. 8 modulos, mas de 10 horas de contenido en video, cuadernos de trabajo descargables y acceso a comunidad privada de apoyo.",
  },
  {
    id: "9",
    name: "El Camino del Autoconocimiento",
    slug: "el-camino-del-autoconocimiento",
    price: 50000,
    image: "#8EB89A",
    type: "PHYSICAL",
    category: "Libros",
    tags: ["autoconocimiento", "desarrollo personal"],
    description:
      "Un viaje literario hacia el autoconocimiento profundo. Este libro combina filosofia, psicologia y ejercicios practicos para guiarte en el descubrimiento de tu verdadero ser.",
  },
  {
    id: "10",
    name: "Kit de Relajacion",
    slug: "kit-de-relajacion",
    price: 40000,
    image: "#B8C5A8",
    type: "PHYSICAL",
    category: "Materiales",
    tags: ["relajacion", "kit"],
    description:
      "Kit completo para tus sesiones de relajacion en casa. Incluye guia impresa de tecnicas de relajacion, tarjetas de afirmaciones positivas, y un plan de bienestar de 30 dias.",
  },
];

export default function TiendaPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeType, setActiveType] = useState("Todos");

  const filteredProducts = useMemo(() => {
    return placeholderProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "Todos" || product.category === activeCategory;
      const matchesType =
        activeType === "Todos" ||
        (activeType === "Fisico" && product.type === "PHYSICAL") ||
        (activeType === "Digital" && product.type === "DIGITAL");
      return matchesCategory && matchesType;
    });
  }, [activeCategory, activeType]);

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
