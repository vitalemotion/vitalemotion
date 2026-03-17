import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "@/lib/calcom";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();
    const { id } = await params;

    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Perfil de paciente no encontrado." },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        patientId: true,
        startTime: true,
        calcomEventId: true,
        status: true,
      },
    });

    if (!appointment || appointment.patientId !== patient.id) {
      return NextResponse.json({ error: "Cita no encontrada." }, { status: 404 });
    }

    if (appointment.status === "CANCELLED") {
      return NextResponse.json(
        { error: "La cita ya fue cancelada." },
        { status: 400 }
      );
    }

    if (appointment.status === "COMPLETED" || appointment.status === "NO_SHOW") {
      return NextResponse.json(
        { error: "Esta cita ya no se puede cancelar." },
        { status: 400 }
      );
    }

    const hoursUntilStart =
      (appointment.startTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
      return NextResponse.json(
        {
          error:
            "No se puede cancelar una cita con menos de 24 horas de anticipacion.",
        },
        { status: 400 }
      );
    }

    if (appointment.calcomEventId) {
      const bookingId = Number(appointment.calcomEventId);
      if (!Number.isNaN(bookingId)) {
        const result = await cancelBooking(bookingId);
        if (!result.success) {
          return NextResponse.json(
            { error: "No se pudo cancelar la reserva externa." },
            { status: 502 }
          );
        }
      }
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({
      success: true,
      message: "Cita cancelada exitosamente.",
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo cancelar la cita.");
  }
}
