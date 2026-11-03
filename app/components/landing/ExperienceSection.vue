<script setup lang="ts">
const POINTS = [
  "Storage is encrypted by default, with nothing to switch on.",
  "Encrypted backups use keys that stay under your control.",
  "No vendor account is needed to set up or use the phone.",
];
</script>

<template>
  <section id="privacy" class="iz-section experience" aria-labelledby="privacy-title">
    <div class="iz-wrap experience__grid">
      <div class="experience__intro iz-reveal">
        <p class="iz-eyebrow">Privacy &amp; security</p>
        <h2 id="privacy-title" class="iz-h2">Your data,<br>on your terms</h2>
        <p class="iz-lead">
          Privacy controls are part of the system, not an app you have to remember to open.
        </p>
        <ul class="experience__points">
          <li v-for="point in POINTS" :key="point">
            <UiIcon name="check" />
            <span>{{ point }}</span>
          </li>
        </ul>
        <p class="experience__honest">
          No phone can make you anonymous or guarantee it will never be attacked. IZ OS is designed to reduce what
          is exposed and to make tampering easier to detect.
        </p>
        <NuxtLink to="/security" class="iz-btn iz-btn--ghost mt-7">
          <span>Read how it works</span>
          <UiIcon name="arrow" />
        </NuxtLink>
      </div>

      <div class="experience__visual iz-reveal">
        <img
          src="/iz-ui-phones.png"
          alt="IZ OS lock screen and privacy settings on two phones"
          width="1025"
          height="915"
          loading="lazy"
          decoding="async"
        >
      </div>

      <p class="iz-vertical experience__aside" aria-hidden="true">Simple.<br>Secure.<br>Yours.</p>
    </div>
  </section>
</template>

<style scoped>
.experience__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) auto;
  align-items: center;
  gap: clamp(1.75rem, 3.5vw, 4rem);
}

.experience__points {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.experience__points li {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  color: #d3dde8;
  font-size: 0.95rem;
  line-height: 1.55;
}

.experience__points svg {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
  color: var(--iz-accent);
}

.experience__honest {
  max-width: 44ch;
  margin-top: 1.5rem;
  padding-left: 0.9rem;
  border-left: 2px solid rgb(143 192 238 / 0.35);
  color: var(--iz-muted);
  font-size: 0.85rem;
  font-weight: 300;
  line-height: 1.65;
}

.experience__visual img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 24px 70px rgba(20, 90, 190, 0.35));
}

@media (max-width: 1280px) {
  .experience__grid {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  }

  .experience__aside {
    display: none;
  }
}

@media (max-width: 1024px) {
  .experience__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.25rem;
  }

  .experience__visual {
    max-width: 34rem;
    margin-inline: auto;
  }
}
</style>
