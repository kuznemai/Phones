import type { CartItemInput, CartLine, CartPreview, DeliveryOption, Product } from "#shared/types";
import { variantLabel } from "./catalog";

/** Upper bound per cart line, matching what the catalog lets a shopper pick. */
export const MAX_QUANTITY_PER_LINE = 10;

/** Guards against a stored cart growing without bound. */
export const MAX_CART_LINES = 50;

function clampQuantity(value: number, max = MAX_QUANTITY_PER_LINE): number {
  return Math.min(Math.max(Math.trunc(value), 1), Math.max(max, 1));
}

function isItemLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Turns whatever came out of localStorage into a valid cart. Malformed entries are
 * dropped, quantities clamped and duplicate lines merged — a hand-edited or
 * corrupted value can never crash the store or inflate a total.
 */
export function sanitizeCartItems(raw: unknown): CartItemInput[] {
  if (!Array.isArray(raw)) return [];

  const merged = new Map<string, CartItemInput>();
  for (const entry of raw) {
    if (!isItemLike(entry)) continue;
    const { productId, variantId, quantity } = entry;
    if (typeof productId !== "string" || productId.length === 0 || productId.length > 100) continue;
    if (typeof variantId !== "string" || variantId.length === 0 || variantId.length > 100) continue;
    if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity < 1) continue;

    const key = `${productId}::${variantId}`;
    const existing = merged.get(key);
    if (existing) {
      existing.quantity = clampQuantity(existing.quantity + quantity);
    } else if (merged.size < MAX_CART_LINES) {
      merged.set(key, { productId, variantId, quantity: clampQuantity(quantity) });
    }
  }
  return [...merged.values()];
}

/**
 * Prices a cart against the catalog. The cart only ever stores ids and quantities, so
 * every amount here is derived from current catalog data — this is also how the real
 * backend must behave (`POST /cart/preview`).
 */
export function priceCart(catalog: Product[], items: CartItemInput[], delivery?: DeliveryOption): CartPreview {
  const lines: CartLine[] = [];

  for (const item of items) {
    const product = catalog.find((candidate) => candidate.id === item.productId);
    const variant = product?.variants.find((candidate) => candidate.id === item.variantId);
    if (!product || !variant) continue;

    const available = variant.stock > 0;
    const maxQuantity = Math.min(variant.stock, MAX_QUANTITY_PER_LINE);
    const quantity = clampQuantity(item.quantity, available ? maxQuantity : MAX_QUANTITY_PER_LINE);

    lines.push({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      title: product.title,
      variantLabel: variantLabel(variant),
      image: product.images[0] ?? "",
      unitPriceCents: variant.priceCents,
      quantity,
      lineTotalCents: available ? variant.priceCents * quantity : 0,
      available,
      maxQuantity,
    });
  }

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const deliveryCents = subtotalCents > 0 && delivery ? delivery.priceCents : 0;

  return {
    lines,
    unavailableCount: lines.filter((line) => !line.available).length,
    itemCount: lines.reduce((sum, line) => sum + (line.available ? line.quantity : 0), 0),
    totals: {
      currency: "USD",
      subtotalCents,
      deliveryCents,
      totalCents: subtotalCents + deliveryCents,
    },
  };
}
