import type { ShippingAddress } from "#shared/types";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Normalises user input to a `+<digits>` form; returns "" when it cannot. */
export function normalizePhone(input: string): string {
  const cleaned = input.replace(/[^\d+]/g, "");
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return "";
  if (cleaned.startsWith("+")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  return `+${digits}`;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return normalizePhone(value) !== "";
}

export function isFilled(value: string, minLength = 1): boolean {
  return value.trim().length >= minLength;
}

/* ------------------------------------------------------------- checkout */

export type CheckoutField = keyof ShippingAddress;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export const COMMENT_MAX_LENGTH = 500;

const POSTAL_CODE_PATTERN = /^[a-z0-9][a-z0-9 -]{1,9}$/i;

/** One rule per field, so a field can be checked on blur as well as on submit. */
const RULES: Record<CheckoutField, (value: string) => string | undefined> = {
  fullName: (value) => (isFilled(value, 2) ? undefined : "Enter your full name."),
  email: (value) =>
    !isFilled(value) ? "Enter your email address." : isValidEmail(value) ? undefined : "Enter a valid email address, for example name@example.com.",
  phone: (value) =>
    !isFilled(value)
      ? "Enter your phone number."
      : isValidPhone(value)
        ? undefined
        : "Enter a phone number with 10 to 15 digits, including the country code.",
  country: (value) => (isFilled(value, 2) ? undefined : "Enter your country."),
  city: (value) => (isFilled(value, 2) ? undefined : "Enter your city."),
  street: (value) => (isFilled(value, 3) ? undefined : "Enter your street address and building number."),
  postalCode: (value) =>
    !isFilled(value)
      ? "Enter your postal code."
      : POSTAL_CODE_PATTERN.test(value.trim())
        ? undefined
        : "Enter a valid postal code (letters, digits, spaces or hyphens).",
  comment: (value) =>
    value.length > COMMENT_MAX_LENGTH ? `Keep the note under ${COMMENT_MAX_LENGTH} characters.` : undefined,
};

export function validateCheckoutField(field: CheckoutField, value: string): string | undefined {
  return RULES[field](value);
}

export function validateCheckout(address: ShippingAddress): CheckoutErrors {
  const errors: CheckoutErrors = {};
  for (const field of Object.keys(RULES) as CheckoutField[]) {
    const message = RULES[field](address[field] ?? "");
    if (message) errors[field] = message;
  }
  return errors;
}
