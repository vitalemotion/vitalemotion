import { NextResponse } from "next/server";
import { getServices } from "@/lib/scheduling";
import { handleRouteError } from "@/lib/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await getServices();

    return NextResponse.json({
      services,
    });
  } catch (error) {
    return handleRouteError(error, "No se pudieron cargar los servicios");
  }
}
