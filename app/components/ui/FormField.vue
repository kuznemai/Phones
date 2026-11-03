<script setup lang="ts">
/**
 * Label + control + hint + error wiring. Every form field in the app goes through
 * this, so the a11y plumbing (`for`, `aria-invalid`, `aria-describedby`) lives in one place.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    id: string;
    type?: string;
    autocomplete?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    maxlength?: number;
    multiline?: boolean;
    inputmode?: "text" | "email" | "tel" | "numeric";
  }>(),
  {
    type: "text",
    autocomplete: undefined,
    placeholder: "",
    hint: "",
    error: "",
    required: false,
    maxlength: undefined,
    multiline: false,
    inputmode: undefined,
  },
);

const emit = defineEmits<{ "update:modelValue": [value: string]; blur: [] }>();

const describedBy = computed(
  () => [props.hint && `${props.id}-hint`, props.error && `${props.id}-error`].filter(Boolean).join(" ") || undefined,
);

function onInput(event: Event): void {
  emit("update:modelValue", (event.target as HTMLInputElement | HTMLTextAreaElement).value);
}
</script>

<template>
  <div>
    <label class="iz-label" :for="id">
      {{ label }}<span v-if="required" class="field__required" aria-hidden="true"> *</span>
      <span v-else class="field__optional">(optional)</span>
    </label>
    <textarea
      v-if="multiline"
      :id="id"
      class="iz-input field__textarea"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      rows="3"
      @input="onInput"
      @blur="emit('blur')"
    />
    <input
      v-else
      :id="id"
      class="iz-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :maxlength="maxlength"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="onInput"
      @blur="emit('blur')"
    >
    <p v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="iz-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.field__required {
  color: var(--iz-accent);
}

.field__optional {
  margin-left: 0.35rem;
  color: var(--iz-faint);
  letter-spacing: 0.02em;
  text-transform: none;
}

.field__textarea {
  min-height: 6rem;
  resize: vertical;
}

.field__hint {
  margin-top: 0.35rem;
  color: var(--iz-faint);
  font-size: 0.8rem;
}
</style>
