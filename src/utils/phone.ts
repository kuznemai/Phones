/** Нормализация к виду +7XXXXXXXXXX (минимально, без полной E.164 валидации). */
export function normalizePhoneRu(input: string): string {
  const cleaned = input.replace(/[^\d+]/g, "");
  const digitsOnly = cleaned.replace(/\D/g, "");

  if (cleaned.startsWith("+")) {
    return `+${digitsOnly}`;
  }
  if (digitsOnly.length === 10) {
    return `+7${digitsOnly}`;
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith("8")) {
    return `+7${digitsOnly.slice(1)}`;
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith("7")) {
    return `+${digitsOnly}`;
  }
  if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
    return `+${digitsOnly}`;
  }
  return "";
}

export function isPhoneLengthOk(normalized: string): boolean {
  const d = normalized.replace(/\D/g, "");
  return d.length >= 10 && d.length <= 15;
}
