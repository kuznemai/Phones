# IZ Secure — storefront

Nuxt 4 storefront for IZ smartphones running IZ OS, a privacy-focused operating system:
home page, catalog with search and filters, product configuration, a persistent cart,
a checkout preview and information pages (About, Security & OS, FAQ, Contact).

**This is a frontend-only build.** There is no server API, database, authentication or
payment integration. Products, prices and stock are sample data, the cart lives in the
browser's `localStorage`, and the checkout is a clearly marked demo: it validates the form
but never sends or stores what was entered and never reports an order as placed.

## Getting started

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

The store runs on http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build into `.output` (`node .output/server/index.mjs` to run it) |
| `npm run generate` | Fully static site into `.output/public` (no server needed) |
| `npm run preview:static` | Serve the generated static site locally |
| `npm run lint` | ESLint (`npm run lint:fix` to fix) |
| `npm run typecheck` | `vue-tsc` over the app and shared code |
| `npm test` | Vitest unit tests (cart, pricing, catalog query, validation) |
| `npm run test:e2e` | Playwright against a production build, desktop + mobile |

`npm run test:e2e` drives the Chrome installed on the machine (`channel: "chrome"`), so
no separate Playwright browser download is needed.

## Project structure

```
app/
  data/          ← sample content: products, delivery options, OS features, FAQ, site copy
  services/      ← data-access layer (local today, HTTP later): catalog, cart, orders, support
  utils/         pure logic: catalog query/filters, cart pricing + storage sanitising,
                 validation, formatting, safe localStorage access
  stores/        Pinia: cart (ids + quantities), favorites
  composables/   useCartPreview (priced cart), useSeo (title/description/OG/canonical)
  components/    landing/, product/, cart/, ui/ (Icon, SafeImage, FormField, Notice, …)
  pages/         file-based routes
  plugins/       persistence.client — restores and saves cart/favorites, syncs tabs
shared/types/    domain types — the contract with the future backend
docs/            api-contract.md — endpoints the backend must provide
tests/unit/      Vitest
tests/e2e/       Playwright
public/          images (products in public/products/)
```

## Routes

| Path | Notes |
| --- | --- |
| `/` | Home: hero, popular devices, OS advantages, privacy, FAQ |
| `/shop` | Catalog — search, sort, storage/colour/size/stock filters; state lives in the URL |
| `/product/[slug]` | Gallery, storage/colour selection, specs, IZ OS, box/delivery/warranty |
| `/cart` | Quantities, removal, totals; saved in `localStorage` |
| `/checkout` | Demo checkout: contact + address validation, order summary, no order placed |
| `/favorites` | Saved devices (browser-local) |
| `/about`, `/security`, `/faq`, `/contact` | Information pages |
| `/offer` | Old URL, redirects to `/security` |

## Where the product data lives

- `app/data/products.ts` — the catalog. **All models, specs, prices and stock levels are
  sample data** carried over from the earlier mock backend. Edit or replace this file to
  change what the store shows; images go in `public/products/`.
- `app/data/delivery.ts` — sample delivery options used by the checkout preview.
- `app/data/os.ts` — IZ OS capabilities and their honest limits, taken from the project's
  existing copy. Do not add claims here that the product team has not confirmed.
- `app/data/faq.ts`, `app/data/site.ts` — FAQ entries, brand copy and demo notices.

Contact details, warranty terms, box contents and legal documents have not been provided,
so the site says they will be published later instead of inventing them.

## Connecting the API

Pages, components and stores never read `app/data` directly — they call the async
functions in `app/services/`. Each function documents the endpoint it stands in for, and
[`docs/api-contract.md`](docs/api-contract.md) describes every request and response.

| Service | Functions | Endpoint |
| --- | --- | --- |
| `services/catalog.ts` | `fetchProducts`, `fetchProduct`, `fetchFeaturedProducts`, `fetchCatalogFacets`, `fetchDeliveryOptions` | `GET /products…`, `GET /catalog/delivery-options` |
| `services/cart.ts` | `previewCart` | `POST /cart/preview` |
| `services/orders.ts` | `submitOrder` | `POST /orders` (not connected — returns `unavailable`) |
| `services/support.ts` | `sendSupportMessage` | `POST /support/messages` (not connected) |

To switch a service to the real backend:

1. Set the base URL — `NUXT_PUBLIC_API_BASE=https://api.example.com` (see `.env.example`;
   it is exposed as `useRuntimeConfig().public.apiBase`).
2. Replace the function body with a request and keep the signature, for example:

   ```ts
   export async function fetchProduct(slug: string): Promise<Product | null> {
     const { apiBase } = useRuntimeConfig().public;
     try {
       return await $fetch<Product>(`/products/${slug}`, { baseURL: apiBase });
     } catch (error) {
       if ((error as { statusCode?: number }).statusCode === 404) return null;
       throw error;
     }
   }
   ```

3. Once `submitOrder` returns `{ status: "created" }`, update the checkout copy and the
   demo notices in `app/data/site.ts`, then add payment through the provider's hosted flow.

The cart keeps storing only ids and quantities, so prices and stock always come from
`previewCart` — no change to the cart store is needed.

Never put secrets in `NUXT_PUBLIC_*` variables: they are shipped to the browser.

## Deployment

Live preview: https://kuznemai.github.io/Phones/ — deployed by
`.github/workflows/pages.yml` on every push to `main` (and to `feature/storefront`
while that branch is under review). Pages must be set to **Source: GitHub Actions**.

The site has no server-side logic, so either output works:

- `npm run generate` → static files in `.output/public` (GitHub Pages, any static host).
  For a sub-path such as `/Phones/`, build with `NUXT_APP_BASE_URL=/Phones/`.
- `npm run build` → Node server in `.output`, run with `node .output/server/index.mjs`.

Set `NUXT_PUBLIC_SITE_URL` to the public URL so canonical and Open Graph links are absolute.
