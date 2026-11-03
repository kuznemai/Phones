<script setup lang="ts">
const props = defineProps<{ images: string[]; title: string }>();

const activeIndex = ref(0);
const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0] ?? "");
const thumbs = ref<HTMLButtonElement[]>([]);

// A different product may have fewer images than the one before it.
watch(
  () => props.images,
  () => {
    activeIndex.value = 0;
  },
);

function show(index: number, focus = false): void {
  const count = props.images.length;
  activeIndex.value = (index + count) % count;
  if (focus) thumbs.value[activeIndex.value]?.focus();
}

/** Arrow keys move between thumbnails, like a tab list. */
function onKeydown(event: KeyboardEvent): void {
  const moves: Record<string, number> = {
    ArrowRight: activeIndex.value + 1,
    ArrowLeft: activeIndex.value - 1,
    Home: 0,
    End: props.images.length - 1,
  };
  const target = moves[event.key];
  if (target === undefined) return;
  event.preventDefault();
  show(target, true);
}
</script>

<template>
  <div class="gallery">
    <div class="gallery__stage">
      <Transition name="swap" mode="out-in">
        <UiSafeImage
          :key="activeImage"
          :src="activeImage"
          :alt="`${title}, image ${activeIndex + 1} of ${images.length}`"
          :width="640"
          :height="640"
          loading="eager"
          fetchpriority="high"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </Transition>

      <template v-if="images.length > 1">
        <button type="button" class="gallery__nav gallery__nav--prev" aria-label="Previous image" @click="show(activeIndex - 1)">
          <UiIcon name="arrow-left" />
        </button>
        <button type="button" class="gallery__nav gallery__nav--next" aria-label="Next image" @click="show(activeIndex + 1)">
          <UiIcon name="arrow" />
        </button>
      </template>
    </div>

    <div v-if="images.length > 1" class="gallery__thumbs" role="tablist" :aria-label="`${title} images`" @keydown="onKeydown">
      <button
        v-for="(image, index) in images"
        :key="image"
        ref="thumbs"
        type="button"
        role="tab"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': index === activeIndex }"
        :aria-selected="index === activeIndex"
        :tabindex="index === activeIndex ? 0 : -1"
        :aria-label="`Show image ${index + 1} of ${images.length}`"
        @click="show(index)"
      >
        <UiSafeImage :src="image" alt="" :width="80" :height="80" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.gallery__stage {
  position: relative;
  display: flex;
  aspect-ratio: 1 / 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--iz-border-soft);
  border-radius: 1.25rem;
  background: radial-gradient(70% 60% at 50% 45%, rgb(30 104 200 / 0.2), rgb(0 0 0 / 0) 70%), #000;
}

.gallery__stage :deep(img) {
  max-height: 88%;
  max-width: 88%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.gallery__nav {
  position: absolute;
  top: 50%;
  display: inline-flex;
  height: 2.75rem;
  width: 2.75rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 0.15);
  border-radius: 999px;
  background: rgb(5 8 15 / 0.7);
  color: #fff;
  transform: translateY(-50%);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.gallery__nav:hover {
  border-color: var(--iz-accent);
  background: rgb(5 8 15 / 0.95);
}

.gallery__nav svg {
  width: 1.15rem;
  height: 1.15rem;
}

.gallery__nav--prev {
  left: 0.75rem;
}

.gallery__nav--next {
  right: 0.75rem;
}

.gallery__thumbs {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  padding: 0.25rem;
}

.gallery__thumb {
  display: flex;
  height: 4.75rem;
  width: 4.75rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--iz-border-soft);
  border-radius: 0.85rem;
  background: #000;
  transition: border-color 0.2s ease;
}

.gallery__thumb:hover {
  border-color: rgb(255 255 255 / 0.3);
}

.gallery__thumb--active {
  border-color: var(--iz-accent);
}

.gallery__thumb :deep(img) {
  max-height: 82%;
  max-width: 82%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.2s ease;
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}
</style>
