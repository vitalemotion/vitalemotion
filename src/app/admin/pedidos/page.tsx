"use client";

import { useEffect, useState } from "react";
import OrderTable from "@/components/admin/OrderTable";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface Order {
  id: string;
  patientName: string;
  status: OrderStatus;
  itemsCount: number;
  total: number;
  createdAt: string;
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data);
      } catch {
        console.error("Error loading orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Pedidos</h1>

      {loading ? (
        <div className="bg-surface rounded-xl p-12 text-center">
          <p className="text-text-muted">Cargando pedidos...</p>
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
