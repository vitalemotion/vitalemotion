import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockOrders = [
  {
    id: "ord-abc12345",
    patientName: "Laura Sanchez",
    patientEmail: "laura@example.com",
    status: "PAID" as const,
    itemsCount: 2,
    subtotal: 70000,
    shippingCost: 8000,
    total: 78000,
    paypalOrderId: "PAYPAL-7X8Y9Z",
    createdAt: "2026-03-08T14:30:00.000Z",
  },
  {
    id: "ord-def67890",
    patientName: "Pedro Ramirez",
    patientEmail: "pedro@example.com",
    status: "PENDING" as const,
    itemsCount: 1,
    subtotal: 25000,
    shippingCost: 0,
    total: 25000,
    paypalOrderId: null,
    createdAt: "2026-03-09T10:15:00.000Z",
  },
  {
    id: "ord-ghi11223",
    patientName: "Sofia Torres",
    patientEmail: "sofia@example.com",
    status: "SHIPPED" as const,
    itemsCount: 3,
    subtotal: 110000,
    shippingCost: 8000,
    total: 118000,
    paypalOrderId: "PAYPAL-A1B2C3",
    createdAt: "2026-03-06T09:00:00.000Z",
  },
  {
    id: "ord-jkl44556",
    patientName: "Maria Garcia",
    patientEmail: "maria@example.com",
    status: "DELIVERED" as const,
    itemsCount: 1,
    subtotal: 45000,
    shippingCost: 8000,
    total: 53000,
    paypalOrderId: "PAYPAL-D4E5F6",
    createdAt: "2026-03-01T16:45:00.000Z",
  },
  {
    id: "ord-mno77889",
    patientName: "Carlos Lopez",
    patientEmail: "carlos@example.com",
    status: "CANCELLED" as const,
    itemsCount: 2,
    subtotal: 55000,
    shippingCost: 0,
    total: 55000,
    paypalOrderId: null,
    createdAt: "2026-02-28T11:20:00.000Z",
  },
];

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        patient: { include: { user: { select: { name: true, email: true } } } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = orders.map((order) => ({
      id: order.id,
      patientName: order.patient.user.name || order.patient.user.email,
      patientEmail: order.patient.user.email,
      status: order.status,
      itemsCount: order.items.length,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      paypalOrderId: order.paypalOrderId,
      createdAt: order.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch {
    console.warn("[Admin Orders] DB unavailable, returning mock data");
    return NextResponse.json(mockOrders);
  }
}
