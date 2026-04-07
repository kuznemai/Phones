<script setup lang="ts">
import { RouterLink } from "vue-router";
import OfferFeatureIcon from "../components/OfferFeatureIcon.vue";

type IconName = "chip" | "wallet" | "shield" | "network" | "contract" | "bolt" | "privacy";

interface OfferFeature {
  title: string;
  description: string;
  icon: IconName;
}

const features: OfferFeature[] = [
  {
    title: "Crypto-Focused OS",
    description:
      "Hardened system with multi-layer encryption, verified boot, and storage you control.",
    icon: "chip",
  },
  {
    title: "Cold Wallet Integration",
    description:
      "Hardware-backed keys stay inside the secure enclave — never exposed to the rest of the stack.",
    icon: "wallet",
  },
  {
    title: "Multi-Layer Security",
    description:
      "Biometrics, air-gapped signing flows, and trusted execution where it matters.",
    icon: "shield",
  },
  {
    title: "Decentralized Communication",
    description:
      "Encrypted messaging and calls designed around identity you own, not a vendor account.",
    icon: "network",
  },
  {
    title: "Smart Contract Ready",
    description:
      "Pre-installed dApp environment to review, sign, and interact with contracts safely.",
    icon: "contract",
  },
  {
    title: "Lightning-Fast Settlements",
    description:
      "Tuned for Lightning, L2s, and instant payment rails without sacrificing custody discipline.",
    icon: "bolt",
  },
  {
    title: "Privacy by Design",
    description:
      "No tracking stack, no bloatware — granular permissions and real opt-out defaults.",
    icon: "privacy",
  },
];
</script>

<template>
  <div class="fade-in px-4 pb-12 pt-6 text-white sm:px-6 md:px-10 md:pb-16 md:pt-8">
    <!-- Hero -->
    <header class="mx-auto mb-12 max-w-3xl text-center md:mb-14">
      <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#0C38D4]">
        Our offer
      </p>
      <h1 class="mb-4 text-3xl font-light md:text-4xl">Crypto Secure Phone</h1>
      <p class="text-sm leading-relaxed text-zinc-500 md:text-base">
        One device for people who treat keys like cash: traders, builders, and anyone who refuses
        to trust a glossy OS with their future.
      </p>
    </header>

    <!-- Lead card -->
    <div
      class="mx-auto mb-10 max-w-4xl rounded-2xl border border-zinc-800/80 bg-black p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] md:p-10"
    >
      <h2 class="mb-3 text-center text-xl font-medium text-white md:text-2xl">
        Built for digital asset protection
      </h2>
      <p class="mx-auto max-w-2xl text-center text-sm leading-relaxed text-zinc-400 md:text-base">
        A smartphone centered on a custom, blockchain-aware operating environment — so custody,
        signing, and day-to-day use stay in lanes that auditors and attackers would both respect.
      </p>
    </div>

    <!-- Feature grid -->
    <div
      class="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
    >
      <article
        v-for="f in features"
        :key="f.title"
        class="group flex gap-4 rounded-2xl border border-zinc-800/80 bg-black p-5 transition-colors duration-200 hover:border-zinc-700 md:p-6"
      >
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 transition-colors group-hover:border-zinc-700"
        >
          <OfferFeatureIcon :name="f.icon" />
        </div>
        <div class="min-w-0">
          <h3 class="mb-2 text-base font-medium text-zinc-100 md:text-lg">
            {{ f.title }}
          </h3>
          <p class="text-sm leading-relaxed text-zinc-500">
            {{ f.description }}
          </p>
        </div>
      </article>
    </div>

    <!-- Closing + CTA -->
    <div
      class="mx-auto mt-12 max-w-3xl rounded-2xl border border-zinc-800/80 bg-black p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] md:mt-16 md:p-10"
    >
      <p class="mb-8 text-sm leading-relaxed text-zinc-400 md:text-base">
        Ideal for crypto traders, protocol teams, and security-minded individuals who want hardware
        that matches their threat model — without living in a CLI.
      </p>
      <div class="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
        <RouterLink
          to="/shop"
          class="inline-flex min-h-[3rem] min-w-[12rem] items-center justify-center rounded-xl border border-indigo-500/35 bg-indigo-950/50 px-8 text-sm font-medium text-indigo-200 transition-colors duration-200 hover:bg-indigo-900/50 hover:text-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
        >
          View devices
        </RouterLink>
        <RouterLink
          to="/contact"
          class="inline-flex min-h-[3rem] min-w-[12rem] items-center justify-center rounded-xl border border-zinc-700 bg-transparent px-8 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:border-zinc-600 hover:bg-zinc-950/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/40"
        >
          Contact us
        </RouterLink>
      </div>
    </div>
  </div>
</template>
