<script setup lang="ts">
import { DEMO_NOTICE, SITE } from "~/data/site";

const currentYear = new Date().getFullYear();

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Catalog", to: "/shop" },
      { label: "Saved devices", to: "/favorites" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Security & OS", to: "/security" },
      { label: "About", to: "/about" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
    ],
  },
];
</script>

<template>
  <footer class="site-footer">
    <div class="iz-wrap">
      <div class="site-footer__top">
        <div class="site-footer__intro">
          <NuxtLink to="/" class="site-footer__brand" :aria-label="`${SITE.name} — home`">
            <img src="/iz-logo-white.png" alt="" width="160" height="93" loading="lazy">
          </NuxtLink>
          <p>{{ SITE.motto }}</p>
        </div>

        <nav v-for="column in COLUMNS" :key="column.title" class="site-footer__col" :aria-label="column.title">
          <h2>{{ column.title }}</h2>
          <ul>
            <li v-for="link in column.links" :key="link.to">
              <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <p class="site-footer__demo">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
          <path d="M12 11v5m0-8h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        {{ DEMO_NOTICE.short }}
      </p>

      <div class="site-footer__bottom">
        <span>&copy; {{ currentYear }} {{ SITE.name }}</span>
        <span>Your cart and saved devices stay in this browser.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  border-top: 1px solid var(--iz-border-soft);
  padding-block: clamp(2.5rem, 4vw, 3.5rem) clamp(1.5rem, 2.5vw, 2rem);
  background: linear-gradient(180deg, rgb(255 255 255 / 0.015), rgb(255 255 255 / 0));
}

.site-footer__top {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(2, minmax(0, 1fr));
  gap: clamp(1.75rem, 4vw, 4rem);
}

.site-footer__intro p {
  max-width: 28ch;
  margin-top: 1rem;
  color: var(--iz-muted);
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.6;
}

.site-footer__brand {
  display: inline-block;
}

.site-footer__brand img {
  height: clamp(2.2rem, 3vw, 2.8rem);
  width: auto;
}

.site-footer__col h2 {
  color: var(--iz-faint);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.site-footer__col ul {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.85rem;
}

.site-footer__col a {
  display: inline-block;
  padding-block: 0.35rem;
  color: #dfe8f2;
  font-size: 0.92rem;
  transition: color 0.2s ease;
}

.site-footer__col a:hover {
  color: var(--iz-accent);
}

.site-footer__demo {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-top: clamp(2rem, 3vw, 2.75rem);
  color: var(--iz-muted);
  font-size: 0.82rem;
  line-height: 1.6;
}

.site-footer__demo svg {
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: var(--iz-warning);
}

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--iz-border-soft);
  color: var(--iz-faint);
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .site-footer__top {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .site-footer__intro {
    grid-column: 1 / -1;
  }
}
</style>
