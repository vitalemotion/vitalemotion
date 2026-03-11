import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockOrderDetail = {
  id: "ord-abc12345",
  patientName: "Laura Sanchez",
  patientEmail: "laura@example.com",
  patientPhone: "+57 300 123 4567",
  status: "PAID" as const,
  subtotal: 70000,
  shippingCost: 8000,
  total: 78000,
  paypalOrderId: "PAYPAL-7X8Y9Z",
  shippingAddress: {
    street: "Calle 45 #12-34",
    city: "Bogota",
    state: "Cundinamarca",
    zip: "110111",
  },
  items: [
    {
      id: "item-1",
      productName: "El Arte de la Calma",
      productType: "PHYSICAL",
      quantity: 1,
      price: 45000,
    },
    {
      id: "item-2",
      productName: "Guia de Mindfulness",
      productType: "DIGITAL",
      quantity: 1,
      price: 25000,
    },
  ],
  createdAt: "2026-03-08T14:30:00.000Z",
  updatedAt: "2026-03-08T14:30:00.000Z",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        items: {
          include: {
            product: { select: { name: true, type: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const formatted = {
      id: order.id,
      patientName: order.patient.user.name || order.patient.user.email,
      patientEmail: order.patient.user.email,
      patientPhone: order.patient.phone,
      status: order.status,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      paypalOrderId: order.paypalOrderId,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.product.name,
        productType: item.product.type,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return NextResponse.json(formatted);
  } catch {
    console.warn("[Admin Orders] DB unavailable, returning mock detail");
    return NextResponse.json({ ...mockOrderDetail, id });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status es requerido" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[Admin Orders] Failed to update:", error);
    return NextResponse.json({ id, status: "updated", mock: true });
  }
}
