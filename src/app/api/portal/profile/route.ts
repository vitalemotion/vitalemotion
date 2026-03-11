import { NextResponse } from "next/server";

const mockProfile = {
  name: "Maria Garcia",
  email: "maria@ejemplo.com",
  phone: "+57 300 123 4567",
  address: "Calle 45 #12-34",
  city: "Bogota",
  state: "Cundinamarca",
  postalCode: "110111",
  emailNotifications: true,
  whatsappNotifications: false,
};

export async function GET() {
  return NextResponse.json(mockProfile);
}

export async function PUT(request: Request) {
  const body = await request.json();

  // Mock: just echo back the updated profile
  const updatedProfile = { ...mockProfile, ...body };
  return NextResponse.json({ success: true, profile: updatedProfile });
}
