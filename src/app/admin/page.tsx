import DashboardStats from "@/components/admin/DashboardStats";

const todayAppointments = [
  {
    time: "09:00",
    patient: "Maria Garcia",
    service: "Terapia Individual",
    status: "CONFIRMED" as const,
  },
  {
    time: "10:30",
    patient: "Carlos Lopez",
    service: "Terapia de Pareja",
    status: "PENDING" as const,
  },
  {
    time: "14:00",
    patient: "Ana Martinez",
    service: "Primera Consulta",
    status: "CONFIRMED" as const,
  },
];

const recentOrders = [
  {
    date: "10 Mar 2026",
    patient: "Laura Sanchez",
    total: "$45.000",
    status: "PAID" as const,
  },
  {
    date: "09 Mar 2026",
    patient: "Pedro Ramirez",
    total: "$32.000",
    status: "PENDING" as const,
  },
  {
    date: "08 Mar 2026",
    patient: "Sofia Torres",
    total: "$78.000",
    status: "SHIPPED" as const,
  },
];

type AppointmentStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";
type OrderStatus = "PAID" | "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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
    default:
      return "bg-surface text-text-secondary";
  }
}

function getOrderBadgeClasses(status: OrderStatus): string {
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

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-8">Dashboard</h1>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Today's Appointments */}
        <div className="bg-surface rounded-xl p-6">
          <h2 className="font-serif text-lg text-text-primary mb-4">Citas de Hoy</h2>
          <div className="space-y-3">
            {todayAppointments.map((apt, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-background rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-primary w-12">
                    {apt.time}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{apt.patient}</p>
                    <p className="text-xs text-text-muted">{apt.service}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${getAppointmentBadgeClasses(apt.status)}`}
                >
                  {statusLabels[apt.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-surface rounded-xl p-6">
          <h2 className="font-serif text-lg text-text-primary mb-4">Pedidos Recientes</h2>
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-background rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted w-20">
                    {order.date}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{order.patient}</p>
                    <p className="text-xs text-text-muted">{order.total}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${getOrderBadgeClasses(order.status)}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
