<script setup lang="ts">
import type { CatalogFacets, CatalogFilters } from "#shared/types";
import { SIZE_CLASSES } from "~/utils/catalog";
import { formatStorage } from "~/utils/format";

const props = defineProps<{ facets: CatalogFacets; modelValue: CatalogFilters }>();
const emit = defineEmits<{ "update:modelValue": [value: CatalogFilters]; clear: [] }>();

const sizeOptions = computed(() => SIZE_CLASSES.filter((size) => props.facets.sizes.includes(size.value)));

function toggle<K extends "storage" | "colors" | "sizes">(key: K, value: CatalogFilters[K][number]): void {
  const list = props.modelValue[key] as CatalogFilters[K][number][];
  const next = list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
  emit("update:modelValue", { ...props.modelValue, [key]: next });
}

function setInStock(value: boolean): void {
  emit("update:modelValue", { ...props.modelValue, inStockOnly: value });
}
</script>

<template>
  <div class="filters">
    <fieldset class="filters__group">
      <legend class="iz-label">Storage</legend>
      <div class="filters__chips">
        <label v-for="gb in facets.storage" :key="gb" class="chip">
          <input
            type="checkbox"
            class="sr-only"
            :checked="modelValue.storage.includes(gb)"
            @change="toggle('storage', gb)"
          >
          <span>{{ formatStorage(gb) }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="filters__group">
      <legend class="iz-label">Colour</legend>
      <div class="filters__chips">
        <label v-for="color in facets.colors" :key="color.name" class="chip">
          <input
            type="checkbox"
            class="sr-only"
            :checked="modelValue.colors.includes(color.name)"
            @change="toggle('colors', color.name)"
          >
          <span class="chip__swatch" :style="{ background: color.hex }" aria-hidden="true" />
          <span>{{ color.name }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="filters__group">
      <legend class="iz-label">Screen size</legend>
      <div class="filters__chips">
        <label v-for="size in sizeOptions" :key="size.value" class="chip">
          <input
            type="checkbox"
            class="sr-only"
            :checked="modelValue.sizes.includes(size.value)"
            @change="toggle('sizes', size.value)"
          >
          <span>{{ size.label }}</span>
          <span class="sr-only">,</span>
          <span class="chip__hint">{{ size.hint }}</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="filters__group">
      <legend class="iz-label">Availability</legend>
      <label class="switch">
        <input
          type="checkbox"
          class="switch__input"
          :checked="modelValue.inStockOnly"
          @change="setInStock(($event.target as HTMLInputElement).checked)"
        >
        <span class="switch__track" aria-hidden="true"><span class="switch__thumb" /></span>
        <span>In stock only</span>
      </label>
    </fieldset>

    <button type="button" class="iz-btn iz-btn--quiet filters__clear" @click="emit('clear')">
      Clear search and filters
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filters__group {
  border: 0;
  padding: 0;
}

.filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.chip {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--iz-border);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.02);
  color: #dfe8f2;
  font-size: 0.86rem;
  cursor: pointer;
  user-select: none;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.chip:hover {
  border-color: rgb(255 255 255 / 0.24);
}

.chip:has(input:checked) {
  border-color: var(--iz-accent);
  background: rgb(143 192 238 / 0.12);
  color: #fff;
}

.chip:has(input:focus-visible) {
  outline: 2px solid var(--iz-accent);
  outline-offset: 2px;
}

.chip__swatch {
  height: 0.85rem;
  width: 0.85rem;
  border: 1px solid rgb(255 255 255 / 0.4);
  border-radius: 999px;
}

.chip__hint {
  color: var(--iz-muted);
  font-size: 0.74rem;
}

.switch {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: 0.7rem;
  color: #dfe8f2;
  font-size: 0.9rem;
  cursor: pointer;
}

.switch__input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.switch__track {
  position: relative;
  display: inline-block;
  height: 1.4rem;
  width: 2.5rem;
  border: 1px solid var(--iz-border);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.06);
  transition: background-color 0.2s ease;
}

.switch__thumb {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  height: 1rem;
  width: 1rem;
  border-radius: 999px;
  background: #b4c0cd;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.switch__input:checked + .switch__track {
  border-color: var(--iz-accent);
  background: rgb(77 163 255 / 0.35);
}

.switch__input:checked + .switch__track .switch__thumb {
  transform: translateX(1.1rem);
  background: #fff;
}

.switch__input:focus-visible + .switch__track {
  outline: 2px solid var(--iz-accent);
  outline-offset: 2px;
}

.filters__clear {
  align-self: flex-start;
  padding-inline: 0;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
</style>
