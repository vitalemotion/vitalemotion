import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

interface MockAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  psychologistName: string;
  psychologistId: string;
  service: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes: string | null;
}

const mockAppointments: MockAppointment[] = [
  {
    id: "apt-1",
    patientName: "Maria Garcia",
    patientEmail: "maria@example.com",
    psychologistName: "Dra. Laura Jimenez",
    psychologistId: "psy-1",
    service: "Terapia Individual",
    startTime: "2026-03-10T09:00:00.000Z",
    endTime: "2026-03-10T10:00:00.000Z",
    status: "CONFIRMED",
    notes: null,
  },
  {
    id: "apt-2",
    patientName: "Carlos Lopez",
    patientEmail: "carlos@example.com",
    psychologistName: "Dr. Carlos Mendez",
    psychologistId: "psy-2",
    service: "Terapia de Pareja",
    startTime: "2026-03-10T10:30:00.000Z",
    endTime: "2026-03-10T12:00:00.000Z",
    status: "PENDING",
    notes: "Primera sesion de pareja",
  },
  {
    id: "apt-3",
    patientName: "Ana Martinez",
    patientEmail: "ana@example.com",
    psychologistName: "Dra. Maria Rodriguez",
    psychologistId: "psy-3",
    service: "Primera Consulta",
    startTime: "2026-03-10T14:00:00.000Z",
    endTime: "2026-03-10T15:00:00.000Z",
    status: "CONFIRMED",
    notes: null,
  },
  {
    id: "apt-4",
    patientName: "Pedro Ramirez",
    patientEmail: "pedro@example.com",
    psychologistName: "Dra. Laura Jimenez",
    psychologistId: "psy-1",
    service: "Terapia Individual",
    startTime: "2026-03-11T09:00:00.000Z",
    endTime: "2026-03-11T10:00:00.000Z",
    status: "PENDING",
    notes: null,
  },
  {
    id: "apt-5",
    patientName: "Sofia Torres",
    patientEmail: "sofia@example.com",
    psychologistName: "Dr. Carlos Mendez",
    psychologistId: "psy-2",
    service: "Terapia Individual",
    startTime: "2026-03-09T11:00:00.000Z",
    endTime: "2026-03-09T12:00:00.000Z",
    status: "COMPLETED",
    notes: "Sesion de seguimiento. Progreso notable.",
  },
  {
    id: "apt-6",
    patientName: "Laura Sanchez",
    patientEmail: "laura@example.com",
    psychologistName: "Dra. Maria Rodriguez",
    psychologistId: "psy-3",
    service: "Terapia Familiar",
    startTime: "2026-03-12T16:00:00.000Z",
    endTime: "2026-03-12T17:30:00.000Z",
    status: "CONFIRMED",
    notes: null,
  },
  {
    id: "apt-7",
    patientName: "Diego Hernandez",
    patientEmail: "diego@example.com",
    psychologistName: "Dra. Laura Jimenez",
    psychologistId: "psy-1",
    service: "Primera Consulta",
    startTime: "2026-03-08T10:00:00.000Z",
    endTime: "2026-03-08T11:00:00.000Z",
    status: "NO_SHOW",
    notes: "No se presento. Intentar contactar.",
  },
  {
    id: "apt-8",
    patientName: "Valentina Cruz",
    patientEmail: "valentina@example.com",
    psychologistName: "Dr. Carlos Mendez",
    psychologistId: "psy-2",
    service: "Terapia Individual",
    startTime: "2026-03-07T15:00:00.000Z",
    endTime: "2026-03-07T16:00:00.000Z",
    status: "CANCELLED",
    notes: "Cancelada por el paciente.",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const psychologistId = searchParams.get("psychologistId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  try {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (psychologistId) where.psychologistId = psychologistId;
    if (dateFrom || dateTo) {
      where.startTime = {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo + "T23:59:59.999Z") }),
      };
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

    const formatted = appointments.map((apt) => ({
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
    }));

    return NextResponse.json(formatted);
  } catch {
    console.warn("[Admin Appointments] DB unavailable, returning mock data");
    let filtered = [...mockAppointments];
    if (status) filtered = filtered.filter((a) => a.status === status);
    if (psychologistId) filtered = filtered.filter((a) => a.psychologistId === psychologistId);
    if (dateFrom) filtered = filtered.filter((a) => a.startTime >= dateFrom);
    if (dateTo) filtered = filtered.filter((a) => a.startTime <= dateTo + "T23:59:59.999Z");
    return NextResponse.json(filtered);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID y status son requeridos" }, { status: 400 });
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
    console.error("[Admin Appointments] Failed to update:", error);
    return NextResponse.json({ success: true, mock: true });
  }
}
