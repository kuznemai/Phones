<script setup lang="ts">
const FEATURES = [
  { icon: "boot", title: "Verified boot", text: "Checked at every start-up." },
  { icon: "lock", title: "Encrypted storage", text: "On by default." },
  { icon: "sliders", title: "Per-app permissions", text: "Network and sensors." },
  { icon: "refresh", title: "5 years of updates", text: "Signed, over the air." },
] as const;
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__bg" aria-hidden="true" />

    <div class="hero__stage">
      <div class="hero__visual">
        <img
          src="/hero-phone.png"
          alt="IZ smartphone standing on a glowing shield-shaped podium"
          width="1000"
          height="931"
          fetchpriority="high"
          decoding="async"
        >
      </div>

      <div class="hero__copy">
        <p class="hero__eyebrow">Smartphones with IZ OS</p>
        <h1 id="hero-title" class="hero__title">Privacy built in,<br>not bolted on</h1>
        <p class="hero__sub">
          Every IZ phone runs IZ OS: verified boot, storage encrypted by default and per-app network control. No
          vendor account required.
        </p>
        <div class="hero__actions">
          <NuxtLink to="/shop" class="iz-btn iz-btn--solid">
            <span>Browse the catalog</span>
            <UiIcon name="arrow" />
          </NuxtLink>
          <NuxtLink to="/security" class="iz-btn iz-btn--ghost">
            <span>How IZ OS protects you</span>
          </NuxtLink>
        </div>
      </div>

      <p class="hero__aside" aria-hidden="true">Privacy<br>goes<br>further.</p>
    </div>

    <ul class="hero__features" aria-label="Included on every model">
      <li v-for="feature in FEATURES" :key="feature.title" class="hero__feature">
        <UiIcon :name="feature.icon" class="hero__icon" />
        <div>
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.text }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: clamp(6.5rem, 11vw, 9rem) 0 clamp(1.75rem, 3vw, 2.75rem);
  font-family: "Poppins", "Roboto", sans-serif;
  isolation: isolate;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(58% 52% at 64% 42%, rgba(30, 104, 200, 0.3) 0%, rgba(12, 42, 92, 0.14) 42%, rgba(3, 7, 16, 0) 72%),
    radial-gradient(90% 70% at 50% 110%, rgba(9, 34, 76, 0.55) 0%, rgba(3, 7, 16, 0) 70%),
    linear-gradient(155deg, #05080f 0%, #050a15 45%, #03060d 100%);
}

/* ---------- stage ---------- */
.hero__stage {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  max-width: 1520px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 4vw, 4.5rem);
}

.hero__visual {
  position: absolute;
  top: 50%;
  left: 66%;
  z-index: 0;
  width: min(45rem, 53vw);
  transform: translate(-50%, -54%);
  pointer-events: none;
}

.hero__visual img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 90px rgba(28, 120, 235, 0.35));
  animation: hero-float 9s ease-in-out infinite;
}

@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

.hero__copy {
  position: relative;
  z-index: 2;
  max-width: 38rem;
}

.hero__eyebrow {
  margin-bottom: clamp(1.1rem, 2vw, 1.9rem);
  color: #8fc0ee;
  font-size: clamp(0.78rem, 1.28vw, 1.05rem);
  font-weight: 400;
  line-height: 1.9;
  letter-spacing: 0.34em;
  text-transform: uppercase;
}

.hero__title {
  color: #fff;
  font-size: clamp(2.3rem, 4.4vw, 4.1rem);
  font-weight: 700;
  line-height: 1.07;
  letter-spacing: -0.015em;
}

.hero__sub {
  max-width: 32rem;
  margin-top: clamp(1.1rem, 2vw, 1.75rem);
  margin-bottom: clamp(1.5rem, 2.5vw, 2.25rem);
  color: #cbd7e4;
  font-size: clamp(1rem, 1.3vw, 1.18rem);
  font-weight: 300;
  line-height: 1.55;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
}

.hero__aside {
  position: absolute;
  top: 50%;
  right: clamp(1.25rem, 4vw, 4.5rem);
  z-index: 2;
  transform: translateY(-50%);
  color: #8fc0ee;
  font-size: clamp(0.78rem, 1.28vw, 1.05rem);
  font-weight: 400;
  line-height: 2.4;
  letter-spacing: 0.34em;
  text-align: right;
  text-transform: uppercase;
}

/* ---------- feature strip ---------- */
.hero__features {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 100%;
  max-width: 1520px;
  margin: clamp(2rem, 4vw, 3.5rem) auto 0;
  padding: 0 clamp(1.25rem, 4vw, 4.5rem);
}

.hero__feature {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.2vw, 1.2rem);
  padding: 0 clamp(0.85rem, 2vw, 2rem);
}

.hero__feature:first-child {
  padding-left: 0;
}

.hero__feature + .hero__feature {
  border-left: 1px solid rgba(255, 255, 255, 0.14);
}

.hero__icon {
  width: clamp(1.9rem, 2.6vw, 2.4rem);
  height: clamp(1.9rem, 2.6vw, 2.4rem);
  flex-shrink: 0;
  color: #fff;
}

.hero__feature h2 {
  color: #fff;
  font-size: clamp(0.88rem, 1.2vw, 1.1rem);
  font-weight: 600;
  line-height: 1.3;
}

.hero__feature p {
  margin-top: 0.3rem;
  color: #93a6bb;
  font-size: clamp(0.76rem, 0.98vw, 0.9rem);
  font-weight: 300;
  line-height: 1.4;
}

/* ---------- responsive ---------- */
@media (max-width: 1280px) {
  .hero__visual {
    left: 70%;
    width: min(40rem, 56vw);
  }

  .hero__aside {
    display: none;
  }
}

@media (max-width: 1024px) {
  .hero {
    min-height: 0;
    padding-top: clamp(5.5rem, 14vw, 7.5rem);
  }

  .hero__stage {
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    text-align: center;
  }

  .hero__visual {
    position: relative;
    top: auto;
    left: auto;
    order: 2;
    width: min(32rem, 88vw);
    transform: none;
  }

  .hero__copy {
    order: 1;
    max-width: 38rem;
  }

  .hero__actions {
    justify-content: center;
  }

  .hero__sub {
    margin-inline: auto;
  }

  .hero__features {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.75rem 0;
  }

  .hero__feature {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0 0.75rem;
    text-align: center;
  }

  .hero__feature:first-child {
    padding-left: 0.75rem;
  }

  .hero__feature + .hero__feature {
    border-left: 0;
  }

  .hero__feature:nth-child(2n) {
    border-left: 1px solid rgba(255, 255, 255, 0.14);
  }
}

@media (max-width: 680px) {
  .hero__features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .hero__feature {
    flex-direction: row;
    padding: 0;
    text-align: left;
  }

  .hero__feature:first-child {
    padding-left: 0;
  }

  .hero__feature:nth-child(2n) {
    border-left: 0;
  }

  .hero__feature + .hero__feature {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 1.5rem;
  }

  .hero__actions .iz-btn {
    flex: 1 1 100%;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__visual img {
    animation: none;
  }
}
</style>
