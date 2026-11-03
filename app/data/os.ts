/**
 * IZ OS capabilities, taken from the product data and copy already in the project.
 * Keep wording factual: describe what a feature does, never promise that a device
 * cannot be attacked or that a user becomes anonymous.
 */

export type FeatureIcon = "boot" | "lock" | "sliders" | "eye" | "chip" | "refresh" | "key" | "apps";

export interface OsFeature {
  icon: FeatureIcon;
  title: string;
  text: string;
}

export const OS_FEATURES: OsFeature[] = [
  {
    icon: "boot",
    title: "Verified boot",
    text: "Each start-up checks the system against a signed boot chain, so modified system software is detected before it runs.",
  },
  {
    icon: "lock",
    title: "Encrypted by default",
    text: "Storage is encrypted out of the box. There is no setting to remember and no extra step during setup.",
  },
  {
    icon: "sliders",
    title: "Per-app network and sensor permissions",
    text: "Decide which apps may reach the internet or use sensors. An app without network permission stays offline.",
  },
  {
    icon: "eye",
    title: "No telemetry, no vendor account",
    text: "IZ OS is built to work without usage telemetry and without signing in to a vendor account.",
  },
  {
    icon: "chip",
    title: "Dedicated secure element",
    text: "Keys and biometric data are handled by a separate secure element rather than the main processor.",
  },
  {
    icon: "refresh",
    title: "Five years of signed updates",
    text: "Every current model lists five years of signed security updates, delivered over the air.",
  },
  {
    icon: "key",
    title: "Backups you hold the keys to",
    text: "Encrypted backups are protected with keys that stay under your control.",
  },
  {
    icon: "apps",
    title: "Your usual Android apps",
    text: "Standard Android apps run in their own sandbox and only get the permissions you approve.",
  },
];

/** Hardware features that only some models have, from the product data. */
export const DEVICE_FEATURES: { model: string; slug: string; features: string[] }[] = [
  { model: "IZ Air", slug: "iz-air", features: ["Hardware camera and microphone cut-off", "USB-C data-blocking mode"] },
  {
    model: "IZ Vault",
    slug: "iz-vault",
    features: ["Offline transaction signing", "Shamir backup for recovery phrases", "Tamper-evident enclosure"],
  },
  { model: "IZ Field", slug: "iz-field", features: ["Dual SIM with per-SIM data isolation", "User-replaceable battery"] },
];

/** Honest limits, shown next to the feature list so nobody reads it as a guarantee. */
export const OS_LIMITS: string[] = [
  "No phone or operating system can guarantee complete security. IZ OS reduces risk; it does not remove it.",
  "Apps and online services you choose to use still receive whatever data you give them, under their own policies.",
  "Your mobile carrier and the networks you join can still see connection metadata.",
  "Protection depends on installing updates promptly and using a strong screen lock.",
];
