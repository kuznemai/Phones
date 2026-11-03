import type { CartItemInput, CartPreview, DeliveryMethodId } from "#shared/types";
import { products } from "~/data/products";
import { deliveryOptions } from "~/data/delivery";
import { priceCart } from "~/utils/cart";

/**
 * Cart pricing — LOCAL IMPLEMENTATION.
 *
 * The browser keeps only ids and quantities; amounts always come from here. With a
 * backend this becomes `POST /cart/preview` so prices and stock are authoritative.
 */
export async function previewCart(items: CartItemInput[], deliveryMethodId?: DeliveryMethodId): Promise<CartPreview> {
  const delivery = deliveryOptions.find((option) => option.id === deliveryMethodId);
  return structuredClone(priceCart(products, items, delivery));
}
