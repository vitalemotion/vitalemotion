"use client";

import { useState } from "react";

type OrderStatus = "PAID" | "SHIPPED" | "DELIVERED" | "PENDING";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  type: "physical" | "digital";
  downloadUrl?: string;
}

interface Order {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingStatus: string | null;
}

function getStatusClasses(status: OrderStatus): string {
  switch (status) {
    case "PAID":
      return "bg-success/10 text-success";
    case "SHIPPED":
      return "bg-primary/10 text-primary";
    case "DELIVERED":
      return "text-text-muted bg-background";
    case "PENDING":
      return "bg-accent/10 text-accent";
    default:
      return "bg-surface text-text-secondary";
  }
}

const statusLabels: Record<OrderStatus, string> = {
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  PENDING: "Pendiente",
};

export default function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  const itemsSummary =
    order.items.length === 1
      ? order.items[0].name
      : `${order.items[0].name} y ${order.items.length - 1} mas`;

  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-surface/80 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs text-text-muted">{order.date}</span>
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClasses(order.status)}`}
            >
              {statusLabels[order.status]}
            </span>
          </div>
          <p className="text-sm font-medium text-text-primary truncate">{itemsSummary}</p>
          <p className="text-sm text-accent font-medium mt-1">{order.total}</p>
        </div>
        <svg
          className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ml-4 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-background">
          <div className="pt-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-6">{item.quantity}x</span>
                  <span className="text-sm text-text-primary">{item.name}</span>
                  {item.type === "digital" && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Digital</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">{item.price}</span>
                  {item.type === "digital" && item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      className="text-xs bg-primary text-white px-3 py-1 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                      Descargar
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {order.shippingStatus && (
            <div className="mt-4 pt-4 border-t border-background">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.735a2.25 2.25 0 00-1.836.949L3.93 13.768a6.837 6.837 0 00-.93 2.328M12 6h6.75" />
                </svg>
                <span className="text-sm text-text-secondary">{order.shippingStatus}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
