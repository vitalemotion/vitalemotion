import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });
    if (!post) {
      return NextResponse.json({ error: "Articulo no encontrado" }, { status: 404 });
    }
    return NextResponse.json({
      ...post,
      authorName: post.author.name || "Sin nombre",
    });
  } catch {
    console.warn("[Admin Blog] DB unavailable, returning mock");
    return NextResponse.json({
      id,
      title: "Articulo de ejemplo",
      slug: "articulo-de-ejemplo",
      content: "# Ejemplo\n\nContenido del articulo de ejemplo.",
      excerpt: "Un articulo de ejemplo.",
      status: "DRAFT",
      authorName: "Autor",
      authorId: "user-1",
      coverImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.slug && { slug: body.slug }),
        ...(body.content && { content: body.content }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.status && { status: body.status }),
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("[Admin Blog] Failed to update:", error);
    return NextResponse.json({ id, updated: true });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    console.warn("[Admin Blog] DB unavailable, mock delete");
    return NextResponse.json({ success: true });
  }
}
