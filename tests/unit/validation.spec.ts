import { describe, expect, it } from "vitest";
import type { ShippingAddress } from "#shared/types";
import { isValidEmail, isValidPhone, normalizePhone, validateCheckout, validateCheckoutField } from "~/utils/validation";

describe("normalizePhone", () => {
  it("keeps an international number", () => {
    expect(normalizePhone("+1 (555) 010-0123")).toBe("+15550100123");
  });

  it("converts a leading 8 to +7", () => {
    expect(normalizePhone("8 916 123 45 67")).toBe("+79161234567");
  });

  it("rejects numbers that are too short or too long", () => {
    expect(normalizePhone("12345")).toBe("");
    expect(normalizePhone("1234567890123456")).toBe("");
  });
});

describe("isValidEmail", () => {
  it.each(["a@b.co", "marina.k@iz.example"])("accepts %s", (value) => {
    expect(isValidEmail(value)).toBe(true);
  });

  it.each(["", "a@b", "a b@c.com", "@b.com"])("rejects %s", (value) => {
    expect(isValidEmail(value)).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("mirrors normalizePhone", () => {
    expect(isValidPhone("+15550100123")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
  });
});

const VALID_ADDRESS: ShippingAddress = {
  fullName: "Alex Morgan",
  email: "alex@example.com",
  phone: "+1 555 010 0123",
  country: "United States",
  city: "Portland",
  street: "12 Example Street",
  postalCode: "97201",
  comment: "",
};

describe("validateCheckout", () => {
  it("accepts a complete address", () => {
    expect(validateCheckout(VALID_ADDRESS)).toEqual({});
  });

  it("reports every missing required field", () => {
    const errors = validateCheckout({
      fullName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      street: "",
      postalCode: "",
      comment: "",
    });
    expect(Object.keys(errors).sort()).toEqual(["city", "country", "email", "fullName", "phone", "postalCode", "street"]);
  });

  it("treats whitespace-only input as empty", () => {
    expect(validateCheckoutField("fullName", "   ")).toBe("Enter your full name.");
  });

  it("explains what is wrong with a malformed value", () => {
    expect(validateCheckoutField("email", "alex@")).toMatch(/valid email/);
    expect(validateCheckoutField("phone", "12345")).toMatch(/10 to 15 digits/);
    expect(validateCheckoutField("postalCode", "@@")).toMatch(/valid postal code/);
  });

  it("keeps the optional note optional but bounded", () => {
    expect(validateCheckoutField("comment", "")).toBeUndefined();
    expect(validateCheckoutField("comment", "x".repeat(501))).toMatch(/under 500/);
  });
});
