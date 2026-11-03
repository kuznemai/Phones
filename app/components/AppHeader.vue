<script setup lang="ts">
import { SITE } from "~/data/site";
import { useCartStore } from "~/stores/cart";
import { useFavoritesStore } from "~/stores/favorites";

withDefaults(defineProps<{ overlay?: boolean }>(), { overlay: false });

const cart = useCartStore();
const favorites = useFavoritesStore();
const route = useRoute();

const NAV = [
  { label: "Home", to: "/" },
  { label: "Devices", to: "/shop" },
  { label: "Technology", to: "/security" },
  { label: "Support", to: "/contact" },
];

/** The drawer also links the pages that do not fit in the desktop bar. */
const DRAWER_NAV = [...NAV, { label: "About", to: "/about" }, { label: "FAQ", to: "/faq" }];

const isMenuOpen = ref(false);
const drawer = ref<HTMLElement | null>(null);
const burger = ref<HTMLButtonElement | null>(null);
const closeButton = ref<HTMLButtonElement | null>(null);

const cartLabel = computed(() =>
  cart.count > 0 ? `Cart, ${cart.count} ${cart.count === 1 ? "item" : "items"}` : "Cart, empty",
);
const savedLabel = computed(() => (favorites.count > 0 ? `Saved devices, ${favorites.count}` : "Saved devices"));

function isActive(to: string): boolean {
  if (to === "/") return route.path === "/";
  return route.path === to || route.path.startsWith(`${to}/`) || (to === "/shop" && route.path.startsWith("/product/"));
}

function openMenu(): void {
  isMenuOpen.value = true;
  nextTick(() => closeButton.value?.focus());
}

function closeMenu(restoreFocus = true): void {
  if (!isMenuOpen.value) return;
  isMenuOpen.value = false;
  if (restoreFocus) nextTick(() => burger.value?.focus());
}

/** Keeps Tab inside the open drawer and lets Escape close it. */
function onDrawerKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return;
  }
  if (event.key !== "Tab" || !drawer.value) return;
  const focusable = [...drawer.value.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// Close the drawer on navigation; focus moves to the new page instead.
watch(
  () => route.fullPath,
  () => closeMenu(false),
);

// A fixed full-screen drawer must not leave the page scrollable behind it.
watch(isMenuOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? "hidden" : "";
});

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = "";
});
</script>

<template>
  <header class="site-header" :class="overlay ? 'site-header--overlay' : 'site-header--solid'">
    <div class="site-header__row iz-wrap">
      <NuxtLink to="/" class="brand" :aria-label="`${SITE.name} — home`">
        <img class="brand__mark" src="/iz-mark-white.png" alt="" width="60" height="43">
        <span class="brand__tag" aria-hidden="true">Secure<br>Tomorrow</span>
      </NuxtLink>

      <nav class="site-nav" aria-label="Main">
        <NuxtLink
          v-for="link in NAV"
          :key="link.to"
          :to="link.to"
          :class="{ 'is-active': isActive(link.to) }"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="site-actions">
        <NuxtLink to="/favorites" class="icon-btn" :aria-label="savedLabel">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
          </svg>
          <ClientOnly>
            <span v-if="favorites.count > 0" class="icon-btn__badge" aria-hidden="true">{{ favorites.count }}</span>
          </ClientOnly>
        </NuxtLink>

        <NuxtLink to="/cart" class="icon-btn" :aria-label="cartLabel" data-testid="header-cart">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5.6 8h12.8l1 11.2a1.6 1.6 0 0 1-1.6 1.8H6.2a1.6 1.6 0 0 1-1.6-1.8L5.6 8Z"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
            <path d="M8.8 8V6.4a3.2 3.2 0 0 1 6.4 0V8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          <ClientOnly>
            <span v-if="cart.count > 0" class="icon-btn__badge" aria-hidden="true" data-testid="cart-count">
              {{ cart.count }}
            </span>
          </ClientOnly>
        </NuxtLink>

        <NuxtLink to="/shop" class="header-cta">Shop Now</NuxtLink>
      </div>

      <button
        ref="burger"
        type="button"
        class="burger"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Open menu"
        @click="openMenu"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <Transition name="drawer">
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        ref="drawer"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        @keydown="onDrawerKeydown"
      >
        <div class="drawer__head iz-wrap">
          <NuxtLink to="/" class="brand" :aria-label="`${SITE.name} — home`">
            <img class="brand__mark" src="/iz-mark-white.png" alt="" width="60" height="43">
            <span class="brand__tag" aria-hidden="true">Secure<br>Tomorrow</span>
          </NuxtLink>
          <button ref="closeButton" type="button" class="icon-btn" aria-label="Close menu" @click="closeMenu()">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <nav class="drawer__nav iz-wrap" aria-label="Mobile">
          <NuxtLink
            v-for="link in DRAWER_NAV"
            :key="link.to"
            :to="link.to"
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
          <NuxtLink to="/favorites">
            Saved devices<span v-if="favorites.count > 0" class="drawer__count">({{ favorites.count }})</span>
          </NuxtLink>
          <NuxtLink to="/cart">
            Cart<span v-if="cart.count > 0" class="drawer__count">({{ cart.count }})</span>
          </NuxtLink>

          <NuxtLink to="/shop" class="iz-btn iz-btn--solid mt-4 self-start">Shop Now</NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  width: 100%;
}

.site-header--overlay {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  background: transparent;
}

.site-header--solid {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--iz-border-soft);
  background: rgb(5 7 13 / 0.88);
  backdrop-filter: blur(12px);
}

.site-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: clamp(0.85rem, 1.6vw, 1.5rem);
}

/* ---------------------------------------------------------------- brand */
.brand {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: clamp(0.7rem, 1.3vw, 1.1rem);
}

.brand__mark {
  height: clamp(1.6rem, 2.6vw, 2.4rem);
  width: auto;
}

.brand__tag {
  color: #cfe0f2;
  font-size: clamp(0.55rem, 0.75vw, 0.7rem);
  line-height: 1.7;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ------------------------------------------------------------------ nav */
.site-nav {
  display: none;
  align-items: center;
  gap: clamp(1.25rem, 2.6vw, 2.75rem);
}

.site-nav a {
  color: #e7eef6;
  font-size: clamp(0.86rem, 1.1vw, 1rem);
  white-space: nowrap;
  transition: color 0.2s ease;
}

.site-nav a:hover,
.site-nav a.is-active {
  color: var(--iz-accent);
}

/* -------------------------------------------------------------- actions */
.site-actions {
  display: none;
  flex-shrink: 0;
  align-items: center;
  gap: clamp(0.35rem, 0.8vw, 0.7rem);
}

.icon-btn {
  position: relative;
  display: inline-flex;
  height: 2.75rem;
  min-width: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #e7eef6;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.icon-btn:hover {
  color: var(--iz-accent);
  background: rgb(255 255 255 / 0.06);
}

.icon-btn svg {
  width: 1.45rem;
  height: 1.45rem;
}

.icon-btn__badge {
  position: absolute;
  top: 0.35rem;
  right: 0.2rem;
  min-width: 1.05rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: var(--iz-accent-strong);
  color: #04070f;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.05rem;
  text-align: center;
}

.header-cta {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  margin-left: clamp(0.3rem, 0.8vw, 0.9rem);
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  background: #fff;
  color: #05080f;
  font-size: clamp(0.86rem, 1.05vw, 0.98rem);
  font-weight: 500;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.header-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgb(120 180 255 / 0.3);
}

/* --------------------------------------------------------------- drawer */
.burger {
  display: inline-flex;
  height: 2.75rem;
  width: 2.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #fff;
}

.burger svg {
  width: 1.6rem;
  height: 1.6rem;
}

.drawer {
  position: fixed;
  inset: 0;
  z-index: 250;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--iz-bg);
}

.drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem;
  border-bottom: 1px solid var(--iz-border-soft);
}

.drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-block: 1.5rem 3rem;
}

.drawer__nav a {
  padding-block: 0.9rem;
  border-bottom: 1px solid var(--iz-border-soft);
  color: #e7eef6;
  font-size: 1.05rem;
  text-align: left;
}

.drawer__nav a:hover,
.drawer__nav a[aria-current="page"] {
  color: var(--iz-accent);
}

.drawer__nav a.iz-btn {
  border-bottom: 0;
  color: #05080f;
}

.drawer__count {
  margin-left: 0.4rem;
  color: var(--iz-accent);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

@media (min-width: 1024px) {
  .site-nav,
  .site-actions {
    display: flex;
  }

  .burger,
  .drawer {
    display: none;
  }
}
</style>
