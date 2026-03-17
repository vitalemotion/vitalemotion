import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Mock external dependencies so we never hit a real DB, email service, etc.
// ---------------------------------------------------------------------------

// Mock @/lib/route — requireDatabase returns a mock prisma
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("@/lib/route", () => ({
  requireDatabase: () => mockPrisma,
  handleRouteError: (error: unknown, fallbackMessage: string) => {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      "message" in error
    ) {
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: (error as { status: number }).status }
      );
    }
    return NextResponse.json({ error: fallbackMessage }, { status: 500 });
  },
}));

// Mock @/lib/email — prevent actual email sending
vi.mock("@/lib/email", () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
  },
}));

// ---------------------------------------------------------------------------
// Helper to create a NextRequest with JSON body
// ---------------------------------------------------------------------------

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/auth/register — validation", () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();

    // Re-apply mocks after resetModules
    vi.doMock("@/lib/route", () => ({
      requireDatabase: () => mockPrisma,
      handleRouteError: (error: unknown, fallbackMessage: string) => {
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          "message" in error
        ) {
          return NextResponse.json(
            { error: (error as { message: string }).message },
            { status: (error as { status: number }).status }
          );
        }
        return NextResponse.json({ error: fallbackMessage }, { status: 500 });
      },
    }));

    vi.doMock("@/lib/email", () => ({
      sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
    }));

    vi.doMock("bcryptjs", () => ({
      default: {
        hash: vi.fn().mockResolvedValue("hashed-password"),
      },
    }));

    // Clear mock call history
    mockPrisma.user.findUnique.mockReset();
    mockPrisma.user.create.mockReset();

    // Import the handler fresh
    const mod = await import("@/app/api/auth/register/route");
    POST = mod.POST;
  });

  it("rejects missing name (400)", async () => {
    const req = makeRequest({
      email: "test@example.com",
      password: "secure-password-123",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("rejects missing email (400)", async () => {
    const req = makeRequest({
      name: "Test User",
      password: "secure-password-123",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("rejects short password (400)", async () => {
    const req = makeRequest({
      name: "Test User",
      email: "test@example.com",
      password: "short",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("8");
  });

  it("rejects invalid email format (400)", async () => {
    const req = makeRequest({
      name: "Test User",
      email: "not-an-email",
      password: "secure-password-123",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("accepts valid registration data (201)", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: "new-user-id" });

    const req = makeRequest({
      name: "Maria Lopez",
      email: "maria@example.com",
      password: "secure-password-123",
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
