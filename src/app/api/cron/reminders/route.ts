import { NextRequest, NextResponse } from "next/server";
import {
  sendWhatsAppReminder,
  messageTemplates,
  formatDateTimeForMessage,
  formatTimeForMessage,
} from "@/lib/whatsapp";

const CRON_SECRET = process.env.CRON_SECRET || "";

/**
 * Cron endpoint for sending appointment reminders.
 * Runs every 30 minutes via Vercel Cron.
 *
 * Sends:
 * - 24-hour reminders for appointments happening tomorrow
 * - 1-hour reminders for appointments happening in the next hour
 */
export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");

  if (CRON_SECRET) {
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();
  const results = {
    sent24h: 0,
    sent1h: 0,
    errors: 0,
    skipped: 0,
    timestamp: now.toISOString(),
  };

  try {
    const { prisma } = await import("@/lib/db");

    // -----------------------------------------------------------------------
    // 24-hour reminders
    // -----------------------------------------------------------------------
    const tomorrow = new Date(now);
    tomorrow.setHours(tomorrow.getHours() + 24);

    const tomorrowWindowStart = new Date(now);
    tomorrowWindowStart.setHours(tomorrowWindowStart.getHours() + 23);

    const tomorrowWindowEnd = new Date(now);
    tomorrowWindowEnd.setHours(tomorrowWindowEnd.getHours() + 25);

    const appointments24h = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: tomorrowWindowStart,
          lte: tomorrowWindowEnd,
        },
        status: { in: ["PENDING", "CONFIRMED"] },
        reminderSent24h: false,
      },
      include: {
        patient: {
          include: { user: true },
        },
        service: true,
      },
    });

    for (const appointment of appointments24h) {
      const phone = appointment.patient.phone;
      if (!phone) {
        results.skipped++;
        continue;
      }

      const patientName = appointment.patient.user.name || "Paciente";
      const serviceName = appointment.service.name;
      const dateTime = formatDateTimeForMessage(appointment.startTime);

      const message = messageTemplates.reminder24h(
        patientName,
        serviceName,
        dateTime
      );

      const { success } = await sendWhatsAppReminder(phone, message);

      if (success) {
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { reminderSent24h: true },
        });
        results.sent24h++;
      } else {
        results.errors++;
      }
    }

    // -----------------------------------------------------------------------
    // 1-hour reminders
    // -----------------------------------------------------------------------
    const oneHourWindowStart = new Date(now);
    oneHourWindowStart.setMinutes(oneHourWindowStart.getMinutes() + 30);

    const oneHourWindowEnd = new Date(now);
    oneHourWindowEnd.setMinutes(oneHourWindowEnd.getMinutes() + 90);

    const appointments1h = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: oneHourWindowStart,
          lte: oneHourWindowEnd,
        },
        status: { in: ["PENDING", "CONFIRMED"] },
        reminderSent1h: false,
      },
      include: {
        patient: {
          include: { user: true },
        },
        service: true,
      },
    });

    for (const appointment of appointments1h) {
      const phone = appointment.patient.phone;
      if (!phone) {
        results.skipped++;
        continue;
      }

      const patientName = appointment.patient.user.name || "Paciente";
      const serviceName = appointment.service.name;
      const time = formatTimeForMessage(appointment.startTime);

      const message = messageTemplates.reminder1h(
        patientName,
        serviceName,
        time
      );

      const { success } = await sendWhatsAppReminder(phone, message);

      if (success) {
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: { reminderSent1h: true },
        });
        results.sent1h++;
      } else {
        results.errors++;
      }
    }

    console.log("[Cron] Reminder results:", results);
    return NextResponse.json(results);
  } catch (error) {
    // Handle case where DB is not available (dev/preview without DB)
    console.warn("[Cron] Could not query appointments (no DB?):", error);
    return NextResponse.json({
      ...results,
      message: "No database connection — skipped reminder processing",
    });
  }
}
