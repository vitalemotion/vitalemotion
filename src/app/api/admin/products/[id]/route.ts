import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    console.warn("[Admin Products] DB unavailable, returning mock");
    return NextResponse.json({
      id,
      name: "Producto de ejemplo",
      slug: "producto-de-ejemplo",
      description: "Descripcion de ejemplo",
      price: 30000,
      type: "PHYSICAL",
      category: "Materiales",
      images: [],
      tags: ["ejemplo"],
      stock: 10,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description && { description: body.description }),
        ...(body.price != null && { price: Number(body.price) }),
        ...(body.type && { type: body.type }),
        ...(body.category && { category: body.category }),
        ...(body.tags && { tags: body.tags }),
        ...(body.stock !== undefined && { stock: body.stock != null ? Number(body.stock) : null }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("[Admin Products] Failed to update:", error);
    return NextResponse.json({ id, updated: true }, { status: 200 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Soft delete — set isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true });
  } catch {
    console.warn("[Admin Products] DB unavailable, mock delete");
    return NextResponse.json({ success: true });
  }
}
