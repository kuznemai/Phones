<script setup lang="ts">
import { SITE } from "~/data/site";

useHead({
  titleTemplate: (title) => (title ? `${title} — ${SITE.name}` : `${SITE.name} — privacy-focused smartphones`),
  meta: [{ name: "theme-color", content: "#05070d" }],
});

useSeoMeta({
  ogSiteName: SITE.name,
  ogLocale: "en_US",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
