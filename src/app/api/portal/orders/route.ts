import { NextResponse } from "next/server";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

function formatDate(date: Date) {
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCOP(value: number) {
  return `$${Math.round(value).toLocaleString("es-CO")}`;
}

function parseShippingStatus(status: string) {
  switch (status) {
    case "SHIPPED":
      return "En camino";
    case "DELIVERED":
      return "Entregado";
    case "PAID":
      return "Pago confirmado";
    default:
      return null;
  }
}

export async function GET() {
  try {
    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();

    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!patient) {
      return NextResponse.json([], { status: 200 });
    }

    const orders = await prisma.order.findMany({
      where: { patientId: patient.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                type: true,
                digitalFile: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      orders.map((order) => ({
        id: order.id,
        date: formatDate(order.createdAt),
        total: formatCOP(order.total),
        status: order.status,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: formatCOP(item.price),
          type: item.product.type === "DIGITAL" ? "digital" : "physical",
          ...(item.product.digitalFile && { downloadUrl: item.product.digitalFile }),
        })),
        shippingStatus: parseShippingStatus(order.status),
      }))
    );
  } catch (error) {
    return handleRouteError(error, "No se pudieron cargar tus compras.");
  }
}
