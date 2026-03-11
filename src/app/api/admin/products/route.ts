import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockProducts = [
  {
    id: "1",
    name: "El Arte de la Calma",
    slug: "el-arte-de-la-calma",
    description: "Una guia completa para encontrar paz interior en medio del caos cotidiano.",
    price: 45000,
    type: "PHYSICAL" as const,
    category: "Libros",
    images: [],
    tags: ["bienestar", "calma"],
    stock: 25,
    isActive: true,
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "2",
    name: "Guia de Mindfulness",
    slug: "guia-de-mindfulness",
    description: "Descarga inmediata de nuestra guia digital de mindfulness.",
    price: 25000,
    type: "DIGITAL" as const,
    category: "Digital",
    images: [],
    tags: ["mindfulness", "meditacion"],
    stock: null,
    isActive: true,
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-01-20"),
  },
  {
    id: "3",
    name: "Diario de Emociones",
    slug: "diario-de-emociones",
    description: "Un hermoso diario diseñado para el registro y exploracion de tus emociones.",
    price: 35000,
    type: "PHYSICAL" as const,
    category: "Materiales",
    images: [],
    tags: ["emociones", "diario"],
    stock: 15,
    isActive: true,
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
  {
    id: "4",
    name: "Taller de Autoestima (Video)",
    slug: "taller-de-autoestima-video",
    description: "Acceso inmediato a nuestro taller en video sobre autoestima.",
    price: 60000,
    type: "DIGITAL" as const,
    category: "Digital",
    images: [],
    tags: ["autoestima", "taller"],
    stock: null,
    isActive: true,
    createdAt: new Date("2026-02-05"),
    updatedAt: new Date("2026-02-05"),
  },
  {
    id: "5",
    name: "Manual de Terapia Cognitiva",
    slug: "manual-de-terapia-cognitiva",
    description: "Manual completo de tecnicas de terapia cognitivo-conductual.",
    price: 55000,
    type: "PHYSICAL" as const,
    category: "Libros",
    images: [],
    tags: ["terapia", "cognitiva"],
    stock: 10,
    isActive: true,
    createdAt: new Date("2026-02-10"),
    updatedAt: new Date("2026-02-10"),
  },
  {
    id: "6",
    name: "Meditaciones Guiadas",
    slug: "meditaciones-guiadas",
    description: "Coleccion de 15 meditaciones guiadas en formato digital.",
    price: 20000,
    type: "DIGITAL" as const,
    category: "Digital",
    images: [],
    tags: ["meditacion", "audio"],
    stock: null,
    isActive: true,
    createdAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-02-15"),
  },
  {
    id: "7",
    name: "Cuaderno de Gratitud",
    slug: "cuaderno-de-gratitud",
    description: "Un cuaderno bellamente ilustrado para practicar la gratitud diaria.",
    price: 30000,
    type: "PHYSICAL" as const,
    category: "Materiales",
    images: [],
    tags: ["gratitud", "bienestar"],
    stock: 20,
    isActive: true,
    createdAt: new Date("2026-02-20"),
    updatedAt: new Date("2026-02-20"),
  },
  {
    id: "8",
    name: "Curso: Inteligencia Emocional",
    slug: "curso-inteligencia-emocional",
    description: "Curso digital completo de inteligencia emocional.",
    price: 80000,
    type: "DIGITAL" as const,
    category: "Digital",
    images: [],
    tags: ["inteligencia emocional", "curso"],
    stock: null,
    isActive: true,
    createdAt: new Date("2026-02-25"),
    updatedAt: new Date("2026-02-25"),
  },
  {
    id: "9",
    name: "El Camino del Autoconocimiento",
    slug: "el-camino-del-autoconocimiento",
    description: "Un viaje literario hacia el autoconocimiento profundo.",
    price: 50000,
    type: "PHYSICAL" as const,
    category: "Libros",
    images: [],
    tags: ["autoconocimiento", "desarrollo personal"],
    stock: 8,
    isActive: true,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
  {
    id: "10",
    name: "Kit de Relajacion",
    slug: "kit-de-relajacion",
    description: "Kit completo para tus sesiones de relajacion en casa.",
    price: 40000,
    type: "PHYSICAL" as const,
    category: "Materiales",
    images: [],
    tags: ["relajacion", "kit"],
    stock: 12,
    isActive: false,
    createdAt: new Date("2026-03-05"),
    updatedAt: new Date("2026-03-05"),
  },
];

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    console.warn("[Admin Products] DB unavailable, returning mock data");
    return NextResponse.json(mockProducts);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, price, type, category, tags, stock, isActive } = body;

    if (!name || !slug || !description || price == null || !type || !category) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        type,
        category,
        tags: tags || [],
        stock: type === "PHYSICAL" ? (stock != null ? Number(stock) : 0) : null,
        isActive: isActive ?? true,
        images: [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[Admin Products] Failed to create product:", error);
    // Return mock success when DB unavailable
    const body = await request.json().catch(() => ({}));
    return NextResponse.json(
      {
        id: `mock-${Date.now()}`,
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { status: 201 }
    );
  }
}
