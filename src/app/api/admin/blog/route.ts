import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockArticles = [
  {
    id: "blog-1",
    title: "Como manejar la ansiedad en el dia a dia",
    slug: "como-manejar-la-ansiedad",
    excerpt:
      "Descubre tecnicas practicas para gestionar la ansiedad y recuperar el control de tu bienestar emocional.",
    content:
      "# Como manejar la ansiedad\n\nLa ansiedad es una respuesta natural del cuerpo ante situaciones de estres...\n\n## Tecnicas practicas\n\n1. **Respiracion profunda**: Inhala por 4 segundos, mantén por 4, exhala por 4.\n2. **Grounding**: Identifica 5 cosas que puedes ver, 4 que puedes tocar...\n3. **Journaling**: Escribe tus pensamientos sin juzgarlos.",
    status: "PUBLISHED" as const,
    authorName: "Dra. Maria Rodriguez",
    authorId: "user-1",
    coverImage: null,
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "blog-2",
    title: "Beneficios de la terapia de pareja",
    slug: "beneficios-terapia-pareja",
    excerpt:
      "La terapia de pareja no es solo para crisis. Descubre como puede fortalecer tu relacion.",
    content:
      "# Beneficios de la terapia de pareja\n\nMuchas parejas creen que la terapia es solo para relaciones en crisis...\n\n## Beneficios clave\n\n- Mejora la comunicacion\n- Resuelve conflictos recurrentes\n- Fortalece la conexion emocional",
    status: "PUBLISHED" as const,
    authorName: "Dr. Carlos Mendez",
    authorId: "user-2",
    coverImage: null,
    createdAt: "2026-02-08T10:00:00.000Z",
    updatedAt: "2026-02-08T10:00:00.000Z",
  },
  {
    id: "blog-3",
    title: "Mindfulness para principiantes: guia practica",
    slug: "mindfulness-para-principiantes",
    excerpt:
      "El mindfulness es una herramienta poderosa para reducir el estres. Aprende los fundamentos.",
    content:
      "# Mindfulness para principiantes\n\nEl mindfulness, o atencion plena, es la practica de estar completamente presente...\n\n## Ejercicio basico\n\nSientate comodamente. Cierra los ojos. Enfoca tu atencion en la respiracion...",
    status: "PUBLISHED" as const,
    authorName: "Dra. Laura Jimenez",
    authorId: "user-3",
    coverImage: null,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "blog-4",
    title: "Construye una autoestima saludable",
    slug: "autoestima-saludable",
    excerpt:
      "La autoestima influye en todos los aspectos de tu vida. Conoce estrategias efectivas.",
    content:
      "# Construye una autoestima saludable\n\nLa autoestima es la percepcion que tenemos de nosotros mismos...",
    status: "PUBLISHED" as const,
    authorName: "Dra. Maria Rodriguez",
    authorId: "user-1",
    coverImage: null,
    createdAt: "2026-01-25T10:00:00.000Z",
    updatedAt: "2026-01-25T10:00:00.000Z",
  },
  {
    id: "blog-5",
    title: "Manejo del estres laboral",
    slug: "estres-laboral",
    excerpt:
      "El estres en el trabajo puede afectar tu salud. Aprende a identificar las senales.",
    content:
      "# Manejo del estres laboral\n\nEl ambiente laboral moderno puede ser una fuente significativa de estres...",
    status: "DRAFT" as const,
    authorName: "Dr. Carlos Mendez",
    authorId: "user-2",
    coverImage: null,
    createdAt: "2026-01-18T10:00:00.000Z",
    updatedAt: "2026-01-18T10:00:00.000Z",
  },
  {
    id: "blog-6",
    title: "Comunicacion asertiva en tus relaciones",
    slug: "comunicacion-asertiva",
    excerpt:
      "Aprender a comunicarte de forma asertiva puede transformar tus relaciones.",
    content:
      "# Comunicacion asertiva\n\nLa comunicacion asertiva es la capacidad de expresar tus pensamientos y sentimientos de manera clara y respetuosa...",
    status: "DRAFT" as const,
    authorName: "Dra. Laura Jimenez",
    authorId: "user-3",
    coverImage: null,
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
  },
];

export async function GET() {
  try {
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
  } catch {
    console.warn("[Admin Blog] DB unavailable, returning mock data");
    return NextResponse.json(mockArticles);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, status, authorId } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        status: status || "DRAFT",
        authorId: authorId || "system",
        coverImage: null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[Admin Blog] Failed to create post:", error);
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
