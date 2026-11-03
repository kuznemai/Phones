<script setup lang="ts">
withDefaults(defineProps<{ eyebrow?: string; title: string; lead?: string; center?: boolean }>(), {
  eyebrow: "",
  lead: "",
  center: false,
});
</script>

<template>
  <header class="page-header" :class="{ 'page-header--center': center }">
    <p v-if="eyebrow" class="iz-eyebrow">{{ eyebrow }}</p>
    <h1 class="iz-h1 mt-3">{{ title }}</h1>
    <p v-if="lead" class="page-header__lead">{{ lead }}</p>
    <slot />
  </header>
</template>

<style scoped>
.page-header {
  max-width: 46rem;
  margin-bottom: clamp(1.75rem, 3vw, 2.75rem);
}

.page-header--center {
  margin-inline: auto;
  text-align: center;
}

.page-header__lead {
  margin-top: 1rem;
  color: var(--iz-muted);
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  font-weight: 300;
  line-height: 1.7;
}
</style>
