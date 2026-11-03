<script setup lang="ts">
import type { ProductVariant } from "#shared/types";
import { formatPrice, formatStorage } from "~/utils/format";

const props = defineProps<{
  variants: ProductVariant[];
  modelValue: string;
}>();

const emit = defineEmits<{ "update:modelValue": [variantId: string] }>();

const uid = useId();
const selected = computed(() => props.variants.find((variant) => variant.id === props.modelValue));

const storages = computed(() =>
  [...new Set(props.variants.map((variant) => variant.storageGb))].sort((a, b) => a - b),
);

const colors = computed(() => {
  const seen = new Map<string, string>();
  for (const variant of props.variants) {
    if (!seen.has(variant.color)) seen.set(variant.color, variant.colorHex);
  }
  return [...seen].map(([name, hex]) => ({ name, hex }));
});

function variantFor(storageGb: number, color: string): ProductVariant | undefined {
  return props.variants.find((variant) => variant.storageGb === storageGb && variant.color === color);
}

/** Prefers an in-stock match, then any match, so switching never lands on a dead end needlessly. */
function bestMatch(candidates: ProductVariant[]): ProductVariant | undefined {
  return candidates.find((variant) => variant.stock > 0) ?? candidates[0];
}

/** Keeps the other axis fixed when one is changed, falling back to the closest match. */
function selectStorage(storageGb: number): void {
  const next =
    variantFor(storageGb, selected.value?.color ?? "") ??
    bestMatch(props.variants.filter((variant) => variant.storageGb === storageGb));
  if (next) emit("update:modelValue", next.id);
}

function selectColor(color: string): void {
  const next =
    variantFor(selected.value?.storageGb ?? 0, color) ?? bestMatch(props.variants.filter((variant) => variant.color === color));
  if (next) emit("update:modelValue", next.id);
}

function storageNote(storageGb: number): string {
  const variant = variantFor(storageGb, selected.value?.color ?? "");
  if (!variant) return `Not in ${selected.value?.color ?? "this colour"}`;
  return variant.stock > 0 ? formatPrice(variant.priceCents) : "Out of stock";
}

function colorNote(color: string): string {
  const variant = variantFor(selected.value?.storageGb ?? 0, color);
  if (!variant) return `Not in ${formatStorage(selected.value?.storageGb ?? 0)}`;
  return variant.stock > 0 ? "" : "Out of stock";
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <fieldset>
      <legend class="iz-label">Storage</legend>
      <div class="options">
        <label
          v-for="storageGb in storages"
          :key="storageGb"
          class="option"
          :class="{ 'option--dim': !variantFor(storageGb, selected?.color ?? '')?.stock }"
        >
          <input
            type="radio"
            class="sr-only"
            :name="`${uid}-storage`"
            :value="storageGb"
            :checked="selected?.storageGb === storageGb"
            @change="selectStorage(storageGb)"
          >
          <span class="option__title">{{ formatStorage(storageGb) }}</span>
          <span class="option__meta">{{ storageNote(storageGb) }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend class="iz-label">
        Colour<span v-if="selected" class="legend-value">: {{ selected.color }}</span>
      </legend>
      <div class="options">
        <label
          v-for="color in colors"
          :key="color.name"
          class="option"
          :class="{ 'option--dim': !variantFor(selected?.storageGb ?? 0, color.name)?.stock }"
        >
          <input
            type="radio"
            class="sr-only"
            :name="`${uid}-color`"
            :value="color.name"
            :checked="selected?.color === color.name"
            @change="selectColor(color.name)"
          >
          <span class="swatch" :style="{ background: color.hex }" aria-hidden="true" />
          <span class="option__title">{{ color.name }}</span>
          <span v-if="colorNote(color.name)" class="option__meta">{{ colorNote(color.name) }}</span>
        </label>
      </div>
    </fieldset>

    <p
      v-if="selected"
      class="availability"
      :class="selected.stock > 0 ? 'availability--in' : 'availability--out'"
      data-testid="availability"
    >
      <span class="availability__dot" aria-hidden="true" />
      <template v-if="selected.stock > 5">In stock</template>
      <template v-else-if="selected.stock > 0">Only {{ selected.stock }} left</template>
      <template v-else>This configuration is out of stock</template>
      <span class="sr-only">,</span>
      <span class="availability__note">(sample stock level)</span>
    </p>
  </div>
</template>

<style scoped>
fieldset {
  border: 0;
  padding: 0;
}

.legend-value {
  color: #dfe8f2;
  letter-spacing: 0.02em;
  text-transform: none;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.option {
  display: flex;
  min-height: 3rem;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 1rem;
  border: 1px solid var(--iz-border);
  border-radius: 0.8rem;
  background: rgb(255 255 255 / 0.02);
  color: #dfe8f2;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.option:hover {
  border-color: rgb(255 255 255 / 0.24);
}

.option:has(input:checked) {
  border-color: var(--iz-accent);
  background: rgb(143 192 238 / 0.12);
  color: #fff;
}

.option:has(input:focus-visible) {
  outline: 2px solid var(--iz-accent);
  outline-offset: 2px;
}

/* The combination is missing or sold out; selecting it still switches to the nearest match. */
.option--dim .option__title {
  opacity: 0.6;
}

.option__title {
  font-size: 0.92rem;
  font-weight: 500;
}

.option__meta {
  color: var(--iz-muted);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.swatch {
  height: 1.1rem;
  width: 1.1rem;
  border: 1px solid rgb(255 255 255 / 0.4);
  border-radius: 999px;
}

.availability {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.9rem;
}

.availability--in {
  color: var(--iz-success);
}

.availability--out {
  color: var(--iz-danger);
}

.availability__dot {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 999px;
  background: currentColor;
}

.availability__note {
  color: var(--iz-faint);
  font-size: 0.78rem;
}
</style>
