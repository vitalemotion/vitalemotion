import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireDatabase, requireRole, handleRouteError } from "@/lib/route";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();

    const psychologists = await prisma.psychologist.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    const formatted = psychologists.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.user.name || p.user.email,
      email: p.user.email,
      bio: p.bio,
      specialties: p.specialties,
      photoUrl: p.photoUrl,
      calcomUserId: p.calcomUserId,
      isActive: p.isActive,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return handleRouteError(error, "No se pudo cargar el equipo.");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();

    const body = await request.json();
    const { name, email, bio, specialties, calcomUserId, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contrasena son requeridos." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 8 caracteres." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "PSYCHOLOGIST",
      },
    });

    const psychologist = await prisma.psychologist.create({
      data: {
        userId: user.id,
        bio: bio || null,
        specialties: Array.isArray(specialties) ? specialties : [],
        calcomUserId: calcomUserId || null,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        id: psychologist.id,
        userId: user.id,
        name,
        email,
        bio: psychologist.bio,
        specialties: psychologist.specialties,
        calcomUserId: psychologist.calcomUserId,
        isActive: psychologist.isActive,
        createdAt: psychologist.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error, "No se pudo crear el psicologo.");
  }
}
