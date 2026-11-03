<script setup lang="ts">
import { DEVICE_FEATURES, OS_FEATURES, OS_LIMITS } from "~/data/os";

useSeo({
  title: "Security & OS",
  description:
    "How IZ OS protects your phone: verified boot, encryption by default, per-app network and sensor permissions, a dedicated secure element and five years of signed updates.",
  image: "/iz-chip.png",
});
</script>

<template>
  <div class="iz-wrap iz-page">
    <header class="mx-auto mb-12 max-w-3xl text-center">
      <p class="iz-eyebrow">Technology</p>
      <h1 class="iz-h1 mt-3">How IZ OS protects your phone</h1>
      <p class="mt-4 text-sm leading-relaxed text-[var(--iz-muted)] md:text-base">
        IZ OS is the operating system on every IZ device. Its protections are on from the first start-up, so you do
        not have to find and enable them yourself.
      </p>
    </header>

    <section class="iz-card mx-auto mb-10 max-w-4xl text-center" aria-labelledby="together-heading">
      <h2 id="together-heading" class="text-xl font-medium text-white md:text-2xl">Hardware and software, designed together</h2>
      <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--iz-muted)] md:text-base">
        From the secure element that holds your keys to the permissions you grant each app, IZ devices and IZ OS are
        built as one system.
      </p>
    </section>

    <h2 class="sr-only">Built into IZ OS</h2>
    <ul class="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="feature in OS_FEATURES" :key="feature.title" class="iz-card flex gap-4">
        <div class="feature-icon">
          <UiIcon :name="feature.icon" />
        </div>
        <div class="min-w-0">
          <h3 class="text-base font-medium text-zinc-100">{{ feature.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-[var(--iz-muted)]">{{ feature.text }}</p>
        </div>
      </li>
    </ul>

    <section class="mx-auto mt-14 max-w-6xl" aria-labelledby="devices-heading">
      <h2 id="devices-heading" class="mb-6 text-center text-xl font-medium text-white md:text-2xl">
        Extra protection on selected models
      </h2>
      <ul class="grid gap-4 md:grid-cols-3">
        <li v-for="device in DEVICE_FEATURES" :key="device.slug" class="iz-card">
          <h3 class="text-base font-medium text-zinc-100">
            <NuxtLink :to="`/product/${device.slug}`" class="iz-link">{{ device.model }}</NuxtLink>
          </h3>
          <ul class="mt-3 flex flex-col gap-2">
            <li v-for="feature in device.features" :key="feature" class="flex items-start gap-2.5 text-sm text-zinc-300">
              <UiIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-[var(--iz-accent)]" />
              {{ feature }}
            </li>
          </ul>
        </li>
      </ul>
    </section>

    <section id="limits" class="iz-card mx-auto mt-14 max-w-4xl" aria-labelledby="limits-heading">
      <h2 id="limits-heading" class="text-center text-xl font-medium text-white md:text-2xl">What IZ OS cannot do for you</h2>
      <ul class="mx-auto mt-6 flex max-w-2xl flex-col gap-3">
        <li v-for="limit in OS_LIMITS" :key="limit" class="flex items-start gap-3 text-sm leading-relaxed text-[var(--iz-muted)] md:text-base">
          <UiIcon name="info" class="mt-1 h-4 w-4 shrink-0 text-[var(--iz-warning)]" />
          {{ limit }}
        </li>
      </ul>
    </section>

    <section class="iz-card mx-auto mt-12 max-w-3xl text-center" aria-label="Next steps">
      <p class="text-sm leading-relaxed text-[var(--iz-muted)] md:text-base">
        Every model runs the same IZ OS. Compare sizes, batteries and storage in the catalog, or read the answers to
        common questions.
      </p>
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <NuxtLink to="/shop" class="iz-btn iz-btn--solid">View devices</NuxtLink>
        <NuxtLink to="/faq" class="iz-btn iz-btn--ghost">Read the FAQ</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.feature-icon {
  display: flex;
  height: 3rem;
  width: 3rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--iz-border);
  border-radius: 0.75rem;
  background: rgb(255 255 255 / 0.03);
  color: var(--iz-accent);
}

.feature-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
