import { NextResponse } from "next/server";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

export async function GET() {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();

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
  } catch (error) {
    return handleRouteError(error, "No se pudieron cargar los pedidos.");
  }
}
