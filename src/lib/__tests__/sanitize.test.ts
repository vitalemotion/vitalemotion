import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  sanitizeObject,
  sanitizeEmail,
  sanitizePhone,
} from "@/lib/sanitize";

describe("sanitizeString", () => {
  it("escapes HTML entities", () => {
    const input = '<script>alert("xss")</script>';
    const result = sanitizeString(input);
    expect(result).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
  });

  it("escapes ampersands", () => {
    expect(sanitizeString("a & b")).toBe("a &amp; b");
  });

  it("escapes single quotes", () => {
    expect(sanitizeString("it's")).toBe("it&#x27;s");
  });

  it("trims whitespace is handled (passes through)", () => {
    // sanitizeString escapes entities but does NOT trim;
    // confirm it preserves the string structure correctly.
    const input = "  hello world  ";
    const result = sanitizeString(input);
    expect(result).toBe("  hello world  ");
  });
});

describe("sanitizeObject", () => {
  it("recursively sanitizes strings", () => {
    const input = { name: "<b>bold</b>", nested: { value: '<img src="x">' } };
    const result = sanitizeObject(input);
    expect(result.name).toBe("&lt;b&gt;bold&lt;/b&gt;");
    expect(result.nested.value).toBe(
      "&lt;img src=&quot;x&quot;&gt;"
    );
  });

  it("leaves non-strings unchanged", () => {
    const input = { count: 42, active: true, data: null };
    const result = sanitizeObject(input);
    expect(result.count).toBe(42);
    expect(result.active).toBe(true);
    expect(result.data).toBeNull();
  });

  it("handles arrays with mixed types", () => {
    const input = ["<p>text</p>", 123, true];
    const result = sanitizeObject(input);
    expect(result[0]).toBe("&lt;p&gt;text&lt;/p&gt;");
    expect(result[1]).toBe(123);
    expect(result[2]).toBe(true);
  });

  it("returns null/undefined as-is", () => {
    expect(sanitizeObject(null)).toBeNull();
    expect(sanitizeObject(undefined)).toBeUndefined();
  });
});

describe("sanitizeEmail", () => {
  it("validates and normalizes a valid email", () => {
    expect(sanitizeEmail("  User@Example.COM  ")).toBe("user@example.com");
  });

  it("accepts standard email formats", () => {
    expect(sanitizeEmail("test@domain.co")).toBe("test@domain.co");
    expect(sanitizeEmail("a.b+c@d.org")).toBe("a.b+c@d.org");
  });

  it("rejects invalid emails", () => {
    expect(sanitizeEmail("not-an-email")).toBeNull();
    expect(sanitizeEmail("@domain.com")).toBeNull();
    expect(sanitizeEmail("user@")).toBeNull();
    expect(sanitizeEmail("user @domain.com")).toBeNull();
    expect(sanitizeEmail("")).toBeNull();
  });
});

describe("sanitizePhone", () => {
  it("extracts digits and validates length", () => {
    expect(sanitizePhone("+57 300 123 4567")).toBe("573001234567");
    expect(sanitizePhone("(300) 123-4567")).toBe("3001234567");
  });

  it("accepts phone numbers with 10-13 digits", () => {
    expect(sanitizePhone("1234567890")).toBe("1234567890"); // 10 digits
    expect(sanitizePhone("1234567890123")).toBe("1234567890123"); // 13 digits
  });

  it("rejects too-short numbers", () => {
    expect(sanitizePhone("12345")).toBeNull();
    expect(sanitizePhone("123456789")).toBeNull(); // 9 digits
  });

  it("rejects too-long numbers", () => {
    expect(sanitizePhone("12345678901234")).toBeNull(); // 14 digits
  });
});
