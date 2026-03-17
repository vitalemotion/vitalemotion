import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, RouteError, requireDatabase, requireRole } from "@/lib/route";
import { sanitizeString, sanitizePhone } from "@/lib/sanitize";

interface PatientProfileAddress {
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  emailNotifications?: boolean;
  whatsappNotifications?: boolean;
}

function parseProfileAddress(value: unknown): PatientProfileAddress {
  if (!value || typeof value !== "object") {
    return {};
  }

  return value as PatientProfileAddress;
}

export async function GET() {
  try {
    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true },
    });

    if (!user?.patient) {
      return NextResponse.json(
        { error: "Perfil de paciente no encontrado." },
        { status: 404 }
      );
    }

    const profileAddress = parseProfileAddress(user.patient.shippingAddress);

    return NextResponse.json({
      name: user.name || "",
      email: user.email,
      phone: user.patient.phone || "",
      address: profileAddress.address || "",
      city: profileAddress.city || "",
      state: profileAddress.state || "",
      postalCode: profileAddress.postalCode || "",
      emailNotifications: profileAddress.emailNotifications ?? true,
      whatsappNotifications: profileAddress.whatsappNotifications ?? false,
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo cargar tu perfil.");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();
    const body = await request.json();

    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Perfil de paciente no encontrado." },
        { status: 404 }
      );
    }

    // Sanitize inputs
    const sanitizedName = body.name !== undefined ? sanitizeString(body.name) : undefined;
    const sanitizedPhoneValue = body.phone !== undefined
      ? (body.phone ? sanitizePhone(body.phone) : null)
      : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(sanitizedName !== undefined && { name: sanitizedName }),
      },
      select: { name: true, email: true },
    });

    const updatedPatient = await prisma.patient.update({
      where: { id: patient.id },
      data: {
        ...(sanitizedPhoneValue !== undefined && { phone: sanitizedPhoneValue }),
        shippingAddress: {
          address: body.address ? sanitizeString(body.address) : "",
          city: body.city ? sanitizeString(body.city) : "",
          state: body.state ? sanitizeString(body.state) : "",
          postalCode: body.postalCode ? sanitizeString(body.postalCode) : "",
          emailNotifications: Boolean(body.emailNotifications),
          whatsappNotifications: Boolean(body.whatsappNotifications),
        },
      },
      select: {
        phone: true,
        shippingAddress: true,
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        name: updatedUser.name || "",
        email: updatedUser.email,
        phone: updatedPatient.phone || "",
        address:
          parseProfileAddress(updatedPatient.shippingAddress).address || "",
        city: parseProfileAddress(updatedPatient.shippingAddress).city || "",
        state: parseProfileAddress(updatedPatient.shippingAddress).state || "",
        postalCode:
          parseProfileAddress(updatedPatient.shippingAddress).postalCode || "",
        emailNotifications:
          parseProfileAddress(updatedPatient.shippingAddress)
            .emailNotifications ?? true,
        whatsappNotifications:
          parseProfileAddress(updatedPatient.shippingAddress)
            .whatsappNotifications ?? false,
      },
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo actualizar tu perfil.");
  }
}

export async function DELETE() {
  try {
    const session = await requireRole(["PATIENT"]);
    const prisma = requireDatabase();

    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Perfil de paciente no encontrado." },
        { status: 404 }
      );
    }

    // Check for appointments within the next 24 hours
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        startTime: { lte: in24Hours },
        endTime: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { id: true },
    });

    if (upcomingAppointments.length > 0) {
      throw new RouteError(
        409,
        "No puedes eliminar tu cuenta porque tienes citas programadas en las proximas 24 horas. Por favor cancela o espera a que finalicen antes de intentar nuevamente."
      );
    }

    // Delete in cascading order: OrderItem -> Order -> Appointment -> Patient -> User
    // OrderItem is cascade-deleted with Order via Prisma schema.
    // We delete explicitly in order to ensure all related data is removed.
    await prisma.$transaction(async (tx) => {
      // Delete order items for all patient orders
      const orderIds = await tx.order.findMany({
        where: { patientId: patient.id },
        select: { id: true },
      });
      if (orderIds.length > 0) {
        await tx.orderItem.deleteMany({
          where: { orderId: { in: orderIds.map((o) => o.id) } },
        });
      }

      // Delete orders
      await tx.order.deleteMany({ where: { patientId: patient.id } });

      // Delete appointments
      await tx.appointment.deleteMany({ where: { patientId: patient.id } });

      // Delete patient
      await tx.patient.delete({ where: { id: patient.id } });

      // Delete sessions and accounts (cascade from User, but be explicit)
      await tx.session.deleteMany({ where: { userId: session.user.id } });
      await tx.account.deleteMany({ where: { userId: session.user.id } });

      // Delete user
      await tx.user.delete({ where: { id: session.user.id } });
    });

    return NextResponse.json({
      success: true,
      message: "Tu cuenta y todos tus datos han sido eliminados exitosamente.",
    });
  } catch (error) {
    return handleRouteError(error, "No se pudo eliminar tu cuenta.");
  }
}
