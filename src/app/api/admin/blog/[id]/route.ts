import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Articulo no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...post,
      authorName: post.author.name || "Sin nombre",
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo cargar el articulo.");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const { id } = await params;
    const body = await request.json();

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt || null }),
        ...(body.status !== undefined && { status: body.status }),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return handleRouteError(error, "No se pudo actualizar el articulo.");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const { id } = await params;

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "No se pudo eliminar el articulo.");
  }
}
