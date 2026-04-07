<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../authStore";
import { sendSmsCode, verifySmsCode, isUsingMockSmsApi } from "../api/authSms";
import { normalizePhoneRu, isPhoneLengthOk } from "../utils/phone";
import { getSafeRedirectPath } from "../utils/safeRedirect";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const step = ref<"phone" | "code">("phone");
const phoneRaw = ref("");
const code = ref("");
const requestId = ref<string | null>(null);
const sending = ref(false);
const verifying = ref(false);
const errorMsg = ref<string | null>(null);
const resendSec = ref(0);
let resendTimer: ReturnType<typeof setInterval> | null = null;

const showMockHint = computed(() => isUsingMockSmsApi() && import.meta.env.DEV);

const normalizedPhone = computed(() => normalizePhoneRu(phoneRaw.value));
const phoneOk = computed(() => isPhoneLengthOk(normalizedPhone.value));
const codeOk = computed(() => /^\d{4,8}$/.test(code.value.replace(/\s/g, "")));

const redirectTarget = computed(() => getSafeRedirectPath(route.query.redirect, "/shop"));

function startResendCountdown(sec: number): void {
  if (resendTimer) clearInterval(resendTimer);
  resendSec.value = sec;
  resendTimer = setInterval(() => {
    resendSec.value -= 1;
    if (resendSec.value <= 0 && resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
  }, 1000);
}

onUnmounted(() => {
  if (resendTimer) clearInterval(resendTimer);
});

async function submitPhone(): Promise<void> {
  errorMsg.value = null;
  if (!phoneOk.value) {
    errorMsg.value = "Enter a valid phone number (at least 10 digits).";
    return;
  }
  sending.value = true;
  try {
    const res = await sendSmsCode(normalizedPhone.value);
    requestId.value = res.requestId;
    step.value = "code";
    code.value = "";
    startResendCountdown(res.resendAfterSec ?? 60);
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : "Could not send SMS";
  } finally {
    sending.value = false;
  }
}

async function submitCode(): Promise<void> {
  errorMsg.value = null;
  if (!requestId.value) {
    errorMsg.value = "Request a code first.";
    return;
  }
  if (!codeOk.value) {
    errorMsg.value = "Enter the code from your SMS.";
    return;
  }
  verifying.value = true;
  try {
    const { accessToken } = await verifySmsCode(normalizedPhone.value, code.value, requestId.value);
    auth.setSession(normalizedPhone.value, accessToken);
    await router.replace(redirectTarget.value);
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : "Verification failed";
  } finally {
    verifying.value = false;
  }
}

async function resendCode(): Promise<void> {
  if (resendSec.value > 0 || sending.value) return;
  await submitPhone();
}

function backToPhone(): void {
  step.value = "phone";
  code.value = "";
  requestId.value = null;
  errorMsg.value = null;
  if (resendTimer) {
    clearInterval(resendTimer);
    resendTimer = null;
  }
  resendSec.value = 0;
}
</script>

<template>
  <div class="min-h-screen px-6 py-12 text-white fade-in md:px-10">
    <div class="mx-auto max-w-md">
      <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#0C38D4]">Sign in</p>
      <h1 class="mb-2 text-2xl font-light md:text-3xl">Phone number</h1>
      <p class="mb-8 text-sm text-zinc-500">
        We’ll text you a one-time code. After you sign in, you’ll return to the store or the page you
        came from.
      </p>

      <div
        v-if="showMockHint"
        class="mb-6 rounded-xl border border-amber-500/25 bg-amber-950/20 px-4 py-3 text-xs text-amber-200/90"
      >
        No auth API configured: the code is logged in the browser console (F12). In development it is
        often
        <span class="font-mono">123456</span>.
      </div>

      <div
        class="rounded-2xl border border-zinc-800/90 bg-black p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] md:p-8"
      >
        <div v-if="step === 'phone'" class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] uppercase tracking-wider text-zinc-600">Phone</label>
            <input
              v-model="phoneRaw"
              type="tel"
              autocomplete="tel"
              placeholder="+1 555 000-0000"
              class="rounded-lg border border-zinc-800 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-700 focus:border-zinc-600"
              @keyup.enter="submitPhone"
            />
            <p class="text-xs text-zinc-600">You can use +country code, a leading 0, or digits only where applicable</p>
          </div>

          <p v-if="errorMsg" class="text-sm text-red-400/90">{{ errorMsg }}</p>

          <button
            type="button"
            :disabled="sending || !phoneRaw.trim()"
            class="rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-45"
            @click="submitPhone"
          >
            {{ sending ? "Sending…" : "Send code via SMS" }}
          </button>
        </div>

        <div v-else class="flex flex-col gap-5">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-zinc-400">
              Code sent to
              <span class="text-zinc-200">{{ normalizedPhone }}</span>
            </p>
            <button type="button" class="shrink-0 text-xs text-indigo-400 hover:text-indigo-300" @click="backToPhone">
              Change
            </button>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] uppercase tracking-wider text-zinc-600">SMS code</label>
            <input
              v-model="code"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="8"
              placeholder="••••••"
              class="rounded-lg border border-zinc-800 bg-black px-4 py-3 text-center font-mono text-xl tracking-[0.35em] text-white outline-none placeholder:text-zinc-700 focus:border-zinc-600"
              @keyup.enter="submitCode"
            />
          </div>

          <p v-if="errorMsg" class="text-sm text-red-400/90">{{ errorMsg }}</p>

          <button
            type="button"
            :disabled="verifying || !codeOk"
            class="rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-45"
            @click="submitCode"
          >
            {{ verifying ? "Verifying…" : "Sign in" }}
          </button>

          <div class="flex justify-center">
            <button
              type="button"
              class="text-xs text-zinc-500 transition-colors hover:text-zinc-300 disabled:opacity-40"
              :disabled="resendSec > 0 || sending"
              @click="resendCode"
            >
              <span v-if="resendSec > 0">Resend code in {{ resendSec }}s</span>
              <span v-else>Resend code</span>
            </button>
          </div>
        </div>
      </div>

      <router-link
        to="/shop"
        class="mt-8 inline-flex text-sm text-zinc-600 transition-colors hover:text-zinc-400"
      >
        ← Continue to store without signing in
      </router-link>
    </div>
  </div>
</template>
