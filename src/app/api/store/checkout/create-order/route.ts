import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@prisma/client";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/paypal-server";
import { handleRouteError, requireDatabase, requireRole, RouteError, getPatientIdForUser } from "@/lib/route";
import { calculateShippingCost } from "@/lib/store";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/sanitize";

interface CheckoutItemInput {
  id?: string;
  quantity?: number;
}

interface ShippingInput {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

function isValidQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function normalizeShipping(
  shipping: ShippingInput | undefined,
  requiresShipping: boolean
) {
  if (!requiresShipping) {
    return null;
  }

  if (
    !shipping?.name ||
    !shipping.address ||
    !shipping.city ||
    !shipping.state ||
    !shipping.zip ||
    !shipping.phone
  ) {
    throw new RouteError(
      400,
      "Completa todos los datos de envio para productos fisicos."
    );
  }

  return {
    name: shipping.name.trim(),
    street: shipping.address.trim(),
    city: shipping.city.trim(),
    state: shipping.state.trim(),
    zip: shipping.zip.trim(),
    phone: shipping.phone.trim(),
  };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { success: withinLimit } = rateLimit(`checkout:${ip}`, {
      maxRequests: 10,
      windowMs: 60_000,
    });
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

    if (!isPayPalConfigured()) {
      throw new RouteError(503, "PayPal no esta configurado en el servidor.");
    }

    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();
    const rawBody = (await request.json()) as {
      items?: CheckoutItemInput[];
      shipping?: ShippingInput;
    };

    // Sanitize shipping address fields
    const body = {
      ...rawBody,
      shipping: rawBody.shipping
        ? sanitizeObject(rawBody.shipping)
        : undefined,
    };

    if (!Array.isArray(body.items) || body.items.length === 0) {
      throw new RouteError(400, "Tu carrito esta vacio.");
    }

    const normalizedItems = body.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    if (
      normalizedItems.some(
        (item) => typeof item.id !== "string" || !isValidQuantity(item.quantity)
      )
    ) {
      throw new RouteError(400, "El carrito contiene items invalidos.");
    }

    const patientId = await getPatientIdForUser(prisma, session.user.id);
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { shippingAddress: true },
    });
    const productIds = normalizedItems.map((item) => item.id as string);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        type: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new RouteError(400, "Uno o mas productos ya no estan disponibles.");
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    let subtotal = 0;
    let hasPhysicalItems = false;

    for (const item of normalizedItems) {
      const product = productMap.get(item.id as string);

      if (!product) {
        throw new RouteError(400, "Uno o mas productos ya no estan disponibles.");
      }

      if (product.type === ProductType.PHYSICAL) {
        hasPhysicalItems = true;
      }

      if (product.stock !== null && product.stock < (item.quantity as number)) {
        throw new RouteError(
          409,
          `No hay stock suficiente para ${product.name}.`
        );
      }

      subtotal += product.price * (item.quantity as number);
    }

    const shippingAddress = normalizeShipping(body.shipping, hasPhysicalItems);
    const shippingCost = calculateShippingCost(hasPhysicalItems);
    const total = subtotal + shippingCost;
    const localOrderId = randomUUID();
    const paypalOrder = await createPayPalOrder({
      localOrderId,
      totalCOP: total,
      itemCount: normalizedItems.length,
    });

    const patientUpdateData = shippingAddress
      ? {
          phone: shippingAddress.phone,
          shippingAddress: {
            ...(patient?.shippingAddress &&
            typeof patient.shippingAddress === "object" &&
            !Array.isArray(patient.shippingAddress)
              ? patient.shippingAddress
              : {}),
            address: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.zip,
          },
        }
      : undefined;

    await prisma.$transaction(async (tx) => {
      if (shippingAddress?.name) {
        await tx.user.update({
          where: { id: session.user.id },
          data: { name: shippingAddress.name },
        });
      }

      if (patientUpdateData) {
        await tx.patient.update({
          where: { id: patientId },
          data: patientUpdateData,
        });
      }

      await tx.order.create({
        data: {
          id: localOrderId,
          patientId,
          status: "PENDING",
          subtotal,
          shippingCost,
          total,
          paypalOrderId: paypalOrder.id,
          ...(shippingAddress ? { shippingAddress } : {}),
          items: {
            create: normalizedItems.map((item) => {
              const product = productMap.get(item.id as string);

              return {
                productId: item.id as string,
                quantity: item.quantity as number,
                price: product?.price || 0,
              };
            }),
          },
        },
      });
    });

    return NextResponse.json({
      orderId: localOrderId,
      paypalOrderId: paypalOrder.id,
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo preparar el pedido.");
  }
}
