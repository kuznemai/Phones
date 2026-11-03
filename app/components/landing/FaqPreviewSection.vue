<script setup lang="ts">
import { HOME_FAQ } from "~/data/faq";
</script>

<template>
  <section id="faq" class="iz-section" aria-labelledby="faq-title">
    <div class="iz-wrap iz-split">
      <div class="iz-reveal">
        <p class="iz-eyebrow">Frequently asked questions</p>
        <h2 id="faq-title" class="iz-h2">Questions,<br>answered</h2>
        <p class="iz-lead">What to know about IZ OS, privacy and this preview store before you choose a device.</p>
        <NuxtLink to="/faq" class="iz-btn iz-btn--ghost mt-8">
          <span>All questions</span>
          <UiIcon name="arrow" />
        </NuxtLink>
      </div>

      <FaqAccordion :items="HOME_FAQ" class="iz-reveal" />
    </div>
  </section>
</template>
