import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();

    const posts = await prisma.blogPost.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const formatted = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      status: post.status,
      authorName: post.author.name || "Sin nombre",
      authorId: post.authorId,
      coverImage: post.coverImage,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return handleRouteError(error, "No se pudieron cargar los articulos.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const body = await request.json();
    const { title, slug, content, excerpt, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        status: status || "DRAFT",
        authorId: session.user.id,
        coverImage: null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "No se pudo crear el articulo.");
  }
}
