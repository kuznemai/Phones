import { defineStore } from "pinia";

const KEY_TOKEN = "auth_token";
const KEY_PHONE = "auth_phone";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    phone: null as string | null,
    hydrated: false,
  }),
  getters: {
    isAuthenticated: (s): boolean => Boolean(s.token),
  },
  actions: {
    hydrate(): void {
      if (this.hydrated) return;
      this.token = localStorage.getItem(KEY_TOKEN);
      this.phone = localStorage.getItem(KEY_PHONE);
      this.hydrated = true;
    },
    setSession(phone: string, token: string): void {
      this.phone = phone;
      this.token = token;
      localStorage.setItem(KEY_PHONE, phone);
      localStorage.setItem(KEY_TOKEN, token);
    },
    logout(): void {
      this.phone = null;
      this.token = null;
      localStorage.removeItem(KEY_PHONE);
      localStorage.removeItem(KEY_TOKEN);
    },
  },
});
