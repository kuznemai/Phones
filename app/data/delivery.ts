import type { DeliveryOption } from "#shared/types";

/**
 * SAMPLE DELIVERY OPTIONS, carried over from the project's original mock backend.
 *
 * They exist so the checkout demo can show how a delivery choice changes the total.
 * They are not published delivery terms — the order service will provide the real
 * options, prices and regions.
 */
export const deliveryOptions: DeliveryOption[] = [
  {
    id: "standard",
    title: "Standard delivery",
    description: "Tracked courier, signature on arrival.",
    priceCents: 1900,
    etaDaysMin: 3,
    etaDaysMax: 6,
  },
  {
    id: "express",
    title: "Express delivery",
    description: "Next business day in most cities.",
    priceCents: 4900,
    etaDaysMin: 1,
    etaDaysMax: 2,
  },
  {
    id: "pickup",
    title: "Pickup point",
    description: "Collect from a partner pickup point.",
    priceCents: 0,
    etaDaysMin: 2,
    etaDaysMax: 4,
  },
];
