import { NextRequest, NextResponse } from "next/server";
import {
  getPatientIdForUser,
  handleRouteError,
  requireDatabase,
  requireRole,
} from "@/lib/route";

function formatCOP(value: number) {
  return `$${Math.round(value).toLocaleString("es-CO")}`;
}

function parseShippingAddress(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const shipping = value as Record<string, unknown>;

  return {
    name: typeof shipping.name === "string" ? shipping.name : "",
    address:
      typeof shipping.address === "string"
        ? shipping.address
        : typeof shipping.street === "string"
          ? shipping.street
          : "",
    city: typeof shipping.city === "string" ? shipping.city : "",
    state: typeof shipping.state === "string" ? shipping.state : "",
    zip:
      typeof shipping.zip === "string"
        ? shipping.zip
        : typeof shipping.postalCode === "string"
          ? shipping.postalCode
          : "",
    phone: typeof shipping.phone === "string" ? shipping.phone : "",
  };
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
      return NextResponse.json(
        { error: "Pedido no encontrado." },
        { status: 404 }
      );
    }

    const items = order.items.map((item) => ({
      id: item.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      priceFormatted: formatCOP(item.price),
      type: item.product.type === "DIGITAL" ? "digital" : "physical",
      downloadUrl: item.product.digitalFile,
    }));

    return NextResponse.json({
      id: order.id,
      status: order.status,
      subtotal: order.subtotal,
      subtotalFormatted: formatCOP(order.subtotal),
      shippingCost: order.shippingCost,
      shippingCostFormatted: formatCOP(order.shippingCost),
      total: order.total,
      totalFormatted: formatCOP(order.total),
      createdAt: order.createdAt.toISOString(),
      paypalOrderId: order.paypalOrderId,
      shippingAddress: parseShippingAddress(order.shippingAddress),
      hasDigitalItems: items.some((item) => item.type === "digital"),
      hasPhysicalItems: items.some((item) => item.type === "physical"),
      items,
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo cargar el pedido.");
  }
}
