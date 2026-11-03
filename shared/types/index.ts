/**
 * Domain types shared by the storefront and, later, the real backend.
 *
 * All money is expressed in integer minor units (cents) to avoid floating point
 * drift; the backend is expected to use the same representation.
 */

export type Currency = "USD";

/* ---------------------------------------------------------------- catalog */

export interface ProductVariant {
  id: string;
  storageGb: number;
  color: string;
  colorHex: string;
  priceCents: number;
  /** Units available; 0 means the configuration cannot be ordered. */
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  images: string[];
  specs: ProductSpec[];
  variants: ProductVariant[];
  /** Screen diagonal in inches — drives the size filter and card summary. */
  displayInches: number;
  batteryMah: number;
  /** Shown in the "Popular" block on the home page. */
  featured?: boolean;
  badge?: string;
}

/** Catalog list item — the trimmed shape a product grid needs. */
export interface ProductListItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  image: string;
  fromPriceCents: number;
  inStock: boolean;
  displayInches: number;
  batteryMah: number;
  storageOptionsGb: number[];
  colors: { name: string; hex: string }[];
  badge?: string;
}

export type ProductSort = "featured" | "price-asc" | "price-desc" | "name";
export type SizeClass = "compact" | "standard" | "large";

export interface ProductQuery {
  search?: string;
  sort?: ProductSort;
  storage?: number[];
  colors?: string[];
  sizes?: SizeClass[];
  inStockOnly?: boolean;
}

/** The filter part of a query, with every field present (what the filter panel edits). */
export type CatalogFilters = Required<Pick<ProductQuery, "storage" | "colors" | "sizes" | "inStockOnly">>;

export interface ProductListResult {
  items: ProductListItem[];
  total: number;
}

/** Values the catalog filters can offer, derived from the whole catalog. */
export interface CatalogFacets {
  storage: number[];
  colors: { name: string; hex: string }[];
  sizes: SizeClass[];
}

/* ------------------------------------------------------------------- cart */

/** What the browser persists. Prices are always re-derived from the catalog. */
export interface CartItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartLine {
  productId: string;
  variantId: string;
  slug: string;
  title: string;
  variantLabel: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
  /** false when the configuration is out of stock. */
  available: boolean;
  maxQuantity: number;
}

export interface CartTotals {
  currency: Currency;
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
}

export interface CartPreview {
  lines: CartLine[];
  totals: CartTotals;
  unavailableCount: number;
  itemCount: number;
}

/* --------------------------------------------------------------- delivery */

export type DeliveryMethodId = "standard" | "express" | "pickup";

export interface DeliveryOption {
  id: DeliveryMethodId;
  title: string;
  description: string;
  priceCents: number;
  etaDaysMin: number;
  etaDaysMax: number;
}

/* --------------------------------------------------------------- checkout */

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  comment: string;
}

export interface OrderRequest {
  items: CartItemInput[];
  deliveryMethodId: DeliveryMethodId;
  address: ShippingAddress;
}

/**
 * Result of handing an order to the order service. Until that service exists the
 * storefront always gets `unavailable` back and never stores what was entered.
 */
export type OrderSubmission = { status: "unavailable"; message: string } | { status: "created"; orderId: string };
