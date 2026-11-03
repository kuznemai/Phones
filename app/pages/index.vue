<script setup lang="ts">
import { SITE } from "~/data/site";

useSeo({
  title: "",
  description: SITE.description,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.name,
        url: useRuntimeConfig().public.siteUrl,
        slogan: SITE.motto,
      }),
    },
  ],
});
</script>

<template>
  <div class="overflow-x-clip">
    <LandingHeroSection />
    <LandingPopularSection />
    <LandingWhySection />
    <LandingExperienceSection />
    <LandingHardwareSection />
    <LandingCompareSection />
    <LandingAudienceSection />
    <LandingFaqSection />
    <LandingCtaSection />
  </div>
</template>
