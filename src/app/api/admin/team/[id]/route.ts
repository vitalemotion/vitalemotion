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

    const psychologist = await prisma.psychologist.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!psychologist) {
      return NextResponse.json(
        { error: "Psicologo no encontrado." },
        { status: 404 }
      );
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
  } catch (error) {
    return handleRouteError(error, "No se pudo cargar el psicologo.");
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

    const psychologist = await prisma.psychologist.update({
      where: { id },
      data: {
        ...(body.bio !== undefined && { bio: body.bio || null }),
        ...(body.specialties !== undefined && {
          specialties: Array.isArray(body.specialties) ? body.specialties : [],
        }),
        ...(body.calcomUserId !== undefined && {
          calcomUserId: body.calcomUserId || null,
        }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
      include: { user: { select: { name: true, email: true } } },
    });

    const updatedUser =
      body.name !== undefined || body.email !== undefined
        ? await prisma.user.update({
            where: { id: psychologist.userId },
            data: {
              ...(body.name !== undefined && { name: body.name || null }),
              ...(body.email !== undefined && { email: body.email }),
            },
            select: { name: true, email: true },
          })
        : psychologist.user;

    return NextResponse.json({
      id: psychologist.id,
      userId: psychologist.userId,
      name: updatedUser.name || updatedUser.email,
      email: updatedUser.email,
      bio: psychologist.bio,
      specialties: psychologist.specialties,
      calcomUserId: psychologist.calcomUserId,
      isActive: psychologist.isActive,
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo actualizar el psicologo.");
  }
}
