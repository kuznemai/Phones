/**
 * Brand copy and site-wide notices.
 *
 * Only facts already present in the project are used here. Contact channels, legal
 * documents, company details and reviews have not been provided yet, so the site
 * deliberately does not show any.
 */
export const SITE = {
  name: "IZ Secure",
  shortName: "IZ",
  tagline: "Secure Tomorrow",
  motto: "Technology for a more open future.",
  description:
    "Smartphones built around IZ OS, a privacy-focused operating system with verified boot, encrypted storage and per-app network permissions.",
} as const;

export const DEMO_NOTICE = {
  short: "Demo storefront: prices and stock are sample data, and orders cannot be placed yet.",
  catalog:
    "Prices, configurations and stock levels shown here are sample data for this preview and may change before sales open.",
} as const;

export const NAV_LINKS = [
  { label: "Catalog", to: "/shop" },
  { label: "Security & OS", to: "/security" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;
