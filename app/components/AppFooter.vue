<script setup lang="ts">
import { DEMO_NOTICE, SITE } from "~/data/site";

const currentYear = new Date().getFullYear();

const NAV = [
  { label: "Home", to: "/" },
  { label: "Devices", to: "/shop" },
  { label: "Technology", to: "/security" },
  { label: "Support", to: "/contact" },
];

const SECONDARY = [
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Saved devices", to: "/favorites" },
  { label: "Cart", to: "/cart" },
];
</script>

<template>
  <footer class="site-footer">
    <div class="iz-wrap">
      <div class="site-footer__top">
        <NuxtLink to="/" class="site-footer__brand" :aria-label="`${SITE.name} — home`">
          <img src="/iz-logo-white.png" alt="" width="160" height="93" loading="lazy">
        </NuxtLink>

        <nav class="site-footer__nav" aria-label="Footer">
          <NuxtLink v-for="link in NAV" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
        </nav>

        <nav class="site-footer__legal" aria-label="More">
          <NuxtLink v-for="link in SECONDARY" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
        </nav>
      </div>

      <div class="site-footer__bottom">
        <span>{{ SITE.motto }}</span>
        <span>{{ DEMO_NOTICE.short }}</span>
        <span>&copy; {{ currentYear }} {{ SITE.name }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  border-top: 1px solid var(--iz-border-soft);
  padding-block: clamp(2rem, 3.5vw, 3rem) clamp(1.5rem, 2.5vw, 2rem);
}

.site-footer__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.25rem, 3vw, 2.5rem);
}

.site-footer__brand img {
  height: clamp(2.2rem, 3.2vw, 3rem);
  width: auto;
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(1.1rem, 2.4vw, 2.5rem);
}

.site-footer__nav a {
  color: #dfe8f2;
  font-size: clamp(0.82rem, 0.98vw, 0.92rem);
  transition: color 0.2s ease;
}

.site-footer__nav a:hover {
  color: var(--iz-accent);
}

.site-footer__legal {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(0.9rem, 1.8vw, 1.75rem);
}

.site-footer__legal a {
  color: #7e93a9;
  font-size: clamp(0.76rem, 0.9vw, 0.85rem);
  transition: color 0.2s ease;
}

.site-footer__legal a:hover {
  color: #dfe8f2;
}

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: clamp(1.5rem, 2.5vw, 2.25rem);
  padding-top: clamp(1rem, 1.8vw, 1.5rem);
  border-top: 1px solid var(--iz-border-soft);
  color: #6f8095;
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: 300;
}
</style>
