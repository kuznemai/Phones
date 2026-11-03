<script setup lang="ts">
import { OS_FEATURES } from "~/data/os";
import { DEMO_NOTICE, SITE } from "~/data/site";
import { fetchDeliveryOptions, fetchProduct, fetchProducts } from "~/services/catalog";
import { useCartStore } from "~/stores/cart";
import { useFavoritesStore } from "~/stores/favorites";
import { variantLabel } from "~/utils/catalog";
import { MAX_QUANTITY_PER_LINE } from "~/utils/cart";
import { formatEta, formatPrice } from "~/utils/format";

const route = useRoute();
const cart = useCartStore();
const favorites = useFavoritesStore();

const slug = computed(() => String(route.params.slug));

const { data: product } = await useAsyncData(`product-${slug.value}`, () => fetchProduct(slug.value), {
  watch: [slug],
});

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: "Product not found", fatal: true });
}

const [{ data: deliveryOptions }, { data: related }] = await Promise.all([
  useAsyncData("delivery-options", fetchDeliveryOptions, { default: () => [] }),
  useAsyncData(
    `related-${slug.value}`,
    async () => (await fetchProducts()).items.filter((item) => item.slug !== slug.value).slice(0, 3),
    { default: () => [], watch: [slug] },
  ),
]);

function defaultVariantId(): string {
  const variants = product.value?.variants ?? [];
  return variants.find((variant) => variant.stock > 0)?.id ?? variants[0]?.id ?? "";
}

const selectedVariantId = ref(defaultVariantId());
const quantity = ref(1);

// A different product arrives when navigating between product pages.
watch(product, () => {
  selectedVariantId.value = defaultVariantId();
  quantity.value = 1;
});

const selectedVariant = computed(() =>
  product.value?.variants.find((variant) => variant.id === selectedVariantId.value),
);

// The cart lives in localStorage; read it only after hydration so the server and
// client render the same button.
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const inCartQuantity = computed(() =>
  product.value && isMounted.value ? cart.quantityOf(product.value.id, selectedVariantId.value) : 0,
);

/** How many more of this configuration can still go into the cart. */
const addableQuantity = computed(() => {
  const stock = selectedVariant.value?.stock ?? 0;
  return Math.max(0, Math.min(stock, MAX_QUANTITY_PER_LINE) - inCartQuantity.value);
});

watch(addableQuantity, (max) => {
  quantity.value = Math.min(Math.max(quantity.value, 1), Math.max(max, 1));
});

const isSaved = computed(() => (product.value ? favorites.has(product.value.id) : false));
const osSpec = computed(() => product.value?.specs.find((spec) => spec.label === "OS")?.value);
const keyOsFeatures = OS_FEATURES.slice(0, 4);

const addedMessage = ref("");
let addedTimer: ReturnType<typeof setTimeout> | undefined;

function addToCart(): void {
  if (!product.value || !selectedVariant.value || addableQuantity.value <= 0) return;
  const amount = Math.min(quantity.value, addableQuantity.value);
  cart.add(product.value.id, selectedVariant.value.id, amount);
  addedMessage.value = `Added ${amount} × ${product.value.title}, ${variantLabel(selectedVariant.value)} to your cart.`;
  quantity.value = 1;
  clearTimeout(addedTimer);
  addedTimer = setTimeout(() => {
    addedMessage.value = "";
  }, 6000);
}

onBeforeUnmount(() => clearTimeout(addedTimer));

const addButtonLabel = computed(() => {
  if ((selectedVariant.value?.stock ?? 0) <= 0) return "Out of stock";
  if (addableQuantity.value <= 0) return "Maximum quantity in cart";
  return "Add to cart";
});

useSeo({
  title: `${product.value.title} — ${product.value.tagline}`,
  description: `${product.value.tagline}. ${product.value.highlights.slice(0, 2).join(". ")}. Runs IZ OS with verified boot and encrypted storage.`,
  image: product.value.images[0],
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.value.title,
        description: product.value.description,
        brand: { "@type": "Brand", name: SITE.name },
        image: product.value.images.map((image) => `${useRuntimeConfig().public.siteUrl.replace(/\/$/, "")}${image}`),
      }),
    },
  ],
});
</script>

<template>
  <div v-if="product" class="iz-wrap iz-page">
    <nav aria-label="Breadcrumb" class="crumbs">
      <ol>
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/shop">Catalog</NuxtLink></li>
        <li><span aria-current="page">{{ product.title }}</span></li>
      </ol>
    </nav>

    <div class="product">
      <ProductGallery :images="product.images" :title="product.title" />

      <div class="product__info">
        <div>
          <p class="iz-eyebrow">{{ product.badge ?? "IZ OS smartphone" }}</p>
          <h1 class="iz-h1 mt-2">{{ product.title }}</h1>
          <p class="product__tagline">{{ product.tagline }}</p>
          <p class="product__description">{{ product.description }}</p>
        </div>

        <ul class="product__highlights">
          <li v-for="highlight in product.highlights" :key="highlight">
            <UiIcon name="check" />
            {{ highlight }}
          </li>
        </ul>

        <ProductConfigurator v-model="selectedVariantId" :variants="product.variants" />

        <div class="buy">
          <div class="buy__row">
            <div>
              <span class="iz-label">Price</span>
              <p class="buy__price" data-testid="product-price">{{ formatPrice(selectedVariant?.priceCents) }}</p>
              <p class="buy__note">Sample price for this preview</p>
            </div>

            <ClientOnly>
              <button
                type="button"
                class="iz-btn iz-btn--ghost"
                :aria-pressed="isSaved"
                @click="favorites.toggle(product.id)"
              >
                <svg viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" aria-hidden="true">
                  <path
                    d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ isSaved ? "Saved" : "Save" }}
              </button>
            </ClientOnly>
          </div>

          <div class="buy__actions">
            <ClientOnly>
              <UiQuantityStepper
                v-if="addableQuantity > 0"
                v-model="quantity"
                :max="addableQuantity"
                label="Quantity"
              />
            </ClientOnly>
            <button
              type="button"
              class="iz-btn iz-btn--solid buy__add"
              :disabled="addableQuantity <= 0"
              data-testid="add-to-cart"
              @click="addToCart"
            >
              {{ addButtonLabel }}
            </button>
          </div>

          <div class="buy__status" role="status" aria-live="polite">
            <p v-if="addedMessage" class="buy__added">
              <UiIcon name="check" />
              <span>{{ addedMessage }}</span>
            </p>
          </div>
          <ClientOnly>
            <NuxtLink v-if="inCartQuantity > 0" to="/cart" class="iz-link buy__cart-link" data-testid="go-to-cart">
              {{ inCartQuantity }} in your cart · View cart
            </NuxtLink>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="details">
      <section class="details__specs iz-reveal" aria-labelledby="specs-heading">
        <h2 id="specs-heading" class="details__title">Specifications</h2>
        <dl class="specs">
          <div v-for="spec in product.specs" :key="spec.label">
            <dt>{{ spec.label }}</dt>
            <dd>{{ spec.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="details__os iz-card iz-reveal" aria-labelledby="os-heading">
        <h2 id="os-heading" class="details__title">IZ OS on this device</h2>
        <p v-if="osSpec" class="details__os-version">{{ osSpec }}</p>
        <ul class="os-list">
          <li v-for="feature in keyOsFeatures" :key="feature.title">
            <UiIcon :name="feature.icon" class="iz-card__icon" />
            <div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.text }}</p>
            </div>
          </li>
        </ul>
        <NuxtLink to="/security" class="iz-btn iz-btn--ghost mt-6">
          How IZ OS protects you
          <UiIcon name="arrow" />
        </NuxtLink>
      </section>
    </div>

    <section class="terms iz-reveal" aria-labelledby="terms-heading">
      <h2 id="terms-heading" class="details__title">Box, delivery and warranty</h2>
      <div class="terms__grid">
        <article class="iz-card">
          <UiIcon name="box" class="iz-card__icon" />
          <h3 class="iz-card__title">In the box</h3>
          <p class="iz-card__text">
            The final contents of the box have not been confirmed yet. They will be listed here before sales open.
          </p>
        </article>

        <article class="iz-card">
          <UiIcon name="truck" class="iz-card__icon" />
          <h3 class="iz-card__title">Delivery</h3>
          <p class="iz-card__text">
            Delivery terms have not been published yet. The checkout preview uses these sample options to show how
            delivery affects the total:
          </p>
          <ul class="terms__list">
            <li v-for="option in deliveryOptions" :key="option.id">
              <span>{{ option.title }}</span>
              <span>{{ option.priceCents > 0 ? formatPrice(option.priceCents) : "Free" }} · {{ formatEta(option.etaDaysMin, option.etaDaysMax) }}</span>
            </li>
          </ul>
        </article>

        <article class="iz-card">
          <UiIcon name="badge" class="iz-card__icon" />
          <h3 class="iz-card__title">Warranty and support</h3>
          <p class="iz-card__text">
            Hardware warranty terms have not been published yet.
            <template v-if="osSpec">Software support listed for this model: {{ osSpec }}.</template>
          </p>
        </article>
      </div>
      <p class="terms__demo">{{ DEMO_NOTICE.catalog }}</p>
    </section>

    <section v-if="related.length" class="related iz-reveal" aria-labelledby="related-heading">
      <div class="related__head">
        <h2 id="related-heading" class="details__title">Other IZ devices</h2>
        <NuxtLink to="/shop" class="iz-link">See the full catalog</NuxtLink>
      </div>
      <ProductGrid :products="related" stretch />
    </section>
  </div>
</template>

<style scoped>
.crumbs ol {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: clamp(1.25rem, 2.5vw, 2rem);
  color: var(--iz-muted);
  font-size: 0.85rem;
}

.crumbs li + li::before {
  content: "/";
  margin-right: 0.5rem;
  color: var(--iz-faint);
}

.crumbs a:hover {
  color: #fff;
}

.crumbs [aria-current] {
  color: #dfe8f2;
}

.product {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(2rem, 4.5vw, 4.5rem);
}

.product > :first-child {
  position: sticky;
  top: 6rem;
}

.product__info {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.product__tagline {
  margin-top: 0.5rem;
  color: #dfe8f2;
  font-size: 1.05rem;
}

.product__description {
  max-width: 60ch;
  margin-top: 1rem;
  color: var(--iz-muted);
  font-weight: 300;
  line-height: 1.75;
}

.product__highlights {
  display: grid;
  gap: 0.6rem;
}

.product__highlights li {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  color: #d3dde8;
  font-size: 0.92rem;
}

.product__highlights svg {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
  color: var(--iz-accent);
}

.buy {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--iz-border-soft);
}

.buy__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.buy__price {
  color: #fff;
  font-size: clamp(1.8rem, 2.6vw, 2.2rem);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.buy__note {
  margin-top: 0.2rem;
  color: var(--iz-faint);
  font-size: 0.78rem;
}

.buy__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.buy__add {
  flex: 1 1 12rem;
}

.buy__status {
  min-height: 0;
}

.buy__added {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--iz-success);
  font-size: 0.9rem;
}

.buy__added svg {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.buy__cart-link {
  align-self: flex-start;
  font-size: 0.9rem;
}

.details {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: start;
  gap: clamp(1.5rem, 3.5vw, 3.5rem);
  margin-top: clamp(3rem, 6vw, 5rem);
}

.details__title {
  color: #fff;
  font-size: clamp(1.25rem, 1.8vw, 1.55rem);
  font-weight: 600;
}

.specs {
  margin-top: 1.25rem;
  border-top: 1px solid var(--iz-border-soft);
}

.specs div {
  display: grid;
  grid-template-columns: 9.5rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 0.85rem;
  border-bottom: 1px solid var(--iz-border-soft);
  font-size: 0.92rem;
}

.specs dt {
  color: var(--iz-muted);
}

.specs dd {
  color: #e7eef6;
}

.details__os-version {
  margin-top: 0.4rem;
  color: var(--iz-accent);
  font-size: 0.9rem;
}

.os-list {
  display: grid;
  gap: 1.1rem;
  margin-top: 1.25rem;
}

.os-list li {
  display: flex;
  gap: 0.9rem;
}

.os-list .iz-card__icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.os-list h3 {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
}

.os-list p {
  margin-top: 0.25rem;
  color: var(--iz-muted);
  font-size: 0.86rem;
  font-weight: 300;
  line-height: 1.6;
}

.terms {
  margin-top: clamp(3rem, 6vw, 5rem);
}

.terms__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.25rem;
}

.terms__list {
  display: grid;
  gap: 0.4rem;
  margin-top: 0.85rem;
  font-size: 0.84rem;
}

.terms__list li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  color: #d3dde8;
}

.terms__list li span:last-child {
  color: var(--iz-muted);
  font-variant-numeric: tabular-nums;
}

.terms__demo {
  margin-top: 1rem;
  color: var(--iz-faint);
  font-size: 0.8rem;
}

.related {
  margin-top: clamp(3rem, 6vw, 5rem);
}

.related__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
}

@media (max-width: 1023px) {
  .product,
  .details {
    grid-template-columns: minmax(0, 1fr);
  }

  .product > :first-child {
    position: static;
  }

  .terms__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 480px) {
  .specs div {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.2rem;
  }
}
</style>
