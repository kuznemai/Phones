<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    label?: string;
  }>(),
  { min: 1, max: 10, label: "Quantity" },
);

const emit = defineEmits<{ "update:modelValue": [value: number] }>();

const canDecrease = computed(() => props.modelValue > props.min);
const canIncrease = computed(() => props.modelValue < props.max);

// "Quantity of IZ One" → "quantity of IZ One": lower-case only the first letter.
const lowerLabel = computed(() => props.label.charAt(0).toLowerCase() + props.label.slice(1));
</script>

<template>
  <div class="stepper" role="group" :aria-label="label">
    <button
      type="button"
      class="stepper__btn"
      :disabled="!canDecrease"
      :aria-label="`Decrease ${lowerLabel}`"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </button>

    <output class="stepper__value" aria-live="polite" :aria-label="`${label}: ${modelValue}`">{{ modelValue }}</output>

    <button
      type="button"
      class="stepper__btn"
      :disabled="!canIncrease"
      :aria-label="`Increase ${lowerLabel}`"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--iz-border);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.03);
}

.stepper__btn {
  display: inline-flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #e7eef6;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.stepper__btn:not(:disabled):hover {
  color: #fff;
  background: rgb(255 255 255 / 0.07);
}

.stepper__btn:disabled {
  color: rgb(255 255 255 / 0.25);
  cursor: not-allowed;
}

.stepper__btn svg {
  width: 1.05rem;
  height: 1.05rem;
}

.stepper__value {
  min-width: 2rem;
  text-align: center;
  color: #fff;
  font-size: 0.95rem;
  font-variant-numeric: tabular-nums;
}
</style>
