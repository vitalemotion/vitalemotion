import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRequiredPrisma } from "@/lib/db";
import { formatCOP } from "@/lib/store";

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

const quickLinks = [
  {
    label: "Agendar nueva cita",
    href: "/agendar",
    description: "Reserva una sesion con tu psicologo",
  },
  {
    label: "Explorar tienda",
    href: "/tienda",
    description: "Recursos y materiales de bienestar",
  },
  {
    label: "Ver blog",
    href: "/blog",
    description: "Articulos sobre salud mental",
  },
];

export default async function PortalDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const prisma = getRequiredPrisma();
  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!patient) {
    return null;
  }

  const now = new Date();
  const [nextAppointment, recentOrder] = await Promise.all([
    prisma.appointment.findFirst({
      where: {
        patientId: patient.id,
        startTime: {
          gte: now,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      include: {
        service: {
          select: { name: true },
        },
        psychologist: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.order.findFirst({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const userName = session.user.name || "Paciente";
  const orderStatusLabel =
    recentOrder?.status === "DELIVERED"
      ? "Entregado"
      : recentOrder?.status === "SHIPPED"
        ? "Enviado"
        : recentOrder?.status === "PAID"
          ? "Pagado"
          : recentOrder?.status === "PENDING"
            ? "Pendiente"
            : recentOrder?.status === "CANCELLED"
              ? "Cancelado"
              : "";

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-8">
        Hola, {userName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-lg text-text-primary mb-4">Proxima Cita</h2>
          {nextAppointment ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                <span className="text-sm text-text-secondary">
                  {formatDate(nextAppointment.startTime)} - {formatTime(nextAppointment.startTime)}
                </span>
              </div>
              <p className="text-sm font-medium text-text-primary">
                {nextAppointment.service.name}
              </p>
              <p className="text-sm text-text-muted mb-4">
                {nextAppointment.psychologist.user.name || "Profesional asignado"}
              </p>
              <Link
                href="/portal/citas"
                className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
              >
                Ver detalles
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-muted mb-4">
                No tienes citas programadas.
              </p>
              <Link
                href="/agendar"
                className="inline-block bg-primary text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Agendar cita
              </Link>
            </div>
          )}
        </div>

        <div className="bg-surface rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-lg text-text-primary mb-4">Compra Reciente</h2>
          {recentOrder ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span className="text-sm text-text-secondary">
                  {formatDate(recentOrder.createdAt)}
                </span>
              </div>
              <p className="text-sm font-medium text-text-primary">
                {formatCOP(recentOrder.total)}
              </p>
              <p className="text-sm text-text-muted mb-4">{orderStatusLabel}</p>
              <Link
                href="/portal/compras"
                className="text-sm text-primary font-medium hover:text-primary-dark transition-colors"
              >
                Ver detalles
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-muted mb-4">
                Aun no has realizado compras.
              </p>
              <Link
                href="/tienda"
                className="inline-block bg-primary text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Visitar tienda
              </Link>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-lg text-text-primary mb-4">Accesos Rapidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-surface rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                {link.label}
              </p>
              <p className="text-xs text-text-muted mt-1">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
