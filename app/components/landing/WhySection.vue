<script setup lang="ts">
import type { FeatureIcon } from "~/data/os";

const cards: { title: string; text: string; icon: FeatureIcon }[] = [
  {
    title: "Fewer things leave your phone",
    text: "IZ OS works without usage telemetry, and apps only reach the network when you allow it.",
    icon: "eye",
  },
  {
    title: "You decide who gets access",
    text: "Network and sensor access are permissions you grant per app, not defaults you hunt down later.",
    icon: "sliders",
  },
  {
    title: "Tampering is harder to hide",
    text: "Verified boot checks the system against a signed boot chain every time the phone starts.",
    icon: "boot",
  },
  {
    title: "Supported for years",
    text: "Each current model lists five years of signed security updates, delivered over the air.",
    icon: "refresh",
  },
];
</script>

<template>
  <section id="why" class="iz-section iz-section--tint" aria-labelledby="why-title">
    <div class="iz-wrap iz-split">
      <div class="iz-reveal">
        <p class="iz-eyebrow">Why IZ OS</p>
        <h2 id="why-title" class="iz-h2">Security that stays<br>out of your way</h2>
        <p class="iz-lead">
          IZ OS keeps the protections switched on from the first boot, so you get a familiar smartphone without
          trading away control over your data.
        </p>
        <NuxtLink to="/security" class="iz-btn iz-btn--ghost mt-8">
          <span>Explore Security &amp; OS</span>
          <UiIcon name="arrow" />
        </NuxtLink>
      </div>

      <ul class="why__cards">
        <li v-for="card in cards" :key="card.title" class="iz-card iz-reveal">
          <UiIcon :name="card.icon" class="iz-card__icon" />
          <h3 class="iz-card__title">{{ card.title }}</h3>
          <p class="iz-card__text">{{ card.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.why__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.85rem, 1.4vw, 1.25rem);
}

@media (max-width: 560px) {
  .why__cards {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
