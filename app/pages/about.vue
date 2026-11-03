<script setup lang="ts">
import { SITE } from "~/data/site";
import { fetchProducts } from "~/services/catalog";

const { data: lineup } = await useAsyncData("about-lineup", async () => (await fetchProducts()).items, {
  default: () => [],
});

const PRINCIPLES = [
  {
    icon: "shield",
    title: "Private by default",
    text: "Protections such as encryption and verified boot are switched on from the start, not hidden in settings.",
  },
  {
    icon: "sliders",
    title: "You stay in control",
    text: "You decide which apps reach the network or use sensors, and no vendor account is required.",
  },
  {
    icon: "chip",
    title: "Hardware and software together",
    text: "Devices and IZ OS are designed as one system, from the secure element to app permissions.",
  },
  {
    icon: "refresh",
    title: "Built to last",
    text: "Every current model lists five years of signed security updates.",
  },
] as const;

useSeo({
  title: "About",
  description: `${SITE.name} makes smartphones built around IZ OS, a privacy-focused operating system. ${SITE.motto}`,
  image: "/iz-ui-phones.png",
});
</script>

<template>
  <div class="iz-page">
    <div class="iz-wrap">
      <div class="intro">
        <UiPageHeader
          eyebrow="About"
          title="Smartphones for a more secure tomorrow"
          lead="We make smartphones around one idea: a phone should protect the person using it by default. Every IZ device runs IZ OS, our privacy-focused operating system."
        />
        <img
          class="intro__visual"
          src="/iz-ui-phones.png"
          alt="IZ OS lock screen and privacy settings on two phones"
          width="1025"
          height="915"
          fetchpriority="high"
          decoding="async"
        >
      </div>
    </div>

    <section class="iz-section" aria-labelledby="principles-heading">
      <div class="iz-wrap iz-split">
        <div class="iz-reveal">
          <p class="iz-eyebrow">What guides us</p>
          <h2 id="principles-heading" class="iz-h2">{{ SITE.motto }}</h2>
          <p class="iz-lead">
            Privacy should not depend on knowing which settings to change. These principles shape both the devices and
            the operating system.
          </p>
        </div>
        <ul class="principles">
          <li v-for="item in PRINCIPLES" :key="item.title" class="iz-card iz-reveal">
            <UiIcon :name="item.icon" class="iz-card__icon" />
            <h3 class="iz-card__title">{{ item.title }}</h3>
            <p class="iz-card__text">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="iz-section iz-section--tint" aria-labelledby="lineup-heading">
      <div class="iz-wrap">
        <p class="iz-eyebrow">The lineup</p>
        <h2 id="lineup-heading" class="iz-h2">One OS, six devices</h2>
        <ul class="lineup">
          <li v-for="item in lineup" :key="item.id" class="iz-reveal">
            <NuxtLink :to="`/product/${item.slug}`" class="lineup__item">
              <span class="lineup__name">{{ item.title }}</span>
              <span class="lineup__tagline">{{ item.tagline }}</span>
              <UiIcon name="arrow" class="lineup__arrow" />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="iz-section" aria-labelledby="store-heading">
      <div class="iz-wrap iz-wrap--narrow">
        <div class="iz-card store iz-reveal">
          <h2 id="store-heading" class="store__title">About this store</h2>
          <div class="iz-prose">
            <p>
              This website is a preview of the {{ SITE.name }} store. You can explore the devices, configure them and
              build a cart, but ordering is not open yet.
            </p>
            <p>
              Prices, stock levels and delivery options are sample data. Company details, contact channels, warranty
              terms and legal documents will be published here before sales open.
            </p>
          </div>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink to="/security" class="iz-btn iz-btn--ghost">Security &amp; OS</NuxtLink>
            <NuxtLink to="/faq" class="iz-btn iz-btn--quiet">Read the FAQ</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  align-items: center;
  gap: 2rem;
  padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
}

.intro__visual {
  width: 100%;
  max-width: 30rem;
  height: auto;
  justify-self: center;
  filter: drop-shadow(0 24px 70px rgb(20 90 190 / 0.35));
}

.principles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.lineup {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
  gap: 0.75rem;
  margin-top: clamp(1.75rem, 3vw, 2.5rem);
}

.lineup__item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.1rem 3rem 1.1rem 1.2rem;
  border: 1px solid var(--iz-border-soft);
  border-radius: 0.9rem;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.lineup__item:hover {
  border-color: rgb(143 192 238 / 0.4);
  background: rgb(143 192 238 / 0.05);
}

.lineup__name {
  color: #fff;
  font-weight: 600;
}

.lineup__tagline {
  color: var(--iz-muted);
  font-size: 0.88rem;
}

.lineup__arrow {
  position: absolute;
  top: 50%;
  right: 1.1rem;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--iz-accent);
  transform: translateY(-50%);
  transition: transform 0.2s ease;
}

.lineup__item:hover .lineup__arrow {
  transform: translate(3px, -50%);
}

.store__title {
  margin-bottom: 1rem;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
}

@media (max-width: 860px) {
  .intro {
    grid-template-columns: minmax(0, 1fr);
  }

  .intro__visual {
    max-width: 20rem;
  }
}

@media (max-width: 560px) {
  .principles {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
