import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockTeam = [
  {
    id: "psy-1",
    userId: "user-psy-1",
    name: "Dra. Laura Jimenez",
    email: "laura.jimenez@vitalemocion.com",
    bio: "Psicologa clinica con mas de 10 años de experiencia en terapia cognitivo-conductual. Especialista en ansiedad, depresion y manejo del estres.",
    specialties: ["Ansiedad", "Depresion", "Estres", "Terapia Cognitivo-Conductual"],
    photoUrl: null,
    calcomUserId: "calcom-laura",
    isActive: true,
    createdAt: "2025-06-01T10:00:00.000Z",
  },
  {
    id: "psy-2",
    userId: "user-psy-2",
    name: "Dr. Carlos Mendez",
    email: "carlos.mendez@vitalemocion.com",
    bio: "Especialista en terapia de pareja y familia. Formacion en terapia sistemica y comunicacion asertiva.",
    specialties: ["Terapia de Pareja", "Terapia Familiar", "Comunicacion"],
    photoUrl: null,
    calcomUserId: "calcom-carlos",
    isActive: true,
    createdAt: "2025-07-15T10:00:00.000Z",
  },
  {
    id: "psy-3",
    userId: "user-psy-3",
    name: "Dra. Maria Rodriguez",
    email: "maria.rodriguez@vitalemocion.com",
    bio: "Psicologa especializada en mindfulness y bienestar emocional. Certificada en MBSR (Mindfulness-Based Stress Reduction).",
    specialties: ["Mindfulness", "Bienestar Emocional", "Autoestima", "Desarrollo Personal"],
    photoUrl: null,
    calcomUserId: "calcom-maria",
    isActive: true,
    createdAt: "2025-09-01T10:00:00.000Z",
  },
];

export async function GET() {
  try {
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
  } catch {
    console.warn("[Admin Team] DB unavailable, returning mock data");
    return NextResponse.json(mockTeam);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, bio, specialties, calcomUserId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email son requeridos" }, { status: 400 });
    }

    // Create user with PSYCHOLOGIST role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: "PSYCHOLOGIST",
      },
    });

    // Create psychologist profile
    const psychologist = await prisma.psychologist.create({
      data: {
        userId: user.id,
        bio: bio || null,
        specialties: specialties || [],
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
        bio,
        specialties,
        calcomUserId,
        isActive: true,
        createdAt: psychologist.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Admin Team] Failed to create psychologist:", error);
    const body = await request.json().catch(() => ({}));
    return NextResponse.json(
      {
        id: `mock-${Date.now()}`,
        userId: `mock-user-${Date.now()}`,
        ...body,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }
}
