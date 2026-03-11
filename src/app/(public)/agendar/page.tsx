import type { Metadata } from "next";
import AgendarClient from "@/components/scheduling/AgendarClient";

export const metadata: Metadata = {
  title: "Agendar Cita | Vital Emocion",
  description:
    "Agenda tu cita con nuestros psicologos. Sistema inteligente de agendamiento.",
  openGraph: {
    title: "Agendar Cita | Vital Emocion",
    description:
      "Agenda tu cita con nuestros psicologos. Sistema inteligente de agendamiento.",
  },
};

export default function AgendarPage() {
  return <AgendarClient />;
}
