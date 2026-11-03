<script setup lang="ts">
import { FAQ_GROUPS } from "~/data/faq";

useSeo({
  title: "FAQ",
  description: "Answers about IZ OS, privacy, app support, security updates, devices and this preview store.",
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_GROUPS.flatMap((group) => group.items).map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }),
    },
  ],
});
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <UiPageHeader
      eyebrow="FAQ"
      title="Frequently asked questions"
      lead="Short, straight answers about IZ OS, the devices and how this preview store works."
    />

    <nav class="toc" aria-label="FAQ sections">
      <a v-for="group in FAQ_GROUPS" :key="group.title" :href="`#${group.id}`">
        {{ group.title }}
      </a>
    </nav>

    <section
      v-for="group in FAQ_GROUPS"
      :id="group.id"
      :key="group.title"
      class="group"
      :aria-labelledby="`${group.id}-title`"
    >
      <h2 :id="`${group.id}-title`" class="group__title">{{ group.title }}</h2>
      <FaqAccordion :items="group.items" />
    </section>

    <div class="iz-card more">
      <p>Did not find your answer? Read how IZ OS works or get in touch.</p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/security" class="iz-btn iz-btn--ghost">Security &amp; OS</NuxtLink>
        <NuxtLink to="/contact" class="iz-btn iz-btn--quiet">Contact</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toc {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.toc a {
  padding: 0.5rem 0.95rem;
  border: 1px solid var(--iz-border);
  border-radius: 999px;
  color: #dfe8f2;
  font-size: 0.86rem;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.toc a:hover {
  border-color: var(--iz-accent);
  color: #fff;
}

.group {
  margin-bottom: clamp(2.25rem, 4vw, 3.25rem);
  scroll-margin-top: 6rem;
}

.group__title {
  margin-bottom: 0.75rem;
  color: var(--iz-accent);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.more {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--iz-muted);
  font-size: 0.95rem;
}
</style>
