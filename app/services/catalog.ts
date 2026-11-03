import type {
  CatalogFacets,
  DeliveryOption,
  Product,
  ProductListItem,
  ProductListResult,
  ProductQuery,
} from "#shared/types";
import { products } from "~/data/products";
import { deliveryOptions } from "~/data/delivery";
import { catalogFacets, queryProducts, toListItem } from "~/utils/catalog";

/**
 * Catalog data access — LOCAL IMPLEMENTATION.
 *
 * Every function is async and returns plain copies, exactly like an HTTP client
 * would, so pages and stores never touch `app/data` directly. To switch to the real
 * backend, replace each body with a request (see the README and
 * docs/api-contract.md); the signatures are the contract and callers do not change.
 */

const copy = <T>(value: T): T => structuredClone(value);

/** GET /products?search=&sort=&storage=&color=&size=&stock= */
export async function fetchProducts(query: ProductQuery = {}): Promise<ProductListResult> {
  const items = queryProducts(products, query);
  return copy({ items, total: items.length });
}

/** GET /products/:slug — resolves to null when the product does not exist (HTTP 404). */
export async function fetchProduct(slug: string): Promise<Product | null> {
  const product = products.find((candidate) => candidate.slug === slug);
  return product ? copy(product) : null;
}

/** GET /products?featured=1 */
export async function fetchFeaturedProducts(limit = 3): Promise<ProductListItem[]> {
  return copy(products.filter((product) => product.featured).slice(0, limit).map((product) => toListItem(product)));
}

/** GET /products/facets */
export async function fetchCatalogFacets(): Promise<CatalogFacets> {
  return copy(catalogFacets(products));
}

/** GET /catalog/delivery-options */
export async function fetchDeliveryOptions(): Promise<DeliveryOption[]> {
  return copy(deliveryOptions);
}
