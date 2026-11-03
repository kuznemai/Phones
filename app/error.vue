<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

const isNotFound = computed(() => props.error.statusCode === 404);

const title = computed(() => (isNotFound.value ? "Page not found" : "Something went wrong"));
const description = computed(() =>
  isNotFound.value
    ? "The page you were looking for does not exist or has moved. Try the catalog or go back to the home page."
    : "An unexpected error occurred. Please try again in a moment.",
);

useHead({ title: `${title.value} — IZ Secure`, meta: [{ name: "robots", content: "noindex" }] });
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[var(--iz-bg)]">
    <a href="#main" class="skip-link">Skip to content</a>
    <AppHeader />

    <main id="main" class="flex flex-1 items-center" tabindex="-1">
      <div class="iz-wrap iz-wrap--narrow py-20 text-center">
        <p class="iz-eyebrow">Error {{ error.statusCode }}</p>
        <h1 class="iz-h2 mx-auto max-w-[18ch]">{{ title }}</h1>
        <p class="iz-lead mx-auto text-center">{{ description }}</p>

        <div class="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" class="iz-btn iz-btn--solid" @click="clearError({ redirect: '/shop' })">
            Browse the catalog
          </button>
          <button type="button" class="iz-btn iz-btn--ghost" @click="clearError({ redirect: '/' })">
            Go to the home page
          </button>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
