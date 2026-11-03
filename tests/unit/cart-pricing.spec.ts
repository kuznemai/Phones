import { describe, expect, it } from "vitest";
import type { DeliveryOption, Product } from "#shared/types";
import { MAX_CART_LINES, MAX_QUANTITY_PER_LINE, priceCart, sanitizeCartItems } from "~/utils/cart";

const PHONE: Product = {
  id: "p1",
  slug: "phone",
  title: "Phone",
  tagline: "",
  description: "",
  highlights: [],
  images: ["/phone.png"],
  specs: [],
  displayInches: 6.1,
  batteryMah: 4000,
  variants: [
    { id: "v128", storageGb: 128, color: "Black", colorHex: "#000", priceCents: 50000, stock: 20 },
    { id: "v256", storageGb: 256, color: "Black", colorHex: "#000", priceCents: 60050, stock: 3 },
    { id: "vgone", storageGb: 512, color: "Black", colorHex: "#000", priceCents: 70000, stock: 0 },
  ],
};

const EXPRESS: DeliveryOption = {
  id: "express",
  title: "Express",
  description: "",
  priceCents: 4900,
  etaDaysMin: 1,
  etaDaysMax: 2,
};

describe("priceCart", () => {
  it("multiplies unit price by quantity and sums lines in cents", () => {
    const preview = priceCart([PHONE], [
      { productId: "p1", variantId: "v128", quantity: 2 },
      { productId: "p1", variantId: "v256", quantity: 1 },
    ]);

    expect(preview.lines.map((line) => line.lineTotalCents)).toEqual([100000, 60050]);
    expect(preview.totals.subtotalCents).toBe(160050);
    expect(preview.totals.totalCents).toBe(160050);
    expect(preview.itemCount).toBe(3);
  });

  it("adds delivery only when there is something to deliver", () => {
    const withItems = priceCart([PHONE], [{ productId: "p1", variantId: "v128", quantity: 1 }], EXPRESS);
    expect(withItems.totals.deliveryCents).toBe(4900);
    expect(withItems.totals.totalCents).toBe(54900);

    const empty = priceCart([PHONE], [], EXPRESS);
    expect(empty.totals.deliveryCents).toBe(0);
    expect(empty.totals.totalCents).toBe(0);
  });

  it("clamps the quantity to the stock that is left", () => {
    const preview = priceCart([PHONE], [{ productId: "p1", variantId: "v256", quantity: 9 }]);
    expect(preview.lines[0]!.quantity).toBe(3);
    expect(preview.lines[0]!.maxQuantity).toBe(3);
    expect(preview.totals.subtotalCents).toBe(3 * 60050);
  });

  it("keeps out-of-stock lines visible but excludes them from the total", () => {
    const preview = priceCart([PHONE], [
      { productId: "p1", variantId: "vgone", quantity: 1 },
      { productId: "p1", variantId: "v128", quantity: 1 },
    ]);

    expect(preview.lines).toHaveLength(2);
    expect(preview.lines[0]!.available).toBe(false);
    expect(preview.lines[0]!.lineTotalCents).toBe(0);
    expect(preview.unavailableCount).toBe(1);
    expect(preview.totals.subtotalCents).toBe(50000);
    expect(preview.itemCount).toBe(1);
  });

  it("drops lines whose product or variant no longer exists", () => {
    const preview = priceCart([PHONE], [
      { productId: "missing", variantId: "v128", quantity: 1 },
      { productId: "p1", variantId: "missing", quantity: 1 },
    ]);
    expect(preview.lines).toEqual([]);
    expect(preview.totals.totalCents).toBe(0);
  });

  it("describes the configuration for the cart line", () => {
    const preview = priceCart([PHONE], [{ productId: "p1", variantId: "v256", quantity: 1 }]);
    expect(preview.lines[0]!.variantLabel).toBe("256 GB · Black");
  });
});

describe("sanitizeCartItems", () => {
  it("returns an empty cart for anything that is not an array", () => {
    for (const raw of [undefined, null, "cart", 42, { productId: "p1" }]) {
      expect(sanitizeCartItems(raw)).toEqual([]);
    }
  });

  it("drops malformed entries and keeps valid ones", () => {
    const result = sanitizeCartItems([
      { productId: "p1", variantId: "v1", quantity: 2 },
      null,
      "junk",
      { productId: "p2" },
      { productId: "p3", variantId: "v3", quantity: "2" },
      { productId: "p4", variantId: "v4", quantity: Number.NaN },
      { productId: "p5", variantId: "v5", quantity: 0 },
      { productId: "", variantId: "v6", quantity: 1 },
    ]);
    expect(result).toEqual([{ productId: "p1", variantId: "v1", quantity: 2 }]);
  });

  it("clamps quantities and truncates fractions", () => {
    const result = sanitizeCartItems([
      { productId: "p1", variantId: "v1", quantity: 999 },
      { productId: "p2", variantId: "v2", quantity: 2.7 },
    ]);
    expect(result.map((item) => item.quantity)).toEqual([MAX_QUANTITY_PER_LINE, 2]);
  });

  it("merges duplicate lines", () => {
    const result = sanitizeCartItems([
      { productId: "p1", variantId: "v1", quantity: 2 },
      { productId: "p1", variantId: "v1", quantity: 3 },
    ]);
    expect(result).toEqual([{ productId: "p1", variantId: "v1", quantity: 5 }]);
  });

  it("caps the number of lines", () => {
    const many = Array.from({ length: MAX_CART_LINES + 20 }, (_, index) => ({
      productId: `p${index}`,
      variantId: "v",
      quantity: 1,
    }));
    expect(sanitizeCartItems(many)).toHaveLength(MAX_CART_LINES);
  });
});
