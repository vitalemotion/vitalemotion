import { NextRequest, NextResponse } from "next/server";
import { getPsychologistsForService } from "@/lib/scheduling";
import { handleRouteError } from "@/lib/route";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");

  if (!serviceId) {
    return NextResponse.json(
      { error: "El parametro 'serviceId' es requerido" },
      { status: 400 }
    );
  }

  try {
    const psychologists = await getPsychologistsForService(serviceId);

    return NextResponse.json({
      psychologists: psychologists.map((psychologist) => ({
        id: psychologist.id,
        name: psychologist.name,
        specialties: psychologist.specialties,
        photoUrl: psychologist.photoUrl,
        bio: psychologist.bio,
      })),
    });
  } catch (error) {
    return handleRouteError(error, "No se pudieron cargar los profesionales");
  }
}
