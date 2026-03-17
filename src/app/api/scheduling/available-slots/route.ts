import { NextRequest, NextResponse } from "next/server";
import {
  getAvailableSlotsForDate,
  getIntelligentAssignment,
  getServices,
} from "@/lib/scheduling";
import { handleRouteError } from "@/lib/route";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");
  const psychologistId = searchParams.get("psychologistId");
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "El parametro 'date' es requerido (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Formato de fecha invalido. Use YYYY-MM-DD" },
      { status: 400 }
    );
  }

  try {
    let targetPsychologistId = psychologistId;

    // If no psychologist specified, use intelligent assignment
    if (!targetPsychologistId && serviceId) {
      const assigned = await getIntelligentAssignment(serviceId, {
        from: date,
        to: date,
      });
      if (assigned) {
        targetPsychologistId = assigned.id;
      }
    }

    if (!targetPsychologistId) {
      return NextResponse.json(
        { error: "No se encontro un psicologo disponible" },
        { status: 404 }
      );
    }

    // Get actual service duration from DB/mock
    let duration = 60;
    if (serviceId) {
      const services = await getServices();
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        duration = service.duration;
      }
    }

    const slots = await getAvailableSlotsForDate(
      targetPsychologistId,
      date,
      duration
    );

    return NextResponse.json({
      slots,
      psychologistId: targetPsychologistId,
      date,
    });
  } catch (error) {
    return handleRouteError(error, "Error al obtener horarios disponibles");
  }
}
