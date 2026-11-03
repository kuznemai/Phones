import { describe, expect, it } from "vitest";
import { products } from "~/data/products";
import { fetchProduct, fetchProducts } from "~/services/catalog";
import { previewCart } from "~/services/cart";
import { submitOrder } from "~/services/orders";
import { parseCatalogQuery, queryProducts, serializeCatalogQuery, sizeClassOf } from "~/utils/catalog";

const titles = (query: Parameters<typeof queryProducts>[1]) => queryProducts(products, query).map((item) => item.title);

describe("queryProducts", () => {
  it("lists featured devices first by default", () => {
    const featured = products.filter((product) => product.featured).map((product) => product.title);
    expect(titles({}).slice(0, featured.length)).toEqual(featured);
  });

  it("searches title, copy and specs, case-insensitively, requiring every word", () => {
    expect(titles({ search: "VAULT" })).toEqual(["IZ Vault"]);
    expect(titles({ search: "replaceable battery" })).toEqual(["IZ Field"]);
    expect(titles({ search: "no such phone" })).toEqual([]);
  });

  it("sorts by price in both directions", () => {
    const ascending = queryProducts(products, { sort: "price-asc" }).map((item) => item.fromPriceCents);
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
    const descending = queryProducts(products, { sort: "price-desc" }).map((item) => item.fromPriceCents);
    expect(descending).toEqual([...descending].sort((a, b) => b - a));
  });

  it("filters by storage and shows the price of the matching configuration", () => {
    const items = queryProducts(products, { storage: [512] });
    expect(items.map((item) => item.title).sort()).toEqual(["IZ Field", "IZ One Pro", "IZ Vault"]);
    expect(items.find((item) => item.title === "IZ One Pro")!.fromPriceCents).toBe(134900);
  });

  it("combines colour, size and stock filters", () => {
    expect(titles({ colors: ["Carbon Black"], sizes: ["compact"], inStockOnly: true }).sort()).toEqual([
      "IZ One Mini",
      "IZ Vault",
    ]);
    expect(titles({ inStockOnly: true })).not.toContain("IZ Field");
  });

  it("classifies screen sizes", () => {
    expect([5.8, 6.2, 6.4, 6.5].map(sizeClassOf)).toEqual(["compact", "standard", "standard", "large"]);
  });
});

describe("catalog URL state", () => {
  it("round-trips through the query string", () => {
    const state = parseCatalogQuery({ q: "pro", sort: "price-desc", storage: "256,512", color: "Carbon Black", size: "large", stock: "1" });
    expect(state).toEqual({
      search: "pro",
      sort: "price-desc",
      storage: [256, 512],
      colors: ["Carbon Black"],
      sizes: ["large"],
      inStockOnly: true,
    });
    expect(parseCatalogQuery(serializeCatalogQuery(state))).toEqual(state);
  });

  it("ignores malformed values instead of failing", () => {
    expect(parseCatalogQuery({ sort: "cheapest", storage: "abc,-4", size: "huge" })).toMatchObject({
      sort: "featured",
      storage: [],
      sizes: [],
    });
  });
});

describe("local services", () => {
  it("returns copies, so callers cannot mutate the catalog", async () => {
    const product = await fetchProduct("iz-one-pro");
    product!.variants[0]!.priceCents = 1;
    expect((await fetchProduct("iz-one-pro"))!.variants[0]!.priceCents).not.toBe(1);
  });

  it("resolves an unknown slug to null", async () => {
    expect(await fetchProduct("does-not-exist")).toBeNull();
  });

  it("reports the total with the list", async () => {
    const result = await fetchProducts({ search: "iz" });
    expect(result.total).toBe(result.items.length);
  });

  it("prices a cart with the selected delivery option", async () => {
    const preview = await previewCart([{ productId: "p_one", variantId: "v_one_128_white", quantity: 2 }], "express");
    expect(preview.totals).toMatchObject({ subtotalCents: 169800, deliveryCents: 4900, totalCents: 174700 });
  });

  it("never pretends an order was created while the order service is not connected", async () => {
    const result = await submitOrder({
      items: [{ productId: "p_one", variantId: "v_one_128_white", quantity: 1 }],
      deliveryMethodId: "standard",
      address: {
        fullName: "Alex Morgan",
        email: "alex@example.com",
        phone: "+15550100123",
        country: "US",
        city: "Portland",
        street: "12 Example Street",
        postalCode: "97201",
        comment: "",
      },
    });
    expect(result.status).toBe("unavailable");
  });
});
