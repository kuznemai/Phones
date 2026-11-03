import type { Currency } from "#shared/types";

const LOCALE = "en-GB";

/** Money is stored in minor units everywhere; format from cents, never from floats. */
export function formatPrice(cents: number | null | undefined, currency: Currency = "USD"): string {
  const value = Number.isFinite(cents) ? (cents as number) / 100 : 0;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    // en-GB renders USD as "US$" by default; the store is dollar-only.
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatEta(minDays: number, maxDays: number): string {
  if (minDays === maxDays) return `${minDays} ${minDays === 1 ? "day" : "days"}`;
  return `${minDays}–${maxDays} days`;
}

/** "6.7″ display · 5000 mAh" style summaries on cards. */
export function formatInches(value: number): string {
  return `${value}″`;
}

export function formatStorage(gb: number): string {
  return gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
}
