<script setup lang="ts">
import { sendSupportMessage } from "~/services/support";
import { isFilled, isValidEmail } from "~/utils/validation";

const TOPICS = ["Choosing a device", "IZ OS and security", "Orders and delivery", "Something else"];
const MESSAGE_MAX_LENGTH = 2000;

// Kept in memory only: nothing here is stored or sent.
const form = reactive({ name: "", email: "", topic: TOPICS[0]!, message: "" });
const errors = ref<Partial<Record<"name" | "email" | "message", string>>>({});
const result = ref<string | null>(null);
const resultRef = ref<HTMLElement | null>(null);

function validate(): boolean {
  const next: typeof errors.value = {};
  if (!isFilled(form.name, 2)) next.name = "Enter your name.";
  if (!isFilled(form.email)) next.email = "Enter your email address.";
  else if (!isValidEmail(form.email)) next.email = "Enter a valid email address, for example name@example.com.";
  if (!isFilled(form.message, 10)) next.message = "Write at least 10 characters so we know how to help.";
  errors.value = next;
  return Object.keys(next).length === 0;
}

async function submit(): Promise<void> {
  result.value = null;
  if (!validate()) {
    const first = Object.keys(errors.value)[0];
    if (first) document.getElementById(`contact-${first}`)?.focus();
    return;
  }
  const response = await sendSupportMessage({ ...form });
  result.value = response.status === "unavailable" ? response.message : "Thanks, your message was sent.";
  await nextTick();
  resultRef.value?.focus();
}

watch(
  () => ({ ...form }),
  () => {
    result.value = null;
  },
);

useSeo({
  title: "Contact",
  description: "How to reach the IZ Secure team. Contact channels will be published before sales open.",
});
</script>

<template>
  <div class="iz-wrap iz-wrap--narrow iz-page">
    <UiPageHeader
      eyebrow="Contact"
      title="Get in touch"
      lead="Official contact channels have not been published yet. They will appear on this page before sales open."
    />

    <div class="contact">
      <section class="iz-card" aria-labelledby="form-heading">
        <h2 id="form-heading" class="contact__title">Message form preview</h2>
        <UiNotice class="mt-4">
          The message service is not connected yet. You can try the form, but messages are not sent or saved.
        </UiNotice>

        <form class="contact__form" novalidate @submit.prevent="submit">
          <UiFormField
            id="contact-name"
            v-model="form.name"
            label="Name"
            autocomplete="name"
            :maxlength="100"
            :error="errors.name"
            required
          />
          <UiFormField
            id="contact-email"
            v-model="form.email"
            label="Email"
            type="email"
            inputmode="email"
            autocomplete="email"
            :maxlength="120"
            :error="errors.email"
            required
          />
          <div>
            <label class="iz-label" for="contact-topic">Topic</label>
            <select id="contact-topic" v-model="form.topic" class="iz-input">
              <option v-for="topic in TOPICS" :key="topic" :value="topic">{{ topic }}</option>
            </select>
          </div>
          <UiFormField
            id="contact-message"
            v-model="form.message"
            label="Message"
            multiline
            :maxlength="MESSAGE_MAX_LENGTH"
            :error="errors.message"
            required
          />

          <button type="submit" class="iz-btn iz-btn--solid self-start">Send message (demo)</button>

          <div v-if="result" ref="resultRef" class="contact__result" role="status" tabindex="-1">
            <UiIcon name="info" />
            <p>{{ result }}</p>
          </div>
        </form>
      </section>

      <aside class="contact__aside" aria-label="Other help">
        <div class="iz-card">
          <h2 class="contact__title">Find an answer now</h2>
          <ul class="contact__links">
            <li>
              <NuxtLink to="/faq" class="iz-link">Frequently asked questions</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/security" class="iz-link">How IZ OS protects you</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/shop" class="iz-link">Compare devices in the catalog</NuxtLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18rem;
  align-items: start;
  gap: 1.5rem;
}

.contact__title {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 1.5rem;
}

.contact__result {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgb(143 192 238 / 0.4);
  border-radius: 0.9rem;
  background: rgb(143 192 238 / 0.07);
  color: #d6e6f6;
  font-size: 0.9rem;
  line-height: 1.6;
}

.contact__result svg {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: var(--iz-accent);
}

.contact__links {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.92rem;
}

@media (max-width: 860px) {
  .contact {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
