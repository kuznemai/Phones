import type {
  CatalogFacets,
  Product,
  ProductListItem,
  ProductQuery,
  ProductSort,
  ProductVariant,
  SizeClass,
} from "#shared/types";

/**
 * Pure catalog logic: filtering, sorting and list shaping. It runs in the local
 * service today and is the reference behaviour the real `GET /products` should match.
 */

export const PRODUCT_SORTS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

export const SIZE_CLASSES: { value: SizeClass; label: string; hint: string }[] = [
  { value: "compact", label: "Compact", hint: "under 6.2″" },
  { value: "standard", label: "Standard", hint: "6.2–6.4″" },
  { value: "large", label: "Large", hint: "6.5″ and up" },
];

export function sizeClassOf(displayInches: number): SizeClass {
  if (displayInches < 6.2) return "compact";
  if (displayInches < 6.5) return "standard";
  return "large";
}

export function variantLabel(variant: Pick<ProductVariant, "storageGb" | "color">): string {
  return `${variant.storageGb} GB · ${variant.color}`;
}

function uniqueColors(variants: ProductVariant[]): { name: string; hex: string }[] {
  const seen = new Map<string, string>();
  for (const variant of variants) {
    if (!seen.has(variant.color)) seen.set(variant.color, variant.colorHex);
  }
  return [...seen].map(([name, hex]) => ({ name, hex }));
}

/**
 * `matching` narrows the "from" price to the variants that passed the filters, so a
 * shopper filtering for 512 GB sees what 512 GB costs, not the base model.
 */
export function toListItem(product: Product, matching: ProductVariant[] = product.variants): ProductListItem {
  const priced = matching.length > 0 ? matching : product.variants;
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    tagline: product.tagline,
    image: product.images[0] ?? "",
    fromPriceCents: Math.min(...priced.map((variant) => variant.priceCents)),
    inStock: product.variants.some((variant) => variant.stock > 0),
    displayInches: product.displayInches,
    batteryMah: product.batteryMah,
    storageOptionsGb: [...new Set(product.variants.map((variant) => variant.storageGb))].sort((a, b) => a - b),
    colors: uniqueColors(product.variants),
    badge: product.badge,
  };
}

function searchableText(product: Product): string {
  return [
    product.title,
    product.tagline,
    product.description,
    ...product.highlights,
    ...product.specs.map((spec) => spec.value),
    ...product.variants.map((variant) => `${variant.color} ${variant.storageGb}gb ${variant.storageGb} gb`),
  ]
    .join(" ")
    .toLowerCase();
}

function matchesSearch(product: Product, search: string): boolean {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = searchableText(product);
  return terms.every((term) => haystack.includes(term));
}

function matchingVariants(product: Product, query: ProductQuery): ProductVariant[] {
  return product.variants.filter(
    (variant) =>
      (!query.storage?.length || query.storage.includes(variant.storageGb)) &&
      (!query.colors?.length || query.colors.includes(variant.color)) &&
      (!query.inStockOnly || variant.stock > 0),
  );
}

export function queryProducts(products: Product[], query: ProductQuery = {}): ProductListItem[] {
  const featuredRank = new Map(products.map((product, index) => [product.id, (product.featured ? 0 : 1000) + index]));

  const items = products.flatMap((product) => {
    if (query.search && !matchesSearch(product, query.search)) return [];
    if (query.sizes?.length && !query.sizes.includes(sizeClassOf(product.displayInches))) return [];
    const variants = matchingVariants(product, query);
    return variants.length > 0 ? [toListItem(product, variants)] : [];
  });

  const byName = (a: ProductListItem, b: ProductListItem) => a.title.localeCompare(b.title, "en");

  switch (query.sort ?? "featured") {
    case "price-asc":
      return items.sort((a, b) => a.fromPriceCents - b.fromPriceCents || byName(a, b));
    case "price-desc":
      return items.sort((a, b) => b.fromPriceCents - a.fromPriceCents || byName(a, b));
    case "name":
      return items.sort(byName);
    default:
      return items.sort((a, b) => featuredRank.get(a.id)! - featuredRank.get(b.id)!);
  }
}

export function catalogFacets(products: Product[]): CatalogFacets {
  const variants = products.flatMap((product) => product.variants);
  const sizes = new Set(products.map((product) => sizeClassOf(product.displayInches)));
  return {
    storage: [...new Set(variants.map((variant) => variant.storageGb))].sort((a, b) => a - b),
    colors: uniqueColors(variants),
    sizes: SIZE_CLASSES.map((size) => size.value).filter((size) => sizes.has(size)),
  };
}

/* ------------------------------------------------------- URL <-> query */

type RouteQueryValue = string | null | (string | null)[] | undefined;

function asList(value: RouteQueryValue): string[] {
  const raw = Array.isArray(value) ? value : [value];
  return raw.flatMap((entry) => (typeof entry === "string" ? entry.split(",") : [])).filter(Boolean);
}

/** Reads catalog state from the URL, ignoring anything malformed. */
export function parseCatalogQuery(query: Record<string, RouteQueryValue>): Required<ProductQuery> {
  const sort = asList(query.sort)[0] as ProductSort | undefined;
  const sizes = asList(query.size).filter((size): size is SizeClass =>
    SIZE_CLASSES.some((option) => option.value === size),
  );
  return {
    search: (asList(query.q)[0] ?? "").slice(0, 80),
    sort: PRODUCT_SORTS.some((option) => option.value === sort) ? sort! : "featured",
    storage: asList(query.storage)
      .map(Number)
      .filter((value) => Number.isInteger(value) && value > 0),
    colors: asList(query.color),
    sizes,
    inStockOnly: asList(query.stock)[0] === "1",
  };
}

/** Inverse of `parseCatalogQuery`; defaults are left out to keep URLs short. */
export function serializeCatalogQuery(query: ProductQuery): Record<string, string> {
  const out: Record<string, string> = {};
  if (query.search?.trim()) out.q = query.search.trim();
  if (query.sort && query.sort !== "featured") out.sort = query.sort;
  if (query.storage?.length) out.storage = query.storage.join(",");
  if (query.colors?.length) out.color = query.colors.join(",");
  if (query.sizes?.length) out.size = query.sizes.join(",");
  if (query.inStockOnly) out.stock = "1";
  return out;
}
