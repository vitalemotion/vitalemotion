"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OrderCard from "@/components/portal/OrderCard";

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

export default function ComprasPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl text-text-primary mb-6">Mis Compras</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-3 bg-background rounded w-1/4 mb-2" />
              <div className="h-4 bg-background rounded w-1/2 mb-2" />
              <div className="h-3 bg-background rounded w-1/6" />
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl p-8 shadow-sm text-center">
          <p className="text-text-muted mb-4">Aun no has realizado compras</p>
          <Link
            href="/tienda"
            className="inline-block bg-primary text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Visitar tienda
          </Link>
        </div>
      )}
    </div>
  );
}
