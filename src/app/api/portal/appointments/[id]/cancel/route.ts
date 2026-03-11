import { NextResponse } from "next/server";

// Mock: appointment start times keyed by id
const appointmentStartTimes: Record<string, string> = {
  "apt-1": "2026-03-15T10:00:00Z",
  "apt-2": "2026-03-20T14:00:00Z",
  "apt-3": "2026-03-28T09:00:00Z",
  "apt-4": "2026-03-01T11:00:00Z",
  "apt-5": "2026-02-22T10:00:00Z",
};

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const startTimeStr = appointmentStartTimes[id];

  if (!startTimeStr) {
    return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
  }

  const startTime = new Date(startTimeStr);
  const now = new Date();
  const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilStart < 24) {
    return NextResponse.json(
      { error: "No se puede cancelar una cita con menos de 24 horas de anticipacion" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: "Cita cancelada exitosamente" });
}
