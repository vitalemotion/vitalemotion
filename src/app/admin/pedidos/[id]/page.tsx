"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import OrderDetail from "@/components/admin/OrderDetail";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  price: number;
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
  shippingAddress: { street: string; city: string; state: string; zip: string } | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminPedidoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch {
        console.error("Error loading order");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (status: OrderStatus) => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrder((prev) => (prev ? { ...prev, status } : prev));
      router.refresh();
    } catch {
      console.error("Error updating order");
    }
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-12 text-center">
        <p className="text-text-muted">Cargando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-surface rounded-xl p-12 text-center">
        <p className="text-text-muted">Pedido no encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/pedidos"
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="font-serif text-2xl text-text-primary">Detalle del Pedido</h1>
      </div>

      <OrderDetail order={order} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}
