import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return handleRouteError(error, "No se pudieron cargar los productos.");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const body = await request.json();
    const { name, slug, description, price, type, category, tags, stock, isActive } =
      body;

    if (!name || !slug || !description || price == null || !type || !category) {
      return NextResponse.json(
        { error: "Faltan campos requeridos." },
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
        tags: Array.isArray(tags) ? tags : [],
        stock: type === "PHYSICAL" ? (stock != null ? Number(stock) : 0) : null,
        isActive: isActive ?? true,
        images: [],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "No se pudo crear el producto.");
  }
}
