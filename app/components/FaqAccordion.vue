<script setup lang="ts">
import type { FaqItem } from "~/data/faq";

const props = defineProps<{ items: FaqItem[] }>();

const open = ref<Set<string>>(new Set());

function toggle(id: string): void {
  const next = new Set(open.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  open.value = next;
}

// A deep link such as /faq#delivery-warranty opens that answer.
onMounted(() => {
  const hash = window.location.hash.slice(1);
  if (props.items.some((item) => item.id === hash)) toggle(hash);
});
</script>

<template>
  <ul class="faq">
    <li v-for="item in items" :id="item.id" :key="item.id" class="faq__item">
      <h3>
        <button
          :id="`faq-q-${item.id}`"
          type="button"
          class="faq__question"
          :aria-expanded="open.has(item.id)"
          :aria-controls="`faq-a-${item.id}`"
          @click="toggle(item.id)"
        >
          <span>{{ item.question }}</span>
          <svg class="faq__chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m6 9.5 6 6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </h3>
      <div
        v-show="open.has(item.id)"
        :id="`faq-a-${item.id}`"
        class="faq__answer"
        role="region"
        :aria-labelledby="`faq-q-${item.id}`"
      >
        <p>{{ item.answer }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.faq {
  border-top: 1px solid rgb(255 255 255 / 0.08);
}

.faq__item {
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
  scroll-margin-top: 6rem;
}

.faq__question {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: clamp(1rem, 1.6vw, 1.3rem) 0;
  color: #dfe8f2;
  font-size: clamp(0.92rem, 1.05vw, 1.02rem);
  font-weight: 400;
  text-align: left;
  transition: color 0.2s ease;
}

.faq__question:hover {
  color: #fff;
}

.faq__chevron {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
  color: #7e93a9;
  transition:
    transform 0.25s ease,
    color 0.2s ease;
}

.faq__question[aria-expanded="true"] .faq__chevron {
  transform: rotate(180deg);
  color: var(--iz-accent);
}

.faq__answer p {
  max-width: 64ch;
  padding-bottom: clamp(1rem, 1.6vw, 1.35rem);
  color: var(--iz-muted);
  font-size: clamp(0.88rem, 1vw, 0.95rem);
  font-weight: 300;
  line-height: 1.75;
}
</style>
