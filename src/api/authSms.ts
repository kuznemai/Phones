import axios, { isAxiosError } from "axios";

/**
 * SMS authentication — contract for a real backend.
 *
 * When `VITE_AUTH_API_URL` is set (no trailing slash), requests go to the server:
 *
 * 1) POST `{BASE}/auth/sms/send`
 *    body:  { "phone": "+15551234567" }
 *    resp: { "requestId": "<uuid>", "resendAfterSec"?: number }
 *
 * 2) POST `{BASE}/auth/sms/verify`
 *    body:  { "phone": "+15551234567", "code": "123456", "requestId": "<uuid>" }
 *    resp: { "accessToken": "<jwt>", "expiresIn"?: number }
 *
 * If `VITE_AUTH_API_URL` is empty, a local mock runs (delay + sessionStorage). Dev: see console
 * `[auth mock] SMS code for …`.
 */
const AUTH_BASE = (import.meta.env.VITE_AUTH_API_URL ?? "").replace(/\/$/, "");

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const MOCK_STORAGE_KEY = "auth_sms_pending";

export interface SendSmsResponse {
  requestId: string;
  resendAfterSec?: number;
}

export interface VerifySmsResponse {
  accessToken: string;
  expiresIn?: number;
}

function parseBackendMessage(err: unknown): string | null {
  if (!isAxiosError(err)) return null;
  const data = err.response?.data as { message?: string; error?: string } | undefined;
  return data?.message ?? data?.error ?? null;
}

export async function sendSmsCode(phone: string): Promise<SendSmsResponse> {
  if (AUTH_BASE) {
    try {
      const { data } = await axios.post<SendSmsResponse>(`${AUTH_BASE}/auth/sms/send`, { phone });
      if (!data?.requestId) throw new Error("Invalid response: missing requestId");
      return data;
    } catch (e) {
      const backend = parseBackendMessage(e);
      throw new Error(backend ?? "Could not send SMS");
    }
  }

  await delay(850);
  const requestId = crypto.randomUUID();
  const code =
    import.meta.env.MODE === "development"
      ? "123456"
      : String(100000 + Math.floor(Math.random() * 900000));

  sessionStorage.setItem(
    MOCK_STORAGE_KEY,
    JSON.stringify({ phone, code, requestId, exp: Date.now() + 5 * 60_000 })
  );
  if (import.meta.env.DEV) {
    console.info("[auth mock] SMS code for", phone, ":", code);
  }
  return { requestId, resendAfterSec: 60 };
}

export async function verifySmsCode(
  phone: string,
  code: string,
  requestId: string
): Promise<VerifySmsResponse> {
  const trimmed = code.replace(/\s/g, "");

  if (AUTH_BASE) {
    try {
      const { data } = await axios.post<VerifySmsResponse>(`${AUTH_BASE}/auth/sms/verify`, {
        phone,
        code: trimmed,
        requestId,
      });
      if (!data?.accessToken) throw new Error("Invalid response: missing accessToken");
      return data;
    } catch (e) {
      const backend = parseBackendMessage(e);
      if (isAxiosError(e) && e.response?.status === 401) {
        throw new Error(backend ?? "Invalid code");
      }
      throw new Error(backend ?? "Could not verify code");
    }
  }

  await delay(650);
  const raw = sessionStorage.getItem(MOCK_STORAGE_KEY);
  if (!raw) throw new Error("Verification session expired. Request a new code.");

  const pending = JSON.parse(raw) as {
    phone: string;
    code: string;
    requestId: string;
    exp: number;
  };

  if (pending.phone !== phone || pending.requestId !== requestId) {
    throw new Error("Session data is stale. Request a new code.");
  }
  if (Date.now() > pending.exp) {
    sessionStorage.removeItem(MOCK_STORAGE_KEY);
    throw new Error("Code expired. Request a new one.");
  }
  if (pending.code !== trimmed) {
    throw new Error("Invalid code");
  }

  sessionStorage.removeItem(MOCK_STORAGE_KEY);
  const accessToken = `mock.${btoa(phone).replace(/=+$/g, "")}.${Date.now()}`;
  return { accessToken, expiresIn: 86_400 };
}

export function isUsingMockSmsApi(): boolean {
  return !AUTH_BASE;
}
