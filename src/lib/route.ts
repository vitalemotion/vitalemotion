import { Role, type PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";
import { getRequiredPrisma } from "./db";

export class RouteError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "RouteError";
  }
}

export async function requireSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new RouteError(401, "Debes iniciar sesion para continuar.");
  }

  return session;
}

export async function requireRole(roles: Role[]) {
  const session = await requireSession();

  if (!roles.includes(session.user.role)) {
    throw new RouteError(403, "No tienes permisos para realizar esta accion.");
  }

  return session;
}

export function requireDatabase() {
  try {
    return getRequiredPrisma();
  } catch (error) {
    if (error instanceof Error && error.message === "DATABASE_UNAVAILABLE") {
      throw new RouteError(503, "La base de datos no esta disponible.");
    }
    throw error;
  }
}

export async function getPsychologistIdForUser(
  prisma: PrismaClient,
  userId: string
) {
  const psychologist = await prisma.psychologist.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!psychologist) {
    throw new RouteError(
      403,
      "Tu usuario no tiene un perfil de psicologo asociado."
    );
  }

  return psychologist.id;
}

export async function getPatientIdForUser(prisma: PrismaClient, userId: string) {
  const patient = await prisma.patient.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!patient) {
    throw new RouteError(403, "Tu usuario no tiene un perfil de paciente asociado.");
  }

  return patient.id;
}

export function handleRouteError(
  error: unknown,
  fallbackMessage = "Error interno del servidor."
) {
  if (error instanceof RouteError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  console.error("[Route] Unexpected error:", error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
