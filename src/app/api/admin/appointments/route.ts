import { NextRequest, NextResponse } from "next/server";
import {
  getPsychologistIdForUser,
  handleRouteError,
  requireDatabase,
  requireRole,
} from "@/lib/route";

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "PSYCHOLOGIST"]);
    const prisma = requireDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const psychologistId = searchParams.get("psychologistId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.startTime = {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(`${dateTo}T23:59:59.999Z`) }),
      };
    }

    if (session.user.role === "PSYCHOLOGIST") {
      where.psychologistId = await getPsychologistIdForUser(
        prisma,
        session.user.id
      );
    } else if (psychologistId) {
      where.psychologistId = psychologistId;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: { include: { user: { select: { name: true, email: true } } } },
        psychologist: { include: { user: { select: { name: true } } } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json(
      appointments.map((apt) => ({
        id: apt.id,
        patientName: apt.patient.user.name || apt.patient.user.email,
        patientEmail: apt.patient.user.email,
        psychologistName: apt.psychologist.user.name || "Sin nombre",
        psychologistId: apt.psychologistId,
        service: apt.service.name,
        startTime: apt.startTime.toISOString(),
        endTime: apt.endTime.toISOString(),
        status: apt.status,
        notes: apt.notes,
      }))
    );
  } catch (error) {
    return handleRouteError(error, "No se pudieron cargar las citas.");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole(["ADMIN", "PSYCHOLOGIST"]);
    const prisma = requireDatabase();
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID y status son requeridos." },
        { status: 400 }
      );
    }

    if (session.user.role === "PSYCHOLOGIST") {
      const psychologistId = await getPsychologistIdForUser(
        prisma,
        session.user.id
      );
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        select: { psychologistId: true },
      });

      if (!appointment || appointment.psychologistId !== psychologistId) {
        return NextResponse.json(
          { error: "No puedes modificar esta cita." },
          { status: 403 }
        );
      }
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    return handleRouteError(error, "No se pudo actualizar la cita.");
  }
}
