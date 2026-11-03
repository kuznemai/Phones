# Frontend → backend API contract

The storefront is frontend-only today. Every request it will eventually make goes
through one of the modules in `app/services/`, which currently answer from local data
(`app/data/`). This document lists what the backend has to provide so those modules can
be switched to HTTP without touching pages, components or stores.

TypeScript definitions for every payload live in [`shared/types/index.ts`](../shared/types/index.ts).
The local implementations in `app/utils/catalog.ts` and `app/utils/cart.ts` are the
reference behaviour (and are covered by unit tests in `tests/unit/`).

## Conventions

- **Money** is always an integer in minor units (cents); field names end in `Cents`.
  `currency` is an ISO-4217 code (`"USD"` today).
- **Dates** are ISO-8601 UTC strings.
- **Errors** use a `{ statusCode, statusMessage, data? }` body. For form validation return
  `422` with `data.fields = { <fieldName>: <message> }` so messages can be shown next to
  the matching inputs.

| Status | Expected frontend behaviour |
| --- | --- |
| `404` | Product page renders the 404 page |
| `409` | Inline message (for example "out of stock") |
| `422` | Field errors highlighted in the form |
| `5xx` | Error state with a "Try again" button (already present on catalog, cart and home) |

---

## Catalog — public

### `GET /products` → `fetchProducts(query)`

Query: `search?`, `sort?` (`featured` · `price-asc` · `price-desc` · `name`),
`storage?` (comma-separated GB), `color?` (comma-separated names), `size?`
(`compact` · `standard` · `large`), `stock?` (`1` = in stock only).

```jsonc
{ "items": ProductListItem[], "total": number }
```

`ProductListItem`: `{ id, slug, title, tagline, image, fromPriceCents, inStock,
displayInches, batteryMah, storageOptionsGb[], colors[{ name, hex }], badge? }`.
`fromPriceCents` is the cheapest variant **that matches the filters**.

### `GET /products?featured=1` → `fetchFeaturedProducts(limit)`

Same item shape; products flagged for the home page.

### `GET /products/facets` → `fetchCatalogFacets()`

`{ storage: number[], colors: [{ name, hex }], sizes: SizeClass[] }` — the values the
filter panel offers.

### `GET /products/:slug` → `fetchProduct(slug)`

A `Product`: list fields plus `description`, `highlights[]`, `images[]`,
`specs[] ({ label, value })` and `variants[]`. Unknown slug → `404`.

`ProductVariant`: `{ id, storageGb, color, colorHex, priceCents, stock }`. `stock` is a
number so the UI can show "only N left"; `0` disables ordering.

### `GET /catalog/delivery-options` → `fetchDeliveryOptions()`

`DeliveryOption[]`: `{ id: "standard" | "express" | "pickup", title, description,
priceCents, etaDaysMin, etaDaysMax }`. The options in `app/data/delivery.ts` are samples.

---

## Cart — public

### `POST /cart/preview` → `previewCart(items, deliveryMethodId?)`

The browser stores only ids and quantities (`localStorage["iz.cart.v1"]`); **every amount
comes from the server.**

Request: `{ items: [{ productId, variantId, quantity }], deliveryMethodId? }`

```jsonc
{
  "lines": [{ "productId", "variantId", "slug", "title", "variantLabel", "image",
              "unitPriceCents", "quantity", "lineTotalCents",
              "available": true, "maxQuantity": 10 }],
  "unavailableCount": 0,
  "itemCount": 1,
  "totals": { "currency": "USD", "subtotalCents", "deliveryCents", "totalCents" }
}
```

- Unknown products/variants are dropped; the client removes them from its stored cart.
- Quantities are clamped to `1…min(stock, 10)`; the client adopts the clamped value.
- Out-of-stock lines come back with `available: false` and `lineTotalCents: 0`; checkout
  stays disabled until they are removed.
- Delivery is charged only when the subtotal is above zero.

---

## Orders — not connected yet

### `POST /orders` → `submitOrder(request)`

Request (`OrderRequest`): `{ items: CartItemInput[], deliveryMethodId, address: ShippingAddress }`.

`ShippingAddress`: `{ fullName, email, phone, country, city, street, postalCode, comment }`.
The checkout validates these on the client (`app/utils/validation.ts`); the backend must
validate again and answer `422` with field messages.

Response (`OrderSubmission`): `{ status: "created", orderId }`. Today the local
implementation always returns `{ status: "unavailable", message }` and does not send,
log or store anything. The checkout page already handles both outcomes.

Payment is intentionally absent from the preview; it should be added together with the
order service (a hosted payment page or provider widget — card data must never pass
through this frontend).

## Support — not connected yet

### `POST /support/messages` → `sendSupportMessage(message)`

Request: `{ name, email, topic, message }`. Response: `{ status: "sent" }`. Today the local
implementation returns `{ status: "unavailable", message }` without sending anything.

---

## What the backend owns (the frontend must not be trusted)

- Prices, stock and delivery fees — the client only sends ids and quantities.
- Validation of contact and address data.
- Order numbers, order state and payment state.
