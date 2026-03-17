import { OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import DashboardStats from "@/components/admin/DashboardStats";
import { authOptions } from "@/lib/auth";
import { getRequiredPrisma } from "@/lib/db";

type AppointmentStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
type DisplayOrderStatus = "PAID" | "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

function formatCOP(value: number) {
  return `$${Math.round(value).toLocaleString("es-CO")}`;
}

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

function getAppointmentBadgeClasses(status: AppointmentStatus): string {
  switch (status) {
    case "CONFIRMED":
      return "bg-success/10 text-success";
    case "PENDING":
      return "bg-accent/10 text-accent";
    case "CANCELLED":
      return "bg-error/10 text-error";
    case "COMPLETED":
      return "bg-primary/10 text-primary";
    case "NO_SHOW":
      return "bg-background text-text-muted";
    default:
      return "bg-surface text-text-secondary";
  }
}

function getOrderBadgeClasses(status: DisplayOrderStatus): string {
  switch (status) {
    case "PAID":
      return "bg-success/10 text-success";
    case "PENDING":
      return "bg-accent/10 text-accent";
    case "SHIPPED":
      return "bg-primary/10 text-primary";
    case "DELIVERED":
      return "bg-success/10 text-success";
    case "CANCELLED":
      return "bg-error/10 text-error";
    default:
      return "bg-surface text-text-secondary";
  }
}

const statusLabels: Record<AppointmentStatus | DisplayOrderStatus, string> = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistio",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const prisma = getRequiredPrisma();
  const isPsychologist = session.user.role === "PSYCHOLOGIST";
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const psychologist = isPsychologist
    ? await prisma.psychologist.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;

  const psychologistId = psychologist?.id;
  const appointmentScope = psychologistId ? { psychologistId } : {};

  const [
    todayAppointments,
    monthlyAppointmentCount,
    upcomingCount,
    completedCount,
    activePatients,
    recentOrders,
    monthlyOrders,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        ...appointmentScope,
        startTime: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        service: {
          select: { name: true },
        },
      },
      orderBy: { startTime: "asc" },
      take: 5,
    }),
    prisma.appointment.count({
      where: {
        ...appointmentScope,
        startTime: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.appointment.count({
      where: {
        ...appointmentScope,
        startTime: {
          gte: now,
          lte: sevenDaysFromNow,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    }),
    prisma.appointment.count({
      where: {
        ...appointmentScope,
        status: "COMPLETED",
        startTime: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.appointment.findMany({
      where: appointmentScope,
      select: { patientId: true },
      distinct: ["patientId"],
    }),
    isPsychologist
      ? Promise.resolve([])
      : prisma.order.findMany({
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
    isPsychologist
      ? Promise.resolve([])
      : prisma.order.findMany({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
          select: {
            total: true,
            status: true,
          },
        }),
  ]);

  const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
    if (
      order.status === OrderStatus.PAID ||
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.DELIVERED
    ) {
      return sum + order.total;
    }

    return sum;
  }, 0);

  const stats = isPsychologist
    ? [
        {
          label: "Citas del Mes",
          value: String(monthlyAppointmentCount),
          bgColor: "bg-primary/10",
          iconBg: "bg-primary/20",
          iconColor: "text-primary",
          icon: "appointments" as const,
        },
        {
          label: "Proximas 7 Dias",
          value: String(upcomingCount),
          bgColor: "bg-accent/10",
          iconBg: "bg-accent/20",
          iconColor: "text-accent",
          icon: "upcoming" as const,
        },
        {
          label: "Completadas",
          value: String(completedCount),
          bgColor: "bg-success/10",
          iconBg: "bg-success/20",
          iconColor: "text-success",
          icon: "completed" as const,
        },
        {
          label: "Pacientes Atendidos",
          value: String(activePatients.length),
          bgColor: "bg-secondary",
          iconBg: "bg-accent/20",
          iconColor: "text-accent",
          icon: "patients" as const,
        },
      ]
    : [
        {
          label: "Citas Hoy",
          value: String(todayAppointments.length),
          bgColor: "bg-primary/10",
          iconBg: "bg-primary/20",
          iconColor: "text-primary",
          icon: "appointments" as const,
        },
        {
          label: "Pedidos del Mes",
          value: String(monthlyOrders.length),
          bgColor: "bg-accent/10",
          iconBg: "bg-accent/20",
          iconColor: "text-accent",
          icon: "orders" as const,
        },
        {
          label: "Ingresos del Mes",
          value: formatCOP(monthlyRevenue),
          bgColor: "bg-success/10",
          iconBg: "bg-success/20",
          iconColor: "text-success",
          icon: "revenue" as const,
        },
        {
          label: "Pacientes Activos",
          value: String(activePatients.length),
          bgColor: "bg-secondary",
          iconBg: "bg-accent/20",
          iconColor: "text-accent",
          icon: "patients" as const,
        },
      ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-8">Dashboard</h1>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-surface rounded-xl p-6">
          <h2 className="font-serif text-lg text-text-primary mb-4">
            {isPsychologist ? "Tus Citas de Hoy" : "Citas de Hoy"}
          </h2>

          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between bg-background rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-primary w-12">
                      {formatTime(appointment.startTime)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {appointment.patient.user.name || appointment.patient.user.email}
                      </p>
                      <p className="text-xs text-text-muted">
                        {appointment.service.name}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${getAppointmentBadgeClasses(
                      appointment.status as AppointmentStatus
                    )}`}
                  >
                    {statusLabels[appointment.status as AppointmentStatus]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-background rounded-lg p-4 text-sm text-text-muted">
              No hay citas programadas para hoy.
            </div>
          )}
        </div>

        <div className="bg-surface rounded-xl p-6">
          <h2 className="font-serif text-lg text-text-primary mb-4">
            {isPsychologist ? "Agenda de la Semana" : "Pedidos Recientes"}
          </h2>

          {isPsychologist ? (
            upcomingCount > 0 ? (
              <div className="space-y-3">
                <div className="bg-background rounded-lg p-4">
                  <p className="text-sm font-medium text-text-primary">
                    Tienes {upcomingCount} cita(s) en los proximos 7 dias.
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Revisa el calendario completo en la gestion de citas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-background rounded-lg p-4 text-sm text-text-muted">
                No tienes citas agendadas para la proxima semana.
              </div>
            )
          ) : recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between bg-background rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-text-muted w-20">
                      {formatDate(order.createdAt)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {order.patient.user.name || order.patient.user.email}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatCOP(order.total)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${getOrderBadgeClasses(
                      order.status as DisplayOrderStatus
                    )}`}
                  >
                    {statusLabels[order.status as DisplayOrderStatus]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-background rounded-lg p-4 text-sm text-text-muted">
              Aun no hay pedidos registrados este mes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
