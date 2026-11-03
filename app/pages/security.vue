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
  <div class="iz-page">
    <div class="iz-wrap">
      <div class="intro">
        <UiPageHeader
          eyebrow="Security & OS"
          title="How IZ OS protects your phone"
          lead="IZ OS is the operating system on every IZ device. Its protections are on from the first start-up, so you do not have to find and enable them yourself."
        >
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/shop" class="iz-btn iz-btn--solid">
              Browse devices
              <UiIcon name="arrow" />
            </NuxtLink>
            <a href="#limits" class="iz-btn iz-btn--ghost">What it cannot do</a>
          </div>
        </UiPageHeader>
        <img
          class="intro__visual"
          src="/iz-chip.png"
          alt="IZ secure element surrounded by circuitry"
          width="900"
          height="981"
          fetchpriority="high"
          decoding="async"
        >
      </div>
    </div>

    <section class="iz-section" aria-labelledby="features-heading">
      <div class="iz-wrap">
        <p class="iz-eyebrow">On every model</p>
        <h2 id="features-heading" class="iz-h2">Built into IZ OS</h2>
        <ul class="features">
          <li v-for="feature in OS_FEATURES" :key="feature.title" class="iz-card iz-reveal">
            <UiIcon :name="feature.icon" class="iz-card__icon" />
            <h3 class="iz-card__title">{{ feature.title }}</h3>
            <p class="iz-card__text">{{ feature.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="iz-section iz-section--tint" aria-labelledby="devices-heading">
      <div class="iz-wrap iz-split">
        <div class="iz-reveal">
          <p class="iz-eyebrow">Model-specific</p>
          <h2 id="devices-heading" class="iz-h2">Extra hardware<br>protection</h2>
          <p class="iz-lead">Some models add physical controls or wallet features on top of IZ OS.</p>
        </div>
        <ul class="devices">
          <li v-for="device in DEVICE_FEATURES" :key="device.slug" class="iz-card iz-reveal">
            <h3 class="devices__model">
              <NuxtLink :to="`/product/${device.slug}`" class="iz-link">{{ device.model }}</NuxtLink>
            </h3>
            <ul class="devices__list">
              <li v-for="feature in device.features" :key="feature">
                <UiIcon name="check" />
                {{ feature }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </section>

    <section id="limits" class="iz-section" aria-labelledby="limits-heading">
      <div class="iz-wrap iz-split">
        <div class="iz-reveal">
          <p class="iz-eyebrow">Honest limits</p>
          <h2 id="limits-heading" class="iz-h2">What IZ OS<br>cannot do for you</h2>
          <p class="iz-lead">
            Security is about reducing risk. Knowing where a phone's protection ends helps you make better choices.
          </p>
        </div>
        <ul class="limits iz-reveal">
          <li v-for="limit in OS_LIMITS" :key="limit">
            <UiIcon name="info" />
            <span>{{ limit }}</span>
          </li>
        </ul>
      </div>
    </section>

    <div class="iz-wrap">
      <div class="next iz-card iz-reveal">
        <div>
          <h2 class="next__title">Still have questions?</h2>
          <p class="next__text">Read the answers about privacy, apps, updates and this preview store.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/faq" class="iz-btn iz-btn--ghost">Read the FAQ</NuxtLink>
          <NuxtLink to="/shop" class="iz-btn iz-btn--solid">Browse devices</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  align-items: center;
  gap: 2rem;
  padding-bottom: clamp(2rem, 4vw, 3rem);
}

.intro__visual {
  width: 100%;
  max-width: 26rem;
  height: auto;
  justify-self: center;
  filter: drop-shadow(0 24px 70px rgb(20 90 190 / 0.35));
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
  margin-top: clamp(1.75rem, 3vw, 2.5rem);
}

.devices {
  display: grid;
  gap: 1rem;
}

.devices__model {
  font-size: 1.05rem;
  font-weight: 600;
}

.devices__list {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.devices__list li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: #d3dde8;
  font-size: 0.92rem;
}

.devices__list svg {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
  color: var(--iz-accent);
}

.limits {
  display: grid;
  gap: 0.85rem;
}

.limits li {
  display: flex;
  gap: 0.85rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--iz-border-soft);
  border-radius: 0.9rem;
  color: #d3dde8;
  font-size: 0.94rem;
  line-height: 1.6;
}

.limits svg {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: var(--iz-warning);
}

.next {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
}

.next__title {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
}

.next__text {
  margin-top: 0.35rem;
  color: var(--iz-muted);
  font-size: 0.92rem;
}

@media (max-width: 860px) {
  .intro {
    grid-template-columns: minmax(0, 1fr);
  }

  .intro__visual {
    max-width: 18rem;
  }
}
</style>
