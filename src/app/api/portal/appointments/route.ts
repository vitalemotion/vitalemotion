import { NextResponse } from "next/server";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

function formatDate(date: Date) {
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export async function GET() {
  try {
    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();

    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!patient) {
      return NextResponse.json([], { status: 200 });
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        psychologist: { include: { user: { select: { name: true } } } },
        service: { select: { name: true } },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(
      appointments.map((appointment) => ({
        id: appointment.id,
        service: appointment.service.name,
        psychologist: appointment.psychologist.user.name || "Sin nombre",
        date: formatDate(appointment.startTime),
        time: formatTime(appointment.startTime),
        status: appointment.status,
        startTime: appointment.startTime.toISOString(),
      }))
    );
  } catch (error) {
    return handleRouteError(error, "No se pudieron cargar tus citas.");
  }
}
