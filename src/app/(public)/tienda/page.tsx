import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import TiendaClient from "@/components/store/TiendaClient";
import type { Product } from "@/components/store/TiendaClient";

export const metadata: Metadata = {
  title: "Tienda | Vital Emocion",
  description:
    "Libros, guias digitales y materiales para tu crecimiento personal.",
  openGraph: {
    title: "Tienda | Vital Emocion",
    description:
      "Libros, guias digitales y materiales para tu crecimiento personal.",
  },
};

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
      "Un hermoso diario disenado especificamente para el registro y exploracion de tus emociones. Con prompts diarios, espacios para reflexion y ejercicios de autoconocimiento que te ayudaran a entender mejor tu mundo emocional.",
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
      "Coleccion de 15 meditaciones guiadas en formato digital. Desde relajacion profunda hasta visualizacion creativa, cada sesion esta disenada para diferentes momentos y necesidades emocionales.",
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
      "Un cuaderno bellamente ilustrado para practicar la gratitud diaria. Con espacios para escribir, reflexionar y visualizar lo positivo en tu vida. 365 paginas para un ano completo de practica.",
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

async function getProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images[0] || "#A8C5B8",
        type: p.type as "DIGITAL" | "PHYSICAL",
        category: p.category,
        tags: p.tags,
        description: p.description,
      }));
    }
    return placeholderProducts;
  } catch {
    return placeholderProducts;
  }
}

export default async function TiendaPage() {
  const products = await getProducts();
  return <TiendaClient products={products} />;
}
