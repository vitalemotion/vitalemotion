"use client";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface OrderData {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string | null;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  paypalOrderId: string | null;
  shippingAddress: ShippingAddress | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailProps {
  order: OrderData;
  onUpdateStatus: (status: OrderStatus) => void;
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const statusBadgeClasses: Record<OrderStatus, string> = {
  PENDING: "bg-accent/10 text-accent",
  PAID: "bg-success/10 text-success",
  SHIPPED: "bg-primary/10 text-primary",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-error/10 text-error",
};

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-CO")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetail({ order, onUpdateStatus }: OrderDetailProps) {
  const hasPhysicalItems = order.items.some((item) => item.productType === "PHYSICAL");

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="bg-surface rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-serif text-lg text-text-primary mb-1">
              Pedido #{order.id.slice(0, 12)}
            </h2>
            <p className="text-sm text-text-muted">{formatDate(order.createdAt)}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClasses[order.status]}`}
          >
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient info */}
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-2">Paciente</h3>
            <p className="text-text-primary font-medium">{order.patientName}</p>
            <p className="text-sm text-text-secondary">{order.patientEmail}</p>
            {order.patientPhone && (
              <p className="text-sm text-text-secondary">{order.patientPhone}</p>
            )}
          </div>

          {/* Payment info */}
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-2">Pago</h3>
            {order.paypalOrderId ? (
              <div>
                <p className="text-sm text-text-secondary">PayPal Transaction</p>
                <code className="text-xs bg-background px-2 py-1 rounded text-text-primary">
                  {order.paypalOrderId}
                </code>
              </div>
            ) : (
              <p className="text-sm text-text-muted">Sin pago registrado</p>
            )}
          </div>

          {/* Shipping address */}
          {hasPhysicalItems && (
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2">Direccion de Envio</h3>
              {order.shippingAddress ? (
                <div className="text-sm text-text-secondary">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p>{order.shippingAddress.zip}</p>
                </div>
              ) : (
                <p className="text-sm text-text-muted">Sin direccion</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-surface rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-primary-dark/5">
          <h3 className="font-medium text-text-primary">Items del pedido</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-dark/5 text-left">
              <th className="px-6 py-3 font-medium text-text-secondary">Producto</th>
              <th className="px-6 py-3 font-medium text-text-secondary">Tipo</th>
              <th className="px-6 py-3 font-medium text-text-secondary text-center">Cantidad</th>
              <th className="px-6 py-3 font-medium text-text-secondary text-right">Precio</th>
              <th className="px-6 py-3 font-medium text-text-secondary text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-dark/5">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-medium text-text-primary">{item.productName}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.productType === "DIGITAL"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {item.productType === "DIGITAL" ? "Digital" : "Fisico"}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-primary text-center">{item.quantity}</td>
                <td className="px-6 py-4 text-text-secondary text-right">
                  {formatPrice(item.price)}
                </td>
                <td className="px-6 py-4 text-text-primary font-medium text-right">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-primary-dark/10">
            <tr>
              <td colSpan={4} className="px-6 py-3 text-sm text-text-secondary text-right">
                Subtotal
              </td>
              <td className="px-6 py-3 text-sm text-text-primary text-right font-medium">
                {formatPrice(order.subtotal)}
              </td>
            </tr>
            {order.shippingCost > 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-3 text-sm text-text-secondary text-right">
                  Envio
                </td>
                <td className="px-6 py-3 text-sm text-text-primary text-right font-medium">
                  {formatPrice(order.shippingCost)}
                </td>
              </tr>
            )}
            <tr className="border-t border-primary-dark/10">
              <td colSpan={4} className="px-6 py-4 text-text-primary text-right font-medium">
                Total
              </td>
              <td className="px-6 py-4 text-text-primary text-right font-bold text-base">
                {formatPrice(order.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Actions */}
      <div className="bg-surface rounded-xl p-6 shadow-sm">
        <h3 className="font-medium text-text-primary mb-4">Acciones</h3>
        <div className="flex flex-wrap gap-3">
          {order.status === "PAID" && (
            <button
              onClick={() => onUpdateStatus("SHIPPED")}
              className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Marcar como Enviado
            </button>
          )}
          {order.status === "SHIPPED" && (
            <button
              onClick={() => onUpdateStatus("DELIVERED")}
              className="bg-success/10 text-success rounded-lg px-4 py-2 text-sm font-medium hover:bg-success/20 transition-colors"
            >
              Marcar como Entregado
            </button>
          )}
          {(order.status === "PENDING" || order.status === "PAID") && (
            <button
              onClick={() => {
                if (confirm("Estas seguro de cancelar este pedido?")) {
                  onUpdateStatus("CANCELLED");
                }
              }}
              className="bg-error/10 text-error rounded-lg px-4 py-2 text-sm font-medium hover:bg-error/20 transition-colors"
            >
              Cancelar Pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
