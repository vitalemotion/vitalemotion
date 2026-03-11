import { NextResponse } from "next/server";

const mockAppointments = [
  // Upcoming
  {
    id: "apt-1",
    service: "Terapia Individual",
    psychologist: "Dra. Ana Rodriguez",
    date: "15 Mar 2026",
    time: "10:00",
    status: "CONFIRMED",
    startTime: "2026-03-15T10:00:00Z",
  },
  {
    id: "apt-2",
    service: "Terapia de Pareja",
    psychologist: "Dr. Carlos Mendez",
    date: "20 Mar 2026",
    time: "14:00",
    status: "PENDING",
    startTime: "2026-03-20T14:00:00Z",
  },
  {
    id: "apt-3",
    service: "Evaluacion Psicologica",
    psychologist: "Dra. Ana Rodriguez",
    date: "28 Mar 2026",
    time: "09:00",
    status: "CONFIRMED",
    startTime: "2026-03-28T09:00:00Z",
  },
  // Past
  {
    id: "apt-4",
    service: "Primera Consulta",
    psychologist: "Dra. Ana Rodriguez",
    date: "01 Mar 2026",
    time: "11:00",
    status: "COMPLETED",
    startTime: "2026-03-01T11:00:00Z",
  },
  {
    id: "apt-5",
    service: "Terapia Individual",
    psychologist: "Dra. Ana Rodriguez",
    date: "22 Feb 2026",
    time: "10:00",
    status: "COMPLETED",
    startTime: "2026-02-22T10:00:00Z",
  },
];

export async function GET() {
  return NextResponse.json(mockAppointments);
}
