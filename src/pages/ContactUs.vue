<script setup lang="ts">
import { ref } from "vue";

const SUPPORT_EMAIL = "contact@example.com";

const name = ref("");
const email = ref("");
const message = ref("");
const sentHint = ref(false);

const socialLinks = [
  {
    name: "Telegram",
    href: "https://t.me/your_channel",
    hint: "Placeholder",
    Icon: "telegram",
  },
  {
    name: "X",
    href: "https://x.com/your_handle",
    hint: "Placeholder",
    Icon: "x",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/your_profile",
    hint: "Placeholder",
    Icon: "instagram",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/your-company",
    hint: "Placeholder",
    Icon: "linkedin",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@your_channel",
    hint: "Placeholder",
    Icon: "youtube",
  },
];

const submitForm = (): void => {
  const subject = encodeURIComponent(`IZ — message from ${name.value || "website"}`);
  const body = encodeURIComponent(
    `Name: ${name.value}\nEmail: ${email.value}\n\n---\n\n${message.value}`
  );
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  sentHint.value = true;
  setTimeout(() => {
    sentHint.value = false;
  }, 6000);
};
</script>

<template>
  <div class="fade-in px-6 pb-16 pt-8 text-white md:px-10">
    <!-- Hero -->
    <header class="mb-12 max-w-2xl">
      <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#0C38D4]">
        Get in touch
      </p>
      <h1 class="mb-3 text-3xl font-light md:text-4xl">Contact us</h1>
      <p class="text-sm leading-relaxed text-zinc-500 md:text-base">
        Questions about devices, orders, or partnerships — send us a message. We’ll open your
        mail app with everything filled in; you only need to tap send.
      </p>
    </header>

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <!-- Form -->
      <div
        class="lg:col-span-5 flex flex-col rounded-2xl border border-zinc-800/80 bg-black p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] md:p-8"
      >
        <h2 class="mb-1 text-lg font-medium text-white">Send a message</h2>
        <p class="mb-6 text-xs text-zinc-600">
          Delivered via your email app to
          <a :href="`mailto:${SUPPORT_EMAIL}`" class="text-indigo-400 underline-offset-2 hover:underline">{{ SUPPORT_EMAIL }}</a>
        </p>

        <form class="flex flex-col gap-5" @submit.prevent="submitForm">
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] uppercase tracking-widest text-zinc-600">Name</label>
            <input
              v-model="name"
              type="text"
              name="name"
              autocomplete="name"
              required
              placeholder="Jane Doe"
              class="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-600"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] uppercase tracking-widest text-zinc-600">Email</label>
            <input
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              required
              placeholder="you@example.com"
              class="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-600"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] uppercase tracking-widest text-zinc-600">Message</label>
            <textarea
              v-model="message"
              name="message"
              required
              rows="5"
              placeholder="How can we help?"
              class="min-h-[140px] resize-y rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-zinc-600"
            ></textarea>
          </div>

          <button
            type="submit"
            class="mt-2 w-full cursor-pointer rounded-xl border border-indigo-500/35 bg-indigo-950/50 px-6 py-3.5 text-sm font-medium tracking-wide text-indigo-200 transition-colors duration-200 hover:bg-indigo-900/50 hover:text-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
          >
            Open email and send
          </button>
        </form>

        <Transition name="fade">
          <p v-if="sentHint" class="mt-4 text-center text-xs text-emerald-500/90">
            If your mail app didn’t open, use the address above manually.
          </p>
        </Transition>
      </div>

      <!-- Aside: contact + map + social -->
      <div class="flex flex-col gap-8 lg:col-span-7">
        <div
          class="rounded-2xl border border-zinc-800/80 bg-black p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"
        >
          <h2 class="mb-6 text-lg font-medium text-white">Direct contact</h2>
          <ul class="flex flex-col gap-5">
            <li class="flex gap-4">
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-400"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z"/>
                </svg>
              </span>
              <div>
                <p class="text-[10px] uppercase tracking-widest text-zinc-600">Office</p>
                <p class="mt-0.5 text-sm text-zinc-300">UAE, Dubai</p>
              </div>
            </li>
            <li class="flex gap-4">
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-400"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z"/>
                </svg>
              </span>
              <div>
                <p class="text-[10px] uppercase tracking-widest text-zinc-600">Phone</p>
                <a href="tel:+1234567890" class="mt-0.5 text-sm text-indigo-300 hover:text-indigo-200">+1 234 567 890</a>
              </div>
            </li>
            <li class="flex gap-4">
              <span
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-400"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                </svg>
              </span>
              <div>
                <p class="text-[10px] uppercase tracking-widest text-zinc-600">Email</p>
                <a :href="`mailto:${SUPPORT_EMAIL}`" class="mt-0.5 text-sm text-indigo-300 hover:text-indigo-200">{{ SUPPORT_EMAIL }}</a>
              </div>
            </li>
          </ul>
        </div>

        <div
          class="overflow-hidden rounded-2xl border border-zinc-800/80 bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"
        >
          <div class="border-b border-zinc-800/80 px-6 py-4 md:px-8">
            <h3 class="text-sm font-medium text-white">Find us</h3>
            <p class="mt-0.5 text-xs text-zinc-600">Dubai — map preview</p>
          </div>
          <iframe
            title="Office location map"
            class="h-52 w-full border-0 md:h-60"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.5780474324335!2d55.27687641538429!3d25.19720183789914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f4288976b8d51%3A0x7439e08a2a0e2a3d!2sDubai%2C%20UAE!5e0!3m2!1sen!2s!4v1610000000000!5m2!1sen!2s"
          />
        </div>

        <div
          class="rounded-2xl border border-zinc-800/80 bg-black p-6 md:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"
        >
          <h3 class="mb-1 text-sm font-medium text-white">Social</h3>
          <p class="mb-5 text-xs text-zinc-600">
            Placeholder links — replace URLs when your profiles are ready.
          </p>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="s in socialLinks"
              :key="s.name"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-xs text-zinc-400 transition-colors duration-200 hover:border-zinc-700 hover:text-zinc-200"
            >
              <!-- Icons inline -->
              <span v-if="s.Icon === 'telegram'" class="text-zinc-500 group-hover:text-sky-400">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.593l-2.963-.924c-.644-.204-.657-.644.135-.953l11.57-4.461c.537-.194 1.006.131.832.966z"/></svg>
              </span>
              <span v-else-if="s.Icon === 'x'" class="text-zinc-500 group-hover:text-white">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.264 5.636L18.244 2.25z"/></svg>
              </span>
              <span v-else-if="s.Icon === 'instagram'" class="text-zinc-500 group-hover:text-pink-400">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </span>
              <span v-else-if="s.Icon === 'linkedin'" class="text-zinc-500 group-hover:text-sky-500">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v2.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </span>
              <span v-else class="text-zinc-500 group-hover:text-red-500">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.013 3.013 0 0 0 2.122 2.136c1.871.506 9.376.506 9.376.506s7.505 0 9.377-.506a3.013 3.013 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </span>
              <span class="font-medium">{{ s.name }}</span>
              <span class="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-600">{{ s.hint }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
