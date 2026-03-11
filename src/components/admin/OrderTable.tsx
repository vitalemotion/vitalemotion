"use client";

import Link from "next/link";
import { useState } from "react";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface Order {
  id: string;
  patientName: string;
  status: OrderStatus;
  itemsCount: number;
  total: number;
  createdAt: string;
}

interface OrderTableProps {
  orders: Order[];
}

const PAGE_SIZE = 8;

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
  });
}

function truncateId(id: string): string {
  if (id.length <= 12) return id;
  return id.slice(0, 12) + "...";
}

export default function OrderTable({ orders }: OrderTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const pageOrders = orders.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary-dark/5 text-left">
              <th className="px-6 py-4 font-medium text-text-secondary">ID</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Paciente</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Fecha</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Items</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Total</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Estado</th>
              <th className="px-6 py-4 font-medium text-text-secondary">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-dark/5">
            {pageOrders.map((order) => (
              <tr key={order.id} className="hover:bg-primary-dark/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <code className="text-xs text-text-muted bg-background px-2 py-1 rounded">
                    {truncateId(order.id)}
                  </code>
                </td>
                <td className="px-6 py-4 font-medium text-text-primary">{order.patientName}</td>
                <td className="px-6 py-4 text-text-secondary">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4 text-text-primary text-center">{order.itemsCount}</td>
                <td className="px-6 py-4 text-text-primary font-medium">
                  {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClasses[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                  >
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
            {pageOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                  No hay pedidos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-primary-dark/5">
          <p className="text-sm text-text-muted">
            Mostrando {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, orders.length)} de{" "}
            {orders.length} pedidos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm rounded-lg bg-background text-text-secondary hover:bg-primary-dark/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm rounded-lg bg-background text-text-secondary hover:bg-primary-dark/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
