export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Shown in the short FAQ block on the home page. */
  onHome?: boolean;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "os-and-privacy",
    title: "IZ OS and privacy",
    items: [
      {
        id: "what-is-iz-os",
        question: "What is IZ OS?",
        answer:
          "IZ OS is the operating system on every IZ phone. It combines verified boot, storage that is encrypted by default and per-app network and sensor permissions, and it works without a vendor account.",
        onHome: true,
      },
      {
        id: "telemetry",
        question: "Does IZ OS collect usage data?",
        answer:
          "IZ OS is designed to run without usage telemetry. Apps and online services you decide to use have their own data practices, so it is still worth checking what each of them asks for.",
        onHome: true,
      },
      {
        id: "apps",
        question: "Can I install my usual apps?",
        answer:
          "Yes. IZ OS runs standard Android apps. Each app runs in its own sandbox and only gets the permissions you approve, including access to the network.",
        onHome: true,
      },
      {
        id: "anonymous",
        question: "Will an IZ phone make me anonymous or impossible to hack?",
        answer:
          "No device can promise that. IZ OS reduces how much data leaves your phone and makes tampering harder to hide, but your carrier still sees connection metadata, services you sign in to still know who you are, and no software is free of vulnerabilities.",
        onHome: true,
      },
      {
        id: "updates",
        question: "How long will my phone receive security updates?",
        answer:
          "Every current model lists five years of signed security updates in its specifications. Updates arrive over the air and are checked by verified boot before they run.",
      },
    ],
  },
  {
    id: "devices",
    title: "Devices",
    items: [
      {
        id: "which-model",
        question: "Which model should I choose?",
        answer:
          "All models run the same IZ OS. The IZ One Pro is the flagship, the IZ One balances battery life and price, the IZ Air is the thinnest, the IZ One Mini is the smallest, the IZ Field is built for rough conditions and the IZ Vault adds hardware wallet features.",
      },
      {
        id: "vault",
        question: "What is different about the IZ Vault?",
        answer:
          "The IZ Vault adds a wallet-focused secure element with offline transaction signing, Shamir backup for recovery phrases and a tamper-evident enclosure.",
      },
    ],
  },
  {
    id: "this-store",
    title: "This store",
    items: [
      {
        id: "can-i-order",
        question: "Can I place an order now?",
        answer:
          "Not yet. This storefront is a preview. You can browse, configure devices and fill your cart, but checkout will only open once the order service is connected. Nothing you type into the checkout form is sent or saved.",
        onHome: true,
      },
      {
        id: "prices",
        question: "Are the prices and stock levels final?",
        answer: "No. Prices, configurations and stock levels in the catalog are sample data and may change before sales open.",
      },
      {
        id: "delivery-warranty",
        question: "What are the delivery and warranty terms?",
        answer:
          "They have not been published yet. The delivery options in the checkout preview are examples that show how the total is calculated; final options, regions and warranty terms will be announced before sales open.",
      },
      {
        id: "cart-storage",
        question: "Where is my cart stored?",
        answer:
          "Only in this browser, using local storage. It is not sent to a server. Clearing your browser's site data removes the cart and your saved devices.",
      },
    ],
  },
];

export const HOME_FAQ: FaqItem[] = FAQ_GROUPS.flatMap((group) => group.items).filter((item) => item.onHome);
