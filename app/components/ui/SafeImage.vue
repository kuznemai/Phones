<script setup lang="ts">
/**
 * `<img>` that degrades to a neutral placeholder when the file is missing or fails
 * to load, so a broken product image never leaves an empty box or a browser icon.
 */
const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    width: number;
    height: number;
    loading?: "lazy" | "eager";
    fetchpriority?: "high" | "low" | "auto";
    sizes?: string;
  }>(),
  { loading: "lazy", fetchpriority: "auto", sizes: undefined },
);

const failed = ref(false);
const resolved = computed(() => (props.src ? assetUrl(props.src) : ""));

watch(
  () => props.src,
  () => {
    failed.value = false;
  },
);

/** SSR-rendered images can fail before hydration attaches `@error`; check once mounted. */
const img = ref<HTMLImageElement | null>(null);
onMounted(() => {
  if (img.value && img.value.complete && img.value.naturalWidth === 0) failed.value = true;
});
</script>

<template>
  <img
    v-if="resolved && !failed"
    ref="img"
    :src="resolved"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :sizes="sizes"
    decoding="async"
    @error="failed = true"
  >
  <span v-else class="placeholder" role="img" :aria-label="alt ? `${alt} (image unavailable)` : 'Image unavailable'">
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="14" y="5" width="20" height="38" rx="4" stroke="currentColor" stroke-width="2" />
      <path d="M21 9h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <span>Image unavailable</span>
  </span>
</template>

<style scoped>
.placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 4rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #4b5b6d;
  font-size: 0.75rem;
}

.placeholder svg {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
