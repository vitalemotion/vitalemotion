import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/calcom";
import { getIntelligentAssignment, getServices } from "@/lib/scheduling";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      psychologistId,
      slotTime,
      patientName,
      patientEmail,
      patientPhone,
    } = body;

    // Validate required fields
    if (!serviceId || !slotTime || !patientName || !patientEmail) {
      return NextResponse.json(
        {
          error:
            "Campos requeridos: serviceId, slotTime, patientName, patientEmail",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientEmail)) {
      return NextResponse.json(
        { error: "Formato de email invalido" },
        { status: 400 }
      );
    }

    // Determine psychologist
    let assignedPsychologistId = psychologistId;
    let assignedPsychologistName = "";

    if (!assignedPsychologistId) {
      const assigned = await getIntelligentAssignment(serviceId, {
        from: slotTime,
        to: slotTime,
      });
      if (!assigned) {
        return NextResponse.json(
          { error: "No hay psicologos disponibles para este servicio" },
          { status: 404 }
        );
      }
      assignedPsychologistId = assigned.id;
      assignedPsychologistName = assigned.name;
    }

    // Create booking via Cal.com (or mock)
    const booking = await createBooking(
      1, // eventTypeId — would be mapped from serviceId in production
      slotTime,
      patientName,
      patientEmail,
      patientPhone ? `Tel: ${patientPhone}` : undefined
    );

    if (!booking.success) {
      return NextResponse.json(
        { error: "No se pudo crear la cita. Intente de nuevo." },
        { status: 500 }
      );
    }

    // Try to persist in DB
    let appointmentId: string | null = null;
    try {
      const { prisma } = await import("@/lib/db");

      // Find or create patient
      let patient = await prisma.patient.findFirst({
        where: { user: { email: patientEmail } },
      });

      if (!patient) {
        // Create a basic user + patient record
        const user = await prisma.user.create({
          data: {
            email: patientEmail,
            name: patientName,
            role: "PATIENT",
          },
        });
        patient = await prisma.patient.create({
          data: {
            userId: user.id,
            phone: patientPhone || null,
          },
        });
      }

      const startTime = new Date(slotTime);
      // Get actual service duration from DB/mock
      let durationMinutes = 60;
      try {
        const allServices = await getServices();
        const svc = allServices.find((s) => s.id === serviceId);
        if (svc) durationMinutes = svc.duration;
      } catch { /* use default */ }
      const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          psychologistId: assignedPsychologistId,
          serviceId,
          calcomEventId: booking.bookingId?.toString() || null,
          startTime,
          endTime,
          status: "CONFIRMED",
        },
      });
      appointmentId = appointment.id;
    } catch (dbError) {
      console.warn(
        "[API] Could not persist appointment to DB (mock mode?):",
        dbError
      );
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.bookingId,
      appointmentId,
      psychologistId: assignedPsychologistId,
      psychologistName: assignedPsychologistName,
      mock: booking.mock || false,
    });
  } catch (error) {
    console.error("[API] Booking error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
