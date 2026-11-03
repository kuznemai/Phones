<script setup lang="ts">
import type { DeliveryMethodId, ShippingAddress } from "#shared/types";
import { useCartPreview } from "~/composables/useCartPreview";
import { fetchDeliveryOptions } from "~/services/catalog";
import { submitOrder } from "~/services/orders";
import { useCartStore } from "~/stores/cart";
import { formatEta, formatPrice } from "~/utils/format";
import type { CheckoutErrors, CheckoutField } from "~/utils/validation";
import { COMMENT_MAX_LENGTH, validateCheckout, validateCheckoutField } from "~/utils/validation";

const cart = useCartStore();

// Form state lives in memory only: it is never written to storage or sent anywhere.
const emptyAddress = (): ShippingAddress => ({
  fullName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  street: "",
  postalCode: "",
  comment: "",
});

const form = reactive<ShippingAddress>(emptyAddress());
const errors = ref<CheckoutErrors>({});
const touched = ref(new Set<CheckoutField>());
const submitAttempted = ref(false);
const result = ref<string | null>(null);
const isSubmitting = ref(false);

const deliveryMethodId = ref<DeliveryMethodId>("standard");
const { data: deliveryOptions } = useAsyncData("delivery-options", fetchDeliveryOptions, { default: () => [] });
const { preview, isLoading } = useCartPreview(deliveryMethodId);

const canCheckout = computed(() => preview.value.itemCount > 0 && preview.value.unavailableCount === 0);

const FIELD_LABELS: Record<CheckoutField, string> = {
  fullName: "Full name",
  email: "Email",
  phone: "Phone",
  country: "Country",
  city: "City",
  street: "Street address",
  postalCode: "Postal code",
  comment: "Delivery note",
};

const errorList = computed(() =>
  (Object.keys(FIELD_LABELS) as CheckoutField[])
    .filter((field) => errors.value[field])
    .map((field) => ({ field, label: FIELD_LABELS[field], message: errors.value[field]! })),
);

function fieldId(field: CheckoutField): string {
  return `checkout-${field}`;
}

function validateField(field: CheckoutField): void {
  errors.value = { ...errors.value, [field]: validateCheckoutField(field, form[field]) };
}

function onBlur(field: CheckoutField): void {
  touched.value.add(field);
  validateField(field);
}

// Once a field has been checked, re-check it as the shopper fixes it.
watch(
  () => ({ ...form }),
  (next, previous) => {
    result.value = null;
    for (const field of Object.keys(next) as CheckoutField[]) {
      if (next[field] !== previous[field] && (touched.value.has(field) || submitAttempted.value)) validateField(field);
    }
  },
);

const summaryRef = ref<HTMLElement | null>(null);
const resultRef = ref<HTMLElement | null>(null);

async function submit(): Promise<void> {
  submitAttempted.value = true;
  result.value = null;
  errors.value = validateCheckout(form);

  if (errorList.value.length > 0) {
    await nextTick();
    summaryRef.value?.focus();
    return;
  }

  isSubmitting.value = true;
  try {
    const submission = await submitOrder({ items: cart.items, deliveryMethodId: deliveryMethodId.value, address: { ...form } });
    // A connected order service would return `created`; today it is always unavailable.
    result.value =
      submission.status === "unavailable" ? submission.message : "Your order was received by the order service.";
  } finally {
    isSubmitting.value = false;
  }
  await nextTick();
  resultRef.value?.focus();
}

function resetForm(): void {
  Object.assign(form, emptyAddress());
  errors.value = {};
  touched.value = new Set();
  submitAttempted.value = false;
  result.value = null;
}

function focusField(field: CheckoutField): void {
  document.getElementById(fieldId(field))?.focus();
}

useSeo({
  title: "Checkout preview",
  description: "A preview of the IZ Secure checkout. Ordering opens once the order service is connected.",
});

useHead({ meta: [{ name: "robots", content: "noindex" }] });
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <UiPageHeader eyebrow="Checkout" title="Checkout preview" />

    <UiNotice class="mb-8" data-testid="demo-notice">
      <p><strong class="font-medium text-white">This is a demo checkout.</strong> Ordering is not available yet; it will open once the order service is connected.</p>
      <p class="mt-1">
        You can fill in and check the form, but nothing you enter is sent or saved, and no order or payment is created.
      </p>
    </UiNotice>

    <ClientOnly>
      <template #fallback>
        <div class="iz-shimmer h-60 rounded-2xl" aria-hidden="true" />
      </template>

      <UiStateBlock
        v-if="cart.isEmpty"
        title="Your cart is empty"
        description="Add a device to your cart before opening the checkout preview."
      >
        <NuxtLink to="/shop" class="iz-btn iz-btn--solid">Browse the catalog</NuxtLink>
      </UiStateBlock>

      <div v-else class="checkout">
        <form class="checkout__form" novalidate aria-labelledby="form-title" @submit.prevent="submit">
          <h2 id="form-title" class="sr-only">Contact and delivery details</h2>

          <div
            v-if="submitAttempted && errorList.length"
            ref="summaryRef"
            class="error-summary"
            role="alert"
            tabindex="-1"
            data-testid="error-summary"
          >
            <h3>Please check {{ errorList.length === 1 ? "1 field" : `${errorList.length} fields` }}</h3>
            <ul>
              <li v-for="item in errorList" :key="item.field">
                <a :href="`#${fieldId(item.field)}`" @click.prevent="focusField(item.field)">
                  {{ item.label }}: {{ item.message }}
                </a>
              </li>
            </ul>
          </div>

          <fieldset class="checkout__section">
            <legend class="checkout__legend">Contact details</legend>
            <div class="checkout__grid">
              <UiFormField
                :id="fieldId('fullName')"
                v-model="form.fullName"
                class="checkout__full"
                label="Full name"
                autocomplete="name"
                :maxlength="100"
                :error="errors.fullName"
                required
                @blur="onBlur('fullName')"
              />
              <UiFormField
                :id="fieldId('email')"
                v-model="form.email"
                label="Email"
                type="email"
                inputmode="email"
                autocomplete="email"
                :maxlength="120"
                :error="errors.email"
                required
                @blur="onBlur('email')"
              />
              <UiFormField
                :id="fieldId('phone')"
                v-model="form.phone"
                label="Phone"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                hint="Include the country code, for example +1 555 010 0123."
                :maxlength="24"
                :error="errors.phone"
                required
                @blur="onBlur('phone')"
              />
            </div>
          </fieldset>

          <fieldset class="checkout__section">
            <legend class="checkout__legend">Delivery address</legend>
            <div class="checkout__grid">
              <UiFormField
                :id="fieldId('country')"
                v-model="form.country"
                label="Country"
                autocomplete="country-name"
                :maxlength="60"
                :error="errors.country"
                required
                @blur="onBlur('country')"
              />
              <UiFormField
                :id="fieldId('city')"
                v-model="form.city"
                label="City"
                autocomplete="address-level2"
                :maxlength="80"
                :error="errors.city"
                required
                @blur="onBlur('city')"
              />
              <UiFormField
                :id="fieldId('street')"
                v-model="form.street"
                class="checkout__full"
                label="Street address"
                autocomplete="street-address"
                placeholder="Street, building, apartment"
                :maxlength="150"
                :error="errors.street"
                required
                @blur="onBlur('street')"
              />
              <UiFormField
                :id="fieldId('postalCode')"
                v-model="form.postalCode"
                label="Postal code"
                autocomplete="postal-code"
                :maxlength="10"
                :error="errors.postalCode"
                required
                @blur="onBlur('postalCode')"
              />
              <UiFormField
                :id="fieldId('comment')"
                v-model="form.comment"
                class="checkout__full"
                label="Delivery note"
                multiline
                :maxlength="COMMENT_MAX_LENGTH"
                :hint="`Up to ${COMMENT_MAX_LENGTH} characters.`"
                :error="errors.comment"
                @blur="onBlur('comment')"
              />
            </div>
          </fieldset>

          <fieldset class="checkout__section">
            <legend class="checkout__legend">Delivery method</legend>
            <p class="checkout__hint">Sample options that show how delivery changes the total. Final terms are not published yet.</p>
            <div class="delivery">
              <label v-for="option in deliveryOptions" :key="option.id" class="delivery__option">
                <input v-model="deliveryMethodId" type="radio" name="delivery" :value="option.id" class="delivery__radio">
                <span class="delivery__body">
                  <span class="delivery__title">{{ option.title }}</span>
                  <span class="delivery__text">{{ option.description }} {{ formatEta(option.etaDaysMin, option.etaDaysMax) }}.</span>
                </span>
                <span class="delivery__price">{{ option.priceCents > 0 ? formatPrice(option.priceCents) : "Free" }}</span>
              </label>
            </div>
          </fieldset>

          <section class="checkout__section" aria-labelledby="payment-heading">
            <h3 id="payment-heading" class="checkout__legend">Payment</h3>
            <p class="checkout__hint">
              Payment is not part of this preview. Payment methods will be added together with the order service.
            </p>
          </section>

          <div class="checkout__actions">
            <button
              type="submit"
              class="iz-btn iz-btn--solid"
              :disabled="!canCheckout || isSubmitting"
              data-testid="checkout-submit"
            >
              Check details (demo)
            </button>
            <button type="button" class="iz-btn iz-btn--quiet" @click="resetForm">Clear form</button>
          </div>
          <p v-if="!canCheckout && !isLoading" class="iz-error">
            Your cart has out-of-stock items. <NuxtLink to="/cart" class="iz-link">Review your cart</NuxtLink> to continue.
          </p>

          <div
            v-if="result"
            ref="resultRef"
            class="result"
            role="status"
            tabindex="-1"
            data-testid="checkout-result"
          >
            <UiIcon name="info" />
            <div>
              <h3>Your details look complete</h3>
              <p>{{ result }}</p>
              <NuxtLink to="/shop" class="iz-link mt-2 inline-block">Continue browsing</NuxtLink>
            </div>
          </div>
        </form>

        <aside class="checkout__aside" aria-label="Order summary">
          <CartSummary :totals="preview.totals" title="Order summary">
            <ul class="mini-lines">
              <li v-for="line in preview.lines" :key="line.productId + line.variantId">
                <span class="mini-lines__title">
                  {{ line.title }}
                  <span>{{ line.variantLabel }} · × {{ line.quantity }}</span>
                </span>
                <span class="mini-lines__price">{{ formatPrice(line.lineTotalCents) }}</span>
              </li>
            </ul>
            <NuxtLink to="/cart" class="iz-link text-sm">Edit cart</NuxtLink>
          </CartSummary>
        </aside>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.checkout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 22rem;
  align-items: start;
  gap: clamp(1.5rem, 3vw, 2.75rem);
}

.checkout__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.checkout__section {
  padding: clamp(1.15rem, 2vw, 1.6rem);
  border: 1px solid var(--iz-border);
  border-radius: 1rem;
  background: rgb(255 255 255 / 0.015);
}

.checkout__legend {
  float: left;
  width: 100%;
  margin-bottom: 1rem;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
}

.checkout__legend + * {
  clear: both;
}

.checkout__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.checkout__full {
  grid-column: 1 / -1;
}

.checkout__hint {
  margin-bottom: 1rem;
  color: var(--iz-muted);
  font-size: 0.86rem;
  line-height: 1.6;
}

.checkout__section > .checkout__hint:last-child {
  margin-bottom: 0;
}

.delivery {
  display: grid;
  gap: 0.6rem;
}

.delivery__option {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--iz-border);
  border-radius: 0.85rem;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.delivery__option:hover {
  border-color: rgb(255 255 255 / 0.24);
}

.delivery__option:has(input:checked) {
  border-color: var(--iz-accent);
  background: rgb(143 192 238 / 0.08);
}

.delivery__radio {
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.15rem;
  flex-shrink: 0;
  accent-color: var(--iz-accent-strong);
}

.delivery__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
}

.delivery__title {
  color: #fff;
  font-size: 0.93rem;
  font-weight: 500;
}

.delivery__text {
  color: var(--iz-muted);
  font-size: 0.83rem;
}

.delivery__price {
  color: #fff;
  font-size: 0.93rem;
  font-variant-numeric: tabular-nums;
}

.checkout__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.error-summary {
  padding: 1rem 1.15rem;
  border: 1px solid rgb(248 113 113 / 0.45);
  border-radius: 0.9rem;
  background: rgb(248 113 113 / 0.07);
}

.error-summary h3 {
  color: #fecaca;
  font-size: 0.98rem;
  font-weight: 600;
}

.error-summary ul {
  display: grid;
  gap: 0.3rem;
  margin-top: 0.6rem;
}

.error-summary a {
  color: var(--iz-danger);
  font-size: 0.87rem;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.result {
  display: flex;
  gap: 0.85rem;
  padding: 1.15rem 1.25rem;
  border: 1px solid rgb(143 192 238 / 0.4);
  border-radius: 1rem;
  background: rgb(143 192 238 / 0.07);
}

.result > svg {
  width: 1.4rem;
  height: 1.4rem;
  flex-shrink: 0;
  color: var(--iz-accent);
}

.result h3 {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
}

.result p {
  margin-top: 0.35rem;
  color: #d6e6f6;
  font-size: 0.9rem;
  line-height: 1.6;
}

.checkout__aside {
  position: sticky;
  top: 6rem;
}

.mini-lines {
  display: grid;
  gap: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--iz-border-soft);
}

.mini-lines li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  font-size: 0.88rem;
}

.mini-lines__title {
  display: flex;
  flex-direction: column;
  color: #e7eef6;
}

.mini-lines__title span {
  color: var(--iz-muted);
  font-size: 0.8rem;
}

.mini-lines__price {
  color: #fff;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

@media (max-width: 1023px) {
  .checkout {
    grid-template-columns: minmax(0, 1fr);
  }

  .checkout__aside {
    position: static;
    order: -1;
  }
}

@media (max-width: 560px) {
  .checkout__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
