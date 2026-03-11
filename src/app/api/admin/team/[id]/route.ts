import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const psychologist = await prisma.psychologist.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!psychologist) {
      return NextResponse.json({ error: "Psicologo no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id: psychologist.id,
      userId: psychologist.userId,
      name: psychologist.user.name || psychologist.user.email,
      email: psychologist.user.email,
      bio: psychologist.bio,
      specialties: psychologist.specialties,
      photoUrl: psychologist.photoUrl,
      calcomUserId: psychologist.calcomUserId,
      isActive: psychologist.isActive,
      createdAt: psychologist.createdAt.toISOString(),
    });
  } catch {
    console.warn("[Admin Team] DB unavailable, returning mock");
    return NextResponse.json({
      id,
      userId: "mock-user",
      name: "Psicologo de ejemplo",
      email: "ejemplo@vitalemocion.com",
      bio: "Bio de ejemplo",
      specialties: ["Terapia Individual"],
      photoUrl: null,
      calcomUserId: null,
      isActive: true,
      createdAt: new Date().toISOString(),
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

    // Update psychologist profile
    const updateData: Record<string, unknown> = {};
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.specialties !== undefined) updateData.specialties = body.specialties;
    if (body.calcomUserId !== undefined) updateData.calcomUserId = body.calcomUserId;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const psychologist = await prisma.psychologist.update({
      where: { id },
      data: updateData,
      include: { user: { select: { name: true, email: true } } },
    });

    // Update user name/email if provided
    if (body.name || body.email) {
      await prisma.user.update({
        where: { id: psychologist.userId },
        data: {
          ...(body.name && { name: body.name }),
          ...(body.email && { email: body.email }),
        },
      });
    }

    return NextResponse.json({
      id: psychologist.id,
      userId: psychologist.userId,
      name: body.name || psychologist.user.name,
      email: body.email || psychologist.user.email,
      bio: psychologist.bio,
      specialties: psychologist.specialties,
      calcomUserId: psychologist.calcomUserId,
      isActive: psychologist.isActive,
    });
  } catch (error) {
    console.error("[Admin Team] Failed to update:", error);
    return NextResponse.json({ id, updated: true, mock: true });
  }
}
