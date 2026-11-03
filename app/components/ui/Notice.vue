<script setup lang="ts">
/** Inline banner for demo-mode and informational messages. */
withDefaults(defineProps<{ tone?: "demo" | "info" }>(), { tone: "demo" });
</script>

<template>
  <div class="iz-notice" :class="{ 'iz-notice--info': tone === 'info' }">
    <UiIcon name="info" />
    <div class="min-w-0">
      <slot />
    </div>
  </div>
</template>
