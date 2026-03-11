const CALCOM_API_URL = process.env.CALCOM_API_URL || "https://api.cal.com/v1";
const CALCOM_API_KEY = process.env.CALCOM_API_KEY || "";

export interface TimeSlot {
  time: string; // ISO datetime
  available: boolean;
}

interface CalcomSlotsResponse {
  slots: Record<string, { time: string }[]>;
}

interface CalcomBookingResponse {
  id: number;
  uid: string;
  title: string;
  startTime: string;
  endTime: string;
}

function isConfigured(): boolean {
  return CALCOM_API_KEY.length > 0;
}

// ---------------------------------------------------------------------------
// Mock helpers — used when Cal.com is not configured (dev / preview)
// ---------------------------------------------------------------------------

function generateMockSlots(date: string, duration: number): TimeSlot[] {
  const d = new Date(date);
  const dayOfWeek = d.getDay();

  // No slots on weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) return [];

  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 17;
  const stepMinutes = duration >= 90 ? 90 : 60;

  for (let hour = startHour; hour < endHour; hour += stepMinutes / 60) {
    const minutes = (hour % 1) * 60;
    const wholeHour = Math.floor(hour);
    const slotDate = new Date(d);
    slotDate.setHours(wholeHour, minutes, 0, 0);

    // Don't return slots in the past
    if (slotDate <= new Date()) continue;

    slots.push({
      time: slotDate.toISOString(),
      available: true,
    });
  }

  return slots;
}

function generateMockSlotsRange(
  dateFrom: string,
  dateTo: string,
  duration: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const current = new Date(dateFrom);
  const end = new Date(dateTo);

  while (current <= end) {
    const daySlots = generateMockSlots(
      current.toISOString().split("T")[0],
      duration
    );
    slots.push(...daySlots);
    current.setDate(current.getDate() + 1);
  }

  return slots;
}

// ---------------------------------------------------------------------------
// Cal.com API functions
// ---------------------------------------------------------------------------

export async function getAvailableSlots(
  userId: string,
  dateFrom: string,
  dateTo: string,
  duration: number = 60
): Promise<TimeSlot[]> {
  if (!isConfigured()) {
    console.log("[Cal.com Mock] Generating mock slots for", dateFrom, "to", dateTo);
    return generateMockSlotsRange(dateFrom, dateTo, duration);
  }

  const params = new URLSearchParams({
    apiKey: CALCOM_API_KEY,
    userId,
    dateFrom,
    dateTo,
    duration: String(duration),
  });

  const response = await fetch(`${CALCOM_API_URL}/slots?${params.toString()}`);

  if (!response.ok) {
    console.error("[Cal.com] Failed to fetch slots:", response.statusText);
    return generateMockSlotsRange(dateFrom, dateTo, duration);
  }

  const data: CalcomSlotsResponse = await response.json();

  const slots: TimeSlot[] = [];
  for (const [, daySlots] of Object.entries(data.slots)) {
    for (const slot of daySlots) {
      slots.push({ time: slot.time, available: true });
    }
  }

  return slots;
}

export async function createBooking(
  eventTypeId: number,
  start: string,
  name: string,
  email: string,
  notes?: string
): Promise<{ success: boolean; bookingId?: number; mock?: boolean }> {
  if (!isConfigured()) {
    console.log("[Cal.com Mock] Creating mock booking:", { eventTypeId, start, name, email });
    return { success: true, bookingId: Math.floor(Math.random() * 100000), mock: true };
  }

  const response = await fetch(`${CALCOM_API_URL}/bookings?apiKey=${CALCOM_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventTypeId,
      start,
      responses: {
        name,
        email,
        notes: notes || "",
      },
      timeZone: "America/Bogota",
      language: "es",
    }),
  });

  if (!response.ok) {
    console.error("[Cal.com] Failed to create booking:", response.statusText);
    return { success: false };
  }

  const data: CalcomBookingResponse = await response.json();
  return { success: true, bookingId: data.id };
}

export async function cancelBooking(
  bookingId: number
): Promise<{ success: boolean }> {
  if (!isConfigured()) {
    console.log("[Cal.com Mock] Cancelling mock booking:", bookingId);
    return { success: true };
  }

  const response = await fetch(
    `${CALCOM_API_URL}/bookings/${bookingId}/cancel?apiKey=${CALCOM_API_KEY}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    console.error("[Cal.com] Failed to cancel booking:", response.statusText);
    return { success: false };
  }

  return { success: true };
}

export async function rescheduleBooking(
  bookingId: number,
  newStart: string
): Promise<{ success: boolean }> {
  if (!isConfigured()) {
    console.log("[Cal.com Mock] Rescheduling mock booking:", bookingId, "to", newStart);
    return { success: true };
  }

  const response = await fetch(
    `${CALCOM_API_URL}/bookings/${bookingId}?apiKey=${CALCOM_API_KEY}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: newStart,
        timeZone: "America/Bogota",
      }),
    }
  );

  if (!response.ok) {
    console.error("[Cal.com] Failed to reschedule booking:", response.statusText);
    return { success: false };
  }

  return { success: true };
}

export { generateMockSlots };
