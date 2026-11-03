import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves a project site from a sub-path, so prerender targets need it too.
const baseURL = process.env.NUXT_APP_BASE_URL ?? "/";
const withBase = (route: string): string => `${baseURL.replace(/\/$/, "")}${route}`;
const PUBLIC_ROUTES = ["/", "/shop", "/cart", "/checkout", "/favorites", "/about", "/security", "/faq", "/contact"];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxt/eslint"],

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      /**
       * Base URL of the future backend (NUXT_PUBLIC_API_BASE). Nothing uses it yet: the
       * services in app/services read local data. See README → "Connecting the API".
       */
      apiBase: "/api",
      siteUrl: "http://localhost:3000",
    },
  },

  routeRules: {
    // The old technology page now lives at /security.
    "/offer": { redirect: { to: withBase("/security"), statusCode: 301 } },
  },

  nitro: {
    prerender: {
      // Product pages are reached by crawling the catalogue links.
      crawlLinks: true,
      routes: PUBLIC_ROUTES.map(withBase),
      failOnError: false,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      meta: [{ name: "color-scheme", content: "dark" }],
      link: [
        { rel: "icon", type: "image/png", href: `${baseURL.replace(/\/$/, "")}/iz-mark-white.png` },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
        },
      ],
    },
  },

  eslint: {
    config: { stylistic: false },
  },
});
