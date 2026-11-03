import type { OrderRequest, OrderSubmission } from "#shared/types";

export const ORDER_SERVICE_UNAVAILABLE_MESSAGE =
  "Ordering is not available yet. Checkout will open once the order service is connected. Nothing you entered was sent or saved.";

/**
 * Order placement — NOT CONNECTED.
 *
 * The storefront has no order service yet, so this deliberately does nothing with
 * the request: it is not sent anywhere, logged or stored. Replace the body with
 * `POST /orders` when the backend exists; the checkout page already handles both
 * outcomes of `OrderSubmission`.
 */
export async function submitOrder(_request: OrderRequest): Promise<OrderSubmission> {
  return { status: "unavailable", message: ORDER_SERVICE_UNAVAILABLE_MESSAGE };
}
