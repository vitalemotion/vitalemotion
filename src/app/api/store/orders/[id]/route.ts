import { NextRequest, NextResponse } from "next/server";
import { getPatientIdForUser, handleRouteError, requireDatabase, requireRole, RouteError } from "@/lib/route";
import { formatCOP } from "@/lib/store";

function formatDate(date: Date) {
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();
    const patientId = await getPatientIdForUser(prisma, session.user.id);
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
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
    });

    if (!order || order.patientId !== patientId) {
      throw new RouteError(404, "Pedido no encontrado.");
    }

    const items = order.items.map((item) => ({
      id: item.id,
      name: item.product.name,
      quantity: item.quantity,
      price: formatCOP(item.price),
      type: item.product.type === "DIGITAL" ? "digital" : "physical",
      downloadUrl: item.product.digitalFile,
    }));

    return NextResponse.json({
      id: order.id,
      createdAt: formatDate(order.createdAt),
      total: formatCOP(order.total),
      status: order.status,
      hasDigitalItems: items.some((item) => item.type === "digital"),
      hasPhysicalItems: items.some((item) => item.type === "physical"),
      shippingAddress: order.shippingAddress,
      items,
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo cargar el pedido.");
  }
}
