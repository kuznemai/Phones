<script setup lang="ts">
const currentYear = new Date().getFullYear();

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Our Offer", to: "/offer" },
  { label: "Contact Us", to: "/contact" },
  { label: "Favorites", to: "/favorites" },
];

const socialLinks = [
  {
    label: "Telegram",
    href: "https://t.me/",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.593l-2.963-.924c-.644-.204-.657-.644.135-.953l11.57-4.461c.537-.194 1.006.131.832.966z"/></svg>`,
  },
  {
    label: "Twitter / X",
    href: "https://x.com/",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.264 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>`,
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
  },
];
</script>

<template>
  <footer
    class="footer mt-10 w-full border-t border-slate-700 bg-black px-4 py-8 sm:mt-12 sm:px-6 md:mt-16 md:px-8 md:py-10 lg:px-10 xl:px-12 2xl:px-16"
  >
    <div class="footer__inner mx-auto flex w-full min-w-0 max-w-[1920px] flex-col gap-10">

      <!-- Top row: logo + nav + social -->
      <div class="flex w-full min-w-0 flex-col items-start justify-between gap-8 md:flex-row md:items-center">

        <!-- Logo + tagline -->
        <div class="flex flex-col gap-3">
          <router-link to="/" class="flex items-center gap-3">
            <img src="/logo.svg" alt="IZ Operating System" class="h-11" />
          </router-link>
          <p class="text-gray-500 text-sm max-w-[220px] leading-relaxed">
            Fortress in Your Pocket — Unbreakable Security for Your Peace of Mind.
          </p>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col gap-2">
          <span class="text-gray-400 text-xs uppercase tracking-widest mb-1">Navigation</span>
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-gray-500 hover:text-white text-sm transition-colors duration-200"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <!-- Contact info -->
        <div class="flex flex-col gap-2">
          <span class="text-gray-400 text-xs uppercase tracking-widest mb-1">Contact</span>
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0z"/>
            </svg>
            <span>UAE, Dubai</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6z"/>
            </svg>
            <span>+1 234 567 890</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
            </svg>
            <span>contact@example.com</span>
          </div>
        </div>

        <!-- Social links -->
        <div class="flex flex-col gap-2">
          <span class="text-gray-400 text-xs uppercase tracking-widest mb-1">Follow Us</span>
          <div class="flex gap-4">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
              class="text-gray-500 hover:text-[#0C38D4] transition-colors duration-200"
              v-html="social.icon"
            />
          </div>
        </div>
      </div>

      <!-- Divider: full-bleed to match footer top border width (cancel horizontal padding) -->
      <div
        class="-mx-4 shrink-0 border-t border-slate-700 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 2xl:-mx-16"
        aria-hidden="true"
      ></div>

      <!-- Bottom row: copyright -->
      <div class="flex w-full min-w-0 flex-col items-center justify-between gap-2 text-xs text-gray-600 sm:flex-row">
        <span>&copy; {{ currentYear }} IZ Crypto Phone. All rights reserved.</span>
        <span class="text-[#0C38D4] font-medium tracking-wide">Secure · Private · Yours</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  font-family: "Roboto Thin", sans-serif;
}
</style>
