import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, ProductType } from "@prisma/client";
import { capturePayPalOrder } from "@/lib/paypal-server";
import { getPatientIdForUser, handleRouteError, requireDatabase, requireRole, RouteError } from "@/lib/route";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();
    const body = (await request.json()) as {
      orderId?: string;
      paypalOrderId?: string;
    };

    if (!body.orderId || !body.paypalOrderId) {
      throw new RouteError(400, "El pedido de checkout esta incompleto.");
    }

    const patientId = await getPatientIdForUser(prisma, session.user.id);
    const order = await prisma.order.findUnique({
      where: { id: body.orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                stock: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!order || order.patientId !== patientId) {
      throw new RouteError(404, "Pedido no encontrado.");
    }

    if (order.status === OrderStatus.PAID) {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        status: order.status,
      });
    }

    if (order.paypalOrderId !== body.paypalOrderId) {
      throw new RouteError(409, "La orden de PayPal no coincide con el pedido.");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new RouteError(409, "Este pedido ya no puede capturarse.");
    }

    for (const item of order.items) {
      if (
        item.product.type === ProductType.PHYSICAL &&
        item.product.stock !== null &&
        item.product.stock < item.quantity
      ) {
        throw new RouteError(
          409,
          `No hay stock suficiente para ${item.product.name}.`
        );
      }
    }

    const capture = await capturePayPalOrder(body.paypalOrderId);

    if (capture.status !== "COMPLETED") {
      throw new RouteError(422, "PayPal no confirmo el pago del pedido.");
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        if (
          item.product.type === ProductType.PHYSICAL &&
          item.product.stock !== null
        ) {
          await tx.product.update({
            where: { id: item.product.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
        },
      });
    });

    // Send order confirmation email (non-blocking)
    const recipientEmail = session.user.email || capture.payer?.email_address;
    if (recipientEmail) {
      sendOrderConfirmation({
        to: recipientEmail,
        patientName: session.user.name || "Cliente",
        orderId: order.id,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: "PAID",
      payerEmail: capture.payer?.email_address || null,
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo confirmar el pago.");
  }
}
