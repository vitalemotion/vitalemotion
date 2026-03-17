import { NextRequest, NextResponse } from "next/server";
import {
  cancelBooking,
  createBooking,
  isCalcomMockEnabled,
} from "@/lib/calcom";
import { getCalcomEventTypeIdForService } from "@/lib/calcom-event-types";
import { getIntelligentAssignment, getServices } from "@/lib/scheduling";
import { handleRouteError, requireDatabase } from "@/lib/route";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";
import { sendAppointmentConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success: withinLimit } = rateLimit(`book:${ip}`, {
      maxRequests: 10,
      windowMs: 60_000,
    });
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

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

    // Sanitize inputs
    const sanitizedName = sanitizeString(patientName);
    const sanitizedEmail = sanitizeEmail(patientEmail);
    const sanitizedPhone = patientPhone ? sanitizePhone(patientPhone) : null;

    if (!sanitizedEmail) {
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

    const prisma = requireDatabase();
    const configuredEventTypeId = await getCalcomEventTypeIdForService(
      prisma,
      serviceId
    );
    const eventTypeId = configuredEventTypeId || (isCalcomMockEnabled() ? 1 : 0);

    if (eventTypeId <= 0) {
      return NextResponse.json(
        {
          error:
            `El agendamiento no esta configurado completamente para el servicio "${serviceId}". Falta su event type de Cal.com.`,
        },
        { status: 503 }
      );
    }

    const booking = await createBooking(
      eventTypeId,
      slotTime,
      sanitizedName,
      sanitizedEmail,
      sanitizedPhone ? `Tel: ${sanitizedPhone}` : undefined
    );

    if (!booking.success) {
      return NextResponse.json(
        { error: "No se pudo crear la cita. Intente de nuevo." },
        { status: 500 }
      );
    }

    // Find or create patient
    let patient = await prisma.patient.findFirst({
      where: { user: { email: sanitizedEmail } },
    });

    if (!patient) {
      const user = await prisma.user.create({
        data: {
          email: sanitizedEmail,
          name: sanitizedName,
          role: "PATIENT",
        },
      });
      patient = await prisma.patient.create({
        data: {
          userId: user.id,
          phone: sanitizedPhone || null,
        },
      });
    }

    const startTime = new Date(slotTime);
    let durationMinutes = 60;
    let serviceName = serviceId;
    try {
      const allServices = await getServices();
      const svc = allServices.find((s) => s.id === serviceId);
      if (svc) {
        durationMinutes = svc.duration;
        serviceName = svc.name;
      }
    } catch {
      // Keep safe fallback.
    }
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // Resolve psychologist name if not set by intelligent assignment
    if (!assignedPsychologistName) {
      try {
        const psy = await prisma.psychologist.findUnique({
          where: { id: assignedPsychologistId },
          include: { user: { select: { name: true } } },
        });
        if (psy?.user.name) assignedPsychologistName = psy.user.name;
      } catch {
        // Keep empty — email will still work.
      }
    }

    let appointmentId: string | null = null;
    try {
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
      if (booking.bookingId && !booking.mock) {
        await cancelBooking(booking.bookingId).catch(() => undefined);
      }
      throw dbError;
    }

    // Send appointment confirmation email (non-blocking)
    sendAppointmentConfirmation({
      to: sanitizedEmail,
      patientName: sanitizedName,
      service: serviceName,
      psychologist: assignedPsychologistName || "Tu psicologo asignado",
      date: startTime.toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: startTime.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      bookingId: booking.bookingId,
      appointmentId,
      psychologistId: assignedPsychologistId,
      psychologistName: assignedPsychologistName,
      mock: booking.mock || false,
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo crear la cita.");
  }
}
