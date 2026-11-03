<script setup lang="ts">
import type { FeatureIcon } from "~/data/os";

const points: { title: string; text: string; icon: FeatureIcon }[] = [
  {
    title: "Dedicated secure element",
    text: "Keys and biometric data are handled by a separate chip, not the main processor.",
    icon: "chip",
  },
  {
    title: "Hardware controls on selected models",
    text: "IZ Air adds a camera and microphone cut-off and a USB-C data-blocking mode.",
    icon: "sliders",
  },
  {
    title: "A wallet edition",
    text: "IZ Vault adds offline transaction signing and Shamir backup for recovery phrases.",
    icon: "key",
  },
];
</script>

<template>
  <section id="hardware" class="iz-section iz-section--tint" aria-labelledby="hardware-title">
    <div class="iz-wrap hardware__grid">
      <div class="hardware__intro iz-reveal">
        <p class="iz-eyebrow">Hardware + software</p>
        <h2 id="hardware-title" class="iz-h2">Designed<br>together</h2>
        <p class="iz-lead">
          IZ devices and IZ OS are built as one system, so protections reach from the chip that stores your keys to
          the permissions you grant each app.
        </p>
        <NuxtLink to="/shop" class="iz-btn iz-btn--ghost mt-8">
          <span>Compare devices</span>
          <UiIcon name="arrow" />
        </NuxtLink>
      </div>

      <div class="hardware__visual iz-reveal">
        <img
          src="/iz-chip.png"
          alt="IZ secure element surrounded by circuitry"
          width="900"
          height="981"
          loading="lazy"
          decoding="async"
        >
      </div>

      <ul class="hardware__points">
        <li v-for="point in points" :key="point.title" class="hardware__point iz-reveal">
          <span class="hardware__icon"><UiIcon :name="point.icon" /></span>
          <div>
            <h3 class="hardware__title">{{ point.title }}</h3>
            <p class="hardware__text">{{ point.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hardware__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr) minmax(0, 0.9fr);
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3.5rem);
}

.hardware__visual img {
  display: block;
  width: 100%;
  height: auto;
}

.hardware__points {
  display: flex;
  flex-direction: column;
  gap: clamp(1.1rem, 2vw, 1.8rem);
}

.hardware__point {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.hardware__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border: 1px solid var(--iz-border, rgba(255, 255, 255, 0.08));
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.035);
  color: #8fc0ee;
}

.hardware__icon svg {
  width: 1.4rem;
  height: 1.4rem;
}

.hardware__title {
  color: #fff;
  font-size: clamp(0.92rem, 1.1vw, 1.02rem);
  font-weight: 600;
  line-height: 1.35;
}

.hardware__text {
  margin-top: 0.35rem;
  color: #8ea0b5;
  font-size: clamp(0.8rem, 0.95vw, 0.9rem);
  font-weight: 300;
  line-height: 1.55;
}

@media (max-width: 1100px) {
  .hardware__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .hardware__visual {
    grid-row: span 2;
    order: 2;
  }

  .hardware__points {
    order: 3;
  }
}

@media (max-width: 760px) {
  .hardware__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.25rem;
  }

  .hardware__visual {
    grid-row: auto;
    max-width: 24rem;
    margin-inline: auto;
  }
}
</style>
