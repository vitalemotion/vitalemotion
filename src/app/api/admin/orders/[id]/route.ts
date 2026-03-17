import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, requireDatabase, requireRole } from "@/lib/route";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const { id } = await params;

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
            product: { select: { name: true, type: true, digitalFile: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo cargar el pedido.");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["ADMIN"]);
    const prisma = requireDatabase();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status es requerido." },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    return handleRouteError(error, "No se pudo actualizar el pedido.");
  }
}
