<script setup lang="ts">
import { HOME_FAQ } from "~/data/faq";

const faqs = HOME_FAQ.map((item) => ({ q: item.question, a: item.answer }));

const open = ref<number | null>(null);

const toggle = (index: number): void => {
  open.value = open.value === index ? null : index;
};
</script>

<template>
  <section id="faq" class="iz-section">
    <div class="iz-wrap iz-split">
      <div>
        <p class="iz-eyebrow">Frequently asked questions</p>
        <h2 class="iz-h2">Your Questions,<br >Answered</h2>
        <p class="iz-lead">Everything you might want to know before making the switch.</p>
        <NuxtLink to="/faq" class="iz-btn iz-btn--ghost mt-8">
          <span>All questions</span>
          <UiIcon name="arrow" />
        </NuxtLink>
      </div>

      <ul class="faq__list">
        <li v-for="(item, index) in faqs" :key="item.q" class="faq__item">
          <button
            type="button"
            class="faq__question"
            :aria-expanded="open === index"
            :aria-controls="`faq-answer-${index}`"
            @click="toggle(index)"
          >
            <span>{{ item.q }}</span>
            <svg :class="{ 'faq__chevron--open': open === index }" class="faq__chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 9.5 6 6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <p v-show="open === index" :id="`faq-answer-${index}`" class="faq__answer">{{ item.a }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq__list {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.faq__item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.faq__question {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: clamp(0.95rem, 1.6vw, 1.3rem) 0;
  color: #dfe8f2;
  font-size: clamp(0.88rem, 1.05vw, 1rem);
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
  transition: transform 0.25s ease, color 0.2s ease;
}

.faq__chevron--open {
  transform: rotate(180deg);
  color: #8fc0ee;
}

.faq__answer {
  max-width: 62ch;
  padding-bottom: clamp(1rem, 1.6vw, 1.35rem);
  color: #8ea0b5;
  font-size: clamp(0.82rem, 0.98vw, 0.92rem);
  font-weight: 300;
  line-height: 1.7;
}
</style>
