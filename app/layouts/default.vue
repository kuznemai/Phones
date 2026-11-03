<script setup lang="ts">
const route = useRoute();

/** The landing page runs edge-to-edge under a transparent header. */
const isOverlayHeader = computed(() => route.path === "/");
</script>

<template>
  <div class="relative flex min-h-screen flex-col bg-[var(--iz-bg)]">
    <a href="#main" class="skip-link">Skip to content</a>
    <AppHeader :overlay="isOverlayHeader" />

    <main id="main" class="min-w-0 flex-1" tabindex="-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
